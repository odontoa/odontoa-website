# Font Rules - Odontoa Website

## Osnovne postavke

### Glavni font: Inter
- **Tip**: Google Fonts
- **Implementacija**: Globalno konfigurisan sa CSS varijablom `--font-inter`
- **Font Stack**: `var(--font-inter), 'Inter', ui-sans-serif, system-ui, sans-serif`

## Font težine - VAŽNO PRAVILO ⚠️

**UVEK koristiti `font-normal` za sve naslove i tekst** - ovo je glavno pravilo za Odontoa brand identitet!

### Dozvoljena upotreba:
- **font-normal** - SVI naslovi (h1, h2, h3, h4), paragrafi, kartice naslovi
- **font-medium** - SAMO za dugmad, badge-ove, linkove u navigaciji
- **font-mono** - SAMO za kod elemente

### ZABRANJENO:
- ❌ font-bold - ne koristiti nigde
- ❌ font-semibold - ne koristiti nigde
- ❌ font-light - ne koristiti
- ❌ font-thin - ne koristiti

## Implementacija u kodu

### Globalni stilovi (globals.css):
```css
h1 { @apply font-normal; }
h2 { @apply font-normal; }
h3 { @apply font-normal; }
h4 { @apply font-normal; }
```

### Komponente:
```jsx
// ✅ DOBRO
<h1 className="text-4xl font-normal">Naslov</h1>
<h2 className="text-3xl font-normal">Podnaslov</h2>
<button className="font-medium">Dugme</button>

// ❌ LOŠE
<h1 className="text-4xl font-bold">Naslov</h1>
<h2 className="text-3xl font-semibold">Podnaslov</h2>
```

## Responsive veličine

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| H1 | text-6xl md:text-7xl | text-5xl | text-4xl |
| H2 | text-4xl md:text-5xl | text-3xl | text-2xl |
| H3 | text-2xl | text-xl | text-lg |
| H4 | text-lg | text-base | text-sm |
| Body | text-lg | text-base | text-sm |

## Brand identitet

Light fontovi daju Odontoa sajtu:
- ✨ Moderan i čist izgled
- 🏥 Profesionalan medicinski utisak
- 📱 Savremenu tehnološku estetiku
- 👁️ Bolju čitljivost na svim uređajima

## Kada kreiram nove stranice ili komponente

**UVEK koristiti ova pravila:**
1. Svi naslovi su `font-normal`
2. Sav tekst je `font-normal`
3. Samo dugmad i badge-ovi su `font-medium`
4. Nikad ne koristiti `font-bold` ili `font-semibold`

## Testiranje

Pre završetka, proveri da:
- [ ] Nema `font-bold` nigde u kodu
- [ ] Nema `font-semibold` nigde u kodu  
- [ ] Svi naslovi koriste `font-normal`
- [ ] Dugmad koriste `font-medium` 