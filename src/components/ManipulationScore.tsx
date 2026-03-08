import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { ShieldAlert } from "lucide-react";

interface Props { result: FactCheckResult; }

export function ManipulationScore({ result }: Props) {
  const techniques = [];
  if (result.warnings.length > 2) techniques.push("Çoklu uyarı");
  if (result.debunked.length > 0) techniques.push("Yanlış bilgi");
  if (result.sentiment === "korkutucu") techniques.push("Korku dili");
  if (result.score < 30) techniques.push("Düşük güvenilirlik");
  if (result.detailedScores?.bias && result.detailedScores.bias < 50) techniques.push("Yanlı içerik");

  const score = Math.min(100, techniques.length * 25);

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <ShieldAlert className="h-3.5 w-3.5" /> Manipülasyon Skoru
      </h4>
      <div className="flex items-center gap-3">
        <span className={`text-xl font-bold ${score >= 50 ? "text-danger" : score >= 25 ? "text-warning" : "text-success"}`}>%{score}</span>
        <div className="flex-1">
          {techniques.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {techniques.map((t, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-danger/10 text-danger">{t}</span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-success">Manipülasyon belirtisi yok ✓</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
