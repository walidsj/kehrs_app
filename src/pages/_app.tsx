import '@/styles/globals.css'
import '@/styles/nprogress.css'
import { api } from '@/utils/api'
import type { AppProps } from 'next/app'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Router } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { NextPage } from 'next'
import favicon from '@/assets/favicon.png'
import { env } from '@/env'
import nProgress from 'nprogress'
import { Lexend } from 'next/font/google'

Router.events.on('routeChangeStart', () => nProgress.start())
Router.events.on('routeChangeComplete', () => nProgress.done())
Router.events.on('routeChangeError', () => nProgress.done())

const font = Lexend({
  subsets: ['latin'],
})

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <div className={font.className}>
      <DefaultSeo
        titleTemplate="%s - KEHRS RSJD AHM"
        defaultTitle="KEHRS - RSJD Atma Husada Mahakam"
        canonical={env.NEXT_PUBLIC_BASE_URL}
        additionalLinkTags={[{ rel: 'icon', href: favicon.src, type: 'image/png' }]}
      />
      {getLayout(<Component {...pageProps} />)}
      <Toaster />
    </div>
  )
}

export default api.withTRPC(App)
