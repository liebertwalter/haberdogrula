import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ScoreGauge } from "@/components/ScoreGauge";
import { SummaryCard } from "@/components/SummaryCard";
import { ClaimExtractor } from "@/components/ClaimExtractor";
import { VerificationBadges } from "@/components/VerificationBadges";
import { ShareButtons } from "@/components/ShareButtons";
import { TrustSignal } from "@/components/TrustSignal";
import { SmartSummary } from "@/components/SmartSummary";
import { VerificationSteps } from "@/components/VerificationSteps";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { FactCheckResult } from "@/lib/api/factcheck";

export default function Result() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchResult = async () => {
      const { data, error: dbError } = await supabase
        .from("search_history")
        .select("*")
        .eq("id", id)
        .single();

      if (dbError || !data) {
        setError("Sonuç bulunamadı");
        setLoading(false);
        return;
      }

      if (data.result_json) {
        setResult(data.result_json as unknown as FactCheckResult);
      } else {
        // Fallback for old records without result_json
        setResult({
          score: data.score || 0,
          summary: data.summary || "",
          sources: [],
          warnings: [],
          verified: [],
          debunked: [],
        });
      }
      setLoading(false);
    };
    fetchResult();
  }, [id]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-danger";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "✅ Güvenilir";
    if (score >= 60) return "🟡 Kısmen Güvenilir";
    if (score >= 40) return "⚠️ Şüpheli";
    return "❌ Güvenilir Değil";
  };

  return (
    <Layout>
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-3">
          <Link to="/dogrula">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Geri
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold">Doğrulama Sonucu</h1>
          </div>
        </div>

        {loading && (
          <motion.div className="flex flex-col items-center pt-12 gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Sonuç yükleniyor...</p>
          </motion.div>
        )}

        {error && (
          <motion.div className="text-center pt-12 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-lg font-semibold text-danger">{error}</p>
            <p className="text-muted-foreground text-sm">Bu bağlantı geçersiz veya sonuç silinmiş olabilir.</p>
            <Link to="/dogrula">
              <Button className="gap-2"><ExternalLink className="h-4 w-4" /> Yeni Doğrulama Yap</Button>
            </Link>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-center">
              <ScoreGauge score={result.score} />
            </div>

            <div className="text-center">
              <span className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                {getScoreLabel(result.score)}
              </span>
            </div>

            <VerificationBadges result={result} />
            <SmartSummary result={result} />
            <SummaryCard result={result} />
            <ClaimExtractor result={result} />
            <VerificationSteps result={result} />
            <TrustSignal result={result} />

            <div className="flex flex-wrap justify-center gap-2">
              <ShareButtons result={result} />
            </div>

            <div className="text-center pt-4">
              <Link to="/dogrula">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" /> Sen de Bir Haber Doğrula
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
