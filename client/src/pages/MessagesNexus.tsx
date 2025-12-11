import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CosmicBackground } from "@/components/immersive/CosmicBackground";
import { CommandCenter } from "@/components/immersive/CommandCenter";
import { HolographicCard, DataOrb, EnergyBar } from "@/components/immersive/HolographicCard";
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Clock,
  User,
  Star,
  Archive,
  Trash2,
  Pin,
  Sparkles,
  Zap,
  Shield,
  Bell,
  Circle,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  isPinned?: boolean;
}

/**
 * MessagesNexus - Immersive Messages View (Nachrichten)
 * 
 * Real-time messaging with visual feedback
 * Privacy-aware communication
 */
export default function MessagesNexus() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversations
  const conversations: Conversation[] = useMemo(() => [
    {
      id: "1",
      participantName: "Max Mustermann",
      lastMessage: "Vielen Dank für die schnelle Lieferung!",
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 2,
      isOnline: true,
      isPinned: true,
    },
    {
      id: "2",
      participantName: "Anna Schmidt",
      lastMessage: "Können wir den Preis noch besprechen?",
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "3",
      participantName: "Flinkly Support",
      lastMessage: "Dein Konto wurde erfolgreich verifiziert.",
      lastMessageTime: new Date(Date.now() - 172800000),
      unreadCount: 1,
      isOnline: true,
    },
  ], []);

  // Mock messages for selected conversation
  const messages: Message[] = useMemo(() => {
    if (!selectedConversation) return [];
    return [
      { id: "1", content: "Hallo! Ich interessiere mich für deinen Service.", senderId: "other", timestamp: new Date(Date.now() - 7200000), read: true },
      { id: "2", content: "Hallo! Ja, gerne. Was möchtest du wissen?", senderId: String(user?.id) || "me", timestamp: new Date(Date.now() - 7000000), read: true },
      { id: "3", content: "Wie lange dauert die Lieferung?", senderId: "other", timestamp: new Date(Date.now() - 6800000), read: true },
      { id: "4", content: "In der Regel 2-3 Werktage.", senderId: String(user?.id) || "me", timestamp: new Date(Date.now() - 6600000), read: true },
      { id: "5", content: "Vielen Dank für die schnelle Lieferung!", senderId: "other", timestamp: new Date(Date.now() - 3600000), read: false },
    ];
  }, [selectedConversation, user?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // TODO: Implement via tRPC/Socket
    console.log("Sending:", messageInput);
    setMessageInput("");
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return "Gerade eben";
    if (hours < 24) return `Vor ${hours}h`;
    if (days < 7) return `Vor ${days}d`;
    return date.toLocaleDateString('de-DE');
  };

  // Stats
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const onlineCount = conversations.filter(c => c.isOnline).length;

  return (
    <>
      {/* Cosmic 3D Background */}
      <CosmicBackground />

      {/* Command Center Layout */}
      <CommandCenter activeSection="messages">
        <div className="space-y-6 max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-4"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">Kommunikations-Hub</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Nachrichten</h1>
            <p className="text-slate-400">Sichere Kommunikation in Echtzeit</p>
          </motion.div>

          {/* Stats Orbs */}
          <div className="flex flex-wrap justify-center gap-6">
            <DataOrb value={conversations.length} label="Konversationen" color="cyan" size="md" />
            <DataOrb value={totalUnread} label="Ungelesen" color={totalUnread > 0 ? "rose" : "emerald"} size="lg" />
            <DataOrb value={onlineCount} label="Online" color="emerald" size="md" />
          </div>

          {/* Main Chat Interface */}
          <HolographicCard glowColor="cyan" intensity="medium">
            <div className="h-[calc(100vh-400px)] min-h-[500px] flex overflow-hidden">
              {/* Conversations List */}
              <div className={`
                w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col
                ${selectedConversation ? 'hidden md:flex' : 'flex'}
              `}>
                {/* Search */}
                <div className="p-4 border-b border-white/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      placeholder="Suchen..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-auto">
                  <AnimatePresence>
                    {filteredConversations.map((conv, index) => (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`
                          relative p-4 cursor-pointer transition-all duration-300
                          ${selectedConversation === conv.id
                            ? 'bg-violet-500/20 border-l-2 border-violet-500'
                            : 'border-l-2 border-transparent hover:border-cyan-500/50'
                          }
                        `}
                      >
                        {/* Pinned indicator */}
                        {conv.isPinned && (
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Pin className="absolute top-2 right-2 w-3 h-3 text-violet-400" />
                          </motion.div>
                        )}

                        <div className="flex items-start gap-3">
                          {/* Avatar with glow */}
                          <div className="relative">
                            <motion.div
                              animate={conv.isOnline ? { boxShadow: ["0 0 10px rgba(16, 185, 129, 0.3)", "0 0 20px rgba(16, 185, 129, 0.5)", "0 0 10px rgba(16, 185, 129, 0.3)"] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold"
                            >
                              {conv.participantName.charAt(0)}
                            </motion.div>
                            {conv.isOnline && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-white truncate">{conv.participantName}</h3>
                              <span className="text-xs text-slate-500">{formatTime(conv.lastMessageTime)}</span>
                            </div>
                            <p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>
                          </div>

                          {/* Unread badge */}
                          {conv.unreadCount > 0 && (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30"
                            >
                              <span className="text-xs font-bold text-white">{conv.unreadCount}</span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredConversations.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-500">Keine Konversationen gefunden</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className={`
                flex-1 flex flex-col bg-slate-900/20
                ${selectedConversation ? 'flex' : 'hidden md:flex'}
              `}>
                {selectedConv ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-800/30">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="md:hidden text-slate-400"
                          onClick={() => setSelectedConversation(null)}
                        >
                          ←
                        </Button>
                        <div className="relative">
                          <motion.div
                            animate={selectedConv.isOnline ? { boxShadow: ["0 0 10px rgba(16, 185, 129, 0.3)", "0 0 20px rgba(16, 185, 129, 0.5)", "0 0 10px rgba(16, 185, 129, 0.3)"] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold"
                          >
                            {selectedConv.participantName.charAt(0)}
                          </motion.div>
                          {selectedConv.isOnline && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{selectedConv.participantName}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Circle className={`w-2 h-2 fill-current ${selectedConv.isOnline ? 'text-emerald-400' : 'text-slate-500'}`} />
                            {selectedConv.isOnline ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        >
                          <Video className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-auto p-4 space-y-4">
                      {messages.map((msg, index) => {
                        const isMe = msg.senderId === String(user?.id) || msg.senderId === "me";
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className={`
                                max-w-[70%] p-4 rounded-2xl relative
                                ${isMe
                                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-br-md shadow-lg shadow-violet-500/20'
                                  : 'bg-slate-800/80 text-white rounded-bl-md border border-slate-700/50'
                                }
                              `}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <div className={`flex items-center gap-1 mt-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-xs opacity-70">
                                  {msg.timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {isMe && (
                                  msg.read 
                                    ? <CheckCheck className="w-3 h-3 text-cyan-300" />
                                    : <Check className="w-3 h-3 opacity-70" />
                                )}
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-white/10 bg-slate-800/30">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        >
                          <Paperclip className="w-5 h-5" />
                        </motion.button>
                        <div className="flex-1 relative">
                          <Input
                            placeholder="Nachricht schreiben..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            className="pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
                          >
                            <Smile className="w-5 h-5" />
                          </motion.button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim()}
                          className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          boxShadow: ["0 0 20px rgba(6, 182, 212, 0.2)", "0 0 40px rgba(6, 182, 212, 0.4)", "0 0 20px rgba(6, 182, 212, 0.2)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4 border border-cyan-500/30"
                      >
                        <MessageSquare className="w-12 h-12 text-cyan-400" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mb-2">Wähle eine Konversation</h3>
                      <p className="text-slate-500">Klicke auf eine Konversation, um sie zu öffnen</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </HolographicCard>

          {/* Privacy Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-4 h-4 text-emerald-400" />
              </motion.div>
              <span className="text-sm text-emerald-400">Ende-zu-Ende verschlüsselt</span>
            </div>
          </motion.div>
        </div>
      </CommandCenter>
    </>
  );
}
