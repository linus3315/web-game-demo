var kt = Object.defineProperty;
var yt = (n, e, s) => e in n ? kt(n, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[e] = s;
var T = (n, e, s) => yt(n, typeof e != "symbol" ? e + "" : e, s);
import { registerStrings as wt, defineGame as vt, bindVisualViewport as xt, patchGame as St, t as Mt } from "@wgf/core";
import { TokenStore as Tt, HttpClient as Lt } from "@wgf/net";
const Et = {
  background: "#272b2c",
  shapes: [
    { tag: "circle", attrs: { cx: 160, cy: 78, r: 5, fill: "#f4f7f8" } },
    { tag: "circle", attrs: { cx: 140, cy: 108, r: 5, fill: "#f4f7f8" } },
    { tag: "circle", attrs: { cx: 180, cy: 108, r: 5, fill: "#f4f7f8" } },
    { tag: "circle", attrs: { cx: 120, cy: 138, r: 5, fill: "#f4f7f8" } },
    { tag: "circle", attrs: { cx: 160, cy: 138, r: 5, fill: "#f4f7f8" } },
    { tag: "circle", attrs: { cx: 200, cy: 138, r: 5, fill: "#f4f7f8" } },
    { tag: "rect", attrs: { x: 70, y: 176, width: 36, height: 22, rx: 8, fill: "#e23b3b" } },
    { tag: "rect", attrs: { x: 112, y: 176, width: 36, height: 22, rx: 8, fill: "#f0b429" } },
    { tag: "rect", attrs: { x: 154, y: 176, width: 36, height: 22, rx: 8, fill: "#7ddec8" } },
    { tag: "rect", attrs: { x: 196, y: 176, width: 36, height: 22, rx: 8, fill: "#f0b429" } },
    { tag: "rect", attrs: { x: 238, y: 176, width: 36, height: 22, rx: 8, fill: "#e23b3b" } }
  ]
}, Rt = {
  id: "plinko",
  name: "弹珠",
  description: "白钉三角阵。球落到倍率槽。娱乐积分，不能兑换，也不能充值。",
  tip: "行数 8 到 16，风险分低中高。落点由服务器决定。",
  howToPlay: "选择注额、行数和风险，然后投放。球沿预定弹跳落下，最终槽位在出手时已经确定。可同时有多颗球在飞，每颗落地时结算。",
  copy: {
    en: {
      name: "Plinko",
      description: "A triangle of white pegs. The ball lands in a multiplier bucket. Play credits only.",
      howToPlay: "Choose a stake, row count, and risk, then drop. The bucket is fixed before the ball moves. Several balls can be in flight; each one settles when it lands.",
      tip: "Rows run from 8 to 16. Risk is low, mid, or high."
    }
  },
  cover: "plinko",
  art: Et,
  renderer: "dom",
  controls: "pointer",
  tags: ["弹珠", "联网"],
  theme: { accent: "#7ddec8", accentInk: "#10211e", glow: "#e23b3b", radius: 16, font: "sans" }
}, Y = 8, Q = 16, R = [10, 20, 50, 100], Pt = ["low", "mid", "high"], dt = [
  1e3,
  162,
  38,
  9,
  3,
  1.5,
  0.5,
  0.2,
  0.1,
  0.2,
  0.5,
  1.5,
  3,
  9,
  38,
  162,
  1e3
];
function ut(n, e) {
  let s = 1;
  for (let t = 1; t <= e; t += 1) s = s * (n - e + t) / t;
  return s;
}
function G(n) {
  const e = n.length - 1, s = 2 ** e;
  let t = 0;
  for (let o = 0; o < n.length; o += 1)
    t += ut(e, o) / s * (n[o] ?? 0);
  return t;
}
function $t(n, e, s, t) {
  const o = n / 2;
  return Array.from({ length: n + 1 }, (a, r) => {
    const c = o === 0 ? 0 : Math.abs(r - o) / o;
    return s * (e / s) ** c ** t;
  });
}
function _t(n) {
  return n >= 100 ? Math.max(1, Math.round(n)) : Math.max(0.1, Math.round(n * 10) / 10);
}
function At(n) {
  const e = n.length - 1, s = n.slice();
  for (let t = 0; t <= e; t += 1) {
    const o = _t(((s[t] ?? 0) + (s[e - t] ?? 0)) / 2);
    s[t] = o, s[e - t] = o;
  }
  return s;
}
function It(n) {
  const e = n / 2, s = [];
  for (let t = 0; t <= n; t += 1) Math.abs(t - e) <= 0.5 && s.push(t);
  return s;
}
function Nt(n, e, s, t) {
  const o = $t(n, e, s, t), a = At(o.map((p) => p * (0.99 / G(o)))), r = It(n);
  let c = a, u = Math.abs(G(c) - 0.99);
  for (let p = -20; p <= 20; p += 1) {
    const y = a.slice(), i = a[r[0] ?? 0] ?? 0, h = Math.max(0.1, Math.round((i + p * 0.1) * 10) / 10);
    for (const b of r) y[b] = h;
    const w = Math.abs(G(y) - 0.99);
    w < u && (u = w, c = y);
  }
  return c;
}
function qt() {
  const n = {
    low: [18, 1.05, 2.2],
    mid: [160, 0.45, 1.65],
    high: [700, 0.2, 1.25]
  }, e = { low: {}, mid: {}, high: {} };
  for (const s of Pt) {
    const t = n[s];
    for (let o = Y; o <= Q; o += 1)
      e[s][o] = Nt(o, t[0], t[1], t[2]);
  }
  return e.high[16] = dt, e;
}
const it = qt();
function Z(n, e) {
  return it[e][n] ?? it.mid[16] ?? dt;
}
function Bt(n) {
  return Number.isInteger(n) && n >= Y && n <= Q;
}
function Ct(n) {
  return n === "low" || n === "mid" || n === "high";
}
function Ht(n) {
  return R.includes(n);
}
function z(n) {
  return n >= 1e3 ? "1kx" : n >= 100 ? `${Math.round(n)}x` : `${n.toFixed(1)}x`;
}
function Ot(n, e) {
  const s = (e - 1) / 2, t = s === 0 ? 0 : Math.abs(n - s) / s, o = 168 - t * 164, a = 52 + t * 26, r = 64 - t * 12;
  return `hsl(${o.toFixed(1)} ${a.toFixed(1)}% ${r.toFixed(1)}%)`;
}
const D = 1e3;
function q() {
  return { credits: D };
}
function Dt(n, e) {
  const s = 2 ** n, t = e() * s;
  let o = 0;
  for (let a = 0; a <= n; a += 1)
    if (o += ut(n, a), t < o) return a;
  return n;
}
function Wt(n, e, s, t, o, a) {
  if (!Ht(e)) return { error: "bad_bet" };
  if (!Bt(s)) return { error: "bad_rows" };
  if (!Ct(t)) return { error: "bad_risk" };
  if (n.credits < e) return { error: "insufficient" };
  const r = Z(s, t), c = typeof a == "number" && Number.isInteger(a) && a >= 0 && a <= s ? a : Dt(s, o), u = r[c] ?? 0, p = Math.round(e * u);
  return n.credits -= e, n.credits += p, { rows: s, risk: t, bet: e, bucket: c, multiplier: u, win: p, credits: n.credits };
}
function Gt(n, e, s) {
  const t = Math.max(0, Math.min(n, e)), o = [];
  for (let a = 0; a < t; a += 1) o.push("R");
  for (let a = 0; a < n - t; a += 1) o.push("L");
  for (let a = o.length - 1; a > 0; a -= 1) {
    const r = Math.floor(s() * (a + 1)), c = o[a];
    o[a] = o[r] ?? "L", o[r] = c ?? "L";
  }
  return o;
}
const K = 0.18, X = 0.2, Ft = 0.92, j = 0.55, ct = 1.05;
function zt(n, e, s) {
  return { x: (n - 1 - e) / 2 + s, y: e + 1 };
}
function ft(n, e) {
  return n + e;
}
function U(n) {
  return n === "R" ? 1 : -1;
}
function J(n, e, s, t) {
  return {
    x: n.x + s * Math.sin(e) * t,
    y: n.y - Math.cos(e) * t / Ft
  };
}
function ht(n, e) {
  let s = 0;
  for (let t = 0; t < e; t += 1) n[t] === "R" && (s += 1);
  return s;
}
function V(n, e, s) {
  const t = s[e] === "R" ? "R" : "L", o = ht(s, e) + 1;
  return { peg: zt(n, e, o), index: o, dir: t };
}
function Kt(n, e, s, t) {
  const o = 1 - t;
  return {
    x: o * o * n.x + 2 * o * t * e.x + t * t * s.x,
    y: o * o * n.y + 2 * o * t * e.y + t * t * s.y
  };
}
function Xt(n, e, s, t, o = K, a = X) {
  const r = Math.max(0, Math.min(n - 1, s)), c = Math.max(0, Math.min(1, t)), u = ft(o, a), p = V(n, r, e), y = U(p.dir), i = c <= 0.62;
  if (c <= 0.5) {
    const v = c / 0.5, P = j + (ct - j) * v;
    return {
      ...J(p.peg, P, y, u),
      hit: i ? { row: r, index: p.index } : null
    };
  }
  const h = J(p.peg, ct, y, u), w = jt(n, e, r, o, a), b = (c - 0.5) / 0.5, M = {
    x: h.x + y * 0.28,
    y: h.y - 0.16
  };
  return {
    ...Kt(h, M, w, b),
    hit: c < 0.58 ? { row: r, index: p.index } : null
  };
}
function jt(n, e, s, t, o) {
  const a = V(n, s, e), r = U(a.dir), u = ht(e, s) + (a.dir === "R" ? 1 : 0);
  if (s + 1 >= n) return { x: u + 0.5, y: n + 1.4 };
  const p = e[s + 1] === "R" ? "R" : "L", y = V(n, s + 1, e), i = U(p), h = ft(t, o), w = J(y.peg, j, i, h);
  return {
    x: (a.peg.x + r * 0.5 + w.x) / 2,
    y: (a.peg.y + y.peg.y) / 2
  };
}
function Ut() {
  wt("plinko", {
    zh: {
      drop: "投放",
      auto: "自动",
      rows: "行数",
      risk: "风险",
      low: "低",
      mid: "中",
      high: "高",
      normal: "普通",
      fast: "快速",
      turbo: "极速",
      won: "赢得 {n}",
      broke: "积分不够了",
      badBet: "注额不合法",
      place: "请下注",
      server: "服务器开奖",
      local: "本地开奖（这局连不上服务器）",
      pending: "连接中…",
      note: "娱乐积分，不能兑换，也不能充值。"
    },
    en: {
      drop: "Drop",
      auto: "Auto",
      rows: "Rows",
      risk: "Risk",
      low: "Low",
      mid: "Mid",
      high: "High",
      normal: "Normal",
      fast: "Fast",
      turbo: "Turbo",
      won: "Won {n}",
      broke: "Not enough credits",
      badBet: "That bet is not allowed",
      place: "Place a bet",
      server: "Server draw",
      local: "Local draw (server unreachable)",
      pending: "Connecting…",
      note: "Play credits only. Not redeemable and not for sale."
    }
  });
}
const Jt = {}, F = "wgf:slots-wallet", pt = "wgf:slots-token", Vt = "wgf:session";
function Yt(n) {
  Ut();
  let e = null;
  const s = [];
  let t = null, o = null, a = q(), r = D, c = 20, u = 16, p = "high", y = "normal", i = !1, h = "pending", w = !1, b = "ready", M = -1, v = -1, P = 0;
  const E = [], B = /* @__PURE__ */ new Set();
  let C = null, tt = !1, et = 0, I = () => {
  };
  function H(f, l) {
    return Mt(e?.store.getState().ui.locale ?? "zh", f, l);
  }
  function S() {
    if (!t) return;
    const f = t.querySelector("[data-credits]"), l = t.querySelector("[data-amount]"), m = t.querySelector("[data-row-label]"), x = t.querySelector("[data-demo]"), _ = t.querySelector("[data-source]");
    f && (f.textContent = String(r)), l && (l.textContent = String(c)), m && (m.textContent = String(u)), x && (x.hidden = h !== "local"), _ && (_.textContent = H(h === "server" ? "plinko.server" : h === "local" ? "plinko.local" : "plinko.pending")), t.dataset.rows = String(u), t.dataset.risk = p, t.dataset.pace = y, t.dataset.pegs = String(u + 2), t.dataset.buckets = String(u + 1), M >= 0 && (t.dataset.bucket = String(M)), v >= 0 && (t.dataset.landed = String(v)), t.dataset.round = o && o.inflight > 0 ? "busy" : "open";
    const k = R.indexOf(c), d = t.querySelector("[data-bet-dec]"), A = t.querySelector("[data-bet-inc]");
    d && (d.disabled = k <= 0), A && (A.disabled = k >= R.length - 1), t.querySelectorAll("[data-bet]").forEach((g) => {
      g.classList.toggle("is-bet", Number(g.dataset.bet) === c);
    }), t.querySelectorAll("[data-speed]").forEach((g) => {
      g.classList.toggle("is-on", g.dataset.speed === y);
    }), t.querySelectorAll("[data-risk-pick]").forEach((g) => {
      g.classList.toggle("is-on", g.dataset.riskPick === p);
    });
    const L = t.querySelector("[data-drop]");
    L && (L.disabled = !w || b !== "running" || r < c);
    const $ = t.querySelector("[data-auto]");
    $ && $.setAttribute("aria-pressed", i ? "true" : "false");
    const O = t.querySelector("[data-history]");
    O && O.replaceChildren(
      ...E.slice(0, 8).map((g) => {
        const rt = document.createElement("span");
        return rt.textContent = z(g), rt;
      })
    ), o?.setLayout(u, p), o?.setSpeed(y), t.dataset.seq = String(et), mt(t);
  }
  function N() {
    e && St(e.store, {
      id: n.manifest.id,
      status: b,
      score: Math.max(0, r - D),
      highScore: Math.max(0, r),
      message: "",
      detail: H(h === "server" ? "plinko.server" : "plinko.local"),
      credits: r
    });
  }
  function nt() {
    h === "local" && localStorage.setItem(F, JSON.stringify(a));
  }
  function st() {
    try {
      const f = localStorage.getItem(F);
      if (!f) return q();
      const l = JSON.parse(f);
      return !l || typeof l.credits != "number" ? q() : { credits: Math.max(0, Math.floor(l.credits)) };
    } catch {
      return q();
    }
  }
  async function ot() {
    if (!await se()) {
      h = "local", a = st(), r = a.credits, w = !0, N(), S();
      return;
    }
    try {
      const l = await lt().post("/api/plinko/session", {});
      l.walletToken && localStorage.setItem(pt, l.walletToken), tt = l.demo === !0, h = "server", a = { credits: l.credits }, r = l.credits;
    } catch {
      h = "local", a = st(), r = a.credits;
    }
    w = !0, N(), S();
  }
  async function W() {
    if (!w || b !== "running" || r < c) return;
    const f = te();
    if (B.has(f)) return;
    const l = { bet: c, rows: u, risk: p }, m = at() ? C : null;
    let x;
    if (h === "server")
      try {
        const d = await lt().post("/api/plinko/drop", {
          bet: l.bet,
          spinId: f,
          rows: l.rows,
          risk: l.risk,
          ...m !== null ? { bucket: m } : {}
        });
        x = d, a = { credits: d.credits };
      } catch {
        return;
      }
    else {
      const d = Wt(
        a,
        l.bet,
        l.rows,
        l.risk,
        Math.random,
        m
      );
      if ("error" in d) return;
      x = d, nt();
    }
    B.add(f), r -= l.bet, M = x.bucket;
    const k = {
      path: Gt(l.rows, x.bucket, Math.random),
      rows: l.rows,
      bet: l.bet,
      bucket: x.bucket,
      multiplier: x.multiplier,
      win: x.win
    };
    o?.launch(k), N(), S();
  }
  function gt(f) {
    r += f.win, v = f.bucket, et += 1, E.unshift(f.multiplier), E.length > 8 && (E.length = 8), r < R[0] && (!o || o.inflight === 0) && (i = !1, b = "over"), N(), S();
  }
  function at() {
    return Qt() && (h === "local" || tt);
  }
  function mt(f) {
    const l = f.querySelector("[data-debug]");
    l && (l.hidden = !at());
    const m = f.querySelector("[data-debug-result]");
    if (!m) return;
    const x = `${u}:${p}`;
    if (m.dataset.key === x) return;
    const _ = Z(u, p), k = C, d = document.createElement("option");
    d.value = "random", d.textContent = "随机";
    const A = [d];
    for (let L = 0; L <= u; L += 1) {
      const $ = document.createElement("option");
      $.value = String(L), $.textContent = `${L} ${z(_[L] ?? 0)}`, A.push($);
    }
    m.replaceChildren(...A), m.dataset.key = x, k !== null && k <= u ? (C = k, m.value = String(k)) : (C = null, m.value = "random");
  }
  return vt(n.manifest, {
    async onPreload(f, l) {
      await f.preload([], l);
    },
    async onMount(f) {
      e = f, f.container.setAttribute("data-wgf-game", n.gameAttr), t = document.createElement("div"), t.className = n.extraClass ? `plinko ${n.extraClass}` : "plinko", t.innerHTML = Zt(n.title);
      const l = t.querySelector("[data-board]");
      l instanceof HTMLElement && (o = n.createBoard(l), o.onLand = gt, o.setLayout(u, p)), f.container.appendChild(t);
      const m = t;
      m.addEventListener("change", (k) => {
        const d = k.target;
        !(d instanceof HTMLSelectElement) || !d.matches("[data-debug-result]") || (C = d.value === "random" ? null : Number(d.value));
      }), m.addEventListener("click", (k) => {
        const d = k.target;
        if (!(d instanceof Element)) return;
        if (d.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        const A = d.closest("[data-bet]"), L = A instanceof HTMLElement ? Number(A.dataset.bet) : Number.NaN;
        if (R.includes(L)) {
          c = L, m.classList.remove("is-bets"), S();
          return;
        }
        if (d.closest("[data-bet-dec]")) {
          const g = R[R.indexOf(c) - 1];
          g !== void 0 && (c = g), m.classList.remove("is-bets"), S();
          return;
        }
        if (d.closest("[data-bet-inc]")) {
          const g = R[R.indexOf(c) + 1];
          g !== void 0 && (c = g), m.classList.remove("is-bets"), S();
          return;
        }
        if (d.closest("[data-amount-bar]")) {
          m.classList.toggle("is-bets");
          return;
        }
        if (m.classList.contains("is-bets") && !d.closest("[data-bet-ui]") && m.classList.remove("is-bets"), d.closest("[data-row-dec]") && (!o || o.inflight === 0)) {
          u > Y && (u -= 1), S(), I();
          return;
        }
        if (d.closest("[data-row-inc]") && (!o || o.inflight === 0)) {
          u < Q && (u += 1), S(), I();
          return;
        }
        const $ = d.closest("[data-risk-pick]");
        if ($ instanceof HTMLElement && (!o || o.inflight === 0)) {
          const g = $.dataset.riskPick;
          (g === "low" || g === "mid" || g === "high") && (p = g), S();
          return;
        }
        const O = d.closest("[data-speed]");
        if (O instanceof HTMLElement) {
          const g = O.dataset.speed;
          (g === "normal" || g === "fast" || g === "turbo") && (y = g), S();
          return;
        }
        if (d.closest("[data-auto]")) {
          i = !i, P = 0, S(), i && W();
          return;
        }
        d.closest("[data-drop]") && W();
      }), I = () => {
        const k = t?.querySelector("[data-board]");
        !(k instanceof HTMLElement) || !o || o.resize(k.clientWidth, k.clientHeight);
      }, I();
      const x = new ResizeObserver(() => I()), _ = t.querySelector("[data-board]");
      _ && x.observe(_), s.push(() => x.disconnect()), s.push(xt(() => I())), s.push(
        f.loop.onUpdate((k) => {
          o?.update(k), i && b === "running" && (!o || o.inflight < 6) && (P -= k, P <= 0 && r >= c && (P = y === "turbo" ? 0.12 : y === "fast" ? 0.28 : 0.45, W()));
        })
      ), f.events.on("game:start", () => {
        b === "ready" && (b = "running", N(), S());
      }), f.events.on("game:restart", () => {
        a = h === "local" ? q() : a, h === "local" && (localStorage.removeItem(F), a = q(), nt()), r = h === "server" ? a.credits : D, h === "server" ? ot() : r = D, i = !1, E.length = 0, M = -1, v = -1, b = "running", N(), S();
      }), S(), ot();
    },
    onDestroy() {
      for (const f of s) f();
      s.length = 0, o?.destroy(), o = null, t?.remove(), t = null, e = null;
    }
  });
}
function Qt() {
  try {
    const n = new URL(location.href);
    if (n.searchParams.get("debug") === "1") return !0;
    const e = n.hash, s = e.indexOf("?");
    if (s >= 0 && new URLSearchParams(e.slice(s + 1)).get("debug") === "1") return !0;
  } catch {
    return !1;
  }
  return !1;
}
function Zt(n) {
  const e = R.map(
    (o) => `<button type="button" data-bet="${o}">${o}</button>`
  ).join(""), s = ["normal", "fast", "turbo"].map(
    (o) => `<button type="button" data-speed="${o}">${o === "normal" ? "普通" : o === "fast" ? "快速" : "极速"}</button>`
  ).join(""), t = ["low", "mid", "high"].map(
    (o) => `<button type="button" data-risk-pick="${o}">${o === "low" ? "低" : o === "mid" ? "中" : "高"}</button>`
  ).join("");
  return `
    <header class="plinko-top">
      <button type="button" class="plinko-menu" data-lobby-menu aria-label="菜单"></button>
      <div class="plinko-brand">
        <strong>${n}</strong>
        <span class="plinko-demo" data-demo hidden>试玩</span>
      </div>
      <div class="plinko-balance"><span class="plinko-coin" aria-hidden="true"></span><strong data-credits>1000</strong></div>
      <span class="plinko-source" data-source></span>
    </header>
    <div class="plinko-side">
      <div class="plinko-betui" data-bet-ui>
        <div class="plinko-betrow">
          <button type="button" class="plinko-step" data-bet-dec aria-label="减少注额">−</button>
          <button type="button" class="plinko-value" data-amount-bar aria-label="选择注额"><strong data-amount>20</strong></button>
          <button type="button" class="plinko-step" data-bet-inc aria-label="增加注额">+</button>
        </div>
        <div class="plinko-betlist" data-bet-sheet>${e}</div>
      </div>
      <div class="plinko-field">
        <span>行数</span>
        <div class="plinko-stepper">
          <button type="button" data-row-dec aria-label="减少行数">−</button>
          <strong data-row-label>16</strong>
          <button type="button" data-row-inc aria-label="增加行数">+</button>
        </div>
      </div>
      <div class="plinko-field">
        <span>风险</span>
        <div class="plinko-seg">${t}</div>
      </div>
        <div class="plinko-history" data-history></div>
      <label class="plinko-debug" data-debug hidden>
        <span>指定结果</span>
        <select data-debug-result></select>
      </label>
    </div>
    <div class="plinko-stage">
      <div class="plinko-speed">${s}</div>
      <div class="plinko-board" data-board></div>
    </div>
    <div class="plinko-dock">
      <button type="button" class="plinko-drop" data-drop disabled>投放</button>
      <button type="button" class="plinko-auto" data-auto aria-label="自动"></button>
    </div>
  `;
}
function te() {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function lt() {
  const n = new Tt(), e = ee(), s = ne();
  if (e) n.set({ accessToken: e });
  else if (s?.accessToken && !s.accessToken.startsWith("local."))
    n.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const t = localStorage.getItem(pt);
    t?.startsWith("v1w.") && n.set({ accessToken: t });
  }
  return new Lt({ baseUrl: bt(), tokens: n, timeoutMs: 2500 });
}
function ee() {
  try {
    const n = sessionStorage.getItem("wgf:launch-token");
    return n && n.length >= 8 ? n : null;
  } catch {
    return null;
  }
}
function ne() {
  try {
    const n = localStorage.getItem(Vt);
    return n ? JSON.parse(n) : null;
  } catch {
    return null;
  }
}
function bt() {
  return Jt?.VITE_API_BASE || "http://127.0.0.1:8787";
}
async function se() {
  try {
    return (await fetch(`${bt()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
const oe = {
  normal: 0.34,
  fast: 0.16,
  turbo: 0.07
};
class ae {
  constructor(e) {
    T(this, "canvas");
    T(this, "ctx");
    T(this, "rows", 16);
    T(this, "risk", "high");
    T(this, "speed", "normal");
    T(this, "width", 1);
    T(this, "height", 1);
    T(this, "balls", []);
    T(this, "pulses", /* @__PURE__ */ new Map());
    T(this, "pegPulses", /* @__PURE__ */ new Map());
    T(this, "nextId", 1);
    T(this, "onLand", null);
    const s = document.createElement("canvas");
    s.className = "plinko-canvas";
    const t = s.getContext("2d");
    if (!t) throw new Error("canvas");
    this.canvas = s, this.ctx = t, e.appendChild(s);
  }
  setLayout(e, s) {
    this.rows = e, this.risk = s;
  }
  setSpeed(e) {
    this.speed = e;
  }
  resize(e, s) {
    this.width = Math.max(1, e), this.height = Math.max(1, s);
    const t = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(this.width * t), this.canvas.height = Math.round(this.height * t), this.canvas.style.width = `${this.width}px`, this.canvas.style.height = `${this.height}px`, this.ctx.setTransform(t, 0, 0, t, 0, 0), this.draw();
  }
  launch(e) {
    this.balls.push({ ...e, id: this.nextId, step: 0, u: 0, landed: !1, age: 0 }), this.nextId += 1;
  }
  get inflight() {
    return this.balls.filter((e) => !e.landed).length;
  }
  update(e) {
    const s = oe[this.speed];
    for (const t of this.balls) {
      if (t.landed) {
        t.age += e;
        continue;
      }
      for (t.u += e / s; t.u >= 1 && t.step < t.rows; )
        t.u -= 1, t.step += 1;
      t.step >= t.rows && (t.landed = !0, t.u = 1, t.age = 0, this.pulses.set(t.bucket, 0.45), this.onLand?.(t));
    }
    this.balls = this.balls.filter((t) => !t.landed || t.age < 0.45);
    for (const [t, o] of this.pulses) {
      const a = o - e;
      a <= 0 ? this.pulses.delete(t) : this.pulses.set(t, a);
    }
    for (const [t, o] of this.pegPulses) {
      const a = o - e;
      a <= 0 ? this.pegPulses.delete(t) : this.pegPulses.set(t, a);
    }
    this.draw();
  }
  destroy() {
    this.canvas.remove();
  }
  metrics() {
    const t = Math.max(22, Math.min(36, this.height * 0.08)), o = this.height - t - 8, a = (o - 18 - 8) / this.rows;
    return { pad: 14, spacing: (this.width - 28) / (this.rows + 1), top: 18, rowGap: a, bucketTop: o, bucketH: t };
  }
  pegX(e, s, t, o) {
    const a = 3 + e, r = (this.rows + 2 - a) / 2 * o;
    return t + r + s * o;
  }
  draw() {
    const e = this.ctx, { pad: s, spacing: t, top: o, rowGap: a, bucketTop: r, bucketH: c } = this.metrics();
    e.clearRect(0, 0, this.width, this.height), e.fillStyle = "#272b2c", e.fillRect(0, 0, this.width, this.height);
    const u = Z(this.rows, this.risk), p = t * K, y = t * X;
    for (let i = 0; i < this.rows; i += 1) {
      const h = 3 + i, w = o + a * (i + 1);
      for (let b = 0; b < h; b += 1) {
        const M = this.pegX(i, b, s, t), v = this.pegPulses.get(`${i}:${b}`) ?? 0;
        e.beginPath(), e.fillStyle = v > 0 ? "#fff4c2" : "#f4f7f8", e.arc(M, w, p * (v > 0 ? 1.45 : 1), 0, Math.PI * 2), e.fill();
      }
    }
    for (let i = 0; i < u.length; i += 1) {
      const h = this.pegX(this.rows - 1, i, s, t), w = this.pegX(this.rows - 1, i + 1, s, t), b = this.pulses.get(i) ?? 0, M = b > 0 ? 1 + b / 0.45 * 0.12 : 1, v = (w - h - 3) * M, P = (h + w) / 2 - v / 2, E = c * M, B = r - (E - c) / 2;
      re(e, P, B, v, E, Math.min(8, E / 2)), e.fillStyle = Ot(i, u.length), e.fill(), e.fillStyle = "#1a1c1d", e.font = `700 ${Math.max(8, Math.min(11, v * 0.42))}px Outfit, sans-serif`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(z(u[i] ?? 0), P + v / 2, B + E / 2);
    }
    for (const i of this.balls) {
      const h = Math.min(i.step, Math.max(0, i.rows - 1)), w = i.landed || i.step >= i.rows ? 1 : i.u, b = Xt(i.rows, i.path, h, w, K, X);
      b.hit && this.pegPulses.set(`${b.hit.row}:${b.hit.index}`, 0.22);
      const M = s + b.x * t, v = o + b.y * a;
      e.beginPath(), e.fillStyle = "#f7f4ea", e.arc(M, v, y, 0, Math.PI * 2), e.fill(), e.strokeStyle = "rgba(0,0,0,0.35)", e.lineWidth = 1, e.stroke();
    }
  }
}
function re(n, e, s, t, o, a) {
  const r = Math.max(0, Math.min(a, t / 2, o / 2));
  n.beginPath(), n.moveTo(e + r, s), n.arcTo(e + t, s, e + t, s + o, r), n.arcTo(e + t, s + o, e, s + o, r), n.arcTo(e, s + o, e, s, r), n.arcTo(e, s, e + t, s, r), n.closePath();
}
function de() {
  return Yt({
    manifest: Rt,
    title: "弹珠",
    gameAttr: "wgf-game:plinko",
    createBoard: (n) => new ae(n)
  });
}
export {
  de as createGame,
  Rt as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
