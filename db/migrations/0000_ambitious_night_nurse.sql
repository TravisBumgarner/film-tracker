CREATE TABLE `camera` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`updatedAt` text,
	`model` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `note` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`updatedAt` text,
	`text` text NOT NULL,
	`rollId` text NOT NULL,
	FOREIGN KEY (`rollId`) REFERENCES `roll`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `roll` (
	`id` text PRIMARY KEY NOT NULL,
	`roll` text NOT NULL,
	`date` text NOT NULL,
	`updatedAt` text,
	`iso` text NOT NULL,
	`cameraId` text NOT NULL,
	`phase` text NOT NULL,
	`insertedIntoCameraAt` text NOT NULL,
	`removedFromCameraAt` text,
	FOREIGN KEY (`cameraId`) REFERENCES `camera`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `camera_id_unique` ON `camera` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `note_id_unique` ON `note` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `roll_id_unique` ON `roll` (`id`);