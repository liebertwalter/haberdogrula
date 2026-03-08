import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { StatsSection } from "@/components/StatsSection";
import { Achievements } from "@/components/Achievements";
import { ScoreTrend } from "@/components/ScoreTrend";
import { CredibilityHistory } from "@/components/CredibilityHistory";
import { CategoryDistribution } from "@/components/CategoryDistribution";
import { ProgressTracker } from "@/components/ProgressTracker";
import { UserTrustScore } from "@/components/UserTrustScore";
import { FactCheckLeaderboard } from "@/components/FactCheckLeaderboard";
import { FactCheckStats } from "@/components/FactCheckStats";
import { CommunityStats } from "@/components/CommunityStats";
import { supabase } from "@/integrations/supabase/client";

export default function Statistics() {
  const [totalChecks, setTotalChecks] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { count } = await supabase.from("search_history").select("*", { count: "exact", head: true });
      if (count) setTotalChecks(count);
    };
    fetch();
  }, []);

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2 pt-4">
          <BarChart3 className="h-12 w-12 text-danger mx-auto" />
          <h1 className="text-3xl font-bold tracking-tight">İstatistikler</h1>
          <p className="text-muted-foreground">Başarılarınız, trendler ve platform istatistikleri</p>
        </div>

        <StatsSection />
        <FactCheckStats />
        <CommunityStats />
        <Achievements totalChecks={totalChecks} />
        <ProgressTracker />
        <UserTrustScore />
        <ScoreTrend />
        <CredibilityHistory />
        <CategoryDistribution />
        <FactCheckLeaderboard />
      </motion.div>
    </Layout>
  );
}
