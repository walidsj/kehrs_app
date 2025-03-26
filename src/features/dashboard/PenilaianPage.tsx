import { Button } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { HomeLayout } from '@/layouts/HomeLayout'
import { api } from '@/utils/api'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'

type PenilaianItemType = {
  index: string
  unitId: number
  pegawaiId: number
  kriteriaPenilaianId: number
  opsiPenilaianId: number
  periodePenilaianId: number
  keterangan?: string
}

export function PenilaianPage() {
  const router = useRouter()

  const idPeriode = router.query.idPeriode as string

  const { data: periodePenilaian, isError } = api.periodePenilaian.getPeriodePenilaianById.useQuery(
    { id: parseInt(idPeriode) },
    { enabled: !!idPeriode },
  )

  const { data: user } = api.auth.getProfile.useQuery()
  const { data: penilaianData } = api.penilaian.getPenilaianByPeriodeAndUnit.useQuery(
    {
      periodePenilaianId: parseInt(idPeriode),
      unitId: Number(user?.unitId),
    },
    {
      enabled: !!periodePenilaian && !!user,
    },
  )

  const { data: pegawai } = api.pegawai.getAllPegawai.useQuery(undefined, {
    enabled: !!periodePenilaian,
  })
  const { data: kriteriaPenilaian } = api.penilaian.getAllKriteriaPenilaian.useQuery(undefined, {
    enabled: !!periodePenilaian,
  })

  const createPenilaianMutation = api.penilaian.createPenilaian.useMutation({
    onSuccess: (data) => {
      toast.success(data.message + ' ' + data.affectedRows + ' data')
      router.push('/dashboard/penilaian/done')
    },
  })

  const [penilaian, setPenilaian] = React.useState<PenilaianItemType[]>([])

  if (penilaianData && penilaianData?.length > 0) {
    router.push('/dashboard/penilaian/done')
  }

  function handleSubmit(values: PenilaianItemType[]) {
    console.log(values)
    createPenilaianMutation.mutate(values)
  }

  if (!periodePenilaian) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error...</div>
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(penilaian)
      }}
    >
      <NextSeo title="Penilaian" />
      <div className="space-y-2">
        <CardTitle>Penilaian</CardTitle>
        <CardDescription>Penilaian Pegawai</CardDescription>
      </div>
      {/* <code>{JSON.stringify(penilaian, null, 2)}</code> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead colSpan={2}>Nama Kriteria</TableHead>
            <TableHead>Bobot</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kriteriaPenilaian?.map((kriteria, indexKriteria) => (
            <React.Fragment key={kriteria.id}>
              <TableRow className="bg-yellow-100 text-lg">
                <TableCell className="text-center">{indexKriteria + 1}</TableCell>
                <TableCell colSpan={2}>{kriteria.nama}</TableCell>
                <TableCell>{kriteria.bobot}</TableCell>
              </TableRow>
              <React.Fragment>
                {pegawai?.map((pegawai, indexPegawai) => (
                  <TableRow key={pegawai.id}>
                    <TableCell className="text-center">
                      {indexKriteria + 1}.{indexPegawai + 1}
                    </TableCell>
                    <TableCell>{pegawai.nama}</TableCell>
                    <TableCell>
                      <RadioGroup
                        required
                        onValueChange={(value) => {
                          const indexId = (indexKriteria + 1).toString() + '.' + (indexPegawai + 1).toString()
                          const newPenilaian = penilaian.filter((item) => item.index !== indexId)

                          setPenilaian([
                            ...newPenilaian,
                            {
                              index: indexId,
                              unitId: pegawai.unitId!,
                              pegawaiId: pegawai.id,
                              kriteriaPenilaianId: kriteria.id,
                              opsiPenilaianId: parseInt(value),
                              periodePenilaianId: parseInt(idPeriode),
                            },
                          ])
                        }}
                      >
                        <div className="flex items-center space-x-6">
                          {kriteria.opsiPenilaian?.map((opsi) => (
                            <div key={opsi.id} className="flex cursor-pointer items-center space-x-1">
                              <RadioGroupItem
                                className="size-8 cursor-pointer"
                                value={opsi.id.toString()}
                                id={pegawai.id.toString() + '_' + opsi.id.toString()}
                              />
                              <Label
                                className="cursor-pointer text-xs"
                                htmlFor={pegawai.id.toString() + '_' + opsi.id.toString()}
                              >
                                {opsi.nama}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        rows={3}
                        placeholder="Keterangan Tambahan atas Penilaian"
                        onChange={(e) => {
                          const indexId = (indexKriteria + 1).toString() + '.' + (indexPegawai + 1).toString()
                          const newPenilaian = penilaian.filter((item) => item.index !== indexId)
                          const currentPenilaian = penilaian.find((item) => item.index === indexId)

                          setPenilaian([
                            ...newPenilaian,
                            {
                              index: indexId,
                              unitId: pegawai.unitId!,
                              pegawaiId: pegawai.id,
                              kriteriaPenilaianId: kriteria.id,
                              opsiPenilaianId: currentPenilaian?.opsiPenilaianId || 0,
                              periodePenilaianId: parseInt(idPeriode),
                              keterangan: e.target.value,
                            },
                          ])
                        }}
                      />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                ))}
              </React.Fragment>
            </React.Fragment>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              <Button type="submit">Simpan</Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </form>
  )
}

PenilaianPage.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>
}
