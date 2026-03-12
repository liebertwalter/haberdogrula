import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function isTwitterUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i.test(url);
}

function isTikTokUrl(url: string): boolean {
  return /^https?:\/\/(www\.|vm\.|vt\.)?(tiktok\.com)\//i.test(url);
}

function isTelegramUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?(t\.me|telegram\.me)\//i.test(url);
}

async function fetchTweetContent(url: string): Promise<string | null> {
  try {
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      const html = data.html || "";
      const text = html
        .replace(/<blockquote[^>]*>/gi, "")
        .replace(/<\/blockquote>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1")
        .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&mdash;/g, "—")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .trim();
      if (text) {
        const authorName = data.author_name || "";
        const authorUrl = data.author_url || "";
        return `Tweet by ${authorName} (${authorUrl}):\n\n${text}`;
      }
    }
  } catch (e) { console.error("oEmbed failed:", e); }

  try {
    const fxUrl = url.replace("twitter.com", "api.fxtwitter.com").replace("x.com", "api.fxtwitter.com");
    const res = await fetch(fxUrl);
    if (res.ok) {
      const data = await res.json();
      const tweet = data.tweet;
      if (tweet) {
        return `Tweet by ${tweet.author?.name || ""} (@${tweet.author?.screen_name || ""}):\n\n${tweet.text || ""}${tweet.media?.all?.length ? `\n\n[Medya: ${tweet.media.all.map((m: any) => m.type).join(", ")}]` : ""}`;
      }
    }
  } catch (e) { console.error("fxtwitter failed:", e); }

  try {
    const vxUrl = url.replace("twitter.com", "api.vxtwitter.com").replace("x.com", "api.vxtwitter.com");
    const res = await fetch(vxUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.text) return `Tweet by ${data.user_name || ""} (@${data.user_screen_name || ""}):\n\n${data.text}`;
    }
  } catch (e) { console.error("vxtwitter failed:", e); }

  return null;
}

async function fetchTikTokContent(url: string): Promise<string | null> {
  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.title) return `TikTok videosu - ${data.author_name || ""} (${data.author_url || ""}):\n\n${data.title}`;
    }
  } catch (e) { console.error("TikTok oEmbed failed:", e); }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "Accept": "text/html" },
      redirect: "follow",
    });
    if (res.ok) {
      const html = await res.text();
      const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) || html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:title"/);
      const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/) || html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:description"/);
      const title = titleMatch?.[1] || "";
      const desc = descMatch?.[1] || "";
      if (title || desc) return `TikTok videosu:\n\nBaşlık: ${title}\n${desc ? `Açıklama: ${desc}` : ""}`;
    }
  } catch (e) { console.error("TikTok meta fetch failed:", e); }

  return null;
}

async function fetchTelegramContent(url: string): Promise<string | null> {
  try {
    const embedUrl = url.includes("?") ? `${url}&embed=1` : `${url}?embed=1`;
    const res = await fetch(embedUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "Accept": "text/html" },
      redirect: "follow",
    });
    if (res.ok) {
      const html = await res.text();
      const msgMatch = html.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      const authorMatch = html.match(/<div class="tgme_widget_message_author[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
      let text = msgMatch?.[1] || "";
      const author = authorMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || "";
      text = text.replace(/<br\s*\/?>/gi, "\n").replace(/<a[^>]*>(.*?)<\/a>/gi, "$1").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").trim();
      if (text) return `Telegram mesajı${author ? ` - ${author}` : ""}:\n\n${text}`;
    }
  } catch (e) { console.error("Telegram embed fetch failed:", e); }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "Accept": "text/html" },
      redirect: "follow",
    });
    if (res.ok) {
      const html = await res.text();
      const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/) || html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:description"/);
      const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) || html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:title"/);
      const desc = descMatch?.[1] || "";
      const title = titleMatch?.[1] || "";
      if (desc || title) return `Telegram mesajı${title ? ` - ${title}` : ""}:\n\n${desc}`;
    }
  } catch (e) { console.error("Telegram meta fetch failed:", e); }

  return null;
}

// Perform multiple web searches for deeper verification
async function deepWebSearch(newsContent: string, firecrawlKey: string): Promise<string> {
  let webSearchContext = "";
  
  // Extract different aspects for separate searches
  const mainQuery = newsContent.substring(0, 200).replace(/\n/g, " ").trim();
  
  // Extract key entities/names for targeted search
  const words = newsContent.split(/\s+/).filter(w => w.length > 3);
  const capitalWords = newsContent.match(/[A-ZÇĞİÖŞÜ][a-zçğıöşü]+(?:\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+)*/g) || [];
  const entityQuery = capitalWords.slice(0, 5).join(" ");
  
  const searches = [
    // Search 1: Main content search (recent)
    { query: mainQuery, limit: 5, tbs: "qdr:w", label: "Ana İçerik Araması (Son 1 hafta)" },
    // Search 2: Broader time range
    { query: mainQuery, limit: 5, tbs: "qdr:y", label: "Geniş Zaman Araması (Son 1 yıl)" },
    // Search 3: Fact-check specific search  
    { query: `${mainQuery.substring(0, 100)} doğru mu yalan mı fact check`, limit: 3, tbs: "qdr:m", label: "Doğrulama Araması" },
  ];
  
  // Add entity search if we found named entities
  if (entityQuery && entityQuery !== mainQuery.substring(0, entityQuery.length)) {
    searches.push({ query: entityQuery, limit: 3, tbs: "qdr:m", label: "Kişi/Kurum Araması" });
  }

  const searchPromises = searches.map(async (s) => {
    try {
      console.log(`Web search [${s.label}]: ${s.query.substring(0, 60)}...`);
      const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${firecrawlKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: s.query,
          limit: s.limit,
          lang: "tr",
          tbs: s.tbs,
        }),
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const results = searchData.data || searchData.results || [];
        if (results.length > 0) {
          let section = `\n\n--- ${s.label} (${results.length} sonuç) ---\n`;
          for (const r of results) {
            section += `\nKaynak: ${r.title || "Bilinmiyor"}\nURL: ${r.url || ""}\nÖzet: ${r.description || r.snippet || ""}\nİçerik: ${(r.markdown || "").substring(0, 500)}\n`;
          }
          return section;
        }
      }
    } catch (err) {
      console.error(`Web search failed [${s.label}]:`, err);
    }
    return "";
  });

  const results = await Promise.all(searchPromises);
  webSearchContext = results.filter(Boolean).join("");
  
  if (webSearchContext) {
    webSearchContext = "\n\n=== WEB DOĞRULAMA SONUÇLARI (Çoklu Arama) ===" + webSearchContext + "\n=== WEB DOĞRULAMA SONU ===\n";
  }

  return webSearchContext;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, url } = await req.json();

    if (!text && !url) {
      return new Response(
        JSON.stringify({ error: "Metin veya URL gereklidir" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let newsContent = text || "";

    // If URL provided, scrape content
    if (url && !text) {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = `https://${formattedUrl}`;
      }

      if (isTwitterUrl(formattedUrl)) {
        console.log("Detected Twitter/X URL, using special handler:", formattedUrl);
        const tweetContent = await fetchTweetContent(formattedUrl);
        if (tweetContent) { newsContent = tweetContent; console.log("Tweet content fetched successfully"); }
        else {
          return new Response(JSON.stringify({ error: "X/Twitter içeriği çekilemedi. Lütfen tweet metnini doğrudan yapıştırın." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      } else if (isTikTokUrl(formattedUrl)) {
        console.log("Detected TikTok URL, using special handler:", formattedUrl);
        const tiktokContent = await fetchTikTokContent(formattedUrl);
        if (tiktokContent) { newsContent = tiktokContent; console.log("TikTok content fetched successfully"); }
        else {
          return new Response(JSON.stringify({ error: "TikTok içeriği çekilemedi. Lütfen video açıklamasını doğrudan yapıştırın." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      } else if (isTelegramUrl(formattedUrl)) {
        console.log("Detected Telegram URL, using special handler:", formattedUrl);
        const telegramContent = await fetchTelegramContent(formattedUrl);
        if (telegramContent) { newsContent = telegramContent; console.log("Telegram content fetched successfully"); }
        else {
          return new Response(JSON.stringify({ error: "Telegram içeriği çekilemedi. Lütfen mesaj metnini doğrudan yapıştırın." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      } else {
        const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
        if (!firecrawlKey) {
          return new Response(JSON.stringify({ error: "Firecrawl yapılandırılmamış" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        console.log("Scraping URL:", formattedUrl);
        const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ url: formattedUrl, formats: ["markdown"], onlyMainContent: true }),
        });
        const scrapeData = await scrapeRes.json();
        if (!scrapeRes.ok) {
          console.error("Firecrawl error:", scrapeData);
          return new Response(JSON.stringify({ error: "URL içeriği çekilemedi: " + (scrapeData.error || scrapeRes.status) }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        newsContent = scrapeData.data?.markdown || scrapeData.markdown || "";
        if (!newsContent) {
          return new Response(JSON.stringify({ error: "URL'den içerik çekilemedi" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }
    }

    // Truncate if too long
    if (newsContent.length > 8000) {
      newsContent = newsContent.substring(0, 8000);
    }

    // Deep web search verification
    let webSearchContext = "";
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (firecrawlKey) {
      try {
        webSearchContext = await deepWebSearch(newsContent, firecrawlKey);
        console.log(`Deep web search completed. Context length: ${webSearchContext.length}`);
      } catch (searchErr) {
        console.error("Deep web search failed (continuing without):", searchErr);
      }
    }

    // Use Lovable AI to fact-check
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY yapılandırılmamış" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const turkeyDate = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "full", timeStyle: "short" });
    const currentDate = new Date().toISOString().split("T")[0];

    const systemPrompt = `Sen dünyanın en iyi ve en tarafsız haber doğrulama uzmanısın. Görevin haberleri ADIL ve DOĞRU bir şekilde değerlendirmektir.

Bugünün tarihi ve saati (Türkiye saati): ${turkeyDate}
ISO Tarih: ${currentDate}

GÜNCELLİK BİLGİLERİ (Mart 2026 itibarıyla):
- ABD Başkanı: Donald Trump (Ocak 2025'te göreve başladı, 47. Başkan)
- Türkiye Cumhurbaşkanı: Recep Tayyip Erdoğan
- Rusya Devlet Başkanı: Vladimir Putin
- Ukrayna Devlet Başkanı: Volodymyr Zelenskyy
- İngiltere Başbakanı: Keir Starmer
- Fransa Cumhurbaşkanı: Emmanuel Macron
- Almanya Başbakanı: Friedrich Merz

ÇOK ÖNEMLİ - TARAFSIZLIK KURALLARI:
1. Bir haberi "yanlış" olarak işaretlemek için KESİN KANIT olmalıdır. Emin değilsen "doğrulanamadı" de, "yanlış" deme.
2. Web araması sonuçlarında haberi DESTEKLEYEN kaynaklar varsa, bu haberin güvenilirliğini ARTIRMALIDIR.
3. Büyük ve güvenilir haber kaynaklarında (AA, Reuters, BBC, TRT, CNN, NTV vb.) geçen haberler otomatik olarak daha yüksek puan almalıdır.
4. Haberde belirtilen olayın gerçekten yaşanıp yaşanmadığını web aramalarından kontrol et. Eğer birden fazla kaynak doğruluyorsa yüksek puan ver.
5. Sadece spekülatif, gelecek tahmini veya kanıtlanamayan iddialara düşük puan ver.
6. Bir haberin "doğru" olup olmadığını belirlerken şu sırayı izle:
   a) Web araması sonuçlarında bu haber veya benzer bilgiler var mı?
   b) Güvenilir kaynaklarda geçiyor mu?
   c) Haberdeki bilgiler kendi içinde tutarlı mı?
   d) Haberdeki tarihler, isimler, rakamlar doğru mu?

PUANLAMA REHBERİ:
- 85-100: Birden fazla güvenilir kaynak tarafından doğrulanmış, resmi açıklama var, web aramasında destekleyen çok sayıda sonuç var
- 70-84: Güvenilir kaynaklarda geçiyor, genel olarak doğru bilgiler içeriyor
- 55-69: Kısmen doğru, bazı bilgiler eksik veya tam doğrulanamıyor ama ana iddia makul
- 40-54: Karışık bilgiler, bazı doğru bazı yanlış unsurlar var
- 25-39: Önemli yanlışlıklar içeriyor, manipülatif unsurlar belirgin
- 10-24: Büyük ölçüde yanlış veya uydurma
- 0-9: Tamamen uydurma dezenformasyon

PUANLAMA KURALLARI:
- Web aramasında haberi destekleyen kaynaklar bulunursa: +15-25 puan bonus
- Birden fazla bağımsız güvenilir kaynak doğruluyorsa: minimum 70 puan
- Haber güvenilir bir kaynaktan (AA, Reuters, TRT, NTV vb.) geliyorsa: minimum 65 puan
- Haberdeki olayın gerçekleştiğine dair kanıt varsa: minimum 60 puan
- Güncel olmayan bilgiler (eski liderler vb.) varsa: -20 puan
- Kaynak belirtilmemiş ve web'de de bulunamıyorsa: maksimum 50 puan
- Duygusal/sansasyonel dil kullanan haberlere: -5 puan (ama içerik doğruysa yine de yüksek puan verilebilir)
- ASLA bir haberi sadece "emin olamadığın" için düşük puanlama. Emin değilsen 50-65 arasında ver ve açıkla.

Yanıtını MUTLAKA aşağıdaki yapıda ver:
- score: 0-100 arası güvenilirlik puanı
- summary: Haberin genel değerlendirmesi (4-5 cümle, Türkçe, detaylı ve ADIL)
- sources: Doğrulama kaynakları [{title, url}] (en az 3 gerçek ve erişilebilir kaynak, web arama sonuçlarından al)
- warnings: Dikkat edilmesi gereken noktalar (detaylı açıklamalarla)
- verified: Doğru bulunan bilgiler (her biri açıklamalı) - WEB ARAMASINDA DESTEKLEYEN BİLGİ VARSA MUTLAKA BURAYA EKLE
- debunked: Yanlış bulunan bilgiler (her biri KESİN KANIT ile neden yanlış olduğu ile) - SADECE KESİN YANLIŞ OLANLARI BURAYA KOY
- category: Haber kategorisi (siyaset/ekonomi/sağlık/teknoloji/spor/dünya/bilim/magazin/diğer)
- sentiment: Haberin duygu tonu (olumlu/olumsuz/nötr/korkutucu/umut_verici)
- freshness: Bilgilerin güncelliği (güncel/eski/belirsiz)
- confidence: AI'ın kendi güven seviyesi (düşük/orta/yüksek)
- detailedScores: Alt kategori puanları {sourceReliability: 0-100, factualAccuracy: 0-100, bias: 0-100, freshness: 0-100, consistency: 0-100}`;

    console.log("Calling Lovable AI for fact-checking (deep analysis)...");

    const userMessage = webSearchContext
      ? `Aşağıdaki haberi kapsamlı bir şekilde doğrula. Web araması sonuçlarını DİKKATLİCE incele ve haberi destekleyen bilgiler varsa bunu puanlamada pozitif olarak yansıt:\n\n--- HABER İÇERİĞİ ---\n${newsContent}\n${webSearchContext}`
      : `Aşağıdaki haberi doğrula:\n\n${newsContent}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "fact_check_result",
              description: "Haber doğrulama sonucunu döndür",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "0-100 arası güvenilirlik puanı" },
                  summary: { type: "string", description: "Genel değerlendirme (4-5 cümle)" },
                  sources: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { title: { type: "string" }, url: { type: "string" } },
                      required: ["title", "url"],
                      additionalProperties: false,
                    },
                  },
                  warnings: { type: "array", items: { type: "string" } },
                  verified: { type: "array", items: { type: "string" } },
                  debunked: { type: "array", items: { type: "string" } },
                  category: { type: "string" },
                  sentiment: { type: "string" },
                  freshness: { type: "string" },
                  confidence: { type: "string" },
                  detailedScores: {
                    type: "object",
                    properties: {
                      sourceReliability: { type: "number" },
                      factualAccuracy: { type: "number" },
                      bias: { type: "number" },
                      freshness: { type: "number" },
                      consistency: { type: "number" },
                    },
                    required: ["sourceReliability", "factualAccuracy", "bias", "freshness", "consistency"],
                    additionalProperties: false,
                  },
                },
                required: ["score", "summary", "sources", "warnings", "verified", "debunked", "category", "sentiment", "freshness", "confidence", "detailedScores"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "fact_check_result" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Çok fazla istek gönderildi, lütfen biraz bekleyin." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Kredi yetersiz, lütfen hesabınıza kredi ekleyin." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      return new Response(JSON.stringify({ error: "AI doğrulama hatası" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response:", JSON.stringify(aiData));
      return new Response(JSON.stringify({ error: "AI'dan yapılandırılmış yanıt alınamadı" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const result = JSON.parse(toolCall.function.arguments);
    result.checkedAt = new Date().toISOString();
    result.webSearchUsed = webSearchContext.length > 0;

    // Save to search history with full result JSON
    let resultId: string | null = null;
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabaseClient = createClient(supabaseUrl, supabaseKey);

      const { data: insertData } = await supabaseClient.from("search_history").insert({
        query_text: text || null,
        query_url: url || null,
        query_input: text || url || null,
        score: result.score,
        summary: result.summary,
        result_json: result,
      }).select("id").single();
      
      resultId = insertData?.id || null;
      console.log("Search saved to history, id:", resultId);
    } catch (historyErr) {
      console.error("Failed to save history:", historyErr);
    }

    // Add result ID so frontend can create shareable link
    if (resultId) {
      result.resultId = resultId;
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fact-check error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Bilinmeyen hata" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
