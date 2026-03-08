import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Layout } from "@/components/Layout";
import { TrendingTopics } from "@/components/TrendingTopics";
import { PopularSearches } from "@/components/PopularSearches";
import { RecentHighlights } from "@/components/RecentHighlights";
import { MediaLiteracyTips } from "@/components/MediaLiteracyTips";
import { FactCheckResources } from "@/components/FactCheckResources";
import { SeasonalTrends } from "@/components/SeasonalTrends";
import { AlternativeSources } from "@/components/AlternativeSources";
import { DataPrivacy } from "@/components/DataPrivacy";
import { FeedbackForm } from "@/components/FeedbackForm";

export default function Explore() {
  // AlternativeSources requires a result prop, let's create a dummy for standalone display
  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2 pt-4">
          <Compass className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold tracking-tight">Keşfet</h1>
          <p className="text-muted-foreground">Gündem, kaynaklar, ipuçları ve medya okuryazarlığı</p>
        </div>

        <TrendingTopics />
        <PopularSearches />
        <RecentHighlights />
        <SeasonalTrends />
        <MediaLiteracyTips />
        <FactCheckResources />
        <DataPrivacy />

        <div className="flex justify-center">
          <FeedbackForm />
        </div>
      </motion.div>
    </Layout>
  );
}
