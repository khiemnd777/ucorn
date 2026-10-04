import type { CompletionModel } from '../domain/completion';
import type { CompletionLayout } from '../geometry/completion-layout';
import { hangerPath } from '../geometry/hanger-profile';
import { drawSvgLabels } from '../utils/svg-label-utils';

export const drawTubingHanger =
  ({
    tubingHanger,
    layout,
  }: {
    tubingHanger: NonNullable<CompletionModel['hanger']>;
    layout: Pick<CompletionLayout, 'hanger' | 'hangerLabels' | 'labelX'>;
  }) =>
  ({ svg }: D3Props) => {
    const group = svg.append('g')
      .attr('data-component-id', tubingHanger.id)
      .attr('data-kind', 'TubingHanger');
    group.append('title').text(
      `${tubingHanger.id} supports ${tubingHanger.tubingId} at ${tubingHanger.headId}/${tubingHanger.seatId}; seal unknown; sources: ${tubingHanger.sources.join(', ') || 'unknown'}`
    );

    for (const polygon of layout.hanger) {
      group.append('path')
        .attr('d', hangerPath(polygon.points))
        .attr('fill', '#e0e5e9')
        .attr('stroke', '#172532').attr('stroke-width', 1.4);
    }

    drawSvgLabels({ labels: layout.hangerLabels })({ svg: group });
    group.append('line')
      .attr('x1', layout.hanger[1].leaderAnchor.x)
      .attr('y1', layout.hanger[1].leaderAnchor.y)
      .attr('x2', layout.labelX - 10)
      .attr('y2', layout.hangerLabels[0].y - 4)
      .attr('stroke', '#647482').attr('stroke-width', 0.6);
  };
