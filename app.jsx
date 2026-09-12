/* ===================================================
   RELATIONSHIP LIE DETECTOR — Main Application
   Department of Vibes™ — 100% Entertainment Only
   Built with React 18 + Babel Standalone (No Build Step)
   =================================================== */

// ─── SOUND UTILITY ───────────────────────────────────────────────────────────
const Sound = (() => {
  let ctx = null;
  let muted = false;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function playTone(freq, type, duration, volume = 0.15, delay = 0) {
    if (muted) return;
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      gain.gain.setValueAtTime(0, c.currentTime + delay);
      gain.gain.linearRampToValueAtTime(volume, c.currentTime + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + duration + 0.05);
    } catch (e) { /* silently ignore audio errors */ }
  }

  return {
    click() { playTone(880, 'sine', 0.08, 0.12); playTone(1320, 'sine', 0.05, 0.06, 0.04); },
    scan() {
      [200, 300, 450, 600, 800, 1000, 800, 600].forEach((f, i) => playTone(f, 'sawtooth', 0.15, 0.06, i * 0.12));
    },
    stage() { playTone(660, 'sine', 0.1, 0.08); playTone(880, 'sine', 0.08, 0.06, 0.08); },
    reveal() {
      [261, 329, 392, 523].forEach((f, i) => playTone(f, 'sine', 0.4, 0.12, i * 0.1));
      playTone(784, 'sine', 0.6, 0.15, 0.5);
    },
    error() { playTone(220, 'sawtooth', 0.2, 0.1); playTone(180, 'sawtooth', 0.2, 0.1, 0.15); },
    toggle(val) { muted = val; },
    isMuted() { return muted; },
  };
})();

// ─── FORENSICS ENGINE ────────────────────────────────────────────────────────
const Forensics = (() => {
  function hash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    return h;
  }

  function seededRandom(seed) {
    let s = seed;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xffffffff;
    };
  }

  function analyze(photoDataUrl, videoDataUrl) {
    const seed = hash((photoDataUrl || '').slice(0, 200) + (videoDataUrl || '').slice(0, 200));
    const rng = seededRandom(seed);

    const eyeOpenness = Math.round(20 + rng() * 75);
    const gazeStability = Math.round(10 + rng() * 85);
    const blinkFreq = Math.round(5 + rng() * 90);
    const eyeSymmetry = Math.round(30 + rng() * 68);
    const eyeMovement = Math.round(15 + rng() * 80);
    const micro = Math.round(10 + rng() * 88);
    const roastLevel = Math.round(20 + rng() * 80);
    const lieProbability = Math.round(8 + rng() * 84);
    const truthProbability = 100 - lieProbability;
    const confidence = Math.round(65 + rng() * 35);

    // Weighted verdict calculation
    const score = eyeOpenness * 0.2 + gazeStability * 0.15 + (100 - blinkFreq) * 0.15 + eyeSymmetry * 0.2 + micro * 0.3;
    let verdict;
    if (score > 72) verdict = 'COMMITTED';
    else if (score > 45) verdict = 'DATING';
    else verdict = 'SINGLE';

    const roastTier =
      roastLevel > 80 ? '🔥 SCORCHED EARTH' :
      roastLevel > 60 ? '🌶 SPICY AF' :
      roastLevel > 40 ? '😬 MILD EMBARRASSMENT' :
      '😐 CAFETERIA BEEF';

    const verdictEmoji = { SINGLE: '💔', DATING: '💕', COMMITTED: '❤️' };
    const verdictColor = { SINGLE: 'cyan', DATING: 'amber', COMMITTED: 'pink' };

    const evidenceDossiers = [
      {
        icon: '👁️',
        title: 'Ocular Pattern Analysis™',
        finding: eyeOpenness > 60
          ? `Subject's pupils dilated to ${eyeOpenness}% capacity — textbook "someone is watching me" energy. Our AI detects the unmistakable frequency of someone who checks their phone 47 times per hour hoping for a text.`
          : `Eyes ${100 - eyeOpenness}% closed, suggesting either profound inner peace or the look of someone who has cried watching The Notebook recently. Our Department of Vibes rates this a solid 7/10 for emotional unavailability.`,
      },
      {
        icon: '🎯',
        title: 'Gaze Vector Triangulation™',
        finding: gazeStability > 55
          ? `Gaze vector locked at ${gazeStability}° from optimal trust-axis. Subject looks directly at camera with the confidence of someone who has rehearsed their "we need to talk" speech at least 4 times in the mirror.`
          : `Erratic gaze trajectory (${100 - gazeStability}% instability) detected. Subject's eyes wander like someone who saw their ex's new partner's Instagram story and is trying to look unbothered. It's not working.`,
      },
      {
        icon: '💡',
        title: 'Blink Pattern Spectroscopy™',
        finding: blinkFreq > 55
          ? `Blink frequency at ${blinkFreq} BPM — dangerously high. Subject blinks with the urgency of someone rapidly reading "should I double text them?" Reddit threads. Our Vibrational Blink Index™ confirms: deeply invested.`
          : `Abnormally low blink rate of ${blinkFreq} BPM detected. Subject either has the emotional processing speed of a dial-up modem, or has achieved the rare state of Romantic Nirvana where all feelings have been successfully repressed.`,
      },
      {
        icon: '🧬',
        title: 'Micro-Expression DNA Mapping™',
        finding: micro > 55
          ? `Detected ${micro} micro-expressions per second — a personal record in our database. Subject's face cycles through "I'm fine", "I'm not fine", and "this is fine 🔥" approximately every 340 milliseconds. Our algorithm classifies this as Chaotic Romantic Energy (CRE-7).`
          : `Suspiciously few micro-expressions (${100 - micro}% suppression rate). Subject maintains the poker face of someone who has definitely practiced the "Oh, we're just hanging out, no big deal" reply while internally composing wedding vows.`,
      },
    ];

    const finalRoasts = {
      SINGLE: [
        `With ${lieProbability}% lie probability and eyebrow asymmetry that screams "I've been lying to myself about being over them for 6 months", our verdict is clear. Your eyes have the vacant stare of someone whose situationship just posted a photo with someone else. The Department of Vibes™ recommends: a glass of water and a long conversation with your houseplant.`,
        `The quantum entanglement sensors detected exactly zero romantic gravitational fields. You radiate the energy of someone who has watched "He's Just Not That Into You" 14 times — as self-therapy. Our biometrics show your heart rate spikes to 180 BPM when someone leaves your message on "read". You are, clinically speaking, living your best/worst single life.`,
      ],
      DATING: [
        `The readings don't lie (but you might). Your ${eyeSymmetry}% facial symmetry deviation suggests you're in the "we're not official but they're literally my entire personality" phase. Our AI detected 3 separate emotional frequencies: infatuation, mild panic, and the vague existential dread of people who use phrases like "what even are we?"`,
        `Congratulations! You're in that beautiful chaos zone between "we're just talking" and "so are you coming to my cousin's wedding or not?". The gaze stability analysis confirms you've already rehearsed introducing them to your parents — but still check their horoscope compatibility every other Tuesday. Chef's kiss energy.`,
      ],
      COMMITTED: [
        `The love algorithms have spoken. Your micro-expression density of ${micro}% matches our "terminally in love" database with ${confidence}% accuracy. You have the eyes of someone who has heard the same 3 stories 47 times and still responds with "wow, really?". The Department of Vibes™ detects serious "leaves voice notes longer than 3 minutes" energy. You're done for. And honestly? We respect it.`,
        `Maximum entanglement detected. Your ocular pattern matches our "shares Netflix password without being asked" profile. The biometrics confirm you have already catastrophized about what would happen if they mispronounce "quinoa" in front of your friends. Our verdict: committed with ${confidence}% precision and a 98% probability that you have a shared folder of memes on Google Photos.`,
      ],
    };

    const roastPool = finalRoasts[verdict];
    const finalRoast = roastPool[Math.floor(rng() * roastPool.length)];

    const metricRoasts = {
      eyeOpenness: eyeOpenness > 60
        ? `Wide-eyed and probably googling "${eyeOpenness > 75 ? "how to ask someone out" : "are we exclusive quiz"}" rn`
        : `The look of someone who has been emotionally unavailable since ${2015 + Math.floor(rng() * 8)}`,
      gazeStability: gazeStability > 55
        ? `Laser focus — either very confident or rehearsed this moment 12 times`
        : `Your eyes dart like someone reading the fine print of a situationship`,
      blinkFreq: blinkFreq > 55
        ? `Blinking at the exact frequency of "I've checked their last seen 6 times today"`
        : `Blinking rate of someone who has transcended earthly romantic concerns`,
      eyeSymmetry: eyeSymmetry > 55
        ? `Face achieving perfect balance — possibly because you've cried equally on both sides`
        : `Asymmetric expression typical of someone currently "processing feelings"`,
      eyeMovement: eyeMovement > 55
        ? `Eye movement pattern matches our "looking for their car in the parking lot" database`
        : `Suspiciously still — you've already accepted your romantic fate`,
    };

    return {
      verdict, verdictEmoji: verdictEmoji[verdict], verdictColor: verdictColor[verdict],
      eyeOpenness, gazeStability, blinkFreq, eyeSymmetry, eyeMovement, micro,
      roastLevel, lieProbability, truthProbability, confidence,
      roastTier, evidenceDossiers, finalRoast, metricRoasts,
    };
  }

  return { analyze };
})();

// ─── PARTICLES SYSTEM ────────────────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawnParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '0,245,255' : Math.random() > 0.5 ? '179,71,255' : '255,45,120',
    };
  }

  resize();
  window.addEventListener('resize', resize);
  particles = Array.from({ length: 80 }, spawnParticle);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < -5 || p.x > W + 5 || p.y < -5 || p.y > H + 5) Object.assign(p, spawnParticle());
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── STAGE MESSAGES ──────────────────────────────────────────────────────────
const SCAN_STAGES = [
  { msg: '🔬 Locating eyeballs...', time: 400 },
  { msg: '👁️ Calibrating Eye-Betrayal-O-Meter™...', time: 900 },
  { msg: '🧬 Extracting micro-expressions (there are so many)...', time: 1500 },
  { msg: '📡 Pinging the Department of Vibes...', time: 2200 },
  { msg: '💔 Cross-referencing ex-partner database...', time: 2900 },
  { msg: '🎯 Running Blink Frequency Analysis™...', time: 3600 },
  { msg: '🤥 Calculating Lie Probability Index...', time: 4300 },
  { msg: '🧠 Consulting Heartbreak Historian AI...', time: 5000 },
  { msg: '💡 Analyzing situationship residue...', time: 5700 },
  { msg: '🔮 Running Quantum Romance Entanglement scan...', time: 6400 },
  { msg: '📊 Generating Certified Roast Report™...', time: 7100 },
  { msg: '🏛️ Filing paperwork with Office of Romance...', time: 7800 },
  { msg: '✅ Verdict ready. Brace yourself.', time: 8500 },
];

// ─── REACT APPLICATION ───────────────────────────────────────────────────────
const { useState, useEffect, useRef, useCallback } = React;

// ── Ticker Tape ──
function TickerTape() {
  const msg = '⬥ DEPARTMENT OF VIBES™ — LIVE FORENSIC ANALYSIS FEED  ⬥  ALL METRICS ARE 100% COMEDIC PARODY  ⬥  EYE MOVEMENTS CANNOT DETERMINE RELATIONSHIP STATUS  ⬥  FOR ENTERTAINMENT PURPOSES ONLY  ⬥  CLASSIFIED: ROMANCE INTELLIGENCE DIVISION  ⬥  LIE PROBABILITY ≠ ACTUAL TRUTH  ⬥  CONSULT A THERAPIST, NOT AN AI  ⬥';
  return (
    <div className="ticker-wrapper">
      <span className="ticker-inner">{msg.repeat(3)}</span>
    </div>
  );
}

// ── Meter ──
function Meter({ value, colorClass, label, sublabel, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = () => {
        start += 2;
        if (start <= value) { setDisplayed(start); requestAnimationFrame(step); }
        else setDisplayed(value);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">{label}</span>
        <span className={`mono font-bold text-lg neon-${colorClass}`}>{displayed}%</span>
      </div>
      <div className="meter-track">
        <div
          className={`meter-fill meter-fill-${colorClass}`}
          style={{ width: `${displayed}%`, transition: 'width 0.05s linear' }}
        />
      </div>
      {sublabel && <span className="label-mono">{sublabel}</span>}
    </div>
  );
}

// ── Hero Section ──
function Hero({ onStart, audioMuted, toggleAudio }) {
  return (
    <div className="section">
      <div className="container text-center flex flex-col items-center gap-6">
        <div className="fade-in-up-d1">
          <span className="hero-badge">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b347ff', display: 'inline-block', animation: 'blink 1s ease infinite' }} />
            Department of Vibes™ · Classified Intelligence Division
          </span>
        </div>

        <div className="fade-in-up-d2 float-y">
          <h1 className="hero-title gradient-text" style={{ marginBottom: 0 }}>
            Relationship<br />Lie Detector
          </h1>
          <p className="neon-pink mono text-sm mt-2" style={{ letterSpacing: '0.2em' }}>
            v2.0 ULTRA™ — FORENSIC ROMANCE EDITION
          </p>
        </div>

        <p className="fade-in-up-d3 text-lg" style={{ maxWidth: 600, color: 'rgba(200,200,255,0.75)', lineHeight: 1.8 }}>
          Upload your photo & video evidence. Our <strong className="neon-cyan">Department of Vibes™ AI</strong> will analyze
          your ocular patterns, blink frequencies, and micro-expressions to deliver a wildly confident,
          100% scientifically-unverified verdict on your romantic status.
        </p>

        <div className="fade-in-up-d4 grid-4" style={{ maxWidth: 700, width: '100%', marginTop: 8 }}>
          {[
            { icon: '👁️', label: 'Eye Betrayal Analysis™' },
            { icon: '🤥', label: 'Lie Probability Index' },
            { icon: '💕', label: 'Vibes Entanglement Scan' },
            { icon: '🔥', label: 'Certified Roast Report™' },
          ].map(({ icon, label }) => (
            <div key={label} className="glass-card p-3 text-center" style={{ borderColor: 'rgba(0,245,255,0.1)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{icon}</div>
              <div className="text-xs" style={{ color: 'rgba(200,200,255,0.6)', lineHeight: 1.4 }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="fade-in-up-d5 disclaimer-box" style={{ maxWidth: 640 }}>
          ⚠️ DISCLAIMER: This application is 100% parody entertainment. All metrics, verdicts, and lie probabilities
          are randomly generated for comedic effect. Eye movements CANNOT determine relationship status or truthfulness.
          No actual computer vision, biometric analysis, or mind-reading is performed. For entertainment only.
          Please do not make life decisions based on this app. We are not responsible for any resulting conversations.
        </div>

        <div className="flex gap-4 items-center flex-wrap justify-center fade-in-up-d5">
          <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '18px 48px' }} onClick={() => { Sound.click(); onStart(); }}>
            🔍 Investigate Me
          </button>
          <button className="audio-btn" onClick={() => { toggleAudio(); Sound.click(); }} title={audioMuted ? 'Unmute' : 'Mute'}>
            {audioMuted ? '🔇' : '🔊'}
          </button>
        </div>

        <div className="flex gap-6 items-center opacity-60 text-xs mono fade-in-up-d5">
          <span>💔 SINGLE</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span>💕 DATING</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span>❤️ COMMITTED</span>
        </div>
      </div>
    </div>
  );
}

// ── Upload Section ──
function UploadSection({ onLaunch, onBack }) {
  const [photo, setPhoto] = useState(null);       // { dataUrl, name }
  const [video, setVideo] = useState(null);       // { dataUrl, name, size }
  const [photoDrag, setPhotoDrag] = useState(false);
  const [videoDrag, setVideoDrag] = useState(false);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [webcamError, setWebcamError] = useState('');
  const [errors, setErrors] = useState({});
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const SAMPLE_SUSPECTS = [
    { id: 1, label: 'Suspect Alpha', emoji: '🕵️' },
    { id: 2, label: 'Suspect Beta', emoji: '🤠' },
    { id: 3, label: 'Suspect Gamma', emoji: '😎' },
  ];

  function handlePhotoFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => { setPhoto({ dataUrl: e.target.result, name: file.name }); Sound.click(); setErrors(p => ({ ...p, photo: null })); };
    reader.readAsDataURL(file);
  }

  function handleVideoFile(file) {
    if (!file || !file.type.startsWith('video/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setVideo({ dataUrl: e.target.result, name: file.name, size: (file.size / (1024 * 1024)).toFixed(1) });
      Sound.click(); setErrors(p => ({ ...p, video: null }));
    };
    reader.readAsDataURL(file);
  }

  function generateSamplePhoto(suspect) {
    const canvas = document.createElement('canvas');
    canvas.width = 300; canvas.height = 300;
    const ctx = canvas.getContext('2d');
    const colors = ['#0d0d2b', '#1a0d2b', '#0d1a2b'];
    ctx.fillStyle = colors[suspect.id % colors.length];
    ctx.fillRect(0, 0, 300, 300);
    ctx.fillStyle = 'rgba(0,245,255,0.08)';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(150, 150, 30 + i * 30, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '80px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(suspect.emoji, 150, 140);
    ctx.fillStyle = 'rgba(200,200,255,0.5)';
    ctx.font = '14px JetBrains Mono';
    ctx.fillText(`SUSPECT ${suspect.id}`, 150, 230);
    ctx.fillStyle = 'rgba(0,245,255,0.4)';
    ctx.font = '11px monospace';
    ctx.fillText('EVIDENCE FILE #' + (1000 + suspect.id * 137), 150, 260);
    const dataUrl = canvas.toDataURL('image/png');
    setPhoto({ dataUrl, name: `suspect_${suspect.id}.png` });
    Sound.click();
    setErrors(p => ({ ...p, photo: null }));
  }

  async function startWebcamRecording() {
    setWebcamError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setRecording(true);
      setCountdown(5);
      Sound.scan();

      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const reader = new FileReader();
        reader.onload = (e) => {
          setVideo({ dataUrl: e.target.result, name: 'webcam_evidence.webm', size: (blob.size / (1024 * 1024)).toFixed(1) });
          setErrors(p => ({ ...p, video: null }));
          Sound.reveal();
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
        setRecording(false);
      };
      mr.start();

      let t = 5;
      const iv = setInterval(() => {
        t--;
        setCountdown(t);
        if (t <= 0) { clearInterval(iv); mr.stop(); }
      }, 1000);
    } catch (err) {
      setWebcamError('Camera access denied. Please upload a video file instead.');
      setRecording(false);
    }
  }

  function validate() {
    const e = {};
    if (!photo) e.photo = '📸 Upload evidence photo or select a sample suspect';
    if (!video) e.video = '🎬 Upload a video clip or record a 5-second selfie';
    setErrors(e);
    if (Object.keys(e).length > 0) { Sound.error(); return false; }
    return true;
  }

  function launch() {
    if (validate()) { Sound.scan(); onLaunch({ photo, video }); }
  }

  return (
    <div className="section">
      <div className="container flex flex-col gap-8">
        <div className="text-center fade-in-up">
          <button className="btn-ghost btn-secondary mb-6" onClick={() => { Sound.click(); onBack(); }}>← Back to HQ</button>
          <h2 className="text-3xl font-bold gradient-text">Evidence Submission</h2>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
            Submit your evidence for forensic analysis by the Department of Vibes™
          </p>
        </div>

        <div className="grid-2">
          {/* PHOTO EVIDENCE */}
          <div className="glass-card glass-card-cyan p-6 flex flex-col gap-4 fade-in-up-d1">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '1.5rem' }}>📸</span>
              <div>
                <div className="font-bold text-lg neon-cyan">Evidence #1</div>
                <div className="label-mono">Suspect Photo / Selfie</div>
              </div>
            </div>

            {photo ? (
              <div className="scanner-container" style={{ maxHeight: 240 }}>
                <img src={photo.dataUrl} alt="Evidence" style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block', borderRadius: 8 }} />
                <div className="scan-line" />
                <div className="corner-bracket tl" /><div className="corner-bracket tr" />
                <div className="corner-bracket bl" /><div className="corner-bracket br" />
              </div>
            ) : (
              <div className={`upload-zone ${photoDrag ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setPhotoDrag(true); }}
                onDragLeave={() => setPhotoDrag(false)}
                onDrop={(e) => { e.preventDefault(); setPhotoDrag(false); handlePhotoFile(e.dataTransfer.files[0]); }}
              >
                <input type="file" accept="image/*" onChange={(e) => handlePhotoFile(e.target.files[0])} />
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🖼️</div>
                <div className="font-semibold mb-2">Drop photo here or click to browse</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>JPG, PNG, WEBP — any selfie works</div>
              </div>
            )}

            {photo && (
              <div className="flex gap-2 items-center">
                <span className="text-xs mono neon-green">✅ {photo.name}</span>
                <button className="btn-secondary" style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: '0.75rem' }}
                  onClick={() => setPhoto(null)}>Replace</button>
              </div>
            )}

            {errors.photo && <div className="text-sm" style={{ color: 'var(--neon-pink)' }}>⚠️ {errors.photo}</div>}

            <div>
              <div className="label-mono mb-2">Or pick a sample suspect:</div>
              <div className="flex gap-3">
                {SAMPLE_SUSPECTS.map(s => (
                  <div key={s.id}
                    onClick={() => generateSamplePhoto(s)}
                    style={{
                      width: 60, height: 60, borderRadius: 10, border: '2px solid rgba(0,245,255,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.8rem', cursor: 'pointer', transition: 'all 0.2s',
                      background: 'rgba(0,245,255,0.04)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--neon-cyan)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,245,255,0.25)'}
                    title={s.label}
                  >{s.emoji}</div>
                ))}
              </div>
            </div>
          </div>

          {/* VIDEO EVIDENCE */}
          <div className="glass-card glass-card-pink p-6 flex flex-col gap-4 fade-in-up-d2">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '1.5rem' }}>🎬</span>
              <div>
                <div className="font-bold text-lg neon-pink">Evidence #2</div>
                <div className="label-mono">Video Clip / Live Selfie</div>
              </div>
            </div>

            {recording ? (
              <div className="scanner-container" style={{ height: 240, background: '#000', borderRadius: 8 }}>
                <video ref={videoRef} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="scan-line" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-pink), transparent)', boxShadow: '0 0 8px var(--neon-pink)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,45,120,0.15)',
                  border: '3px solid var(--neon-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', fontWeight: 700, color: 'var(--neon-pink)' }}>
                  {countdown}
                </div>
                <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center' }}>
                  <span className="mono text-xs" style={{ color: 'var(--neon-pink)' }}>⏺ RECORDING — LOOK SUSPICIOUS</span>
                </div>
              </div>
            ) : video ? (
              <div className="scanner-container" style={{ maxHeight: 240 }}>
                <video src={video.dataUrl} controls style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 8 }} />
                <div className="corner-bracket tl" style={{ borderColor: 'var(--neon-pink)' }} />
                <div className="corner-bracket tr" style={{ borderColor: 'var(--neon-pink)' }} />
                <div className="corner-bracket bl" style={{ borderColor: 'var(--neon-pink)' }} />
                <div className="corner-bracket br" style={{ borderColor: 'var(--neon-pink)' }} />
              </div>
            ) : (
              <div className={`upload-zone ${videoDrag ? 'drag-over' : ''}`}
                style={{ borderColor: 'rgba(255,45,120,0.3)' }}
                onDragOver={(e) => { e.preventDefault(); setVideoDrag(true); }}
                onDragLeave={() => setVideoDrag(false)}
                onDrop={(e) => { e.preventDefault(); setVideoDrag(false); handleVideoFile(e.dataTransfer.files[0]); }}
              >
                <input type="file" accept="video/*" onChange={(e) => handleVideoFile(e.target.files[0])} />
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎥</div>
                <div className="font-semibold mb-2">Drop video here or click to browse</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>MP4, WEBM, MOV — max ~50MB</div>
              </div>
            )}

            {video && !recording && (
              <div className="flex gap-2 items-center">
                <span className="text-xs mono neon-green">✅ {video.name} ({video.size}MB)</span>
                <button className="btn-secondary" style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: '0.75rem', color: 'var(--neon-pink)', borderColor: 'rgba(255,45,120,0.4)' }}
                  onClick={() => setVideo(null)}>Replace</button>
              </div>
            )}

            {errors.video && <div className="text-sm" style={{ color: 'var(--neon-pink)' }}>⚠️ {errors.video}</div>}
            {webcamError && <div className="text-sm" style={{ color: 'var(--neon-amber)' }}>⚠️ {webcamError}</div>}

            {!recording && !video && (
              <button className="btn-secondary w-full" style={{ justifyContent: 'center', color: 'var(--neon-pink)', borderColor: 'rgba(255,45,120,0.4)' }}
                onClick={startWebcamRecording}>
                📹 Record 5-Second Live Selfie
              </button>
            )}
          </div>
        </div>

        <div className="text-center fade-in-up-d3">
          <div className="disclaimer-box" style={{ maxWidth: 600, margin: '0 auto 24px' }}>
            ⚠️ Your media is processed entirely in your browser. Nothing is uploaded to any server.
            All analysis is deterministic comedy. We literally cannot see your eyes. This is all made up.
          </div>
          <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '18px 56px' }} onClick={launch}>
            🔍 Begin Relationship Investigation
          </button>
          <div className="mt-4 text-xs mono opacity-60">
            This will trigger 13 fake forensic scans and one certified roast. You've been warned.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Scanner HUD ──
function ScannerHUD({ photo, video, onComplete }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [done, setDone] = useState([]);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    Sound.scan();
    SCAN_STAGES.forEach(({ msg, time }, i) => {
      setTimeout(() => {
        setStageIndex(i);
        setDone(prev => [...prev, i - 1]);
        Sound.stage();
        if (i === SCAN_STAGES.length - 1) {
          setTimeout(() => { Sound.reveal(); onComplete(); }, 1200);
        }
      }, time);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Draw grid
      ctx.strokeStyle = 'rgba(0,245,255,0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Draw radar sweep
      ctx.save();
      ctx.translate(W / 2, H / 2);
      const angle = (frame / 60) * Math.PI * 2;
      const grad = ctx.createConicalGradient ? null : null;
      ctx.rotate(angle);
      const rg = ctx.createLinearGradient(0, 0, Math.min(W, H) * 0.45, 0);
      rg.addColorStop(0, 'rgba(0,245,255,0.35)');
      rg.addColorStop(1, 'rgba(0,245,255,0)');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, Math.min(W, H) * 0.45, -0.05, 0.6);
      ctx.closePath();
      ctx.fillStyle = rg;
      ctx.fill();
      ctx.restore();

      // Draw crosshair reticles
      [[0.3, 0.38], [0.7, 0.38], [0.5, 0.5]].forEach(([rx, ry]) => {
        const cx = W * rx, cy = H * ry;
        const pulse = Math.sin(frame / 20) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(0,245,255,${pulse * 0.8})`;
        ctx.lineWidth = 1.5;
        const size = 18;
        ctx.beginPath();
        ctx.moveTo(cx - size, cy); ctx.lineTo(cx + size, cy);
        ctx.moveTo(cx, cy - size); ctx.lineTo(cx, cy + size);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,45,120,${pulse * 0.7})`;
        ctx.stroke();
        // Corner brackets
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.moveTo(cx + dx * (size + 4), cy + dy * (size - 4));
          ctx.lineTo(cx + dx * (size + 4), cy + dy * (size + 4));
          ctx.lineTo(cx + dx * (size - 4), cy + dy * (size + 4));
          ctx.strokeStyle = `rgba(0,245,255,${pulse})`;
          ctx.stroke();
        });
      });

      // Scan line
      const scanY = ((frame * 2.5) % H);
      const sg = ctx.createLinearGradient(0, scanY - 8, 0, scanY + 8);
      sg.addColorStop(0, 'rgba(0,245,255,0)');
      sg.addColorStop(0.5, 'rgba(0,245,255,0.5)');
      sg.addColorStop(1, 'rgba(0,245,255,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 8, W, 16);

      frame++;
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="section">
      <div className="container flex flex-col gap-8 items-center">
        <div className="text-center fade-in-up">
          <h2 className="text-3xl font-bold neon-text-cyan">Forensic Scan In Progress</h2>
          <p className="mt-2 mono text-sm" style={{ color: 'var(--text-muted)' }}>
            Department of Vibes™ biometric analysis running...
          </p>
        </div>

        <div className="grid-2 w-full" style={{ maxWidth: 960 }}>
          {/* Left: Radar / Canvas */}
          <div className="glass-card p-4 flex flex-col gap-4 fade-in-up-d1">
            <div className="label-mono">Live Forensic Visualization</div>
            <div className="relative overflow-hidden rounded" style={{ background: '#050510' }}>
              {photo && (
                <img src={photo.dataUrl} alt="Evidence under scan" style={{
                  width: '100%', height: 280, objectFit: 'cover', opacity: 0.35, display: 'block'
                }} />
              )}
              <canvas ref={canvasRef} width={480} height={280} style={{
                position: photo ? 'absolute' : 'relative',
                inset: photo ? 0 : undefined,
                width: '100%', height: photo ? '100%' : 280,
              }} />
              <div className="corner-bracket tl" /><div className="corner-bracket tr" />
              <div className="corner-bracket bl" /><div className="corner-bracket br" />
            </div>

            <div className="scanning-ring">
              <div className="scanning-core">🔬</div>
            </div>

            <div className="flex justify-center gap-6 text-xs mono" style={{ color: 'var(--text-muted)' }}>
              <span className="neon-cyan">{Math.round((stageIndex / SCAN_STAGES.length) * 100)}% COMPLETE</span>
              <span>STAGE {stageIndex + 1}/{SCAN_STAGES.length}</span>
            </div>
          </div>

          {/* Right: Stage List */}
          <div className="glass-card p-4 flex flex-col gap-2 fade-in-up-d2" style={{ overflowY: 'auto', maxHeight: 560 }}>
            <div className="label-mono mb-2">Forensic Analysis Log</div>
            {SCAN_STAGES.map(({ msg }, i) => (
              <div key={i} className={`stage-item ${i === stageIndex ? 'active' : done.includes(i) ? 'done' : 'pending'}`}>
                <span style={{ fontSize: '0.9rem', minWidth: 18 }}>
                  {done.includes(i) ? '✓' : i === stageIndex ? '▶' : '○'}
                </span>
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="disclaimer-box fade-in-up-d3 text-center" style={{ maxWidth: 600 }}>
          🎭 No actual eye analysis is occurring. Our server hamsters are generating random numbers
          and calling them "biometrics." The Department of Vibes™ is not a real government agency.
        </div>
      </div>
    </div>
  );
}

// ── Results Dashboard ──
function ResultsDashboard({ results, photo, onReset, onShare }) {
  const {
    verdict, verdictEmoji, verdictColor,
    eyeOpenness, gazeStability, blinkFreq, eyeSymmetry, eyeMovement,
    roastLevel, lieProbability, truthProbability, confidence, roastTier,
    evidenceDossiers, finalRoast, metricRoasts,
  } = results;

  const [showStamp, setShowStamp] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowStamp(true), 600);
  }, []);

  const verdictGradients = {
    cyan: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(0,245,255,0.05))',
    amber: 'linear-gradient(135deg, rgba(255,170,0,0.15), rgba(255,170,0,0.05))',
    pink: 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(255,45,120,0.05))',
  };

  const verdictBorders = { cyan: 'rgba(0,245,255,0.4)', amber: 'rgba(255,170,0,0.4)', pink: 'rgba(255,45,120,0.4)' };
  const verdictNeons = { cyan: 'var(--neon-cyan)', amber: 'var(--neon-amber)', pink: 'var(--neon-pink)' };

  const verdictSubtitle = {
    SINGLE: 'Our algorithms detect zero romantic entanglement. Statistically speaking.',
    DATING: 'Vibrational analysis suggests active romantic involvement. Interesting.',
    COMMITTED: 'Maximum entanglement detected. You are, biometrically speaking, done for.',
  };

  return (
    <div className="section">
      <div className="container flex flex-col gap-8">
        <div className="text-center fade-in-up">
          <button className="btn-ghost btn-secondary mb-6" onClick={() => { Sound.click(); onReset(); }}>
            🔄 Re-Investigate
          </button>
          <div className="label-mono mb-2">DEPARTMENT OF VIBES™ · CLASSIFIED ROMANCE DOSSIER</div>
          <h2 className="text-3xl font-bold gradient-text">Analysis Complete</h2>
        </div>

        {/* MAIN VERDICT */}
        <div className={`glass-card p-8 text-center fade-in-up-d1`}
          style={{ background: verdictGradients[verdictColor], borderColor: verdictBorders[verdictColor] }}>
          <div className="label-mono mb-4">FORENSIC VERDICT</div>
          {showStamp && (
            <div className="verdict-stamp">
              <div style={{ fontSize: '4rem', marginBottom: 8 }}>{verdictEmoji}</div>
              <div style={{
                fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, letterSpacing: '-0.02em',
                color: verdictNeons[verdictColor],
                textShadow: `0 0 20px ${verdictNeons[verdictColor]}, 0 0 50px ${verdictNeons[verdictColor]}40`,
              }}>{verdict}</div>
            </div>
          )}
          <p className="mt-4 text-lg" style={{ color: 'rgba(200,200,255,0.7)', maxWidth: 500, margin: '16px auto 0' }}>
            {verdictSubtitle[verdict]}
          </p>
          <div className="mt-4 mono text-xs" style={{ color: verdictNeons[verdictColor], opacity: 0.7 }}>
            CONFIDENCE: {confidence}% · COMEDY CONFIDENCE, NOT SCIENTIFIC CONFIDENCE
          </div>
        </div>

        {/* GAUGES */}
        <div className="grid-2 fade-in-up-d2">
          <div className="glass-card glass-card-pink p-6 flex flex-col gap-6">
            <div className="label-mono">Romance Metrics</div>
            <Meter value={roastLevel} colorClass="gradient" label={`🔥 Roast Level — ${roastTier}`} delay={200} />
            <Meter value={lieProbability} colorClass="pink" label="🤥 Lie Probability (Entertainment Only)" sublabel="NOT A REAL MEASUREMENT · FOR LAUGHS ONLY" delay={400} />
            <Meter value={truthProbability} colorClass="green" label="✅ Truth Probability (Equally Fake)" delay={600} />
            <Meter value={confidence} colorClass="purple" label="🎯 AI Confidence (Comedy Confidence™)" sublabel="GENERATED BY HAMSTERS ON WHEEL · NOT AI" delay={800} />
          </div>

          <div className="glass-card glass-card-cyan p-6 flex flex-col gap-3">
            <div className="label-mono mb-2">Biometric Breakdown™ (Fake)</div>
            {[
              { label: '👁️ Eye Openness', value: eyeOpenness, roast: metricRoasts.eyeOpenness, color: 'cyan' },
              { label: '🎯 Gaze Stability', value: gazeStability, roast: metricRoasts.gazeStability, color: 'purple' },
              { label: '💡 Blink Frequency', value: blinkFreq, roast: metricRoasts.blinkFreq, color: 'amber' },
              { label: '🧬 Eye Symmetry', value: eyeSymmetry, roast: metricRoasts.eyeSymmetry, color: 'pink' },
              { label: '⚡ Eye Movement', value: eyeMovement, roast: metricRoasts.eyeMovement, color: 'green' },
            ].map(({ label, value, roast, color }) => (
              <div key={label} className="metric-row">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">{label}</span>
                  <span className={`mono text-sm neon-${color} font-bold`}>{value}%</span>
                </div>
                <div className="meter-track" style={{ height: 6 }}>
                  <div className={`meter-fill meter-fill-${color}`} style={{ width: `${value}%` }} />
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{roast}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EVIDENCE DOSSIERS */}
        <div className="fade-in-up-d3">
          <div className="label-mono mb-4">🔬 The Evidence</div>
          <div className="grid-2">
            {evidenceDossiers.map(({ icon, title, finding }, i) => (
              <div key={i} className="evidence-card">
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                  <span className="font-semibold text-sm neon-cyan">{title}</span>
                </div>
                <p className="text-sm" style={{ color: 'rgba(200,200,255,0.7)', lineHeight: 1.65 }}>{finding}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL ROAST */}
        <div className="fade-in-up-d4">
          <div className="label-mono mb-3">🔥 Final Verdict — Personalized Roast</div>
          <div className="roast-box">
            <div className="label-mono mb-2" style={{ color: 'var(--neon-pink)' }}>
              Department of Vibes™ Official Statement:
            </div>
            <p style={{ lineHeight: 1.75, paddingTop: 8 }}>{finalRoast}</p>
            <div className="mt-4 mono text-xs" style={{ color: 'rgba(255,45,120,0.5)' }}>
              ⚠️ This roast is 100% procedurally generated comedy. Please do not cry. Or do. We're not your therapist.
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 items-center flex-wrap justify-center fade-in-up-d5">
          <button className="btn-primary" onClick={() => { Sound.click(); onShare(results, photo); }}>
            🎴 Download Roast Card
          </button>
          <button className="btn-secondary" onClick={() => { Sound.click(); onReset(); }}>
            🔄 Investigate Someone Else
          </button>
        </div>

        <div className="disclaimer-box text-center fade-in-up-d5">
          🎭 IMPORTANT REMINDER: Everything above is fabricated entertainment. No real analysis was performed.
          The Department of Vibes™ is not a real agency. Lie Probability cannot determine truthfulness.
          Please do not forward this to your partner as evidence. We beg you.
        </div>
      </div>
    </div>
  );
}

// ── Share Card Modal ──
function ShareCardModal({ results, photo, onClose }) {
  const canvasRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const { verdict, verdictEmoji, lieProbability, truthProbability, roastLevel, confidence, roastTier } = results;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 720, H = 1000;
    canvas.width = W; canvas.height = H;

    // Background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#060610');
    bg.addColorStop(0.5, '#0d0d1f');
    bg.addColorStop(1, '#100620');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(0,245,255,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Header glow
    const hg = ctx.createLinearGradient(0, 0, W, 0);
    hg.addColorStop(0, 'transparent'); hg.addColorStop(0.5, 'rgba(0,245,255,0.12)'); hg.addColorStop(1, 'transparent');
    ctx.fillStyle = hg;
    ctx.fillRect(0, 0, W, 120);

    // Top line
    ctx.strokeStyle = 'rgba(0,245,255,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(40, 2); ctx.lineTo(W - 40, 2); ctx.stroke();

    // Header text
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(0,245,255,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('DEPARTMENT OF VIBES™ · CLASSIFIED ROMANCE DOSSIER · FOR ENTERTAINMENT ONLY', W / 2, 24);

    ctx.font = 'bold 32px Space Grotesk, sans-serif';
    const tg = ctx.createLinearGradient(0, 0, W, 0);
    tg.addColorStop(0, '#00f5ff'); tg.addColorStop(0.5, '#b347ff'); tg.addColorStop(1, '#ff2d78');
    ctx.fillStyle = tg;
    ctx.fillText('RELATIONSHIP LIE DETECTOR', W / 2, 68);

    ctx.font = '13px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(200,200,255,0.5)';
    ctx.fillText('v2.0 ULTRA™ — FORENSIC ROMANCE EDITION', W / 2, 92);

    // Photo area
    const drawPhoto = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(W / 2 - 100, 120, 200, 200, 12);
      ctx.clip();
      if (photo) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, W / 2 - 100, 120, 200, 200);
          ctx.restore();
          continueDrawing();
        };
        img.onerror = () => { ctx.restore(); drawPlaceholderPhoto(); continueDrawing(); };
        img.src = photo.dataUrl;
      } else {
        ctx.fillStyle = '#0d0d1f';
        ctx.fillRect(W / 2 - 100, 120, 200, 200);
        ctx.restore();
        drawPlaceholderPhoto();
        continueDrawing();
      }
    };

    const drawPlaceholderPhoto = () => {
      ctx.fillStyle = 'rgba(200,200,255,0.3)';
      ctx.font = '80px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🕵️', W / 2, 245);
    };

    const continueDrawing = () => {
      // Photo border
      ctx.strokeStyle = 'rgba(0,245,255,0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.roundRect) { ctx.roundRect(W / 2 - 100, 120, 200, 200, 12); } else { ctx.rect(W / 2 - 100, 120, 200, 200); }
      ctx.stroke();

      // Corner brackets on photo
      const bx = W / 2 - 100, by = 120, bw = 200, bh = 200, bl = 18;
      ctx.strokeStyle = 'rgba(0,245,255,0.9)';
      ctx.lineWidth = 3;
      [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]].forEach(([cx, cy], idx) => {
        const sx = idx % 2 === 0 ? 1 : -1, sy = idx < 2 ? 1 : -1;
        ctx.beginPath(); ctx.moveTo(cx, cy + sy * bl); ctx.lineTo(cx, cy); ctx.lineTo(cx + sx * bl, cy); ctx.stroke();
      });

      // VERDICT section
      const verdictColors = { SINGLE: '#00f5ff', DATING: '#ffaa00', COMMITTED: '#ff2d78' };
      const vColor = verdictColors[verdict];

      ctx.textAlign = 'center';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(200,200,255,0.4)';
      ctx.fillText('OFFICIAL VERDICT', W / 2, 360);

      ctx.font = `bold 11px serif`;
      ctx.fillStyle = vColor;
      ctx.fillText(verdictEmoji, W / 2, 390);

      ctx.font = 'bold 64px Space Grotesk, sans-serif';
      ctx.fillStyle = vColor;
      ctx.shadowColor = vColor;
      ctx.shadowBlur = 20;
      ctx.fillText(verdict, W / 2, 455);
      ctx.shadowBlur = 0;

      // Divider
      ctx.strokeStyle = 'rgba(0,245,255,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(60, 475); ctx.lineTo(W - 60, 475); ctx.stroke();

      // Meters
      const meters = [
        { label: '🔥 Roast Level', value: roastLevel, color: '#ff2d78' },
        { label: '🤥 Lie Probability', value: lieProbability, color: '#b347ff' },
        { label: '✅ Truth Score', value: 100 - lieProbability, color: '#39ff14' },
        { label: '🎯 Comedy Confidence', value: confidence, color: '#00f5ff' },
      ];

      meters.forEach(({ label, value, color }, i) => {
        const y = 510 + i * 64;
        ctx.font = '14px Space Grotesk, sans-serif';
        ctx.fillStyle = 'rgba(200,200,255,0.75)';
        ctx.textAlign = 'left';
        ctx.fillText(label, 60, y);
        ctx.font = 'bold 14px JetBrains Mono, monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'right';
        ctx.fillText(`${value}%`, W - 60, y);

        // Track
        const tx = 60, tw = W - 120, th = 8, ty = y + 10;
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath(); if (ctx.roundRect) { ctx.roundRect(tx, ty, tw, th, 4); } else { ctx.rect(tx, ty, tw, th); }
        ctx.fill();

        // Fill
        const barW = (value / 100) * tw;
        const bg2 = ctx.createLinearGradient(tx, 0, tx + barW, 0);
        bg2.addColorStop(0, color + '66'); bg2.addColorStop(1, color);
        ctx.fillStyle = bg2;
        ctx.beginPath(); if (ctx.roundRect) { ctx.roundRect(tx, ty, barW, th, 4); } else { ctx.rect(tx, ty, barW, th); }
        ctx.fill();

        ctx.textAlign = 'center';
      });

      // Roast tier
      ctx.font = 'bold 18px Space Grotesk, sans-serif';
      ctx.fillStyle = 'rgba(255,170,0,0.9)';
      ctx.textAlign = 'center';
      ctx.fillText(roastTier, W / 2, 782);

      // Bottom
      ctx.strokeStyle = 'rgba(0,245,255,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(40, 820); ctx.lineTo(W - 40, 820); ctx.stroke();

      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(200,200,255,0.25)';
      ctx.fillText('⚠️ 100% ENTERTAINMENT · NO ACTUAL ANALYSIS · DEPT. OF VIBES™ IS NOT REAL · DO NOT CITE IN COURT', W / 2, 848);
      ctx.fillText('Made with ❤️ at TinkerHub Useless Projects · Relationship Lie Detector v2.0 ULTRA™', W / 2, 868);

      // Watermark corners
      ctx.strokeStyle = 'rgba(0,245,255,0.15)';
      ctx.lineWidth = 1;
      [[10, 10], [W - 10, 10], [10, H - 10], [W - 10, H - 10]].forEach(([cx, cy]) => {
        ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.stroke();
      });
    };

    drawPhoto();
  }, []);

  function download() {
    setDownloading(true);
    Sound.reveal();
    setTimeout(() => {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `relationship-lie-detector-${verdict.toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png', 0.95);
      link.click();
      setDownloading(false);
    }, 500);
  }

  function shareNative() {
    Sound.click();
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const file = new File([blob], 'roast-card.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        navigator.share({ title: 'My Relationship Lie Detector Result', files: [file] });
      } else {
        download();
      }
    }, 'image/png', 0.95);
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="glass-card p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="label-mono">ROAST CARD GENERATOR</div>
              <div className="font-bold text-xl gradient-text mt-1">Download Your Dossier</div>
            </div>
            <button className="btn-ghost btn-secondary" onClick={onClose} style={{ padding: '8px 16px' }}>✕ Close</button>
          </div>

          <div style={{ borderRadius: 12, overflow: 'hidden', maxHeight: '60vh', overflowY: 'auto' }}>
            <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} />
          </div>

          <div className="flex gap-3">
            <button className="btn-primary w-full" style={{ justifyContent: 'center' }} onClick={download} disabled={downloading}>
              {downloading ? '⏳ Generating...' : '⬇️ Download PNG'}
            </button>
            <button className="btn-secondary" style={{ whiteSpace: 'nowrap' }} onClick={shareNative}>
              📤 Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NAV BAR ──
function NavBar({ stage, audioMuted, toggleAudio }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(6,6,16,0.9)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,245,255,0.1)',
    }}>
      <div className="container flex items-center justify-between" style={{ height: 56 }}>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '1.3rem' }}>🔍</span>
          <span className="font-bold mono neon-cyan" style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            RELATIONSHIP LIE DETECTOR
          </span>
          <span className="label-mono hide-mobile" style={{ color: 'rgba(179,71,255,0.5)' }}>v2.0 ULTRA™</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="label-mono hide-mobile" style={{ color: stage === 'scanning' ? 'var(--neon-amber)' : 'var(--text-muted)' }}>
            {stage === 'hero' ? '◉ STANDING BY' : stage === 'upload' ? '◉ EVIDENCE INTAKE' : stage === 'scanning' ? '⚡ SCANNING' : '✓ RESULTS IN'}
          </span>
          <button className="audio-btn" onClick={toggleAudio} title={audioMuted ? 'Unmute' : 'Mute'}>
            {audioMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── MAIN APP ──
function App() {
  const [stage, setStage] = useState('hero'); // hero | upload | scanning | results
  const [evidence, setEvidence] = useState(null);
  const [results, setResults] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => { initParticles(); }, []);

  function toggleAudio() {
    const next = !audioMuted;
    setAudioMuted(next);
    Sound.toggle(next);
  }

  function handleLaunch(ev) {
    setEvidence(ev);
    setStage('scanning');
  }

  function handleScanComplete() {
    const res = Forensics.analyze(evidence.photo?.dataUrl, evidence.video?.dataUrl);
    setResults(res);
    setStage('results');
  }

  function handleReset() {
    setStage('hero');
    setEvidence(null);
    setResults(null);
    setShowShare(false);
  }

  return (
    <>
      <NavBar stage={stage} audioMuted={audioMuted} toggleAudio={toggleAudio} />
      <TickerTape />
      <div style={{ paddingTop: 56 }}>
        {stage === 'hero' && (
          <Hero onStart={() => { Sound.click(); setStage('upload'); }} audioMuted={audioMuted} toggleAudio={toggleAudio} />
        )}
        {stage === 'upload' && (
          <UploadSection onLaunch={handleLaunch} onBack={() => { Sound.click(); setStage('hero'); }} />
        )}
        {stage === 'scanning' && evidence && (
          <ScannerHUD photo={evidence.photo} video={evidence.video} onComplete={handleScanComplete} />
        )}
        {stage === 'results' && results && (
          <ResultsDashboard
            results={results}
            photo={evidence?.photo}
            onReset={handleReset}
            onShare={(r, p) => setShowShare(true)}
          />
        )}
      </div>
      {showShare && results && (
        <ShareCardModal results={results} photo={evidence?.photo} onClose={() => setShowShare(false)} />
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
