CREATE TABLE `dimensions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trim_id` integer NOT NULL,
	`length_mm` integer,
	`width_mm` integer,
	`width_with_mirrors_mm` integer,
	`height_mm` integer,
	`weight_kg` integer,
	`min_turning_radius_m` real,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`trim_id`) REFERENCES `trims`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `generations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`model_id` integer NOT NULL,
	`name` text NOT NULL,
	`start_year` integer,
	`end_year` integer,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`model_id`) REFERENCES `models`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `makers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`country` text,
	`logo_url` text,
	`display_order` integer DEFAULT 0,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `makers_slug_unique` ON `makers` (`slug`);--> statement-breakpoint
CREATE TABLE `models` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`maker_id` integer NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`body_type` text NOT NULL,
	`is_popular` integer DEFAULT false,
	`image_url` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`maker_id`) REFERENCES `makers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `models_slug_unique` ON `models` (`slug`);--> statement-breakpoint
CREATE TABLE `operating_hours` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`parking_lot_id` integer NOT NULL,
	`day_of_week` integer NOT NULL,
	`open_time` text,
	`close_time` text,
	`is_24h` integer DEFAULT false,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`parking_lot_id`) REFERENCES `parking_lots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `parking_fees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`parking_lot_id` integer NOT NULL,
	`fee_type` text NOT NULL,
	`amount_yen` integer NOT NULL,
	`duration_minutes` integer,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`parking_lot_id`) REFERENCES `parking_lots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `parking_lots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`address` text,
	`latitude` real,
	`longitude` real,
	`parking_type` text,
	`total_spaces` integer,
	`operator` text,
	`phone` text,
	`url` text,
	`notes` text,
	`source_url` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `parking_lots_slug_unique` ON `parking_lots` (`slug`);--> statement-breakpoint
CREATE TABLE `phases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`generation_id` integer NOT NULL,
	`name` text NOT NULL,
	`start_date` text,
	`end_date` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`generation_id`) REFERENCES `generations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `trims` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`phase_id` integer NOT NULL,
	`name` text NOT NULL,
	`drive_type` text,
	`transmission` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`phase_id`) REFERENCES `phases`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vehicle_restrictions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`parking_lot_id` integer NOT NULL,
	`restriction_name` text NOT NULL,
	`max_length_mm` integer,
	`max_width_mm` integer,
	`max_height_mm` integer,
	`max_weight_kg` integer,
	`spaces_count` integer,
	`monthly_fee_yen` integer,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`parking_lot_id`) REFERENCES `parking_lots`(`id`) ON UPDATE no action ON DELETE no action
);
