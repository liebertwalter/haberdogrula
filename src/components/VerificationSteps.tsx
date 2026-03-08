import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { ClipboardCheck } from "lucide-react";

interface Props { result: FactCheckResult; }

export function VerificationSteps({ result }: Props) {
  const steps = [
    { label: "Metin analizi", status: true, detail: "İçerik yapısı incelendi" },
    { label: "Kaynak kontrolü", status: result.sources.length > 0, detail: `${result.sources.length} kaynak bulundu` },
    { label: "Çapraz doğrulama", status: result.webSearchUsed || false, detail: result.webSearchUsed ? "Web araması yapıldı" : "Yapılamadı" },
    { label: "Tarafsızlık kontrolü", status: (result.detailedScores?.bias || 50) > 40, detail: `Tarafsızlık: %${result.detailedScores?.bias || "N/A"}` },
    { label: "Sonuç üretimi", status: true, detail: `Skor: %${result.score}` },
  ];

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <ClipboardCheck className="h-3.5 w-3.5" /> Doğrulama Adımları
      </h4>
      {steps.map((s, i) => (
        <motion.div key={i} className="flex items-center gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${s.status ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>
            {i + 1}
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium">{s.label}</p>
            <p className="text-[10px] text-muted-foreground">{s.detail}</p>
          </div>
          <span className="text-xs">{s.status ? "✅" : "⏳"}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
