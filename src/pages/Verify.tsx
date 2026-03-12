import { useState, useEffect } from "react";
import { Send, Link2, FileText, BarChart3, Search, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/Layout";
import { ScoreGauge } from "@/components/ScoreGauge";
import { LoadingSteps } from "@/components/LoadingSteps";
import { ResultCard } from "@/components/ResultCard";
import { ShareButtons } from "@/components/ShareButtons";
import { ScoreCelebration } from "@/components/ScoreCelebration";
import { ExamplePrompts } from "@/components/ExamplePrompts";
import { TopProgressBar } from "@/components/TopProgressBar";
import { FavoriteButton } from "@/components/FavoriteButton";
import { PrintResult } from "@/components/PrintResult";
import { TextStats } from "@/components/TextStats";
import { ConfettiEffect } from "@/components/ConfettiEffect";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ResultFeedback } from "@/components/ResultFeedback";
import { ScoreInterpretation } from "@/components/ScoreInterpretation";
import { ReadingTime } from "@/components/ReadingTime";
import { VoiceInput } from "@/components/VoiceInput";
import { QuickSummary } from "@/components/QuickSummary";
import { VerificationBadges } from "@/components/VerificationBadges";
import { ReliabilityMeter } from "@/components/ReliabilityMeter";
import { SourceCredibility } from "@/components/SourceCredibility";
import { FactCheckTips } from "@/components/FactCheckTips";
import { ClickbaitDetector } from "@/components/ClickbaitDetector";
import { ExportOptions } from "@/components/ExportOptions";
import { QRShare } from "@/components/QRShare";
import { DragDropInput } from "@/components/DragDropInput";
import { AutoSaveDraft, loadDraft, clearDraft } from "@/components/AutoSaveDraft";
import { PropagandaDetector } from "@/components/PropagandaDetector";
import { ScoreComparison } from "@/components/ScoreComparison";
import { DateValidator } from "@/components/DateValidator";
import { EmbedWidget } from "@/components/EmbedWidget";
import { DetailedAnalysis } from "@/components/DetailedAnalysis";
import { SummaryCard } from "@/components/SummaryCard";
import { BookmarkCategories } from "@/components/BookmarkCategories";
import { BiasIndicator } from "@/components/BiasIndicator";
import { ReadabilityScore } from "@/components/ReadabilityScore";
import { TrustSignal } from "@/components/TrustSignal";
import { CharacterProgress } from "@/components/CharacterProgress";
import { URLPreview } from "@/components/URLPreview";
import { LanguageDetector } from "@/components/LanguageDetector";
import { FactDensity } from "@/components/FactDensity";
import { AnalysisMetadata } from "@/components/AnalysisMetadata";
import { NewsCardPreview } from "@/components/NewsCardPreview";
import { SpoilerWarning } from "@/components/SpoilerWarning";
import { QuickFacts } from "@/components/QuickFacts";
import { SearchSuggestions } from "@/components/SearchSuggestions";
import { FactTimeline } from "@/components/FactTimeline";
import { SentimentChart } from "@/components/SentimentChart";
import { ViralityIndex } from "@/components/ViralityIndex";
import { ManipulationScore } from "@/components/ManipulationScore";
import { ClaimExtractor } from "@/components/ClaimExtractor";
import { SourceDiversity } from "@/components/SourceDiversity";
import { RiskLevel } from "@/components/RiskLevel";
import { ContextAnalysis } from "@/components/ContextAnalysis";
import { VerificationSteps } from "@/components/VerificationSteps";
import { ContentAge } from "@/components/ContentAge";
import { FactCheckCertificate } from "@/components/FactCheckCertificate";
import { AIConfidence } from "@/components/AIConfidence";
import { HistoricalContext } from "@/components/HistoricalContext";
import { ContentWarning } from "@/components/ContentWarning";
import { CitationGenerator } from "@/components/CitationGenerator";
import { SmartSummary } from "@/components/SmartSummary";
import { ContentClassifier } from "@/components/ContentClassifier";
import { FactCheckBadge } from "@/components/FactCheckBadge";
import { AnalysisDepth } from "@/components/AnalysisDepth";
import { NewsFreshness } from "@/components/NewsFreshness";
import { ComparisonTable } from "@/components/ComparisonTable";
import { UserNotes } from "@/components/UserNotes";
import { QuickActions } from "@/components/QuickActions";
import { GeographicRelevance } from "@/components/GeographicRelevance";
import { AudienceImpact } from "@/components/AudienceImpact";
import { AlternativeSources } from "@/components/AlternativeSources";
import { EmotionalTone } from "@/components/EmotionalTone";
import { NewsTimestamp } from "@/components/NewsTimestamp";
import { SourceAge } from "@/components/SourceAge";
import { NarrativeTracker } from "@/components/NarrativeTracker";
import { MediaBiasChart } from "@/components/MediaBiasChart";
import { SocialMediaTracker } from "@/components/SocialMediaTracker";
import { ExpertOpinion } from "@/components/ExpertOpinion";
import { RelatedNews } from "@/components/RelatedNews";
import { InfoGraphic } from "@/components/InfoGraphic";
import { CrossReference } from "@/components/CrossReference";
import { MultiSourceView } from "@/components/MultiSourceView";
import { factCheckNews, type FactCheckResult } from "@/lib/api/factcheck";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MAX_CHARS = 5000;

export default function Verify() {
  const [tab, setTab] = useState("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [averageScore, setAverageScore] = useState(0);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const draft = loadDraft();
    if (draft.text) setText(draft.text);
    if (draft.url) setUrl(draft.url);

    const fetchAvg = async () => {
      const { data } = await supabase.from("search_history").select("score").not("score", "is", null).limit(100);
      if (data && data.length > 0) setAverageScore(Math.round(data.reduce((s, r) => s + (r.score || 0), 0) / data.length));
    };
    fetchAvg();
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => setLoadingStep((p) => (p < 4 ? p + 1 : p)), 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) return;
    setLoadingStartTime(Date.now());
    const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - (loadingStartTime || Date.now())) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !isLoading && !result) handleSubmit();
      if ((e.ctrlKey || e.metaKey) && e.key === "n") { e.preventDefault(); handleReset(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tab, text, url, isLoading, result]);

  const handleSubmit = async () => {
    const input = tab === "text" ? { text } : { url };
    if (!input.text && !input.url) {
      toast({ title: "Hata", description: "Lütfen bir haber metni veya URL girin.", variant: "destructive" });
      return;
    }
    setIsLoading(true); setLoadingStep(0); setResult(null); setShowConfetti(false); setElapsedTime(0);
    const prev = parseInt(localStorage.getItem("fc_total_checks") || "0");
    localStorage.setItem("fc_total_checks", String(prev + 1));
    try {
      const data = await factCheckNews(input);
      setResult(data);
      clearDraft();
      if (data.score >= 80) setShowConfetti(true);
      if (data.score >= 70) localStorage.setItem("fc_high_scores", String(parseInt(localStorage.getItem("fc_high_scores") || "0") + 1));
      if (data.score < 40) localStorage.setItem("fc_low_scores", String(parseInt(localStorage.getItem("fc_low_scores") || "0") + 1));
    } catch (e: any) {
      toast({ title: "Hata", description: e.message || "Bir hata oluştu.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setText(""); setUrl(""); setShowConfetti(false); };

  const handleExampleSelect = (exampleText: string) => {
    setTab("text"); setText(exampleText);
    toast({ title: "Örnek yüklendi", description: "Doğrula butonuna basarak test edin." });
  };

  const handleVoiceResult = (transcript: string) => {
    setText((prev) => (prev + " " + transcript).trim().slice(0, MAX_CHARS));
    toast({ title: "Ses algılandı 🎤", description: "Metin eklendi." });
  };

  const handleDragDrop = (droppedText: string) => { setText(droppedText); setTab("text"); };

  return (
    <Layout>
      <TopProgressBar isLoading={isLoading} step={loadingStep} totalSteps={5} />
      <ConfettiEffect score={result?.score ?? 0} summary={result?.summary ?? ""} trigger={showConfetti} />

      <AnimatePresence mode="wait">
        {!result && !isLoading && (
          <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="text-center space-y-2 pt-4">
              <h1 className="text-3xl font-bold tracking-tight">Haber Doğrula</h1>
              <p className="text-muted-foreground">Metin veya URL yapıştırarak haberin güvenilirliğini kontrol edin</p>
            </div>

            <DragDropInput onTextLoad={handleDragDrop} />

            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" className="gap-2"><FileText className="h-4 w-4" /> Metin</TabsTrigger>
                <TabsTrigger value="url" className="gap-2"><Link2 className="h-4 w-4" /> URL</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-4 space-y-2">
                <div className="flex gap-2">
                  <Textarea placeholder="Doğrulamak istediğiniz haber metnini buraya yapıştırın..." className="min-h-[160px] resize-none text-base bg-card/80 backdrop-blur-sm flex-1" value={text} onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))} />
                  <div className="flex flex-col gap-2">
                    <VoiceInput onResult={handleVoiceResult} />
                    <CharacterProgress current={text.length} max={MAX_CHARS} />
                  </div>
                </div>
                {text && (
                  <div className="space-y-2">
                    <CategoryBadge text={text} />
                    <QuickFacts text={text} />
                    <ReadabilityScore text={text} />
                    <LanguageDetector text={text} />
                  </div>
                )}
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <TextStats text={text} />
                    <AutoSaveDraft text={text} url={url} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">Ctrl+Enter</span>
                    <span className={text.length > MAX_CHARS * 0.9 ? "text-warning" : ""}>{text.length}/{MAX_CHARS}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="url" className="mt-4 space-y-2">
                <Input type="url" placeholder="https://example.com/haber-basligi" className="text-base h-12 bg-card/80 backdrop-blur-sm" value={url} onChange={(e) => setUrl(e.target.value)} />
                {url && <URLPreview url={url} />}
                <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                  <span>Haber, X, TikTok, Telegram URL'si yapıştırın</span>
                  <div className="flex items-center gap-2">
                    <AutoSaveDraft text={text} url={url} />
                    <span>Ctrl+Enter</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <SearchSuggestions onSelect={handleExampleSelect} />
            <ExamplePrompts onSelect={handleExampleSelect} />

            <Button onClick={handleSubmit} className="w-full h-12 text-base gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" size="lg">
              <Send className="h-5 w-5" /> Doğrula
            </Button>
          </motion.div>
        )}

        {isLoading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center pt-12">
            <h2 className="text-2xl font-bold mb-2">Araştırılıyor...</h2>
            <p className="text-muted-foreground mb-1">Haber internette araştırılıyor ve doğrulanıyor</p>
            <p className="text-xs text-muted-foreground mb-4">{elapsedTime > 0 && `${elapsedTime} saniye geçti...`}</p>
            <LoadingSteps currentStep={loadingStep} />
          </motion.div>
        )}

        {result && !isLoading && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5 pt-4">
            <div className="flex justify-center"><ScoreGauge score={result.score} /></div>
            <div className="flex justify-center"><ScoreCelebration score={result.score} summary={result.summary} /></div>

            <ContentWarning result={result} />
            <VerificationBadges result={result} />
            <ContentClassifier result={result} />
            <AnalysisMetadata result={result} elapsedTime={elapsedTime} />
            <NewsTimestamp result={result} />

            <SmartSummary result={result} />
            <SummaryCard result={result} />
            <NewsCardPreview result={result} />
            <SpoilerWarning result={result} />

            <DateValidator result={result} />
            <ScoreComparison result={result} averageScore={averageScore} />
            <ScoreInterpretation score={result.score} />
            <RiskLevel result={result} />
            <ReliabilityMeter result={result} />

            <FactTimeline result={result} />
            <VerificationSteps result={result} />
            <AnalysisDepth result={result} />
            <AIConfidence result={result} />

            <SentimentChart result={result} />
            <EmotionalTone result={result} />
            <FactDensity result={result} />
            <BiasIndicator result={result} />
            <MediaBiasChart result={result} />
            <ViralityIndex result={result} />
            <ManipulationScore result={result} />
            <NarrativeTracker result={result} />

            <ClaimExtractor result={result} />
            <InfoGraphic result={result} />
            <ComparisonTable result={result} />
            <QuickSummary result={result} />
            <ReadingTime result={result} />

            <ContextAnalysis result={result} />
            <GeographicRelevance result={result} />
            <ContentAge result={result} />
            <NewsFreshness result={result} />
            <HistoricalContext result={result} />
            <AudienceImpact result={result} />

            {result.resultId && (
              <motion.div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-xs text-primary font-medium">🔗 Paylaşım linki:</span>
                <code className="text-[10px] bg-muted px-2 py-1 rounded text-muted-foreground max-w-[200px] truncate">
                  haberdogrula.lovable.app/sonuc/{result.resultId.substring(0, 8)}...
                </code>
                <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={() => {
                  navigator.clipboard.writeText(`https://haberdogrula.lovable.app/sonuc/${result.resultId}`);
                  toast({ title: "Kopyalandı! 🔗", description: "Paylaşım linki panoya kopyalandı." });
                }}>
                  Kopyala
                </Button>
              </motion.div>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              <ShareButtons result={result} shareUrl={result.resultId ? `https://haberdogrula.lovable.app/sonuc/${result.resultId}` : undefined} />
            </div>
            <QuickActions result={result} />
            <div className="flex flex-wrap justify-center gap-2">
              <FavoriteButton result={result} />
              <PrintResult result={result} />
              <BookmarkCategories result={result} />
              <QRShare score={result.score} />
              <FactCheckCertificate result={result} />
              <CitationGenerator result={result} />
              <FactCheckBadge result={result} />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <ExportOptions result={result} />
              <EmbedWidget score={result.score} />
            </div>
            <UserNotes />

            <ScoreBreakdown result={result} />
            <DetailedAnalysis result={result} />

            <SourceCredibility result={result} />
            <SourceDiversity result={result} />
            <SourceAge result={result} />
            <CrossReference result={result} />
            <SocialMediaTracker result={result} />
            <MultiSourceView result={result} />
            <TrustSignal result={result} />

            <ExpertOpinion result={result} />
            <RelatedNews result={result} />
            <AlternativeSources result={result} />

            <div className="space-y-4">
              <ResultCard icon={BarChart3} title="Genel Değerlendirme" delay={0.2}>{result.summary}</ResultCard>
              {result.sources.length > 0 && (
                <ResultCard icon={Search} title="Bulunan Kaynaklar" delay={0.4}>
                  <ul className="space-y-2">{result.sources.map((s, i) => (<li key={i}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">{s.title || s.url}</a></li>))}</ul>
                </ResultCard>
              )}
              {result.warnings.length > 0 && (
                <ResultCard icon={AlertTriangle} title="Dikkat Edilmesi Gerekenler" delay={0.6} variant="warning">
                  <ul className="list-disc list-inside space-y-1">{result.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
                </ResultCard>
              )}
              {result.verified.length > 0 && (
                <ResultCard icon={CheckCircle2} title="Doğrulanan Bilgiler" delay={0.8} variant="success">
                  <ul className="list-disc list-inside space-y-1">{result.verified.map((v, i) => <li key={i}>{v}</li>)}</ul>
                </ResultCard>
              )}
              {result.debunked.length > 0 && (
                <ResultCard icon={XCircle} title="Yanlış Bulunan Bilgiler" delay={1} variant="danger">
                  <ul className="list-disc list-inside space-y-1">{result.debunked.map((d, i) => <li key={i}>{d}</li>)}</ul>
                </ResultCard>
              )}
            </div>

            <ClickbaitDetector result={result} />
            <PropagandaDetector result={result} />
            <FactCheckTips result={result} />
            <ResultFeedback />

            <Button onClick={handleReset} variant="outline" className="w-full h-12 text-base">Yeni Doğrulama Yap</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
