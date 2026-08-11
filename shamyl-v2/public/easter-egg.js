/**
 * Easter Egg: Land Cruiser Pickup 79
 * Double-click the hero title ("Shamyl Bin Mansoor") to activate.
 * Drive a red & black Land Cruiser across the website.
 * Controls: Arrow keys / WASD to drive, ESC to exit, H to honk.
 *
 *  - SVG sprite image (2.5D shaded Land Cruiser 79 pickup)
 *  - Tire screech sound while turning at speed
 *  - Two-tone jeep horn (400Hz + 500Hz square waves with blare)
 *  - Page scrolls beneath the car when driving up/down
 */
(function () {
  'use strict';

  var gameActive = false;
  var canvas, ctx, car, keys = {}, animationId, hintEl, timerInterval;
  var carSprite = new Image();
  carSprite.src = '/images/land-cruiser-sprite.svg';

  // ── Audio ──
  var audioCtx = null;
  var screechNodes = null;
  var hornNodes = null;

  function ensureAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  // ── Tire Screech (looping filtered noise) ──
  function startScreech() {
    if (!audioCtx || screechNodes) return;
    try {
      var bufferSize = audioCtx.sampleRate * 2;
      var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      var source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      var bp = audioCtx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1000;
      bp.Q.value = 3;

      var hp = audioCtx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 600;

      var gain = audioCtx.createGain();
      gain.gain.value = 0;

      source.connect(hp);
      hp.connect(bp);
      bp.connect(gain);
      gain.connect(audioCtx.destination);
      source.start();

      screechNodes = { source: source, gain: gain, bp: bp };
    } catch (e) {}
  }

  function setScreechVolume(v) {
    if (screechNodes && audioCtx) {
      screechNodes.gain.gain.setTargetAtTime(v, audioCtx.currentTime, 0.05);
    }
  }

  function stopScreech() {
    if (screechNodes) {
      try {
        screechNodes.source.stop();
      } catch (e) {}
      screechNodes = null;
    }
  }

  // ── Jeep Horn (dual-tone square wave) ──
  function startHorn() {
    if (!audioCtx || hornNodes) return;
    try {
      var osc1 = audioCtx.createOscillator();
      var osc2 = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      var lfo = audioCtx.createOscillator();
      var lfoGain = audioCtx.createGain();

      osc1.type = 'square';
      osc1.frequency.value = 400;
      osc2.type = 'square';
      osc2.frequency.value = 500;

      // Blare effect — subtle LFO on gain
      lfo.frequency.value = 8;
      lfoGain.gain.value = 0.04;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      gain.gain.value = 0.15;

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      lfo.start();
      osc1.start();
      osc2.start();

      hornNodes = { osc1: osc1, osc2: osc2, gain: gain, lfo: lfo };
    } catch (e) {}
  }

  function stopHorn() {
    if (hornNodes) {
      try {
        hornNodes.osc1.stop();
        hornNodes.osc2.stop();
        hornNodes.lfo.stop();
      } catch (e) {}
      hornNodes = null;
    }
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
    hintEl.innerHTML = '🚙 LAND CRUISER 79 — DRIVE MODE<br><span style="color:#aaa;font-size:11px">Arrow keys / WASD to drive · ESC to exit · H to honk</span>';
    document.body.appendChild(hintEl);

    timerInterval = setInterval(function () {
      hintEl.style.opacity = hintEl.style.opacity === '0.3' ? '1' : '0.3';
    }, 600);

    setTimeout(function () {
      if (hintEl) { hintEl.style.transition = 'opacity 1s'; hintEl.style.opacity = '0'; }
    }, 5000);

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
      prevSteering: false
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp, { passive: false });
    window.addEventListener('resize', onResize);

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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
      // Braking screech — louder, lower pitched
      screechVol = Math.min(0.2, car.speed / car.maxSpeed * 0.25);
      if (screechNodes && screechNodes.bp) {
        screechNodes.bp.frequency.setTargetAtTime(700, audioCtx.currentTime, 0.05);
      }
    } else if (steering && Math.abs(car.speed) > 1.5) {
      screechVol = Math.min(0.12, Math.abs(car.speed) / car.maxSpeed * 0.15);
      if (screechNodes && screechNodes.bp) {
        screechNodes.bp.frequency.setTargetAtTime(1000, audioCtx.currentTime, 0.05);
      }
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
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('resize', onResize);
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    if (hintEl && hintEl.parentNode) hintEl.parentNode.removeChild(hintEl);
    car = null; keys = {};
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTrigger);
  } else {
    setupTrigger();
  }
})();