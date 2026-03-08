import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Layers } from "lucide-react";

interface Props { result: FactCheckResult; }

export function ContextAnalysis({ result }: Props) {
  const contexts = [];
  if (result.category) contexts.push({ label: "Kategori", value: result.category, icon: "📂" });
  if (result.freshness) contexts.push({ label: "Güncellik", value: result.freshness === "güncel" ? "Güncel" : result.freshness === "eski" ? "Eski" : "Belirsiz", icon: "📅" });
  if (result.confidence) contexts.push({ label: "AI Güven", value: result.confidence === "yüksek" ? "Yüksek" : result.confidence === "orta" ? "Orta" : "Düşük", icon: "🤖" });
  if (result.webSearchUsed) contexts.push({ label: "Web Doğrulama", value: "Yapıldı", icon: "🌐" });

  if (contexts.length === 0) return null;

  return (
    <motion.div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Layers className="h-3.5 w-3.5" /> Bağlam Analizi
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {contexts.map((c, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <span className="text-sm">{c.icon}</span>
            <div>
              <p className="text-[10px] text-muted-foreground">{c.label}</p>
              <p className="text-xs font-medium">{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
