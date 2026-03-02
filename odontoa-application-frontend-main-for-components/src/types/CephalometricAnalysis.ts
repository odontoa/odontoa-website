export interface CephalometricAnalysis {
  id: number;
  patientId?: number;
  measurements: {
    snaAngle?: number;
    snbAngle?: number;
    anbAngle?: number;
    snSppAngle?: number;
    snMpAngle?: number;
    sppMpAngle?: number;
    nsarAngle?: number;
    sargoAngle?: number;
    argomeAngle?: number;
    bjorkPolygonSum?: number;
    sgoLength?: number;
    nmeLength?: number;
    sgoNmeRatio?: number;
    iSppAngle?: number;
    iMpAngle?: number;
    iiAngle?: number;
    nseLength?: number;
    corpusMaxillaLength?: number;
    corpusMandibleLength?: number;
    ramusMandibleLength?: number;
  };
  updatedAt: Date;
  xrayImageUrl: string;
  finding: string;
}
