import { en } from "./locales/en";
import { tr } from "./locales/tr";
import { ar } from "./locales/ar";
import {
  LANDING_COPY,
  DASHBOARD_COPY,
  ADMIN_COPY,
  AUTH_SHOWCASE_COPY,
} from "./page-copy";

// The shared message tree for next-intl, composed of two layers:
//
// 1. `foundation` — Abdulrahman's original foundation copy: the brand
//    line, language names, his public-home and dashboard-shell strings.
//    Kept verbatim; his components (site navbar, language switcher)
//    read from here.
// 2. The full product dictionary (./locales/*, typed by ./dictionary)
//    plus the page-local copy (./page-copy) for the landing, dashboard,
//    admin and auth-showcase screens.
//
// Where both layers define the same section (`nav`, `auth`), the keys
// are merged with the product dictionary winning on a clash. His brand
// string lives under `brandName` because the dictionary's `brand`
// section (brand-settings strings) already owns that key.
const foundation = {
  en: {
    brand: "Smart Marketing",
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      login: "Sign in",
      register: "Get started",
    },
    language: {
      label: "Language",
      en: "English",
      ar: "Arabic",
      tr: "Turkish",
    },
    home: {
      eyebrow: "Smart marketing for small businesses",
      title: "Help your product reach the right people.",
      description:
        "Create campaigns, publish content, and understand your results with one AI-powered workspace.",
      start: "Get started",
      preview: "Preview dashboard",
      performance: "Performance summary",
      improvement: "Campaign engagement improvement",
      content: "Content",
      publishing: "Publishing",
      analytics: "Analytics",
    },
    dashboard: {
      overview: "Overview",
      products: "Products",
      campaigns: "Campaigns",
      analytics: "Analytics",
      dashboard: "Dashboard",
      welcome: "Welcome back",
      owner: "Business owner",
      demo: "Demo account",
      tipTitle: "Tip of the day",
      tip: "Consistent content builds a stronger brand presence.",
      heroEyebrow: "Start marketing today",
      heroTitle: "Turn your products into high-performing campaigns.",
      heroDescription:
        "Add your products, choose an objective, and let the platform help you prepare content for your audience.",
      createCampaign: "Create campaign",
      stats: {
        posts: "Posts this month",
        reach: "Total reach",
        engagement: "Engagement rate",
        start: "Start your first campaign",
        empty: "No data yet",
        after: "Available after your first post",
      },
      ready: "Your analytics dashboard is ready",
      readyDescription:
        "Campaign results and SWOT insights will appear here after your first post.",
    },
    auth: {
      welcome: "Welcome back",
      signIn: "Sign in",
      signInDescription: "Enter your account details to access your dashboard.",
      email: "Email address",
      password: "Password",
      signInAction: "Sign in",
      signingIn: "Signing in...",
      noAccount: "Don't have an account?",
      createAccount: "Create one",
      register: "Create account",
      registerDescription:
        "Create your workspace and start marketing smarter.",
      businessName: "Business name",
      fullName: "Full name",
      registerAction: "Create account",
      registering: "Creating account...",
      invalid: "Please check your details and try again.",
    },
  },
  ar: {
    brand: "سوق بذكاء",
    nav: {
      home: "الرئيسية",
      dashboard: "لوحة التحكم",
      login: "تسجيل الدخول",
      register: "ابدأ الآن",
    },
    language: { label: "اللغة", en: "الإنجليزية", ar: "العربية", tr: "التركية" },
    home: {
      eyebrow: "التسويق الذكي للشركات الصغيرة",
      title: "خلّي منتجك يوصل للناس الصح.",
      description:
        "منصة واحدة تساعدك على إنشاء حملاتك التسويقية ونشرها وفهم نتائجها باستخدام الذكاء الاصطناعي.",
      start: "ابدأ الآن",
      preview: "معاينة لوحة التحكم",
      performance: "ملخص الأداء",
      improvement: "تحسن في تفاعل الحملات",
      content: "محتوى",
      publishing: "نشر",
      analytics: "تحليل",
    },
    dashboard: {
      overview: "نظرة عامة",
      products: "المنتجات",
      campaigns: "الحملات",
      analytics: "الإحصائيات",
      dashboard: "لوحة التحكم",
      welcome: "مرحباً بك من جديد",
      owner: "صاحب المشروع",
      demo: "حساب تجريبي",
      tipTitle: "نصيحة اليوم",
      tip: "المحتوى المنتظم يبني حضوراً أقوى لعلامتك التجارية.",
      heroEyebrow: "ابدأ تسويقك اليوم",
      heroTitle: "حوّل منتجاتك إلى حملات تسويقية مؤثرة.",
      heroDescription:
        "أضف منتجاتك، اختر هدفك، ودع المنصة تساعدك في إعداد محتوى مناسب لجمهورك.",
      createCampaign: "إنشاء حملة",
      stats: {
        posts: "المنشورات هذا الشهر",
        reach: "الوصول الكلي",
        engagement: "نسبة التفاعل",
        start: "ابدأ أول حملة لك",
        empty: "لا توجد بيانات بعد",
        after: "ستظهر بعد أول منشور",
      },
      ready: "لوحة الإحصائيات جاهزة",
      readyDescription:
        "ستظهر هنا نتائج حملاتك وتحليل SWOT بعد تنفيذ أول منشور.",
    },
    auth: {
      welcome: "مرحباً بعودتك",
      signIn: "تسجيل الدخول",
      signInDescription: "أدخل بيانات حسابك للوصول إلى لوحة التحكم.",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      signInAction: "دخول",
      signingIn: "جارٍ الدخول...",
      noAccount: "لا تملك حساباً؟",
      createAccount: "أنشئ حساباً",
      register: "إنشاء حساب",
      registerDescription: "أنشئ مساحة عملك وابدأ تسويقك بذكاء.",
      businessName: "اسم الشركة",
      fullName: "الاسم الكامل",
      registerAction: "إنشاء الحساب",
      registering: "جارٍ إنشاء الحساب...",
      invalid: "تحقق من بياناتك وحاول مرة أخرى.",
    },
  },
  tr: {
    brand: "Akıllı Pazarlama",
    nav: {
      home: "Ana sayfa",
      dashboard: "Panel",
      login: "Giriş yap",
      register: "Başla",
    },
    language: {
      label: "Dil",
      en: "İngilizce",
      ar: "Arapça",
      tr: "Türkçe",
    },
    home: {
      eyebrow: "Küçük işletmeler için akıllı pazarlama",
      title: "Ürününüz doğru kişilere ulaşsın.",
      description:
        "Yapay zekâ destekli tek bir çalışma alanıyla kampanyalar oluşturun, içerik yayınlayın ve sonuçları anlayın.",
      start: "Başla",
      preview: "Paneli önizle",
      performance: "Performans özeti",
      improvement: "Kampanya etkileşimi artışı",
      content: "İçerik",
      publishing: "Yayınlama",
      analytics: "Analiz",
    },
    dashboard: {
      overview: "Genel bakış",
      products: "Ürünler",
      campaigns: "Kampanyalar",
      analytics: "Analizler",
      dashboard: "Panel",
      welcome: "Tekrar hoş geldiniz",
      owner: "İşletme sahibi",
      demo: "Demo hesap",
      tipTitle: "Günün önerisi",
      tip: "Düzenli içerik markanızın güçlü bir varlık oluşturmasını sağlar.",
      heroEyebrow: "Pazarlamaya bugün başlayın",
      heroTitle: "Ürünlerinizi etkili kampanyalara dönüştürün.",
      heroDescription:
        "Ürünlerinizi ekleyin, hedefinizi seçin ve platformun kitlenize uygun içerik hazırlamasına izin verin.",
      createCampaign: "Kampanya oluştur",
      stats: {
        posts: "Bu ayki gönderiler",
        reach: "Toplam erişim",
        engagement: "Etkileşim oranı",
        start: "İlk kampanyanızı başlatın",
        empty: "Henüz veri yok",
        after: "İlk gönderinizden sonra görünür",
      },
      ready: "Analiz paneliniz hazır",
      readyDescription:
        "İlk gönderinizden sonra kampanya sonuçları ve SWOT içgörüleri burada görünecek.",
    },
    auth: {
      welcome: "Tekrar hoş geldiniz",
      signIn: "Giriş yap",
      signInDescription: "Panelinize erişmek için hesap bilgilerinizi girin.",
      email: "E-posta adresi",
      password: "Şifre",
      signInAction: "Giriş yap",
      signingIn: "Giriş yapılıyor...",
      noAccount: "Hesabınız yok mu?",
      createAccount: "Hesap oluştur",
      register: "Hesap oluştur",
      registerDescription:
        "Çalışma alanınızı oluşturun ve daha akıllı pazarlamaya başlayın.",
      businessName: "İşletme adı",
      fullName: "Ad soyad",
      registerAction: "Hesap oluştur",
      registering: "Hesap oluşturuluyor...",
      invalid: "Bilgilerinizi kontrol edip tekrar deneyin.",
    },
  },
} as const;

export const messages = {
  en: {
    ...en,
    brandName: foundation.en.brand,
    language: foundation.en.language,
    home: foundation.en.home,
    shell: foundation.en.dashboard,
    nav: { ...foundation.en.nav, ...en.nav },
    auth: { ...foundation.en.auth, ...en.auth },
    landing: LANDING_COPY.en,
    dashboardCopy: DASHBOARD_COPY.en,
    adminCopy: ADMIN_COPY.en,
    authShowcase: AUTH_SHOWCASE_COPY.en,
  },
  ar: {
    ...ar,
    brandName: foundation.ar.brand,
    language: foundation.ar.language,
    home: foundation.ar.home,
    shell: foundation.ar.dashboard,
    nav: { ...foundation.ar.nav, ...ar.nav },
    auth: { ...foundation.ar.auth, ...ar.auth },
    landing: LANDING_COPY.ar,
    dashboardCopy: DASHBOARD_COPY.ar,
    adminCopy: ADMIN_COPY.ar,
    authShowcase: AUTH_SHOWCASE_COPY.ar,
  },
  tr: {
    ...tr,
    brandName: foundation.tr.brand,
    language: foundation.tr.language,
    home: foundation.tr.home,
    shell: foundation.tr.dashboard,
    nav: { ...foundation.tr.nav, ...tr.nav },
    auth: { ...foundation.tr.auth, ...tr.auth },
    landing: LANDING_COPY.tr,
    dashboardCopy: DASHBOARD_COPY.tr,
    adminCopy: ADMIN_COPY.tr,
    authShowcase: AUTH_SHOWCASE_COPY.tr,
  },
};

export type Locale = keyof typeof messages;
