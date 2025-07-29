# 🌿 Odontoa Branch Management Rules

## 🚫 Main Branch Protection

**VAŽNO:** Main branch je **ZABLJEN** za direktne push-eve i merge-ove!

### ❌ Zabranjeno:
- Direktan push na `main` branch
- Merge na `main` bez eksplicitne dozvole
- Force push na `main` branch
- Direktno commitovanje na `main`

### ✅ Dozvoljeno:
- Pull request sa review-om
- Merge na `main` samo nakon eksplicitne dozvole
- Hotfix-ovi samo u hitnim slučajevima

## 🌿 Branch Naming Convention

### Format: `NextJS-migrated-version-X`

**Primeri:**
- `NextJS-migrated-version-3`
- `NextJS-migrated-version-4`
- `NextJS-migrated-version-5`
- `NextJS-migrated-version-10`

### Automatsko numerisanje:
- Svaki novi branch dobija sledeći broj u sekvenci
- Nema preskakanja brojeva
- Nema tagova - samo branch-evi

## 🔄 Workflow

### 1. Kreiranje novog branch-a:
```bash
# Proveri poslednji broj
git branch -a | grep "NextJS-migrated-version-" | tail -1

# Kreiraj novi branch
git checkout -b NextJS-migrated-version-X
```

### 2. Development:
```bash
# Radi promene
git add .
git commit -m "feat: opis promena"
git push origin NextJS-migrated-version-X
```

### 3. Merge u main (samo sa dozvolom):
```bash
# SAMO kada tražiš merge
git checkout main
git merge NextJS-migrated-version-X
git push origin main
```

## 📋 Branch Checklist

### Pre push-a:
- [ ] Branch ima ispravno ime (`NextJS-migrated-version-X`)
- [ ] Sve promene su testirane
- [ ] Commit message je jasno opisuje promene
- [ ] Nema merge konflikata

### Pre merge-a u main:
- [ ] Eksplicitna dozvola za merge
- [ ] Code review završen
- [ ] Testovi prolaze
- [ ] Dokumentacija ažurirana

## 🛡️ Protection Rules

### GitHub Settings:
1. **Branch Protection Rules** za `main`:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date
   - Restrict pushes that create files
   - Restrict deletions

2. **Required Status Checks**:
   - Build must pass
   - Tests must pass
   - Linting must pass

## 📝 Version Tracking

### Trenutne verzije:
- `main` - stabilna verzija
- `NextJS-migrated-version-3` - trenutni development
- `NextJS-migrated-version-4` - sledeći development
- itd.

### Version History:
- Svaki branch predstavlja jednu verziju
- Nema tagova - samo branch-evi
- Lako praćenje promena kroz branch history

## 🚨 Emergency Procedures

### Hotfix na main:
```bash
# SAMO u hitnim slučajevima
git checkout main
git checkout -b hotfix-critical-fix
# napravi promene
git commit -m "hotfix: kritična ispravka"
git checkout main
git merge hotfix-critical-fix
git push origin main
```

## 📊 Branch Status

### Active Branches:
- `main` - production ready
- `NextJS-migrated-version-3` - development
- `NextJS-migrated-version-4` - planned
- `NextJS-migrated-version-5` - planned

### Branch Lifecycle:
1. **Development** - aktivni rad
2. **Testing** - testiranje
3. **Review** - code review
4. **Merge** - merge u main (sa dozvolom)
5. **Archive** - branch se može obrisati

---

**Zapamti:** Main branch je sveto! Uvek koristi numerisane branch-eve za development! 🛡️ 