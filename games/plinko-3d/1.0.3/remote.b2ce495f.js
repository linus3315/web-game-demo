var Ht = Object.defineProperty;
var Wt = (r, t, s) => t in r ? Ht(r, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : r[t] = s;
var x = (r, t, s) => Wt(r, typeof t != "symbol" ? t + "" : t, s);
import { BoxGeometry as it, Vector3 as q, Mesh as E, OrthographicCamera as Vt, BufferGeometry as Zt, Float32BufferAttribute as xt, ShaderMaterial as at, UniformsUtils as ut, Vector2 as yt, WebGLRenderTarget as Pt, HalfFloatType as Rt, NoBlending as At, Clock as Qt, RawShaderMaterial as jt, ColorManagement as Kt, SRGBTransfer as Xt, LinearToneMapping as Yt, ReinhardToneMapping as Jt, CineonToneMapping as te, ACESFilmicToneMapping as ee, AgXToneMapping as se, NeutralToneMapping as oe, Color as tt, NearestFilter as wt, MeshDepthMaterial as re, RGBADepthPacking as ie, Scene as ae, Group as ne, WebGLRenderer as le, SRGBColorSpace as et, PCFSoftShadowMap as ce, PerspectiveCamera as he, HemisphereLight as ue, DirectionalLight as Ct, PointLight as de, MeshBasicMaterial as kt, MeshStandardMaterial as W, CylinderGeometry as fe, CapsuleGeometry as pe, PlaneGeometry as me, DoubleSide as ge, SphereGeometry as be, MeshPhysicalMaterial as ve, CircleGeometry as st, CanvasTexture as dt, RepeatWrapping as J } from "three";
import { registerStrings as xe, defineGame as ye, bindVisualViewport as we, patchGame as Ce, t as ke } from "@wgf/core";
import { TokenStore as Se, HttpClient as Me } from "@wgf/net";
const _e = {
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
}, Te = {
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
  art: _e,
  renderer: "three",
  controls: "pointer",
  tags: ["弹珠", "联网"],
  theme: { accent: "#f0a04b", accentInk: "#2a160c", glow: "#e23b3b", radius: 18, font: "sans" }
}, ft = 8, pt = 16, B = [10, 20, 50, 100], Pe = ["low", "mid", "high"], Dt = [
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
function Et(r, t) {
  let s = 1;
  for (let e = 1; e <= t; e += 1) s = s * (r - t + e) / e;
  return s;
}
function ot(r) {
  const t = r.length - 1, s = 2 ** t;
  let e = 0;
  for (let o = 0; o < r.length; o += 1)
    e += Et(t, o) / s * (r[o] ?? 0);
  return e;
}
function Re(r, t, s, e) {
  const o = r / 2;
  return Array.from({ length: r + 1 }, (i, l) => {
    const n = o === 0 ? 0 : Math.abs(l - o) / o;
    return s * (t / s) ** n ** e;
  });
}
function Ae(r) {
  return r >= 100 ? Math.max(1, Math.round(r)) : Math.max(0.1, Math.round(r * 10) / 10);
}
function De(r) {
  const t = r.length - 1, s = r.slice();
  for (let e = 0; e <= t; e += 1) {
    const o = Ae(((s[e] ?? 0) + (s[t - e] ?? 0)) / 2);
    s[e] = o, s[t - e] = o;
  }
  return s;
}
function Ee(r) {
  const t = r / 2, s = [];
  for (let e = 0; e <= r; e += 1) Math.abs(e - t) <= 0.5 && s.push(e);
  return s;
}
function Le(r, t, s, e) {
  const o = Re(r, t, s, e), i = De(o.map((c) => c * (0.99 / ot(o)))), l = Ee(r);
  let n = i, a = Math.abs(ot(n) - 0.99);
  for (let c = -20; c <= 20; c += 1) {
    const h = i.slice(), m = i[l[0] ?? 0] ?? 0, d = Math.max(0.1, Math.round((m + c * 0.1) * 10) / 10);
    for (const u of l) h[u] = d;
    const f = Math.abs(ot(h) - 0.99);
    f < a && (a = f, n = h);
  }
  return n;
}
function Ne() {
  const r = {
    low: [18, 1.05, 2.2],
    mid: [160, 0.45, 1.65],
    high: [700, 0.2, 1.25]
  }, t = { low: {}, mid: {}, high: {} };
  for (const s of Pe) {
    const e = r[s];
    for (let o = ft; o <= pt; o += 1)
      t[s][o] = Le(o, e[0], e[1], e[2]);
  }
  return t.high[16] = Dt, t;
}
const St = Ne();
function mt(r, t) {
  return St[t][r] ?? St.mid[16] ?? Dt;
}
function Ue(r) {
  return Number.isInteger(r) && r >= ft && r <= pt;
}
function Ie(r) {
  return r === "low" || r === "mid" || r === "high";
}
function Be(r) {
  return B.includes(r);
}
function nt(r) {
  return r >= 1e3 ? "1kx" : r >= 100 ? `${Math.round(r)}x` : `${r.toFixed(1)}x`;
}
function Fe(r, t) {
  const s = (t - 1) / 2, e = s === 0 ? 0 : Math.abs(r - s) / s, o = 168 - e * 164, i = 52 + e * 26, l = 64 - e * 12;
  return `hsl(${o.toFixed(1)} ${i.toFixed(1)}% ${l.toFixed(1)}%)`;
}
const Y = 1e3;
function V() {
  return { credits: Y };
}
function Oe(r, t) {
  const s = 2 ** r, e = t() * s;
  let o = 0;
  for (let i = 0; i <= r; i += 1)
    if (o += Et(r, i), e < o) return i;
  return r;
}
function Ge(r, t, s, e, o, i) {
  if (!Be(t)) return { error: "bad_bet" };
  if (!Ue(s)) return { error: "bad_rows" };
  if (!Ie(e)) return { error: "bad_risk" };
  if (r.credits < t) return { error: "insufficient" };
  const l = mt(s, e), n = typeof i == "number" && Number.isInteger(i) && i >= 0 && i <= s ? i : Oe(s, o), a = l[n] ?? 0, c = Math.round(t * a);
  return r.credits -= t, r.credits += c, { rows: s, risk: e, bet: t, bucket: n, multiplier: a, win: c, credits: r.credits };
}
const ze = 0.63;
function qe(r, t, s) {
  let e = Math.max(0, Math.min(r, Math.floor(t))), o = r - e;
  const i = [];
  let l = null;
  for (let n = 0; n < r; n += 1) {
    let a;
    if (e <= 0) a = "L";
    else if (o <= 0) a = "R";
    else if (l === null) a = s() < e / (e + o) ? "R" : "L";
    else {
      const c = l === "R" ? "L" : "R";
      a = (s() < ze ? l : c) === "R" ? e > 0 ? "R" : "L" : o > 0 ? "L" : "R";
    }
    i.push(a), a === "R" ? e -= 1 : o -= 1, l = a;
  }
  return i;
}
const lt = 0.13, ct = 0.2, ht = 0.92;
function $e(r, t) {
  const s = [];
  let e = 1, o = 0;
  for (const i of r) {
    const l = i === "R" ? 1 : -1, n = 0.75 + t() * 0.55, a = 0.8 + t() * 0.42;
    e = e * 0.45 + a * 0.55, o = Math.max(-0.75, Math.min(0.75, o * 0.5 + l * (0.28 + t() * 0.35)));
    const c = t(), h = c < 0.08 ? "double" : c < 0.18 ? "skim" : "none";
    s.push({ hop: n, pace: e, flourish: h, vx: o });
  }
  return s;
}
function He(r, t, s) {
  return { x: (r - 1 - t) / 2 + s, y: t + 1 };
}
function Lt(r, t) {
  return r + t;
}
function Nt(r) {
  return r === "R" ? 1 : -1;
}
function Ut(r, t, s, e) {
  return {
    x: r.x + s * Math.sin(t) * e,
    y: r.y - Math.cos(t) * e / ht
  };
}
function It(r, t) {
  let s = 0;
  for (let e = 0; e < t; e += 1) r[e] === "R" && (s += 1);
  return s;
}
function Bt(r, t, s) {
  const e = s[t] === "R" ? "R" : "L", o = It(s, t) + 1;
  return { peg: He(r, t, o), index: o, dir: e };
}
function We(r, t) {
  const s = r.x - t.x, e = (r.y - t.y) * ht, o = Math.hypot(s, e) || 1;
  return { x: s / o, y: e / o / ht };
}
const Ft = 1.02;
function Ve(r, t, s, e, o = lt, i = ct, l) {
  const n = Math.max(0, Math.min(r - 1, s)), a = Math.max(0, Math.min(1, e)), c = Lt(o, i), h = Bt(r, n, t), m = Nt(h.dir), d = l?.flourish ?? "none", u = (l?.hop ?? 1) * (1 - n * 0.012) * (d === "skim" ? 0.7 : 1), _ = l?.vx ?? 0, v = Ut(h.peg, Ft, m, c), w = { x: v.x, y: v.y - 0.42 }, F = We(v, h.peg), O = {
    x: v.x + F.x * 0.16 * u + m * 0.04 * u + _ * 0.012,
    y: v.y - 0.34 * u
  }, R = { x: h.peg.x + m * 0.55, y: h.peg.y + 0.46 }, Q = Ze(r, t, n, o, i), $ = { row: n, index: h.index }, A = 0.24, L = d === "double" ? 0.46 : A;
  if (a <= A) {
    const k = a / A, T = k * k;
    return {
      x: w.x + (v.x - w.x) * T,
      y: w.y + (v.y - w.y) * T,
      hit: k > 0.84 ? $ : null,
      squash: k > 0.84 ? 0.84 : 1,
      pop: 0
    };
  }
  if (d === "double" && a <= L) {
    const k = (a - A) / (L - A), T = Math.sin(Math.PI * k);
    return {
      x: v.x + F.x * 0.08 * u * T,
      y: v.y - 0.14 * u * T,
      hit: k < 0.14 || k > 0.86 ? $ : null,
      squash: k < 0.14 || k > 0.86 ? 0.84 : 1,
      pop: T * 0.6
    };
  }
  if (a <= L + 0.2) {
    const k = (a - L) / 0.2, T = Math.sin(k * Math.PI / 2);
    return {
      x: v.x + (O.x - v.x) * T,
      y: v.y + (O.y - v.y) * T,
      hit: k < 0.12 ? $ : null,
      squash: k < 0.12 ? 0.84 : 1,
      pop: T
    };
  }
  const S = L + 0.2, N = S + (1 - S) * 0.4;
  if (a <= N) {
    const k = (a - S) / (N - S), T = k * k;
    return {
      x: O.x + (R.x - O.x) * T,
      y: O.y + (R.y - O.y) * T,
      hit: null,
      squash: 1,
      pop: 1 - k * 0.35
    };
  }
  const H = (a - N) / (1 - N), j = H * H;
  return {
    x: R.x + (Q.x - R.x) * j,
    y: R.y + (Q.y - R.y) * j,
    hit: null,
    squash: 1,
    pop: 0.65 * (1 - H)
  };
}
function Ze(r, t, s, e, o) {
  const l = It(t, s) + (t[s] === "R" ? 1 : 0);
  if (s + 1 >= r) return { x: l + 0.5, y: r + 1.35 };
  const n = Bt(r, s + 1, t), a = Ut(n.peg, Ft, Nt(n.dir), Lt(e, o));
  return { x: a.x, y: a.y - 0.5 };
}
function Qe() {
  xe("plinko", {
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
const je = {}, rt = "wgf:slots-wallet", Ot = "wgf:slots-token", Ke = "wgf:session";
function Xe(r) {
  Qe();
  let t = null;
  const s = [];
  let e = null, o = null, i = V(), l = Y, n = 20, a = 16, c = "high", h = "normal", m = !1, d = "pending", f = !1, u = "ready", _ = -1, v = -1, w = 0;
  const F = [], O = /* @__PURE__ */ new Set();
  let R = null, Q = !1, $ = 0, A = () => {
  };
  function L(b, p) {
    return ke(t?.store.getState().ui.locale ?? "zh", b, p);
  }
  function S() {
    if (!e) return;
    const b = e.querySelector("[data-credits]"), p = e.querySelector("[data-amount]"), C = e.querySelector("[data-row-label]"), P = e.querySelector("[data-demo]"), I = e.querySelector("[data-source]");
    b && (b.textContent = String(l)), p && (p.textContent = String(n)), C && (C.textContent = String(a)), P && (P.hidden = d !== "local"), I && (I.textContent = L(d === "server" ? "plinko.server" : d === "local" ? "plinko.local" : "plinko.pending")), e.dataset.rows = String(a), e.dataset.risk = c, e.dataset.pace = h, e.dataset.pegs = String(a + 2), e.dataset.buckets = String(a + 1), _ >= 0 && (e.dataset.bucket = String(_)), v >= 0 && (e.dataset.landed = String(v)), e.dataset.round = o && o.inflight > 0 ? "busy" : "open";
    const M = B.indexOf(n), g = e.querySelector("[data-bet-dec]"), z = e.querySelector("[data-bet-inc]");
    g && (g.disabled = M <= 0), z && (z.disabled = M >= B.length - 1), e.querySelectorAll("[data-bet]").forEach((y) => {
      y.classList.toggle("is-bet", Number(y.dataset.bet) === n);
    }), e.querySelectorAll("[data-speed]").forEach((y) => {
      y.classList.toggle("is-on", y.dataset.speed === h);
    }), e.querySelectorAll("[data-risk-pick]").forEach((y) => {
      y.classList.toggle("is-on", y.dataset.riskPick === c);
    });
    const U = e.querySelector("[data-drop]");
    U && (U.disabled = !f || u !== "running" || l < n);
    const G = e.querySelector("[data-auto]");
    G && G.setAttribute("aria-pressed", m ? "true" : "false");
    const K = e.querySelector("[data-history]");
    K && K.replaceChildren(
      ...F.slice(0, 8).map((y) => {
        const vt = document.createElement("span");
        return vt.textContent = nt(y), vt;
      })
    ), o?.setLayout(a, c), o?.setSpeed(h), e.dataset.seq = String($), $t(e);
  }
  function N() {
    t && Ce(t.store, {
      id: r.manifest.id,
      status: u,
      score: Math.max(0, l - Y),
      highScore: Math.max(0, l),
      message: "",
      detail: L(d === "server" ? "plinko.server" : "plinko.local"),
      credits: l
    });
  }
  function H() {
    d === "local" && localStorage.setItem(rt, JSON.stringify(i));
  }
  function j() {
    try {
      const b = localStorage.getItem(rt);
      if (!b) return V();
      const p = JSON.parse(b);
      return !p || typeof p.credits != "number" ? V() : { credits: Math.max(0, Math.floor(p.credits)) };
    } catch {
      return V();
    }
  }
  async function k() {
    if (!await os()) {
      d = "local", i = j(), l = i.credits, f = !0, N(), S();
      return;
    }
    try {
      const p = await Mt().post("/api/plinko/session", {});
      p.walletToken && localStorage.setItem(Ot, p.walletToken), Q = p.demo === !0, d = "server", i = { credits: p.credits }, l = p.credits;
    } catch {
      d = "local", i = j(), l = i.credits;
    }
    f = !0, N(), S();
  }
  async function T() {
    if (!f || u !== "running" || l < n) return;
    const b = ts();
    if (O.has(b)) return;
    const p = { bet: n, rows: a, risk: c }, C = bt() ? R : null;
    let P;
    if (d === "server")
      try {
        const g = await Mt().post("/api/plinko/drop", {
          bet: p.bet,
          spinId: b,
          rows: p.rows,
          risk: p.risk,
          ...C !== null ? { bucket: C } : {}
        });
        P = g, i = { credits: g.credits };
      } catch {
        return;
      }
    else {
      const g = Ge(
        i,
        p.bet,
        p.rows,
        p.risk,
        Math.random,
        C
      );
      if ("error" in g) return;
      P = g, H();
    }
    O.add(b), l -= p.bet, _ = P.bucket;
    const I = qe(p.rows, P.bucket, Math.random), M = {
      path: I,
      rows: p.rows,
      bet: p.bet,
      bucket: P.bucket,
      multiplier: P.multiplier,
      win: P.win,
      motion: $e(I, Math.random)
    };
    o?.launch(M), N(), S();
  }
  function qt(b) {
    l += b.win, v = b.bucket, $ += 1, F.unshift(b.multiplier), F.length > 8 && (F.length = 8), l < B[0] && (!o || o.inflight === 0) && (m = !1, u = "over"), N(), S();
  }
  function bt() {
    return Ye() && (d === "local" || Q);
  }
  function $t(b) {
    const p = b.querySelector("[data-debug]");
    p && (p.hidden = !bt());
    const C = b.querySelector("[data-debug-result]");
    if (!C) return;
    const P = `${a}:${c}`;
    if (C.dataset.key === P) return;
    const I = mt(a, c), M = R, g = document.createElement("option");
    g.value = "random", g.textContent = "随机";
    const z = [g];
    for (let U = 0; U <= a; U += 1) {
      const G = document.createElement("option");
      G.value = String(U), G.textContent = `${U} ${nt(I[U] ?? 0)}`, z.push(G);
    }
    C.replaceChildren(...z), C.dataset.key = P, M !== null && M <= a ? (R = M, C.value = String(M)) : (R = null, C.value = "random");
  }
  return ye(r.manifest, {
    async onPreload(b, p) {
      await b.preload([], p);
    },
    async onMount(b) {
      t = b, b.container.setAttribute("data-wgf-game", r.gameAttr), e = document.createElement("div"), e.className = r.extraClass ? `plinko ${r.extraClass}` : "plinko", e.innerHTML = Je(r.title);
      const p = e.querySelector("[data-board]");
      p instanceof HTMLElement && (o = r.createBoard(p), o.onLand = qt, o.setLayout(a, c)), b.container.appendChild(e);
      const C = e;
      C.addEventListener("change", (M) => {
        const g = M.target;
        !(g instanceof HTMLSelectElement) || !g.matches("[data-debug-result]") || (R = g.value === "random" ? null : Number(g.value));
      }), C.addEventListener("click", (M) => {
        const g = M.target;
        if (!(g instanceof Element)) return;
        if (g.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        const z = g.closest("[data-bet]"), U = z instanceof HTMLElement ? Number(z.dataset.bet) : Number.NaN;
        if (B.includes(U)) {
          n = U, C.classList.remove("is-bets"), S();
          return;
        }
        if (g.closest("[data-bet-dec]")) {
          const y = B[B.indexOf(n) - 1];
          y !== void 0 && (n = y), C.classList.remove("is-bets"), S();
          return;
        }
        if (g.closest("[data-bet-inc]")) {
          const y = B[B.indexOf(n) + 1];
          y !== void 0 && (n = y), C.classList.remove("is-bets"), S();
          return;
        }
        if (g.closest("[data-amount-bar]")) {
          C.classList.toggle("is-bets");
          return;
        }
        if (C.classList.contains("is-bets") && !g.closest("[data-bet-ui]") && C.classList.remove("is-bets"), g.closest("[data-row-dec]") && (!o || o.inflight === 0)) {
          a > ft && (a -= 1), S(), A();
          return;
        }
        if (g.closest("[data-row-inc]") && (!o || o.inflight === 0)) {
          a < pt && (a += 1), S(), A();
          return;
        }
        const G = g.closest("[data-risk-pick]");
        if (G instanceof HTMLElement && (!o || o.inflight === 0)) {
          const y = G.dataset.riskPick;
          (y === "low" || y === "mid" || y === "high") && (c = y), S();
          return;
        }
        const K = g.closest("[data-speed]");
        if (K instanceof HTMLElement) {
          const y = K.dataset.speed;
          (y === "normal" || y === "fast" || y === "turbo") && (h = y), S();
          return;
        }
        if (g.closest("[data-auto]")) {
          m = !m, w = 0, S(), m && T();
          return;
        }
        g.closest("[data-drop]") && T();
      }), A = () => {
        const M = e?.querySelector("[data-board]");
        !(M instanceof HTMLElement) || !o || o.resize(M.clientWidth, M.clientHeight);
      }, A();
      const P = new ResizeObserver(() => A()), I = e.querySelector("[data-board]");
      I && P.observe(I), s.push(() => P.disconnect()), s.push(we(() => A())), s.push(
        b.loop.onUpdate((M) => {
          o?.update(M), m && u === "running" && (!o || o.inflight < 6) && (w -= M, w <= 0 && l >= n && (w = h === "turbo" ? 0.12 : h === "fast" ? 0.28 : 0.45, T()));
        })
      ), b.events.on("game:start", () => {
        u === "ready" && (u = "running", N(), S());
      }), b.events.on("game:restart", () => {
        i = d === "local" ? V() : i, d === "local" && (localStorage.removeItem(rt), i = V(), H()), l = d === "server" ? i.credits : Y, d === "server" ? k() : l = Y, m = !1, F.length = 0, _ = -1, v = -1, u = "running", N(), S();
      }), S(), k();
    },
    onDestroy() {
      for (const b of s) b();
      s.length = 0, o?.destroy(), o = null, e?.remove(), e = null, t = null;
    }
  });
}
function Ye() {
  try {
    const r = new URL(location.href);
    if (r.searchParams.get("debug") === "1") return !0;
    const t = r.hash, s = t.indexOf("?");
    if (s >= 0 && new URLSearchParams(t.slice(s + 1)).get("debug") === "1") return !0;
  } catch {
    return !1;
  }
  return !1;
}
function Je(r) {
  const t = B.map(
    (o) => `<button type="button" data-bet="${o}">${o}</button>`
  ).join(""), s = ["normal", "fast", "turbo"].map(
    (o) => `<button type="button" data-speed="${o}">${o === "normal" ? "普通" : o === "fast" ? "快速" : "极速"}</button>`
  ).join(""), e = ["low", "mid", "high"].map(
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
        <div class="plinko-betlist" data-bet-sheet>${t}</div>
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
        <div class="plinko-seg">${e}</div>
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
function ts() {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function Mt() {
  const r = new Se(), t = es(), s = ss();
  if (t) r.set({ accessToken: t });
  else if (s?.accessToken && !s.accessToken.startsWith("local."))
    r.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const e = localStorage.getItem(Ot);
    e?.startsWith("v1w.") && r.set({ accessToken: e });
  }
  return new Me({ baseUrl: Gt(), tokens: r, timeoutMs: 2500 });
}
function es() {
  try {
    const r = sessionStorage.getItem("wgf:launch-token");
    return r && r.length >= 8 ? r : null;
  } catch {
    return null;
  }
}
function ss() {
  try {
    const r = localStorage.getItem(Ke);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}
function Gt() {
  return je?.VITE_API_BASE || "http://127.0.0.1:8787";
}
async function os() {
  try {
    return (await fetch(`${Gt()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
const X = new q();
function D(r, t, s, e, o, i) {
  const l = 2 * Math.PI * o / 4, n = Math.max(i - 2 * o, 0), a = Math.PI / 4;
  X.copy(t), X[e] = 0, X.normalize();
  const c = 0.5 * l / (l + n), h = 1 - X.angleTo(r) / a;
  return Math.sign(X[s]) === 1 ? h * c : n / (l + n) + c + c * (1 - h);
}
class _t extends it {
  constructor(t = 1, s = 1, e = 1, o = 2, i = 0.1) {
    if (o = o * 2 + 1, i = Math.min(t / 2, s / 2, e / 2, i), super(1, 1, 1, o, o, o), o === 1) return;
    const l = this.toNonIndexed();
    this.index = null, this.attributes.position = l.attributes.position, this.attributes.normal = l.attributes.normal, this.attributes.uv = l.attributes.uv;
    const n = new q(), a = new q(), c = new q(t, s, e).divideScalar(2).subScalar(i), h = this.attributes.position.array, m = this.attributes.normal.array, d = this.attributes.uv.array, f = h.length / 6, u = new q(), _ = 0.5 / o;
    for (let v = 0, w = 0; v < h.length; v += 3, w += 2)
      switch (n.fromArray(h, v), a.copy(n), a.x -= Math.sign(a.x) * _, a.y -= Math.sign(a.y) * _, a.z -= Math.sign(a.z) * _, a.normalize(), h[v + 0] = c.x * Math.sign(n.x) + a.x * i, h[v + 1] = c.y * Math.sign(n.y) + a.y * i, h[v + 2] = c.z * Math.sign(n.z) + a.z * i, m[v + 0] = a.x, m[v + 1] = a.y, m[v + 2] = a.z, Math.floor(v / f)) {
        case 0:
          u.set(1, 0, 0), d[w + 0] = D(u, a, "z", "y", i, e), d[w + 1] = 1 - D(u, a, "y", "z", i, s);
          break;
        case 1:
          u.set(-1, 0, 0), d[w + 0] = 1 - D(u, a, "z", "y", i, e), d[w + 1] = 1 - D(u, a, "y", "z", i, s);
          break;
        case 2:
          u.set(0, 1, 0), d[w + 0] = 1 - D(u, a, "x", "z", i, t), d[w + 1] = D(u, a, "z", "x", i, e);
          break;
        case 3:
          u.set(0, -1, 0), d[w + 0] = 1 - D(u, a, "x", "z", i, t), d[w + 1] = 1 - D(u, a, "z", "x", i, e);
          break;
        case 4:
          u.set(0, 0, 1), d[w + 0] = 1 - D(u, a, "x", "y", i, t), d[w + 1] = 1 - D(u, a, "y", "x", i, s);
          break;
        case 5:
          u.set(0, 0, -1), d[w + 0] = D(u, a, "x", "y", i, t), d[w + 1] = 1 - D(u, a, "y", "x", i, s);
          break;
      }
  }
}
const rs = {
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
class Z {
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
const is = new Vt(-1, 1, 1, -1, 0, 1);
class as extends Zt {
  constructor() {
    super(), this.setAttribute("position", new xt([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), this.setAttribute("uv", new xt([0, 2, 0, 0, 2, 0], 2));
  }
}
const ns = new as();
class gt {
  constructor(t) {
    this._mesh = new E(ns, t);
  }
  dispose() {
    this._mesh.geometry.dispose();
  }
  render(t) {
    t.render(this._mesh, is);
  }
  get material() {
    return this._mesh.material;
  }
  set material(t) {
    this._mesh.material = t;
  }
}
class ls extends Z {
  constructor(t, s) {
    super(), this.textureID = s !== void 0 ? s : "tDiffuse", t instanceof at ? (this.uniforms = t.uniforms, this.material = t) : t && (this.uniforms = ut.clone(t.uniforms), this.material = new at({
      name: t.name !== void 0 ? t.name : "unspecified",
      defines: Object.assign({}, t.defines),
      uniforms: this.uniforms,
      vertexShader: t.vertexShader,
      fragmentShader: t.fragmentShader
    })), this.fsQuad = new gt(this.material);
  }
  render(t, s, e) {
    this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = e.texture), this.fsQuad.material = this.material, this.renderToScreen ? (t.setRenderTarget(null), this.fsQuad.render(t)) : (t.setRenderTarget(s), this.clear && t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil), this.fsQuad.render(t));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class Tt extends Z {
  constructor(t, s) {
    super(), this.scene = t, this.camera = s, this.clear = !0, this.needsSwap = !1, this.inverse = !1;
  }
  render(t, s, e) {
    const o = t.getContext(), i = t.state;
    i.buffers.color.setMask(!1), i.buffers.depth.setMask(!1), i.buffers.color.setLocked(!0), i.buffers.depth.setLocked(!0);
    let l, n;
    this.inverse ? (l = 0, n = 1) : (l = 1, n = 0), i.buffers.stencil.setTest(!0), i.buffers.stencil.setOp(o.REPLACE, o.REPLACE, o.REPLACE), i.buffers.stencil.setFunc(o.ALWAYS, l, 4294967295), i.buffers.stencil.setClear(n), i.buffers.stencil.setLocked(!0), t.setRenderTarget(e), this.clear && t.clear(), t.render(this.scene, this.camera), t.setRenderTarget(s), this.clear && t.clear(), t.render(this.scene, this.camera), i.buffers.color.setLocked(!1), i.buffers.depth.setLocked(!1), i.buffers.color.setMask(!0), i.buffers.depth.setMask(!0), i.buffers.stencil.setLocked(!1), i.buffers.stencil.setFunc(o.EQUAL, 1, 4294967295), i.buffers.stencil.setOp(o.KEEP, o.KEEP, o.KEEP), i.buffers.stencil.setLocked(!0);
  }
}
class cs extends Z {
  constructor() {
    super(), this.needsSwap = !1;
  }
  render(t) {
    t.state.buffers.stencil.setLocked(!1), t.state.buffers.stencil.setTest(!1);
  }
}
class hs {
  constructor(t, s) {
    if (this.renderer = t, this._pixelRatio = t.getPixelRatio(), s === void 0) {
      const e = t.getSize(new yt());
      this._width = e.width, this._height = e.height, s = new Pt(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: Rt }), s.texture.name = "EffectComposer.rt1";
    } else
      this._width = s.width, this._height = s.height;
    this.renderTarget1 = s, this.renderTarget2 = s.clone(), this.renderTarget2.texture.name = "EffectComposer.rt2", this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = !0, this.passes = [], this.copyPass = new ls(rs), this.copyPass.material.blending = At, this.clock = new Qt();
  }
  swapBuffers() {
    const t = this.readBuffer;
    this.readBuffer = this.writeBuffer, this.writeBuffer = t;
  }
  addPass(t) {
    this.passes.push(t), t.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  insertPass(t, s) {
    this.passes.splice(s, 0, t), t.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  removePass(t) {
    const s = this.passes.indexOf(t);
    s !== -1 && this.passes.splice(s, 1);
  }
  isLastEnabledPass(t) {
    for (let s = t + 1; s < this.passes.length; s++)
      if (this.passes[s].enabled)
        return !1;
    return !0;
  }
  render(t) {
    t === void 0 && (t = this.clock.getDelta());
    const s = this.renderer.getRenderTarget();
    let e = !1;
    for (let o = 0, i = this.passes.length; o < i; o++) {
      const l = this.passes[o];
      if (l.enabled !== !1) {
        if (l.renderToScreen = this.renderToScreen && this.isLastEnabledPass(o), l.render(this.renderer, this.writeBuffer, this.readBuffer, t, e), l.needsSwap) {
          if (e) {
            const n = this.renderer.getContext(), a = this.renderer.state.buffers.stencil;
            a.setFunc(n.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, t), a.setFunc(n.EQUAL, 1, 4294967295);
          }
          this.swapBuffers();
        }
        Tt !== void 0 && (l instanceof Tt ? e = !0 : l instanceof cs && (e = !1));
      }
    }
    this.renderer.setRenderTarget(s);
  }
  reset(t) {
    if (t === void 0) {
      const s = this.renderer.getSize(new yt());
      this._pixelRatio = this.renderer.getPixelRatio(), this._width = s.width, this._height = s.height, t = this.renderTarget1.clone(), t.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.renderTarget1 = t, this.renderTarget2 = t.clone(), this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2;
  }
  setSize(t, s) {
    this._width = t, this._height = s;
    const e = this._width * this._pixelRatio, o = this._height * this._pixelRatio;
    this.renderTarget1.setSize(e, o), this.renderTarget2.setSize(e, o);
    for (let i = 0; i < this.passes.length; i++)
      this.passes[i].setSize(e, o);
  }
  setPixelRatio(t) {
    this._pixelRatio = t, this.setSize(this._width, this._height);
  }
  dispose() {
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.copyPass.dispose();
  }
}
const us = {
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
class ds extends Z {
  constructor() {
    super();
    const t = us;
    this.uniforms = ut.clone(t.uniforms), this.material = new jt({
      name: t.name,
      uniforms: this.uniforms,
      vertexShader: t.vertexShader,
      fragmentShader: t.fragmentShader
    }), this.fsQuad = new gt(this.material), this._outputColorSpace = null, this._toneMapping = null;
  }
  render(t, s, e) {
    this.uniforms.tDiffuse.value = e.texture, this.uniforms.toneMappingExposure.value = t.toneMappingExposure, (this._outputColorSpace !== t.outputColorSpace || this._toneMapping !== t.toneMapping) && (this._outputColorSpace = t.outputColorSpace, this._toneMapping = t.toneMapping, this.material.defines = {}, Kt.getTransfer(this._outputColorSpace) === Xt && (this.material.defines.SRGB_TRANSFER = ""), this._toneMapping === Yt ? this.material.defines.LINEAR_TONE_MAPPING = "" : this._toneMapping === Jt ? this.material.defines.REINHARD_TONE_MAPPING = "" : this._toneMapping === te ? this.material.defines.CINEON_TONE_MAPPING = "" : this._toneMapping === ee ? this.material.defines.ACES_FILMIC_TONE_MAPPING = "" : this._toneMapping === se ? this.material.defines.AGX_TONE_MAPPING = "" : this._toneMapping === oe && (this.material.defines.NEUTRAL_TONE_MAPPING = ""), this.material.needsUpdate = !0), this.renderToScreen === !0 ? (t.setRenderTarget(null), this.fsQuad.render(t)) : (t.setRenderTarget(s), this.clear && t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil), this.fsQuad.render(t));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class fs extends Z {
  constructor(t, s, e = null, o = null, i = null) {
    super(), this.scene = t, this.camera = s, this.overrideMaterial = e, this.clearColor = o, this.clearAlpha = i, this.clear = !0, this.clearDepth = !1, this.needsSwap = !1, this._oldClearColor = new tt();
  }
  render(t, s, e) {
    const o = t.autoClear;
    t.autoClear = !1;
    let i, l;
    this.overrideMaterial !== null && (l = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor !== null && (t.getClearColor(this._oldClearColor), t.setClearColor(this.clearColor, t.getClearAlpha())), this.clearAlpha !== null && (i = t.getClearAlpha(), t.setClearAlpha(this.clearAlpha)), this.clearDepth == !0 && t.clearDepth(), t.setRenderTarget(this.renderToScreen ? null : e), this.clear === !0 && t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil), t.render(this.scene, this.camera), this.clearColor !== null && t.setClearColor(this._oldClearColor), this.clearAlpha !== null && t.setClearAlpha(i), this.overrideMaterial !== null && (this.scene.overrideMaterial = l), t.autoClear = o;
  }
}
const ps = {
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
class ms extends Z {
  constructor(t, s, e) {
    super(), this.scene = t, this.camera = s;
    const o = e.focus !== void 0 ? e.focus : 1, i = e.aperture !== void 0 ? e.aperture : 0.025, l = e.maxblur !== void 0 ? e.maxblur : 1;
    this.renderTargetDepth = new Pt(1, 1, {
      // will be resized later
      minFilter: wt,
      magFilter: wt,
      type: Rt
    }), this.renderTargetDepth.texture.name = "BokehPass.depth", this.materialDepth = new re(), this.materialDepth.depthPacking = ie, this.materialDepth.blending = At;
    const n = ps, a = ut.clone(n.uniforms);
    a.tDepth.value = this.renderTargetDepth.texture, a.focus.value = o, a.aspect.value = s.aspect, a.aperture.value = i, a.maxblur.value = l, a.nearClip.value = s.near, a.farClip.value = s.far, this.materialBokeh = new at({
      defines: Object.assign({}, n.defines),
      uniforms: a,
      vertexShader: n.vertexShader,
      fragmentShader: n.fragmentShader
    }), this.uniforms = a, this.fsQuad = new gt(this.materialBokeh), this._oldClearColor = new tt();
  }
  render(t, s, e) {
    this.scene.overrideMaterial = this.materialDepth, t.getClearColor(this._oldClearColor);
    const o = t.getClearAlpha(), i = t.autoClear;
    t.autoClear = !1, t.setClearColor(16777215), t.setClearAlpha(1), t.setRenderTarget(this.renderTargetDepth), t.clear(), t.render(this.scene, this.camera), this.uniforms.tColor.value = e.texture, this.uniforms.nearClip.value = this.camera.near, this.uniforms.farClip.value = this.camera.far, this.renderToScreen ? (t.setRenderTarget(null), this.fsQuad.render(t)) : (t.setRenderTarget(s), t.clear(), this.fsQuad.render(t)), this.scene.overrideMaterial = null, t.setClearColor(this._oldClearColor), t.setClearAlpha(o), t.autoClear = i;
  }
  setSize(t, s) {
    this.materialBokeh.uniforms.aspect.value = t / s, this.renderTargetDepth.setSize(t, s);
  }
  dispose() {
    this.renderTargetDepth.dispose(), this.materialDepth.dispose(), this.materialBokeh.dispose(), this.fsQuad.dispose();
  }
}
const gs = [14826299, 15764010, 15782953, 3980106, 2865328, 3832831, 9063124], bs = {
  normal: 0.34,
  fast: 0.16,
  turbo: 0.07
};
class vs {
  constructor(t) {
    x(this, "onLand", null);
    x(this, "renderer");
    x(this, "scene", new ae());
    x(this, "camera");
    x(this, "sun");
    x(this, "glint");
    x(this, "board", new ne());
    x(this, "layoutOwned", []);
    x(this, "composer", null);
    x(this, "bokeh", null);
    x(this, "fancy");
    x(this, "rows", 16);
    x(this, "risk", "high");
    x(this, "speed", "normal");
    x(this, "built", !1);
    x(this, "frame", { span: 9.4, spacing: 1, rowGap: 0.86, topZ: 0, depth: 8 });
    x(this, "marbles", []);
    x(this, "bucketMeshes", []);
    x(this, "pegMeshes", []);
    x(this, "pegFlash", /* @__PURE__ */ new Map());
    x(this, "pulses", /* @__PURE__ */ new Map());
    x(this, "ballGeometry", null);
    x(this, "owned", []);
    x(this, "fpsTime", 0);
    x(this, "fpsFrames", 0);
    x(this, "width", 1);
    x(this, "height", 1);
    this.fancy = !xs();
    const s = document.createElement("canvas");
    s.setAttribute("data-plinko-gl", "1"), this.renderer = new le({
      canvas: s,
      antialias: this.fancy,
      alpha: !1,
      powerPreference: "high-performance",
      preserveDrawingBuffer: !0
    }), this.renderer.outputColorSpace = et, this.renderer.setClearColor(13210965, 1), this.renderer.shadowMap.enabled = this.fancy, this.renderer.shadowMap.type = ce, s.style.width = "100%", s.style.height = "100%", s.style.display = "block", s.style.touchAction = "none", t.appendChild(s), this.camera = new he(34, 1, 0.08, 80), this.scene.background = new tt(14131548), this.scene.add(this.board), this.scene.add(new ue(16774884, 9263664, 0.38)), this.sun = new Ct(16774111, 0.72), this.sun.position.set(2.4, 14, -1.2), this.sun.castShadow = this.fancy, this.sun.shadow.mapSize.set(1024, 1024), this.sun.shadow.camera.near = 1, this.sun.shadow.camera.far = 28, this.sun.shadow.camera.left = -8, this.sun.shadow.camera.right = 8, this.sun.shadow.camera.top = 8, this.sun.shadow.camera.bottom = -8, this.sun.shadow.bias = -8e-4, this.scene.add(this.sun);
    const e = new Ct(16769720, 0.38);
    e.position.set(-5, 7, 3), this.scene.add(e), this.glint = new de(16777215, 6, 18), this.scene.add(this.glint), this.fancy && this.enableDepthOfField(), this.resize(t.clientWidth || 320, t.clientHeight || 420);
  }
  setLayout(t, s) {
    this.built && this.rows === t && this.risk === s || (this.rows = t, this.risk = s, this.rebuild());
  }
  setSpeed(t) {
    this.speed = t;
  }
  resize(t, s) {
    this.width = Math.max(1, t), this.height = Math.max(1, s);
    const e = this.fancy ? 2 : 1.5, o = Math.min(2, window.devicePixelRatio || 1, e);
    this.renderer.setPixelRatio(o), this.renderer.setSize(this.width, this.height, !1), this.camera.aspect = this.width / this.height, this.camera.updateProjectionMatrix(), this.composer?.setSize(this.width, this.height), this.composer?.setPixelRatio(o), this.frameCamera();
  }
  launch(t) {
    const s = new E(this.ballGeometry ?? this.ensureBall(), this.marbleMaterial());
    s.castShadow = this.fancy, s.receiveShadow = !1;
    const e = new E(
      this.shadowGeometry(),
      new kt({
        color: 3810324,
        transparent: !0,
        opacity: 0.32,
        depthWrite: !1
      })
    );
    e.rotation.x = -Math.PI / 2, this.board.add(s), this.board.add(e), this.marbles.push({ shot: t, mesh: s, shadow: e, step: 0, u: 0, landed: !1, age: 0 });
  }
  get inflight() {
    return this.marbles.filter((t) => !t.landed).length;
  }
  update(t) {
    this.watchFrameRate(t);
    const s = bs[this.speed];
    for (const e of this.marbles) {
      if (e.landed) {
        e.age += t;
        continue;
      }
      const o = e.shot.motion?.[e.step]?.pace ?? 1;
      for (e.u += t / (s * o); e.u >= 1 && e.step < e.shot.rows; )
        e.u -= 1, e.step += 1;
      e.step >= e.shot.rows && (e.landed = !0, e.u = 1, e.age = 0, this.pulses.set(e.shot.bucket, 0.45), this.onLand?.(e.shot)), this.placeMarble(e);
    }
    this.marbles = this.marbles.filter((e) => {
      if (!e.landed || e.age < 0.45) return !0;
      const o = e.mesh.material;
      Array.isArray(o) || o.dispose();
      const i = e.shadow.material;
      return Array.isArray(i) || i.dispose(), this.board.remove(e.mesh), this.board.remove(e.shadow), !1;
    });
    for (const [e, o] of this.pulses) {
      const i = o - t, l = this.bucketMeshes[e];
      if (l) {
        const n = i > 0 ? 1 + i / 0.45 * 0.12 : 1;
        l.scale.set(n, n, 1);
      }
      i <= 0 ? this.pulses.delete(e) : this.pulses.set(e, i);
    }
    for (const [e, o] of this.pegFlash) {
      const [i, l] = e.split(":").map(Number), n = this.pegMeshes[i ?? -1]?.[l ?? -1], a = o - t;
      if (n) {
        n.scale.setScalar(1);
        const c = n.material;
        c instanceof W && (c.emissive.set("#fff6d0"), c.emissiveIntensity = a > 0 ? a / 0.22 * 0.85 : 0);
      }
      a <= 0 ? this.pegFlash.delete(e) : this.pegFlash.set(e, a);
    }
    this.composer && this.fancy ? this.composer.render(t) : this.renderer.render(this.scene, this.camera);
  }
  destroy() {
    this.composer?.dispose(), this.bokeh?.dispose();
    for (const t of this.marbles) {
      const s = t.mesh.material;
      Array.isArray(s) || s.dispose();
      const e = t.shadow.material;
      Array.isArray(e) || e.dispose();
    }
    for (const t of this.layoutOwned) t.dispose();
    for (const t of this.owned) t.dispose();
    this.owned.length = 0, this.renderer.dispose(), this.renderer.forceContextLoss(), this.renderer.domElement.remove();
  }
  enableDepthOfField() {
    const t = new hs(this.renderer);
    t.addPass(new fs(this.scene, this.camera));
    const s = new ms(this.scene, this.camera, {
      focus: 12,
      aperture: 45e-6,
      maxblur: 4e-3
    });
    t.addPass(s), t.addPass(new ds()), this.composer = t, this.bokeh = s;
  }
  dropFancy() {
    this.fancy && (this.fancy = !1, this.renderer.shadowMap.enabled = !1, this.sun.castShadow = !1, this.composer = null, this.bokeh?.dispose(), this.bokeh = null, this.resize(this.width, this.height));
  }
  watchFrameRate(t) {
    if (!this.fancy || (this.fpsTime += t, this.fpsFrames += 1, this.fpsTime < 1)) return;
    const s = this.fpsFrames / this.fpsTime;
    this.fpsTime = 0, this.fpsFrames = 0, s < 30 && this.dropFancy();
  }
  disposeLayout() {
    for (const t of [...this.board.children])
      this.marbles.some((s) => s.mesh === t || s.shadow === t) || this.board.remove(t);
    for (const t of this.layoutOwned) t.dispose();
    this.layoutOwned.length = 0, this.bucketMeshes = [], this.pegMeshes = [];
  }
  rebuild() {
    this.disposeLayout();
    const { span: t, spacing: s, rowGap: e, topZ: o, depth: i } = this.measure();
    this.frame = { span: t, spacing: s, rowGap: e, topZ: o, depth: i };
    const l = this.woodMaterial(), n = new E(new _t(t + 0.7, 0.2, i + 0.35, 2, 0.06), l);
    n.position.y = -0.1, n.receiveShadow = !0, n.castShadow = this.fancy, this.board.add(n), this.layoutOwned.push(n.geometry), this.addRail(l, t, i), this.addPosts(t, i), this.addPegs(), this.addBuckets(), this.built = !0, this.frameCamera();
    for (const a of this.marbles) this.placeMarble(a);
  }
  measure() {
    const s = 10.2 / (this.rows + 1), e = s * 0.9, o = this.rows * e / 2, i = this.rows * e + s * 1.05;
    return { span: 10.2, spacing: s, rowGap: e, topZ: o, depth: i };
  }
  addRail(t, s, e) {
    const l = new it(0.2, 0.26, e + 0.2), n = new it(s + 0.2, 0.26, 0.2);
    this.layoutOwned.push(l, n);
    const a = 0.26 / 2, c = s / 2 + 0.2 / 2, h = e / 2;
    for (const _ of [
      new E(l, t),
      new E(l, t),
      new E(n, t),
      new E(n, t)
    ])
      _.castShadow = this.fancy, _.receiveShadow = !0, this.board.add(_);
    const [m, d, f, u] = this.board.children.slice(-4);
    !m || !d || !f || !u || (m.position.set(-c, a, 0), d.position.set(c, a, 0), f.position.set(0, a, h), u.position.set(0, a, -h));
  }
  addPosts(t, s) {
    const e = new fe(0.07, 0.07, 0.85, 16), o = new W({
      map: ws(),
      roughness: 0.45,
      metalness: 0.02
    });
    this.layoutOwned.push(e, o, o.map);
    const i = t / 2 + 0.55, l = s / 2 - 0.15;
    for (const n of [-i, i])
      for (const a of [-l, l]) {
        const c = new E(e, o);
        c.position.set(n, 0.42, a), c.castShadow = this.fancy, c.receiveShadow = !0, this.board.add(c);
      }
  }
  addPegs() {
    const { rowGap: t, topZ: s } = this.frame, e = this.frame.spacing * lt, o = new pe(e, e * 0.55, 5, 14);
    this.pegMeshes = [], this.layoutOwned.push(o);
    const i = gs.map(
      (n) => new W({
        color: n,
        roughness: 0.62,
        metalness: 0
      })
    );
    this.layoutOwned.push(...i);
    let l = 0;
    for (let n = 0; n < this.rows; n += 1) {
      const a = 3 + n, c = s - (n + 1) * t;
      for (let h = 0; h < a; h += 1) {
        const m = i[l % i.length];
        if (l += 1, !m) continue;
        const d = m.clone();
        this.layoutOwned.push(d);
        const f = new E(o, d);
        f.position.set(this.pegX(n, h), e * 1.3, c);
        const u = this.pegMeshes[n] ?? [];
        u[h] = f, this.pegMeshes[n] = u, f.castShadow = this.fancy, f.receiveShadow = !0, this.board.add(f);
      }
    }
  }
  addBuckets() {
    const t = mt(this.rows, this.risk), { spacing: s } = this.frame, e = this.zAt(this.rows) - s * 0.48, o = Math.max(0.72, s * 1.15), i = new _t(s * 0.94, o, s * 0.82, 3, 0.1);
    this.layoutOwned.push(i);
    for (let l = 0; l < t.length; l += 1) {
      const n = Fe(l, t.length), a = Cs(nt(t[l] ?? 0), n), c = new W({
        color: zt(n),
        roughness: 0.62,
        metalness: 0
      }), h = new E(i, c), m = this.pegX(this.rows - 1, l), d = this.pegX(this.rows - 1, l + 1);
      h.position.set((m + d) / 2, o / 2, e), h.castShadow = this.fancy, h.receiveShadow = !0, this.board.add(h), this.bucketMeshes.push(h), this.layoutOwned.push(c, a);
      const f = new E(
        new me(s * 0.9, s * 0.62),
        new kt({ map: a, side: ge, toneMapped: !1 })
      );
      f.rotation.x = -Math.PI / 2, f.position.set(h.position.x, o + 0.03, e), this.board.add(f), this.layoutOwned.push(f.geometry, f.material);
    }
  }
  placeMarble(t) {
    const s = Math.min(t.step, Math.max(0, t.shot.rows - 1)), e = t.landed || t.step >= t.shot.rows ? 1 : t.u, o = Ve(
      t.shot.rows,
      t.shot.path,
      s,
      e,
      lt,
      ct,
      t.shot.motion?.[s]
    );
    o.hit && this.pegFlash.set(`${o.hit.row}:${o.hit.index}`, 0.22);
    const { spacing: i, topZ: l, rowGap: n } = this.frame, a = -this.frame.span / 2 + o.x * i, c = l - o.y * n, h = i * ct, m = o.squash || 1, d = h * (0.28 + (o.pop || 0) * 0.9);
    t.mesh.position.set(a, h * m + d, c), t.mesh.rotation.z = -o.x * 0.8, t.mesh.rotation.x = o.y * 0.8;
    const f = h / 0.2, u = f / Math.sqrt(m);
    t.mesh.scale.set(u, f * m, u), t.shadow.position.set(a, 0.02, c), t.shadow.scale.set(f, f, 1);
    const _ = t.shadow.material;
    Array.isArray(_) || (_.opacity = o.hit ? 0.45 : 0.28);
  }
  pegX(t, s) {
    const e = 3 + t, o = (this.rows + 2 - e) / 2 * this.frame.spacing;
    return -this.frame.span / 2 + o + s * this.frame.spacing;
  }
  zAt(t) {
    return this.frame.topZ - t * this.frame.rowGap;
  }
  frameCamera() {
    const { span: t, topZ: s, rowGap: e } = this.frame, o = this.zAt(this.rows) - this.frame.spacing * 0.7, i = s + e * 0.2, l = (o + i) / 2, n = 60 * Math.PI / 180, a = 30 * Math.PI / 180;
    this.camera.fov = 30;
    const c = Math.max(0.35, this.width / Math.max(1, this.height)), h = 2 * Math.atan(Math.tan(a / 2) * c), d = (t / 2 + 0.22) / Math.tan(h / 2) / 0.9, f = new q(0, 0.15, l);
    this.camera.position.set(0, Math.sin(n) * d, l - Math.cos(n) * d), this.camera.lookAt(f), this.camera.updateProjectionMatrix(), this.glint.position.copy(this.camera.position).add(new q(-0.8, 0.4, 0.6));
    const u = this.bokeh?.uniforms;
    u?.focus && (u.focus.value = this.camera.position.distanceTo(f));
  }
  ensureBall() {
    return this.ballGeometry ? this.ballGeometry : (this.ballGeometry = new be(0.33, 40, 28), this.owned.push(this.ballGeometry), this.ballGeometry);
  }
  marbleMaterial() {
    return this.fancy ? new ve({
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
    const t = this.owned.find((e) => e instanceof st);
    if (t instanceof st) return t;
    const s = new st(0.3, 24);
    return this.owned.push(s), s;
  }
  woodMaterial() {
    const t = ys(), s = new W({ map: t, roughness: 0.78, metalness: 0.02 });
    return this.layoutOwned.push(s, t), s;
  }
}
function xs() {
  const r = navigator, t = r.hardwareConcurrency ?? 8, s = r.deviceMemory ?? 8;
  return t <= 4 || s <= 4;
}
function ys() {
  const r = document.createElement("canvas");
  r.width = 256, r.height = 256;
  const t = r.getContext("2d");
  if (!t) throw new Error("wood");
  t.fillStyle = "#c4894a", t.fillRect(0, 0, 256, 256);
  for (let e = 0; e < 256; e += 2) {
    const o = 70 + e * 13 % 70;
    t.strokeStyle = `rgba(${o + 40}, ${Math.max(20, o - 10)}, ${Math.max(8, o - 40)}, 0.35)`, t.lineWidth = 1 + e * 5 % 3, t.beginPath(), t.moveTo(0, e), t.bezierCurveTo(80, e + (e % 7 - 3), 160, e - (e % 5 - 2), 256, e + (e % 4 - 1)), t.stroke();
  }
  const s = new dt(r);
  return s.colorSpace = et, s.wrapS = J, s.wrapT = J, s.repeat.set(2, 2), s;
}
function ws() {
  const r = document.createElement("canvas");
  r.width = 64, r.height = 128;
  const t = r.getContext("2d");
  if (!t) throw new Error("cane");
  for (let e = -4; e < 8; e += 1)
    t.fillStyle = e % 2 === 0 ? "#f4f7f8" : "#d7263d", t.beginPath(), t.moveTo(e * 16, 0), t.lineTo(e * 16 + 16, 0), t.lineTo(e * 16 + 48, 128), t.lineTo(e * 16 + 32, 128), t.closePath(), t.fill();
  const s = new dt(r);
  return s.colorSpace = et, s.wrapS = J, s.wrapT = J, s;
}
function zt(r) {
  const t = r.match(/hsl\(([-\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)/), s = new tt();
  return t ? (s.setHSL(Number(t[1]) / 360, Number(t[2]) / 100, Number(t[3]) / 100), s) : s.set("#888888");
}
function Cs(r, t) {
  const s = document.createElement("canvas");
  s.width = 512, s.height = 256;
  const e = s.getContext("2d");
  if (!e) throw new Error("label");
  const o = `#${zt(t).getHexString()}`;
  e.fillStyle = o, e.fillRect(0, 0, 512, 256), e.fillStyle = "#1a120c", e.font = "800 150px Outfit, sans-serif", e.textAlign = "center", e.textBaseline = "middle", e.fillText(r, 256, 136);
  const i = new dt(s);
  return i.colorSpace = et, i.center.set(0.5, 0.5), i.rotation = Math.PI, i.needsUpdate = !0, i;
}
function Ts() {
  return Xe({
    manifest: Te,
    title: "木珠",
    gameAttr: "wgf-game:plinko-3d",
    extraClass: "plinko3d",
    createBoard: (r) => new vs(r)
  });
}
export {
  Ts as createGame,
  Te as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"three":"0.170.0","@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
