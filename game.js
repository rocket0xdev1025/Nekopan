// NEKOPAN RUNNER — vanilla JS reimplementation of the cat-bread runner.
// The nekopan sprite jumps over toast obstacles; score persists via localStorage.
(function () {
  const W = 560;
  const H = 280;
  const GROUND_Y = H - 44;
  const GRAVITY = 0.62;
  const JUMP_VY = -12.2;

  const wrap = document.getElementById("runner-wrap");
  const canvas = document.getElementById("runner-canvas");
  const overlay = document.getElementById("runner-overlay");
  const overlayTitle = document.getElementById("runner-overlay-title");
  const startBtn = document.getElementById("runner-start");
  const scoreEl = document.getElementById("runner-score");
  const bestEl = document.getElementById("runner-best");
  const ctx = canvas.getContext("2d");

  const sprite = new Image();
  sprite.src = "nekopan.png";

  let running = false;
  let score = 0;
  let best = Number(localStorage.getItem("nekopan-best") || 0);
  let cat, obstacles, speed, spawnTimer, raf;

  const pad = (n) => String(Math.floor(n)).padStart(4, "0");
  bestEl.textContent = pad(best);

  function reset() {
    cat = { x: 56, y: GROUND_Y, w: 44, h: 44, vy: 0, onGround: true };
    obstacles = [];
    speed = 5;
    spawnTimer = 0;
    score = 0;
  }

  function jump() {
    if (!running) return;
    if (cat.onGround) {
      cat.vy = JUMP_VY;
      cat.onGround = false;
    }
  }

  function spawnToast() {
    const h = 26 + Math.random() * 22;
    obstacles.push({ x: W + 20, y: GROUND_Y + 44 - h, w: 22 + Math.random() * 14, h });
  }

  function drawToast(o) {
    ctx.fillStyle = "#d9a066";
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = "#f6d7a8";
    ctx.fillRect(o.x + 3, o.y + 3, o.w - 6, o.h - 6);
    ctx.fillStyle = "#8a5a2b";
    ctx.fillRect(o.x, o.y, o.w, 4);
  }

  function drawGround() {
    ctx.strokeStyle = "#c98a3b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 46);
    ctx.lineTo(W, GROUND_Y + 46);
    ctx.stroke();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fff7e6";
    ctx.fillRect(0, 0, W, H);
    drawGround();

    // cat physics
    cat.vy += GRAVITY;
    cat.y += cat.vy;
    if (cat.y >= GROUND_Y) {
      cat.y = GROUND_Y;
      cat.vy = 0;
      cat.onGround = true;
    }
    ctx.imageSmoothingEnabled = false;
    if (sprite.complete) {
      ctx.drawImage(sprite, cat.x, cat.y, cat.w, cat.h);
    } else {
      ctx.fillStyle = "#e8b04a";
      ctx.fillRect(cat.x, cat.y, cat.w, cat.h);
    }

    // obstacles
    spawnTimer -= 1;
    if (spawnTimer <= 0) {
      spawnToast();
      spawnTimer = 55 + Math.random() * 60 - Math.min(speed * 2, 30);
    }
    for (const o of obstacles) {
      o.x -= speed;
      drawToast(o);
    }
    obstacles = obstacles.filter((o) => o.x + o.w > -10);

    // collision (slightly forgiving hitbox)
    const cx = cat.x + 6, cy = cat.y + 6, cw = cat.w - 12, ch = cat.h - 8;
    for (const o of obstacles) {
      if (cx < o.x + o.w && cx + cw > o.x && cy < o.y + o.h && cy + ch > o.y) {
        return gameOver();
      }
    }

    score += 0.15;
    speed += 0.0015;
    scoreEl.textContent = pad(score);

    raf = requestAnimationFrame(loop);
  }

  function gameOver() {
    running = false;
    cancelAnimationFrame(raf);
    if (score > best) {
      best = Math.floor(score);
      localStorage.setItem("nekopan-best", best);
      bestEl.textContent = pad(best);
    }
    overlayTitle.textContent = "TOASTED! SCORE " + pad(score);
    startBtn.textContent = "RETRY";
    overlay.style.display = "flex";
  }

  function start() {
    reset();
    overlay.style.display = "none";
    running = true;
    raf = requestAnimationFrame(loop);
  }

  startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    start();
  });
  wrap.addEventListener("pointerdown", () => {
    if (running) jump();
  });
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      if (e.target === document.body) e.preventDefault();
      running ? jump() : start();
    }
  });
})();
