# Moodify Patient Details – Figma Layout Spec

Exact layout structure extracted from Figma frames (node IDs: 56-5890 Desktop, 329-12171 Tablet, 329-12666 Mobile).

---

## 1. Desktop (node-id=56-5890)

**Frame:** 1440×1046  
**Content area:** 1173×898 (Body, excluding sidebar 243px)  
**Body padding:** 20px (all sides)

### Top row (1133×422, gap 20px between cards)

| Card | Dimensions | Position (x, y) |
|------|------------|-----------------|
| General Info & Well-Being Progress | 557×422 | (0, 0) |
| Upcoming Counselling | 268×422 | (577, 0) |
| Treatment History | 268×422 | (865, 0) |

**Layout:** `row1: [557×422] [268×422] [268×422], gap 20px`

- General Info (top of left card): 557×142, contains Avatar 110×110 at (16,16), Info block at (146,16)
- Well-Being Progress (below General Info): 557×260 at (0, 162), internal padding 16px
- Gap between Top and Bottom rows: **20px**

### Bottom row (1133×416)

**Left section (845×416):**

| Card | Dimensions | Position |
|------|------------|----------|
| Self Control | 268×230 | (0, 0) |
| Daily Activities | 269×230 | (288, 0) |
| Health Report | 268×230 | (577, 0) |
| Patient Notes | 845×170 | (0, 246) |

**Layout:** `row2: [268×230] [269×230] [268×230], gap 20px`  
**Row 3:** Patient Notes full-width, gap 16px below row2

**Right column:**

| Card | Dimensions | Position |
|------|------------|----------|
| Medicine History | 268×416 | (865, 0) |

**Layout:** `Medicine History: 268×416, gap 20px from Left Section`

### Patient Notes – 4 cards in row

| Card | Dimensions | Position |
|------|------------|----------|
| Note 1 | 199.25×124 | (0, 0) |
| Note 2 | 199.25×124 | (215.25, 0) |
| Note 3 | 199.25×124 | (430.5, 0) |
| Note 4 | 199.25×124 | (645.75, 0) |

**Layout:** `4 cards: 199.25×124 each, gap 16px between cards`

### Desktop summary

```
Body padding: 20px
Top row gap: 20px
Bottom row gap (between rows): 20px
Widget-of-Three gap: 20px
Patient Notes ↔ Widget-of-Three: 16px
Patient Notes card gap: 16px
Medicine History ↔ Left Section: 20px

Card internal padding: 16px (Header-Section at 16,16)
Border-radius: var(--v2-radius-card) = 20px
```

---

## 2. Tablet (node-id=329-12171)

**Frame:** 800×1754  
**Content area:** 696×1606 (Body)  
**Body padding:** 20px

### Stacking order (single column with 2-column subgrids)

| Section | Dimensions | Y position | Gap from previous |
|---------|------------|------------|--------------------|
| General info | 656×142 | 20 | — |
| Widget Well Being Progress | 656×260 | 182 | 20px |
| Upcoming Counselling + Treatment History | 656×422 (2 cols) | 462 | 20px |
| Widget of Three (Self Control + Health Report) | 656×230 (2 cols) | 904 | 20px |
| Medicine History + Daily Activities | 656×242 (2 cols) | 1154 | 20px |
| Widget Patient Notes | 656×170 | 1416 | 20px |

### Row 1: Upcoming + Treatment (2 columns)

| Card | Dimensions | Position |
|------|------------|----------|
| Upcoming Counselling | 318×422 | (0, 0) |
| Treatment History | 318×422 | (338, 0) |

**Layout:** `[318×422] [318×422], gap 20px`

### Row 2: Self Control + Health Report (2 columns only; no Daily Activities)

| Card | Dimensions | Position |
|------|------------|----------|
| Self Control | 318×230 | (0, 0) |
| Health Report | 318×230 | (338, 0) |

**Layout:** `[318×230] [318×230], gap 20px`

### Row 3: Medicine History + Daily Activities

| Card | Dimensions | Position |
|------|------------|----------|
| Medicine History | 403×242 | (0, 0) |
| Daily Activities | 234×242 | (423, 0) |

**Layout:** `[403×242] [234×242], gap 20px`

### Patient Notes – 4 cards in row

| Card | Dimensions | Position |
|------|------------|----------|
| Note 1 | 208×124 | (0, 0) |
| Note 2 | 208×124 | (224, 0) |
| Note 3 | 208×124 | (448, 0) |

**Layout:** `3 visible cards: 208×124 each, gap 16px` (4th card hidden in Figma)

### Tablet summary

```
Body padding: 20px
Vertical gap between sections: 20px
Horizontal gap between 2-col cards: 20px
Patient Notes card gap: 16px

Differences from Desktop:
- Single column stack; 2-column subgrids for paired cards
- Daily Activities moved to row with Medicine History
- Widget of Three has only 2 cards (Self Control, Health Report)
- Medicine History wider (403px) with Daily Activities narrower (234px)
```

---

## 3. Mobile (node-id=329-12666)

**Frame:** 390×3477  
**Content width:** 358px (16px horizontal padding each side)  
**Navbar:** 60px height

### Single-column stacking order

| Section | Dimensions | Y position | Gap from previous |
|---------|------------|------------|--------------------|
| General info | 358×250 | 16 | — |
| Widget Well Being Progress | 358×266 | 282 | 16px |
| Widget Upcoming Counselling | 358×439 | 564 | 16px |
| Widget Treatment History | 358×422 | 1019 | 16px |
| Widget Self Control | 358×240 | 1457 | 16px |
| Widget Health Report | 358×230 | 1713 | 16px |
| Widget Medicine History | 358×442 | 1959 | 16px |
| Widget Daily Activities | 358×270 | 2417 | 16px |
| Widget Patient Notes | 358×586 | 2703 | 16px |

### Patient Notes – 4 cards stacked vertically

| Card | Dimensions | Position |
|------|------------|----------|
| Note 1 | 358×123 | (0, 0) |
| Note 2 | 358×123 | (0, 139) |
| Note 3 | 358×123 | (0, 278) |
| Note 4 | 358×123 | (0, 417) |

**Layout:** `4 cards stacked: 358×123 each, gap 16px`

### Mobile summary

```
Body padding: 16px
Vertical gap between cards: 16px
Single column, full-width cards

Card order (top to bottom):
1. General info
2. Well Being Progress
3. Upcoming Counselling
4. Treatment History
5. Self Control
6. Health Report
7. Medicine History
8. Daily Activities
9. Patient Notes (4 stacked cards)
```

---

## 4. Card dimensions reference

| Card | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| General Info | 557×142 (within 557×422) | 656×142 | 358×250 |
| Well-Being Progress | 557×260 (within 557×422) | 656×260 | 358×266 |
| Upcoming Counselling | 268×422 | 318×422 | 358×439 |
| Treatment History | 268×422 | 318×422 | 358×422 |
| Self Control | 268×230 | 318×230 | 358×240 |
| Daily Activities | 269×230 | 234×242 | 358×270 |
| Health Report | 268×230 | 318×230 | 358×230 |
| Medicine History | 268×416 | 403×242 | 358×442 |
| Patient Notes (container) | 845×170 | 656×170 | 358×586 |
| Patient Note (single card) | 199.25×124 | 208×124 | 358×123 |

---

## 5. Spacing & styling tokens

| Token | Value | Usage |
|-------|-------|-------|
| Body padding (Desktop) | 20px | Content area inset |
| Body padding (Tablet) | 20px | Content area inset |
| Body padding (Mobile) | 16px | Content area inset |
| Card gap (horizontal) | 20px | Between cards in same row |
| Card gap (vertical) | 20px (Desktop/Tablet), 16px (Mobile) | Between rows/sections |
| Patient Notes card gap | 16px | Between note cards |
| Widget internal padding | 16px | Header-Section, list content |
| `--v2-radius-card` | 20px | Card border-radius |
| `--v2-radius-pill` | 20px | Pills, buttons |
| `--v2-radius-avatar` | 32px | Avatar circles |

---

*Source: Figma metadata via get_metadata MCP (Desktop 56:5890, Tablet 329:12171, Mobile 329:12666)*
