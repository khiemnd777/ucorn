import type { NormalizedLandingNipple } from '../domain/landing-nipple';
import type { ToolPrimitive } from '../geometry/completion-tool-layout';
import { drawToolPrimitives } from '../utils/svg-tool-utils';

export const drawLandingNipple = ({ landingNipple, layout, labelX }: { landingNipple: NormalizedLandingNipple; layout: ToolPrimitive; labelX: number }) =>
  ({ svg }: D3Props) => {
    const s = landingNipple.segment;
    const group = svg.append('g').attr('data-kind', 'LandingNipple').attr('data-component-id', landingNipple.id)
      .attr('data-segment-id', landingNipple.segmentId).attr('data-profile-type', landingNipple.profileType)
      .attr('data-top-md', s.top).attr('data-bottom-md', s.bottom).attr('data-length-m', s.bottom - s.top);
    group.append('title').text(`Landing Nipple ${landingNipple.id}; ${landingNipple.lifecycle}; ${landingNipple.verification}; sources: ${landingNipple.sources.join(', ') || 'unknown'}`);
    drawToolPrimitives({ layout, labelX })({ svg: group });
  };
