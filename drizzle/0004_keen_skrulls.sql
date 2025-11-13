ALTER TABLE `users` ADD `emailVerified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `phoneVerified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `adminApproved` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `verificationLevel` enum('none','email','phone','admin') DEFAULT 'none';