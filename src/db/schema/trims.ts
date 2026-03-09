import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { phases } from "./phases";

export const trims = sqliteTable("trims", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  phase_id: integer("phase_id")
    .notNull()
    .references(() => phases.id),
  name: text("name").notNull(),
  drive_type: text("drive_type", {
    enum: ["2WD", "4WD", "AWD"],
  }),
  transmission: text("transmission"),
  created_at: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
