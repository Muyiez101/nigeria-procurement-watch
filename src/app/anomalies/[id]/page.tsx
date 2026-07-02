import { supabase } from '@/lib/supabase';
import { TopBar } from '@/components/TopBar';
import { detectorLabel, severityColor, formatDate, formatNairaFull } from '@/lib/format';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export const revalidate = 300;

async function getFinding(id: string) {
  const { data: finding } = await supabase
    .from('anomaly_findings')
    .select('*, ministries(name, slug)')
    .eq('id', id)
    .single();

  if (!finding) return null;

  let contracts: Array<{ id: number; title: string; external_ref: string; value_ngn: number | null; source_url: string | null; raw_vendor_name: string | null }> = [];
  if (finding.contract_ids?.length) {
    const { data } = await supabase
      .from('contracts')
      .select('id, title, external_ref, value_ngn, source_url, raw_vendor_name')
      .in('id', finding.contract_ids);
    contracts = data || [];
  }

  return { finding, contracts };
}

export default async function FindingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getFinding(id);
  if (!data) notFound();

  const { finding, contracts } = data;
  const colors = severityColor(finding.severity);
  const ministry = Array.isArray(finding.ministries) ? finding.ministries[0] : finding.ministries;
  const evidence = finding.evidence_json || {};

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-[800px] mx-auto px-5 py-6">
        <Link href="/anomalies" className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={13} /> Back to all findings
        </Link>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
              {detectorLabel(finding.detector_type)}
            </span>
            <span className="text-[11px] text-gray-400">
              {formatDate(finding.week_detected)}
            </span>
          </div>

          <h1 className="text-[17px] font-semibold text-gray-900 leading-snug mb-3">
            {finding.headline}
          </h1>

          {ministry && (
            <Link href={`/ministries/${ministry.slug}`} className="text-[12.5px] text-gray-600 hover:text-gray-900 underline">
              {ministry.name}
            </Link>
          )}

          {typeof evidence.why_suspicious === 'string' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="text-[11px] font-medium text-blue-900 mb-1">Why this was flagged</div>
              <p className="text-[12.5px] text-blue-800 leading-relaxed">
                {evidence.why_suspicious}
              </p>
            </div>
          )}

          {typeof evidence.confidence === 'string' && (
            <div className="mt-2 text-[11px] text-gray-500">
              Confidence: {evidence.confidence}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-[11px] font-medium text-gray-700 mb-2">Related contracts</div>
            <div className="space-y-2">
              {contracts.map((c) => (
                <div key={c.id} className="p-2.5 bg-gray-50 rounded-lg">
                  <div className="text-[12.5px] text-gray-800 leading-snug">{c.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-gray-500 font-mono-data">{c.external_ref}</span>
                    <span className="text-[12px] font-semibold text-gray-900 font-mono-data">
                      {formatNairaFull(c.value_ngn)}
                    </span>
                  </div>
                  {c.raw_vendor_name && (
                    <div className="text-[11px] text-gray-500 mt-0.5">Vendor: {c.raw_vendor_name}</div>
                  )}
                </div>
              ))}
            </div>
            <a
              href="https://nocopo.bpp.gov.ng/noc/frmcitizendashboard3.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11.5px] text-gray-500 hover:text-gray-700 mt-3"
            >
              View source data on NOCOPO <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
