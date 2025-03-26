import { relations } from 'drizzle-orm'
import { bigint, date, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core'

export const unit = mysqlTable('unit', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nama: varchar('nama', { length: 255 }),
})

export const user = mysqlTable('user', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nama: varchar('nama', { length: 255 }),
  username: varchar('username', { length: 255 }),
  password: varchar('password', { length: 255 }),
  unitId: bigint('unit_id', { mode: 'number', unsigned: true }),
})

export const pegawai = mysqlTable('pegawai', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nama: varchar('nama', { length: 255 }),
  unitId: bigint('unit_id', { mode: 'number', unsigned: true }),
})

export const kriteriaPenilaian = mysqlTable('kriteria_penilaian', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nama: varchar('nama', { length: 255 }),
  bobot: bigint('bobot', { mode: 'number', unsigned: true }),
})

export const opsiPenilaian = mysqlTable('opsi_penilaian', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  kriteriaPenilaianId: bigint('kriteria_penilaian_id', { mode: 'number', unsigned: true }),
  score: bigint('score', { mode: 'number', unsigned: true }),
  nama: varchar('nama', { length: 255 }),
})

export const periodePenilaian = mysqlTable('periode_penilaian', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  nama: varchar('nama', { length: 255 }),
  mulai: date('mulai'),
  selesai: date('selesai'),
})

export const penilaian = mysqlTable('penilaian', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().primaryKey(),
  unitId: bigint('unit_id', { mode: 'number', unsigned: true }),
  pegawaiId: bigint('pegawai_id', { mode: 'number', unsigned: true }),
  kriteriaPenilaianId: bigint('kriteria_penilaian_id', { mode: 'number', unsigned: true }),
  opsiPenilaianId: bigint('opsi_penilaian_id', { mode: 'number', unsigned: true }),
  periodePenilaianId: bigint('periode_penilaian_id', { mode: 'number', unsigned: true }),
  keterangan: text('keterangan'),
})

export const kriteriaPenilaianRelations = relations(kriteriaPenilaian, ({ many }) => ({
  opsiPenilaian: many(opsiPenilaian),
}))

export const opsiPenilaianRelations = relations(opsiPenilaian, ({ one }) => ({
  kriteriaPenilaian: one(kriteriaPenilaian, {
    fields: [opsiPenilaian.kriteriaPenilaianId],
    references: [kriteriaPenilaian.id],
  }),
}))

export const pegawaiRelations = relations(pegawai, ({ one }) => ({
  unit: one(unit, {
    fields: [pegawai.unitId],
    references: [unit.id],
  }),
}))

export const unitRelations = relations(unit, ({ many }) => ({
  pegawai: many(pegawai),
}))

export const penilaianRelations = relations(penilaian, ({ one }) => ({
  unit: one(unit, {
    fields: [penilaian.unitId],
    references: [unit.id],
  }),
  pegawai: one(pegawai, {
    fields: [penilaian.pegawaiId],
    references: [pegawai.id],
  }),
  kriteriaPenilaian: one(kriteriaPenilaian, {
    fields: [penilaian.kriteriaPenilaianId],
    references: [kriteriaPenilaian.id],
  }),
  opsiPenilaian: one(opsiPenilaian, {
    fields: [penilaian.opsiPenilaianId],
    references: [opsiPenilaian.id],
  }),
  periodePenilaian: one(periodePenilaian, {
    fields: [penilaian.periodePenilaianId],
    references: [periodePenilaian.id],
  }),
}))
