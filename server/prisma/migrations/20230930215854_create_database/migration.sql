-- CreateTable
CREATE TABLE "targets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "target_week_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "target_id" TEXT NOT NULL,
    "week_day" INTEGER NOT NULL,
    CONSTRAINT "target_week_days_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "targets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "day_targets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    CONSTRAINT "day_targets_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "day_targets_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "targets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "target_week_days_target_id_week_day_key" ON "target_week_days"("target_id", "week_day");

-- CreateIndex
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");

-- CreateIndex
CREATE UNIQUE INDEX "day_targets_day_id_target_id_key" ON "day_targets"("day_id", "target_id");
