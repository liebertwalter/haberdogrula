import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Columns3 } from "lucide-react";

interface Props { result: FactCheckResult; }

export function MultiSourceView({ result }: Props) {
  if (result.sources.length < 2) return null;

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Columns3 className="h-3.5 w-3.5" /> Çoklu Kaynak Görünümü
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {result.sources.slice(0, 4).map((s, i) => {
          let domain = "kaynak";
          try { domain = new URL(s.url).hostname.replace("www.", ""); } catch {}
          return (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors group">
              <p className="text-[10px] text-muted-foreground group-hover:text-primary truncate">{domain}</p>
              <p className="text-xs font-medium truncate group-hover:text-primary">{s.title}</p>
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}
