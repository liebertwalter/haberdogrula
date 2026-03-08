import { Share2, Copy, MessageCircle, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type FactCheckResult } from "@/lib/api/factcheck";

interface ShareButtonsProps {
  result: FactCheckResult;
}

export function ShareButtons({ result }: ShareButtonsProps) {
  const { toast } = useToast();

  const resultText = `📰 Haber Doğrulama Sonucu\n\n🎯 Güvenilirlik: %${result.score}\n📝 ${result.summary}\n\n🔗 FactCheck - Haber Doğrula`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resultText);
    toast({ title: "Kopyalandı!", description: "Sonuç panoya kopyalandı." });
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(resultText)}`, "_blank");
  };

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(resultText)}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">
        <Share2 className="h-3.5 w-3.5 inline mr-1" />
        Paylaş:
      </span>
      <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 gap-1.5 text-xs">
        <Copy className="h-3.5 w-3.5" /> Kopyala
      </Button>
      <Button variant="outline" size="sm" onClick={handleWhatsApp} className="h-8 gap-1.5 text-xs text-success border-success/30 hover:bg-success/10">
        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
      </Button>
      <Button variant="outline" size="sm" onClick={handleTwitter} className="h-8 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/10">
        <Twitter className="h-3.5 w-3.5" /> Twitter
      </Button>
    </div>
  );
}
