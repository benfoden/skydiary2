import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

export const libsql = createClient({
  url: "file:./dev.db" ?? "",
  authToken: env.DATABASE_AUTH_TOKEN,
  syncUrl: env.DATABASE_URL,
  encryptionKey: env.DATABASE_ENCRYPTION_KEY ?? "",
  syncInterval: 60,
});

const adapter = new PrismaLibSQL(libsql);

const createPrismaClient = () =>
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
