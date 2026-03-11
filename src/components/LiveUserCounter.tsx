import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export function LiveUserCounter() {
  const [count, setCount] = useState(() => 120 + Math.floor(Math.random() * 80));

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-success/10 border border-success/20 mx-auto w-fit"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
      </span>
      <Users className="h-3.5 w-3.5 text-success" />
      <span className="text-xs font-medium text-success">
        {count} kişi aktif
      </span>
    </motion.div>
  );
}
