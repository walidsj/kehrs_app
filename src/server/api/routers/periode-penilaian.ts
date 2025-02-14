import { createTRPCRouter } from '@/server/api/trpc'
import { authProcedure } from '../procedures'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const periodePenilaianRouter = createTRPCRouter({
  getAllPeriodePenilaian: authProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.periodePenilaian.findMany()
  }),

  getPeriodePenilaianById: authProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    return await ctx.db.query.periodePenilaian.findFirst({
      where: eq(ctx.tables.periodePenilaian.id, input.id),
    })
  }),
})
