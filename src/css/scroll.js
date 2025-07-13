document.addEventListener('DOMContentLoaded', () => {
  const svg = document.getElementById('scroll-node-svg');
  const line = document.getElementById('scroll-line-svg');
  const nodes = Array.from(document.querySelectorAll('.scroll-node'));

  // Get colors from data attributes
  const lineColor = svg.getAttribute('data-line-color');
  const nodeColor = svg.getAttribute('data-node-color');

  // Apply colors to CSS variables
  document.documentElement.style.setProperty('--line-color', lineColor);
  document.documentElement.style.setProperty('--node-color', nodeColor);

  const length = line.getTotalLength();
  line.style.strokeDasharray = length;
  line.style.strokeDashoffset = length;

  const viewBoxHeight = 1000;
  nodes.forEach(node => {
    const y = parseFloat(node.getAttribute('data-pos'));
    node._triggerLength = (y / viewBoxHeight) * length;
  });

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);

        const offset = length * (1 - progress);
        line.style.strokeDashoffset = offset;

        const drawn = length - offset;

        nodes.forEach(node => {
          if (drawn >= node._triggerLength) {
            node.classList.add('visible');
            node.style.fill = nodeColor; // Use dynamic color
          } else {
            node.classList.remove('visible');
            node.style.fill = '#fff';
          }
        });

        ticking = false;
      });

      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll);
  onScroll();
});
