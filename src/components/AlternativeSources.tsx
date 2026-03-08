import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { BookOpen, ExternalLink } from "lucide-react";

interface Props { result: FactCheckResult; }

export function AlternativeSources({ result }: Props) {
  const altSources = [
    { name: "Teyit.org", url: "https://teyit.org", desc: "Türkiye'nin doğrulama platformu" },
    { name: "FactCheck.org", url: "https://www.factcheck.org", desc: "Uluslararası doğrulama" },
    { name: "Snopes", url: "https://www.snopes.com", desc: "En eski doğrulama sitesi" },
    { name: "Reuters Fact Check", url: "https://www.reuters.com/fact-check", desc: "Reuters doğrulama birimi" },
  ];

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <BookOpen className="h-3.5 w-3.5" /> Alternatif Doğrulama Kaynakları
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {altSources.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors group">
            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
            <div>
              <p className="text-xs font-medium group-hover:text-primary">{s.name}</p>
              <p className="text-[9px] text-muted-foreground">{s.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
