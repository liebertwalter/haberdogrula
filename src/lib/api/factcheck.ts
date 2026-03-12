import { supabase } from "@/integrations/supabase/client";

export interface DetailedScores {
  sourceReliability: number;
  factualAccuracy: number;
  bias: number;
  freshness: number;
  consistency: number;
}

export interface FactCheckResult {
  score: number;
  summary: string;
  sources: { title: string; url: string }[];
  warnings: string[];
  verified: string[];
  debunked: string[];
  category?: string;
  sentiment?: string;
  freshness?: string;
  confidence?: string;
  detailedScores?: DetailedScores;
  checkedAt?: string;
  webSearchUsed?: boolean;
  resultId?: string;
}

export async function factCheckNews(input: { text?: string; url?: string }): Promise<FactCheckResult> {
  const { data, error } = await supabase.functions.invoke("fact-check", {
    body: input,
  });

  if (error) {
    throw new Error(error.message || "Doğrulama sırasında bir hata oluştu");
  }

  return data as FactCheckResult;
}
