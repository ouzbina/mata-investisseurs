"use client";

import { useActionState, useState } from "react";
import { submitResponse } from "./actions";
import {
  POSITION_OPTIONS,
  TRAJECTORY_OPTIONS,
  OUI_NON_RESERVES,
  SECURISATION_OPTIONS,
  STRATEGIE_CROISSANCE_OPTIONS,
} from "@/lib/constants";

export default function Home() {
  const [state, formAction, pending] = useActionState(submitResponse, undefined);
  const [positions, setPositions] = useState<string[]>([]);
  const [tradingProdIntegration, setTradingProdIntegration] = useState("");
  const [securisationContribution, setSecurisationContribution] = useState("");

  const showExitTimeline = positions.includes("D");
  const showBareme = tradingProdIntegration === "oui";
  const showMontant = securisationContribution === "oui";

  function togglePosition(value: string) {
    setPositions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-slate-800">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          MATA GROUP
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Positionnement des investisseurs
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Suite à la réunion des investisseurs de septembre 2026, nous avons
          besoin que chaque actionnaire communique officiellement sa
          position. Merci de répondre à l&apos;ensemble des questions
          ci-dessous. Vos réponses sont transmises directement à Mata Group.
        </p>
      </header>

      <form action={formAction} className="flex flex-col gap-10">
        <Section title="Vos coordonnées">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Prénom" htmlFor="firstName">
              <input
                id="firstName"
                name="firstName"
                required
                className="input"
              />
            </Field>
            <Field label="Nom" htmlFor="lastName">
              <input id="lastName" name="lastName" required className="input" />
            </Field>
          </div>
        </Section>

        <Question number={1} title="Risque de perte">
          <p className="mb-3 text-sm text-slate-600">
            Comprenez-vous et acceptez-vous que votre investissement dans
            Mata comporte un risque de perte partielle ou totale des sommes
            investies ?
          </p>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="riskAccepted"
              className="mt-1"
              required
            />
            <span>
              Oui, je comprends et j&apos;accepte ce risque.
            </span>
          </label>
        </Question>

        <Question number={2} title="Positionnement officiel">
          <p className="mb-3 text-sm text-slate-600">
            Quelle est votre position ? Plusieurs choix sont possibles (par
            exemple rester actionnaire tout en ouvrant un MaaS).
          </p>
          <div className="flex flex-col gap-2">
            {POSITION_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  name="positions"
                  value={opt.value}
                  checked={positions.includes(opt.value)}
                  onChange={() => togglePosition(opt.value)}
                  className="mt-1"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {showExitTimeline && (
            <div className="mt-3">
              <Field
                label="Quel calendrier envisagez-vous pour la récupération de votre mise ?"
                htmlFor="exitTimeline"
              >
                <input
                  id="exitTimeline"
                  name="exitTimeline"
                  placeholder="Ex : sur 12 mois, dès que possible, etc."
                  className="input"
                />
              </Field>
            </div>
          )}
        </Question>

        <Question number={3} title="Trajectoire recommandée">
          <p className="mb-3 text-sm text-slate-600">
            Quelle trajectoire recommandez-vous pour Mata ?
          </p>
          <div className="flex flex-col gap-3">
            {TRAJECTORY_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-start gap-2 text-sm">
                <input
                  type="radio"
                  name="trajectory"
                  value={opt.value}
                  required
                  className="mt-1"
                />
                <span>
                  <span className="font-medium">{opt.label}</span>
                  <span className="block text-slate-500">
                    {opt.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </Question>

        <Question
          number={4}
          title="Intégration Mata Trading / Mata Prod + créances historiques"
        >
          <p className="mb-3 text-sm text-slate-600">
            Êtes-vous d&apos;accord pour intégrer dans l&apos;actionnariat de
            Mata Group l&apos;argent investi dans Mata Trading et Mata
            Production, ainsi que les autres créances/avances historiques
            documentées, selon un barème de conversion commun à définir
            ensemble ?
          </p>
          <div className="flex flex-col gap-2">
            {OUI_NON_RESERVES.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="tradingProdIntegration"
                  value={opt.value}
                  required
                  checked={tradingProdIntegration === opt.value}
                  onChange={(e) => setTradingProdIntegration(e.target.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </Question>

        {showBareme && (
          <Question number={5} title="Barème proposé">
            <p className="mb-3 text-sm text-slate-600">
              Quel barème de conversion proposez-vous ?
            </p>
            <textarea
              name="bareme"
              rows={3}
              className="input"
              placeholder="Décrivez la méthode ou le barème que vous proposez..."
            />
          </Question>
        )}

        <Question number={6} title="Structure SPV">
          <p className="mb-3 text-sm text-slate-600">
            Êtes-vous d&apos;accord avec la création d&apos;une structure
            SPV/umbrella regroupant 65 % des parts (autres actionnaires
            historiques, investisseurs Mata Trading/Prod, porteurs de BSA...),
            Ousmane et Saliou conservant 35 % en direct, avec possibilité de
            droits de vote renforcés à l&apos;étude, pour faciliter
            l&apos;entrée de nouveaux investisseurs ?
          </p>
          <div className="flex flex-col gap-2">
            {OUI_NON_RESERVES.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="spvAgreement"
                  value={opt.value}
                  required
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </Question>

        <Question number={7} title="Sécurisation immédiate">
          <p className="mb-3 text-sm text-slate-600">
            Êtes-vous prêt à contribuer à la sécurisation immédiate (~33,5 M
            F CFA) ?
          </p>
          <div className="flex flex-col gap-2">
            {SECURISATION_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="securisationContribution"
                  value={opt.value}
                  required
                  checked={securisationContribution === opt.value}
                  onChange={(e) => setSecurisationContribution(e.target.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {showMontant && (
            <div className="mt-3">
              <Field label="Quel montant proposez-vous (F CFA) ?" htmlFor="securisationMontant">
                <input
                  id="securisationMontant"
                  name="securisationMontant"
                  type="number"
                  min={0}
                  step="1"
                  className="input"
                />
              </Field>
            </div>
          )}
        </Question>

        <Question number={8} title="Comité de pilotage">
          <p className="mb-3 text-sm text-slate-600">
            Souhaitez-vous intégrer le comité de pilotage, avec obligation
            d&apos;assister à au moins une réunion hebdomadaire sur 3 ?
          </p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="comitePilotage" value="oui" required />
              <span>Oui</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="comitePilotage" value="non" required />
              <span>Non</span>
            </label>
          </div>
        </Question>

        <Question number={9} title="Stratégie de croissance">
          <p className="mb-3 text-sm text-slate-600">
            Une fois Mata assainie, quelle stratégie de croissance
            préférez-vous ?
          </p>
          <div className="flex flex-col gap-2">
            {STRATEGIE_CROISSANCE_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="strategieCroissance"
                  value={opt.value}
                  required
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </Question>

        <Question number={10} title="Remarques libres">
          <p className="mb-3 text-sm text-slate-600">
            Autres remarques, réserves ou propositions ?
          </p>
          <textarea name="remarques" rows={4} className="input" />
        </Question>

        {state?.error && (
          <p
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            aria-live="polite"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {pending ? "Envoi en cours..." : "Envoyer ma réponse"}
        </button>
      </form>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Question({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-slate-200 pt-8">
      <h2 className="mb-3 text-base font-semibold text-slate-900">
        {number}. {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}
