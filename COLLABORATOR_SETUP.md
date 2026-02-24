# 🚀 Setup za novog saradnika (odontoa-biznis-akaunt-info)

Kratak vodič za brzo pokretanje projekta.

## 1. Kloniraj repozitorijum

```bash
git clone https://github.com/odontoa/odontoa-website.git
cd odontoa-website
```

> **Napomena:** Ako koristiš SSH, URL je: `git@github.com:odontoa/odontoa-website.git`

## 2. Podesi Git (obavezno!)

Projekat koristi zajednički Odontoa GitHub nalog:

```bash
./setup-git-odontoa.sh
```

Ili ručno:
```bash
git config --local user.name "Odontoa Team"
git config --local user.email "odontoa.com@gmail.com"
```

## 3. Instaliraj zavisnosti

```bash
npm install
```

## 4. Environment varijable

Kopiraj primer i popuni vrednosti:

```bash
cp .env.local.example .env.local
```

Otvori `.env.local` i popuni:
- `VITE_SUPABASE_URL` – dobij od tima
- `VITE_SUPABASE_ANON_KEY` – dobij od tima
- `NEXT_PUBLIC_STRAPI_URL` – već postavljeno na `https://cms.odontoa.com`

> **Važno:** `.env.local` sadrži tajne – nikad ga ne commit-uj u Git!

## 5. Pokreni projekat

```bash
npm run dev
```

Otvori [http://localhost:3000](http://localhost:3000)

---

## Rad sa Git-om

- **Main branch** je zaštićen – radi na feature branch-evima
- Kreiraj branch: `git checkout -b feature/naziv-feature-a`
- Push: `git push origin feature/naziv-feature-a`
- Otvori Pull Request na GitHubu kada si spreman za review

---

## Pitanja?

Kontaktiraj tim – sve ostalo je u [README.md](./README.md).
