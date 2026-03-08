import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for tips
    const tips = [
      "💡 Bilgi: Ctrl+Enter ile hızlı doğrulama yapabilirsiniz",
      "📊 İpucu: Skor dağılımını kontrol etmeyi unutmayın",
      "🔍 Yeni: TikTok ve Telegram linkleri artık destekleniyor",
      "⭐ Favori özelliğini kullanarak sonuçlarınızı kaydedin",
    ];

    const seen = JSON.parse(localStorage.getItem("fc_seen_notifs") || "[]");
    const unseen = tips.filter((_, i) => !seen.includes(i));
    setNotifications(unseen);
  }, []);

  const handleDismissAll = () => {
    const allIndexes = Array.from({ length: 4 }, (_, i) => i);
    localStorage.setItem("fc_seen_notifs", JSON.stringify(allIndexes));
    setNotifications([]);
    setShow(false);
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 relative" onClick={() => setShow(!show)}>
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
        )}
      </Button>
      {show && (
        <motion.div
          className="absolute right-0 top-10 bg-card border border-border rounded-xl p-3 shadow-xl z-50 w-72"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold">Bildirimler</span>
            {notifications.length > 0 && (
              <button className="text-[10px] text-muted-foreground hover:text-foreground" onClick={handleDismissAll}>
                Tümünü okundu işaretle
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-2">Yeni bildirim yok</p>
          ) : (
            <div className="space-y-1.5">
              {notifications.map((n, i) => (
                <div key={i} className="text-xs p-2 rounded-lg bg-muted/50">{n}</div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
