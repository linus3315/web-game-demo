var Pt = Object.defineProperty;
var At = (i, t, s) => t in i ? Pt(i, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[t] = s;
var v = (i, t, s) => At(i, typeof t != "symbol" ? t + "" : t, s);
import { BoxGeometry as J, Vector3 as E, Mesh as D, OrthographicCamera as Rt, BufferGeometry as Et, Float32BufferAttribute as ht, ShaderMaterial as tt, UniformsUtils as et, Vector2 as ut, WebGLRenderTarget as wt, HalfFloatType as xt, NoBlending as yt, Clock as Lt, RawShaderMaterial as Ut, ColorManagement as Nt, SRGBTransfer as Bt, LinearToneMapping as It, ReinhardToneMapping as Ot, CineonToneMapping as zt, ACESFilmicToneMapping as Gt, AgXToneMapping as Ft, NeutralToneMapping as Ht, Color as Q, NearestFilter as dt, MeshDepthMaterial as Wt, RGBADepthPacking as $t, Scene as qt, Group as Vt, WebGLRenderer as Qt, SRGBColorSpace as Z, PCFSoftShadowMap as Zt, PerspectiveCamera as jt, HemisphereLight as Kt, DirectionalLight as ft, PointLight as Xt, MeshBasicMaterial as pt, CylinderGeometry as Yt, MeshStandardMaterial as W, CapsuleGeometry as Jt, RepeatWrapping as V, PlaneGeometry as te, DoubleSide as ee, SphereGeometry as se, MeshPhysicalMaterial as oe, CircleGeometry as K, CanvasTexture as st } from "three";
import { registerStrings as re, defineGame as ie, bindVisualViewport as ae, patchGame as ne, t as le } from "@wgf/core";
import { TokenStore as ce, HttpClient as he } from "@wgf/net";
const ue = {
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
}, de = {
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
  art: ue,
  renderer: "three",
  controls: "pointer",
  tags: ["弹珠", "联网"],
  theme: { accent: "#f0a04b", accentInk: "#2a160c", glow: "#e23b3b", radius: 18, font: "sans" }
}, ot = 8, rt = 16, P = [10, 20, 50, 100], fe = ["low", "mid", "high"], Ct = [
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
function kt(i, t) {
  let s = 1;
  for (let e = 1; e <= t; e += 1) s = s * (i - t + e) / e;
  return s;
}
function X(i) {
  const t = i.length - 1, s = 2 ** t;
  let e = 0;
  for (let o = 0; o < i.length; o += 1)
    e += kt(t, o) / s * (i[o] ?? 0);
  return e;
}
function pe(i, t, s, e) {
  const o = i / 2;
  return Array.from({ length: i + 1 }, (r, a) => {
    const l = o === 0 ? 0 : Math.abs(a - o) / o;
    return s * (t / s) ** l ** e;
  });
}
function me(i) {
  return i >= 100 ? Math.max(1, Math.round(i)) : Math.max(0.1, Math.round(i * 10) / 10);
}
function ge(i) {
  const t = i.length - 1, s = i.slice();
  for (let e = 0; e <= t; e += 1) {
    const o = me(((s[e] ?? 0) + (s[t - e] ?? 0)) / 2);
    s[e] = o, s[t - e] = o;
  }
  return s;
}
function ve(i) {
  const t = i / 2, s = [];
  for (let e = 0; e <= i; e += 1) Math.abs(e - t) <= 0.5 && s.push(e);
  return s;
}
function be(i, t, s, e) {
  const o = pe(i, t, s, e), r = ge(o.map((c) => c * (0.99 / X(o)))), a = ve(i);
  let l = r, n = Math.abs(X(l) - 0.99);
  for (let c = -20; c <= 20; c += 1) {
    const u = r.slice(), f = r[a[0] ?? 0] ?? 0, d = Math.max(0.1, Math.round((f + c * 0.1) * 10) / 10);
    for (const h of a) u[h] = d;
    const C = Math.abs(X(u) - 0.99);
    C < n && (n = C, l = u);
  }
  return l;
}
function we() {
  const i = {
    low: [18, 1.05, 2.2],
    mid: [160, 0.45, 1.65],
    high: [700, 0.2, 1.25]
  }, t = { low: {}, mid: {}, high: {} };
  for (const s of fe) {
    const e = i[s];
    for (let o = ot; o <= rt; o += 1)
      t[s][o] = be(o, e[0], e[1], e[2]);
  }
  return t.high[16] = Ct, t;
}
const mt = we();
function St(i, t) {
  return mt[t][i] ?? mt.mid[16] ?? Ct;
}
function xe(i) {
  return Number.isInteger(i) && i >= ot && i <= rt;
}
function ye(i) {
  return i === "low" || i === "mid" || i === "high";
}
function Ce(i) {
  return P.includes(i);
}
function Mt(i) {
  return i >= 1e3 ? "1kx" : i >= 100 ? `${Math.round(i)}x` : `${i.toFixed(1)}x`;
}
function ke(i, t) {
  const s = (t - 1) / 2, e = s === 0 ? 0 : Math.abs(i - s) / s, o = 168 - e * 164, r = 52 + e * 26, a = 64 - e * 12;
  return `hsl(${o.toFixed(1)} ${r.toFixed(1)}% ${a.toFixed(1)}%)`;
}
const q = 1e3;
function N() {
  return { credits: q };
}
function Se(i, t) {
  const s = 2 ** i, e = t() * s;
  let o = 0;
  for (let r = 0; r <= i; r += 1)
    if (o += kt(i, r), e < o) return r;
  return i;
}
function Me(i, t, s, e, o) {
  if (!Ce(t)) return { error: "bad_bet" };
  if (!xe(s)) return { error: "bad_rows" };
  if (!ye(e)) return { error: "bad_risk" };
  if (i.credits < t) return { error: "insufficient" };
  const r = St(s, e), a = Se(s, o), l = r[a] ?? 0, n = Math.round(t * l);
  return i.credits -= t, i.credits += n, { rows: s, risk: e, bet: t, bucket: a, multiplier: l, win: n, credits: i.credits };
}
function _e(i, t, s) {
  const e = Math.max(0, Math.min(i, t)), o = [];
  for (let r = 0; r < e; r += 1) o.push("R");
  for (let r = 0; r < i - e; r += 1) o.push("L");
  for (let r = o.length - 1; r > 0; r -= 1) {
    const a = Math.floor(s() * (r + 1)), l = o[r];
    o[r] = o[a] ?? "L", o[a] = l ?? "L";
  }
  return o;
}
function Te() {
  re("plinko", {
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
const De = {}, Y = "wgf:slots-wallet", _t = "wgf:slots-token", Pe = "wgf:session";
function Ae(i) {
  Te();
  let t = null;
  const s = [];
  let e = null, o = null, r = N(), a = q, l = 20, n = 16, c = "high", u = "normal", f = !1, d = "pending", C = !1, h = "ready", x = -1, w = -1, b = 0;
  const _ = [], I = /* @__PURE__ */ new Set();
  let A = () => {
  };
  function O(m, p) {
    return le(t?.store.getState().ui.locale ?? "zh", m, p);
  }
  function M() {
    if (!e) return;
    const m = e.querySelector("[data-credits]"), p = e.querySelector("[data-amount]"), y = e.querySelector("[data-row-label]"), U = e.querySelector("[data-demo]"), R = e.querySelector("[data-source]");
    m && (m.textContent = String(a)), p && (p.textContent = String(l)), y && (y.textContent = String(n)), U && (U.hidden = d !== "local"), R && (R.textContent = O(d === "server" ? "plinko.server" : d === "local" ? "plinko.local" : "plinko.pending")), e.dataset.rows = String(n), e.dataset.risk = c, e.dataset.pace = u, e.dataset.pegs = String(n + 2), e.dataset.buckets = String(n + 1), x >= 0 && (e.dataset.bucket = String(x)), w >= 0 && (e.dataset.landed = String(w)), e.dataset.round = o && o.inflight > 0 ? "busy" : "open";
    const k = P.indexOf(l), S = e.querySelector("[data-bet-dec]"), z = e.querySelector("[data-bet-inc]");
    S && (S.disabled = k <= 0), z && (z.disabled = k >= P.length - 1), e.querySelectorAll("[data-bet]").forEach((g) => {
      g.classList.toggle("is-bet", Number(g.dataset.bet) === l);
    }), e.querySelectorAll("[data-speed]").forEach((g) => {
      g.classList.toggle("is-on", g.dataset.speed === u);
    }), e.querySelectorAll("[data-risk-pick]").forEach((g) => {
      g.classList.toggle("is-on", g.dataset.riskPick === c);
    });
    const G = e.querySelector("[data-drop]");
    G && (G.disabled = !C || h !== "running" || a < l);
    const F = e.querySelector("[data-auto]");
    F && F.setAttribute("aria-pressed", f ? "true" : "false");
    const H = e.querySelector("[data-history]");
    H && H.replaceChildren(
      ..._.slice(0, 8).map((g) => {
        const ct = document.createElement("span");
        return ct.textContent = Mt(g), ct;
      })
    ), o?.setLayout(n, c), o?.setSpeed(u);
  }
  function L() {
    t && ne(t.store, {
      id: i.manifest.id,
      status: h,
      score: Math.max(0, a - q),
      highScore: Math.max(0, a),
      message: "",
      detail: O(d === "server" ? "plinko.server" : "plinko.local"),
      credits: a
    });
  }
  function at() {
    d === "local" && localStorage.setItem(Y, JSON.stringify(r));
  }
  function nt() {
    try {
      const m = localStorage.getItem(Y);
      if (!m) return N();
      const p = JSON.parse(m);
      return !p || typeof p.credits != "number" ? N() : { credits: Math.max(0, Math.floor(p.credits)) };
    } catch {
      return N();
    }
  }
  async function lt() {
    if (!await Ne()) {
      d = "local", r = nt(), a = r.credits, C = !0, L(), M();
      return;
    }
    try {
      const p = await gt().post(
        "/api/plinko/session",
        {}
      );
      p.walletToken && localStorage.setItem(_t, p.walletToken), d = "server", r = { credits: p.credits }, a = p.credits;
    } catch {
      d = "local", r = nt(), a = r.credits;
    }
    C = !0, L(), M();
  }
  async function j() {
    if (!C || h !== "running" || a < l) return;
    const m = Ee();
    if (I.has(m)) return;
    const p = { bet: l, rows: n, risk: c };
    let y;
    if (d === "server")
      try {
        const k = await gt().post("/api/plinko/drop", {
          bet: p.bet,
          spinId: m,
          rows: p.rows,
          risk: p.risk
        });
        y = k, r = { credits: k.credits };
      } catch {
        return;
      }
    else {
      const k = Me(r, p.bet, p.rows, p.risk, Math.random);
      if ("error" in k) return;
      y = k, at();
    }
    I.add(m), a -= p.bet, x = y.bucket;
    const R = {
      path: _e(p.rows, y.bucket, Math.random),
      rows: p.rows,
      bet: p.bet,
      bucket: y.bucket,
      multiplier: y.multiplier,
      win: y.win
    };
    o?.launch(R), L(), M();
  }
  function Dt(m) {
    a += m.win, w = m.bucket, _.unshift(m.multiplier), _.length > 8 && (_.length = 8), a < P[0] && (!o || o.inflight === 0) && (f = !1, h = "over"), L(), M();
  }
  return ie(i.manifest, {
    async onPreload(m, p) {
      await m.preload([], p);
    },
    async onMount(m) {
      t = m, m.container.setAttribute("data-wgf-game", i.gameAttr), e = document.createElement("div"), e.className = i.extraClass ? `plinko ${i.extraClass}` : "plinko", e.innerHTML = Re(i.title);
      const p = e.querySelector("[data-board]");
      p instanceof HTMLElement && (o = i.createBoard(p), o.onLand = Dt, o.setLayout(n, c)), m.container.appendChild(e);
      const y = e;
      y.addEventListener("click", (k) => {
        const S = k.target;
        if (!(S instanceof Element)) return;
        if (S.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        const z = S.closest("[data-bet]"), G = z instanceof HTMLElement ? Number(z.dataset.bet) : Number.NaN;
        if (P.includes(G)) {
          l = G, y.classList.remove("is-bets"), M();
          return;
        }
        if (S.closest("[data-bet-dec]")) {
          const g = P[P.indexOf(l) - 1];
          g !== void 0 && (l = g), y.classList.remove("is-bets"), M();
          return;
        }
        if (S.closest("[data-bet-inc]")) {
          const g = P[P.indexOf(l) + 1];
          g !== void 0 && (l = g), y.classList.remove("is-bets"), M();
          return;
        }
        if (S.closest("[data-amount-bar]")) {
          y.classList.toggle("is-bets");
          return;
        }
        if (y.classList.contains("is-bets") && !S.closest("[data-bet-ui]") && y.classList.remove("is-bets"), S.closest("[data-row-dec]") && (!o || o.inflight === 0)) {
          n > ot && (n -= 1), M(), A();
          return;
        }
        if (S.closest("[data-row-inc]") && (!o || o.inflight === 0)) {
          n < rt && (n += 1), M(), A();
          return;
        }
        const F = S.closest("[data-risk-pick]");
        if (F instanceof HTMLElement && (!o || o.inflight === 0)) {
          const g = F.dataset.riskPick;
          (g === "low" || g === "mid" || g === "high") && (c = g), M();
          return;
        }
        const H = S.closest("[data-speed]");
        if (H instanceof HTMLElement) {
          const g = H.dataset.speed;
          (g === "normal" || g === "fast" || g === "turbo") && (u = g), M();
          return;
        }
        if (S.closest("[data-auto]")) {
          f = !f, b = 0, M(), f && j();
          return;
        }
        S.closest("[data-drop]") && j();
      }), A = () => {
        const k = e?.querySelector("[data-board]");
        !(k instanceof HTMLElement) || !o || o.resize(k.clientWidth, k.clientHeight);
      }, A();
      const U = new ResizeObserver(() => A()), R = e.querySelector("[data-board]");
      R && U.observe(R), s.push(() => U.disconnect()), s.push(ae(() => A())), s.push(
        m.loop.onUpdate((k) => {
          o?.update(k), f && h === "running" && (!o || o.inflight < 6) && (b -= k, b <= 0 && a >= l && (b = u === "turbo" ? 0.12 : u === "fast" ? 0.28 : 0.45, j()));
        })
      ), m.events.on("game:start", () => {
        h === "ready" && (h = "running", L(), M());
      }), m.events.on("game:restart", () => {
        r = d === "local" ? N() : r, d === "local" && (localStorage.removeItem(Y), r = N(), at()), a = d === "server" ? r.credits : q, d === "server" ? lt() : a = q, f = !1, _.length = 0, x = -1, w = -1, h = "running", L(), M();
      }), M(), lt();
    },
    onDestroy() {
      for (const m of s) m();
      s.length = 0, o?.destroy(), o = null, e?.remove(), e = null, t = null;
    }
  });
}
function Re(i) {
  const t = P.map(
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
function Ee() {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function gt() {
  const i = new ce(), t = Le(), s = Ue();
  if (t) i.set({ accessToken: t });
  else if (s?.accessToken && !s.accessToken.startsWith("local."))
    i.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const e = localStorage.getItem(_t);
    e?.startsWith("v1w.") && i.set({ accessToken: e });
  }
  return new he({ baseUrl: Tt(), tokens: i, timeoutMs: 2500 });
}
function Le() {
  try {
    const i = sessionStorage.getItem("wgf:launch-token");
    return i && i.length >= 8 ? i : null;
  } catch {
    return null;
  }
}
function Ue() {
  try {
    const i = localStorage.getItem(Pe);
    return i ? JSON.parse(i) : null;
  } catch {
    return null;
  }
}
function Tt() {
  return De?.VITE_API_BASE || "http://127.0.0.1:8787";
}
async function Ne() {
  try {
    return (await fetch(`${Tt()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
const $ = new E();
function T(i, t, s, e, o, r) {
  const a = 2 * Math.PI * o / 4, l = Math.max(r - 2 * o, 0), n = Math.PI / 4;
  $.copy(t), $[e] = 0, $.normalize();
  const c = 0.5 * a / (a + l), u = 1 - $.angleTo(i) / n;
  return Math.sign($[s]) === 1 ? u * c : l / (a + l) + c + c * (1 - u);
}
class vt extends J {
  constructor(t = 1, s = 1, e = 1, o = 2, r = 0.1) {
    if (o = o * 2 + 1, r = Math.min(t / 2, s / 2, e / 2, r), super(1, 1, 1, o, o, o), o === 1) return;
    const a = this.toNonIndexed();
    this.index = null, this.attributes.position = a.attributes.position, this.attributes.normal = a.attributes.normal, this.attributes.uv = a.attributes.uv;
    const l = new E(), n = new E(), c = new E(t, s, e).divideScalar(2).subScalar(r), u = this.attributes.position.array, f = this.attributes.normal.array, d = this.attributes.uv.array, C = u.length / 6, h = new E(), x = 0.5 / o;
    for (let w = 0, b = 0; w < u.length; w += 3, b += 2)
      switch (l.fromArray(u, w), n.copy(l), n.x -= Math.sign(n.x) * x, n.y -= Math.sign(n.y) * x, n.z -= Math.sign(n.z) * x, n.normalize(), u[w + 0] = c.x * Math.sign(l.x) + n.x * r, u[w + 1] = c.y * Math.sign(l.y) + n.y * r, u[w + 2] = c.z * Math.sign(l.z) + n.z * r, f[w + 0] = n.x, f[w + 1] = n.y, f[w + 2] = n.z, Math.floor(w / C)) {
        case 0:
          h.set(1, 0, 0), d[b + 0] = T(h, n, "z", "y", r, e), d[b + 1] = 1 - T(h, n, "y", "z", r, s);
          break;
        case 1:
          h.set(-1, 0, 0), d[b + 0] = 1 - T(h, n, "z", "y", r, e), d[b + 1] = 1 - T(h, n, "y", "z", r, s);
          break;
        case 2:
          h.set(0, 1, 0), d[b + 0] = 1 - T(h, n, "x", "z", r, t), d[b + 1] = T(h, n, "z", "x", r, e);
          break;
        case 3:
          h.set(0, -1, 0), d[b + 0] = 1 - T(h, n, "x", "z", r, t), d[b + 1] = 1 - T(h, n, "z", "x", r, e);
          break;
        case 4:
          h.set(0, 0, 1), d[b + 0] = 1 - T(h, n, "x", "y", r, t), d[b + 1] = 1 - T(h, n, "y", "x", r, s);
          break;
        case 5:
          h.set(0, 0, -1), d[b + 0] = T(h, n, "x", "y", r, t), d[b + 1] = 1 - T(h, n, "y", "x", r, s);
          break;
      }
  }
}
const Be = {
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
class B {
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
const Ie = new Rt(-1, 1, 1, -1, 0, 1);
class Oe extends Et {
  constructor() {
    super(), this.setAttribute("position", new ht([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), this.setAttribute("uv", new ht([0, 2, 0, 0, 2, 0], 2));
  }
}
const ze = new Oe();
class it {
  constructor(t) {
    this._mesh = new D(ze, t);
  }
  dispose() {
    this._mesh.geometry.dispose();
  }
  render(t) {
    t.render(this._mesh, Ie);
  }
  get material() {
    return this._mesh.material;
  }
  set material(t) {
    this._mesh.material = t;
  }
}
class Ge extends B {
  constructor(t, s) {
    super(), this.textureID = s !== void 0 ? s : "tDiffuse", t instanceof tt ? (this.uniforms = t.uniforms, this.material = t) : t && (this.uniforms = et.clone(t.uniforms), this.material = new tt({
      name: t.name !== void 0 ? t.name : "unspecified",
      defines: Object.assign({}, t.defines),
      uniforms: this.uniforms,
      vertexShader: t.vertexShader,
      fragmentShader: t.fragmentShader
    })), this.fsQuad = new it(this.material);
  }
  render(t, s, e) {
    this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = e.texture), this.fsQuad.material = this.material, this.renderToScreen ? (t.setRenderTarget(null), this.fsQuad.render(t)) : (t.setRenderTarget(s), this.clear && t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil), this.fsQuad.render(t));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class bt extends B {
  constructor(t, s) {
    super(), this.scene = t, this.camera = s, this.clear = !0, this.needsSwap = !1, this.inverse = !1;
  }
  render(t, s, e) {
    const o = t.getContext(), r = t.state;
    r.buffers.color.setMask(!1), r.buffers.depth.setMask(!1), r.buffers.color.setLocked(!0), r.buffers.depth.setLocked(!0);
    let a, l;
    this.inverse ? (a = 0, l = 1) : (a = 1, l = 0), r.buffers.stencil.setTest(!0), r.buffers.stencil.setOp(o.REPLACE, o.REPLACE, o.REPLACE), r.buffers.stencil.setFunc(o.ALWAYS, a, 4294967295), r.buffers.stencil.setClear(l), r.buffers.stencil.setLocked(!0), t.setRenderTarget(e), this.clear && t.clear(), t.render(this.scene, this.camera), t.setRenderTarget(s), this.clear && t.clear(), t.render(this.scene, this.camera), r.buffers.color.setLocked(!1), r.buffers.depth.setLocked(!1), r.buffers.color.setMask(!0), r.buffers.depth.setMask(!0), r.buffers.stencil.setLocked(!1), r.buffers.stencil.setFunc(o.EQUAL, 1, 4294967295), r.buffers.stencil.setOp(o.KEEP, o.KEEP, o.KEEP), r.buffers.stencil.setLocked(!0);
  }
}
class Fe extends B {
  constructor() {
    super(), this.needsSwap = !1;
  }
  render(t) {
    t.state.buffers.stencil.setLocked(!1), t.state.buffers.stencil.setTest(!1);
  }
}
class He {
  constructor(t, s) {
    if (this.renderer = t, this._pixelRatio = t.getPixelRatio(), s === void 0) {
      const e = t.getSize(new ut());
      this._width = e.width, this._height = e.height, s = new wt(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: xt }), s.texture.name = "EffectComposer.rt1";
    } else
      this._width = s.width, this._height = s.height;
    this.renderTarget1 = s, this.renderTarget2 = s.clone(), this.renderTarget2.texture.name = "EffectComposer.rt2", this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = !0, this.passes = [], this.copyPass = new Ge(Be), this.copyPass.material.blending = yt, this.clock = new Lt();
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
      const a = this.passes[o];
      if (a.enabled !== !1) {
        if (a.renderToScreen = this.renderToScreen && this.isLastEnabledPass(o), a.render(this.renderer, this.writeBuffer, this.readBuffer, t, e), a.needsSwap) {
          if (e) {
            const l = this.renderer.getContext(), n = this.renderer.state.buffers.stencil;
            n.setFunc(l.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, t), n.setFunc(l.EQUAL, 1, 4294967295);
          }
          this.swapBuffers();
        }
        bt !== void 0 && (a instanceof bt ? e = !0 : a instanceof Fe && (e = !1));
      }
    }
    this.renderer.setRenderTarget(s);
  }
  reset(t) {
    if (t === void 0) {
      const s = this.renderer.getSize(new ut());
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
const We = {
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
class $e extends B {
  constructor() {
    super();
    const t = We;
    this.uniforms = et.clone(t.uniforms), this.material = new Ut({
      name: t.name,
      uniforms: this.uniforms,
      vertexShader: t.vertexShader,
      fragmentShader: t.fragmentShader
    }), this.fsQuad = new it(this.material), this._outputColorSpace = null, this._toneMapping = null;
  }
  render(t, s, e) {
    this.uniforms.tDiffuse.value = e.texture, this.uniforms.toneMappingExposure.value = t.toneMappingExposure, (this._outputColorSpace !== t.outputColorSpace || this._toneMapping !== t.toneMapping) && (this._outputColorSpace = t.outputColorSpace, this._toneMapping = t.toneMapping, this.material.defines = {}, Nt.getTransfer(this._outputColorSpace) === Bt && (this.material.defines.SRGB_TRANSFER = ""), this._toneMapping === It ? this.material.defines.LINEAR_TONE_MAPPING = "" : this._toneMapping === Ot ? this.material.defines.REINHARD_TONE_MAPPING = "" : this._toneMapping === zt ? this.material.defines.CINEON_TONE_MAPPING = "" : this._toneMapping === Gt ? this.material.defines.ACES_FILMIC_TONE_MAPPING = "" : this._toneMapping === Ft ? this.material.defines.AGX_TONE_MAPPING = "" : this._toneMapping === Ht && (this.material.defines.NEUTRAL_TONE_MAPPING = ""), this.material.needsUpdate = !0), this.renderToScreen === !0 ? (t.setRenderTarget(null), this.fsQuad.render(t)) : (t.setRenderTarget(s), this.clear && t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil), this.fsQuad.render(t));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class qe extends B {
  constructor(t, s, e = null, o = null, r = null) {
    super(), this.scene = t, this.camera = s, this.overrideMaterial = e, this.clearColor = o, this.clearAlpha = r, this.clear = !0, this.clearDepth = !1, this.needsSwap = !1, this._oldClearColor = new Q();
  }
  render(t, s, e) {
    const o = t.autoClear;
    t.autoClear = !1;
    let r, a;
    this.overrideMaterial !== null && (a = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor !== null && (t.getClearColor(this._oldClearColor), t.setClearColor(this.clearColor, t.getClearAlpha())), this.clearAlpha !== null && (r = t.getClearAlpha(), t.setClearAlpha(this.clearAlpha)), this.clearDepth == !0 && t.clearDepth(), t.setRenderTarget(this.renderToScreen ? null : e), this.clear === !0 && t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil), t.render(this.scene, this.camera), this.clearColor !== null && t.setClearColor(this._oldClearColor), this.clearAlpha !== null && t.setClearAlpha(r), this.overrideMaterial !== null && (this.scene.overrideMaterial = a), t.autoClear = o;
  }
}
const Ve = {
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
class Qe extends B {
  constructor(t, s, e) {
    super(), this.scene = t, this.camera = s;
    const o = e.focus !== void 0 ? e.focus : 1, r = e.aperture !== void 0 ? e.aperture : 0.025, a = e.maxblur !== void 0 ? e.maxblur : 1;
    this.renderTargetDepth = new wt(1, 1, {
      // will be resized later
      minFilter: dt,
      magFilter: dt,
      type: xt
    }), this.renderTargetDepth.texture.name = "BokehPass.depth", this.materialDepth = new Wt(), this.materialDepth.depthPacking = $t, this.materialDepth.blending = yt;
    const l = Ve, n = et.clone(l.uniforms);
    n.tDepth.value = this.renderTargetDepth.texture, n.focus.value = o, n.aspect.value = s.aspect, n.aperture.value = r, n.maxblur.value = a, n.nearClip.value = s.near, n.farClip.value = s.far, this.materialBokeh = new tt({
      defines: Object.assign({}, l.defines),
      uniforms: n,
      vertexShader: l.vertexShader,
      fragmentShader: l.fragmentShader
    }), this.uniforms = n, this.fsQuad = new it(this.materialBokeh), this._oldClearColor = new Q();
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
const Ze = [14826299, 15764010, 15782953, 3980106, 2865328, 3832831, 9063124], je = {
  normal: 0.34,
  fast: 0.16,
  turbo: 0.07
};
class Ke {
  constructor(t) {
    v(this, "onLand", null);
    v(this, "renderer");
    v(this, "scene", new qt());
    v(this, "camera");
    v(this, "sun");
    v(this, "glint");
    v(this, "board", new Vt());
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
    v(this, "pulses", /* @__PURE__ */ new Map());
    v(this, "ballGeometry", null);
    v(this, "owned", []);
    v(this, "fpsTime", 0);
    v(this, "fpsFrames", 0);
    v(this, "width", 1);
    v(this, "height", 1);
    this.fancy = !Xe();
    const s = document.createElement("canvas");
    s.setAttribute("data-plinko-gl", "1"), this.renderer = new Qt({
      canvas: s,
      antialias: this.fancy,
      alpha: !1,
      powerPreference: "high-performance",
      preserveDrawingBuffer: !0
    }), this.renderer.outputColorSpace = Z, this.renderer.setClearColor(13210965, 1), this.renderer.shadowMap.enabled = this.fancy, this.renderer.shadowMap.type = Zt, s.style.width = "100%", s.style.height = "100%", s.style.display = "block", s.style.touchAction = "none", t.appendChild(s), this.camera = new jt(34, 1, 0.08, 80), this.scene.background = new Q(14131548), this.scene.add(this.board), this.scene.add(new Kt(16774884, 9263664, 0.62)), this.sun = new ft(16774111, 1.25), this.sun.position.set(2.4, 14, -1.2), this.sun.castShadow = this.fancy, this.sun.shadow.mapSize.set(1024, 1024), this.sun.shadow.camera.near = 1, this.sun.shadow.camera.far = 28, this.sun.shadow.camera.left = -8, this.sun.shadow.camera.right = 8, this.sun.shadow.camera.top = 8, this.sun.shadow.camera.bottom = -8, this.sun.shadow.bias = -8e-4, this.scene.add(this.sun);
    const e = new ft(16769720, 0.38);
    e.position.set(-5, 7, 3), this.scene.add(e), this.glint = new Xt(16777215, 6, 18), this.scene.add(this.glint), this.fancy && this.enableDepthOfField(), this.resize(t.clientWidth || 320, t.clientHeight || 420);
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
    const s = new D(this.ballGeometry ?? this.ensureBall(), this.marbleMaterial());
    s.castShadow = this.fancy, s.receiveShadow = !1;
    const e = new D(
      this.shadowGeometry(),
      new pt({
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
    const s = je[this.speed];
    for (const e of this.marbles) {
      if (e.landed) {
        e.age += t;
        continue;
      }
      for (e.u += t / s; e.u >= 1 && e.step < e.shot.rows; )
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
      const r = o - t, a = this.bucketMeshes[e];
      if (a) {
        const l = r > 0 ? 1 + r / 0.45 * 0.12 : 1;
        a.scale.set(l, l, 1);
      }
      r <= 0 ? this.pulses.delete(e) : this.pulses.set(e, r);
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
    const t = new He(this.renderer);
    t.addPass(new qe(this.scene, this.camera));
    const s = new Qe(this.scene, this.camera, {
      focus: 12,
      aperture: 45e-6,
      maxblur: 4e-3
    });
    t.addPass(s), t.addPass(new $e()), this.composer = t, this.bokeh = s;
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
    this.layoutOwned.length = 0, this.bucketMeshes = [];
  }
  rebuild() {
    this.disposeLayout();
    const { span: t, spacing: s, rowGap: e, topZ: o, depth: r } = this.measure();
    this.frame = { span: t, spacing: s, rowGap: e, topZ: o, depth: r };
    const a = this.woodMaterial(), l = new D(new vt(t + 1.15, 0.2, r + 0.7, 2, 0.06), a);
    l.position.y = -0.1, l.receiveShadow = !0, l.castShadow = this.fancy, this.board.add(l), this.layoutOwned.push(l.geometry), this.addRail(a, t, r), this.addPosts(t, r), this.addPegs(), this.addBuckets(), this.built = !0, this.frameCamera();
    for (const n of this.marbles) this.placeMarble(n);
  }
  measure() {
    const s = 10.2 / (this.rows + 1), e = s * 0.92, o = this.rows * e / 2, r = this.rows * e + s * 1.35;
    return { span: 10.2, spacing: s, rowGap: e, topZ: o, depth: r };
  }
  addRail(t, s, e) {
    const a = new J(0.2, 0.26, e + 0.2), l = new J(s + 0.2, 0.26, 0.2);
    this.layoutOwned.push(a, l);
    const n = 0.26 / 2, c = s / 2 + 0.2 / 2, u = e / 2;
    for (const x of [
      new D(a, t),
      new D(a, t),
      new D(l, t),
      new D(l, t)
    ])
      x.castShadow = this.fancy, x.receiveShadow = !0, this.board.add(x);
    const [f, d, C, h] = this.board.children.slice(-4);
    !f || !d || !C || !h || (f.position.set(-c, n, 0), d.position.set(c, n, 0), C.position.set(0, n, u), h.position.set(0, n, -u));
  }
  addPosts(t, s) {
    const e = new Yt(0.07, 0.07, 0.85, 16), o = new W({
      map: Je(),
      roughness: 0.45,
      metalness: 0.02
    });
    this.layoutOwned.push(e, o, o.map);
    const r = t / 2 + 0.55, a = s / 2 - 0.15;
    for (const l of [-r, r])
      for (const n of [-a, a]) {
        const c = new D(e, o);
        c.position.set(l, 0.42, n), c.castShadow = this.fancy, c.receiveShadow = !0, this.board.add(c);
      }
  }
  addPegs() {
    const { rowGap: t, topZ: s } = this.frame, e = new Jt(0.085, 0.04, 4, 12);
    this.layoutOwned.push(e);
    const o = Ze.map(
      (a) => new W({
        color: a,
        roughness: 0.62,
        metalness: 0
      })
    );
    this.layoutOwned.push(...o);
    let r = 0;
    for (let a = 0; a < this.rows; a += 1) {
      const l = 3 + a, n = s - (a + 1) * t;
      for (let c = 0; c < l; c += 1) {
        const u = o[r % o.length];
        if (r += 1, !u) continue;
        const f = new D(e, u);
        f.position.set(this.pegX(a, c), 0.105, n), f.castShadow = this.fancy, f.receiveShadow = !0, this.board.add(f);
      }
    }
  }
  addBuckets() {
    const t = St(this.rows, this.risk), s = this.zAt(this.rows) - this.frame.spacing * 0.42, e = new vt(
      this.frame.spacing * 0.9,
      0.42,
      this.frame.spacing * 0.72,
      2,
      0.08
    );
    this.layoutOwned.push(e);
    for (let o = 0; o < t.length; o += 1) {
      const r = ke(o, t.length), a = new W({
        color: new Q(r),
        roughness: 0.48,
        metalness: 0.02
      }), l = new D(e, a), n = this.pegX(this.rows - 1, o), c = this.pegX(this.rows - 1, o + 1);
      l.position.set((n + c) / 2, 0.21, s), l.castShadow = this.fancy, l.receiveShadow = !0, this.board.add(l), this.bucketMeshes.push(l), this.layoutOwned.push(a);
      const u = ts(Mt(t[o] ?? 0), r);
      u.wrapS = V, u.repeat.x = -1, u.offset.x = 1;
      const f = new D(
        new te(this.frame.spacing * 0.86, this.frame.spacing * 0.5),
        new pt({ map: u, side: ee })
      );
      f.rotation.x = -Math.PI / 2, f.position.set(l.position.x, 0.43, s), this.board.add(f), this.layoutOwned.push(f.geometry, f.material, u);
    }
  }
  placeMarble(t) {
    const s = t.shot.path.slice(0, t.step).filter((A) => A === "R").length, e = t.landed ? t.shot.bucket : s + (t.shot.path[t.step] === "R" ? 1 : 0), o = t.landed ? 1 : Math.max(0, Math.min(1, t.u)), r = t.step, a = Math.min(this.rows, t.step + (t.landed ? 0 : 1)), l = this.xAt(r, s), n = this.xAt(a, t.landed ? t.shot.bucket : e), c = this.zAt(r), u = this.zAt(a), f = t.landed ? 0 : Math.sin(t.step * 7.2 + o * 4) * 0.05 * (1 - o), d = Math.sin(Math.PI * o) * this.frame.rowGap * 0.62, C = !t.landed && o < 0.18 ? (1 - o / 0.18) * 0.05 : 0, h = l + (n - l) * o + f, x = c + (u - c) * o, w = d + C;
    t.mesh.position.set(h, 0.22 + w, x), t.mesh.rotation.z = -h * 3.2, t.mesh.rotation.x = x * 3.2;
    const b = C > 0 ? 0.9 : 1;
    t.mesh.scale.set(1, b, 1), t.shadow.position.set(h, 0.02, x);
    const _ = 1 + w * 1.4;
    t.shadow.scale.set(_, _, 1);
    const I = t.shadow.material;
    Array.isArray(I) || (I.opacity = 0.34 / (1 + w * 3));
  }
  pegX(t, s) {
    const e = 3 + t, o = (this.rows + 2 - e) / 2 * this.frame.spacing;
    return -this.frame.span / 2 + o + s * this.frame.spacing;
  }
  xAt(t, s) {
    const e = -this.frame.span / 2 + (s + 0.5) * this.frame.spacing;
    return this.rows === 0 ? 0 : e * (t / this.rows);
  }
  zAt(t) {
    return this.frame.topZ - t * this.frame.rowGap;
  }
  frameCamera() {
    const { span: t, topZ: s, rowGap: e } = this.frame, o = this.zAt(this.rows) - this.frame.spacing * 0.95, r = s + e * 0.45, a = (o + r) / 2, l = 62 * Math.PI / 180, n = 34 * Math.PI / 180;
    this.camera.fov = 34;
    const c = Math.max(0.35, this.width / Math.max(1, this.height)), u = 2 * Math.atan(Math.tan(n / 2) * c), f = t / 2 + 0.85, C = (r - o) * Math.sin(l) + 0.9, h = f / Math.tan(u / 2) / 0.9, x = C / 2 / Math.tan(n / 2) / 0.9, w = Math.max(h, x), b = new E(0, 0, a);
    this.camera.position.set(0, Math.sin(l) * w, a - Math.cos(l) * w), this.camera.lookAt(b), this.camera.updateProjectionMatrix(), this.glint.position.copy(this.camera.position).add(new E(-0.8, 0.4, 0.6));
    const _ = this.bokeh?.uniforms;
    _?.focus && (_.focus.value = this.camera.position.distanceTo(b));
  }
  ensureBall() {
    return this.ballGeometry ? this.ballGeometry : (this.ballGeometry = new se(0.22, 40, 28), this.owned.push(this.ballGeometry), this.ballGeometry);
  }
  marbleMaterial() {
    return this.fancy ? new oe({
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
    const t = this.owned.find((e) => e instanceof K);
    if (t instanceof K) return t;
    const s = new K(0.2, 20);
    return this.owned.push(s), s;
  }
  woodMaterial() {
    const t = Ye(), s = new W({ map: t, roughness: 0.78, metalness: 0.02 });
    return this.layoutOwned.push(s, t), s;
  }
}
function Xe() {
  const i = navigator, t = i.hardwareConcurrency ?? 8, s = i.deviceMemory ?? 8;
  return t <= 4 || s <= 4;
}
function Ye() {
  const i = document.createElement("canvas");
  i.width = 256, i.height = 256;
  const t = i.getContext("2d");
  if (!t) throw new Error("wood");
  t.fillStyle = "#c4894a", t.fillRect(0, 0, 256, 256);
  for (let e = 0; e < 256; e += 2) {
    const o = 70 + e * 13 % 70;
    t.strokeStyle = `rgba(${o + 40}, ${Math.max(20, o - 10)}, ${Math.max(8, o - 40)}, 0.35)`, t.lineWidth = 1 + e * 5 % 3, t.beginPath(), t.moveTo(0, e), t.bezierCurveTo(80, e + (e % 7 - 3), 160, e - (e % 5 - 2), 256, e + (e % 4 - 1)), t.stroke();
  }
  const s = new st(i);
  return s.colorSpace = Z, s.wrapS = V, s.wrapT = V, s.repeat.set(2, 2), s;
}
function Je() {
  const i = document.createElement("canvas");
  i.width = 64, i.height = 128;
  const t = i.getContext("2d");
  if (!t) throw new Error("cane");
  for (let e = -4; e < 8; e += 1)
    t.fillStyle = e % 2 === 0 ? "#f4f7f8" : "#d7263d", t.beginPath(), t.moveTo(e * 16, 0), t.lineTo(e * 16 + 16, 0), t.lineTo(e * 16 + 48, 128), t.lineTo(e * 16 + 32, 128), t.closePath(), t.fill();
  const s = new st(i);
  return s.colorSpace = Z, s.wrapS = V, s.wrapT = V, s;
}
function ts(i, t) {
  const s = document.createElement("canvas");
  s.width = 256, s.height = 128;
  const e = s.getContext("2d");
  if (!e) throw new Error("label");
  e.fillStyle = t, e.fillRect(0, 0, 256, 128), e.fillStyle = "#1a120c", e.font = "800 78px Outfit, sans-serif", e.textAlign = "center", e.textBaseline = "middle", e.fillText(i, 128, 66);
  const o = new st(s);
  return o.colorSpace = Z, o;
}
function is() {
  return Ae({
    manifest: de,
    title: "木珠",
    gameAttr: "wgf-game:plinko-3d",
    extraClass: "plinko3d",
    createBoard: (i) => new Ke(i)
  });
}
export {
  is as createGame,
  de as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"three":"0.170.0","@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
