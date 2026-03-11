import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "İyi geceler! 🌙";
  if (hour < 12) return "Günaydın! ☀️";
  if (hour < 18) return "İyi günler! 🌤️";
  return "İyi akşamlar! 🌆";
}

export function WelcomeGreeting() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-primary/10 border border-primary/20 mx-auto w-fit"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">{getGreeting()}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
