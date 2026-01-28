CREATE TABLE `camera` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`createdAt` text NOT NULL,
	`updatedAt` text,
	`sortOrder` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `camera_id_unique` ON `camera` (`id`);--> statement-breakpoint
CREATE TABLE `roll_photo` (
	`id` text PRIMARY KEY NOT NULL,
	`rollId` text NOT NULL,
	`uri` text NOT NULL,
	`createdAt` text NOT NULL,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`rollId`) REFERENCES `roll`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roll_photo_id_unique` ON `roll_photo` (`id`);--> statement-breakpoint
CREATE TABLE `roll` (
	`id` text PRIMARY KEY NOT NULL,
	`cameraId` text NOT NULL,
	`filmStock` text NOT NULL,
	`status` text DEFAULT 'EXPOSING' NOT NULL,
	`frameCount` integer DEFAULT 36 NOT NULL,
	`framesShot` integer,
	`iso` integer,
	`notes` text,
	`createdAt` text NOT NULL,
	`updatedAt` text,
	`exposingAt` text,
	`exposedAt` text,
	`developedAt` text,
	`archivedAt` text,
	`abandonedAt` text,
	FOREIGN KEY (`cameraId`) REFERENCES `camera`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roll_id_unique` ON `roll` (`id`);