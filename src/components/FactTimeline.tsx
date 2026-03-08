import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Clock } from "lucide-react";

interface Props { result: FactCheckResult; }

export function FactTimeline({ result }: Props) {
  const steps = [
    { label: "İçerik alındı", done: true },
    { label: "Kaynaklar tarandı", done: result.sources.length > 0 },
    { label: "Bilgiler doğrulandı", done: result.verified.length > 0 },
    { label: "Uyarılar tespit edildi", done: result.warnings.length > 0 },
    { label: "Sonuç oluşturuldu", done: true },
  ];

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" /> Doğrulama Süreci
      </h4>
      <div className="space-y-2">
        {steps.map((s, i) => (
          <motion.div key={i} className="flex items-center gap-2" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
            <div className={`w-2 h-2 rounded-full ${s.done ? "bg-success" : "bg-muted"}`} />
            <span className={`text-xs ${s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
