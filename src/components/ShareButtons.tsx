import { Share2, Copy, MessageCircle, Twitter, Mail, Send, Download, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type FactCheckResult } from "@/lib/api/factcheck";

interface ShareButtonsProps {
  result: FactCheckResult;
  shareUrl?: string;
}

const getScoreEmoji = (score: number) => {
  if (score >= 80) return "✅";
  if (score >= 60) return "🟡";
  if (score >= 40) return "⚠️";
  return "❌";
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return "Güvenilir";
  if (score >= 60) return "Kısmen Güvenilir";
  if (score >= 40) return "Şüpheli";
  return "Güvenilir Değil";
};

export function ShareButtons({ result, shareUrl }: ShareButtonsProps) {
  const { toast } = useToast();

  const emoji = getScoreEmoji(result.score);
  const label = getScoreLabel(result.score);
  const link = shareUrl || "https://haberdogrula.lovable.app";

  const resultText = `${emoji} Haber Doğrulama Sonucu\n\n🎯 Güvenilirlik: %${result.score} (${label})\n📝 ${result.summary}\n\n${result.verified.length > 0 ? `✅ Doğrulanan: ${result.verified.length} bilgi\n` : ""}${result.debunked.length > 0 ? `❌ Yanlış: ${result.debunked.length} bilgi\n` : ""}${result.warnings.length > 0 ? `⚠️ Uyarı: ${result.warnings.length} nokta\n` : ""}\n📊 Kaynak sayısı: ${result.sources.length}\n\n🔗 Sonucu gör: ${link}`;

  const shortText = `${emoji} Haber Doğrulama: %${result.score} (${label}) - ${result.summary.substring(0, 80)}... 🔗 ${link}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resultText);
    toast({ title: "Kopyalandı! 📋", description: "Detaylı sonuç panoya kopyalandı." });
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(resultText)}`, "_blank");
  };

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shortText)}&url=${encodeURIComponent(link)}`, "_blank");
  };

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent("https://haberdogrula.lovable.app")}&text=${encodeURIComponent(resultText)}`, "_blank");
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shortText)}&u=${encodeURIComponent("https://haberdogrula.lovable.app")}`, "_blank");
  };

  const handleEmail = () => {
    const subject = `${emoji} Haber Doğrulama Sonucu - %${result.score}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(resultText)}`, "_blank");
  };

  const handleExportText = async () => {
    const blob = new Blob([resultText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factcheck-${result.score}-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "İndirildi! 📥", description: "Sonuç dosyası indirildi." });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
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
          <Twitter className="h-3.5 w-3.5" /> X
        </Button>
        <Button variant="outline" size="sm" onClick={handleTelegram} className="h-8 gap-1.5 text-xs text-[hsl(200,80%,50%)] border-[hsl(200,80%,50%)]/30 hover:bg-[hsl(200,80%,50%)]/10">
          <Send className="h-3.5 w-3.5" /> Telegram
        </Button>
        <Button variant="outline" size="sm" onClick={handleFacebook} className="h-8 gap-1.5 text-xs text-[hsl(220,70%,50%)] border-[hsl(220,70%,50%)]/30 hover:bg-[hsl(220,70%,50%)]/10">
          <Facebook className="h-3.5 w-3.5" /> Facebook
        </Button>
        <Button variant="outline" size="sm" onClick={handleEmail} className="h-8 gap-1.5 text-xs">
          <Mail className="h-3.5 w-3.5" /> E-posta
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportText} className="h-8 gap-1.5 text-xs">
          <Download className="h-3.5 w-3.5" /> İndir
        </Button>
      </div>
    </div>
  );
}
