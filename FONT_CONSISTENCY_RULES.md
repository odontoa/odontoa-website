# Odontoa - Pravila za konzistentnost fontova

## 🎯 Cilj
Ovaj dokument definiše pravila za konzistentno korišćenje fontova u celoj Odontoa aplikaciji kako bi se održao profesionalan i jedinstven izgled.

## 📋 Osnovna pravila

### 1. Font porodica
**OBAVEZNO:** Koristite samo Inter font koji je definisan u `src/app/layout.tsx`

```tsx
// ✅ ISPRAVNO
<h1 className="text-4xl font-normal text-foreground">
  Naslov
</h1>

// ❌ NEISPRAVNO
<h1 className="text-4xl font-bold text-black">
  Naslov
</h1>
```

### 2. Font težina
**OBAVEZNO:** Koristite samo `font-normal` za sve naslove i tekst

```tsx
// ✅ ISPRAVNO
<h1 className="font-normal">Glavni naslov</h1>
<h2 className="font-normal">Podnaslov</h2>
<h3 className="font-normal">Sekcija</h3>
<p className="font-normal">Tekst</p>

// ❌ NEISPRAVNO
<h1 className="font-bold">Glavni naslov</h1>
<h2 className="font-semibold">Podnaslov</h2>
<h3 className="font-medium">Sekcija</h3>
```

### 3. Boje teksta
**OBAVEZNO:** Koristite sistemske varijable umesto hardkodiranih boja

```tsx
// ✅ ISPRAVNO
<h1 className="text-foreground">Naslov</h1>
<p className="text-muted-foreground">Tekst</p>
<span className="text-primary">Akcent</span>

// ❌ NEISPRAVNO
<h1 className="text-black">Naslov</h1>
<p className="text-gray-600">Tekst</p>
<span className="text-blue-600">Akcent</span>
```

## 📏 Veličine fontova

### Glavni naslovi (H1)
```tsx
// Homepage hero
<h1 className="text-4xl md:text-6xl font-normal text-foreground leading-tight">

// Kontakt stranica
<h1 className="text-4xl md:text-6xl font-normal text-foreground mb-6">

// Blog stranica
<h1 className="text-4xl lg:text-6xl font-normal text-foreground mb-6 leading-tight">
```

### Sekundarni naslovi (H2)
```tsx
// Sekcije
<h2 className="text-2xl font-normal text-foreground mb-6">

// Podnaslovi
<h2 className="text-3xl font-normal text-foreground mb-4">
```

### Tercijarni naslovi (H3)
```tsx
// Kartice i članci
<h3 className="text-xl font-normal text-foreground mb-3">

// Blog naslovi
<h3 className="text-xl font-normal text-foreground mb-3 group-hover:text-primary transition-colors">
```

### Paragrafi
```tsx
// Glavni tekst
<p className="text-lg text-muted-foreground leading-relaxed">

// Opisi
<p className="text-muted-foreground leading-relaxed">

// Manji tekst
<p className="text-sm text-muted-foreground">
```

## 🎨 Primeri korišćenja

### Hero sekcija
```tsx
<div className="text-center">
  <h1 className="text-4xl md:text-6xl font-normal text-foreground mb-6 leading-tight">
    Glavni naslov
  </h1>
  <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
    Opis sekcije
  </p>
</div>
```

### Kartice
```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-lg font-normal text-foreground">
      Naslov kartice
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground leading-relaxed">
      Sadržaj kartice
    </p>
  </CardContent>
</Card>
```

### Blog članci
```tsx
<article>
  <h3 className="text-xl font-normal text-foreground mb-3 group-hover:text-primary transition-colors">
    Naslov članka
  </h3>
  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
    Sažetak članka
  </p>
</article>
```

## 🔍 Provera konzistentnosti

### Komande za proveru
```bash
# Proveri font-bold
grep -r "font-bold" src/app/ --include="*.tsx"

# Proveri text-black
grep -r "text-black" src/app/ --include="*.tsx"

# Proveri hardkodirane boje
grep -r "text-gray-900" src/app/ --include="*.tsx"
grep -r "text-gray-800" src/app/ --include="*.tsx"
```

### Šta proveriti pre commit-a
- [ ] Nema `font-bold`, `font-semibold`, `font-medium`
- [ ] Nema `text-black`, `text-gray-900`, `text-gray-800`
- [ ] Svi naslovi koriste `font-normal`
- [ ] Sve boje koriste sistemske varijable (`text-foreground`, `text-muted-foreground`, `text-primary`)

## 🚫 Zabranjene kombinacije

```tsx
// ❌ NIKAD NE KORISTITE
className="font-bold text-black"
className="font-semibold text-gray-900"
className="font-medium text-gray-800"
className="text-blue-600"
className="text-green-700"
```

## ✅ Dozvoljene kombinacije

```tsx
// ✅ UVEK KORISTITE
className="font-normal text-foreground"
className="font-normal text-muted-foreground"
className="font-normal text-primary"
className="text-foreground"
className="text-muted-foreground"
```

## 📝 Napomene

1. **Inter font** je definisan globalno u `src/app/layout.tsx`
2. **Sistemske boje** su definisane u `src/app/globals.css`
3. **Dark mode** će automatski raditi ako koristite sistemske varijable
4. **Konzistentnost** je ključna za profesionalan izgled aplikacije

## 🔄 Ažuriranje

Ovaj dokument se ažurira kada se dodaju nove stranice ili komponente. Svaki developer mora da prati ova pravila prilikom kreiranja novog sadržaja.

---

**Zapamtite:** Konzistentnost fontova je ključna za profesionalan izgled Odontoa aplikacije! 🎯 