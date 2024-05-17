interface Underreamed {
  diameter: number;
  startDepth: number;
  endDepth: number;
}

export interface Hole {
  holeID?: string;
  diameter: number;
  depth: number;
  underreamed?: Underreamed[];
}

interface Segment {
  segmentID?: string;
  diameter: number;
  length: number;
}

interface Tieback {
  tiebackID?: string;
  tiebackType?: 'Casing Extension' | 'Well Deepening' | 'Well Reinforcement';
  startDepth: number;
  segments: Segment[];
}

interface Casing {
  type: 'Casing';
  casingID?: string;
  refHoleID?: string;
  pipeType:
    | 'Conductor Casing'
    | 'Surface Casing'
    | 'Intermediate Casing'
    | 'Production Casing'
    | 'Drilling Liner'
    | 'Production Liner';
  startDepth: number;
  segments: Segment[];
  tieback?: Tieback;
  shoe?: boolean;
}

interface Unit {
  diameter: string;
  depth: string;
}

interface WellData {
  wellName?: string;
  wellID?: string;
  unit?: Unit;
  holes: Hole[];
  components?: {
    type: 'Casing' | 'Cement' | 'Packer' | 'Wellhead' | 'CasingHanger';
  }[];
}
