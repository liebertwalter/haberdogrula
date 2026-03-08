import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const tips = [
  "💡 Bilgi: Haber metninin tamamını yapıştırmak daha doğru sonuçlar verir.",
  "🔗 İpucu: URL ile doğrulama, haberin orijinal kaynağını kontrol eder.",
  "📊 Bilgi: %70 ve üzeri puan alan haberler genellikle güvenilir kabul edilir.",
  "⚡ İpucu: Ctrl+Enter ile hızlıca doğrulama başlatabilirsiniz.",
  "❤️ Bilgi: Sonuçları favorilere ekleyerek daha sonra tekrar inceleyebilirsiniz.",
  "🖨️ İpucu: Sonuçları yazdırarak arşivleyebilirsiniz.",
  "🔍 Bilgi: Geçmiş aramalarınızı filtreleyerek eski sonuçlara ulaşabilirsiniz.",
];

export function TipBanner() {
  const [visible, setVisible] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("tip-dismissed");
    if (!dismissed) {
      setTipIndex(Math.floor(Math.random() * tips.length));
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("tip-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-primary/5 border-b border-primary/10"
        >
          <div className="container mx-auto px-4 py-2 flex items-center justify-between max-w-2xl">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              {tips[tipIndex]}
            </p>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={dismiss}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
