# Summit Garage Doors — сайт

Маркетинговий сайт для бізнесу зі встановлення та ремонту гаражних воріт.
Next.js (App Router) + Tailwind CSS 4. Деплоїться на Vercel **без окремого бекенду і бази даних**.

## Як це працює

- **Контент** лежить у файлах `content/*.json` (назва бізнесу, телефон, послуги, відгуки, FAQ, галерея, сторінка "About"). Сайт статично генерується з цих файлів при кожному деплої.
- **Адмінка** — `https://твій-домен.com/admin`. Це [Sveltia CMS](https://github.com/sveltia/sveltia-cms) (git-based). Тато логіниться через GitHub, редагує контент у зручному інтерфейсі, натискає Save → зміни комітяться в репозиторій → Vercel автоматично передеплоює сайт (~1–2 хв).
- **Форма заявок** (`/contact`) надсилає лист на пошту через [Resend](https://resend.com) (serverless-функція, безкоштовно до 100 листів/день).
- **SEO**: метадані на кожній сторінці, `sitemap.xml`, `robots.txt`, JSON-LD (LocalBusiness + Service), OpenGraph-картинка генерується автоматично.

## Локальний запуск

```bash
npm install
npm run dev        # http://localhost:3000
```

## Деплой на Vercel — покроково

### 1. Репозиторій

```bash
git remote add origin https://github.com/ТВІЙ_ЮЗЕРНЕЙМ/garage-door-site.git
git push -u origin main
```

### 2. Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → імпортуй репозиторій.
2. Нічого не змінюй у налаштуваннях білду (Next.js визначиться сам) → **Deploy**.
3. Підключи домен: Project → Settings → Domains.

### 3. Форма заявок (Resend)

1. Зареєструйся на [resend.com](https://resend.com) → створи API key.
2. У Vercel: Project → Settings → Environment Variables, додай:
   - `RESEND_API_KEY` — ключ із Resend
   - `QUOTE_EMAIL_TO` — пошта тата, куди приходять заявки
   - `QUOTE_EMAIL_FROM` — залиш `Website <onboarding@resend.dev>`, поки не верифікуєш свій домен у Resend
3. Redeploy.

### 4. Адмінка (/admin)

1. GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App:
   - Homepage URL: `https://твій-домен.com`
   - Authorization callback URL: `https://твій-домен.com/api/callback`
2. Скопіюй Client ID, згенеруй Client Secret.
3. У Vercel додай environment variables:
   - `OAUTH_GITHUB_CLIENT_ID`
   - `OAUTH_GITHUB_CLIENT_SECRET`
4. У файлі `public/admin/config.yml` заміни:
   - `repo: OWNER/REPO` → свій репозиторій (напр. `mario/garage-door-site`)
   - `base_url: https://YOUR-DOMAIN.com` → свій домен
5. Закоміть, запуш → зайди на `/admin`, залогінься через GitHub.

> Тато має бути колаборатором репозиторію (Repo → Settings → Collaborators), щоб його GitHub-акаунт міг зберігати зміни.

### 5. Заміни плейсхолдери

Все редагується через `/admin` (або напряму у `content/*.json`):

- назва бізнесу, телефон, email, адреса, міста обслуговування — **Site Settings**
- послуги і ціни — **Services**
- відгуки — **Reviews**
- фото робіт — **Gallery** (завантажуй реальні фото; вони зберігаються у `public/uploads/`)
- `content/settings.json → seo.siteUrl` — постав реальний домен (важливо для sitemap і OG)

Картинки-заглушки (`public/images/*.svg`) згенеровані автоматично — заміни їх реальними фото воріт, коли будуть.

## SEO-чекліст після запуску

- [ ] Google Business Profile — найважливіше для локального бізнесу в США
- [ ] Google Search Console → додай домен → надішли `https://домен/sitemap.xml`
- [ ] Справжні фото робіт замість заглушок (Google любить унікальні фото)
- [ ] Реальні відгуки з Google з іменами міст
- [ ] Оновити `googleRating` / `reviewCount` у Site Settings реальними цифрами (не вигаданими!)

## Структура

```
content/            ← весь контент (редагується адмінкою)
public/admin/       ← Sveltia CMS (адмінка)
public/images/      ← згенеровані картинки-заглушки
public/uploads/     ← фото, завантажені через адмінку
src/app/            ← сторінки (App Router)
src/app/api/quote   ← serverless: форма заявок → email
src/app/api/auth    ← serverless: GitHub OAuth для адмінки
src/components/     ← UI-компоненти
src/lib/content.ts  ← типізовані лоадери контенту
```
