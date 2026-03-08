import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface ReadingTimeProps {
  result: { summary: string; warnings: string[]; verified: string[]; debunked: string[] };
}

export function ReadingTime({ result }: ReadingTimeProps) {
  const allText = [result.summary, ...result.warnings, ...result.verified, ...result.debunked].join(" ");
  const words = allText.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground"
    >
      <Clock className="h-3 w-3" />
      Tahmini okuma süresi: {minutes} dakika
    </motion.div>
  );
}
