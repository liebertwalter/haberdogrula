import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function NotificationPreferences() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem("fc_notifications") === "true");
  const { toast } = useToast();

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("fc_notifications", String(next));
    toast({ title: next ? "Bildirimler açıldı 🔔" : "Bildirimler kapatıldı 🔕" });
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggle} className="rounded-full h-8 w-8">
      {enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
    </Button>
  );
}
