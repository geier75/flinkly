CREATE TABLE `disputes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`buyerId` int NOT NULL,
	`sellerId` int NOT NULL,
	`gigId` int NOT NULL,
	`reason` enum('not_delivered','poor_quality','wrong_service','communication_issue','other') NOT NULL,
	`description` text NOT NULL,
	`status` enum('open','mediation','resolved','closed') NOT NULL DEFAULT 'open',
	`resolution` enum('pending','refund_full','refund_partial','revision_requested','buyer_favor','seller_favor','no_action') DEFAULT 'pending',
	`buyerEvidence` text,
	`sellerEvidence` text,
	`adminId` int,
	`adminNotes` text,
	`mediationStartedAt` timestamp,
	`resolvedAt` timestamp,
	`refundAmount` int,
	`refundReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `disputes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fraudAlerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`type` enum('rapid_creation','unusual_orders','price_manipulation','review_bombing','suspicious_device') NOT NULL,
	`severity` enum('low','medium','high','critical') NOT NULL,
	`description` text NOT NULL,
	`metadata` text,
	`status` enum('pending','reviewed','resolved','false_positive') NOT NULL DEFAULT 'pending',
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fraudAlerts_id` PRIMARY KEY(`id`)
);
