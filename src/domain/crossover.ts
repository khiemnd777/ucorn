import type { CompletionMetadata, NormalizedSegment, Quantity } from './completion-types';

export interface Crossover extends CompletionMetadata {
  type: 'Crossover';
  tubingId: string;
  fromSegmentId: string;
  toSegmentId: string;
  at: Quantity;
  fromConnection?: string;
  toConnection?: string;
}

/** Point attachment; a display glyph never adds physical tubing length. */
export interface NormalizedCrossover extends Omit<Crossover, 'at'> {
  at: number;
  from: NormalizedSegment;
  to: NormalizedSegment;
}
