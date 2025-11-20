ALTER TABLE `orders` ADD `selectedPackage` enum('basic','standard','premium') DEFAULT 'basic';--> statement-breakpoint
ALTER TABLE `orders` ADD `selectedExtras` text;