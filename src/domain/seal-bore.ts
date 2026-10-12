import type { CompletionMetadata, Quantity, NormalizedSegment } from './completion-types';

export interface SealBore extends CompletionMetadata {
  type: 'SealBore';
  variant: 'seal-bore' | 'pbr';
  ownerId: string;
  top: Quantity; bottom: Quantity;
  od: Quantity; innerDiameter?: Quantity;
  profile?: string;
}
export interface NormalizedSealBore extends Omit<SealBore, 'top' | 'bottom' | 'od' | 'innerDiameter'> {
  top: number; bottom: number; od: number; innerDiameter?: number;
  hostId: string;
  fit: 'clearance-checked' | 'unresolved';
}
export interface SealAssembly extends CompletionMetadata {
  type: 'SealAssembly';
  tubingId: string; segmentId: string; receptacleId: string;
  top: Quantity; bottom: Quantity;
  engagement: 'engaged' | 'partial' | 'disengaged' | 'unknown';
  profile?: string;
}
export interface NormalizedSealAssembly extends Omit<SealAssembly, 'top' | 'bottom'> {
  top: number; bottom: number;
  segment: NormalizedSegment;
  overlapLength: number;
  fit: 'clearance-checked' | 'unresolved';
}
