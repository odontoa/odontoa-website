import type { RecnikTerm } from '../../types';

/* GENERISANO: scripts/import-recnik-json.ts (kategorija: digitalna-stomatologija).
   Rucne izmene su dozvoljene, ali ih sledeci import sa --overwrite moze zameniti. */
export const terms: RecnikTerm[] = [
  {
    "id": "rk-0086",
    "slug": "dentalna-fotografija",
    "medicalCanonicalTerm": "dentalna fotografija",
    "publicTitle": "Dentalna fotografija",
    "shortDefinition": "Dentalna fotografija obuhvata fotografske tehnike koje se koriste u ortodonciji, estetskoj stomatologiji i edukaciji pacijenata.",
    "meshPreferredTerm": "Photography, Dental",
    "meshId": "D023861",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D023861",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Photography, Dental",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d023861"
        ]
      },
      {
        "value": "fotografisanje zuba",
        "type": "seo-alias",
        "medicallyVerified": false
      },
      {
        "value": "fotografije zuba",
        "type": "seo-alias",
        "medicallyVerified": false
      }
    ],
    "categoryId": "digitalna-stomatologija",
    "verification": {
      "status": "verified",
      "tier": "B",
      "sourceIds": [
        "src-mesh-d023861",
        "src-nis-dentalna-fotografija-2022"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d023861",
      "src-nis-dentalna-fotografija-2022"
    ],
    "seo": {
      "primaryKeyword": "fotografisanje zuba",
      "seoTitle": "Dentalna fotografija: značenje u stomatologiji",
      "metaDescription": "Saznajte šta znači dentalna fotografija i kako se fotografske tehnike koriste u ortodonciji, estetskoj stomatologiji i edukaciji pacijenata.",
      "seoEntryTerm": "fotografisanje zuba",
      "searchAliases": [
        "dentalna fotografija",
        "fotografisanje zuba",
        "fotografije zuba"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Šta pojam „dentalna fotografija“ znači u stomatologiji?"
      },
      {
        "type": "p",
        "text": "Intraoralna fotografija je uži ili povezani koncept u odnosu na širu dentalnu fotografiju i ne treba je automatski tretirati kao potpuni sinonim."
      }
    ],
    "faqs": [
      {
        "question": "Da li je dentalna fotografija isto što i intraoralna fotografija?",
        "answer": "Ne treba ih automatski izjednačavati. U MeSH strukturi intraoralna fotografija je uži ili povezani koncept u odnosu na širu dentalnu fotografiju."
      }
    ],
    "links": {
      "featureSlugs": [
        "rtg-i-fotografije"
      ]
    }
  }
];
