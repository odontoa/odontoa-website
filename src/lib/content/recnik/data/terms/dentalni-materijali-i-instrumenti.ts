import type { RecnikTerm } from '../../types';

/* GENERISANO: scripts/import-recnik-json.ts (kategorija: dentalni-materijali-i-instrumenti).
   Rucne izmene su dozvoljene, ali ih sledeci import sa --overwrite moze zameniti. */
export const terms: RecnikTerm[] = [
  {
    "id": "rk-0078",
    "slug": "lampa-za-polimerizaciju",
    "medicalCanonicalTerm": "lampa za polimerizaciju dentalnog materijala",
    "publicTitle": "Lampa za polimerizaciju dentalnog materijala",
    "shortDefinition": "Lampa za polimerizaciju je izvor svetlosti koji aktivira polimerizaciju svetlosno polimerizujućih dentalnih cementa i smola; stepen polimerizacije zavisi od vremena izlaganja, talasne dužine i intenziteta svetlosti.",
    "meshPreferredTerm": "Curing Lights, Dental",
    "meshId": "D055117",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D055117",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Curing Lights, Dental",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d055117"
        ]
      },
      {
        "value": "lampa za polimerizaciju",
        "type": "seo-alias",
        "medicallyVerified": false
      },
      {
        "value": "polimerizaciona lampa",
        "type": "seo-alias",
        "medicallyVerified": false
      }
    ],
    "categoryId": "dentalni-materijali-i-instrumenti",
    "verification": {
      "status": "verified",
      "tier": "B",
      "sourceIds": [
        "src-mesh-d055117",
        "src-alims-promet-2021"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d055117",
      "src-alims-promet-2021"
    ],
    "seo": {
      "primaryKeyword": "lampa za polimerizaciju",
      "seoTitle": "Lampa za polimerizaciju: šta je i čemu služi?",
      "metaDescription": "Saznajte šta je lampa za polimerizaciju dentalnog materijala i kako svetlost aktivira polimerizaciju dentalnih cementa i smola.",
      "seoEntryTerm": "lampa za polimerizaciju",
      "searchAliases": [
        "lampa za polimerizaciju",
        "lampa za polimerizaciju dentalnog materijala",
        "polimerizaciona lampa"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Čemu služi lampa za polimerizaciju dentalnog materijala?"
      },
      {
        "type": "p",
        "text": "LED, halogene i plazma lampe predstavljaju specifične vrste ili uže koncepte i ne treba ih izjednačavati sa celim pojmom lampe za polimerizaciju."
      }
    ],
    "faqs": [
      {
        "question": "Da li su lampa za polimerizaciju dentalnog materijala i stomatološka oprema isto?",
        "answer": "Ne treba ih automatski izjednačavati. U našoj verifikovanoj terminološkoj bazi vode se kao zasebni pojmovi."
      }
    ]
  },
  {
    "id": "rk-0083",
    "slug": "koferdam",
    "medicalCanonicalTerm": "koferdam",
    "publicTitle": "Koferdam",
    "shortDefinition": "Koferdam je gumena barijera koja se postavlja preko zuba tokom stomatoloških procedura radi izolacije radnog polja od ostatka usne duplje.",
    "meshPreferredTerm": "Rubber Dams",
    "meshId": "D016733",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D016733",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Rubber Dams",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d016733"
        ]
      },
      {
        "value": "rubber dam",
        "type": "english",
        "medicallyVerified": false
      },
      {
        "value": "kofferdam",
        "type": "seo-alias",
        "medicallyVerified": false
      }
    ],
    "categoryId": "dentalni-materijali-i-instrumenti",
    "verification": {
      "status": "verified",
      "tier": "B",
      "sourceIds": [
        "src-mesh-d016733",
        "src-stomf-koferdam"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d016733",
      "src-stomf-koferdam"
    ],
    "seo": {
      "primaryKeyword": "koferdam",
      "seoTitle": "Koferdam: šta je i čemu služi?",
      "metaDescription": "Saznajte šta je koferdam i kako služi za izolaciju radnog polja od ostatka usne duplje tokom stomatološke procedure.",
      "seoEntryTerm": "koferdam",
      "searchAliases": [
        "koferdam",
        "kofferdam",
        "rubber dam"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Čemu služi koferdam?"
      },
      {
        "type": "p",
        "text": [
          "Koferdam služi izolaciji radnog polja tokom stomatološke procedure. Često je povezan sa postupcima iz oblasti ",
          {
            "type": "term",
            "termId": "rk-0017",
            "text": "endodoncije"
          },
          ", ali nije sinonim za tu oblast."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li su koferdam i stomatološki instrument isto?",
        "answer": "Ne. MeSH Rubber Dams i Dental Instruments vodi kao odvojene pojmove."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0017"
      ]
    }
  }
];
