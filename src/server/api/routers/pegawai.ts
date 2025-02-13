import { createTRPCRouter } from '@/server/api/trpc'
import { authProcedure } from '../procedures'
import { eq } from 'drizzle-orm'

export const pegawaiRouter = createTRPCRouter({
  getAllPegawai: authProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.pegawai.findMany({
      where: eq(ctx.tables.pegawai.unitId, ctx.user.unitId!),
      with: {
        unit: true,
      },
    })
  }),
})
