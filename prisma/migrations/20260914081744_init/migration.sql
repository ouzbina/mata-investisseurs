-- CreateTable
CREATE TABLE "investor_responses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "riskAccepted" BOOLEAN NOT NULL,
    "positions" TEXT[],
    "exitTimeline" TEXT,
    "trajectory" TEXT NOT NULL,
    "tradingProdIntegration" TEXT NOT NULL,
    "bareme" TEXT,
    "spvAgreement" TEXT NOT NULL,
    "securisationContribution" TEXT NOT NULL,
    "securisationMontant" DOUBLE PRECISION,
    "comitePilotage" BOOLEAN NOT NULL,
    "strategieCroissance" TEXT NOT NULL,
    "remarques" TEXT,

    CONSTRAINT "investor_responses_pkey" PRIMARY KEY ("id")
);
