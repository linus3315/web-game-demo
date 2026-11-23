var Mt = Object.defineProperty;
var Tt = (e, n, s) => n in e ? Mt(e, n, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[n] = s;
var E = (e, n, s) => Tt(e, typeof n != "symbol" ? n + "" : n, s);
import { registerStrings as Lt, defineGame as Pt, writeSettings as Rt, bindVisualViewport as Ct, patchGame as Et, t as It } from "@wgf/core";
import { TokenStore as $t, HttpClient as qt } from "@wgf/net";
const At = {
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
}, _t = {
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
  art: At,
  renderer: "dom",
  controls: "pointer",
  tags: ["弹珠", "联网"],
  theme: { accent: "#7ddec8", accentInk: "#10211e", glow: "#e23b3b", radius: 16, font: "sans" }
}, K = 8, U = 16, H = [10, 20, 50, 100], Bt = ["low", "mid", "high"], ft = [
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
function ht(e, n) {
  let s = 1;
  for (let t = 1; t <= n; t += 1) s = s * (e - n + t) / t;
  return s;
}
function J(e) {
  const n = e.length - 1, s = 2 ** n;
  let t = 0;
  for (let o = 0; o < e.length; o += 1)
    t += ht(n, o) / s * (e[o] ?? 0);
  return t;
}
function Nt(e, n, s, t) {
  const o = e / 2;
  return Array.from({ length: e + 1 }, (a, i) => {
    const l = o === 0 ? 0 : Math.abs(i - o) / o;
    return s * (n / s) ** l ** t;
  });
}
function Ht(e) {
  return e >= 100 ? Math.max(1, Math.round(e)) : Math.max(0.1, Math.round(e * 10) / 10);
}
function Ot(e) {
  const n = e.length - 1, s = e.slice();
  for (let t = 0; t <= n; t += 1) {
    const o = Ht(((s[t] ?? 0) + (s[n - t] ?? 0)) / 2);
    s[t] = o, s[n - t] = o;
  }
  return s;
}
function Wt(e) {
  const n = e / 2, s = [];
  for (let t = 0; t <= e; t += 1) Math.abs(t - n) <= 0.5 && s.push(t);
  return s;
}
function Gt(e, n, s, t) {
  const o = Nt(e, n, s, t), a = Ot(o.map((u) => u * (0.99 / J(o)))), i = Wt(e);
  let l = a, r = Math.abs(J(l) - 0.99);
  for (let u = -20; u <= 20; u += 1) {
    const p = a.slice(), S = a[i[0] ?? 0] ?? 0, b = Math.max(0.1, Math.round((S + u * 0.1) * 10) / 10);
    for (const c of i) p[c] = b;
    const x = Math.abs(J(p) - 0.99);
    x < r && (r = x, l = p);
  }
  return l;
}
function Dt() {
  const e = {
    low: [18, 1.05, 2.2],
    mid: [160, 0.45, 1.65],
    high: [700, 0.2, 1.25]
  }, n = { low: {}, mid: {}, high: {} };
  for (const s of Bt) {
    const t = e[s];
    for (let o = K; o <= U; o += 1)
      n[s][o] = Gt(o, t[0], t[1], t[2]);
  }
  return n.high[16] = ft, n;
}
const ct = Dt();
function at(e, n) {
  return ct[n][e] ?? ct.mid[16] ?? ft;
}
function zt(e) {
  return Number.isInteger(e) && e >= K && e <= U;
}
function Ft(e) {
  return e === "low" || e === "mid" || e === "high";
}
function Xt(e) {
  return H.includes(e);
}
function Q(e) {
  return e >= 1e3 ? "1kx" : e >= 100 ? `${Math.round(e)}x` : `${e.toFixed(1)}x`;
}
function pt(e, n) {
  const s = (n - 1) / 2;
  return s === 0 ? 0 : Math.abs(e - s) / s;
}
function Yt(e, n) {
  const s = pt(e, n), t = s < 0.4 ? 132 - s / 0.4 * 84 : 48 - (s - 0.4) / 0.6 * 44, o = 70 + s * 18, a = 42 + (1 - s) * 10;
  return `hsl(${t.toFixed(1)} ${o.toFixed(1)}% ${a.toFixed(1)}%)`;
}
function Kt(e, n) {
  return pt(e, n) > 0.62 ? "#fff" : "#1a120c";
}
const F = 1e3;
function D() {
  return { credits: F };
}
function Ut(e, n) {
  const s = 2 ** e, t = n() * s;
  let o = 0;
  for (let a = 0; a <= e; a += 1)
    if (o += ht(e, a), t < o) return a;
  return e;
}
function jt(e, n, s, t, o, a) {
  if (!Xt(n)) return { error: "bad_bet" };
  if (!zt(s)) return { error: "bad_rows" };
  if (!Ft(t)) return { error: "bad_risk" };
  if (e.credits < n) return { error: "insufficient" };
  const i = at(s, t), l = typeof a == "number" && Number.isInteger(a) && a >= 0 && a <= s ? a : Ut(s, o), r = i[l] ?? 0, u = Math.round(n * r);
  return e.credits -= n, e.credits += u, { rows: s, risk: t, bet: n, bucket: l, multiplier: r, win: u, credits: e.credits };
}
const Jt = 0.63;
function Vt(e, n, s) {
  let t = Math.max(0, Math.min(e, Math.floor(n))), o = e - t;
  const a = [];
  let i = null;
  for (let l = 0; l < e; l += 1) {
    let r;
    if (t <= 0) r = "L";
    else if (o <= 0) r = "R";
    else if (i === null) r = s() < t / (t + o) ? "R" : "L";
    else {
      const u = i === "R" ? "L" : "R";
      r = (s() < Jt ? i : u) === "R" ? t > 0 ? "R" : "L" : o > 0 ? "L" : "R";
    }
    a.push(r), r === "R" ? t -= 1 : o -= 1, i = r;
  }
  return a;
}
const Z = 0.13, tt = 0.325, et = 0.92;
function Qt(e, n) {
  const s = [];
  let t = 1, o = 0;
  for (const a of e) {
    const i = a === "R" ? 1 : -1, l = 0.92 + n() * 0.16, r = 0.97 + n() * 0.06;
    t = t * 0.35 + r * 0.65, o = Math.max(-0.4, Math.min(0.4, o * 0.4 + i * (0.12 + n() * 0.1))), s.push({ hop: l, pace: t, flourish: "none", vx: o });
  }
  return s;
}
function gt(e, n, s) {
  return { x: (e - 1 - n) / 2 + s, y: n + 1 };
}
function bt(e, n) {
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
function mt(e, n) {
  let s = 0;
  for (let t = 0; t < n; t += 1) e[t] === "R" && (s += 1);
  return s;
}
function kt(e, n, s) {
  const t = s[n] === "R" ? "R" : "L", o = mt(s, n) + 1;
  return { peg: gt(e, n, o), index: o, dir: t };
}
const ot = 1.02;
function Zt(e, n, s, t, o = Z, a = tt, i) {
  const l = Math.max(0, Math.min(e - 1, s)), r = Math.max(0, Math.min(1, t)), u = bt(o, a), p = kt(e, l, n), S = nt(p.dir), b = (i?.hop ?? 1) * (1 - l * 4e-3), x = i?.vx ?? 0, c = st(p.peg, ot, S, u), L = yt(c, S), T = st(p.peg, ot - 0.06, S, u + 0.12 * b);
  T.x += x * 0.02;
  const m = ee(e, n, l, o, a), I = { row: l, index: p.index }, M = 0.22, C = (v) => te(v, e, u);
  if (r <= M) {
    const v = r / M, g = v * v;
    return {
      ...C({
        x: L.x + (c.x - L.x) * g,
        y: L.y + (c.y - L.y) * g
      }),
      hit: v > 0.92 ? I : null,
      squash: v > 0.92 ? 0.96 : 1,
      pop: 0
    };
  }
  if (r <= M + 0.1) {
    const v = (r - M) / 0.1, g = Math.sin(v * Math.PI / 2);
    return {
      ...C({
        x: c.x + (T.x - c.x) * g,
        y: c.y + (T.y - c.y) * g
      }),
      hit: v < 0.18 ? I : null,
      squash: v < 0.18 ? 0.96 : 1,
      pop: g * 0.45
    };
  }
  const O = (r - (M + 0.1)) / (1 - (M + 0.1)), B = O * O;
  return {
    ...C({
      x: T.x + (m.x - T.x) * B,
      y: T.y + (m.y - T.y) * B
    }),
    hit: null,
    squash: 1,
    pop: 0.4 * (1 - O)
  };
}
function te(e, n, s) {
  let t = e;
  for (let o = 0; o < 4; o += 1)
    for (let a = 0; a < n; a += 1)
      for (let i = 0; i < 3 + a; i += 1) {
        const l = gt(n, a, i), r = t.x - l.x, u = (t.y - l.y) * et, p = Math.hypot(r, u);
        if (p >= s || p === 0) continue;
        const S = s / p;
        t = { x: l.x + r * S, y: l.y + u * S / et };
      }
  return t;
}
function ee(e, n, s, t, o) {
  const i = mt(n, s) + (n[s] === "R" ? 1 : 0);
  if (s + 1 >= e) return { x: i + 0.5, y: e + 1.35 };
  const l = kt(e, s + 1, n), r = st(l.peg, ot, nt(l.dir), bt(t, o));
  return yt(r, nt(l.dir));
}
function yt(e, n) {
  return { x: e.x + n * 0.06, y: e.y - 0.18 };
}
function ne() {
  Lt("plinko", {
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
const se = {}, V = "wgf:slots-wallet", wt = "wgf:slots-token", oe = "wgf:session";
function ae(e) {
  ne();
  let n = null;
  const s = [];
  let t = null, o = null, a = D(), i = F, l = 20, r = 16, u = "high", p = "normal", S = !1, b = "pending", x = !1, c = "ready", L = -1, T = -1, m = 0;
  const I = [], M = /* @__PURE__ */ new Set();
  let C = null, O = !1, B = 0, $ = () => {
  };
  function v(h, f) {
    return It(n?.store.getState().ui.locale ?? "zh", h, f);
  }
  function g() {
    if (!t) return;
    const h = t.querySelector("[data-credits]"), f = t.querySelector("[data-amount]"), y = t.querySelector("[data-row-label]"), P = t.querySelector("[data-row-slider]"), N = t.querySelector("[data-demo]"), w = t.querySelector("[data-source]");
    h && (h.textContent = String(i)), f && (f.textContent = String(l)), y && (y.textContent = String(r)), P && (P.value = String(r)), N && (N.hidden = b !== "local"), w && (w.textContent = v(b === "server" ? "plinko.server" : b === "local" ? "plinko.local" : "plinko.pending")), t.dataset.rows = String(r), t.dataset.risk = u, t.dataset.pace = p, t.dataset.pegs = String(r + 2), t.dataset.buckets = String(r + 1), L >= 0 && (t.dataset.bucket = String(L)), T >= 0 && (t.dataset.landed = String(T)), t.dataset.round = o && o.inflight > 0 ? "busy" : "open";
    const d = H.indexOf(l), q = t.querySelector("[data-bet-dec]"), _ = t.querySelector("[data-bet-inc]");
    q && (q.disabled = d <= 0), _ && (_.disabled = d >= H.length - 1), t.querySelectorAll("[data-bet]").forEach((R) => {
      R.classList.toggle("is-bet", Number(R.dataset.bet) === l);
    }), t.querySelectorAll("[data-speed]").forEach((R) => {
      R.classList.toggle("is-on", R.dataset.speed === p);
    }), t.querySelectorAll("[data-risk-pick]").forEach((R) => {
      R.classList.toggle("is-on", R.dataset.riskPick === u);
    });
    const W = t.querySelector("[data-drop]");
    W && (W.disabled = !x || c !== "running" || i < l);
    const z = t.querySelector("[data-auto]");
    z && z.setAttribute("aria-pressed", S ? "true" : "false");
    const k = t.querySelector("[data-sound]");
    if (k && n) {
      const R = n.store.getState().ui;
      k.setAttribute("aria-pressed", R.musicMuted && R.sfxMuted ? "true" : "false");
    }
    const G = t.querySelector("[data-history]");
    G && G.replaceChildren(
      ...I.slice(0, 8).map((R) => {
        const Y = document.createElement("span");
        return Y.textContent = Q(R), Y;
      })
    ), o?.setLayout(r, u), o?.setSpeed(p), t.dataset.seq = String(B), xt(t);
  }
  function A() {
    n && Et(n.store, {
      id: e.manifest.id,
      status: c,
      score: Math.max(0, i - F),
      highScore: Math.max(0, i),
      message: "",
      detail: v(b === "server" ? "plinko.server" : "plinko.local"),
      credits: i
    });
  }
  function X() {
    b === "local" && localStorage.setItem(V, JSON.stringify(a));
  }
  function rt() {
    try {
      const h = localStorage.getItem(V);
      if (!h) return D();
      const f = JSON.parse(h);
      return !f || typeof f.credits != "number" ? D() : { credits: Math.max(0, Math.floor(f.credits)) };
    } catch {
      return D();
    }
  }
  async function it() {
    if (!await ue()) {
      b = "local", a = rt(), i = a.credits, x = !0, A(), g();
      return;
    }
    try {
      const f = await dt().post("/api/plinko/session", {});
      f.walletToken && localStorage.setItem(wt, f.walletToken), O = f.demo === !0, b = "server", a = { credits: f.credits }, i = f.credits;
    } catch {
      b = "local", a = rt(), i = a.credits;
    }
    x = !0, A(), g();
  }
  async function j() {
    if (!x || c !== "running" || i < l) return;
    const h = le();
    if (M.has(h)) return;
    const f = { bet: l, rows: r, risk: u }, y = lt() ? C : null;
    let P;
    if (b === "server")
      try {
        const d = await dt().post("/api/plinko/drop", {
          bet: f.bet,
          spinId: h,
          rows: f.rows,
          risk: f.risk,
          ...y !== null ? { bucket: y } : {}
        });
        P = d, a = { credits: d.credits };
      } catch {
        return;
      }
    else {
      const d = jt(
        a,
        f.bet,
        f.rows,
        f.risk,
        Math.random,
        y
      );
      if ("error" in d) return;
      P = d, X();
    }
    M.add(h), i -= f.bet, L = P.bucket;
    const N = Vt(f.rows, P.bucket, Math.random), w = {
      path: N,
      rows: f.rows,
      bet: f.bet,
      bucket: P.bucket,
      multiplier: P.multiplier,
      win: P.win,
      motion: Qt(N, Math.random)
    };
    o?.launch(w), A(), g();
  }
  function St(h) {
    i += h.win, T = h.bucket, B += 1, I.unshift(h.multiplier), I.length > 8 && (I.length = 8), i < H[0] && (!o || o.inflight === 0) && (S = !1, c = "over"), A(), g();
  }
  function lt() {
    return re() && (b === "local" || O);
  }
  function xt(h) {
    const f = h.querySelector("[data-debug]");
    f && (f.hidden = !lt());
    const y = h.querySelector("[data-debug-result]");
    if (!y) return;
    const P = `${r}:${u}`;
    if (y.dataset.key === P) return;
    const N = at(r, u), w = C, d = document.createElement("option");
    d.value = "random", d.textContent = "随机";
    const q = [d];
    for (let _ = 0; _ <= r; _ += 1) {
      const W = document.createElement("option");
      W.value = String(_), W.textContent = `${_} ${Q(N[_] ?? 0)}`, q.push(W);
    }
    y.replaceChildren(...q), y.dataset.key = P, w !== null && w <= r ? (C = w, y.value = String(w)) : (C = null, y.value = "random");
  }
  return Pt(e.manifest, {
    async onPreload(h, f) {
      await h.preload([], f);
    },
    async onMount(h) {
      n = h, h.container.setAttribute("data-wgf-game", e.gameAttr), t = document.createElement("div"), t.className = e.extraClass ? `plinko ${e.extraClass}` : "plinko", t.innerHTML = ie(e.title);
      const f = t.querySelector("[data-board]");
      f instanceof HTMLElement && (o = e.createBoard(f), o.onLand = St, o.setLayout(r, u)), h.container.appendChild(t);
      const y = t;
      y.addEventListener("input", (w) => {
        const d = w.target;
        if (!(d instanceof HTMLInputElement) || !d.matches("[data-row-slider]")) return;
        if (o && o.inflight > 0) {
          d.value = String(r);
          return;
        }
        const q = Number(d.value);
        q >= K && q <= U && (r = q), g(), $();
      }), y.addEventListener("change", (w) => {
        const d = w.target;
        !(d instanceof HTMLSelectElement) || !d.matches("[data-debug-result]") || (C = d.value === "random" ? null : Number(d.value));
      }), y.addEventListener("click", (w) => {
        const d = w.target;
        if (!(d instanceof Element)) return;
        if (d.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        if (d.closest("[data-sound]") && n) {
          const k = n.store.getState().ui, G = !(k.musicMuted && k.sfxMuted), R = {
            locale: k.locale,
            music: k.music,
            sfx: k.sfx,
            musicMuted: G,
            sfxMuted: G
          };
          Rt(R), n.store.setState((Y) => ({
            ui: { ...Y.ui, ...R, muted: G }
          })), g();
          return;
        }
        const q = d.closest("[data-bet]"), _ = q instanceof HTMLElement ? Number(q.dataset.bet) : Number.NaN;
        if (H.includes(_)) {
          l = _, y.classList.remove("is-bets"), g();
          return;
        }
        if (d.closest("[data-bet-dec]")) {
          const k = H[H.indexOf(l) - 1];
          k !== void 0 && (l = k), y.classList.remove("is-bets"), g();
          return;
        }
        if (d.closest("[data-bet-inc]")) {
          const k = H[H.indexOf(l) + 1];
          k !== void 0 && (l = k), y.classList.remove("is-bets"), g();
          return;
        }
        if (d.closest("[data-amount-bar]")) {
          y.classList.toggle("is-bets");
          return;
        }
        if (y.classList.contains("is-bets") && !d.closest("[data-bet-ui]") && y.classList.remove("is-bets"), d.closest("[data-row-dec]") && (!o || o.inflight === 0)) {
          r > K && (r -= 1), g(), $();
          return;
        }
        if (d.closest("[data-row-inc]") && (!o || o.inflight === 0)) {
          r < U && (r += 1), g(), $();
          return;
        }
        const W = d.closest("[data-risk-pick]");
        if (W instanceof HTMLElement && (!o || o.inflight === 0)) {
          const k = W.dataset.riskPick;
          (k === "low" || k === "mid" || k === "high") && (u = k), g();
          return;
        }
        const z = d.closest("[data-speed]");
        if (z instanceof HTMLElement) {
          const k = z.dataset.speed;
          (k === "normal" || k === "fast" || k === "turbo") && (p = k), g();
          return;
        }
        if (d.closest("[data-auto]")) {
          S = !S, m = 0, g(), S && j();
          return;
        }
        d.closest("[data-drop]") && j();
      }), $ = () => {
        const w = t?.querySelector("[data-board]");
        !(w instanceof HTMLElement) || !o || o.resize(w.clientWidth, w.clientHeight);
      }, $();
      const P = new ResizeObserver(() => $()), N = t.querySelector("[data-board]");
      N && P.observe(N), s.push(() => P.disconnect()), s.push(Ct(() => $())), s.push(
        h.loop.onUpdate((w) => {
          o?.update(w), S && c === "running" && (!o || o.inflight < 6) && (m -= w, m <= 0 && i >= l && (m = p === "turbo" ? 0.12 : p === "fast" ? 0.28 : 0.45, j()));
        })
      ), h.events.on("game:start", () => {
        c === "ready" && (c = "running", A(), g());
      }), h.events.on("game:restart", () => {
        a = b === "local" ? D() : a, b === "local" && (localStorage.removeItem(V), a = D(), X()), i = b === "server" ? a.credits : F, b === "server" ? it() : i = F, S = !1, I.length = 0, L = -1, T = -1, c = "running", A(), g();
      }), g(), it();
    },
    onDestroy() {
      for (const h of s) h();
      s.length = 0, o?.destroy(), o = null, t?.remove(), t = null, n = null;
    }
  });
}
function re() {
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
function ie(e) {
  const n = H.map(
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
        <strong>${e}</strong>
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
            <div class="plinko-betlist" data-bet-sheet>${n}</div>
          </div>
        </label>
        <div class="plinko-field">
          <span>风险</span>
          <div class="plinko-seg">${t}</div>
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
function le() {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function dt() {
  const e = new $t(), n = ce(), s = de();
  if (n) e.set({ accessToken: n });
  else if (s?.accessToken && !s.accessToken.startsWith("local."))
    e.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const t = localStorage.getItem(wt);
    t?.startsWith("v1w.") && e.set({ accessToken: t });
  }
  return new qt({ baseUrl: vt(), tokens: e, timeoutMs: 2500 });
}
function ce() {
  try {
    const e = sessionStorage.getItem("wgf:launch-token");
    return e && e.length >= 8 ? e : null;
  } catch {
    return null;
  }
}
function de() {
  try {
    const e = localStorage.getItem(oe);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
function vt() {
  return se?.VITE_API_BASE || "http://127.0.0.1:8787";
}
async function ue() {
  try {
    return (await fetch(`${vt()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
const fe = {
  normal: 3 / 16,
  fast: 3 / 16 * (0.16 / 0.34),
  turbo: 3 / 16 * (0.07 / 0.34)
};
class he {
  constructor(n) {
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
    const s = fe[this.speed];
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
    const t = Math.max(1, this.width - 4), o = Math.max(1, this.height - 4), a = 1.48, i = t / (this.rows + 1), l = Math.max(1, o - 4) / (this.rows * 0.92 + a), r = Math.min(i, l), u = r * 0.92;
    let p = r * a;
    p < 22 && this.rows * u + 22 + 4 <= o && (p = 22), this.rows * u + p + 4 > o && (p = Math.max(16, o - 4 - this.rows * u));
    const S = this.rows * u + 4 + p, b = 2 + Math.max(0, o - S), x = b + this.rows * u + 4;
    return { pad: (this.width - (this.rows + 1) * r) / 2, spacing: r, top: b, rowGap: u, bucketTop: x, bucketH: p };
  }
  pegX(n, s, t, o) {
    const a = 3 + n, i = (this.rows + 2 - a) / 2 * o;
    return t + i + s * o;
  }
  draw() {
    const n = this.ctx, { pad: s, spacing: t, top: o, rowGap: a, bucketTop: i, bucketH: l } = this.metrics();
    n.clearRect(0, 0, this.width, this.height), n.fillStyle = "#2c2d30", n.fillRect(0, 0, this.width, this.height);
    const r = at(this.rows, this.risk), u = t * Z, p = t * tt;
    for (let c = 0; c < this.rows; c += 1) {
      const L = 3 + c, T = o + a * (c + 1);
      for (let m = 0; m < L; m += 1) {
        const I = this.pegX(c, m, s, t), M = this.pegPulses.get(`${c}:${m}`) ?? 0;
        n.beginPath(), n.fillStyle = M > 0 ? "#fffef8" : "#f4f7f8", n.shadowColor = M > 0 ? "rgba(255, 255, 255, 0.55)" : "transparent", n.shadowBlur = M > 0 ? u * 1.1 : 0, n.arc(I, T, u, 0, Math.PI * 2), n.fill(), n.shadowBlur = 0;
      }
    }
    const S = Math.max(2, t * 0.07), b = Math.max(8, t - S), x = l;
    for (let c = 0; c < r.length; c += 1) {
      const L = this.pegX(this.rows - 1, c, s, t), T = this.pegX(this.rows - 1, c + 1, s, t), m = this.pulses.get(c) ?? 0, I = m > 0 ? m / 0.45 * Math.min(6, x * 0.22) : 0, M = (L + T) / 2 - b / 2, C = i + I, O = Yt(c, r.length);
      n.save(), ut(n, M, C + 2, b, x, Math.min(6, x / 3)), n.fillStyle = "rgba(0,0,0,0.35)", n.fill(), ut(n, M, C, b, x, Math.min(6, x / 3));
      const B = n.createLinearGradient(M, C, M, C + x);
      B.addColorStop(0, O), B.addColorStop(0.72, O), B.addColorStop(1, "rgba(0,0,0,0.28)"), n.fillStyle = B, n.fill(), m > 0 && (n.fillStyle = `rgba(255,255,255,${m / 0.45 * 0.35})`, n.fill());
      const $ = Q(r[c] ?? 0);
      let v = Math.min(this.rows <= 10 ? 18 : 14, Math.max(10, x * 0.42));
      n.textAlign = "center", n.textBaseline = "middle", n.fillStyle = Kt(c, r.length), n.font = `800 ${v}px Outfit, sans-serif`;
      const g = Math.max(4, b - 2);
      for (; v > 9 && n.measureText($).width > g; )
        v -= 0.5, n.font = `800 ${v}px Outfit, sans-serif`;
      const A = n.measureText($).width, X = A > g ? g / A : 1;
      n.translate(M + b / 2, C + x / 2), n.scale(X, 1), n.fillText($, 0, 0), n.restore();
    }
    for (const c of this.balls) {
      const L = Math.min(c.step, Math.max(0, c.rows - 1)), T = c.landed || c.step >= c.rows ? 1 : c.u, m = Zt(
        c.rows,
        c.path,
        L,
        T,
        Z,
        tt,
        c.motion?.[L]
      );
      m.hit && this.pegPulses.set(`${m.hit.row}:${m.hit.index}`, 0.12), pe(
        n,
        s + m.x * t,
        o + m.y * a,
        p,
        m.squash || 1,
        m.x
      );
    }
  }
}
function pe(e, n, s, t, o, a) {
  e.save(), e.translate(n, s + t * 0.72), e.scale(1, 0.32);
  const i = e.createRadialGradient(0, 0, t * 0.2, 0, 0, t);
  i.addColorStop(0, "rgba(0,0,0,0.38)"), i.addColorStop(1, "rgba(0,0,0,0)"), e.fillStyle = i, e.beginPath(), e.arc(0, 0, t, 0, Math.PI * 2), e.fill(), e.restore(), e.save(), e.translate(n, s), e.scale(1 / Math.sqrt(o), o);
  const l = e.createRadialGradient(
    -t * 0.38,
    -t * 0.42,
    t * 0.08,
    t * 0.12,
    t * 0.16,
    t * 1.05
  );
  l.addColorStop(0, "#ffffff"), l.addColorStop(0.1, "#ffffff"), l.addColorStop(0.24, "#f4f7f9"), l.addColorStop(0.5, "#b4bec6"), l.addColorStop(0.8, "#74818a"), l.addColorStop(1, "#323b42"), e.beginPath(), e.arc(0, 0, t, 0, Math.PI * 2), e.fillStyle = l, e.fill(), e.beginPath(), e.ellipse(-t * 0.34, -t * 0.38, t * 0.28, t * 0.16, -0.7, 0, Math.PI * 2), e.fillStyle = "rgba(255,255,255,0.92)", e.fill(), e.lineWidth = Math.max(1, t * 0.06), e.strokeStyle = "rgba(18, 22, 26, 0.7)", e.stroke(), e.save(), e.rotate(a * 1.6), e.beginPath(), e.ellipse(0, 0, t * 0.42, t * 0.86, 0.4, 0, Math.PI * 2), e.strokeStyle = "rgba(255,255,255,0.16)", e.lineWidth = Math.max(1, t * 0.05), e.stroke(), e.restore(), e.restore();
}
function ut(e, n, s, t, o, a) {
  const i = Math.max(0, Math.min(a, t / 2, o / 2));
  e.beginPath(), e.moveTo(n + i, s), e.arcTo(n + t, s, n + t, s + o, i), e.arcTo(n + t, s + o, n, s + o, i), e.arcTo(n, s + o, n, s, i), e.arcTo(n, s, n + t, s, i), e.closePath();
}
function ke() {
  return ae({
    manifest: _t,
    title: "弹珠",
    gameAttr: "wgf-game:plinko",
    createBoard: (e) => new he(e)
  });
}
export {
  ke as createGame,
  _t as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
