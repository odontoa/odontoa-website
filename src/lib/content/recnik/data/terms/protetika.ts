import type { RecnikTerm } from '../../types';

/* GENERISANO: scripts/import-recnik-json.ts (kategorija: protetika).
   Rucne izmene su dozvoljene, ali ih sledeci import sa --overwrite moze zameniti. */
export const terms: RecnikTerm[] = [
  {
    "id": "rk-0031",
    "slug": "protetika",
    "medicalCanonicalTerm": "protetika",
    "publicTitle": "Protetika",
    "shortDefinition": "Protetika je stomatološka oblast koja obnavlja i održava oralnu funkciju nadoknadom nedostajućih zuba i povezanih struktura veštačkim nadoknadama.",
    "meshPreferredTerm": "Prosthodontics",
    "meshId": "D011476",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D011476",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Prosthodontics",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d011476"
        ]
      },
      {
        "value": "zubna protetika",
        "type": "seo-alias",
        "medicallyVerified": false
      },
      {
        "value": "stomatološka protetika",
        "type": "seo-alias",
        "medicallyVerified": false
      },
      {
        "value": "dentalna protetika",
        "type": "seo-alias",
        "medicallyVerified": false
      }
    ],
    "categoryId": "protetika",
    "verification": {
      "status": "verified",
      "tier": "A",
      "sourceIds": [
        "src-mesh-d011476",
        "src-iss-srps-en-iso-1942"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d011476",
      "src-iss-srps-en-iso-1942"
    ],
    "seo": {
      "primaryKeyword": "zubna protetika",
      "seoTitle": "Zubna protetika: šta je i čime se bavi?",
      "metaDescription": "Saznajte šta je protetika i kako se kao stomatološka oblast bavi nadoknadom nedostajućih zuba i povezanih struktura.",
      "seoEntryTerm": "zubna protetika",
      "searchAliases": [
        "protetika",
        "zubna protetika",
        "stomatološka protetika",
        "dentalna protetika",
        "protetika zuba"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Čime se bavi protetika?"
      },
      {
        "type": "p",
        "text": [
          "Protetika je stomatološka oblast, dok su pojedinačne nadoknade i njihovi delovi zasebni pojmovi. Povezani termini u ovom pilotu uključuju ",
          {
            "type": "term",
            "termId": "rk-0094",
            "text": "abatment"
          },
          " i ",
          {
            "type": "term",
            "termId": "rk-0105",
            "text": "dentalni vinir"
          },
          "."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li su protetika i stomatološka nadoknada isto?",
        "answer": "Ne. Protetika je stomatološka oblast, dok je stomatološka nadoknada konkretan protetski pojam."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0094",
        "rk-0105"
      ]
    }
  },
  {
    "id": "rk-0105",
    "slug": "fasete-za-zube",
    "medicalCanonicalTerm": "dentalni vinir",
    "publicTitle": "Fasete za zube (dentalni viniri)",
    "shortDefinition": "Dentalni vinir je sloj materijala boje zuba koji se nanosi na površinu prirodnog zuba, krunice ili člana mosta i može biti izrađen, između ostalog, od porcelana ili akrilne smole.",
    "meshPreferredTerm": "Dental Veneers",
    "meshId": "D003801",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D003801",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Dental Veneers",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d003801"
        ]
      },
      {
        "value": "fasete za zube",
        "type": "seo-alias",
        "medicallyVerified": false
      },
      {
        "value": "viniri za zube",
        "type": "seo-alias",
        "medicallyVerified": false
      },
      {
        "value": "zubne fasete",
        "type": "seo-alias",
        "medicallyVerified": false
      }
    ],
    "categoryId": "protetika",
    "verification": {
      "status": "verified",
      "tier": "A",
      "sourceIds": [
        "src-mesh-d003801",
        "src-iss-srps-en-iso-1942"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d003801",
      "src-iss-srps-en-iso-1942"
    ],
    "seo": {
      "primaryKeyword": "fasete za zube",
      "seoTitle": "Fasete za zube (dentalni viniri): šta su?",
      "metaDescription": "Saznajte šta su fasete za zube, odnosno dentalni viniri, čemu služe i kako se ovaj pojam koristi u stomatologiji.",
      "seoEntryTerm": "fasete za zube",
      "searchAliases": [
        "fasete za zube",
        "viniri za zube",
        "dentalni viniri",
        "zubne fasete"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Čemu služi dentalni vinir?"
      },
      {
        "type": "p",
        "text": [
          "Dentalni vinir je zaseban protetski pojam. Povezan je sa ",
          {
            "type": "term",
            "termId": "rk-0031",
            "text": "protetikom"
          },
          ", ali ga ne treba izjednačavati sa širom oblašću estetske stomatologije."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li je dentalni vinir isto što i svaka zubna nadoknada?",
        "answer": "Ne. MeSH Dental Veneers vodi kao zaseban pojam u odnosu na širi koncept dentalnih nadoknada."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0031"
      ]
    }
  }
];
