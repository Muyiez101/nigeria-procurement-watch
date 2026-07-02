import Link from 'next/link';
import { severityColor, detectorLabel, formatDate } from '@/lib/format';
import type { AnomalyFinding } from '@/lib/supabase';

type FindingWithMinistry = AnomalyFinding & {
  ministry_name?: string;
};

export function FindingsFeed({ findings }: { findings: FindingWithMinistry[] }) {
  if (findings.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        No findings yet.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {findings.map((f) => {
        const colors = severityColor(f.severity);
        return (
          <Link
            href={`/anomalies/${f.id}`}
            key={f.id}
            className="block py-3 hover:bg-gray-50 -mx-1 px-1 rounded-md transition-colors"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                {detectorLabel(f.detector_type)}
              </span>
              <span className="text-[11px] text-gray-400">
                {formatDate(f.week_detected)}
              </span>
            </div>
            <div className="text-[12.5px] text-gray-800 leading-snug">
              {f.headline}
            </div>
            {f.ministry_name && (
              <div className="text-[11px] text-gray-500 mt-1">
                {f.ministry_name}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
