import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    // If URL provided, scrape content with Firecrawl
    if (url && !text) {
      const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
      if (!firecrawlKey) {
        return new Response(
          JSON.stringify({ error: "Firecrawl yapılandırılmamış" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = `https://${formattedUrl}`;
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
