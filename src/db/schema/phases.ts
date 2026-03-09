import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { generations } from "./generations";

export const phases = sqliteTable("phases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  generation_id: integer("generation_id")
    .notNull()
    .references(() => generations.id),
  name: text("name").notNull(),
  start_date: text("start_date"),
  end_date: text("end_date"),
  created_at: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
