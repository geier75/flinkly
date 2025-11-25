import { getGigById, getUserById } from './server/db';

async function testPaymentCheckout() {
  try {
    console.log('[TEST] Starting payment checkout debug test...');
    
    // Test 1: Get a gig
    const gigId = 180004;
    console.log(`[TEST] Fetching gig ${gigId}...`);
    const gig = await getGigById(gigId);
    
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
    const seller = await getUserById(gig.sellerId);
    
    if (!seller) {
      console.error('[TEST] ❌ Seller not found');
      return;
    }
    
    console.log('[TEST] ✅ Seller found:', {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      stripeAccountId: (seller as any).stripeAccountId || 'NOT SET'
    });
    
    console.log('[TEST] ✅ All database queries successful!');
    console.log('[TEST] The issue is likely in the Stripe API call or session creation');
    
  } catch (error: any) {
    console.error('[TEST] ❌ Error:', error.message);
    console.error('[TEST] Stack:', error.stack);
  }
}

testPaymentCheckout();
