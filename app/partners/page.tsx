import type { Metadata } from "next";
import { supabasePublic, type Partner } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "파트너사 · PARTNERS | PAT BRO 펫브로",
  description: "PAT BRO 펫브로와 함께하는 파트너사 소개.",
};

export const revalidate = 60;

async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabasePublic
    .from("partners")
    .select("*")
    .eq("status", "active")
    .order("display_order", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return (data || []) as Partner[];
}

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-28 md:pb-32 md:pt-36 lg:pb-40 lg:pt-44">
      <div className="pointer-events-none absolute -right-10 top-20 select-none text-[180px] font-extrabold leading-none tracking-tightest text-ink/[0.035] md:text-[280px] lg:text-[360px]">
        PARTNERS
      </div>

      <div className="container-x relative">
        <div className="reveal max-w-3xl">
          <p className="eyebrow mb-7 text-brand">PARTNERS</p>
          <h1 className="heading-kr text-4xl text-ink md:text-5xl lg:text-[60px]">
            함께 만들어가는
            <br />
            <span className="text-brand">PAT BRO 파트너사.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/65">
            펫브로는 신뢰할 수 있는 파트너와 함께 합니다. 매장·유통·콜라보레이션
            파트너로 함께해주신 브랜드를 소개합니다.
          </p>
        </div>

        {partners.length === 0 ? (
          <div className="reveal mt-16 rounded-2xl bg-cream p-16 text-center shadow-soft">
            <p className="text-base font-semibold text-ink">
              곧 파트너사 정보가 등록됩니다.
            </p>
            <p className="mt-2 text-sm text-ink/60">
              파트너십 문의는 010-7721-4150 으로 부탁드립니다.
            </p>
          </div>
        ) : (
          <div className="reveal mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => {
              const card = (
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-cream p-7 shadow-card lift md:p-8">
                  <div className="flex h-32 items-center justify-center overflow-hidden rounded-xl bg-white">
                    {p.logo_url ? (
                      <img
                        src={p.logo_url}
                        alt={`${p.name} 로고`}
                        className="max-h-24 w-auto max-w-[80%] object-contain"
                      />
                    ) : (
                      <span className="font-display text-2xl font-extrabold tracking-tightest text-ink/40">
                        {p.name}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-6 text-lg font-extrabold leading-tight text-ink md:text-xl">
                    {p.name}
                  </h2>
                  {p.description && (
                    <p className="mt-3 flex-1 whitespace-pre-line text-[14.5px] leading-relaxed text-ink/65">
                      {p.description}
                    </p>
                  )}
                  {p.website_url && (
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.2em] text-ink/60 transition-colors group-hover:text-brand">
                      방문하기
                      <span className="transition-transform group-hover:translate-x-0.5">↗</span>
                    </span>
                  )}
                </article>
              );
              if (p.website_url) {
                return (
                  <a
                    key={p.id}
                    href={p.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    {card}
                  </a>
                );
              }
              return <div key={p.id}>{card}</div>;
            })}
          </div>
        )}
      </div>
    </section>
  );
}
