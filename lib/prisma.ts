// // // import { PrismaPg } from "@prisma/adapter-pg";
// // // import pg from "pg";
// // // import { PrismaClient } from "../prisma/generated/client";

// // // const connectionString = `${process.env.DATABASE_URL}`;

// // // const pool = new pg.Pool({ connectionString });
// // // const adapter = new PrismaPg(pool);

// // // const prismaClientSingleton = () => {
// // //   return new PrismaClient({
// // //     adapter,
// // //     log:
// // //       process.env.NODE_ENV === "development"
// // //         ? ["query", "error", "warn"]
// // //         : ["error"],
// // //   });
// // // };

// // // declare const globalThis: {
// // //   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// // // } & typeof global;

// // // const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// // // export default prisma;

// // // if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// // import { PrismaClient } from "@prisma/client";
// // import { PrismaPg } from "@prisma/adapter-pg";
// // import pg from "pg";

// // /**
// //  * Professional Singleton Pattern for Prisma 7
// //  * Prevents multiple instances during Next.js hot-reloading.
// //  */

// // const connectionString = `${process.env.DATABASE_URL}`;

// // // Use a connection pool for better performance in production
// // const pool = new pg.Pool({ connectionString });
// // const adapter = new PrismaPg(pool);

// // const prismaClientSingleton = () => {
// //   return new PrismaClient({
// //     adapter,
// //     log:
// //       process.env.NODE_ENV === "development"
// //         ? ["query", "error", "warn"]
// //         : ["error"],
// //   });
// // };

// // declare const globalThis: {
// //   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// // } & typeof global;

// // const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// // export default prisma;

// // if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import pg from "pg";

// const connectionString = `${process.env.DATABASE_URL}`;

// const pool = new pg.Pool({ connectionString });

// // FIX: Cast 'pool' to 'any' to bypass the conflicting @types/pg versions
// const adapter = new PrismaPg(pool as any);

// const prismaClientSingleton = () => {
//   return new PrismaClient({
//     adapter,
//     log:
//       process.env.NODE_ENV === "development"
//         ? ["query", "error", "warn"]
//         : ["error"],
//   });
// };

// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClientSingleton | undefined;
// };

// const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// const connectionString = `${process.env.DATABASE_URL}`;
const connectionString = process.env.DATABASE_URL; // The Pooled one

// 1. Enhanced Pool Configuration
// const pool = new pg.Pool({
//   connectionString,
//   // Neon specific: increase timeout for "cold starts"
//   connectionTimeoutMillis: 30000,
//   idleTimeoutMillis: 30000,
//   max: 10, // Limit connections in dev mode
//   ssl: {
//     rejectUnauthorized: false, // Required for many serverless PG environments
//   },
// });

const pool = new pg.Pool({
  connectionString,
  connectionTimeoutMillis: 60000, // Wait up to 60 seconds for cold starts
  idleTimeoutMillis: 30000,
  max: 10,
  ssl: {
    rejectUnauthorized: false,
  },
});

// FIX: Cast 'pool' to 'any' to bypass the conflicting @types/pg versions
const adapter = new PrismaPg(pool as any);

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
