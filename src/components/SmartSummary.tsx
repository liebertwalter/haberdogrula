import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Sparkles } from "lucide-react";

interface Props { result: FactCheckResult; }

export function SmartSummary({ result }: Props) {
  const getEmoji = (score: number) => {
    if (score >= 80) return "🟢";
    if (score >= 60) return "🟡";
    if (score >= 40) return "🟠";
    return "🔴";
  };

  const highlights = [];
  if (result.verified.length > 0) highlights.push(`${result.verified.length} bilgi doğrulandı`);
  if (result.debunked.length > 0) highlights.push(`${result.debunked.length} bilgi yalanlandı`);
  if (result.warnings.length > 0) highlights.push(`${result.warnings.length} uyarı mevcut`);
  if (result.webSearchUsed) highlights.push("Web doğrulaması yapıldı");

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5" /> Akıllı Özet
      </h4>
      <p className="text-sm">
        {getEmoji(result.score)} Bu haber <strong>%{result.score}</strong> güvenilirlik puanı aldı.
        {result.category && ` Kategori: ${result.category}.`}
        {result.sentiment && ` Genel ton: ${result.sentiment}.`}
      </p>
      {highlights.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {highlights.map((h, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{h}</span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
