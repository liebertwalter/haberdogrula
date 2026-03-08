import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { History } from "lucide-react";

interface Props { result: FactCheckResult; }

export function HistoricalContext({ result }: Props) {
  const insights = [];
  if (result.freshness === "eski") insights.push("Bu haber eski bilgiler içerebilir");
  if (result.category === "siyaset") insights.push("Siyasi haberler bağlamsal değerlendirme gerektirir");
  if (result.category === "ekonomi") insights.push("Ekonomik veriler zaman içinde değişebilir");
  if (result.debunked.length > 0) insights.push("Benzer yanlış bilgiler daha önce de yayılmıştı");
  if (result.score < 40) insights.push("Düşük skorlu haberler genellikle dezenformasyon kampanyalarının parçasıdır");

  if (insights.length === 0) return null;

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <History className="h-3.5 w-3.5" /> Tarihsel Bağlam
      </h4>
      <ul className="space-y-1">
        {insights.map((ins, i) => (
          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
            <span className="text-primary mt-0.5">•</span> {ins}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
