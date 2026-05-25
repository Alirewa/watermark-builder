// Developed by @Alirewa — https://github.com/Alirewa

export type Lang = 'fa' | 'en';

export interface Translations {
  dir: 'rtl' | 'ltr';
  lang: Lang;

  /* ── Navigation ──────────────────────────────────────── */
  nav: {
    dashboard: string;
    watermark: string;
    settings: string;
  };

  /* ── Header ──────────────────────────────────────────── */
  header: {
    brand: string;
    collapseMenu: string;
    expandMenu: string;
    switchLang: string;
  };

  /* ── Footer ──────────────────────────────────────────── */
  footer: {
    version: string;
    developedBy: string;
  };

  /* ── Home page ───────────────────────────────────────── */
  home: {
    appName: string;
    subtitle: string;
    startBtn: string;
    continueBtn: string; // e.g. "Continue (3 images)"
    tip: string;
    features: [
      { title: string; desc: string },
      { title: string; desc: string },
      { title: string; desc: string },
      { title: string; desc: string },
    ];
  };

  /* ── Watermark page ──────────────────────────────────── */
  watermarkPage: {
    title: string;
    subtitle: string;
    badge: string;
  };

  /* ── Studio ──────────────────────────────────────────── */
  studio: {
    /* Image drop zone */
    dropImages: string;
    dropImagesHint: string;
    dropImagesCaption: string;
    addMore: string;
    addMoreHint: string;
    selectBtn: string;

    /* Image grid */
    selectedImages: string;
    clearAll: string;

    /* Progress */
    processingLabel: string;

    /* Logo card */
    logoTitle: string;
    logoRequired: string;
    logoUploaded: string;
    logoDrop: string;
    logoDropFormats: string;

    /* Template card */
    templateTitle: string;
    opacityLabel: string;
    sizeLabel: string;
    sizeSmall: string;
    sizeMedium: string;
    sizeLarge: string;
    templates: {
      triangle: string;
      diagonal: string;
      corners: string;
      horizontal: string;
    };

    /* File naming card */
    fileNameTitle: string;
    fileNamePlaceholder: string;
    fileNamePreview: string; // "Example: {name}_001.jpg, …"
    fileNameDefault: string;

    /* Export card */
    exportTitle: string;
    previewBtn: string;
    previewBtnHint: string; // "(first N images)"
    previewLoading: string;
    downloadZip: string;
    downloadPdf: string;
    qualityLabel: string;
    processingZip: string;
    processingPdf: string;

    /* Hints (when can't process) */
    hintBoth: string;
    hintNeedLogo: string;
    hintNeedImages: string;

    /* Bottom note */
    noteOriginalSize: string;

    /* Toasts */
    toastImagesAdded: string;
    toastDoneTitle: string;
    toastDoneDesc: string;
    toastErrorTitle: string;
    toastErrorDesc: string;
    toastPreviewError: string;
    toastInvalidFormat: string;
    toastInvalidFormatDesc: string;
    toastInvalidLogo: string;
    toastInvalidLogoDesc: string;
  };
}

/* ═══════════════════════ PERSIAN ══════════════════════════ */
export const fa: Translations = {
  dir: 'rtl',
  lang: 'fa',

  nav: {
    dashboard: 'داشبورد',
    watermark: 'واترمارک',
    settings: 'تنظیمات',
  },

  header: {
    brand: 'واترمارک‌ساز',
    collapseMenu: 'جمع کردن نوار کناری',
    expandMenu: 'باز کردن نوار کناری',
    switchLang: 'English',
  },

  footer: {
    version: 'نسخه ۱.۰.۰',
    developedBy: 'Developed by @Alirewa',
  },

  home: {
    appName: 'واترمارکر',
    subtitle: 'استودیوی حرفه‌ای افزودن واترمارک به تصاویر با پراکندگی هوشمند و خروجی با کیفیت بالا',
    startBtn: 'شروع کنید',
    continueBtn: 'ادامه کار',
    tip: 'می‌توانید تا ۱۰۰ تصویر را به صورت همزمان بارگذاری کرده و با یک کلیک خروجی ZIP دریافت کنید.',
    features: [
      { title: 'تا ۱۰۰ تصویر همزمان', desc: 'بارگذاری دسته‌ای تصاویر و پردازش موازی' },
      { title: 'پراکندگی هوشمند', desc: 'قرارگیری تصادفی و طبیعی واترمارک‌ها' },
      { title: 'ابعاد اصلی محفوظ', desc: 'هیچ تصویری فشرده یا تغییر اندازه نمی‌شود' },
      { title: 'خروجی ZIP و PDF', desc: 'دانلود سریع با فشرده‌سازی بهینه' },
    ],
  },

  watermarkPage: {
    title: 'استودیوی واترمارک',
    subtitle: 'تصاویر و لوگوی خود را بارگذاری کنید — واترمارک‌ها به صورت هوشمند روی تمام تصاویر پراکنده می‌شوند',
    badge: 'پراکندگی هوشمند',
  },

  studio: {
    dropImages: 'تصاویر خود را اینجا بکشید',
    dropImagesHint: 'یا کلیک کنید برای انتخاب فایل',
    dropImagesCaption: 'تا ۱۰۰ تصویر همزمان',
    addMore: 'تصویر بیشتری اضافه کنید',
    addMoreHint: 'JPG · PNG · WebP — تا ۱۰۰ تصویر همزمان',
    selectBtn: 'انتخاب تصاویر',

    selectedImages: 'تصاویر انتخاب‌شده',
    clearAll: 'پاک کردن همه',

    processingLabel: 'در حال پردازش...',

    logoTitle: 'لوگوی واترمارک',
    logoRequired: 'ضروری',
    logoUploaded: 'بارگذاری شد',
    logoDrop: 'لوگوی واترمارک',
    logoDropFormats: 'PNG · SVG · JPG',

    templateTitle: 'جایگاه واترمارک',
    opacityLabel: 'شفافیت واترمارک',
    sizeLabel: 'اندازه واترمارک',
    sizeSmall: 'کوچک',
    sizeMedium: 'متوسط',
    sizeLarge: 'بزرگ',
    templates: {
      triangle: 'مثلث',
      diagonal: 'قطری',
      corners: 'گوشه‌ها',
      horizontal: 'افقی',
    },

    fileNameTitle: 'نام فایل خروجی',
    fileNamePlaceholder: 'مثال: product یا عکس-محصول',
    fileNamePreview: 'مثال',
    fileNameDefault: 'اگر خالی باشد، نام اصلی فایل‌ها حفظ می‌شود',

    exportTitle: 'خروجی',
    previewBtn: 'پیش‌نمایش',
    previewBtnHint: 'تصویر اول',
    previewLoading: 'بارگذاری پیش‌نمایش...',
    downloadZip: 'دانلود ZIP',
    downloadPdf: 'دانلود PDF',
    qualityLabel: 'کیفیت خروجی',
    processingZip: 'در حال پردازش...',
    processingPdf: 'در حال آماده‌سازی PDF...',

    hintBoth: 'ابتدا تصاویر و لوگوی واترمارک را بارگذاری کنید',
    hintNeedLogo: 'برای شروع، لوگوی واترمارک را بارگذاری کنید',
    hintNeedImages: 'تصاویر خود را برای افزودن واترمارک بارگذاری کنید',

    noteOriginalSize: 'ابعاد اصلی تصاویر حفظ می‌شود · هر تصویر یک صفحه‌ PDF',

    toastImagesAdded: 'تصویر اضافه شد',
    toastDoneTitle: 'خروجی آماده شد',
    toastDoneDesc: 'تصویر با واترمارک پردازش شدند',
    toastErrorTitle: 'خطا در پردازش',
    toastErrorDesc: 'لطفاً دوباره تلاش کنید',
    toastPreviewError: 'خطا در پیش‌نمایش',
    toastInvalidFormat: 'فرمت نامعتبر',
    toastInvalidFormatDesc: 'فقط JPG، PNG و WebP پشتیبانی می‌شوند',
    toastInvalidLogo: 'فرمت نامعتبر',
    toastInvalidLogoDesc: 'PNG، SVG یا JPG مجاز است',
  },
};

/* ═══════════════════════ ENGLISH ══════════════════════════ */
export const en: Translations = {
  dir: 'ltr',
  lang: 'en',

  nav: {
    dashboard: 'Dashboard',
    watermark: 'Watermark',
    settings: 'Settings',
  },

  header: {
    brand: 'Watermarker',
    collapseMenu: 'Collapse sidebar',
    expandMenu: 'Expand sidebar',
    switchLang: 'فارسی',
  },

  footer: {
    version: 'v1.0.0',
    developedBy: 'Developed by @Alirewa',
  },

  home: {
    appName: 'Watermarker',
    subtitle: 'Professional watermark studio — intelligent scatter placement with high-quality output',
    startBtn: 'Get Started',
    continueBtn: 'Continue',
    tip: 'You can upload up to 100 images at once and download a ZIP file with a single click.',
    features: [
      { title: 'Up to 100 images at once', desc: 'Batch upload and parallel processing' },
      { title: 'Smart scatter placement', desc: 'Natural, randomized watermark positioning' },
      { title: 'Original dimensions kept', desc: 'No compression or resizing ever applied' },
      { title: 'ZIP & PDF export', desc: 'Fast download with optimal compression' },
    ],
  },

  watermarkPage: {
    title: 'Watermark Studio',
    subtitle: 'Upload your images and logo — watermarks are intelligently scattered across all images',
    badge: 'Smart Scatter',
  },

  studio: {
    dropImages: 'Drag your images here',
    dropImagesHint: 'or click to browse files',
    dropImagesCaption: 'Up to 100 images at once',
    addMore: 'Add more images',
    addMoreHint: 'JPG · PNG · WebP — up to 100 images',
    selectBtn: 'Select Images',

    selectedImages: 'Selected Images',
    clearAll: 'Clear all',

    processingLabel: 'Processing…',

    logoTitle: 'Watermark Logo',
    logoRequired: 'Required',
    logoUploaded: 'Uploaded',
    logoDrop: 'Watermark Logo',
    logoDropFormats: 'PNG · SVG · JPG',

    templateTitle: 'Watermark Position',
    opacityLabel: 'Watermark Opacity',
    sizeLabel: 'Watermark Size',
    sizeSmall: 'Small',
    sizeMedium: 'Medium',
    sizeLarge: 'Large',
    templates: {
      triangle: 'Triangle',
      diagonal: 'Diagonal',
      corners: 'Corners',
      horizontal: 'Horizontal',
    },

    fileNameTitle: 'Output Filename',
    fileNamePlaceholder: 'e.g. product or my-photo',
    fileNamePreview: 'Example',
    fileNameDefault: 'If empty, original filenames are preserved',

    exportTitle: 'Export',
    previewBtn: 'Preview',
    previewBtnHint: 'first image',
    previewLoading: 'Loading preview…',
    downloadZip: 'Download ZIP',
    downloadPdf: 'Download PDF',
    qualityLabel: 'Output Quality',
    processingZip: 'Processing…',
    processingPdf: 'Preparing PDF…',

    hintBoth: 'Upload images and a watermark logo to get started',
    hintNeedLogo: 'Please upload a watermark logo to continue',
    hintNeedImages: 'Upload your images to add watermarks',

    noteOriginalSize: 'Original dimensions preserved · One PDF page per image',

    toastImagesAdded: 'images added',
    toastDoneTitle: 'Export ready',
    toastDoneDesc: 'images processed with watermark',
    toastErrorTitle: 'Processing error',
    toastErrorDesc: 'Please try again',
    toastPreviewError: 'Preview failed',
    toastInvalidFormat: 'Invalid format',
    toastInvalidFormatDesc: 'Only JPG, PNG and WebP are supported',
    toastInvalidLogo: 'Invalid format',
    toastInvalidLogoDesc: 'PNG, SVG or JPG required',
  },
};

export const translations: Record<Lang, Translations> = { fa, en };
