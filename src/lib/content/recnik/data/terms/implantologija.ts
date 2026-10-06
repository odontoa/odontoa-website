import type { RecnikTerm } from '../../types';

/* GENERISANO: scripts/import-recnik-json.ts (kategorija: implantologija).
   Rucne izmene su dozvoljene, ali ih sledeci import sa --overwrite moze zameniti. */
export const terms: RecnikTerm[] = [
  {
    "id": "rk-0094",
    "slug": "abatment",
    "medicalCanonicalTerm": "abatment",
    "publicTitle": "Abatment",
    "shortDefinition": "Abatment je struktura koja služi kao oslonac za fiksnu ili mobilnu stomatološku nadoknadu ili drugu protezu; MeSH uključuje prirodne zube ili korenove i druge protetske oslonce sa istom funkcijom.",
    "meshPreferredTerm": "Dental Abutments",
    "meshId": "D000044",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D000044",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Dental Abutments",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d000044"
        ]
      },
      {
        "value": "abutment",
        "type": "english",
        "medicallyVerified": false
      }
    ],
    "categoryId": "implantologija",
    "verification": {
      "status": "verified",
      "tier": "A",
      "sourceIds": [
        "src-mesh-d000044",
        "src-iss-srps-en-iso-1942"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d000044",
      "src-iss-srps-en-iso-1942"
    ],
    "seo": {
      "primaryKeyword": "abatment",
      "seoTitle": "Abatment: šta je i čemu služi?",
      "metaDescription": "Saznajte šta je abatment i kako služi kao oslonac stomatološkoj nadoknadi, uz šire značenje termina u MeSH klasifikaciji.",
      "seoEntryTerm": "abatment",
      "searchAliases": [
        "abatment",
        "abutment"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Čemu služi abatment?"
      },
      {
        "type": "p",
        "text": [
          "Termin abatment nije ograničen samo na implantni abatment. MeSH obuhvata i prirodne zube ili korenove koji služe kao oslonac, a povezan pojam je ",
          {
            "type": "term",
            "termId": "rk-0097",
            "text": "dentalni implantat"
          },
          "."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li abatment uvek znači samo deo dentalnog implantata?",
        "answer": "Ne u MeSH definiciji. Dental Abutments obuhvata i prirodne zube ili korenove koji služe kao oslonac, kao i druge protetske oslonce sa istom funkcijom."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0097"
      ]
    }
  },
  {
    "id": "rk-0097",
    "slug": "zubni-implantati",
    "medicalCanonicalTerm": "dentalni implantat",
    "publicTitle": "Zubni implantati (dentalni implantati)",
    "shortDefinition": "Dentalni implantat je biokompatibilni materijal postavljen u ili na viličnu kost radi podrške krunici, mostu ili veštačkom zubu, odnosno stabilizacije obolelog zuba.",
    "meshPreferredTerm": "Dental Implants",
    "meshId": "D015921",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D015921",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Dental Implants",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d015921"
        ]
      },
      {
        "value": "zubni implantati",
        "type": "seo-alias",
        "medicallyVerified": false
      },
      {
        "value": "zubni implanti",
        "type": "seo-alias",
        "medicallyVerified": false
      },
      {
        "value": "implant za zub",
        "type": "lay-term",
        "medicallyVerified": false
      }
    ],
    "categoryId": "implantologija",
    "verification": {
      "status": "verified",
      "tier": "A",
      "sourceIds": [
        "src-mesh-d015921",
        "src-iss-srps-en-iso-1942"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d015921",
      "src-iss-srps-en-iso-1942"
    ],
    "seo": {
      "primaryKeyword": "zubni implantati",
      "seoTitle": "Zubni implantati: šta su i čemu služe?",
      "metaDescription": "Saznajte šta je dentalni implantat, gde se postavlja i čemu služi kao podrška stomatološkoj nadoknadi.",
      "seoEntryTerm": "zubni implantati",
      "searchAliases": [
        "zubni implantati",
        "dentalni implantati",
        "zubni implanti",
        "implant za zub"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Čemu služi dentalni implantat?"
      },
      {
        "type": "p",
        "text": [
          "Dentalni implantat i stomatološka nadoknada nisu isti pojam: implantat služi kao podrška nadoknadi. Povezan pojam je ",
          {
            "type": "term",
            "termId": "rk-0094",
            "text": "abatment"
          },
          "."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li su dentalni implantat i postupak ugradnje implantata isto?",
        "answer": "Ne. MeSH Dental Implants i Dental Implantation vodi kao odvojene pojmove: prvi označava implantat, a drugi postupak implantacije."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0094"
      ]
    }
  }
];
