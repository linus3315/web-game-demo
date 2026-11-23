var We = Object.defineProperty;
var Ve = (r, e, s) => e in r ? We(r, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : r[e] = s;
var v = (r, e, s) => Ve(r, typeof e != "symbol" ? e + "" : e, s);
import { BoxGeometry as re, Vector3 as O, Mesh as R, OrthographicCamera as Ze, BufferGeometry as Qe, Float32BufferAttribute as Ce, ShaderMaterial as ie, UniformsUtils as de, Vector2 as ke, WebGLRenderTarget as Ee, HalfFloatType as Le, NoBlending as Ne, Clock as je, RawShaderMaterial as Ke, ColorManagement as Xe, SRGBTransfer as Ye, LinearToneMapping as Je, ReinhardToneMapping as et, CineonToneMapping as tt, ACESFilmicToneMapping as st, AgXToneMapping as ot, NeutralToneMapping as rt, Color as Y, NearestFilter as Se, MeshDepthMaterial as it, RGBADepthPacking as at, Scene as nt, Group as lt, WebGLRenderer as ct, SRGBColorSpace as J, PCFSoftShadowMap as ht, PerspectiveCamera as ut, HemisphereLight as dt, DirectionalLight as Me, PointLight as ft, MeshBasicMaterial as _e, CylinderGeometry as pt, MeshStandardMaterial as W, CapsuleGeometry as mt, PlaneGeometry as gt, DoubleSide as bt, SphereGeometry as vt, MeshPhysicalMaterial as xt, CircleGeometry as te, CanvasTexture as fe, RepeatWrapping as X } from "three";
import { registerStrings as wt, defineGame as yt, bindVisualViewport as Ct, patchGame as kt, t as St } from "@wgf/core";
import { TokenStore as Mt, HttpClient as _t } from "@wgf/net";
const Tt = {
  background: "#c4894a",
  shapes: [
    { tag: "rect", attrs: { x: 36, y: 28, width: 248, height: 168, rx: 18, fill: "#a56b3c" } },
    { tag: "rect", attrs: { x: 78, y: 70, width: 18, height: 22, rx: 6, fill: "#e23b3b" } },
    { tag: "rect", attrs: { x: 118, y: 86, width: 18, height: 22, rx: 6, fill: "#f0d429" } },
    { tag: "rect", attrs: { x: 158, y: 86, width: 18, height: 22, rx: 6, fill: "#3cbb4a" } },
    { tag: "rect", attrs: { x: 198, y: 70, width: 18, height: 22, rx: 6, fill: "#3a7bff" } },
    { tag: "circle", attrs: { cx: 160, cy: 58, r: 10, fill: "#f4fbff" } },
    { tag: "rect", attrs: { x: 70, y: 150, width: 32, height: 18, rx: 6, fill: "#e23b3b" } },
    { tag: "rect", attrs: { x: 108, y: 150, width: 32, height: 18, rx: 6, fill: "#f08a2a" } },
    { tag: "rect", attrs: { x: 146, y: 150, width: 32, height: 18, rx: 6, fill: "#7ddec8" } },
    { tag: "rect", attrs: { x: 184, y: 150, width: 32, height: 18, rx: 6, fill: "#3a7bff" } },
    { tag: "rect", attrs: { x: 222, y: 150, width: 32, height: 18, rx: 6, fill: "#8a4ad4" } }
  ]
}, Pt = {
  id: "plinko-3d",
  name: "木珠",
  description: "木桌上的彩色积木钉。玻璃珠落到倍率槽。娱乐积分，不能兑换，也不能充值。",
  tip: "行数 8 到 16，风险分低中高。落点由服务器决定。",
  howToPlay: "选择注额、行数和风险，然后投放。珠子沿预定弹跳落下，最终槽位在出手时已经确定。可同时有多颗珠子在飞，每颗落地时结算。",
  copy: {
    en: {
      name: "Wood Plinko",
      description: "Colored blocks on a wooden table. A glass marble lands in a multiplier slot. Play credits only.",
      howToPlay: "Choose a stake, row count, and risk, then drop. The slot is fixed before the marble moves. Several marbles can be in flight; each one settles when it lands.",
      tip: "Rows run from 8 to 16. Risk is low, mid, or high."
    }
  },
  cover: "plinko-3d",
  art: Tt,
  renderer: "three",
  controls: "pointer",
  tags: ["弹珠", "联网"],
  theme: { accent: "#f0a04b", accentInk: "#2a160c", glow: "#e23b3b", radius: 18, font: "sans" }
}, pe = 8, me = 16, L = [10, 20, 50, 100], Rt = ["low", "mid", "high"], Ue = [
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
function Be(r, e) {
  let s = 1;
  for (let t = 1; t <= e; t += 1) s = s * (r - e + t) / t;
  return s;
}
function se(r) {
  const e = r.length - 1, s = 2 ** e;
  let t = 0;
  for (let o = 0; o < r.length; o += 1)
    t += Be(e, o) / s * (r[o] ?? 0);
  return t;
}
function At(r, e, s, t) {
  const o = r / 2;
  return Array.from({ length: r + 1 }, (i, n) => {
    const l = o === 0 ? 0 : Math.abs(n - o) / o;
    return s * (e / s) ** l ** t;
  });
}
function Dt(r) {
  return r >= 100 ? Math.max(1, Math.round(r)) : Math.max(0.1, Math.round(r * 10) / 10);
}
function Et(r) {
  const e = r.length - 1, s = r.slice();
  for (let t = 0; t <= e; t += 1) {
    const o = Dt(((s[t] ?? 0) + (s[e - t] ?? 0)) / 2);
    s[t] = o, s[e - t] = o;
  }
  return s;
}
function Lt(r) {
  const e = r / 2, s = [];
  for (let t = 0; t <= r; t += 1) Math.abs(t - e) <= 0.5 && s.push(t);
  return s;
}
function Nt(r, e, s, t) {
  const o = At(r, e, s, t), i = Et(o.map((u) => u * (0.99 / se(o)))), n = Lt(r);
  let l = i, a = Math.abs(se(l) - 0.99);
  for (let u = -20; u <= 20; u += 1) {
    const c = i.slice(), p = i[n[0] ?? 0] ?? 0, h = Math.max(0.1, Math.round((p + u * 0.1) * 10) / 10);
    for (const d of n) c[d] = h;
    const f = Math.abs(se(c) - 0.99);
    f < a && (a = f, l = c);
  }
  return l;
}
function Ut() {
  const r = {
    low: [18, 1.05, 2.2],
    mid: [160, 0.45, 1.65],
    high: [700, 0.2, 1.25]
  }, e = { low: {}, mid: {}, high: {} };
  for (const s of Rt) {
    const t = r[s];
    for (let o = pe; o <= me; o += 1)
      e[s][o] = Nt(o, t[0], t[1], t[2]);
  }
  return e.high[16] = Ue, e;
}
const Te = Ut();
function ge(r, e) {
  return Te[e][r] ?? Te.mid[16] ?? Ue;
}
function Bt(r) {
  return Number.isInteger(r) && r >= pe && r <= me;
}
function Ft(r) {
  return r === "low" || r === "mid" || r === "high";
}
function It(r) {
  return L.includes(r);
}
function ae(r) {
  return r >= 1e3 ? "1kx" : r >= 100 ? `${Math.round(r)}x` : `${r.toFixed(1)}x`;
}
function Ot(r, e) {
  const s = (e - 1) / 2, t = s === 0 ? 0 : Math.abs(r - s) / s, o = 168 - t * 164, i = 52 + t * 26, n = 64 - t * 12;
  return `hsl(${o.toFixed(1)} ${i.toFixed(1)}% ${n.toFixed(1)}%)`;
}
const Z = 1e3;
function z() {
  return { credits: Z };
}
function Gt(r, e) {
  const s = 2 ** r, t = e() * s;
  let o = 0;
  for (let i = 0; i <= r; i += 1)
    if (o += Be(r, i), t < o) return i;
  return r;
}
function zt(r, e, s, t, o, i) {
  if (!It(e)) return { error: "bad_bet" };
  if (!Bt(s)) return { error: "bad_rows" };
  if (!Ft(t)) return { error: "bad_risk" };
  if (r.credits < e) return { error: "insufficient" };
  const n = ge(s, t), l = typeof i == "number" && Number.isInteger(i) && i >= 0 && i <= s ? i : Gt(s, o), a = n[l] ?? 0, u = Math.round(e * a);
  return r.credits -= e, r.credits += u, { rows: s, risk: t, bet: e, bucket: l, multiplier: a, win: u, credits: r.credits };
}
const $t = 0.63;
function Ht(r, e, s) {
  let t = Math.max(0, Math.min(r, Math.floor(e))), o = r - t;
  const i = [];
  let n = null;
  for (let l = 0; l < r; l += 1) {
    let a;
    if (t <= 0) a = "L";
    else if (o <= 0) a = "R";
    else if (n === null) a = s() < t / (t + o) ? "R" : "L";
    else {
      const u = n === "R" ? "L" : "R";
      a = (s() < $t ? n : u) === "R" ? t > 0 ? "R" : "L" : o > 0 ? "L" : "R";
    }
    i.push(a), a === "R" ? t -= 1 : o -= 1, n = a;
  }
  return i;
}
const ne = 0.18, le = 0.2, ce = 0.92, Fe = 0.55, qt = 1.05;
function Wt(r, e) {
  const s = [];
  let t = 1, o = 0;
  for (const i of r) {
    const n = i === "R" ? 1 : -1, l = 0.75 + e() * 0.55, a = 0.8 + e() * 0.42;
    t = t * 0.45 + a * 0.55, o = Math.max(-0.75, Math.min(0.75, o * 0.5 + n * (0.28 + e() * 0.35)));
    const u = e(), c = u < 0.08 ? "double" : u < 0.18 ? "skim" : "none";
    s.push({ hop: l, pace: t, flourish: c, vx: o });
  }
  return s;
}
function Vt(r, e, s) {
  return { x: (r - 1 - e) / 2 + s, y: e + 1 };
}
function Ie(r, e) {
  return r + e;
}
function he(r) {
  return r === "R" ? 1 : -1;
}
function $(r, e, s, t) {
  return {
    x: r.x + s * Math.sin(e) * t,
    y: r.y - Math.cos(e) * t / ce
  };
}
function Oe(r, e) {
  let s = 0;
  for (let t = 0; t < e; t += 1) r[t] === "R" && (s += 1);
  return s;
}
function ue(r, e, s) {
  const t = s[e] === "R" ? "R" : "L", o = Oe(s, e) + 1;
  return { peg: Vt(r, e, o), index: o, dir: t };
}
function Zt(r, e) {
  const s = r.x - e.x, t = (r.y - e.y) * ce, o = Math.hypot(s, t) || 1;
  return { x: s / o, y: t / o / ce };
}
function Pe(r, e, s, t) {
  const o = 1 - t;
  return {
    x: o * o * r.x + 2 * o * t * e.x + t * t * s.x,
    y: o * o * r.y + 2 * o * t * e.y + t * t * s.y
  };
}
function Qt(r, e, s, t, o = ne, i = le, n) {
  const l = Math.max(0, Math.min(r - 1, s)), a = Math.max(0, Math.min(1, t)), u = Ie(o, i), c = ue(r, l, e), p = he(c.dir), h = n?.flourish ?? "none", f = n?.hop ?? 1, d = n?.vx ?? 0, M = h === "skim" ? 0.95 : Fe, y = h === "skim" ? 1.22 : qt, C = h === "double" ? 0.7 : 0.62;
  if (h === "double" && a <= 0.48) {
    if (a <= 0.24) {
      const K = a / 0.24;
      return {
        ...$(c.peg, M + (y - M) * K, p, u),
        hit: { row: l, index: c.index }
      };
    }
    const T = $(c.peg, y, p, u), I = $(c.peg, y - 0.18, p, u), S = Zt(T, c.peg), N = (a - 0.24) / 0.24;
    return {
      ...Pe(
        T,
        { x: T.x + S.x * 0.16 * f, y: T.y + S.y * 0.16 * f - 0.05 * f },
        I,
        N
      ),
      hit: N > 0.82 ? { row: l, index: c.index } : null
    };
  }
  const A = h === "double" ? 0.62 : 0.5;
  if (a <= A) {
    const T = a / A;
    return {
      ...$(c.peg, M + (y - M) * T, p, u),
      hit: a <= C ? { row: l, index: c.index } : null
    };
  }
  const G = $(c.peg, y, p, u), F = jt(r, e, l, o, i), Q = (a - A) / (1 - A), j = {
    x: G.x + p * (0.2 + 0.08 * f) + d * 0.06,
    y: G.y - 0.13 * f
  };
  return {
    ...Pe(G, j, F, Q),
    hit: null
  };
}
function jt(r, e, s, t, o) {
  const i = ue(r, s, e), n = he(i.dir), a = Oe(e, s) + (i.dir === "R" ? 1 : 0);
  if (s + 1 >= r) return { x: a + 0.5, y: r + 1.4 };
  const u = e[s + 1] === "R" ? "R" : "L", c = ue(r, s + 1, e), p = he(u), h = Ie(t, o), f = $(c.peg, Fe, p, h);
  return {
    x: (i.peg.x + n * 0.5 + f.x) / 2,
    y: (i.peg.y + c.peg.y) / 2
  };
}
function Kt() {
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
const Xt = {}, oe = "wgf:slots-wallet", Ge = "wgf:slots-token", Yt = "wgf:session";
function Jt(r) {
  Kt();
  let e = null;
  const s = [];
  let t = null, o = null, i = z(), n = Z, l = 20, a = 16, u = "high", c = "normal", p = !1, h = "pending", f = !1, d = "ready", M = -1, y = -1, C = 0;
  const A = [], G = /* @__PURE__ */ new Set();
  let F = null, Q = !1, j = 0, T = () => {
  };
  function I(b, m) {
    return St(e?.store.getState().ui.locale ?? "zh", b, m);
  }
  function S() {
    if (!t) return;
    const b = t.querySelector("[data-credits]"), m = t.querySelector("[data-amount]"), w = t.querySelector("[data-row-label]"), _ = t.querySelector("[data-demo]"), E = t.querySelector("[data-source]");
    b && (b.textContent = String(n)), m && (m.textContent = String(l)), w && (w.textContent = String(a)), _ && (_.hidden = h !== "local"), E && (E.textContent = I(h === "server" ? "plinko.server" : h === "local" ? "plinko.local" : "plinko.pending")), t.dataset.rows = String(a), t.dataset.risk = u, t.dataset.pace = c, t.dataset.pegs = String(a + 2), t.dataset.buckets = String(a + 1), M >= 0 && (t.dataset.bucket = String(M)), y >= 0 && (t.dataset.landed = String(y)), t.dataset.round = o && o.inflight > 0 ? "busy" : "open";
    const k = L.indexOf(l), g = t.querySelector("[data-bet-dec]"), B = t.querySelector("[data-bet-inc]");
    g && (g.disabled = k <= 0), B && (B.disabled = k >= L.length - 1), t.querySelectorAll("[data-bet]").forEach((x) => {
      x.classList.toggle("is-bet", Number(x.dataset.bet) === l);
    }), t.querySelectorAll("[data-speed]").forEach((x) => {
      x.classList.toggle("is-on", x.dataset.speed === c);
    }), t.querySelectorAll("[data-risk-pick]").forEach((x) => {
      x.classList.toggle("is-on", x.dataset.riskPick === u);
    });
    const D = t.querySelector("[data-drop]");
    D && (D.disabled = !f || d !== "running" || n < l);
    const U = t.querySelector("[data-auto]");
    U && U.setAttribute("aria-pressed", p ? "true" : "false");
    const q = t.querySelector("[data-history]");
    q && q.replaceChildren(
      ...A.slice(0, 8).map((x) => {
        const ye = document.createElement("span");
        return ye.textContent = ae(x), ye;
      })
    ), o?.setLayout(a, u), o?.setSpeed(c), t.dataset.seq = String(j), qe(t);
  }
  function N() {
    e && kt(e.store, {
      id: r.manifest.id,
      status: d,
      score: Math.max(0, n - Z),
      highScore: Math.max(0, n),
      message: "",
      detail: I(h === "server" ? "plinko.server" : "plinko.local"),
      credits: n
    });
  }
  function K() {
    h === "local" && localStorage.setItem(oe, JSON.stringify(i));
  }
  function ve() {
    try {
      const b = localStorage.getItem(oe);
      if (!b) return z();
      const m = JSON.parse(b);
      return !m || typeof m.credits != "number" ? z() : { credits: Math.max(0, Math.floor(m.credits)) };
    } catch {
      return z();
    }
  }
  async function xe() {
    if (!await is()) {
      h = "local", i = ve(), n = i.credits, f = !0, N(), S();
      return;
    }
    try {
      const m = await Re().post("/api/plinko/session", {});
      m.walletToken && localStorage.setItem(Ge, m.walletToken), Q = m.demo === !0, h = "server", i = { credits: m.credits }, n = m.credits;
    } catch {
      h = "local", i = ve(), n = i.credits;
    }
    f = !0, N(), S();
  }
  async function ee() {
    if (!f || d !== "running" || n < l) return;
    const b = ss();
    if (G.has(b)) return;
    const m = { bet: l, rows: a, risk: u }, w = we() ? F : null;
    let _;
    if (h === "server")
      try {
        const g = await Re().post("/api/plinko/drop", {
          bet: m.bet,
          spinId: b,
          rows: m.rows,
          risk: m.risk,
          ...w !== null ? { bucket: w } : {}
        });
        _ = g, i = { credits: g.credits };
      } catch {
        return;
      }
    else {
      const g = zt(
        i,
        m.bet,
        m.rows,
        m.risk,
        Math.random,
        w
      );
      if ("error" in g) return;
      _ = g, K();
    }
    G.add(b), n -= m.bet, M = _.bucket;
    const E = Ht(m.rows, _.bucket, Math.random), k = {
      path: E,
      rows: m.rows,
      bet: m.bet,
      bucket: _.bucket,
      multiplier: _.multiplier,
      win: _.win,
      motion: Wt(E, Math.random)
    };
    o?.launch(k), N(), S();
  }
  function He(b) {
    n += b.win, y = b.bucket, j += 1, A.unshift(b.multiplier), A.length > 8 && (A.length = 8), n < L[0] && (!o || o.inflight === 0) && (p = !1, d = "over"), N(), S();
  }
  function we() {
    return es() && (h === "local" || Q);
  }
  function qe(b) {
    const m = b.querySelector("[data-debug]");
    m && (m.hidden = !we());
    const w = b.querySelector("[data-debug-result]");
    if (!w) return;
    const _ = `${a}:${u}`;
    if (w.dataset.key === _) return;
    const E = ge(a, u), k = F, g = document.createElement("option");
    g.value = "random", g.textContent = "随机";
    const B = [g];
    for (let D = 0; D <= a; D += 1) {
      const U = document.createElement("option");
      U.value = String(D), U.textContent = `${D} ${ae(E[D] ?? 0)}`, B.push(U);
    }
    w.replaceChildren(...B), w.dataset.key = _, k !== null && k <= a ? (F = k, w.value = String(k)) : (F = null, w.value = "random");
  }
  return yt(r.manifest, {
    async onPreload(b, m) {
      await b.preload([], m);
    },
    async onMount(b) {
      e = b, b.container.setAttribute("data-wgf-game", r.gameAttr), t = document.createElement("div"), t.className = r.extraClass ? `plinko ${r.extraClass}` : "plinko", t.innerHTML = ts(r.title);
      const m = t.querySelector("[data-board]");
      m instanceof HTMLElement && (o = r.createBoard(m), o.onLand = He, o.setLayout(a, u)), b.container.appendChild(t);
      const w = t;
      w.addEventListener("change", (k) => {
        const g = k.target;
        !(g instanceof HTMLSelectElement) || !g.matches("[data-debug-result]") || (F = g.value === "random" ? null : Number(g.value));
      }), w.addEventListener("click", (k) => {
        const g = k.target;
        if (!(g instanceof Element)) return;
        if (g.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        const B = g.closest("[data-bet]"), D = B instanceof HTMLElement ? Number(B.dataset.bet) : Number.NaN;
        if (L.includes(D)) {
          l = D, w.classList.remove("is-bets"), S();
          return;
        }
        if (g.closest("[data-bet-dec]")) {
          const x = L[L.indexOf(l) - 1];
          x !== void 0 && (l = x), w.classList.remove("is-bets"), S();
          return;
        }
        if (g.closest("[data-bet-inc]")) {
          const x = L[L.indexOf(l) + 1];
          x !== void 0 && (l = x), w.classList.remove("is-bets"), S();
          return;
        }
        if (g.closest("[data-amount-bar]")) {
          w.classList.toggle("is-bets");
          return;
        }
        if (w.classList.contains("is-bets") && !g.closest("[data-bet-ui]") && w.classList.remove("is-bets"), g.closest("[data-row-dec]") && (!o || o.inflight === 0)) {
          a > pe && (a -= 1), S(), T();
          return;
        }
        if (g.closest("[data-row-inc]") && (!o || o.inflight === 0)) {
          a < me && (a += 1), S(), T();
          return;
        }
        const U = g.closest("[data-risk-pick]");
        if (U instanceof HTMLElement && (!o || o.inflight === 0)) {
          const x = U.dataset.riskPick;
          (x === "low" || x === "mid" || x === "high") && (u = x), S();
          return;
        }
        const q = g.closest("[data-speed]");
        if (q instanceof HTMLElement) {
          const x = q.dataset.speed;
          (x === "normal" || x === "fast" || x === "turbo") && (c = x), S();
          return;
        }
        if (g.closest("[data-auto]")) {
          p = !p, C = 0, S(), p && ee();
          return;
        }
        g.closest("[data-drop]") && ee();
      }), T = () => {
        const k = t?.querySelector("[data-board]");
        !(k instanceof HTMLElement) || !o || o.resize(k.clientWidth, k.clientHeight);
      }, T();
      const _ = new ResizeObserver(() => T()), E = t.querySelector("[data-board]");
      E && _.observe(E), s.push(() => _.disconnect()), s.push(Ct(() => T())), s.push(
        b.loop.onUpdate((k) => {
          o?.update(k), p && d === "running" && (!o || o.inflight < 6) && (C -= k, C <= 0 && n >= l && (C = c === "turbo" ? 0.12 : c === "fast" ? 0.28 : 0.45, ee()));
        })
      ), b.events.on("game:start", () => {
        d === "ready" && (d = "running", N(), S());
      }), b.events.on("game:restart", () => {
        i = h === "local" ? z() : i, h === "local" && (localStorage.removeItem(oe), i = z(), K()), n = h === "server" ? i.credits : Z, h === "server" ? xe() : n = Z, p = !1, A.length = 0, M = -1, y = -1, d = "running", N(), S();
      }), S(), xe();
    },
    onDestroy() {
      for (const b of s) b();
      s.length = 0, o?.destroy(), o = null, t?.remove(), t = null, e = null;
    }
  });
}
function es() {
  try {
    const r = new URL(location.href);
    if (r.searchParams.get("debug") === "1") return !0;
    const e = r.hash, s = e.indexOf("?");
    if (s >= 0 && new URLSearchParams(e.slice(s + 1)).get("debug") === "1") return !0;
  } catch {
    return !1;
  }
  return !1;
}
function ts(r) {
  const e = L.map(
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
        <strong>${r}</strong>
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
function ss() {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function Re() {
  const r = new Mt(), e = os(), s = rs();
  if (e) r.set({ accessToken: e });
  else if (s?.accessToken && !s.accessToken.startsWith("local."))
    r.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const t = localStorage.getItem(Ge);
    t?.startsWith("v1w.") && r.set({ accessToken: t });
  }
  return new _t({ baseUrl: ze(), tokens: r, timeoutMs: 2500 });
}
function os() {
  try {
    const r = sessionStorage.getItem("wgf:launch-token");
    return r && r.length >= 8 ? r : null;
  } catch {
    return null;
  }
}
function rs() {
  try {
    const r = localStorage.getItem(Yt);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}
function ze() {
  return Xt?.VITE_API_BASE || "http://127.0.0.1:8787";
}
async function is() {
  try {
    return (await fetch(`${ze()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
const V = new O();
function P(r, e, s, t, o, i) {
  const n = 2 * Math.PI * o / 4, l = Math.max(i - 2 * o, 0), a = Math.PI / 4;
  V.copy(e), V[t] = 0, V.normalize();
  const u = 0.5 * n / (n + l), c = 1 - V.angleTo(r) / a;
  return Math.sign(V[s]) === 1 ? c * u : l / (n + l) + u + u * (1 - c);
}
class Ae extends re {
  constructor(e = 1, s = 1, t = 1, o = 2, i = 0.1) {
    if (o = o * 2 + 1, i = Math.min(e / 2, s / 2, t / 2, i), super(1, 1, 1, o, o, o), o === 1) return;
    const n = this.toNonIndexed();
    this.index = null, this.attributes.position = n.attributes.position, this.attributes.normal = n.attributes.normal, this.attributes.uv = n.attributes.uv;
    const l = new O(), a = new O(), u = new O(e, s, t).divideScalar(2).subScalar(i), c = this.attributes.position.array, p = this.attributes.normal.array, h = this.attributes.uv.array, f = c.length / 6, d = new O(), M = 0.5 / o;
    for (let y = 0, C = 0; y < c.length; y += 3, C += 2)
      switch (l.fromArray(c, y), a.copy(l), a.x -= Math.sign(a.x) * M, a.y -= Math.sign(a.y) * M, a.z -= Math.sign(a.z) * M, a.normalize(), c[y + 0] = u.x * Math.sign(l.x) + a.x * i, c[y + 1] = u.y * Math.sign(l.y) + a.y * i, c[y + 2] = u.z * Math.sign(l.z) + a.z * i, p[y + 0] = a.x, p[y + 1] = a.y, p[y + 2] = a.z, Math.floor(y / f)) {
        case 0:
          d.set(1, 0, 0), h[C + 0] = P(d, a, "z", "y", i, t), h[C + 1] = 1 - P(d, a, "y", "z", i, s);
          break;
        case 1:
          d.set(-1, 0, 0), h[C + 0] = 1 - P(d, a, "z", "y", i, t), h[C + 1] = 1 - P(d, a, "y", "z", i, s);
          break;
        case 2:
          d.set(0, 1, 0), h[C + 0] = 1 - P(d, a, "x", "z", i, e), h[C + 1] = P(d, a, "z", "x", i, t);
          break;
        case 3:
          d.set(0, -1, 0), h[C + 0] = 1 - P(d, a, "x", "z", i, e), h[C + 1] = 1 - P(d, a, "z", "x", i, t);
          break;
        case 4:
          d.set(0, 0, 1), h[C + 0] = 1 - P(d, a, "x", "y", i, e), h[C + 1] = 1 - P(d, a, "y", "x", i, s);
          break;
        case 5:
          d.set(0, 0, -1), h[C + 0] = P(d, a, "x", "y", i, e), h[C + 1] = 1 - P(d, a, "y", "x", i, s);
          break;
      }
  }
}
const as = {
  name: "CopyShader",
  uniforms: {
    tDiffuse: { value: null },
    opacity: { value: 1 }
  },
  vertexShader: (
    /* glsl */
    `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
  ),
  fragmentShader: (
    /* glsl */
    `

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`
  )
};
class H {
  constructor() {
    this.isPass = !0, this.enabled = !0, this.needsSwap = !0, this.clear = !1, this.renderToScreen = !1;
  }
  setSize() {
  }
  render() {
    console.error("THREE.Pass: .render() must be implemented in derived pass.");
  }
  dispose() {
  }
}
const ns = new Ze(-1, 1, 1, -1, 0, 1);
class ls extends Qe {
  constructor() {
    super(), this.setAttribute("position", new Ce([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), this.setAttribute("uv", new Ce([0, 2, 0, 0, 2, 0], 2));
  }
}
const cs = new ls();
class be {
  constructor(e) {
    this._mesh = new R(cs, e);
  }
  dispose() {
    this._mesh.geometry.dispose();
  }
  render(e) {
    e.render(this._mesh, ns);
  }
  get material() {
    return this._mesh.material;
  }
  set material(e) {
    this._mesh.material = e;
  }
}
class hs extends H {
  constructor(e, s) {
    super(), this.textureID = s !== void 0 ? s : "tDiffuse", e instanceof ie ? (this.uniforms = e.uniforms, this.material = e) : e && (this.uniforms = de.clone(e.uniforms), this.material = new ie({
      name: e.name !== void 0 ? e.name : "unspecified",
      defines: Object.assign({}, e.defines),
      uniforms: this.uniforms,
      vertexShader: e.vertexShader,
      fragmentShader: e.fragmentShader
    })), this.fsQuad = new be(this.material);
  }
  render(e, s, t) {
    this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = t.texture), this.fsQuad.material = this.material, this.renderToScreen ? (e.setRenderTarget(null), this.fsQuad.render(e)) : (e.setRenderTarget(s), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this.fsQuad.render(e));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class De extends H {
  constructor(e, s) {
    super(), this.scene = e, this.camera = s, this.clear = !0, this.needsSwap = !1, this.inverse = !1;
  }
  render(e, s, t) {
    const o = e.getContext(), i = e.state;
    i.buffers.color.setMask(!1), i.buffers.depth.setMask(!1), i.buffers.color.setLocked(!0), i.buffers.depth.setLocked(!0);
    let n, l;
    this.inverse ? (n = 0, l = 1) : (n = 1, l = 0), i.buffers.stencil.setTest(!0), i.buffers.stencil.setOp(o.REPLACE, o.REPLACE, o.REPLACE), i.buffers.stencil.setFunc(o.ALWAYS, n, 4294967295), i.buffers.stencil.setClear(l), i.buffers.stencil.setLocked(!0), e.setRenderTarget(t), this.clear && e.clear(), e.render(this.scene, this.camera), e.setRenderTarget(s), this.clear && e.clear(), e.render(this.scene, this.camera), i.buffers.color.setLocked(!1), i.buffers.depth.setLocked(!1), i.buffers.color.setMask(!0), i.buffers.depth.setMask(!0), i.buffers.stencil.setLocked(!1), i.buffers.stencil.setFunc(o.EQUAL, 1, 4294967295), i.buffers.stencil.setOp(o.KEEP, o.KEEP, o.KEEP), i.buffers.stencil.setLocked(!0);
  }
}
class us extends H {
  constructor() {
    super(), this.needsSwap = !1;
  }
  render(e) {
    e.state.buffers.stencil.setLocked(!1), e.state.buffers.stencil.setTest(!1);
  }
}
class ds {
  constructor(e, s) {
    if (this.renderer = e, this._pixelRatio = e.getPixelRatio(), s === void 0) {
      const t = e.getSize(new ke());
      this._width = t.width, this._height = t.height, s = new Ee(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: Le }), s.texture.name = "EffectComposer.rt1";
    } else
      this._width = s.width, this._height = s.height;
    this.renderTarget1 = s, this.renderTarget2 = s.clone(), this.renderTarget2.texture.name = "EffectComposer.rt2", this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = !0, this.passes = [], this.copyPass = new hs(as), this.copyPass.material.blending = Ne, this.clock = new je();
  }
  swapBuffers() {
    const e = this.readBuffer;
    this.readBuffer = this.writeBuffer, this.writeBuffer = e;
  }
  addPass(e) {
    this.passes.push(e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  insertPass(e, s) {
    this.passes.splice(s, 0, e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  removePass(e) {
    const s = this.passes.indexOf(e);
    s !== -1 && this.passes.splice(s, 1);
  }
  isLastEnabledPass(e) {
    for (let s = e + 1; s < this.passes.length; s++)
      if (this.passes[s].enabled)
        return !1;
    return !0;
  }
  render(e) {
    e === void 0 && (e = this.clock.getDelta());
    const s = this.renderer.getRenderTarget();
    let t = !1;
    for (let o = 0, i = this.passes.length; o < i; o++) {
      const n = this.passes[o];
      if (n.enabled !== !1) {
        if (n.renderToScreen = this.renderToScreen && this.isLastEnabledPass(o), n.render(this.renderer, this.writeBuffer, this.readBuffer, e, t), n.needsSwap) {
          if (t) {
            const l = this.renderer.getContext(), a = this.renderer.state.buffers.stencil;
            a.setFunc(l.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, e), a.setFunc(l.EQUAL, 1, 4294967295);
          }
          this.swapBuffers();
        }
        De !== void 0 && (n instanceof De ? t = !0 : n instanceof us && (t = !1));
      }
    }
    this.renderer.setRenderTarget(s);
  }
  reset(e) {
    if (e === void 0) {
      const s = this.renderer.getSize(new ke());
      this._pixelRatio = this.renderer.getPixelRatio(), this._width = s.width, this._height = s.height, e = this.renderTarget1.clone(), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.renderTarget1 = e, this.renderTarget2 = e.clone(), this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2;
  }
  setSize(e, s) {
    this._width = e, this._height = s;
    const t = this._width * this._pixelRatio, o = this._height * this._pixelRatio;
    this.renderTarget1.setSize(t, o), this.renderTarget2.setSize(t, o);
    for (let i = 0; i < this.passes.length; i++)
      this.passes[i].setSize(t, o);
  }
  setPixelRatio(e) {
    this._pixelRatio = e, this.setSize(this._width, this._height);
  }
  dispose() {
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.copyPass.dispose();
  }
}
const fs = {
  name: "OutputShader",
  uniforms: {
    tDiffuse: { value: null },
    toneMappingExposure: { value: 1 }
  },
  vertexShader: (
    /* glsl */
    `
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
  ),
  fragmentShader: (
    /* glsl */
    `
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`
  )
};
class ps extends H {
  constructor() {
    super();
    const e = fs;
    this.uniforms = de.clone(e.uniforms), this.material = new Ke({
      name: e.name,
      uniforms: this.uniforms,
      vertexShader: e.vertexShader,
      fragmentShader: e.fragmentShader
    }), this.fsQuad = new be(this.material), this._outputColorSpace = null, this._toneMapping = null;
  }
  render(e, s, t) {
    this.uniforms.tDiffuse.value = t.texture, this.uniforms.toneMappingExposure.value = e.toneMappingExposure, (this._outputColorSpace !== e.outputColorSpace || this._toneMapping !== e.toneMapping) && (this._outputColorSpace = e.outputColorSpace, this._toneMapping = e.toneMapping, this.material.defines = {}, Xe.getTransfer(this._outputColorSpace) === Ye && (this.material.defines.SRGB_TRANSFER = ""), this._toneMapping === Je ? this.material.defines.LINEAR_TONE_MAPPING = "" : this._toneMapping === et ? this.material.defines.REINHARD_TONE_MAPPING = "" : this._toneMapping === tt ? this.material.defines.CINEON_TONE_MAPPING = "" : this._toneMapping === st ? this.material.defines.ACES_FILMIC_TONE_MAPPING = "" : this._toneMapping === ot ? this.material.defines.AGX_TONE_MAPPING = "" : this._toneMapping === rt && (this.material.defines.NEUTRAL_TONE_MAPPING = ""), this.material.needsUpdate = !0), this.renderToScreen === !0 ? (e.setRenderTarget(null), this.fsQuad.render(e)) : (e.setRenderTarget(s), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this.fsQuad.render(e));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class ms extends H {
  constructor(e, s, t = null, o = null, i = null) {
    super(), this.scene = e, this.camera = s, this.overrideMaterial = t, this.clearColor = o, this.clearAlpha = i, this.clear = !0, this.clearDepth = !1, this.needsSwap = !1, this._oldClearColor = new Y();
  }
  render(e, s, t) {
    const o = e.autoClear;
    e.autoClear = !1;
    let i, n;
    this.overrideMaterial !== null && (n = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor !== null && (e.getClearColor(this._oldClearColor), e.setClearColor(this.clearColor, e.getClearAlpha())), this.clearAlpha !== null && (i = e.getClearAlpha(), e.setClearAlpha(this.clearAlpha)), this.clearDepth == !0 && e.clearDepth(), e.setRenderTarget(this.renderToScreen ? null : t), this.clear === !0 && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), e.render(this.scene, this.camera), this.clearColor !== null && e.setClearColor(this._oldClearColor), this.clearAlpha !== null && e.setClearAlpha(i), this.overrideMaterial !== null && (this.scene.overrideMaterial = n), e.autoClear = o;
  }
}
const gs = {
  defines: {
    DEPTH_PACKING: 1,
    PERSPECTIVE_CAMERA: 1
  },
  uniforms: {
    tColor: { value: null },
    tDepth: { value: null },
    focus: { value: 1 },
    aspect: { value: 1 },
    aperture: { value: 0.025 },
    maxblur: { value: 0.01 },
    nearClip: { value: 1 },
    farClip: { value: 1e3 }
  },
  vertexShader: (
    /* glsl */
    `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
  ),
  fragmentShader: (
    /* glsl */
    `

		#include <common>

		varying vec2 vUv;

		uniform sampler2D tColor;
		uniform sampler2D tDepth;

		uniform float maxblur; // max blur amount
		uniform float aperture; // aperture - bigger values for shallower depth of field

		uniform float nearClip;
		uniform float farClip;

		uniform float focus;
		uniform float aspect;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {
			#if DEPTH_PACKING == 1
			return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
			#else
			return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		float getViewZ( const in float depth ) {
			#if PERSPECTIVE_CAMERA == 1
			return perspectiveDepthToViewZ( depth, nearClip, farClip );
			#else
			return orthographicDepthToViewZ( depth, nearClip, farClip );
			#endif
		}


		void main() {

			vec2 aspectcorrect = vec2( 1.0, aspect );

			float viewZ = getViewZ( getDepth( vUv ) );

			float factor = ( focus + viewZ ); // viewZ is <= 0, so this is a difference equation

			vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );

			vec2 dofblur9 = dofblur * 0.9;
			vec2 dofblur7 = dofblur * 0.7;
			vec2 dofblur4 = dofblur * 0.4;

			vec4 col = vec4( 0.0 );

			col += texture2D( tColor, vUv.xy );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );

			gl_FragColor = col / 41.0;
			gl_FragColor.a = 1.0;

		}`
  )
};
class bs extends H {
  constructor(e, s, t) {
    super(), this.scene = e, this.camera = s;
    const o = t.focus !== void 0 ? t.focus : 1, i = t.aperture !== void 0 ? t.aperture : 0.025, n = t.maxblur !== void 0 ? t.maxblur : 1;
    this.renderTargetDepth = new Ee(1, 1, {
      // will be resized later
      minFilter: Se,
      magFilter: Se,
      type: Le
    }), this.renderTargetDepth.texture.name = "BokehPass.depth", this.materialDepth = new it(), this.materialDepth.depthPacking = at, this.materialDepth.blending = Ne;
    const l = gs, a = de.clone(l.uniforms);
    a.tDepth.value = this.renderTargetDepth.texture, a.focus.value = o, a.aspect.value = s.aspect, a.aperture.value = i, a.maxblur.value = n, a.nearClip.value = s.near, a.farClip.value = s.far, this.materialBokeh = new ie({
      defines: Object.assign({}, l.defines),
      uniforms: a,
      vertexShader: l.vertexShader,
      fragmentShader: l.fragmentShader
    }), this.uniforms = a, this.fsQuad = new be(this.materialBokeh), this._oldClearColor = new Y();
  }
  render(e, s, t) {
    this.scene.overrideMaterial = this.materialDepth, e.getClearColor(this._oldClearColor);
    const o = e.getClearAlpha(), i = e.autoClear;
    e.autoClear = !1, e.setClearColor(16777215), e.setClearAlpha(1), e.setRenderTarget(this.renderTargetDepth), e.clear(), e.render(this.scene, this.camera), this.uniforms.tColor.value = t.texture, this.uniforms.nearClip.value = this.camera.near, this.uniforms.farClip.value = this.camera.far, this.renderToScreen ? (e.setRenderTarget(null), this.fsQuad.render(e)) : (e.setRenderTarget(s), e.clear(), this.fsQuad.render(e)), this.scene.overrideMaterial = null, e.setClearColor(this._oldClearColor), e.setClearAlpha(o), e.autoClear = i;
  }
  setSize(e, s) {
    this.materialBokeh.uniforms.aspect.value = e / s, this.renderTargetDepth.setSize(e, s);
  }
  dispose() {
    this.renderTargetDepth.dispose(), this.materialDepth.dispose(), this.materialBokeh.dispose(), this.fsQuad.dispose();
  }
}
const vs = [14826299, 15764010, 15782953, 3980106, 2865328, 3832831, 9063124], xs = {
  normal: 0.34,
  fast: 0.16,
  turbo: 0.07
};
class ws {
  constructor(e) {
    v(this, "onLand", null);
    v(this, "renderer");
    v(this, "scene", new nt());
    v(this, "camera");
    v(this, "sun");
    v(this, "glint");
    v(this, "board", new lt());
    v(this, "layoutOwned", []);
    v(this, "composer", null);
    v(this, "bokeh", null);
    v(this, "fancy");
    v(this, "rows", 16);
    v(this, "risk", "high");
    v(this, "speed", "normal");
    v(this, "built", !1);
    v(this, "frame", { span: 9.4, spacing: 1, rowGap: 0.86, topZ: 0, depth: 8 });
    v(this, "marbles", []);
    v(this, "bucketMeshes", []);
    v(this, "pegMeshes", []);
    v(this, "pegFlash", /* @__PURE__ */ new Map());
    v(this, "pulses", /* @__PURE__ */ new Map());
    v(this, "ballGeometry", null);
    v(this, "owned", []);
    v(this, "fpsTime", 0);
    v(this, "fpsFrames", 0);
    v(this, "width", 1);
    v(this, "height", 1);
    this.fancy = !ys();
    const s = document.createElement("canvas");
    s.setAttribute("data-plinko-gl", "1"), this.renderer = new ct({
      canvas: s,
      antialias: this.fancy,
      alpha: !1,
      powerPreference: "high-performance",
      preserveDrawingBuffer: !0
    }), this.renderer.outputColorSpace = J, this.renderer.setClearColor(13210965, 1), this.renderer.shadowMap.enabled = this.fancy, this.renderer.shadowMap.type = ht, s.style.width = "100%", s.style.height = "100%", s.style.display = "block", s.style.touchAction = "none", e.appendChild(s), this.camera = new ut(34, 1, 0.08, 80), this.scene.background = new Y(14131548), this.scene.add(this.board), this.scene.add(new dt(16774884, 9263664, 0.38)), this.sun = new Me(16774111, 0.72), this.sun.position.set(2.4, 14, -1.2), this.sun.castShadow = this.fancy, this.sun.shadow.mapSize.set(1024, 1024), this.sun.shadow.camera.near = 1, this.sun.shadow.camera.far = 28, this.sun.shadow.camera.left = -8, this.sun.shadow.camera.right = 8, this.sun.shadow.camera.top = 8, this.sun.shadow.camera.bottom = -8, this.sun.shadow.bias = -8e-4, this.scene.add(this.sun);
    const t = new Me(16769720, 0.38);
    t.position.set(-5, 7, 3), this.scene.add(t), this.glint = new ft(16777215, 6, 18), this.scene.add(this.glint), this.fancy && this.enableDepthOfField(), this.resize(e.clientWidth || 320, e.clientHeight || 420);
  }
  setLayout(e, s) {
    this.built && this.rows === e && this.risk === s || (this.rows = e, this.risk = s, this.rebuild());
  }
  setSpeed(e) {
    this.speed = e;
  }
  resize(e, s) {
    this.width = Math.max(1, e), this.height = Math.max(1, s);
    const t = this.fancy ? 2 : 1.5, o = Math.min(2, window.devicePixelRatio || 1, t);
    this.renderer.setPixelRatio(o), this.renderer.setSize(this.width, this.height, !1), this.camera.aspect = this.width / this.height, this.camera.updateProjectionMatrix(), this.composer?.setSize(this.width, this.height), this.composer?.setPixelRatio(o), this.frameCamera();
  }
  launch(e) {
    const s = new R(this.ballGeometry ?? this.ensureBall(), this.marbleMaterial());
    s.castShadow = this.fancy, s.receiveShadow = !1;
    const t = new R(
      this.shadowGeometry(),
      new _e({
        color: 3810324,
        transparent: !0,
        opacity: 0.32,
        depthWrite: !1
      })
    );
    t.rotation.x = -Math.PI / 2, this.board.add(s), this.board.add(t), this.marbles.push({ shot: e, mesh: s, shadow: t, step: 0, u: 0, landed: !1, age: 0 });
  }
  get inflight() {
    return this.marbles.filter((e) => !e.landed).length;
  }
  update(e) {
    this.watchFrameRate(e);
    const s = xs[this.speed];
    for (const t of this.marbles) {
      if (t.landed) {
        t.age += e;
        continue;
      }
      const o = t.shot.motion?.[t.step]?.pace ?? 1;
      for (t.u += e / (s * o); t.u >= 1 && t.step < t.shot.rows; )
        t.u -= 1, t.step += 1;
      t.step >= t.shot.rows && (t.landed = !0, t.u = 1, t.age = 0, this.pulses.set(t.shot.bucket, 0.45), this.onLand?.(t.shot)), this.placeMarble(t);
    }
    this.marbles = this.marbles.filter((t) => {
      if (!t.landed || t.age < 0.45) return !0;
      const o = t.mesh.material;
      Array.isArray(o) || o.dispose();
      const i = t.shadow.material;
      return Array.isArray(i) || i.dispose(), this.board.remove(t.mesh), this.board.remove(t.shadow), !1;
    });
    for (const [t, o] of this.pulses) {
      const i = o - e, n = this.bucketMeshes[t];
      if (n) {
        const l = i > 0 ? 1 + i / 0.45 * 0.12 : 1;
        n.scale.set(l, l, 1);
      }
      i <= 0 ? this.pulses.delete(t) : this.pulses.set(t, i);
    }
    for (const [t, o] of this.pegFlash) {
      const [i, n] = t.split(":").map(Number), l = this.pegMeshes[i ?? -1]?.[n ?? -1], a = o - e;
      l && l.scale.setScalar(a > 0 ? 1.35 : 1), a <= 0 ? this.pegFlash.delete(t) : this.pegFlash.set(t, a);
    }
    this.composer && this.fancy ? this.composer.render(e) : this.renderer.render(this.scene, this.camera);
  }
  destroy() {
    this.composer?.dispose(), this.bokeh?.dispose();
    for (const e of this.marbles) {
      const s = e.mesh.material;
      Array.isArray(s) || s.dispose();
      const t = e.shadow.material;
      Array.isArray(t) || t.dispose();
    }
    for (const e of this.layoutOwned) e.dispose();
    for (const e of this.owned) e.dispose();
    this.owned.length = 0, this.renderer.dispose(), this.renderer.forceContextLoss(), this.renderer.domElement.remove();
  }
  enableDepthOfField() {
    const e = new ds(this.renderer);
    e.addPass(new ms(this.scene, this.camera));
    const s = new bs(this.scene, this.camera, {
      focus: 12,
      aperture: 45e-6,
      maxblur: 4e-3
    });
    e.addPass(s), e.addPass(new ps()), this.composer = e, this.bokeh = s;
  }
  dropFancy() {
    this.fancy && (this.fancy = !1, this.renderer.shadowMap.enabled = !1, this.sun.castShadow = !1, this.composer = null, this.bokeh?.dispose(), this.bokeh = null, this.resize(this.width, this.height));
  }
  watchFrameRate(e) {
    if (!this.fancy || (this.fpsTime += e, this.fpsFrames += 1, this.fpsTime < 1)) return;
    const s = this.fpsFrames / this.fpsTime;
    this.fpsTime = 0, this.fpsFrames = 0, s < 30 && this.dropFancy();
  }
  disposeLayout() {
    for (const e of [...this.board.children])
      this.marbles.some((s) => s.mesh === e || s.shadow === e) || this.board.remove(e);
    for (const e of this.layoutOwned) e.dispose();
    this.layoutOwned.length = 0, this.bucketMeshes = [], this.pegMeshes = [];
  }
  rebuild() {
    this.disposeLayout();
    const { span: e, spacing: s, rowGap: t, topZ: o, depth: i } = this.measure();
    this.frame = { span: e, spacing: s, rowGap: t, topZ: o, depth: i };
    const n = this.woodMaterial(), l = new R(new Ae(e + 0.7, 0.2, i + 0.35, 2, 0.06), n);
    l.position.y = -0.1, l.receiveShadow = !0, l.castShadow = this.fancy, this.board.add(l), this.layoutOwned.push(l.geometry), this.addRail(n, e, i), this.addPosts(e, i), this.addPegs(), this.addBuckets(), this.built = !0, this.frameCamera();
    for (const a of this.marbles) this.placeMarble(a);
  }
  measure() {
    const s = 10.2 / (this.rows + 1), t = s * 0.9, o = this.rows * t / 2, i = this.rows * t + s * 1.05;
    return { span: 10.2, spacing: s, rowGap: t, topZ: o, depth: i };
  }
  addRail(e, s, t) {
    const n = new re(0.2, 0.26, t + 0.2), l = new re(s + 0.2, 0.26, 0.2);
    this.layoutOwned.push(n, l);
    const a = 0.26 / 2, u = s / 2 + 0.2 / 2, c = t / 2;
    for (const M of [
      new R(n, e),
      new R(n, e),
      new R(l, e),
      new R(l, e)
    ])
      M.castShadow = this.fancy, M.receiveShadow = !0, this.board.add(M);
    const [p, h, f, d] = this.board.children.slice(-4);
    !p || !h || !f || !d || (p.position.set(-u, a, 0), h.position.set(u, a, 0), f.position.set(0, a, c), d.position.set(0, a, -c));
  }
  addPosts(e, s) {
    const t = new pt(0.07, 0.07, 0.85, 16), o = new W({
      map: ks(),
      roughness: 0.45,
      metalness: 0.02
    });
    this.layoutOwned.push(t, o, o.map);
    const i = e / 2 + 0.55, n = s / 2 - 0.15;
    for (const l of [-i, i])
      for (const a of [-n, n]) {
        const u = new R(t, o);
        u.position.set(l, 0.42, a), u.castShadow = this.fancy, u.receiveShadow = !0, this.board.add(u);
      }
  }
  addPegs() {
    const { rowGap: e, topZ: s } = this.frame, t = this.frame.spacing * ne, o = new mt(t, t * 0.55, 5, 14);
    this.pegMeshes = [], this.layoutOwned.push(o);
    const i = vs.map(
      (l) => new W({
        color: l,
        roughness: 0.62,
        metalness: 0
      })
    );
    this.layoutOwned.push(...i);
    let n = 0;
    for (let l = 0; l < this.rows; l += 1) {
      const a = 3 + l, u = s - (l + 1) * e;
      for (let c = 0; c < a; c += 1) {
        const p = i[n % i.length];
        if (n += 1, !p) continue;
        const h = new R(o, p);
        h.position.set(this.pegX(l, c), t * 1.3, u);
        const f = this.pegMeshes[l] ?? [];
        f[c] = h, this.pegMeshes[l] = f, h.castShadow = this.fancy, h.receiveShadow = !0, this.board.add(h);
      }
    }
  }
  addBuckets() {
    const e = ge(this.rows, this.risk), { spacing: s } = this.frame, t = this.zAt(this.rows) - s * 0.48, o = Math.max(0.72, s * 1.15), i = new Ae(s * 0.94, o, s * 0.82, 3, 0.1);
    this.layoutOwned.push(i);
    for (let n = 0; n < e.length; n += 1) {
      const l = Ot(n, e.length), a = Ss(ae(e[n] ?? 0), l), u = new W({
        color: $e(l),
        roughness: 0.62,
        metalness: 0
      }), c = new R(i, u), p = this.pegX(this.rows - 1, n), h = this.pegX(this.rows - 1, n + 1);
      c.position.set((p + h) / 2, o / 2, t), c.castShadow = this.fancy, c.receiveShadow = !0, this.board.add(c), this.bucketMeshes.push(c), this.layoutOwned.push(u, a);
      const f = new R(
        new gt(s * 0.9, s * 0.62),
        new _e({ map: a, side: bt, toneMapped: !1 })
      );
      f.rotation.x = -Math.PI / 2, f.position.set(c.position.x, o + 0.03, t), this.board.add(f), this.layoutOwned.push(f.geometry, f.material);
    }
  }
  placeMarble(e) {
    const s = Math.min(e.step, Math.max(0, e.shot.rows - 1)), t = e.landed || e.step >= e.shot.rows ? 1 : e.u, o = Qt(
      e.shot.rows,
      e.shot.path,
      s,
      t,
      ne,
      le,
      e.shot.motion?.[s]
    );
    o.hit && this.pegFlash.set(`${o.hit.row}:${o.hit.index}`, 0.22);
    const { spacing: i, topZ: n, rowGap: l } = this.frame, a = -this.frame.span / 2 + o.x * i, u = n - o.y * l, c = i * le, p = o.hit ? c * 0.15 : c * 0.55 * Math.sin(Math.PI * t);
    e.mesh.position.set(a, c + p, u), e.mesh.rotation.z = -o.x * 0.8, e.mesh.rotation.x = o.y * 0.8;
    const h = c / 0.2;
    e.mesh.scale.set(h, h, h), e.shadow.position.set(a, 0.02, u), e.shadow.scale.set(h, h, 1);
    const f = e.shadow.material;
    Array.isArray(f) || (f.opacity = o.hit ? 0.45 : 0.28);
  }
  pegX(e, s) {
    const t = 3 + e, o = (this.rows + 2 - t) / 2 * this.frame.spacing;
    return -this.frame.span / 2 + o + s * this.frame.spacing;
  }
  zAt(e) {
    return this.frame.topZ - e * this.frame.rowGap;
  }
  frameCamera() {
    const { span: e, topZ: s, rowGap: t } = this.frame, o = this.zAt(this.rows) - this.frame.spacing * 0.7, i = s + t * 0.2, n = (o + i) / 2, l = 60 * Math.PI / 180, a = 30 * Math.PI / 180;
    this.camera.fov = 30;
    const u = Math.max(0.35, this.width / Math.max(1, this.height)), c = 2 * Math.atan(Math.tan(a / 2) * u), h = (e / 2 + 0.22) / Math.tan(c / 2) / 0.9, f = new O(0, 0.15, n);
    this.camera.position.set(0, Math.sin(l) * h, n - Math.cos(l) * h), this.camera.lookAt(f), this.camera.updateProjectionMatrix(), this.glint.position.copy(this.camera.position).add(new O(-0.8, 0.4, 0.6));
    const d = this.bokeh?.uniforms;
    d?.focus && (d.focus.value = this.camera.position.distanceTo(f));
  }
  ensureBall() {
    return this.ballGeometry ? this.ballGeometry : (this.ballGeometry = new vt(0.33, 40, 28), this.owned.push(this.ballGeometry), this.ballGeometry);
  }
  marbleMaterial() {
    return this.fancy ? new xt({
      color: 16251903,
      metalness: 0,
      roughness: 0.02,
      transmission: 0.92,
      thickness: 0.55,
      ior: 1.52,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      reflectivity: 1,
      transparent: !0
    }) : new W({
      color: 16055295,
      roughness: 0.08,
      metalness: 0.15
    });
  }
  shadowGeometry() {
    const e = this.owned.find((t) => t instanceof te);
    if (e instanceof te) return e;
    const s = new te(0.3, 24);
    return this.owned.push(s), s;
  }
  woodMaterial() {
    const e = Cs(), s = new W({ map: e, roughness: 0.78, metalness: 0.02 });
    return this.layoutOwned.push(s, e), s;
  }
}
function ys() {
  const r = navigator, e = r.hardwareConcurrency ?? 8, s = r.deviceMemory ?? 8;
  return e <= 4 || s <= 4;
}
function Cs() {
  const r = document.createElement("canvas");
  r.width = 256, r.height = 256;
  const e = r.getContext("2d");
  if (!e) throw new Error("wood");
  e.fillStyle = "#c4894a", e.fillRect(0, 0, 256, 256);
  for (let t = 0; t < 256; t += 2) {
    const o = 70 + t * 13 % 70;
    e.strokeStyle = `rgba(${o + 40}, ${Math.max(20, o - 10)}, ${Math.max(8, o - 40)}, 0.35)`, e.lineWidth = 1 + t * 5 % 3, e.beginPath(), e.moveTo(0, t), e.bezierCurveTo(80, t + (t % 7 - 3), 160, t - (t % 5 - 2), 256, t + (t % 4 - 1)), e.stroke();
  }
  const s = new fe(r);
  return s.colorSpace = J, s.wrapS = X, s.wrapT = X, s.repeat.set(2, 2), s;
}
function ks() {
  const r = document.createElement("canvas");
  r.width = 64, r.height = 128;
  const e = r.getContext("2d");
  if (!e) throw new Error("cane");
  for (let t = -4; t < 8; t += 1)
    e.fillStyle = t % 2 === 0 ? "#f4f7f8" : "#d7263d", e.beginPath(), e.moveTo(t * 16, 0), e.lineTo(t * 16 + 16, 0), e.lineTo(t * 16 + 48, 128), e.lineTo(t * 16 + 32, 128), e.closePath(), e.fill();
  const s = new fe(r);
  return s.colorSpace = J, s.wrapS = X, s.wrapT = X, s;
}
function $e(r) {
  const e = r.match(/hsl\(([-\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)/), s = new Y();
  return e ? (s.setHSL(Number(e[1]) / 360, Number(e[2]) / 100, Number(e[3]) / 100), s) : s.set("#888888");
}
function Ss(r, e) {
  const s = document.createElement("canvas");
  s.width = 512, s.height = 256;
  const t = s.getContext("2d");
  if (!t) throw new Error("label");
  const o = `#${$e(e).getHexString()}`;
  t.fillStyle = o, t.fillRect(0, 0, 512, 256), t.fillStyle = "#1a120c", t.font = "800 150px Outfit, sans-serif", t.textAlign = "center", t.textBaseline = "middle", t.fillText(r, 256, 136);
  const i = new fe(s);
  return i.colorSpace = J, i.center.set(0.5, 0.5), i.rotation = Math.PI, i.needsUpdate = !0, i;
}
function Rs() {
  return Jt({
    manifest: Pt,
    title: "木珠",
    gameAttr: "wgf-game:plinko-3d",
    extraClass: "plinko3d",
    createBoard: (r) => new ws(r)
  });
}
export {
  Rs as createGame,
  Pt as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"three":"0.170.0","@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
