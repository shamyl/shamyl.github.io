/**
 * Easter Egg: Land Cruiser Pickup 79
 * Double-click the hero title ("Shamyl Bin Mansoor") to activate.
 * Drive a red & black Land Cruiser across the website.
 * Controls: Arrow keys / WASD to drive, ESC to exit, H to honk.
 *
 *  - SVG sprite image (2.5D shaded Land Cruiser 79 pickup)
 *  - Tire screech sound while turning at speed (plays screech.mp3)
 *  - Jeep horn (plays horn.mp3)
 *  - Brake screech (plays brake.mp3)
 *  - Page scrolls beneath the car when driving up/down
 */
(function () {
  'use strict';

  var gameActive = false;
  var canvas, ctx, car, keys = {}, animationId, hintEl, timerInterval;
  var skidCanvas, skidCtx;
  var carSprite = new Image();
  carSprite.src = '/images/land-cruiser-sprite.svg';

  // ── Audio (HTML5 Audio elements) ──
  var screechAudio = null;
  var hornAudio = null;
  var hornPool = [];     // pool of horn Audio elements for overlapping playback
  var hornPoolIdx = 0;
  var brakeAudio = null;
  var lastBrakeTime = 0;

  function ensureAudio() {
    if (screechAudio) return;
    try {
      // Screech — loopable, volume controlled dynamically
      screechAudio = new Audio('/sounds/screech.mp3');
      screechAudio.loop = true;
      screechAudio.volume = 0;
      screechAudio.preload = 'auto';

      // Horn — create a small pool so overlapping honks work
      for (var i = 0; i < 3; i++) {
        var h = new Audio('/sounds/horn.mp3');
        h.preload = 'auto';
        hornPool.push(h);
      }

      // Brake — play once per event
      brakeAudio = new Audio('/sounds/brake.mp3');
      brakeAudio.preload = 'auto';
    } catch (e) {}
  }

  // ── Tire Screech ──
  function startScreech() {
    if (!screechAudio) return;
    try {
      screechAudio.currentTime = 0;
      screechAudio.volume = 0;
      screechAudio.play().catch(function() {});
    } catch (e) {}
  }

  function setScreechVolume(v) {
    if (screechAudio) {
      screechAudio.volume = Math.min(1, Math.max(0, v));
    }
  }

  function stopScreech() {
    if (screechAudio) {
      try {
        screechAudio.pause();
        screechAudio.currentTime = 0;
        screechAudio.volume = 0;
      } catch (e) {}
    }
  }

  // ── Brake sound (play once per brake event) ──
  function playBrake() {
    if (!brakeAudio) return;
    var now = Date.now();
    if (now - lastBrakeTime < 800) return; // throttle: don't replay too often
    lastBrakeTime = now;
    try {
      brakeAudio.currentTime = 0;
      brakeAudio.play().catch(function() {});
    } catch (e) {}
  }

  // ── Jeep Horn ──
  function startHorn() {
    try {
      var h = hornPool[hornPoolIdx];
      hornPoolIdx = (hornPoolIdx + 1) % hornPool.length;
      h.currentTime = 0;
      h.play().catch(function() {});
    } catch (e) {}
  }

  function stopHorn() {
    // Horn plays through naturally; nothing to stop
  }

  // ── Trigger: double-click on hero title ──
  function setupTrigger() {
    var title = document.querySelector('h1.hero-title');
    if (!title) return;

    title.style.userSelect = 'none';
    title.style.webkitUserSelect = 'none';
    title.style.cursor = 'pointer';

    var lastClick = 0;
    title.addEventListener('mousedown', function (e) {
      var now = Date.now();
      if (now - lastClick < 400) {
        e.preventDefault();
        e.stopPropagation();
        if (!gameActive) startGame();
        lastClick = 0;
      } else {
        lastClick = now;
      }
    });

    var lastTap = 0;
    title.addEventListener('touchend', function (e) {
      var now = Date.now();
      if (now - lastTap < 400) {
        e.preventDefault();
        if (!gameActive) startGame();
      }
      lastTap = now;
    });
  }

  // ── Touch Controls (mobile) ──
  var touchControls = null;
  var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  function createTouchControls() {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:1000000;pointer-events:none;display:flex;justify-content:space-between;align-items:flex-end;padding:16px 20px;';

    // ── Left side: D-pad for steering ──
    var dpad = document.createElement('div');
    dpad.style.cssText = 'position:relative;width:140px;height:140px;pointer-events:auto;';

    var dpadBg = document.createElement('div');
    dpadBg.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.6);border-radius:50%;border:2px solid rgba(255,50,50,0.5);';
    dpad.appendChild(dpadBg);

    // Left button
    var btnL = makeTouchBtn('◀', 8, 45, 'left');
    var btnR = makeTouchBtn('▶', 72, 45, 'right');
    var btnU = makeTouchBtn('▲', 45, 8, 'up');
    var btnD = makeTouchBtn('▼', 45, 72, 'down');
    dpad.appendChild(btnL);
    dpad.appendChild(btnR);
    dpad.appendChild(btnU);
    dpad.appendChild(btnD);

    // ── Right side: Gas, Brake, Honk, Exit ──
    var rightSide = document.createElement('div');
    rightSide.style.cssText = 'display:flex;flex-direction:column;gap:10px;align-items:flex-end;pointer-events:auto;';

    var btnExit = document.createElement('button');
    btnExit.textContent = '✕ Exit';
    btnExit.style.cssText = 'background:rgba(180,20,20,0.85);color:#fff;border:1px solid #ff4444;border-radius:8px;padding:8px 16px;font-family:monospace;font-size:13px;font-weight:bold;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation;';
    btnExit.addEventListener('touchstart', function(e) { e.preventDefault(); stopGame(); }, { passive: false });
    btnExit.addEventListener('click', function(e) { stopGame(); });

    var btnHonk = document.createElement('button');
    btnHonk.textContent = '📯 Honk';
    btnHonk.style.cssText = 'background:rgba(255,180,40,0.85);color:#1a1a1a;border:1px solid #ffaa00;border-radius:8px;padding:8px 16px;font-family:monospace;font-size:13px;font-weight:bold;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation;';
    btnHonk.addEventListener('touchstart', function(e) { e.preventDefault(); if(car){car.honkTimer=30;} startHorn(); }, { passive: false });
    btnHonk.addEventListener('touchend', function(e) { e.preventDefault(); stopHorn(); }, { passive: false });

    rightSide.appendChild(btnExit);
    rightSide.appendChild(btnHonk);

    wrap.appendChild(dpad);
    wrap.appendChild(rightSide);
    document.body.appendChild(wrap);

    touchControls = wrap;
  }

  function makeTouchBtn(label, x, y, dir) {
    var btn = document.createElement('div');
    btn.textContent = label;
    btn.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:50px;height:50px;display:flex;align-items:center;justify-content:center;font-size:20px;color:#ff5555;background:rgba(255,50,50,0.15);border:1px solid rgba(255,50,50,0.4);border-radius:8px;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:none;user-select:none;-webkit-user-select:none;';
    
    var keyMap = { 'left': 'arrowleft', 'right': 'arrowright', 'up': 'arrowup', 'down': 'arrowdown' };
    var key = keyMap[dir];

    btn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      keys[key] = true;
      btn.style.background = 'rgba(255,50,50,0.5)';
      btn.style.color = '#fff';
    }, { passive: false });

    btn.addEventListener('touchend', function(e) {
      e.preventDefault();
      keys[key] = false;
      btn.style.background = 'rgba(255,50,50,0.15)';
      btn.style.color = '#ff5555';
    }, { passive: false });

    btn.addEventListener('touchcancel', function(e) {
      keys[key] = false;
      btn.style.background = 'rgba(255,50,50,0.15)';
      btn.style.color = '#ff5555';
    });

    return btn;
  }

  function removeTouchControls() {
    if (touchControls && touchControls.parentNode) {
      touchControls.parentNode.removeChild(touchControls);
      touchControls = null;
    }
  }

  // ── Canvas Setup ──
  function startGame() {
    gameActive = true;
    ensureAudio();

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;pointer-events:auto;cursor:crosshair;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    hintEl = document.createElement('div');
    hintEl.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:1000000;background:rgba(0,0,0,0.85);color:#ff3333;font-family:monospace;font-size:14px;padding:12px 24px;border-radius:8px;border:1px solid #ff3333;pointer-events:none;text-align:center;letter-spacing:1px;';
    hintEl.innerHTML = '🚙 LAND CRUISER 79 — DRIVE MODE<br><span style="color:#aaa;font-size:11px">Arrows/WASD to drive · ESC to exit · H to honk</span>';
    if (isTouch) {
      hintEl.innerHTML = '🚙 LAND CRUISER 79 — DRIVE MODE<br><span style="color:#aaa;font-size:11px">Use on-screen controls · Exit button to quit · 📯 to honk</span>';
    }
    document.body.appendChild(hintEl);

    timerInterval = setInterval(function () {
      hintEl.style.opacity = hintEl.style.opacity === '0.3' ? '1' : '0.3';
    }, 600);

    setTimeout(function () {
      if (hintEl) { hintEl.style.transition = 'opacity 1s'; hintEl.style.opacity = '0'; }
    }, 5000);

    // Skid marks layer (separate canvas so marks persist on the ground)
    skidCanvas = document.createElement('canvas');
    skidCanvas.width = window.innerWidth;
    skidCanvas.height = window.innerHeight;
    skidCtx = skidCanvas.getContext('2d');

    car = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      angle: 0,
      speed: 0,
      maxSpeed: 7,
      acceleration: 0.12,
      friction: 0.04,
      brakeFriction: 0.25,
      turnSpeed: 0.045,
      width: 120,
      height: 72,
      wheelAngle: 0,
      honkTimer: 0,
      exhaustParticles: [],
      prevSteering: false,
      lastSkidX: 0,
      lastSkidY: 0,
      skidSpacing: 4,
      prevLeftSkidX: null,
      prevLeftSkidY: null,
      prevRightSkidX: null,
      prevRightSkidY: null
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp, { passive: false });
    window.addEventListener('resize', onResize);

    // Touch controls for mobile
    var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (isTouch) {
      createTouchControls();
    }

    startScreech();
    render();
  }

  function onKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
    keys[e.code] = true;

    if (e.key === 'Escape') { e.preventDefault(); stopGame(); return; }

    var gameKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd', 'h'];
    if (gameKeys.indexOf(e.key.toLowerCase()) !== -1) e.preventDefault();

    if (e.key.toLowerCase() === 'h') {
      car.honkTimer = 30;
      startHorn();
    }
  }

  function onKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
    if (e.key.toLowerCase() === 'h') {
      stopHorn();
    }
  }

  function onResize() {
    var oldSkid = null;
    if (skidCanvas) {
      oldSkid = document.createElement('canvas');
      oldSkid.width = skidCanvas.width;
      oldSkid.height = skidCanvas.height;
      oldSkid.getContext('2d').drawImage(skidCanvas, 0, 0);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (skidCanvas) {
      skidCanvas.width = window.innerWidth;
      skidCanvas.height = window.innerHeight;
      if (oldSkid) skidCtx.drawImage(oldSkid, 0, 0);
    }
  }

  // ── Physics ──
  function updateCar() {
    if (keys['arrowup'] || keys['w']) {
      // Gradual ramp: acceleration decreases as speed increases (diminishing returns)
      var accelFactor = 1 - (Math.abs(car.speed) / car.maxSpeed) * 0.7;
      car.speed = Math.min(car.speed + car.acceleration * accelFactor, car.maxSpeed);
    } else if (keys['arrowdown'] || keys['s']) {
      // Braking: strong deceleration with screech when moving forward
      if (car.speed > 0.5) {
        car.speed = Math.max(car.speed - car.brakeFriction, 0);
      } else {
        // Once stopped, reverse
        var decelFactor = 1 - (Math.abs(car.speed) / (car.maxSpeed * 0.6)) * 0.7;
        car.speed = Math.max(car.speed - car.acceleration * decelFactor, -car.maxSpeed * 0.6);
      }
    } else {
      if (Math.abs(car.speed) < car.friction) { car.speed = 0; }
      else { car.speed -= Math.sign(car.speed) * car.friction; }
    }

    var steering = false;
    if (Math.abs(car.speed) > 0.1) {
      var steerFactor = Math.sign(car.speed);
      if (keys['arrowleft'] || keys['a']) {
        car.angle -= car.turnSpeed * steerFactor;
        car.wheelAngle = -0.3;
        steering = true;
      } else if (keys['arrowright'] || keys['d']) {
        car.angle += car.turnSpeed * steerFactor;
        car.wheelAngle = 0.3;
        steering = true;
      } else {
        car.wheelAngle *= 0.8;
      }
    } else {
      car.wheelAngle *= 0.8;
    }

    // Tire screech volume based on speed + steering or braking
    var screechVol = 0;
    var isBraking = (keys['arrowdown'] || keys['s']) && car.speed > 0.5;
    if (isBraking) {
      // Braking screech — louder
      screechVol = Math.min(0.2, car.speed / car.maxSpeed * 0.25);
      playBrake();
    } else if (steering && Math.abs(car.speed) > 1.5) {
      screechVol = Math.min(0.12, Math.abs(car.speed) / car.maxSpeed * 0.15);
    }
    setScreechVolume(screechVol);

    // Move
    car.x += Math.cos(car.angle) * car.speed;
    car.y += Math.sin(car.angle) * car.speed;

    // Horizontal wrap
    var margin = 60;
    if (car.x < -margin) car.x = canvas.width + margin;
    if (car.x > canvas.width + margin) car.x = -margin;

    // Vertical: clamp to viewport (page scrolls instead)
    var minY = 40;
    var maxY = canvas.height - 40;
    // Use speed-based scroll for natural page traversal
    var vy = Math.sin(car.angle) * car.speed;
    if (car.y < minY && vy < 0) {
      window.scrollBy(0, vy * 6);
      car.y = minY;
    }
    if (car.y > maxY && vy > 0) {
      window.scrollBy(0, vy * 6);
      car.y = maxY;
    }

    // Exhaust particles
    if (Math.abs(car.speed) > 0.5) {
      var backX = car.x - Math.cos(car.angle) * 48;
      var backY = car.y - Math.sin(car.angle) * 48;
      car.exhaustParticles.push({
        x: backX + (Math.random() - 0.5) * 10,
        y: backY + (Math.random() - 0.5) * 10,
        vx: -Math.cos(car.angle) * 0.5 + (Math.random() - 0.5),
        vy: -Math.sin(car.angle) * 0.5 + (Math.random() - 0.5),
        life: 30 + Math.random() * 20,
        size: 3 + Math.random() * 3
      });
    }

    for (var i = car.exhaustParticles.length - 1; i >= 0; i--) {
      var p = car.exhaustParticles[i];
      p.x += p.vx; p.y += p.vy; p.life--; p.size += 0.1;
      if (p.life <= 0) car.exhaustParticles.splice(i, 1);
    }

    // ── Skid marks — leave dark tracks whenever the car is moving ──
    var speedAbs = Math.abs(car.speed);
    var isBrakingHard = (keys['arrowdown'] || keys['s']) && car.speed > 1;
    var isSkidding = speedAbs > 0.5;

    if (isSkidding) {
      var halfW = car.width / 2;
      var halfH = car.height / 2;
      var rearOffsetX = -halfW + car.width * 0.15;
      var wheelSpread = halfH + 2;

      var cosA = Math.cos(car.angle);
      var sinA = Math.sin(car.angle);

      // Left rear wheel world position
      var lx = car.x + cosA * rearOffsetX - sinA * (-wheelSpread);
      var ly = car.y + sinA * rearOffsetX + cosA * (-wheelSpread);
      // Right rear wheel world position
      var rx = car.x + cosA * rearOffsetX - sinA * wheelSpread;
      var ry = car.y + sinA * rearOffsetX + cosA * wheelSpread;

      var dx = car.x - car.lastSkidX;
      var dy = car.y - car.lastSkidY;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist >= car.skidSpacing) {
        // Heavier marks when braking or turning at speed
        var alpha = 0.15;
        var markWidth = 2.5;
        if (isBrakingHard) { alpha = 0.4; markWidth = 4; }
        else if (steering && speedAbs > 2) { alpha = 0.3; markWidth = 3; }

        skidCtx.strokeStyle = 'rgba(25,25,25,' + alpha + ')';
        skidCtx.lineWidth = markWidth;
        skidCtx.lineCap = 'round';

        // Left skid mark segment
        if (car.prevLeftSkidX !== null) {
          skidCtx.beginPath();
          skidCtx.moveTo(car.prevLeftSkidX, car.prevLeftSkidY);
          skidCtx.lineTo(lx, ly);
          skidCtx.stroke();
        }
        // Right skid mark segment
        if (car.prevRightSkidX !== null) {
          skidCtx.beginPath();
          skidCtx.moveTo(car.prevRightSkidX, car.prevRightSkidY);
          skidCtx.lineTo(rx, ry);
          skidCtx.stroke();
        }

        car.prevLeftSkidX = lx;
        car.prevLeftSkidY = ly;
        car.prevRightSkidX = rx;
        car.prevRightSkidY = ry;
        car.lastSkidX = car.x;
        car.lastSkidY = car.y;
      }
    } else {
      car.prevLeftSkidX = null;
      car.prevLeftSkidY = null;
      car.prevRightSkidX = null;
      car.prevRightSkidY = null;
    }

    if (car.honkTimer > 0) car.honkTimer--;
  }

  // ── Drawing ──
  function drawCar() {
    // Exhaust particles (behind car)
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

    // Draw sprite image centered
    var w = car.width;
    var h = car.height;
    if (carSprite.complete && carSprite.naturalWidth > 0) {
      ctx.drawImage(carSprite, -w / 2, -h / 2, w, h);
    } else {
      // Fallback: red rectangle while sprite loads
      ctx.fillStyle = '#cc1a1a';
      ctx.fillRect(-w / 2, -h / 2, w, h);
    }

    // Headlight glow when moving forward
    if (car.speed > 0.5) {
      ctx.fillStyle = 'rgba(255,240,140,0.12)';
      ctx.beginPath();
      ctx.moveTo(w / 2, -h / 4);
      ctx.lineTo(w / 2 + 40, -h / 3);
      ctx.lineTo(w / 2 + 40, h / 3);
      ctx.lineTo(w / 2, h / 4);
      ctx.closePath();
      ctx.fill();
    }

    // Honk visual
    if (car.honkTimer > 0) {
      var ha = car.honkTimer / 30 * 0.8;
      ctx.fillStyle = 'rgba(255,221,68,' + ha + ')';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BEEP!', w / 2 + 30, -8);
      ctx.fillText('BEEP!', w / 2 + 30, 14);
    }

    ctx.restore();
  }

  // ── Render Loop ──
  function render() {
    if (!gameActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCar();

    // Draw skid marks (persist on the ground, fade slowly)
    if (skidCanvas) {
      // Very slow fade so old marks eventually disappear
      skidCtx.globalCompositeOperation = 'destination-out';
      skidCtx.fillStyle = 'rgba(0,0,0,0.001)';
      skidCtx.fillRect(0, 0, skidCanvas.width, skidCanvas.height);
      skidCtx.globalCompositeOperation = 'source-over';

      ctx.drawImage(skidCanvas, 0, 0);
    }

    drawCar();
    animationId = requestAnimationFrame(render);
  }

  // ── Cleanup ──
  function stopGame() {
    gameActive = false;
    cancelAnimationFrame(animationId);
    clearInterval(timerInterval);
    stopScreech();
    stopHorn();
    removeTouchControls();
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('resize', onResize);
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    if (hintEl && hintEl.parentNode) hintEl.parentNode.removeChild(hintEl);
    skidCanvas = null;
    skidCtx = null;
    car = null; keys = {};
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTrigger);
  } else {
    setupTrigger();
  }
})();