import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { MessageSquareText } from "lucide-react";

interface SummaryCardProps {
  result: FactCheckResult;
}

export function SummaryCard({ result }: SummaryCardProps) {
  const getEmoji = (score: number) => {
    if (score >= 90) return "🛡️";
    if (score >= 70) return "✅";
    if (score >= 50) return "🤔";
    if (score >= 30) return "⚠️";
    return "❌";
  };

  const getBgClass = (score: number) => {
    if (score >= 70) return "bg-success/5 border-success/20";
    if (score >= 40) return "bg-warning/5 border-warning/20";
    return "bg-danger/5 border-danger/20";
  };

  return (
    <motion.div
      className={`p-4 rounded-xl border ${getBgClass(result.score)} space-y-2`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{getEmoji(result.score)}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquareText className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Sonuç Özeti</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {result.category && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            📁 {result.category}
          </span>
        )}
        {result.sentiment && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {result.sentiment === "olumlu" ? "😊" : result.sentiment === "olumsuz" ? "😟" : result.sentiment === "korkutucu" ? "😨" : "😐"} {result.sentiment}
          </span>
        )}
        {result.confidence && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            🤖 AI Güven: {result.confidence}
          </span>
        )}
      </div>
    </motion.div>
  );
}
