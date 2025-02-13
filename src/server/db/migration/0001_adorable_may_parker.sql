CREATE TABLE `periode_penilaian` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`nama` varchar(255),
	`mulai` date,
	`selesai` date,
	CONSTRAINT `periode_penilaian_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `penilaian` RENAME COLUMN `tanggal` TO `periode_penilaian_id`;--> statement-breakpoint
ALTER TABLE `penilaian` MODIFY COLUMN `periode_penilaian_id` bigint unsigned;