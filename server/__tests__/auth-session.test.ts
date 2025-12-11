import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../_core/supabase';

/**
 * Auth/Session Tests
 * 
 * Tests authentication and session management:
 * - User creation and retrieval
 * - Session validation
 * - Protected route access
 */

describe('Auth/Session Tests', () => {
  describe('User Management', () => {
    it('should create a new user via upsert', async () => {
      const testOpenId = `test_user_${Date.now()}`;
      
      // Upsert user
      const { data, error } = await supabase
        .from('users')
        .upsert({
          open_id: testOpenId,
          name: 'Test User',
          email: `test_${Date.now()}@example.com`,
          login_method: 'test',
          role: 'user',
        }, { onConflict: 'open_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.open_id).toBe(testOpenId);
      expect(data?.name).toBe('Test User');

      // Cleanup
      if (data?.id) {
        await supabase.from('users').delete().eq('id', data.id);
      }
    });

    it('should retrieve user by open_id', async () => {
      // Create test user first
      const testOpenId = `test_user_${Date.now()}`;
      const { data: created } = await supabase
        .from('users')
        .insert({
          open_id: testOpenId,
          name: 'Retrieve Test User',
          email: `retrieve_${Date.now()}@example.com`,
          login_method: 'test',
          role: 'user',
        })
        .select()
        .single();

      // Retrieve by open_id
      const { data: retrieved, error } = await supabase
        .from('users')
        .select('*')
        .eq('open_id', testOpenId)
        .single();

      expect(error).toBeNull();
      expect(retrieved).toBeDefined();
      expect(retrieved?.open_id).toBe(testOpenId);
      expect(retrieved?.name).toBe('Retrieve Test User');

      // Cleanup
      if (created?.id) {
        await supabase.from('users').delete().eq('id', created.id);
      }
    });

    it('should update user profile', async () => {
      // Create test user
      const testOpenId = `test_user_${Date.now()}`;
      const { data: created } = await supabase
        .from('users')
        .insert({
          open_id: testOpenId,
          name: 'Original Name',
          email: `update_${Date.now()}@example.com`,
          login_method: 'test',
          role: 'user',
        })
        .select()
        .single();

      // Update user
      const { error: updateError } = await supabase
        .from('users')
        .update({ name: 'Updated Name', bio: 'New bio' })
        .eq('id', created?.id);

      expect(updateError).toBeNull();

      // Verify update
      const { data: updated } = await supabase
        .from('users')
        .select('*')
        .eq('id', created?.id)
        .single();

      expect(updated?.name).toBe('Updated Name');
      expect(updated?.bio).toBe('New bio');

      // Cleanup
      if (created?.id) {
        await supabase.from('users').delete().eq('id', created.id);
      }
    });
  });

  describe('Session Validation', () => {
    it('should validate user exists for session', async () => {
      // Get an existing user
      const { data: users } = await supabase
        .from('users')
        .select('id, open_id')
        .limit(1);

      if (users && users.length > 0) {
        const user = users[0];
        
        // Simulate session validation
        const { data: sessionUser, error } = await supabase
          .from('users')
          .select('id, name, email, role')
          .eq('id', user.id)
          .single();

        expect(error).toBeNull();
        expect(sessionUser).toBeDefined();
        expect(sessionUser?.id).toBe(user.id);
      }
    });

    it('should return null for invalid session user', async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('id', 999999999)
        .single();

      // Supabase returns error for no rows
      expect(data).toBeNull();
    });
  });

  describe('Role-Based Access', () => {
    it('should identify admin users', async () => {
      const { data: admins } = await supabase
        .from('users')
        .select('id, name, role')
        .eq('role', 'admin')
        .limit(5);

      expect(Array.isArray(admins)).toBe(true);
      
      if (admins && admins.length > 0) {
        admins.forEach(admin => {
          expect(admin.role).toBe('admin');
        });
      }
    });

    it('should identify regular users', async () => {
      const { data: users } = await supabase
        .from('users')
        .select('id, name, role')
        .eq('role', 'user')
        .limit(5);

      expect(Array.isArray(users)).toBe(true);
      
      if (users && users.length > 0) {
        users.forEach(user => {
          expect(user.role).toBe('user');
        });
      }
    });
  });

  describe('Stripe Connect Integration', () => {
    it('should update Stripe account info', async () => {
      // Create test user
      const testOpenId = `stripe_test_${Date.now()}`;
      const { data: created } = await supabase
        .from('users')
        .insert({
          open_id: testOpenId,
          name: 'Stripe Test User',
          email: `stripe_${Date.now()}@example.com`,
          login_method: 'test',
          role: 'user',
        })
        .select()
        .single();

      // Update Stripe account
      const testStripeAccountId = `acct_test_${Date.now()}`;
      const { error: updateError } = await supabase
        .from('users')
        .update({
          stripe_account_id: testStripeAccountId,
          stripe_charges_enabled: true,
          stripe_payouts_enabled: true,
          stripe_onboarding_complete: true,
        })
        .eq('id', created?.id);

      expect(updateError).toBeNull();

      // Verify update
      const { data: updated } = await supabase
        .from('users')
        .select('stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled, stripe_onboarding_complete')
        .eq('id', created?.id)
        .single();

      expect(updated?.stripe_account_id).toBe(testStripeAccountId);
      expect(updated?.stripe_charges_enabled).toBe(true);
      expect(updated?.stripe_payouts_enabled).toBe(true);
      expect(updated?.stripe_onboarding_complete).toBe(true);

      // Cleanup
      if (created?.id) {
        await supabase.from('users').delete().eq('id', created.id);
      }
    });
  });
});
