import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../server/routers';
import type { TrpcContext } from '../../server/_core/context';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: (): TrpcContext => ({
      req: request as any,
      res: null as any,
      user: null,
    }),
  });
}
