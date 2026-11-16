/* Fault Lines: Boundary Survey Lab. App logic. Content is in data.js. */
(function () {
  "use strict";

  const KEY = "faultlines-v1";
  const UNLOCK = /[?&]unlock(=1)?(&|$)/.test(location.search);
  const $ = (s) => document.querySelector(s);
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const STEP_NAMES = { brief: "Field briefing", map: "Layer map", scene: "Border scene", read: "Take readings" };
  const STOP_BY_ID = Object.fromEntries(STOPS.map((s) => [s.id, s]));
  const HOTSPOTS = [[16, 62], [40, 82], [72, 22], [84, 74]];
  const CAT_COLORS = ["#7FA7C9", "#E3B28A", "#9CC9A6", "#C4A6D6", "#E8D27C", "#D99A9A", "#9AD0CF", "#BFAE9A"];
  const SEA_WORDS = /^(Ocean|Sea|Lake)$/;
  const RANK_DEFAULT = [
    "Superimposed, drawn far away (Berlin 1884)",
    "Open (Schengen)",
    "Line over a shared oil field (Iraq and Kuwait)",
    "Geometric, where few people lived (49th parallel)",
    "Cultural consequent, drawn in a rush (Partition)",
    "Militarized and locked (Korean DMZ)",
    "Physical, antecedent (Andes)",
    "Internal lines that ignore people (Caucasus)"
  ];

  /* ---------------------------------------------------------------- state */
  function fresh() {
    const stops = {};
    STOPS.forEach((s) => (stops[s.id] = { terms: [], layers: [], faultSeen: false, mapAns: null, tags: {}, read: {}, pressure: null, source: null, ev: [], because: "", think: "", done: false }));
    return {
      names: ["", ""], view: { s: "hub" }, stops, compare: {}, rank: RANK_DEFAULT.slice(), rule: "",
      sv: { n: 4, names: ["", "", "", "", ""], own: {}, cur: 0, borders: {}, strait: null, deals: [], pred: {}, sel: null },
      af: null, frq: { pair: "", although: "", claim: "", because1: "", because2: "" }
    };
  }
  let S = load() || fresh();
  let UI = { help: false, svTool: "paint", confirmClear: false, term: null, layer: 0, fault: false, hex: null, flip: false, clue: 0, showHQ: false, svTab: "draw", svLayer: { lang: false, rel: false, res: true, old: false, out: true, sea: false }, confirmReset: false, copied: false };
  function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); return s && s.stops ? s : null; } catch (e) { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage off */ } }
  function go(view) { S.view = view; UI.term = null; UI.hex = null; UI.flip = false; UI.showHQ = false; UI.fault = false; UI.layer = 0; UI.clue = 0; save(); render(); window.scrollTo(0, 0); }

  /* ---------------------------------------------------------------- images */
  window.imgFail = function (el) {
    const d = document.createElement("div");
    d.className = "ph";
    d.innerHTML = "<strong>FLOW ASSET</strong><span>" + esc(el.getAttribute("data-label") || "") + "</span><span>" + esc(el.getAttribute("src")) + "</span>";
    el.replaceWith(d);
  };
  const pic = (src, label, alt) => `<img src="${esc(src)}" alt="${esc(alt || "")}" data-label="${esc(label || "")}" onerror="imgFail(this)">`;

  /* ---------------------------------------------------------------- progress */
  const st = (id) => S.stops[id];
  function stepOk(stop, step) {
    const d = st(stop.id);
    if (step === "brief") return Object.keys(stop.terms).every((t) => d.terms.includes(t));
    if (step === "map") return stop.map.layers.every((l) => d.layers.includes(l.key)) && !!d.faultSeen && d.mapAns != null;
    if (step === "scene") return stop.scene.clues.every((c, i) => d.tags[i]);
    if (step === "read") return readOk(stop);
    return true;
  }
  function tasks(stop, step) {
    const d = st(stop.id), T = [];
    if (step === "brief") { const n = Object.keys(stop.terms).length, k = Object.keys(stop.terms).filter((t) => d.terms.includes(t)).length; T.push([`Tap all ${n} blue terms (${k} of ${n})`, k === n]); }
    if (step === "map") { const n = stop.map.layers.length, k = stop.map.layers.filter((l) => d.layers.includes(l.key)).length;
      T.push([`Look at every layer (${k} of ${n})`, k === n], ["Turn on Fault lines", !!d.faultSeen], ["Answer the map question", d.mapAns != null]); }
    if (step === "scene") { const k = Object.keys(d.tags).length; T.push([`Tag all 4 sensors (${k} of 4)`, k === 4]); }
    if (step === "read") { const n = stop.voices.length, k = stop.voices.filter((v) => d.read[v.id]).length;
      T.push([n > 1 ? `Rate each side (${k} of ${n})` : "Rate the surface", k === n], ["Pick the stored pressure", !!d.pressure], ["Pick the main source", !!d.source]);
      if (stop.scene) T.push([`Pick 2 sensors as evidence (${d.ev.length} of 2)`, d.ev.length === 2]);
      T.push(["Explain in a full sentence", d.because.trim().length >= 15, "because"]); }
    return T;
  }
  function taskbar(stop, step) {
    const T = tasks(stop, step);
    return `<div class="taskbar" role="status" aria-live="polite"><span class="kicker">Your tasks</span>${T.map((t) => `<span class="task ${t[1] ? "done" : ""}" ${t[2] ? 'id="task-' + t[2] + '"' : ""}><i aria-hidden="true">${t[1] ? "✓" : ""}</i>${esc(t[0])}</span>`).join("")}</div>`;
  }
  function readOk(stop) {
    const d = st(stop.id);
    const vs = stop.voices.every((v) => d.read[v.id]);
    const ev = stop.scene ? d.ev.length === 2 : true;
    return vs && d.pressure && d.source && ev && d.because.trim().length >= 15;
  }
  const isDone = (id) => st(id).done;
  const allStopsDone = () => UNLOCK || STOPS.every((s) => isDone(s.id));
  const matchupStops = (m) => STOPS.filter((s) => s.matchup === m);
  const nextStop = () => STOPS.find((s) => !isDone(s.id));
  const avgSurface = (stop) => { const v = Object.values(st(stop.id).read); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0; };
  const scaleLabel = (n) => (SCALE[Math.max(1, Math.min(5, Math.round(n))) - 1] || SCALE[0]).label;

  /* ---------------------------------------------------------------- hex geometry */
  function hexGeom(cols, rows, size) {
    const w = Math.sqrt(3) * size, pad = size + 2;
    const center = (c, r) => [pad + w * (c + 0.5 * (r & 1)), pad + size * 1.5 * r];
    const corners = (x, y) => Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 180) * (60 * i - 30); return [x + size * Math.cos(a), y + size * Math.sin(a)]; });
    const W = pad * 2 + w * (cols + 0.5), H = pad * 2 + size * 1.5 * (rows - 1);
    return { center, corners, W, H, size };
  }
  function neighbors(c, r) {
    const d = r & 1 ? [[1, 0], [1, -1], [0, -1], [-1, 0], [0, 1], [1, 1]] : [[1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]];
    return d.map(([dc, dr]) => [c + dc, r + dr]);
  }
  function sharedEdge(g, a, b) {
    const [ax, ay] = g.center(a[0], a[1]), [bx, by] = g.center(b[0], b[1]);
    const cs = g.corners(ax, ay).map((p) => [p, (p[0] - bx) ** 2 + (p[1] - by) ** 2]).sort((x, y) => x[1] - y[1]);
    return [cs[0][0], cs[1][0]];
  }
  const pts = (arr) => arr.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const line = (e, cls, extra) => `<line x1="${e[0][0].toFixed(1)}" y1="${e[0][1].toFixed(1)}" x2="${e[1][0].toFixed(1)}" y2="${e[1][1].toFixed(1)}" ${cls ? 'class="' + cls + '"' : ""} ${extra || ""}/>`;

  /* ---------------------------------------------------------------- stop map */
  function stopMapSVG(stop) {
    const m = stop.map, rows = m.grid.length, cols = m.grid[0].length;
    const g = hexGeom(cols, rows, 30);
    const layer = m.layers[UI.layer];
    const cats = [];
    const valueAt = (c, r) => {
      if (layer.grid) return layer.values[layer.grid[r][c]];
      return layer.values[m.grid[r][c]];
    };
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const v = valueAt(c, r); if (!SEA_WORDS.test(v) && !cats.includes(v)) cats.push(v); }
    const colorOf = (v) => (SEA_WORDS.test(v) ? "#CFE0EE" : CAT_COLORS[cats.indexOf(v) % CAT_COLORS.length]);
    let hexes = "", borders = "", faults = "";
    const faultSet = new Set(m.faults.map(([a, b]) => [a, b].sort().join("|")));
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const code = m.grid[r][c];
      const [x, y] = g.center(c, r);
      hexes += `<polygon class="hex" points="${pts(g.corners(x, y))}" fill="${colorOf(valueAt(c, r))}" data-h="${c},${r}"/>`;
      neighbors(c, r).forEach(([nc, nr]) => {
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return;
        if (nr < r || (nr === r && nc < c)) return;
        const code2 = m.grid[nr][nc];
        const A = m.regions[code], B = m.regions[code2];
        const e = sharedEdge(g, [c, r], [nc, nr]);
        if (A.country !== B.country && A.country !== "sea" && B.country !== "sea") borders += line(e, "", 'stroke="#1E2A2F" stroke-width="5" stroke-linecap="round"');
        if (UI.fault && faultSet.has([code, code2].sort().join("|"))) faults += line(e, "", 'stroke="#B4461A" stroke-width="9" stroke-linecap="round" stroke-opacity=".85"');
      });
    }
    const legend = cats.map((v) => `<span><i style="background:${colorOf(v)}"></i>${esc(v)}</span>`).join("");
    let info = "";
    if (UI.hex) {
      const [c, r] = UI.hex, reg = m.regions[m.grid[r][c]];
      info = `<div class="hexinfo"><b>${esc(reg.name)}</b><br>${esc(layer.name)}: ${esc(valueAt(c, r))}</div>`;
    }
    return {
      svg: `<div class="mapbox"><svg viewBox="0 0 ${g.W.toFixed(0)} ${g.H.toFixed(0)}" role="img" aria-label="Hex map of ${esc(stop.title)}, showing the ${esc(layer.name)} layer. Tap a hex for details.">${hexes}${borders}${faults}</svg>${info}</div>`,
      legend
    };
  }

  /* ---------------------------------------------------------------- shared chrome */
  function top(sub, right) {
    return `<header class="top"><div class="brand"><b>FAULT LINES</b><span>${esc(sub)}</span></div><div class="row" style="gap:18px"><button type="button" class="helpbtn" data-act="help" aria-expanded="${UI.help}">? Readings key</button>${right || ""}</div></header>${UI.help ? helpPanel() : ""}`;
  }
  function helpPanel() {
    return `<div class="overlay" data-act="help"><div class="helpcard" role="dialog" aria-modal="true" aria-labelledby="helptitle" data-stop>
      <div class="row" style="justify-content:space-between"><h2 id="helptitle">Readings key</h2><button type="button" class="btn" data-act="help">Close</button></div>
      <p>The physical and cultural landscapes are like plates. A border that follows them sits on stable ground. A border that cuts across them builds pressure.</p>
      <h3>Surface reading: what is happening on the ground</h3><div class="keygrid">${SCALE.map((s) => `<b>${s.n} · ${s.label}</b><span>${esc(s.desc)}</span>`).join("")}</div>
      <h3>Stored pressure: stress under the surface</h3><div class="keygrid">${PRESSURE.map((p) => `<b>${esc(p.key)}</b><span>${esc(p.desc)}</span>`).join("")}</div>
      <h3>Pressure sources</h3><div class="keygrid">${SOURCES.map((x) => `<b>${esc(x.key)}</b><span>AMSCO term: ${esc(x.term)}</span>`).join("")}</div></div></div>`;
  }
  const hubLink = `<button type="button" class="linkish" data-act="hub">Back to the route</button>`;
  function teamLine() {
    const n = S.names.filter((x) => x.trim());
    return n.length ? `<span class="sub">Survey team: ${esc(n.join(" + "))}</span>` : "";
  }

  /* ---------------------------------------------------------------- HUB */
  function hub() {
    const nx = nextStop();
    const card = (s) => {
      const done = isDone(s.id), next = nx && nx.id === s.id;
      return `<button type="button" class="stopcard ${done ? "done" : ""} ${next ? "next" : ""}" data-act="open" data-id="${s.id}">
        <div class="thumb">${pic(s.bg.a, s.bgLabel.a)}</div>
        <div class="txt"><strong>${s.num ? s.num + ". " : ""}${esc(s.title)}</strong><span class="small">${esc(s.place)}</span>
        ${done ? '<span class="tag">SURVEYED</span>' : next ? '<span class="tag acc">NEXT</span>' : ""}</div></button>`;
    };
    const col = (m) => {
      const ss = matchupStops(m);
      const canCompare = MATCHUPS[m].compare && ss.every((s) => isDone(s.id));
      const cmpDone = (S.compare[m] || "").trim().length > 15;
      return `<div class="stack" style="gap:10px"><span class="kicker">${esc(MATCHUPS[m].title)}</span>${ss.map(card).join("")}
        ${MATCHUPS[m].compare ? `<button type="button" class="btn ${canCompare && !cmpDone ? "primary" : ""}" data-act="compare" data-m="${m}" ${canCompare || UNLOCK ? "" : "disabled"}>${cmpDone ? "Compare ✓" : "Compare " + m}</button>` : ""}</div>`;
    };
    const unlocked = allStopsDone();
    const done = STOPS.filter((s) => isDone(s.id)).length;
    return `${top("Boundary Survey · AP Human Geography 4.4 and 4.5", teamLine())}
    <section class="hero">
      <div class="stack" style="justify-content:center;gap:14px">
        <span class="kicker acc">Mission briefing</span>
        <h1 style="font-size:42px">Where do borders build pressure?</h1>
        <p style="font-size:18px;max-width:520px">A new continent needs borders. Before you draw a single line, travel back in time to eight real borders. Set up your seismograph, take readings, and learn what makes a border hold or crack.</p>
        <div class="namegrid">
          <label class="stack" style="gap:4px;font-size:14px">Partner A<input type="text" data-bind="names.0" value="${esc(S.names[0])}" autocomplete="off"></label>
          <label class="stack" style="gap:4px;font-size:14px">Partner B<input type="text" data-bind="names.1" value="${esc(S.names[1])}" autocomplete="off"></label>
        </div>
        <div class="row">${nx ? `<button type="button" class="btn primary" data-act="open" data-id="${nx.id}">${done ? "Continue: " : "Start: "}${esc(nx.title)}</button>` : `<button type="button" class="btn primary" data-act="hazard">Open the hazard map</button>`}
        <button type="button" class="btn" data-act="help">How readings work</button></div>
      </div>
      <div class="art">${pic("img/hub_hero.jpg", "Hero illustration: a surveyor at a brass seismograph under a sun-and-stars sky")}</div>
    </section>
    <section class="stack" style="padding:0 28px 28px;gap:14px">
      <div class="row" style="justify-content:space-between"><h2>Your route: warm-up + 4 matchups</h2>
        <span class="small" style="font-family:var(--mono)">${done} of ${STOPS.length} surveyed</span></div>
      <div class="route">${["W", "A", "B", "C", "D"].map(col).join("")}</div>
      <h2 style="margin-top:8px">After the stops</h2>
      <div class="row">
        <button type="button" class="btn" data-act="hazard" ${unlocked ? "" : "disabled"}>Hazard map</button>
        <button type="button" class="btn" data-act="survey" ${unlocked ? "" : "disabled"}>Survey the new continent</button>
        <button type="button" class="btn" data-act="after" ${unlocked && S.af ? "" : "disabled"}>Aftershocks</button>
        <button type="button" class="btn" data-act="exit" ${unlocked && S.af && S.af.i >= S.af.deck.length ? "" : "disabled"}>Exit FRQ</button>
        <button type="button" class="btn" data-act="report">Report</button>
      </div>
      ${unlocked ? "" : '<p class="small">These open once all 9 stops are surveyed.</p>'}
    </section>`;
  }
  function howto() {
    return `<div class="card ink" style="max-width:560px"><strong>At every stop you take three readings</strong>
      <span><b>Surface reading (1 to 5):</b> what is happening on the ground, for each side. ${SCALE.map((s) => s.n + " " + s.label).join(" · ")}.</span>
      <span><b>Stored pressure:</b> ${PRESSURE.map((p) => p.key).join(" · ")}. A locked fault is quiet only because it is held shut.</span>
      <span><b>Main pressure source:</b> ${SOURCES.map((s) => s.key).join(" · ")}.</span>
      <span class="small">The big idea: the physical and cultural landscapes are like plates. A border that follows them sits on stable ground. A border that cuts across them builds pressure.</span></div>`;
  }

  /* ---------------------------------------------------------------- STOP */
  function stopScreen() {
    const stop = STOP_BY_ID[S.view.id];
    const step = S.view.step;
    const idx = stop.steps.indexOf(step);
    let firstOpen = stop.steps.findIndex((s) => !stepOk(stop, s));
    if (firstOpen < 0) firstOpen = stop.steps.length - 1;
    const nav = `<nav class="steps" aria-label="Steps at this stop">${stop.steps.map((s, i) =>
      `<button type="button" class="${s === step ? "on" : ""}" data-act="step" data-step="${s}" ${i <= firstOpen || UNLOCK || isDone(stop.id) ? "" : "disabled"}>${i + 1} · ${STEP_NAMES[s]}${stepOk(stop, s) && s !== step ? " ✓" : ""}</button>`).join("")}</nav>`;
    const sub = stop.num ? `Matchup ${stop.matchup} · Stop ${stop.num} of 8 · ${stop.title}, ${stop.place}` : `Warm-up · ${stop.title}, ${stop.place}`;
    let body = "", hint = "", ok = stepOk(stop, step);
    if (step === "brief") { body = briefStep(stop); hint = "Tap every highlighted term to continue"; }
    if (step === "map") { body = mapStep(stop); hint = "Try every layer, then answer the map question"; }
    if (step === "scene") { body = sceneStep(stop); hint = "Tag all 4 sensors to continue"; }
    if (step === "read") { body = readStep(stop); hint = UI.showHQ ? "Reading logged" : "Fill in every reading, then log it"; }
    const prev = idx > 0 ? `<button type="button" class="btn" data-act="step" data-step="${stop.steps[idx - 1]}">Back</button>` : `<button type="button" class="btn" data-act="hub">Route</button>`;
    let next;
    if (step !== "read") next = `<button type="button" class="btn primary" data-act="step" data-step="${stop.steps[idx + 1]}" ${ok || UNLOCK ? "" : "disabled"}>Next: ${STEP_NAMES[stop.steps[idx + 1]]}</button>`;
    else if (!UI.showHQ) next = `<button type="button" class="btn primary" data-act="log" ${ok || UNLOCK ? "" : "disabled"}>Log reading</button>`;
    else next = `<button type="button" class="btn primary" data-act="afterlog">${afterLogLabel(stop)}</button>`;
    const left = tasks(stop, step).filter((t) => !t[1]).length;
    const status = UI.showHQ ? "Reading logged. Nice work." : left ? `${left} task${left > 1 ? "s" : ""} left` : "All tasks done. Go on!";
    return `${top(sub, hubLink)}${nav}${UI.showHQ ? "" : taskbar(stop, step)}${body}<footer class="foot">${prev}<span class="hint ${left ? "" : "ready"}">${status}</span>${next}</footer>`;
  }
  function afterLogLabel(stop) {
    const ms = matchupStops(stop.matchup);
    if (MATCHUPS[stop.matchup].compare && ms.every((s) => isDone(s.id)) && !(S.compare[stop.matchup] || "").trim()) return "Compare the matchup";
    const n = nextStop();
    return n ? "Next stop: " + n.title : "Open the hazard map";
  }
  function bg(src, label) { return `<div class="bg">${pic(src, label)}</div>`; }
  function storyHTML(stop) {
    const d = st(stop.id);
    return stop.story.map((p) => "<p>" + esc(p).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m0, term, shown) =>
      `<button type="button" class="term ${d.terms.includes(term) ? "seen" : ""} ${UI.term === term ? "open" : ""}" aria-expanded="${UI.term === term}" data-act="term" data-term="${esc(term)}">${esc(shown || term)}</button>`) + "</p>"
      + (UI.term && (p.includes("[[" + UI.term + "]]") || p.includes("[[" + UI.term + "|")) ? `<div class="defbox" role="status"><b>${esc(UI.term)}</b>${esc(stop.terms[UI.term])}</div>` : "")).join("");
  }
  function briefStep(stop) {
    const voices = stop.voices.map((v) => `<div class="voice"><div class="pic">${pic(v.img, (v.noVoice ? "Empty bench facing a fence" : v.name + " portrait"))}</div>
      <div class="stack" style="gap:4px"><strong>${esc(v.name)}${v.age ? ", " + v.age : ""} · ${esc(v.side)}</strong><span class="small">${esc(v.where)}${v.noVoice ? "" : " (composite character)"}</span><q>${esc(v.quote)}</q></div></div>`).join("");
    const facts = stop.facts.map((f) => `<div class="fact"><b>${esc(f[0])}</b><span>${esc(f[1])}</span></div>`).join("");
    return `<main class="main">${bg(stop.bg.a, "Background A (day): " + stop.bgLabel.a)}
      <section class="panel grow stack"><h1>${esc(stop.heading)}</h1><p class="bigidea"><b>Big idea:</b> ${esc(stop.bigIdea)}</p><div class="story">${storyHTML(stop)}</div></section>
      <aside class="panel side stack"><span class="kicker">Voices from each side</span>${voices}<span class="kicker">Field numbers</span><div class="facts">${facts}</div></aside>
    </main>`;
  }
  function mapStep(stop) {
    const d = st(stop.id), m = stop.map, layer = m.layers[UI.layer];
    const { svg, legend } = stopMapSVG(stop);
    const chips = m.layers.map((l, i) => `<button type="button" class="chip ${i === UI.layer ? "on" : ""}" aria-pressed="${i === UI.layer}" data-act="layer" data-i="${i}">${esc(l.name)}${d.layers.includes(l.key) ? " ✓" : ""}</button>`).join("")
      + `<button type="button" class="chip fault ${UI.fault ? "on" : ""}" aria-pressed="${UI.fault}" data-act="fault">Fault lines</button>`;
    const src = stop.source;
    const sourceCard = !UI.flip
      ? `<div class="card ink"><span class="kicker acc">Core sample · read the source</span><div class="art">${pic(src.img, "Source document")}</div>
         <strong>${esc(src.title)}</strong><span style="font-size:15px;line-height:1.45">${esc(src.excerpt)}</span>
         <button type="button" class="btn" data-act="flip">Drill down: who, when, why</button></div>`
      : `<div class="card ink"><span class="kicker acc">Behind the source</span><span><b>Who:</b> ${esc(src.who)}</span><span><b>When:</b> ${esc(src.when)}</span><span><b>Why:</b> ${esc(src.why)}</span>
         <button type="button" class="btn" data-act="flip">Back to the source</button></div>`;
    const q = m.question;
    const opts = q.opts.map((o, i) => {
      let cls = "";
      if (d.mapAns != null) { if (o[1]) cls = "right"; else if (d.mapAns === i) cls = "wrong"; }
      return `<label class="opt ${cls}"><input type="radio" name="mq" data-act="mapans" data-i="${i}" ${d.mapAns === i ? "checked" : ""}> ${esc(o[0])}</label>`;
    }).join("");
    const answered = d.mapAns != null ? `<span class="why"><b>${q.opts[d.mapAns][1] ? "Correct." : "Not quite."}</b> ${esc(q.why)}</span>` : "";
    return `<main class="main">${bg(stop.bg.b, "Background B (aerial): " + stop.bgLabel.b)}
      <section class="panel grow stack"><div class="row" style="justify-content:space-between"><h1>Peel back the layers</h1></div>
        <div class="row" role="group" aria-label="Map layers">${chips}</div>
        <p class="small">Tap any hex to see what is there.</p>${svg}<div class="legend">${legend}<span><i style="background:#1E2A2F"></i>Border</span>${UI.fault ? '<span><i style="background:#B4461A"></i>Fault line</span>' : ""}</div>
        ${UI.fault ? `<p class="small">${esc(m.faultNote)}</p>` : ""}
      </section>
      <aside class="panel clear side stack">${sourceCard}
        <div class="card"><strong style="font-size:16px;line-height:1.4">${esc(q.q)}</strong><div class="stack" style="gap:8px">${opts}</div>${answered}</div></aside>
    </main>`;
  }
  function sceneStep(stop) {
    const d = st(stop.id), sc = stop.scene;
    const hots = sc.clues.map((c, i) => `<button type="button" class="hot ${UI.clue === i ? "cur" : d.tags[i] ? "done" : ""}" style="left:${HOTSPOTS[i][0]}%;top:${HOTSPOTS[i][1]}%" aria-label="Sensor ${i + 1}: ${esc(c.label)}" data-act="clue" data-i="${i}">${i + 1}</button>`).join("");
    const log = sc.clues.map((c, i) => {
      const t = d.tags[i];
      let fb = "";
      if (t) { const agree = c.expect === "x" || c.expect === t; fb = `<span class="why"><b>${agree ? "Field HQ agrees." : "Field HQ read it differently."}</b> ${esc(c.why)}</span>`; }
      return `<div class="sensor ${UI.clue === i ? "cur" : ""}"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><div class="thumb">${pic(c.img, "Clue " + (i + 1))}</div><strong style="font-size:15px">${i + 1} · ${esc(c.label)}</strong></div>
        <div class="row" style="flex-wrap:nowrap"><button type="button" class="tagbtn ${t === "s" ? "on" : ""}" aria-pressed="${t === "s"}" data-act="tag" data-i="${i}" data-v="s">Stabilizing</button><button type="button" class="tagbtn p ${t === "p" ? "on" : ""}" aria-pressed="${t === "p"}" data-act="tag" data-i="${i}" data-v="p">Adds pressure</button></div>${fb}</div>`;
    }).join("");
    const done = Object.keys(d.tags).length;
    return `<main class="main plain">
      <section class="grow stack" style="min-width:0"><h1>Place your sensors</h1><p class="small" style="font-size:16px">Tap each sensor on the scene. Does it hold the border steady, or add pressure?</p>
        <div class="scene">${pic(sc.img, "Border scene: " + sc.label)}${hots}</div></section>
      <aside class="side stack" style="min-width:0"><span class="kicker">Sensor log · ${done} of 4 tagged</span>${log}</aside>
    </main>`;
  }
  function trace(level) {
    const amp = [4, 12, 22, 34, 48][Math.max(0, Math.min(4, Math.round(level) - 1))] || 0;
    let p = [], x = 0, seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    while (x <= 420) { const burst = (x % 90) > 30 && (x % 90) < 70; p.push(x + "," + (75 + (burst ? (rnd() - 0.5) * 2 * amp : (rnd() - 0.5) * 3)).toFixed(1)); x += 6; }
    return `<svg viewBox="0 0 420 150" width="100%" role="img" aria-label="Seismograph trace for an average surface reading of ${level ? level.toFixed(1) : "none yet"}"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0 H0 V20" fill="none" stroke="#E2D9C4" stroke-width="1"/></pattern></defs><rect width="420" height="150" fill="url(#grid)"/><polyline class="trace" fill="none" stroke="#B4461A" stroke-width="2.5" points="${p.join(" ")}"/></svg>`;
  }
  function readStep(stop) {
    const d = st(stop.id), avg = avgSurface(stop);
    const groups = stop.voices.map((v) => `<div class="row"><span style="width:170px;font-size:15px">${esc(v.name)}${v.noVoice ? " (no voice)" : ""}</span>
      <div class="row" role="radiogroup" aria-label="${esc(v.name)} surface reading" style="gap:6px">${SCALE.map((s) => `<button type="button" class="num lab ${d.read[v.id] === s.n ? "on" : ""}" aria-pressed="${d.read[v.id] === s.n}" aria-label="${s.n}, ${s.label}" data-act="rd" data-v="${v.id}" data-n="${s.n}"><b>${s.n}</b><small>${s.label}</small></button>`).join("")}</div></div>`).join("");
    const press = PRESSURE.map((p) => `<button type="button" class="chip ${d.pressure === p.key ? "on" : ""}" aria-pressed="${d.pressure === p.key}" title="${esc(p.desc)}" data-act="press" data-v="${esc(p.key)}">${esc(p.key)}</button>`).join("");
    const srcs = SOURCES.map((s) => `<button type="button" class="chip acc ${d.source === s.key ? "on" : ""}" aria-pressed="${d.source === s.key}" data-act="src" data-v="${esc(s.key)}">${esc(s.key)}</button>`).join("");
    const ev = stop.scene ? `<div class="row" style="gap:14px;font-size:14px">${stop.scene.clues.map((c, i) => `<label class="row" style="gap:6px"><input type="checkbox" data-act="ev" data-i="${i}" ${d.ev.includes(i) ? "checked" : ""} ${!d.ev.includes(i) && d.ev.length >= 2 ? "disabled" : ""}> ${i + 1} · ${esc(c.label)}</label>`).join("")}</div>` : "";
    const hq = UI.showHQ ? hqPanel(stop) : "";
    return `<main class="main">${bg(stop.bg.c, "Background C (dusk): " + stop.bgLabel.c)}
      <section class="panel clear side stack" style="flex:1 1 400px">
        <div class="seis"><h1 style="color:#fff;font-size:24px">Read the seismograph</h1><div class="row" style="justify-content:space-between;font-family:var(--mono);font-size:12px;color:var(--line2)"><span>STATION: ${esc(stop.title.toUpperCase())}</span><span>LIVE TRACE</span></div>
          <div class="paper">${trace(avg)}</div>
          <div class="meter"><div><span>SURFACE (AVERAGE)</span><b>${avg ? avg.toFixed(1) + " · " + scaleLabel(avg) : "–"}</b></div><div><span>STORED PRESSURE</span><b>${esc(d.pressure || "–")}</b></div></div></div>
        ${hq}</section>
      <section class="grow stack" style="position:relative;z-index:1;min-width:0">
        <fieldset><legend>1. Surface reading for each side</legend>${groups}</fieldset>
        <fieldset><legend>2. Stored pressure along the line</legend><div class="row">${press}</div>${d.pressure ? `<span class="small">${esc((PRESSURE.find((p) => p.key === d.pressure) || {}).desc)}</span>` : ""}</fieldset>
        <fieldset><legend>3. Main pressure source</legend><div class="row">${srcs}</div></fieldset>
        <fieldset><legend>4. ${stop.scene ? "Evidence: pick 2 sensors, then explain" : "Explain your readings"}</legend>${ev}
          <label for="because" class="small">Because...</label><textarea id="because" rows="3" data-bind="stops.${stop.id}.because">${esc(d.because)}</textarea></fieldset>
      </section>
    </main>`;
  }
  function hqPanel(stop) {
    const d = st(stop.id), hq = stop.hq;
    return `<div class="hq" role="status"><span class="kicker acc">Field HQ reading</span>
      <span><b>Surface:</b> ${hq.surface} · ${scaleLabel(hq.surface)} &nbsp; <b>Pressure:</b> ${esc(hq.pressure)} &nbsp; <b>Source:</b> ${esc(hq.source)}</span>
      <span class="small">${esc(hq.note)}</span>
      <span style="font-size:14px">Yours: ${avgSurface(stop).toFixed(1)} · ${esc(d.pressure)} · ${esc(d.source)}. Disagreeing with HQ is fine if your evidence supports it.</span>
      <label class="small" for="think"><b>Think:</b> ${esc(stop.think)}</label><textarea id="think" rows="2" data-bind="stops.${stop.id}.think">${esc(d.think)}</textarea></div>`;
  }

  /* ---------------------------------------------------------------- COMPARE */
  function compareScreen() {
    const m = S.view.m, ms = matchupStops(m);
    const card = (s) => { const d = st(s.id); return `<div class="card ink"><span class="kicker">${s.num}. ${esc(s.title)}</span>
      <span><b>Surface:</b> ${avgSurface(s).toFixed(1)} · ${scaleLabel(avgSurface(s))}</span><span><b>Pressure:</b> ${esc(d.pressure || "–")}</span><span><b>Source:</b> ${esc(d.source || "–")}</span>
      <span class="small">${esc(d.because)}</span></div>`; };
    return `${top("Compare · " + MATCHUPS[m].title, hubLink)}<main class="main plain"><section class="grow stack"><h1>Compare the matchup</h1>
      <div class="row" style="align-items:stretch">${ms.map((s) => `<div style="flex:1 1 280px">${card(s)}</div>`).join("")}</div>
      <label for="cmp" style="font-size:17px;font-weight:700;line-height:1.4">${esc(MATCHUPS[m].compare)}</label>
      <textarea id="cmp" rows="5" data-bind="compare.${m}">${esc(S.compare[m] || "")}</textarea></section></main>
      <footer class="foot"><button type="button" class="btn" data-act="hub">Route</button><span class="hint">Write at least two sentences</span><button type="button" class="btn primary" data-act="cmpdone">${nextStop() ? "Next stop" : "Open the hazard map"}</button></footer>`;
  }

  /* ---------------------------------------------------------------- HAZARD */
  const SURF_COLORS = ["#2563A8", "#5E8CC4", "#D98A4E", "#C4632B", "#9E3812"];
  function hazard() {
    const bars = STOPS.map((s) => { const a = avgSurface(s); return `<span style="font-size:15px">${s.num ? s.num + " · " : ""}${esc(s.short)}</span>
      <div class="bar"><div style="width:${(a / 5) * 100}%;background:${SURF_COLORS[Math.max(0, Math.round(a) - 1)]}"></div></div><span style="font-size:14px;${/High|Locked/.test(st(s.id).pressure || "") ? "font-weight:700" : ""}">${esc(st(s.id).pressure || "–")}</span>`; }).join("");
    const rank = S.rank.map((r, i) => `<div class="rankitem"><span>${esc(r)}</span><button type="button" aria-label="Move up" data-act="rank" data-i="${i}" data-d="-1" ${i === 0 ? "disabled" : ""}>↑</button><button type="button" aria-label="Move down" data-act="rank" data-i="${i}" data-d="1" ${i === S.rank.length - 1 ? "disabled" : ""}>↓</button></div>`).join("");
    return `${top("Wrap-up · Hazard map", hubLink)}<main class="main plain">
      <section class="grow stack"><h1>Your hazard map</h1><p class="small" style="font-size:16px">Every reading you took, in one place.</p>
        <div class="bars"><span class="kicker">Stop</span><span class="kicker">Surface reading (1 to 5)</span><span class="kicker">Pressure</span>${bars}</div></section>
      <aside class="side stack"><h2>Rank the boundary types</h2><p class="small" style="font-size:15px">Put the most stable at the top and the highest risk at the bottom. Use your readings as evidence.</p>
        <span class="kicker" style="color:var(--blue)">Stable ground</span><div class="stack" style="gap:6px">${rank}</div><span class="kicker acc">High risk</span>
        <div class="card ink"><label for="rule" style="font-weight:700">Your rule for the new continent: “Borders hold best when...”</label><textarea id="rule" rows="3" data-bind="rule">${esc(S.rule)}</textarea></div></aside>
    </main><footer class="foot"><button type="button" class="btn" data-act="hub">Route</button><span class="hint"></span><button type="button" class="btn primary" data-act="survey">Survey the new continent</button></footer>`;
  }

  /* ---------------------------------------------------------------- CONTINENT */
  const CT = CONTINENT.terrain, CR = CT.length, CC = CT[0].length;
  const isLand = (c, r) => r >= 0 && r < CR && c >= 0 && c < CC && CT[r][c] !== ".";
  const isSea = (c, r) => r >= 0 && r < CR && c >= 0 && c < CC && CT[r][c] === ".";
  const k = (c, r) => c + "," + r;
  const landHexes = []; for (let r = 0; r < CR; r++) for (let c = 0; c < CC; c++) if (isLand(c, r)) landHexes.push([c, r]);
  const has = (list, c, r) => list.some((p) => p[0] === c && p[1] === r);
  const sName = (i) => (S.sv.names[i] || "").trim() || "State " + (i + 1);
  const pairKey = (a, b) => (a < b ? a + "-" + b : b + "-" + a);
  const pairName = (pk) => pk === "sea" ? "Sea zones" : pk.split("-").map((i) => sName(+i)).join(" / ");

  function analyze() {
    const own = S.sv.own, pairs = {};
    landHexes.forEach(([c, r]) => {
      const a = own[k(c, r)]; if (a == null) return;
      neighbors(c, r).forEach(([nc, nr]) => {
        if (!isLand(nc, nr)) return; const b = own[k(nc, nr)]; if (b == null || b === a) return;
        if (nr < r || (nr === r && nc < c)) return;
        const pk = pairKey(a, b); (pairs[pk] = pairs[pk] || []).push([[c, r], [nc, nr]]);
      });
    });
    const states = [...new Set(Object.values(own))].sort();
    const coast = {}, comps = {};
    states.forEach((s) => {
      coast[s] = landHexes.some(([c, r]) => own[k(c, r)] === s && neighbors(c, r).some(([nc, nr]) => isSea(nc, nr) || nr < 0 || nr >= CR || nc < 0 || nc >= CC));
      const mine = landHexes.filter(([c, r]) => own[k(c, r)] === s && CT[r][c] !== "I"), seen = new Set(); let n = 0;
      mine.forEach(([c, r]) => { if (seen.has(k(c, r))) return; n++; const q = [[c, r]]; seen.add(k(c, r));
        while (q.length) { const [x, y] = q.pop(); neighbors(x, y).forEach(([a, b]) => { if (isLand(a, b) && CT[b][a] !== "I" && own[k(a, b)] === s && !seen.has(k(a, b))) { seen.add(k(a, b)); q.push([a, b]); } }); } });
      comps[s] = n;
    });
    const ownersOf = (list) => new Set(list.map(([c, r]) => own[k(c, r)]).filter((v) => v != null));
    const river = landHexes.filter(([c, r]) => CT[r][c] === "R");
    const langOwners = {}; landHexes.forEach(([c, r]) => { const g = CONTINENT.lang(c, r), o = own[k(c, r)]; if (o == null) return; (langOwners[g] = langOwners[g] || new Set()).add(o); });
    const islands = landHexes.filter(([c, r]) => CT[r][c] === "I");
    const pairInfo = {};
    Object.keys(pairs).forEach((pk) => {
      const e = pairs[pk], [a, b] = pk.split("-").map(Number);
      const hexIn = (fn) => e.some(([p, q]) => fn(p) || fn(q));
      pairInfo[pk] = {
        mountain: hexIn(([c, r]) => CT[r][c] === "M"),
        river: hexIn(([c, r]) => CT[r][c] === "R"),
        oil: ownersOf(CONTINENT.oil).has(a) && ownersOf(CONTINENT.oil).has(b),
        splitsLang: Object.keys(langOwners).filter((g) => langOwners[g].has(a) && langOwners[g].has(b)).map((g) => CONTINENT.langNames[g]),
        oldLine: e.every(([p, q]) => Math.min(p[0], q[0]) <= CONTINENT.oldLine && Math.max(p[0], q[0]) >= CONTINENT.oldLine - 1)
      };
    });
    return { pairs, pairInfo, states, coast, comps, oilOwners: ownersOf(CONTINENT.oil), riverOwners: ownersOf(river), islandOwners: ownersOf(islands), nearCoast: own[k(13, 5)], neOwner: own[k(11, 1)] };
  }

  function continentSVG(A, opts) {
    const g = hexGeom(CC, CR, 26), own = S.sv.own, L = UI.svLayer;
    const terrFill = { L: "#EFE6CF", M: "#C9B99A", D: "#E8D9AE", R: "#EFE6CF", I: "#EFE6CF", ".": "#CFE0EE" };
    const langCol = { 1: "#7FA7C9", 2: "#E3B28A", 3: "#9CC9A6", 4: "#C4A6D6" }, relCol = { A: "#E8D27C", B: "#9AD0CF" };
    let seaOwner = {};
    if (L.sea) {
      const dist = {}, q = [];
      landHexes.forEach(([c, r]) => { const o = own[k(c, r)]; if (o == null) return; neighbors(c, r).forEach(([nc, nr]) => { if (isSea(nc, nr) && dist[k(nc, nr)] == null) { dist[k(nc, nr)] = 1; seaOwner[k(nc, nr)] = o; q.push([nc, nr]); } }); });
      while (q.length) { const [c, r] = q.shift(); const d = dist[k(c, r)]; if (d >= 5) continue; neighbors(c, r).forEach(([nc, nr]) => { if (isSea(nc, nr) && dist[k(nc, nr)] == null) { dist[k(nc, nr)] = d + 1; seaOwner[k(nc, nr)] = seaOwner[k(c, r)]; q.push([nc, nr]); } }); }
      seaOwner = { owner: seaOwner, dist };
    }
    let hexes = "", marks = "", edges = "", sel = "";
    for (let r = 0; r < CR; r++) for (let c = 0; c < CC; c++) {
      const t = CT[r][c], [x, y] = g.center(c, r), o = own[k(c, r)];
      let fill = terrFill[t];
      if (t !== ".") {
        if (L.lang) fill = langCol[CONTINENT.lang(c, r)];
        else if (L.rel) fill = relCol[CONTINENT.rel(c, r)];
      }
      let overlay = "";
      if (t !== "." && o != null && !L.lang && !L.rel) overlay = `<polygon points="${pts(g.corners(x, y))}" fill="${STATE_COLORS[o]}" fill-opacity=".55" pointer-events="none"/>`;
      if (t !== "." && o != null && (L.lang || L.rel)) overlay = `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${STATE_COLORS[o]}" stroke="#fff" pointer-events="none"/>`;
      if (t === "." && L.sea && seaOwner.dist && seaOwner.dist[k(c, r)]) {
        const d = seaOwner.dist[k(c, r)], op = d === 1 ? 0.5 : d === 2 ? 0.32 : 0.14;
        overlay = `<polygon points="${pts(g.corners(x, y))}" fill="${STATE_COLORS[seaOwner.owner[k(c, r)]]}" fill-opacity="${op}" pointer-events="none"/>`;
      }
      hexes += `<polygon class="hex" points="${pts(g.corners(x, y))}" fill="${fill}" data-k="${k(c, r)}"/>${overlay}`;
      if (t === "M") marks += `<path d="M${(x - 9).toFixed(1)} ${(y + 6).toFixed(1)} l9 -14 l9 14 z" fill="#8F7D5E" pointer-events="none"/>`;
      if (t === "R") marks += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="#2563A8" fill-opacity=".75" pointer-events="none"/>`;
      if (L.res) {
        if (has(CONTINENT.oil, c, r)) marks += `<rect x="${(x - 5).toFixed(1)}" y="${(y + 2).toFixed(1)}" width="10" height="10" fill="#1E2A2F" pointer-events="none"/>`;
        if (has(CONTINENT.water, c, r)) marks += `<path d="M${x.toFixed(1)} ${(y - 9).toFixed(1)} l6 8 l-6 8 l-6 -8z" fill="#2563A8" pointer-events="none"/>`;
        if (has(CONTINENT.mines, c, r)) marks += `<path d="M${(x - 7).toFixed(1)} ${(y + 7).toFixed(1)} l7 -12 l7 12z" fill="#B4461A" pointer-events="none"/>`;
        if (has(CONTINENT.pocket, c, r)) marks += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="none" stroke="#1E2A2F" stroke-width="2.5" pointer-events="none"/>`;
      }
    }
    if (A) Object.keys(A.pairs).forEach((pk) => A.pairs[pk].forEach(([a, b]) => { const e = sharedEdge(g, a, b); edges += line(e, "", 'stroke="#1E2A2F" stroke-width="4" stroke-linecap="round" pointer-events="none"'); if (S.sv.sel === pk) sel += line(e, "", 'stroke="#B4461A" stroke-width="8" stroke-linecap="round" pointer-events="none"'); }));
    let extra = "";
    if (L.old) { const x = g.center(CONTINENT.oldLine, 0)[0]; extra += `<line x1="${x.toFixed(1)}" y1="20" x2="${x.toFixed(1)}" y2="${(g.H - 20).toFixed(1)}" stroke="#5A4A2E" stroke-width="3" stroke-dasharray="10 8" pointer-events="none"/>`; }
    if (L.out) extra += `<text x="${(g.W / 2).toFixed(0)}" y="16" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="13" fill="#1E2A2F">▲ Northern power</text><text x="${(g.W - 8).toFixed(0)}" y="${(g.H / 2).toFixed(0)}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="13" fill="#1E2A2F" transform="rotate(90 ${(g.W - 8).toFixed(0)} ${(g.H / 2).toFixed(0)})">Eastern power ▶</text>`;
    return `<div class="mapbox"><svg id="cmap" viewBox="0 0 ${g.W.toFixed(0)} ${g.H.toFixed(0)}" role="img" aria-label="Hex map of the new continent">${hexes}${marks}${edges}${sel}${extra}</svg></div>`;
  }

  /* ---------------------------------------------------------------- SURVEY */
  function survey() {
    const A = analyze(), sv = S.sv, tab = UI.svTab;
    const claimed = landHexes.filter(([c, r]) => sv.own[k(c, r)] != null).length;
    const allClaimed = claimed === landHexes.length;
    const used = A.states.length;
    const pks = Object.keys(A.pairs);
    const labeled = pks.filter((pk) => { const b = sv.borders[pk]; return b && b.type && b.func && b.status; });
    const typesUsed = new Set(labeled.map((pk) => sv.borders[pk].type)).size;
    const typesNeed = Math.min(4, pks.length);
    const tabs = [["draw", "1 · Draw states"], ["label", "2 · Label borders"], ["sea", "3 · Sea zones and deals"], ["predict", "4 · Predict"]];
    const canLabel = allClaimed && used === sv.n;
    const canSea = canLabel && labeled.length === pks.length && typesUsed >= typesNeed;
    const strNeeded = [...A.islandOwners].some((o) => o !== A.nearCoast);
    const canPredict = canSea && (!strNeeded || sv.strait != null);
    const lines = pks.concat(["sea"]);
    const canGo = canPredict && lines.every((pk) => sv.pred[pk]);
    const gate = { draw: true, label: canLabel || UNLOCK, sea: canSea || UNLOCK, predict: canPredict || UNLOCK };
    const nav = `<nav class="steps">${tabs.map(([t, n]) => `<button type="button" class="${t === tab ? "on" : ""}" data-act="svtab" data-t="${t}" ${gate[t] ? "" : "disabled"}>${n}</button>`).join("")}</nav>`;
    const layerChk = (key, label) => `<label class="row" style="gap:8px;font-size:14px"><input type="checkbox" data-act="svlayer" data-k="${key}" ${UI.svLayer[key] ? "checked" : ""}> ${label}</label>`;
    const layers = `<span class="kicker" style="margin-top:6px">Layers</span>${layerChk("lang", "Language")}${layerChk("rel", "Religion")}${layerChk("res", "Resources")}${layerChk("old", "Old colonial line")}${layerChk("out", "Outside powers")}${layerChk("sea", "Sea zones")}
      <div class="small" style="line-height:1.5">■ oil · ◆ fresh water · ▲ gold and copper · ○ minority town · ● river · mountains drawn as peaks</div>`;
    let left = "", right = "", hint = "", next = "";
    if (tab === "draw") {
      left = `<div class="tools"><span class="kicker">How many states?</span><div class="row">${[4, 5].map((n) => `<button type="button" class="chip ${sv.n === n ? "on" : ""}" data-act="svn" data-n="${n}">${n}</button>`).join("")}</div>
        <span class="kicker">Paint with</span>${Array.from({ length: sv.n }, (_, i) => `<button type="button" class="swatch ${sv.cur === i ? "on" : ""}" data-act="svcur" data-i="${i}"><i style="background:${STATE_COLORS[i]}"></i><span data-sname="${i}">${esc(sName(i))}</span></button>`).join("")}
        <button type="button" class="swatch ${sv.cur === -1 ? "on" : ""}" data-act="svcur" data-i="-1"><i style="background:#fff;border:2px solid #8A8F94"></i>Erase</button>${layers}</div>`;
      right = `<div class="card"><strong>Name your states</strong>${Array.from({ length: sv.n }, (_, i) => `<label class="row" style="gap:8px;flex-wrap:nowrap"><i style="width:16px;height:16px;border-radius:4px;background:${STATE_COLORS[i]};flex-shrink:0"></i><input type="text" data-bind="sv.names.${i}" value="${esc(sv.names[i])}" placeholder="State ${i + 1}" autocomplete="off"></label>`).join("")}</div>
        <div class="card checklist"><strong>Commission checklist</strong>
        <div class="${allClaimed ? "ok" : "no"}">${allClaimed ? "✓" : "○"} Every land hex claimed (${claimed} of ${landHexes.length}, islands too)</div>
        <div class="${used === sv.n ? "ok" : "no"}">${used === sv.n ? "✓" : "○"} All ${sv.n} states used</div></div>
        <p class="small">Click or drag across hexes to paint. Look at every layer before you draw: where would a line cut a group, a river, or a resource?</p>`;
      hint = gate.label && canLabel ? "" : "Paint every hex, then label the borders"; next = `<button type="button" class="btn primary" data-act="svtab" data-t="label" ${gate.label ? "" : "disabled"}>Next: Label borders</button>`;
    }
    if (tab === "label") {
      const rows = pks.map((pk) => { const b = sv.borders[pk] || {}, info = A.pairInfo[pk];
        const pings = []; if (info.oil) pings.push("splits the oil field"); if (info.river) pings.push("crosses the river"); if (info.splitsLang.length) pings.push("splits " + info.splitsLang.join(" and ")); if (info.mountain) pings.push("runs through mountains");
        const sel = (field, list) => `<select data-bind="sv.borders.${pk}.${field}" aria-label="${field}"><option value="">${field === "type" ? "How made?" : field === "func" ? "Who crosses?" : "How far?"}</option>${list.map((o) => `<option ${b[field] === o ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
        return `<div class="borderrow ${sv.sel === pk ? "sel" : ""}"><button type="button" class="chip ${sv.sel === pk ? "on" : ""}" data-act="svsel" data-pk="${pk}" style="text-align:left">${esc(pairName(pk))}</button>${sel("type", BORDER_TYPES)}${sel("func", BORDER_FUNCTIONS)}${sel("status", BORDER_STATUS)}
          ${pings.length ? `<div class="alert" style="grid-column:1/-1"><b>Sensor ping:</b> this line ${pings.join(", ")}.</div>` : ""}</div>`; }).join("");
      left = `<div class="tools">${layers}</div>`;
      right = `<div class="stack"><strong>Label every border</strong><p class="small">Pick a border to highlight it. Say how it was made, who can cross, and how far you went in marking it.</p>${rows}
        <div class="card checklist"><div class="${labeled.length === pks.length ? "ok" : "no"}">${labeled.length === pks.length ? "✓" : "○"} All ${pks.length} borders labeled</div>
        <div class="${typesUsed >= typesNeed ? "ok" : "no"}">${typesUsed >= typesNeed ? "✓" : "○"} At least ${typesNeed} different boundary types (${typesUsed} so far)</div></div></div>`;
      hint = labeled.length === pks.length && typesUsed >= typesNeed ? "" : "Label every border"; next = `<button type="button" class="btn primary" data-act="svtab" data-t="sea" ${gate.sea ? "" : "disabled"}>Next: Sea zones and deals</button>`;
    }
    if (tab === "sea") {
      const opts = [["The mainland state gets all 20 miles.", false], ["Split at the midpoint: 10 miles each.", true], ["The island state gets all 20 miles.", false], ["Nobody owns it, so it counts as the high seas.", false]];
      const strait = strNeeded ? `<div class="card"><strong style="line-height:1.4">The island chain is only 20 nautical miles from the mainland, and different states hold them. Under UNCLOS, how is the water split?</strong>
        ${opts.map((o, i) => { let cls = sv.strait == null ? "" : o[1] ? "right" : sv.strait === i ? "wrong" : ""; return `<label class="opt ${cls}"><input type="radio" name="st" data-act="strait" data-i="${i}" ${sv.strait === i ? "checked" : ""}> ${esc(o[0])}</label>`; }).join("")}
        ${sv.strait != null ? `<span class="why">When two coasts are less than 24 nautical miles apart, the water between them is split in half (AMSCO p. 229).</span>` : ""}</div>`
        : `<div class="card"><strong>The islands belong to the same state as the nearest coast.</strong><span class="small">No strait to split, and that state's EEZ grows by up to 200 nautical miles around every island.</span></div>`;
      const deals = AGREEMENTS.map((a) => `<label class="row" style="gap:8px;font-size:15px;flex-wrap:nowrap"><input type="checkbox" data-act="deal" data-k="${a.key}" ${sv.deals.includes(a.key) ? "checked" : ""} ${!sv.deals.includes(a.key) && sv.deals.length >= 2 ? "disabled" : ""}> ${esc(a.label)}</label>`).join("");
      left = `<div class="tools">${layers}</div>`;
      right = `<div class="card"><strong>UNCLOS zones (turn on Sea zones)</strong><span class="small">Darkest band: territorial sea, 12 nautical miles, full control. Next: contiguous zone, to 24 nm, customs and immigration. Lightest: exclusive economic zone (EEZ), to 200 nm, fishing and drilling rights. Beyond: the high seas, open to all.</span></div>
        ${strait}<div class="card"><strong>Sign two treaties (no more)</strong><span class="small">Treaties can let pressure out later. You can only negotiate two.</span>${deals}</div>`;
      hint = strNeeded && sv.strait == null ? "Answer the strait question" : ""; next = `<button type="button" class="btn primary" data-act="svtab" data-t="predict" ${gate.predict ? "" : "disabled"}>Next: Predict</button>`;
      if (!UI.svLayer.sea) { UI.svLayer.sea = true; return survey(); }
    }
    if (tab === "predict") {
      const rows = lines.map((pk) => `<div class="row" style="justify-content:space-between;background:#fff;border:2px solid var(--line);border-radius:8px;padding:8px"><button type="button" class="chip ${sv.sel === pk ? "on" : ""}" data-act="svsel" data-pk="${pk}">${esc(pairName(pk))}</button>
        <div class="row" style="gap:6px">${SCALE.map((s) => `<button type="button" class="num ${sv.pred[pk] === s.n ? "on" : ""}" title="${s.label}" data-act="pred" data-pk="${pk}" data-n="${s.n}">${s.n}</button>`).join("")}</div></div>`).join("");
      left = `<div class="tools">${layers}</div>`;
      right = `<div class="stack"><strong>Predict a surface reading for every line, 50 years from now</strong><p class="small">1 Stable · 2 Tremors · 3 Moderate · 4 Strong · 5 Major Quake. These are locked in when the aftershocks start.</p>${rows}</div>`;
      hint = canGo ? "" : "Predict every line"; next = `<button type="button" class="btn primary" data-act="startaf" ${canGo || UNLOCK ? "" : "disabled"}>Lock borders, start aftershocks</button>`;
    }
    return `${top("Build · Survey the new continent", hubLink)}${nav}<main class="main plain">${tab === "draw" ? left : ""}
      <section class="grow stack" style="flex:999 1 480px">${continentSVG(A)}</section>
      <aside class="side stack" style="flex:1 1 400px">${tab !== "draw" ? left.replace('class="tools"', 'class="stack"') : ""}${right}</aside></main>
      <footer class="foot"><button type="button" class="btn" data-act="hazard">Hazard map</button><span class="hint">${hint}</span>${next}</footer>`;
  }

  /* ---------------------------------------------------------------- AFTERSHOCKS */
  function effects(n, A) {
    const sv = S.sv, out = {}, add = (pk, d, why) => { if (!out[pk]) out[pk] = { d: 0, why: [] }; out[pk].d += d; out[pk].why.push(why); };
    const pks = Object.keys(A.pairs), deal = (x) => sv.deals.includes(x);
    const ofState = (s) => pks.filter((pk) => pk.split("-").map(Number).includes(s));
    if (n === 1) pks.forEach((pk) => { if (A.pairInfo[pk].oil) add(pk, deal("oil") ? 0 : 2, deal("oil") ? "Splits the oil field, but the joint drilling deal holds" : "Splits the oil field with no sharing deal"); });
    if (n === 2) pks.forEach((pk) => { if (A.pairInfo[pk].river) add(pk, deal("water") ? 0 : 2, deal("water") ? "The water treaty holds" : "The river crosses this border and there is no water treaty"); });
    if (n === 3) pks.forEach((pk) => { if ((sv.borders[pk] || {}).func === "Open") add(pk, deal("refugee") ? 0 : 1, deal("refugee") ? "Open, with a shared refugee plan" : "Open border with no shared refugee plan"); });
    if (n === 4) pks.forEach((pk) => { const g = A.pairInfo[pk].splitsLang; if (g.length) add(pk, 2, "Splits " + g.join(" and ")); });
    if (n === 5) pks.forEach((pk) => { if (A.pairInfo[pk].mountain && (sv.borders[pk] || {}).status === "Defined only") add(pk, 2, "A mountain line that was only defined, never mapped or marked"); });
    if (n === 6 && A.neOwner != null) ofState(A.neOwner).forEach((pk) => add(pk, deal("pact") ? 1 : 2, deal("pact") ? sName(A.neOwner) + " is courted by the outside power, but the security pact helps" : sName(A.neOwner) + " sits between the outside powers with no allies"));
    if (n === 7) { const diff = [...A.islandOwners].some((o) => o !== A.nearCoast); if (diff) add("sea", sv.strait === 1 ? 0 : 2, sv.strait === 1 ? "Strait split at the midpoint" : "Overlapping waters were never split fairly"); }
    if (n === 8) A.states.forEach((s) => { if (!A.coast[s]) ofState(s).forEach((pk) => add(pk, deal("port") ? 1 : 2, sName(s) + " is landlocked" + (deal("port") ? ", but has a port treaty" : " with no port treaty"))); });
    if (n === 9) A.states.forEach((s) => { if (A.comps[s] > 1) ofState(s).forEach((pk) => add(pk, deal("corridor") ? 0 : 2, sName(s) + " is split into pieces" + (deal("corridor") ? ", but the corridor deal holds" : " with no corridor deal"))); });
    if (n === 10) pks.forEach((pk) => { const f = (sv.borders[pk] || {}).func; if (f === "Open" || f === "Controlled") add(pk, -1, "Trade bloc: checks drop"); });
    return out;
  }
  function startAftershocks() {
    const nine = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 3).sort((a, b) => AFTERSHOCKS[a - 1].year - AFTERSHOCKS[b - 1].year);
    S.af = { deck: nine.concat([10]), i: 0, cur: Object.assign({}, S.sv.pred), last: null, log: [], note: "" };
  }
  function drawCard() {
    const af = S.af, A = analyze(), n = af.deck[af.i], fx = effects(n, A);
    Object.keys(fx).forEach((pk) => { af.cur[pk] = Math.max(1, Math.min(5, (af.cur[pk] || 1) + fx[pk].d)); });
    af.last = { n, fx: Object.fromEntries(Object.entries(fx).map(([pk, v]) => [pk, { d: v.d, why: v.why.join("; ") }])) };
    af.log.push(af.last); af.i++;
  }
  function aftershocks() {
    const af = S.af; if (!af) return hub();
    const lines = Object.keys(S.sv.pred);
    const card = af.last ? AFTERSHOCKS[af.last.n - 1] : null;
    const tl = af.deck.map((n, i) => `<span class="dot ${i < af.i ? "on" : ""}">Card ${i + 1}${i < af.i ? " · Year " + AFTERSHOCKS[n - 1].year : ""}</span>${i < af.deck.length - 1 ? '<span class="ln"></span>' : ""}`).join("");
    const left = card ? `<div class="event"><div class="art">${pic(card.img, "Event art: " + card.title)}</div><div style="padding:16px" class="stack" style="gap:8px">
        <span class="kicker acc">Aftershock ${af.i} of ${af.deck.length} · ${esc(card.type)} · Year ${card.year}</span><h1 style="font-size:26px">${esc(card.title)}</h1>
        <span style="font-size:15px"><b style="color:var(--accent)">Up:</b> ${esc(card.up)}</span><span style="font-size:15px"><b style="color:var(--blue)">Down:</b> ${esc(card.down)}</span></div></div>`
      : `<div class="card ink"><h2>Your borders are locked</h2><p>Fifty years are about to pass. Draw the first card to see what shakes.</p></div>`;
    const rows = lines.map((pk) => { const f = af.last && af.last.fx[pk]; const now = af.cur[pk];
      return `<span style="font-size:15px;${f ? "font-weight:700" : ""}">${esc(pairName(pk))}</span><span class="big" style="color:${SURF_COLORS[S.sv.pred[pk] - 1]}">${S.sv.pred[pk]}</span>
        <span class="big" style="color:${SURF_COLORS[now - 1]}">${now}${f && f.d ? `<span style="font-size:15px"> (${f.d > 0 ? "+" : "−"}${Math.abs(f.d)})</span>` : ""}</span><span class="whycol" style="font-size:14px">${f ? esc(f.why) : af.last ? "Not affected by this card" : ""}</span>`; }).join("");
    const done = af.i >= af.deck.length;
    return `${top("Build · Aftershocks", hubLink)}<div class="timeline">${tl}</div><main class="main plain">
      <section class="stack" style="flex:1 1 380px;min-width:0">${left}</section>
      <section class="grow stack"><h2>What happened to your borders?</h2><div class="ctable"><span class="kicker">Line</span><span class="kicker">Predicted</span><span class="kicker">Now</span><span class="kicker whycol">Why</span>${rows}</div>
        ${done ? `<div class="card ink"><label for="note" style="font-weight:700">Field note: which border would you redraw, and which stop taught you why?</label><textarea id="note" rows="3" data-bind="af.note">${esc(af.note)}</textarea></div>` : ""}</section></main>
      <footer class="foot"><button type="button" class="btn" data-act="survey">View map</button><span class="hint"></span>
      ${done ? `<button type="button" class="btn primary" data-act="exit">Exit FRQ</button>` : `<button type="button" class="btn primary" data-act="draw">Draw ${af.i ? "next" : "the first"} card</button>`}</footer>`;
  }

  /* ---------------------------------------------------------------- EXIT + REPORT */
  function exitScreen() {
    const A = analyze(), f = S.frq, pks = Object.keys(A.pairs);
    const opts = pks.map((pk) => `<option value="${pk}" ${f.pair === pk ? "selected" : ""}>${esc(pairName(pk))}${S.sv.borders[pk] && S.sv.borders[pk].type ? " (" + esc(S.sv.borders[pk].type) + ")" : ""}</option>`).join("");
    const fld = (key, label, rows) => `<label class="stack" style="gap:4px"><span style="font-weight:700">${label}</span><textarea rows="${rows || 2}" data-bind="frq.${key}">${esc(f[key])}</textarea></label>`;
    return `${top("Exit FRQ", hubLink)}<main class="main plain"><section class="grow stack" style="max-width:820px"><h1>Defend one border</h1>
      <p style="font-size:17px">Choose one border you drew. Using the thesis frame, explain why you chose its type, and support it with evidence from two different stops.</p>
      <label class="stack" style="gap:4px"><span style="font-weight:700">Border</span><select data-bind="frq.pair"><option value="">Choose a border</option>${opts}</select></label>
      ${fld("although", "Although... (the best point for the other side)")}${fld("claim", "...I chose this type of border...")}${fld("because1", "...because... (evidence from one stop)")}${fld("because2", "...and because... (evidence from a different stop)")}
      <div class="card"><span class="small">Example on a different topic: Although summer break gives students time to rest, schools should shorten it because students forget less over a shorter break and teachers spend less time reviewing in the fall.</span></div></section></main>
      <footer class="foot"><button type="button" class="btn" data-act="after">Aftershocks</button><span class="hint"></span><button type="button" class="btn primary" data-act="report">See the report</button></footer>`;
  }
  function reportScreen() {
    const A = analyze(), names = S.names.filter((x) => x.trim()).join(" + ") || "[names]";
    const stopRows = STOPS.map((s) => { const d = st(s.id); return `<tr><td>${s.num ? s.num + ". " : ""}${esc(s.title)}</td><td>${avgSurface(s) ? avgSurface(s).toFixed(1) : "–"}</td><td>${esc(d.pressure || "–")}</td><td>${esc(d.source || "–")}</td><td>${esc(d.because)}</td></tr>`; }).join("");
    const cmp = ["A", "B", "C", "D"].map((m) => `<tr><td>${esc(MATCHUPS[m].title)}</td><td>${esc(S.compare[m] || "")}</td></tr>`).join("");
    const bRows = Object.keys(A.pairs).map((pk) => { const b = S.sv.borders[pk] || {}; return `<tr><td>${esc(pairName(pk))}</td><td>${esc(b.type || "")}</td><td>${esc(b.func || "")}</td><td>${esc(b.status || "")}</td><td>${S.sv.pred[pk] || ""}</td><td>${S.af ? S.af.cur[pk] || "" : ""}</td></tr>`; }).join("");
    const f = S.frq;
    return `${top("Report", hubLink)}<main class="main plain report"><section class="grow stack">
      <div class="row noprint"><button type="button" class="btn primary" data-act="print">Print or save as PDF</button>
      <button type="button" class="btn" data-act="reset">${UI.confirmReset ? "Tap again to erase all work" : "Start over"}</button></div>
      <h1>Fault Lines report: ${esc(names)}</h1>
      <h2>Stop readings</h2><table><tr><th>Stop</th><th>Surface</th><th>Pressure</th><th>Source</th><th>Because</th></tr>${stopRows}</table>
      <h2>Matchup comparisons</h2><table>${cmp}</table>
      <h2>Rule for the new continent</h2><p>${esc(S.rule)}</p>
      <h2>The new continent</h2><table><tr><th>Border</th><th>Type</th><th>Crossing</th><th>Marking</th><th>Predicted</th><th>After 50 years</th></tr>${bRows}</table>
      <p><b>Treaties:</b> ${esc(S.sv.deals.map((d) => (AGREEMENTS.find((a) => a.key === d) || {}).label).join("; ") || "none")}</p>
      <p><b>Aftershocks drawn:</b> ${S.af ? S.af.log.map((l) => esc(AFTERSHOCKS[l.n - 1].title)).join("; ") : "none yet"}</p>
      <p><b>Field note:</b> ${S.af ? esc(S.af.note) : ""}</p>
      <h2>Exit FRQ</h2><p><b>Border:</b> ${esc(f.pair ? pairName(f.pair) : "")}</p><p>Although ${esc(f.although)} ${esc(f.claim)} because ${esc(f.because1)} and because ${esc(f.because2)}</p>
    </section></main>`;
  }

  /* ---------------------------------------------------------------- render + events */
  function render() {
    const v = S.view.s;
    const html = v === "stop" ? stopScreen() : v === "compare" ? compareScreen() : v === "hazard" ? hazard() : v === "survey" ? survey() : v === "after" ? aftershocks() : v === "exit" ? exitScreen() : v === "report" ? reportScreen() : hub();
    $("#app").innerHTML = html;
    document.title = "Fault Lines" + (v === "stop" ? ": " + STOP_BY_ID[S.view.id].title : "");
  }
  function setPath(path, val) {
    const parts = path.split("."); let o = S;
    for (let i = 0; i < parts.length - 1; i++) { if (o[parts[i]] == null) o[parts[i]] = {}; o = o[parts[i]]; }
    o[parts[parts.length - 1]] = val;
  }

  /* Typing never re-renders the page (that would swallow the next click). It only updates the bits that depend on it. */
  document.addEventListener("input", (e) => {
    const b = e.target.getAttribute("data-bind"); if (!b || e.target.tagName === "SELECT") return;
    setPath(b, e.target.value); save();
    if (/\.because$/.test(b) && S.view.s === "stop") {
      const stop = STOP_BY_ID[S.view.id], btn = document.querySelector('[data-act="log"]');
      if (btn) btn.disabled = !(readOk(stop) || UNLOCK);
      const tk = document.getElementById("task-because"), ok = S.stops[stop.id].because.trim().length >= 15;
      if (tk) { tk.classList.toggle("done", ok); tk.querySelector("i").textContent = ok ? "✓" : ""; }
      const left = tasks(stop, "read").filter((t) => !t[1]).length, hint = document.querySelector(".foot .hint");
      if (hint) { hint.textContent = left ? `${left} task${left > 1 ? "s" : ""} left` : "All tasks done. Go on!"; hint.classList.toggle("ready", !left); }
    }
    if (/^sv\.names\./.test(b)) {
      const i = b.split(".")[2];
      document.querySelectorAll('[data-sname="' + i + '"]').forEach((el) => (el.textContent = sName(+i)));
    }
  });
  document.addEventListener("change", (e) => {
    const b = e.target.getAttribute("data-bind");
    if (b && e.target.tagName === "SELECT") { setPath(b, e.target.value); save(); const y = window.scrollY; render(); window.scrollTo(0, y); }
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-act]"); if (!t) {
      const h = e.target.closest("[data-h]");
      if (h && S.view.s === "stop") { UI.hex = h.getAttribute("data-h").split(",").map(Number); render(); }
      return;
    }
    const act = t.getAttribute("data-act"), id = t.getAttribute("data-id"), i = +t.getAttribute("data-i");
    const stop = S.view.s === "stop" ? STOP_BY_ID[S.view.id] : null, d = stop ? st(stop.id) : null;
    switch (act) {
      case "hub": go({ s: "hub" }); return;
      case "help": if (e.target.closest("[data-stop]") && !e.target.closest('button[data-act="help"]')) return; UI.help = !UI.help; break;
      case "open": { const s = STOP_BY_ID[id]; const firstOpen = s.steps.find((x) => !stepOk(s, x)) || s.steps[0]; go({ s: "stop", id, step: isDone(id) ? s.steps[0] : firstOpen }); return; }
      case "step": S.view.step = t.getAttribute("data-step"); UI.term = null; UI.hex = null; UI.flip = false; UI.fault = false; UI.layer = 0; UI.clue = 0; UI.showHQ = st(S.view.id).done && S.view.step === "read"; if (S.view.step === "map") markLayer(); save(); render(); window.scrollTo(0, 0); return;
      case "term": { const term = t.getAttribute("data-term"); UI.term = term; if (!d.terms.includes(term)) d.terms.push(term); break; }
      case "layer": UI.layer = i; UI.hex = null; markLayer(); break;
      case "fault": UI.fault = !UI.fault; if (UI.fault) d.faultSeen = true; break;
      case "flip": UI.flip = !UI.flip; break;
      case "mapans": d.mapAns = i; break;
      case "clue": UI.clue = i; break;
      case "tag": d.tags[i] = t.getAttribute("data-v"); UI.clue = Math.min(3, i + 1); break;
      case "rd": d.read[t.getAttribute("data-v")] = +t.getAttribute("data-n"); break;
      case "press": d.pressure = t.getAttribute("data-v"); break;
      case "src": d.source = t.getAttribute("data-v"); break;
      case "ev": { const ix = d.ev.indexOf(i); if (ix >= 0) d.ev.splice(ix, 1); else if (d.ev.length < 2) d.ev.push(i); break; }
      case "log": d.done = true; UI.showHQ = true; break;
      case "afterlog": {
        const ms = matchupStops(stop.matchup);
        if (MATCHUPS[stop.matchup].compare && ms.every((s) => isDone(s.id)) && !(S.compare[stop.matchup] || "").trim()) { go({ s: "compare", m: stop.matchup }); return; }
        const n = nextStop(); if (n) { go({ s: "stop", id: n.id, step: n.steps[0] }); return; } go({ s: "hazard" }); return;
      }
      case "compare": go({ s: "compare", m: t.getAttribute("data-m") }); return;
      case "cmpdone": { const n = nextStop(); if (n) go({ s: "stop", id: n.id, step: n.steps[0] }); else go({ s: "hazard" }); return; }
      case "hazard": go({ s: "hazard" }); return;
      case "rank": { const dd = +t.getAttribute("data-d"), j = i + dd; const r = S.rank; [r[i], r[j]] = [r[j], r[i]]; break; }
      case "survey": go({ s: "survey" }); return;
      case "svtab": UI.svTab = t.getAttribute("data-t"); S.sv.sel = null; if (UI.svTab !== "sea") UI.svLayer.sea = UI.svTab === "predict"; break;
      case "svn": S.sv.n = +t.getAttribute("data-n"); if (S.sv.n === 4) { Object.keys(S.sv.own).forEach((kk) => { if (S.sv.own[kk] === 4) delete S.sv.own[kk]; }); if (S.sv.cur === 4) S.sv.cur = 0; } break;
      case "svcur": S.sv.cur = i; break;
      case "svlayer": { const kk = t.getAttribute("data-k"); UI.svLayer[kk] = !UI.svLayer[kk]; if (kk === "lang" && UI.svLayer.lang) UI.svLayer.rel = false; if (kk === "rel" && UI.svLayer.rel) UI.svLayer.lang = false; break; }
      case "svsel": { const pk = t.getAttribute("data-pk"); S.sv.sel = S.sv.sel === pk ? null : pk; break; }
      case "strait": S.sv.strait = i; break;
      case "deal": { const kk = t.getAttribute("data-k"), ix = S.sv.deals.indexOf(kk); if (ix >= 0) S.sv.deals.splice(ix, 1); else if (S.sv.deals.length < 2) S.sv.deals.push(kk); break; }
      case "pred": S.sv.pred[t.getAttribute("data-pk")] = +t.getAttribute("data-n"); break;
      case "startaf": startAftershocks(); go({ s: "after" }); return;
      case "after": go({ s: "after" }); return;
      case "draw": drawCard(); break;
      case "exit": go({ s: "exit" }); return;
      case "report": UI.confirmReset = false; go({ s: "report" }); return;
      case "print": window.print(); return;
      case "reset": if (!UI.confirmReset) { UI.confirmReset = true; break; } S = fresh(); UI.confirmReset = false; save(); go({ s: "hub" }); return;
      default: return;
    }
    save(); const y = window.scrollY; render(); window.scrollTo(0, y);
  });
  function markLayer() { const stop = STOP_BY_ID[S.view.id]; if (!stop.map) return; const key = stop.map.layers[UI.layer].key, d = st(stop.id); if (!d.layers.includes(key)) d.layers.push(key); }

  /* painting on the continent */
  let painting = false;
  function paintAt(el) {
    if (!el || S.view.s !== "survey" || UI.svTab !== "draw") return;
    const hx = el.closest && el.closest("[data-k]"); if (!hx) return;
    const kk = hx.getAttribute("data-k"), [c, r] = kk.split(",").map(Number);
    if (!isLand(c, r)) return;
    if (S.sv.cur === -1) delete S.sv.own[kk]; else S.sv.own[kk] = S.sv.cur;
    hx.setAttribute("fill", S.sv.cur === -1 ? "#EFE6CF" : STATE_COLORS[S.sv.cur]);
  }
  document.addEventListener("pointerdown", (e) => { if (e.target.closest && e.target.closest("#cmap") && UI.svTab === "draw") { painting = true; paintAt(e.target); e.preventDefault(); } });
  document.addEventListener("pointermove", (e) => { if (!painting) return; paintAt(document.elementFromPoint(e.clientX, e.clientY)); });
  document.addEventListener("pointerup", () => { if (!painting) return; painting = false; S.sv.borders = pruneBorders(); save(); const y = window.scrollY; render(); window.scrollTo(0, y); });
  function pruneBorders() { const A = analyze(), out = {}; Object.keys(A.pairs).forEach((pk) => { if (S.sv.borders[pk]) out[pk] = S.sv.borders[pk]; }); const pr = {}; Object.keys(S.sv.pred).forEach((pk) => { if (A.pairs[pk] || pk === "sea") pr[pk] = S.sv.pred[pk]; }); S.sv.pred = pr; return out; }

  if (S.view.s === "stop" && !STOP_BY_ID[S.view.id]) S.view = { s: "hub" };
  render();
})();
