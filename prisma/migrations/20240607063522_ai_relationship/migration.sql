/*
  Warnings:

  - You are about to drop the column `coachName` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `coachVariant` on the `Comment` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "relationship" TEXT,
    "occupation" TEXT,
    "traits" TEXT NOT NULL,
    "communicationStyle" TEXT,
    "communicationSample" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "Persona_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "isAI" BOOLEAN NOT NULL DEFAULT true,
    "createdByPersonaId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT NOT NULL,
    CONSTRAINT "Comment_createdByPersonaId_fkey" FOREIGN KEY ("createdByPersonaId") REFERENCES "Persona" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("content", "createdAt", "id", "isAI", "postId") SELECT "content", "createdAt", "id", "isAI", "postId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
PRAGMA foreign_key_check("Comment");
PRAGMA foreign_keys=ON;
