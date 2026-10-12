import type { CompletionMetadata, Quantity, NormalizedSegment } from './completion-types';

export interface LandingNipple extends CompletionMetadata {
  type: 'LandingNipple';
  tubingId: string; segmentId: string;
  profileType: 'selective' | 'no-go' | 'ported' | 'unknown';
  profile?: string;
  sealBoreDiameter?: Quantity;
  noGoDiameter?: Quantity;
}
export interface NormalizedLandingNipple extends Omit<LandingNipple, 'sealBoreDiameter' | 'noGoDiameter'> {
  segment: NormalizedSegment;
  sealBoreDiameter?: number;
  noGoDiameter?: number;
}
