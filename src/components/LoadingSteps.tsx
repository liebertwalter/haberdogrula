import { motion } from "framer-motion";
import { Search, Globe, Brain, FileCheck } from "lucide-react";

const steps = [
  { icon: Globe, label: "Haber içeriği analiz ediliyor..." },
  { icon: Search, label: "İnternet kaynakları araştırılıyor..." },
  { icon: Brain, label: "Bilgiler karşılaştırılıyor..." },
  { icon: FileCheck, label: "Doğrulama raporu hazırlanıyor..." },
];

interface LoadingStepsProps {
  currentStep: number;
}

export function LoadingSteps({ currentStep }: LoadingStepsProps) {
  return (
    <div className="flex flex-col gap-4 py-8">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = i === currentStep;
        const isDone = i < currentStep;

        return (
          <motion.div
            key={i}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isDone
                  ? "bg-success/20 text-success"
                  : isActive
                  ? "bg-primary/20 text-primary animate-pulse-glow"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                isDone
                  ? "text-success"
                  : isActive
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
