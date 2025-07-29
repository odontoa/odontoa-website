#!/bin/bash

# 🌿 Odontoa Branch Creator Script
# Automatski kreira sledeći NextJS-migrated-version-X branch

echo "🚀 Odontoa Branch Creator"
echo "=========================="

# Proveri da li smo na main branch-u
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "❌ Error: Morate biti na main branch-u da kreirate novi branch"
    echo "Trenutni branch: $current_branch"
    echo "Pokrenite: git checkout main"
    exit 1
fi

# Proveri da li imaš uncommitted promene
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Imate uncommitted promene"
    echo "Commit-ujte ili stash-ujte promene pre kreiranja novog branch-a"
    exit 1
fi

# Pull najnovije promene sa main-a
echo "📥 Pulling latest changes from main..."
git pull origin main

# Pronađi poslednji broj verzije
echo "🔍 Tražim poslednji broj verzije..."
last_version=$(git branch -a | grep "NextJS-migrated-version-" | sed 's/.*NextJS-migrated-version-//' | sort -n | tail -1)

if [ -z "$last_version" ]; then
    # Ako nema postojećih branch-eva, počni sa 1
    next_version=1
    echo "📝 Nema postojećih branch-eva, počinjem sa verzijom 1"
else
    # Izračunaj sledeći broj
    next_version=$((last_version + 1))
    echo "📝 Poslednja verzija: $last_version"
    echo "📝 Sledeća verzija: $next_version"
fi

# Kreiraj novi branch
branch_name="NextJS-migrated-version-$next_version"
echo "🌿 Kreiram novi branch: $branch_name"

git checkout -b "$branch_name"

if [ $? -eq 0 ]; then
    echo "✅ Uspešno kreiran branch: $branch_name"
    echo ""
    echo "🎯 Sledeći koraci:"
    echo "1. Radi promene u kodu"
    echo "2. git add ."
    echo "3. git commit -m 'feat: opis promena'"
    echo "4. git push origin $branch_name"
    echo ""
    echo "📋 Zapamti:"
    echo "- Main branch je zaštićen"
    echo "- Merge u main samo sa dozvolom"
    echo "- Uvek koristi ovaj script za kreiranje novih branch-eva"
else
    echo "❌ Greška pri kreiranju branch-a"
    exit 1
fi 