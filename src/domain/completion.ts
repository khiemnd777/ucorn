import type { NormalizedCrossover } from './crossover';
import type { NormalizedCoupling } from './coupling';
import type { NormalizedPupJoint } from './pup-joint';
import type { CompletionMetadata, NormalizedSegment, Quantity } from './completion-types';
export type { CompletionMetadata, NormalizedSegment, Quantity } from './completion-types';

/** Physical domain only. Lengths/depths are metres; diameters are millimetres. */
export interface Tubing extends CompletionMetadata {
  type: 'Tubing';
  purpose: 'production' | 'injection';
  top: Quantity;
  segments: { id: string; od: Quantity; innerDiameter?: Quantity; length: Quantity }[];
  hostSpans: { hostId: string; top: Quantity; bottom: Quantity }[];
}
export interface TubingHanger extends CompletionMetadata {
  type: 'TubingHanger';
  tubingId: string;
  headId: string;
  seatId: string;
}
export interface HeadSeat { id: string; at: Quantity }
export const PACKER_ROLES = ['production', 'liner-top', 'isolation', 'test'] as const;
export interface CompletionPacker extends CompletionMetadata {
  type: 'CompletionPacker';
  role: typeof PACKER_ROLES[number];
  innerConduitId: string;
  outerHostId: string;
  top: Quantity;
  bottom: Quantity;
  setState: 'set' | 'unset' | 'unknown';
  retrievable?: boolean;
}
export interface NormalizedPacker extends Omit<CompletionPacker, 'top' | 'bottom'> {
  top: number; bottom: number;
  innerOD: number;
  outerDiameter: number;
  fit: 'clearance-checked' | 'unresolved';
}
export interface Diagnostic {
  code: string; path: string; componentId?: string;
  message: string; severity: 'error' | 'warning';
}
export class InputValidationError extends Error {
  constructor(public readonly diagnostics: Diagnostic[]) {
    super('Invalid well data.');
  }
}
export interface CompletionModel {
  wellboreId: string;
  datumId: string;
  snapshotAt: string;
  tubing: Omit<Tubing, 'top' | 'segments' | 'hostSpans'> & {
    top: number; bottom: number; segments: NormalizedSegment[];
    hostSpans: { hostId: string; top: number; bottom: number }[];
  };
  hanger?: TubingHanger & { at: number; headDiameter: number };
  packers: NormalizedPacker[];
  crossovers: NormalizedCrossover[];
  couplings: NormalizedCoupling[];
  pupJoints: NormalizedPupJoint[];
  diagnostics: Diagnostic[];
}
