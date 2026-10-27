// INRI — Atmosphere: time-of-day light, ambient soundscapes, gentle verse reveal
// All sound is generated live with the Web Audio API (nothing to download).

// ---------- Time of day ----------
function timeOfDay(d) {
  const h = (d || new Date()).getHours();
  if (h >= 5 && h < 9) return 'dawn';
  if (h >= 9 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'evening';
  return 'night';
}

// mood: optional override for a page ('dawn' on Morning Prayer, 'night' on Night Prayer)
function applyAtmosphere(mood) {
  const root = document.documentElement;
  root.setAttribute('data-tod', mood || timeOfDay());
}

// ---------- Ambient sound ----------
const Ambient = (function() {
  let ctx = null, master = null, nodes = [], timers = [], current = 'off', duckLevel = 1;

  function settings() { return STORAGE.get('ambient', { type: 'off', volume: 0.5 }); }
  function save(s) { STORAGE.set('ambient', s); }

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Brown-ish noise buffer (deeper, softer than white noise)
  function noiseBuffer(seconds, brown) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
        else d[i] = w;
      }
    }
    return buf;
  }

  function loopNoise(brown) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(4, brown);
    src.loop = true;
    src.start();
    nodes.push(src);
    return src;
  }

  function filter(type, freq, q) {
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; if (q) f.Q.value = q;
    nodes.push(f);
    return f;
  }

  function gain(v) { const g = ctx.createGain(); g.gain.value = v; nodes.push(g); return g; }

  function lfo(target, rate, depth, base) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = rate; g.gain.value = depth;
    o.connect(g); g.connect(target);
    if (base !== undefined) target.value = base;
    o.start();
    nodes.push(o, g);
  }

  // Short random bursts (raindrops, fire crackles)
  function sprinkle(makeBurst, minMs, maxMs) {
    function tick() {
      if (current === 'off') return;
      makeBurst();
      timers.push(setTimeout(tick, minMs + Math.random() * (maxMs - minMs)));
    }
    tick();
  }

  function burst(freq, q, dur, vol, type) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(0.2, false);
    const f = ctx.createBiquadFilter();
    f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    src.connect(f); f.connect(g);
    if (pan) { pan.pan.value = Math.random() * 1.6 - 0.8; g.connect(pan); pan.connect(master); } else g.connect(master);
    src.start(t); src.stop(t + dur + 0.05);
  }

  const builders = {
    rain: function() {
      const n = loopNoise(false);
      const hp = filter('highpass', 400), lp = filter('lowpass', 6000), g = gain(0.22);
      n.connect(hp); hp.connect(lp); lp.connect(g); g.connect(master);
      const low = loopNoise(true), lf = filter('lowpass', 500), lg = gain(0.35);
      low.connect(lf); lf.connect(lg); lg.connect(master);
      sprinkle(function() { burst(2500 + Math.random() * 3500, 3, 0.04 + Math.random() * 0.05, 0.08 + Math.random() * 0.08); }, 15, 90);
    },
    fire: function() {
      const n = loopNoise(true), lp = filter('lowpass', 420), g = gain(0.7);
      n.connect(lp); lp.connect(g); g.connect(master);
      lfo(g.gain, 0.23, 0.18, 0.6);
      sprinkle(function() {
        const pops = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < pops; i++) setTimeout(function() { if (ctx) burst(1200 + Math.random() * 2400, 1.5, 0.02 + Math.random() * 0.03, 0.12 + Math.random() * 0.2, 'highpass'); }, i * (20 + Math.random() * 40));
      }, 90, 600);
    },
    waves: function() {
      const n = loopNoise(true), lp = filter('lowpass', 900), g = gain(0.0);
      n.connect(lp); lp.connect(g); g.connect(master);
      lfo(g.gain, 1 / 9, 0.45, 0.5);      // swell every ~9 seconds
      lfo(lp.frequency, 1 / 9, 500, 900);  // brighter as the wave breaks
      const hiss = loopNoise(false), hf = filter('bandpass', 3000, 0.6), hg = gain(0.0);
      hiss.connect(hf); hf.connect(hg); hg.connect(master);
      lfo(hg.gain, 1 / 9, 0.05, 0.05);
    },
    pad: function() {
      // A soft, slowly breathing D-major drone
      [73.42, 110.0, 146.83, 220.0, 293.66, 369.99].forEach(function(f, i) {
        [-3, 3].forEach(function(cents) {
          const o = ctx.createOscillator();
          o.type = i < 2 ? 'sine' : 'triangle';
          o.frequency.value = f; o.detune.value = cents + (Math.random() * 2 - 1);
          const g = gain(i < 2 ? 0.07 : 0.025);
          o.connect(g); g.connect(master); o.start(); nodes.push(o);
          lfo(g.gain, 0.03 + Math.random() * 0.05, i < 2 ? 0.02 : 0.015, i < 2 ? 0.07 : 0.025);
        });
      });
    }
  };

  function stopNodes() {
    timers.forEach(clearTimeout); timers = [];
    nodes.forEach(function(n) { try { n.stop && n.stop(); } catch (e) {} try { n.disconnect(); } catch (e) {} });
    nodes = [];
  }

  function targetVolume() { return settings().volume * duckLevel; }

  function fadeTo(v, secs) {
    if (!ctx) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(v, t + secs);
  }

  function play(type) {
    const s = settings(); s.type = type; save(s);
    if (type === 'off') { stop(); return; }
    if (!ensureCtx()) { showToast('Sound is not supported in this browser'); return; }
    fadeTo(0, 0.4);
    setTimeout(function() {
      stopNodes();
      current = type;
      builders[type]();
      fadeTo(targetVolume(), 2.5);
      updateButton();
    }, current === 'off' ? 0 : 420);
  }

  function stop() {
    current = 'off';
    const s = settings(); s.type = 'off'; save(s);
    fadeTo(0, 1.2);
    setTimeout(function() { if (current === 'off') stopNodes(); }, 1300);
    updateButton();
  }

  function setVolume(v) {
    const s = settings(); s.volume = v; save(s);
    if (ctx && current !== 'off') fadeTo(targetVolume(), 0.2);
  }

  // Lower the sound while the narrator is speaking
  function duck(on) {
    duckLevel = on ? 0.35 : 1;
    if (ctx && current !== 'off') fadeTo(targetVolume(), 0.6);
  }

  function updateButton() {
    const b = document.getElementById('ambient-btn');
    if (b) b.classList.toggle('on', current !== 'off');
  }

  // Browsers only allow sound after a tap, so resume a saved choice on first touch
  function resumeOnGesture() {
    const s = settings();
    if (s.type === 'off') return;
    function go() {
      document.removeEventListener('pointerdown', go, true);
      if (current === 'off') play(s.type);
    }
    document.addEventListener('pointerdown', go, true);
  }

  return { play: play, stop: stop, setVolume: setVolume, duck: duck, settings: settings, current: function() { return current; }, resumeOnGesture: resumeOnGesture, updateButton: updateButton };
})();

const AMBIENT_CHOICES = [
  ['off', 'Silence', '🤫'], ['rain', 'Rain', '🌧️'], ['fire', 'Fireside', '🔥'], ['waves', 'Galilee shore', '🌊'], ['pad', 'Still pad', '🎵']
];

function toggleAmbientPanel() {
  let panel = document.getElementById('ambient-panel');
  if (panel) { panel.remove(); return; }
  const s = Ambient.settings();
  panel = document.createElement('div');
  panel.id = 'ambient-panel';
  panel.className = 'ambient-panel';
  panel.innerHTML = '<div class="insp-label">Ambient sound</div><div class="ambient-choices">' +
    AMBIENT_CHOICES.map(function(c) {
      return '<button class="ambient-choice' + (Ambient.current() === c[0] || (c[0] === 'off' && Ambient.current() === 'off') ? ' active' : '') + '" data-amb="' + c[0] + '"><span>' + c[2] + '</span>' + c[1] + '</button>';
    }).join('') + '</div>' +
    '<label class="ambient-vol">Volume <input type="range" min="0" max="1" step="0.05" value="' + s.volume + '" id="ambient-volume"></label>';
  document.body.appendChild(panel);
  panel.querySelectorAll('[data-amb]').forEach(function(b) {
    b.onclick = function() {
      Ambient.play(b.dataset.amb);
      panel.querySelectorAll('[data-amb]').forEach(function(x) { x.classList.toggle('active', x === b); });
    };
  });
  document.getElementById('ambient-volume').oninput = function() { Ambient.setVolume(parseFloat(this.value)); };
  setTimeout(function() {
    function away(e) {
      if (!panel.contains(e.target) && e.target.id !== 'ambient-btn') { panel.remove(); document.removeEventListener('pointerdown', away, true); }
    }
    document.addEventListener('pointerdown', away, true);
  }, 0);
}

// ---------- Verse reveal ----------
// Fades scripture in word by word. Skipped when "Reduce motion" is on.
function revealVerses(scope) {
  const a11y = (typeof getA11y === 'function') ? getA11y() : {};
  if (a11y.reduceMotion) return;
  (scope || document).querySelectorAll('.verse.reveal').forEach(function(el) {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    const words = el.textContent.split(/(\s+)/);
    el.innerHTML = words.map(function(w, i) {
      if (/^\s+$/.test(w)) return w;
      return '<span class="rw" style="animation-delay:' + (i * 0.045).toFixed(2) + 's">' + w + '</span>';
    }).join('');
  });
}
