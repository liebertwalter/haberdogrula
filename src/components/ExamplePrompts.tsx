import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface ExamplePromptsProps {
  onSelect: (text: string) => void;
}

const examples = [
  {
    label: "🏛️ Siyaset",
    text: "Son dakika: Cumhurbaşkanı yeni bir ekonomi paketi açıkladı. Pakete göre tüm vergi oranları yarıya indirilecek ve asgari ücret 3 katına çıkarılacak.",
  },
  {
    label: "🔬 Bilim",
    text: "NASA, Mars'ta canlı yaşam izleri bulduğunu açıkladı. Perseverance rover'ı tarafından toplanan örneklerde bakteri fosilleri tespit edildi.",
  },
  {
    label: "💊 Sağlık",
    text: "Dünya Sağlık Örgütü, kahvenin kanser riskini %90 azalttığını açıkladı. Günde 5 fincan kahve içenlerde kanser görülme oranı neredeyse sıfır.",
  },
  {
    label: "📱 Teknoloji",
    text: "Apple, iPhone üretimini tamamen Türkiye'ye taşıma kararı aldı. 2027 yılına kadar 10 fabrika kurulacak ve 50.000 kişiye istihdam sağlanacak.",
  },
];

export function ExamplePrompts({ onSelect }: ExamplePromptsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Lightbulb className="h-3.5 w-3.5" />
        Hızlı örneklerle deneyin:
      </p>
      <div className="flex flex-wrap gap-2">
        {examples.map((ex, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(ex.text)}
            className="px-3 py-1.5 text-xs rounded-full border border-border/50 bg-card/60 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer"
          >
            {ex.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
