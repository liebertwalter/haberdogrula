import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type FactCheckResult } from "@/lib/api/factcheck";

interface PrintResultProps {
  result: FactCheckResult;
}

export function PrintResult({ result }: PrintResultProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const scoreColor = result.score >= 70 ? "#22c55e" : result.score >= 40 ? "#f59e0b" : "#ef4444";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>FactCheck - Doğrulama Raporu</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #333; }
          h1 { font-size: 24px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          .score { font-size: 48px; font-weight: bold; color: ${scoreColor}; text-align: center; margin: 20px 0; }
          .section { margin: 20px 0; padding: 15px; border-radius: 8px; background: #f9f9f9; }
          .section h3 { margin-top: 0; font-size: 14px; color: #666; text-transform: uppercase; }
          ul { padding-left: 20px; }
          li { margin: 5px 0; }
          a { color: #2563eb; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 15px; }
        </style>
      </head>
      <body>
        <h1>🛡️ FactCheck - Haber Doğrulama Raporu</h1>
        <div class="score">%${result.score}</div>
        
        <div class="section">
          <h3>📝 Genel Değerlendirme</h3>
          <p>${result.summary}</p>
        </div>

        ${result.sources.length > 0 ? `
        <div class="section">
          <h3>🔗 Kaynaklar</h3>
          <ul>${result.sources.map(s => `<li><a href="${s.url}">${s.title || s.url}</a></li>`).join("")}</ul>
        </div>` : ""}

        ${result.verified.length > 0 ? `
        <div class="section">
          <h3>✅ Doğrulanan Bilgiler</h3>
          <ul>${result.verified.map(v => `<li>${v}</li>`).join("")}</ul>
        </div>` : ""}

        ${result.warnings.length > 0 ? `
        <div class="section">
          <h3>⚠️ Dikkat Edilmesi Gerekenler</h3>
          <ul>${result.warnings.map(w => `<li>${w}</li>`).join("")}</ul>
        </div>` : ""}

        ${result.debunked.length > 0 ? `
        <div class="section">
          <h3>❌ Yanlış Bulunan Bilgiler</h3>
          <ul>${result.debunked.map(d => `<li>${d}</li>`).join("")}</ul>
        </div>` : ""}

        <div class="footer">
          FactCheck - Haber Doğrula | Postal Dijital | ${new Date().toLocaleDateString("tr-TR")}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 gap-1.5 text-xs">
      <Printer className="h-3.5 w-3.5" /> Yazdır
    </Button>
  );
}
