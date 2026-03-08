import { useState, useEffect } from "react";
import { Shield, Send, Link2, FileText, BarChart3, Search, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScoreGauge } from "@/components/ScoreGauge";
import { LoadingSteps } from "@/components/LoadingSteps";
import { ResultCard } from "@/components/ResultCard";
import { factCheckNews, type FactCheckResult } from "@/lib/api/factcheck";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [tab, setTab] = useState("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async () => {
    const input = tab === "text" ? { text } : { url };
    if (!input.text && !input.url) {
      toast({ title: "Hata", description: "Lütfen bir haber metni veya URL girin.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setLoadingStep(0);
    setResult(null);

    try {
      const data = await factCheckNews(input);
      setResult(data);
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
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">FactCheck</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {!result && !isLoading && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero */}
              <div className="text-center space-y-3 pt-8">
                <h1 className="text-4xl font-bold tracking-tight">
                  Haber Doğrulama
                </h1>
                <p className="text-muted-foreground text-lg">
                  İnternette gördüğünüz haberleri yapay zeka ile doğrulayın
                </p>
              </div>

              {/* Input */}
              <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Metin
                  </TabsTrigger>
                  <TabsTrigger value="url" className="gap-2">
                    <Link2 className="h-4 w-4" />
                    URL
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4">
                  <Textarea
                    placeholder="Doğrulamak istediğiniz haber metnini buraya yapıştırın..."
                    className="min-h-[180px] resize-none text-base"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="url" className="mt-4">
                  <Input
                    type="url"
                    placeholder="https://example.com/haber-basligi"
                    className="text-base h-12"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Haber sayfasının URL'sini yapıştırın. İçerik otomatik olarak çekilecektir.
                  </p>
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleSubmit}
                className="w-full h-12 text-base gap-2"
                size="lg"
              >
                <Send className="h-5 w-5" />
                Doğrula
              </Button>
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

          {result && !isLoading && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 pt-4"
            >
              {/* Score */}
              <div className="flex justify-center">
                <ScoreGauge score={result.score} />
              </div>

              {/* Cards */}
              <div className="space-y-4">
                <ResultCard icon={BarChart3} title="Genel Değerlendirme" delay={0.2}>
                  {result.summary}
                </ResultCard>

                {result.sources.length > 0 && (
                  <ResultCard icon={Search} title="Bulunan Kaynaklar" delay={0.4}>
                    <ul className="space-y-2">
                      {result.sources.map((s, i) => (
                        <li key={i}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
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
                      {result.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </ResultCard>
                )}

                {result.verified.length > 0 && (
                  <ResultCard icon={CheckCircle2} title="Doğrulanan Bilgiler" delay={0.8} variant="success">
                    <ul className="list-disc list-inside space-y-1">
                      {result.verified.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </ResultCard>
                )}

                {result.debunked.length > 0 && (
                  <ResultCard icon={XCircle} title="Yanlış Bulunan Bilgiler" delay={1} variant="danger">
                    <ul className="list-disc list-inside space-y-1">
                      {result.debunked.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
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
    </div>
  );
};

export default Index;
