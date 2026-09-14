import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/session";
import {
  TRAJECTORY_OPTIONS,
  OUI_NON_RESERVES,
  SECURISATION_OPTIONS,
  STRATEGIE_CROISSANCE_OPTIONS,
  labelFor,
} from "@/lib/constants";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const HEADERS = [
  "Date",
  "Prenom",
  "Nom",
  "Risque accepte",
  "Positions",
  "Calendrier sortie",
  "Trajectoire",
  "Integration Mata Trading/Prod",
  "Bareme propose",
  "Structure SPV",
  "Securisation immediate",
  "Montant propose (F CFA)",
  "Comite de pilotage",
  "Strategie de croissance",
  "Remarques",
];

export async function GET() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return new Response("Unauthorized", { status: 401 });
  }

  const responses = await prisma.investorResponse.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = responses.map((r) => [
    r.createdAt.toISOString(),
    r.firstName,
    r.lastName,
    r.riskAccepted ? "Oui" : "Non",
    r.positions.join(" / "),
    r.exitTimeline ?? "",
    labelFor(TRAJECTORY_OPTIONS, r.trajectory),
    labelFor(OUI_NON_RESERVES, r.tradingProdIntegration),
    r.bareme ?? "",
    labelFor(OUI_NON_RESERVES, r.spvAgreement),
    labelFor(SECURISATION_OPTIONS, r.securisationContribution),
    r.securisationMontant?.toString() ?? "",
    r.comitePilotage ? "Oui" : "Non",
    labelFor(STRATEGIE_CROISSANCE_OPTIONS, r.strategieCroissance),
    r.remarques ?? "",
  ]);

  const csv = [HEADERS, ...rows]
    .map((row) => row.map((cell) => csvEscape(String(cell))).join(","))
    .join("\r\n");

  const bom = "﻿"; // Excel-friendly UTF-8 BOM
  const date = new Date().toISOString().slice(0, 10);

  return new Response(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mata-investisseurs-${date}.csv"`,
    },
  });
}
