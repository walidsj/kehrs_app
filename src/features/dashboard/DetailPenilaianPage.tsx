import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { HomeLayout } from '@/layouts/HomeLayout'
import { api } from '@/utils/api'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import React from 'react'

export function DetailPenilaianPage() {
  const router = useRouter()

  const idPeriode = router.query.idPeriode as string

  const { data: user } = api.auth.getProfile.useQuery()

  const { data: periodePenilaian, isError } = api.periodePenilaian.getPeriodePenilaianById.useQuery(
    { id: parseInt(idPeriode) },
    { enabled: !!idPeriode },
  )
  const { data: penilaian } = api.penilaian.getPenilaianByPeriodeAndUnit.useQuery(
    {
      periodePenilaianId: parseInt(idPeriode),
      unitId: Number(user?.unitId),
    },
    {
      enabled: !!periodePenilaian && !!user,
    },
  )

  // get list of pegawai unique from penilaian with format [{pegawaiId: 1, nama: 'John Doe'}]
  const pegawaiList = penilaian?.reduce(
    (acc, item) => {
      if (!acc.some((pegawai) => pegawai.id === item.pegawaiId)) {
        acc.push({ id: item.pegawaiId as number, nama: item.pegawai?.nama as string, unit: item.unit?.nama as string })
      }
      return acc
    },
    [] as { id: number; nama: string; unit: string }[],
  )

  const { data: kriteriaPenilaian } = api.penilaian.getAllKriteriaPenilaian.useQuery(undefined, {
    enabled: !!periodePenilaian,
  })

  if (!periodePenilaian) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error...</div>
  }

  return (
    <div className="space-y-4">
      <NextSeo title="Penilaian" />
      <div className="space-y-2">
        <CardTitle>Detail Hasil Penilaian</CardTitle>
        <CardDescription>Penilaian Pegawai</CardDescription>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{periodePenilaian.nama}</CardTitle>
          <CardDescription>
            {periodePenilaian.mulai?.toLocaleDateString('id')} - {periodePenilaian.selesai?.toLocaleDateString('id')}
          </CardDescription>
        </CardHeader>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Pegawai</TableHead>
            <TableHead>Unit</TableHead>
            {kriteriaPenilaian?.map((kriteria) => (
              <React.Fragment key={kriteria.id}>
                <TableHead key={kriteria.id} className="w-10 text-center align-top text-xs">
                  {kriteria.nama}
                </TableHead>
              </React.Fragment>
            ))}
            <TableHead className="text-center">Nilai</TableHead>
            <TableHead>Keterangan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pegawaiList?.map((pegawai, index) => {
            let totalScore = 0

            return (
              <React.Fragment key={pegawai.id}>
                <TableRow>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{pegawai.nama}</TableCell>
                  <TableCell>{pegawai.unit}</TableCell>
                  {kriteriaPenilaian?.map((kriteria) => {
                    const penilaianPegawai = penilaian?.find(
                      (item) => item.pegawaiId === pegawai.id && item.kriteriaPenilaianId === kriteria.id,
                    )

                    const maxScore = kriteria?.opsiPenilaian?.reduce((acc, item) => {
                      if (item.score! > acc) {
                        acc = item.score!
                      }
                      return acc
                    }, 0)

                    totalScore +=
                      (Number(penilaianPegawai?.opsiPenilaian?.score) / Number(maxScore)) * Number(kriteria.bobot)

                    return (
                      <React.Fragment key={kriteria.id}>
                        <TableCell className="text-center">
                          {(Number(penilaianPegawai?.opsiPenilaian?.score) / Number(maxScore)) * Number(kriteria.bobot)}
                        </TableCell>
                      </React.Fragment>
                    )
                  })}
                  <TableCell className="text-center">{totalScore}</TableCell>
                  <TableCell>
                    {penilaian
                      ?.filter((item) => item.pegawaiId === pegawai.id)
                      .map((item, key) => `${key + 1}. ${item.keterangan}`)}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

DetailPenilaianPage.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>
}
