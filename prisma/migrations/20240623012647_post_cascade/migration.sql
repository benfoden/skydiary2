-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "isAI" BOOLEAN NOT NULL DEFAULT true,
    "createdByPersonaId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coachVariant" TEXT,
    "coachName" TEXT,
    "postId" TEXT NOT NULL,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_createdByPersonaId_fkey" FOREIGN KEY ("createdByPersonaId") REFERENCES "Persona" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment2" ("coachName", "coachVariant", "content", "createdAt", "createdByPersonaId", "id", "isAI", "postId") SELECT "coachName", "coachVariant", "content", "createdAt", "createdByPersonaId", "id", "isAI", "postId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment2" RENAME TO "Comment";
PRAGMA foreign_key_check("Comment");
PRAGMA foreign_keys=ON;
