import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface ReliabilityMeterProps {
  result: FactCheckResult;
}

export function ReliabilityMeter({ result }: ReliabilityMeterProps) {
  const { score } = result;

  const levels = [
    { min: 0, max: 19, label: "Uydurma", color: "bg-danger", textColor: "text-danger", emoji: "🚫" },
    { min: 20, max: 39, label: "Güvenilir Değil", color: "bg-danger/70", textColor: "text-danger", emoji: "❌" },
    { min: 40, max: 59, label: "Şüpheli", color: "bg-warning", textColor: "text-warning", emoji: "⚠️" },
    { min: 60, max: 79, label: "Kısmen Güvenilir", color: "bg-warning/70", textColor: "text-warning", emoji: "🤔" },
    { min: 80, max: 89, label: "Güvenilir", color: "bg-success/70", textColor: "text-success", emoji: "✅" },
    { min: 90, max: 100, label: "Çok Güvenilir", color: "bg-success", textColor: "text-success", emoji: "🛡️" },
  ];

  const currentLevel = levels.find((l) => score >= l.min && score <= l.max) || levels[0];

  return (
    <motion.div
      className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Güvenilirlik Seviyesi</h4>

      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
        {levels.map((level) => (
          <div
            key={level.label}
            className={`absolute h-full ${level.color} opacity-30`}
            style={{
              left: `${level.min}%`,
              width: `${level.max - level.min + 1}%`,
            }}
          />
        ))}
        <motion.div
          className="absolute h-full top-0 left-0 bg-foreground/20 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-foreground border-2 border-background shadow-lg"
          initial={{ left: "0%" }}
          animate={{ left: `calc(${score}% - 10px)` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>0</span>
        <span>20</span>
        <span>40</span>
        <span>60</span>
        <span>80</span>
        <span>100</span>
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl">{currentLevel.emoji}</span>
        <span className={`text-sm font-bold ${currentLevel.textColor}`}>{currentLevel.label}</span>
      </div>

      {score < 50 && (
        <div className="flex items-center gap-2 text-xs text-danger bg-danger/10 rounded-lg p-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>Bu haber güvenilir kaynaklarla doğrulanamamıştır. Paylaşmadan önce dikkatli olun.</span>
        </div>
      )}
    </motion.div>
  );
}
