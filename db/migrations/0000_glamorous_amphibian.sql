CREATE TABLE `idea` (
	`uuid` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`updatedAt` text,
	`text` text NOT NULL,
	`labelId` text NOT NULL,
	FOREIGN KEY (`labelId`) REFERENCES `label`(`uuid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `label` (
	`uuid` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`date` text NOT NULL,
	`updatedAt` text,
	`lastUsedAt` text,
	`icon` text NOT NULL,
	`color` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idea_uuid_unique` ON `idea` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `label_uuid_unique` ON `label` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `label_text_unique` ON `label` (`text`);