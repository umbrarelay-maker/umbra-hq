import Link from "next/link";

import { agentEdges, agentNodes } from "@/data/agents-map";

export const metadata = {
  title: "Agents — Umbra HQ",
};

export default function AgentsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Agents
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Roles view (v1). This is the source-of-truth roster + handoffs. Live
            status overlay is next.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 text-xs text-zinc-400">
          <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1">
            View: Roles
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <h2 className="text-sm font-medium text-zinc-200">Roster</h2>
          <div className="mt-4 space-y-3">
            {agentNodes.map((a) => (
              <div
                key={a.id}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-zinc-100">
                      {a.name}
                    </div>
                    {a.subtitle ? (
                      <div className="mt-1 text-xs text-zinc-400">
                        {a.subtitle}
                      </div>
                    ) : null}
                  </div>
                  {a.charterUrl ? (
                    <Link
                      href={a.charterUrl}
                      className="text-xs text-indigo-300 hover:text-indigo-200"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Charter →
                    </Link>
                  ) : null}
                </div>

                {a.models?.length ? (
                  <div className="mt-3 text-xs text-zinc-400">
                    <span className="text-zinc-500">Models:</span>{" "}
                    {a.models.join(", ")}
                  </div>
                ) : null}

                {a.owns?.length ? (
                  <div className="mt-2 text-xs text-zinc-400">
                    <span className="text-zinc-500">Owns:</span>{" "}
                    {a.owns.join(" · ")}
                  </div>
                ) : null}

                {a.hqTags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {a.hqTags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <h2 className="text-sm font-medium text-zinc-200">Handoffs</h2>
          <p className="mt-2 text-xs text-zinc-400">
            Explicit edges between agents (who hands what to whom).
          </p>
          <div className="mt-4 space-y-2">
            {agentEdges.map((e, i) => (
              <div
                key={`${e.from}-${e.to}-${i}`}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <div className="text-xs text-zinc-300">
                  <span className="text-zinc-500">From:</span> {e.from}
                  <span className="mx-2 text-zinc-700">→</span>
                  <span className="text-zinc-500">To:</span> {e.to}
                </div>
                <div className="mt-1 text-xs text-zinc-400">{e.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
            <div className="text-xs text-zinc-400">
              Mermaid diagram (doc):{" "}
              <Link
                href="https://umbra-hq.vercel.app/documents/d64a499a-f678-4537-ab76-0cb8ae2729c6"
                className="text-indigo-300 hover:text-indigo-200"
                target="_blank"
                rel="noreferrer"
              >
                Sub-Agent Map (Mermaid) — v1
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
