document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const menu = document.getElementById("menu");
  const win = document.getElementById("win");
  const winnerText = document.getElementById("winnerText");
  const gameContainer = document.getElementById("gameContainer");

  const touchLeft = document.querySelector(".touch.left");
  const touchRight = document.querySelector(".touch.right");

  let W = 0, H = 0;
  let running = false;
  let useAI = false;
  let aiLevel = 0.08;

  const maxScore = 5;
  let s1 = 0, s2 = 0;

  const p1 = { x: 20, y: 100, w: 12, h: 90 };
  const p2 = { x: 0, y: 100, w: 12, h: 90 };
  const ball = { x: 0, y: 0, vx: 5, vy: 3, r: 6 };

  /* ===== MENU ===== */
  function openMenu() {
    running = false;
    if (menu) menu.classList.remove("hidden");
    if (win) win.classList.add("hidden");
    if (gameContainer) gameContainer.classList.add("hidden");
  }

  function startGame(ai = false, diff = 0.08) {
    useAI = ai;
    aiLevel = diff;
    s1 = 0;
    s2 = 0;
    running = true;

    if (menu) menu.classList.add("hidden");
    if (win) win.classList.add("hidden");
    if (gameContainer) gameContainer.classList.remove("hidden");

    resize();
    resetBall();
  }

  /* ===== CANVAS (RETRATO) ===== */
  function resize() {
    const maxWidth = 420;
    W = canvas.width = Math.min(window.innerWidth, maxWidth);
    H = canvas.height = window.innerHeight;

    p1.x = 20;
    p2.x = W - 32;
    p1.y = (H - p1.h) / 2;
    p2.y = (H - p2.h) / 2;
  }

  window.addEventListener("resize", resize);

  /* ===== BALL ===== */
  function resetBall() {
    ball.x = W / 2;
    ball.y = H / 2;
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.vy = Math.random() * 4 - 2;
  }

  /* ===== TOUCH ===== */
  function touchMove(player, e) {
    const rect = canvas.getBoundingClientRect();
    player.y = e.touches[0].clientY - rect.top - player.h / 2;
  }

  if (touchLeft) {
    touchLeft.addEventListener("touchmove", e => touchMove(p1, e), { passive: true });
  }

  if (touchRight) {
    touchRight.addEventListener("touchmove", e => {
      if (!useAI) touchMove(p2, e);
    }, { passive: true });
  }

  /* ===== IA ===== */
  function aiMove() {
    p2.y += (ball.y - (p2.y + p2.h / 2)) * aiLevel;
  }

  /* ===== GAME LOOP ===== */
  function update() {
    if (!running) return;

    if (useAI) aiMove();

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y < ball.r || ball.y > H - ball.r) ball.vy *= -1;

    if (ball.x < 0) {
      s2++;
      if (s2 >= maxScore) return showWin(useAI ? "IA venceu!" : "Jogador 2 venceu!");
      resetBall();
    }

    if (ball.x > W) {
      s1++;
      if (s1 >= maxScore) return showWin("Jogador 1 venceu!");
      resetBall();
    }

    if (ball.x < p1.x + p1.w && ball.y > p1.y && ball.y < p1.y + p1.h) ball.vx *= -1;
    if (ball.x > p2.x - ball.r && ball.y > p2.y && ball.y < p2.y + p2.h) ball.vx *= -1;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#3ddc97";
    ctx.fillRect(p1.x, p1.y, p1.w, p1.h);

    ctx.fillStyle = "#7aa2f7";
    ctx.fillRect(p2.x, p2.y, p2.w, p2.h);

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }
  loop();

  /* ===== VITÓRIA ===== */
  function showWin(text) {
    running = false;
    if (winnerText) winnerText.textContent = text;
    if (win) win.classList.remove("hidden");
    if (gameContainer) gameContainer.classList.add("hidden");
  }

  /* ===== BOTÕES (SEGUROS) ===== */
  const btn2p = document.getElementById("btn2p");
  if (btn2p) btn2p.addEventListener("click", () => startGame(false));

  document.querySelectorAll(".ia-box button").forEach(btn => {
    btn.addEventListener("click", () => {
      const d = btn.dataset.diff;
      startGame(true, d === "easy" ? 0.05 : d === "medium" ? 0.08 : 0.13);
    });
  });

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) resetBtn.addEventListener("click", openMenu);

  const playAgain = document.getElementById("playAgain");
  if (playAgain) playAgain.addEventListener("click", openMenu);

  /* ===== INIT ===== */
  resize();
  openMenu();

});
