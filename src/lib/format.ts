export function formatNaira(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  if (value >= 1_000_000_000) return `₦${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
  return `₦${value.toFixed(0)}`;
}

export function formatNairaFull(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return `₦${value.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

export function bandColor(band: string): { bg: string; text: string; border: string } {
  switch (band) {
    case 'CRITICAL':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    case 'HIGH':
      return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    case 'ELEVATED':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'MODERATE':
      return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
    default:
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
  }
}

export function scoreBarColor(score: number): string {
  if (score >= 80) return '#dc2626';
  if (score >= 60) return '#ea580c';
  if (score >= 40) return '#d97706';
  if (score >= 20) return '#ca8a04';
  return '#65a30d';
}

export function severityColor(severity: string): { bg: string; text: string } {
  switch (severity) {
    case 'critical':
      return { bg: 'bg-red-100', text: 'text-red-700' };
    case 'high':
      return { bg: 'bg-orange-100', text: 'text-orange-700' };
    case 'medium':
      return { bg: 'bg-amber-100', text: 'text-amber-700' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600' };
  }
}

export function detectorLabel(detectorType: string): string {
  const labels: Record<string, string> = {
    price_inflation: 'Price Inflation',
    ghost_vendor: 'Vendor Verification',
    single_source_concentration: 'Single Source',
    split_contract: 'Split Contract',
    duplicate_contract: 'Duplicate Pattern',
    bid_rigging: 'Bid Pattern',
    award_timing: 'Award Timing',
    pep_connection: 'PEP Connection',
  };
  return labels[detectorType] || detectorType;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
