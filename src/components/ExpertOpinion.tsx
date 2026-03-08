import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { GraduationCap } from "lucide-react";

interface Props { result: FactCheckResult; }

export function ExpertOpinion({ result }: Props) {
  const getOpinion = () => {
    if (result.score >= 80) return "Bu haber yüksek güvenilirlik gösteriyor. Kaynaklarla desteklenmiş bilgiler içeriyor.";
    if (result.score >= 60) return "Bu haber genel olarak güvenilir ancak bazı bilgiler bağımsız doğrulama gerektiriyor.";
    if (result.score >= 40) return "Bu habere dikkatli yaklaşılmalı. Birden fazla kaynaktan doğrulama yapmanız önerilir.";
    return "Bu haber ciddi doğruluk sorunları içeriyor. Paylaşmadan önce mutlaka farklı kaynaklardan kontrol edin.";
  };

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <GraduationCap className="h-3.5 w-3.5" /> Uzman Görüşü
      </h4>
      <p className="text-xs text-foreground italic">"{getOpinion()}"</p>
      <p className="text-[10px] text-muted-foreground">— AI Doğrulama Uzmanı</p>
    </motion.div>
  );
}
