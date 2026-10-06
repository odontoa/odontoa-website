import type { RecnikTerm } from '../../types';

/* GENERISANO: scripts/import-recnik-json.ts (kategorija: oralna-hirurgija).
   Rucne izmene su dozvoljene, ali ih sledeci import sa --overwrite moze zameniti. */
export const terms: RecnikTerm[] = [
  {
    "id": "rk-0032",
    "slug": "oralna-hirurgija",
    "medicalCanonicalTerm": "oralna hirurgija",
    "publicTitle": "Oralna hirurgija",
    "shortDefinition": "Oralna hirurgija je stomatološka oblast koja se bavi dijagnostikom i hirurškim lečenjem bolesti, povreda i defekata oralne i maksilofacijalne regije.",
    "meshPreferredTerm": "Surgery, Oral",
    "meshId": "D013515",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D013515",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Surgery, Oral",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d013515"
        ]
      }
    ],
    "categoryId": "oralna-hirurgija",
    "verification": {
      "status": "verified",
      "tier": "B",
      "sourceIds": [
        "src-mesh-d013515",
        "src-stomf-oralna-hirurgija"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d013515",
      "src-stomf-oralna-hirurgija"
    ],
    "seo": {
      "primaryKeyword": "oralna hirurgija",
      "seoTitle": "Oralna hirurgija: šta je i čime se bavi?",
      "metaDescription": "Saznajte šta je oralna hirurgija i kako se kao stomatološka oblast razlikuje od pojedinačnih oralnohirurških procedura.",
      "seoEntryTerm": "oralna hirurgija",
      "searchAliases": [
        "oralna hirurgija"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Čime se bavi oralna hirurgija?"
      },
      {
        "type": "p",
        "text": [
          "Oralna hirurgija je šira stomatološka oblast, dok su ",
          {
            "type": "term",
            "termId": "rk-0057",
            "text": "ekstrakcija zuba"
          },
          " i ",
          {
            "type": "term",
            "termId": "rk-0045",
            "text": "gingivektomija"
          },
          " pojedinačni zahvati."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li je oralna hirurgija isto što i svaka oralnohirurška intervencija?",
        "answer": "Ne. Oralna hirurgija je šira stomatološka oblast, dok se pojedinačni zahvati vode kao zasebni pojmovi."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0057",
        "rk-0045"
      ]
    }
  },
  {
    "id": "rk-0057",
    "slug": "vadjenje-zuba",
    "medicalCanonicalTerm": "ekstrakcija zuba",
    "publicTitle": "Vađenje zuba (ekstrakcija zuba)",
    "shortDefinition": "Ekstrakcija zuba je hirurško uklanjanje zuba.",
    "meshPreferredTerm": "Tooth Extraction",
    "meshId": "D014081",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D014081",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Tooth Extraction",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d014081"
        ]
      },
      {
        "value": "vađenje zuba",
        "type": "lay-term",
        "medicallyVerified": false
      },
      {
        "value": "vadjenje zuba",
        "type": "seo-alias",
        "medicallyVerified": false
      }
    ],
    "categoryId": "oralna-hirurgija",
    "verification": {
      "status": "verified",
      "tier": "B",
      "sourceIds": [
        "src-mesh-d014081",
        "src-stomf-ekstrakcija-zuba"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d014081",
      "src-stomf-ekstrakcija-zuba"
    ],
    "seo": {
      "primaryKeyword": "vađenje zuba",
      "seoTitle": "Vađenje zuba (ekstrakcija): šta podrazumeva?",
      "metaDescription": "Saznajte šta znači ekstrakcija, odnosno vađenje zuba, i kako se ovaj pojam koristi u okviru oralne hirurgije.",
      "seoEntryTerm": "vađenje zuba",
      "searchAliases": [
        "vađenje zuba",
        "vadjenje zuba",
        "ekstrakcija zuba"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Šta podrazumeva ekstrakcija zuba?"
      },
      {
        "type": "p",
        "text": [
          "Ekstrakcija zuba je pojedinačna hirurška procedura, dok je ",
          {
            "type": "term",
            "termId": "rk-0032",
            "text": "oralna hirurgija"
          },
          " šira stomatološka oblast."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li su ekstrakcija zuba i oralna hirurgija isto?",
        "answer": "Ne treba ih automatski izjednačavati. U našoj verifikovanoj terminološkoj bazi vode se kao zasebni pojmovi."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0032"
      ]
    }
  }
];
