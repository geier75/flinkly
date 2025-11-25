import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

async function testStripe() {
  try {
    console.log('[TEST] Testing Stripe API connection...');
    
    // Test 1: Retrieve account
    const account = await stripe.accounts.retrieve();
    console.log('[TEST] ✅ Stripe account retrieved:', {
      id: account.id,
      email: account.email,
      country: account.country
    });
    
    // Test 2: Create a test checkout session
    console.log('[TEST] Creating test checkout session...');
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Test Product',
          },
          unit_amount: 1000, // 10 EUR
        },
        quantity: 1,
      }],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    
    console.log('[TEST] ✅ Checkout session created:', {
      id: session.id,
      url: session.url
    });
    
  } catch (error) {
    console.error('[TEST] ❌ Stripe API Error:', error.message);
    console.error('[TEST] Error type:', error.type);
    console.error('[TEST] Error code:', error.code);
  }
}

testStripe();
