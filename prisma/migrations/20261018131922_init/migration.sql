-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "busNumber" TEXT NOT NULL,
    "routeName" TEXT,
    "startingPointId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "stopId" TEXT NOT NULL,
    "stopOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StopAlias" (
    "id" TEXT NOT NULL,
    "stopId" TEXT NOT NULL,
    "aliasName" TEXT NOT NULL,
    "normalizedAlias" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StopAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "routeId" TEXT,
    "stopId" TEXT,
    "feedbackType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "suggestedStopName" TEXT,
    "suggestedStartPoint" TEXT,
    "suggestedDestination" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Route_busNumber_idx" ON "Route"("busNumber");

-- CreateIndex
CREATE INDEX "Route_startingPointId_idx" ON "Route"("startingPointId");

-- CreateIndex
CREATE INDEX "Route_destinationId_idx" ON "Route"("destinationId");

-- CreateIndex
CREATE INDEX "Stop_normalizedName_idx" ON "Stop"("normalizedName");

-- CreateIndex
CREATE INDEX "RouteStop_routeId_idx" ON "RouteStop"("routeId");

-- CreateIndex
CREATE INDEX "RouteStop_stopId_idx" ON "RouteStop"("stopId");

-- CreateIndex
CREATE UNIQUE INDEX "RouteStop_routeId_stopOrder_key" ON "RouteStop"("routeId", "stopOrder");

-- CreateIndex
CREATE INDEX "StopAlias_normalizedAlias_idx" ON "StopAlias"("normalizedAlias");

-- CreateIndex
CREATE UNIQUE INDEX "StopAlias_stopId_normalizedAlias_key" ON "StopAlias"("stopId", "normalizedAlias");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE INDEX "Feedback_status_idx" ON "Feedback"("status");

-- CreateIndex
CREATE INDEX "Feedback_routeId_idx" ON "Feedback"("routeId");

-- CreateIndex
CREATE INDEX "Feedback_stopId_idx" ON "Feedback"("stopId");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_startingPointId_fkey" FOREIGN KEY ("startingPointId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StopAlias" ADD CONSTRAINT "StopAlias_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
