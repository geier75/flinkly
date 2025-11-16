CREATE INDEX `favorites_user_id_idx` ON `favorites` (`userId`);--> statement-breakpoint
CREATE INDEX `favorites_gig_id_idx` ON `favorites` (`gigId`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `gigs` (`category`);--> statement-breakpoint
CREATE INDEX `seller_id_idx` ON `gigs` (`sellerId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `gigs` (`status`);--> statement-breakpoint
CREATE INDEX `orders_status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `orders_buyer_id_idx` ON `orders` (`buyerId`);--> statement-breakpoint
CREATE INDEX `orders_seller_id_idx` ON `orders` (`sellerId`);--> statement-breakpoint
CREATE INDEX `orders_gig_id_idx` ON `orders` (`gigId`);--> statement-breakpoint
CREATE INDEX `reviews_gig_id_idx` ON `reviews` (`gigId`);--> statement-breakpoint
CREATE INDEX `reviews_reviewer_id_idx` ON `reviews` (`reviewerId`);