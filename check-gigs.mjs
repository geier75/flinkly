import { getDb } from './server/db.js';

const db = await getDb();
const result = await db.execute('SELECT COUNT(*) as count FROM gigs');
console.log('Total gigs:', result[0][0].count);

const packages = await db.execute('SELECT COUNT(*) as count FROM gigPackages');
console.log('Total packages:', packages[0][0].count);
process.exit(0);
