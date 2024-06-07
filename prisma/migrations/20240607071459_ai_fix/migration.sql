BEGIN TRANSACTION;

-- Create new table with the desired constraints
CREATE TABLE "Comment_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "isAI" BOOLEAN NOT NULL DEFAULT true,
    "coachVariant" TEXT,
    "coachName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT NOT NULL, 
    "createdByPersonaId" TEXT,
    FOREIGN KEY ("createdByPersonaId") REFERENCES "Persona" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Copy data from the old table to the new one
INSERT INTO "Comment_new" SELECT * FROM "Comment";

-- Delete the old table
DROP TABLE "Comment";

-- Rename the new table to the old table's name
ALTER TABLE "Comment_new" RENAME TO "Comment";

COMMIT;