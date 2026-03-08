import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Network } from "lucide-react";

interface Props { result: FactCheckResult; }

export function SourceDiversity({ result }: Props) {
  const domains = result.sources.map(s => {
    try { return new URL(s.url).hostname.replace("www.", ""); } catch { return "bilinmiyor"; }
  });
  const unique = [...new Set(domains)];
  const diversity = result.sources.length > 0 ? Math.round((unique.length / result.sources.length) * 100) : 0;

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Network className="h-3.5 w-3.5" /> Kaynak Çeşitliliği
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${diversity >= 70 ? "text-success" : diversity >= 40 ? "text-warning" : "text-danger"}`}>
            %{diversity}
          </span>
          <span className="text-[10px] text-muted-foreground">{unique.length} farklı kaynak</span>
        </div>
      </div>
    </motion.div>
  );
}
