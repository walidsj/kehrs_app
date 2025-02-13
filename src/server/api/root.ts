import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'
import { authRouter } from './routers/auth'
import { unitRouter } from './routers/unit'
import { periodePenilaianRouter } from './routers/periode-penilaian'
import { penilaianRouter } from './routers/penilaian'
import { pegawaiRouter } from './routers/pegawai'
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  unit: unitRouter,
  periodePenilaian: periodePenilaianRouter,
  penilaian: penilaianRouter,
  pegawai: pegawaiRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
