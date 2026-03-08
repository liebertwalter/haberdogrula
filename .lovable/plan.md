

## Haber Doğrulama Uygulaması - FactCheck

### Sayfa 1: Ana Sayfa (Doğrulama Ekranı)
- Büyük bir başlık: "FactCheck - Haber Doğrulama" 
- Açıklama metni: "İnternette gördüğünüz haberleri doğrulayın"
- **İki sekmeli giriş alanı**: Metin yapıştırma / URL yapıştırma
  - Metin sekmesi: Büyük bir textarea ile haber metnini yapıştırma
  - URL sekmesi: Haber linkini yapıştırma alanı (Firecrawl ile içerik çekilecek)
- "Doğrula" butonu
- Koyu/açık tema geçiş butonu (sağ üst köşe)

### Sayfa 2: Sonuç Ekranı (Doğrulama sonrası aynı sayfada görünür)
- **Güvenilirlik Skoru**: Büyük bir dairesel gauge/progress ile yüzde gösterimi (örn: %78 Doğru)
  - Yeşil: Doğru (%70+), Sarı: Şüpheli (%40-70), Kırmızı: Yanlış (%0-40)
- **Sonuç Kartları**:
  - 📊 **Genel Değerlendirme**: AI'ın genel sonucu ve açıklaması
  - 🔍 **Bulunan Kaynaklar**: Doğrulama için kullanılan web kaynaklarının listesi (tıklanabilir linkler)
  - ⚠️ **Dikkat Edilmesi Gerekenler**: Çelişkili veya şüpheli noktalar
  - ✅ **Doğrulanan Bilgiler**: Haberdeki doğru bulunan kısımlar
  - ❌ **Yanlış Bulunan Bilgiler**: Haberdeki yanlış bulunan kısımlar

### Teknik Altyapı
- **Lovable Cloud** aktif edilecek
- **Perplexity bağlantısı** kurulacak (gerçek zamanlı web araştırması + kaynak gösterimi için ideal)
- **Firecrawl bağlantısı** kurulacak (URL'den haber içeriği çekmek için)
- **Lovable AI** (edge function) ile Perplexity ve Firecrawl sonuçlarını analiz edip yapılandırılmış doğrulama raporu üretilecek
- Koyu/açık tema desteği (next-themes)

### Tasarım
- Modern, güvenilir hissettiren arayüz
- Koyu tema varsayılan
- Yeşil/Sarı/Kırmızı renk kodları ile güvenilirlik gösterimi
- Yükleniyor animasyonu: "Kaynaklar araştırılıyor..." ile adım adım ilerleme gösterimi

