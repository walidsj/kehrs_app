import { Button } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { NextSeo } from 'next-seo'
import Link from 'next/link'

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center space-y-6">
      <NextSeo title="404 Not Found" />
      <div className="space-y-2 text-center">
        <CardTitle>404 Not Found</CardTitle>
        <CardDescription>Halaman yang Anda cari tidak ditemukan</CardDescription>
      </div>
      <Button asChild>
        <Link href="/" replace>
          Kembali ke Beranda
        </Link>
      </Button>
    </div>
  )
}
