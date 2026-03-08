import { useState } from "react";
import { motion } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { result: FactCheckResult; }

export function FactCheckCertificate({ result }: Props) {
  const handleDownload = () => {
    const certId = `FC-${Date.now().toString(36).toUpperCase()}`;
    const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>FactCheck Sertifikası</title>
<style>body{font-family:system-ui;max-width:500px;margin:40px auto;padding:40px;border:3px double ${result.score >= 70 ? "#22c55e" : result.score >= 40 ? "#f59e0b" : "#ef4444"};text-align:center}
h1{font-size:24px;margin-bottom:5px}h2{color:#666;font-weight:normal;font-size:14px}.score{font-size:48px;font-weight:bold;color:${result.score >= 70 ? "#22c55e" : result.score >= 40 ? "#f59e0b" : "#ef4444"}}.id{color:#999;font-size:11px}</style></head>
<body><h1>🛡️ FactCheck Sertifikası</h1><h2>Haber Doğrulama Raporu</h2><hr>
<p class="score">%${result.score}</p><p>${result.score >= 70 ? "✅ Güvenilir" : result.score >= 40 ? "⚠️ Dikkatli Ol" : "❌ Güvenilir Değil"}</p>
<p style="font-size:12px;color:#666">${result.summary.substring(0, 150)}...</p>
<p>📚 ${result.sources.length} kaynak kontrol edildi</p>
<p>✅ ${result.verified.length} doğru | ❌ ${result.debunked.length} yanlış | ⚠️ ${result.warnings.length} uyarı</p>
<hr><p class="id">Sertifika No: ${certId}<br>Tarih: ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}<br>haberdogrula.lovable.app</p></body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u; a.download = `factcheck-sertifika-${certId}.html`; a.click();
    URL.revokeObjectURL(u);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} className="h-7 gap-1 text-[11px]">
      <Award className="h-3 w-3" /> Sertifika
    </Button>
  );
}
