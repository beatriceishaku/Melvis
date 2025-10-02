-- Crisis Events Table (Audit Logging)
CREATE TABLE public.crisis_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trigger_keywords TEXT[],
  message_content TEXT,
  severity_level TEXT CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
  action_taken TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

ALTER TABLE public.crisis_events ENABLE ROW LEVEL SECURITY;

-- Only admins and the user themselves can view crisis events
CREATE POLICY "Users can view their own crisis events"
  ON public.crisis_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert crisis events
CREATE POLICY "System can insert crisis events"
  ON public.crisis_events
  FOR INSERT
  WITH CHECK (true);

-- Emergency Resources Table
CREATE TABLE public.emergency_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT CHECK (resource_type IN ('hotline', 'therapist', 'crisis_center', 'online_support')),
  name TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  description TEXT,
  country_code TEXT DEFAULT 'US',
  available_24_7 BOOLEAN DEFAULT FALSE,
  languages TEXT[],
  priority_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.emergency_resources ENABLE ROW LEVEL SECURITY;

-- Emergency resources are public (everyone can read)
CREATE POLICY "Emergency resources are publicly readable"
  ON public.emergency_resources
  FOR SELECT
  USING (active = TRUE);

-- Insert default emergency resources
INSERT INTO public.emergency_resources (resource_type, name, phone, website, description, country_code, available_24_7, languages, priority_order) VALUES
('hotline', 'National Suicide Prevention Lifeline', '988', 'https://988lifeline.org', 'Free and confidential support for people in distress, 24/7', 'US', TRUE, ARRAY['English', 'Spanish'], 1),
('hotline', 'Crisis Text Line', '741741', 'https://www.crisistextline.org', 'Text HOME to 741741 for free, 24/7 crisis support in US', 'US', TRUE, ARRAY['English'], 2),
('hotline', 'SAMHSA National Helpline', '1-800-662-4357', 'https://www.samhsa.gov/find-help/national-helpline', 'Free, confidential, 24/7 treatment referral and information service', 'US', TRUE, ARRAY['English', 'Spanish'], 3),
('online_support', 'BetterHelp', NULL, 'https://www.betterhelp.com', 'Online therapy and counseling services', 'US', FALSE, ARRAY['English'], 4);

-- User Consent Table
CREATE TABLE public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  accepted_terms BOOLEAN DEFAULT FALSE,
  accepted_disclaimer BOOLEAN DEFAULT FALSE,
  crisis_sharing_consent BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own consents
CREATE POLICY "Users can view their own consents"
  ON public.user_consents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consents"
  ON public.user_consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents"
  ON public.user_consents
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_crisis_events_user_id ON public.crisis_events(user_id);
CREATE INDEX idx_crisis_events_session_id ON public.crisis_events(session_id);
CREATE INDEX idx_crisis_events_severity ON public.crisis_events(severity_level);
CREATE INDEX idx_emergency_resources_type ON public.emergency_resources(resource_type);
CREATE INDEX idx_user_consents_user_id ON public.user_consents(user_id);