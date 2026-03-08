import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Calendar } from "lucide-react";

interface Props { result: FactCheckResult; }

export function ContentAge({ result }: Props) {
  const freshness = result.freshness || "belirsiz";
  const config: Record<string, { label: string; color: string; icon: string }> = {
    güncel: { label: "Güncel İçerik", color: "text-success", icon: "🟢" },
    eski: { label: "Eski İçerik", color: "text-warning", icon: "🟡" },
    belirsiz: { label: "Tarih Belirsiz", color: "text-muted-foreground", icon: "⚪" },
  };
  const c = config[freshness] || config.belirsiz;

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> İçerik Yaşı
        </span>
        <span className={`text-xs font-bold ${c.color} flex items-center gap-1`}>
          {c.icon} {c.label}
        </span>
      </div>
      {result.checkedAt && (
        <p className="text-[10px] text-muted-foreground mt-1">
          Kontrol: {new Date(result.checkedAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}
        </p>
      )}
    </motion.div>
  );
}
