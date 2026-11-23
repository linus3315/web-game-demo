var Yt = Object.defineProperty;
var Jt = (i, t, s) => t in i ? Yt(i, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[t] = s;
var v = (i, t, s) => Jt(i, typeof t != "symbol" ? t + "" : t, s);
import { BoxGeometry as J, Vector3 as q, Mesh as y, OrthographicCamera as te, BufferGeometry as ee, Float32BufferAttribute as _t, ShaderMaterial as ct, UniformsUtils as vt, Vector2 as Tt, WebGLRenderTarget as Nt, HalfFloatType as Ut, NoBlending as It, Clock as se, RawShaderMaterial as oe, ColorManagement as ie, SRGBTransfer as re, LinearToneMapping as ae, ReinhardToneMapping as ne, CineonToneMapping as le, ACESFilmicToneMapping as ce, AgXToneMapping as he, NeutralToneMapping as ue, Color as ot, NearestFilter as Pt, MeshDepthMaterial as de, RGBADepthPacking as fe, Scene as Bt, MeshStandardMaterial as z, BackSide as pe, PointLight as Ot, MeshBasicMaterial as ht, Group as me, WebGLRenderer as ge, SRGBColorSpace as it, PCFSoftShadowMap as be, PerspectiveCamera as ve, HemisphereLight as xe, DirectionalLight as Dt, PMREMGenerator as we, CylinderGeometry as ye, CapsuleGeometry as Ce, PlaneGeometry as Se, DoubleSide as Me, SphereGeometry as ke, MeshPhysicalMaterial as _e, CircleGeometry as at, CanvasTexture as xt, RepeatWrapping as tt } from "three";
import { registerStrings as Te, defineGame as Pe, writeSettings as De, bindVisualViewport as Re, patchGame as Ae, t as Ee } from "@wgf/core";
import { TokenStore as Le, HttpClient as Ne } from "@wgf/net";
const Ue = {
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
}, Ie = {
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
  art: Ue,
  renderer: "three",
  controls: "pointer",
  tags: ["弹珠", "联网"],
  theme: { accent: "#f0a04b", accentInk: "#2a160c", glow: "#e23b3b", radius: 18, font: "sans" }
}, et = 8, st = 16, N = [10, 20, 50, 100], Be = ["low", "mid", "high"], Ft = [
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
function Gt(i, t) {
  let s = 1;
  for (let e = 1; e <= t; e += 1) s = s * (i - t + e) / e;
  return s;
}
function nt(i) {
  const t = i.length - 1, s = 2 ** t;
  let e = 0;
  for (let o = 0; o < i.length; o += 1)
    e += Gt(t, o) / s * (i[o] ?? 0);
  return e;
}
function Oe(i, t, s, e) {
  const o = i / 2;
  return Array.from({ length: i + 1 }, (r, n) => {
    const l = o === 0 ? 0 : Math.abs(n - o) / o;
    return s * (t / s) ** l ** e;
  });
}
function Fe(i) {
  return i >= 100 ? Math.max(1, Math.round(i)) : Math.max(0.1, Math.round(i * 10) / 10);
}
function Ge(i) {
  const t = i.length - 1, s = i.slice();
  for (let e = 0; e <= t; e += 1) {
    const o = Fe(((s[e] ?? 0) + (s[t - e] ?? 0)) / 2);
    s[e] = o, s[t - e] = o;
  }
  return s;
}
function ze(i) {
  const t = i / 2, s = [];
  for (let e = 0; e <= i; e += 1) Math.abs(e - t) <= 0.5 && s.push(e);
  return s;
}
function qe(i, t, s, e) {
  const o = Oe(i, t, s, e), r = Ge(o.map((c) => c * (0.99 / nt(o)))), n = ze(i);
  let l = r, a = Math.abs(nt(l) - 0.99);
  for (let c = -20; c <= 20; c += 1) {
    const h = r.slice(), f = r[n[0] ?? 0] ?? 0, d = Math.max(0.1, Math.round((f + c * 0.1) * 10) / 10);
    for (const u of n) h[u] = d;
    const p = Math.abs(nt(h) - 0.99);
    p < a && (a = p, l = h);
  }
  return l;
}
function $e() {
  const i = {
    low: [18, 1.05, 2.2],
    mid: [160, 0.45, 1.65],
    high: [700, 0.2, 1.25]
  }, t = { low: {}, mid: {}, high: {} };
  for (const s of Be) {
    const e = i[s];
    for (let o = et; o <= st; o += 1)
      t[s][o] = qe(o, e[0], e[1], e[2]);
  }
  return t.high[16] = Ft, t;
}
const Rt = $e();
function wt(i, t) {
  return Rt[t][i] ?? Rt.mid[16] ?? Ft;
}
function He(i) {
  return Number.isInteger(i) && i >= et && i <= st;
}
function We(i) {
  return i === "low" || i === "mid" || i === "high";
}
function Ve(i) {
  return N.includes(i);
}
function ut(i) {
  return i >= 1e3 ? "1kx" : i >= 100 ? `${Math.round(i)}x` : `${i.toFixed(1)}x`;
}
function zt(i, t) {
  const s = (t - 1) / 2;
  return s === 0 ? 0 : Math.abs(i - s) / s;
}
function Ze(i, t) {
  const s = zt(i, t), e = s < 0.4 ? 132 - s / 0.4 * 84 : 48 - (s - 0.4) / 0.6 * 44, o = 70 + s * 18, r = 42 + (1 - s) * 10;
  return `hsl(${e.toFixed(1)} ${o.toFixed(1)}% ${r.toFixed(1)}%)`;
}
function Qe(i, t) {
  return zt(i, t) > 0.62 ? "#fff" : "#1a120c";
}
const X = 1e3;
function W() {
  return { credits: X };
}
function je(i, t) {
  const s = 2 ** i, e = t() * s;
  let o = 0;
  for (let r = 0; r <= i; r += 1)
    if (o += Gt(i, r), e < o) return r;
  return i;
}
function Ke(i, t, s, e, o, r) {
  if (!Ve(t)) return { error: "bad_bet" };
  if (!He(s)) return { error: "bad_rows" };
  if (!We(e)) return { error: "bad_risk" };
  if (i.credits < t) return { error: "insufficient" };
  const n = wt(s, e), l = typeof r == "number" && Number.isInteger(r) && r >= 0 && r <= s ? r : je(s, o), a = n[l] ?? 0, c = Math.round(t * a);
  return i.credits -= t, i.credits += c, { rows: s, risk: e, bet: t, bucket: l, multiplier: a, win: c, credits: i.credits };
}
const Xe = 0.63;
function Ye(i, t, s) {
  let e = Math.max(0, Math.min(i, Math.floor(t))), o = i - e;
  const r = [];
  let n = null;
  for (let l = 0; l < i; l += 1) {
    let a;
    if (e <= 0) a = "L";
    else if (o <= 0) a = "R";
    else if (n === null) a = s() < e / (e + o) ? "R" : "L";
    else {
      const c = n === "R" ? "L" : "R";
      a = (s() < Xe ? n : c) === "R" ? e > 0 ? "R" : "L" : o > 0 ? "L" : "R";
    }
    r.push(a), a === "R" ? e -= 1 : o -= 1, n = a;
  }
  return r;
}
const dt = 0.13, ft = 0.325, pt = 0.92;
function Je(i, t) {
  const s = [];
  let e = 1, o = 0;
  for (const r of i) {
    const n = r === "R" ? 1 : -1, l = 0.92 + t() * 0.16, a = 0.97 + t() * 0.06;
    e = e * 0.35 + a * 0.65, o = Math.max(-0.4, Math.min(0.4, o * 0.4 + n * (0.12 + t() * 0.1))), s.push({ hop: l, pace: e, flourish: "none", vx: o });
  }
  return s;
}
function qt(i, t, s) {
  return { x: (i - 1 - t) / 2 + s, y: t + 1 };
}
function $t(i, t) {
  return i + t;
}
function mt(i) {
  return i === "R" ? 1 : -1;
}
function gt(i, t, s, e) {
  return {
    x: i.x + s * Math.sin(t) * e,
    y: i.y - Math.cos(t) * e / pt
  };
}
function Ht(i, t) {
  let s = 0;
  for (let e = 0; e < t; e += 1) i[e] === "R" && (s += 1);
  return s;
}
function Wt(i, t, s) {
  const e = s[t] === "R" ? "R" : "L", o = Ht(s, t) + 1;
  return { peg: qt(i, t, o), index: o, dir: e };
}
const bt = 1.02;
function ts(i, t, s, e, o = dt, r = ft, n) {
  const l = Math.max(0, Math.min(i - 1, s)), a = Math.max(0, Math.min(1, e)), c = $t(o, r), h = Wt(i, l, t), f = mt(h.dir), d = (n?.hop ?? 1) * (1 - l * 4e-3), p = n?.vx ?? 0, u = gt(h.peg, bt, f, c), C = Vt(u, f), x = gt(h.peg, bt - 0.06, f, c + 0.12 * d);
  x.x += p * 0.02;
  const w = ss(i, t, l, o, r), U = { row: l, index: h.index }, I = 0.22, B = (T) => es(T, i, c);
  if (a <= I) {
    const T = a / I, S = T * T;
    return {
      ...B({
        x: C.x + (u.x - C.x) * S,
        y: C.y + (u.y - C.y) * S
      }),
      hit: T > 0.92 ? U : null,
      squash: T > 0.92 ? 0.96 : 1,
      pop: 0
    };
  }
  if (a <= I + 0.1) {
    const T = (a - I) / 0.1, S = Math.sin(T * Math.PI / 2);
    return {
      ...B({
        x: u.x + (x.x - u.x) * S,
        y: u.y + (x.y - u.y) * S
      }),
      hit: T < 0.18 ? U : null,
      squash: T < 0.18 ? 0.96 : 1,
      pop: S * 0.45
    };
  }
  const $ = (a - (I + 0.1)) / (1 - (I + 0.1)), Q = $ * $;
  return {
    ...B({
      x: x.x + (w.x - x.x) * Q,
      y: x.y + (w.y - x.y) * Q
    }),
    hit: null,
    squash: 1,
    pop: 0.4 * (1 - $)
  };
}
function es(i, t, s) {
  let e = i;
  for (let o = 0; o < 4; o += 1)
    for (let r = 0; r < t; r += 1)
      for (let n = 0; n < 3 + r; n += 1) {
        const l = qt(t, r, n), a = e.x - l.x, c = (e.y - l.y) * pt, h = Math.hypot(a, c);
        if (h >= s || h === 0) continue;
        const f = s / h;
        e = { x: l.x + a * f, y: l.y + c * f / pt };
      }
  return e;
}
function ss(i, t, s, e, o) {
  const n = Ht(t, s) + (t[s] === "R" ? 1 : 0);
  if (s + 1 >= i) return { x: n + 0.5, y: i + 1.35 };
  const l = Wt(i, s + 1, t), a = gt(l.peg, bt, mt(l.dir), $t(e, o));
  return Vt(a, mt(l.dir));
}
function Vt(i, t) {
  return { x: i.x + t * 0.06, y: i.y - 0.18 };
}
function os() {
  Te("plinko", {
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
const is = {}, lt = "wgf:slots-wallet", Zt = "wgf:slots-token", rs = "wgf:session";
function as(i) {
  os();
  let t = null;
  const s = [];
  let e = null, o = null, r = W(), n = X, l = 20, a = 16, c = "high", h = "normal", f = !1, d = "pending", p = !1, u = "ready", C = -1, x = -1, w = 0;
  const U = [], I = /* @__PURE__ */ new Set();
  let B = null, $ = !1, Q = 0, F = () => {
  };
  function T(b, g) {
    return Ee(t?.store.getState().ui.locale ?? "zh", b, g);
  }
  function S() {
    if (!e) return;
    const b = e.querySelector("[data-credits]"), g = e.querySelector("[data-amount]"), k = e.querySelector("[data-row-label]"), P = e.querySelector("[data-row-slider]"), L = e.querySelector("[data-demo]"), _ = e.querySelector("[data-source]");
    b && (b.textContent = String(n)), g && (g.textContent = String(l)), k && (k.textContent = String(a)), P && (P.value = String(a)), L && (L.hidden = d !== "local"), _ && (_.textContent = T(d === "server" ? "plinko.server" : d === "local" ? "plinko.local" : "plinko.pending")), e.dataset.rows = String(a), e.dataset.risk = c, e.dataset.pace = h, e.dataset.pegs = String(a + 2), e.dataset.buckets = String(a + 1), C >= 0 && (e.dataset.bucket = String(C)), x >= 0 && (e.dataset.landed = String(x)), e.dataset.round = o && o.inflight > 0 ? "busy" : "open";
    const m = N.indexOf(l), R = e.querySelector("[data-bet-dec]"), E = e.querySelector("[data-bet-inc]");
    R && (R.disabled = m <= 0), E && (E.disabled = m >= N.length - 1), e.querySelectorAll("[data-bet]").forEach((D) => {
      D.classList.toggle("is-bet", Number(D.dataset.bet) === l);
    }), e.querySelectorAll("[data-speed]").forEach((D) => {
      D.classList.toggle("is-on", D.dataset.speed === h);
    }), e.querySelectorAll("[data-risk-pick]").forEach((D) => {
      D.classList.toggle("is-on", D.dataset.riskPick === c);
    });
    const O = e.querySelector("[data-drop]");
    O && (O.disabled = !p || u !== "running" || n < l);
    const j = e.querySelector("[data-auto]");
    j && j.setAttribute("aria-pressed", f ? "true" : "false");
    const M = e.querySelector("[data-sound]");
    if (M && t) {
      const D = t.store.getState().ui;
      M.setAttribute("aria-pressed", D.musicMuted && D.sfxMuted ? "true" : "false");
    }
    const H = e.querySelector("[data-history]");
    H && H.replaceChildren(
      ...U.slice(0, 8).map((D) => {
        const Y = document.createElement("span");
        return Y.textContent = ut(D), Y;
      })
    ), o?.setLayout(a, c), o?.setSpeed(h), e.dataset.seq = String(Q), Xt(e);
  }
  function G() {
    t && Ae(t.store, {
      id: i.manifest.id,
      status: u,
      score: Math.max(0, n - X),
      highScore: Math.max(0, n),
      message: "",
      detail: T(d === "server" ? "plinko.server" : "plinko.local"),
      credits: n
    });
  }
  function Ct() {
    d === "local" && localStorage.setItem(lt, JSON.stringify(r));
  }
  function St() {
    try {
      const b = localStorage.getItem(lt);
      if (!b) return W();
      const g = JSON.parse(b);
      return !g || typeof g.credits != "number" ? W() : { credits: Math.max(0, Math.floor(g.credits)) };
    } catch {
      return W();
    }
  }
  async function Mt() {
    if (!await ds()) {
      d = "local", r = St(), n = r.credits, p = !0, G(), S();
      return;
    }
    try {
      const g = await At().post("/api/plinko/session", {});
      g.walletToken && localStorage.setItem(Zt, g.walletToken), $ = g.demo === !0, d = "server", r = { credits: g.credits }, n = g.credits;
    } catch {
      d = "local", r = St(), n = r.credits;
    }
    p = !0, G(), S();
  }
  async function rt() {
    if (!p || u !== "running" || n < l) return;
    const b = cs();
    if (I.has(b)) return;
    const g = { bet: l, rows: a, risk: c }, k = kt() ? B : null;
    let P;
    if (d === "server")
      try {
        const m = await At().post("/api/plinko/drop", {
          bet: g.bet,
          spinId: b,
          rows: g.rows,
          risk: g.risk,
          ...k !== null ? { bucket: k } : {}
        });
        P = m, r = { credits: m.credits };
      } catch {
        return;
      }
    else {
      const m = Ke(
        r,
        g.bet,
        g.rows,
        g.risk,
        Math.random,
        k
      );
      if ("error" in m) return;
      P = m, Ct();
    }
    I.add(b), n -= g.bet, C = P.bucket;
    const L = Ye(g.rows, P.bucket, Math.random), _ = {
      path: L,
      rows: g.rows,
      bet: g.bet,
      bucket: P.bucket,
      multiplier: P.multiplier,
      win: P.win,
      motion: Je(L, Math.random)
    };
    o?.launch(_), G(), S();
  }
  function Kt(b) {
    n += b.win, x = b.bucket, Q += 1, U.unshift(b.multiplier), U.length > 8 && (U.length = 8), n < N[0] && (!o || o.inflight === 0) && (f = !1, u = "over"), G(), S();
  }
  function kt() {
    return ns() && (d === "local" || $);
  }
  function Xt(b) {
    const g = b.querySelector("[data-debug]");
    g && (g.hidden = !kt());
    const k = b.querySelector("[data-debug-result]");
    if (!k) return;
    const P = `${a}:${c}`;
    if (k.dataset.key === P) return;
    const L = wt(a, c), _ = B, m = document.createElement("option");
    m.value = "random", m.textContent = "随机";
    const R = [m];
    for (let E = 0; E <= a; E += 1) {
      const O = document.createElement("option");
      O.value = String(E), O.textContent = `${E} ${ut(L[E] ?? 0)}`, R.push(O);
    }
    k.replaceChildren(...R), k.dataset.key = P, _ !== null && _ <= a ? (B = _, k.value = String(_)) : (B = null, k.value = "random");
  }
  return Pe(i.manifest, {
    async onPreload(b, g) {
      await b.preload([], g);
    },
    async onMount(b) {
      t = b, b.container.setAttribute("data-wgf-game", i.gameAttr), e = document.createElement("div"), e.className = i.extraClass ? `plinko ${i.extraClass}` : "plinko", e.innerHTML = ls(i.title);
      const g = e.querySelector("[data-board]");
      g instanceof HTMLElement && (o = i.createBoard(g), o.onLand = Kt, o.setLayout(a, c)), b.container.appendChild(e);
      const k = e;
      k.addEventListener("input", (_) => {
        const m = _.target;
        if (!(m instanceof HTMLInputElement) || !m.matches("[data-row-slider]")) return;
        if (o && o.inflight > 0) {
          m.value = String(a);
          return;
        }
        const R = Number(m.value);
        R >= et && R <= st && (a = R), S(), F();
      }), k.addEventListener("change", (_) => {
        const m = _.target;
        !(m instanceof HTMLSelectElement) || !m.matches("[data-debug-result]") || (B = m.value === "random" ? null : Number(m.value));
      }), k.addEventListener("click", (_) => {
        const m = _.target;
        if (!(m instanceof Element)) return;
        if (m.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        if (m.closest("[data-sound]") && t) {
          const M = t.store.getState().ui, H = !(M.musicMuted && M.sfxMuted), D = {
            locale: M.locale,
            music: M.music,
            sfx: M.sfx,
            musicMuted: H,
            sfxMuted: H
          };
          De(D), t.store.setState((Y) => ({
            ui: { ...Y.ui, ...D, muted: H }
          })), S();
          return;
        }
        const R = m.closest("[data-bet]"), E = R instanceof HTMLElement ? Number(R.dataset.bet) : Number.NaN;
        if (N.includes(E)) {
          l = E, k.classList.remove("is-bets"), S();
          return;
        }
        if (m.closest("[data-bet-dec]")) {
          const M = N[N.indexOf(l) - 1];
          M !== void 0 && (l = M), k.classList.remove("is-bets"), S();
          return;
        }
        if (m.closest("[data-bet-inc]")) {
          const M = N[N.indexOf(l) + 1];
          M !== void 0 && (l = M), k.classList.remove("is-bets"), S();
          return;
        }
        if (m.closest("[data-amount-bar]")) {
          k.classList.toggle("is-bets");
          return;
        }
        if (k.classList.contains("is-bets") && !m.closest("[data-bet-ui]") && k.classList.remove("is-bets"), m.closest("[data-row-dec]") && (!o || o.inflight === 0)) {
          a > et && (a -= 1), S(), F();
          return;
        }
        if (m.closest("[data-row-inc]") && (!o || o.inflight === 0)) {
          a < st && (a += 1), S(), F();
          return;
        }
        const O = m.closest("[data-risk-pick]");
        if (O instanceof HTMLElement && (!o || o.inflight === 0)) {
          const M = O.dataset.riskPick;
          (M === "low" || M === "mid" || M === "high") && (c = M), S();
          return;
        }
        const j = m.closest("[data-speed]");
        if (j instanceof HTMLElement) {
          const M = j.dataset.speed;
          (M === "normal" || M === "fast" || M === "turbo") && (h = M), S();
          return;
        }
        if (m.closest("[data-auto]")) {
          f = !f, w = 0, S(), f && rt();
          return;
        }
        m.closest("[data-drop]") && rt();
      }), F = () => {
        const _ = e?.querySelector("[data-board]");
        !(_ instanceof HTMLElement) || !o || o.resize(_.clientWidth, _.clientHeight);
      }, F();
      const P = new ResizeObserver(() => F()), L = e.querySelector("[data-board]");
      L && P.observe(L), s.push(() => P.disconnect()), s.push(Re(() => F())), s.push(
        b.loop.onUpdate((_) => {
          o?.update(_), f && u === "running" && (!o || o.inflight < 6) && (w -= _, w <= 0 && n >= l && (w = h === "turbo" ? 0.12 : h === "fast" ? 0.28 : 0.45, rt()));
        })
      ), b.events.on("game:start", () => {
        u === "ready" && (u = "running", G(), S());
      }), b.events.on("game:restart", () => {
        r = d === "local" ? W() : r, d === "local" && (localStorage.removeItem(lt), r = W(), Ct()), n = d === "server" ? r.credits : X, d === "server" ? Mt() : n = X, f = !1, U.length = 0, C = -1, x = -1, u = "running", G(), S();
      }), S(), Mt();
    },
    onDestroy() {
      for (const b of s) b();
      s.length = 0, o?.destroy(), o = null, e?.remove(), e = null, t = null;
    }
  });
}
function ns() {
  try {
    const i = new URL(location.href);
    if (i.searchParams.get("debug") === "1") return !0;
    const t = i.hash, s = t.indexOf("?");
    if (s >= 0 && new URLSearchParams(t.slice(s + 1)).get("debug") === "1") return !0;
  } catch {
    return !1;
  }
  return !1;
}
function ls(i) {
  const t = N.map(
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
        <strong>${i}</strong>
        <span class="plinko-demo" data-demo hidden>试玩</span>
      </div>
      <div class="plinko-tools">
        <button type="button" class="plinko-sound" data-sound aria-label="声音" aria-pressed="false">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4z"/><path fill="none" stroke="currentColor" stroke-width="1.6" d="M16 9.5a3.5 3.5 0 0 1 0 5"/></svg>
        </button>
        <div class="plinko-balance"><span class="plinko-coin" aria-hidden="true"></span><strong data-credits>1000</strong></div>
      </div>
      <span class="plinko-source" data-source></span>
    </header>
    <div class="plinko-stage">
      <div class="plinko-boardbar">
        <div class="plinko-history" data-history></div>
        <div class="plinko-speed plinko-speed-board">${s}</div>
      </div>
      <div class="plinko-board" data-board></div>
    </div>
    <div class="plinko-controls">
      <div class="plinko-panel">
        <label class="plinko-field">
          <span>投注额</span>
          <div class="plinko-betrow" data-bet-ui>
            <button type="button" class="plinko-chip" data-bet-dec aria-label="注额减半">½</button>
            <button type="button" class="plinko-value" data-amount-bar aria-label="选择注额"><strong data-amount>20</strong></button>
            <button type="button" class="plinko-chip" data-bet-inc aria-label="注额加倍">2×</button>
            <div class="plinko-betlist" data-bet-sheet>${t}</div>
          </div>
        </label>
        <div class="plinko-field">
          <span>风险</span>
          <div class="plinko-seg">${e}</div>
        </div>
        <label class="plinko-field">
          <span>行数</span>
          <input type="range" min="8" max="16" step="1" value="16" data-row-slider aria-label="行数">
          <strong data-row-label>16</strong>
        </label>
        <div class="plinko-field plinko-speed-panel">
          <span>速度</span>
          <div class="plinko-speed">${s}</div>
        </div>
        <label class="plinko-debug" data-debug hidden>
          <span>指定结果</span>
          <select data-debug-result></select>
        </label>
      </div>
      <div class="plinko-dock">
        <button type="button" class="plinko-drop" data-drop disabled>投注</button>
        <button type="button" class="plinko-auto" data-auto aria-label="自动">自动</button>
      </div>
    </div>
  `;
}
function cs() {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function At() {
  const i = new Le(), t = hs(), s = us();
  if (t) i.set({ accessToken: t });
  else if (s?.accessToken && !s.accessToken.startsWith("local."))
    i.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const e = localStorage.getItem(Zt);
    e?.startsWith("v1w.") && i.set({ accessToken: e });
  }
  return new Ne({ baseUrl: Qt(), tokens: i, timeoutMs: 2500 });
}
function hs() {
  try {
    const i = sessionStorage.getItem("wgf:launch-token");
    return i && i.length >= 8 ? i : null;
  } catch {
    return null;
  }
}
function us() {
  try {
    const i = localStorage.getItem(rs);
    return i ? JSON.parse(i) : null;
  } catch {
    return null;
  }
}
function Qt() {
  return is?.VITE_API_BASE || "http://127.0.0.1:8787";
}
async function ds() {
  try {
    return (await fetch(`${Qt()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
const K = new q();
function A(i, t, s, e, o, r) {
  const n = 2 * Math.PI * o / 4, l = Math.max(r - 2 * o, 0), a = Math.PI / 4;
  K.copy(t), K[e] = 0, K.normalize();
  const c = 0.5 * n / (n + l), h = 1 - K.angleTo(i) / a;
  return Math.sign(K[s]) === 1 ? h * c : l / (n + l) + c + c * (1 - h);
}
class Et extends J {
  constructor(t = 1, s = 1, e = 1, o = 2, r = 0.1) {
    if (o = o * 2 + 1, r = Math.min(t / 2, s / 2, e / 2, r), super(1, 1, 1, o, o, o), o === 1) return;
    const n = this.toNonIndexed();
    this.index = null, this.attributes.position = n.attributes.position, this.attributes.normal = n.attributes.normal, this.attributes.uv = n.attributes.uv;
    const l = new q(), a = new q(), c = new q(t, s, e).divideScalar(2).subScalar(r), h = this.attributes.position.array, f = this.attributes.normal.array, d = this.attributes.uv.array, p = h.length / 6, u = new q(), C = 0.5 / o;
    for (let x = 0, w = 0; x < h.length; x += 3, w += 2)
      switch (l.fromArray(h, x), a.copy(l), a.x -= Math.sign(a.x) * C, a.y -= Math.sign(a.y) * C, a.z -= Math.sign(a.z) * C, a.normalize(), h[x + 0] = c.x * Math.sign(l.x) + a.x * r, h[x + 1] = c.y * Math.sign(l.y) + a.y * r, h[x + 2] = c.z * Math.sign(l.z) + a.z * r, f[x + 0] = a.x, f[x + 1] = a.y, f[x + 2] = a.z, Math.floor(x / p)) {
        case 0:
          u.set(1, 0, 0), d[w + 0] = A(u, a, "z", "y", r, e), d[w + 1] = 1 - A(u, a, "y", "z", r, s);
          break;
        case 1:
          u.set(-1, 0, 0), d[w + 0] = 1 - A(u, a, "z", "y", r, e), d[w + 1] = 1 - A(u, a, "y", "z", r, s);
          break;
        case 2:
          u.set(0, 1, 0), d[w + 0] = 1 - A(u, a, "x", "z", r, t), d[w + 1] = A(u, a, "z", "x", r, e);
          break;
        case 3:
          u.set(0, -1, 0), d[w + 0] = 1 - A(u, a, "x", "z", r, t), d[w + 1] = 1 - A(u, a, "z", "x", r, e);
          break;
        case 4:
          u.set(0, 0, 1), d[w + 0] = 1 - A(u, a, "x", "y", r, t), d[w + 1] = 1 - A(u, a, "y", "x", r, s);
          break;
        case 5:
          u.set(0, 0, -1), d[w + 0] = A(u, a, "x", "y", r, t), d[w + 1] = 1 - A(u, a, "y", "x", r, s);
          break;
      }
  }
}
const fs = {
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
const ps = new te(-1, 1, 1, -1, 0, 1);
class ms extends ee {
  constructor() {
    super(), this.setAttribute("position", new _t([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), this.setAttribute("uv", new _t([0, 2, 0, 0, 2, 0], 2));
  }
}
const gs = new ms();
class yt {
  constructor(t) {
    this._mesh = new y(gs, t);
  }
  dispose() {
    this._mesh.geometry.dispose();
  }
  render(t) {
    t.render(this._mesh, ps);
  }
  get material() {
    return this._mesh.material;
  }
  set material(t) {
    this._mesh.material = t;
  }
}
class bs extends Z {
  constructor(t, s) {
    super(), this.textureID = s !== void 0 ? s : "tDiffuse", t instanceof ct ? (this.uniforms = t.uniforms, this.material = t) : t && (this.uniforms = vt.clone(t.uniforms), this.material = new ct({
      name: t.name !== void 0 ? t.name : "unspecified",
      defines: Object.assign({}, t.defines),
      uniforms: this.uniforms,
      vertexShader: t.vertexShader,
      fragmentShader: t.fragmentShader
    })), this.fsQuad = new yt(this.material);
  }
  render(t, s, e) {
    this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = e.texture), this.fsQuad.material = this.material, this.renderToScreen ? (t.setRenderTarget(null), this.fsQuad.render(t)) : (t.setRenderTarget(s), this.clear && t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil), this.fsQuad.render(t));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class Lt extends Z {
  constructor(t, s) {
    super(), this.scene = t, this.camera = s, this.clear = !0, this.needsSwap = !1, this.inverse = !1;
  }
  render(t, s, e) {
    const o = t.getContext(), r = t.state;
    r.buffers.color.setMask(!1), r.buffers.depth.setMask(!1), r.buffers.color.setLocked(!0), r.buffers.depth.setLocked(!0);
    let n, l;
    this.inverse ? (n = 0, l = 1) : (n = 1, l = 0), r.buffers.stencil.setTest(!0), r.buffers.stencil.setOp(o.REPLACE, o.REPLACE, o.REPLACE), r.buffers.stencil.setFunc(o.ALWAYS, n, 4294967295), r.buffers.stencil.setClear(l), r.buffers.stencil.setLocked(!0), t.setRenderTarget(e), this.clear && t.clear(), t.render(this.scene, this.camera), t.setRenderTarget(s), this.clear && t.clear(), t.render(this.scene, this.camera), r.buffers.color.setLocked(!1), r.buffers.depth.setLocked(!1), r.buffers.color.setMask(!0), r.buffers.depth.setMask(!0), r.buffers.stencil.setLocked(!1), r.buffers.stencil.setFunc(o.EQUAL, 1, 4294967295), r.buffers.stencil.setOp(o.KEEP, o.KEEP, o.KEEP), r.buffers.stencil.setLocked(!0);
  }
}
class vs extends Z {
  constructor() {
    super(), this.needsSwap = !1;
  }
  render(t) {
    t.state.buffers.stencil.setLocked(!1), t.state.buffers.stencil.setTest(!1);
  }
}
class xs {
  constructor(t, s) {
    if (this.renderer = t, this._pixelRatio = t.getPixelRatio(), s === void 0) {
      const e = t.getSize(new Tt());
      this._width = e.width, this._height = e.height, s = new Nt(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: Ut }), s.texture.name = "EffectComposer.rt1";
    } else
      this._width = s.width, this._height = s.height;
    this.renderTarget1 = s, this.renderTarget2 = s.clone(), this.renderTarget2.texture.name = "EffectComposer.rt2", this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = !0, this.passes = [], this.copyPass = new bs(fs), this.copyPass.material.blending = It, this.clock = new se();
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
    for (let o = 0, r = this.passes.length; o < r; o++) {
      const n = this.passes[o];
      if (n.enabled !== !1) {
        if (n.renderToScreen = this.renderToScreen && this.isLastEnabledPass(o), n.render(this.renderer, this.writeBuffer, this.readBuffer, t, e), n.needsSwap) {
          if (e) {
            const l = this.renderer.getContext(), a = this.renderer.state.buffers.stencil;
            a.setFunc(l.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, t), a.setFunc(l.EQUAL, 1, 4294967295);
          }
          this.swapBuffers();
        }
        Lt !== void 0 && (n instanceof Lt ? e = !0 : n instanceof vs && (e = !1));
      }
    }
    this.renderer.setRenderTarget(s);
  }
  reset(t) {
    if (t === void 0) {
      const s = this.renderer.getSize(new Tt());
      this._pixelRatio = this.renderer.getPixelRatio(), this._width = s.width, this._height = s.height, t = this.renderTarget1.clone(), t.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.renderTarget1 = t, this.renderTarget2 = t.clone(), this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2;
  }
  setSize(t, s) {
    this._width = t, this._height = s;
    const e = this._width * this._pixelRatio, o = this._height * this._pixelRatio;
    this.renderTarget1.setSize(e, o), this.renderTarget2.setSize(e, o);
    for (let r = 0; r < this.passes.length; r++)
      this.passes[r].setSize(e, o);
  }
  setPixelRatio(t) {
    this._pixelRatio = t, this.setSize(this._width, this._height);
  }
  dispose() {
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.copyPass.dispose();
  }
}
const ws = {
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
class ys extends Z {
  constructor() {
    super();
    const t = ws;
    this.uniforms = vt.clone(t.uniforms), this.material = new oe({
      name: t.name,
      uniforms: this.uniforms,
      vertexShader: t.vertexShader,
      fragmentShader: t.fragmentShader
    }), this.fsQuad = new yt(this.material), this._outputColorSpace = null, this._toneMapping = null;
  }
  render(t, s, e) {
    this.uniforms.tDiffuse.value = e.texture, this.uniforms.toneMappingExposure.value = t.toneMappingExposure, (this._outputColorSpace !== t.outputColorSpace || this._toneMapping !== t.toneMapping) && (this._outputColorSpace = t.outputColorSpace, this._toneMapping = t.toneMapping, this.material.defines = {}, ie.getTransfer(this._outputColorSpace) === re && (this.material.defines.SRGB_TRANSFER = ""), this._toneMapping === ae ? this.material.defines.LINEAR_TONE_MAPPING = "" : this._toneMapping === ne ? this.material.defines.REINHARD_TONE_MAPPING = "" : this._toneMapping === le ? this.material.defines.CINEON_TONE_MAPPING = "" : this._toneMapping === ce ? this.material.defines.ACES_FILMIC_TONE_MAPPING = "" : this._toneMapping === he ? this.material.defines.AGX_TONE_MAPPING = "" : this._toneMapping === ue && (this.material.defines.NEUTRAL_TONE_MAPPING = ""), this.material.needsUpdate = !0), this.renderToScreen === !0 ? (t.setRenderTarget(null), this.fsQuad.render(t)) : (t.setRenderTarget(s), this.clear && t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil), this.fsQuad.render(t));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class Cs extends Z {
  constructor(t, s, e = null, o = null, r = null) {
    super(), this.scene = t, this.camera = s, this.overrideMaterial = e, this.clearColor = o, this.clearAlpha = r, this.clear = !0, this.clearDepth = !1, this.needsSwap = !1, this._oldClearColor = new ot();
  }
  render(t, s, e) {
    const o = t.autoClear;
    t.autoClear = !1;
    let r, n;
    this.overrideMaterial !== null && (n = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor !== null && (t.getClearColor(this._oldClearColor), t.setClearColor(this.clearColor, t.getClearAlpha())), this.clearAlpha !== null && (r = t.getClearAlpha(), t.setClearAlpha(this.clearAlpha)), this.clearDepth == !0 && t.clearDepth(), t.setRenderTarget(this.renderToScreen ? null : e), this.clear === !0 && t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil), t.render(this.scene, this.camera), this.clearColor !== null && t.setClearColor(this._oldClearColor), this.clearAlpha !== null && t.setClearAlpha(r), this.overrideMaterial !== null && (this.scene.overrideMaterial = n), t.autoClear = o;
  }
}
const Ss = {
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
class Ms extends Z {
  constructor(t, s, e) {
    super(), this.scene = t, this.camera = s;
    const o = e.focus !== void 0 ? e.focus : 1, r = e.aperture !== void 0 ? e.aperture : 0.025, n = e.maxblur !== void 0 ? e.maxblur : 1;
    this.renderTargetDepth = new Nt(1, 1, {
      // will be resized later
      minFilter: Pt,
      magFilter: Pt,
      type: Ut
    }), this.renderTargetDepth.texture.name = "BokehPass.depth", this.materialDepth = new de(), this.materialDepth.depthPacking = fe, this.materialDepth.blending = It;
    const l = Ss, a = vt.clone(l.uniforms);
    a.tDepth.value = this.renderTargetDepth.texture, a.focus.value = o, a.aspect.value = s.aspect, a.aperture.value = r, a.maxblur.value = n, a.nearClip.value = s.near, a.farClip.value = s.far, this.materialBokeh = new ct({
      defines: Object.assign({}, l.defines),
      uniforms: a,
      vertexShader: l.vertexShader,
      fragmentShader: l.fragmentShader
    }), this.uniforms = a, this.fsQuad = new yt(this.materialBokeh), this._oldClearColor = new ot();
  }
  render(t, s, e) {
    this.scene.overrideMaterial = this.materialDepth, t.getClearColor(this._oldClearColor);
    const o = t.getClearAlpha(), r = t.autoClear;
    t.autoClear = !1, t.setClearColor(16777215), t.setClearAlpha(1), t.setRenderTarget(this.renderTargetDepth), t.clear(), t.render(this.scene, this.camera), this.uniforms.tColor.value = e.texture, this.uniforms.nearClip.value = this.camera.near, this.uniforms.farClip.value = this.camera.far, this.renderToScreen ? (t.setRenderTarget(null), this.fsQuad.render(t)) : (t.setRenderTarget(s), t.clear(), this.fsQuad.render(t)), this.scene.overrideMaterial = null, t.setClearColor(this._oldClearColor), t.setClearAlpha(o), t.autoClear = r;
  }
  setSize(t, s) {
    this.materialBokeh.uniforms.aspect.value = t / s, this.renderTargetDepth.setSize(t, s);
  }
  dispose() {
    this.renderTargetDepth.dispose(), this.materialDepth.dispose(), this.materialBokeh.dispose(), this.fsQuad.dispose();
  }
}
class ks extends Bt {
  constructor() {
    super();
    const t = new J();
    t.deleteAttribute("uv");
    const s = new z({ side: pe }), e = new z(), o = new Ot(16777215, 900, 28, 2);
    o.position.set(0.418, 16.199, 0.3), this.add(o);
    const r = new y(t, s);
    r.position.set(-0.757, 13.219, 0.717), r.scale.set(31.713, 28.305, 28.591), this.add(r);
    const n = new y(t, e);
    n.position.set(-10.906, 2.009, 1.846), n.rotation.set(0, -0.195, 0), n.scale.set(2.328, 7.905, 4.651), this.add(n);
    const l = new y(t, e);
    l.position.set(-5.607, -0.754, -0.758), l.rotation.set(0, 0.994, 0), l.scale.set(1.97, 1.534, 3.955), this.add(l);
    const a = new y(t, e);
    a.position.set(6.167, 0.857, 7.803), a.rotation.set(0, 0.561, 0), a.scale.set(3.927, 6.285, 3.687), this.add(a);
    const c = new y(t, e);
    c.position.set(-2.017, 0.018, 6.124), c.rotation.set(0, 0.333, 0), c.scale.set(2.002, 4.566, 2.064), this.add(c);
    const h = new y(t, e);
    h.position.set(2.291, -0.756, -2.621), h.rotation.set(0, -0.286, 0), h.scale.set(1.546, 1.552, 1.496), this.add(h);
    const f = new y(t, e);
    f.position.set(-2.193, -0.369, -5.547), f.rotation.set(0, 0.516, 0), f.scale.set(3.875, 3.487, 2.986), this.add(f);
    const d = new y(t, V(50));
    d.position.set(-16.116, 14.37, 8.208), d.scale.set(0.1, 2.428, 2.739), this.add(d);
    const p = new y(t, V(50));
    p.position.set(-16.109, 18.021, -8.207), p.scale.set(0.1, 2.425, 2.751), this.add(p);
    const u = new y(t, V(17));
    u.position.set(14.904, 12.198, -1.832), u.scale.set(0.15, 4.265, 6.331), this.add(u);
    const C = new y(t, V(43));
    C.position.set(-0.462, 8.89, 14.52), C.scale.set(4.38, 5.441, 0.088), this.add(C);
    const x = new y(t, V(20));
    x.position.set(3.235, 11.486, -12.541), x.scale.set(2.5, 2, 0.1), this.add(x);
    const w = new y(t, V(100));
    w.position.set(0, 20, 0), w.scale.set(1, 0.1, 1), this.add(w);
  }
  dispose() {
    const t = /* @__PURE__ */ new Set();
    this.traverse((s) => {
      s.isMesh && (t.add(s.geometry), t.add(s.material));
    });
    for (const s of t)
      s.dispose();
  }
}
function V(i) {
  const t = new ht();
  return t.color.setScalar(i), t;
}
const _s = [14826299, 15764010, 15782953, 3980106, 2865328, 3832831, 9063124], Ts = {
  normal: 3 / 16,
  fast: 3 / 16 * (0.16 / 0.34),
  turbo: 3 / 16 * (0.07 / 0.34)
};
class Ps {
  constructor(t) {
    v(this, "onLand", null);
    v(this, "renderer");
    v(this, "scene", new Bt());
    v(this, "camera");
    v(this, "sun");
    v(this, "glint");
    v(this, "board", new me());
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
    this.fancy = !Ds();
    const s = document.createElement("canvas");
    s.setAttribute("data-plinko-gl", "1"), this.renderer = new ge({
      canvas: s,
      antialias: this.fancy,
      alpha: !1,
      powerPreference: "high-performance",
      preserveDrawingBuffer: !0
    }), this.renderer.outputColorSpace = it, this.renderer.setClearColor(13210965, 1), this.renderer.shadowMap.enabled = this.fancy, this.renderer.shadowMap.type = be, s.style.width = "100%", s.style.height = "100%", s.style.display = "block", s.style.touchAction = "none", t.appendChild(s), this.camera = new ve(34, 1, 0.08, 80), this.scene.background = new ot(14131548), this.scene.add(this.board), this.scene.add(new xe(16774884, 9263664, 0.38)), this.sun = new Dt(16774111, 0.72), this.sun.position.set(2.4, 14, -1.2), this.sun.castShadow = this.fancy, this.sun.shadow.mapSize.set(1024, 1024), this.sun.shadow.camera.near = 1, this.sun.shadow.camera.far = 28, this.sun.shadow.camera.left = -8, this.sun.shadow.camera.right = 8, this.sun.shadow.camera.top = 8, this.sun.shadow.camera.bottom = -8, this.sun.shadow.bias = -8e-4, this.scene.add(this.sun);
    const e = new Dt(16769720, 0.38);
    e.position.set(-5, 7, 3), this.scene.add(e), this.glint = new Ot(16777215, 6, 18), this.scene.add(this.glint);
    const o = new we(this.renderer);
    this.scene.environment = o.fromScene(new ks(), 0.04).texture, o.dispose(), this.fancy && this.enableDepthOfField(), this.resize(t.clientWidth || 320, t.clientHeight || 420);
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
    const s = new y(this.ballGeometry ?? this.ensureBall(), this.marbleMaterial());
    s.castShadow = this.fancy, s.receiveShadow = !1;
    const e = new y(
      this.shadowGeometry(),
      new ht({
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
    const s = Ts[this.speed];
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
      const r = e.shadow.material;
      return Array.isArray(r) || r.dispose(), this.board.remove(e.mesh), this.board.remove(e.shadow), !1;
    });
    for (const [e, o] of this.pulses) {
      const r = o - t, n = this.bucketMeshes[e];
      if (n) {
        const l = Number(n.userData.restY ?? n.position.y), a = r > 0 ? r / 0.45 * this.frame.spacing * 0.12 : 0;
        n.position.y = l - a;
        const c = n.material;
        c instanceof z && (c.emissive.set("#ffffff"), c.emissiveIntensity = r > 0 ? r / 0.45 * 0.45 : 0);
        const h = n.userData.plate;
        h && (h.position.y = n.position.y + Number(n.userData.lip ?? 0));
      }
      r <= 0 ? this.pulses.delete(e) : this.pulses.set(e, r);
    }
    for (const [e, o] of this.pegFlash) {
      const [r, n] = e.split(":").map(Number), l = this.pegMeshes[r ?? -1]?.[n ?? -1], a = o - t;
      if (l) {
        l.scale.setScalar(1);
        const c = l.material;
        c instanceof z && (c.emissive.set("#fff6d0"), c.emissiveIntensity = a > 0 ? a / 0.12 * 0.28 : 0);
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
    const t = new xs(this.renderer);
    t.addPass(new Cs(this.scene, this.camera));
    const s = new Ms(this.scene, this.camera, {
      focus: 12,
      aperture: 45e-6,
      maxblur: 4e-3
    });
    t.addPass(s), t.addPass(new ys()), this.composer = t, this.bokeh = s;
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
    const { span: t, spacing: s, rowGap: e, topZ: o, depth: r } = this.measure();
    this.frame = { span: t, spacing: s, rowGap: e, topZ: o, depth: r };
    const n = this.woodMaterial(), l = new y(new Et(t + 0.7, 0.2, r + 0.35, 2, 0.06), n);
    l.position.y = -0.1, l.receiveShadow = !0, l.castShadow = this.fancy, this.board.add(l), this.layoutOwned.push(l.geometry), this.addRail(n, t, r), this.addPosts(t, r), this.addPegs(), this.addBuckets(), this.built = !0, this.frameCamera();
    for (const a of this.marbles) this.placeMarble(a);
  }
  measure() {
    const s = 10.2 / (this.rows + 1), e = s * 0.9, o = this.rows * e / 2, r = this.rows * e + s * 1.05;
    return { span: 10.2, spacing: s, rowGap: e, topZ: o, depth: r };
  }
  addRail(t, s, e) {
    const n = new J(0.2, 0.26, e + 0.2), l = new J(s + 0.2, 0.26, 0.2);
    this.layoutOwned.push(n, l);
    const a = 0.26 / 2, c = s / 2 + 0.2 / 2, h = e / 2;
    for (const C of [
      new y(n, t),
      new y(n, t),
      new y(l, t),
      new y(l, t)
    ])
      C.castShadow = this.fancy, C.receiveShadow = !0, this.board.add(C);
    const [f, d, p, u] = this.board.children.slice(-4);
    !f || !d || !p || !u || (f.position.set(-c, a, 0), d.position.set(c, a, 0), p.position.set(0, a, h), u.position.set(0, a, -h));
  }
  addPosts(t, s) {
    const e = new ye(0.07, 0.07, 0.85, 16), o = new z({
      map: As(),
      roughness: 0.45,
      metalness: 0.02
    });
    this.layoutOwned.push(e, o, o.map);
    const r = t / 2 + 0.55, n = s / 2 - 0.15;
    for (const l of [-r, r])
      for (const a of [-n, n]) {
        const c = new y(e, o);
        c.position.set(l, 0.42, a), c.castShadow = this.fancy, c.receiveShadow = !0, this.board.add(c);
      }
  }
  addPegs() {
    const { rowGap: t, topZ: s } = this.frame, e = this.frame.spacing * dt, o = new Ce(e, e * 0.55, 5, 14);
    this.pegMeshes = [], this.layoutOwned.push(o);
    const r = _s.map(
      (l) => new z({
        color: l,
        roughness: 0.62,
        metalness: 0
      })
    );
    this.layoutOwned.push(...r);
    let n = 0;
    for (let l = 0; l < this.rows; l += 1) {
      const a = 3 + l, c = s - (l + 1) * t;
      for (let h = 0; h < a; h += 1) {
        const f = r[n % r.length];
        if (n += 1, !f) continue;
        const d = f.clone();
        this.layoutOwned.push(d);
        const p = new y(o, d);
        p.position.set(this.pegX(l, h), e * 1.3, c);
        const u = this.pegMeshes[l] ?? [];
        u[h] = p, this.pegMeshes[l] = u, p.castShadow = this.fancy, p.receiveShadow = !0, this.board.add(p);
      }
    }
  }
  addBuckets() {
    const t = wt(this.rows, this.risk), { spacing: s } = this.frame, e = this.zAt(this.rows) - s * 0.72, o = Math.max(0.36, s * 0.7), r = new Et(s * 0.9, o, s * 1.05, 3, 0.08);
    this.layoutOwned.push(r);
    for (let n = 0; n < t.length; n += 1) {
      const l = Ze(n, t.length), a = Es(ut(t[n] ?? 0), l, Qe(n, t.length)), c = new z({
        color: jt(l),
        roughness: 0.45,
        metalness: 0.04
      }), h = new y(r, c), f = this.pegX(this.rows - 1, n), d = this.pegX(this.rows - 1, n + 1);
      h.position.set((f + d) / 2, o / 2, e), h.userData.restY = o / 2, h.userData.lip = o / 2 + 0.02, h.castShadow = this.fancy, h.receiveShadow = !0, this.board.add(h), this.bucketMeshes.push(h), this.layoutOwned.push(c, a);
      const p = new y(
        new Se(s * 0.84, s * 0.62),
        new ht({ map: a, side: Me, toneMapped: !1 })
      );
      p.rotation.x = -Math.PI / 2, p.position.set(h.position.x, o + 0.02, e), h.userData.plate = p, this.board.add(p), this.layoutOwned.push(p.geometry, p.material);
    }
  }
  placeMarble(t) {
    const s = Math.min(t.step, Math.max(0, t.shot.rows - 1)), e = t.landed || t.step >= t.shot.rows ? 1 : t.u, o = ts(
      t.shot.rows,
      t.shot.path,
      s,
      e,
      dt,
      ft,
      t.shot.motion?.[s]
    );
    o.hit && this.pegFlash.set(`${o.hit.row}:${o.hit.index}`, 0.12);
    const { spacing: r, topZ: n, rowGap: l } = this.frame, a = -this.frame.span / 2 + o.x * r, c = n - o.y * l, h = r * ft, f = o.squash || 1, d = h * (0.22 + (o.pop || 0) * 0.2);
    t.mesh.position.set(a, h * f + d, c), t.mesh.rotation.z = -o.x * 0.8, t.mesh.rotation.x = o.y * 0.8;
    const p = h / 0.2, u = p / Math.sqrt(f);
    t.mesh.scale.set(u, p * f, u), t.shadow.position.set(a, 0.02, c), t.shadow.scale.set(p, p, 1);
    const C = t.shadow.material;
    Array.isArray(C) || (C.opacity = o.hit ? 0.45 : 0.28);
  }
  pegX(t, s) {
    const e = 3 + t, o = (this.rows + 2 - e) / 2 * this.frame.spacing;
    return -this.frame.span / 2 + o + s * this.frame.spacing;
  }
  zAt(t) {
    return this.frame.topZ - t * this.frame.rowGap;
  }
  frameCamera() {
    const { span: t, topZ: s, rowGap: e } = this.frame, o = this.zAt(this.rows) - this.frame.spacing * 1.35, r = s + e * 0.2, n = (o + r) / 2, l = 60 * Math.PI / 180, a = 30 * Math.PI / 180;
    this.camera.fov = 30;
    const c = Math.max(0.35, this.width / Math.max(1, this.height)), h = 2 * Math.atan(Math.tan(a / 2) * c), d = (t / 2 + 0.22) / Math.tan(h / 2) / 0.9, p = new q(0, 0.15, n);
    this.camera.position.set(0, Math.sin(l) * d, n - Math.cos(l) * d), this.camera.lookAt(p), this.camera.updateProjectionMatrix(), this.glint.position.copy(this.camera.position).add(new q(-0.8, 0.4, 0.6));
    const u = this.bokeh?.uniforms;
    u?.focus && (u.focus.value = this.camera.position.distanceTo(p));
  }
  ensureBall() {
    return this.ballGeometry ? this.ballGeometry : (this.ballGeometry = new ke(0.33, 40, 28), this.owned.push(this.ballGeometry), this.ballGeometry);
  }
  marbleMaterial() {
    return new _e({
      color: 15199730,
      metalness: 0.62,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      reflectivity: 0.92,
      envMapIntensity: 1.8
    });
  }
  shadowGeometry() {
    const t = this.owned.find((e) => e instanceof at);
    if (t instanceof at) return t;
    const s = new at(0.3, 24);
    return this.owned.push(s), s;
  }
  woodMaterial() {
    const t = Rs(), s = new z({ map: t, roughness: 0.78, metalness: 0.02 });
    return this.layoutOwned.push(s, t), s;
  }
}
function Ds() {
  const i = navigator, t = i.hardwareConcurrency ?? 8, s = i.deviceMemory ?? 8;
  return t <= 4 || s <= 4;
}
function Rs() {
  const i = document.createElement("canvas");
  i.width = 256, i.height = 256;
  const t = i.getContext("2d");
  if (!t) throw new Error("wood");
  t.fillStyle = "#c4894a", t.fillRect(0, 0, 256, 256);
  for (let e = 0; e < 256; e += 2) {
    const o = 70 + e * 13 % 70;
    t.strokeStyle = `rgba(${o + 40}, ${Math.max(20, o - 10)}, ${Math.max(8, o - 40)}, 0.35)`, t.lineWidth = 1 + e * 5 % 3, t.beginPath(), t.moveTo(0, e), t.bezierCurveTo(80, e + (e % 7 - 3), 160, e - (e % 5 - 2), 256, e + (e % 4 - 1)), t.stroke();
  }
  const s = new xt(i);
  return s.colorSpace = it, s.wrapS = tt, s.wrapT = tt, s.repeat.set(2, 2), s;
}
function As() {
  const i = document.createElement("canvas");
  i.width = 64, i.height = 128;
  const t = i.getContext("2d");
  if (!t) throw new Error("cane");
  for (let e = -4; e < 8; e += 1)
    t.fillStyle = e % 2 === 0 ? "#f4f7f8" : "#d7263d", t.beginPath(), t.moveTo(e * 16, 0), t.lineTo(e * 16 + 16, 0), t.lineTo(e * 16 + 48, 128), t.lineTo(e * 16 + 32, 128), t.closePath(), t.fill();
  const s = new xt(i);
  return s.colorSpace = it, s.wrapS = tt, s.wrapT = tt, s;
}
function jt(i) {
  const t = i.match(/hsl\(([-\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)/), s = new ot();
  return t ? (s.setHSL(Number(t[1]) / 360, Number(t[2]) / 100, Number(t[3]) / 100), s) : s.set("#888888");
}
function Es(i, t, s) {
  const e = document.createElement("canvas");
  e.width = 512, e.height = 256;
  const o = e.getContext("2d");
  if (!o) throw new Error("label");
  const r = `#${jt(t).getHexString()}`;
  o.fillStyle = r, o.fillRect(0, 0, 512, 256), o.fillStyle = s;
  let n = 150;
  for (o.textAlign = "center", o.textBaseline = "middle", o.font = `800 ${n}px Outfit, sans-serif`; n > 64 && o.measureText(i).width > 470; )
    n -= 6, o.font = `800 ${n}px Outfit, sans-serif`;
  o.fillText(i, 256, 136);
  const l = new xt(e);
  return l.colorSpace = it, l.center.set(0.5, 0.5), l.rotation = Math.PI, l.needsUpdate = !0, l;
}
function Bs() {
  return as({
    manifest: Ie,
    title: "木珠",
    gameAttr: "wgf-game:plinko-3d",
    extraClass: "plinko3d",
    createBoard: (i) => new Ps(i)
  });
}
export {
  Bs as createGame,
  Ie as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"three":"0.170.0","@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
