import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScoreGauge } from "@/components/ScoreGauge";
import { factCheckNews, type FactCheckResult } from "@/lib/api/factcheck";
import { useToast } from "@/hooks/use-toast";

export function CompareMode() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [result1, setResult1] = useState<FactCheckResult | null>(null);
  const [result2, setResult2] = useState<FactCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCompare = async () => {
    if (!text1.trim() || !text2.trim()) {
      toast({ title: "Hata", description: "Her iki alana da metin girin.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const [r1, r2] = await Promise.all([
        factCheckNews({ text: text1 }),
        factCheckNews({ text: text2 }),
      ]);
      setResult1(r1);
      setResult2(r2);
    } catch (e: any) {
      toast({ title: "Hata", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText1("");
    setText2("");
    setResult1(null);
    setResult2(null);
  };

  if (result1 && result2) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <h3 className="text-center text-sm font-semibold flex items-center justify-center gap-2">
          <Scale className="h-4 w-4 text-primary" /> Karşılaştırma Sonucu
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground line-clamp-2">{text1.substring(0, 60)}...</p>
            <ScoreGauge score={result1.score} />
          </div>
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground line-clamp-2">{text2.substring(0, 60)}...</p>
            <ScoreGauge score={result2.score} />
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          {result1.score > result2.score
            ? "← Sol haber daha güvenilir"
            : result2.score > result1.score
            ? "Sağ haber daha güvenilir →"
            : "Her iki haber benzer güvenilirlikte"}
        </div>
        <Button variant="outline" className="w-full" onClick={handleReset}>Yeni Karşılaştırma</Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Textarea
          placeholder="Birinci haber metni..."
          className="min-h-[100px] resize-none text-xs bg-card/80 backdrop-blur-sm"
          value={text1}
          onChange={(e) => setText1(e.target.value.slice(0, 2000))}
        />
        <Textarea
          placeholder="İkinci haber metni..."
          className="min-h-[100px] resize-none text-xs bg-card/80 backdrop-blur-sm"
          value={text2}
          onChange={(e) => setText2(e.target.value.slice(0, 2000))}
        />
      </div>
      <Button
        onClick={handleCompare}
        disabled={loading}
        className="w-full gap-2"
        size="sm"
      >
        {loading ? "Karşılaştırılıyor..." : <><Scale className="h-4 w-4" /> Karşılaştır</>}
      </Button>
    </div>
  );
}
