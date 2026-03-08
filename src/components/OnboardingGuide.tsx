import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Hoş Geldiniz! 👋",
    desc: "FactCheck ile haberlerin güvenilirliğini yapay zeka ile kontrol edebilirsiniz.",
  },
  {
    title: "Metin veya URL Girin 📝",
    desc: "Doğrulamak istediğiniz haberin metnini yapıştırın veya URL'sini girin.",
  },
  {
    title: "Sonuçları İnceleyin 📊",
    desc: "AI analiz sonucunda güvenilirlik puanı, kaynaklar ve detaylı rapor göreceksiniz.",
  },
  {
    title: "Paylaşın & Kaydedin 🔗",
    desc: "Sonuçları paylaşabilir, favorilere ekleyebilir veya yazdırabilirsiniz.",
  },
];

export function OnboardingGuide() {
  const [show, setShow] = useState(() => !localStorage.getItem("onboarding-done"));
  const [step, setStep] = useState(0);

  const finish = () => {
    setShow(false);
    localStorage.setItem("onboarding-done", "true");
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">{step + 1}/{steps.length}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={finish}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold">{steps[step].title}</h3>
            <p className="text-sm text-muted-foreground">{steps[step].desc}</p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-muted"}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step < steps.length - 1 ? (
              <>
                <Button variant="ghost" className="flex-1" onClick={finish}>Geç</Button>
                <Button className="flex-1 gap-1" onClick={() => setStep(step + 1)}>
                  İleri <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button className="w-full" onClick={finish}>Başlayalım! 🚀</Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
