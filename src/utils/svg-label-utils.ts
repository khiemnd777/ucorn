import type { LabelPrimitive } from '../geometry/completion-layout';

export const drawSvgLabels =
  ({ labels }: { labels: readonly LabelPrimitive[] }) =>
  ({ svg }: D3Props) => {
    for (const label of labels) {
      svg.append('text')
        .attr('x', label.x)
        .attr('y', label.y)
        .attr('font-family', 'Arial, sans-serif')
        .attr('font-size', 12)
        .attr('fill', '#172532')
        .text(label.text);
    }
  };
