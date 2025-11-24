ALTER TABLE `users` ADD `stripeAccountId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeOnboardingComplete` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeChargesEnabled` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripePayoutsEnabled` boolean DEFAULT false NOT NULL;