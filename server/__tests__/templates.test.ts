import { describe, it, expect } from 'vitest';

/**
 * Email Template Tests
 * 
 * Tests for email template generation
 */

describe('Email Templates', () => {
  describe('Base Template', () => {
    const createBaseTemplate = (content: string, title: string = 'Flinkly') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #6366f1; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
    .button { background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Flinkly</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Flinkly. Alle Rechte vorbehalten.</p>
    </div>
  </div>
</body>
</html>`;

    it('should include DOCTYPE', () => {
      const html = createBaseTemplate('<p>Test</p>');
      expect(html).toContain('<!DOCTYPE html>');
    });

    it('should include meta tags', () => {
      const html = createBaseTemplate('<p>Test</p>');
      expect(html).toContain('charset="utf-8"');
      expect(html).toContain('viewport');
    });

    it('should include content', () => {
      const html = createBaseTemplate('<p>Hello World</p>');
      expect(html).toContain('<p>Hello World</p>');
    });

    it('should include current year in footer', () => {
      const html = createBaseTemplate('<p>Test</p>');
      expect(html).toContain(new Date().getFullYear().toString());
    });
  });

  describe('Order Confirmation Template', () => {
    const createOrderConfirmation = (data: {
      buyerName: string;
      gigTitle: string;
      amount: number;
      orderId: number;
      deliveryDays: number;
    }) => `
<h2>Bestellbestätigung</h2>
<p>Hallo ${data.buyerName},</p>
<p>vielen Dank für deine Bestellung!</p>

<div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>${data.gigTitle}</h3>
  <p><strong>Bestellnummer:</strong> #${data.orderId}</p>
  <p><strong>Betrag:</strong> €${(data.amount / 100).toFixed(2)}</p>
  <p><strong>Lieferzeit:</strong> ${data.deliveryDays} Tage</p>
</div>

<p>Der Verkäufer wurde benachrichtigt und wird bald mit der Arbeit beginnen.</p>

<a href="https://flinkly.com/order/${data.orderId}" class="button">Bestellung ansehen</a>
`;

    it('should include buyer name', () => {
      const html = createOrderConfirmation({
        buyerName: 'Max',
        gigTitle: 'Logo Design',
        amount: 5000,
        orderId: 123,
        deliveryDays: 3,
      });
      expect(html).toContain('Hallo Max');
    });

    it('should include order details', () => {
      const html = createOrderConfirmation({
        buyerName: 'Max',
        gigTitle: 'Logo Design',
        amount: 5000,
        orderId: 123,
        deliveryDays: 3,
      });
      expect(html).toContain('Logo Design');
      expect(html).toContain('#123');
      expect(html).toContain('€50.00');
      expect(html).toContain('3 Tage');
    });

    it('should include order link', () => {
      const html = createOrderConfirmation({
        buyerName: 'Max',
        gigTitle: 'Logo Design',
        amount: 5000,
        orderId: 456,
        deliveryDays: 3,
      });
      expect(html).toContain('https://flinkly.com/order/456');
    });
  });

  describe('New Order Notification (Seller)', () => {
    const createNewOrderNotification = (data: {
      sellerName: string;
      buyerName: string;
      gigTitle: string;
      amount: number;
      orderId: number;
      deliveryDays: number;
    }) => `
<h2>Neue Bestellung!</h2>
<p>Hallo ${data.sellerName},</p>
<p>du hast eine neue Bestellung erhalten!</p>

<div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>${data.gigTitle}</h3>
  <p><strong>Käufer:</strong> ${data.buyerName}</p>
  <p><strong>Bestellnummer:</strong> #${data.orderId}</p>
  <p><strong>Betrag:</strong> €${(data.amount / 100).toFixed(2)}</p>
  <p><strong>Lieferfrist:</strong> ${data.deliveryDays} Tage</p>
</div>

<p>Bitte beginne so schnell wie möglich mit der Arbeit.</p>

<a href="https://flinkly.com/order/${data.orderId}" class="button">Bestellung ansehen</a>
`;

    it('should include seller and buyer names', () => {
      const html = createNewOrderNotification({
        sellerName: 'Anna',
        buyerName: 'Max',
        gigTitle: 'Logo Design',
        amount: 5000,
        orderId: 123,
        deliveryDays: 3,
      });
      expect(html).toContain('Hallo Anna');
      expect(html).toContain('Max');
    });
  });

  describe('Delivery Notification', () => {
    const createDeliveryNotification = (data: {
      buyerName: string;
      gigTitle: string;
      orderId: number;
      message?: string;
    }) => `
<h2>Lieferung erhalten!</h2>
<p>Hallo ${data.buyerName},</p>
<p>der Verkäufer hat die Arbeit für "${data.gigTitle}" geliefert.</p>

${data.message ? `<p><strong>Nachricht:</strong> ${data.message}</p>` : ''}

<p>Bitte überprüfe die Lieferung und akzeptiere sie, wenn du zufrieden bist.</p>

<a href="https://flinkly.com/order/${data.orderId}" class="button">Lieferung prüfen</a>
`;

    it('should include delivery details', () => {
      const html = createDeliveryNotification({
        buyerName: 'Max',
        gigTitle: 'Logo Design',
        orderId: 123,
        message: 'Hier ist dein Logo!',
      });
      expect(html).toContain('Logo Design');
      expect(html).toContain('Hier ist dein Logo!');
    });

    it('should handle missing message', () => {
      const html = createDeliveryNotification({
        buyerName: 'Max',
        gigTitle: 'Logo Design',
        orderId: 123,
      });
      expect(html).not.toContain('<strong>Nachricht:</strong>');
    });
  });

  describe('Level Up Notification', () => {
    const createLevelUpNotification = (data: {
      sellerName: string;
      oldLevel: string;
      newLevel: string;
      completedOrders: number;
      averageRating: string;
    }) => `
<h2>🎉 Glückwunsch zum Level-Up!</h2>
<p>Hallo ${data.sellerName},</p>
<p>Du bist von <strong>${data.oldLevel}</strong> auf <strong>${data.newLevel}</strong> aufgestiegen!</p>

<div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>Deine Statistiken</h3>
  <p><strong>Abgeschlossene Aufträge:</strong> ${data.completedOrders}</p>
  <p><strong>Durchschnittliche Bewertung:</strong> ${data.averageRating}/5.0</p>
</div>

<p>Als ${data.newLevel} Seller erhältst du mehr Sichtbarkeit und Vertrauen von Käufern.</p>
`;

    it('should include level change', () => {
      const html = createLevelUpNotification({
        sellerName: 'Anna',
        oldLevel: 'Rising',
        newLevel: 'Level One',
        completedOrders: 50,
        averageRating: '4.8',
      });
      expect(html).toContain('Rising');
      expect(html).toContain('Level One');
    });

    it('should include statistics', () => {
      const html = createLevelUpNotification({
        sellerName: 'Anna',
        oldLevel: 'Rising',
        newLevel: 'Level One',
        completedOrders: 50,
        averageRating: '4.8',
      });
      expect(html).toContain('50');
      expect(html).toContain('4.8/5.0');
    });
  });

  describe('Password Reset Template', () => {
    const createPasswordReset = (data: {
      userName: string;
      resetLink: string;
      expiresIn: string;
    }) => `
<h2>Passwort zurücksetzen</h2>
<p>Hallo ${data.userName},</p>
<p>du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.</p>

<p>Klicke auf den Button unten, um ein neues Passwort zu erstellen:</p>

<a href="${data.resetLink}" class="button">Passwort zurücksetzen</a>

<p style="color: #666; font-size: 14px;">
  Dieser Link ist ${data.expiresIn} gültig. Wenn du diese Anfrage nicht gestellt hast, 
  kannst du diese E-Mail ignorieren.
</p>
`;

    it('should include reset link', () => {
      const html = createPasswordReset({
        userName: 'Max',
        resetLink: 'https://flinkly.com/reset?token=abc123',
        expiresIn: '24 Stunden',
      });
      expect(html).toContain('https://flinkly.com/reset?token=abc123');
    });

    it('should include expiration info', () => {
      const html = createPasswordReset({
        userName: 'Max',
        resetLink: 'https://flinkly.com/reset?token=abc123',
        expiresIn: '24 Stunden',
      });
      expect(html).toContain('24 Stunden');
    });
  });

  describe('Stripe Connect Reminder', () => {
    const createStripeConnectReminder = (data: {
      sellerName: string;
      gigCount: number;
    }) => `
<h2>Stripe-Konto verbinden</h2>
<p>Hallo ${data.sellerName},</p>
<p>du hast ${data.gigCount} aktive Gig(s), aber noch kein Stripe-Konto verbunden.</p>

<p>Um Zahlungen zu empfangen, musst du dein Stripe-Konto verbinden:</p>

<a href="https://flinkly.com/settings/payments" class="button">Stripe verbinden</a>

<p style="color: #666; font-size: 14px;">
  Ohne verbundenes Stripe-Konto können Käufer deine Gigs nicht kaufen.
</p>
`;

    it('should include gig count', () => {
      const html = createStripeConnectReminder({
        sellerName: 'Anna',
        gigCount: 3,
      });
      expect(html).toContain('3 aktive Gig(s)');
    });

    it('should include settings link', () => {
      const html = createStripeConnectReminder({
        sellerName: 'Anna',
        gigCount: 3,
      });
      expect(html).toContain('https://flinkly.com/settings/payments');
    });
  });

  describe('Template Escaping', () => {
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    it('should escape HTML entities', () => {
      expect(escapeHtml('<script>alert("XSS")</script>')).toBe(
        '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
      );
    });

    it('should escape ampersands', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should escape quotes', () => {
      expect(escapeHtml('Say "Hello"')).toBe('Say &quot;Hello&quot;');
    });
  });
});
