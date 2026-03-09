import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { parkingLots } from "./parking-lots";

export const parkingFees = sqliteTable("parking_fees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  parking_lot_id: integer("parking_lot_id")
    .notNull()
    .references(() => parkingLots.id),
  fee_type: text("fee_type", {
    enum: ["hourly", "daily", "monthly"],
  }).notNull(),
  amount_yen: integer("amount_yen").notNull(),
  duration_minutes: integer("duration_minutes"),
  notes: text("notes"),
  created_at: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
