var Pt = Object.defineProperty;
var Rt = (e, n, s) => n in e ? Pt(e, n, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[n] = s;
var I = (e, n, s) => Rt(e, typeof n != "symbol" ? n + "" : n, s);
import { registerStrings as Ct, defineGame as Et, writeSettings as qt, bindVisualViewport as It, patchGame as Bt, t as $t } from "@wgf/core";
import { TokenStore as At, HttpClient as _t } from "@wgf/net";
const Nt = {
  background: "#0a0a0a",
  shapes: [
    { tag: "circle", attrs: { cx: 160, cy: 78, r: 5, fill: "#f4f4f4" } },
    { tag: "circle", attrs: { cx: 140, cy: 108, r: 5, fill: "#f4f4f4" } },
    { tag: "circle", attrs: { cx: 180, cy: 108, r: 5, fill: "#f4f4f4" } },
    { tag: "circle", attrs: { cx: 120, cy: 138, r: 5, fill: "#d0d0d0" } },
    { tag: "circle", attrs: { cx: 160, cy: 138, r: 5, fill: "#d0d0d0" } },
    { tag: "circle", attrs: { cx: 200, cy: 138, r: 5, fill: "#d0d0d0" } },
    { tag: "rect", attrs: { x: 70, y: 176, width: 36, height: 22, rx: 8, fill: "#f4f4f4" } },
    { tag: "rect", attrs: { x: 112, y: 176, width: 36, height: 22, rx: 8, fill: "#8a8a8a" } },
    { tag: "rect", attrs: { x: 154, y: 176, width: 36, height: 22, rx: 8, fill: "#2e2e2e" } },
    { tag: "rect", attrs: { x: 196, y: 176, width: 36, height: 22, rx: 8, fill: "#8a8a8a" } },
    { tag: "rect", attrs: { x: 238, y: 176, width: 36, height: 22, rx: 8, fill: "#f4f4f4" } }
  ]
}, Ht = {
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
  art: Nt,
  renderer: "dom",
  controls: "pointer",
  tags: ["弹珠", "联网"],
  theme: { accent: "#fafafa", accentInk: "#0a0a0a", glow: "#2e2e2e", radius: 16, font: "sans" }
}, Y = 8, K = 16, H = [10, 20, 50, 100], Ot = ["low", "mid", "high"], pt = [
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
function gt(e, n) {
  let s = 1;
  for (let t = 1; t <= n; t += 1) s = s * (e - n + t) / t;
  return s;
}
function J(e) {
  const n = e.length - 1, s = 2 ** n;
  let t = 0;
  for (let o = 0; o < e.length; o += 1)
    t += gt(n, o) / s * (e[o] ?? 0);
  return t;
}
function Wt(e, n, s, t) {
  const o = e / 2;
  return Array.from({ length: e + 1 }, (a, r) => {
    const i = o === 0 ? 0 : Math.abs(r - o) / o;
    return s * (n / s) ** i ** t;
  });
}
function Gt(e) {
  return e >= 100 ? Math.max(1, Math.round(e)) : Math.max(0.1, Math.round(e * 10) / 10);
}
function zt(e) {
  const n = e.length - 1, s = e.slice();
  for (let t = 0; t <= n; t += 1) {
    const o = Gt(((s[t] ?? 0) + (s[n - t] ?? 0)) / 2);
    s[t] = o, s[n - t] = o;
  }
  return s;
}
function Dt(e) {
  const n = e / 2, s = [];
  for (let t = 0; t <= e; t += 1) Math.abs(t - n) <= 0.5 && s.push(t);
  return s;
}
function Xt(e, n, s, t) {
  const o = Wt(e, n, s, t), a = zt(o.map((u) => u * (0.99 / J(o)))), r = Dt(e);
  let i = a, l = Math.abs(J(i) - 0.99);
  for (let u = -20; u <= 20; u += 1) {
    const b = a.slice(), v = a[r[0] ?? 0] ?? 0, p = Math.max(0.1, Math.round((v + u * 0.1) * 10) / 10);
    for (const c of r) b[c] = p;
    const S = Math.abs(J(b) - 0.99);
    S < l && (l = S, i = b);
  }
  return i;
}
function Ft() {
  const e = {
    low: [18, 1.05, 2.2],
    mid: [160, 0.45, 1.65],
    high: [700, 0.2, 1.25]
  }, n = { low: {}, mid: {}, high: {} };
  for (const s of Ot) {
    const t = e[s];
    for (let o = Y; o <= K; o += 1)
      n[s][o] = Xt(o, t[0], t[1], t[2]);
  }
  return n.high[16] = pt, n;
}
const ut = Ft();
function at(e, n) {
  return ut[n][e] ?? ut.mid[16] ?? pt;
}
function Yt(e) {
  return Number.isInteger(e) && e >= Y && e <= K;
}
function Kt(e) {
  return e === "low" || e === "mid" || e === "high";
}
function Ut(e) {
  return H.includes(e);
}
function Q(e) {
  return e >= 1e3 ? "1kx" : e >= 100 ? `${Math.round(e)}x` : `${e.toFixed(1)}x`;
}
function bt(e, n) {
  const s = (n - 1) / 2;
  return s === 0 ? 0 : Math.abs(e - s) / s;
}
function jt(e, n) {
  return `hsl(0 0% ${(14 + bt(e, n) ** 1.35 * 82).toFixed(1)}%)`;
}
function Jt(e, n) {
  return bt(e, n) > 0.56 ? "#0a0a0a" : "#f5f5f5";
}
const F = 1e3;
function D() {
  return { credits: F };
}
function Vt(e, n) {
  const s = 2 ** e, t = n() * s;
  let o = 0;
  for (let a = 0; a <= e; a += 1)
    if (o += gt(e, a), t < o) return a;
  return e;
}
function Qt(e, n, s, t, o, a) {
  if (!Ut(n)) return { error: "bad_bet" };
  if (!Yt(s)) return { error: "bad_rows" };
  if (!Kt(t)) return { error: "bad_risk" };
  if (e.credits < n) return { error: "insufficient" };
  const r = at(s, t), i = typeof a == "number" && Number.isInteger(a) && a >= 0 && a <= s ? a : Vt(s, o), l = r[i] ?? 0, u = Math.round(n * l);
  return e.credits -= n, e.credits += u, { rows: s, risk: t, bet: n, bucket: i, multiplier: l, win: u, credits: e.credits };
}
const Zt = 0.63;
function te(e, n, s) {
  let t = Math.max(0, Math.min(e, Math.floor(n))), o = e - t;
  const a = [];
  let r = null;
  for (let i = 0; i < e; i += 1) {
    let l;
    if (t <= 0) l = "L";
    else if (o <= 0) l = "R";
    else if (r === null) l = s() < t / (t + o) ? "R" : "L";
    else {
      const u = r === "R" ? "L" : "R";
      l = (s() < Zt ? r : u) === "R" ? t > 0 ? "R" : "L" : o > 0 ? "L" : "R";
    }
    a.push(l), l === "R" ? t -= 1 : o -= 1, r = l;
  }
  return a;
}
const Z = 0.13, tt = 0.325, et = 0.92;
function ee(e, n) {
  const s = [];
  let t = 1, o = 0;
  for (const a of e) {
    const r = a === "R" ? 1 : -1, i = 0.92 + n() * 0.16, l = 0.97 + n() * 0.06;
    t = t * 0.35 + l * 0.65, o = Math.max(-0.4, Math.min(0.4, o * 0.4 + r * (0.12 + n() * 0.1))), s.push({ hop: i, pace: t, flourish: "none", vx: o });
  }
  return s;
}
function mt(e, n, s) {
  return { x: (e - 1 - n) / 2 + s, y: n + 1 };
}
function kt(e, n) {
  return e + n;
}
function nt(e) {
  return e === "R" ? 1 : -1;
}
function st(e, n, s, t) {
  return {
    x: e.x + s * Math.sin(n) * t,
    y: e.y - Math.cos(n) * t / et
  };
}
function yt(e, n) {
  let s = 0;
  for (let t = 0; t < n; t += 1) e[t] === "R" && (s += 1);
  return s;
}
function wt(e, n, s) {
  const t = s[n] === "R" ? "R" : "L", o = yt(s, n) + 1;
  return { peg: mt(e, n, o), index: o, dir: t };
}
const ot = 1.02;
function ne(e, n, s, t, o = Z, a = tt, r) {
  const i = Math.max(0, Math.min(e - 1, s)), l = Math.max(0, Math.min(1, t)), u = kt(o, a), b = wt(e, i, n), v = nt(b.dir), p = (r?.hop ?? 1) * (1 - i * 4e-3), S = r?.vx ?? 0, c = st(b.peg, ot, v, u), L = vt(c, v), M = st(b.peg, ot - 0.06, v, u + 0.12 * p);
  M.x += S * 0.02;
  const k = oe(e, n, i, o, a), C = { row: i, index: b.index }, P = 0.22, E = (T) => se(T, e, u);
  if (l <= P) {
    const T = l / P, m = T * T;
    return {
      ...E({
        x: L.x + (c.x - L.x) * m,
        y: L.y + (c.y - L.y) * m
      }),
      hit: T > 0.92 ? C : null,
      squash: T > 0.92 ? 0.96 : 1,
      pop: 0
    };
  }
  if (l <= P + 0.1) {
    const T = (l - P) / 0.1, m = Math.sin(T * Math.PI / 2);
    return {
      ...E({
        x: c.x + (M.x - c.x) * m,
        y: c.y + (M.y - c.y) * m
      }),
      hit: T < 0.18 ? C : null,
      squash: T < 0.18 ? 0.96 : 1,
      pop: m * 0.45
    };
  }
  const G = (l - (P + 0.1)) / (1 - (P + 0.1)), O = G * G;
  return {
    ...E({
      x: M.x + (k.x - M.x) * O,
      y: M.y + (k.y - M.y) * O
    }),
    hit: null,
    squash: 1,
    pop: 0.4 * (1 - G)
  };
}
function se(e, n, s) {
  let t = e;
  for (let o = 0; o < 4; o += 1)
    for (let a = 0; a < n; a += 1)
      for (let r = 0; r < 3 + a; r += 1) {
        const i = mt(n, a, r), l = t.x - i.x, u = (t.y - i.y) * et, b = Math.hypot(l, u);
        if (b >= s || b === 0) continue;
        const v = s / b;
        t = { x: i.x + l * v, y: i.y + u * v / et };
      }
  return t;
}
function oe(e, n, s, t, o) {
  const r = yt(n, s) + (n[s] === "R" ? 1 : 0);
  if (s + 1 >= e) return { x: r + 0.5, y: e + 1.35 };
  const i = wt(e, s + 1, n), l = st(i.peg, ot, nt(i.dir), kt(t, o));
  return vt(l, nt(i.dir));
}
function vt(e, n) {
  return { x: e.x + n * 0.06, y: e.y - 0.18 };
}
function ae() {
  Ct("plinko", {
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
const re = {}, V = "wgf:slots-wallet", St = "wgf:slots-token", ie = "wgf:session";
function le(e) {
  ae();
  let n = null;
  const s = [];
  let t = null, o = null, a = D(), r = F, i = 20, l = 16, u = "high", b = "normal", v = !1, p = "pending", S = !1, c = "ready", L = -1, M = -1, k = 0;
  const C = [], P = /* @__PURE__ */ new Set();
  let E = null, G = !1, O = 0, q = () => {
  };
  function T(g, f) {
    return $t(n?.store.getState().ui.locale ?? "zh", g, f);
  }
  function m() {
    if (!t) return;
    const g = t.querySelector("[data-credits]"), f = t.querySelector("[data-amount]"), w = t.querySelector("[data-row-label]"), R = t.querySelector("[data-row-slider]"), _ = t.querySelector("[data-demo]"), x = t.querySelector("[data-source]");
    g && (g.textContent = String(r)), f && (f.textContent = String(i)), w && (w.textContent = String(l)), R && (R.value = String(l)), _ && (_.hidden = p !== "local"), x && (x.textContent = T(p === "server" ? "plinko.server" : p === "local" ? "plinko.local" : "plinko.pending")), t.dataset.rows = String(l), t.dataset.risk = u, t.dataset.pace = b, t.dataset.pegs = String(l + 2), t.dataset.buckets = String(l + 1), L >= 0 && (t.dataset.bucket = String(L)), M >= 0 && (t.dataset.landed = String(M)), t.dataset.round = o && o.inflight > 0 ? "busy" : "open";
    const d = H.indexOf(i), B = t.querySelector("[data-bet-dec]"), $ = t.querySelector("[data-bet-inc]");
    B && (B.disabled = d <= 0), $ && ($.disabled = d >= H.length - 1), t.querySelectorAll("[data-bet]").forEach((y) => {
      y.classList.toggle("is-bet", Number(y.dataset.bet) === i);
    }), t.querySelectorAll("[data-speed]").forEach((y) => {
      y.classList.toggle("is-on", y.dataset.speed === b);
    }), t.querySelectorAll("[data-risk-pick]").forEach((y) => {
      y.classList.toggle("is-on", y.dataset.riskPick === u);
    });
    const W = t.querySelector("[data-drop]");
    W && (W.disabled = !S || c !== "running" || r < i), t.querySelectorAll("[data-mode]").forEach((y) => {
      const h = y.dataset.mode === "auto" === v;
      y.classList.toggle("is-on", h), y.setAttribute("aria-selected", h ? "true" : "false");
    });
    const X = t.querySelector("[data-balance]");
    X && (X.hidden = !!t.closest(".play.is-embedded") && p !== "server");
    const N = t.querySelector("[data-sound]");
    if (N && n) {
      const y = n.store.getState().ui;
      N.setAttribute("aria-pressed", y.musicMuted && y.sfxMuted ? "true" : "false");
    }
    const z = t.querySelector("[data-history]");
    if (z)
      if (C.length === 0) {
        const y = document.createElement("span");
        y.className = "plinko-history-empty", y.textContent = "游戏结果将会显示", z.replaceChildren(y);
      } else
        z.replaceChildren(
          ...C.slice(0, 8).map((y) => {
            const h = document.createElement("span");
            return h.textContent = Q(y), h.style.background = ue(y), h.style.color = y >= 3 ? "#0a0a0a" : "#fafafa", h;
          })
        );
    o?.setLayout(l, u), o?.setSpeed(b), t.dataset.seq = String(O), Tt(t);
  }
  function A() {
    n && Bt(n.store, {
      id: e.manifest.id,
      status: c,
      score: Math.max(0, r - F),
      highScore: Math.max(0, r),
      message: "",
      detail: T(p === "server" ? "plinko.server" : "plinko.local"),
      credits: r
    });
  }
  function rt() {
    p === "local" && localStorage.setItem(V, JSON.stringify(a));
  }
  function it() {
    try {
      const g = localStorage.getItem(V);
      if (!g) return D();
      const f = JSON.parse(g);
      return !f || typeof f.credits != "number" ? D() : { credits: Math.max(0, Math.floor(f.credits)) };
    } catch {
      return D();
    }
  }
  async function lt() {
    if (!await be()) {
      p = "local", a = it(), r = a.credits, S = !0, A(), m();
      return;
    }
    try {
      const f = await ft().post("/api/plinko/session", {});
      f.walletToken && localStorage.setItem(St, f.walletToken), G = f.demo === !0, p = "server", a = { credits: f.credits }, r = f.credits;
    } catch {
      p = "local", a = it(), r = a.credits;
    }
    S = !0, A(), m();
  }
  async function U() {
    if (!S || c !== "running" || r < i) return;
    const g = he();
    if (P.has(g)) return;
    const f = { bet: i, rows: l, risk: u }, w = ct() ? E : null;
    let R;
    if (p === "server")
      try {
        const d = await ft().post("/api/plinko/drop", {
          bet: f.bet,
          spinId: g,
          rows: f.rows,
          risk: f.risk,
          ...w !== null ? { bucket: w } : {}
        });
        R = d, a = { credits: d.credits };
      } catch {
        return;
      }
    else {
      const d = Qt(
        a,
        f.bet,
        f.rows,
        f.risk,
        Math.random,
        w
      );
      if ("error" in d) return;
      R = d, rt();
    }
    P.add(g), r -= f.bet, L = R.bucket;
    const _ = te(f.rows, R.bucket, Math.random), x = {
      path: _,
      rows: f.rows,
      bet: f.bet,
      bucket: R.bucket,
      multiplier: R.multiplier,
      win: R.win,
      motion: ee(_, Math.random)
    };
    o?.launch(x), A(), m();
  }
  function Mt(g) {
    r += g.win, M = g.bucket, O += 1, C.unshift(g.multiplier), C.length > 8 && (C.length = 8), r < H[0] && (!o || o.inflight === 0) && (v = !1, c = "over"), A(), m();
  }
  function ct() {
    return ce() && (p === "local" || G);
  }
  function Tt(g) {
    const f = g.querySelector("[data-debug]");
    f && (f.hidden = !ct());
    const w = g.querySelector("[data-debug-result]");
    if (!w) return;
    const R = `${l}:${u}`;
    if (w.dataset.key === R) return;
    const _ = at(l, u), x = E, d = document.createElement("option");
    d.value = "random", d.textContent = "随机";
    const B = [d];
    for (let $ = 0; $ <= l; $ += 1) {
      const W = document.createElement("option");
      W.value = String($), W.textContent = `${$} ${Q(_[$] ?? 0)}`, B.push(W);
    }
    w.replaceChildren(...B), w.dataset.key = R, x !== null && x <= l ? (E = x, w.value = String(x)) : (E = null, w.value = "random");
  }
  return Et(e.manifest, {
    async onPreload(g, f) {
      await g.preload([], f);
    },
    async onMount(g) {
      n = g, g.container.setAttribute("data-wgf-game", e.gameAttr), t = document.createElement("div"), t.className = e.extraClass ? `plinko ${e.extraClass}` : "plinko", t.innerHTML = fe(e.title);
      const f = t.querySelector("[data-board]");
      f instanceof HTMLElement && (o = e.createBoard(f), o.onLand = Mt, o.setLayout(l, u)), g.container.appendChild(t);
      const w = t;
      w.addEventListener("input", (x) => {
        const d = x.target;
        if (!(d instanceof HTMLInputElement) || !d.matches("[data-row-slider]")) return;
        if (o && o.inflight > 0) {
          d.value = String(l);
          return;
        }
        const B = Number(d.value);
        B >= Y && B <= K && (l = B), m(), q();
      }), w.addEventListener("change", (x) => {
        const d = x.target;
        !(d instanceof HTMLSelectElement) || !d.matches("[data-debug-result]") || (E = d.value === "random" ? null : Number(d.value));
      }), w.addEventListener("click", (x) => {
        const d = x.target;
        if (!(d instanceof Element)) return;
        if (d.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        if (d.closest("[data-sound]") && n) {
          const h = n.store.getState().ui, j = !(h.musicMuted && h.sfxMuted), dt = {
            locale: h.locale,
            music: h.music,
            sfx: h.sfx,
            musicMuted: j,
            sfxMuted: j
          };
          qt(dt), n.store.setState((Lt) => ({
            ui: { ...Lt.ui, ...dt, muted: j }
          })), m();
          return;
        }
        const B = d.closest("[data-bet]"), $ = B instanceof HTMLElement ? Number(B.dataset.bet) : Number.NaN;
        if (H.includes($)) {
          i = $, w.classList.remove("is-bets"), m();
          return;
        }
        if (d.closest("[data-bet-dec]")) {
          const h = H[H.indexOf(i) - 1];
          h !== void 0 && (i = h), w.classList.remove("is-bets"), m();
          return;
        }
        if (d.closest("[data-bet-inc]")) {
          const h = H[H.indexOf(i) + 1];
          h !== void 0 && (i = h), w.classList.remove("is-bets"), m();
          return;
        }
        if (d.closest("[data-amount-bar]")) {
          w.classList.toggle("is-bets");
          return;
        }
        if (w.classList.contains("is-bets") && !d.closest("[data-bet-ui]") && w.classList.remove("is-bets"), d.closest("[data-row-dec]") && (!o || o.inflight === 0)) {
          l > Y && (l -= 1), m(), q();
          return;
        }
        if (d.closest("[data-row-inc]") && (!o || o.inflight === 0)) {
          l < K && (l += 1), m(), q();
          return;
        }
        const W = d.closest("[data-risk-pick]");
        if (W instanceof HTMLElement && (!o || o.inflight === 0)) {
          const h = W.dataset.riskPick;
          (h === "low" || h === "mid" || h === "high") && (u = h), m();
          return;
        }
        const X = d.closest("[data-speed]");
        if (X instanceof HTMLElement) {
          const h = X.dataset.speed;
          (h === "normal" || h === "fast" || h === "turbo") && (b = h), m();
          return;
        }
        const N = w.querySelector("[data-fair-panel]"), z = w.querySelector("[data-fair]");
        if (d.closest("[data-fair]")) {
          N && z && (N.hidden = !N.hidden, z.setAttribute("aria-expanded", N.hidden ? "false" : "true"));
          return;
        }
        N && !N.hidden && !d.closest("[data-fair-panel]") && (N.hidden = !0, z?.setAttribute("aria-expanded", "false"));
        const y = d.closest("[data-mode]");
        if (y instanceof HTMLElement) {
          const h = y.dataset.mode;
          h === "manual" && (v = !1), h === "auto" && (v = !0, k = 0), m(), v && U();
          return;
        }
        d.closest("[data-drop]") && U();
      }), q = () => {
        de();
        const x = t?.querySelector("[data-board]");
        !(x instanceof HTMLElement) || !o || o.resize(x.clientWidth, x.clientHeight);
      }, q();
      const R = new ResizeObserver(() => q());
      R.observe(t);
      const _ = t.querySelector("[data-board]");
      _ && R.observe(_), s.push(() => R.disconnect()), s.push(It(() => q())), s.push(
        g.loop.onUpdate((x) => {
          o?.update(x), v && c === "running" && (!o || o.inflight < 6) && (k -= x, k <= 0 && r >= i && (k = b === "turbo" ? 0.12 : b === "fast" ? 0.28 : 0.45, U()));
        })
      ), g.events.on("game:start", () => {
        c === "ready" && (c = "running", A(), m());
      }), g.events.on("game:restart", () => {
        a = p === "local" ? D() : a, p === "local" && (localStorage.removeItem(V), a = D(), rt()), r = p === "server" ? a.credits : F, p === "server" ? lt() : r = F, v = !1, C.length = 0, L = -1, M = -1, c = "running", A(), m();
      }), m(), lt();
    },
    onDestroy() {
      for (const g of s) g();
      s.length = 0, o?.destroy(), o = null, t?.remove(), t = null, n = null;
    }
  });
}
function ce() {
  try {
    const e = new URL(location.href);
    if (e.searchParams.get("debug") === "1") return !0;
    const n = e.hash, s = n.indexOf("?");
    if (s >= 0 && new URLSearchParams(n.slice(s + 1)).get("debug") === "1") return !0;
  } catch {
    return !1;
  }
  return !1;
}
function de() {
  const e = document.querySelector(".plinko"), n = e?.querySelector(".plinko-top");
  if (!e || !n) return;
  const s = document.querySelector(".play-stage > .mobile-back");
  if (!(s instanceof HTMLElement)) {
    e.style.setProperty("--back-left", "0px"), e.style.setProperty("--back-right", "0px");
    return;
  }
  const t = s.getBoundingClientRect(), o = n.getBoundingClientRect();
  if (!(t.width > 2 && t.bottom > o.top + 1 && t.top < o.bottom - 1)) {
    e.style.setProperty("--back-left", "0px"), e.style.setProperty("--back-right", "0px");
    return;
  }
  if (t.left + t.width / 2 < o.left + o.width / 2) {
    e.style.setProperty("--back-left", `${Math.max(0, Math.ceil(t.right + 8 - o.left))}px`), e.style.setProperty("--back-right", "0px");
    return;
  }
  e.style.setProperty("--back-left", "0px"), e.style.setProperty("--back-right", `${Math.max(0, Math.ceil(o.right - t.left + 8))}px`);
}
function ue(e) {
  return e >= 10 ? "#fafafa" : e >= 3 ? "#d4d4d4" : e >= 1 ? "#737373" : "#2a2a2a";
}
function fe(e) {
  const n = H.map(
    (o) => `<button type="button" data-bet="${o}">${o}</button>`
  ).join(""), s = ["normal", "fast", "turbo"].map(
    (o) => `<button type="button" data-speed="${o}">${o === "normal" ? "普通" : o === "fast" ? "快速" : "极速"}</button>`
  ).join(""), t = ["low", "mid", "high"].map(
    (o) => `<button type="button" data-risk-pick="${o}">${o === "low" ? "低" : o === "mid" ? "中" : "高"}</button>`
  ).join("");
  return `
    <div class="plinko-shell">
      <header class="plinko-top">
        <button type="button" class="plinko-icon plinko-menu" data-lobby-menu aria-label="菜单"></button>
        <button type="button" class="plinko-icon" data-fair aria-label="公平性" aria-expanded="false">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2z"/></svg>
        </button>
        <div class="plinko-brand">
          <strong class="plinko-title">${e}</strong>
          <span class="plinko-demo" data-demo hidden>试玩</span>
        </div>
        <div class="plinko-tools">
          <button type="button" class="plinko-icon plinko-sound" data-sound aria-label="声音" aria-pressed="false">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4z"/><path fill="none" stroke="currentColor" stroke-width="1.6" d="M16 9.5a3.5 3.5 0 0 1 0 5"/></svg>
          </button>
          <div class="plinko-balance" data-balance><span class="plinko-coin" aria-hidden="true"></span><strong data-credits>1000</strong></div>
        </div>
        <span class="plinko-source" data-source></span>
        <div class="plinko-fair" data-fair-panel hidden>
          <p>落点在投放时已经确定，动画只沿预定路径落下。服务器开奖由服务器决定槽位；连不上服务器时在本机按同一张倍率表开奖。娱乐积分不能兑换，也不能充值。</p>
        </div>
      </header>
      <section class="plinko-stage">
        <div class="plinko-boardbar">
          <div class="plinko-history" data-history></div>
          <div class="plinko-speed">${s}</div>
        </div>
        <div class="plinko-board" data-board></div>
      </section>
      <div class="plinko-controls">
        <div class="plinko-modes" role="tablist" aria-label="投注方式">
          <button type="button" role="tab" data-mode="manual" aria-selected="true">手动</button>
          <button type="button" role="tab" data-mode="auto" aria-selected="false">自动</button>
        </div>
        <div class="plinko-amount">
          <div class="plinko-betrow" data-bet-ui>
            <button type="button" class="plinko-chip" data-bet-dec aria-label="注额减半">½</button>
            <button type="button" class="plinko-value" data-amount-bar aria-label="选择注额"><strong data-amount>20</strong></button>
            <button type="button" class="plinko-chip" data-bet-inc aria-label="注额加倍">2×</button>
            <div class="plinko-betlist" data-bet-sheet>${n}</div>
          </div>
        </div>
        <div class="plinko-risk">
          <span>风险</span>
          <div class="plinko-seg" role="group" aria-label="风险">${t}</div>
        </div>
        <label class="plinko-rows">
          <span>行数</span>
          <input type="range" min="8" max="16" step="1" value="16" data-row-slider aria-label="行数">
          <strong data-row-label>16</strong>
        </label>
        <div class="plinko-dock">
          <button type="button" class="plinko-drop" data-drop disabled>投注</button>
        </div>
        <label class="plinko-debug" data-debug hidden>
          <span>指定</span>
          <select data-debug-result aria-label="指定结果"></select>
        </label>
      </div>
    </div>
  `;
}
function he() {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function ft() {
  const e = new At(), n = pe(), s = ge();
  if (n) e.set({ accessToken: n });
  else if (s?.accessToken && !s.accessToken.startsWith("local."))
    e.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const t = localStorage.getItem(St);
    t?.startsWith("v1w.") && e.set({ accessToken: t });
  }
  return new _t({ baseUrl: xt(), tokens: e, timeoutMs: 2500 });
}
function pe() {
  try {
    const e = sessionStorage.getItem("wgf:launch-token");
    return e && e.length >= 8 ? e : null;
  } catch {
    return null;
  }
}
function ge() {
  try {
    const e = localStorage.getItem(ie);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
function xt() {
  return re?.VITE_API_BASE || "http://127.0.0.1:8787";
}
async function be() {
  try {
    return (await fetch(`${xt()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
const me = {
  normal: 3 / 16,
  fast: 3 / 16 * (0.16 / 0.34),
  turbo: 3 / 16 * (0.07 / 0.34)
};
class ke {
  constructor(n) {
    I(this, "canvas");
    I(this, "ctx");
    I(this, "rows", 16);
    I(this, "risk", "high");
    I(this, "speed", "normal");
    I(this, "width", 1);
    I(this, "height", 1);
    I(this, "balls", []);
    I(this, "pulses", /* @__PURE__ */ new Map());
    I(this, "pegPulses", /* @__PURE__ */ new Map());
    I(this, "nextId", 1);
    I(this, "onLand", null);
    const s = document.createElement("canvas");
    s.className = "plinko-canvas";
    const t = s.getContext("2d");
    if (!t) throw new Error("canvas");
    this.canvas = s, this.ctx = t, n.appendChild(s);
  }
  setLayout(n, s) {
    this.rows = n, this.risk = s;
  }
  setSpeed(n) {
    this.speed = n;
  }
  resize(n, s) {
    this.width = Math.max(1, n), this.height = Math.max(1, s);
    const t = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(this.width * t), this.canvas.height = Math.round(this.height * t), this.canvas.style.width = `${this.width}px`, this.canvas.style.height = `${this.height}px`, this.ctx.setTransform(t, 0, 0, t, 0, 0), this.draw();
  }
  launch(n) {
    this.balls.push({ ...n, id: this.nextId, step: 0, u: 0, landed: !1, age: 0 }), this.nextId += 1;
  }
  get inflight() {
    return this.balls.filter((n) => !n.landed).length;
  }
  update(n) {
    const s = me[this.speed];
    for (const t of this.balls) {
      if (t.landed) {
        t.age += n;
        continue;
      }
      const o = t.motion?.[t.step]?.pace ?? 1;
      for (t.u += n / (s * o); t.u >= 1 && t.step < t.rows; )
        t.u -= 1, t.step += 1;
      t.step >= t.rows && (t.landed = !0, t.u = 1, t.age = 0, this.pulses.set(t.bucket, 0.45), this.onLand?.(t));
    }
    this.balls = this.balls.filter((t) => !t.landed || t.age < 0.45);
    for (const [t, o] of this.pulses) {
      const a = o - n;
      a <= 0 ? this.pulses.delete(t) : this.pulses.set(t, a);
    }
    for (const [t, o] of this.pegPulses) {
      const a = o - n;
      a <= 0 ? this.pegPulses.delete(t) : this.pegPulses.set(t, a);
    }
    this.draw();
  }
  destroy() {
    this.canvas.remove();
  }
  metrics() {
    const t = Math.max(1, this.width - 16), o = Math.max(1, this.height - 16), a = 1.15, r = 0.36, i = t / (this.rows + 1), l = o / (this.rows * 0.92 + r + a), u = Math.max(1, Math.min(i, l)), b = u * 0.92, v = u * r;
    let p = u * a, S = this.rows * b + v + p;
    S > o && (p = Math.max(14, p - (S - o)), S = this.rows * b + v + p);
    const L = 8 + Math.max(0, o - S) / 2, M = L + this.rows * b + v;
    return { pad: 8 + Math.max(0, (t - (this.rows + 1) * u) / 2), spacing: u, top: L, rowGap: b, bucketTop: M, bucketH: p };
  }
  pegX(n, s, t, o) {
    const a = 3 + n, r = (this.rows + 2 - a) / 2 * o;
    return t + r + s * o;
  }
  draw() {
    const n = this.ctx, { pad: s, spacing: t, top: o, rowGap: a, bucketTop: r, bucketH: i } = this.metrics();
    n.clearRect(0, 0, this.width, this.height), n.fillStyle = "#111111", n.fillRect(0, 0, this.width, this.height);
    const l = at(this.rows, this.risk), u = t * Z, b = t * tt;
    for (let c = 0; c < this.rows; c += 1) {
      const L = 3 + c, M = o + a * (c + 1);
      for (let k = 0; k < L; k += 1) {
        const C = this.pegX(c, k, s, t), P = this.pegPulses.get(`${c}:${k}`) ?? 0;
        n.beginPath(), n.fillStyle = P > 0 ? "#ffffff" : "#e8e8e8", n.shadowColor = P > 0 ? "rgba(255, 255, 255, 0.55)" : "transparent", n.shadowBlur = P > 0 ? u * 1.1 : 0, n.arc(C, M, u, 0, Math.PI * 2), n.fill(), n.shadowBlur = 0;
      }
    }
    const v = Math.max(2, t * 0.07), p = Math.max(8, t - v), S = i;
    for (let c = 0; c < l.length; c += 1) {
      const L = this.pegX(this.rows - 1, c, s, t), M = this.pegX(this.rows - 1, c + 1, s, t), k = this.pulses.get(c) ?? 0, C = k > 0 ? k / 0.45 * Math.min(6, S * 0.22) : 0, P = (L + M) / 2 - p / 2, E = r + C, G = jt(c, l.length);
      n.save(), ht(n, P, E + 1, p, S, Math.min(5, S / 3)), n.fillStyle = "rgba(0,0,0,0.45)", n.fill(), ht(n, P, E, p, S, Math.min(5, S / 3)), n.fillStyle = G, n.fill(), k > 0 && (n.fillStyle = `rgba(255,255,255,${k / 0.45 * 0.35})`, n.fill());
      const O = Q(l[c] ?? 0);
      let q = Math.min(this.rows <= 10 ? 18 : 14, Math.max(10, S * 0.42));
      n.textAlign = "center", n.textBaseline = "middle", n.fillStyle = Jt(c, l.length), n.font = `800 ${q}px Outfit, sans-serif`;
      const T = Math.max(4, p - 2);
      for (; q > 9 && n.measureText(O).width > T; )
        q -= 0.5, n.font = `800 ${q}px Outfit, sans-serif`;
      const m = n.measureText(O).width, A = m > T ? T / m : 1;
      n.translate(P + p / 2, E + S / 2), n.scale(A, 1), n.fillText(O, 0, 0), n.restore();
    }
    for (const c of this.balls) {
      const L = Math.min(c.step, Math.max(0, c.rows - 1)), M = c.landed || c.step >= c.rows ? 1 : c.u, k = ne(
        c.rows,
        c.path,
        L,
        M,
        Z,
        tt,
        c.motion?.[L]
      );
      k.hit && this.pegPulses.set(`${k.hit.row}:${k.hit.index}`, 0.12), ye(
        n,
        s + k.x * t,
        o + k.y * a,
        b,
        k.squash || 1,
        k.x
      );
    }
  }
}
function ye(e, n, s, t, o, a) {
  e.save(), e.translate(n, s + t * 0.72), e.scale(1, 0.32);
  const r = e.createRadialGradient(0, 0, t * 0.2, 0, 0, t);
  r.addColorStop(0, "rgba(0,0,0,0.38)"), r.addColorStop(1, "rgba(0,0,0,0)"), e.fillStyle = r, e.beginPath(), e.arc(0, 0, t, 0, Math.PI * 2), e.fill(), e.restore(), e.save(), e.translate(n, s), e.scale(1 / Math.sqrt(o), o);
  const i = e.createRadialGradient(
    -t * 0.38,
    -t * 0.42,
    t * 0.08,
    t * 0.12,
    t * 0.16,
    t * 1.05
  );
  i.addColorStop(0, "#ffffff"), i.addColorStop(0.1, "#ffffff"), i.addColorStop(0.24, "#f4f7f9"), i.addColorStop(0.5, "#b4bec6"), i.addColorStop(0.8, "#74818a"), i.addColorStop(1, "#323b42"), e.beginPath(), e.arc(0, 0, t, 0, Math.PI * 2), e.fillStyle = i, e.fill(), e.beginPath(), e.ellipse(-t * 0.34, -t * 0.38, t * 0.28, t * 0.16, -0.7, 0, Math.PI * 2), e.fillStyle = "rgba(255,255,255,0.92)", e.fill(), e.lineWidth = Math.max(1, t * 0.06), e.strokeStyle = "rgba(18, 22, 26, 0.7)", e.stroke(), e.save(), e.rotate(a * 1.6), e.beginPath(), e.ellipse(0, 0, t * 0.42, t * 0.86, 0.4, 0, Math.PI * 2), e.strokeStyle = "rgba(255,255,255,0.16)", e.lineWidth = Math.max(1, t * 0.05), e.stroke(), e.restore(), e.restore();
}
function ht(e, n, s, t, o, a) {
  const r = Math.max(0, Math.min(a, t / 2, o / 2));
  e.beginPath(), e.moveTo(n + r, s), e.arcTo(n + t, s, n + t, s + o, r), e.arcTo(n + t, s + o, n, s + o, r), e.arcTo(n, s + o, n, s, r), e.arcTo(n, s, n + t, s, r), e.closePath();
}
function xe() {
  return le({
    manifest: Ht,
    title: "弹珠",
    gameAttr: "wgf-game:plinko",
    createBoard: (e) => new ke(e)
  });
}
export {
  xe as createGame,
  Ht as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
