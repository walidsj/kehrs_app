import { z } from 'zod'
import { createTRPCRouter } from '@/server/api/trpc'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import cookie from 'cookie'
import { SignJWT } from 'jose'
import { env } from '@/env'
import { authProcedure, publicProcedure } from '../procedures'

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        remember: z.coerce.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.user.findFirst({
        where: eq(ctx.tables.user.username, input.username),
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User tidak terdaftar.',
        })
      }

      if (!bcrypt.compareSync(input.password, user.password!)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Kata sandi salah.',
        })
      }

      const authToken = await new SignJWT()
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        // .setIssuer(env.NEXT_PUBLIC_BASE_URL)
        // .setAudience(env.NEXT_PUBLIC_BASE_URL)
        .setSubject(user.id.toString())
        .setExpirationTime(input.remember ? '30d' : '7d')
        .sign(new TextEncoder().encode(env.JWT_SECRET))

      ctx.res.setHeader(
        'Set-Cookie',
        cookie.serialize('Authorization', authToken, {
          path: '/',
          httpOnly: true,
          maxAge: 60 * 60 * 24 * (input.remember ? 30 : 7),
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        }),
      )

      return true
    }),

  getProfile: authProcedure.query(async ({ ctx }) => {
    return { ...ctx.user, password: undefined }
  }),

  logout: authProcedure.mutation(async ({ ctx }) => {
    ctx.res.setHeader(
      'Set-Cookie',
      cookie.serialize('Authorization', '', {
        path: '/',
        httpOnly: true,
        maxAge: -1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      }),
    )

    return true
  }),
})
