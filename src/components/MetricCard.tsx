import { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendColor?: 'green' | 'red' | 'amber' | 'gray';
};

const trendColors = {
  green: 'text-green-700',
  red: 'text-red-700',
  amber: 'text-amber-700',
  gray: 'text-gray-500',
};

export function MetricCard({ label, value, icon: Icon, trend, trendColor = 'gray' }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] text-gray-500">{label}</span>
        <Icon size={15} className="text-gray-400" strokeWidth={1.75} />
      </div>
      <div className="text-[22px] font-semibold text-gray-900 font-mono-data tracking-tight">
        {value}
      </div>
      {trend && (
        <div className={`text-[11px] mt-1 ${trendColors[trendColor]}`}>{trend}</div>
      )}
    </div>
  );
}
