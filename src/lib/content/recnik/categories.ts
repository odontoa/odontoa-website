import type { RecnikCategory } from './types';

/* Registar kategorija recnika. Filteri na /recnik i stranice /recnik/kategorija/[slug] se
   generisu odavde, i to samo za kategorije koje imaju bar jedan objavljen pojam.

   shortDescription, seoTitle i metaDescription su namerno prazni: dodaju se tek uz odobren
   tekst. Do tada je stranica kategorije noindex (indexable nije true). */
export const RECNIK_CATEGORIES: RecnikCategory[] = [
  { id: 'dijagnoze', slug: 'dijagnoze', title: 'Dijagnoze', order: 10 },
  { id: 'anatomija', slug: 'anatomija', title: 'Anatomija', order: 20 },
  { id: 'konzervativna-stomatologija', slug: 'konzervativna-stomatologija', title: 'Konzervativna stomatologija', order: 30 },
  { id: 'endodoncija', slug: 'endodoncija', title: 'Endodoncija', order: 40 },
  { id: 'parodontologija', slug: 'parodontologija', title: 'Parodontologija', order: 50 },
  { id: 'oralna-hirurgija', slug: 'oralna-hirurgija', title: 'Oralna hirurgija', order: 60 },
  { id: 'implantologija', slug: 'implantologija', title: 'Implantologija', order: 70 },
  { id: 'protetika', slug: 'protetika', title: 'Protetika', order: 80 },
  { id: 'ortodoncija', slug: 'ortodoncija', title: 'Ortodoncija', order: 90 },
  { id: 'radiologija', slug: 'radiologija', title: 'Radiologija', order: 100 },
  {
    id: 'dentalni-materijali-i-instrumenti',
    slug: 'dentalni-materijali-i-instrumenti',
    title: 'Dentalni materijali i instrumenti',
    order: 110,
  },
  { id: 'digitalna-stomatologija', slug: 'digitalna-stomatologija', title: 'Digitalna stomatologija', order: 120 },
  { id: 'administracija-ordinacije', slug: 'administracija-ordinacije', title: 'Administracija ordinacije', order: 130 },
  { id: 'upravljanje-ordinacijom', slug: 'upravljanje-ordinacijom', title: 'Upravljanje ordinacijom', order: 140 },
];
