import type { ToolPrimitive } from '../geometry/completion-tool-layout';
import { drawSvgLabels } from './svg-label-utils';

export const drawToolPrimitives = ({ layout, labelX }: { layout: ToolPrimitive; labelX: number }) =>
  ({ svg }: D3Props) => {
    for (const [region, lines] of [['physical', layout.lines], ['detail', layout.detailLines]] as const) for (const line of lines) {
      svg.append('line').attr('data-region', region).attr('data-boundary', line.role)
        .attr('x1', line.x1).attr('y1', line.y1).attr('x2', line.x2).attr('y2', line.y2)
        .attr('stroke', '#172532').attr('stroke-width', line.role === 'od' ? 1.6 : 0.8);
    }
    drawSvgLabels({ labels: [...layout.labels, ...layout.detailLabels] })({ svg });
    svg.append('line').attr('data-role', 'label-leader')
      .attr('x1', layout.leaderX).attr('y1', (layout.topY + layout.bottomY) / 2)
      .attr('x2', labelX - 10).attr('y2', layout.labels[0].y - 4)
      .attr('stroke', '#647482').attr('stroke-width', 0.6);
  };
