<div dir="rtl">

<div align="center">

<img src="public/favicon.ico" width="64" height="64" alt="watermark-builder logo" />

# واترمارک‌ساز

**استودیوی حرفه‌ای افزودن واترمارک به تصاویر**

[![Live Demo](https://img.shields.io/badge/🌐_لایو_دمو-alirewa.github.io-6172f3?style=for-the-badge)](https://alirewa.github.io/watermark-builder)
[![GitHub](https://img.shields.io/badge/GitHub-Alirewa%2Fwatermark--builder-181717?style=for-the-badge&logo=github)](https://github.com/Alirewa/watermark-builder)
[![Version](https://img.shields.io/badge/نسخه-1.0.0-22c55e?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](#)

[🇮🇷 فارسی](#-معرفی) • [🇬🇧 English](#-introduction)

</div>

---

## 🇮🇷 معرفی

**واترمارک‌ساز** یک ابزار وب مدرن و رایگان برای افزودن واترمارک به تصاویر است. تمام پردازش‌ها مستقیماً در مرورگر انجام می‌شود — بدون آپلود تصویر به سرور، بدون نیاز به اینترنت پس از بارگذاری اولیه، و بدون هیچ هزینه‌ای.

### ✨ ویژگی‌ها

- 🖼️ **پردازش دسته‌ای** — تا ۱۰۰ تصویر را همزمان بارگذاری و پردازش کنید
- 📐 **۴ قالب جایگذاری** — مثلث، قطری، گوشه‌ها، افقی
- 🎚️ **کنترل کامل** — تنظیم شفافیت و اندازه واترمارک
- 💾 **خروجی ZIP و PDF** — دانلود فوری با کیفیت قابل تنظیم
- 🌙 **حالت تاریک/روشن** — پشتیبانی کامل از تم‌های light/dark/system
- 🌐 **دوزبانه FA/EN** — رابط کاربری کامل به فارسی و انگلیسی با RTL/LTR
- 📱 **رسپانسیو** — طراحی کاملاً سازگار با موبایل، تبلت و دسکتاپ
- 🔒 **حریم خصوصی** — هیچ تصویری به سرور ارسال نمی‌شود

### 🛠️ تکنولوژی‌ها

| لایه | ابزار |
|------|-------|
| فریم‌ورک | Next.js 14 (App Router) |
| زبان | TypeScript |
| استایل | Tailwind CSS v3 |
| کامپوننت | Radix UI + shadcn/ui |
| انیمیشن | Framer Motion |
| وضعیت | Zustand (با persist) |
| پردازش تصویر | HTML5 Canvas API |
| خروجی PDF | pdf-lib |
| خروجی ZIP | JSZip |
| آیکون | Lucide React |

### 🚀 راه‌اندازی محلی

```bash
# کلون کردن مخزن
git clone https://github.com/Alirewa/watermark-builder.git
cd watermark-builder

# نصب وابستگی‌ها
npm install --legacy-peer-deps

# اجرا در حالت توسعه
npm run dev
```

سپس مرورگر را روی [http://localhost:3000](http://localhost:3000) باز کنید.

### 📦 بیلد و دپلوی

```bash
# بیلد استاتیک برای GitHub Pages
NEXT_PUBLIC_BASE_PATH=/watermark-builder npm run build

# بیلد معمولی (برای Vercel / سرور)
npm run build
```

> **دپلوی خودکار:** هر push به شاخه `master` به صورت خودکار از طریق GitHub Actions روی GitHub Pages دپلوی می‌شود.

### 📁 ساختار پروژه

```
src/
├── app/                  # صفحات Next.js App Router
├── components/
│   ├── layout/           # Header، Footer، Sidebar
│   ├── shared/           # کامپوننت‌های مشترک
│   └── ui/               # کامپوننت‌های پایه (shadcn)
├── features/
│   └── watermark/        # منطق اصلی استودیوی واترمارک
├── hooks/                # Custom hooks
├── i18n/                 # ترجمه‌های FA/EN
├── lib/
│   └── watermark/        # موتور پردازش Canvas
├── store/                # Zustand stores
├── types/                # TypeScript types
└── utils/                # توابع کمکی (PDF، ZIP، ...)
```

### 🗺️ نقشه راه

- [ ] پشتیبانی از واترمارک متنی
- [ ] تاریخچه پردازش‌ها
- [ ] تنظیمات پیشرفته‌تر (چرخش، رنگ)
- [ ] پشتیبانی از فرمت WebP در خروجی

### 👤 توسعه‌دهنده

ساخته شده با ❤️ توسط **[@Alirewa](https://github.com/Alirewa)**

---

</div>

---

## 🇬🇧 Introduction

**watermark-builder** is a modern, free, browser-based tool for adding watermarks to images. All processing happens directly in your browser — no image uploads to any server, no internet required after the initial load, and completely free.

### ✨ Features

- 🖼️ **Batch Processing** — Upload and process up to 100 images simultaneously
- 📐 **4 Placement Templates** — Triangle, Diagonal, Corners, Horizontal
- 🎚️ **Full Control** — Adjust watermark opacity and size
- 💾 **ZIP & PDF Export** — Instant download with adjustable quality
- 🌙 **Dark / Light Mode** — Full support for light, dark, and system themes
- 🌐 **Bilingual FA/EN** — Complete Persian and English UI with RTL/LTR support
- 📱 **Fully Responsive** — Works great on mobile, tablet, and desktop
- 🔒 **Privacy First** — Your images never leave your browser

### 🛠️ Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Components | Radix UI + shadcn/ui |
| Animation | Framer Motion |
| State | Zustand (with persist) |
| Image Processing | HTML5 Canvas API |
| PDF Export | pdf-lib |
| ZIP Export | JSZip |
| Icons | Lucide React |

### 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/Alirewa/watermark-builder.git
cd watermark-builder

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 📦 Build & Deploy

```bash
# Static build for GitHub Pages
NEXT_PUBLIC_BASE_PATH=/watermark-builder npm run build

# Standard build (for Vercel / server)
npm run build
```

> **Auto Deploy:** Every push to `master` automatically deploys to GitHub Pages via GitHub Actions.

### 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/
│   ├── layout/           # Header, Footer, Sidebar
│   ├── shared/           # Shared components
│   └── ui/               # Base UI components (shadcn)
├── features/
│   └── watermark/        # Watermark studio core logic
├── hooks/                # Custom hooks
├── i18n/                 # FA/EN translations
├── lib/
│   └── watermark/        # Canvas processing engine
├── store/                # Zustand stores
├── types/                # TypeScript types
└── utils/                # Helpers (PDF, ZIP, ...)
```

### 🗺️ Roadmap

- [ ] Text watermark support
- [ ] Processing history
- [ ] Advanced options (rotation, color tint)
- [ ] WebP output format support

### 👤 Author

Built with ❤️ by **[@Alirewa](https://github.com/Alirewa)**

### 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

⭐ **اگه این پروژه برات مفید بود، یه ستاره بده!** &nbsp;|&nbsp; **If you find this useful, drop a star!** ⭐

</div>
