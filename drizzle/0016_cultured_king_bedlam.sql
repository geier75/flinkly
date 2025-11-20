CREATE TABLE `paymentMethods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripePaymentMethodId` varchar(255) NOT NULL,
	`last4` varchar(4) NOT NULL,
	`brand` varchar(32) NOT NULL,
	`expiryMonth` int NOT NULL,
	`expiryYear` int NOT NULL,
	`isDefault` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `paymentMethods_id` PRIMARY KEY(`id`),
	CONSTRAINT `paymentMethods_stripePaymentMethodId_unique` UNIQUE(`stripePaymentMethodId`)
);
