import type { CompletionMetadata, NormalizedSegment } from './completion-types';

/** Classifies an existing physical tubing segment; never adds its length twice. */
export interface PupJoint extends CompletionMetadata {
  type: 'PupJoint';
  tubingId: string;
  segmentId: string;
  fromConnection?: string;
  toConnection?: string;
}

export interface NormalizedPupJoint extends PupJoint {
  segment: NormalizedSegment;
}
