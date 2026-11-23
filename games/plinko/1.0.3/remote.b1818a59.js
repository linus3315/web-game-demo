var kt = Object.defineProperty;
var yt = (n, e, s) => e in n ? kt(n, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[e] = s;
var E = (n, e, s) => yt(n, typeof e != "symbol" ? e + "" : e, s);
import { registerStrings as xt, defineGame as wt, bindVisualViewport as vt, patchGame as St, t as Mt } from "@wgf/core";
import { TokenStore as Tt, HttpClient as Lt } from "@wgf/net";
const Rt = {
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
}, Pt = {
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
  art: Rt,
  renderer: "dom",
  controls: "pointer",
  tags: ["弹珠", "联网"],
  theme: { accent: "#7ddec8", accentInk: "#10211e", glow: "#e23b3b", radius: 16, font: "sans" }
}, Z = 8, tt = 16, N = [10, 20, 50, 100], Et = ["low", "mid", "high"], rt = [
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
function it(n, e) {
  let s = 1;
  for (let t = 1; t <= e; t += 1) s = s * (n - e + t) / t;
  return s;
}
function X(n) {
  const e = n.length - 1, s = 2 ** e;
  let t = 0;
  for (let o = 0; o < n.length; o += 1)
    t += it(e, o) / s * (n[o] ?? 0);
  return t;
}
function qt(n, e, s, t) {
  const o = n / 2;
  return Array.from({ length: n + 1 }, (a, r) => {
    const c = o === 0 ? 0 : Math.abs(r - o) / o;
    return s * (e / s) ** c ** t;
  });
}
function It(n) {
  return n >= 100 ? Math.max(1, Math.round(n)) : Math.max(0.1, Math.round(n * 10) / 10);
}
function $t(n) {
  const e = n.length - 1, s = n.slice();
  for (let t = 0; t <= e; t += 1) {
    const o = It(((s[t] ?? 0) + (s[e - t] ?? 0)) / 2);
    s[t] = o, s[e - t] = o;
  }
  return s;
}
function At(n) {
  const e = n / 2, s = [];
  for (let t = 0; t <= n; t += 1) Math.abs(t - e) <= 0.5 && s.push(t);
  return s;
}
function _t(n, e, s, t) {
  const o = qt(n, e, s, t), a = $t(o.map((f) => f * (0.99 / X(o)))), r = At(n);
  let c = a, i = Math.abs(X(c) - 0.99);
  for (let f = -20; f <= 20; f += 1) {
    const k = a.slice(), l = a[r[0] ?? 0] ?? 0, g = Math.max(0.1, Math.round((l + f * 0.1) * 10) / 10);
    for (const d of r) k[d] = g;
    const T = Math.abs(X(k) - 0.99);
    T < i && (i = T, c = k);
  }
  return c;
}
function Bt() {
  const n = {
    low: [18, 1.05, 2.2],
    mid: [160, 0.45, 1.65],
    high: [700, 0.2, 1.25]
  }, e = { low: {}, mid: {}, high: {} };
  for (const s of Et) {
    const t = n[s];
    for (let o = Z; o <= tt; o += 1)
      e[s][o] = _t(o, t[0], t[1], t[2]);
  }
  return e.high[16] = rt, e;
}
const ot = Bt();
function et(n, e) {
  return ot[e][n] ?? ot.mid[16] ?? rt;
}
function Ct(n) {
  return Number.isInteger(n) && n >= Z && n <= tt;
}
function Nt(n) {
  return n === "low" || n === "mid" || n === "high";
}
function Ht(n) {
  return N.includes(n);
}
function J(n) {
  return n >= 1e3 ? "1kx" : n >= 100 ? `${Math.round(n)}x` : `${n.toFixed(1)}x`;
}
function Ot(n, e) {
  const s = (e - 1) / 2, t = s === 0 ? 0 : Math.abs(n - s) / s, o = 168 - t * 164, a = 52 + t * 26, r = 64 - t * 12;
  return `hsl(${o.toFixed(1)} ${a.toFixed(1)}% ${r.toFixed(1)}%)`;
}
const U = 1e3;
function G() {
  return { credits: U };
}
function Wt(n, e) {
  const s = 2 ** n, t = e() * s;
  let o = 0;
  for (let a = 0; a <= n; a += 1)
    if (o += it(n, a), t < o) return a;
  return n;
}
function Dt(n, e, s, t, o, a) {
  if (!Ht(e)) return { error: "bad_bet" };
  if (!Ct(s)) return { error: "bad_rows" };
  if (!Nt(t)) return { error: "bad_risk" };
  if (n.credits < e) return { error: "insufficient" };
  const r = et(s, t), c = typeof a == "number" && Number.isInteger(a) && a >= 0 && a <= s ? a : Wt(s, o), i = r[c] ?? 0, f = Math.round(e * i);
  return n.credits -= e, n.credits += f, { rows: s, risk: t, bet: e, bucket: c, multiplier: i, win: f, credits: n.credits };
}
const Gt = 0.63;
function Ft(n, e, s) {
  let t = Math.max(0, Math.min(n, Math.floor(e))), o = n - t;
  const a = [];
  let r = null;
  for (let c = 0; c < n; c += 1) {
    let i;
    if (t <= 0) i = "L";
    else if (o <= 0) i = "R";
    else if (r === null) i = s() < t / (t + o) ? "R" : "L";
    else {
      const f = r === "R" ? "L" : "R";
      i = (s() < Gt ? r : f) === "R" ? t > 0 ? "R" : "L" : o > 0 ? "L" : "R";
    }
    a.push(i), i === "R" ? t -= 1 : o -= 1, r = i;
  }
  return a;
}
const V = 0.13, Y = 0.2, Q = 0.92;
function zt(n, e) {
  const s = [];
  let t = 1, o = 0;
  for (const a of n) {
    const r = a === "R" ? 1 : -1, c = 0.75 + e() * 0.55, i = 0.8 + e() * 0.42;
    t = t * 0.45 + i * 0.55, o = Math.max(-0.75, Math.min(0.75, o * 0.5 + r * (0.28 + e() * 0.35)));
    const f = e(), k = f < 0.08 ? "double" : f < 0.18 ? "skim" : "none";
    s.push({ hop: c, pace: t, flourish: k, vx: o });
  }
  return s;
}
function Kt(n, e, s) {
  return { x: (n - 1 - e) / 2 + s, y: e + 1 };
}
function ct(n, e) {
  return n + e;
}
function lt(n) {
  return n === "R" ? 1 : -1;
}
function ut(n, e, s, t) {
  return {
    x: n.x + s * Math.sin(e) * t,
    y: n.y - Math.cos(e) * t / Q
  };
}
function dt(n, e) {
  let s = 0;
  for (let t = 0; t < e; t += 1) n[t] === "R" && (s += 1);
  return s;
}
function ht(n, e, s) {
  const t = s[e] === "R" ? "R" : "L", o = dt(s, e) + 1;
  return { peg: Kt(n, e, o), index: o, dir: t };
}
function Ut(n, e) {
  const s = n.x - e.x, t = (n.y - e.y) * Q, o = Math.hypot(s, t) || 1;
  return { x: s / o, y: t / o / Q };
}
const ft = 1.02;
function Xt(n, e, s, t, o = V, a = Y, r) {
  const c = Math.max(0, Math.min(n - 1, s)), i = Math.max(0, Math.min(1, t)), f = ct(o, a), k = ht(n, c, e), l = lt(k.dir), g = r?.flourish ?? "none", d = (r?.hop ?? 1) * (1 - c * 0.012) * (g === "skim" ? 0.7 : 1), R = r?.vx ?? 0, b = ut(k.peg, ft, l, f), L = { x: b.x, y: b.y - 0.42 }, P = Ut(b, k.peg), q = {
    x: b.x + P.x * 0.16 * d + l * 0.04 * d + R * 0.012,
    y: b.y - 0.34 * d
  }, I = { x: k.peg.x + l * 0.55, y: k.peg.y + 0.46 }, F = jt(n, e, c, o, a), W = { row: c, index: k.index }, $ = 0.24, A = g === "double" ? 0.46 : $;
  if (i <= $) {
    const x = i / $, S = x * x;
    return {
      x: L.x + (b.x - L.x) * S,
      y: L.y + (b.y - L.y) * S,
      hit: x > 0.84 ? W : null,
      squash: x > 0.84 ? 0.84 : 1,
      pop: 0
    };
  }
  if (g === "double" && i <= A) {
    const x = (i - $) / (A - $), S = Math.sin(Math.PI * x);
    return {
      x: b.x + P.x * 0.08 * d * S,
      y: b.y - 0.14 * d * S,
      hit: x < 0.14 || x > 0.86 ? W : null,
      squash: x < 0.14 || x > 0.86 ? 0.84 : 1,
      pop: S * 0.6
    };
  }
  if (i <= A + 0.2) {
    const x = (i - A) / 0.2, S = Math.sin(x * Math.PI / 2);
    return {
      x: b.x + (q.x - b.x) * S,
      y: b.y + (q.y - b.y) * S,
      hit: x < 0.12 ? W : null,
      squash: x < 0.12 ? 0.84 : 1,
      pop: S
    };
  }
  const w = A + 0.2, _ = w + (1 - w) * 0.4;
  if (i <= _) {
    const x = (i - w) / (_ - w), S = x * x;
    return {
      x: q.x + (I.x - q.x) * S,
      y: q.y + (I.y - q.y) * S,
      hit: null,
      squash: 1,
      pop: 1 - x * 0.35
    };
  }
  const D = (i - _) / (1 - _), z = D * D;
  return {
    x: I.x + (F.x - I.x) * z,
    y: I.y + (F.y - I.y) * z,
    hit: null,
    squash: 1,
    pop: 0.65 * (1 - D)
  };
}
function jt(n, e, s, t, o) {
  const r = dt(e, s) + (e[s] === "R" ? 1 : 0);
  if (s + 1 >= n) return { x: r + 0.5, y: n + 1.35 };
  const c = ht(n, s + 1, e), i = ut(c.peg, ft, lt(c.dir), ct(t, o));
  return { x: i.x, y: i.y - 0.5 };
}
function Jt() {
  xt("plinko", {
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
const Vt = {}, j = "wgf:slots-wallet", pt = "wgf:slots-token", Yt = "wgf:session";
function Qt(n) {
  Jt();
  let e = null;
  const s = [];
  let t = null, o = null, a = G(), r = U, c = 20, i = 16, f = "high", k = "normal", l = !1, g = "pending", T = !1, d = "ready", R = -1, b = -1, L = 0;
  const P = [], q = /* @__PURE__ */ new Set();
  let I = null, F = !1, W = 0, $ = () => {
  };
  function A(p, u) {
    return Mt(e?.store.getState().ui.locale ?? "zh", p, u);
  }
  function w() {
    if (!t) return;
    const p = t.querySelector("[data-credits]"), u = t.querySelector("[data-amount]"), y = t.querySelector("[data-row-label]"), M = t.querySelector("[data-demo]"), C = t.querySelector("[data-source]");
    p && (p.textContent = String(r)), u && (u.textContent = String(c)), y && (y.textContent = String(i)), M && (M.hidden = g !== "local"), C && (C.textContent = A(g === "server" ? "plinko.server" : g === "local" ? "plinko.local" : "plinko.pending")), t.dataset.rows = String(i), t.dataset.risk = f, t.dataset.pace = k, t.dataset.pegs = String(i + 2), t.dataset.buckets = String(i + 1), R >= 0 && (t.dataset.bucket = String(R)), b >= 0 && (t.dataset.landed = String(b)), t.dataset.round = o && o.inflight > 0 ? "busy" : "open";
    const v = N.indexOf(c), h = t.querySelector("[data-bet-dec]"), O = t.querySelector("[data-bet-inc]");
    h && (h.disabled = v <= 0), O && (O.disabled = v >= N.length - 1), t.querySelectorAll("[data-bet]").forEach((m) => {
      m.classList.toggle("is-bet", Number(m.dataset.bet) === c);
    }), t.querySelectorAll("[data-speed]").forEach((m) => {
      m.classList.toggle("is-on", m.dataset.speed === k);
    }), t.querySelectorAll("[data-risk-pick]").forEach((m) => {
      m.classList.toggle("is-on", m.dataset.riskPick === f);
    });
    const B = t.querySelector("[data-drop]");
    B && (B.disabled = !T || d !== "running" || r < c);
    const H = t.querySelector("[data-auto]");
    H && H.setAttribute("aria-pressed", l ? "true" : "false");
    const K = t.querySelector("[data-history]");
    K && K.replaceChildren(
      ...P.slice(0, 8).map((m) => {
        const st = document.createElement("span");
        return st.textContent = J(m), st;
      })
    ), o?.setLayout(i, f), o?.setSpeed(k), t.dataset.seq = String(W), mt(t);
  }
  function _() {
    e && St(e.store, {
      id: n.manifest.id,
      status: d,
      score: Math.max(0, r - U),
      highScore: Math.max(0, r),
      message: "",
      detail: A(g === "server" ? "plinko.server" : "plinko.local"),
      credits: r
    });
  }
  function D() {
    g === "local" && localStorage.setItem(j, JSON.stringify(a));
  }
  function z() {
    try {
      const p = localStorage.getItem(j);
      if (!p) return G();
      const u = JSON.parse(p);
      return !u || typeof u.credits != "number" ? G() : { credits: Math.max(0, Math.floor(u.credits)) };
    } catch {
      return G();
    }
  }
  async function x() {
    if (!await oe()) {
      g = "local", a = z(), r = a.credits, T = !0, _(), w();
      return;
    }
    try {
      const u = await at().post("/api/plinko/session", {});
      u.walletToken && localStorage.setItem(pt, u.walletToken), F = u.demo === !0, g = "server", a = { credits: u.credits }, r = u.credits;
    } catch {
      g = "local", a = z(), r = a.credits;
    }
    T = !0, _(), w();
  }
  async function S() {
    if (!T || d !== "running" || r < c) return;
    const p = ee();
    if (q.has(p)) return;
    const u = { bet: c, rows: i, risk: f }, y = nt() ? I : null;
    let M;
    if (g === "server")
      try {
        const h = await at().post("/api/plinko/drop", {
          bet: u.bet,
          spinId: p,
          rows: u.rows,
          risk: u.risk,
          ...y !== null ? { bucket: y } : {}
        });
        M = h, a = { credits: h.credits };
      } catch {
        return;
      }
    else {
      const h = Dt(
        a,
        u.bet,
        u.rows,
        u.risk,
        Math.random,
        y
      );
      if ("error" in h) return;
      M = h, D();
    }
    q.add(p), r -= u.bet, R = M.bucket;
    const C = Ft(u.rows, M.bucket, Math.random), v = {
      path: C,
      rows: u.rows,
      bet: u.bet,
      bucket: M.bucket,
      multiplier: M.multiplier,
      win: M.win,
      motion: zt(C, Math.random)
    };
    o?.launch(v), _(), w();
  }
  function gt(p) {
    r += p.win, b = p.bucket, W += 1, P.unshift(p.multiplier), P.length > 8 && (P.length = 8), r < N[0] && (!o || o.inflight === 0) && (l = !1, d = "over"), _(), w();
  }
  function nt() {
    return Zt() && (g === "local" || F);
  }
  function mt(p) {
    const u = p.querySelector("[data-debug]");
    u && (u.hidden = !nt());
    const y = p.querySelector("[data-debug-result]");
    if (!y) return;
    const M = `${i}:${f}`;
    if (y.dataset.key === M) return;
    const C = et(i, f), v = I, h = document.createElement("option");
    h.value = "random", h.textContent = "随机";
    const O = [h];
    for (let B = 0; B <= i; B += 1) {
      const H = document.createElement("option");
      H.value = String(B), H.textContent = `${B} ${J(C[B] ?? 0)}`, O.push(H);
    }
    y.replaceChildren(...O), y.dataset.key = M, v !== null && v <= i ? (I = v, y.value = String(v)) : (I = null, y.value = "random");
  }
  return wt(n.manifest, {
    async onPreload(p, u) {
      await p.preload([], u);
    },
    async onMount(p) {
      e = p, p.container.setAttribute("data-wgf-game", n.gameAttr), t = document.createElement("div"), t.className = n.extraClass ? `plinko ${n.extraClass}` : "plinko", t.innerHTML = te(n.title);
      const u = t.querySelector("[data-board]");
      u instanceof HTMLElement && (o = n.createBoard(u), o.onLand = gt, o.setLayout(i, f)), p.container.appendChild(t);
      const y = t;
      y.addEventListener("change", (v) => {
        const h = v.target;
        !(h instanceof HTMLSelectElement) || !h.matches("[data-debug-result]") || (I = h.value === "random" ? null : Number(h.value));
      }), y.addEventListener("click", (v) => {
        const h = v.target;
        if (!(h instanceof Element)) return;
        if (h.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        const O = h.closest("[data-bet]"), B = O instanceof HTMLElement ? Number(O.dataset.bet) : Number.NaN;
        if (N.includes(B)) {
          c = B, y.classList.remove("is-bets"), w();
          return;
        }
        if (h.closest("[data-bet-dec]")) {
          const m = N[N.indexOf(c) - 1];
          m !== void 0 && (c = m), y.classList.remove("is-bets"), w();
          return;
        }
        if (h.closest("[data-bet-inc]")) {
          const m = N[N.indexOf(c) + 1];
          m !== void 0 && (c = m), y.classList.remove("is-bets"), w();
          return;
        }
        if (h.closest("[data-amount-bar]")) {
          y.classList.toggle("is-bets");
          return;
        }
        if (y.classList.contains("is-bets") && !h.closest("[data-bet-ui]") && y.classList.remove("is-bets"), h.closest("[data-row-dec]") && (!o || o.inflight === 0)) {
          i > Z && (i -= 1), w(), $();
          return;
        }
        if (h.closest("[data-row-inc]") && (!o || o.inflight === 0)) {
          i < tt && (i += 1), w(), $();
          return;
        }
        const H = h.closest("[data-risk-pick]");
        if (H instanceof HTMLElement && (!o || o.inflight === 0)) {
          const m = H.dataset.riskPick;
          (m === "low" || m === "mid" || m === "high") && (f = m), w();
          return;
        }
        const K = h.closest("[data-speed]");
        if (K instanceof HTMLElement) {
          const m = K.dataset.speed;
          (m === "normal" || m === "fast" || m === "turbo") && (k = m), w();
          return;
        }
        if (h.closest("[data-auto]")) {
          l = !l, L = 0, w(), l && S();
          return;
        }
        h.closest("[data-drop]") && S();
      }), $ = () => {
        const v = t?.querySelector("[data-board]");
        !(v instanceof HTMLElement) || !o || o.resize(v.clientWidth, v.clientHeight);
      }, $();
      const M = new ResizeObserver(() => $()), C = t.querySelector("[data-board]");
      C && M.observe(C), s.push(() => M.disconnect()), s.push(vt(() => $())), s.push(
        p.loop.onUpdate((v) => {
          o?.update(v), l && d === "running" && (!o || o.inflight < 6) && (L -= v, L <= 0 && r >= c && (L = k === "turbo" ? 0.12 : k === "fast" ? 0.28 : 0.45, S()));
        })
      ), p.events.on("game:start", () => {
        d === "ready" && (d = "running", _(), w());
      }), p.events.on("game:restart", () => {
        a = g === "local" ? G() : a, g === "local" && (localStorage.removeItem(j), a = G(), D()), r = g === "server" ? a.credits : U, g === "server" ? x() : r = U, l = !1, P.length = 0, R = -1, b = -1, d = "running", _(), w();
      }), w(), x();
    },
    onDestroy() {
      for (const p of s) p();
      s.length = 0, o?.destroy(), o = null, t?.remove(), t = null, e = null;
    }
  });
}
function Zt() {
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
function te(n) {
  const e = N.map(
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
function ee() {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function at() {
  const n = new Tt(), e = ne(), s = se();
  if (e) n.set({ accessToken: e });
  else if (s?.accessToken && !s.accessToken.startsWith("local."))
    n.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const t = localStorage.getItem(pt);
    t?.startsWith("v1w.") && n.set({ accessToken: t });
  }
  return new Lt({ baseUrl: bt(), tokens: n, timeoutMs: 2500 });
}
function ne() {
  try {
    const n = sessionStorage.getItem("wgf:launch-token");
    return n && n.length >= 8 ? n : null;
  } catch {
    return null;
  }
}
function se() {
  try {
    const n = localStorage.getItem(Yt);
    return n ? JSON.parse(n) : null;
  } catch {
    return null;
  }
}
function bt() {
  return Vt?.VITE_API_BASE || "http://127.0.0.1:8787";
}
async function oe() {
  try {
    return (await fetch(`${bt()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
const ae = {
  normal: 0.34,
  fast: 0.16,
  turbo: 0.07
};
class re {
  constructor(e) {
    E(this, "canvas");
    E(this, "ctx");
    E(this, "rows", 16);
    E(this, "risk", "high");
    E(this, "speed", "normal");
    E(this, "width", 1);
    E(this, "height", 1);
    E(this, "balls", []);
    E(this, "pulses", /* @__PURE__ */ new Map());
    E(this, "pegPulses", /* @__PURE__ */ new Map());
    E(this, "nextId", 1);
    E(this, "onLand", null);
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
    const s = ae[this.speed];
    for (const t of this.balls) {
      if (t.landed) {
        t.age += e;
        continue;
      }
      const o = t.motion?.[t.step]?.pace ?? 1;
      for (t.u += e / (s * o); t.u >= 1 && t.step < t.rows; )
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
    const e = Math.max(18, Math.min(30, this.height * 0.07)), s = 10, t = Math.max(1, this.width - s * 2), o = Math.max(1, this.height - s * 2 - e - 6), a = Math.min(t / (this.rows + 1), o / (this.rows * 0.92)), r = a * 0.92, c = (this.width - (this.rows + 1) * a) / 2, i = this.rows * r + e + 6, f = s + Math.max(0, (this.height - s * 2 - i) / 2), k = f + this.rows * r + 6;
    return { pad: c, spacing: a, top: f, rowGap: r, bucketTop: k, bucketH: e };
  }
  pegX(e, s, t, o) {
    const a = 3 + e, r = (this.rows + 2 - a) / 2 * o;
    return t + r + s * o;
  }
  draw() {
    const e = this.ctx, { pad: s, spacing: t, top: o, rowGap: a, bucketTop: r, bucketH: c } = this.metrics();
    e.clearRect(0, 0, this.width, this.height), e.fillStyle = "#272b2c", e.fillRect(0, 0, this.width, this.height);
    const i = et(this.rows, this.risk), f = t * V, k = t * Y;
    for (let l = 0; l < this.rows; l += 1) {
      const g = 3 + l, T = o + a * (l + 1);
      for (let d = 0; d < g; d += 1) {
        const R = this.pegX(l, d, s, t), b = this.pegPulses.get(`${l}:${d}`) ?? 0;
        e.beginPath(), e.fillStyle = b > 0 ? "#fff" : "#f4f7f8", e.shadowColor = b > 0 ? "rgba(255, 244, 194, 0.95)" : "transparent", e.shadowBlur = b > 0 ? f * 2.4 : 0, e.arc(R, T, f, 0, Math.PI * 2), e.fill(), e.shadowBlur = 0;
      }
    }
    for (let l = 0; l < i.length; l += 1) {
      const g = this.pegX(this.rows - 1, l, s, t), T = this.pegX(this.rows - 1, l + 1, s, t), d = this.pulses.get(l) ?? 0, R = d > 0 ? 1 + d / 0.45 * 0.12 : 1, b = (T - g - 3) * R, L = (g + T) / 2 - b / 2, P = c * R, q = r - (P - c) / 2;
      ie(e, L, q, b, P, Math.min(8, P / 2)), e.fillStyle = Ot(l, i.length), e.fill(), e.fillStyle = "#1a1c1d", e.font = `700 ${Math.max(8, Math.min(11, b * 0.42))}px Outfit, sans-serif`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(J(i[l] ?? 0), L + b / 2, q + P / 2);
    }
    for (const l of this.balls) {
      const g = Math.min(l.step, Math.max(0, l.rows - 1)), T = l.landed || l.step >= l.rows ? 1 : l.u, d = Xt(
        l.rows,
        l.path,
        g,
        T,
        V,
        Y,
        l.motion?.[g]
      );
      d.hit && this.pegPulses.set(`${d.hit.row}:${d.hit.index}`, 0.22);
      const R = s + d.x * t, b = o + d.y * a, L = d.squash || 1;
      e.save(), e.translate(R, b), e.scale(1 / Math.sqrt(L), L), e.beginPath(), e.fillStyle = "#f7f4ea", e.arc(0, 0, k, 0, Math.PI * 2), e.fill(), e.strokeStyle = "rgba(0,0,0,0.35)", e.lineWidth = 1, e.stroke(), e.restore();
    }
  }
}
function ie(n, e, s, t, o, a) {
  const r = Math.max(0, Math.min(a, t / 2, o / 2));
  n.beginPath(), n.moveTo(e + r, s), n.arcTo(e + t, s, e + t, s + o, r), n.arcTo(e + t, s + o, e, s + o, r), n.arcTo(e, s + o, e, s, r), n.arcTo(e, s, e + t, s, r), n.closePath();
}
function de() {
  return Qt({
    manifest: Pt,
    title: "弹珠",
    gameAttr: "wgf-game:plinko",
    createBoard: (n) => new re(n)
  });
}
export {
  de as createGame,
  Pt as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
