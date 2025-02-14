import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { HomeLayout } from '@/layouts/HomeLayout'
import { api } from '@/utils/api'
import { ArrowRightIcon, ClipboardListIcon } from 'lucide-react'
import { NextSeo } from 'next-seo'
import Link from 'next/link'

export function PeriodePenilaianPage() {
  const { data: periodePenilaian } = api.periodePenilaian.getAllPeriodePenilaian.useQuery()

  return (
    <div className="space-y-4">
      <NextSeo title="Pilih Periode Penilaian" />
      <div className="space-y-2">
        <CardTitle>Penilaian</CardTitle>
        <CardDescription>Pilih periode penilaian</CardDescription>
      </div>
      <div className="grid space-y-2 md:grid-cols-3">
        {periodePenilaian?.map((periode) => (
          <Card key={periode.id}>
            <CardHeader>
              <CardTitle>{periode.nama}</CardTitle>
              <CardDescription>
                {periode.mulai?.toLocaleDateString('id')} - {periode.selesai?.toLocaleDateString('id')}
              </CardDescription>
            </CardHeader>
            <CardFooter className="space-x-2">
              <Button asChild>
                <Link href={`/dashboard/penilaian/${periode.id}`}>
                  Pilih Periode <ArrowRightIcon />
                </Link>
              </Button>
              <Button
                asChild
                disabled={new Date() < new Date(periode.mulai!) || new Date() > new Date(periode.selesai!)}
                variant="outline"
              >
                <Link href={`/dashboard/penilaian/${periode.id}/detail`}>
                  Lihat Penilaian <ClipboardListIcon />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

PeriodePenilaianPage.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>
}
