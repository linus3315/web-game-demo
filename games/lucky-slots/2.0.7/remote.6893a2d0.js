import { registerStrings as re, defineGame as ae, patchGame as ht, readHighScore as Rt, t as ie, writeHighScore as le } from "@wgf/core";
import { TokenStore as ce, HttpClient as ue } from "@wgf/net";
const de = {
  background: "#2a140c",
  shapes: [
    { tag: "rect", attrs: { x: 48, y: 56, width: 224, height: 120, rx: 16, fill: "#1a0d08" } },
    { tag: "circle", attrs: { cx: 92, cy: 116, r: 22, fill: "#ff4d6d" } },
    { tag: "circle", attrs: { cx: 148, cy: 116, r: 22, fill: "#ffb703" } },
    { tag: "circle", attrs: { cx: 204, cy: 116, r: 22, fill: "#f6f1e7" } },
    { tag: "rect", attrs: { x: 118, y: 188, width: 84, height: 28, rx: 14, fill: "#ff5a1f" } }
  ]
}, j = {
  id: "lucky-slots",
  name: "金狮奇缘",
  description: "三轴三行、五条线。金狮是百搭。娱乐积分，不能兑换，也不能充值。",
  tip: "三连才有奖。大约每 130 转开启一次奇缘。",
  howToPlay: "三轴三行，五条固定线，从左到右三连才派彩。金狮可替代任何图案，三个金狮按 50 倍总注派彩。大约每 130 转随机开启金狮奇缘：选定一种图案后，空格会停下该图案或金狮并锁住，直到九格都满，再按盘面派彩。服务器在线时由服务器开奖。",
  copy: {
    en: {
      name: "Golden Lion",
      description: "Three reels, three rows, five lines. The lion is wild. Play credits only.",
      howToPlay: "Three of a kind on a fixed line pays from the left. The lion substitutes and pays 50× the stake on its own. About every 130 spins a fortune hold starts: one symbol is chosen, and empty cells lock that symbol or a lion until the grid is full.",
      tip: "Three of a kind pays. A fortune hold is about 1 spin in 130."
    }
  },
  cover: "slots",
  art: de,
  renderer: "dom",
  controls: "pointer",
  tags: ["拉霸", "联网"],
  theme: { accent: "#ffb703", accentInk: "#2a1408", glow: "#ff5a1f", radius: 18, font: "serif" }
}, W = [10, 20, 50, 100], fe = 1e3, rt = 3, Kt = 3, Jt = 1 / 130, mt = [
  "spark",
  "spark",
  "spark",
  "spark",
  "knot",
  "knot",
  "knot",
  "knot",
  "coin",
  "coin",
  "coin",
  "fan",
  "fan",
  "fan",
  "lantern",
  "lantern",
  "ingot",
  "lion",
  "spark",
  "knot",
  "coin",
  "fan",
  "spark"
], at = [
  [1, 1, 1],
  [0, 0, 0],
  [2, 2, 2],
  [0, 1, 2],
  [2, 1, 0]
], pe = {
  lion: 50,
  ingot: 20,
  lantern: 5,
  fan: 2,
  coin: 1.6,
  knot: 1,
  spark: 0.6
}, $t = ["ingot", "lantern", "fan", "coin", "knot", "spark"];
function ge(t) {
  return W.includes(t);
}
function et() {
  return { credits: fe, freeSpins: 0, freeBet: 20 };
}
function Bt(t) {
  return Array.from({ length: rt }, () => {
    const n = Math.floor(t() * mt.length);
    return [0, 1, 2].map((e) => mt[(n + e) % mt.length] ?? "spark");
  });
}
function he(t, n) {
  const e = [];
  at.forEach((c, r) => {
    const u = c.map((f, S) => t[S]?.[f] ?? "blank"), s = ye(u, n);
    s && e.push({ line: r, symbol: s.symbol, count: 3, payout: s.payout });
  });
  let o = e.reduce((c, r) => c + r.payout, 0);
  return be(e) && o > 0 && (o *= 10), {
    grid: t,
    wins: e,
    scatterCount: 0,
    scatterPayout: 0,
    freeSpinsAwarded: 0,
    win: o,
    bigWin: o >= n * 10,
    megaWin: o >= n * 25,
    feature: null
  };
}
function me(t, n, e) {
  if (!ge(n)) return { error: "bad_bet" };
  if (t.credits < n) return { error: "insufficient" };
  t.credits -= n;
  const o = e() < Jt ? Se(e) : null, c = o ? o.steps.at(-1)?.grid ?? Bt(e) : Bt(e), r = he(c, n);
  return r.feature = o, t.credits += r.win, { ...r, credits: t.credits, freeSpinsLeft: 0, bet: n };
}
function be(t) {
  const n = /* @__PURE__ */ new Set();
  for (const e of t)
    at[e.line]?.forEach((c, r) => n.add(`${r}:${c}`));
  return n.size === rt * Kt;
}
function ye(t, n) {
  if (t.some((r) => r === "blank")) return null;
  const o = t.find((r) => r !== "lion") ?? "lion";
  if (t.some((r) => r !== o && r !== "lion")) return null;
  const c = pe[o];
  return c ? { symbol: o, payout: Math.round(c * n) } : null;
}
function Se(t) {
  const n = $t[Math.floor(t() * $t.length)] ?? "ingot", e = 3 + Math.floor(t() * 7), o = [];
  for (let u = 0; u < rt; u += 1)
    for (let s = 0; s < Kt; s += 1) o.push([u, s]);
  for (let u = o.length - 1; u > 0; u -= 1) {
    const s = Math.floor(t() * (u + 1)), f = o[u];
    o[u] = o[s] ?? f, o[s] = f;
  }
  const c = Array.from({ length: rt }, () => ["blank", "blank", "blank"]), r = [];
  for (const [u, s] of o.slice(0, e)) {
    const f = c[u];
    f && (f[s] = t() < 0.1 ? "lion" : n, r.push({ grid: ve(c) }));
  }
  return { symbol: n, steps: r };
}
function ve(t) {
  return t.map((n) => [...n]);
}
function we() {
  re("slots", {
    zh: {
      credits: "积分 {n}",
      free: "免费 {n}",
      spin: "SPIN",
      stop: "STOP",
      auto: "自动",
      spinning: "旋转中…",
      broke: "积分不够了",
      badBet: "注额不合法",
      won: "赢得 {n}",
      lost: "没有中奖",
      freeAward: "{message}，免费旋转 +{n}",
      empty: "积分用完了",
      offline: "服务器不可用，这局只用这台设备上的积分。",
      synced: "积分在服务器上，旋转前已经同步。",
      serverDown: "开奖服务器没有就绪",
      connecting: "正在连接开奖服务器…",
      resetFail: "没能重置服务器上的积分",
      ready: "请下注！",
      place: "请下注！",
      note: "娱乐积分，不能兑换，也不能充值。",
      turbo: "加速",
      paytable: "赔率",
      fortune: "奇缘 {n}/{total}",
      fortuneNow: "奇缘",
      feature: "{message} 金狮奇缘：{symbol}",
      "symbol.lion": "金狮",
      "symbol.ingot": "金元宝",
      "symbol.lantern": "灯笼",
      "symbol.fan": "折扇",
      "symbol.coin": "铜钱",
      "symbol.knot": "中国结",
      "symbol.spark": "火星",
      "symbol.blank": "空",
      server: "服务器开奖",
      local: "本地开奖（这局连不上服务器）",
      pending: "连接中…",
      retry: "服务器没有确认这次旋转。再点一次会用同一个编号重试，不会扣两次。"
    },
    en: {
      credits: "Credits {n}",
      free: "Free {n}",
      spin: "SPIN",
      stop: "STOP",
      auto: "Auto",
      spinning: "Spinning…",
      broke: "Not enough credits",
      badBet: "That bet is not allowed",
      won: "Won {n}",
      lost: "No win",
      freeAward: "{message}, free spins +{n}",
      empty: "Out of credits",
      offline: "Server unreachable. This round uses credits on this device.",
      synced: "Credits are on the server and synced.",
      serverDown: "The server is not ready",
      connecting: "Connecting to the server…",
      resetFail: "Could not reset the server credits",
      ready: "PLACE YOUR BETS!",
      place: "PLACE YOUR BETS!",
      note: "Play credits only. Not redeemable and not for sale.",
      turbo: "Turbo",
      paytable: "Pays",
      fortune: "Fortune {n}/{total}",
      fortuneNow: "Fortune",
      feature: "{message} Golden fortune: {symbol}",
      "symbol.lion": "lion",
      "symbol.ingot": "ingot",
      "symbol.lantern": "lantern",
      "symbol.fan": "fan",
      "symbol.coin": "coin",
      "symbol.knot": "knot",
      "symbol.spark": "spark",
      "symbol.blank": "blank",
      server: "Server draw",
      local: "Local draw (server unreachable)",
      pending: "Connecting…",
      retry: "The server did not confirm this spin. Tap again to retry the same id. It will not charge twice."
    }
  });
}
function ke(t, n) {
  return {
    x: t.x - n.x + t.width / 2,
    y: t.y - n.y + t.height / 2
  };
}
function Ae(t, n) {
  return t.map((e, o) => {
    const c = n[o]?.[e];
    return c ? `${c.x},${c.y}` : "";
  }).filter((e) => e.length > 0).join(" ");
}
const Q = 24, V = 3, it = 3, _t = ["lion", "ingot", "lantern", "fan", "coin", "knot", "spark"], Ot = {
  startStagger: 0.11,
  stopStagger: 0.17,
  accel: 0.17,
  cruise: 26,
  minSpin: 2,
  postCruise: 0.25,
  settle: 0.3
}, yt = {
  startStagger: 0,
  stopStagger: 0,
  accel: 0.1,
  cruise: 44,
  minSpin: 0.93,
  postCruise: 0.15,
  settle: 0.15
};
function Ee(t = !1) {
  return {
    reels: Array.from({ length: V }, (n, e) => ({
      offset: 0,
      speed: 0,
      phase: "idle",
      startAt: 0,
      accelElapsed: 0,
      stopStartedAt: -1,
      stopAt: 0,
      from: 0,
      elapsed: 0,
      duration: 0.5,
      landed: !0,
      tickAt: 0,
      target: ["spark", "knot", "coin"],
      symbols: Array.from(
        { length: Q },
        (o, c) => _t[(e * 3 + c) % _t.length] ?? "spark"
      )
    })),
    spinAge: 0,
    schedule: Array.from({ length: V }, () => Number.POSITIVE_INFINITY),
    result: null,
    quick: !1,
    tease: !1,
    reduced: t,
    slam: !1
  };
}
function ot(t, n) {
  let e = Qt(t + n);
  return e > it + 1 && (e -= Q), e;
}
function xe(t, n) {
  return Qt(n - Math.round(t));
}
function Wt(t, n) {
  t.result = null, t.quick = !1, t.tease = !1, t.spinAge = 0, t.schedule = t.schedule.map(() => Number.POSITIVE_INFINITY), t.reels.forEach((e, o) => {
    const c = kt(n[o]);
    e.target = c, e.phase = "idle", e.speed = 0, e.landed = !0, e.offset = 0, wt(e, 0, c);
  });
}
function Gt(t) {
  t.result = null, t.quick = !1, t.tease = !1, t.slam = !1, t.spinAge = 0, t.schedule = t.schedule.map(() => Number.POSITIVE_INFINITY);
  const n = lt(t).startStagger;
  t.reels.forEach((e, o) => {
    e.phase = "wait", e.startAt = o * n, e.speed = 0, e.accelElapsed = 0, e.stopStartedAt = -1, e.landed = !1, e.elapsed = 0;
  });
}
function Te(t) {
  if (t.reduced || (t.quick = !0, t.tease = !1, !t.result)) return;
  const n = yt.settle;
  t.reels.forEach((e, o) => {
    e.phase === "stop" ? e.duration = Math.min(e.duration, n) : e.landed || (t.schedule[o] = t.spinAge + o * yt.stopStagger);
  });
}
function jt(t) {
  if (t.slam = !0, t.quick = !0, !!t.result)
    for (let n = 0; n < V; n += 1) {
      const e = t.reels[n];
      !e || e.landed || (e.phase === "wait" && (e.phase = "spin"), e.phase === "stop" ? e.duration - e.elapsed > St && (e.from = e.offset, e.elapsed = 0, e.duration = St) : t.schedule[n] = t.spinAge);
    }
}
function bt(t, n) {
  if (t.result = n, t.slam) {
    for (let r = 0; r < V; r += 1) {
      const u = t.reels[r];
      if (!u || u.phase !== "stop") continue;
      const s = kt(n[r]);
      wt(u, u.stopAt, s), u.target = s;
    }
    jt(t);
    return;
  }
  const e = lt(t), o = (V - 1) * e.stopStagger + e.settle, c = Math.max(e.minSpin - o, t.spinAge + e.postCruise);
  for (let r = 0; r < V; r += 1)
    t.schedule[r] = c + r * e.stopStagger;
}
function Le(t, n) {
  const e = Math.min(0.1, Math.max(0, n));
  t.spinAge += e;
  const o = lt(t), c = { moving: !1, ticks: [], landed: [], scatters: [] };
  let r = 0;
  for (let u = 0; u < V; u += 1) {
    const s = t.reels[u];
    if (s) {
      if (s.phase === "wait" && t.spinAge >= s.startAt && (s.phase = "spin", s.accelElapsed = 0), s.phase === "wait")
        c.moving = !0;
      else if (s.phase === "spin") {
        c.moving = !0;
        const f = t.reduced ? 10 : o.cruise, S = t.reduced ? 0.12 : o.accel;
        s.accelElapsed += e;
        const T = Math.sin(Math.min(1, s.accelElapsed / S) * (Math.PI / 2));
        let w = f * T;
        t.tease && t.result && !t.quick && !t.reduced && (w = Math.min(w, 9));
        const Y = Math.floor(s.offset);
        s.offset += w * e, s.speed = w;
        const M = Math.floor(s.offset);
        s.tickAt += e;
        const q = s.speed > 16 ? 0.08 : 0.045;
        !t.reduced && M !== Y && s.tickAt > q && (s.tickAt = 0, c.ticks.push(u));
        const G = t.schedule[u] ?? Number.POSITIVE_INFINITY, $ = Me(t, u, o.stopStagger);
        t.result && t.spinAge >= G && ($ || t.quick) && Ce(t, u);
      } else if (s.phase === "stop") {
        c.moving = !0, s.elapsed += e;
        const S = 2 * (s.stopAt - s.from) / s.duration, T = S / s.duration, w = Math.min(s.duration, s.elapsed);
        s.offset = s.from + S * w - 0.5 * T * w * w, s.speed = Math.max(0, S - T * w), s.offset > s.stopAt && (s.offset = s.stopAt), s.elapsed >= s.duration && (s.offset = s.stopAt, s.phase = "idle", s.speed = 0, s.landed = !0, c.landed.push(u), s.target.includes("lion") && c.scatters.push(u));
      }
      if (s.landed)
        for (const f of s.target) f === "lion" && (r += 1);
    }
  }
  if (!t.tease && r >= 2 && t.reels.some((u) => !u.landed)) {
    t.tease = !0;
    const u = t.reduced || t.quick ? 0.05 : 0.62;
    t.reels.forEach((s, f) => {
      if (s.landed || s.phase === "stop") return;
      const S = t.schedule[f] ?? 0;
      t.schedule[f] = Math.max(S, t.spinAge + u * (f + 1));
    });
  }
  return c;
}
function Ce(t, n) {
  const e = t.reels[n];
  if (!e || e.phase !== "spin") return;
  const o = kt(t.result?.[n]);
  e.target = o;
  const c = lt(t), r = t.reduced ? 0.2 : t.tease && !t.quick ? 0.7 : c.settle, u = t.reduced ? 10 : c.cruise, s = Math.max(it + 1.25, 0.5 * u * r), f = Math.ceil(e.offset + s);
  wt(e, f, o), e.stopAt = f, e.from = e.offset, e.elapsed = 0;
  const S = Math.max(1e-3, f - e.offset);
  e.duration = t.slam ? Math.min(St, 2 * S / Math.max(u, 1)) : 2 * S / u, e.stopStartedAt = t.spinAge, e.phase = "stop";
}
function Me(t, n, e) {
  if (n === 0) return !0;
  const o = t.reels[n - 1];
  return !o || o.stopStartedAt < 0 ? !1 : t.spinAge >= o.stopStartedAt + e;
}
function lt(t) {
  return t.reduced ? { ...Ot, startStagger: 0.02, stopStagger: 0.04, minSpin: 0.4 } : t.quick ? yt : Ot;
}
function wt(t, n, e) {
  for (let o = 0; o < it; o += 1) {
    const c = e[o] ?? "spark", r = xe(n, o);
    t.symbols[r] = c;
  }
}
function kt(t) {
  return [t?.[0] ?? "spark", t?.[1] ?? "knot", t?.[2] ?? "coin"];
}
const St = 0.12;
function Qt(t) {
  return (t % Q + Q) % Q;
}
const tt = "http://www.w3.org/2000/svg", qe = {
  lion: { text: "W", tier: "wild" },
  ingot: { text: "A", tier: "a" },
  lantern: { text: "K", tier: "k" },
  fan: { text: "Q", tier: "q" },
  coin: { text: "J", tier: "low" },
  knot: { text: "10", tier: "low" },
  spark: { text: "9", tier: "low" },
  blank: { text: "", tier: "blank" }
}, Ie = /* @__PURE__ */ new Set(["lion", "ingot", "lantern", "fan"]), Ne = 8, Pe = [22, 23, 0, 1, 2, 3, 4, 5], Ft = 7;
function Re(t) {
  const n = window.matchMedia("(prefers-reduced-motion: reduce)").matches, e = Ee(n);
  t.replaceChildren(), t.classList.add("lion-board");
  const o = document.createElement("div");
  o.className = "lion-window", t.appendChild(o);
  const c = document.createElementNS(tt, "svg");
  c.setAttribute("class", "lion-blur-defs"), c.setAttribute("aria-hidden", "true"), t.appendChild(c);
  const r = e.reels.map((a, p) => {
    const i = document.createElement("div");
    i.className = "lion-col", i.dataset.reel = String(p);
    const l = document.createElementNS(tt, "filter"), g = `lion-blur-${p}`;
    l.setAttribute("id", g), l.setAttribute("x", "-20%"), l.setAttribute("y", "-60%"), l.setAttribute("width", "140%"), l.setAttribute("height", "220%");
    const h = document.createElementNS(tt, "feGaussianBlur");
    h.setAttribute("stdDeviation", "0 0"), h.setAttribute("edgeMode", "duplicate"), l.appendChild(h), c.appendChild(l);
    const k = document.createElement("div");
    k.className = "lion-strip";
    const H = [];
    for (let P = 0; P < Ne; P += 1) {
      const A = Pe[P] ?? P, b = document.createElement("div");
      b.className = "lion-strip-cell";
      const z = document.createElement("span"), I = a.symbols[A] ?? "spark";
      Ht(z, I), b.appendChild(z), k.appendChild(b), H.push({ el: b, glyph: z, index: A, symbol: I, prevPos: ot(A, 0) });
    }
    return i.appendChild(k), o.appendChild(i), { column: i, strip: k, cells: H, blur: h, filterId: g, blurAmount: 0 };
  }), u = document.createElementNS(tt, "svg");
  u.setAttribute("class", "lion-lines"), o.appendChild(u);
  let s = [], f = 0, S = 0, T = [];
  const w = () => {
    const a = r[0];
    if (!a) return;
    const p = a.column.clientHeight;
    if (p < 24) return;
    const i = Math.max(2, p * 0.012), l = (p - 2 * i) / 3;
    t.style.setProperty("--cell", `${l}px`), t.style.setProperty("--reel-gap", `${i}px`), t.style.setProperty("--glyph", `${Math.round(l * 0.58)}px`), t.style.setProperty("--glyph-wide", `${Math.round(l * 0.46)}px`), S = l + i;
  };
  function Y(a, p, i, l) {
    const g = i < -0.35 || i > it - 0.05;
    a.symbol === p || !l && !g || (a.symbol = p, Ht(a.glyph, p));
  }
  function M(a, p, i) {
    let l = -1, g = 99;
    for (let h = 0; h < Q; h += 1) {
      if (i.has(h)) continue;
      const k = ot(h, p);
      k < -0.55 && k > -2.6 && k < g && (l = h, g = k);
    }
    l < 0 || (i.delete(a.index), a.index = l, i.add(l), a.prevPos = g);
  }
  function q() {
    S < 8 && w(), e.reels.forEach((a, p) => {
      const i = r[p];
      if (!i || S < 8) return;
      const l = new Set(i.cells.map((h) => h.index)), g = a.landed && a.phase === "idle";
      for (const h of i.cells) {
        let k = ot(h.index, a.offset);
        (k < h.prevPos - 6 || k < -3) && (M(h, a.offset, l), k = ot(h.index, a.offset)), h.prevPos = k, h.el.style.transform = `translate3d(0, ${k * S}px, 0)`, Y(h, a.symbols[h.index] ?? "spark", k, g);
      }
      G(i, a.speed, g || n);
    });
  }
  function G(a, p, i) {
    const l = i || p < 0.5 ? 0 : Math.min(Ft, p / 26 * Ft), g = Math.round(l * 2) / 2;
    if (g !== a.blurAmount) {
      if (a.blurAmount = g, g <= 0) {
        a.column.style.filter = "", a.blur.setAttribute("stdDeviation", "0 0");
        return;
      }
      a.blur.setAttribute("stdDeviation", `0 ${g}`), a.column.style.filter = `url(#${a.filterId})`;
    }
  }
  function $(a) {
    const p = a.column.getBoundingClientRect();
    return a.cells.map((i) => ({ el: i.el, box: i.el.getBoundingClientRect() })).filter(({ box: i }) => {
      const l = i.top + i.height / 2;
      return l >= p.top - 1 && l <= p.bottom + 1;
    }).sort((i, l) => i.box.top - l.box.top).slice(0, 3).map((i) => i.el);
  }
  function y() {
    const a = o.getBoundingClientRect();
    return r.map(
      (p) => $(p).map((i) => ke(i.getBoundingClientRect(), a))
    );
  }
  function N() {
    const a = o.clientWidth, p = o.clientHeight;
    if (u.setAttribute("viewBox", `0 0 ${a} ${p}`), u.replaceChildren(), a < 8 || p < 8) return;
    const i = y();
    for (const l of T) {
      const g = at[l.line];
      if (!g) continue;
      const h = document.createElementNS(tt, "polyline");
      h.setAttribute("points", Ae(g.slice(0, l.count), i)), h.setAttribute("class", "lion-payline"), u.appendChild(h);
    }
  }
  function _() {
    T = [];
    for (const a of r)
      for (const p of a.cells) p.el.classList.remove("is-win", "is-lock", "is-dim");
    u.replaceChildren();
  }
  function C(a) {
    for (const p of r)
      for (const i of p.cells) i.el.classList.remove("is-lock");
    a.forEach((p, i) => {
      const l = r[i] ? $(r[i]) : [];
      p.forEach((g, h) => {
        g !== "blank" && l[h]?.classList.add("is-lock");
      });
    });
  }
  function R() {
    if (f >= s.length - 1) return !1;
    f += 1;
    const a = s[f];
    return a ? (Gt(e), e.quick = !0, bt(e, a), C(a), !0) : !1;
  }
  w();
  const K = new ResizeObserver(() => {
    w(), q(), N();
  });
  return K.observe(t), q(), {
    show(a) {
      s = [], f = 0, Wt(e, a), _(), q();
    },
    spin() {
      Gt(e), _(), q();
    },
    turbo() {
      Te(e);
    },
    slam() {
      const a = s.length > 1 ? s[s.length - 1] : null;
      if (a) {
        f = s.length - 1, e.slam = !0, bt(e, a);
        return;
      }
      jt(e);
    },
    deliver(a, p) {
      s = p?.steps.map((i) => i.grid) ?? [a], s[0] || (s = [a]), f = e.slam ? s.length - 1 : 0, bt(e, s[f] ?? a);
    },
    update(a, p) {
      const i = Le(e, a);
      if (p && !n) {
        i.ticks.length && p.playTone({ frequency: 620, duration: 0.02, type: "square", gain: 0.01 });
        for (const g of i.landed)
          p.playTone({
            frequency: 220 + g * 70,
            duration: 0.05,
            type: "triangle",
            gain: 0.03
          });
      }
      if (!i.moving && s.length > 1) {
        const g = s[f];
        g && C(g);
      }
      const l = i.moving || R();
      return q(), l;
    },
    celebrate(a) {
      T = a;
      const p = /* @__PURE__ */ new Set();
      for (const i of r)
        for (const l of i.cells) l.el.classList.remove("is-win", "is-dim");
      for (const i of a) {
        const l = at[i.line];
        if (l)
          for (let g = 0; g < i.count; g += 1)
            p.add(`${g}:${l[g] ?? 1}`);
      }
      r.forEach((i, l) => {
        $(i).forEach((g, h) => {
          a.length !== 0 && (p.has(`${l}:${h}`) ? g.classList.add("is-win") : g.classList.add("is-dim"));
        });
      }), N();
    },
    resize() {
      w(), q(), N();
    },
    abort() {
      s = [], f = 0, Wt(
        e,
        e.reels.map((a) => a.target)
      ), _(), q();
    },
    destroy() {
      K.disconnect(), t.replaceChildren();
    }
  };
}
function Ht(t, n) {
  const e = qe[n];
  t.textContent = e.text, t.dataset.symbol = n, t.className = `lion-glyph is-${e.tier}${Ie.has(n) ? " is-big" : ""}`;
}
function $e() {
  let t = !1, n = 0;
  return {
    tryAcquire() {
      return t ? !1 : (t = !0, n += 1, !0);
    },
    release() {
      t = !1;
    },
    get requests() {
      return n;
    },
    get locked() {
      return t;
    }
  };
}
const Be = {}, Dt = {
  lion: "W",
  ingot: "A",
  lantern: "K",
  fan: "Q",
  coin: "J",
  knot: "10",
  spark: "9",
  blank: ""
}, Yt = [
  ["spark", "ingot", "coin"],
  ["knot", "lantern", "spark"],
  ["coin", "fan", "knot"]
], _e = Math.round(1 / Jt), zt = 4, vt = "wgf:slots-wallet", Xt = "wgf:slots-token", Oe = "wgf:session";
function je() {
  we();
  let t = null;
  const n = [];
  let e = null, o = et(), c = 20, r = !1, u = !1, s = 0, f = null, S = !1, T = 0, w = 0, Y = !1, M = "pending", q = !1, G = null, $ = 0, y = "", N = "", _ = 0, C = 0, R = "ready", K = 0, a = 0, p = !1, i = 0, l = 0;
  const g = $e();
  let h = null, k = 0, H = 0;
  const P = [];
  let A = null;
  function b(d, v) {
    return ie(t?.store.getState().ui.locale ?? "zh", d, v);
  }
  function z(d, v) {
    v === "spin" && d.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), v === "stop" && d.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), v === "win" && d.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), v === "big" && d.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), v === "scatter" && d.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function I() {
    t && ht(t.store, {
      id: j.id,
      status: R,
      score: T,
      highScore: Math.max(w, T),
      message: y,
      detail: Ut(M, b),
      combo: o.freeSpins,
      credits: o.credits
    });
  }
  function x() {
    if (!e) return;
    const d = e.querySelector("[data-credits]"), v = e.querySelector("[data-message]"), E = e.querySelector("[data-amount]"), X = e.querySelector("[data-clock]"), Z = e.querySelector("[data-bet-dec]"), L = e.querySelector("[data-bet-inc]"), m = e.querySelector("[data-spin-no]"), D = e.querySelector("[data-mult]"), O = e.querySelector("[data-demo]"), J = e.querySelector("[data-feature]"), F = e.querySelector("[data-feature-glyph]"), Tt = e.querySelector("[data-source]");
    if (d && (d.textContent = String(o.credits)), E && (E.textContent = String(c)), X) {
      const B = /* @__PURE__ */ new Date();
      X.textContent = `${B.getHours()}:${String(B.getMinutes()).padStart(2, "0")}`;
    }
    if (m && (m.textContent = K > 0 ? String(K) : "—"), D && (D.textContent = `${a}×`), O && (O.hidden = M !== "local"), J && (J.hidden = !h), F && h && (F.textContent = Dt[h], F.className = `is-${h}`), Tt && (Tt.textContent = Ut(M, b)), v) {
      const B = y === b("slots.place") || y === b("slots.ready"), U = y.length > 0 && !B;
      v.hidden = !U, v.textContent = U ? y : "", v.classList.toggle("is-win", U && /赢得|Won/.test(y));
    }
    e.dataset.spins = String(g.requests), e.dataset.round = r || l > 0 ? "busy" : "open";
    const Lt = W.indexOf(c);
    Z && (Z.disabled = r || Lt <= 0), L && (L.disabled = r || Lt >= W.length - 1), e.querySelectorAll("[data-bet]").forEach((B) => {
      B.classList.toggle("is-bet", Number(B.dataset.bet) === c), B.disabled = r;
    });
    const ct = e.querySelector("[data-spin]"), Ct = e.querySelector("[data-note]");
    Ct && (Ct.textContent = b("slots.note"));
    const ut = e.querySelector("[data-auto]");
    e.classList.toggle("is-spinning", r || l > 0), r || (e.dataset.reels = "settled"), ct && (ct.disabled = !q || R !== "running", ct.setAttribute("aria-label", b(r ? "slots.stop" : "slots.spin")));
    const Mt = e.querySelector("[data-turbo]");
    Mt && Mt.classList.toggle("is-on", p), ut && (ut.setAttribute("aria-pressed", u ? "true" : "false"), ut.disabled = R !== "running" || r);
    const qt = e.querySelector("[data-big]"), It = e.querySelector("[data-big-value]");
    qt && (qt.hidden = !N), It && C <= 0 && (It.textContent = N);
    const dt = e.querySelector("[data-land-win]");
    dt && (dt.textContent = C > 0 ? String(Math.round(_)) : String(k), dt.classList.toggle("is-zero", C <= 0 && k <= 0));
    const ft = e.querySelector("[data-history]"), pt = e.querySelector("[data-fortune]"), Nt = h ? Dt[h] : "", gt = P[0]?.feature === !0 && Nt.length > 0;
    ft && (ft.replaceChildren(
      ...P.map((B) => {
        const U = document.createElement("span");
        return U.textContent = String(B.win), B.feature && U.classList.add("is-feature"), U;
      })
    ), ft.hidden = P.length === 0 || gt), pt && (pt.hidden = P.length > 0 && !gt, pt.textContent = gt ? `${b("slots.fortuneNow")} ${Nt}` : b("slots.fortune", { n: H, total: _e }));
    const Pt = e.querySelector("[data-paytable]");
    Pt && (Pt.textContent = b("slots.paytable"));
  }
  function nt() {
    M === "local" && localStorage.setItem(vt, JSON.stringify(o));
  }
  function Et(d) {
    o = {
      credits: d.credits,
      freeSpins: d.freeSpinsLeft,
      freeBet: d.freeSpinsLeft > 0 ? d.bet : o.freeBet
    }, nt(), f = d, S = !1, s = 0, N = "", C = 0, y = b("slots.place"), h = d.feature?.symbol ?? null, T += d.win, K += 1, a = d.bet > 0 ? Math.round(d.win / d.bet * 10) / 10 : 0, A?.deliver(d.grid, d.feature), I(), x();
  }
  async function st() {
    if (!g.tryAcquire()) return;
    if (!t || R !== "running" || !q || M === "pending" || l > 0) {
      g.release();
      return;
    }
    if (o.freeSpins <= 0 && o.credits < c) {
      y = b("slots.broke"), u = !1, g.release(), I(), x();
      return;
    }
    r = !0, i = 0, l = 0, y = "", h = null, N = "", C = 0, S = !1, A?.spin(), p && A?.turbo(), t && z(t.audio, "spin");
    const d = $, v = G ?? Ge();
    if (G = v, x(), M === "local") {
      const E = me(o, c, Math.random);
      if (d !== $ || !t) return;
      if (G = null, "error" in E) {
        r = !1, A?.abort(), y = E.error === "insufficient" ? b("slots.broke") : b("slots.badBet"), u = !1, g.release(), I(), x();
        return;
      }
      Et(E);
      return;
    }
    try {
      const E = await De(c, v);
      if (d !== $ || !t) return;
      G = null, Et(E);
    } catch {
      if (d !== $ || !t) return;
      r = !1, A?.abort(), u = !1, y = b("slots.retry"), g.release(), I(), x();
    }
  }
  function ee() {
    if (!f || !t) return;
    r = !1, A?.celebrate(f.wins), f.win > 0 ? (y = b("slots.won", { n: f.win }), z(t.audio, f.bigWin ? "big" : "win")) : y = b("slots.place"), f.feature && (y = b("slots.feature", {
      message: y,
      symbol: b(`slots.symbol.${f.feature.symbol}`)
    }), z(t.audio, "scatter")), k = f.win, P.unshift({ win: f.win, feature: f.feature !== null }), P.length > zt && (P.length = zt), H = f.feature ? 0 : H + 1, f.bigWin && (N = "0", _ = 0, C = f.win, u = !1), T > w && le(j.id, T), o.credits < W[0] && o.freeSpins === 0 && (u = !1, R = "over", y = b("slots.empty"), Y || (Y = !0, t.events.emit("game:over", {
      gameId: j.id,
      score: T,
      best: Math.max(w, T),
      isRecord: T > w
    }))), f = null, s = u ? 0.7 : 0, l = ne(y) ? 1 : 0, l <= 0 && g.release(), I(), x();
  }
  function ne(d) {
    return /赢得|Won|奇缘|fortune/i.test(d);
  }
  async function se() {
    if (!await ze()) {
      M = "local", q = !0, o = Vt(), nt(), y = b("slots.place"), I(), x();
      return;
    }
    try {
      const v = await He();
      M = "server", q = !0, o = Zt(v), y = b("slots.place"), I(), x();
    } catch {
      M = "local", q = !0, o = Vt(), nt(), y = b("slots.place"), I(), x();
    }
  }
  function xt(d) {
    c = 20, r = !1, u = !1, f = null, S = !1, s = 0, l = 0, g.release(), T = 0, Y = !1, N = "", C = 0, k = 0, H = 0, P.length = 0, h = null, A?.abort(), A?.show(Yt), y = b("slots.place"), R = d ? "running" : "ready", I(), x();
  }
  async function oe() {
    if ($ += 1, G = null, w = Rt(j.id), M === "server")
      try {
        o = await Ye();
      } catch {
        y = b("slots.resetFail"), I(), x();
        return;
      }
    else M === "local" && (localStorage.removeItem(vt), o = et(), nt());
    xt(!0);
  }
  return ae(j, {
    async onPreload(d, v) {
      await d.preload([], v);
    },
    async onMount(d) {
      t = d, d.container.setAttribute("data-wgf-game", "wgf-game:slots"), e = document.createElement("div"), e.className = "slots", e.innerHTML = We();
      const v = e.querySelector("[data-reels]");
      v instanceof HTMLElement && (A = await Re(v), A.show(Yt)), d.container.appendChild(e), w = Rt(j.id);
      const E = e;
      E.addEventListener("click", (L) => {
        const m = L.target;
        if (!(m instanceof Element)) return;
        if (m.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        if (r && (m.closest("[data-spin]") || m.closest("[data-reels]"))) {
          A?.slam();
          return;
        }
        if (l > 0 && m.closest("[data-spin]")) {
          l = 0, g.release(), x();
          return;
        }
        const D = m.closest("[data-bet]"), O = D instanceof HTMLElement ? Number(D.dataset.bet) : Number.NaN;
        if (W.includes(O) && !r) {
          c = O, E.classList.remove("is-bets"), x();
          return;
        }
        if (m.closest("[data-bet-dec]")) {
          const J = W.indexOf(c), F = W[J - 1];
          !r && F !== void 0 && (c = F), E.classList.remove("is-bets"), x();
          return;
        }
        if (m.closest("[data-bet-inc]")) {
          const J = W.indexOf(c), F = W[J + 1];
          !r && F !== void 0 && (c = F), E.classList.remove("is-bets"), x();
          return;
        }
        if (m.closest("[data-peek]")) {
          E.classList.toggle("is-panels");
          return;
        }
        if (m.closest("[data-paytable]")) {
          E.classList.remove("is-bets"), E.classList.toggle("is-paytable");
          return;
        }
        if (E.classList.contains("is-paytable") && !m.closest(".slots-panel-right") && E.classList.remove("is-paytable"), m.closest("[data-amount-bar]")) {
          r || E.classList.toggle("is-bets");
          return;
        }
        if (E.classList.contains("is-bets") && !m.closest("[data-bet-ui]") && E.classList.remove("is-bets"), m.closest("[data-turbo]")) {
          r || (p = !p, x());
          return;
        }
        m.closest("[data-spin]") && st(), m.closest("[data-auto]") && (u = !u, u && !r && l <= 0 && st(), x());
      }), xt(!1), se();
      const X = () => A?.resize(), Z = (L) => {
        if (L.key !== " " && L.key !== "Enter") return;
        const m = L.target;
        if (!(m instanceof HTMLElement && m.closest("input, textarea, select")) && !document.querySelector("[data-menu-sheet]")) {
          if (L.preventDefault(), r) {
            A?.slam();
            return;
          }
          l > 0 || R !== "running" || st();
        }
      };
      window.addEventListener("resize", X), window.addEventListener("keydown", Z), n.push(() => window.removeEventListener("resize", X)), n.push(() => window.removeEventListener("keydown", Z)), n.push(
        d.loop.onUpdate((L) => {
          if (r && A) {
            const m = A.update(L, d.audio);
            e && (e.dataset.reels = m ? "spinning" : "settled"), f && !m && !S ? (i += L, i >= 0.22 && (S = !0, ee())) : m && (i = 0);
          }
          if (C > 0 && e) {
            _ = Math.min(C, _ + C * L * 0.95);
            const m = e.querySelector("[data-big-value]"), D = String(Math.round(_));
            m && (m.textContent = D);
            const O = e.querySelector("[data-land-win]");
            O && (O.textContent = D), _ >= C - 0.4 && (N = String(Math.round(C)), C = 0, m && (m.textContent = N), O && (O.textContent = N));
          }
          l > 0 && (l = Math.max(0, l - L), l === 0 && (g.release(), x())), !r && l <= 0 && u && R === "running" && s > 0 && (s -= L, s <= 0 && st());
        }),
        d.store.subscribe((L, m) => {
          L.ui.locale !== m.ui.locale && x();
        }),
        d.events.on("game:start", () => {
          R === "ready" && (R = "running", y = b("slots.ready"), I(), x());
        }),
        d.events.on("game:restart", () => {
          oe();
        })
      );
    },
    onPause(d) {
      d.store.getState().game.status === "running" && ht(d.store, { status: "paused" });
    },
    onResume(d) {
      d.store.getState().game.status === "paused" && ht(d.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const d of n) d();
      n.length = 0, A?.destroy(), A = null, e?.remove(), e = null, t = null;
    }
  });
}
function We() {
  const t = W.map(
    (e) => `<button type="button" data-bet="${e}">${e}</button>`
  ).join("");
  return `
    <header class="slots-top">
      <button type="button" class="slots-menu" data-lobby-menu aria-label="菜单"></button>
      <div class="slots-brand">
        <strong class="slots-title">金狮奇缘</strong>
        <span class="slots-demo" data-demo hidden>试玩</span>
      </div>
      <div class="slots-balance">
        <span class="slots-coin" aria-hidden="true"></span>
        <strong data-credits>1000</strong>
      </div>
      <span class="slots-source" data-source></span>
    </header>
    <div class="slots-stage">
      <button type="button" class="slots-peek" data-peek aria-label="面板">&gt;</button>
      <aside class="slots-panel slots-panel-left">
        <h2>这一局</h2>
        <p class="slots-meta"><span data-clock>--:--</span> · RTP 96.99%</p>
        <p>转次</p><strong data-spin-no>—</strong>
        <p>上次倍数</p><strong data-mult>0×</strong>
        <h2>怎么玩</h2>
        <p class="slots-help">三轴三行，五条线，从左到右三连才有奖。金狮 W 可代替其它图案。大约每 130 转开启一次奇缘。</p>
      </aside>
        <div class="slots-center">
        <div class="slots-reels" data-reels></div>
        <p class="slots-feature" data-feature hidden><span>金狮奇缘</span><b data-feature-glyph></b></p>
        <p class="slots-toast" data-message hidden></p>
        <div class="slots-win" data-big hidden><span data-big-value>0</span></div>
      </div>
      <aside class="slots-panel slots-panel-right">
        <h2>赔率</h2>
        <ul class="slots-pay">${[
    ["W", "50×", "wild"],
    ["A", "20×", "a"],
    ["K", "5×", "k"],
    ["Q", "2×", "q"],
    ["J", "1.6×", "low"],
    ["10", "1×", "low"],
    ["9", "0.6×", "low"]
  ].map(([e, o, c]) => `<li><b class="is-${c}">${e}</b><span>${o}</span></li>`).join("")}</ul>
      </aside>
    </div>
    <div class="slots-side">
      <div class="slots-landinfo">
        <div class="slots-landtop">
          <strong class="slots-landwin is-zero" data-land-win>0</strong>
          <div class="slots-history" data-history hidden></div>
          <p class="slots-fortune" data-fortune>奇缘 0/130</p>
        </div>
        <button type="button" class="slots-paybtn" data-paytable>赔率</button>
      </div>
      <div class="slots-betui" data-bet-ui>
        <div class="slots-betrow">
          <button type="button" class="slots-betstep" data-bet-dec aria-label="减少注额">−</button>
          <button type="button" class="slots-bet-value" data-amount-bar aria-label="选择注额">
            <strong data-amount>20</strong>
          </button>
          <button type="button" class="slots-betstep" data-bet-inc aria-label="增加注额">+</button>
        </div>
        <div class="slots-betlist" data-bet-sheet>${t}</div>
      </div>
    </div>
    <div class="slots-dock">
      <div class="slots-controls">
        <button type="button" class="slots-round" data-turbo aria-label="加速">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 2 3 14h8l-1 8 11-14h-8l0-6z"/></svg>
        </button>
        <button type="button" class="slots-spin" data-spin disabled aria-label="SPIN">
          <svg class="slots-spin-arrows" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 5V2L7 6l5 4V7a5 5 0 1 1-4.9 6H5.1A7 7 0 1 0 12 5z"/>
          </svg>
          <svg class="slots-spin-stop" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="7" y="7" width="10" height="10" rx="1" fill="currentColor"/>
          </svg>
        </button>
        <button type="button" class="slots-round" data-auto aria-label="自动"></button>
      </div>
    </div>
  `;
}
function Ut(t, n) {
  return n(t === "server" ? "slots.server" : t === "local" ? "slots.local" : "slots.pending");
}
function Ge() {
  return `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function Vt() {
  try {
    const t = localStorage.getItem(vt);
    if (!t) return et();
    const n = JSON.parse(t);
    return !n || typeof n.credits != "number" ? et() : {
      credits: Math.max(0, Math.floor(n.credits)),
      freeSpins: Math.max(0, Math.floor(n.freeSpins ?? 0)),
      freeBet: typeof n.freeBet == "number" ? n.freeBet : 20
    };
  } catch {
    return et();
  }
}
function Zt(t) {
  return {
    credits: t.credits,
    freeSpins: t.freeSpins,
    freeBet: t.freeBet
  };
}
function At() {
  const t = new ce(), n = Fe(), e = Ve();
  if (n) t.set({ accessToken: n });
  else if (e?.accessToken && !e.accessToken.startsWith("local."))
    t.set({ accessToken: e.accessToken, refreshToken: e.refreshToken });
  else {
    const o = Ue();
    o && t.set({ accessToken: o });
  }
  return new ue({ baseUrl: te(), tokens: t, timeoutMs: 2500 });
}
function Fe() {
  try {
    const t = sessionStorage.getItem("wgf:launch-token");
    return t && t.length >= 8 ? t : null;
  } catch {
    return null;
  }
}
async function He() {
  const t = await At().post("/api/slots/session", {});
  return t.walletToken && localStorage.setItem(Xt, t.walletToken), t;
}
async function De(t, n) {
  return At().post("/api/slots/spin", { bet: t, spinId: n });
}
async function Ye() {
  const t = await At().post("/api/slots/reset", {});
  return Zt(t);
}
async function ze() {
  try {
    return (await fetch(`${te()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
function te() {
  return Be?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function Ue() {
  const t = localStorage.getItem(Xt);
  return t && t.startsWith("v1w.") ? t : null;
}
function Ve() {
  try {
    const t = localStorage.getItem(Oe);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
export {
  je as createGame,
  j as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
