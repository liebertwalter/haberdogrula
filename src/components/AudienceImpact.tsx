import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Users } from "lucide-react";

interface Props { result: FactCheckResult; }

export function AudienceImpact({ result }: Props) {
  const impact = result.score < 30 ? "yüksek" : result.score < 60 ? "orta" : "düşük";
  const config = {
    yüksek: { label: "Yüksek Etki Riski", color: "text-danger", desc: "Bu içerik yanlış bilgi yayabilir", emoji: "🔴" },
    orta: { label: "Orta Etki", color: "text-warning", desc: "Dikkatli paylaşım önerilir", emoji: "🟡" },
    düşük: { label: "Düşük Risk", color: "text-success", desc: "Güvenle paylaşılabilir", emoji: "🟢" },
  };
  const c = config[impact];

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
        <div className="flex-1">
          <span className={`text-xs font-bold ${c.color}`}>{c.emoji} {c.label}</span>
          <p className="text-[10px] text-muted-foreground">{c.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
