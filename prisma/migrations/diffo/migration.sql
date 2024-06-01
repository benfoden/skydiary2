

-- Update User Table
PRAGMA foreign_keys=OFF;
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
PRAGMA foreign_key_check("User");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "Recap_startDate_endDate_idx" ON "Recap"("startDate", "endDate");
