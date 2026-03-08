import { useState, useEffect, useCallback } from "react";
import { Shield, Send, Link2, FileText, BarChart3, Search, AlertTriangle, CheckCircle2, XCircle, Clock, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScoreGauge } from "@/components/ScoreGauge";
import { LoadingSteps } from "@/components/LoadingSteps";
import { ResultCard } from "@/components/ResultCard";
import { ShareButtons } from "@/components/ShareButtons";
import { StatsSection } from "@/components/StatsSection";
import { Footer } from "@/components/Footer";
import { ScoreCelebration } from "@/components/ScoreCelebration";
import { HistoryFilter } from "@/components/HistoryFilter";
import { factCheckNews, type FactCheckResult } from "@/lib/api/factcheck";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SearchHistoryItem {
  id: string;
  query_text: string | null;
  query_url: string | null;
  score: number | null;
  summary: string | null;
  created_at: string;
}

const MAX_CHARS = 5000;

const Index = () => {
  const [tab, setTab] = useState("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<SearchHistoryItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Ctrl+Enter keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !isLoading && !result) {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tab, text, url, isLoading, result]);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("search_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setHistory(data as SearchHistoryItem[]);
  };

  const filteredHistory = history.filter((item) => {
    if (historyFilter === "all") return true;
    if (historyFilter === "high") return item.score !== null && item.score >= 70;
    if (historyFilter === "mid") return item.score !== null && item.score >= 40 && item.score < 70;
    if (historyFilter === "low") return item.score !== null && item.score < 40;
    return true;
  });

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-danger";
  };

  const handleSubmit = async () => {
    const input = tab === "text" ? { text } : { url };
    if (!input.text && !input.url) {
      toast({ title: "Hata", description: "Lütfen bir haber metni veya URL girin.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setLoadingStep(0);
    setResult(null);
    setSelectedHistoryItem(null);

    try {
      const data = await factCheckNews(input);
      setResult(data);
      fetchHistory();
    } catch (e: any) {
      toast({ title: "Hata", description: e.message || "Bir hata oluştu.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setText("");
    setUrl("");
    setSelectedHistoryItem(null);
  };

  const handleHistoryClick = (item: SearchHistoryItem) => {
    setSelectedHistoryItem(item);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-warning/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/70">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">FactCheck</span>
          </div>
          <div className="flex items-center gap-1">
            <Link to="/hakkinda">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Info className="h-5 w-5" />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {!result && !isLoading && !selectedHistoryItem && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero */}
              <div className="text-center space-y-2 pt-8">
                <h1 className="text-4xl font-bold tracking-tight">Haber Doğrula</h1>
                <p className="text-sm text-muted-foreground">Postal Dijital tarafından oluşturuldu</p>
                <p className="text-muted-foreground text-lg pt-2">
                  İnternette gördüğünüz haberleri yapay zeka ile doğrulayın
                </p>
              </div>

              {/* Stats */}
              <StatsSection />

              {/* Input */}
              <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="gap-2">
                    <FileText className="h-4 w-4" /> Metin
                  </TabsTrigger>
                  <TabsTrigger value="url" className="gap-2">
                    <Link2 className="h-4 w-4" /> URL
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4 space-y-1">
                  <Textarea
                    placeholder="Doğrulamak istediğiniz haber metnini buraya yapıştırın..."
                    className="min-h-[180px] resize-none text-base bg-card/80 backdrop-blur-sm"
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>Ctrl+Enter ile gönder</span>
                    <span className={text.length > MAX_CHARS * 0.9 ? "text-warning" : ""}>
                      {text.length}/{MAX_CHARS}
                    </span>
                  </div>
                </TabsContent>
                <TabsContent value="url" className="mt-4">
                  <Input
                    type="url"
                    placeholder="https://example.com/haber-basligi"
                    className="text-base h-12 bg-card/80 backdrop-blur-sm"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                    <span>Haber sayfasının URL'sini yapıştırın</span>
                    <span>Ctrl+Enter ile gönder</span>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleSubmit}
                className="w-full h-12 text-base gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                size="lg"
              >
                <Send className="h-5 w-5" /> Doğrula
              </Button>

              {/* Recent searches */}
              {history.length > 0 && (
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Son Aramalar
                    </h2>
                    <HistoryFilter activeFilter={historyFilter} onFilterChange={setHistoryFilter} />
                  </div>
                  <div className="space-y-2">
                    {filteredHistory.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">Bu filtreye uygun sonuç yok</p>
                    )}
                    {filteredHistory.map((item) => (
                      <Card
                        key={item.id}
                        className="bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-colors cursor-pointer"
                        onClick={() => handleHistoryClick(item)}
                      >
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">
                              {item.query_text
                                ? item.query_text.substring(0, 80) + (item.query_text.length > 80 ? "..." : "")
                                : item.query_url}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString("tr-TR", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {item.score !== null && (
                            <span className={`text-sm font-bold ml-3 ${getScoreColor(item.score)}`}>
                              %{item.score}
                            </span>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center pt-12"
            >
              <h2 className="text-2xl font-bold mb-2">Araştırılıyor...</h2>
              <p className="text-muted-foreground mb-4">Haber internette araştırılıyor ve doğrulanıyor</p>
              <LoadingSteps currentStep={loadingStep} />
            </motion.div>
          )}

          {/* History detail view */}
          {selectedHistoryItem && !isLoading && !result && (
            <motion.div
              key="history-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 pt-4"
            >
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold">Geçmiş Arama Detayı</h2>
                <p className="text-xs text-muted-foreground">
                  {new Date(selectedHistoryItem.created_at).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {selectedHistoryItem.score !== null && (
                <div className="flex justify-center">
                  <ScoreGauge score={selectedHistoryItem.score} />
                </div>
              )}

              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 space-y-3">
                  <h3 className="text-sm font-semibold">Sorgulanan İçerik</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedHistoryItem.query_text || selectedHistoryItem.query_url || "İçerik mevcut değil"}
                  </p>
                </CardContent>
              </Card>

              {selectedHistoryItem.summary && (
                <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" /> Değerlendirme
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedHistoryItem.summary}</p>
                  </CardContent>
                </Card>
              )}

              <Button onClick={handleReset} variant="outline" className="w-full h-12 text-base">
                ← Geri Dön
              </Button>
            </motion.div>
          )}

          {result && !isLoading && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 pt-4"
            >
              <div className="flex justify-center">
                <ScoreGauge score={result.score} />
              </div>

              <div className="flex justify-center">
                <ScoreCelebration score={result.score} />
              </div>

              <div className="flex justify-center">
                <ShareButtons result={result} />
              </div>

              <div className="space-y-4">
                <ResultCard icon={BarChart3} title="Genel Değerlendirme" delay={0.2}>
                  {result.summary}
                </ResultCard>

                {result.sources.length > 0 && (
                  <ResultCard icon={Search} title="Bulunan Kaynaklar" delay={0.4}>
                    <ul className="space-y-2">
                      {result.sources.map((s, i) => (
                        <li key={i}>
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {s.title || s.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </ResultCard>
                )}

                {result.warnings.length > 0 && (
                  <ResultCard icon={AlertTriangle} title="Dikkat Edilmesi Gerekenler" delay={0.6} variant="warning">
                    <ul className="list-disc list-inside space-y-1">
                      {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </ResultCard>
                )}

                {result.verified.length > 0 && (
                  <ResultCard icon={CheckCircle2} title="Doğrulanan Bilgiler" delay={0.8} variant="success">
                    <ul className="list-disc list-inside space-y-1">
                      {result.verified.map((v, i) => <li key={i}>{v}</li>)}
                    </ul>
                  </ResultCard>
                )}

                {result.debunked.length > 0 && (
                  <ResultCard icon={XCircle} title="Yanlış Bulunan Bilgiler" delay={1} variant="danger">
                    <ul className="list-disc list-inside space-y-1">
                      {result.debunked.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </ResultCard>
                )}
              </div>

              <Button onClick={handleReset} variant="outline" className="w-full h-12 text-base">
                Yeni Doğrulama Yap
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
