CREATE TABLE `account_deletion_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`requestedAt` timestamp NOT NULL DEFAULT (now()),
	`scheduledDeletionAt` timestamp NOT NULL,
	`reason` text,
	`status` enum('pending','cancelled','completed') NOT NULL DEFAULT 'pending',
	`cancelledAt` timestamp,
	`completedAt` timestamp,
	CONSTRAINT `account_deletion_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `account_deletion_requests_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `consent_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`consentId` varchar(64) NOT NULL,
	`timestamp` timestamp NOT NULL,
	`version` varchar(16) NOT NULL,
	`essential` boolean NOT NULL DEFAULT true,
	`statistics` boolean NOT NULL DEFAULT false,
	`marketing` boolean NOT NULL DEFAULT false,
	`personalization` boolean NOT NULL DEFAULT false,
	`hash` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consent_logs_id` PRIMARY KEY(`id`),
	CONSTRAINT `consent_logs_consentId_unique` UNIQUE(`consentId`)
);
