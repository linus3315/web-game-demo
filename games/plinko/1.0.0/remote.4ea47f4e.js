var ot = Object.defineProperty;
var at = (s, e, o) => e in s ? ot(s, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : s[e] = o;
var x = (s, e, o) => at(s, typeof e != "symbol" ? e + "" : e, o);
import { registerStrings as it, defineGame as rt, bindVisualViewport as ct, patchGame as lt, t as dt } from "@wgf/core";
import { TokenStore as ut, HttpClient as ht } from "@wgf/net";
const ft = {
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
}, pt = {
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
  art: ft,
  renderer: "dom",
  controls: "pointer",
  tags: ["弹珠", "联网"],
  theme: { accent: "#7ddec8", accentInk: "#10211e", glow: "#e23b3b", radius: 16, font: "sans" }
}, j = 8, z = 16, E = [10, 20, 50, 100], bt = ["low", "mid", "high"], U = [
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
function Q(s, e) {
  let o = 1;
  for (let t = 1; t <= e; t += 1) o = o * (s - e + t) / t;
  return o;
}
function G(s) {
  const e = s.length - 1, o = 2 ** e;
  let t = 0;
  for (let n = 0; n < s.length; n += 1)
    t += Q(e, n) / o * (s[n] ?? 0);
  return t;
}
function gt(s, e, o, t) {
  const n = s / 2;
  return Array.from({ length: s + 1 }, (a, i) => {
    const d = n === 0 ? 0 : Math.abs(i - n) / n;
    return o * (e / o) ** d ** t;
  });
}
function mt(s) {
  return s >= 100 ? Math.max(1, Math.round(s)) : Math.max(0.1, Math.round(s * 10) / 10);
}
function kt(s) {
  const e = s.length - 1, o = s.slice();
  for (let t = 0; t <= e; t += 1) {
    const n = mt(((o[t] ?? 0) + (o[e - t] ?? 0)) / 2);
    o[t] = n, o[e - t] = n;
  }
  return o;
}
function wt(s) {
  const e = s / 2, o = [];
  for (let t = 0; t <= s; t += 1) Math.abs(t - e) <= 0.5 && o.push(t);
  return o;
}
function yt(s, e, o, t) {
  const n = gt(s, e, o, t), a = kt(n.map((v) => v * (0.99 / G(n)))), i = wt(s);
  let d = a, f = Math.abs(G(d) - 0.99);
  for (let v = -20; v <= 20; v += 1) {
    const r = a.slice(), m = a[i[0] ?? 0] ?? 0, h = Math.max(0.1, Math.round((m + v * 0.1) * 10) / 10);
    for (const b of i) r[b] = h;
    const p = Math.abs(G(r) - 0.99);
    p < f && (f = p, d = r);
  }
  return d;
}
function vt() {
  const s = {
    low: [18, 1.05, 2.2],
    mid: [160, 0.45, 1.65],
    high: [700, 0.2, 1.25]
  }, e = { low: {}, mid: {}, high: {} };
  for (const o of bt) {
    const t = s[o];
    for (let n = j; n <= z; n += 1)
      e[o][n] = yt(n, t[0], t[1], t[2]);
  }
  return e.high[16] = U, e;
}
const V = vt();
function Z(s, e) {
  return V[e][s] ?? V.mid[16] ?? U;
}
function St(s) {
  return Number.isInteger(s) && s >= j && s <= z;
}
function xt(s) {
  return s === "low" || s === "mid" || s === "high";
}
function Mt(s) {
  return E.includes(s);
}
function tt(s) {
  return s >= 1e3 ? "1kx" : s >= 100 ? `${Math.round(s)}x` : `${s.toFixed(1)}x`;
}
function Tt(s, e) {
  const o = (e - 1) / 2, t = o === 0 ? 0 : Math.abs(s - o) / o, n = 168 - t * 164, a = 52 + t * 26, i = 64 - t * 12;
  return `hsl(${n.toFixed(1)} ${a.toFixed(1)}% ${i.toFixed(1)}%)`;
}
const H = 1e3;
function P() {
  return { credits: H };
}
function Lt(s, e) {
  const o = 2 ** s, t = e() * o;
  let n = 0;
  for (let a = 0; a <= s; a += 1)
    if (n += Q(s, a), t < n) return a;
  return s;
}
function Et(s, e, o, t, n) {
  if (!Mt(e)) return { error: "bad_bet" };
  if (!St(o)) return { error: "bad_rows" };
  if (!xt(t)) return { error: "bad_risk" };
  if (s.credits < e) return { error: "insufficient" };
  const a = Z(o, t), i = Lt(o, n), d = a[i] ?? 0, f = Math.round(e * d);
  return s.credits -= e, s.credits += f, { rows: o, risk: t, bet: e, bucket: i, multiplier: d, win: f, credits: s.credits };
}
function It(s, e, o) {
  const t = Math.max(0, Math.min(s, e)), n = [];
  for (let a = 0; a < t; a += 1) n.push("R");
  for (let a = 0; a < s - t; a += 1) n.push("L");
  for (let a = n.length - 1; a > 0; a -= 1) {
    const i = Math.floor(o() * (a + 1)), d = n[a];
    n[a] = n[i] ?? "L", n[i] = d ?? "L";
  }
  return n;
}
function Rt() {
  it("plinko", {
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
const At = {}, F = "wgf:slots-wallet", et = "wgf:slots-token", _t = "wgf:session";
function $t(s) {
  Rt();
  let e = null;
  const o = [];
  let t = null, n = null, a = P(), i = H, d = 20, f = 16, v = "high", r = "normal", m = !1, h = "pending", p = !1, b = "ready", S = -1, L = -1, M = 0;
  const T = [], O = /* @__PURE__ */ new Set();
  let I = () => {
  };
  function A(l, c) {
    return dt(e?.store.getState().ui.locale ?? "zh", l, c);
  }
  function k() {
    if (!t) return;
    const l = t.querySelector("[data-credits]"), c = t.querySelector("[data-amount]"), g = t.querySelector("[data-row-label]"), $ = t.querySelector("[data-demo]"), _ = t.querySelector("[data-source]");
    l && (l.textContent = String(i)), c && (c.textContent = String(d)), g && (g.textContent = String(f)), $ && ($.hidden = h !== "local"), _ && (_.textContent = A(h === "server" ? "plinko.server" : h === "local" ? "plinko.local" : "plinko.pending")), t.dataset.rows = String(f), t.dataset.risk = v, t.dataset.pace = r, t.dataset.pegs = String(f + 2), t.dataset.buckets = String(f + 1), S >= 0 && (t.dataset.bucket = String(S)), L >= 0 && (t.dataset.landed = String(L)), t.dataset.round = n && n.inflight > 0 ? "busy" : "open";
    const w = E.indexOf(d), y = t.querySelector("[data-bet-dec]"), N = t.querySelector("[data-bet-inc]");
    y && (y.disabled = w <= 0), N && (N.disabled = w >= E.length - 1), t.querySelectorAll("[data-bet]").forEach((u) => {
      u.classList.toggle("is-bet", Number(u.dataset.bet) === d);
    }), t.querySelectorAll("[data-speed]").forEach((u) => {
      u.classList.toggle("is-on", u.dataset.speed === r);
    }), t.querySelectorAll("[data-risk-pick]").forEach((u) => {
      u.classList.toggle("is-on", u.dataset.riskPick === v);
    });
    const q = t.querySelector("[data-drop]");
    q && (q.disabled = !p || b !== "running" || i < d);
    const B = t.querySelector("[data-auto]");
    B && B.setAttribute("aria-pressed", m ? "true" : "false");
    const C = t.querySelector("[data-history]");
    C && C.replaceChildren(
      ...T.slice(0, 8).map((u) => {
        const J = document.createElement("span");
        return J.textContent = tt(u), J;
      })
    ), n?.setLayout(f, v), n?.setSpeed(r);
  }
  function R() {
    e && lt(e.store, {
      id: s.manifest.id,
      status: b,
      score: Math.max(0, i - H),
      highScore: Math.max(0, i),
      message: "",
      detail: A(h === "server" ? "plinko.server" : "plinko.local"),
      credits: i
    });
  }
  function W() {
    h === "local" && localStorage.setItem(F, JSON.stringify(a));
  }
  function K() {
    try {
      const l = localStorage.getItem(F);
      if (!l) return P();
      const c = JSON.parse(l);
      return !c || typeof c.credits != "number" ? P() : { credits: Math.max(0, Math.floor(c.credits)) };
    } catch {
      return P();
    }
  }
  async function X() {
    if (!await Ct()) {
      h = "local", a = K(), i = a.credits, p = !0, R(), k();
      return;
    }
    try {
      const c = await Y().post(
        "/api/plinko/session",
        {}
      );
      c.walletToken && localStorage.setItem(et, c.walletToken), h = "server", a = { credits: c.credits }, i = c.credits;
    } catch {
      h = "local", a = K(), i = a.credits;
    }
    p = !0, R(), k();
  }
  async function D() {
    if (!p || b !== "running" || i < d) return;
    const l = Nt();
    if (O.has(l)) return;
    const c = { bet: d, rows: f, risk: v };
    let g;
    if (h === "server")
      try {
        const w = await Y().post("/api/plinko/drop", {
          bet: c.bet,
          spinId: l,
          rows: c.rows,
          risk: c.risk
        });
        g = w, a = { credits: w.credits };
      } catch {
        return;
      }
    else {
      const w = Et(a, c.bet, c.rows, c.risk, Math.random);
      if ("error" in w) return;
      g = w, W();
    }
    O.add(l), i -= c.bet, S = g.bucket;
    const _ = {
      path: It(c.rows, g.bucket, Math.random),
      rows: c.rows,
      bet: c.bet,
      bucket: g.bucket,
      multiplier: g.multiplier,
      win: g.win
    };
    n?.launch(_), R(), k();
  }
  function nt(l) {
    i += l.win, L = l.bucket, T.unshift(l.multiplier), T.length > 8 && (T.length = 8), i < E[0] && (!n || n.inflight === 0) && (m = !1, b = "over"), R(), k();
  }
  return rt(s.manifest, {
    async onPreload(l, c) {
      await l.preload([], c);
    },
    async onMount(l) {
      e = l, l.container.setAttribute("data-wgf-game", s.gameAttr), t = document.createElement("div"), t.className = s.extraClass ? `plinko ${s.extraClass}` : "plinko", t.innerHTML = Pt(s.title);
      const c = t.querySelector("[data-board]");
      c instanceof HTMLElement && (n = s.createBoard(c), n.onLand = nt, n.setLayout(f, v)), l.container.appendChild(t);
      const g = t;
      g.addEventListener("click", (w) => {
        const y = w.target;
        if (!(y instanceof Element)) return;
        if (y.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        const N = y.closest("[data-bet]"), q = N instanceof HTMLElement ? Number(N.dataset.bet) : Number.NaN;
        if (E.includes(q)) {
          d = q, g.classList.remove("is-bets"), k();
          return;
        }
        if (y.closest("[data-bet-dec]")) {
          const u = E[E.indexOf(d) - 1];
          u !== void 0 && (d = u), g.classList.remove("is-bets"), k();
          return;
        }
        if (y.closest("[data-bet-inc]")) {
          const u = E[E.indexOf(d) + 1];
          u !== void 0 && (d = u), g.classList.remove("is-bets"), k();
          return;
        }
        if (y.closest("[data-amount-bar]")) {
          g.classList.toggle("is-bets");
          return;
        }
        if (g.classList.contains("is-bets") && !y.closest("[data-bet-ui]") && g.classList.remove("is-bets"), y.closest("[data-row-dec]") && (!n || n.inflight === 0)) {
          f > j && (f -= 1), k(), I();
          return;
        }
        if (y.closest("[data-row-inc]") && (!n || n.inflight === 0)) {
          f < z && (f += 1), k(), I();
          return;
        }
        const B = y.closest("[data-risk-pick]");
        if (B instanceof HTMLElement && (!n || n.inflight === 0)) {
          const u = B.dataset.riskPick;
          (u === "low" || u === "mid" || u === "high") && (v = u), k();
          return;
        }
        const C = y.closest("[data-speed]");
        if (C instanceof HTMLElement) {
          const u = C.dataset.speed;
          (u === "normal" || u === "fast" || u === "turbo") && (r = u), k();
          return;
        }
        if (y.closest("[data-auto]")) {
          m = !m, M = 0, k(), m && D();
          return;
        }
        y.closest("[data-drop]") && D();
      }), I = () => {
        const w = t?.querySelector("[data-board]");
        !(w instanceof HTMLElement) || !n || n.resize(w.clientWidth, w.clientHeight);
      }, I();
      const $ = new ResizeObserver(() => I()), _ = t.querySelector("[data-board]");
      _ && $.observe(_), o.push(() => $.disconnect()), o.push(ct(() => I())), o.push(
        l.loop.onUpdate((w) => {
          n?.update(w), m && b === "running" && (!n || n.inflight < 6) && (M -= w, M <= 0 && i >= d && (M = r === "turbo" ? 0.12 : r === "fast" ? 0.28 : 0.45, D()));
        })
      ), l.events.on("game:start", () => {
        b === "ready" && (b = "running", R(), k());
      }), l.events.on("game:restart", () => {
        a = h === "local" ? P() : a, h === "local" && (localStorage.removeItem(F), a = P(), W()), i = h === "server" ? a.credits : H, h === "server" ? X() : i = H, m = !1, T.length = 0, S = -1, L = -1, b = "running", R(), k();
      }), k(), X();
    },
    onDestroy() {
      for (const l of o) l();
      o.length = 0, n?.destroy(), n = null, t?.remove(), t = null, e = null;
    }
  });
}
function Pt(s) {
  const e = E.map(
    (n) => `<button type="button" data-bet="${n}">${n}</button>`
  ).join(""), o = ["normal", "fast", "turbo"].map(
    (n) => `<button type="button" data-speed="${n}">${n === "normal" ? "普通" : n === "fast" ? "快速" : "极速"}</button>`
  ).join(""), t = ["low", "mid", "high"].map(
    (n) => `<button type="button" data-risk-pick="${n}">${n === "low" ? "低" : n === "mid" ? "中" : "高"}</button>`
  ).join("");
  return `
    <header class="plinko-top">
      <button type="button" class="plinko-menu" data-lobby-menu aria-label="菜单"></button>
      <div class="plinko-brand">
        <strong>${s}</strong>
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
    </div>
    <div class="plinko-stage">
      <div class="plinko-speed">${o}</div>
      <div class="plinko-board" data-board></div>
    </div>
    <div class="plinko-dock">
      <button type="button" class="plinko-drop" data-drop disabled>投放</button>
      <button type="button" class="plinko-auto" data-auto aria-label="自动"></button>
    </div>
  `;
}
function Nt() {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function Y() {
  const s = new ut(), e = qt(), o = Bt();
  if (e) s.set({ accessToken: e });
  else if (o?.accessToken && !o.accessToken.startsWith("local."))
    s.set({ accessToken: o.accessToken, refreshToken: o.refreshToken });
  else {
    const t = localStorage.getItem(et);
    t?.startsWith("v1w.") && s.set({ accessToken: t });
  }
  return new ht({ baseUrl: st(), tokens: s, timeoutMs: 2500 });
}
function qt() {
  try {
    const s = sessionStorage.getItem("wgf:launch-token");
    return s && s.length >= 8 ? s : null;
  } catch {
    return null;
  }
}
function Bt() {
  try {
    const s = localStorage.getItem(_t);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}
function st() {
  return At?.VITE_API_BASE || "http://127.0.0.1:8787";
}
async function Ct() {
  try {
    return (await fetch(`${st()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
const Ht = {
  normal: 0.34,
  fast: 0.16,
  turbo: 0.07
};
class Ot {
  constructor(e) {
    x(this, "canvas");
    x(this, "ctx");
    x(this, "rows", 16);
    x(this, "risk", "high");
    x(this, "speed", "normal");
    x(this, "width", 1);
    x(this, "height", 1);
    x(this, "balls", []);
    x(this, "pulses", /* @__PURE__ */ new Map());
    x(this, "nextId", 1);
    x(this, "onLand", null);
    const o = document.createElement("canvas");
    o.className = "plinko-canvas";
    const t = o.getContext("2d");
    if (!t) throw new Error("canvas");
    this.canvas = o, this.ctx = t, e.appendChild(o);
  }
  setLayout(e, o) {
    this.rows = e, this.risk = o;
  }
  setSpeed(e) {
    this.speed = e;
  }
  resize(e, o) {
    this.width = Math.max(1, e), this.height = Math.max(1, o);
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
    const o = Ht[this.speed];
    for (const t of this.balls) {
      if (t.landed) {
        t.age += e;
        continue;
      }
      for (t.u += e / o; t.u >= 1 && t.step < t.rows; )
        t.u -= 1, t.step += 1;
      t.step >= t.rows && (t.landed = !0, t.u = 1, t.age = 0, this.pulses.set(t.bucket, 0.45), this.onLand?.(t));
    }
    this.balls = this.balls.filter((t) => !t.landed || t.age < 0.45);
    for (const [t, n] of this.pulses) {
      const a = n - e;
      a <= 0 ? this.pulses.delete(t) : this.pulses.set(t, a);
    }
    this.draw();
  }
  destroy() {
    this.canvas.remove();
  }
  metrics() {
    const t = Math.max(22, Math.min(36, this.height * 0.08)), n = this.height - t - 8, a = (n - 18 - 8) / this.rows;
    return { pad: 14, spacing: (this.width - 28) / (this.rows + 1), top: 18, rowGap: a, bucketTop: n, bucketH: t };
  }
  pegX(e, o, t, n) {
    const a = 3 + e, i = (this.rows + 2 - a) / 2 * n;
    return t + i + o * n;
  }
  xAt(e, o, t, n) {
    const a = t + (this.rows + 1) / 2 * n, i = t + (o + 0.5) * n;
    return this.rows === 0 ? a : a + (i - a) * (e / this.rows);
  }
  yAt(e, o, t) {
    return o + t * e;
  }
  draw() {
    const e = this.ctx, { pad: o, spacing: t, top: n, rowGap: a, bucketTop: i, bucketH: d } = this.metrics();
    e.clearRect(0, 0, this.width, this.height), e.fillStyle = "#272b2c", e.fillRect(0, 0, this.width, this.height);
    const f = Z(this.rows, this.risk), v = Math.max(2.2, Math.min(5.5, t * 0.16));
    for (let r = 0; r < this.rows; r += 1) {
      const m = 3 + r, h = n + a * (r + 1);
      for (let p = 0; p < m; p += 1) {
        const b = this.pegX(r, p, o, t);
        e.beginPath(), e.fillStyle = "#f4f7f8", e.arc(b, h, v, 0, Math.PI * 2), e.fill();
      }
    }
    for (let r = 0; r < f.length; r += 1) {
      const m = this.pegX(this.rows - 1, r, o, t), h = this.pegX(this.rows - 1, r + 1, o, t), p = this.pulses.get(r) ?? 0, b = p > 0 ? 1 + p / 0.45 * 0.12 : 1, S = (h - m - 3) * b, L = (m + h) / 2 - S / 2, M = d * b, T = i - (M - d) / 2;
      Wt(e, L, T, S, M, Math.min(8, M / 2)), e.fillStyle = Tt(r, f.length), e.fill(), e.fillStyle = "#1a1c1d", e.font = `700 ${Math.max(8, Math.min(11, S * 0.42))}px Outfit, sans-serif`, e.textAlign = "center", e.textBaseline = "middle", e.fillText(tt(f[r] ?? 0), L + S / 2, T + M / 2);
    }
    for (const r of this.balls) {
      const m = r.path.slice(0, r.step).filter((W) => W === "R").length, h = r.landed ? r.bucket : m + (r.path[r.step] === "R" ? 1 : 0), p = r.landed ? 1 : Math.max(0, Math.min(1, r.u)), b = r.step, S = Math.min(this.rows, r.step + (r.landed ? 0 : 1)), L = this.xAt(b, m, o, t), M = this.xAt(S, r.landed ? r.bucket : h, o, t), T = this.yAt(b, n, a), O = this.yAt(S, n, a), I = Math.sin(Math.PI * p) * a * 0.28, A = r.landed ? 0 : Math.sin(r.step * 7.2 + p * 4) * 1.6 * (1 - p), k = L + (M - L) * p + A, R = T + (O - T) * p - I;
      e.beginPath(), e.fillStyle = "#f7f4ea", e.arc(k, R, Math.max(5, v * 1.35), 0, Math.PI * 2), e.fill(), e.strokeStyle = "rgba(0,0,0,0.35)", e.lineWidth = 1, e.stroke();
    }
  }
}
function Wt(s, e, o, t, n, a) {
  const i = Math.max(0, Math.min(a, t / 2, n / 2));
  s.beginPath(), s.moveTo(e + i, o), s.arcTo(e + t, o, e + t, o + n, i), s.arcTo(e + t, o + n, e, o + n, i), s.arcTo(e, o + n, e, o, i), s.arcTo(e, o, e + t, o, i), s.closePath();
}
function jt() {
  return $t({
    manifest: pt,
    title: "弹珠",
    gameAttr: "wgf-game:plinko",
    createBoard: (s) => new Ot(s)
  });
}
export {
  jt as createGame,
  pt as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
