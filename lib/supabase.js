import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wzrxqkzarioopzwuvxdn.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6cnhxa3phcmlvb3B6d3V2eGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMDU4ODEsImV4cCI6MjA5NzY4MTg4MX0.PtX34yvX47s_FRnhOkRTAynXTLbqm2jMyWT7o61lPM8";


export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);