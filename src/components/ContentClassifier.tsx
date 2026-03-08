import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Tag } from "lucide-react";

interface Props { result: FactCheckResult; }

export function ContentClassifier({ result }: Props) {
  const types = [];
  if (result.score >= 80) types.push({ label: "Doğrulanmış Haber", color: "bg-success/10 text-success" });
  if (result.score < 30) types.push({ label: "Şüpheli İçerik", color: "bg-danger/10 text-danger" });
  if (result.warnings.length > 2) types.push({ label: "Çoklu Uyarı", color: "bg-warning/10 text-warning" });
  if (result.webSearchUsed) types.push({ label: "Web Doğrulamalı", color: "bg-primary/10 text-primary" });
  if (result.sources.length >= 3) types.push({ label: "Çoklu Kaynak", color: "bg-success/10 text-success" });
  if (result.sentiment === "korkutucu") types.push({ label: "Korkutucu İçerik", color: "bg-danger/10 text-danger" });

  if (types.length === 0) return null;

  return (
    <motion.div className="flex flex-wrap gap-1.5 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {types.map((t, i) => (
        <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${t.color}`}>
          <Tag className="h-2.5 w-2.5 inline mr-0.5" /> {t.label}
        </span>
      ))}
    </motion.div>
  );
}
