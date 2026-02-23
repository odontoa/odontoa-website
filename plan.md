# Mockup Redesign Plan: "Kako izgleda rad u praksi"

## 1. Root-Cause Report

### Why mobile preview looks bad:
- **Scale transforms don't affect layout flow.** `ScaledDashboardMock` and `ScaledCalendarMock` use CSS `transform: scale()` which shrinks visually but the parent container has no idea how tall/wide the content really is. This causes overflow, clipping, and dead space.
- **Fixed pixel heights.** `h-[420px]`, `min-h-[400px]`, `min-h-[360px]` are hardcoded for desktop and don't adapt on mobile.
- **`overflow-visible` conflicts.** The accordion content wrapper clips with `overflow-hidden` but mockups declare `overflow-visible`, creating unpredictable clipping.
- **Mockups designed at 1200px+ width, crammed into ~300px.** DashboardMockupA/B use `max-w-7xl`, CalendarMockup uses `grid-cols-[100px_repeat(5,minmax(160px,1fr))]` (needs 900px+), ReminderMockup has phone+laptop side-by-side (needs 900px+). Even scaled at 0.6-0.65, text is unreadable and layout overflows.
- **ReminderMockup is fundamentally incompatible** with a half-width accordion panel - it renders two device frames side by side.

### All scaling/transform hacks (accordion-feature-section.tsx):
| Lines | What | Scale |
|-------|------|-------|
| 81-98 | `ScaledCalendarMock` | scale(0.6) + inverse width/height calc |
| 100-124 | `ScaledDashboardMock` | generic wrapper, inverse width calc |
| 146 | DashboardMockupA | scale(0.64) via ScaledDashboardMock |
| 160 | DashboardMockupB | scale(0.68) inside h-[420px] container |
| 174 | ReminderMockup | raw inline `transform: scale(0.65)` |
| 180 | OdontogramMockup | raw inline `transform: scale(0.82)` |
| 186 | OrtodontskiKartonMockup | raw inline `transform: scale(0.82)` |
| 192 | IzvestajiMockup | raw inline `transform: scale(0.82)` |

### Per-mockup layout assumptions:
| Mockup | Min width needed | Key problem |
|--------|-----------------|-------------|
| DashboardMockupA | ~900px (grid: minmax(520px) + minmax(380px)) | Text unreadable at 0.64x |
| DashboardMockupB | ~800px (3-col stats + 2-col grid) | Same scaling issue |
| CalendarMockup | ~900px (100px + 5x160px grid) | Grid breaks below 900px |
| ReminderMockup | ~900px (phone 360px + laptop 520px) | Two devices can't fit |
| OdontogramMockup | ~400px (image-based) | Wrong image reference |
| OrtodontskiKartonMockup | ~700px (2-col form grid) | Dense at 0.82x |
| IzvestajiMockup | ~700px (4-col filter grid + 2-col patient list) | Dense at 0.82x |

### Critical bug:
`OdontogramMockup.tsx:56` references `odontogram0staticna-slika2.png` - must switch to `Odontogram-premium-v2.svg`.

---

## 2. Proposed MockupFrame System

### Core principle: **Design mockups at natural render size, not scaled down.**
Current approach (design at 1200px, scale to 50%) is the root of all problems. New approach: each mockup is a compact "marketing screenshot" designed to look sharp at 350-680px.

### MockupFrame component:
```tsx
interface MockupFrameProps {
  children: React.ReactNode;
  aspectRatio?: "4/3" | "3/2"; // default "4/3"
}
```

**Visual styling:**
- `bg-white rounded-2xl border border-slate-200/60 overflow-hidden`
- `shadow: 0 20px 60px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)`
- Subtle header gradient: `linear-gradient(to right, rgba(59,130,246,0.04), transparent)`
- `aspect-ratio: 4/3` (CSS native) as default

**Why 4/3 as primary ratio:**
- Close to typical SaaS screenshot proportions
- Wide enough for dashboard layouts, tall enough for list-based views
- Exception: item 8 (security card) uses no frame, just a styled card

### Breakpoint sizing (desktop right panel width):
| Breakpoint | Container width | Right panel (50%) | Mockup render width |
|------------|----------------|-------------------|---------------------|
| 375px | 343px | N/A (mobile: full width) | ~343px |
| 428px | 396px | N/A (mobile: full width) | ~396px |
| 768px | 720px | 336px | ~336px |
| 1024px | 960px | 456px | ~456px |
| 1280px | max-w-7xl | 576px | ~576px |
| 1440px+ | max-w-7xl | 576px | ~576px (capped) |

### Stable desktop height (no jumping):
- Right panel: `min-h-[440px]` + `flex items-center justify-center`
- Each mockup has `aspect-ratio: 4/3` so height = width * 0.75, deterministic
- Add opacity fade transition on accordion switch (`transition-opacity duration-300`)

### What gets deleted:
- `ScaledCalendarMock` component (lines 81-98)
- `ScaledDashboardMock` component (lines 100-124)
- All inline `transform: scale()` in FeatureMockupById
- All `overflow-visible` hacks
- Per-case shadow/overlay/glow styles (consolidated into MockupFrame)

---

## 3. Per-Mockup Redesign Notes

**Shared design system tokens** (to be used consistently in ALL mockups):
- Background: `#f8fafc` (slate-50)
- Cards: white, `border-slate-200/60`, `shadow-sm` (0 1px 2px rgba(0,0,0,0.05))
- Accent: `#2563EB` (blue-600)
- Status: emerald-500 (positive), amber-500 (warning), red-500 (negative)
- Radius: `rounded-xl` outer cards, `rounded-lg` inner, `rounded-full` pills
- Mini app header: `h-12`, icon (h-8 w-8 rounded-lg bg-blue-600) + title + optional pill
- Inner content padding: `p-4`
- Font sizes inside mockups: 10-14px (readable at natural size)

### 1) DashboardMockupA -> Compact dashboard overview
**Keep:** KPI numbers, donut chart, overall "clinic at a glance" story
**Remove:** Quick actions section, bar chart, large avatar, welcome message
**New layout:**
- Mini header (h-12): blue icon + "Kontrolna tabla" + date pill
- 3 KPI cards in a row: patients (452), appointments today (18), active doctors (6) - compact: icon + number + label
- Donut chart card (below KPIs): smaller chart (~140px diameter) + inline legend on the right
- Overall height fits 4:3 ratio naturally

### 2) DashboardMockupB -> Daily workflow view
**Keep:** Today's appointments list, status badges, time stamps
**Remove:** Activity feed column, elaborate header
**New layout:**
- Mini header: blue icon + "Dnevni tok rada" + "Utorak, 10. dec" + status pill
- 3 mini stat chips inline: "18 termina" / "5 zavrseno" / "1 u toku"
- Appointment list (4 rows): `time | name | procedure | status-pill` in a clean table-like layout
- Each row: subtle left border color matching status

### 3) CalendarMockup -> Compact weekly view
**Keep:** 5-day week view, appointment blocks with status colors, time indicator
**Remove:** Full 8h grid (too many rows), toolbar complexity
**New layout:**
- Mini header: calendar icon + "Kalendar termina" + week range + view toggle pill
- Simplified 5-column grid: show only 4 time slots (09:00-12:00) with 3-4 appointment blocks
- Blocks are small colored rectangles with patient initials + procedure name
- Columns: just day abbreviation + date on header
- Total grid: ~200-250px tall, fits cleanly

### 4) ReminderMockup -> Notification dashboard (FULL REDESIGN)
**Remove entirely:** Phone device frame, laptop device frame, 2-device layout
**New concept:** Single dashboard panel showing reminder management
**New layout:**
- Mini header: bell/message icon + "Podsetnici" + toggle pills (SMS | Email)
- 2 stat chips: "12 poslato danas" + "3 na cekanju"
- Reminder list (4 rows): patient name | type icon (SMS/Email) | short message | status (Poslat/Na cekanju) | time
- Each row: subtle background tint, icon badge for SMS vs Email
- This fits the dashboard aesthetic and works at any width

### 5) OdontogramMockup -> Clean tooth chart
**Keep:** Header, image, footer legend
**Fix:** Image path -> `Odontogram-premium-v2.svg`
**Tweaks:**
- Tighten padding (p-3 -> p-4 consistent)
- Remove max-w-[90rem] (frame handles sizing)
- Keep pointerEvents: none
- Use Next.js Image component for SVG

### 6) OrtodontskiKartonMockup -> Simplified clinical form
**Keep:** Tab navigation, form fields concept, 2-card layout idea
**Reduce:** 4 tabs -> 3, fewer fields per card
**New layout:**
- Mini header: clipboard icon + "Ortodontski karton" + "Marko Jovanovic" + status pill
- 3 tab pills (Klinicka procena active, Funkcionalna, Studijski model)
- 2-column card grid:
  - Left card "Facijalne karakteristike": 3 form fields (Lice, Usne, Profil)
  - Right card "Oralni detalji": 3 form fields (Higijena, Klasifikacija, Bocni odnos)
- Compact form controls (smaller py, text-xs)

### 7) IzvestajiMockup -> Finance/export panel
**Keep:** Filter concept, export button, patient data
**Simplify:** Replace 8-field filter grid + scrollable patient list with compact table
**New layout:**
- Mini header: chart icon + "Izvestaj" + month pill
- 3 inline filter dropdowns: Period | Status | Doktor
- Data table card: 5 rows x 4 columns (Pacijent | Tretman | Iznos | Status)
  - Status as colored pill (Placeno/Na cekanju/Kasni)
  - Clean table with alternating row backgrounds
- Footer: total amount + "Izvezi" button

### 8) Security card -> Elevated icon card
**Keep:** Shield/Cloud/Lock icons, text
**Upgrade:**
- Use MockupFrame (or custom min-height card with same styling)
- Larger icons (h-10 w-10) in individual cards with subtle backgrounds
- Add a subtle dotted pattern or gradient background
- Slightly more text: add "Enkripcija podataka" "Cloud backup" "Kontrola pristupa" labels under each icon

---

## 4. Implementation Phases

### Phase A: MockupFrame + remove scale hacks
**Files:**
- CREATE: `src/components/ui/MockupFrame.tsx`
- EDIT: `src/components/ui/accordion-feature-section.tsx`
  - Delete ScaledCalendarMock, ScaledDashboardMock helpers
  - Rewrite FeatureMockupById: wrap each case in `<MockupFrame>`
  - Remove all inline transforms, fixed heights, overflow hacks
  - Fix desktop right panel: stable height, flex centering, fade transition
  - Fix mobile AccordionContent wrapper: full-width, proper spacing

### Phase B: Redesign each mockup component
**Files (edit all):**
1. `src/components/DashboardMockupA.tsx` - compact dashboard
2. `src/components/DashboardMockupB.tsx` - compact daily flow
3. `src/components/CalendarMockup.tsx` - compact calendar grid
4. `src/components/marketing/ReminderMockup.tsx` - full redesign to single-panel
5. `src/components/OdontogramMockup.tsx` - fix image path, tighten
6. `src/components/OrtodontskiKartonMockup.tsx` - simplify form
7. `src/components/IzvestajiMockup.tsx` - compact table layout

### Phase C: Mobile polish
**Files:**
- EDIT: `src/components/ui/accordion-feature-section.tsx` - mobile-specific spacing, tap target sizing
- MAYBE EDIT: `src/app/globals.css` - if animation adjustments needed for mobile

### Total file changes:
- 1 new file (MockupFrame.tsx)
- 8 edited files (7 mockups + accordion-feature-section)
- Possibly globals.css (minor)
