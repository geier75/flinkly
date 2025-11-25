import { describe, it, expect } from 'vitest';

describe('Gigs API', () => {
  const API_URL = 'http://localhost:3000/api/trpc';

  it('should list gigs without authentication', async () => {
    const response = await fetch(`${API_URL}/gigs.list?batch=1&input=%7B%220%22%3A%7B%7D%7D`);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data[0], null, 2).substring(0, 500));
    
    expect(data).toHaveLength(1);
    expect(data[0].result.data.json.gigs).toBeDefined();
    expect(data[0].result.data.json.gigs.length).toBeGreaterThan(0);
    
    console.log(`✅ Found ${data[0].result.data.json.gigs.length} gigs`);
  });

  it('should return gigs with correct structure', async () => {
    const response = await fetch(`${API_URL}/gigs.list?batch=1&input=%7B%220%22%3A%7B%22limit%22%3A5%7D%7D`);
    const data = await response.json();
    
    const firstGig = data[0].result.data.json.gigs[0];
    expect(firstGig).toHaveProperty('id');
    expect(firstGig).toHaveProperty('title');
    expect(firstGig).toHaveProperty('description');
    expect(firstGig).toHaveProperty('category');
    expect(firstGig).toHaveProperty('price');
    expect(firstGig).toHaveProperty('deliveryDays');
    expect(firstGig).toHaveProperty('status', 'published');
    expect(firstGig).toHaveProperty('active', true);
    expect(firstGig).toHaveProperty('seller');
    
    console.log(`✅ Gig structure is correct`);
  });

  it('should filter gigs by category', async () => {
    const response = await fetch(`${API_URL}/gigs.list?batch=1&input=%7B%220%22%3A%7B%22category%22%3A%22design%22%7D%7D`);
    const data = await response.json();
    
    const gigs = data[0].result.data.json.gigs;
    expect(gigs.length).toBeGreaterThan(0);
    
    gigs.forEach((gig: any) => {
      expect(gig.category).toBe('design');
    });
    
    console.log(`✅ Category filter works (${gigs.length} design gigs)`);
  });
});
