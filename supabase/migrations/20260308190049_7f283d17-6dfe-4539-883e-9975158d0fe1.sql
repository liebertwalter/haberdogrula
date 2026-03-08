
-- Arama geçmişi tablosu
CREATE TABLE public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query_text TEXT,
  query_url TEXT,
  score INTEGER,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS etkinleştir
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Everyone can view search history"
  ON public.search_history FOR SELECT
  USING (true);

-- Edge function insert edebilir (anon key ile)
CREATE POLICY "Allow insert from edge functions"
  ON public.search_history FOR INSERT
  WITH CHECK (true);
