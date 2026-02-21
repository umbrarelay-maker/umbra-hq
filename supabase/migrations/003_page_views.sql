CREATE TABLE IF NOT EXISTS page_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site text NOT NULL DEFAULT 'umbratools',
  page text NOT NULL,
  referrer text,
  user_agent text,
  country text,
  city text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON page_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow service reads" ON page_views FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_site ON page_views(site);
