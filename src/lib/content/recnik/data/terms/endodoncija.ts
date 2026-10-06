import type { RecnikTerm } from '../../types';

/* GENERISANO: scripts/import-recnik-json.ts (kategorija: endodoncija).
   Rucne izmene su dozvoljene, ali ih sledeci import sa --overwrite moze zameniti. */
export const terms: RecnikTerm[] = [
  {
    "id": "rk-0017",
    "slug": "endodoncija",
    "medicalCanonicalTerm": "endodoncija",
    "publicTitle": "Endodoncija",
    "shortDefinition": "Endodoncija je stomatološka oblast usmerena na očuvanje zdravlja zubne pulpe i lečenje pulpne komore i kanala korena.",
    "meshPreferredTerm": "Endodontics",
    "meshId": "D004708",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D004708",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Endodontics",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d004708"
        ]
      }
    ],
    "categoryId": "endodoncija",
    "verification": {
      "status": "verified",
      "tier": "A",
      "sourceIds": [
        "src-mesh-d004708",
        "src-iss-srps-en-iso-1942"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d004708",
      "src-iss-srps-en-iso-1942"
    ],
    "seo": {
      "primaryKeyword": "endodoncija",
      "seoTitle": "Endodoncija: šta je i čime se bavi?",
      "metaDescription": "Saznajte šta je endodoncija, čime se bavi i kako se razlikuje od pojedinačnih endodontskih procedura.",
      "seoEntryTerm": "endodoncija",
      "searchAliases": [
        "endodoncija"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Čime se bavi endodoncija?"
      },
      {
        "type": "p",
        "text": [
          "Endodoncija je šira stomatološka oblast, dok su pojedinačne procedure zasebni koncepti. Jedan takav pojam je ",
          {
            "type": "term",
            "termId": "rk-0040",
            "text": "pulpotomija"
          },
          "."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li je endodoncija isto što i jedna endodontska procedura?",
        "answer": "Ne. Endodoncija je šira stomatološka oblast, dok se pojedinačne procedure, kao što su pulpotomija ili apeksifikacija, vode kao zasebni pojmovi."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0040"
      ]
    }
  },
  {
    "id": "rk-0040",
    "slug": "pulpotomija",
    "medicalCanonicalTerm": "pulpotomija",
    "publicTitle": "Pulpotomija",
    "shortDefinition": "Pulpotomija je stomatološka procedura u kojoj se uklanja deo pulpe iz kruničnog dela zuba.",
    "meshPreferredTerm": "Pulpotomy",
    "meshId": "D011672",
    "meshUrl": "https://meshb.nlm.nih.gov/record/ui?ui=D011672",
    "meshMatch": "exact",
    "aliases": [
      {
        "value": "Pulpotomy",
        "type": "english",
        "medicallyVerified": true,
        "sourceIds": [
          "src-mesh-d011672"
        ]
      },
      {
        "value": "pulpotomija zuba",
        "type": "seo-alias",
        "medicallyVerified": false
      }
    ],
    "categoryId": "endodoncija",
    "verification": {
      "status": "verified",
      "tier": "A",
      "sourceIds": [
        "src-mesh-d011672",
        "src-iss-srps-en-iso-1942"
      ]
    },
    "clinicalReview": {
      "status": "pending"
    },
    "publicationStatus": "ready-for-review",
    "sourceIds": [
      "src-mesh-d011672",
      "src-iss-srps-en-iso-1942"
    ],
    "seo": {
      "primaryKeyword": "pulpotomija",
      "seoTitle": "Pulpotomija: šta je i šta podrazumeva?",
      "metaDescription": "Saznajte šta je pulpotomija, koji deo zubne pulpe se uklanja i kako se ovaj termin razlikuje od pulpektomije.",
      "seoEntryTerm": "pulpotomija",
      "searchAliases": [
        "pulpotomija",
        "pulpotomija zuba"
      ]
    },
    "article": [
      {
        "type": "h2",
        "text": "Šta podrazumeva pulpotomija?"
      },
      {
        "type": "p",
        "text": [
          "Pulpotomija je pojedinačna procedura u okviru šire oblasti ",
          {
            "type": "term",
            "termId": "rk-0017",
            "text": "endodoncije"
          },
          ". MeSH je vodi odvojeno od pulpektomije."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Da li su pulpotomija i pulpektomija isto?",
        "answer": "Ne. MeSH ih vodi kao zasebne endodontske procedure. Pulpotomija podrazumeva uklanjanje dela pulpe iz kruničnog dela zuba."
      }
    ],
    "links": {
      "relatedTermIds": [
        "rk-0017"
      ]
    }
  }
];
