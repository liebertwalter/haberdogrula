import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { ExternalLink, ShieldCheck, ShieldAlert } from "lucide-react";

interface SourceCredibilityProps {
  result: FactCheckResult;
}

const knownReliable = [
  "reuters", "bbc", "aa.com", "anadolu", "cnn", "nytimes", "guardian",
  "dw.com", "aljazeera", "apnews", "who.int", "gov.tr", "saglik.gov",
  "trt", "ntv", "haberturk", "hurriyet", "milliyet", "sozcu",
];

const knownUnreliable = [
  "teyit.org", // fact-checker, not unreliable but different
];

export function SourceCredibility({ result }: SourceCredibilityProps) {
  if (result.sources.length === 0) return null;

  const evaluateSource = (url: string) => {
    const domain = url.toLowerCase();
    const isReliable = knownReliable.some((r) => domain.includes(r));
    return isReliable;
  };

  return (
    <motion.div
      className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kaynak Güvenilirliği</h4>
      <div className="space-y-2">
        {result.sources.map((source, i) => {
          const reliable = evaluateSource(source.url);
          return (
            <motion.div
              key={i}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              {reliable ? (
                <ShieldCheck className="h-4 w-4 text-success flex-shrink-0" />
              ) : (
                <ShieldAlert className="h-4 w-4 text-warning flex-shrink-0" />
              )}
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline truncate flex-1"
              >
                {source.title || source.url}
              </a>
              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${reliable ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                {reliable ? "Güvenilir" : "Kontrol Et"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
