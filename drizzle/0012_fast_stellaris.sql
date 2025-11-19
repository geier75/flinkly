ALTER TABLE `users` ADD `sellerLevel` enum('new','rising','level_one','top_rated') DEFAULT 'new';--> statement-breakpoint
ALTER TABLE `users` ADD `completedOrders` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `averageRating` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `responseTimeHours` int DEFAULT 24;--> statement-breakpoint
ALTER TABLE `users` ADD `onTimeDeliveryRate` int DEFAULT 100;