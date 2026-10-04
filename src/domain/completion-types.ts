/** Shared physical contracts; lengths/depths are metres, diameters millimetres after normalization. */
export interface Quantity { value: number; unit: 'm' | 'ft' | 'in' | 'mm' }
export interface CompletionMetadata {
  id: string;
  label?: string;
  lifecycle: 'planned' | 'installed' | 'removed' | 'unknown';
  sources: string[];
  verification: 'verified' | 'unverified' | 'conflicting';
}
export interface NormalizedSegment {
  id: string; top: number; bottom: number; od: number; innerDiameter?: number;
}
