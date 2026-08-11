/**
 * Easter Egg: Land Cruiser Pickup 79
 * Double-click the hero title ("Shamyl Bin Mansoor") to activate.
 * Drive a cartoonish red & black Land Cruiser across the website.
 * Controls: Arrow keys / WASD to drive, ESC to exit.
 */
(function () {
  'use strict';

  let gameActive = false;
  let canvas, ctx, car, keys = {}, animationId, hintEl, timerInterval;
  // ── Trigger: double-click on hero title ("Shamyl Bin Mansoor") ──
  function setupTrigger() {
    const title = document.querySelector('h1.hero-title');
    if (!title) return;

    // Prevent text selection from interfering with double-click
    title.style.userSelect = 'none';
    title.style.webkitUserSelect = 'none';
    title.style.cursor = 'pointer';

    // Use mousedown detection for more reliable double-click counting
    let lastClick = 0;
    title.addEventListener('mousedown', function (e) {
      const now = Date.now();
      if (now - lastClick < 400) {
        e.preventDefault();
        e.stopPropagation();
        if (!gameActive) startGame();
        lastClick = 0; // reset so it doesn't fire again
      } else {
        lastClick = now;
      }
    });

    // Also support double-tap on mobile
    let lastTap = 0;
    title.addEventListener('touchend', function (e) {
      const now = Date.now();
      if (now - lastTap < 400) {
        e.preventDefault();
        if (!gameActive) startGame();
      }
      lastTap = now;
    });
  }

  // ── Canvas Setup ──
  function startGame() {
    gameActive = true;

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;pointer-events:auto;cursor:crosshair;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    // Hint overlay
    hintEl = document.createElement('div');
    hintEl.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:1000000;background:rgba(0,0,0,0.85);color:#ff3333;font-family:monospace;font-size:14px;padding:12px 24px;border-radius:8px;border:1px solid #ff3333;pointer-events:none;text-align:center;letter-spacing:1px;';
    hintEl.innerHTML = '🚙 LAND CRUISER 79 — DRIVE MODE ACTIVE<br><span style="color:#aaa;font-size:11px">Arrow keys / WASD to drive · ESC to exit · Honk: H</span>';
    document.body.appendChild(hintEl);

    // Timer
    timerInterval = setInterval(function () {
      hintEl.style.opacity = hintEl.style.opacity === '0.3' ? '1' : '0.3';
    }, 600);

    setTimeout(function () {
      if (hintEl) hintEl.style.transition = 'opacity 1s';
      if (hintEl) hintEl.style.opacity = '0';
    }, 5000);

    // Car init
    car = {
      x: canvas.width / 2 - 40,
      y: canvas.height / 2 - 25,
      angle: 0,
      speed: 0,
      maxSpeed: 6,
      acceleration: 0.25,
      friction: 0.05,
      turnSpeed: 0.055,
      width: 80,
      height: 50,
      wheelAngle: 0,
      honkTimer: 0,
      exhaustParticles: []
    };

    // Key handlers
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp, { passive: false });

    // Resize
    window.addEventListener('resize', onResize);

    // Start render loop
    render();
  }

  function onKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
    keys[e.code] = true;

    if (e.key === 'Escape') {
      e.preventDefault();
      stopGame();
      return;
    }
    // Prevent page scroll on game keys
    var gameKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd', 'h'];
    if (gameKeys.indexOf(e.key.toLowerCase()) !== -1) {
      e.preventDefault();
    }
    if (e.key.toLowerCase() === 'h') {
      car.honkTimer = 30;
      playHonk();
    }
  }

  function onKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
  }

  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // ── Sound (Web Audio honk) ──
  var audioCtx = null;
  function playHonk() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(240, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (err) {}
  }

  // ── Physics ──
  function updateCar() {
    // Forward/backward
    if (keys['arrowup'] || keys['w']) {
      car.speed = Math.min(car.speed + car.acceleration, car.maxSpeed);
    } else if (keys['arrowdown'] || keys['s']) {
      car.speed = Math.max(car.speed - car.acceleration, -car.maxSpeed * 0.6);
    } else {
      // Friction
      if (Math.abs(car.speed) < car.friction) {
        car.speed = 0;
      } else {
        car.speed -= Math.sign(car.speed) * car.friction;
      }
    }

    // Steering (only when moving)
    if (Math.abs(car.speed) > 0.1) {
      var steerFactor = Math.sign(car.speed);
      if (keys['arrowleft'] || keys['a']) {
        car.angle -= car.turnSpeed * steerFactor;
        car.wheelAngle = -0.3;
      } else if (keys['arrowright'] || keys['d']) {
        car.angle += car.turnSpeed * steerFactor;
        car.wheelAngle = 0.3;
      } else {
        car.wheelAngle *= 0.8;
      }
    } else {
      car.wheelAngle *= 0.8;
    }

    // Move
    car.x += Math.cos(car.angle) * car.speed;
    car.y += Math.sin(car.angle) * car.speed;

    // Wrap around screen edges
    var margin = 50;
    if (car.x < -margin) car.x = canvas.width + margin;
    if (car.x > canvas.width + margin) car.x = -margin;
    if (car.y < -margin) car.y = canvas.height + margin;
    if (car.y > canvas.height + margin) car.y = -margin;

    // Exhaust particles
    if (Math.abs(car.speed) > 0.5) {
      var backX = car.x - Math.cos(car.angle) * 32;
      var backY = car.y - Math.sin(car.angle) * 32;
      car.exhaustParticles.push({
        x: backX + (Math.random() - 0.5) * 8,
        y: backY + (Math.random() - 0.5) * 8,
        vx: -Math.cos(car.angle) * 0.5 + (Math.random() - 0.5),
        vy: -Math.sin(car.angle) * 0.5 + (Math.random() - 0.5),
        life: 30 + Math.random() * 20,
        size: 3 + Math.random() * 3
      });
    }

    // Update particles
    for (var i = car.exhaustParticles.length - 1; i >= 0; i--) {
      var p = car.exhaustParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.size += 0.1;
      if (p.life <= 0) car.exhaustParticles.splice(i, 1);
    }

    // Honk timer
    if (car.honkTimer > 0) car.honkTimer--;
  }

  // ── Drawing ──

  // Draw a cartoonish Land Cruiser Pickup 79 viewed top-down
  function drawCar() {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);

    var w = car.width;
    var h = car.height;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(4, 3, w / 2 + 2, h / 2 + 1, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Exhaust particles (behind car) ──
    ctx.restore();
    for (var i = 0; i < car.exhaustParticles.length; i++) {
      var p = car.exhaustParticles[i];
      var alpha = p.life / 50;
      ctx.fillStyle = 'rgba(120,120,120,' + (alpha * 0.4) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);

    // ── Body outline (rounded rect) ──
    var halfW = w / 2;
    var halfH = h / 2;

    // Cabin/Canopy area (back portion — pickup bed)
    ctx.fillStyle = '#1a1a1a';
    roundRect(-halfW + 2, -halfH + 2, w * 0.42, h - 4, 4);
    ctx.fill();

    // Pickup bed outline
    ctx.strokeStyle = '#cc0000';
    ctx.lineWidth = 1.5;
    roundRect(-halfW + 4, -halfH + 4, w * 0.38, h - 8, 3);
    ctx.stroke();

    // Cabin roof (front portion — driver area)
    ctx.fillStyle = '#cc1a1a';
    roundRect(-halfW + w * 0.35, -halfH + 3, w * 0.5, h - 6, 5);
    ctx.fill();

    // Cabin outline
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    roundRect(-halfW + w * 0.35, -halfH + 3, w * 0.5, h - 6, 5);
    ctx.stroke();

    // Windshield
    ctx.fillStyle = 'rgba(180,220,255,0.6)';
    roundRect(halfW - w * 0.22, -halfH + 7, w * 0.14, h - 14, 3);
    ctx.fill();
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    roundRect(halfW - w * 0.22, -halfH + 7, w * 0.14, h - 14, 3);
    ctx.stroke();

    // Side windows
    ctx.fillStyle = 'rgba(180,220,255,0.4)';
    ctx.fillRect(-halfW + w * 0.4, -halfH + 6, w * 0.25, 3);
    ctx.fillRect(-halfW + w * 0.4, halfH - 9, w * 0.25, 3);

    // Red stripe along the body
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(-halfW + 2, -2, w - 4, 1.5);

    // Headlights (front)
    ctx.fillStyle = '#ffdd44';
    ctx.beginPath();
    ctx.arc(halfW - 3, -halfH + 7, 2.5, 0, Math.PI * 2);
    ctx.arc(halfW - 3, halfH - 7, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Light glow when moving forward
    if (car.speed > 0.5) {
      ctx.fillStyle = 'rgba(255,221,68,0.15)';
      ctx.beginPath();
      ctx.moveTo(halfW - 1, -halfH + 5);
      ctx.lineTo(halfW + 25, -halfH + 1);
      ctx.lineTo(halfW + 25, halfH - 1);
      ctx.lineTo(halfW - 1, halfH - 5);
      ctx.closePath();
      ctx.fill();
    }

    // Taillights (back)
    ctx.fillStyle = '#cc0000';
    ctx.beginPath();
    ctx.arc(-halfW + 3, -halfH + 7, 2, 0, Math.PI * 2);
    ctx.arc(-halfW + 3, halfH - 7, 2, 0, Math.PI * 2);
    ctx.fill();

    // ── Wheels ──
    var wheelW = 8;
    var wheelH = 4;
    var wheelOffsets = [
      { x: -halfW + w * 0.15, y: -halfH - 2 },  // back-left
      { x: -halfW + w * 0.15, y: halfH + 2 },   // back-right
      { x: halfW - w * 0.2, y: -halfH - 2 },    // front-left
      { x: halfW - w * 0.2, y: halfH + 2 }      // front-right
    ];

    for (var wi = 0; wi < wheelOffsets.length; wi++) {
      var wOffset = wheelOffsets[wi];
      ctx.save();
      ctx.translate(wOffset.x, wOffset.y);

      // Wheel shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(-wheelW / 2 + 1, -wheelH / 2 + 1, wheelW, wheelH);

      // Tire (black)
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(-wheelW / 2, -wheelH / 2, wheelW, wheelH);

      // Hubcap
      ctx.fillStyle = '#666';
      ctx.fillRect(-wheelW / 2 + 2, -wheelH / 2 + 1, wheelW - 4, wheelH - 2);

      // Front wheels turn with steering
      if (wi >= 2) {
        ctx.restore();
        ctx.save();
        ctx.translate(wOffset.x, wOffset.y);
        ctx.rotate(car.wheelAngle * 0.5);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(-wheelW / 2, -wheelH / 2, wheelW, wheelH);
        ctx.fillStyle = '#666';
        ctx.fillRect(-wheelW / 2 + 2, -wheelH / 2 + 1, wheelW - 4, wheelH - 2);
      }

      ctx.restore();
    }

    // ── Snorkel (iconic Land Cruiser detail) ──
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-halfW + w * 0.35, -halfH + 2);
    ctx.lineTo(-halfW + w * 0.35, -halfH - 6);
    ctx.lineTo(-halfW + w * 0.42, -halfH - 6);
    ctx.stroke();
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-halfW + w * 0.35 - 1, -halfH - 7, 2, 2);

    // ── "TOYOTA" text on back ──
    if (Math.abs(car.speed) < 0.5) {
      ctx.fillStyle = 'rgba(200,200,200,0.5)';
      ctx.font = 'bold 5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TOYOTA', -halfW + w * 0.22, 1);
    }

    // Honk visual
    if (car.honkTimer > 0) {
      ctx.fillStyle = 'rgba(255,221,68,' + (car.honkTimer / 30 * 0.8) + ')';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BEEP!', halfW + 20, -5);
      ctx.fillText('BEEP!', halfW + 20, 10);
    }

    ctx.restore();
  }

  // Helper: rounded rectangle path
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Render Loop ──
  function render() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateCar();
    drawCar();

    animationId = requestAnimationFrame(render);
  }

  // ── Cleanup ──
  function stopGame() {
    gameActive = false;
    cancelAnimationFrame(animationId);
    clearInterval(timerInterval);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('resize', onResize);
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    if (hintEl && hintEl.parentNode) hintEl.parentNode.removeChild(hintEl);
    car = null;
    keys = {};
  }

  // ── Init ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTrigger);
  } else {
    setupTrigger();
  }
})();