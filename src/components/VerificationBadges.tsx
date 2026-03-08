import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion, Clock, Brain, Globe, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";

interface VerificationBadgesProps {
  result: FactCheckResult;
}

export function VerificationBadges({ result }: VerificationBadgesProps) {
  const confidenceMap: Record<string, { label: string; icon: typeof Brain; color: string }> = {
    yüksek: { label: "Yüksek Güven", icon: ShieldCheck, color: "text-success bg-success/10 border-success/30" },
    orta: { label: "Orta Güven", icon: Shield, color: "text-warning bg-warning/10 border-warning/30" },
    düşük: { label: "Düşük Güven", icon: ShieldAlert, color: "text-danger bg-danger/10 border-danger/30" },
  };

  const freshnessMap: Record<string, { label: string; color: string }> = {
    güncel: { label: "Güncel Bilgi", color: "text-success bg-success/10 border-success/30" },
    eski: { label: "Eski Bilgi", color: "text-warning bg-warning/10 border-warning/30" },
    belirsiz: { label: "Belirsiz Tarih", color: "text-muted-foreground bg-muted border-border" },
  };

  const sentimentMap: Record<string, { label: string; emoji: string }> = {
    olumlu: { label: "Olumlu", emoji: "😊" },
    olumsuz: { label: "Olumsuz", emoji: "😟" },
    nötr: { label: "Nötr", emoji: "😐" },
    korkutucu: { label: "Korkutucu", emoji: "😨" },
    umut_verici: { label: "Umut Verici", emoji: "🌟" },
  };

  const conf = result.confidence ? confidenceMap[result.confidence] || confidenceMap.orta : null;
  const fresh = result.freshness ? freshnessMap[result.freshness] || freshnessMap.belirsiz : null;
  const sent = result.sentiment ? sentimentMap[result.sentiment] || sentimentMap.nötr : null;
  const ConfIcon = conf?.icon || ShieldQuestion;

  return (
    <motion.div
      className="flex flex-wrap gap-2 justify-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {conf && (
        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium ${conf.color}`}>
          <ConfIcon className="h-3.5 w-3.5" />
          {conf.label}
        </span>
      )}
      {fresh && (
        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium ${fresh.color}`}>
          <Clock className="h-3.5 w-3.5" />
          {fresh.label}
        </span>
      )}
      {sent && (
        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border bg-muted font-medium">
          {sent.emoji} {sent.label}
        </span>
      )}
      {result.category && (
        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium">
          <Globe className="h-3.5 w-3.5" />
          {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
        </span>
      )}
      {result.webSearchUsed && (
        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-success/30 bg-success/10 text-success font-medium">
          <Zap className="h-3.5 w-3.5" />
          Web Araştırması Yapıldı
        </span>
      )}
      {result.checkedAt && (
        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border bg-muted text-muted-foreground font-medium">
          <Clock className="h-3.5 w-3.5" />
          {new Date(result.checkedAt).toLocaleString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
    </motion.div>
  );
}
