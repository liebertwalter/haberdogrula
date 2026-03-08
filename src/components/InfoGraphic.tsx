import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { PieChart } from "lucide-react";

interface Props { result: FactCheckResult; }

export function InfoGraphic({ result }: Props) {
  const total = result.verified.length + result.debunked.length + result.warnings.length;
  if (total === 0) return null;

  const segments = [
    { label: "Doğru", count: result.verified.length, color: "bg-success", textColor: "text-success" },
    { label: "Yanlış", count: result.debunked.length, color: "bg-danger", textColor: "text-danger" },
    { label: "Uyarı", count: result.warnings.length, color: "bg-warning", textColor: "text-warning" },
  ].filter(s => s.count > 0);

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <PieChart className="h-3.5 w-3.5" /> Bilgi Dağılımı
      </h4>
      <div className="flex items-center gap-4">
        {/* Simple donut-like bars */}
        <div className="flex-1 space-y-1.5">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`text-[10px] w-12 ${s.textColor} font-medium`}>{s.label}</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <motion.div className={`h-full rounded-full ${s.color}`}
                  initial={{ width: 0 }} animate={{ width: `${(s.count / total) * 100}%` }}
                  transition={{ delay: i * 0.15, duration: 0.5 }} />
              </div>
              <span className="text-xs font-bold w-6 text-right">{s.count}</span>
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-[10px] text-muted-foreground">Toplam Bilgi</p>
        </div>
      </div>
    </motion.div>
  );
}
