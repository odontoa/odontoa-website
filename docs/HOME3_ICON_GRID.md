# Home3 Integrations — Icon Grid (spremno za implementaciju)

Kada budemo menjali `integrations-grid.png` sa pravim React ikonicama,
koristiti ove Tabler ikone iz `@tabler/icons-react`:

## Ikone

| Import naziv       | Labela (SR) | Znacenje               |
|--------------------|-------------|------------------------|
| `IconDental`       | Zub         | Stomatologija          |
| `IconCalendar`     | Zakazivanje | Zakazivanje termina    |
| `IconClipboardList`| Karton      | Karton pacijenta       |
| `IconUser`         | Pacijent    | Profil pacijenta       |
| `IconNotes`        | Beleske     | Beleske / anamneza     |
| `IconReceipt`      | Naplata     | Fakturisanje / naplata |
| `IconPackage`      | Zalihe      | Zalihe materijala      |
| `IconChartBar`     | Analitika   | Izvestaji / analitika  |
| `IconShieldCheck`  | Sigurnost   | Sigurnost podataka     |
| `IconBell`         | Podsetnici  | Notifikacije           |

## Stil kartica

```tsx
// Svaka kartica:
{
  background: '#ffffff',
  border: '1px solid #e8e9ed',
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  padding: '24px 16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
}

// Ikona:
<Icon size={32} color="#6e51e0" stroke={1.5} />

// Labela:
{ fontSize: 13, fontWeight: 500, color: '#353d4f' }
```

## Grid layout (responsive)

- Desktop: `repeat(5, 1fr)`
- Tablet (<768px): `repeat(3, 1fr)`
- Mobil (<480px): `repeat(2, 1fr)`

## Napomena

`IconTooth` ne postoji u ovoj verziji Tablera (v3.34) — koristiti `IconDental`.
