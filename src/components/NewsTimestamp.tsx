import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { CalendarClock } from "lucide-react";

interface Props { result: FactCheckResult; }

export function NewsTimestamp({ result }: Props) {
  if (!result.checkedAt) return null;

  const checked = new Date(result.checkedAt);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - checked.getTime()) / 60000);

  let timeAgo = "";
  if (diffMin < 1) timeAgo = "Az önce";
  else if (diffMin < 60) timeAgo = `${diffMin} dk önce`;
  else if (diffMin < 1440) timeAgo = `${Math.floor(diffMin / 60)} saat önce`;
  else timeAgo = `${Math.floor(diffMin / 1440)} gün önce`;

  return (
    <motion.div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <CalendarClock className="h-3 w-3" />
      <span>Doğrulandı: {timeAgo} • {checked.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "short", timeStyle: "short" })}</span>
    </motion.div>
  );
}
