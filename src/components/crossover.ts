import type { NormalizedCrossover } from '../domain/crossover';
import type { CrossoverPrimitive } from '../geometry/crossover-layout';
import { drawSvgLabels } from '../utils/svg-label-utils';

export const drawCrossover =
  ({ crossover, layout, labelX }: {
    crossover: NormalizedCrossover;
    layout: CrossoverPrimitive;
    labelX: number;
  }) =>
  ({ svg }: D3Props) => {
    const group = svg.append('g')
      .attr('data-component-id', crossover.id).attr('data-kind', 'Crossover')
      .attr('data-tubing-id', crossover.tubingId)
      .attr('data-from-segment-id', crossover.fromSegmentId)
      .attr('data-to-segment-id', crossover.toSegmentId)
      .attr('data-at-md', crossover.at);
    group.append('title').text(
      `Crossover ${crossover.id}: ${crossover.fromSegmentId} / ${crossover.toSegmentId}; ${crossover.lifecycle}; ${crossover.verification}; sources: ${crossover.sources.join(', ') || 'unknown'}`
    );
    for (const line of layout.lines) {
      group.append('line')
        .attr('data-boundary', line.role)
        .attr('x1', line.x1).attr('y1', line.y1)
        .attr('x2', line.x2).attr('y2', line.y2)
        .attr('stroke', '#172532')
        .attr('stroke-width', line.role === 'od' ? 1.6 : 0.8);
    }
    drawSvgLabels({ labels: layout.labels })({ svg: group });
    const outer = Math.max(...layout.lines.filter(line => line.role === 'od').map(line => (line.x1 + line.x2) / 2));
    group.append('line')
      .attr('data-role', 'label-leader')
      .attr('x1', outer).attr('y1', layout.atY)
      .attr('x2', labelX - 10).attr('y2', layout.labels[0].y - 4)
      .attr('stroke', '#647482').attr('stroke-width', 0.6);
  };
