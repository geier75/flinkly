/**
 * Email-Templates für transaktionale E-Mails
 * 
 * Alle Templates verwenden Inline-CSS für maximale E-Mail-Client-Kompatibilität.
 */

export interface OrderConfirmationData {
  buyerName: string;
  orderId: number;
  gigTitle: string;
  price: number;
  sellerName: string;
  deliveryDays: number;
}

export function orderConfirmationTemplate(data: OrderConfirmationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestellung bestätigt</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Flinkly</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Bestellung bestätigt! 🎉</h2>
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Hallo ${data.buyerName},
              </p>
              
              <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Deine Bestellung wurde erfolgreich aufgegeben und bezahlt. ${data.sellerName} wurde benachrichtigt und beginnt jetzt mit der Arbeit.
              </p>
              
              <!-- Order Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Bestelldetails</p>
                    
                    <p style="margin: 0 0 8px; color: #1a1a1a; font-size: 18px; font-weight: 600;">${data.gigTitle}</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Bestellnummer:</td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">#${data.orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Seller:</td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.sellerName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Lieferzeit:</td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.deliveryDays} Tage</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid #e5e7eb; color: #1a1a1a; font-size: 16px; font-weight: 700;">Gesamt:</td>
                        <td style="padding: 8px 0; border-top: 1px solid #e5e7eb; color: #1a1a1a; font-size: 16px; font-weight: 700; text-align: right;">€${data.price.toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://flinkly.de/orders/${data.orderId}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">Bestellung ansehen</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Du kannst den Fortschritt deiner Bestellung jederzeit in deinem Dashboard verfolgen. Bei Fragen kannst du ${data.sellerName} direkt über den Chat kontaktieren.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                Viel Erfolg mit deinem Projekt!<br>
                Dein Flinkly-Team
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                © 2025 Flinkly. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export interface MessageNotificationData {
  recipientName: string;
  senderName: string;
  messagePreview: string;
  conversationId: number;
}

export function messageNotificationTemplate(data: MessageNotificationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Nachricht</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Flinkly</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Neue Nachricht 💬</h2>
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Hallo ${data.recipientName},
              </p>
              
              <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Du hast eine neue Nachricht von <strong>${data.senderName}</strong> erhalten:
              </p>
              
              <!-- Message Preview Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-left: 4px solid #667eea; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; color: #4a4a4a; font-size: 15px; line-height: 1.6; font-style: italic;">
                      "${data.messagePreview}"
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://flinkly.de/messages/${data.conversationId}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">Nachricht antworten</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Schnelle Antworten verbessern deine Reputation und sorgen für zufriedene Kunden!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                Dein Flinkly-Team
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                © 2025 Flinkly. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export interface DisputeAlertData {
  userName: string;
  orderId: number;
  gigTitle: string;
  disputeReason: string;
  role: 'buyer' | 'seller';
}

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}

export function welcomeEmailTemplate(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Willkommen bei Flinkly</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Flinkly</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Willkommen bei Flinkly! 🎉</h2>
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Hallo ${data.userName},
              </p>
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Willkommen auf Deutschlands fairstem Marktplatz für digitale Dienstleistungen! Wir freuen uns, dass du Teil unserer Community wirst.
              </p>
              
              <!-- Features Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 16px; color: #1a1a1a; font-size: 16px; font-weight: 600;">Was dich bei Flinkly erwartet:</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #4a4a4a; font-size: 14px;">✅ Faire Gebühren (nur 15%, nicht 20%)</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #4a4a4a; font-size: 14px;">✅ DACH-Fokus (Deutsch, Qualität, DSGVO)</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #4a4a4a; font-size: 14px;">✅ Transparenz (keine versteckten Kosten)</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #4a4a4a; font-size: 14px;">✅ Geld-zurück-Garantie</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://flinkly.de/marketplace" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">Gigs entdecken</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Du kannst jetzt sofort loslegen: Durchstöbere unsere Gigs, kontaktiere Experten oder erstelle dein eigenes Angebot!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                Viel Erfolg auf Flinkly!<br>
                Dein Flinkly-Team
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                © 2025 Flinkly. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export interface PasswordResetData {
  userName: string;
  resetToken: string;
  expiresInMinutes: number;
}

export function passwordResetTemplate(data: PasswordResetData): string {
  const resetUrl = `https://flinkly.de/reset-password?token=${data.resetToken}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Passwort zurücksetzen</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Flinkly</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Passwort zurücksetzen 🔐</h2>
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Hallo ${data.userName},
              </p>
              
              <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt. Klicke auf den Button unten, um ein neues Passwort zu erstellen.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">Passwort zurücksetzen</a>
                  </td>
                </tr>
              </table>
              
              <!-- Security Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6; font-weight: 600;">
                      ⏰ Dieser Link ist nur ${data.expiresInMinutes} Minuten gültig!
                    </p>
                    <p style="margin: 10px 0 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                      Falls du diese Anfrage nicht gestellt hast, ignoriere diese E-Mail einfach. Dein Passwort bleibt unverändert.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Alternativ kannst du auch diesen Link kopieren:<br>
                <span style="color: #667eea; word-break: break-all;">${resetUrl}</span>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                Dein Flinkly-Team
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                © 2025 Flinkly. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function disputeAlertTemplate(data: DisputeAlertData): string {
  const roleText = data.role === 'buyer' 
    ? 'Du hast einen Dispute für diese Bestellung eröffnet.' 
    : 'Ein Käufer hat einen Dispute für diese Bestellung eröffnet.';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dispute eröffnet</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Flinkly</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">⚠️ Dispute eröffnet</h2>
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Hallo ${data.userName},
              </p>
              
              <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                ${roleText}
              </p>
              
              <!-- Dispute Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px; color: #92400e; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Dispute-Details</p>
                    
                    <p style="margin: 0 0 8px; color: #1a1a1a; font-size: 18px; font-weight: 600;">${data.gigTitle}</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                      <tr>
                        <td style="padding: 8px 0; color: #92400e; font-size: 14px;">Bestellnummer:</td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">#${data.orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #92400e; font-size: 14px;">Grund:</td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${data.disputeReason}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Important Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fee2e2; border-left: 4px solid #dc2626; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6; font-weight: 600;">
                      ⏰ Wichtig: Bitte reagiere innerhalb von 48 Stunden!
                    </p>
                    <p style="margin: 10px 0 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                      Lade Beweise hoch und erkläre deine Sichtweise. Unser Support-Team wird den Fall prüfen und eine faire Lösung finden.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://flinkly.de/orders/${data.orderId}/dispute" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">Dispute ansehen</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Wir sind hier, um eine faire Lösung für beide Seiten zu finden. Bei Fragen kannst du dich jederzeit an unser Support-Team wenden.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                Dein Flinkly-Team
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                © 2025 Flinkly. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}


export interface WeeklyDigestData {
  userName: string;
  newGigs: Array<{ id: number; title: string; category: string; price: number }>;
  unreadMessages: number;
  openOrders: Array<{ id: number; gigTitle: string; status: string }>;
}

export function weeklyDigestTemplate(data: WeeklyDigestData): string {
  const { userName, newGigs, unreadMessages, openOrders } = data;
  
  const newGigsHtml = newGigs.length > 0 ? `
    <tr>
      <td style="padding: 0 40px 30px;">
        <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 20px; font-weight: 600;">🎨 Neue Gigs in deinen Lieblingskategorien</h2>
        ${newGigs.map(gig => `
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
            <tr>
              <td style="padding: 16px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 70%;">
                      <p style="margin: 0 0 4px; color: #1a1a1a; font-size: 16px; font-weight: 600;">${gig.title}</p>
                      <p style="margin: 0; color: #6b7280; font-size: 14px;">${gig.category}</p>
                    </td>
                    <td style="width: 30%; text-align: right;">
                      <p style="margin: 0; color: #ff6b35; font-size: 20px; font-weight: 700;">€${gig.price}</p>
                    </td>
                  </tr>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 12px;">
                  <tr>
                    <td>
                      <a href="https://flinkly.de/gig/${gig.id}" style="display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">Jetzt ansehen</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `).join('')}
      </td>
    </tr>
  ` : '';
  
  const unreadMessagesHtml = unreadMessages > 0 ? `
    <tr>
      <td style="padding: 0 40px 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 8px;">
          <tr>
            <td style="padding: 20px;">
              <h2 style="margin: 0 0 8px; color: #1e40af; font-size: 18px; font-weight: 600;">💬 ${unreadMessages} ungelesene Nachricht${unreadMessages > 1 ? 'en' : ''}</h2>
              <p style="margin: 0 0 12px; color: #1e40af; font-size: 14px;">Du hast neue Nachrichten in deinem Posteingang.</p>
              <a href="https://flinkly.de/messages" style="display: inline-block; padding: 10px 20px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">Nachrichten lesen</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  ` : '';
  
  const openOrdersHtml = openOrders.length > 0 ? `
    <tr>
      <td style="padding: 0 40px 30px;">
        <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 20px; font-weight: 600;">📦 Offene Aufträge (${openOrders.length})</h2>
        ${openOrders.map(order => `
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fefce8; border-radius: 8px; margin-bottom: 12px;">
            <tr>
              <td style="padding: 16px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 70%;">
                      <p style="margin: 0 0 4px; color: #854d0e; font-size: 16px; font-weight: 600;">${order.gigTitle}</p>
                      <span style="display: inline-block; padding: 4px 8px; background: #fbbf24; color: #78350f; border-radius: 4px; font-size: 12px; font-weight: 600;">${order.status}</span>
                    </td>
                    <td style="width: 30%; text-align: right;">
                      <a href="https://flinkly.de/dashboard" style="color: #854d0e; text-decoration: none; font-size: 14px; font-weight: 600;">Details →</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `).join('')}
      </td>
    </tr>
  ` : '';
  
  const hasContent = newGigs.length > 0 || unreadMessages > 0 || openOrders.length > 0;
  
  const noContentHtml = !hasContent ? `
    <tr>
      <td style="padding: 40px; text-align: center;">
        <p style="margin: 0 0 16px; color: #6b7280; font-size: 16px;">Keine neuen Updates diese Woche.</p>
        <a href="https://flinkly.de/marketplace" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">Marketplace durchstöbern</a>
      </td>
    </tr>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flinkly Weekly Digest</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0 0 8px; color: #ffffff; font-size: 28px; font-weight: 700;">📬 Dein Weekly Digest</h1>
              <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Hallo ${userName}, hier ist deine wöchentliche Zusammenfassung!</p>
            </td>
          </tr>
          
          <!-- Content -->
          ${newGigsHtml}
          ${unreadMessagesHtml}
          ${openOrdersHtml}
          ${noContentHtml}
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                Du erhältst diese E-Mail, weil du bei Flinkly registriert bist.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                <a href="https://flinkly.de/settings" style="color: #ff6b35; text-decoration: none;">E-Mail-Einstellungen ändern</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}



export interface LevelUpData {
  sellerName: string;
  oldLevel: string;
  newLevel: string;
  completedOrders: number;
  averageRating: string;
  onTimeDeliveryRate: number;
  responseTimeHours: number;
}

export function levelUpTemplate(data: LevelUpData): string {
  const levelEmojis: Record<string, string> = {
    new: "🌱",
    rising: "📈",
    level_one: "⭐",
    top_rated: "👑",
  };
  
  const levelNames: Record<string, string> = {
    new: "New Seller",
    rising: "Rising Star",
    level_one: "Level One",
    top_rated: "Top Rated",
  };
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Level-Up! 🎉</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Flinkly</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 64px; margin-bottom: 10px;">${levelEmojis[data.newLevel] || "⭐"}</div>
                <h2 style="margin: 0 0 10px; color: #1a1a1a; font-size: 28px; font-weight: 700;">Glückwunsch zum Level-Up!</h2>
                <p style="margin: 0; color: #10b981; font-size: 20px; font-weight: 600;">
                  ${levelNames[data.oldLevel] || data.oldLevel} → ${levelNames[data.newLevel] || data.newLevel}
                </p>
              </div>
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Hallo ${data.sellerName},
              </p>
              
              <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Deine harte Arbeit und dein Engagement haben sich ausgezahlt! Du wurdest auf <strong>${levelNames[data.newLevel] || data.newLevel}</strong> hochgestuft. 🎉
              </p>
              
              <!-- Stats Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px; color: #1a1a1a; font-size: 18px; font-weight: 600;">Deine Statistiken</h3>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Abgeschlossene Aufträge</td>
                        <td align="right" style="color: #1a1a1a; font-size: 16px; font-weight: 600;">${data.completedOrders}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Durchschnittliche Bewertung</td>
                        <td align="right" style="color: #1a1a1a; font-size: 16px; font-weight: 600;">${data.averageRating} ⭐</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Pünktliche Lieferung</td>
                        <td align="right" style="color: #1a1a1a; font-size: 16px; font-weight: 600;">${data.onTimeDeliveryRate}%</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Antwortzeit</td>
                        <td align="right" style="color: #1a1a1a; font-size: 16px; font-weight: 600;">${data.responseTimeHours}h</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Als <strong>${levelNames[data.newLevel]}</strong> profitierst du von:
              </p>
              
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #4a4a4a; font-size: 16px; line-height: 1.8;">
                <li>Höherer Sichtbarkeit in den Suchergebnissen</li>
                <li>Vertrauens-Badge auf deinem Profil</li>
                <li>Besseren Conversion-Rates</li>
                <li>Zugang zu Premium-Features (bald verfügbar)</li>
              </ul>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://flinkly.manus.space/seller-dashboard" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Dashboard ansehen
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Weiter so! Wir freuen uns darauf, dich auf deinem Weg zum Top Rated Seller zu begleiten.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                © ${new Date().getFullYear()} Flinkly. Alle Rechte vorbehalten.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Diese E-Mail wurde automatisch generiert. Bitte antworte nicht auf diese E-Mail.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
