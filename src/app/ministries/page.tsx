import { supabase } from '@/lib/supabase';
import { TopBar } from '@/components/TopBar';
import { MinistryLeaderboard } from '@/components/MinistryLeaderboard';

export const revalidate = 300;

async function getAllMinistries() {
  const { data: latestWeek } = await supabase
    .from('ministry_scores')
    .select('week_ending')
    .order('week_ending', { ascending: false })
    .limit(1)
    .single();

  const weekEnding = latestWeek?.week_ending;

  const { data: scores } = await supabase
    .from('ministry_scores')
    .select('ministry_id, ars_score, band, total_contracts, total_value_ngn, ministries(name, slug, sector)')
    .eq('week_ending', weekEnding)
    .order('ars_score', { ascending: false });

  return (scores || [])
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
}

export default async function MinistriesPage() {
  const rows = await getAllMinistries();

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-[900px] mx-auto px-5 py-6">
        <h1 className="text-[19px] font-semibold text-gray-900 mb-1">
          All agencies ({rows.length})
        </h1>
        <p className="text-[13px] text-gray-500 mb-5">
          Every ministry, commission, and agency with awarded contracts in our dataset, ranked by anomaly density score.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <MinistryLeaderboard rows={rows} />
        </div>
      </main>
    </div>
  );
}
