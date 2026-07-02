import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function TopBar() {
  return (
    <header className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#1a3c2e] flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={17} className="text-[#b7e4c7]" strokeWidth={2} />
        </div>
        <div>
          <div className="text-[15px] font-semibold text-gray-900 leading-tight">
            Nigeria Procurement Watch
          </div>
          <div className="text-[11px] text-gray-500 leading-tight">
            Public accountability dashboard
          </div>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-1">
        <Link href="/" className="text-[13px] px-3 py-1.5 rounded-md text-gray-900 font-medium bg-gray-100">
          Overview
        </Link>
        <Link href="/ministries" className="text-[13px] px-3 py-1.5 rounded-md text-gray-500 hover:bg-gray-50">
          Ministries
        </Link>
        <Link href="/contracts" className="text-[13px] px-3 py-1.5 rounded-md text-gray-500 hover:bg-gray-50">
          Contracts
        </Link>
        <Link href="/anomalies" className="text-[13px] px-3 py-1.5 rounded-md text-gray-500 hover:bg-gray-50">
          Anomalies
        </Link>
        <Link href="/methodology" className="text-[13px] px-3 py-1.5 rounded-md text-gray-500 hover:bg-gray-50">
          Methodology
        </Link>
      </nav>

      <div className="flex items-center gap-1.5 text-[11px] font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Live data
      </div>
    </header>
  );
}
