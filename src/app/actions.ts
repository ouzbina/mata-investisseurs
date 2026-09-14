"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  TRAJECTORY_VALUES,
  OUI_NON_RESERVES_VALUES,
  SECURISATION_VALUES,
  STRATEGIE_CROISSANCE_VALUES,
} from "@/lib/constants";

export type SubmitState = { error?: string } | undefined;

export async function submitResponse(
  _prevState: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const riskAccepted = formData.get("riskAccepted") === "on";
  const positions = formData.getAll("positions").map(String);
  const exitTimeline = String(formData.get("exitTimeline") ?? "").trim() || null;
  const trajectory = String(formData.get("trajectory") ?? "");
  const tradingProdIntegration = String(
    formData.get("tradingProdIntegration") ?? ""
  );
  const bareme = String(formData.get("bareme") ?? "").trim() || null;
  const spvAgreement = String(formData.get("spvAgreement") ?? "");
  const securisationContribution = String(
    formData.get("securisationContribution") ?? ""
  );
  const securisationMontantRaw = String(
    formData.get("securisationMontant") ?? ""
  ).trim();
  const securisationMontant = securisationMontantRaw
    ? Number(securisationMontantRaw)
    : null;
  const comitePilotageRaw = String(formData.get("comitePilotage") ?? "");
  const strategieCroissance = String(
    formData.get("strategieCroissance") ?? ""
  );
  const remarques = String(formData.get("remarques") ?? "").trim() || null;

  if (!firstName || !lastName) {
    return { error: "Merci d'indiquer votre nom et prénom." };
  }
  if (!riskAccepted) {
    return {
      error:
        "Vous devez confirmer avoir compris le risque de perte lié à votre investissement.",
    };
  }
  if (positions.length === 0) {
    return { error: "Sélectionnez au moins une position (question 2)." };
  }
  if (positions.includes("D") && !exitTimeline) {
    return {
      error:
        "Précisez le calendrier de sortie souhaité (vous avez sélectionné l'option D).",
    };
  }
  if (!TRAJECTORY_VALUES.includes(trajectory as (typeof TRAJECTORY_VALUES)[number])) {
    return { error: "Sélectionnez une trajectoire (question 3)." };
  }
  if (
    !OUI_NON_RESERVES_VALUES.includes(
      tradingProdIntegration as (typeof OUI_NON_RESERVES_VALUES)[number]
    )
  ) {
    return {
      error: "Répondez à la question sur Mata Trading/Mata Prod (question 4).",
    };
  }
  if (tradingProdIntegration === "oui" && !bareme) {
    return { error: "Précisez le barème que vous proposez (question 5)." };
  }
  if (
    !OUI_NON_RESERVES_VALUES.includes(
      spvAgreement as (typeof OUI_NON_RESERVES_VALUES)[number]
    )
  ) {
    return { error: "Répondez à la question sur la structure SPV (question 6)." };
  }
  if (
    !SECURISATION_VALUES.includes(
      securisationContribution as (typeof SECURISATION_VALUES)[number]
    )
  ) {
    return {
      error: "Répondez à la question sur la sécurisation immédiate (question 7).",
    };
  }
  if (comitePilotageRaw !== "oui" && comitePilotageRaw !== "non") {
    return { error: "Répondez à la question sur le comité de pilotage (question 8)." };
  }
  if (
    !STRATEGIE_CROISSANCE_VALUES.includes(
      strategieCroissance as (typeof STRATEGIE_CROISSANCE_VALUES)[number]
    )
  ) {
    return { error: "Répondez à la question sur la stratégie de croissance (question 9)." };
  }

  await prisma.investorResponse.create({
    data: {
      firstName,
      lastName,
      riskAccepted,
      positions,
      exitTimeline,
      trajectory,
      tradingProdIntegration,
      bareme,
      spvAgreement,
      securisationContribution,
      securisationMontant:
        securisationMontant !== null && !Number.isNaN(securisationMontant)
          ? securisationMontant
          : null,
      comitePilotage: comitePilotageRaw === "oui",
      strategieCroissance,
      remarques,
    },
  });

  redirect("/merci");
}
