export const POSITION_OPTIONS = [
  {
    value: "A",
    label:
      "A — Rester actionnaire et remettre de l'argent dans Mata Group",
  },
  {
    value: "B",
    label:
      "B — Rester actionnaire, sans réinvestir nécessairement aujourd'hui, en suivant la décision collective",
  },
  {
    value: "C",
    label:
      "C — Rester actionnaire, sans remettre d'argent pour le moment, mais en participant activement à la réflexion et à la restructuration",
  },
  {
    value: "D",
    label:
      "D — Organiser ma sortie, en me mettant d'accord avec Mata sur les modalités de remboursement de mon argent investi (montant reconnu, calendrier)",
  },
  {
    value: "E",
    label:
      "E — Ne pas recapitaliser Mata Group, mais étudier l'ouverture de mon propre MaaS pour un cash-flow opérationnel direct",
  },
  {
    value: "F",
    label:
      "F — Étudier une augmentation de ma participation ou le rachat des titres d'un actionnaire qui sort",
  },
] as const;

export const TRAJECTORY_OPTIONS = [
  {
    value: "bootstrap",
    label: "Bootstrapper",
    description:
      "Continuer à développer Mata progressivement avec ses propres moyens, sans lever de fonds externes — notamment en ouvrant de nouveaux points de vente MaaS financés par les actionnaires/investisseurs intéressés.",
  },
  {
    value: "restructurer",
    label: "Restructurer puis lever des fonds",
    description:
      "Assainir l'actionnariat et les finances, se mettre aux standards du marché, puis relancer une levée de fonds dans de bonnes conditions.",
  },
  {
    value: "rien",
    label: "Ne rien décider",
    description:
      "Statu quo — à terme, cela revient à accepter la disparition de Mata (risque de dépôt de bilan).",
  },
] as const;

export const OUI_NON_RESERVES = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
  { value: "reserves", label: "Sous réserves" },
] as const;

export const SECURISATION_OPTIONS = [
  { value: "oui", label: "Oui, je suis prêt à contribuer" },
  { value: "non", label: "Non, pas pour le moment" },
  { value: "a_discuter", label: "À discuter" },
] as const;

export const OUI_NON = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
] as const;

export const STRATEGIE_CROISSANCE_OPTIONS = [
  { value: "bootstrap", label: "Poursuite en bootstrap via le développement des MaaS" },
  { value: "levee", label: "Préparation d'une levée de fonds (~1 Md F CFA)" },
  { value: "les_deux", label: "Les deux" },
  { value: "sans_opinion", label: "Sans opinion" },
] as const;

export const POSITION_VALUES = POSITION_OPTIONS.map((o) => o.value);
export const TRAJECTORY_VALUES = TRAJECTORY_OPTIONS.map((o) => o.value);
export const OUI_NON_RESERVES_VALUES = OUI_NON_RESERVES.map((o) => o.value);
export const SECURISATION_VALUES = SECURISATION_OPTIONS.map((o) => o.value);
export const OUI_NON_VALUES = OUI_NON.map((o) => o.value);
export const STRATEGIE_CROISSANCE_VALUES = STRATEGIE_CROISSANCE_OPTIONS.map(
  (o) => o.value
);

export function labelFor(
  options: readonly { value: string; label: string }[],
  value: string | null | undefined
): string {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}
