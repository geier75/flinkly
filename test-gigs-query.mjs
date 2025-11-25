/**
 * Test script to verify gigs.list tRPC query
 */

const response = await fetch('http://localhost:3000/api/trpc/gigs.list?input=%7B%22json%22%3A%7B%22limit%22%3A20%7D%7D');
const data = await response.json();

console.log('=== GIGS.LIST QUERY TEST ===');
console.log('Status:', response.status);
console.log('Response:', JSON.stringify(data, null, 2));

if (data.result?.data?.json?.gigs) {
  console.log('\n✅ SUCCESS: Got', data.result.data.json.gigs.length, 'gigs');
  console.log('First gig:', data.result.data.json.gigs[0]?.title);
} else if (data.error) {
  console.log('\n❌ ERROR:', data.error.json?.message || data.error);
} else {
  console.log('\n⚠️  UNEXPECTED RESPONSE STRUCTURE');
}
