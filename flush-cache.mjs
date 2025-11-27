import { flushAll } from "./server/_core/redis.ts";

console.log('Flushing Redis cache...');
await flushAll();
console.log('Cache flushed successfully!');
process.exit(0);
