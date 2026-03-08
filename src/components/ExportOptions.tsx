import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type FactCheckResult } from "@/lib/api/factcheck";
import { FileJson, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportOptionsProps {
  result: FactCheckResult;
}

export function ExportOptions({ result }: ExportOptionsProps) {
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factcheck-${result.score}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const rows = [
      ["Alan", "Değer"],
      ["Puan", String(result.score)],
      ["Özet", result.summary],
      ["Kategori", result.category || ""],
      ["Duygu", result.sentiment || ""],
      ["Güncellik", result.freshness || ""],
      ["AI Güven", result.confidence || ""],
      ["Kaynak Sayısı", String(result.sources.length)],
      ["Doğrulanan Bilgi Sayısı", String(result.verified.length)],
      ["Yanlış Bilgi Sayısı", String(result.debunked.length)],
      ["Uyarı Sayısı", String(result.warnings.length)],
      ...result.verified.map((v, i) => [`Doğru ${i + 1}`, v]),
      ...result.debunked.map((d, i) => [`Yanlış ${i + 1}`, d]),
      ...result.warnings.map((w, i) => [`Uyarı ${i + 1}`, w]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factcheck-${result.score}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>FactCheck Raporu - %${result.score}</title>
<style>body{font-family:system-ui;max-width:600px;margin:40px auto;padding:20px;color:#333}h1{color:${result.score >= 70 ? "#22c55e" : result.score >= 40 ? "#f59e0b" : "#ef4444"}}
.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;margin:4px}.green{background:#dcfce7;color:#166534}.red{background:#fef2f2;color:#991b1b}.yellow{background:#fefce8;color:#854d0e}</style></head>
<body><h1>🎯 Güvenilirlik: %${result.score}</h1><p>${result.summary}</p>
${result.category ? `<p><strong>Kategori:</strong> ${result.category}</p>` : ""}
${result.verified.length > 0 ? `<h3>✅ Doğrulanan Bilgiler</h3><ul>${result.verified.map((v) => `<li>${v}</li>`).join("")}</ul>` : ""}
${result.debunked.length > 0 ? `<h3>❌ Yanlış Bilgiler</h3><ul>${result.debunked.map((d) => `<li>${d}</li>`).join("")}</ul>` : ""}
${result.warnings.length > 0 ? `<h3>⚠️ Uyarılar</h3><ul>${result.warnings.map((w) => `<li>${w}</li>`).join("")}</ul>` : ""}
<h3>📚 Kaynaklar</h3><ul>${result.sources.map((s) => `<li><a href="${s.url}">${s.title}</a></li>`).join("")}</ul>
<hr><p style="font-size:12px;color:#999">FactCheck - Haber Doğrula | haberdogrula.lovable.app</p></body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factcheck-raporu-${result.score}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      <Button variant="outline" size="sm" onClick={handleExportJSON} className="h-7 gap-1 text-[11px]">
        <FileJson className="h-3 w-3" /> JSON
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-7 gap-1 text-[11px]">
        <FileText className="h-3 w-3" /> CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportHTML} className="h-7 gap-1 text-[11px]">
        <Download className="h-3 w-3" /> HTML Rapor
      </Button>
    </div>
  );
}
