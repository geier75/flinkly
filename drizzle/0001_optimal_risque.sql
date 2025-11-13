CREATE TABLE `gigs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(64) NOT NULL,
	`price` int NOT NULL,
	`deliveryDays` int NOT NULL DEFAULT 3,
	`imageUrl` text,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`active` boolean DEFAULT true,
	`completedOrders` int DEFAULT 0,
	`averageRating` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gigs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`buyerId` int NOT NULL,
	`sellerId` int NOT NULL,
	`invoiceNumber` varchar(32) NOT NULL,
	`amount` int NOT NULL,
	`vatAmount` int NOT NULL,
	`totalAmount` int NOT NULL,
	`pdfUrl` varchar(512),
	`status` enum('draft','sent','paid','cancelled') DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gigId` int NOT NULL,
	`buyerId` int NOT NULL,
	`sellerId` int NOT NULL,
	`status` enum('pending','in_progress','preview','delivered','revision','completed','disputed','cancelled') DEFAULT 'pending',
	`totalPrice` int NOT NULL,
	`buyerMessage` text,
	`sellerDelivery` text,
	`deliveryDate` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) DEFAULT 'EUR',
	`status` enum('pending','processing','paid','failed') DEFAULT 'pending',
	`payoutMethod` varchar(32) DEFAULT 'bank_transfer',
	`stripePayoutId` varchar(255),
	`transactionIds` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`paidAt` timestamp,
	CONSTRAINT `payouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`gigId` int NOT NULL,
	`reviewerId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`buyerId` int NOT NULL,
	`sellerId` int NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) DEFAULT 'EUR',
	`paymentMethod` varchar(32),
	`paymentIntentId` varchar(255),
	`status` enum('pending','authorized','captured','refunded','failed') DEFAULT 'pending',
	`escrowReleaseDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `userType` enum('buyer','seller','both') DEFAULT 'both';--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `country` varchar(2);--> statement-breakpoint
ALTER TABLE `users` ADD `verified` boolean DEFAULT false;