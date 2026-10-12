import type { NormalizedSealBore } from '../domain/seal-bore';
import type { ToolPrimitive } from '../geometry/completion-tool-layout';
import { drawToolPrimitives } from '../utils/svg-tool-utils';

export const drawSealBore = ({ sealBore, layout, labelX }: { sealBore: NormalizedSealBore; layout: ToolPrimitive; labelX: number }) =>
  ({ svg }: D3Props) => {
    const group = svg.append('g').attr('data-kind', 'SealBore').attr('data-component-id', sealBore.id)
      .attr('data-owner-id', sealBore.ownerId).attr('data-variant', sealBore.variant)
      .attr('data-top-md', sealBore.top).attr('data-bottom-md', sealBore.bottom);
    group.append('title').text(`Seal Bore ${sealBore.id}; ${sealBore.lifecycle}; ${sealBore.verification}; sources: ${sealBore.sources.join(', ') || 'unknown'}`);
    drawToolPrimitives({ layout, labelX })({ svg: group });
  };
