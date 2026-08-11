/**
 * Easter Egg: Land Cruiser Pickup 79
 * Double-click the hero title ("Shamyl Bin Mansoor") to activate.
 * Drive a cartoonish red & black Land Cruiser across the website.
 * Controls: Arrow keys / WASD to drive, ESC to exit, H to honk.
 *
 * Improvements:
 *  - Detailed top-down Land Cruiser 79 pickup sprite (snorkel, roof rack, mirrors, big wheels)
 *  - Tire screech sound while turning at speed (Web Audio filtered noise)
 *  - Realistic two-tone jeep horn (dual square-wave oscillators with blare)
 *  - Page scrolling: car stays centered vertically, page scrolls beneath
 */
(function () {
  'use strict';

  var gameActive = false;
  var canvas, ctx, car, keys = {}, animationId, hintEl, timerInterval;

  // ── Audio ──
  var audioCtx = null;
  var screechNodes = null;   // { source, filter, gain } for looping tire screech
  var hornNodes = null;      // { osc1, osc2, gain } for sustained horn

  function ensureAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // ── Tire Screech (looping filtered noise) ──
  function startScreech() {
    if (!audioCtx || screechNodes) return;
    try {
      // Create a noise buffer
      var bufferSize = audioCtx.sampleRate * 2; // 2 seconds of noise
      var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      var source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Bandpass filter around 800-1200 Hz for tire screech character
      var filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 1.5;

      // LFO to modulate filter frequency for realism
      var lfo = audioCtx.createOscillator();
      lfo.frequency.value = 6;
      var lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 150;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      // Gain envelope (start silent, ramp up)
      var gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      source.start();

      screechNodes = { source: source, filter: filter, gain: gain, lfo: lfo };
    } catch (e) {}
  }

  function stopScreech() {
    if (!screechNodes || !audioCtx) return;
    try {
      var gain = screechNodes.gain;
      gain.gain.cancelScheduledValues(audioCtx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
      screechNodes.source.stop(audioCtx.currentTime + 0.2);
      screechNodes.lfo.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
    screechNodes = null;
  }

  // ── Jeep Horn (dual square-wave with blare) ──
  function playHorn() {
    if (!audioCtx) return;
    try {
      // Stop previous horn if still going
      if (hornNodes) { stopHorn(); }

      var now = audioCtx.currentTime;
      var osc1 = audioCtx.createOscillator();
      var osc2 = audioCtx.createOscillator();
      var gain = audioCtx.createGain();

      osc1.type = 'square';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(400, now);
      osc2.frequency.setValueAtTime(500, now);
      // Slight detuning for brassy character
      osc1.detune.value = -4;
      osc2.detune.value = 5;

      // Quick attack, sustain, quick release
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);   // quick attack
      gain.gain.setValueAtTime(0.18, now + 0.12);             // sustain
      gain.gain.linearRampToValueAtTime(0.22, now + 0.15);    // blare swell
      gain.gain.linearRampToValueAtTime(0, now + 0.35);       // quick release

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);

      hornNodes = { osc1: osc1, osc2: osc2, gain: gain };
      // Clear after stop
      setTimeout(function () { hornNodes = null; }, 450);
    } catch (e) {}
  }

  function stopHorn() {
    if (!hornNodes || !audioCtx) return;
    try {
      var now = audioCtx.currentTime;
      hornNodes.gain.gain.cancelScheduledValues(now);
      hornNodes.gain.gain.setValueAtTime(hornNodes.gain.gain.value, now);
      hornNodes.gain.gain.linearRampToValueAtTime(0, now + 0.05);
      hornNodes.osc1.stop(now + 0.06);
      hornNodes.osc2.stop(now + 0.06);
    } catch (e) {}
    hornNodes = null;
  }

  // ── Trigger: double-click on hero title ("Shamyl Bin Mansoor") ──
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

    // Hint overlay
    hintEl = document.createElement('div');
    hintEl.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:1000000;background:rgba(0,0,0,0.85);color:#ff3333;font-family:monospace;font-size:14px;padding:12px 24px;border-radius:8px;border:1px solid #ff3333;pointer-events:none;text-align:center;letter-spacing:1px;';
    hintEl.innerHTML = '🚙 LAND CRUISER 79 — DRIVE MODE ACTIVE<br><span style="color:#aaa;font-size:11px">Arrow keys / WASD to drive · ESC to exit · Honk: H</span>';
    document.body.appendChild(hintEl);

    timerInterval = setInterval(function () {
      hintEl.style.opacity = hintEl.style.opacity === '0.3' ? '1' : '0.3';
    }, 600);

    setTimeout(function () {
      if (hintEl) hintEl.style.transition = 'opacity 1s';
      if (hintEl) hintEl.style.opacity = '0';
    }, 5000);

    // Car init — 100x60 for better visibility
    car = {
      x: canvas.width / 2 - 50,
      y: canvas.height / 2 - 30,
      angle: 0,
      speed: 0,
      maxSpeed: 6,
      acceleration: 0.25,
      friction: 0.05,
      turnSpeed: 0.055,
      width: 100,
      height: 60,
      wheelAngle: 0,
      honkTimer: 0,
      exhaustParticles: [],
      isTurning: false,
      wasTurning: false
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp, { passive: false });
    window.addEventListener('resize', onResize);

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

    // H for horn
    if (e.key.toLowerCase() === 'h') {
      e.preventDefault();
      car.honkTimer = 30;
      playHorn();
      return;
    }

    // Prevent default for horizontal game keys only (not up/down/s/w)
    var horizKeys = ['arrowleft', 'arrowright', 'a', 'd'];
    if (horizKeys.indexOf(e.key.toLowerCase()) !== -1) {
      e.preventDefault();
    }
    // Space and other game keys that should not scroll
    if (e.key === ' ') {
      e.preventDefault();
    }
  }

  function onKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
  }

  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Re-clamp car Y
    if (car) {
      var margin = 40;
      car.y = Math.max(margin, Math.min(canvas.height - margin, car.y));
    }
  }

  // ── Physics ──
  function updateCar() {
    // Forward/backward
    if (keys['arrowup'] || keys['w']) {
      car.speed = Math.min(car.speed + car.acceleration, car.maxSpeed);
    } else if (keys['arrowdown'] || keys['s']) {
      car.speed = Math.max(car.speed - car.acceleration, -car.maxSpeed * 0.6);
    } else {
      if (Math.abs(car.speed) < car.friction) {
        car.speed = 0;
      } else {
        car.speed -= Math.sign(car.speed) * car.friction;
      }
    }

    // Steering (only when moving)
    car.isTurning = false;
    if (Math.abs(car.speed) > 0.1) {
      var steerFactor = Math.sign(car.speed);
      if (keys['arrowleft'] || keys['a']) {
        car.angle -= car.turnSpeed * steerFactor;
        car.wheelAngle = -0.3;
        car.isTurning = true;
      } else if (keys['arrowright'] || keys['d']) {
        car.angle += car.turnSpeed * steerFactor;
        car.wheelAngle = 0.3;
        car.isTurning = true;
      } else {
        car.wheelAngle *= 0.8;
      }
    } else {
      car.wheelAngle *= 0.8;
    }

    // Move
    car.x += Math.cos(car.angle) * car.speed;
    car.y += Math.sin(car.angle) * car.speed;

    // Horizontal wrapping (left/right)
    var margin = 60;
    if (car.x < -margin) car.x = canvas.width + margin;
    if (car.x > canvas.width + margin) car.x = -margin;

    // Vertical: clamp to viewport (no wrapping) — page scrolls instead
    var vertMargin = 40;
    car.y = Math.max(vertMargin, Math.min(canvas.height - vertMargin, car.y));

    // Page scrolling: scroll the actual page proportional to Y velocity
    var vy = Math.sin(car.angle) * car.speed;
    if (Math.abs(vy) > 0.15) {
      window.scrollBy(0, vy);
    }

    // ── Tire screech audio ──
    var turningAtSpeed = car.isTurning && Math.abs(car.speed) > 1.5;
    if (turningAtSpeed && !car.wasTurning) {
      startScreech();
    } else if (!turningAtSpeed && car.wasTurning) {
      stopScreech();
    }
    car.wasTurning = turningAtSpeed;

    // Exhaust particles
    if (Math.abs(car.speed) > 0.5) {
      var backX = car.x - Math.cos(car.angle) * 42;
      var backY = car.y - Math.sin(car.angle) * 42;
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

  // ── Drawing: Detailed Land Cruiser Pickup 79 (top-down) ──
  function drawCar() {
    // Draw exhaust particles first (behind car)
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

    var w = car.width;   // 100
    var h = car.height;  // 60
    var hw = w / 2;      // 50
    var hh = h / 2;      // 30

    // ── Shadow ──
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(3, 2, hw + 3, hh + 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Wheels (drawn first, under body) ──
    // Bigger, more proportional wheels
    var wheelW = 14;
    var wheelH = 7;
    var wheelPositions = [
      { x: -hw + w * 0.12, y: -hh - 2 },   // rear-left
      { x: -hw + w * 0.12, y:  hh + 2 },   // rear-right
      { x:  hw - w * 0.18, y: -hh - 2 },   // front-left
      { x:  hw - w * 0.18, y:  hh + 2 }    // front-right
    ];

    for (var wi = 0; wi < wheelPositions.length; wi++) {
      var wp = wheelPositions[wi];
      ctx.save();
      ctx.translate(wp.x, wp.y);

      // Front wheels turn with steering
      if (wi >= 2) {
        ctx.rotate(car.wheelAngle * 0.4);
      }

      // Tire (dark)
      ctx.fillStyle = '#111';
      roundRectPath(-wheelW / 2, -wheelH / 2, wheelW, wheelH, 1.5);
      ctx.fill();

      // Tread lines
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.5;
      for (var ti = -wheelW / 2 + 2; ti < wheelW / 2; ti += 2.5) {
        ctx.beginPath();
        ctx.moveTo(ti, -wheelH / 2 + 0.5);
        ctx.lineTo(ti, wheelH / 2 - 0.5);
        ctx.stroke();
      }

      // Hubcap
      ctx.fillStyle = '#555';
      roundRectPath(-wheelW / 2 + 3, -wheelH / 2 + 1.5, wheelW - 6, wheelH - 3, 1);
      ctx.fill();

      ctx.restore();
    }

    // ── Flatbed (rear) — black floor with red rails ──
    // The flatbed takes the back ~45% of the vehicle
    var bedX = -hw + 2;
    var bedY = -hh + 3;
    var bedW = w * 0.42;
    var bedH = h - 6;

    // Bed floor (dark)
    ctx.fillStyle = '#222';
    roundRectPath(bedX, bedY, bedW, bedH, 3);
    ctx.fill();

    // Bed side rails (red)
    ctx.fillStyle = '#cc1a1a';
    ctx.fillRect(bedX, bedY - 1, bedW, 3);           // top rail
    ctx.fillRect(bedX, bedY + bedH - 2, bedW, 3);    // bottom rail
    // Bed back rail
    ctx.fillRect(bedX - 1, bedY, 3, bedH);

    // Bed floor detail (wood plank lines)
    ctx.strokeStyle = 'rgba(80,60,50,0.5)';
    ctx.lineWidth = 0.5;
    for (var bi = bedX + 6; bi < bedX + bedW - 2; bi += 6) {
      ctx.beginPath();
      ctx.moveTo(bi, bedY + 3);
      ctx.lineTo(bi, bedY + bedH - 3);
      ctx.stroke();
    }

    // ── Cab (front) — red body ──
    var cabX = -hw + bedW + 2;
    var cabY = -hh + 2;
    var cabW = w - bedW - 4;
    var cabH = h - 4;

    // Main cab body (red)
    ctx.fillStyle = '#cc1a1a';
    roundRectPath(cabX, cabY, cabW, cabH, 5);
    ctx.fill();

    // Body outline (dark)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    roundRectPath(cabX, cabY, cabW, cabH, 5);
    ctx.stroke();

    // Red highlight stripe
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(cabX + 2, -1, cabW - 4, 1.5);

    // ── Roof rack on cab ──
    ctx.fillStyle = '#1a1a1a';
    roundRectPath(cabX + 3, cabY + 2, cabW - 6, cabH - 4, 3);
    ctx.fill();
    // Roof rack slats
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 0.8;
    for (var ri = cabX + 6; ri < cabX + cabW - 4; ri += 5) {
      ctx.beginPath();
      ctx.moveTo(ri, cabY + 3);
      ctx.lineTo(ri, cabY + cabH - 3);
      ctx.stroke();
    }
    // Roof rack border
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    roundRectPath(cabX + 3, cabY + 2, cabW - 6, cabH - 4, 3);
    ctx.stroke();

    // ── Windshield (front of cab, angled) ──
    var wsX = cabX + cabW * 0.58;
    var wsY = cabY + 3;
    var wsW = cabW * 0.22;
    var wsH = cabH - 6;
    ctx.fillStyle = 'rgba(160,210,250,0.65)';
    roundRectPath(wsX, wsY, wsW, wsH, 3);
    ctx.fill();
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    roundRectPath(wsX, wsY, wsW, wsH, 3);
    ctx.stroke();
    // Windshield center divider
    ctx.beginPath();
    ctx.moveTo(wsX + wsW / 2, wsY);
    ctx.lineTo(wsX + wsW / 2, wsY + wsH);
    ctx.stroke();
    // Windshield reflection highlight
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(wsX + 2, wsY + 2);
    ctx.lineTo(wsX + 6, wsY + 2);
    ctx.lineTo(wsX + 2, wsY + 8);
    ctx.closePath();
    ctx.fill();

    // ── Side windows (cab sides) ──
    ctx.fillStyle = 'rgba(160,210,250,0.45)';
    // Left side window
    ctx.fillRect(cabX + 4, cabY + 4, cabW * 0.35, 3);
    // Right side window
    ctx.fillRect(cabX + 4, cabY + cabH - 7, cabW * 0.35, 3);
    // Window outlines
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.7;
    ctx.strokeRect(cabX + 4, cabY + 4, cabW * 0.35, 3);
    ctx.strokeRect(cabX + 4, cabY + cabH - 7, cabW * 0.35, 3);

    // ── Side mirrors ──
    ctx.fillStyle = '#1a1a1a';
    // Left mirror
    ctx.fillRect(cabX + cabW * 0.5, cabY - 3, 2, 3);
    ctx.fillRect(cabX + cabW * 0.5 + 2, cabY - 3, 4, 2);
    // Right mirror
    ctx.fillRect(cabX + cabW * 0.5, cabY + cabH, 2, 3);
    ctx.fillRect(cabX + cabW * 0.5 + 2, cabY + cabH + 1, 4, 2);
    // Mirror glass
    ctx.fillStyle = 'rgba(160,210,250,0.4)';
    ctx.fillRect(cabX + cabW * 0.5 + 2.5, cabY - 2.5, 3, 1);
    ctx.fillRect(cabX + cabW * 0.5 + 2.5, cabY + cabH + 1.5, 3, 1);

    // ── Snorkel (iconic Land Cruiser detail on A-pillar) ──
    // Snorkel goes up the left side of the windshield
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    // Base at cab body near windshield, goes outward then up and forward
    ctx.moveTo(wsX - 1, cabY + 2);
    ctx.lineTo(wsX - 1, cabY - 6);
    ctx.lineTo(wsX + 4, cabY - 6);
    ctx.stroke();
    // Snorkel head (opening)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(wsX + 4, cabY - 6, 2, 0, Math.PI * 2);
    ctx.fill();
    // Snorkel inner detail
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.arc(wsX + 4, cabY - 6, 1, 0, Math.PI * 2);
    ctx.fill();

    // ── Headlights (front) ──
    ctx.fillStyle = '#ffdd44';
    ctx.beginPath();
    ctx.arc(cabX + cabW - 3, cabY + 4, 2.5, 0, Math.PI * 2);
    ctx.arc(cabX + cabW - 3, cabY + cabH - 4, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Headlight glow
    ctx.fillStyle = 'rgba(255,221,68,0.3)';
    ctx.beginPath();
    ctx.arc(cabX + cabW - 3, cabY + 4, 4, 0, Math.PI * 2);
    ctx.arc(cabX + cabW - 3, cabY + cabH - 4, 4, 0, Math.PI * 2);
    ctx.fill();

    // Headlight beam when moving forward
    if (car.speed > 0.5) {
      var beamLen = 30 + car.speed * 5;
      ctx.fillStyle = 'rgba(255,221,68,0.08)';
      ctx.beginPath();
      ctx.moveTo(cabX + cabW - 1, cabY + 3);
      ctx.lineTo(cabX + cabW + beamLen, cabY - 2);
      ctx.lineTo(cabX + cabW + beamLen, cabY + cabH + 2);
      ctx.lineTo(cabX + cabW - 1, cabY + cabH - 3);
      ctx.closePath();
      ctx.fill();
      // Brighter inner beam
      ctx.fillStyle = 'rgba(255,221,68,0.12)';
      ctx.beginPath();
      ctx.moveTo(cabX + cabW - 1, cabY + 6);
      ctx.lineTo(cabX + cabW + beamLen * 0.7, cabY + 3);
      ctx.lineTo(cabX + cabW + beamLen * 0.7, cabY + cabH - 3);
      ctx.lineTo(cabX + cabW - 1, cabY + cabH - 6);
      ctx.closePath();
      ctx.fill();
    }

    // ── Taillights (back of flatbed) ──
    ctx.fillStyle = '#cc0000';
    ctx.beginPath();
    ctx.arc(bedX - 1, cabY + 4, 2.5, 0, Math.PI * 2);
    ctx.arc(bedX - 1, cabY + cabH - 4, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Taillight glow
    ctx.fillStyle = 'rgba(204,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(bedX - 1, cabY + 4, 4, 0, Math.PI * 2);
    ctx.arc(bedX - 1, cabY + cabH - 4, 4, 0, Math.PI * 2);
    ctx.fill();

    // ── Body detail lines ──
    // Door line on cab
    ctx.strokeStyle = 'rgba(26,26,26,0.5)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cabX + cabW * 0.35, cabY + 2);
    ctx.lineTo(cabX + cabW * 0.35, cabY + cabH - 2);
    ctx.stroke();
    // Bed/cab divider line
    ctx.beginPath();
    ctx.moveTo(cabX - 1, cabY);
    ctx.lineTo(cabX - 1, cabY + cabH);
    ctx.stroke();

    // ── "TOYOTA" text on cab roof ──
    if (Math.abs(car.speed) < 0.5) {
      ctx.fillStyle = 'rgba(220,220,220,0.6)';
      ctx.font = 'bold 5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TOYOTA', cabX + cabW * 0.3, 1);
    }

    // ── Honk visual ──
    if (car.honkTimer > 0) {
      var honkAlpha = car.honkTimer / 30 * 0.8;
      ctx.fillStyle = 'rgba(255,221,68,' + honkAlpha + ')';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BEEP!', hw + 18, -8);
      ctx.fillText('BEEP!', hw + 18, 12);
      // Honk lines
      ctx.strokeStyle = 'rgba(255,221,68,' + honkAlpha + ')';
      ctx.lineWidth = 1.5;
      for (var hl = 0; hl < 3; hl++) {
        var off = hl * 8;
        ctx.beginPath();
        ctx.moveTo(hw + 8, -4 + off);
        ctx.lineTo(hw + 14, -6 + off);
        ctx.lineTo(hw + 20, -4 + off);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // Helper: rounded rectangle path (does not fill — caller fills/strokes)
  function roundRectPath(x, y, w, h, r) {
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
    stopScreech();
    stopHorn();
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('resize', onResize);
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    if (hintEl && hintEl.parentNode) hintEl.parentNode.removeChild(hintEl);
    canvas = null;
    ctx = null;
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