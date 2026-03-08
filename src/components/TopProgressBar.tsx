import { motion, AnimatePresence } from "framer-motion";

interface TopProgressBarProps {
  isLoading: boolean;
  step: number;
  totalSteps: number;
}

export function TopProgressBar({ isLoading, step, totalSteps }: TopProgressBarProps) {
  const progress = isLoading ? ((step + 1) / totalSteps) * 100 : 0;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] h-1 bg-muted"
        >
          <motion.div
            className="h-full bg-primary rounded-r-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
