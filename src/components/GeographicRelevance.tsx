import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { MapPin } from "lucide-react";

interface Props { result: FactCheckResult; }

export function GeographicRelevance({ result }: Props) {
  const text = result.summary.toLowerCase();
  const regions = [];
  if (text.includes("türkiye") || text.includes("ankara") || text.includes("istanbul")) regions.push("🇹🇷 Türkiye");
  if (text.includes("abd") || text.includes("amerika") || text.includes("washington")) regions.push("🇺🇸 ABD");
  if (text.includes("avrupa") || text.includes("ab ")) regions.push("🇪🇺 Avrupa");
  if (text.includes("rusya") || text.includes("moskova")) regions.push("🇷🇺 Rusya");
  if (text.includes("ukrayna") || text.includes("kiev")) regions.push("🇺🇦 Ukrayna");
  if (text.includes("çin") || text.includes("pekin")) regions.push("🇨🇳 Çin");
  if (regions.length === 0) regions.push("🌍 Genel");

  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Coğrafi Bağlam:</span>
        <div className="flex gap-1.5">
          {regions.map((r, i) => (
            <span key={i} className="text-xs font-medium">{r}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
