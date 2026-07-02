import { supabase } from '@/lib/supabase';
import { TopBar } from '@/components/TopBar';
import { FindingsFeed } from '@/components/FindingsFeed';
import { formatNaira, formatNairaFull, bandColor, scoreBarColor, formatDate } from '@/lib/format';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 300;

async function getMinistryData(slug: string) {
  const { data: ministry } = await supabase
    .from('ministries')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!ministry) return null;

  const { data: latestScore } = await supabase
    .from('ministry_scores')
    .select('*')
    .eq('ministry_id', ministry.id)
    .order('week_ending', { ascending: false })
    .limit(1)
    .single();

  const { data: findings } = await supabase
    .from('anomaly_findings')
    .select('*')
    .eq('ministry_id', ministry.id)
    .order('severity', { ascending: false })
    .limit(20);

  const { data: topContracts } = await supabase
    .from('contracts')
    .select('id, title, raw_vendor_name, value_ngn, procurement_stage, external_ref, source_url')
    .eq('ministry_id', ministry.id)
    .not('value_ngn', 'is', null)
    .order('value_ngn', { ascending: false })
    .limit(10);

  return { ministry, latestScore, findings: findings || [], topContracts: topContracts || [] };
}

export default async function MinistryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getMinistryData(slug);

  if (!data) notFound();

  const { ministry, latestScore, findings, topContracts } = data;
  const score = latestScore?.ars_score ?? 0;
  const band = latestScore?.band ?? 'LOW';
  const colors = bandColor(band);
  const lowSample = (latestScore?.total_contracts ?? 0) < 3;

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-[1000px] mx-auto px-5 py-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={13} /> Back to overview
        </Link>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">
                {ministry.sector} · {ministry.level}
              </div>
              <h1 className="text-[20px] font-semibold text-gray-900 leading-snug">
                {ministry.name}
              </h1>
            </div>
            <div className="text-right">
              <div className="text-[34px] font-bold font-mono-data leading-none" style={{ color: scoreBarColor(score) }}>
                {score.toFixed(0)}
              </div>
              <div className={`text-[11px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${colors.bg} ${colors.text}`}>
                {band}
              </div>
            </div>
          </div>

          {lowSample && (
            <div className="mt-3 text-[11px] text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              This agency has fewer than 3 awarded contracts in our current dataset. The score is
              capped low because there isn&apos;t enough data to draw confident conclusions either way.
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
            <div>
              <div className="text-[11px] text-gray-500">Contracts tracked</div>
              <div className="text-[15px] font-semibold text-gray-900 font-mono-data">
                {latestScore?.total_contracts ?? 0}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500">Total value</div>
              <div className="text-[15px] font-semibold text-gray-900 font-mono-data">
                {formatNaira(latestScore?.total_value_ngn)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-500">Findings</div>
              <div className="text-[15px] font-semibold text-gray-900 font-mono-data">
                {latestScore?.flagged_contracts ?? findings.length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-[13px] font-semibold text-gray-900 mb-1">
              Anomaly findings
            </h2>
            <p className="text-[11px] text-gray-500 mb-2">
              Statistical patterns — see each finding for full evidence
            </p>
            <FindingsFeed findings={findings} />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-[13px] font-semibold text-gray-900 mb-1">
              Highest-value contracts
            </h2>
            <p className="text-[11px] text-gray-500 mb-2">
              Largest awarded contracts on record for this agency
            </p>
            <div className="divide-y divide-gray-100">
              {topContracts.map((c) => (
                <div key={c.id} className="py-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[12.5px] text-gray-800 leading-snug flex-1">
                      {c.title}
                    </div>
                    <div className="text-[12.5px] font-semibold font-mono-data text-gray-900 flex-shrink-0">
                      {formatNaira(c.value_ngn)}
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {c.raw_vendor_name || 'Vendor not specified'} · {c.procurement_stage}
                  </div>
                </div>
              ))}
              {topContracts.length === 0 && (
                <div className="py-6 text-center text-[12px] text-gray-500">
                  No awarded contracts with recorded values yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
