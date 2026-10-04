import type { NormalizedPacker } from '../domain/completion';
import type { PackerPrimitive } from '../geometry/completion-layout';
import { drawSvgLabels } from '../utils/svg-label-utils';

export const drawCompletionPacker =
  ({
    packer,
    layout,
    labelX,
  }: {
    packer: NormalizedPacker;
    layout: PackerPrimitive;
    labelX: number;
  }) =>
  ({ svg }: D3Props) => {
    const group = svg.append('g')
      .attr('data-component-id', packer.id)
      .attr('data-kind', 'CompletionPacker')
      .attr('data-role', packer.role)
      .attr('data-set-state', packer.setState)
      .attr('data-inner-conduit-id', packer.innerConduitId)
      .attr('data-outer-host-id', packer.outerHostId)
      .attr('data-top-md', packer.top).attr('data-bottom-md', packer.bottom);
    group.append('title').text(
      `${packer.role} packer ${packer.id}; ${packer.setState}; ${packer.lifecycle}; ${packer.verification}; sources: ${packer.sources.join(', ') || 'unknown'}`
    );

    const showSeal = packer.setState === 'set' && packer.fit !== 'unresolved';
    for (const [index, block] of layout.blocks.entries()) {
      group.append('rect')
        .attr('data-side', index === 0 ? 'left' : 'right')
        .attr('x', block.x).attr('y', block.y)
        .attr('width', block.width).attr('height', block.height)
        .attr('fill', showSeal ? '#d8dee3' : 'none')
        .attr('stroke', '#172532').attr('stroke-width', 1.2);
      if (showSeal) {
        for (const flip of [false, true]) {
          group.append('line')
            .attr('x1', block.x).attr('y1', block.y + (flip ? block.height : 0))
            .attr('x2', block.x + block.width).attr('y2', block.y + (flip ? 0 : block.height))
            .attr('stroke', '#172532').attr('stroke-width', 0.8);
        }
      }
    }

    drawSvgLabels({ labels: layout.labels })({ svg: group });
    const right = layout.blocks[1];
    group.append('line')
      .attr('data-role', 'label-leader')
      .attr('x1', right.x + right.width)
      .attr('y1', (layout.physicalTopY + layout.physicalBottomY) / 2)
      .attr('x2', labelX - 10).attr('y2', layout.labels[0].y - 4)
      .attr('stroke', '#647482').attr('stroke-width', 0.6);
  };
