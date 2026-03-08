import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { TriangleAlert } from "lucide-react";

interface Props { result: FactCheckResult; }

export function ContentWarning({ result }: Props) {
  if (result.score >= 40) return null;

  return (
    <motion.div className="p-4 rounded-xl bg-danger/10 border border-danger/30 space-y-2"
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="flex items-center gap-2">
        <TriangleAlert className="h-5 w-5 text-danger" />
        <h4 className="text-sm font-bold text-danger">⚠️ Güvenilirlik Uyarısı</h4>
      </div>
      <p className="text-xs text-danger/80">
        Bu içerik düşük güvenilirlik puanı almıştır (%{result.score}). Bu haberi paylaşmadan önce farklı kaynaklardan doğrulama yapmanız önerilir.
      </p>
      {result.debunked.length > 0 && (
        <p className="text-[10px] text-danger/60">{result.debunked.length} yanlış bilgi tespit edildi</p>
      )}
    </motion.div>
  );
}
