import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Clock4 } from "lucide-react";

interface Props { result: FactCheckResult; }

export function SourceAge({ result }: Props) {
  const domains = result.sources.map(s => {
    try { return new URL(s.url).hostname.replace("www.", ""); } catch { return "?"; }
  });

  const knownOld = ["wikipedia.org", "bbc.com", "reuters.com", "aa.com.tr"];
  const knownNew = ["twitter.com", "x.com", "tiktok.com", "t.me"];
  
  const oldCount = domains.filter(d => knownOld.some(k => d.includes(k))).length;
  const newCount = domains.filter(d => knownNew.some(k => d.includes(k))).length;

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <Clock4 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Kaynak Profili:</span>
        <div className="flex gap-2 text-[10px]">
          {oldCount > 0 && <span className="text-success">📰 {oldCount} geleneksel medya</span>}
          {newCount > 0 && <span className="text-primary">📱 {newCount} sosyal medya</span>}
          {oldCount === 0 && newCount === 0 && <span className="text-muted-foreground">{domains.length} kaynak</span>}
        </div>
      </div>
    </motion.div>
  );
}
