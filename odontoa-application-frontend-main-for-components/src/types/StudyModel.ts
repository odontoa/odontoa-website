export interface SchwartzParameter {
  actual?: number;
  expected?: number;
  difference?: number;
}

export interface SchwartzAnalysis {
  upper: Record<string, SchwartzParameter>;
  lower: Record<string, SchwartzParameter>;
}

export interface MoyersValue {
  measuredValue: number;
  tableValue: number;
  difference: number;
}

export interface MoyersJawSide {
  left: MoyersValue;
  right: MoyersValue;
}

export interface MoyersAnalysis {
  upper: MoyersJawSide;
  lower: MoyersJawSide;
}

export interface BoltonJaw {
  teeth: Record<string, number>;
  total: number;
  finding: string;
}

export interface BoltonAnalysis {
  upper: BoltonJaw;
  lower: BoltonJaw;
  finding?: string;
}

export interface LundstromTooth {
  width?: number;
  segment?: string;
}

export interface LundstromSegment {
  requiredSpace?: number;
  availableSpace?: number;
  difference?: number;
}

export interface LundstromJaw {
  segments: Record<string, LundstromSegment>;
  teeth: Record<string, LundstromTooth>;
}

export interface LundstromAnalysis {
  upper: LundstromJaw;
  lower: LundstromJaw;
}

export interface Analyses {
  schwartzAnalysis: SchwartzAnalysis;
  moyersAnalysis: MoyersAnalysis;
  boltonAnalysis: BoltonAnalysis;
  lundstromAnalysis: LundstromAnalysis;
}

export interface Parameters {
  toothStatus: {
    upper: {
      [key: string]: number | null;
    }
    lower: {
      [key: string]: number | null;
    }
  };
  roToothStatus: string | null;
  upperIncisorSum: number | null;
  lowerIncisorSum: number | null;
  facialIndex: "usko" | "srednje" | "siroko" | null;
  verticalIrregularities: {
    supraposition: {
      lower: {
        [key: string]: boolean;
      },
      upper: {
        [key: string]: boolean;
      }
    }
    infraposition: {
      lower: {
        [key: string]: boolean;
      },
      upper: {
        [key: string]: boolean;
      }
    }
  };
}

export interface StudyModel {
  id: number;
  patientMedicalCardId: number;
  analyses: Analyses;
  parameters: Parameters;
  updatedAt?: string;
}
