import { motion } from "framer-motion";
import { RefreshCw, Loader2 } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  // This provides a visual refresh button for mobile
  return (
    <div className="relative">
      <motion.button
        className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        onClick={onRefresh}
        whileTap={{ scale: 0.95 }}
      >
        <RefreshCw className="h-3 w-3" />
        <span>Yenile</span>
      </motion.button>
      {children}
    </div>
  );
}
