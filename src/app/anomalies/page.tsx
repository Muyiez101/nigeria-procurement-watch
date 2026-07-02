import { supabase } from '@/lib/supabase';
import { TopBar } from '@/components/TopBar';
import { FindingsFeed } from '@/components/FindingsFeed';

export const revalidate = 300;

async function getAllFindings() {
  const { data } = await supabase
    .from('anomaly_findings')
    .select('*, ministries(name)')
    .order('severity', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100);

  return (data || []).map((f) => {
    const ministry = Array.isArray(f.ministries) ? f.ministries[0] : f.ministries;
    return { ...f, ministry_name: ministry?.name };
  });
}

export default async function AnomaliesPage() {
  const findings = await getAllFindings();

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-[800px] mx-auto px-5 py-6">
        <h1 className="text-[19px] font-semibold text-gray-900 mb-1">
          All anomaly findings
        </h1>
        <p className="text-[13px] text-gray-500 mb-5">
          Statistical patterns flagged for verification, sorted by severity. These are not accusations — see each finding for full evidence and confidence notes.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <FindingsFeed findings={findings} />
        </div>
      </main>
    </div>
  );
}
