export interface ServicePillar {
  id: string;
  number: string;
  side: 'right' | 'left';
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  deliverablesAr: string[];
  deliverablesEn: string[];
  metricAr: string;
  metricEn: string;
}

export interface ProjectCaseStudy {
  id: string;
  category: 'pharmacy-retail-erp' | 'edtech-lms' | 'web-platform' | 'digital-marketing';
  categoryLabelAr: string;
  categoryLabelEn: string;
  titleAr: string;
  titleEn: string;
  clientAr: string;
  clientEn: string;
  summaryAr: string;
  summaryEn: string;
  impactMetricAr: string;
  impactMetricEn: string;
  architectureStack: string[];
  featuresAr: string[];
  featuresEn: string[];
  liveDemoPreviewUrl: string;
  accentColor: string;
}

export const LOGO_ASSET_PATH = '/assets/aistudio/IMG-20260827-WA0022_4b96c238.jpg';

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: 'web-platforms',
    number: '01',
    side: 'right',
    titleAr: 'تطوير المواقع والمنصات التفاعلية 3D',
    titleEn: '3D Interactive Websites & Cloud Platforms',
    subtitleAr: 'معمارية ويب فائقة السرعة على Cloudflare Edge',
    subtitleEn: 'Ultra-fast WebGL & Full-Stack Cloud Architecture',
    descriptionAr:
      'نصمم ونبرمج مواقع شركات ومنصات ويب بتجارب بصرية ثلاثية الأبعاد تخطف الأنظار من اللحظة الأولى، مع سرعة تحميل قياسية وأمان مؤسسي متكامل.',
    descriptionEn:
      'We engineer high-converting corporate websites and spatial 3D web experiences hosted on global edge networks with sub-second latency.',
    deliverablesAr: ['واجهات 3D WebGL مخصصة', 'استضافة سحابية Cloudflare Pages', 'ربط قواعد بيانات لحظية'],
    deliverablesEn: ['Custom 3D WebGL Choreography', 'Cloudflare Edge Deployment', 'Real-Time Database Sync'],
    metricAr: 'سرعة استجابة أقل من 45ms عالمياً',
    metricEn: '< 45ms Global Edge Response',
  },
  {
    id: 'digital-marketing',
    number: '02',
    side: 'left',
    titleAr: 'التسويق الإلكتروني ومحركات النمو الذكية',
    titleEn: 'Performance Digital Marketing & Technical SEO',
    subtitleAr: 'استحواذ رقمي مبني على البيانات وأتمتة المبيعات',
    subtitleEn: 'Data-Driven Acquisition & Automated Conversion Funnels',
    descriptionAr:
      'لا نكتفي بالإعلانات؛ نبني منظومة تسويق إلكتروني متكاملة تشمل تصدر نتائج البحث (Technical SEO)، إدارة الحملات الممولة، وتحويل الزوار تلقائياً إلى عملاء عبر واتساب.',
    descriptionEn:
      'Full-funnel growth engineering combining technical SEO analytics, precision ad campaigns, and automated WhatsApp lead conversion.',
    deliverablesAr: ['تحليل وتصدر نتائج البحث SEO', 'حملات إعلانية عالية العائد ROI', 'تتبع التحويلات اللحظي'],
    deliverablesEn: ['Technical SEO & Semrush Audits', 'High-ROI Performance Campaigns', 'Automated Lead Qualification'],
    metricAr: '+210% زيادة في المبيعات المؤهلة خلال 90 يوماً',
    metricEn: '+210% Qualified Pipeline in 90 Days',
  },
  {
    id: 'edtech-platforms',
    number: '03',
    side: 'right',
    titleAr: 'منصات تعليمية ذكية وأنظمة أكاديميات (LMS)',
    titleEn: 'Smart Educational Platforms & Enterprise LMS',
    subtitleAr: 'بيئة تعليمية متكاملة للمؤسسات والأكاديميات الكبرى',
    subtitleEn: 'End-to-End Learning Ecosystems with AI Assessment',
    descriptionAr:
      'نبني منصات تعليمية تتحمل عشرات الآلاف من الطلاب في نفس اللحظة: بث محاضرات مشفر، بنوك أسئلة ذكية، محافظ إلكترونية، وتقارير فورية لأولياء الأمور عبر واتساب.',
    descriptionEn:
      'Scalable learning platforms featuring DRM video streaming, automated exam grading, student wallets, and instant WhatsApp parent reports.',
    deliverablesAr: ['بث فيديو مشفر ضد التحميل', 'اختبارات إلكترونية وتصحيح فوري', 'إشعارات واتساب تلقائية للطلاب'],
    deliverablesEn: ['DRM-Protected Video Streaming', 'Automated Exam Engine', 'WhatsApp Student & Parent Alerts'],
    metricAr: 'قدرة تشغيلية تتجاوز 50,000 طالب متزامن',
    metricEn: '50,000+ Concurrent Active Learners',
  },
  {
    id: 'pharmacy-retail-erp',
    number: '04',
    side: 'left',
    titleAr: 'أنظمة المحلات الكاملة: صيدليات، متاجر، وبراندات',
    titleEn: 'Complete Pharmacy, Retail Store & Brand ERP / POS',
    subtitleAr: 'إدارة فروع، نقاط بيع POS، مخازن، ومتجر مربوط بالواتساب',
    subtitleEn: 'Multi-Branch POS, Expiry Inventory, E-Commerce & WhatsApp Bot',
    descriptionAr:
      'نظام تشغيلي ومحاسبي شامل للصيدليات وسلاسل المتاجر والبراندات: كاشير سريع بالباركود، تنبيهات صلاحية الأدوية والنواقص، جرد لحظي بين الفروع، وبوت واتساب يستقبل الطلبات والروشتات تلقائياً.',
    descriptionEn:
      'Unified ERP & POS tailored for pharmacies, retail chains, and fashion brands: barcode cashier, drug expiry alerts, multi-branch inventory, and autonomous WhatsApp ordering.',
    deliverablesAr: ['نظام كاشير POS يدعم العمل بدون إنترنت', 'إدارة تواريخ الصلاحية والبدائل الدوائية', 'ربط المخزن بالمتجر وبوت واتساب'],
    deliverablesEn: ['Offline-Ready Barcode POS', 'Drug Expiry & Batch Tracking', 'Unified Storefront + WhatsApp Bot'],
    metricAr: 'توفير 65% من وقت الجرد ومضاعفة طلبات التوصيل',
    metricEn: '65% Faster Inventory Audits & 2x Delivery Orders',
  },
];

export const PROJECT_CASE_STUDIES: ProjectCaseStudy[] = [
  {
    id: 'pharmacore-erp',
    category: 'pharmacy-retail-erp',
    categoryLabelAr: 'نظام صيدليات وفروع كامل',
    categoryLabelEn: 'Pharmacy Chain ERP & POS',
    titleAr: 'PharmaCore Cloud — منظومة إدارة سلاسل الصيدليات الذكية',
    titleEn: 'PharmaCore Cloud — Multi-Branch Pharmacy ERP & WhatsApp Rx',
    clientAr: 'سلسلة صيدليات الشفاء المتكاملة (18 فرعاً)',
    clientEn: 'Al-Shifa Pharmacy Group (18 Branches)',
    summaryAr:
      'نظام متكامل يربط نقاط البيع (POS) والمخازن المركزية وتنبيهات الصلاحية مع بوت واتساب ذكي يقرأ طلبات العملاء ويحولها لأقرب فرع للتوصيل الفوري.',
    summaryEn:
      'Complete cloud ERP connecting 18 pharmacy branches with barcode POS, batch expiry tracking, and an autonomous WhatsApp prescription ordering bot.',
    impactMetricAr: '+165% نمو طلبات التوصيل · 0% توقف في نقاط البيع',
    impactMetricEn: '+165% Delivery Orders · 99.99% POS Uptime',
    architectureStack: ['React 19 POS', 'Cloudflare Pages', 'Supabase PostgreSQL', 'Vercel WhatsApp Bot'],
    featuresAr: [
      'شاشة كاشير سريعة تدعم الباركود الدوائي والبدائل العلمية',
      'تنبيهات استباقية للأدوية قريبة انتهاء الصلاحية والنواقص',
      'بوت واتساب يستقبل طلبات العملاء ويحدد أقرب فرع تلقائياً',
      'تقارير أرباح وضرائب وفواتير إلكترونية لحظية لكل فرع',
    ],
    featuresEn: [
      'High-speed barcode POS with active ingredient alternative lookup',
      'Automated batch expiry alerts and inter-branch stock transfers',
      'Autonomous WhatsApp bot routing orders to the nearest branch',
      'Real-time P&L, shift closing, and e-invoicing compliance',
    ],
    liveDemoPreviewUrl: 'https://pharmacore.texora.cloud',
    accentColor: '#2563EB',
  },
  {
    id: 'luxebrand-omni',
    category: 'pharmacy-retail-erp',
    categoryLabelAr: 'نظام متاجر وبراندات',
    categoryLabelEn: 'Retail Brand Omnichannel ERP',
    titleAr: 'LuxeRetail OS — نظام إدارة البراندات والمتاجر المتعددة',
    titleEn: 'LuxeRetail OS — Omnichannel Brand Store & POS Suite',
    clientAr: 'أزياء ومجوهرات فاليرا (6 فروع + متجر إلكتروني)',
    clientEn: 'Valera Fashion & Luxury Retail (6 Flagship Stores)',
    summaryAr:
      'ربط لحظي بين كاشير الفروع الفعلية والموقع الإلكتروني ومبيعات الواتساب والإنستغرام، مع برنامج ولاء عملاء وإدارة مقاسات وألوان ذكية.',
    summaryEn:
      'Real-time synchronization between physical flagship store POS terminals, e-commerce checkout, and automated WhatsApp VIP concierge sales.',
    impactMetricAr: '+190% معدل تكرار الشراء · جرد موحد 100%',
    impactMetricEn: '+190% Repeat Purchase Rate · Unified Stock Sync',
    architectureStack: ['Cloudflare Edge Store', 'Supabase Realtime', 'Vercel Webhook API', 'Stripe & Local Gateways'],
    featuresAr: [
      'مزامنة فورية للمخزون بين الكاشير والمتجر الإلكتروني',
      'مصفوفة مقاسات وألوان وباركود مخصص لكل قطعة',
      'نظام نقاط ولاء وكوبونات ذكية مربوطة برقم واتساب العميل',
      'لوحة تحكم تنفيذية لمراقبة مبيعات كل فرع لحظة بلحظة',
    ],
    featuresEn: [
      'Instant inventory sync across physical POS and online storefront',
      'SKU matrix management for sizes, colors, and custom barcodes',
      'WhatsApp-linked loyalty wallet and automated restock notifications',
      'Executive branch comparison and sales staff commission tracking',
    ],
    liveDemoPreviewUrl: 'https://luxeretail.texora.cloud',
    accentColor: '#0EA5E9',
  },
  {
    id: 'eduverse-lms',
    category: 'edtech-lms',
    categoryLabelAr: 'منصة تعليمية ذكية',
    categoryLabelEn: 'EdTech & LMS Platform',
    titleAr: 'EduVerse Pro — منصة الأكاديميات والمدارس التفاعلية',
    titleEn: 'EduVerse Pro — Interactive Academy & Exam Platform',
    clientAr: 'منصة القمة التعليمية (38,000 طالب نشط)',
    clientEn: 'Al-Qimma Digital Academy (38,000 Active Students)',
    summaryAr:
      'منصة تعليمية سحابية تدعم المحاضرات المسجلة والمباشرة، الاختبارات التكيفية، ومساعد ذكي يجيب عن أسئلة الطلاب ويرسل تقارير الأداء عبر واتساب.',
    summaryEn:
      'Cloud LMS with encrypted video streaming, adaptive question banks, wallet top-up codes, and automated WhatsApp progress reports for parents.',
    impactMetricAr: '38,000 طالب نشط · +94% نسبة إكمال الدورات',
    impactMetricEn: '38,000 Active Learners · 94% Course Completion',
    architectureStack: ['React + TypeScript', 'Cloudflare Stream CDN', 'Supabase Auth & DB', 'Vercel AI Tutor'],
    featuresAr: [
      'حماية الفيديوهات بعلامة مائية ديناميكية برقم هاتف الطالب',
      'بنك أسئلة ذكي يولد اختبارات مخصصة ويصححها فوراً',
      'شحن محفظة الطالب عبر فوري أو البطاقات البنكية أو أكواد السنتر',
      'تقرير أسبوعي تلقائي لولي الأمر على واتساب بدرجات الطالب وحضوره',
    ],
    featuresEn: [
      'Dynamic student watermark & encrypted HLS video streaming',
      'Randomized exam generator with instant grading & explanations',
      'Built-in student e-wallet, center scratch-codes & payment gateways',
      'Automated weekly WhatsApp parent report cards',
    ],
    liveDemoPreviewUrl: 'https://eduverse.texora.cloud',
    accentColor: '#6366F1',
  },
  {
    id: 'growthpulse-seo',
    category: 'digital-marketing',
    categoryLabelAr: 'تسويق إلكتروني ومواقع 3D',
    categoryLabelEn: '3D Web & Growth Engine',
    titleAr: 'GrowthPulse 3D — واجهة عقارية تفاعلية ومحرك استحواذ تسويقي',
    titleEn: 'GrowthPulse 3D — Spatial Real Estate Portal & SEO Engine',
    clientAr: 'شركة أركان للتطوير العقاري والاستثمار',
    clientEn: 'Arkan Developments',
    summaryAr:
      'موقع تفاعلي ثلاثي الأبعاد لاستعراض الوحدات العقارية مع منظومة SEO متقدمة وبوت واتساب يحجز المعاينات العقارية تلقائياً على مدار الساعة.',
    summaryEn:
      'Interactive 3D property showcase paired with technical SEO architecture and an autonomous WhatsApp booking assistant.',
    impactMetricAr: '+310% عملاء محتملون مؤهلون · المركز #1 في جوجل',
    impactMetricEn: '+310% Qualified Leads · #1 Organic Search Rank',
    architectureStack: ['Three.js WebGL', 'Cloudflare Pages', 'Semrush SEO Schema', 'Vercel WhatsApp CRM'],
    featuresAr: [
      'استعراض ثلاثي الأبعاد للمشاريع والوحدات أثناء التمرير',
      'بنية SEO فائقة السرعة متوافقة مع معايير Google Core Web Vitals',
      'ربط مباشر بين إعلانات ميتا/جوجل وبوت واتساب الذكي لتأهيل المشتري',
      'لوحة مبيعات CRM لتوزيع العملاء على فريق المبيعات تلقائياً',
    ],
    featuresEn: [
      'Scroll-driven 3D architectural visualization in the browser',
      '100/100 Core Web Vitals score on Cloudflare Edge',
      'Direct Meta/Google Ads to WhatsApp AI qualification pipeline',
      'Automated CRM lead scoring and calendar booking',
    ],
    liveDemoPreviewUrl: 'https://growthpulse.texora.cloud',
    accentColor: '#10B981',
  },
];

export interface TermsClause {
  id: string;
  number: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
}

export const TERMS_AND_CONDITIONS: TermsClause[] = [
  {
    id: 'ownership-ip',
    number: '01',
    titleAr: 'الملكية الفكرية وحقوق الكود البرمجي (Source Code & IP)',
    titleEn: 'Intellectual Property & Full Source Code Ownership',
    bodyAr:
      'تلتزم شركة TEXORA بنقل الملكية الكاملة للكود المصدري (GitHub Repository)، قواعد البيانات (Supabase)، وحسابات الاستضافة (Cloudflare & Vercel) إلى العميل فور سداد الدفعة الختامية واستلام المشروع نهائياً.',
    bodyEn:
      'Upon final milestone completion, full ownership of custom source code (GitHub), database schemas (Supabase), and edge deployment pipelines (Cloudflare & Vercel) transfers to the client.',
  },
  {
    id: 'data-privacy',
    number: '02',
    titleAr: 'سرية بيانات الصيدليات والمتاجر والمنصات التعليمية',
    titleEn: 'Data Privacy, Pharmacy ERP & Student Records Security',
    bodyAr:
      'تُشفر جميع بيانات المبيعات، المخزون الدوائي، الفواتير، وبيانات الطلاب والمستخدمين باستخدام معايير تشفير TLS 1.3 وAES-256 على خوادم سحابية معزولة مع نسخ احتياطي يومي تلقائي، ولا يحق لأي طرف ثالث الاطلاع عليها.',
    bodyEn:
      'All POS transactions, pharmaceutical inventory records, and student data are encrypted at rest (AES-256) and in transit (TLS 1.3) with automated daily snapshots and strict role-based access control.',
  },
  {
    id: 'whatsapp-automation-sla',
    number: '03',
    titleAr: 'اتفاقية مستوى الخدمة لبوت الواتساب الذكي والاستضافة (SLA 99.9%)',
    titleEn: 'Autonomous WhatsApp Bot & Cloud Uptime SLA (99.9%)',
    bodyAr:
      'يعمل الموقع عبر شبكة Cloudflare العالمية ويعمل البوت الذكي عبر Vercel Serverless مع ضمان جاهزية تشغيلية بنسبة 99.9%. يشمل العقد دعماً فنياً مجانياً وتحديثات أمنية لمدة 6 أشهر من تاريخ الإطلاق الرسمي.',
    bodyEn:
      'Frontend systems deployed on Cloudflare Pages and WhatsApp AI webhooks on Vercel Serverless carry a 99.9% uptime SLA, backed by 6 months of complimentary technical support and maintenance.',
  },
  {
    id: 'milestones-payment',
    number: '04',
    titleAr: 'مراحل التنفيذ، التجربة الفعلية، والدفعات المالية',
    titleEn: 'Delivery Milestones, Staging Preview & Payment Schedule',
    bodyAr:
      'يُنفذ كل مشروع على 3 مراحل واضحة: (1) التصميم والمعمارية ورابط التجربة الحي على GitHub/Staging، (2) ربط قاعدة البيانات وبوت الواتساب واختبار الأداء، (3) الإطلاق النهائي على النطاق الرسمي وتدريب فريق العمل.',
    bodyEn:
      'Projects progress through 3 transparent milestones: (1) Interactive staging preview & architecture sign-off, (2) Database & autonomous WhatsApp bot integration, and (3) Production launch on Cloudflare with staff training.',
  },
];
