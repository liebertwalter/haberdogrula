import { useState } from "react";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Quote, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { result: FactCheckResult; }

export function CitationGenerator({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const citation = `FactCheck Doğrulama Raporu. Güvenilirlik: %${result.score}. "${result.summary.substring(0, 100)}..." ${result.sources.length} kaynak ile doğrulandı. Tarih: ${new Date().toLocaleDateString("tr-TR")}. haberdogrula.lovable.app`;

  const handleCopy = () => {
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="h-7 gap-1 text-[11px]">
      {copied ? <Check className="h-3 w-3" /> : <Quote className="h-3 w-3" />}
      {copied ? "Kopyalandı" : "Alıntı"}
    </Button>
  );
}
