import type { RecnikTerm } from '../../types';

/* GENERISANO: scripts/import-recnik-json.ts (kategorija: ortodoncija).
   Rucne izmene su dozvoljene, ali ih sledeci import sa --overwrite moze zameniti. */
export const terms: RecnikTerm[] = [
  {
    "id": "rk-0109",
    "slug": "fiksni-ortodontski-aparat",
    "medicalCanonicalTerm": "fiksni ortodontski aparat",
    "publicTitle": "Fiksni ortodontski aparat (fiksna proteza)",
    "shortDefinition": "Fiksni ortodontski aparat je ortodontski uređaj pričvršćen za zube adhezivnim materijalom koji pacijent ne može sam da ukloni; silama deluje na zube i potporne strukture.",
    "meshPreferredTerm": "Orthodontic Appliances, Fixed",
    "meshId": "D000077744",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D000077744",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Orthodontic Appliances, Fixed",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d000077744"
        ]
      },
      {
        "value": "fiksna proteza",
        "type": "lay-term",
        "medicallyVerified": false
      },
      {
        "value": "fiksni aparat",
        "type": "lay-term",
        "medicallyVerified": false
      },
      {
        "value": "proteza za ispravljanje zuba",
        "type": "lay-term",
        "medicallyVerified": false
      }
    ],
    "categoryId": "ortodoncija",
    "verification": {
      "status": "verified",
      "tier": "A",
      "sourceIds": [
        "src-mesh-d000077744",
        "src-iss-srps-en-iso-1942"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d000077744",
      "src-iss-srps-en-iso-1942"
    ],
    "seo": {
      "primaryKeyword": "fiksni ortodontski aparat",
      "seoTitle": "Fiksni ortodontski aparat (fiksna proteza): šta je?",
      "metaDescription": "Saznajte šta je fiksni ortodontski aparat, kako je pričvršćen za zube i kako se izraz „fiksna proteza“ koristi u pacijentskom jeziku.",
      "seoEntryTerm": "fiksni ortodontski aparat",
      "searchAliases": [
        "fiksna proteza",
        "fiksni aparat",
        "fiksni ortodontski aparat",
        "proteza za ispravljanje zuba"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Čemu služi fiksni ortodontski aparat?"
      },
      {
        "type": "p",
        "text": [
          "Fiksni ortodontski aparat pripada ortodontskim aparatima. Povezan pojam je ",
          {
            "type": "term",
            "termId": "rk-0112",
            "text": "ritejner"
          },
          ", koji služi održavanju postignutog položaja nakon ortodontske terapije."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li fiksni ortodontski aparat pacijent može sam da ukloni?",
        "answer": "U MeSH definiciji fiksni ortodontski aparati su pričvršćeni za zube i pacijent ih ne može sam ukloniti iz usta."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0112"
      ]
    }
  },
  {
    "id": "rk-0112",
    "slug": "ritejner",
    "medicalCanonicalTerm": "ritejner",
    "publicTitle": "Ritejner za zube (retainer)",
    "shortDefinition": "Ritejner je fiksni ili mobilni ortodontski aparat koji služi održavanju zuba i vilica u položajima postignutim ortodontskom terapijom tokom perioda funkcionalne adaptacije.",
    "meshPreferredTerm": "Orthodontic Retainers",
    "meshId": "D018704",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D018704",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Orthodontic Retainers",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d018704"
        ]
      },
      {
        "value": "ritejner za zube",
        "type": "seo-alias",
        "medicallyVerified": false
      },
      {
        "value": "retainer",
        "type": "seo-alias",
        "medicallyVerified": false
      },
      {
        "value": "retencioni aparat",
        "type": "seo-alias",
        "medicallyVerified": false
      }
    ],
    "categoryId": "ortodoncija",
    "verification": {
      "status": "verified",
      "tier": "A",
      "sourceIds": [
        "src-mesh-d018704",
        "src-iss-srps-en-iso-1942"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d018704",
      "src-iss-srps-en-iso-1942"
    ],
    "seo": {
      "primaryKeyword": "retainer za zube",
      "seoTitle": "Ritejner za zube: šta je i čemu služi?",
      "metaDescription": "Saznajte šta je ritejner, koje fiksne i mobilne oblike obuhvata i čemu služi nakon ortodontske terapije.",
      "seoEntryTerm": "retainer za zube",
      "searchAliases": [
        "ritejner",
        "ritejner za zube",
        "retainer",
        "retainer za zube",
        "retencioni aparat"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Čemu služi ritejner?"
      },
      {
        "type": "p",
        "text": [
          "Ritejner može biti fiksni ili mobilni. Među povezanim pojmovima je ",
          {
            "type": "term",
            "termId": "rk-0109",
            "text": "fiksni ortodontski aparat"
          },
          ", ali ta dva pojma ne treba izjednačavati."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li ritejner može biti fiksni i mobilni?",
        "answer": "Da. MeSH definicija ortodontskih ritejnera obuhvata i fiksne i mobilne aparate za održavanje postignutog položaja."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0109"
      ]
    }
  }
];
