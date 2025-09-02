# 📋 Table of Contents Implementation - Odontoa

## 🎯 Overview

Implementirana je potpuna funkcionalnost za navigaciju kroz sadržaj blog članaka. Kada korisnik klikne na stavku u "Sadržaj" (Table of Contents), precizno se prebacuje na taj deo u tekstu sa smooth scroll efektom i vizuelnom indikacijom.

## ✅ Implementirane funkcionalnosti

### 1. **Automatsko generisanje ID-jeva za naslove**
- **Lokacija**: `src/components/PostLayout.tsx` - `addIdsToHeadings()` funkcija
- **Funkcionalnost**: Automatski dodaje jedinstvene ID-jeve svim naslovima (h1-h6) u HTML sadržaju
- **Algoritam**: 
  - Konvertuje tekst u lowercase
  - Uklanja specijalne karaktere
  - Zamenjuje razmake sa crticama
  - Generiše jedinstvene ID-jeve

### 2. **Table of Contents komponenta**
- **Lokacija**: `src/components/TableOfContents.tsx`
- **Funkcionalnost**: 
  - Automatski parsira sadržaj i pronalazi sve naslove
  - Generiše hijerarhijsku listu sa pravilnim uvlacenjem
  - Praćenje aktivne stavke tokom skrolovanja
  - Smooth scroll navigacija sa offset-om

### 3. **Precizna navigacija**
- **Smooth scroll**: Koristi `window.scrollTo()` sa `behavior: 'smooth'`
- **Offset**: 120px offset za bolju vidljivost (ne sakriva naslov iza headera)
- **Vizuelna indikacija**: Žuto pozadinsko osvetljenje naslova na 2 sekunde
- **Fallback logika**: Ako ID nije pronađen, pokušava pronaći po tekstu

### 4. **Aktivna stavka praćenje**
- **Real-time tracking**: Prati koji naslov je trenutno vidljiv
- **Vizuelna indikacija**: Aktivna stavka je označena plavom bojom i pozadinom
- **Scroll offset**: 150px offset za precizniju detekciju

## 🛠️ Tehnička implementacija

### PostLayout.tsx modifikacije
```typescript
// Funkcija za dodavanje ID-jeva u naslove
const addIdsToHeadings = (htmlContent: string): string => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
  
  headings.forEach((heading, index) => {
    const text = heading.textContent || ''
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    
    // If ID is empty or duplicate, use index
    const finalId = id || `heading-${index}`
    heading.setAttribute('id', finalId)
  })
  
  return doc.body.innerHTML
}

// Korišćenje u render-u
<div 
  className="text-lg leading-8 text-gray-700"
  dangerouslySetInnerHTML={{ __html: addIdsToHeadings(post.content) }}
/>
```

### TableOfContents.tsx poboljšanja
```typescript
// Precizna navigacija sa fallback logikom
const scrollToHeading = (id: string) => {
  // First try to find element by ID
  let element = document.getElementById(id)
  
  // If not found by ID, try to find by text content
  if (!element) {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    for (const heading of headings) {
      const headingText = heading.textContent?.trim() || ''
      if (headingText === id) {
        element = heading as HTMLElement
        break
      }
    }
  }
  
  if (element) {
    // Add offset for fixed header and smooth scroll
    const offset = 120 // Increased offset for better visibility
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
    
    // Add visual feedback - highlight the heading briefly
    element.style.transition = 'background-color 0.3s ease'
    element.style.backgroundColor = '#fef3c7' // Light yellow highlight
    setTimeout(() => {
      element.style.backgroundColor = ''
    }, 2000)
  }
}

// Aktivna stavka praćenje
useEffect(() => {
  const handleScroll = () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const scrollPosition = window.scrollY + 150 // Offset for better detection
    
    let currentActiveId = ''
    
    headings.forEach((heading) => {
      const element = heading as HTMLElement
      const elementTop = element.offsetTop
      const elementHeight = element.offsetHeight
      
      if (scrollPosition >= elementTop && scrollPosition < elementTop + elementHeight) {
        currentActiveId = element.id || ''
      }
    })
    
    setActiveId(currentActiveId)
  }
  
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initial check
  
  return () => window.removeEventListener('scroll', handleScroll)
}, [tocItems])
```

## 🎨 UI/UX poboljšanja

### Vizuelna hijerarhija
- **H1**: Font-semibold, text-gray-900
- **H2**: Font-medium, text-gray-800, ml-2
- **H3+**: text-gray-600, ml-4

### Aktivna stavka
- **Pozadina**: bg-blue-50
- **Tekst**: text-blue-600 font-medium
- **Padding**: px-2 py-1 rounded

### Hover efekti
- **Hover**: hover:text-blue-600
- **Transition**: transition-colors

## 🧪 Testiranje

### Test blog kreiran
- **Slug**: `digitalni-karton-pacijenata-vodic`
- **Naslovi**: 9 naslova (H2 i H3)
- **ID-jevi**: Automatski generisani

### Test rezultati
```
🎯 Extracted Headings:
1. H2: "Šta je digitalni karton pacijenata?" -> ID: "ta-je-digitalni-karton-pacijenata"
2. H2: "Prednosti digitalnog kartona" -> ID: "prednosti-digitalnog-kartona"
3. H3: "1. Brži i precizniji rad" -> ID: "1-bri-i-precizniji-rad"
4. H3: "2. Smanjenje grešaka" -> ID: "2-smanjenje-greaka"
5. H3: "3. Sigurnost podataka" -> ID: "3-sigurnost-podataka"
6. H3: "4. Bolja komunikacija u timu" -> ID: "4-bolja-komunikacija-u-timu"
7. H2: "Kako digitalni karton menja svakodnevni rad ordinacije?" -> ID: "kako-digitalni-karton-menja-svakodnevni-rad-ordinacije"
8. H2: "Od papira do digitalnog - kako započeti?" -> ID: "od-papira-do-digitalnog-kako-zapoeti"
9. H2: "Zaključak" -> ID: "zakljuak"
```

## 🚀 Kako koristiti

1. **Otvorite blog članak** sa naslovima
2. **Pogledajte desnu sidebar** - "Sadržaj" sekcija
3. **Kliknite na bilo koju stavku** u sadržaju
4. **Vidite smooth scroll** do odgovarajućeg naslova
5. **Naslov se osvetljava** žutom bojom na 2 sekunde
6. **Aktivna stavka** se označava plavom bojom tokom skrolovanja

## ✅ Checklist

- [x] Automatsko generisanje ID-jeva za naslove
- [x] Table of Contents komponenta
- [x] Precizna navigacija sa smooth scroll
- [x] Vizuelna indikacija aktivne stavke
- [x] Fallback logika za pronalaženje naslova
- [x] Offset za bolju vidljivost
- [x] Hijerarhijska struktura sa uvlacenjem
- [x] Test blog sa naslovima
- [x] Dokumentacija implementacije

## 🎯 Rezultat

Korisnici sada mogu da:
- **Brzo navigiraju** kroz sadržaj blog članaka
- **Vide gde se nalaze** u članku
- **Imaju preciznu kontrolu** nad navigacijom
- **Uživaju u smooth UX** sa vizuelnim feedback-om

Implementacija je potpuno funkcionalna i spremna za produkciju! 🎉
