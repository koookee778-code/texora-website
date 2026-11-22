import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yuxdhhzjbuccypwcvtyd.supabase.co';
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eGRoaHpqYnVjY3lwd2N2dHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyMzEzNzQsImV4cCI6MjEwOTgwNzM3NH0.2PJ6t6bzB0-eOwru7RHwv6gan7ghiYcfY3SdEjNRrqw';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface DynamicService {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  category: string;
  icon?: string;
  active?: boolean;
  sort_order?: number;
  base_price?: number | null;
  currency?: string;
  is_custom_quote?: boolean;
}

/**
 * Fetch dynamic services from Supabase
 */
export async function getWebsiteServices(): Promise<DynamicService[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) return data as DynamicService[];
  } catch (err) {
    console.warn('Failed to load services from Supabase, falling back to local defaults:', err);
  }
  return [];
}

export interface WebsitePromotion {
  id: string;
  title_ar: string;
  title_en: string;
  discount_percentage: number;
  code?: string;
  description_ar: string;
  description_en: string;
  badge_text_ar?: string;
  badge_text_en?: string;
  theme?: 'red-classic' | 'red-neon' | 'blue-neon' | 'sky-blue' | 'dark-obsidian' | 'purple-cyber' | 'silver' | 'silver-metallic';
  is_global?: boolean;
  applicable_services?: string[] | null;
  active: boolean;
  starts_at: string;
  expires_at: string;
}

/**
 * Fetch active promotion from Supabase.
 * Returns null if no active promotion or if duration has expired.
 */
export async function getActivePromotion(): Promise<WebsitePromotion | null> {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    if (data && data.length > 0) {
      const promo = data[0] as WebsitePromotion;
      const now = Date.now();
      const expiry = new Date(promo.expires_at).getTime();
      if (expiry > now) {
        return promo;
      }
    }
  } catch (err) {
    console.warn('Failed to load active promotion from Supabase:', err);
  }
  return null;
}

/**
 * Log page view visit into Supabase analytics
 */
export async function logPageVisit(pagePath: string = '/'): Promise<void> {
  try {
    await supabase.from('analytics').insert({
      event_type: 'page_view',
      page_path: pagePath,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    });
  } catch (err) {
    // Non-blocking visit logging
  }
}
