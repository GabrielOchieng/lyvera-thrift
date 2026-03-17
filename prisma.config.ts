// import "dotenv/config";
// import { defineConfig } from "@prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   datasource: {
//     // This tells Migrate and Introspection where to connect
//     url: process.env.DATABASE_URL,
//   },
// });

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // For Prisma v7, point 'url' to your DIRECT connection.
    // This is what the CLI uses for migrations/db push.
    url: env("DIRECT_URL"),
  },
});
