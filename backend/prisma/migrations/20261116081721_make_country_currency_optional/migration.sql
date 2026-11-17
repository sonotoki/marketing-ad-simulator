-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Country" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Country" ("code", "createdAt", "currency", "id", "name", "updatedAt") SELECT "code", "createdAt", "currency", "id", "name", "updatedAt" FROM "Country";
DROP TABLE "Country";
ALTER TABLE "new_Country" RENAME TO "Country";
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
