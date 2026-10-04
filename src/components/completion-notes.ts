import type { LabelPrimitive } from '../geometry/completion-layout';
import { drawSvgLabels } from '../utils/svg-label-utils';

export const drawCompletionNotes =
  ({ notes }: { notes: readonly LabelPrimitive[] }) =>
  ({ svg }: D3Props) => {
    const group = svg.append('g').attr('data-kind', 'CompletionNotes');
    drawSvgLabels({ labels: notes })({ svg: group });
    drawSvgLabels({ labels: [{ x: 15, y: -75, text: 'Completion v2 | m MD' }] })({ svg });
  };
