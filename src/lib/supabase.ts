import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Ministry = {
  id: number;
  name: string;
  slug: string;
  sector: string;
  level: string;
  state_code: string | null;
};

export type MinistryScore = {
  id: number;
  ministry_id: number;
  week_ending: string;
  ars_score: number;
  band: string;
  delta: number;
  total_contracts: number;
  total_value_ngn: number;
  flagged_contracts: number;
};

export type AnomalyFinding = {
  id: number;
  detector_type: string;
  ministry_id: number | null;
  contract_ids: number[];
  vendor_ids: number[];
  severity: string;
  headline: string;
  evidence_json: Record<string, unknown>;
  status: string;
  week_detected: string;
  created_at: string;
};

export type Contract = {
  id: number;
  external_ref: string;
  title: string;
  description: string | null;
  ministry_id: number | null;
  vendor_id: number | null;
  raw_vendor_name: string | null;
  value_ngn: number | null;
  budget_amount_ngn: number | null;
  contract_amount_ngn: number | null;
  budget_year: string | null;
  procurement_stage: string | null;
  award_date: string | null;
  sector: string | null;
  source_url: string | null;
};
