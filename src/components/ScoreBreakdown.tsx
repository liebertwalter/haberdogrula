import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";

interface ScoreBreakdownProps {
  result: FactCheckResult;
}

export function ScoreBreakdown({ result }: ScoreBreakdownProps) {
  const metrics = [
    { label: "Kaynak Güvenilirliği", value: Math.min(100, result.sources.length * 25), color: "bg-primary" },
    { label: "Doğrulanan Bilgi", value: result.verified.length > 0 ? Math.min(100, result.verified.length * 20 + 30) : 10, color: "bg-success" },
    { label: "Uyarı Seviyesi", value: result.warnings.length > 0 ? Math.max(10, 100 - result.warnings.length * 25) : 100, color: "bg-warning" },
    { label: "Yanlış Bilgi Oranı", value: result.debunked.length > 0 ? Math.max(5, 100 - result.debunked.length * 30) : 100, color: "bg-danger" },
  ];

  return (
    <div className="space-y-3 p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detaylı Puan Dağılımı</h4>
      {metrics.map((m, i) => (
        <div key={m.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{m.label}</span>
            <span className="font-medium">%{m.value}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${m.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${m.value}%` }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
