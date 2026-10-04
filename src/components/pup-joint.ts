import type { NormalizedPupJoint } from '../domain/pup-joint';
import type { PupJointPrimitive } from '../geometry/pup-joint-layout';
import { drawSvgLabels } from '../utils/svg-label-utils';

export const drawPupJoint =
  ({ pupJoint, layout, labelX }: { pupJoint: NormalizedPupJoint; layout: PupJointPrimitive; labelX: number }) =>
  ({ svg }: D3Props) => {
    const segment = pupJoint.segment;
    const group = svg.append('g')
      .attr('data-component-id', pupJoint.id).attr('data-kind', 'PupJoint')
      .attr('data-tubing-id', pupJoint.tubingId).attr('data-segment-id', pupJoint.segmentId)
      .attr('data-top-md', segment.top).attr('data-bottom-md', segment.bottom)
      .attr('data-length-m', segment.bottom - segment.top);
    group.append('title').text(`Pup Joint ${pupJoint.id}; ${pupJoint.lifecycle}; ${pupJoint.verification}; sources: ${pupJoint.sources.join(', ') || 'unknown'}`);
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
      .attr('x1', layout.leaderX).attr('y1', (layout.topY + layout.bottomY) / 2)
      .attr('x2', labelX - 10).attr('y2', layout.labels[0].y - 4)
      .attr('stroke', '#647482').attr('stroke-width', 0.6);
  };
