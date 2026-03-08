import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Newspaper, Clock, Tag, TrendingUp } from "lucide-react";

interface NewsCardPreviewProps {
  result: FactCheckResult;
}

export function NewsCardPreview({ result }: NewsCardPreviewProps) {
  const getStatusColor = (score: number) => {
    if (score >= 70) return "border-l-success";
    if (score >= 40) return "border-l-warning";
    return "border-l-danger";
  };

  const getStatusText = (score: number) => {
    if (score >= 90) return "✅ Doğrulandı";
    if (score >= 70) return "🟢 Güvenilir";
    if (score >= 50) return "🟡 Dikkatli Ol";
    if (score >= 30) return "🟠 Şüpheli";
    return "🔴 Güvenilir Değil";
  };

  return (
    <motion.div
      className={`p-4 rounded-xl bg-card border border-border/50 border-l-4 ${getStatusColor(result.score)} space-y-2 shadow-sm`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold">Doğrulama Kartı</span>
        </div>
        <span className="text-xs font-bold">{getStatusText(result.score)}</span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{result.summary}</p>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        {result.category && (
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" /> {result.category}
          </span>
        )}
        {result.checkedAt && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {new Date(result.checkedAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "short", timeStyle: "short" })}
          </span>
        )}
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> %{result.score}
        </span>
      </div>
    </motion.div>
  );
}
