#!/bin/bash

# 🚀 Strapi Backend Setup Script
# Automatski kreira odvojeni Strapi backend projekat sa schema fajlovima

set -e # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Kreiranje Strapi Backend Projekta${NC}"
echo ""

# 1. Check if we're in the right directory
CURRENT_DIR=$(pwd)
if [[ ! "$CURRENT_DIR" =~ "odontoa-website" ]]; then
    echo -e "${RED}❌ Greška: Pokreni ovaj script iz odontoa-website direktorijuma${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Direktorijum: $CURRENT_DIR${NC}"
echo ""

# 2. Create Strapi project
STRAPI_DIR="$HOME/Desktop/odontoa-strapi-backend"

if [ -d "$STRAPI_DIR" ]; then
    echo -e "${YELLOW}⚠️  Direktorijum $STRAPI_DIR već postoji.${NC}"
    echo -e "${YELLOW}   Da li želiš da ga obrišeš i kreiraš novi? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm -rf "$STRAPI_DIR"
        echo -e "${GREEN}✅ Obrisan stari direktorijum${NC}"
    else
        echo -e "${RED}❌ Aborting...${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}📦 Kreiranje Strapi projekta (ovo može da traje 2-3 minuta)...${NC}"
cd ~/Desktop
npx create-strapi-app@latest odontoa-strapi-backend --quickstart --no-run

cd odontoa-strapi-backend

echo -e "${GREEN}✅ Strapi projekat kreiran${NC}"
echo ""

# 3. Create directory structure for Article
echo -e "${BLUE}📁 Kreiranje folder strukture...${NC}"

mkdir -p src/api/article/content-types/article
mkdir -p src/api/article/routes
mkdir -p src/api/article/controllers
mkdir -p src/api/article/services
mkdir -p src/components/blog/key-takeaway
mkdir -p src/components/blog/faq-item

echo -e "${GREEN}✅ Folder struktura kreirana${NC}"
echo ""

# 4. Copy schema files from Next.js project
echo -e "${BLUE}📄 Kopiranje schema fajlova...${NC}"

NEXT_PROJECT="$HOME/Desktop/odontoa-website"

# Copy Article schema
cp "$NEXT_PROJECT/src/api/article/content-types/article/schema.json" \
   src/api/article/content-types/article/schema.json
echo -e "${GREEN}  ✅ Article schema${NC}"

# Copy Key Takeaway component schema
cp "$NEXT_PROJECT/src/components/blog/key-takeaway/schema.json" \
   src/components/blog/key-takeaway/schema.json
echo -e "${GREEN}  ✅ Key Takeaway component${NC}"

# Copy FAQ Item component schema
cp "$NEXT_PROJECT/src/components/blog/faq-item/schema.json" \
   src/components/blog/faq-item/schema.json
echo -e "${GREEN}  ✅ FAQ Item component${NC}"

echo ""

# 5. Create routes.json
echo -e "${BLUE}🛣️  Kreiranje routes...${NC}"

cat > src/api/article/routes/article.json << 'EOF'
{
  "routes": [
    {
      "method": "GET",
      "path": "/articles",
      "handler": "article.find",
      "config": {
        "policies": []
      }
    },
    {
      "method": "GET",
      "path": "/articles/:id",
      "handler": "article.findOne",
      "config": {
        "policies": []
      }
    },
    {
      "method": "POST",
      "path": "/articles",
      "handler": "article.create",
      "config": {
        "policies": []
      }
    },
    {
      "method": "PUT",
      "path": "/articles/:id",
      "handler": "article.update",
      "config": {
        "policies": []
      }
    },
    {
      "method": "DELETE",
      "path": "/articles/:id",
      "handler": "article.delete",
      "config": {
        "policies": []
      }
    }
  ]
}
EOF

echo -e "${GREEN}✅ Routes kreiran${NC}"
echo ""

# 6. Create controller
echo -e "${BLUE}🎮 Kreiranje controller...${NC}"

cat > src/api/article/controllers/article.js << 'EOF'
'use strict';

/**
 * article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article');
EOF

echo -e "${GREEN}✅ Controller kreiran${NC}"
echo ""

# 7. Create service
echo -e "${BLUE}⚙️  Kreiranje service...${NC}"

cat > src/api/article/services/article.js << 'EOF'
'use strict';

/**
 * article service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::article.article');
EOF

echo -e "${GREEN}✅ Service kreiran${NC}"
echo ""

# 8. Create .gitignore
echo -e "${BLUE}📝 Kreiranje .gitignore...${NC}"

cat > .gitignore << 'EOF'
############################
# OS X
############################

.DS_Store
.AppleDouble
.LSOverride
Icon
.Spotlight-V100
.Trashes
._*


############################
# Linux
############################

*~


############################
# Windows
############################

Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msm
*.msp


############################
# Packages
############################

*.7z
*.csv
*.dat
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip
*.com
*.class
*.dll
*.exe
*.o
*.seed
*.so
*.swo
*.swp
*.swn
*.swm
*.out
*.pid


############################
# Logs and databases
############################

.tmp
*.log
*.sql
*.sqlite
*.sqlite3


############################
# Misc.
############################

*#
ssl
.idea
nbproject
public/uploads/*
!public/uploads/.gitkeep

############################
# Node.js
############################

lib-cov
lcov.info
pids
logs
results
node_modules
.node_history

############################
# Tests
############################

coverage

############################
# Strapi
############################

.env
license.txt
exports
*.cache
dist
build
.strapi-updater.json
.strapi
EOF

echo -e "${GREEN}✅ .gitignore kreiran${NC}"
echo ""

# 9. Initialize git
echo -e "${BLUE}🔧 Git inicijalizacija...${NC}"

git init
git add .
git commit -m "feat: initial Strapi backend with Article schema and components

- Article content type with all fields
- Key Takeaway component (blog.key-takeaway)
- FAQ Item component (blog.faq-item)
- Routes, controllers, and services
- Ready for Strapi Cloud deployment"

echo -e "${GREEN}✅ Git inicijalizovan${NC}"
echo ""

# 10. Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Strapi Backend Projekat Uspešno Kreiran!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📍 Lokacija:${NC} $STRAPI_DIR"
echo ""
echo -e "${BLUE}📋 Šta dalje?${NC}"
echo ""
echo -e "  1️⃣  ${YELLOW}Kreiraj GitHub repo:${NC}"
echo -e "      - Idi na: https://github.com/orgs/odontoa/repositories/new"
echo -e "      - Ime repo-a: ${YELLOW}odontoa-strapi-backend${NC}"
echo -e "      - Visibility: Private"
echo -e "      - NE dodavaj README, .gitignore ili license (već postoje)"
echo ""
echo -e "  2️⃣  ${YELLOW}Push na GitHub:${NC}"
echo -e "      ${BLUE}cd $STRAPI_DIR${NC}"
echo -e "      ${BLUE}git remote add origin git@github.com:odontoa/odontoa-strapi-backend.git${NC}"
echo -e "      ${BLUE}git branch -M main${NC}"
echo -e "      ${BLUE}git push -u origin main${NC}"
echo ""
echo -e "  3️⃣  ${YELLOW}Poveži sa Strapi Cloud:${NC}"
echo -e "      - Idi na: https://cloud.strapi.io/projects"
echo -e "      - Izaberi projekat (inspiring-chocolate-...)"
echo -e "      - Settings → Git Integration"
echo -e "      - Connect repo: ${YELLOW}odontoa/odontoa-strapi-backend${NC}"
echo -e "      - Branch: ${YELLOW}main${NC}"
echo -e "      - Trigger Deployment"
echo ""
echo -e "  4️⃣  ${YELLOW}Proveri deployment:${NC}"
echo -e "      - Čekaj 2-5 minuta"
echo -e "      - Idi na admin panel: ${BLUE}https://inspiring-chocolate-0dd8ffdae3.strapiapp.com/admin${NC}"
echo -e "      - Content-Type Builder → Proveri nova polja"
echo ""
echo -e "  5️⃣  ${YELLOW}Test (opciono) - Lokalni development:${NC}"
echo -e "      ${BLUE}cd $STRAPI_DIR${NC}"
echo -e "      ${BLUE}npm run develop${NC}"
echo -e "      - Pristupi: ${BLUE}http://localhost:1337/admin${NC}"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📚 Dokumentacija:${NC}"
echo -e "  - ${YELLOW}STRAPI_CLOUD_DIJAGNOZA_I_RESENJE.md${NC}"
echo -e "  - ${YELLOW}STRAPI_TROUBLESHOOTING_HISTORY.md${NC}"
echo ""
echo -e "${GREEN}✨ Gotovo! Srećno sa deployment-om! 🚀${NC}"
echo ""

