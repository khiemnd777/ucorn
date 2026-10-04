import type { NormalizedCoupling } from '../domain/coupling';
import type { CouplingPrimitive } from '../geometry/coupling-layout';
import { drawSvgLabels } from '../utils/svg-label-utils';

export const drawCoupling =
  ({ coupling, layout, labelX }: { coupling: NormalizedCoupling; layout: CouplingPrimitive; labelX: number }) =>
  ({ svg }: D3Props) => {
    const group = svg.append('g')
      .attr('data-component-id', coupling.id).attr('data-kind', 'Coupling')
      .attr('data-tubing-id', coupling.tubingId)
      .attr('data-from-segment-id', coupling.fromSegmentId).attr('data-to-segment-id', coupling.toSegmentId)
      .attr('data-at-md', coupling.at).attr('data-body-od-mm', coupling.od);
    group.append('title').text(`Coupling ${coupling.id}; ${coupling.lifecycle}; ${coupling.verification}; sources: ${coupling.sources.join(', ') || 'unknown'}`);
    for (const [region, lines] of [['physical', layout.lines], ['detail', layout.detailLines]] as const) {
      for (const line of lines) {
        group.append('line').attr('data-region', region).attr('data-boundary', line.role)
          .attr('x1', line.x1).attr('y1', line.y1).attr('x2', line.x2).attr('y2', line.y2)
          .attr('stroke', '#172532').attr('stroke-width', line.role === 'od' ? 1.6 : 0.8);
      }
    }
    drawSvgLabels({ labels: layout.detailLabels })({ svg: group });
    drawSvgLabels({ labels: layout.labels })({ svg: group });
    group.append('line').attr('data-role', 'label-leader')
      .attr('x1', layout.leaderX).attr('y1', layout.atY)
      .attr('x2', labelX - 10).attr('y2', layout.labels[0].y - 4)
      .attr('stroke', '#647482').attr('stroke-width', 0.6);
  };
