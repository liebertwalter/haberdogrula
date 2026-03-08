import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = totalHeight > 0 ? Math.round((window.scrollY / totalHeight) * 100) : 0;
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (progress === 0) return null;

  return (
    <motion.div className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-muted"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="h-full bg-primary transition-all duration-150" style={{ width: `${progress}%` }} />
    </motion.div>
  );
}
