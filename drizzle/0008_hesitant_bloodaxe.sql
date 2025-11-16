CREATE TABLE `gigStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gigId` int NOT NULL,
	`date` timestamp NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`orders` int NOT NULL DEFAULT 0,
	`revenue` int NOT NULL DEFAULT 0,
	`conversionRate` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gigStats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gigViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gigId` int NOT NULL,
	`userId` int,
	`ipHash` varchar(64),
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gigViews_id` PRIMARY KEY(`id`)
);
