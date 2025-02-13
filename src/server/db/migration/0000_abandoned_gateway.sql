CREATE TABLE `kriteria_penilaian` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nama` varchar(255),
	`bobot` bigint unsigned,
	CONSTRAINT `kriteria_penilaian_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opsi_penilaian` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`kriteria_penilaian_id` bigint unsigned,
	`score` bigint unsigned,
	`nama` varchar(255),
	CONSTRAINT `opsi_penilaian_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pegawai` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nama` varchar(255),
	`unit_id` bigint unsigned,
	CONSTRAINT `pegawai_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `penilaian` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`pegawai_id` bigint unsigned,
	`kriteria_penilaian_id` bigint unsigned,
	`opsi_penilaian_id` bigint unsigned,
	`tanggal` date,
	CONSTRAINT `penilaian_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `unit` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nama` varchar(255),
	CONSTRAINT `unit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nama` varchar(255),
	`username` varchar(255),
	`password` varchar(255),
	`unit_id` bigint unsigned,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
