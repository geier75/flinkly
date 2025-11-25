import { createCheckoutSession } from './server/payment.js';
import * as db from './server/db.js';

async function testPaymentCheckout() {
  try {
    console.log('[TEST] Starting payment checkout debug test...');
    
    // Test 1: Get a gig
    const gigId = 180004;
    console.log(`[TEST] Fetching gig ${gigId}...`);
    const gig = await db.getGigById(gigId);
    
    if (!gig) {
      console.error('[TEST] ❌ Gig not found');
      return;
    }
    
    console.log('[TEST] ✅ Gig found:', {
      id: gig.id,
      title: gig.title,
      sellerId: gig.sellerId,
      price: gig.price
    });
    
    // Test 2: Get seller
    console.log(`[TEST] Fetching seller ${gig.sellerId}...`);
    const seller = await db.getUserById(gig.sellerId);
    
    if (!seller) {
      console.error('[TEST] ❌ Seller not found');
      return;
    }
    
    console.log('[TEST] ✅ Seller found:', {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      stripeAccountId: seller.stripeAccountId || 'NOT SET'
    });
    
    // Test 3: Create checkout session
    console.log('[TEST] Creating checkout session...');
    const session = await createCheckoutSession({
      gigId: gig.id,
      gigTitle: gig.title,
      gigPrice: Number(gig.price),
      buyerId: 999999, // Test buyer ID
      buyerEmail: 'test@example.com',
      buyerName: 'Test Buyer',
      sellerId: gig.sellerId,
      sellerStripeAccountId: seller.stripeAccountId || undefined,
      origin: 'http://localhost:3000',
      buyerMessage: 'Test message',
      selectedPackage: 'basic',
      selectedExtras: '[]',
    });
    
    console.log('[TEST] ✅ Checkout session created:', {
      id: session.id,
      url: session.url
    });
    
  } catch (error) {
    console.error('[TEST] ❌ Error:', error.message);
    console.error('[TEST] Stack:', error.stack);
  }
}

testPaymentCheckout();
