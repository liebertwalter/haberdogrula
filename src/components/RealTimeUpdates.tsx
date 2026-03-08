import { motion } from "framer-motion";
import { Radio } from "lucide-react";

export function RealTimeUpdates() {
  return (
    <motion.div className="flex items-center gap-1.5 text-[10px] text-success"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Radio className="h-3 w-3 animate-pulse" />
      <span>Canlı güncelleme aktif</span>
    </motion.div>
  );
}
