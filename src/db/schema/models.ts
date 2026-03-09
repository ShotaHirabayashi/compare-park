import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { makers } from "./makers";

export const models = sqliteTable("models", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  maker_id: integer("maker_id")
    .notNull()
    .references(() => makers.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  body_type: text("body_type", {
    enum: ["sedan", "suv", "minivan", "compact", "wagon", "coupe", "truck"],
  }).notNull(),
  is_popular: integer("is_popular", { mode: "boolean" }).default(false),
  image_url: text("image_url"),
  created_at: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
