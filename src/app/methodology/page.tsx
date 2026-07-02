import { TopBar } from '@/components/TopBar';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-[700px] mx-auto px-5 py-8">
        <h1 className="text-[20px] font-semibold text-gray-900 mb-2">Methodology</h1>
        <p className="text-[13px] text-gray-600 mb-6 leading-relaxed">
          Nigeria Procurement Watch analyses publicly available federal procurement data from
          the Bureau of Public Procurement&apos;s NOCOPO portal. This page explains exactly how
          findings are generated, what they mean, and — just as importantly — what they don&apos;t mean.
        </p>

        <section className="mb-6">
          <h2 className="text-[14px] font-semibold text-gray-900 mb-2">What counts as a contract</h2>
          <p className="text-[13px] text-gray-600 leading-relaxed">
            NOCOPO records procurement at four stages: Planning, Tender, Contract, and
            Implementation. We only analyse contracts in the <strong>Contract</strong> or{' '}
            <strong>Implementation</strong> stage — meaning an award has actually been made.
            Planning-stage budget allocations (which are ceilings, not awards) are explicitly
            excluded from all scoring and detection.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-[14px] font-semibold text-gray-900 mb-2">Detectors</h2>
          <div className="space-y-3">
            {[
              { name: 'Price Inflation', desc: 'Flags contracts priced far above the median for that agency, with extra scrutiny removed for capital purchases (vehicles, buildings) where large one-off costs are structurally normal.' },
              { name: 'Single-Source Concentration', desc: 'Flags vendors receiving a disproportionate share of one agency\'s total contract value.' },
              { name: 'Split Contract', desc: 'Flags multiple near-identical-value contracts to the same vendor, which can indicate deliberate splitting to avoid procurement thresholds.' },
              { name: 'Duplicate / Decimal-Shift Pattern', desc: 'Flags pairs of similar contracts where one value is ~100x the other — which may indicate a data entry error or a genuine duplicate submission. We present both possibilities.' },
              { name: 'Vendor Verification', desc: 'Flags high-value contracts to vendors with no other record in our current dataset. This is a prompt for manual CAC verification, not an accusation — our dataset is not yet complete, so single appearances are expected for many legitimate vendors.' },
            ].map((d) => (
              <div key={d.name} className="border-l-2 border-gray-200 pl-3">
                <div className="text-[13px] font-medium text-gray-900">{d.name}</div>
                <div className="text-[12.5px] text-gray-600 leading-relaxed mt-0.5">{d.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-[14px] font-semibold text-gray-900 mb-2">Scoring</h2>
          <p className="text-[13px] text-gray-600 leading-relaxed">
            Each agency&apos;s Anomaly Risk Score (0–100) is calculated from the severity-weighted
            density of findings relative to its total contract volume — not a raw count. This
            prevents agencies with more contracts from being penalised simply for having more
            data. Agencies with fewer than 3 awarded contracts are capped at a low score
            regardless of findings, since there isn&apos;t enough data to draw a confident
            conclusion in either direction.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-[14px] font-semibold text-gray-900 mb-2">What this is not</h2>
          <p className="text-[13px] text-gray-600 leading-relaxed">
            This dashboard does not allege corruption. It surfaces statistical patterns in
            public data that warrant further investigation by journalists, civil society, or
            the agencies themselves. Many flagged patterns have innocent explanations — a
            data entry error, a legitimate capital purchase, or incomplete data coverage on
            our end. We try to make that uncertainty explicit in every finding rather than
            implying false certainty.
          </p>
        </section>

        <section>
          <h2 className="text-[14px] font-semibold text-gray-900 mb-2">Data source</h2>
          <p className="text-[13px] text-gray-600 leading-relaxed">
            All contract data is sourced directly from{' '}
            <a href="https://nocopo.bpp.gov.ng" target="_blank" rel="noopener noreferrer" className="underline">
              nocopo.bpp.gov.ng
            </a>
            , the Bureau of Public Procurement&apos;s public Open Contracting Data Standard portal.
          </p>
        </section>
      </main>
    </div>
  );
}
