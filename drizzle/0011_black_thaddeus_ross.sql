CREATE TABLE `gigExtras` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gigId` int NOT NULL,
	`extraType` enum('express_delivery','extra_revisions','commercial_license','source_files','custom') NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`deliveryDaysReduction` int DEFAULT 0,
	`revisionsAdded` int DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gigExtras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gigPackages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gigId` int NOT NULL,
	`packageType` enum('basic','standard','premium') NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`price` int NOT NULL,
	`deliveryDays` int NOT NULL,
	`revisions` int NOT NULL DEFAULT 1,
	`features` text,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gigPackages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `gig_extras_gig_id_idx` ON `gigExtras` (`gigId`);--> statement-breakpoint
CREATE INDEX `gig_packages_gig_id_idx` ON `gigPackages` (`gigId`);