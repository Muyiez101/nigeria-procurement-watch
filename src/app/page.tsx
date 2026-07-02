import { supabase } from '@/lib/supabase';
import { TopBar } from '@/components/TopBar';
import { MetricCard } from '@/components/MetricCard';
import { MinistryLeaderboard } from '@/components/MinistryLeaderboard';
import { FindingsFeed } from '@/components/FindingsFeed';
import { formatNaira } from '@/lib/format';
import { FileText, AlertTriangle, Building2, Banknote } from 'lucide-react';

export const revalidate = 300; // refresh every 5 minutes

async function getOverviewData() {
  // Get latest week_ending
  const { data: latestWeek } = await supabase
    .from('ministry_scores')
    .select('week_ending')
    .order('week_ending', { ascending: false })
    .limit(1)
    .single();

  const weekEnding = latestWeek?.week_ending;

  // Ministry scores joined with ministry names, for the leaderboard
  const { data: scores } = await supabase
    .from('ministry_scores')
    .select('ministry_id, ars_score, band, total_contracts, total_value_ngn, ministries(name, slug, sector)')
    .eq('week_ending', weekEnding)
    .order('ars_score', { ascending: false })
    .limit(15);

  const leaderboardRows = (scores || [])
    .filter((s) => s.ministries)
    .map((s) => {
      const ministry = Array.isArray(s.ministries) ? s.ministries[0] : s.ministries;
      return {
        ministry_id: s.ministry_id,
        name: ministry?.name || 'Unknown',
        slug: ministry?.slug || '',
        sector: ministry?.sector || '',
        ars_score: s.ars_score,
        band: s.band,
        total_contracts: s.total_contracts,
        total_value_ngn: s.total_value_ngn,
      };
    });

  // Total contracts tracked
  const { count: totalContracts } = await supabase
    .from('contracts')
    .select('*', { count: 'exact', head: true });

  // Total anomalies flagged
  const { count: totalAnomalies } = await supabase
    .from('anomaly_findings')
    .select('*', { count: 'exact', head: true });

  // High risk ministries (ELEVATED or above, score >= 40 — matches band definitions)
  const { count: highRiskCount } = await supabase
    .from('ministry_scores')
    .select('*', { count: 'exact', head: true })
    .eq('week_ending', weekEnding)
    .gte('ars_score', 40);

  // Total flagged contract value — sum value_ngn across contracts referenced in findings
  const { data: allFindings } = await supabase
    .from('anomaly_findings')
    .select('contract_ids')
    .eq('week_detected', weekEnding);

  const flaggedContractIds = new Set<number>();
  (allFindings || []).forEach((f) => {
    (f.contract_ids || []).forEach((id: number) => flaggedContractIds.add(id));
  });

  let flaggedValue = 0;
  if (flaggedContractIds.size > 0) {
    const { data: flaggedContracts } = await supabase
      .from('contracts')
      .select('value_ngn')
      .in('id', Array.from(flaggedContractIds));
    flaggedValue = (flaggedContracts || []).reduce((sum, c) => sum + (c.value_ngn || 0), 0);
  }

  // Recent findings feed, with ministry names
  const { data: recentFindings } = await supabase
    .from('anomaly_findings')
    .select('*, ministries(name)')
    .order('created_at', { ascending: false })
    .limit(8);

  const findingsWithMinistry = (recentFindings || []).map((f) => {
    const ministry = Array.isArray(f.ministries) ? f.ministries[0] : f.ministries;
    return { ...f, ministry_name: ministry?.name };
  });

  return {
    weekEnding,
    leaderboardRows,
    totalContracts: totalContracts || 0,
    totalAnomalies: totalAnomalies || 0,
    highRiskCount: highRiskCount || 0,
    flaggedValue,
    findingsWithMinistry,
  };
}

export default async function HomePage() {
  const data = await getOverviewData();

  return (
    <div className="min-h-screen">
      <TopBar />

      <main className="max-w-[1200px] mx-auto px-5 py-6">
        <div className="mb-5">
          <h1 className="text-[19px] font-semibold text-gray-900">
            National procurement overview
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {data.weekEnding
              ? `Week ending ${new Date(data.weekEnding).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
              : 'Awaiting first analysis run'}
            {' · '}Real, awarded contracts only — budget allocations excluded
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <MetricCard
            label="Contracts tracked"
            value={data.totalContracts.toLocaleString()}
            icon={FileText}
          />
          <MetricCard
            label="Anomalies flagged"
            value={data.totalAnomalies.toLocaleString()}
            icon={AlertTriangle}
            trend="Statistical patterns, not accusations"
            trendColor="amber"
          />
          <MetricCard
            label="High-risk agencies"
            value={String(data.highRiskCount)}
            icon={Building2}
            trend="Score 40+ (Elevated or above)"
            trendColor="red"
          />
          <MetricCard
            label="Flagged contract value"
            value={formatNaira(data.flaggedValue)}
            icon={Banknote}
            trend="Across all flagged contracts"
            trendColor="gray"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[13px] font-semibold text-gray-900">
                Agency risk leaderboard
              </h2>
              <a href="/ministries" className="text-[12px] text-gray-500 hover:text-gray-700">
                View all →
              </a>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">
              Ranked by anomaly density score · agencies with fewer than 3 contracts are capped low due to insufficient data
            </p>
            <MinistryLeaderboard rows={data.leaderboardRows} />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[13px] font-semibold text-gray-900">
                Recent findings
              </h2>
              <a href="/anomalies" className="text-[12px] text-gray-500 hover:text-gray-700">
                View all →
              </a>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">
              Statistical anomalies requiring verification
            </p>
            <FindingsFeed findings={data.findingsWithMinistry} />
          </div>
        </div>

        <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-[12px] text-amber-900 leading-relaxed">
            <strong>About this data:</strong> Findings on this dashboard are statistical anomalies
            generated from Nigeria&apos;s public NOCOPO procurement portal. They indicate patterns
            that warrant further investigation — they are not proof of wrongdoing. Vendor
            verification (CAC registration checks) is not yet integrated, so vendor-related
            findings should be treated as preliminary. See our{' '}
            <a href="/methodology" className="underline font-medium">methodology page</a> for full detector definitions.
          </p>
        </div>
      </main>
    </div>
  );
}
