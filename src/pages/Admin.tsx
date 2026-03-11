import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, LogOut, Search, BarChart3, Settings, Clock,
  TrendingUp, Users, CheckCircle, AlertTriangle, Loader2, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SearchRecord {
  id: string;
  query_text: string | null;
  query_url: string | null;
  score: number | null;
  summary: string | null;
  created_at: string;
}

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0, avgScore: 0, highRisk: 0 });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchRecords();
    // Realtime subscription
    const channel = supabase
      .channel("admin-search-history")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "search_history" }, (payload) => {
        const newRecord = payload.new as SearchRecord;
        setRecords((prev) => [newRecord, ...prev]);
        toast({
          title: "🔔 Yeni doğrulama!",
          description: `${newRecord.query_text?.slice(0, 50) || newRecord.query_url || "Yeni sorgu"} — Puan: ${newRecord.score ?? "?"}`,
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayCount = records.filter((r) => r.created_at.startsWith(today)).length;
    const scores = records.filter((r) => r.score !== null).map((r) => r.score!);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const highRisk = scores.filter((s) => s < 40).length;
    setStats({ total: records.length, today: todayCount, avgScore: avg, highRisk });
  }, [records]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/admin-login"); return; }
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!data) { await supabase.auth.signOut(); navigate("/admin-login"); }
  };

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("search_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (!error && data) setRecords(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) return <Badge variant="outline">?</Badge>;
    if (score >= 70) return <Badge className="bg-success text-success-foreground">{score}</Badge>;
    if (score >= 40) return <Badge className="bg-warning text-warning-foreground">{score}</Badge>;
    return <Badge className="bg-danger text-danger-foreground">{score}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  // Weekly chart data
  const getLast7Days = () => {
    const days: { label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("tr-TR", { weekday: "short" });
      const count = records.filter((r) => r.created_at.startsWith(key)).length;
      days.push({ label, count });
    }
    return days;
  };

  const weekData = getLast7Days();
  const maxCount = Math.max(...weekData.map((d) => d.count), 1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">Admin Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchRecords} className="gap-1">
              <RefreshCw className="h-4 w-4" /> Yenile
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1 text-danger">
              <LogOut className="h-4 w-4" /> Çıkış
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Toplam Doğrulama", value: stats.total, icon: Search, color: "text-primary" },
            { label: "Bugün", value: stats.today, icon: Clock, color: "text-success" },
            { label: "Ort. Puan", value: stats.avgScore, icon: TrendingUp, color: "text-warning" },
            { label: "Yüksek Risk", value: stats.highRisk, icon: AlertTriangle, color: "text-danger" },
          ].map((s) => (
            <Card key={s.label} className="bg-card/60">
              <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                <s.icon className={`h-6 w-6 ${s.color}`} />
                <span className="text-2xl font-bold">{s.value}</span>
                <span className="text-[11px] text-muted-foreground">{s.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="history" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="history" className="flex-1 gap-1">
              <Clock className="h-3.5 w-3.5" /> Geçmiş
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-1 gap-1">
              <BarChart3 className="h-3.5 w-3.5" /> İstatistik
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 gap-1">
              <Settings className="h-3.5 w-3.5" /> Ayarlar
            </TabsTrigger>
          </TabsList>

          {/* History tab */}
          <TabsContent value="history" className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : records.length === 0 ? (
              <Card className="bg-card/60">
                <CardContent className="p-8 text-center text-muted-foreground">
                  Henüz doğrulama yapılmamış.
                </CardContent>
              </Card>
            ) : (
              records.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <Card className="bg-card/60 border-border/50">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {r.query_text?.slice(0, 80) || r.query_url || "Boş sorgu"}
                          </p>
                          {r.query_url && (
                            <a
                              href={r.query_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline truncate block"
                            >
                              {r.query_url}
                            </a>
                          )}
                        </div>
                        {getScoreBadge(r.score)}
                      </div>
                      {r.summary && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{r.summary}</p>
                      )}
                      <span className="text-[10px] text-muted-foreground">{formatDate(r.created_at)}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* Stats tab */}
          <TabsContent value="stats" className="space-y-4">
            <Card className="bg-card/60">
              <CardHeader>
                <CardTitle className="text-sm">Son 7 Gün</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {weekData.map((d) => (
                  <div key={d.label} className="flex items-center gap-3">
                    <span className="text-xs w-8 text-muted-foreground">{d.label}</span>
                    <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.count / maxCount) * 100}%` }}
                        className="bg-primary h-full rounded-full flex items-center justify-end pr-2"
                      >
                        {d.count > 0 && (
                          <span className="text-[10px] text-primary-foreground font-medium">{d.count}</span>
                        )}
                      </motion.div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/60">
              <CardHeader>
                <CardTitle className="text-sm">Puan Dağılımı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Güvenilir (70-100)", count: records.filter((r) => r.score !== null && r.score >= 70).length, color: "bg-success" },
                  { label: "Şüpheli (40-69)", count: records.filter((r) => r.score !== null && r.score >= 40 && r.score < 70).length, color: "bg-warning" },
                  { label: "Güvenilmez (0-39)", count: records.filter((r) => r.score !== null && r.score < 40).length, color: "bg-danger" },
                ].map((d) => (
                  <div key={d.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${d.color}`} />
                      <span className="text-xs">{d.label}</span>
                    </div>
                    <span className="text-sm font-bold">{d.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings tab */}
          <TabsContent value="settings">
            <Card className="bg-card/60">
              <CardHeader>
                <CardTitle className="text-sm">Uygulama Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Toplam Doğrulama</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ortalama Puan</span>
                  <span className="font-medium">{stats.avgScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Yüksek Riskli</span>
                  <span className="font-medium text-danger">{stats.highRisk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform</span>
                  <span className="font-medium">FactCheck by Postal Dijital</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
