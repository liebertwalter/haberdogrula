import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { HistoryFilter } from "@/components/HistoryFilter";
import { HistorySearch } from "@/components/HistorySearch";
import { HistoryManager } from "@/components/HistoryManager";
import { ScoreGauge } from "@/components/ScoreGauge";
import { ScoreInterpretation } from "@/components/ScoreInterpretation";
import { supabase } from "@/integrations/supabase/client";

interface SearchHistoryItem {
  id: string;
  query_text: string | null;
  query_url: string | null;
  score: number | null;
  summary: string | null;
  created_at: string;
}

export default function History() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [historySearch, setHistorySearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<SearchHistoryItem | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("search_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setHistory(data as SearchHistoryItem[]);
  };

  const filteredHistory = history.filter((item) => {
    const matchesFilter =
      historyFilter === "all" ||
      (historyFilter === "high" && item.score !== null && item.score >= 70) ||
      (historyFilter === "mid" && item.score !== null && item.score >= 40 && item.score < 70) ||
      (historyFilter === "low" && item.score !== null && item.score < 40);
    const matchesSearch =
      !historySearch ||
      (item.query_text && item.query_text.toLowerCase().includes(historySearch.toLowerCase())) ||
      (item.query_url && item.query_url.toLowerCase().includes(historySearch.toLowerCase())) ||
      (item.summary && item.summary.toLowerCase().includes(historySearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-danger";
  };

  if (selectedItem) {
    return (
      <Layout>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold">Geçmiş Arama Detayı</h2>
            <p className="text-xs text-muted-foreground">
              {new Date(selectedItem.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          {selectedItem.score !== null && (
            <>
              <div className="flex justify-center"><ScoreGauge score={selectedItem.score} /></div>
              <ScoreInterpretation score={selectedItem.score} />
            </>
          )}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">Sorgulanan İçerik</h3>
              <p className="text-sm text-muted-foreground">{selectedItem.query_text || selectedItem.query_url || "İçerik mevcut değil"}</p>
            </CardContent>
          </Card>
          {selectedItem.summary && (
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Değerlendirme</h3>
                <p className="text-sm text-muted-foreground">{selectedItem.summary}</p>
              </CardContent>
            </Card>
          )}
          <Button onClick={() => setSelectedItem(null)} variant="outline" className="w-full h-12 text-base">← Geri Dön</Button>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2 pt-4">
          <Clock className="h-12 w-12 text-success mx-auto" />
          <h1 className="text-3xl font-bold tracking-tight">Doğrulama Geçmişi</h1>
          <p className="text-muted-foreground">Önceki doğrulamalarınızı görüntüleyin ({history.length} kayıt)</p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <HistoryManager />
          <HistoryFilter activeFilter={historyFilter} onFilterChange={setHistoryFilter} />
        </div>
        <HistorySearch value={historySearch} onChange={setHistorySearch} />

        <div className="space-y-2">
          {filteredHistory.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">Bu filtreye uygun sonuç yok</p>
          )}
          {filteredHistory.map((item) => (
            <Card key={item.id} className="bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all cursor-pointer hover:scale-[1.01]" onClick={() => setSelectedItem(item)}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.query_text ? item.query_text.substring(0, 80) + (item.query_text.length > 80 ? "..." : "") : item.query_url}</p>
                  <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                {item.score !== null && (
                  <span className={`text-sm font-bold ml-3 ${getScoreColor(item.score)}`}>%{item.score}</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
}
