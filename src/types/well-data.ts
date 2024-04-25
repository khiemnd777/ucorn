import { Hole } from './../components/hole';

export interface Unit {
  diameter: string;
  depth: string;
}

export interface WellData {
  wellName?: string;
  wellID?: string;
  unit?: Unit;
  holes: Hole[];
  components?: {
    type: 'Casing' | 'Packer' | 'Wellhead' | 'CasingHanger';
  }[];
}
