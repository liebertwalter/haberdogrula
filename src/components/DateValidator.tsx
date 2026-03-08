import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Clock, CalendarDays, AlertTriangle } from "lucide-react";

interface DateValidatorProps {
  result: FactCheckResult;
}

export function DateValidator({ result }: DateValidatorProps) {
  const now = new Date();
  const checkedAt = result.checkedAt ? new Date(result.checkedAt) : now;

  const turkeyTime = now.toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "full",
    timeStyle: "short",
  });

  const freshnessInfo = {
    güncel: { label: "Güncel Bilgi", color: "text-success", bgColor: "bg-success/10", icon: "✅" },
    eski: { label: "Eski Bilgi - Dikkat!", color: "text-warning", bgColor: "bg-warning/10", icon: "⚠️" },
    belirsiz: { label: "Tarih Belirsiz", color: "text-muted-foreground", bgColor: "bg-muted", icon: "❓" },
  };

  const info = freshnessInfo[result.freshness as keyof typeof freshnessInfo] || freshnessInfo.belirsiz;

  return (
    <motion.div
      className={`p-3 rounded-xl border border-border/50 space-y-2 ${info.bgColor}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold">Tarih Doğrulama</span>
        </div>
        <span className={`text-xs font-medium ${info.color}`}>{info.icon} {info.label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Doğrulama: {checkedAt.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "short", timeStyle: "short" })}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays className="h-3 w-3" />
          <span>Şu an: {turkeyTime}</span>
        </div>
      </div>
      {result.freshness === "eski" && (
        <div className="flex items-center gap-1.5 text-[10px] text-warning">
          <AlertTriangle className="h-3 w-3" />
          <span>Bu haberdeki bilgiler güncelliğini yitirmiş olabilir</span>
        </div>
      )}
    </motion.div>
  );
}
