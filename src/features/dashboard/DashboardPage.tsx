import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { HomeLayout } from '@/layouts/HomeLayout'
import { api } from '@/utils/api'
import { ArrowRightIcon } from 'lucide-react'
import { NextSeo } from 'next-seo'
import Link from 'next/link'

export function DashboardPage() {
  const { data: unit } = api.unit.getUserUnit.useQuery()

  return (
    <div>
      <NextSeo title="Dashboard" />
      {unit && (
        <Card>
          <CardHeader>
            <CardTitle>Nama Unit</CardTitle>
            <CardDescription>Unit penilaian Anda saat ini</CardDescription>
          </CardHeader>
          <CardContent>{unit.nama}</CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/penilaian">
                Lakukan Penilaian
                <ArrowRightIcon />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

DashboardPage.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>
}
