import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Scale, Clock, BarChart3, Compass, Heart, Shield, ArrowRight, Zap, Globe, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { StatsSection } from "@/components/StatsSection";
import { CommunityStats } from "@/components/CommunityStats";
import { SeasonalTrends } from "@/components/SeasonalTrends";
import { DataPrivacy } from "@/components/DataPrivacy";
import { OnboardingGuide } from "@/components/OnboardingGuide";
import { InstagramPrompt } from "@/components/InstagramPrompt";
import { WelcomeGreeting } from "@/components/WelcomeGreeting";
import { DidYouKnow } from "@/components/DidYouKnow";
import { LiveUserCounter } from "@/components/LiveUserCounter";

const quickLinks = [
  { path: "/dogrula", label: "Haber Doğrula", desc: "Metin veya URL ile haber doğrulama", icon: Search, color: "bg-primary/10 text-primary border-primary/20" },
  { path: "/karsilastir", label: "Karşılaştır", desc: "İki haberi karşılaştırarak doğrula", icon: Scale, color: "bg-warning/10 text-warning border-warning/20" },
  { path: "/gecmis", label: "Geçmiş", desc: "Önceki doğrulamalarını görüntüle", icon: Clock, color: "bg-success/10 text-success border-success/20" },
  { path: "/istatistikler", label: "İstatistikler", desc: "Başarılar, trendler ve puanlar", icon: BarChart3, color: "bg-danger/10 text-danger border-danger/20" },
  { path: "/kesfet", label: "Keşfet", desc: "Gündem, kaynaklar ve ipuçları", icon: Compass, color: "bg-accent text-accent-foreground border-border" },
  { path: "/favoriler", label: "Favoriler", desc: "Kaydettiğin doğrulamalar", icon: Heart, color: "bg-danger/10 text-danger border-danger/20" },
];

const features = [
  { icon: Brain, title: "Yapay Zeka Analizi", desc: "Gelişmiş AI ile haber doğrulama" },
  { icon: Globe, title: "Web Doğrulaması", desc: "İnternet üzerinden gerçek zamanlı kontrol" },
  { icon: Zap, title: "Anlık Sonuç", desc: "Saniyeler içinde detaylı rapor" },
  { icon: Shield, title: "50+ Analiz Aracı", desc: "Kapsamlı doğrulama metrikleri" },
];

const Index = () => {
  return (
    <Layout>
      <InstagramPrompt />
      <OnboardingGuide />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Hero */}
        <div className="text-center space-y-3 pt-6">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight">Haber Doğrula</h1>
          <p className="text-sm text-muted-foreground">Postal Dijital tarafından oluşturuldu</p>
          <p className="text-muted-foreground text-lg pt-2">
            İnternette gördüğünüz haberleri yapay zeka ile doğrulayın
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link to="/dogrula">
            <Button size="lg" className="h-14 px-8 text-lg gap-2 shadow-lg shadow-primary/20">
              <Search className="h-5 w-5" /> Hemen Doğrula
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-card/60 backdrop-blur-sm border-border/50 h-full">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <f.icon className="h-8 w-8 text-primary" />
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="text-[11px] text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-center">Sayfalar</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.path} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                  <Link to={link.path}>
                    <Card className={`bg-card/60 backdrop-blur-sm border hover:scale-[1.02] transition-transform cursor-pointer h-full ${link.color}`}>
                      <CardContent className="p-4 space-y-1">
                        <Icon className="h-6 w-6" />
                        <h3 className="text-sm font-semibold">{link.label}</h3>
                        <p className="text-[10px] opacity-70">{link.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <StatsSection />
        <CommunityStats />
        <SeasonalTrends />
        <DataPrivacy />
      </motion.div>
    </Layout>
  );
};

export default Index;
