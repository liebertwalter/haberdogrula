import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function ResultSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pt-4"
    >
      <div className="flex justify-center">
        <Skeleton className="h-40 w-40 rounded-full" />
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-8 w-64 rounded-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </motion.div>
  );
}
