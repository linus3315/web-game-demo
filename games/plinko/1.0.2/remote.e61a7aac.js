var yt = Object.defineProperty;
var xt = (n, e, s) => e in n ? yt(n, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[e] = s;
var R = (n, e, s) => xt(n, typeof e != "symbol" ? e + "" : e, s);
import { registerStrings as wt, defineGame as vt, bindVisualViewport as St, patchGame as Mt, t as Lt } from "@wgf/core";
import { TokenStore as Tt, HttpClient as Rt } from "@wgf/net";
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
  art: Et,
  renderer: "dom",
  controls: "pointer",
  tags: ["弹珠", "联网"],
  theme: { accent: "#7ddec8", accentInk: "#10211e", glow: "#e23b3b", radius: 16, font: "sans" }
}, tt = 8, et = 16, $ = [10, 20, 50, 100], $t = ["low", "mid", "high"], dt = [
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
function K(n) {
  const e = n.length - 1, s = 2 ** e;
  let t = 0;
  for (let o = 0; o < n.length; o += 1)
    t += ut(e, o) / s * (n[o] ?? 0);
  return t;
}
function _t(n, e, s, t) {
  const o = n / 2;
  return Array.from({ length: n + 1 }, (i, r) => {
    const l = o === 0 ? 0 : Math.abs(r - o) / o;
    return s * (e / s) ** l ** t;
  });
}
function At(n) {
  return n >= 100 ? Math.max(1, Math.round(n)) : Math.max(0.1, Math.round(n * 10) / 10);
}
function It(n) {
  const e = n.length - 1, s = n.slice();
  for (let t = 0; t <= e; t += 1) {
    const o = At(((s[t] ?? 0) + (s[e - t] ?? 0)) / 2);
    s[t] = o, s[e - t] = o;
  }
  return s;
}
function Nt(n) {
  const e = n / 2, s = [];
  for (let t = 0; t <= n; t += 1) Math.abs(t - e) <= 0.5 && s.push(t);
  return s;
}
function qt(n, e, s, t) {
  const o = _t(n, e, s, t), i = It(o.map((u) => u * (0.99 / K(o)))), r = Nt(n);
  let l = i, a = Math.abs(K(l) - 0.99);
  for (let u = -20; u <= 20; u += 1) {
    const b = i.slice(), c = i[r[0] ?? 0] ?? 0, f = Math.max(0.1, Math.round((c + u * 0.1) * 10) / 10);
    for (const g of r) b[g] = f;
    const k = Math.abs(K(b) - 0.99);
    k < a && (a = k, l = b);
  }
  return l;
}
function Bt() {
  const n = {
    low: [18, 1.05, 2.2],
    mid: [160, 0.45, 1.65],
    high: [700, 0.2, 1.25]
  }, e = { low: {}, mid: {}, high: {} };
  for (const s of $t) {
    const t = n[s];
    for (let o = tt; o <= et; o += 1)
      e[s][o] = qt(o, t[0], t[1], t[2]);
  }
  return e.high[16] = dt, e;
}
const at = Bt();
function nt(n, e) {
  return at[e][n] ?? at.mid[16] ?? dt;
}
function Ct(n) {
  return Number.isInteger(n) && n >= tt && n <= et;
}
function Ht(n) {
  return n === "low" || n === "mid" || n === "high";
}
function Ot(n) {
  return $.includes(n);
}
function j(n) {
  return n >= 1e3 ? "1kx" : n >= 100 ? `${Math.round(n)}x` : `${n.toFixed(1)}x`;
}
function Dt(n, e) {
  const s = (e - 1) / 2, t = s === 0 ? 0 : Math.abs(n - s) / s, o = 168 - t * 164, i = 52 + t * 26, r = 64 - t * 12;
  return `hsl(${o.toFixed(1)} ${i.toFixed(1)}% ${r.toFixed(1)}%)`;
}
const W = 1e3;
function H() {
  return { credits: W };
}
function Wt(n, e) {
  const s = 2 ** n, t = e() * s;
  let o = 0;
  for (let i = 0; i <= n; i += 1)
    if (o += ut(n, i), t < o) return i;
  return n;
}
function Gt(n, e, s, t, o, i) {
  if (!Ot(e)) return { error: "bad_bet" };
  if (!Ct(s)) return { error: "bad_rows" };
  if (!Ht(t)) return { error: "bad_risk" };
  if (n.credits < e) return { error: "insufficient" };
  const r = nt(s, t), l = typeof i == "number" && Number.isInteger(i) && i >= 0 && i <= s ? i : Wt(s, o), a = r[l] ?? 0, u = Math.round(e * a);
  return n.credits -= e, n.credits += u, { rows: s, risk: t, bet: e, bucket: l, multiplier: a, win: u, credits: n.credits };
}
const Ft = 0.63;
function zt(n, e, s) {
  let t = Math.max(0, Math.min(n, Math.floor(e))), o = n - t;
  const i = [];
  let r = null;
  for (let l = 0; l < n; l += 1) {
    let a;
    if (t <= 0) a = "L";
    else if (o <= 0) a = "R";
    else if (r === null) a = s() < t / (t + o) ? "R" : "L";
    else {
      const u = r === "R" ? "L" : "R";
      a = (s() < Ft ? r : u) === "R" ? t > 0 ? "R" : "L" : o > 0 ? "L" : "R";
    }
    i.push(a), a === "R" ? t -= 1 : o -= 1, r = a;
  }
  return i;
}
const J = 0.18, V = 0.2, Y = 0.92, ft = 0.55, Ut = 1.05;
function Kt(n, e) {
  const s = [];
  let t = 1, o = 0;
  for (const i of n) {
    const r = i === "R" ? 1 : -1, l = 0.75 + e() * 0.55, a = 0.8 + e() * 0.42;
    t = t * 0.45 + a * 0.55, o = Math.max(-0.75, Math.min(0.75, o * 0.5 + r * (0.28 + e() * 0.35)));
    const u = e(), b = u < 0.08 ? "double" : u < 0.18 ? "skim" : "none";
    s.push({ hop: l, pace: t, flourish: b, vx: o });
  }
  return s;
}
function Xt(n, e, s) {
  return { x: (n - 1 - e) / 2 + s, y: e + 1 };
}
function ht(n, e) {
  return n + e;
}
function Q(n) {
  return n === "R" ? 1 : -1;
}
function O(n, e, s, t) {
  return {
    x: n.x + s * Math.sin(e) * t,
    y: n.y - Math.cos(e) * t / Y
  };
}
function pt(n, e) {
  let s = 0;
  for (let t = 0; t < e; t += 1) n[t] === "R" && (s += 1);
  return s;
}
function Z(n, e, s) {
  const t = s[e] === "R" ? "R" : "L", o = pt(s, e) + 1;
  return { peg: Xt(n, e, o), index: o, dir: t };
}
function jt(n, e) {
  const s = n.x - e.x, t = (n.y - e.y) * Y, o = Math.hypot(s, t) || 1;
  return { x: s / o, y: t / o / Y };
}
function ct(n, e, s, t) {
  const o = 1 - t;
  return {
    x: o * o * n.x + 2 * o * t * e.x + t * t * s.x,
    y: o * o * n.y + 2 * o * t * e.y + t * t * s.y
  };
}
function Jt(n, e, s, t, o = J, i = V, r) {
  const l = Math.max(0, Math.min(n - 1, s)), a = Math.max(0, Math.min(1, t)), u = ht(o, i), b = Z(n, l, e), c = Q(b.dir), f = r?.flourish ?? "none", k = r?.hop ?? 1, g = r?.vx ?? 0, S = f === "skim" ? 0.95 : ft, x = f === "skim" ? 1.22 : Ut, _ = f === "double" ? 0.7 : 0.62;
  if (f === "double" && a <= 0.48) {
    if (a <= 0.24) {
      const z = a / 0.24;
      return {
        ...O(b.peg, S + (x - S) * z, c, u),
        hit: { row: l, index: b.index }
      };
    }
    const T = O(b.peg, x, c, u), C = O(b.peg, x - 0.18, c, u), v = jt(T, b.peg), I = (a - 0.24) / 0.24;
    return {
      ...ct(
        T,
        { x: T.x + v.x * 0.16 * k, y: T.y + v.y * 0.16 * k - 0.05 * k },
        C,
        I
      ),
      hit: I > 0.82 ? { row: l, index: b.index } : null
    };
  }
  const L = f === "double" ? 0.62 : 0.5;
  if (a <= L) {
    const T = a / L;
    return {
      ...O(b.peg, S + (x - S) * T, c, u),
      hit: a <= _ ? { row: l, index: b.index } : null
    };
  }
  const A = O(b.peg, x, c, u), B = Vt(n, e, l, o, i), G = (a - L) / (1 - L), F = {
    x: A.x + c * (0.2 + 0.08 * k) + g * 0.06,
    y: A.y - 0.13 * k
  };
  return {
    ...ct(A, F, B, G),
    hit: null
  };
}
function Vt(n, e, s, t, o) {
  const i = Z(n, s, e), r = Q(i.dir), a = pt(e, s) + (i.dir === "R" ? 1 : 0);
  if (s + 1 >= n) return { x: a + 0.5, y: n + 1.4 };
  const u = e[s + 1] === "R" ? "R" : "L", b = Z(n, s + 1, e), c = Q(u), f = ht(t, o), k = O(b.peg, ft, c, f);
  return {
    x: (i.peg.x + r * 0.5 + k.x) / 2,
    y: (i.peg.y + b.peg.y) / 2
  };
}
function Yt() {
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
const Qt = {}, X = "wgf:slots-wallet", bt = "wgf:slots-token", Zt = "wgf:session";
function te(n) {
  Yt();
  let e = null;
  const s = [];
  let t = null, o = null, i = H(), r = W, l = 20, a = 16, u = "high", b = "normal", c = !1, f = "pending", k = !1, g = "ready", S = -1, x = -1, _ = 0;
  const L = [], A = /* @__PURE__ */ new Set();
  let B = null, G = !1, F = 0, T = () => {
  };
  function C(p, d) {
    return Lt(e?.store.getState().ui.locale ?? "zh", p, d);
  }
  function v() {
    if (!t) return;
    const p = t.querySelector("[data-credits]"), d = t.querySelector("[data-amount]"), y = t.querySelector("[data-row-label]"), M = t.querySelector("[data-demo]"), P = t.querySelector("[data-source]");
    p && (p.textContent = String(r)), d && (d.textContent = String(l)), y && (y.textContent = String(a)), M && (M.hidden = f !== "local"), P && (P.textContent = C(f === "server" ? "plinko.server" : f === "local" ? "plinko.local" : "plinko.pending")), t.dataset.rows = String(a), t.dataset.risk = u, t.dataset.pace = b, t.dataset.pegs = String(a + 2), t.dataset.buckets = String(a + 1), S >= 0 && (t.dataset.bucket = String(S)), x >= 0 && (t.dataset.landed = String(x)), t.dataset.round = o && o.inflight > 0 ? "busy" : "open";
    const w = $.indexOf(l), h = t.querySelector("[data-bet-dec]"), q = t.querySelector("[data-bet-inc]");
    h && (h.disabled = w <= 0), q && (q.disabled = w >= $.length - 1), t.querySelectorAll("[data-bet]").forEach((m) => {
      m.classList.toggle("is-bet", Number(m.dataset.bet) === l);
    }), t.querySelectorAll("[data-speed]").forEach((m) => {
      m.classList.toggle("is-on", m.dataset.speed === b);
    }), t.querySelectorAll("[data-risk-pick]").forEach((m) => {
      m.classList.toggle("is-on", m.dataset.riskPick === u);
    });
    const E = t.querySelector("[data-drop]");
    E && (E.disabled = !k || g !== "running" || r < l);
    const N = t.querySelector("[data-auto]");
    N && N.setAttribute("aria-pressed", c ? "true" : "false");
    const D = t.querySelector("[data-history]");
    D && D.replaceChildren(
      ...L.slice(0, 8).map((m) => {
        const rt = document.createElement("span");
        return rt.textContent = j(m), rt;
      })
    ), o?.setLayout(a, u), o?.setSpeed(b), t.dataset.seq = String(F), kt(t);
  }
  function I() {
    e && Mt(e.store, {
      id: n.manifest.id,
      status: g,
      score: Math.max(0, r - W),
      highScore: Math.max(0, r),
      message: "",
      detail: C(f === "server" ? "plinko.server" : "plinko.local"),
      credits: r
    });
  }
  function z() {
    f === "local" && localStorage.setItem(X, JSON.stringify(i));
  }
  function st() {
    try {
      const p = localStorage.getItem(X);
      if (!p) return H();
      const d = JSON.parse(p);
      return !d || typeof d.credits != "number" ? H() : { credits: Math.max(0, Math.floor(d.credits)) };
    } catch {
      return H();
    }
  }
  async function ot() {
    if (!await re()) {
      f = "local", i = st(), r = i.credits, k = !0, I(), v();
      return;
    }
    try {
      const d = await lt().post("/api/plinko/session", {});
      d.walletToken && localStorage.setItem(bt, d.walletToken), G = d.demo === !0, f = "server", i = { credits: d.credits }, r = d.credits;
    } catch {
      f = "local", i = st(), r = i.credits;
    }
    k = !0, I(), v();
  }
  async function U() {
    if (!k || g !== "running" || r < l) return;
    const p = se();
    if (A.has(p)) return;
    const d = { bet: l, rows: a, risk: u }, y = it() ? B : null;
    let M;
    if (f === "server")
      try {
        const h = await lt().post("/api/plinko/drop", {
          bet: d.bet,
          spinId: p,
          rows: d.rows,
          risk: d.risk,
          ...y !== null ? { bucket: y } : {}
        });
        M = h, i = { credits: h.credits };
      } catch {
        return;
      }
    else {
      const h = Gt(
        i,
        d.bet,
        d.rows,
        d.risk,
        Math.random,
        y
      );
      if ("error" in h) return;
      M = h, z();
    }
    A.add(p), r -= d.bet, S = M.bucket;
    const P = zt(d.rows, M.bucket, Math.random), w = {
      path: P,
      rows: d.rows,
      bet: d.bet,
      bucket: M.bucket,
      multiplier: M.multiplier,
      win: M.win,
      motion: Kt(P, Math.random)
    };
    o?.launch(w), I(), v();
  }
  function mt(p) {
    r += p.win, x = p.bucket, F += 1, L.unshift(p.multiplier), L.length > 8 && (L.length = 8), r < $[0] && (!o || o.inflight === 0) && (c = !1, g = "over"), I(), v();
  }
  function it() {
    return ee() && (f === "local" || G);
  }
  function kt(p) {
    const d = p.querySelector("[data-debug]");
    d && (d.hidden = !it());
    const y = p.querySelector("[data-debug-result]");
    if (!y) return;
    const M = `${a}:${u}`;
    if (y.dataset.key === M) return;
    const P = nt(a, u), w = B, h = document.createElement("option");
    h.value = "random", h.textContent = "随机";
    const q = [h];
    for (let E = 0; E <= a; E += 1) {
      const N = document.createElement("option");
      N.value = String(E), N.textContent = `${E} ${j(P[E] ?? 0)}`, q.push(N);
    }
    y.replaceChildren(...q), y.dataset.key = M, w !== null && w <= a ? (B = w, y.value = String(w)) : (B = null, y.value = "random");
  }
  return vt(n.manifest, {
    async onPreload(p, d) {
      await p.preload([], d);
    },
    async onMount(p) {
      e = p, p.container.setAttribute("data-wgf-game", n.gameAttr), t = document.createElement("div"), t.className = n.extraClass ? `plinko ${n.extraClass}` : "plinko", t.innerHTML = ne(n.title);
      const d = t.querySelector("[data-board]");
      d instanceof HTMLElement && (o = n.createBoard(d), o.onLand = mt, o.setLayout(a, u)), p.container.appendChild(t);
      const y = t;
      y.addEventListener("change", (w) => {
        const h = w.target;
        !(h instanceof HTMLSelectElement) || !h.matches("[data-debug-result]") || (B = h.value === "random" ? null : Number(h.value));
      }), y.addEventListener("click", (w) => {
        const h = w.target;
        if (!(h instanceof Element)) return;
        if (h.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        const q = h.closest("[data-bet]"), E = q instanceof HTMLElement ? Number(q.dataset.bet) : Number.NaN;
        if ($.includes(E)) {
          l = E, y.classList.remove("is-bets"), v();
          return;
        }
        if (h.closest("[data-bet-dec]")) {
          const m = $[$.indexOf(l) - 1];
          m !== void 0 && (l = m), y.classList.remove("is-bets"), v();
          return;
        }
        if (h.closest("[data-bet-inc]")) {
          const m = $[$.indexOf(l) + 1];
          m !== void 0 && (l = m), y.classList.remove("is-bets"), v();
          return;
        }
        if (h.closest("[data-amount-bar]")) {
          y.classList.toggle("is-bets");
          return;
        }
        if (y.classList.contains("is-bets") && !h.closest("[data-bet-ui]") && y.classList.remove("is-bets"), h.closest("[data-row-dec]") && (!o || o.inflight === 0)) {
          a > tt && (a -= 1), v(), T();
          return;
        }
        if (h.closest("[data-row-inc]") && (!o || o.inflight === 0)) {
          a < et && (a += 1), v(), T();
          return;
        }
        const N = h.closest("[data-risk-pick]");
        if (N instanceof HTMLElement && (!o || o.inflight === 0)) {
          const m = N.dataset.riskPick;
          (m === "low" || m === "mid" || m === "high") && (u = m), v();
          return;
        }
        const D = h.closest("[data-speed]");
        if (D instanceof HTMLElement) {
          const m = D.dataset.speed;
          (m === "normal" || m === "fast" || m === "turbo") && (b = m), v();
          return;
        }
        if (h.closest("[data-auto]")) {
          c = !c, _ = 0, v(), c && U();
          return;
        }
        h.closest("[data-drop]") && U();
      }), T = () => {
        const w = t?.querySelector("[data-board]");
        !(w instanceof HTMLElement) || !o || o.resize(w.clientWidth, w.clientHeight);
      }, T();
      const M = new ResizeObserver(() => T()), P = t.querySelector("[data-board]");
      P && M.observe(P), s.push(() => M.disconnect()), s.push(St(() => T())), s.push(
        p.loop.onUpdate((w) => {
          o?.update(w), c && g === "running" && (!o || o.inflight < 6) && (_ -= w, _ <= 0 && r >= l && (_ = b === "turbo" ? 0.12 : b === "fast" ? 0.28 : 0.45, U()));
        })
      ), p.events.on("game:start", () => {
        g === "ready" && (g = "running", I(), v());
      }), p.events.on("game:restart", () => {
        i = f === "local" ? H() : i, f === "local" && (localStorage.removeItem(X), i = H(), z()), r = f === "server" ? i.credits : W, f === "server" ? ot() : r = W, c = !1, L.length = 0, S = -1, x = -1, g = "running", I(), v();
      }), v(), ot();
    },
    onDestroy() {
      for (const p of s) p();
      s.length = 0, o?.destroy(), o = null, t?.remove(), t = null, e = null;
    }
  });
}
function ee() {
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
function ne(n) {
  const e = $.map(
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
function se() {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function lt() {
  const n = new Tt(), e = oe(), s = ie();
  if (e) n.set({ accessToken: e });
  else if (s?.accessToken && !s.accessToken.startsWith("local."))
    n.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const t = localStorage.getItem(bt);
    t?.startsWith("v1w.") && n.set({ accessToken: t });
  }
  return new Rt({ baseUrl: gt(), tokens: n, timeoutMs: 2500 });
}
function oe() {
  try {
    const n = sessionStorage.getItem("wgf:launch-token");
    return n && n.length >= 8 ? n : null;
  } catch {
    return null;
  }
}
function ie() {
  try {
    const n = localStorage.getItem(Zt);
    return n ? JSON.parse(n) : null;
  } catch {
    return null;
  }
}
function gt() {
  return Qt?.VITE_API_BASE || "http://127.0.0.1:8787";
}
async function re() {
  try {
    return (await fetch(`${gt()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
const ae = {
  normal: 0.34,
  fast: 0.16,
  turbo: 0.07
};
class ce {
  constructor(e) {
    R(this, "canvas");
    R(this, "ctx");
    R(this, "rows", 16);
    R(this, "risk", "high");
    R(this, "speed", "normal");
    R(this, "width", 1);
    R(this, "height", 1);
    R(this, "balls", []);
    R(this, "pulses", /* @__PURE__ */ new Map());
    R(this, "pegPulses", /* @__PURE__ */ new Map());
    R(this, "nextId", 1);
    R(this, "onLand", null);
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
      const i = o - e;
      i <= 0 ? this.pulses.delete(t) : this.pulses.set(t, i);
    }
    for (const [t, o] of this.pegPulses) {
      const i = o - e;
      i <= 0 ? this.pegPulses.delete(t) : this.pegPulses.set(t, i);
    }
    this.draw();
  }
  destroy() {
    this.canvas.remove();
  }
  metrics() {
    const t = Math.max(22, Math.min(36, this.height * 0.08)), o = this.height - t - 8, i = (o - 18 - 8) / this.rows;
    return { pad: 14, spacing: (this.width - 28) / (this.rows + 1), top: 18, rowGap: i, bucketTop: o, bucketH: t };
  }
  pegX(e, s, t, o) {
    const i = 3 + e, r = (this.rows + 2 - i) / 2 * o;
    return t + r + s * o;
  }
  draw() {
    const e = this.ctx, { pad: s, spacing: t, top: o, rowGap: i, bucketTop: r, bucketH: l } = this.metrics();
    e.clearRect(0, 0, this.width, this.height), e.fillStyle = "#272b2c", e.fillRect(0, 0, this.width, this.height);
    const a = nt(this.rows, this.risk), u = t * J, b = t * V;
    for (let c = 0; c < this.rows; c += 1) {
      const f = 3 + c, k = o + i * (c + 1);
      for (let g = 0; g < f; g += 1) {
        const S = this.pegX(c, g, s, t), x = this.pegPulses.get(`${c}:${g}`) ?? 0;
        e.beginPath(), e.fillStyle = x > 0 ? "#fff4c2" : "#f4f7f8", e.arc(S, k, u * (x > 0 ? 1.45 : 1), 0, Math.PI * 2), e.fill();
      }
    }
    for (let c = 0; c < a.length; c += 1) {
      const f = this.pegX(this.rows - 1, c, s, t), k = this.pegX(this.rows - 1, c + 1, s, t), g = this.pulses.get(c) ?? 0, S = g > 0 ? 1 + g / 0.45 * 0.12 : 1, x = (k - f - 3) * S, _ = (f + k) / 2 - x / 2, L = l * S, A = r - (L - l) / 2;
      le(e, _, A, x, L, Math.min(8, L / 2)), e.fillStyle = Dt(c, a.length), e.fill(), e.fillStyle = "#1a1c1d", e.font = `700 ${Math.max(8, Math.min(11, x * 0.42))}px Outfit, sans-serif`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(j(a[c] ?? 0), _ + x / 2, A + L / 2);
    }
    for (const c of this.balls) {
      const f = Math.min(c.step, Math.max(0, c.rows - 1)), k = c.landed || c.step >= c.rows ? 1 : c.u, g = Jt(
        c.rows,
        c.path,
        f,
        k,
        J,
        V,
        c.motion?.[f]
      );
      g.hit && this.pegPulses.set(`${g.hit.row}:${g.hit.index}`, 0.22);
      const S = s + g.x * t, x = o + g.y * i;
      e.beginPath(), e.fillStyle = "#f7f4ea", e.arc(S, x, b, 0, Math.PI * 2), e.fill(), e.strokeStyle = "rgba(0,0,0,0.35)", e.lineWidth = 1, e.stroke();
    }
  }
}
function le(n, e, s, t, o, i) {
  const r = Math.max(0, Math.min(i, t / 2, o / 2));
  n.beginPath(), n.moveTo(e + r, s), n.arcTo(e + t, s, e + t, s + o, r), n.arcTo(e + t, s + o, e, s + o, r), n.arcTo(e, s + o, e, s, r), n.arcTo(e, s, e + t, s, r), n.closePath();
}
function he() {
  return te({
    manifest: Pt,
    title: "弹珠",
    gameAttr: "wgf-game:plinko",
    createBoard: (n) => new ce(n)
  });
}
export {
  he as createGame,
  Pt as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
