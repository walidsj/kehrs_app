import { createTRPCRouter } from '@/server/api/trpc'
import { authProcedure } from '../procedures'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const periodePenilaianRouter = createTRPCRouter({
  getAllPeriodePenilaian: authProcedure.query(async ({ ctx }) => {
    const penilaian = await ctx.db.query.periodePenilaian.findMany()

    return penilaian.map(async (p) => {
      const isPenilaianExist = await ctx.db.query.penilaian.findFirst({
        where: and(
          eq(ctx.tables.penilaian.periodePenilaianId, p.id),
          eq(ctx.tables.penilaian.unitId, ctx.user.unitId!),
        ),
      })

      return {
        ...p,
        isPenilaianExist: !!isPenilaianExist,
      }
    })
  }),

  getPeriodePenilaianById: authProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    return await ctx.db.query.periodePenilaian.findFirst({
      where: eq(ctx.tables.periodePenilaian.id, input.id),
    })
  }),
})
