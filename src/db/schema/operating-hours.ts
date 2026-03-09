import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { parkingLots } from "./parking-lots";

export const operatingHours = sqliteTable("operating_hours", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  parking_lot_id: integer("parking_lot_id")
    .notNull()
    .references(() => parkingLots.id),
  day_of_week: integer("day_of_week").notNull(), // 0(日) - 6(土)
  open_time: text("open_time"),
  close_time: text("close_time"),
  is_24h: integer("is_24h", { mode: "boolean" }).default(false),
  created_at: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
