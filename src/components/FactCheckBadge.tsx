import { useState } from "react";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Badge, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { result: FactCheckResult; }

export function FactCheckBadge({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const badgeCode = `<a href="https://haberdogrula.lovable.app" target="_blank" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;text-decoration:none;background:${result.score >= 70 ? "#dcfce7" : result.score >= 40 ? "#fefce8" : "#fef2f2"};color:${result.score >= 70 ? "#166534" : result.score >= 40 ? "#854d0e" : "#991b1b"};border:1px solid ${result.score >= 70 ? "#bbf7d0" : result.score >= 40 ? "#fef08a" : "#fecaca"}">🛡️ FactCheck %${result.score}</a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(badgeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="h-7 gap-1 text-[11px]">
      {copied ? <Check className="h-3 w-3" /> : <Badge className="h-3 w-3" />}
      {copied ? "Kopyalandı" : "Rozet Kodu"}
    </Button>
  );
}
