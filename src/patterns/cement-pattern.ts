export const cementPattern =
  () =>
  ({ defs }: D3Props) => {
    const pattern = defs
      .append('pattern')
      .attr('id', 'cementPattern')
      .attr('width', 100)
      .attr('height', 100)
      .attr('patternUnits', 'userSpaceOnUse');
    pattern
      .append('rect')
      .attr('width', 100)
      .attr('height', 100)
      .attr('fill', '#a9a9a9');

    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const r = Math.random() * 2 + 1;
      pattern
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', r)
        .attr('stroke', '#828282')
        .attr('fill', '#999');
    }
  };
