import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const parkingLots = sqliteTable("parking_lots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  address: text("address"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  parking_type: text("parking_type", {
    enum: ["mechanical", "self_propelled", "flat", "tower"],
  }),
  total_spaces: integer("total_spaces"),
  operator: text("operator"),
  phone: text("phone"),
  url: text("url"),
  notes: text("notes"),
  source_url: text("source_url"),
  created_at: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
