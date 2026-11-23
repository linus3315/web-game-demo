var qe = Object.defineProperty;
var We = (r, e, s) => e in r ? qe(r, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : r[e] = s;
var v = (r, e, s) => We(r, typeof e != "symbol" ? e + "" : e, s);
import { BoxGeometry as J, Vector3 as N, Mesh as P, OrthographicCamera as Ve, BufferGeometry as Ze, Float32BufferAttribute as we, ShaderMaterial as ee, UniformsUtils as ae, Vector2 as ye, WebGLRenderTarget as De, HalfFloatType as Re, NoBlending as Ee, Clock as Qe, RawShaderMaterial as je, ColorManagement as Ke, SRGBTransfer as Xe, LinearToneMapping as Ye, ReinhardToneMapping as Je, CineonToneMapping as et, ACESFilmicToneMapping as tt, AgXToneMapping as st, NeutralToneMapping as ot, Color as Z, NearestFilter as Ce, MeshDepthMaterial as rt, RGBADepthPacking as it, Scene as at, Group as nt, WebGLRenderer as lt, SRGBColorSpace as Q, PCFSoftShadowMap as ct, PerspectiveCamera as ht, HemisphereLight as ut, DirectionalLight as Se, PointLight as dt, MeshBasicMaterial as ke, CylinderGeometry as ft, MeshStandardMaterial as H, CapsuleGeometry as pt, PlaneGeometry as mt, DoubleSide as gt, SphereGeometry as bt, MeshPhysicalMaterial as vt, CircleGeometry as K, CanvasTexture as ne, RepeatWrapping as V } from "three";
import { registerStrings as xt, defineGame as wt, bindVisualViewport as yt, patchGame as Ct, t as St } from "@wgf/core";
import { TokenStore as kt, HttpClient as Mt } from "@wgf/net";
const _t = {
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
}, Tt = {
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
  art: _t,
  renderer: "three",
  controls: "pointer",
  tags: ["弹珠", "联网"],
  theme: { accent: "#f0a04b", accentInk: "#2a160c", glow: "#e23b3b", radius: 18, font: "sans" }
}, le = 8, ce = 16, D = [10, 20, 50, 100], Pt = ["low", "mid", "high"], Le = [
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
function Ne(r, e) {
  let s = 1;
  for (let t = 1; t <= e; t += 1) s = s * (r - e + t) / t;
  return s;
}
function X(r) {
  const e = r.length - 1, s = 2 ** e;
  let t = 0;
  for (let o = 0; o < r.length; o += 1)
    t += Ne(e, o) / s * (r[o] ?? 0);
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
function Rt(r) {
  const e = r.length - 1, s = r.slice();
  for (let t = 0; t <= e; t += 1) {
    const o = Dt(((s[t] ?? 0) + (s[e - t] ?? 0)) / 2);
    s[t] = o, s[e - t] = o;
  }
  return s;
}
function Et(r) {
  const e = r / 2, s = [];
  for (let t = 0; t <= r; t += 1) Math.abs(t - e) <= 0.5 && s.push(t);
  return s;
}
function Lt(r, e, s, t) {
  const o = At(r, e, s, t), i = Rt(o.map((h) => h * (0.99 / X(o)))), n = Et(r);
  let l = i, a = Math.abs(X(l) - 0.99);
  for (let h = -20; h <= 20; h += 1) {
    const u = i.slice(), b = i[n[0] ?? 0] ?? 0, c = Math.max(0.1, Math.round((b + h * 0.1) * 10) / 10);
    for (const d of n) u[d] = c;
    const p = Math.abs(X(u) - 0.99);
    p < a && (a = p, l = u);
  }
  return l;
}
function Nt() {
  const r = {
    low: [18, 1.05, 2.2],
    mid: [160, 0.45, 1.65],
    high: [700, 0.2, 1.25]
  }, e = { low: {}, mid: {}, high: {} };
  for (const s of Pt) {
    const t = r[s];
    for (let o = le; o <= ce; o += 1)
      e[s][o] = Lt(o, t[0], t[1], t[2]);
  }
  return e.high[16] = Le, e;
}
const Me = Nt();
function he(r, e) {
  return Me[e][r] ?? Me.mid[16] ?? Le;
}
function Ut(r) {
  return Number.isInteger(r) && r >= le && r <= ce;
}
function Bt(r) {
  return r === "low" || r === "mid" || r === "high";
}
function Ft(r) {
  return D.includes(r);
}
function te(r) {
  return r >= 1e3 ? "1kx" : r >= 100 ? `${Math.round(r)}x` : `${r.toFixed(1)}x`;
}
function It(r, e) {
  const s = (e - 1) / 2, t = s === 0 ? 0 : Math.abs(r - s) / s, o = 168 - t * 164, i = 52 + t * 26, n = 64 - t * 12;
  return `hsl(${o.toFixed(1)} ${i.toFixed(1)}% ${n.toFixed(1)}%)`;
}
const W = 1e3;
function I() {
  return { credits: W };
}
function Gt(r, e) {
  const s = 2 ** r, t = e() * s;
  let o = 0;
  for (let i = 0; i <= r; i += 1)
    if (o += Ne(r, i), t < o) return i;
  return r;
}
function Ot(r, e, s, t, o, i) {
  if (!Ft(e)) return { error: "bad_bet" };
  if (!Ut(s)) return { error: "bad_rows" };
  if (!Bt(t)) return { error: "bad_risk" };
  if (r.credits < e) return { error: "insufficient" };
  const n = he(s, t), l = typeof i == "number" && Number.isInteger(i) && i >= 0 && i <= s ? i : Gt(s, o), a = n[l] ?? 0, h = Math.round(e * a);
  return r.credits -= e, r.credits += h, { rows: s, risk: t, bet: e, bucket: l, multiplier: a, win: h, credits: r.credits };
}
function zt(r, e, s) {
  const t = Math.max(0, Math.min(r, e)), o = [];
  for (let i = 0; i < t; i += 1) o.push("R");
  for (let i = 0; i < r - t; i += 1) o.push("L");
  for (let i = o.length - 1; i > 0; i -= 1) {
    const n = Math.floor(s() * (i + 1)), l = o[i];
    o[i] = o[n] ?? "L", o[n] = l ?? "L";
  }
  return o;
}
const Ue = 0.18, Be = 0.2, $t = 0.92, se = 0.55, _e = 1.05;
function Ht(r, e, s) {
  return { x: (r - 1 - e) / 2 + s, y: e + 1 };
}
function Fe(r, e) {
  return r + e;
}
function oe(r) {
  return r === "R" ? 1 : -1;
}
function re(r, e, s, t) {
  return {
    x: r.x + s * Math.sin(e) * t,
    y: r.y - Math.cos(e) * t / $t
  };
}
function Ie(r, e) {
  let s = 0;
  for (let t = 0; t < e; t += 1) r[t] === "R" && (s += 1);
  return s;
}
function ie(r, e, s) {
  const t = s[e] === "R" ? "R" : "L", o = Ie(s, e) + 1;
  return { peg: Ht(r, e, o), index: o, dir: t };
}
function qt(r, e, s, t) {
  const o = 1 - t;
  return {
    x: o * o * r.x + 2 * o * t * e.x + t * t * s.x,
    y: o * o * r.y + 2 * o * t * e.y + t * t * s.y
  };
}
function Wt(r, e, s, t, o = Ue, i = Be) {
  const n = Math.max(0, Math.min(r - 1, s)), l = Math.max(0, Math.min(1, t)), a = Fe(o, i), h = ie(r, n, e), u = oe(h.dir), b = l <= 0.62;
  if (l <= 0.5) {
    const S = l / 0.5, y = se + (_e - se) * S;
    return {
      ...re(h.peg, y, u, a),
      hit: b ? { row: n, index: h.index } : null
    };
  }
  const c = re(h.peg, _e, u, a), p = Vt(r, e, n, o, i), d = (l - 0.5) / 0.5, _ = {
    x: c.x + u * 0.28,
    y: c.y - 0.16
  };
  return {
    ...qt(c, _, p, d),
    hit: l < 0.58 ? { row: n, index: h.index } : null
  };
}
function Vt(r, e, s, t, o) {
  const i = ie(r, s, e), n = oe(i.dir), a = Ie(e, s) + (i.dir === "R" ? 1 : 0);
  if (s + 1 >= r) return { x: a + 0.5, y: r + 1.4 };
  const h = e[s + 1] === "R" ? "R" : "L", u = ie(r, s + 1, e), b = oe(h), c = Fe(t, o), p = re(u.peg, se, b, c);
  return {
    x: (i.peg.x + n * 0.5 + p.x) / 2,
    y: (i.peg.y + u.peg.y) / 2
  };
}
function Zt() {
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
const Qt = {}, Y = "wgf:slots-wallet", Ge = "wgf:slots-token", jt = "wgf:session";
function Kt(r) {
  Zt();
  let e = null;
  const s = [];
  let t = null, o = null, i = I(), n = W, l = 20, a = 16, h = "high", u = "normal", b = !1, c = "pending", p = !1, d = "ready", _ = -1, S = -1, y = 0;
  const U = [], de = /* @__PURE__ */ new Set();
  let O = null, fe = !1, pe = 0, B = () => {
  };
  function z(g, f) {
    return St(e?.store.getState().ui.locale ?? "zh", g, f);
  }
  function M() {
    if (!t) return;
    const g = t.querySelector("[data-credits]"), f = t.querySelector("[data-amount]"), w = t.querySelector("[data-row-label]"), k = t.querySelector("[data-demo]"), E = t.querySelector("[data-source]");
    g && (g.textContent = String(n)), f && (f.textContent = String(l)), w && (w.textContent = String(a)), k && (k.hidden = c !== "local"), E && (E.textContent = z(c === "server" ? "plinko.server" : c === "local" ? "plinko.local" : "plinko.pending")), t.dataset.rows = String(a), t.dataset.risk = h, t.dataset.pace = u, t.dataset.pegs = String(a + 2), t.dataset.buckets = String(a + 1), _ >= 0 && (t.dataset.bucket = String(_)), S >= 0 && (t.dataset.landed = String(S)), t.dataset.round = o && o.inflight > 0 ? "busy" : "open";
    const C = D.indexOf(l), m = t.querySelector("[data-bet-dec]"), L = t.querySelector("[data-bet-inc]");
    m && (m.disabled = C <= 0), L && (L.disabled = C >= D.length - 1), t.querySelectorAll("[data-bet]").forEach((x) => {
      x.classList.toggle("is-bet", Number(x.dataset.bet) === l);
    }), t.querySelectorAll("[data-speed]").forEach((x) => {
      x.classList.toggle("is-on", x.dataset.speed === u);
    }), t.querySelectorAll("[data-risk-pick]").forEach((x) => {
      x.classList.toggle("is-on", x.dataset.riskPick === h);
    });
    const A = t.querySelector("[data-drop]");
    A && (A.disabled = !p || d !== "running" || n < l);
    const R = t.querySelector("[data-auto]");
    R && R.setAttribute("aria-pressed", b ? "true" : "false");
    const $ = t.querySelector("[data-history]");
    $ && $.replaceChildren(
      ...U.slice(0, 8).map((x) => {
        const xe = document.createElement("span");
        return xe.textContent = te(x), xe;
      })
    ), o?.setLayout(a, h), o?.setSpeed(u), t.dataset.seq = String(pe), He(t);
  }
  function F() {
    e && Ct(e.store, {
      id: r.manifest.id,
      status: d,
      score: Math.max(0, n - W),
      highScore: Math.max(0, n),
      message: "",
      detail: z(c === "server" ? "plinko.server" : "plinko.local"),
      credits: n
    });
  }
  function me() {
    c === "local" && localStorage.setItem(Y, JSON.stringify(i));
  }
  function ge() {
    try {
      const g = localStorage.getItem(Y);
      if (!g) return I();
      const f = JSON.parse(g);
      return !f || typeof f.credits != "number" ? I() : { credits: Math.max(0, Math.floor(f.credits)) };
    } catch {
      return I();
    }
  }
  async function be() {
    if (!await ss()) {
      c = "local", i = ge(), n = i.credits, p = !0, F(), M();
      return;
    }
    try {
      const f = await Te().post("/api/plinko/session", {});
      f.walletToken && localStorage.setItem(Ge, f.walletToken), fe = f.demo === !0, c = "server", i = { credits: f.credits }, n = f.credits;
    } catch {
      c = "local", i = ge(), n = i.credits;
    }
    p = !0, F(), M();
  }
  async function j() {
    if (!p || d !== "running" || n < l) return;
    const g = Jt();
    if (de.has(g)) return;
    const f = { bet: l, rows: a, risk: h }, w = ve() ? O : null;
    let k;
    if (c === "server")
      try {
        const m = await Te().post("/api/plinko/drop", {
          bet: f.bet,
          spinId: g,
          rows: f.rows,
          risk: f.risk,
          ...w !== null ? { bucket: w } : {}
        });
        k = m, i = { credits: m.credits };
      } catch {
        return;
      }
    else {
      const m = Ot(
        i,
        f.bet,
        f.rows,
        f.risk,
        Math.random,
        w
      );
      if ("error" in m) return;
      k = m, me();
    }
    de.add(g), n -= f.bet, _ = k.bucket;
    const C = {
      path: zt(f.rows, k.bucket, Math.random),
      rows: f.rows,
      bet: f.bet,
      bucket: k.bucket,
      multiplier: k.multiplier,
      win: k.win
    };
    o?.launch(C), F(), M();
  }
  function $e(g) {
    n += g.win, S = g.bucket, pe += 1, U.unshift(g.multiplier), U.length > 8 && (U.length = 8), n < D[0] && (!o || o.inflight === 0) && (b = !1, d = "over"), F(), M();
  }
  function ve() {
    return Xt() && (c === "local" || fe);
  }
  function He(g) {
    const f = g.querySelector("[data-debug]");
    f && (f.hidden = !ve());
    const w = g.querySelector("[data-debug-result]");
    if (!w) return;
    const k = `${a}:${h}`;
    if (w.dataset.key === k) return;
    const E = he(a, h), C = O, m = document.createElement("option");
    m.value = "random", m.textContent = "随机";
    const L = [m];
    for (let A = 0; A <= a; A += 1) {
      const R = document.createElement("option");
      R.value = String(A), R.textContent = `${A} ${te(E[A] ?? 0)}`, L.push(R);
    }
    w.replaceChildren(...L), w.dataset.key = k, C !== null && C <= a ? (O = C, w.value = String(C)) : (O = null, w.value = "random");
  }
  return wt(r.manifest, {
    async onPreload(g, f) {
      await g.preload([], f);
    },
    async onMount(g) {
      e = g, g.container.setAttribute("data-wgf-game", r.gameAttr), t = document.createElement("div"), t.className = r.extraClass ? `plinko ${r.extraClass}` : "plinko", t.innerHTML = Yt(r.title);
      const f = t.querySelector("[data-board]");
      f instanceof HTMLElement && (o = r.createBoard(f), o.onLand = $e, o.setLayout(a, h)), g.container.appendChild(t);
      const w = t;
      w.addEventListener("change", (C) => {
        const m = C.target;
        !(m instanceof HTMLSelectElement) || !m.matches("[data-debug-result]") || (O = m.value === "random" ? null : Number(m.value));
      }), w.addEventListener("click", (C) => {
        const m = C.target;
        if (!(m instanceof Element)) return;
        if (m.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        const L = m.closest("[data-bet]"), A = L instanceof HTMLElement ? Number(L.dataset.bet) : Number.NaN;
        if (D.includes(A)) {
          l = A, w.classList.remove("is-bets"), M();
          return;
        }
        if (m.closest("[data-bet-dec]")) {
          const x = D[D.indexOf(l) - 1];
          x !== void 0 && (l = x), w.classList.remove("is-bets"), M();
          return;
        }
        if (m.closest("[data-bet-inc]")) {
          const x = D[D.indexOf(l) + 1];
          x !== void 0 && (l = x), w.classList.remove("is-bets"), M();
          return;
        }
        if (m.closest("[data-amount-bar]")) {
          w.classList.toggle("is-bets");
          return;
        }
        if (w.classList.contains("is-bets") && !m.closest("[data-bet-ui]") && w.classList.remove("is-bets"), m.closest("[data-row-dec]") && (!o || o.inflight === 0)) {
          a > le && (a -= 1), M(), B();
          return;
        }
        if (m.closest("[data-row-inc]") && (!o || o.inflight === 0)) {
          a < ce && (a += 1), M(), B();
          return;
        }
        const R = m.closest("[data-risk-pick]");
        if (R instanceof HTMLElement && (!o || o.inflight === 0)) {
          const x = R.dataset.riskPick;
          (x === "low" || x === "mid" || x === "high") && (h = x), M();
          return;
        }
        const $ = m.closest("[data-speed]");
        if ($ instanceof HTMLElement) {
          const x = $.dataset.speed;
          (x === "normal" || x === "fast" || x === "turbo") && (u = x), M();
          return;
        }
        if (m.closest("[data-auto]")) {
          b = !b, y = 0, M(), b && j();
          return;
        }
        m.closest("[data-drop]") && j();
      }), B = () => {
        const C = t?.querySelector("[data-board]");
        !(C instanceof HTMLElement) || !o || o.resize(C.clientWidth, C.clientHeight);
      }, B();
      const k = new ResizeObserver(() => B()), E = t.querySelector("[data-board]");
      E && k.observe(E), s.push(() => k.disconnect()), s.push(yt(() => B())), s.push(
        g.loop.onUpdate((C) => {
          o?.update(C), b && d === "running" && (!o || o.inflight < 6) && (y -= C, y <= 0 && n >= l && (y = u === "turbo" ? 0.12 : u === "fast" ? 0.28 : 0.45, j()));
        })
      ), g.events.on("game:start", () => {
        d === "ready" && (d = "running", F(), M());
      }), g.events.on("game:restart", () => {
        i = c === "local" ? I() : i, c === "local" && (localStorage.removeItem(Y), i = I(), me()), n = c === "server" ? i.credits : W, c === "server" ? be() : n = W, b = !1, U.length = 0, _ = -1, S = -1, d = "running", F(), M();
      }), M(), be();
    },
    onDestroy() {
      for (const g of s) g();
      s.length = 0, o?.destroy(), o = null, t?.remove(), t = null, e = null;
    }
  });
}
function Xt() {
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
function Yt(r) {
  const e = D.map(
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
function Jt() {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function Te() {
  const r = new kt(), e = es(), s = ts();
  if (e) r.set({ accessToken: e });
  else if (s?.accessToken && !s.accessToken.startsWith("local."))
    r.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const t = localStorage.getItem(Ge);
    t?.startsWith("v1w.") && r.set({ accessToken: t });
  }
  return new Mt({ baseUrl: Oe(), tokens: r, timeoutMs: 2500 });
}
function es() {
  try {
    const r = sessionStorage.getItem("wgf:launch-token");
    return r && r.length >= 8 ? r : null;
  } catch {
    return null;
  }
}
function ts() {
  try {
    const r = localStorage.getItem(jt);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}
function Oe() {
  return Qt?.VITE_API_BASE || "http://127.0.0.1:8787";
}
async function ss() {
  try {
    return (await fetch(`${Oe()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
const q = new N();
function T(r, e, s, t, o, i) {
  const n = 2 * Math.PI * o / 4, l = Math.max(i - 2 * o, 0), a = Math.PI / 4;
  q.copy(e), q[t] = 0, q.normalize();
  const h = 0.5 * n / (n + l), u = 1 - q.angleTo(r) / a;
  return Math.sign(q[s]) === 1 ? u * h : l / (n + l) + h + h * (1 - u);
}
class Pe extends J {
  constructor(e = 1, s = 1, t = 1, o = 2, i = 0.1) {
    if (o = o * 2 + 1, i = Math.min(e / 2, s / 2, t / 2, i), super(1, 1, 1, o, o, o), o === 1) return;
    const n = this.toNonIndexed();
    this.index = null, this.attributes.position = n.attributes.position, this.attributes.normal = n.attributes.normal, this.attributes.uv = n.attributes.uv;
    const l = new N(), a = new N(), h = new N(e, s, t).divideScalar(2).subScalar(i), u = this.attributes.position.array, b = this.attributes.normal.array, c = this.attributes.uv.array, p = u.length / 6, d = new N(), _ = 0.5 / o;
    for (let S = 0, y = 0; S < u.length; S += 3, y += 2)
      switch (l.fromArray(u, S), a.copy(l), a.x -= Math.sign(a.x) * _, a.y -= Math.sign(a.y) * _, a.z -= Math.sign(a.z) * _, a.normalize(), u[S + 0] = h.x * Math.sign(l.x) + a.x * i, u[S + 1] = h.y * Math.sign(l.y) + a.y * i, u[S + 2] = h.z * Math.sign(l.z) + a.z * i, b[S + 0] = a.x, b[S + 1] = a.y, b[S + 2] = a.z, Math.floor(S / p)) {
        case 0:
          d.set(1, 0, 0), c[y + 0] = T(d, a, "z", "y", i, t), c[y + 1] = 1 - T(d, a, "y", "z", i, s);
          break;
        case 1:
          d.set(-1, 0, 0), c[y + 0] = 1 - T(d, a, "z", "y", i, t), c[y + 1] = 1 - T(d, a, "y", "z", i, s);
          break;
        case 2:
          d.set(0, 1, 0), c[y + 0] = 1 - T(d, a, "x", "z", i, e), c[y + 1] = T(d, a, "z", "x", i, t);
          break;
        case 3:
          d.set(0, -1, 0), c[y + 0] = 1 - T(d, a, "x", "z", i, e), c[y + 1] = 1 - T(d, a, "z", "x", i, t);
          break;
        case 4:
          d.set(0, 0, 1), c[y + 0] = 1 - T(d, a, "x", "y", i, e), c[y + 1] = 1 - T(d, a, "y", "x", i, s);
          break;
        case 5:
          d.set(0, 0, -1), c[y + 0] = T(d, a, "x", "y", i, e), c[y + 1] = 1 - T(d, a, "y", "x", i, s);
          break;
      }
  }
}
const os = {
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
class G {
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
const rs = new Ve(-1, 1, 1, -1, 0, 1);
class is extends Ze {
  constructor() {
    super(), this.setAttribute("position", new we([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), this.setAttribute("uv", new we([0, 2, 0, 0, 2, 0], 2));
  }
}
const as = new is();
class ue {
  constructor(e) {
    this._mesh = new P(as, e);
  }
  dispose() {
    this._mesh.geometry.dispose();
  }
  render(e) {
    e.render(this._mesh, rs);
  }
  get material() {
    return this._mesh.material;
  }
  set material(e) {
    this._mesh.material = e;
  }
}
class ns extends G {
  constructor(e, s) {
    super(), this.textureID = s !== void 0 ? s : "tDiffuse", e instanceof ee ? (this.uniforms = e.uniforms, this.material = e) : e && (this.uniforms = ae.clone(e.uniforms), this.material = new ee({
      name: e.name !== void 0 ? e.name : "unspecified",
      defines: Object.assign({}, e.defines),
      uniforms: this.uniforms,
      vertexShader: e.vertexShader,
      fragmentShader: e.fragmentShader
    })), this.fsQuad = new ue(this.material);
  }
  render(e, s, t) {
    this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = t.texture), this.fsQuad.material = this.material, this.renderToScreen ? (e.setRenderTarget(null), this.fsQuad.render(e)) : (e.setRenderTarget(s), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this.fsQuad.render(e));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class Ae extends G {
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
class ls extends G {
  constructor() {
    super(), this.needsSwap = !1;
  }
  render(e) {
    e.state.buffers.stencil.setLocked(!1), e.state.buffers.stencil.setTest(!1);
  }
}
class cs {
  constructor(e, s) {
    if (this.renderer = e, this._pixelRatio = e.getPixelRatio(), s === void 0) {
      const t = e.getSize(new ye());
      this._width = t.width, this._height = t.height, s = new De(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: Re }), s.texture.name = "EffectComposer.rt1";
    } else
      this._width = s.width, this._height = s.height;
    this.renderTarget1 = s, this.renderTarget2 = s.clone(), this.renderTarget2.texture.name = "EffectComposer.rt2", this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = !0, this.passes = [], this.copyPass = new ns(os), this.copyPass.material.blending = Ee, this.clock = new Qe();
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
        Ae !== void 0 && (n instanceof Ae ? t = !0 : n instanceof ls && (t = !1));
      }
    }
    this.renderer.setRenderTarget(s);
  }
  reset(e) {
    if (e === void 0) {
      const s = this.renderer.getSize(new ye());
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
const hs = {
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
class us extends G {
  constructor() {
    super();
    const e = hs;
    this.uniforms = ae.clone(e.uniforms), this.material = new je({
      name: e.name,
      uniforms: this.uniforms,
      vertexShader: e.vertexShader,
      fragmentShader: e.fragmentShader
    }), this.fsQuad = new ue(this.material), this._outputColorSpace = null, this._toneMapping = null;
  }
  render(e, s, t) {
    this.uniforms.tDiffuse.value = t.texture, this.uniforms.toneMappingExposure.value = e.toneMappingExposure, (this._outputColorSpace !== e.outputColorSpace || this._toneMapping !== e.toneMapping) && (this._outputColorSpace = e.outputColorSpace, this._toneMapping = e.toneMapping, this.material.defines = {}, Ke.getTransfer(this._outputColorSpace) === Xe && (this.material.defines.SRGB_TRANSFER = ""), this._toneMapping === Ye ? this.material.defines.LINEAR_TONE_MAPPING = "" : this._toneMapping === Je ? this.material.defines.REINHARD_TONE_MAPPING = "" : this._toneMapping === et ? this.material.defines.CINEON_TONE_MAPPING = "" : this._toneMapping === tt ? this.material.defines.ACES_FILMIC_TONE_MAPPING = "" : this._toneMapping === st ? this.material.defines.AGX_TONE_MAPPING = "" : this._toneMapping === ot && (this.material.defines.NEUTRAL_TONE_MAPPING = ""), this.material.needsUpdate = !0), this.renderToScreen === !0 ? (e.setRenderTarget(null), this.fsQuad.render(e)) : (e.setRenderTarget(s), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this.fsQuad.render(e));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class ds extends G {
  constructor(e, s, t = null, o = null, i = null) {
    super(), this.scene = e, this.camera = s, this.overrideMaterial = t, this.clearColor = o, this.clearAlpha = i, this.clear = !0, this.clearDepth = !1, this.needsSwap = !1, this._oldClearColor = new Z();
  }
  render(e, s, t) {
    const o = e.autoClear;
    e.autoClear = !1;
    let i, n;
    this.overrideMaterial !== null && (n = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor !== null && (e.getClearColor(this._oldClearColor), e.setClearColor(this.clearColor, e.getClearAlpha())), this.clearAlpha !== null && (i = e.getClearAlpha(), e.setClearAlpha(this.clearAlpha)), this.clearDepth == !0 && e.clearDepth(), e.setRenderTarget(this.renderToScreen ? null : t), this.clear === !0 && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), e.render(this.scene, this.camera), this.clearColor !== null && e.setClearColor(this._oldClearColor), this.clearAlpha !== null && e.setClearAlpha(i), this.overrideMaterial !== null && (this.scene.overrideMaterial = n), e.autoClear = o;
  }
}
const fs = {
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
class ps extends G {
  constructor(e, s, t) {
    super(), this.scene = e, this.camera = s;
    const o = t.focus !== void 0 ? t.focus : 1, i = t.aperture !== void 0 ? t.aperture : 0.025, n = t.maxblur !== void 0 ? t.maxblur : 1;
    this.renderTargetDepth = new De(1, 1, {
      // will be resized later
      minFilter: Ce,
      magFilter: Ce,
      type: Re
    }), this.renderTargetDepth.texture.name = "BokehPass.depth", this.materialDepth = new rt(), this.materialDepth.depthPacking = it, this.materialDepth.blending = Ee;
    const l = fs, a = ae.clone(l.uniforms);
    a.tDepth.value = this.renderTargetDepth.texture, a.focus.value = o, a.aspect.value = s.aspect, a.aperture.value = i, a.maxblur.value = n, a.nearClip.value = s.near, a.farClip.value = s.far, this.materialBokeh = new ee({
      defines: Object.assign({}, l.defines),
      uniforms: a,
      vertexShader: l.vertexShader,
      fragmentShader: l.fragmentShader
    }), this.uniforms = a, this.fsQuad = new ue(this.materialBokeh), this._oldClearColor = new Z();
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
const ms = [14826299, 15764010, 15782953, 3980106, 2865328, 3832831, 9063124], gs = {
  normal: 0.34,
  fast: 0.16,
  turbo: 0.07
};
class bs {
  constructor(e) {
    v(this, "onLand", null);
    v(this, "renderer");
    v(this, "scene", new at());
    v(this, "camera");
    v(this, "sun");
    v(this, "glint");
    v(this, "board", new nt());
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
    this.fancy = !vs();
    const s = document.createElement("canvas");
    s.setAttribute("data-plinko-gl", "1"), this.renderer = new lt({
      canvas: s,
      antialias: this.fancy,
      alpha: !1,
      powerPreference: "high-performance",
      preserveDrawingBuffer: !0
    }), this.renderer.outputColorSpace = Q, this.renderer.setClearColor(13210965, 1), this.renderer.shadowMap.enabled = this.fancy, this.renderer.shadowMap.type = ct, s.style.width = "100%", s.style.height = "100%", s.style.display = "block", s.style.touchAction = "none", e.appendChild(s), this.camera = new ht(34, 1, 0.08, 80), this.scene.background = new Z(14131548), this.scene.add(this.board), this.scene.add(new ut(16774884, 9263664, 0.38)), this.sun = new Se(16774111, 0.72), this.sun.position.set(2.4, 14, -1.2), this.sun.castShadow = this.fancy, this.sun.shadow.mapSize.set(1024, 1024), this.sun.shadow.camera.near = 1, this.sun.shadow.camera.far = 28, this.sun.shadow.camera.left = -8, this.sun.shadow.camera.right = 8, this.sun.shadow.camera.top = 8, this.sun.shadow.camera.bottom = -8, this.sun.shadow.bias = -8e-4, this.scene.add(this.sun);
    const t = new Se(16769720, 0.38);
    t.position.set(-5, 7, 3), this.scene.add(t), this.glint = new dt(16777215, 6, 18), this.scene.add(this.glint), this.fancy && this.enableDepthOfField(), this.resize(e.clientWidth || 320, e.clientHeight || 420);
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
    const s = new P(this.ballGeometry ?? this.ensureBall(), this.marbleMaterial());
    s.castShadow = this.fancy, s.receiveShadow = !1;
    const t = new P(
      this.shadowGeometry(),
      new ke({
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
    const s = gs[this.speed];
    for (const t of this.marbles) {
      if (t.landed) {
        t.age += e;
        continue;
      }
      for (t.u += e / s; t.u >= 1 && t.step < t.shot.rows; )
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
    const e = new cs(this.renderer);
    e.addPass(new ds(this.scene, this.camera));
    const s = new ps(this.scene, this.camera, {
      focus: 12,
      aperture: 45e-6,
      maxblur: 4e-3
    });
    e.addPass(s), e.addPass(new us()), this.composer = e, this.bokeh = s;
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
    const n = this.woodMaterial(), l = new P(new Pe(e + 0.7, 0.2, i + 0.35, 2, 0.06), n);
    l.position.y = -0.1, l.receiveShadow = !0, l.castShadow = this.fancy, this.board.add(l), this.layoutOwned.push(l.geometry), this.addRail(n, e, i), this.addPosts(e, i), this.addPegs(), this.addBuckets(), this.built = !0, this.frameCamera();
    for (const a of this.marbles) this.placeMarble(a);
  }
  measure() {
    const s = 10.2 / (this.rows + 1), t = s * 0.9, o = this.rows * t / 2, i = this.rows * t + s * 1.05;
    return { span: 10.2, spacing: s, rowGap: t, topZ: o, depth: i };
  }
  addRail(e, s, t) {
    const n = new J(0.2, 0.26, t + 0.2), l = new J(s + 0.2, 0.26, 0.2);
    this.layoutOwned.push(n, l);
    const a = 0.26 / 2, h = s / 2 + 0.2 / 2, u = t / 2;
    for (const _ of [
      new P(n, e),
      new P(n, e),
      new P(l, e),
      new P(l, e)
    ])
      _.castShadow = this.fancy, _.receiveShadow = !0, this.board.add(_);
    const [b, c, p, d] = this.board.children.slice(-4);
    !b || !c || !p || !d || (b.position.set(-h, a, 0), c.position.set(h, a, 0), p.position.set(0, a, u), d.position.set(0, a, -u));
  }
  addPosts(e, s) {
    const t = new ft(0.07, 0.07, 0.85, 16), o = new H({
      map: ws(),
      roughness: 0.45,
      metalness: 0.02
    });
    this.layoutOwned.push(t, o, o.map);
    const i = e / 2 + 0.55, n = s / 2 - 0.15;
    for (const l of [-i, i])
      for (const a of [-n, n]) {
        const h = new P(t, o);
        h.position.set(l, 0.42, a), h.castShadow = this.fancy, h.receiveShadow = !0, this.board.add(h);
      }
  }
  addPegs() {
    const { rowGap: e, topZ: s } = this.frame, t = this.frame.spacing * Ue, o = new pt(t, t * 0.55, 5, 14);
    this.pegMeshes = [], this.layoutOwned.push(o);
    const i = ms.map(
      (l) => new H({
        color: l,
        roughness: 0.62,
        metalness: 0
      })
    );
    this.layoutOwned.push(...i);
    let n = 0;
    for (let l = 0; l < this.rows; l += 1) {
      const a = 3 + l, h = s - (l + 1) * e;
      for (let u = 0; u < a; u += 1) {
        const b = i[n % i.length];
        if (n += 1, !b) continue;
        const c = new P(o, b);
        c.position.set(this.pegX(l, u), t * 1.3, h);
        const p = this.pegMeshes[l] ?? [];
        p[u] = c, this.pegMeshes[l] = p, c.castShadow = this.fancy, c.receiveShadow = !0, this.board.add(c);
      }
    }
  }
  addBuckets() {
    const e = he(this.rows, this.risk), { spacing: s } = this.frame, t = this.zAt(this.rows) - s * 0.48, o = Math.max(0.72, s * 1.15), i = new Pe(s * 0.94, o, s * 0.82, 3, 0.1);
    this.layoutOwned.push(i);
    for (let n = 0; n < e.length; n += 1) {
      const l = It(n, e.length), a = ys(te(e[n] ?? 0), l), h = new H({
        color: ze(l),
        roughness: 0.62,
        metalness: 0
      }), u = new P(i, h), b = this.pegX(this.rows - 1, n), c = this.pegX(this.rows - 1, n + 1);
      u.position.set((b + c) / 2, o / 2, t), u.castShadow = this.fancy, u.receiveShadow = !0, this.board.add(u), this.bucketMeshes.push(u), this.layoutOwned.push(h, a);
      const p = new P(
        new mt(s * 0.9, s * 0.62),
        new ke({ map: a, side: gt, toneMapped: !1 })
      );
      p.rotation.x = -Math.PI / 2, p.position.set(u.position.x, o + 0.03, t), this.board.add(p), this.layoutOwned.push(p.geometry, p.material);
    }
  }
  placeMarble(e) {
    const s = Math.min(e.step, Math.max(0, e.shot.rows - 1)), t = e.landed || e.step >= e.shot.rows ? 1 : e.u, o = Wt(e.shot.rows, e.shot.path, s, t);
    o.hit && this.pegFlash.set(`${o.hit.row}:${o.hit.index}`, 0.22);
    const { spacing: i, topZ: n, rowGap: l } = this.frame, a = -this.frame.span / 2 + o.x * i, h = n - o.y * l, u = i * Be, b = o.hit ? u * 0.15 : u * 0.55 * Math.sin(Math.PI * t);
    e.mesh.position.set(a, u + b, h), e.mesh.rotation.z = -o.x * 0.8, e.mesh.rotation.x = o.y * 0.8;
    const c = u / 0.2;
    e.mesh.scale.set(c, c, c), e.shadow.position.set(a, 0.02, h), e.shadow.scale.set(c, c, 1);
    const p = e.shadow.material;
    Array.isArray(p) || (p.opacity = o.hit ? 0.45 : 0.28);
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
    const h = Math.max(0.35, this.width / Math.max(1, this.height)), u = 2 * Math.atan(Math.tan(a / 2) * h), c = (e / 2 + 0.22) / Math.tan(u / 2) / 0.9, p = new N(0, 0.15, n);
    this.camera.position.set(0, Math.sin(l) * c, n - Math.cos(l) * c), this.camera.lookAt(p), this.camera.updateProjectionMatrix(), this.glint.position.copy(this.camera.position).add(new N(-0.8, 0.4, 0.6));
    const d = this.bokeh?.uniforms;
    d?.focus && (d.focus.value = this.camera.position.distanceTo(p));
  }
  ensureBall() {
    return this.ballGeometry ? this.ballGeometry : (this.ballGeometry = new bt(0.33, 40, 28), this.owned.push(this.ballGeometry), this.ballGeometry);
  }
  marbleMaterial() {
    return this.fancy ? new vt({
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
    }) : new H({
      color: 16055295,
      roughness: 0.08,
      metalness: 0.15
    });
  }
  shadowGeometry() {
    const e = this.owned.find((t) => t instanceof K);
    if (e instanceof K) return e;
    const s = new K(0.3, 24);
    return this.owned.push(s), s;
  }
  woodMaterial() {
    const e = xs(), s = new H({ map: e, roughness: 0.78, metalness: 0.02 });
    return this.layoutOwned.push(s, e), s;
  }
}
function vs() {
  const r = navigator, e = r.hardwareConcurrency ?? 8, s = r.deviceMemory ?? 8;
  return e <= 4 || s <= 4;
}
function xs() {
  const r = document.createElement("canvas");
  r.width = 256, r.height = 256;
  const e = r.getContext("2d");
  if (!e) throw new Error("wood");
  e.fillStyle = "#c4894a", e.fillRect(0, 0, 256, 256);
  for (let t = 0; t < 256; t += 2) {
    const o = 70 + t * 13 % 70;
    e.strokeStyle = `rgba(${o + 40}, ${Math.max(20, o - 10)}, ${Math.max(8, o - 40)}, 0.35)`, e.lineWidth = 1 + t * 5 % 3, e.beginPath(), e.moveTo(0, t), e.bezierCurveTo(80, t + (t % 7 - 3), 160, t - (t % 5 - 2), 256, t + (t % 4 - 1)), e.stroke();
  }
  const s = new ne(r);
  return s.colorSpace = Q, s.wrapS = V, s.wrapT = V, s.repeat.set(2, 2), s;
}
function ws() {
  const r = document.createElement("canvas");
  r.width = 64, r.height = 128;
  const e = r.getContext("2d");
  if (!e) throw new Error("cane");
  for (let t = -4; t < 8; t += 1)
    e.fillStyle = t % 2 === 0 ? "#f4f7f8" : "#d7263d", e.beginPath(), e.moveTo(t * 16, 0), e.lineTo(t * 16 + 16, 0), e.lineTo(t * 16 + 48, 128), e.lineTo(t * 16 + 32, 128), e.closePath(), e.fill();
  const s = new ne(r);
  return s.colorSpace = Q, s.wrapS = V, s.wrapT = V, s;
}
function ze(r) {
  const e = r.match(/hsl\(([-\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)/), s = new Z();
  return e ? (s.setHSL(Number(e[1]) / 360, Number(e[2]) / 100, Number(e[3]) / 100), s) : s.set("#888888");
}
function ys(r, e) {
  const s = document.createElement("canvas");
  s.width = 512, s.height = 256;
  const t = s.getContext("2d");
  if (!t) throw new Error("label");
  const o = `#${ze(e).getHexString()}`;
  t.fillStyle = o, t.fillRect(0, 0, 512, 256), t.fillStyle = "#1a120c", t.font = "800 150px Outfit, sans-serif", t.textAlign = "center", t.textBaseline = "middle", t.fillText(r, 256, 136);
  const i = new ne(s);
  return i.colorSpace = Q, i.center.set(0.5, 0.5), i.rotation = Math.PI, i.needsUpdate = !0, i;
}
function _s() {
  return Kt({
    manifest: Tt,
    title: "木珠",
    gameAttr: "wgf-game:plinko-3d",
    extraClass: "plinko3d",
    createBoard: (r) => new bs(r)
  });
}
export {
  _s as createGame,
  Tt as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"three":"0.170.0","@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
