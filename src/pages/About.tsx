import { Brain, Globe, Lock, Zap } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  { q: "FactCheck nasıl çalışır?", a: "Girdiğiniz haber metni veya URL, yapay zeka tarafından analiz edilir. İnternetteki güvenilir kaynaklarla karşılaştırılarak bir güvenilirlik puanı hesaplanır." },
  { q: "Sonuçlar ne kadar güvenilir?", a: "Yapay zeka modelleri sürekli gelişmektedir ancak %100 doğruluk garanti edilemez. Sonuçları bir referans noktası olarak kullanmanızı öneririz." },
  { q: "Verilerim güvende mi?", a: "Aramalarınız anonim olarak kaydedilir. Kişisel veri toplanmaz veya üçüncü taraflarla paylaşılmaz." },
  { q: "Hangi dilleri destekliyorsunuz?", a: "Şu anda Türkçe haberleri doğrulamak için optimize edilmiştir. İngilizce haberler de desteklenmektedir." },
  { q: "URL ile doğrulama nasıl çalışır?", a: "Girdiğiniz URL'deki haber içeriği otomatik olarak çekilir ve metin olarak analiz edilir." },
];

const features = [
  { icon: Brain, title: "Yapay Zeka Analizi", desc: "Gelişmiş AI modelleri ile haber doğrulama" },
  { icon: Globe, title: "Kaynak Taraması", desc: "İnternet üzerinden güvenilir kaynak araştırması" },
  { icon: Lock, title: "Güvenli & Anonim", desc: "Kişisel veri toplamadan güvenli analiz" },
  { icon: Zap, title: "Hızlı Sonuç", desc: "Saniyeler içinde detaylı doğrulama raporu" },
];

export default function About() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-3 pt-4">
          <h1 className="text-3xl font-bold">FactCheck - Haber Doğrula</h1>
          <p className="text-muted-foreground">
            Postal Dijital tarafından geliştirilen yapay zeka destekli haber doğrulama platformu.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {features.map((f) => (
            <Card key={f.title} className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <f.icon className="h-8 w-8 text-primary" />
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Sıkça Sorulan Sorular</h2>
          {faqs.map((faq, i) => (
            <Card key={i} className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{faq.a}</CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center text-xs text-muted-foreground py-4">
          © 2026 Postal Dijital. Tüm hakları saklıdır.
        </div>
      </div>
    </Layout>
  );
}
