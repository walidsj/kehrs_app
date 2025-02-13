import { createTRPCRouter } from '@/server/api/trpc'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { authProcedure } from '../procedures'

export const unitRouter = createTRPCRouter({
  getUserUnit: authProcedure.query(async ({ ctx }) => {
    const unit = await ctx.db.query.unit.findFirst({
      where: eq(ctx.tables.unit.id, ctx.user.id),
    })

    if (!unit) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Unit tidak ditemukan.',
      })
    }

    return unit
  }),
})
