import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { AlertTriangle, Shield, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react";

interface TrustSignalProps {
  result: FactCheckResult;
}

export function TrustSignal({ result }: TrustSignalProps) {
  const signals: { label: string; positive: boolean; icon: typeof Shield }[] = [];

  if (result.sources.length >= 3) signals.push({ label: "3+ kaynak var", positive: true, icon: Shield });
  else signals.push({ label: "Yetersiz kaynak", positive: false, icon: AlertTriangle });

  if (result.verified.length > result.debunked.length) signals.push({ label: "Doğru bilgi ağırlıklı", positive: true, icon: ThumbsUp });
  else if (result.debunked.length > 0) signals.push({ label: "Yanlış bilgi içeriyor", positive: false, icon: ThumbsDown });

  if (result.freshness === "güncel") signals.push({ label: "Güncel bilgi", positive: true, icon: Shield });
  else if (result.freshness === "eski") signals.push({ label: "Eski bilgi", positive: false, icon: AlertTriangle });

  if (result.confidence === "yüksek") signals.push({ label: "Yüksek AI güveni", positive: true, icon: Shield });
  else if (result.confidence === "düşük") signals.push({ label: "Düşük AI güveni", positive: false, icon: HelpCircle });

  if (result.warnings.length === 0) signals.push({ label: "Uyarı yok", positive: true, icon: ThumbsUp });
  else if (result.warnings.length >= 3) signals.push({ label: "Çok sayıda uyarı", positive: false, icon: AlertTriangle });

  return (
    <motion.div
      className="space-y-1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Güven Sinyalleri</h4>
      <div className="flex flex-wrap gap-1.5">
        {signals.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.span
              key={i}
              className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border font-medium ${
                s.positive
                  ? "text-success bg-success/5 border-success/20"
                  : "text-danger bg-danger/5 border-danger/20"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Icon className="h-3 w-3" />
              {s.label}
            </motion.span>
          );
        })}
      </div>
    </motion.div>
  );
}
