import { motion } from "framer-motion";

interface ScoreCelebrationProps {
  score: number;
  summary?: string;
}

const sadKeywords = ["ölüm", "öldü", "hayatını kaybetti", "kaza", "deprem", "sel", "yangın", "savaş", "çatışma", "trajedi", "facia", "cenaze", "terör", "saldırı", "patlama", "şehit", "yaralı", "can kaybı", "felaket", "intihar", "cinayet", "kayıp", "yıkım", "göçük", "boğulma"];
const happyKeywords = ["başarı", "zafer", "kazandı", "ödül", "rekor", "keşif", "buluş", "mutlu", "kutlama", "şampiyon", "altın madalya", "kurtarıldı", "barış", "anlaşma", "açılış"];
const scienceKeywords = ["bilim", "araştırma", "uzay", "nasa", "mars", "keşif", "rover", "gezegen", "atom", "deney", "laboratuvar"];
const politicsKeywords = ["cumhurbaşkan", "meclis", "hükümet", "parti", "seçim", "bakan", "yasa", "parlamento"];
const techKeywords = ["teknoloji", "apple", "google", "yapay zeka", "ai", "robot", "uygulama", "yazılım", "iphone"];
const healthKeywords = ["sağlık", "hastane", "doktor", "ilaç", "tedavi", "kanser", "aşı", "virüs"];

function detectMood(score: number, summary: string = ""): { emoji: string; text: string; color: string; bg: string } {
  const lower = summary.toLowerCase();
  
  const isSad = sadKeywords.some(k => lower.includes(k));
  const isHappy = happyKeywords.some(k => lower.includes(k));
  const isScience = scienceKeywords.some(k => lower.includes(k));
  const isPolitics = politicsKeywords.some(k => lower.includes(k));
  const isTech = techKeywords.some(k => lower.includes(k));
  const isHealth = healthKeywords.some(k => lower.includes(k));

  // Sad news - regardless of score
  if (isSad) {
    if (score >= 70) return { emoji: "😢", text: "Üzücü ama doğrulanmış bir haber", color: "text-muted-foreground", bg: "bg-muted/50 border-border" };
    if (score >= 40) return { emoji: "😟", text: "Üzücü ve şüpheli bir haber", color: "text-warning", bg: "bg-warning/10 border-warning/20" };
    return { emoji: "😰", text: "Üzücü ve güvenilmez bir haber", color: "text-danger", bg: "bg-danger/10 border-danger/20" };
  }

  // Happy news
  if (isHappy && score >= 70) return { emoji: "🎉", text: "Harika ve doğrulanmış bir haber!", color: "text-success", bg: "bg-success/10 border-success/20" };
  if (isHappy && score >= 40) return { emoji: "🤔", text: "Güzel ama şüpheli bir haber", color: "text-warning", bg: "bg-warning/10 border-warning/20" };
  if (isHappy) return { emoji: "😕", text: "Güzel görünse de güvenilir değil", color: "text-danger", bg: "bg-danger/10 border-danger/20" };

  // Science news
  if (isScience && score >= 70) return { emoji: "🔬", text: "Bilimsel ve doğrulanmış bir haber", color: "text-success", bg: "bg-success/10 border-success/20" };
  if (isScience) return { emoji: "🧪", text: "Bilimsel iddia - dikkatli olun", color: "text-warning", bg: "bg-warning/10 border-warning/20" };

  // Health news
  if (isHealth && score >= 70) return { emoji: "💊", text: "Sağlık haberi doğrulandı", color: "text-success", bg: "bg-success/10 border-success/20" };
  if (isHealth) return { emoji: "⚕️", text: "Sağlık haberi - kaynak doğrulayın", color: "text-warning", bg: "bg-warning/10 border-warning/20" };

  // Tech news
  if (isTech && score >= 70) return { emoji: "🚀", text: "Teknoloji haberi doğrulandı", color: "text-success", bg: "bg-success/10 border-success/20" };
  if (isTech) return { emoji: "📱", text: "Teknoloji haberi - şüpheli", color: "text-warning", bg: "bg-warning/10 border-warning/20" };

  // Politics
  if (isPolitics && score >= 70) return { emoji: "🏛️", text: "Siyasi haber doğrulandı", color: "text-success", bg: "bg-success/10 border-success/20" };
  if (isPolitics) return { emoji: "⚖️", text: "Siyasi haber - dikkatli olun", color: "text-warning", bg: "bg-warning/10 border-warning/20" };

  // Generic by score
  if (score >= 70) return { emoji: "✅", text: "Bu haber büyük olasılıkla güvenilir!", color: "text-success", bg: "bg-success/10 border-success/20" };
  if (score >= 40) return { emoji: "⚠️", text: "Bu habere dikkatli yaklaşın", color: "text-warning", bg: "bg-warning/10 border-warning/20" };
  return { emoji: "❌", text: "Bu haber güvenilir görünmüyor!", color: "text-danger", bg: "bg-danger/10 border-danger/20" };
}

export function ScoreCelebration({ score, summary = "" }: ScoreCelebrationProps) {
  const mood = detectMood(score, summary);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full border text-sm font-medium ${mood.bg} ${mood.color}`}
    >
      <span className="text-lg">{mood.emoji}</span>
      {mood.text}
    </motion.div>
  );
}
