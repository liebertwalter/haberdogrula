import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { HeartPulse } from "lucide-react";

interface Props { result: FactCheckResult; }

const tones: Record<string, { emoji: string; label: string; color: string; advice: string }> = {
  olumlu: { emoji: "😊", label: "Olumlu Ton", color: "bg-success/10 text-success", advice: "Olumlu haberlere de şüpheyle yaklaşın" },
  olumsuz: { emoji: "😟", label: "Olumsuz Ton", color: "bg-danger/10 text-danger", advice: "Olumsuz haberler dikkatli incelenmeli" },
  nötr: { emoji: "😐", label: "Nötr Ton", color: "bg-primary/10 text-primary", advice: "Dengeli bir dil kullanılmış" },
  korkutucu: { emoji: "😨", label: "Korkutucu Ton", color: "bg-danger/10 text-danger", advice: "Korku dili manipülasyon işareti olabilir" },
  umut_verici: { emoji: "🌟", label: "Umut Verici", color: "bg-success/10 text-success", advice: "Vaatlere temkinli yaklaşın" },
};

export function EmotionalTone({ result }: Props) {
  const t = tones[result.sentiment || "nötr"] || tones.nötr;

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <HeartPulse className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xl">{t.emoji}</span>
        <div className="flex-1">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.color}`}>{t.label}</span>
          <p className="text-[10px] text-muted-foreground mt-0.5">{t.advice}</p>
        </div>
      </div>
    </motion.div>
  );
}
