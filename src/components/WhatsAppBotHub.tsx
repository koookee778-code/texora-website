import React, { useEffect, useState } from 'react';
import { Bot, Send } from 'lucide-react';

interface WhatsAppBotHubProps {
  lang: 'ar' | 'en';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const WhatsAppBotHub: React.FC<WhatsAppBotHubProps> = ({ lang }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'bot',
      text:
        lang === 'ar'
          ? 'مرحباً بك في TEXORA. أنا المساعد الذكي عبر واتساب (أعمل 24/7 بدون تدخل بشري). كيف يمكنني مساعدة مشروعك اليوم؟'
          : 'Welcome to TEXORA. I am the 24/7 autonomous WhatsApp AI assistant. How can I help your business today?',
      timestamp: lang === 'ar' ? 'الآن' : 'Now',
    },
  ]);

  // Update initial welcome message when language changes if no other messages were sent
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'bot',
        text:
          lang === 'ar'
            ? 'مرحباً بك في TEXORA. أنا المساعد الذكي عبر واتساب (أعمل 24/7 بدون تدخل بشري). كيف يمكنني مساعدة مشروعك اليوم؟'
            : 'Welcome to TEXORA. I am the 24/7 autonomous WhatsApp AI assistant. How can I help your business today?',
        timestamp: lang === 'ar' ? 'الآن' : 'Now',
      },
    ]);
  }, [lang]);

  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const quickPrompts =
    lang === 'ar'
      ? [
          'نظام صيدلية كامل مع كاشير باركود وبوت واتساب',
          'منصة تعليمية لكورسات واختبارات الطلاب',
          'موقع شركة 3D احترافي مع تسويق إلكتروني',
        ]
      : [
          'Pharmacy POS & inventory with WhatsApp orders',
          'Educational LMS platform for students',
          '3D corporate website & growth marketing',
        ];

  const getInstantBotReply = (msg: string) => {
    const lower = msg.toLowerCase();
    if (
      lower.includes('صيدلي') ||
      lower.includes('محل') ||
      lower.includes('متجر') ||
      lower.includes('كاشير') ||
      lower.includes('pharmacy') ||
      lower.includes('retail') ||
      lower.includes('pos')
    ) {
      return lang === 'ar'
        ? 'نظام PharmaCore المتكامل يشمل الكاشير السريع بالباركود، تنبيهات الصلاحية، الفاتورة الإلكترونية، وبوت واتساب يستقبل الطلبات والروشتات تلقائياً 24/7. التنفيذ خلال 10–18 يوماً.'
        : 'PharmaCore ERP includes fast barcode POS, expiry tracking, e-invoicing, and an autonomous WhatsApp bot capturing orders 24/7. Rollout in 10–18 days.';
    }
    if (
      lower.includes('تعليم') ||
      lower.includes('منصة') ||
      lower.includes('طلاب') ||
      lower.includes('كورسات') ||
      lower.includes('lms') ||
      lower.includes('academy') ||
      lower.includes('student')
    ) {
      return lang === 'ar'
        ? 'منصة EduVerse التعليمية توفر بث فيديو مشفر ضد التحميل، بنوك أسئلة وتصحيح آلي، وبوت واتساب يرسل تقارير الحضور والدرجات لأولياء الأمور تلقائياً.'
        : 'EduVerse LMS features encrypted video streaming, question banks with auto-grading, and automated WhatsApp parent report cards.';
    }
    return lang === 'ar'
      ? 'نصمم مواقع تفاعلية ثلاثية الأبعاد بأعلى سرعة وأمان، مع منظومة تسويق إلكتروني (SEO) وربط تلقائي ببوت واتساب لتحويل الزوار إلى عملاء.'
      : 'We build interactive 3D web platforms with sub-second speeds, technical SEO growth systems, and WhatsApp automation to convert visitors into clients.';
  };

  const sendMessageToBot = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || sending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInputText('');
    setSending(true);

    const instantReply = getInstantBotReply(trimmed);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 1400);

    try {
      const res = await fetch('/api/whatsapp-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
        signal: controller.signal,
      });
      window.clearTimeout(timer);
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: data.reply || instantReply,
        timestamp: data.timestamp || (lang === 'ar' ? 'الآن' : 'Now'),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      window.clearTimeout(timer);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-fallback-${Date.now()}`,
          role: 'bot',
          text: instantReply,
          timestamp: lang === 'ar' ? 'الآن' : 'Now',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const specs = [
    {
      num: '01',
      titleAr: 'ردود ومبيعات تلقائية 24/7',
      titleEn: '24/7 Autonomous Customer Replies',
      descAr: 'يستقبل استفسارات العملاء وطلبات الصيدليات والمتاجر والطلاب فوراً بدون تدخل بشري.',
      descEn: 'Handles inquiries and captures orders automatically around the clock.',
    },
    {
      num: '02',
      titleAr: 'متصل مباشرة بالكاشير وقاعدة البيانات',
      titleEn: 'Synced with POS & Central Database',
      descAr: 'كل طلب عبر واتساب يُسجل لحظياً في لوحة تحكم النظام ويوجه لأقرب فرع.',
      descEn: 'Every WhatsApp order syncs in real time with your inventory and branches.',
    },
    {
      num: '03',
      titleAr: 'استضافة سحابية فائقة الاستقرار',
      titleEn: '99.99% Multi-Cloud Reliability',
      descAr: 'يعمل عبر بنية سحابية مستقلة تضمن سرعة الاستجابة وعدم توقف الخدمة.',
      descEn: 'Engineered on distributed edge infrastructure for zero-downtime operation.',
    },
  ];

  return (
    <section
      id="whatsapp-bot"
      aria-labelledby="whatsapp-bot-heading"
      className="relative z-30 py-32 px-4 sm:px-8 bg-[#050507] border-t border-white/[0.07]"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Editorial Specification Column (5 cols) */}
        <div className="lg:col-span-5">
          <p
            className={`text-xs uppercase mb-3 ${
              lang === 'ar'
                ? 'font-medium text-[#8A8F98] tracking-normal'
                : 'font-mono tracking-widest text-[#8A8F98]'
            }`}
          >
            {lang === 'ar' ? '02 / الأتمتة الذكية' : '02 / AUTONOMOUS AI'}
          </p>
          <h2
            id="whatsapp-bot-heading"
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight"
            style={{ textWrap: 'balance' }}
          >
            {lang === 'ar'
              ? 'بوت واتساب ذكي يدير مبيعاتك تلقائياً'
              : 'Autonomous WhatsApp AI Built Into Your System'}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8A8F98] leading-relaxed">
            {lang === 'ar'
              ? 'نربط موقعك أو نظامك المحاسبي ببوت واتساب ذكي يعمل تلقائياً لخدمة العملاء واستقبال الطلبات على مدار الساعة.'
              : 'Seamlessly bridging your web platform, POS inventory, and WhatsApp customer channel.'}
          </p>

          {/* Clean Hairline Specification List (No bulky nested boxes) */}
          <div className="mt-8 divide-y divide-white/[0.07] border-t border-b border-white/[0.07]">
            {specs.map((s) => (
              <div key={s.num} className="py-5 flex items-start gap-4">
                <span className="text-xs font-mono text-[#8A8F98] mt-1">{s.num}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {lang === 'ar' ? s.titleAr : s.titleEn}
                  </h3>
                  <p className="mt-1 text-xs text-[#8A8F98] leading-relaxed">
                    {lang === 'ar' ? s.descAr : s.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Minimalist Interactive Product Surface (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0A0B0F] border border-white/[0.08] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/[0.07]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {lang === 'ar' ? 'مساعد TEXORA الذكي' : 'TEXORA AI Assistant'}
                </h3>
                <p className="text-xs text-[#8A8F98]">
                  {lang === 'ar' ? 'تجربة حية للرد التلقائي' : 'Live interactive preview'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400">● 24/7 Active</span>
          </div>

          {/* Quick Scenario Prompts */}
          <div className="mt-4 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessageToBot(prompt)}
                disabled={sending}
                className="px-3 py-1.5 text-xs text-neutral-300 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] rounded-lg transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Clean Conversation Stream */}
          <div
            data-testid="whatsapp-chat-log"
            className="mt-5 h-64 overflow-y-auto space-y-3 p-4 rounded-xl bg-[#050507] border border-white/[0.06]"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-white text-[#050507] font-medium'
                      : 'bg-[#0F1117] text-neutral-200 border border-white/[0.07]'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="mt-1 text-[11px] text-[#8A8F98] px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}
          </div>

          {/* Minimal Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessageToBot(inputText);
            }}
            className="mt-4 flex items-center gap-2"
          >
            <label htmlFor="whatsapp-bot-input" className="sr-only">
              {lang === 'ar' ? 'اكتب رسالتك' : 'Message'}
            </label>
            <input
              id="whatsapp-bot-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'اكتب سؤالك هنا...'
                  : 'Ask about our systems...'
              }
              className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-[#050507] border border-white/[0.08] text-white placeholder:text-[#8A8F98] focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#050507] bg-white hover:bg-neutral-200 disabled:opacity-40 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إرسال' : 'Send'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
