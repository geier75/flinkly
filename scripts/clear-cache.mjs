import { createClient } from 'redis';

async function clearCache() {
  console.log('🗑️  Clearing Redis cache...');
  
  const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  try {
    await client.connect();
    console.log('✓ Connected to Redis');
    
    // Clear all gigs-related cache keys
    const keys = await client.keys('gigs:*');
    console.log(`Found ${keys.length} cache keys to delete`);
    
    if (keys.length > 0) {
      await client.del(keys);
      console.log('✅ Cache cleared successfully!');
    } else {
      console.log('ℹ️  No cache keys found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.quit();
  }
}

clearCache().catch(console.error);
