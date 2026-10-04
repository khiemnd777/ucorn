import { Hole } from './../components/hole';
import type { Tubing, TubingHanger, CompletionPacker } from '../domain/completion';
import type { Crossover } from '../domain/crossover';
import type { Coupling } from '../domain/coupling';
import type { PupJoint } from '../domain/pup-joint';

export interface Unit {
  diameter: string;
  depth: string;
}

export interface WellData {
  schemaVersion?: 2;
  depthContext?: { basis: 'MD'; datumId: string };
  snapshotAt?: string;
  wellboreId?: string;
  wellName?: string;
  wellID?: string;
  unit?: Unit;
  holes: Hole[];
  components?: ({
    type: 'Casing' | 'Cement' | 'Packer' | 'Wellhead' | 'CasingHanger';
  } | Tubing | TubingHanger | CompletionPacker | Crossover | Coupling | PupJoint)[];
}
