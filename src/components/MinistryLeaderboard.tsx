import Link from 'next/link';
import { bandColor, scoreBarColor, formatNaira } from '@/lib/format';

type LeaderboardRow = {
  ministry_id: number;
  name: string;
  slug: string;
  sector: string;
  ars_score: number;
  band: string;
  total_contracts: number;
  total_value_ngn: number;
};

export function MinistryLeaderboard({ rows }: { rows: LeaderboardRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        No ministry scores available yet. Run the anomaly engine to generate scores.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {rows.map((row, i) => {
        const colors = bandColor(row.band);
        return (
          <Link
            key={row.ministry_id}
            href={`/ministries/${row.slug}`}
            className="flex items-center gap-3 px-1 py-2.5 hover:bg-gray-50 -mx-1 rounded-md transition-colors"
          >
            <div className="text-[12px] text-gray-400 w-5 text-center flex-shrink-0 font-mono-data">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-gray-900 truncate">
                {row.name}
              </div>
              <div className="text-[11px] text-gray-500 truncate">
                {row.sector} · {row.total_contracts} contracts · {formatNaira(row.total_value_ngn)}
              </div>
            </div>
            <div className="w-20 flex-shrink-0 hidden sm:block">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(row.ars_score, 100)}%`,
                    backgroundColor: scoreBarColor(row.ars_score),
                  }}
                />
              </div>
            </div>
            <div className="text-[13px] font-semibold font-mono-data w-9 text-right flex-shrink-0" style={{ color: scoreBarColor(row.ars_score) }}>
              {row.ars_score.toFixed(0)}
            </div>
            <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${colors.bg} ${colors.text}`}>
              {row.band}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
