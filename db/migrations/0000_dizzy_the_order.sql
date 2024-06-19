CREATE TABLE `camera` (
	`uuid` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`updatedAt` text,
	`model` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `note` (
	`uuid` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`updatedAt` text,
	`text` text NOT NULL,
	`rollId` text NOT NULL,
	FOREIGN KEY (`rollId`) REFERENCES `roll`(`uuid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `roll` (
	`uuid` text PRIMARY KEY NOT NULL,
	`roll` text NOT NULL,
	`date` text NOT NULL,
	`updatedAt` text,
	`iso` integer NOT NULL,
	`cameraId` text NOT NULL,
	`phase` text NOT NULL,
	FOREIGN KEY (`cameraId`) REFERENCES `camera`(`uuid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `camera_uuid_unique` ON `camera` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `note_uuid_unique` ON `note` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `roll_uuid_unique` ON `roll` (`uuid`);