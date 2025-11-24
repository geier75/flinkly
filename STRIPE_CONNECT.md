# Stripe Connect Integration

## Overview

Flinkly uses **Stripe Connect** to enable direct payouts to sellers while automatically collecting platform fees.

### Payment Model

- **Seller receives:** 85% of transaction amount (directly to their bank account)
- **Platform fee:** 15% (automatically deducted by Stripe)
- **Payout method:** Automatic via Stripe Connect (no manual transfers needed)

---

## How It Works

### For Sellers

1. **Create Gigs** on Flinkly marketplace
2. **Connect Stripe Account** via Seller Dashboard (one-time setup)
3. **Complete KYC Verification** through Stripe (identity + bank details)
4. **Receive Payments Automatically** when buyers purchase your gigs

### For Buyers

1. Browse and select a gig
2. Click "Projekt starten"
3. Complete payment via Stripe Checkout
4. Funds are split automatically:
   - 85% → Seller's bank account
   - 15% → Platform fee

---

## Technical Architecture

### Database Schema

Added to `users` table:

```typescript
stripeAccountId: varchar(255)           // Stripe Connect Account ID (acct_...)
stripeOnboardingComplete: boolean       // KYC verification complete
stripeChargesEnabled: boolean           // Can receive payments
stripePayoutsEnabled: boolean           // Can receive payouts
```

### Payment Flow

#### With Stripe Connect (Recommended)

```
Buyer pays €100
    ↓
Stripe Checkout Session with Destination Charges
    ↓
├─ €85.00 → Seller's bank account (automatic)
└─ €15.00 → Platform fee (automatic)
```

#### Without Stripe Connect (Fallback)

```
Buyer pays €100
    ↓
Stripe Checkout Session (platform charge)
    ↓
€100.00 → Platform account
    ↓
Manual payout required to seller
```

---

## Implementation Details

### Backend (server/payment.ts)

#### Destination Charges

```typescript
const sessionConfig: Stripe.Checkout.SessionCreateParams = {
  // ... other config
  payment_intent_data: {
    capture_method: 'manual', // Escrow
    application_fee_amount: platformFeeCents, // 15% fee
    transfer_data: {
      destination: sellerStripeAccountId, // Seller's Connect account
    },
  },
};
```

#### Key Functions

- `createConnectAccount()` - Create Stripe Express account for seller
- `createCheckoutSession()` - Create payment with destination charges
- `updateUserStripeAccount()` - Save Connect account ID to database

### Frontend (client/src/components/StripeConnectOnboarding.tsx)

#### Component Features

- Check if seller has Stripe account
- Create Connect account button
- Redirect to Stripe onboarding
- Display account status (charges/payouts enabled)
- Refresh onboarding link if incomplete

### tRPC Procedures (server/routers.ts)

```typescript
payment: router({
  createConnectAccount: protectedProcedure
    .input(z.object({ country: z.enum(['DE', 'AT', 'CH']) }))
    .mutation(async ({ ctx, input }) => { ... }),
    
  getConnectAccountStatus: protectedProcedure
    .query(async ({ ctx }) => { ... }),
    
  refreshOnboardingLink: protectedProcedure
    .mutation(async ({ ctx }) => { ... }),
})
```

---

## Fee Breakdown Examples

| Order Amount | Seller Receives | Platform Fee |
|--------------|-----------------|--------------|
| €10.00       | €8.50           | €1.50        |
| €25.00       | €21.25          | €3.75        |
| €50.00       | €42.50          | €7.50        |
| €100.00      | €85.00          | €15.00       |
| €250.00      | €212.50         | €37.50       |

---

## Seller Onboarding Flow

### Step 1: Create Connect Account

1. Seller clicks "Stripe-Konto verbinden" in Seller Dashboard
2. Backend creates Stripe Express account
3. Seller redirected to Stripe onboarding page

### Step 2: Complete KYC

Seller provides:
- Personal information (name, DOB, address)
- Identity verification (ID/passport)
- Bank account details (IBAN)
- Business information (if commercial)

### Step 3: Verification

- Stripe verifies identity (usually instant)
- Account capabilities enabled:
  - `charges_enabled` - Can receive payments
  - `payouts_enabled` - Can receive payouts

### Step 4: Start Receiving Payments

- Seller can now receive direct payouts
- Platform fee deducted automatically
- Payouts typically arrive in 2-7 business days

---

## Testing

### Run Tests

```bash
pnpm vitest run server/stripe-connect.test.ts
```

### Test Coverage

- ✅ Database schema validation
- ✅ Platform fee calculations (15%)
- ✅ Stripe account CRUD operations
- ✅ Configuration validation
- ⚠️ Checkout session creation (requires live Stripe keys)

### Manual Testing

1. **Create Seller Account**
   - Navigate to Seller Dashboard
   - Click "Stripe-Konto verbinden"
   - Complete onboarding (use test mode)

2. **Create Test Gig**
   - Create a gig with price €50
   - Publish gig

3. **Test Purchase**
   - As buyer, purchase the gig
   - Use Stripe test card: `4242 4242 4242 4242`
   - Verify payment splits correctly

4. **Check Stripe Dashboard**
   - Login to Stripe Dashboard
   - Check Connect → Accounts
   - Verify seller account created
   - Check Payments → All payments
   - Verify application fee (15%) deducted

---

## Webhooks

### Required Webhooks

Configure these webhooks in Stripe Dashboard:

- `account.updated` - Update seller capabilities when onboarding complete
- `checkout.session.completed` - Create order after payment
- `payment_intent.succeeded` - Capture payment
- `charge.refunded` - Handle refunds

### Webhook Handler

```typescript
// server/_core/webhooks.ts
export function constructWebhookEvent(payload: string, signature: string): Stripe.Event {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    ENV.stripeWebhookSecret
  );
}
```

---

## Security Considerations

### 1. Webhook Verification

Always verify webhook signatures:

```typescript
const event = constructWebhookEvent(payload, signature);
```

### 2. Account Ownership

Verify seller owns the Stripe account:

```typescript
const user = await db.getUserById(ctx.user.id);
if (user?.stripeAccountId !== accountId) {
  throw new TRPCError({ code: 'FORBIDDEN' });
}
```

### 3. Escrow Protection

Use `capture_method: 'manual'` to hold funds until order completion:

```typescript
payment_intent_data: {
  capture_method: 'manual', // Hold funds
}
```

---

## Troubleshooting

### Seller can't connect Stripe account

**Symptoms:** "Failed to create seller account" error

**Solutions:**
1. Check Stripe API keys are configured
2. Verify Stripe Connect is enabled in Stripe Dashboard
3. Check seller email is valid
4. Review Stripe Dashboard logs

### Platform fee not deducted

**Symptoms:** Seller receives 100% of payment

**Solutions:**
1. Verify `application_fee_amount` is set in checkout session
2. Check `transfer_data.destination` points to seller's account
3. Review Stripe Dashboard → Payments → Application fees

### Onboarding link expired

**Symptoms:** "This link has expired" when clicking onboarding link

**Solutions:**
1. Click "Verifizierung fortsetzen" in Seller Dashboard
2. Backend generates new onboarding link
3. Links expire after 24 hours

### Payouts not arriving

**Symptoms:** Seller completed onboarding but no payouts

**Solutions:**
1. Check `stripePayoutsEnabled` in database
2. Verify bank account added in Stripe Dashboard
3. Check Stripe Dashboard → Connect → Payouts
4. Payouts may take 2-7 business days

---

## Migration Guide

### From Manual Payouts to Stripe Connect

If you previously used manual payouts:

1. **Notify Sellers**
   - Email all sellers about Stripe Connect requirement
   - Provide deadline for connecting accounts

2. **Update Existing Orders**
   - Complete pending manual payouts
   - New orders will use Stripe Connect

3. **Database Migration**
   ```sql
   -- Already applied via drizzle migration
   ALTER TABLE users ADD COLUMN stripeAccountId VARCHAR(255);
   ALTER TABLE users ADD COLUMN stripeOnboardingComplete BOOLEAN DEFAULT FALSE;
   ALTER TABLE users ADD COLUMN stripeChargesEnabled BOOLEAN DEFAULT FALSE;
   ALTER TABLE users ADD COLUMN stripePayoutsEnabled BOOLEAN DEFAULT FALSE;
   ```

4. **Frontend Updates**
   - StripeConnectOnboarding component added to SellerDashboard
   - Sellers see onboarding prompt on first login

---

## FAQ

### Q: Do sellers need a Stripe account?

**A:** Recommended but not required. Without Stripe Connect, funds go to platform and require manual payout.

### Q: What countries are supported?

**A:** Currently DE, AT, CH. Expand by adding to country enum in tRPC procedure.

### Q: Can sellers change their bank account?

**A:** Yes, through Stripe Dashboard → Settings → Bank accounts.

### Q: What happens if seller's account is suspended?

**A:** Payments will fail. Buyer will be refunded automatically.

### Q: How long do payouts take?

**A:** Typically 2-7 business days after order completion.

### Q: Can platform adjust fee percentage?

**A:** Yes, change `platformFeeCents` calculation in `createCheckoutSession()`:

```typescript
const platformFeeCents = Math.round(totalAmountCents * 0.15); // Change 0.15 to desired %
```

---

## Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Destination Charges](https://stripe.com/docs/connect/destination-charges)
- [Express Accounts](https://stripe.com/docs/connect/express-accounts)
- [Webhooks](https://stripe.com/docs/webhooks)

---

## Support

For issues with Stripe Connect integration:

1. Check Stripe Dashboard logs
2. Review server logs for errors
3. Run test suite: `pnpm vitest run server/stripe-connect.test.ts`
4. Contact Stripe Support for account-specific issues

---

**Last Updated:** 2025-01-24
**Version:** 1.0.0
**Status:** ✅ Production Ready
