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
  // Method 1: Twitter oEmbed API (no auth needed)
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
  } catch (e) {
    console.error("oEmbed failed:", e);
  }

  // Method 2: fxtwitter API
  try {
    const fxUrl = url
      .replace("twitter.com", "api.fxtwitter.com")
      .replace("x.com", "api.fxtwitter.com");
    const res = await fetch(fxUrl);
    if (res.ok) {
      const data = await res.json();
      const tweet = data.tweet;
      if (tweet) {
        const author = tweet.author?.name || "";
        const handle = tweet.author?.screen_name || "";
        const text = tweet.text || "";
        const media = tweet.media?.all?.map((m: any) => m.type).join(", ") || "";
        return `Tweet by ${author} (@${handle}):\n\n${text}${media ? `\n\n[Medya: ${media}]` : ""}`;
      }
    }
  } catch (e) {
    console.error("fxtwitter failed:", e);
  }

  // Method 3: vxtwitter
  try {
    const vxUrl = url
      .replace("twitter.com", "api.vxtwitter.com")
      .replace("x.com", "api.vxtwitter.com");
    const res = await fetch(vxUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        return `Tweet by ${data.user_name || ""} (@${data.user_screen_name || ""}):\n\n${data.text}`;
      }
    }
  } catch (e) {
    console.error("vxtwitter failed:", e);
  }

  return null;
}

async function fetchTikTokContent(url: string): Promise<string | null> {
  // Method 1: TikTok oEmbed API (official, no auth needed)
  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      const title = data.title || "";
      const authorName = data.author_name || "";
      const authorUrl = data.author_url || "";
      if (title) {
        return `TikTok videosu - ${authorName} (${authorUrl}):\n\n${title}`;
      }
    }
  } catch (e) {
    console.error("TikTok oEmbed failed:", e);
  }

  // Method 2: Try fetching page and extracting meta tags
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Accept": "text/html",
      },
      redirect: "follow",
    });
    if (res.ok) {
      const html = await res.text();
      const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) ||
                          html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:title"/);
      const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/) ||
                         html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:description"/);
      const authorMatch = html.match(/<meta[^>]*property="og:author"[^>]*content="([^"]*)"/) ||
                           html.match(/"author":"([^"]*)"/);
      
      const title = titleMatch?.[1] || "";
      const desc = descMatch?.[1] || "";
      const author = authorMatch?.[1] || "";
      
      if (title || desc) {
        return `TikTok videosu${author ? ` - ${author}` : ""}:\n\nBaşlık: ${title}\n${desc ? `Açıklama: ${desc}` : ""}`;
      }
    }
  } catch (e) {
    console.error("TikTok meta fetch failed:", e);
  }

  return null;
}

async function fetchTelegramContent(url: string): Promise<string | null> {
  // Telegram public posts have an embed view
  try {
    // Convert t.me/channel/123 to t.me/channel/123?embed=1
    const embedUrl = url.includes("?") ? `${url}&embed=1` : `${url}?embed=1`;
    const res = await fetch(embedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Accept": "text/html",
      },
      redirect: "follow",
    });
    if (res.ok) {
      const html = await res.text();
      
      // Extract message text from embed
      const msgMatch = html.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      const authorMatch = html.match(/<div class="tgme_widget_message_author[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
      
      let text = msgMatch?.[1] || "";
      const author = authorMatch?.[1]?.replace(/<[^>]+>/g, "").trim() || "";
      
      // Strip HTML tags
      text = text
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .trim();
      
      if (text) {
        return `Telegram mesajı${author ? ` - ${author}` : ""}:\n\n${text}`;
      }
    }
  } catch (e) {
    console.error("Telegram embed fetch failed:", e);
  }

  // Method 2: Try og:description
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Accept": "text/html",
      },
      redirect: "follow",
    });
    if (res.ok) {
      const html = await res.text();
      const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/) ||
                         html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:description"/);
      const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/) ||
                          html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:title"/);
      
      const desc = descMatch?.[1] || "";
      const title = titleMatch?.[1] || "";
      
      if (desc || title) {
        return `Telegram mesajı${title ? ` - ${title}` : ""}:\n\n${desc}`;
      }
    }
  } catch (e) {
    console.error("Telegram meta fetch failed:", e);
  }

  return null;
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

      // Special handling for Twitter/X URLs
      if (isTwitterUrl(formattedUrl)) {
        console.log("Detected Twitter/X URL, using special handler:", formattedUrl);
        const tweetContent = await fetchTweetContent(formattedUrl);
        if (tweetContent) {
          newsContent = tweetContent;
          console.log("Tweet content fetched successfully");
        } else {
          return new Response(
            JSON.stringify({ error: "X/Twitter içeriği çekilemedi. Lütfen tweet metnini doğrudan yapıştırın." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else if (isTikTokUrl(formattedUrl)) {
        console.log("Detected TikTok URL, using special handler:", formattedUrl);
        const tiktokContent = await fetchTikTokContent(formattedUrl);
        if (tiktokContent) {
          newsContent = tiktokContent;
          console.log("TikTok content fetched successfully");
        } else {
          return new Response(
            JSON.stringify({ error: "TikTok içeriği çekilemedi. Lütfen video açıklamasını doğrudan yapıştırın." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else if (isTelegramUrl(formattedUrl)) {
        console.log("Detected Telegram URL, using special handler:", formattedUrl);
        const telegramContent = await fetchTelegramContent(formattedUrl);
        if (telegramContent) {
          newsContent = telegramContent;
          console.log("Telegram content fetched successfully");
        } else {
          return new Response(
            JSON.stringify({ error: "Telegram içeriği çekilemedi. Lütfen mesaj metnini doğrudan yapıştırın." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else {
        // Use Firecrawl for other URLs
        const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
        if (!firecrawlKey) {
          return new Response(
            JSON.stringify({ error: "Firecrawl yapılandırılmamış" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log("Scraping URL:", formattedUrl);
        const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${firecrawlKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: formattedUrl,
            formats: ["markdown"],
            onlyMainContent: true,
          }),
        });

        const scrapeData = await scrapeRes.json();
        if (!scrapeRes.ok) {
          console.error("Firecrawl error:", scrapeData);
          return new Response(
            JSON.stringify({ error: "URL içeriği çekilemedi: " + (scrapeData.error || scrapeRes.status) }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        newsContent = scrapeData.data?.markdown || scrapeData.markdown || "";
        if (!newsContent) {
          return new Response(
            JSON.stringify({ error: "URL'den içerik çekilemedi" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Truncate if too long
    if (newsContent.length > 5000) {
      newsContent = newsContent.substring(0, 5000);
    }

    // Use Lovable AI to fact-check
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY yapılandırılmamış" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `Sen bir profesyonel haber doğrulama uzmanısın. Sana verilen haber metnini analiz et ve doğruluğunu değerlendir.

Yanıtını MUTLAKA aşağıdaki JSON yapısında ver (tool calling ile):
- score: 0-100 arası bir güvenilirlik puanı (100 = kesinlikle doğru, 0 = kesinlikle yanlış)
- summary: Haberin genel değerlendirmesi (2-3 cümle, Türkçe)
- sources: Doğrulama için referans alınabilecek kaynaklar [{title, url}] (en az 2-3 gerçek kaynak)
- warnings: Dikkat edilmesi gereken noktalar (string dizisi)
- verified: Haberdeki doğru bulunan bilgiler (string dizisi)
- debunked: Haberdeki yanlış bulunan bilgiler (string dizisi)

ÖNEMLİ KURALLAR:
- Haberin içeriğindeki iddiaları, bilinen gerçeklerle karşılaştır.
- Tarih, isim, yer gibi somut bilgileri kontrol et.
- Eğer haber tamamen uydurma veya manipülatif görünüyorsa düşük puan ver.
- Kısmi doğruluk varsa orta puan ver.
- Kaynaklar gerçek ve erişilebilir web adresleri olmalı.`;

    console.log("Calling Lovable AI for fact-checking...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Aşağıdaki haberi doğrula:\n\n${newsContent}` },
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
                  summary: { type: "string", description: "Genel değerlendirme" },
                  sources: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        url: { type: "string" },
                      },
                      required: ["title", "url"],
                      additionalProperties: false,
                    },
                  },
                  warnings: { type: "array", items: { type: "string" } },
                  verified: { type: "array", items: { type: "string" } },
                  debunked: { type: "array", items: { type: "string" } },
                },
                required: ["score", "summary", "sources", "warnings", "verified", "debunked"],
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
        return new Response(
          JSON.stringify({ error: "Çok fazla istek gönderildi, lütfen biraz bekleyin." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Kredi yetersiz, lütfen hesabınıza kredi ekleyin." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      return new Response(
        JSON.stringify({ error: "AI doğrulama hatası" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response:", JSON.stringify(aiData));
      return new Response(
        JSON.stringify({ error: "AI'dan yapılandırılmış yanıt alınamadı" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);

    // Save to search history
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabaseClient = createClient(supabaseUrl, supabaseKey);

      await supabaseClient.from("search_history").insert({
        query_text: text || null,
        query_url: url || null,
        score: result.score,
        summary: result.summary,
      });
      console.log("Search saved to history");
    } catch (historyErr) {
      console.error("Failed to save history:", historyErr);
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
