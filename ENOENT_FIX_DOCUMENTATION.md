# ENOENT Error Fix - Dokumentacija

## 📋 Pregled Problema

### Glavni Problem
Lokalni Next.js dev server je pucao sa **ENOENT (Error NO ENTry)** greškom na sintetičkoj webpack putanji:
```
Error: ENOENT: no such file or directory, read
./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/...
```

### Uzrok
1. **Next.js 14.2.35 je EOL (End of Life)** - bug se vraća u webpack dev server-u
2. **Webpack/css-loader** pokušava da pročita sintetičku loader putanju kao stvarni fajl
3. **Tailwind CSS** je skenirao sve TypeScript fajlove u `src/` folderu, uključujući utility fajlove (`src/lib/llms.ts`) što je uzrokovalo dodatne ENOENT greške

---

## 🔧 Rešenja koja su primenjena

### 1. Node.js 20 Verifikacija
**Problem**: Terminal je koristio Node v18.17.0 umesto v20.x koji projekat zahteva.

**Rešenje**:
```bash
nvm use 20
nvm alias default 20
```

**Napomena**: Uvek proveriti `node -v` pre pokretanja `npm run dev` u istom terminalu.

**Automatsko rešenje**: Kreiran `.nvmrc` fajl sa `20` - terminal će automatski koristiti Node 20 kada se uđe u folder.

---

### 2. Turbopack Workaround
**Problem**: Webpack dev server puca sa ENOENT greškom na sintetičkoj putanji.

**Rešenje**: Dodat `--turbo` flag u dev skriptu.

**Promena u `package.json`**:
```json
{
  "scripts": {
    "dev": "next dev --turbo"  // Dodat --turbo flag
  }
}
```

**Zašto Turbopack?**
- Turbopack (Next.js bundler) ne koristi iste sintetičke putanje kao webpack
- Izbegava ENOENT grešku na `globals.css.webpack[...]` putanji
- Prihvatljiv workaround za lokalni dev (Next.js ga preporučuje)

**Ograničenja Turbopack-a**:
- ✅ Lokalni dev radi stabilno
- ⚠️ Production build (`npm run build`) i dalje koristi webpack (nije problem)
- ⚠️ Neki PostCSS plugin-i mogu imati problema sa relativnim putanjama u Turbopack-u

---

### 3. Tailwind CSS Content Konfiguracija
**Problem**: Tailwind je skenirao sve TypeScript fajlove u `src/` folderu, uključujući:
- `src/lib/llms.ts` i druge utility fajlove
- Ovo je uzrokovalo ETIMEDOUT greške jer Tailwind pokušava da čita fajlove koji nisu potrebni za CSS generisanje

**Rešenje**: Ograničena Tailwind `content` konfiguracija na specifične foldere.

**Promena u `tailwind.config.ts`**:
```typescript
content: [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './src/app/**/*.{ts,tsx}',        // Samo app folder
  './src/components/**/*.{ts,tsx}', // Samo components folder
  './src/contexts/**/*.{ts,tsx}',    // Samo contexts folder
  './src/hooks/**/*.{ts,tsx}',       // Samo hooks folder
  // Ekskludiran lib/ folder (utility fajlovi nisu potrebni za Tailwind)
],
```

**Prethodno (problematično)**:
```typescript
content: [
  './src/**/*.{ts,tsx}',  // Skenirao SVE u src/, uključujući lib/
],
```

---

## 📝 Finalne Promene

### Fajlovi koji su promenjeni:
1. **`package.json`**
   - Dev skripta: `"dev": "next dev --turbo"`

2. **`tailwind.config.ts`**
   - Ograničena `content` konfiguracija (ekskludiran `lib/` folder)

3. **`postcss.config.js`**
   - Vraćen na originalni format (bez custom plugina)

4. **`.nvmrc`** (novi fajl)
   - Automatsko postavljanje Node 20 verzije

### Backup fajlovi kreirani:
- `package.json.pre-enoent-local.bak`
- `package-lock.json.pre-enoent-local.bak`
- `next.config.js.pre-enoent-local.bak`
- `src/app/globals.css.pre-enoent-local.bak`
- `postcss.config.js.bak`
- `tailwind.config.bak`

### Utility fajlovi (mogu se obrisati):
- `postcss-fix-from.js` - PostCSS plugin (nije korišćen u finalnom rešenju)
- `scripts/trace-enoent.cjs` - FS tracer za debugging (može ostati za buduće debugovanje)

---

## 🚀 Kako Pokrenuti Server

### Obavezni koraci:
```bash
# 1. Ući u projekat folder
cd /Users/ognjendrinic/Desktop/odontoa-website

# 2. Node 20 će se automatski postaviti (ako imate .nvmrc i auto-switch u shell-u)
# Ili ručno:
nvm use 20

# 3. Proveriti Node verziju
node -v  # Treba da pokaže v20.x.x

# 4. Pokrenuti dev server
npm run dev
```

### Server će biti dostupan na:
**http://localhost:3000**

---

## ⚠️ Da li Turbopack Otežava Nešto?

### ✅ Prednosti:
- **Rešava ENOENT grešku** - glavni problem je rešen
- **Brži dev server** - Turbopack je brži od webpack-a za lokalni dev
- **Next.js preporuka** - Vercel preporučuje Turbopack za novije projekte

### ⚠️ Potencijalni problemi:
1. **PostCSS plugin-i**: Neki custom PostCSS plugin-i mogu imati problema sa relativnim putanjama
   - **Rešenje**: Koristiti string putanje umesto `require()` za plugin-e

2. **Production build**: I dalje koristi webpack (nije problem)
   - `npm run build` - koristi webpack (normalno)
   - `npm start` - production server (normalno)

3. **Debugging**: Turbopack stack trace-ovi mogu biti drugačiji od webpack-a
   - **Rešenje**: Koristiti `scripts/trace-enoent.cjs` za debugging ako se pojavi problem

### 📊 Testiranje:
- ✅ Lokalni dev: **Radi sa Turbopack-om**
- ⚠️ Production build: **Nije testiran** (treba testirati sa `npm run build`)

---

## 🔍 Ako se Problem Vrati

### 1. Proveriti Node verziju
```bash
node -v  # Mora biti v20.x.x
which node  # Mora pokazati nvm/versions/node/v20.x.x
```

### 2. Očistiti cache
```bash
rm -rf .next node_modules/.cache
npm run dev
```

### 3. Ako i dalje puca
- Proveriti da li je `--turbo` flag u `package.json` dev skripti
- Proveriti Tailwind `content` konfiguraciju (ne sme uključivati `lib/` folder)
- Pokrenuti sa tracer-om: `NODE_OPTIONS="--require ./scripts/trace-enoent.cjs" npm run dev`

### 4. Ako ništa ne pomaže
- Upgrade na Next.js 15 LTS (Next 14 je EOL)
- Ili koristiti webpack dev sa custom PostCSS plugin-om (komplikovanije)

---

## 📚 Reference

- **Next.js 14 EOL**: https://nextjs.org/docs/app/api-reference/next-config-js
- **Turbopack**: https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
- **Tailwind Content**: https://tailwindcss.com/docs/content-configuration

---

## ✅ Finalni Status

- ✅ **Lokalni dev radi** sa Turbopack-om
- ✅ **ENOENT greška rešena**
- ✅ **ETIMEDOUT greška rešena** (Tailwind content fix)
- ✅ **Node 20 automatski postavljen** (.nvmrc fajl)
- ⚠️ **Production build nije testiran** (preporuka: testirati pre deploy-a)

---

**Datum rešavanja**: 18. januar 2025  
**Next.js verzija**: 14.2.35  
**Node verzija**: 20.20.0 (zahteva se, automatski postavljen preko .nvmrc)
