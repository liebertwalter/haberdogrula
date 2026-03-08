import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { Layout } from "@/components/Layout";
import { CompareMode } from "@/components/CompareMode";

export default function Compare() {
  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2 pt-4">
          <Scale className="h-12 w-12 text-warning mx-auto" />
          <h1 className="text-3xl font-bold tracking-tight">Haber Karşılaştır</h1>
          <p className="text-muted-foreground">İki farklı haberi karşılaştırarak güvenilirliklerini analiz edin</p>
        </div>
        <CompareMode />
      </motion.div>
    </Layout>
  );
}
