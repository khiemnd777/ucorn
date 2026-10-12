import type { NormalizedSealAssembly } from '../domain/seal-bore';
import type { ToolPrimitive } from '../geometry/completion-tool-layout';
import { drawToolPrimitives } from '../utils/svg-tool-utils';

export const drawSealAssembly = ({ sealAssembly, layout, labelX }: { sealAssembly: NormalizedSealAssembly; layout: ToolPrimitive; labelX: number }) =>
  ({ svg }: D3Props) => {
    const group = svg.append('g').attr('data-kind', 'SealAssembly').attr('data-component-id', sealAssembly.id)
      .attr('data-receptacle-id', sealAssembly.receptacleId).attr('data-segment-id', sealAssembly.segmentId)
      .attr('data-engagement', sealAssembly.engagement).attr('data-overlap-m', sealAssembly.overlapLength)
      .attr('data-top-md', sealAssembly.top).attr('data-bottom-md', sealAssembly.bottom);
    group.append('title').text(`Seal Assembly ${sealAssembly.id}; ${sealAssembly.lifecycle}; ${sealAssembly.verification}; sources: ${sealAssembly.sources.join(', ') || 'unknown'}`);
    drawToolPrimitives({ layout, labelX })({ svg: group });
  };
