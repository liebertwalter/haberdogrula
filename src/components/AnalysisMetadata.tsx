import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Zap, Clock, Shield, Globe } from "lucide-react";

interface AnalysisMetadataProps {
  result: FactCheckResult;
  elapsedTime: number;
}

export function AnalysisMetadata({ result, elapsedTime }: AnalysisMetadataProps) {
  return (
    <motion.div
      className="flex flex-wrap gap-2 justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {elapsedTime > 0 && (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground">
          <Clock className="h-3 w-3" /> {elapsedTime}s analiz süresi
        </span>
      )}
      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground">
        <Shield className="h-3 w-3" /> {result.sources.length} kaynak kontrol edildi
      </span>
      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground">
        <Zap className="h-3 w-3" /> AI destekli analiz
      </span>
      {result.webSearchUsed && (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-success/10 text-success">
          <Globe className="h-3 w-3" /> Web doğrulaması yapıldı
        </span>
      )}
    </motion.div>
  );
}
