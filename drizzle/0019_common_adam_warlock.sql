ALTER TABLE `orders` ADD `platformFeePercent` int DEFAULT 15 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `platformFee` int NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `sellerEarnings` int NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` ADD `platformFee` int NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` ADD `sellerEarnings` int NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` ADD `transferId` varchar(255);