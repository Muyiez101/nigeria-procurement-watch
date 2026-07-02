import { supabase } from '@/lib/supabase';
import { TopBar } from '@/components/TopBar';
import { formatNaira, formatDate } from '@/lib/format';

export const revalidate = 300;

async function getContracts() {
  const { data } = await supabase
    .from('contracts')
    .select('id, title, raw_vendor_name, value_ngn, sector, procurement_stage, external_ref, award_date')
    .not('value_ngn', 'is', null)
    .order('value_ngn', { ascending: false })
    .limit(50);
  return data || [];
}

export default async function ContractsPage() {
  const contracts = await getContracts();

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-[1000px] mx-auto px-5 py-6">
        <h1 className="text-[19px] font-semibold text-gray-900 mb-1">
          Contract explorer
        </h1>
        <p className="text-[13px] text-gray-500 mb-5">
          Top 50 highest-value awarded contracts across all agencies.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 font-medium text-gray-500 text-[11px] uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-500 text-[11px] uppercase tracking-wide">Agency</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-500 text-[11px] uppercase tracking-wide">Vendor</th>
                <th className="text-right px-4 py-2.5 font-medium text-gray-500 text-[11px] uppercase tracking-wide">Value</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-800 max-w-[280px] truncate">{c.title}</td>
                  <td className="px-4 py-2.5 text-gray-600 max-w-[180px] truncate">{c.sector}</td>
                  <td className="px-4 py-2.5 text-gray-600 max-w-[160px] truncate">{c.raw_vendor_name || '—'}</td>
                  <td className="px-4 py-2.5 text-right font-mono-data font-medium text-gray-900">{formatNaira(c.value_ngn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
