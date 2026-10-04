import type { CompletionMetadata, NormalizedSegment, Quantity } from './completion-types';

export interface Coupling extends CompletionMetadata {
  type: 'Coupling';
  tubingId: string;
  fromSegmentId: string;
  toSegmentId: string;
  at: Quantity;
  od: Quantity;
  innerDiameter?: Quantity;
  fromConnection?: string;
  toConnection?: string;
}

export interface NormalizedCoupling extends Omit<Coupling, 'at' | 'od' | 'innerDiameter'> {
  at: number;
  od: number;
  innerDiameter?: number;
  from: NormalizedSegment;
  to: NormalizedSegment;
  fit: 'clearance-checked' | 'unresolved';
}
