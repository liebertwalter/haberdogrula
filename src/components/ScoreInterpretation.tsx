import { motion } from "framer-motion";
import { Shield, AlertTriangle, XCircle, CheckCircle } from "lucide-react";

interface ScoreInterpretationProps {
  score: number;
}

export function ScoreInterpretation({ score }: ScoreInterpretationProps) {
  const getInterpretation = () => {
    if (score >= 80) return { icon: CheckCircle, title: "Yüksek Güvenilirlik", desc: "Bu haber birden fazla güvenilir kaynak tarafından desteklenmektedir.", color: "text-success", bg: "bg-success/5 border-success/20" };
    if (score >= 60) return { icon: Shield, title: "Kısmen Güvenilir", desc: "Haberdeki bilgilerin bir kısmı doğrulanmış olsa da bazı iddialar belirsizdir.", color: "text-primary", bg: "bg-primary/5 border-primary/20" };
    if (score >= 40) return { icon: AlertTriangle, title: "Şüpheli İçerik", desc: "Bu haberin güvenilirliği tartışmalıdır. Farklı kaynaklardan doğrulamanız önerilir.", color: "text-warning", bg: "bg-warning/5 border-warning/20" };
    return { icon: XCircle, title: "Güvenilmez İçerik", desc: "Bu haberdeki bilgilerin büyük bölümü yanlış veya yanıltıcı olarak değerlendirilmiştir.", color: "text-danger", bg: "bg-danger/5 border-danger/20" };
  };

  const info = getInterpretation();
  const Icon = info.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`flex items-start gap-3 p-4 rounded-xl border ${info.bg}`}
    >
      <Icon className={`h-5 w-5 mt-0.5 ${info.color}`} />
      <div>
        <h4 className={`text-sm font-semibold ${info.color}`}>{info.title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">{info.desc}</p>
      </div>
    </motion.div>
  );
}
