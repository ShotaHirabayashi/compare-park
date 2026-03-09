import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { parkingLots } from "./parking-lots";

export const vehicleRestrictions = sqliteTable("vehicle_restrictions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  parking_lot_id: integer("parking_lot_id")
    .notNull()
    .references(() => parkingLots.id),
  restriction_name: text("restriction_name").notNull(),
  max_length_mm: integer("max_length_mm"),
  max_width_mm: integer("max_width_mm"),
  max_height_mm: integer("max_height_mm"),
  max_weight_kg: integer("max_weight_kg"),
  spaces_count: integer("spaces_count"),
  monthly_fee_yen: integer("monthly_fee_yen"),
  notes: text("notes"),
  created_at: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
