import type { CompletionModel } from '../domain/completion';
import type { CompletionLayout } from '../geometry/completion-layout';
import { drawSvgLabels } from '../utils/svg-label-utils';

export const drawTubing =
  ({
    tubing,
    layout,
  }: {
    tubing: CompletionModel['tubing'];
    layout: Pick<CompletionLayout, 'tubing' | 'tubingLeader' | 'tubingRiser' | 'tubingLabels' | 'labelX'>;
  }) =>
  ({ svg }: D3Props) => {
    const group = svg.append('g')
      .attr('data-component-id', tubing.id)
      .attr('data-kind', 'Tubing');
    group.append('title').text(
      `Tubing ${tubing.id}: ${tubing.purpose}; ${tubing.lifecycle}; sources: ${tubing.sources.join(', ') || 'unknown'}`
    );

    for (const [region, lines] of [['body', layout.tubing], ['head-riser', layout.tubingRiser]] as const) {
      for (const line of lines) {
        group.append('line')
          .attr('x1', line.x1).attr('y1', line.y1)
          .attr('x2', line.x2).attr('y2', line.y2)
          .attr('data-boundary', line.role)
          .attr('data-region', region)
          .attr('stroke', '#172532')
          .attr('stroke-width', line.role === 'od' ? 1.6 : 0.8);
      }
    }

    drawSvgLabels({ labels: layout.tubingLabels })({ svg: group });
    group.append('line')
      .attr('x1', layout.tubingLeader.x).attr('y1', layout.tubingLeader.y)
      .attr('x2', layout.labelX - 10).attr('y2', 80)
      .attr('stroke', '#647482').attr('stroke-width', 0.6);
  };
