import { prisma } from "@/lib/prisma";
import { requireAdmin, logout } from "./actions";
import {
  POSITION_OPTIONS,
  TRAJECTORY_OPTIONS,
  OUI_NON_RESERVES,
  SECURISATION_OPTIONS,
  OUI_NON,
  STRATEGIE_CROISSANCE_OPTIONS,
  labelFor,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

function countBy<T extends string>(
  values: T[],
  options: readonly { value: string; label: string }[]
) {
  return options.map((opt) => ({
    label: opt.label,
    count: values.filter((v) => v === opt.value).length,
  }));
}

export default async function AdminDashboard() {
  await requireAdmin();

  const responses = await prisma.investorResponse.findMany({
    orderBy: { createdAt: "desc" },
  });

  const total = responses.length;
  const positionCounts = POSITION_OPTIONS.map((opt) => ({
    label: opt.value,
    count: responses.filter((r) => r.positions.includes(opt.value)).length,
  }));
  const trajectoryCounts = countBy(
    responses.map((r) => r.trajectory),
    TRAJECTORY_OPTIONS
  );
  const tradingProdCounts = countBy(
    responses.map((r) => r.tradingProdIntegration),
    OUI_NON_RESERVES
  );
  const spvCounts = countBy(
    responses.map((r) => r.spvAgreement),
    OUI_NON_RESERVES
  );
  const securisationCounts = countBy(
    responses.map((r) => r.securisationContribution),
    SECURISATION_OPTIONS
  );
  const montantTotal = responses.reduce(
    (sum, r) => sum + (r.securisationMontant ?? 0),
    0
  );
  const comiteCounts = countBy(
    responses.map((r) => (r.comitePilotage ? "oui" : "non")),
    OUI_NON
  );
  const strategieCounts = countBy(
    responses.map((r) => r.strategieCroissance),
    STRATEGIE_CROISSANCE_OPTIONS
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            MATA GROUP — Réponses investisseurs
          </h1>
          <p className="text-sm text-slate-500">{total} réponse(s) reçue(s)</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/admin/export"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Exporter en CSV
          </a>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Positionnement (A-F)" rows={positionCounts} />
        <StatCard title="Trajectoire recommandée" rows={trajectoryCounts} />
        <StatCard
          title="Intégration Mata Trading/Prod"
          rows={tradingProdCounts}
        />
        <StatCard title="Structure SPV 65/35" rows={spvCounts} />
        <StatCard
          title={`Sécurisation immédiate (total proposé : ${montantTotal.toLocaleString(
            "fr-FR"
          )} F CFA)`}
          rows={securisationCounts}
        />
        <StatCard title="Comité de pilotage" rows={comiteCounts} />
        <StatCard title="Stratégie de croissance" rows={strategieCounts} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Détail des réponses
        </h2>
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="min-w-[1400px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <Th>Date</Th>
                <Th>Nom</Th>
                <Th>Risque accepté</Th>
                <Th>Positions</Th>
                <Th>Calendrier sortie</Th>
                <Th>Trajectoire</Th>
                <Th>Intégration Trading/Prod</Th>
                <Th>Barème proposé</Th>
                <Th>SPV</Th>
                <Th>Sécurisation</Th>
                <Th>Montant proposé</Th>
                <Th>Comité pilotage</Th>
                <Th>Stratégie croissance</Th>
                <Th>Remarques</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {responses.map((r) => (
                <tr key={r.id}>
                  <Td>{r.createdAt.toLocaleString("fr-FR")}</Td>
                  <Td>
                    {r.firstName} {r.lastName}
                  </Td>
                  <Td>{r.riskAccepted ? "Oui" : "Non"}</Td>
                  <Td>{r.positions.join(", ")}</Td>
                  <Td>{r.exitTimeline ?? "-"}</Td>
                  <Td>{labelFor(TRAJECTORY_OPTIONS, r.trajectory)}</Td>
                  <Td>
                    {labelFor(OUI_NON_RESERVES, r.tradingProdIntegration)}
                  </Td>
                  <Td className="max-w-xs whitespace-pre-wrap">
                    {r.bareme ?? "-"}
                  </Td>
                  <Td>{labelFor(OUI_NON_RESERVES, r.spvAgreement)}</Td>
                  <Td>
                    {labelFor(
                      SECURISATION_OPTIONS,
                      r.securisationContribution
                    )}
                  </Td>
                  <Td>
                    {r.securisationMontant
                      ? `${r.securisationMontant.toLocaleString("fr-FR")} F`
                      : "-"}
                  </Td>
                  <Td>{r.comitePilotage ? "Oui" : "Non"}</Td>
                  <Td>
                    {labelFor(STRATEGIE_CROISSANCE_OPTIONS, r.strategieCroissance)}
                  </Td>
                  <Td className="max-w-xs whitespace-pre-wrap">
                    {r.remarques ?? "-"}
                  </Td>
                </tr>
              ))}
              {total === 0 && (
                <tr>
                  <td
                    colSpan={14}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    Aucune réponse pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; count: number }[];
}) {
  return (
    <div className="rounded-md border border-slate-200 p-4">
      <h3 className="mb-2 text-sm font-medium text-slate-700">{title}</h3>
      <ul className="space-y-1 text-sm text-slate-600">
        {rows.map((row) => (
          <li key={row.label} className="flex justify-between gap-2">
            <span className="truncate">{row.label}</span>
            <span className="font-medium text-slate-900">{row.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-2 font-medium">{children}</th>;
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`whitespace-nowrap px-4 py-2 text-slate-700 ${className}`}>
      {children}
    </td>
  );
}
