# Messaging-System Umsetzungsplan

**Projekt:** Flinkly - DACH Marktplatz für Mikrodienstleistungen  
**Feature:** Real-time Messaging-System  
**Zeitrahmen:** 60h (~1.5 Wochen)  
**Priorität:** 🔴 Critical (Pre-Launch Blocker)

---

## Executive Summary

Das Messaging-System ist ein **kritisches Feature** für Flinkly, da Käufer und Verkäufer vor, während und nach einer Bestellung kommunizieren müssen. Ohne funktionierendes Messaging-System ist die Plattform nicht launchfähig.

**Kernfunktionen:**
- Real-time Chat zwischen Käufern und Verkäufern
- Order-bezogene Konversationen (automatisch erstellt bei Bestellung)
- File-Sharing (Bilder, Dokumente, bis 10MB)
- Push-Notifications (In-App + Browser)
- Read-Receipts (Gelesen-Status)
- Typing-Indicators (zeigt an, wenn jemand tippt)

**Technologie-Stack:**
- **Backend:** Socket.io (WebSocket) + tRPC (REST-Fallback)
- **Frontend:** React + Socket.io-Client + Zustand (State Management)
- **Database:** MySQL (Messages, Conversations, Participants)
- **File-Storage:** S3 (über bestehende `storagePut`-Helper)
- **Notifications:** Manus Built-in Notification API

---

## Architektur-Übersicht

### 1. Datenbank-Schema

```sql
-- Conversations (1:1 zwischen Buyer und Seller pro Order)
CREATE TABLE conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL UNIQUE,
  buyerId INT NOT NULL,
  sellerId INT NOT NULL,
  lastMessageAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (buyerId) REFERENCES users(id),
  FOREIGN KEY (sellerId) REFERENCES users(id),
  INDEX idx_buyer (buyerId),
  INDEX idx_seller (sellerId),
  INDEX idx_order (orderId)
);

-- Messages
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversationId INT NOT NULL,
  senderId INT NOT NULL,
  content TEXT NOT NULL,
  type ENUM('text', 'file', 'system') DEFAULT 'text',
  fileUrl VARCHAR(512),
  fileName VARCHAR(255),
  fileSize INT,
  fileMimeType VARCHAR(100),
  readAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversationId) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (senderId) REFERENCES users(id),
  INDEX idx_conversation (conversationId),
  INDEX idx_sender (senderId),
  INDEX idx_created (createdAt)
);

-- Typing Indicators (In-Memory, nicht persistent)
-- Wird über Socket.io-Events gehandhabt, keine DB-Tabelle nötig
```

### 2. Backend-Architektur

**tRPC Procedures:**
```typescript
messages.getConversations.useQuery()          // Liste aller Konversationen
messages.getMessages.useQuery({ conversationId })  // Nachrichten einer Konversation
messages.sendMessage.useMutation()            // Nachricht senden (REST-Fallback)
messages.markAsRead.useMutation()             // Nachricht als gelesen markieren
messages.uploadFile.useMutation()             // File-Upload (S3)
```

**Socket.io Events:**
```typescript
// Client → Server
socket.emit('join-conversation', { conversationId })
socket.emit('leave-conversation', { conversationId })
socket.emit('send-message', { conversationId, content, type })
socket.emit('typing-start', { conversationId })
socket.emit('typing-stop', { conversationId })
socket.emit('mark-as-read', { messageId })

// Server → Client
socket.on('new-message', (message))           // Neue Nachricht empfangen
socket.on('message-read', { messageId, readAt })  // Nachricht wurde gelesen
socket.on('user-typing', { userId, conversationId })  // Jemand tippt
socket.on('user-stopped-typing', { userId, conversationId })
```

### 3. Frontend-Architektur

**Komponenten:**
```
client/src/pages/Messages.tsx               // Haupt-Seite (Liste + Chat)
client/src/components/ConversationList.tsx  // Liste aller Konversationen
client/src/components/ChatWindow.tsx        // Chat-Interface
client/src/components/MessageBubble.tsx     // Einzelne Nachricht
client/src/components/MessageInput.tsx      // Eingabefeld + File-Upload
client/src/components/TypingIndicator.tsx   // "XY tippt..."
client/src/hooks/useSocket.ts               // Socket.io-Hook
client/src/hooks/useMessages.ts             // Message-State-Management
```

**State Management (Zustand):**
```typescript
interface MessagesStore {
  conversations: Conversation[];
  activeConversationId: number | null;
  messages: Record<number, Message[]>;  // conversationId → messages
  typingUsers: Record<number, number[]>;  // conversationId → userIds
  unreadCount: number;
}
```

---

## Implementierungs-Phasen

### Phase 1: Datenbank-Schema (4h)

**Aufgaben:**
1. ✅ Schema in `drizzle/schema.ts` hinzufügen
2. ✅ `pnpm db:push` ausführen
3. ✅ DB-Helper in `server/db.ts` erstellen:
   - `createConversation(orderId, buyerId, sellerId)`
   - `getConversationsByUserId(userId)`
   - `getConversationByOrderId(orderId)`
   - `createMessage(conversationId, senderId, content, type, fileUrl?)`
   - `getMessagesByConversationId(conversationId, limit, offset)`
   - `markMessageAsRead(messageId, userId)`
   - `getUnreadMessageCount(userId)`

**Kritische Entscheidungen:**
- **1:1-Konversationen pro Order:** Jede Bestellung hat genau eine Konversation (Buyer ↔ Seller)
- **Automatische Erstellung:** Konversation wird automatisch bei Order-Erstellung angelegt
- **Soft-Delete:** Messages werden nicht gelöscht, nur Conversations (CASCADE)

---

### Phase 2: Backend-API (tRPC) (8h)

**Aufgaben:**
1. ✅ `server/routers/messages.ts` erstellen
2. ✅ tRPC-Procedures implementieren:
   ```typescript
   messages.getConversations.useQuery()
   messages.getMessages.useQuery({ conversationId, limit?, offset? })
   messages.sendMessage.useMutation({ conversationId, content, type, fileUrl? })
   messages.markAsRead.useMutation({ messageId })
   messages.uploadFile.useMutation({ file, conversationId })
   messages.getUnreadCount.useQuery()
   ```
3. ✅ Zod-Validation für alle Inputs
4. ✅ Authorization-Checks (User muss Participant der Conversation sein)

**Kritische Entscheidungen:**
- **Pagination:** Messages werden in Batches von 50 geladen (Infinite Scroll)
- **File-Upload:** Max 10MB, erlaubte Typen: images/*, application/pdf, .docx, .zip
- **Rate-Limiting:** Max 10 Messages/Minute pro User (Spam-Schutz)

---

### Phase 3: Socket.io-Integration (12h)

**Aufgaben:**
1. ✅ Socket.io-Server in `server/_core/socket.ts` einrichten
2. ✅ Event-Handler implementieren:
   - `join-conversation` → User zu Room hinzufügen
   - `leave-conversation` → User aus Room entfernen
   - `send-message` → Nachricht speichern + an Room broadcasten
   - `typing-start` / `typing-stop` → An Room broadcasten
   - `mark-as-read` → Read-Receipt an Sender senden
3. ✅ Authentication-Middleware (JWT-Token aus Cookie)
4. ✅ Room-Management (conversationId als Room-Name)
5. ✅ Disconnect-Handling (User aus allen Rooms entfernen)

**Kritische Entscheidungen:**
- **Rooms:** Jede Conversation ist ein Socket.io-Room (conversationId)
- **Authentication:** JWT-Token wird aus Cookie extrahiert (same as HTTP)
- **Fallback:** Wenn Socket.io nicht verfügbar, funktioniert Chat über tRPC (Polling)

---

### Phase 4: Frontend-UI (16h)

**Aufgaben:**
1. ✅ `Messages.tsx` erstellen (Haupt-Seite mit 2-Column-Layout)
2. ✅ `ConversationList.tsx` erstellen:
   - Liste aller Konversationen
   - Unread-Badge
   - Letzte Nachricht + Timestamp
   - Avatar + Name des Chat-Partners
3. ✅ `ChatWindow.tsx` erstellen:
   - Header (Chat-Partner-Info, Order-Link)
   - Message-List (Infinite Scroll)
   - Message-Input
   - Typing-Indicator
4. ✅ `MessageBubble.tsx` erstellen:
   - Text-Messages
   - File-Messages (Preview + Download)
   - System-Messages (z.B. "Order wurde abgeschlossen")
   - Read-Receipt (Häkchen)
   - Timestamp
5. ✅ `MessageInput.tsx` erstellen:
   - Textarea mit Auto-Resize
   - File-Upload-Button
   - Send-Button
   - Emoji-Picker (optional)

**Design-Specs:**
- **Layout:** 2-Column (Conversation-List links, Chat rechts)
- **Mobile:** Stack (Liste → Chat bei Auswahl)
- **Colors:** Sender-Messages blau, Empfänger-Messages grau
- **Animations:** Framer Motion für neue Messages (Slide-in)

---

### Phase 5: Real-time Features (8h)

**Aufgaben:**
1. ✅ `useSocket.ts` Hook erstellen:
   - Socket.io-Connection-Management
   - Auto-Reconnect
   - Event-Listener
2. ✅ `useMessages.ts` Hook erstellen:
   - Zustand-Store für Messages
   - Optimistic Updates (Message sofort anzeigen, dann Server-Sync)
   - Infinite Scroll (Load More)
3. ✅ Typing-Indicator implementieren:
   - Debounce (1s nach letztem Tastendruck)
   - Anzeige "XY tippt..." im Chat-Header
4. ✅ Read-Receipts implementieren:
   - Automatisch markieren, wenn Message im Viewport
   - Häkchen-Icon in MessageBubble
   - Grau (gesendet) → Blau (gelesen)

**Kritische Entscheidungen:**
- **Optimistic Updates:** Messages werden sofort angezeigt, auch wenn Server noch nicht geantwortet hat
- **Auto-Read:** Messages werden automatisch als gelesen markiert, wenn sie 2s im Viewport sind
- **Typing-Timeout:** Typing-Indicator verschwindet nach 3s Inaktivität

---

### Phase 6: File-Sharing (6h)

**Aufgaben:**
1. ✅ File-Upload-UI in `MessageInput.tsx`:
   - Drag & Drop
   - File-Preview (Thumbnail für Bilder)
   - Progress-Bar
   - Cancel-Button
2. ✅ S3-Upload-Logic:
   - `storagePut()` verwenden
   - File-Key: `messages/${conversationId}/${randomId}-${filename}`
   - Max 10MB Validation
   - MIME-Type Validation
3. ✅ File-Message-Rendering:
   - Bilder: Inline-Preview (Lightbox bei Klick)
   - PDFs: Icon + Download-Button
   - Andere: Icon + Filename + Size + Download

**Kritische Entscheidungen:**
- **Max File-Size:** 10MB (Frontend + Backend Validation)
- **Allowed Types:** images/*, application/pdf, .docx, .xlsx, .zip
- **Storage:** S3 (public-read, da nur zwischen verifizierten Usern)

---

### Phase 7: Notifications (6h)

**Aufgaben:**
1. ✅ In-App-Notifications:
   - Badge im Header (Unread-Count)
   - Toast-Notification bei neuer Message (wenn Chat nicht offen)
   - Sound-Effekt (optional, mit User-Consent)
2. ✅ Push-Notifications (Browser):
   - Permission-Request bei erstem Chat
   - Notification-API verwenden
   - Nur wenn User nicht auf Messages-Seite ist
3. ✅ Manus Built-in Notification API:
   - `notifyOwner()` bei neuer Message (für Admin)
   - Optional: E-Mail-Notification (wenn User 24h nicht geantwortet hat)

**Kritische Entscheidungen:**
- **Notification-Trigger:** Nur wenn User nicht auf Messages-Seite ist
- **Sound:** Opt-in (User muss explizit aktivieren)
- **E-Mail:** Nur bei längerer Inaktivität (24h), nicht bei jeder Message

---

## Testing-Strategie

### Unit-Tests
- DB-Helper (createMessage, markAsRead, etc.)
- tRPC-Procedures (Authorization, Validation)
- Socket.io-Events (join, leave, send-message)

### Integration-Tests
- End-to-End-Flow: Send Message → Receive via Socket.io → Mark as Read
- File-Upload: Upload → S3 → Display in Chat
- Typing-Indicator: Start Typing → Broadcast → Stop Typing

### Manual-Tests
- Multi-Device-Test (Desktop + Mobile)
- Network-Latency-Test (Throttle zu 3G)
- Offline-Handling (Socket.io-Reconnect)
- Stress-Test (100 Messages in 1 Conversation)

---

## Performance-Optimierungen

### Backend
- **Pagination:** Max 50 Messages pro Request
- **Indexing:** Indexes auf `conversationId`, `senderId`, `createdAt`
- **Caching:** Redis für Unread-Counts (optional, später)

### Frontend
- **Virtualized List:** react-window für lange Message-Listen
- **Lazy-Loading:** Bilder erst laden, wenn im Viewport
- **Debouncing:** Typing-Indicator (1s), Mark-as-Read (2s)

### Socket.io
- **Rooms:** Nur aktive Conversations in Rooms (Auto-Leave nach 5min Inaktivität)
- **Binary-Data:** File-Upload über HTTP, nicht über Socket.io

---

## Security-Considerations

### Authorization
- **Conversation-Access:** User muss Buyer oder Seller der Order sein
- **Message-Access:** User muss Participant der Conversation sein
- **File-Access:** S3-URLs sind public, aber non-enumerable (random IDs)

### Input-Validation
- **Content:** Max 2000 Zeichen, XSS-Sanitization
- **File-Upload:** MIME-Type-Validation, File-Size-Limit
- **Rate-Limiting:** Max 10 Messages/Minute pro User

### Data-Privacy
- **DSGVO:** Messages werden bei Account-Löschung gelöscht
- **Retention:** Messages werden nach 2 Jahren automatisch gelöscht (optional)

---

## Rollout-Plan

### Phase 1: Beta (Woche 1)
- Messaging-System für Admin + 10 Beta-Tester
- Monitoring: Error-Rate, Message-Latency, Socket.io-Connections

### Phase 2: Soft-Launch (Woche 2)
- Messaging-System für alle User
- Feature-Flag: Kann bei Problemen deaktiviert werden

### Phase 3: Full-Launch (Woche 3)
- Messaging-System ist Standard-Feature
- Marketing: "Jetzt mit Real-time Chat!"

---

## Success-Metriken

### Technical-Metriken
- **Message-Latency:** <500ms (P95)
- **Socket.io-Uptime:** >99.5%
- **File-Upload-Success-Rate:** >98%

### Business-Metriken
- **Messages/Order:** Durchschnittlich 5-10 Messages pro Order
- **Response-Time:** Durchschnittlich <2h (Seller → Buyer)
- **Dispute-Rate:** <4% (gute Kommunikation reduziert Disputes)

---

## Risiken & Mitigation

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|-----------|
| Socket.io-Skalierung (>1000 concurrent users) | Mittel | Hoch | Redis-Adapter für Multi-Instance-Deployment |
| File-Upload-Spam | Hoch | Mittel | Rate-Limiting + File-Size-Limit |
| Offline-Messages nicht zugestellt | Mittel | Hoch | tRPC-Fallback + Notification-System |
| XSS via Message-Content | Niedrig | Hoch | Content-Sanitization (DOMPurify) |

---

## Nächste Schritte

1. ✅ Umsetzungsplan reviewen
2. ⏳ Phase 1 starten: Datenbank-Schema implementieren
3. ⏳ Phase 2: Backend-API (tRPC)
4. ⏳ Phase 3: Socket.io-Integration
5. ⏳ Phase 4-7: Frontend + Features
6. ⏳ Testing & Deployment

---

**Erstellt:** 13. November 2025  
**Autor:** Manus AI  
**Status:** Ready for Implementation
