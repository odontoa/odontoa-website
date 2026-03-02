import { z } from "zod";

export const cephalometricAnalysisSchema = z.object({
  measurements: z.object({
    snaAngle: z.string().nullable().optional(),
    snbAngle: z.string().nullable().optional(),
    anbAngle: z.string().nullable().optional(),
    snSppAngle: z.string().nullable().optional(),
    snMpAngle: z.string().nullable().optional(),
    sppMpAngle: z.string().nullable().optional(),
    nsarAngle: z.string().nullable().optional(),
    sargoAngle: z.string().nullable().optional(),
    argomeAngle: z.string().nullable().optional(),
    bjorkPolygonSum: z.string().nullable().optional(),
    sgoLength: z.string().nullable().optional(),
    nmeLength: z.string().nullable().optional(),
    sgoNmeRatio: z.string().nullable().optional(),
    iSppAngle: z.string().nullable().optional(),
    iMpAngle: z.string().nullable().optional(),
    iiAngle: z.string().nullable().optional(),
    nseLength: z.string().nullable().optional(),
    corpusMaxillaLength: z.string().nullable().optional(),
    corpusMandibleLength: z.string().nullable().optional(),
    ramusMandibleLength: z.string().nullable().optional(),
  }),
  xrayImage: z.instanceof(File).nullable().optional(),
  finding: z.string().nullable().optional(),
});

export type CephalometricAnalysisFormData = z.infer<typeof cephalometricAnalysisSchema>; 