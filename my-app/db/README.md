# Database Structure

This directory contains all database-related code and seed scripts for the Tactical OPS application.

## Structure

- `db.ts` - Main database client instantiation and configuration
- `index.ts` - Exports for easy importing throughout the application
- `seeds/` - Individual seed data files for each model

## Seed Data

The seed data is organized into separate files for better maintainability:

- `users.ts` - Admin, Analyst, Operator, and Viewer user accounts
- `agents.ts` - Field operative agents with various statuses and skills
- `operations.ts` - Mission data with different statuses and risk levels
- `operation-agents.ts` - Junction data linking agents to operations with roles
- `intelligence-reports.ts` - Intel reports with classifications and content
- `system-components.ts` - Infrastructure components with status and metrics
- `activity-logs.ts` - System and operation activity logs
- `chat-messages.ts` - Encrypted communication messages
- `system-stats.ts` - Aggregated statistics for dashboard displays

## Usage

To seed the database with all data:

```bash
npm run db:seed
```

This will run the main seed script (`seed.ts`) which orchestrates all the individual seed operations in the correct order to maintain data integrity.

## Data Relationships

The seed scripts maintain proper relationships between entities:

1. Users create activity logs and send chat messages
2. Agents are assigned to operations and participate in communications
3. Operations have agents and intelligence reports
4. System components generate activity logs
5. Activity logs reference all other entities for audit trails

## Development

When modifying the seed data:

1. Update the appropriate seed file in the `seeds/` directory
2. Run the seed script to update the database
3. Check the console output for any errors
