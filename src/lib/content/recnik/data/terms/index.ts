/* GENERISANO: scripts/import-recnik-json.ts prepisuje ovaj fajl pri svakom importu.
   Spisak fajlova sa terminima po kategoriji (data/terms/<categoryId>.ts). */
import type { RecnikTerm } from '../../types';
import { terms as terms_dentalni_materijali_i_instrumenti } from './dentalni-materijali-i-instrumenti';
import { terms as terms_digitalna_stomatologija } from './digitalna-stomatologija';
import { terms as terms_endodoncija } from './endodoncija';
import { terms as terms_implantologija } from './implantologija';
import { terms as terms_oralna_hirurgija } from './oralna-hirurgija';
import { terms as terms_ortodoncija } from './ortodoncija';
import { terms as terms_parodontologija } from './parodontologija';
import { terms as terms_protetika } from './protetika';

export const TERM_FILES: RecnikTerm[][] = [terms_dentalni_materijali_i_instrumenti, terms_digitalna_stomatologija, terms_endodoncija, terms_implantologija, terms_oralna_hirurgija, terms_ortodoncija, terms_parodontologija, terms_protetika];
