import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'texora-db.json');

const supabaseUrl = process.env.SUPABASE_URL || 'https://yuxdhhzjbuccypwcvtyd.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eGRoaHpqYnVjY3lwd2N2dHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyMzEzNzQsImV4cCI6MjEwOTgwNzM3NH0.2PJ6t6bzB0-eOwru7RHwv6gan7ghiYcfY3SdEjNRrqw';
const supabaseServer = createClient(supabaseUrl, supabaseKey);

export interface StoredLead {
  id: string;
  clientName: string;
  whatsappPhone: string;
  companyOrBrand: string;
  systemCategory: 'web-platform' | 'digital-marketing' | 'edtech-lms' | 'pharmacy-retail-erp';
  projectSummary: string;
  aiBotQualification: string;
  estimatedArchitecture: string;
  createdAt: string;
}

const SEED_LEADS: StoredLead[] = [
  {
    id: 'tx-lead-101',
    clientName: 'د. أحمد المنصور',
    whatsappPhone: '+201098451200',
    companyOrBrand: 'مجموعة صيدليات النور (14 فرعاً)',
    systemCategory: 'pharmacy-retail-erp',
    projectSummary: 'ربط الفروع الـ 14 بنظام مخزون لحظي وتنبيهات صلاحية الأدوية مع بوت واتساب لطلبات الروشتات.',
    aiBotQualification: 'تم التأهيل تلقائياً عبر بوت واتساب: باقة PharmaCore Enterprise + ربط Cloudflare Edge وقاعدة بيانات Supabase.',
    estimatedArchitecture: 'Cloudflare Pages + Supabase PostgreSQL + Vercel WhatsApp Cloud Webhook',
    createdAt: '2026-11-08T18:30:00Z',
  },
  {
    id: 'tx-lead-102',
    clientName: 'أ. سارة الكيلاني',
    whatsappPhone: '+966554128900',
    companyOrBrand: 'أكاديمية رواد المستقبل التعليمية',
    systemCategory: 'edtech-lms',
    projectSummary: 'منصة تعليمية تفاعلية لبث المحاضرات المباشرة وبنوك الأسئلة الذكية لـ 25,000 طالب.',
    aiBotQualification: 'تم التأهيل تلقائياً عبر بوت واتساب: منصة EduVerse LMS مع حماية الفيديو وتطبيق ويب تقدمي.',
    estimatedArchitecture: 'React + Cloudflare Stream + Supabase Auth & Realtime + Vercel AI Tutor Bot',
    createdAt: '2026-11-08T21:15:00Z',
  },
];

function loadLeads(): StoredLead[] {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(SEED_LEADS, null, 2), 'utf8');
      return [...SEED_LEADS];
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...SEED_LEADS];
  } catch {
    return [...SEED_LEADS];
  }
}

function saveLeads(leads: StoredLead[]): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist leads:', err);
  }
}

function buildDeterministicWhatsAppReply(message: string, category?: string): {
  reply: string;
  detectedCategory: string;
  recommendedStack: string;
} {
  const lower = (message + ' ' + (category || '')).toLowerCase();

  if (
    lower.includes('صيدلي') ||
    lower.includes('محل') ||
    lower.includes('متجر') ||
    lower.includes('براند') ||
    lower.includes('كاشير') ||
    lower.includes('مخزن') ||
    lower.includes('pharmacy') ||
    lower.includes('erp') ||
    lower.includes('pos')
  ) {
    return {
      reply:
        'أهلاً بك في TEXORA! بخصوص أنظمة الصيدليات والمحلات والبراندات (Pharma & Retail ERP/POS): نقدم لك نظاماً سحابياً متكاملاً يشمل نقاط البيع السريعة (POS)، إدارة المخزون وتواريخ الصلاحية والباركود، الفاتورة الإلكترونية، ومتجر إلكتروني مربوط ببوت واتساب يستقبل طلبات العملاء والروشتات تلقائياً 24/7. مدة التنفيذ والتخصيص: 10 إلى 18 يوماً.',
      detectedCategory: 'أنظمة صيدليات ومتاجر وبراندات (ERP / POS)',
      recommendedStack: 'Cloudflare Pages + Supabase Realtime DB + Vercel WhatsApp Cloud API',
    };
  }

  if (
    lower.includes('تعليم') ||
    lower.includes('منصة') ||
    lower.includes('طلاب') ||
    lower.includes('كورسات') ||
    lower.includes('أكاديمية') ||
    lower.includes('edtech') ||
    lower.includes('lms')
  ) {
    return {
      reply:
        'أهلاً بك في TEXORA! بخصوص المنصات التعليمية الذكية (EduVerse LMS): نصمم لك منصة تعليمية متكاملة ببث فيديو مشفر، اختبارات تفاعلية مصححة آلياً، لوحة تحكم للمدرسين وأولياء الأمور، وبوت واتساب يرسل تقارير الحضور والدرجات وتذكيرات الحصص تلقائياً بدون تدخل بشري.',
      detectedCategory: 'منصات تعليمية ذكية (EdTech & LMS)',
      recommendedStack: 'React 19 + Cloudflare Edge + Supabase + Vercel Automated WhatsApp Notifier',
    };
  }

  if (
    lower.includes('تسويق') ||
    lower.includes('اعلان') ||
    lower.includes('إعلان') ||
    lower.includes('سيو') ||
    lower.includes('seo') ||
    lower.includes('marketing')
  ) {
    return {
      reply:
        'أهلاً بك في TEXORA! بخصوص التسويق الإلكتروني والنمو الرقمي: نبني لك منظومة استحواذ متكاملة تشمل تهيئة محركات البحث التقنية (Technical SEO عبر بيانات Semrush)، حملات الأداء الممولة، وأتمتة تحويل العملاء المحتملين عبر بوت واتساب الذكي لمضاعفة المبيعات.',
      detectedCategory: 'تسويق إلكتروني ومحركات نمو (Growth & SEO)',
      recommendedStack: 'Cloudflare Analytics + Semrush SEO Pipeline + Vercel WhatsApp Conversion Bot',
    };
  }

  return {
    reply:
      'مرحباً بك في شركة TEXORA للبرمجيات والأنظمة الذكية! أنا البوت الذكي الخاص بالشركة (أعمل تلقائياً عبر Vercel + قاعدة بيانات Supabase). يمكنني مساعدتك فوراً في: 1) تطوير المواقع والمنصات ثلاثية الأبعاد، 2) أنظمة الصيدليات والمتاجر والبراندات الكاملة، 3) المنصات التعليمية، 4) التسويق الإلكتروني وأتمتة واتساب. أخبرني بنوع مشروعك وسأجهز لك خطة التنفيذ والتكلفة فوراً!',
    detectedCategory: 'تطوير مواقع وأنظمة متكاملة (Full-Stack Web & AI Systems)',
    recommendedStack: 'Cloudflare Pages (Frontend) + Vercel Serverless (WhatsApp Bot) + Supabase (PostgreSQL)',
  };
}

async function generateGeminiWhatsAppReply(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'bot'; text: string }> = [],
  categoryHint?: string
): Promise<{
  reply: string;
  detectedCategory: string;
  recommendedStack: string;
  source: 'gemini' | 'deterministic-engine';
}> {
  const fallback = buildDeterministicWhatsAppReply(userMessage, categoryHint);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return { ...fallback, source: 'deterministic-engine' };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const historyContext = conversationHistory
      .slice(-6)
      .map((m) => `${m.role === 'user' ? 'العميل' : 'بوت TEXORA'}: ${m.text}`)
      .join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `سجل المحادثة السابق:\n${historyContext}\n\nرسالة العميل الجديدة: ${userMessage}`,
      config: {
        systemInstruction:
          'أنت البوت الذكي الرسمي لشركة TEXORA (تكسورا) على واتساب. تعمل بشكل تلقائي بالكامل بدون تدخل بشري لتأهيل العملاء والرد على استفساراتهم باحترافية وإبهار. خدمات شركة TEXORA تشمل: 1) تطوير مواقع ويب احترافية وثلاثية الأبعاد (مستضافة على Cloudflare)، 2) التسويق الإلكتروني والسيو (SEO)، 3) المنصات التعليمية الذكية (LMS)، 4) أنظمة المحلات الكاملة مثل الصيدليات والمتاجر والبراندات (POS + مخزون + باركود + متجر + ربط واتساب عبر Vercel وقاعدة بيانات Supabase). اكتب رداً مختصراً ومقنعاً وودوداً باللغة العربية (أو لغة العميل) في 3 إلى 4 جمل كحد أقصى يوضح الحل التقني المقترح والخطوة التالية.',
      },
    });

    const text = response.text?.trim();
    if (text && text.length > 10) {
      return {
        reply: text,
        detectedCategory: fallback.detectedCategory,
        recommendedStack: fallback.recommendedStack,
        source: 'gemini',
      };
    }
  } catch (err) {
    console.warn('Gemini call fell back to deterministic engine:', err);
  }

  return { ...fallback, source: 'deterministic-engine' };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // GET /api/services - Retrieve all active dynamic services from Supabase
  app.get('/api/services', async (_req, res) => {
    try {
      const { data, error } = await supabaseServer
        .from('services')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      res.json({ services: data || [] });
    } catch (err: any) {
      console.warn('Failed to load services from Supabase:', err?.message || err);
      res.status(500).json({ error: 'Failed to load services', services: [] });
    }
  });

  // GET /api/leads - Retrieve all stored project inquiries
  app.get('/api/leads', (_req, res) => {
    const leads = loadLeads();
    res.json({ leads });
  });

  // POST /api/leads - Store a new project inquiry & trigger autonomous WhatsApp AI qualification
  app.post('/api/leads', async (req, res) => {
    const {
      clientName,
      whatsappPhone,
      companyOrBrand,
      systemCategory,
      projectSummary,
    } = req.body || {};

    if (!clientName || !whatsappPhone || !companyOrBrand || !projectSummary) {
      res.status(400).json({
        error: 'جميع الحقول الأساسية مطلوبة لتسجيل الطلب وتفعيل بوت واتساب.',
      });
      return;
    }

    const botResult = await generateGeminiWhatsAppReply(
      `عميل جديد باسم ${clientName} من "${companyOrBrand}" يطلب مشروع في فئة ${systemCategory}: ${projectSummary}`,
      [],
      systemCategory
    );

    const newLead: StoredLead = {
      id: `tx-lead-${Date.now()}`,
      clientName: String(clientName).trim(),
      whatsappPhone: String(whatsappPhone).trim(),
      companyOrBrand: String(companyOrBrand).trim(),
      systemCategory: systemCategory || 'web-platform',
      projectSummary: String(projectSummary).trim(),
      aiBotQualification: botResult.reply,
      estimatedArchitecture: botResult.recommendedStack,
      createdAt: new Date().toISOString(),
    };

    const leads = loadLeads();
    const updated = [newLead, ...leads];
    saveLeads(updated);

    // Save lead to Supabase PostgreSQL database
    try {
      await supabaseServer.from('orders').upsert({
        id: newLead.id,
        client_name: newLead.clientName,
        phone: newLead.whatsappPhone,
        company_or_brand: newLead.companyOrBrand,
        service_id: newLead.systemCategory,
        service_title: newLead.companyOrBrand,
        details: newLead.projectSummary,
        status: 'new',
        source: 'موقع شركة TEXORA (ابدأ مشروعك)',
        whatsapp_notified: false,
        telegram_notified: false,
      });
      console.log(`[Supabase] Lead ${newLead.id} stored successfully in Supabase orders table.`);
    } catch (dbErr) {
      console.warn('[Supabase Order Sync Warning]:', dbErr);
    }

    // Sync with the autonomous Bot backend (running on port 3001)
    fetch('http://localhost:3001/api/website-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newLead.id,
        name: newLead.clientName,
        phone: newLead.whatsappPhone,
        product: `${newLead.companyOrBrand} [${newLead.systemCategory}]`,
        details: newLead.projectSummary,
        companyOrBrand: newLead.companyOrBrand,
        source: 'موقع شركة TEXORA (ابدأ مشروعك)',
      }),
    }).catch(() => {});

    res.status(201).json({
      lead: newLead,
      leads: updated,
    });
  });

  // POST /api/whatsapp-bot - Interactive Autonomous WhatsApp AI Agent endpoint
  app.post('/api/whatsapp-bot', async (req, res) => {
    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'يرجى كتابة رسالة للتحدث مع بوت TEXORA الذكي.' });
      return;
    }

    const result = await generateGeminiWhatsAppReply(
      message.trim(),
      Array.isArray(history) ? history : []
    );

    res.json({
      reply: result.reply,
      detectedCategory: result.detectedCategory,
      recommendedStack: result.recommendedStack,
      source: result.source,
      timestamp: new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  });

  // Vite middleware in development, static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TEXORA Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
