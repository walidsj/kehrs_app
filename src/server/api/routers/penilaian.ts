import { createTRPCRouter } from '@/server/api/trpc'
import { authProcedure } from '../procedures'
import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

export const penilaianRouter = createTRPCRouter({
  getAllKriteriaPenilaian: authProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.kriteriaPenilaian.findMany({
      with: {
        opsiPenilaian: true,
      },
    })
  }),

  createPenilaian: authProcedure
    .input(
      z.array(
        z.object({
          unitId: z.number(),
          pegawaiId: z.number(),
          kriteriaPenilaianId: z.number(),
          opsiPenilaianId: z.number(),
          periodePenilaianId: z.number(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      const [action] = await ctx.db.insert(ctx.tables.penilaian).values(input)

      return {
        message: 'Penilaian berhasil disimpan',
        affectedRows: action.affectedRows,
      }
    }),

  getPenilaianByPeriodeAndUnit: authProcedure
    .input(z.object({ periodePenilaianId: z.number(), unitId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.penilaian.findMany({
        where: and(
          eq(ctx.tables.penilaian.periodePenilaianId, input.periodePenilaianId),
          eq(ctx.tables.penilaian.unitId, input.unitId),
        ),
        with: {
          pegawai: true,
          kriteriaPenilaian: true,
          opsiPenilaian: true,
          unit: true,
        },
      })
    }),
})
