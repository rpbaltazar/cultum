    (function () {

      const DOT_COUNT = 3;       // total dots
      const SPECIAL_COUNT = 3;    // special glowing ones

      const svg = document.getElementById('dot-scene');
      const sceneRect = svg.getBoundingClientRect();

      const allDots = [];

      // Create DOT_COUNT dots randomly
      for (let i = 0; i < DOT_COUNT; i++) {
        const cx = Math.random() * sceneRect.width;
        const cy = Math.random() * sceneRect.height;

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', 8); // radius
        circle.classList.add('dot');
        circle.dataset.id = `dot-${i + 1}`;

        svg.appendChild(circle);
        allDots.push(circle);
      }

      // Pick SPECIAL_COUNT random dots to be special
      const specials = randomElements(allDots, SPECIAL_COUNT);
      specials.forEach(dot => dot.classList.add('special'));

      // Track visits
      const visited = new Set();
      function markVisited(id) {
        if (visited.has(id)) return;
        visited.add(id);

        const el = allDots.find(d => d.dataset.id === id);
        if (el) el.classList.add('visited');

        if (visited.size === SPECIAL_COUNT) {
          window.open('https://example.com', '_blank');
        }
      }

      // Add hover/touch events for specials
      specials.forEach(dot => {
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


      // URL to open when all three visited. Change as desired.
      // const TARGET_URL = 'https://cultumcosmetics.com/';
      // const SPECIAL_COUNT = 3;

      // const visited = new Set();
      // let opened = false;

      // function markVisited(id) {
      //   if (visited.has(id)) return;
      //   visited.add(id);

      //   const dot = document.getElementById('dot-' + visited.size);
      //   if (dot) dot.classList.add('on');

      //   // mark the svg element with visited for styling
      //   const el = document.querySelector(`.star[data-id="${id}"]`);
      //   if (el) el.classList.add('visited');

      //   if (visited.size === 3 && !opened) {
      //     // try to open new tab/window
      //     tryOpen();
      //   }
      // }

      function tryOpen() {
        opened = true;
        const newWin = window.open(TARGET_URL, '_blank');
        if (!newWin || newWin.closed === undefined) {
          // popup blocked — show fallback button
          const fb = document.getElementById('fallback');
          fb.style.display = 'block';
        } else {
          // focus the new window/tab if possible
          try { newWin.focus(); } catch (e) { }
        }
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
        g.classList.add('special');

        const id = g.getAttribute('data-id');

        // on hover / pointer enter
        g.addEventListener('pointerenter', function (ev) {
          g.classList.add('hover');
          markVisited(id);
        });
        g.addEventListener('pointerleave', function (ev) {
          g.classList.remove('hover');
        });

        // also support touchstart (mobile) — touch will usually also fire pointer events, but this ensures responsiveness
        g.addEventListener('touchstart', function (ev) {
          g.classList.add('hover');
          markVisited(id);
          // remove hover after short time so it doesn't stick
          setTimeout(() => g.classList.remove('hover'), 800);
        }, { passive: true });

        // keyboard accessibility: Enter/Space should also count as visit and trigger open (this is a clear user gesture)
        g.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            markVisited(id);
            // give a visual cue
            g.classList.add('hover');
            setTimeout(() => g.classList.remove('hover'), 400);
          }
        });

        // make sure clicking also counts (not required but safe)
        g.addEventListener('click', function (ev) {
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


      // fallback open button
      document.getElementById('openBtn').addEventListener('click', function () {
        tryOpen();
      });

      // Prevent accidental text selection while tapping/dragging on mobile
      document.addEventListener('touchmove', function (ev) { ev.preventDefault(); }, { passive: false });
    })();
