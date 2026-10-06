import type { RecnikTerm } from '../../types';

/* GENERISANO: scripts/import-recnik-json.ts (kategorija: parodontologija).
   Rucne izmene su dozvoljene, ali ih sledeci import sa --overwrite moze zameniti. */
export const terms: RecnikTerm[] = [
  {
    "id": "rk-0045",
    "slug": "gingivektomija",
    "medicalCanonicalTerm": "gingivektomija",
    "publicTitle": "Gingivektomija",
    "shortDefinition": "Gingivektomija je hirurško uklanjanje gingive na nivou njenog pripoja; koristi se, između ostalog, za uklanjanje gingivalnih ili parodontalnih džepova i omogućavanje pristupa tokom određenih hirurških zahvata.",
    "meshPreferredTerm": "Gingivectomy",
    "meshId": "D005890",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D005890",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Gingivectomy",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d005890"
        ]
      }
    ],
    "categoryId": "parodontologija",
    "verification": {
      "status": "verified",
      "tier": "B",
      "sourceIds": [
        "src-mesh-d005890",
        "src-stomf-gingivektomija"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d005890",
      "src-stomf-gingivektomija"
    ],
    "seo": {
      "primaryKeyword": "gingivektomija",
      "seoTitle": "Gingivektomija: šta je i šta podrazumeva?",
      "metaDescription": "Saznajte šta je gingivektomija i šta podrazumeva hirurško uklanjanje gingive na nivou njenog pripoja.",
      "seoEntryTerm": "gingivektomija",
      "searchAliases": [
        "gingivektomija"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Šta podrazumeva gingivektomija?"
      },
      {
        "type": "p",
        "text": [
          "Gingivektomija je pojedinačni hirurški zahvat. Povezana je sa ",
          {
            "type": "term",
            "termId": "rk-0069",
            "text": "subgingivalnom kiretažom"
          },
          ", ali ta dva termina ne označavaju isti postupak."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li su gingivektomija i parodontologija isto?",
        "answer": "Ne treba ih automatski izjednačavati. U našoj verifikovanoj terminološkoj bazi vode se kao zasebni pojmovi."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0069"
      ]
    }
  },
  {
    "id": "rk-0069",
    "slug": "subgingivalna-kiretaza",
    "medicalCanonicalTerm": "subgingivalna kiretaža",
    "publicTitle": "Subgingivalna kiretaža",
    "shortDefinition": "Subgingivalna kiretaža podrazumeva uklanjanje degenerisanog i nekrotičnog epitela i vezivnog tkiva iz parodontalnog džepa radi stvaranja uslova za zarastanje i pripoj tkiva.",
    "meshPreferredTerm": "Subgingival Curettage",
    "meshId": "D013357",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D013357",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Subgingival Curettage",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d013357"
        ]
      },
      {
        "value": "kiretaža parodontalnog džepa",
        "type": "seo-alias",
        "medicallyVerified": false
      }
    ],
    "categoryId": "parodontologija",
    "verification": {
      "status": "verified",
      "tier": "B",
      "sourceIds": [
        "src-mesh-d013357",
        "src-stomf-subgingivalna-kiretaza"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d013357",
      "src-stomf-subgingivalna-kiretaza"
    ],
    "seo": {
      "primaryKeyword": "kiretaža parodontalnog džepa",
      "seoTitle": "Subgingivalna kiretaža: šta je?",
      "metaDescription": "Saznajte šta je subgingivalna kiretaža i šta podrazumeva uklanjanje promenjenog tkiva iz parodontalnog džepa.",
      "seoEntryTerm": "kiretaža parodontalnog džepa",
      "searchAliases": [
        "subgingivalna kiretaža",
        "kiretaža parodontalnog džepa"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Šta podrazumeva subgingivalna kiretaža?"
      },
      {
        "type": "p",
        "text": [
          "Subgingivalnu kiretažu ne treba automatski izjednačavati sa obradom površine korena (root planing). Povezan pojam je ",
          {
            "type": "term",
            "termId": "rk-0045",
            "text": "gingivektomija"
          },
          "."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li je subgingivalna kiretaža isto što i obrada površine korena?",
        "answer": "Ne treba ih automatski tretirati kao sinonime. MeSH Scope Note navodi da se termin ponekad koristi u vezi sa root planing-om, ali ih ne izjednačava."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0045"
      ]
    }
  }
];
