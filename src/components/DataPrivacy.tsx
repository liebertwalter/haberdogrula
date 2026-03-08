import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export function DataPrivacy() {
  return (
    <motion.div className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2">
        <Lock className="h-3.5 w-3.5 text-success" />
        <p className="text-[10px] text-muted-foreground">
          Verileriniz güvenle işlenir. Kişisel bilgi toplanmaz. Aramalarınız anonim olarak saklanır.
        </p>
      </div>
    </motion.div>
  );
}
