ALTER TABLE `users` ADD `isCommercial` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `companyName` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `companyAddress` text;--> statement-breakpoint
ALTER TABLE `users` ADD `taxId` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `tradeRegister` varchar(255);