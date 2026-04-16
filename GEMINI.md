# Tompita (トメピタ) - Car x Parking Matching Media

"Tompita" (トメピタ) is a specialized search-based media site designed for Tokyo's 23 wards. It determines if a specific car model can be parked in a particular parking lot, with a primary focus on mechanical parking systems. The site serves two main audiences: potential car buyers checking home parking compatibility and drivers looking for suitable parking while out.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** LibSQL / SQLite (using `@libsql/client` and `better-sqlite3`)
- **ORM:** Drizzle ORM
- **Content:** MDX (via `next-mdx-remote`) for articles and car guides
- **Deployment:** Vercel

## Project Structure

- `src/app/`: Next.js App Router routes (e.g., `/car/[slug]`, `/parking/[id]`, `/area/[ward]`).
- `src/db/schema/`: Drizzle ORM schema definitions.
  - Car data is hierarchical: `Maker` -> `Model` -> `Generation` -> `Phase` -> `Trim` -> `Dimension`.
  - Parking data: `ParkingLot`, `VehicleRestriction`, `ParkingFee`, `OperatingHours`.
- `src/lib/matching.ts`: Core business logic for car-to-parking matching.
- `src/instrumentation.ts`: Sentry SDK initialization and Next.js integration.
- `sentry.*.config.ts`: Sentry configuration for client, server, and edge runtimes.
- `src/scripts/`: Scraping scripts (Times, Repark) and data import utilities.
- `content/`: MDX files for car guides, knowledge articles, and size guides.
- `data/`: CSV files containing raw parking lot data.

## Core Matching Logic (`src/lib/matching.ts`)

Matching is based on Dimensions (Length, Width, Height, Weight) vs. Restrictions.
- **OK (Green):** All dimensions are ≤ 95% of the limit.
- **Caution (Yellow):** Any dimension is between 95% and 100% of the limit.
- **NG (Red):** Any dimension exceeds the limit.

## Key Commands

### Development
- `npm run dev`: Start the development server.
- `npm run lint`: Run ESLint.
- `npm run build`: Build for production.

### Database
- `npm run db:generate`: Generate SQL migration files.
- `npm run db:migrate`: Apply migrations to the database.
- `npm run db:push`: Push schema changes directly (for local dev).
- `npm run db:seed`: Seed initial car and parking data.
- `npm run db:import-csv`: Import parking data from `data/*.csv`.
- `npm run db:studio`: Open Drizzle Studio for database exploration.

### Data Collection
- `npm run scrape:times`: Scrape Times parking lot data.
- `npm run scrape:repark`: Scrape Repark parking lot data.

## Development Conventions

- **Surgical Updates:** When modifying existing logic or components, maintain the existing style and architectural patterns (e.g., keeping business logic in `src/lib`).
- **MDX Content:** New articles or car guides should be added as `.mdx` files in the `content/` directory. Metadata is managed via frontmatter.
- **Schema Safety:** Always use `npm run db:generate` and `npm run db:migrate` for schema changes to keep migrations in sync.
- **Japanese Focus:** The application is targeted at the Japanese market; UI labels, matching reasons, and content are primarily in Japanese.
