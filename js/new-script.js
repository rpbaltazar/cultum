(function () {

  const DOT_COUNT = 3;       // total dots
  const SPECIAL_COUNT = 3;    // special glowing ones
  const MIN_DISTANCE = 30;    // minimum distance between dots in pixels
  const WEBSITE = "https://cultumcosmetics.com/products/presenza-roll-on-botanico";

  const svg = document.getElementById('dot-scene');
  const sceneRect = svg.getBoundingClientRect();

  const allDots = [];
  var opened = false;

  function getRandomPosition() {
    return {
      x: Math.random() * sceneRect.width,
      y: Math.random() * sceneRect.height
    };
  }

  function isFarEnough(x, y) {
    return allDots.every(dot => {
      const dx = dot.cx - x;
      const dy = dot.cy - y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      return distance >= MIN_DISTANCE;
    });
  }

  // Create DOT_COUNT dots randomly
  for (let i = 0; i < DOT_COUNT; i++) {

    let pos;
    let attempts = 0;
    do {
      pos = getRandomPosition();
      attempts++;
      if (attempts > 100) break; // fallback to avoid infinite loop
    } while (!isFarEnough(pos.x, pos.y));

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', 4); // radius
    circle.classList.add('dot');
    circle.dataset.id = `dot-${i + 1}`;

    svg.appendChild(circle);
    allDots.push({el: circle, cx: pos.x, cy: pos.y});
  }

  // Pick SPECIAL_COUNT random dots to be special
  const specials = randomElements(allDots, SPECIAL_COUNT);
  specials.forEach(dot => dot.el.classList.add('special'));

  // Track visits
  const visited = new Set();
  function markVisited(id) {
    if (visited.has(id)) return;
    visited.add(id);

    const entry = allDots.find(d => d.el.dataset.id === id);
    if (entry) entry.el.classList.add('visited');

    if (visited.size === SPECIAL_COUNT && !opened) {
      opened = true;
      showPopup();
    }
  }

  // Add hover/touch events for specials
  specials.forEach(entry => {
    const dot = entry.el;
    const id = dot.dataset.id;

    // pointer enter (desktop)
    dot.addEventListener('pointerenter', () => {
      dot.classList.add('hover');
      markVisited(id);
    });
    dot.addEventListener('pointerleave', () => dot.classList.remove('hover'));

    // touch move / tap (mobile)
    dot.addEventListener('touchstart', () => {
      dot.classList.add('hover');
      markVisited(id);
      setTimeout(() => dot.classList.remove('hover'), 300);
    }, { passive: true });
  });

  // Utility function: pick N random elements
  function randomElements(arr, n) {
    const copy = arr.slice();
    const selected = [];
    for (let i = 0; i < n; i++) {
      const index = Math.floor(Math.random() * copy.length);
      selected.push(copy[index]);
      copy.splice(index, 1);
    }
    return selected;
  };


  function tryOpen() {
    opened = true;
    window.open(TARGET_URL, '_blank');
  }

  function randomElements(arr, n) {
    if (n > arr.length) {
      throw new Error("Requested more elements than available");
    }

    // Make a copy so we don't mutate the original array
    const copy = arr.slice();
    const selected = [];

    for (let i = 0; i < n; i++) {
      const index = Math.floor(Math.random() * copy.length);
      selected.push(copy[index]);
      copy.splice(index, 1); // remove chosen element to avoid duplicates
    }

    return selected;
  }

  // Add event listeners to special stars
  specials.forEach(function (g) {
    const dot = g.el;
    dot.classList.add('special');

    const id = dot.getAttribute('data-id');

    // on hover / pointer enter
    dot.addEventListener('pointerenter', function (ev) {
      dot.classList.add('hover');
      markVisited(id);
    });
    dot.addEventListener('pointerleave', function (ev) {
      dot.classList.remove('hover');
    });

    // also support touchstart (mobile) — touch will usually also fire pointer events, but this ensures responsiveness
    dot.addEventListener('touchstart', function (ev) {
      dot.classList.add('hover');
      markVisited(id);
      // remove hover after short time so it doesn't stick
      setTimeout(() => dot.classList.remove('hover'), 800);
    }, { passive: true });

    // keyboard accessibility: Enter/Space should also count as visit and trigger open (this is a clear user gesture)
    dot.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        markVisited(id);
        // give a visual cue
        dot.classList.add('hover');
        setTimeout(() => dot.classList.remove('hover'), 400);
      }
    });

    // make sure clicking also counts (not required but safe)
    dot.addEventListener('click', function (ev) {
      markVisited(id);
    });
  });

  document.addEventListener('touchmove', function (ev) {
    const touch = ev.touches[0]; // first finger
    const x = touch.clientX;
    const y = touch.clientY;

    specials.forEach(star => {
      const rect = star.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        const id = star.getAttribute('data-id');
        // mark visited if not already
        markVisited(id);
        // add hover effect briefly
        star.classList.add('hover');
        setTimeout(() => star.classList.remove('hover'), 300);
      }
    });
  }, { passive: true });

  // Prevent accidental text selection while tapping/dragging on mobile
  document.addEventListener('touchmove', function (ev) { ev.preventDefault(); }, { passive: false });

  function showPopup() {
  const overlay = document.getElementById('popup');
  overlay.classList.add('show');

  // Close handlers
  document.getElementById('popup-close').onclick = () => overlay.classList.remove('show');
  overlay.onclick = e => { if(e.target === overlay) overlay.classList.remove('show'); };

  // CTA button opens new page
  document.getElementById('popup-cta').onclick = () => {
    window.open(WEBSITE, '_blank');
  };
}

// Instead of window.open, call showPopup() after visiting all special stars
function tryOpenPopup() {
  showPopup();
}

})();
