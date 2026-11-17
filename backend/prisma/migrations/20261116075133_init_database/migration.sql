-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'MARKETING_EMPLOYEE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "AuthIdentity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AuthIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "revokedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BenchmarkSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdPlatform" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Benchmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "currency" TEXT,
    "reportYear" INTEGER NOT NULL,
    "collectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "sourceUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Benchmark_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "BenchmarkSource" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Benchmark_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Benchmark_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Benchmark_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "AdPlatform" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sellingPriceMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "costRate" REAL NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Product_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Scenario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Scenario_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScenarioSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scenarioId" TEXT NOT NULL,
    "inputData" TEXT NOT NULL,
    "resultData" TEXT NOT NULL,
    "benchmarkReferences" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScenarioSnapshot_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BenchmarkRefreshRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "recordsFetched" INTEGER NOT NULL DEFAULT 0,
    "recordsImported" INTEGER NOT NULL DEFAULT 0,
    "recordsRejected" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    CONSTRAINT "BenchmarkRefreshRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BackupLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "fileName" TEXT,
    "fileSize" BIGINT,
    "checksum" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "errorMessage" TEXT,
    CONSTRAINT "BackupLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AuthIdentity_userId_idx" ON "AuthIdentity"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthIdentity_provider_providerUserId_key" ON "AuthIdentity"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_familyId_idx" ON "RefreshToken"("familyId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Industry_code_key" ON "Industry"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AdPlatform_code_key" ON "AdPlatform"("code");

-- CreateIndex
CREATE INDEX "Benchmark_countryId_industryId_platformId_idx" ON "Benchmark"("countryId", "industryId", "platformId");

-- CreateIndex
CREATE INDEX "Benchmark_metricType_verificationStatus_idx" ON "Benchmark"("metricType", "verificationStatus");

-- CreateIndex
CREATE INDEX "Benchmark_reportYear_idx" ON "Benchmark"("reportYear");

-- CreateIndex
CREATE UNIQUE INDEX "Benchmark_sourceId_countryId_industryId_platformId_metricType_reportYear_key" ON "Benchmark"("sourceId", "countryId", "industryId", "platformId", "metricType", "reportYear");

-- CreateIndex
CREATE INDEX "Product_createdBy_idx" ON "Product"("createdBy");

-- CreateIndex
CREATE INDEX "Product_deletedAt_idx" ON "Product"("deletedAt");

-- CreateIndex
CREATE INDEX "Scenario_userId_idx" ON "Scenario"("userId");

-- CreateIndex
CREATE INDEX "Scenario_productId_idx" ON "Scenario"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioSnapshot_scenarioId_key" ON "ScenarioSnapshot"("scenarioId");

-- CreateIndex
CREATE INDEX "BenchmarkRefreshRun_status_idx" ON "BenchmarkRefreshRun"("status");

-- CreateIndex
CREATE INDEX "BenchmarkRefreshRun_startedAt_idx" ON "BenchmarkRefreshRun"("startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- CreateIndex
CREATE INDEX "BackupLog_type_createdAt_idx" ON "BackupLog"("type", "createdAt");

-- CreateIndex
CREATE INDEX "BackupLog_status_idx" ON "BackupLog"("status");

-- CreateIndex
CREATE INDEX "BackupLog_userId_idx" ON "BackupLog"("userId");
