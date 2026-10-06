import type { RecnikReviewer } from '../types';

/* Registar strucnih recenzenata. Recenzent se prikazuje na stranici pojma samo ako postoji
   ovde, aktivan je i pojam ima clinicalReview.status "approved" sa njegovim reviewerId.
   Puni ga scripts/import-recnik-json.ts; rucne izmene su dozvoljene. */
export const RECNIK_REVIEWERS: RecnikReviewer[] = [];
