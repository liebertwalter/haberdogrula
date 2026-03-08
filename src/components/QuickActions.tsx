import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Copy, Check, ExternalLink, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Props { result: FactCheckResult; }

export function QuickActions({ result }: Props) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopySummary = () => {
    navigator.clipboard.writeText(`FactCheck %${result.score}: ${result.summary}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReport = () => {
    toast({ title: "Bildirildi", description: "Bu sonuç incelenmek üzere bildirildi." });
  };

  return (
    <motion.div className="flex flex-wrap gap-1.5 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Button variant="outline" size="sm" onClick={handleCopySummary} className="h-7 gap-1 text-[11px]">
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "Kopyalandı" : "Özeti Kopyala"}
      </Button>
      {result.sources[0] && (
        <Button variant="outline" size="sm" asChild className="h-7 gap-1 text-[11px]">
          <a href={result.sources[0].url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3 w-3" /> Kaynağa Git
          </a>
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={handleReport} className="h-7 gap-1 text-[11px]">
        <Flag className="h-3 w-3" /> Bildir
      </Button>
    </motion.div>
  );
}
