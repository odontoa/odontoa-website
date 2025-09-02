# Font Consistency - Sažetak promena

## ✅ Popravljene stranice

### 1. Kontakt stranica (`src/app/kontakt/page.tsx`)
- **Pre:** `text-black` → **Posle:** `text-foreground`
- Sada koristi iste fontove kao homepage

### 2. Blog stranica (`src/app/blog/page.tsx`)
- **Pre:** `font-bold` → **Posle:** `font-normal`
- **Pre:** `text-gray-900` → **Posle:** `text-foreground`
- **Pre:** `text-gray-800` → **Posle:** `text-foreground`
- Popravljeni svi naslovi i tekstovi

### 3. Rečnik stranica (`src/app/recnik/page.tsx`)
- **Pre:** `font-bold` → **Posle:** `font-normal`
- **Pre:** `text-gray-900` → **Posle:** `text-foreground`
- Popravljeni naslovi u sekcijama

### 4. Blog slug stranica (`src/app/blog/[slug]/page.tsx`)
- **Pre:** `font-bold text-gray-800` → **Posle:** `font-normal text-foreground`
- Popravljen error message

### 5. Blogovi stranica (`src/app/blogovi/page.tsx`)
- **Pre:** `font-bold text-gray-900` → **Posle:** `font-normal text-foreground`
- Popravljen glavni naslov

## ✅ Već konzistentne stranice

### 1. O nama stranica (`src/app/o-nama/page.tsx`)
- ✅ Koristi `font-normal`
- ✅ Koristi `text-foreground`
- ✅ Nema hardkodirane boje

### 2. Homepage (`src/app/page.tsx`)
- ✅ Koristi `font-normal`
- ✅ Koristi `text-foreground`
- ✅ Konzistentan sa dizajn sistemom

## 📋 Pravila za budućnost

### OBAVEZNO koristiti:
```tsx
// Font težina
className="font-normal"

// Boje teksta
className="text-foreground"        // Glavni tekst
className="text-muted-foreground"  // Sekundarni tekst
className="text-primary"           // Akcent boja
```

### NIKAD ne koristiti:
```tsx
// Font težine
className="font-bold"
className="font-semibold"
className="font-medium"

// Hardkodirane boje
className="text-black"
className="text-gray-900"
className="text-gray-800"
className="text-blue-600"
```

## 📏 Standardne veličine

### Glavni naslovi (H1)
```tsx
className="text-4xl md:text-6xl font-normal text-foreground"
```

### Sekundarni naslovi (H2)
```tsx
className="text-2xl font-normal text-foreground"
className="text-3xl font-normal text-foreground"
```

### Tercijarni naslovi (H3)
```tsx
className="text-xl font-normal text-foreground"
```

### Paragrafi
```tsx
className="text-lg text-muted-foreground leading-relaxed"
className="text-muted-foreground leading-relaxed"
```

## 🔍 Komande za proveru

```bash
# Proveri font-bold
grep -r "font-bold" src/app/ --include="*.tsx"

# Proveri text-black
grep -r "text-black" src/app/ --include="*.tsx"

# Proveri hardkodirane boje
grep -r "text-gray-900" src/app/ --include="*.tsx"
```

## 📝 Dokumentacija

Kreiran je detaljan dokument `FONT_CONSISTENCY_RULES.md` sa svim pravilima i primerima korišćenja.

---

**Rezultat:** Sada su sve glavne stranice konzistentne u pogledu fontova i boja! 🎯 