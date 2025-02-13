import { TRPCError } from '@trpc/server'
import { t } from '../trpc'
import { jwtVerify } from 'jose'
import { env } from '@/env'
import { eq } from 'drizzle-orm'

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const authToken = ctx.req.cookies.Authorization

  if (!authToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authorized.',
    })
  }

  // Verify JWT
  try {
    const { payload } = await jwtVerify(authToken, new TextEncoder().encode(env.JWT_SECRET), {
      algorithms: ['HS256'],
      issuer: env.NEXT_PUBLIC_BASE_URL,
      audience: env.NEXT_PUBLIC_BASE_URL,
    })

    const user = await ctx.db.query.user.findFirst({
      where: eq(ctx.tables.user.id, parseInt(payload.sub!)),
    })

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authorized.',
      })
    }

    return next({
      ctx: {
        ...ctx,
        user,
      },
    })
  } catch (_error) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authorized.',
    })
  }
})
