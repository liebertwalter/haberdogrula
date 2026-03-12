
ALTER TABLE public.search_history 
ADD COLUMN IF NOT EXISTS result_json jsonb,
ADD COLUMN IF NOT EXISTS query_input text;
