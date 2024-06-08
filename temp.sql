-- Step 1: Create a new table with the additional column
CREATE TABLE "new_Persona" (
  "id" TEXT PRIMARY KEY NOT NULL,
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
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  "createdById" TEXT NOT NULL,
  FOREIGN KEY ("createdById") REFERENCES "User"("id")
);

-- Step 2: Copy data from the old table to the new table
INSERT INTO "new_Persona" ("id", "name", "description", "image", "age", "gender", "occupation", "traits", "communicationStyle", "communicationSample", "createdAt", "updatedAt", "createdById")
SELECT "id", "name", "description", "image", "age", "gender", "occupation", "traits", "communicationStyle", "communicationSample", "createdAt", "updatedAt", "createdById" FROM "Persona";

-- Step 3: Drop the old table
DROP TABLE "Persona";

-- Step 4: Rename the new table to the original name
ALTER TABLE "new_Persona" RENAME TO "Persona";