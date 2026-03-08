import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "hsl(var(--success))";
    if (s >= 60) return "hsl(var(--warning))";
    if (s >= 40) return "hsl(210, 60%, 50%)";
    return "hsl(var(--danger))";
  };

  const getLabel = (s: number) => {
    if (s >= 90) return "Kesinlikle DOĞRU ✅";
    if (s >= 70) return "Büyük olasılıkla DOĞRU";
    if (s >= 50) return "KARIŞIK - Dikkatli Olun";
    if (s >= 30) return "ŞÜPHELİ ⚠️";
    if (s >= 10) return "Büyük olasılıkla YANLIŞ ❌";
    return "UYDURMA 🚫";
  };

  const getEmoji = (s: number) => {
    if (s >= 90) return "🛡️";
    if (s >= 70) return "✅";
    if (s >= 50) return "🤔";
    if (s >= 30) return "⚠️";
    return "❌";
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
          <motion.circle
            cx="100" cy="100" r={radius} fill="none" stroke={color}
            strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl mb-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {getEmoji(score)}
          </motion.span>
          <motion.span
            className="text-4xl font-bold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            %{score}
          </motion.span>
        </div>
      </div>
      <motion.p
        className="text-lg font-semibold"
        style={{ color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {getLabel(score)}
      </motion.p>
    </div>
  );
}
