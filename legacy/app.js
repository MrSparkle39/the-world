(() => {
  const world = document.getElementById("world");
  const scene = document.querySelector("[data-parallax]");
  const heroArt = document.querySelector(".hero-art");
  const balloon = document.querySelector(".balloon");
  const balloonCover = document.querySelector(".balloon-cover");
  const modalRoot = document.getElementById("modal-root");
  const modalBody = document.getElementById("modal-body");
  const modal = modalRoot.querySelector(".modal");
  const toastEl = document.getElementById("toast");
  const canvas = document.getElementById("motes");
  const ctx = canvas.getContext("2d");

  // Painted balloon bounds in hero-landscape.png (natural pixels)
  const BALLOON_IN_ART = { x: 1328, y: 78, w: 128, h: 190 };

  let toastTimer = 0;
  let lastFocus = null;
  let motes = [];
  let raf = 0;
  // Declared before applyOptions — assigning inside that helper must not hit the TDZ
  let motionEnabled = true;

  const options = loadOptions();
  // Motion defaults ON unless the user saved it off in Options
  if (options.motion === undefined) options.motion = true;
  applyOptions(options);

  function loadOptions() {
    try {
      return JSON.parse(localStorage.getItem("the-world-options") || "{}");
    } catch {
      return {};
    }
  }

  function saveOptions(next) {
    localStorage.setItem("the-world-options", JSON.stringify(next));
  }

  function applyOptions(opts) {
    motionEnabled = opts.motion !== false;
    document.documentElement.dataset.textSize = opts.textSize || "md";
    document.body.classList.toggle("reduce-motion", !motionEnabled);
    document.body.classList.toggle("motion-on", motionEnabled);
    if (opts.textSize === "lg") {
      document.documentElement.style.fontSize = "18px";
    } else if (opts.textSize === "sm") {
      document.documentElement.style.fontSize = "15px";
    } else {
      document.documentElement.style.fontSize = "";
    }
  }

  function showToast(message) {
    toastEl.hidden = false;
    toastEl.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toastEl.hidden = true;
    }, 2600);
  }

  function openModal(name) {
    const tpl = document.getElementById(`tpl-${name}`);
    if (!tpl) return;
    lastFocus = document.activeElement;
    modalBody.innerHTML = "";
    modalBody.appendChild(tpl.content.cloneNode(true));

    if (name === "options") {
      const form = modalBody.querySelector("form");
      form.music.checked = options.music !== false;
      form.sfx.checked = options.sfx !== false;
      form.motion.checked = options.motion !== false;
      form.textSize.value = options.textSize || "md";
    }

    modalRoot.hidden = false;
    modal.focus();
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalRoot.hidden = true;
    modalBody.innerHTML = "";
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function handleForm(form) {
    const type = form.dataset.form;
    const data = new FormData(form);

    if (type === "create") {
      showToast(`Account ready for ${data.get("username")} — welcome traveler.`);
      closeModal();
      return;
    }

    if (type === "login") {
      showToast(`Signed in as ${data.get("identity")}.`);
      closeModal();
      return;
    }

    if (type === "start") {
      const region = data.get("region");
      const labels = {
        meadow: "Flowering Meadows",
        harbor: "River Harbor",
        castle: "Castle Reach",
        windmill: "Windmill Cliffs",
      };
      showToast(`${data.get("name")} sets out for ${labels[region] || region}.`);
      closeModal();
      return;
    }

    if (type === "options") {
      options.music = form.music.checked;
      options.sfx = form.sfx.checked;
      options.motion = form.motion.checked;
      options.textSize = form.textSize.value;
      saveOptions(options);
      applyOptions(options);
      if (motionEnabled) startMotes();
      else stopMotes();
      showToast("Options saved.");
      closeModal();
    }
  }

  document.addEventListener("click", (event) => {
    const actionBtn = event.target.closest("[data-action]");
    if (actionBtn) {
      const action = actionBtn.dataset.action;
      if (action === "about" && actionBtn.closest(".modal")) {
        openModal("create");
        return;
      }
      openModal(action);
      return;
    }

    if (event.target.closest("[data-close]")) {
      closeModal();
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("form[data-form]");
    if (!form) return;
    event.preventDefault();
    handleForm(form);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modalRoot.hidden) {
      closeModal();
    }
  });

  // Gentle mouse parallax on the illustrated scene
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener(
    "pointermove",
    (event) => {
      if (!motionEnabled) return;
      const nx = (event.clientX / window.innerWidth - 0.5) * 2;
      const ny = (event.clientY / window.innerHeight - 0.5) * 2;
      targetX = nx * 10;
      targetY = ny * 6;
    },
    { passive: true }
  );

  function tickParallax() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    if (motionEnabled) {
      // Translate only — avoid scale zoom that would crop characters/sign
      scene.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    } else {
      scene.style.transform = "none";
    }
    requestAnimationFrame(tickParallax);
  }
  requestAnimationFrame(tickParallax);

  // Soft golden light motes drifting across the scene
  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnMotes() {
    const count = window.innerWidth < 700 ? 28 : 48;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    motes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.8,
      vx: 0.08 + Math.random() * 0.22,
      vy: -0.05 - Math.random() * 0.18,
      a: 0.15 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function drawMotes() {
    if (!motionEnabled) {
      raf = 0;
      return;
    }
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    for (const p of motes) {
      p.phase += 0.01;
      p.x += p.vx + Math.sin(p.phase) * 0.12;
      p.y += p.vy;
      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      if (p.x > w + 10) p.x = -10;

      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      glow.addColorStop(0, `rgba(255, 236, 170, ${p.a})`);
      glow.addColorStop(1, "rgba(255, 236, 170, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(drawMotes);
  }

  function startMotes() {
    if (raf) cancelAnimationFrame(raf);
    resizeCanvas();
    spawnMotes();
    raf = requestAnimationFrame(drawMotes);
  }

  function stopMotes() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  }

  window.addEventListener("resize", () => {
    positionBalloon();
    if (!motionEnabled) return;
    resizeCanvas();
    spawnMotes();
  });

  // Keep the floating balloon aligned to the painted one under object-fit: contain
  function positionBalloon() {
    if (!heroArt || !balloon || !balloonCover) return;
    const natW = heroArt.naturalWidth || 1536;
    const natH = heroArt.naturalHeight || 1024;
    const boxW = heroArt.clientWidth;
    const boxH = heroArt.clientHeight;
    if (!boxW || !boxH) return false;

    const scale = Math.min(boxW / natW, boxH / natH);
    const renderedW = natW * scale;
    const renderedH = natH * scale;
    const offsetX = (boxW - renderedW) * 0.5;
    const offsetY = (boxH - renderedH) * 0.5;

    const left = offsetX + BALLOON_IN_ART.x * scale;
    const top = offsetY + BALLOON_IN_ART.y * scale;
    const width = BALLOON_IN_ART.w * scale;
    const height = BALLOON_IN_ART.h * scale;

    balloon.style.left = `${left}px`;
    balloon.style.top = `${top}px`;
    balloon.style.width = `${width}px`;

    const pad = Math.max(12, width * 0.28);
    balloonCover.style.left = `${left - pad}px`;
    balloonCover.style.top = `${top - pad * 0.7}px`;
    balloonCover.style.width = `${width + pad * 2}px`;
    balloonCover.style.height = `${height + pad * 1.55}px`;
    return true;
  }

  if (heroArt) {
    if (heroArt.complete) positionBalloon();
    else heroArt.addEventListener("load", positionBalloon, { once: true });
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(() => positionBalloon()).observe(heroArt);
    }
  }

  // Respect OS reduced-motion only as an initial default when the user
  // has never saved Options; an explicit Options choice always wins.
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (localStorage.getItem("the-world-options") === null && prefersReduced) {
    options.motion = false;
    applyOptions(options);
  }

  if (motionEnabled) startMotes();
  else stopMotes();

  // Soft entrance for brand after paint
  requestAnimationFrame(() => {
    world.classList.add("ready");
    positionBalloon();
  });
})();
