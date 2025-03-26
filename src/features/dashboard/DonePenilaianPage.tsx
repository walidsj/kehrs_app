import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { HomeLayout } from '@/layouts/HomeLayout'
import { HomeIcon } from 'lucide-react'
import { NextSeo } from 'next-seo'
import Link from 'next/link'

export function DonePenilaianPage() {
  return (
    <div className="space-y-4">
      <NextSeo title="Pilih Periode Penilaian" />
      <div className="space-y-2">
        <CardTitle>Penilaian Sudah Dilakukan</CardTitle>
      </div>
      <Card className="bg-green-100">
        <CardHeader>
          Terima kasih atas partisipasinya atas penilaian yang dilakukan, mari bersama-sama selalu kita terapkan budaya
          kerja yang baik di lingkungan RSJD AHM untuk mewujudkan pelyanan yang prima.
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href={`/dashboard/penilaian`}>
              Kembali ke Beranda
              <HomeIcon />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

DonePenilaianPage.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>
}
