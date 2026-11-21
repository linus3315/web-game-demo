import { registerStrings as Ue, defineGame as Ve, patchGame as ie, readHighScore as xe, t as Ke, writeHighScore as Je } from "@wgf/core";
import { TokenStore as je, HttpClient as Qe } from "@wgf/net";
const Xe = {
  background: "#2a140c",
  shapes: [
    { tag: "rect", attrs: { x: 48, y: 56, width: 224, height: 120, rx: 16, fill: "#1a0d08" } },
    { tag: "circle", attrs: { cx: 92, cy: 116, r: 22, fill: "#ff4d6d" } },
    { tag: "circle", attrs: { cx: 148, cy: 116, r: 22, fill: "#ffb703" } },
    { tag: "circle", attrs: { cx: 204, cy: 116, r: 22, fill: "#f6f1e7" } },
    { tag: "rect", attrs: { x: 118, y: 188, width: 84, height: 28, rx: 14, fill: "#ff5a1f" } }
  ]
}, Y = {
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
  art: Xe,
  renderer: "dom",
  controls: "pointer",
  tags: ["拉霸", "联网"],
  theme: { accent: "#ffb703", accentInk: "#2a1408", glow: "#ff5a1f", radius: 18, font: "serif" }
}, $ = [10, 20, 50, 100], Ze = 1e3, Z = 3, Be = 3, et = 1 / 130, le = [
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
], ee = [
  [1, 1, 1],
  [0, 0, 0],
  [2, 2, 2],
  [0, 1, 2],
  [2, 1, 0]
], tt = {
  lion: 50,
  ingot: 20,
  lantern: 5,
  fan: 2,
  coin: 1.6,
  knot: 1,
  spark: 0.6
}, Ae = ["ingot", "lantern", "fan", "coin", "knot", "spark"];
function nt(e) {
  return $.includes(e);
}
function J() {
  return { credits: Ze, freeSpins: 0, freeBet: 20 };
}
function Te(e) {
  return Array.from({ length: Z }, () => {
    const n = Math.floor(e() * le.length);
    return [0, 1, 2].map((t) => le[(n + t) % le.length] ?? "spark");
  });
}
function st(e, n) {
  const t = [];
  ee.forEach((l, r) => {
    const a = l.map((g, v) => e[v]?.[g] ?? "blank"), o = at(a, n);
    o && t.push({ line: r, symbol: o.symbol, count: 3, payout: o.payout });
  });
  let s = t.reduce((l, r) => l + r.payout, 0);
  return rt(t) && s > 0 && (s *= 10), {
    grid: e,
    wins: t,
    scatterCount: 0,
    scatterPayout: 0,
    freeSpinsAwarded: 0,
    win: s,
    bigWin: s >= n * 10,
    megaWin: s >= n * 25,
    feature: null
  };
}
function ot(e, n, t) {
  if (!nt(n)) return { error: "bad_bet" };
  if (e.credits < n) return { error: "insufficient" };
  e.credits -= n;
  const s = t() < et ? it(t) : null, l = s ? s.steps.at(-1)?.grid ?? Te(t) : Te(t), r = st(l, n);
  return r.feature = s, e.credits += r.win, { ...r, credits: e.credits, freeSpinsLeft: 0, bet: n };
}
function rt(e) {
  const n = /* @__PURE__ */ new Set();
  for (const t of e)
    ee[t.line]?.forEach((l, r) => n.add(`${r}:${l}`));
  return n.size === Z * Be;
}
function at(e, n) {
  if (e.some((r) => r === "blank")) return null;
  const s = e.find((r) => r !== "lion") ?? "lion";
  if (e.some((r) => r !== s && r !== "lion")) return null;
  const l = tt[s];
  return l ? { symbol: s, payout: Math.round(l * n) } : null;
}
function it(e) {
  const n = Ae[Math.floor(e() * Ae.length)] ?? "ingot", t = 3 + Math.floor(e() * 7), s = [];
  for (let a = 0; a < Z; a += 1)
    for (let o = 0; o < Be; o += 1) s.push([a, o]);
  for (let a = s.length - 1; a > 0; a -= 1) {
    const o = Math.floor(e() * (a + 1)), g = s[a];
    s[a] = s[o] ?? g, s[o] = g;
  }
  const l = Array.from({ length: Z }, () => ["blank", "blank", "blank"]), r = [];
  for (const [a, o] of s.slice(0, t)) {
    const g = l[a];
    g && (g[o] = e() < 0.1 ? "lion" : n, r.push({ grid: lt(l) }));
  }
  return { symbol: n, steps: r };
}
function lt(e) {
  return e.map((n) => [...n]);
}
function ct() {
  Ue("slots", {
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
function ut(e, n) {
  return {
    x: e.x - n.x + e.width / 2,
    y: e.y - n.y + e.height / 2
  };
}
function ft(e, n) {
  return e.map((t, s) => {
    const l = n[s]?.[t];
    return l ? `${l.x},${l.y}` : "";
  }).filter((t) => t.length > 0).join(" ");
}
const D = 24, H = 3, te = 3, Le = ["lion", "ingot", "lantern", "fan", "coin", "knot", "spark"], Me = {
  startStagger: 0.11,
  stopStagger: 0.17,
  accel: 0.17,
  cruise: 26,
  minSpin: 2,
  postCruise: 0.25,
  settle: 0.3
}, ue = {
  startStagger: 0,
  stopStagger: 0,
  accel: 0.1,
  cruise: 44,
  minSpin: 0.93,
  postCruise: 0.15,
  settle: 0.15
};
function dt(e = !1) {
  return {
    reels: Array.from({ length: H }, (n, t) => ({
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
        { length: D },
        (s, l) => Le[(t * 3 + l) % Le.length] ?? "spark"
      )
    })),
    spinAge: 0,
    schedule: Array.from({ length: H }, () => Number.POSITIVE_INFINITY),
    result: null,
    quick: !1,
    tease: !1,
    reduced: e,
    slam: !1
  };
}
function X(e, n) {
  let t = Oe(e + n);
  return t > te + 1 && (t -= D), t;
}
function pt(e, n) {
  return Oe(n - Math.round(e));
}
function Ce(e, n) {
  e.result = null, e.quick = !1, e.tease = !1, e.spinAge = 0, e.schedule = e.schedule.map(() => Number.POSITIVE_INFINITY), e.reels.forEach((t, s) => {
    const l = ge(n[s]);
    t.target = l, t.phase = "idle", t.speed = 0, t.landed = !0, t.offset = 0, pe(t, 0, l);
  });
}
function Ie(e) {
  e.result = null, e.quick = !1, e.tease = !1, e.slam = !1, e.spinAge = 0, e.schedule = e.schedule.map(() => Number.POSITIVE_INFINITY);
  const n = ne(e).startStagger;
  e.reels.forEach((t, s) => {
    t.phase = "wait", t.startAt = s * n, t.speed = 0, t.accelElapsed = 0, t.stopStartedAt = -1, t.landed = !1, t.elapsed = 0;
  });
}
function gt(e) {
  if (e.reduced || (e.quick = !0, e.tease = !1, !e.result)) return;
  const n = ue.settle;
  e.reels.forEach((t, s) => {
    t.phase === "stop" ? t.duration = Math.min(t.duration, n) : t.landed || (e.schedule[s] = e.spinAge + s * ue.stopStagger);
  });
}
function _e(e) {
  if (e.slam = !0, e.quick = !0, !!e.result)
    for (let n = 0; n < H; n += 1) {
      const t = e.reels[n];
      !t || t.landed || (t.phase === "wait" && (t.phase = "spin"), t.phase === "stop" ? t.duration - t.elapsed > fe && (t.from = t.offset, t.elapsed = 0, t.duration = fe) : e.schedule[n] = e.spinAge);
    }
}
function ce(e, n) {
  if (e.result = n, e.slam) {
    for (let r = 0; r < H; r += 1) {
      const a = e.reels[r];
      if (!a || a.phase !== "stop") continue;
      const o = ge(n[r]);
      pe(a, a.stopAt, o), a.target = o;
    }
    _e(e);
    return;
  }
  const t = ne(e), s = (H - 1) * t.stopStagger + t.settle, l = Math.max(t.minSpin - s, e.spinAge + t.postCruise);
  for (let r = 0; r < H; r += 1)
    e.schedule[r] = l + r * t.stopStagger;
}
function mt(e, n) {
  const t = Math.min(0.1, Math.max(0, n));
  e.spinAge += t;
  const s = ne(e), l = { moving: !1, ticks: [], landed: [], scatters: [] };
  let r = 0;
  for (let a = 0; a < H; a += 1) {
    const o = e.reels[a];
    if (o) {
      if (o.phase === "wait" && e.spinAge >= o.startAt && (o.phase = "spin", o.accelElapsed = 0), o.phase === "wait")
        l.moving = !0;
      else if (o.phase === "spin") {
        l.moving = !0;
        const g = e.reduced ? 10 : s.cruise, v = e.reduced ? 0.12 : s.accel;
        o.accelElapsed += t;
        const A = Math.sin(Math.min(1, o.accelElapsed / v) * (Math.PI / 2));
        let T = g * A;
        e.tease && e.result && !e.quick && !e.reduced && (T = Math.min(T, 9));
        const W = Math.floor(o.offset);
        o.offset += T * t, o.speed = T;
        const k = Math.floor(o.offset);
        o.tickAt += t;
        const q = o.speed > 16 ? 0.08 : 0.045;
        !e.reduced && k !== W && o.tickAt > q && (o.tickAt = 0, l.ticks.push(a));
        const B = e.schedule[a] ?? Number.POSITIVE_INFINITY, N = bt(e, a, s.stopStagger);
        e.result && e.spinAge >= B && (N || e.quick) && ht(e, a);
      } else if (o.phase === "stop") {
        l.moving = !0, o.elapsed += t;
        const v = 2 * (o.stopAt - o.from) / o.duration, A = v / o.duration, T = Math.min(o.duration, o.elapsed);
        o.offset = o.from + v * T - 0.5 * A * T * T, o.speed = Math.max(0, v - A * T), o.offset > o.stopAt && (o.offset = o.stopAt), o.elapsed >= o.duration && (o.offset = o.stopAt, o.phase = "idle", o.speed = 0, o.landed = !0, l.landed.push(a), o.target.includes("lion") && l.scatters.push(a));
      }
      if (o.landed)
        for (const g of o.target) g === "lion" && (r += 1);
    }
  }
  if (!e.tease && r >= 2 && e.reels.some((a) => !a.landed)) {
    e.tease = !0;
    const a = e.reduced || e.quick ? 0.05 : 0.62;
    e.reels.forEach((o, g) => {
      if (o.landed || o.phase === "stop") return;
      const v = e.schedule[g] ?? 0;
      e.schedule[g] = Math.max(v, e.spinAge + a * (g + 1));
    });
  }
  return l;
}
function ht(e, n) {
  const t = e.reels[n];
  if (!t || t.phase !== "spin") return;
  const s = ge(e.result?.[n]);
  t.target = s;
  const l = ne(e), r = e.reduced ? 0.2 : e.tease && !e.quick ? 0.7 : l.settle, a = e.reduced ? 10 : l.cruise, o = Math.max(te + 1.25, 0.5 * a * r), g = Math.ceil(t.offset + o);
  pe(t, g, s), t.stopAt = g, t.from = t.offset, t.elapsed = 0;
  const v = Math.max(1e-3, g - t.offset);
  t.duration = e.slam ? Math.min(fe, 2 * v / Math.max(a, 1)) : 2 * v / a, t.stopStartedAt = e.spinAge, t.phase = "stop";
}
function bt(e, n, t) {
  if (n === 0) return !0;
  const s = e.reels[n - 1];
  return !s || s.stopStartedAt < 0 ? !1 : e.spinAge >= s.stopStartedAt + t;
}
function ne(e) {
  return e.reduced ? { ...Me, startStagger: 0.02, stopStagger: 0.04, minSpin: 0.4 } : e.quick ? ue : Me;
}
function pe(e, n, t) {
  for (let s = 0; s < te; s += 1) {
    const l = t[s] ?? "spark", r = pt(n, s);
    e.symbols[r] = l;
  }
}
function ge(e) {
  return [e?.[0] ?? "spark", e?.[1] ?? "knot", e?.[2] ?? "coin"];
}
const fe = 0.12;
function Oe(e) {
  return (e % D + D) % D;
}
const qe = "http://www.w3.org/2000/svg", yt = {
  lion: { text: "W", tier: "wild" },
  ingot: { text: "A", tier: "a" },
  lantern: { text: "K", tier: "k" },
  fan: { text: "Q", tier: "q" },
  coin: { text: "J", tier: "low" },
  knot: { text: "10", tier: "low" },
  spark: { text: "9", tier: "low" },
  blank: { text: "", tier: "blank" }
}, St = /* @__PURE__ */ new Set(["lion", "ingot", "lantern", "fan"]), vt = 8, wt = [22, 23, 0, 1, 2, 3, 4, 5];
function kt(e) {
  const n = window.matchMedia("(prefers-reduced-motion: reduce)").matches, t = dt(n);
  e.replaceChildren(), e.classList.add("lion-board");
  const s = document.createElement("div");
  s.className = "lion-window", e.appendChild(s);
  const l = t.reels.map((i, p) => {
    const c = document.createElement("div");
    c.className = "lion-col", c.dataset.reel = String(p);
    const d = document.createElement("div");
    d.className = "lion-strip";
    const m = [];
    for (let f = 0; f < vt; f += 1) {
      const y = wt[f] ?? f, I = document.createElement("div");
      I.className = "lion-strip-cell";
      const E = document.createElement("span"), S = i.symbols[y] ?? "spark";
      Ne(E, S), I.appendChild(E), d.appendChild(I), m.push({ el: I, glyph: E, index: y, symbol: S, prevPos: X(y, 0) });
    }
    return c.appendChild(d), s.appendChild(c), { column: c, strip: d, cells: m };
  }), r = document.createElementNS(qe, "svg");
  r.setAttribute("class", "lion-lines"), s.appendChild(r);
  let a = [], o = 0, g = 0, v = [];
  const A = () => {
    const i = l[0];
    if (!i) return;
    const p = i.column.clientHeight;
    if (p < 24) return;
    const c = Math.max(4, p * 0.028), d = (p - 2 * c) / 3;
    e.style.setProperty("--cell", `${d}px`), e.style.setProperty("--reel-gap", `${c}px`), e.style.setProperty("--glyph", `${Math.round(d * 0.58)}px`), e.style.setProperty("--glyph-wide", `${Math.round(d * 0.46)}px`), g = d + c;
  };
  function T(i, p, c, d) {
    const m = c < -0.35 || c > te - 0.05;
    i.symbol === p || !d && !m || (i.symbol = p, Ne(i.glyph, p));
  }
  function W(i, p, c) {
    let d = -1, m = 99;
    for (let f = 0; f < D; f += 1) {
      if (c.has(f)) continue;
      const y = X(f, p);
      y < -0.55 && y > -2.6 && y < m && (d = f, m = y);
    }
    d < 0 || (c.delete(i.index), i.index = d, c.add(d), i.prevPos = m);
  }
  function k() {
    g < 8 && A(), t.reels.forEach((i, p) => {
      const c = l[p];
      if (!c || g < 8) return;
      const d = new Set(c.cells.map((f) => f.index)), m = i.landed && i.phase === "idle";
      for (const f of c.cells) {
        let y = X(f.index, i.offset);
        (y < f.prevPos - 6 || y < -3) && (W(f, i.offset, d), y = X(f.index, i.offset)), f.prevPos = y, f.el.style.transform = `translate3d(0, ${y * g}px, 0)`, T(f, i.symbols[f.index] ?? "spark", y, m);
      }
    });
  }
  function q(i) {
    const p = i.column.getBoundingClientRect();
    return i.cells.map((c) => ({ el: c.el, box: c.el.getBoundingClientRect() })).filter(({ box: c }) => {
      const d = c.top + c.height / 2;
      return d >= p.top - 1 && d <= p.bottom + 1;
    }).sort((c, d) => c.box.top - d.box.top).slice(0, 3).map((c) => c.el);
  }
  function B() {
    const i = s.getBoundingClientRect();
    return l.map(
      (p) => q(p).map((c) => ut(c.getBoundingClientRect(), i))
    );
  }
  function N() {
    const i = s.clientWidth, p = s.clientHeight;
    if (r.setAttribute("viewBox", `0 0 ${i} ${p}`), r.replaceChildren(), i < 8 || p < 8) return;
    const c = B();
    for (const d of v) {
      const m = ee[d.line];
      if (!m) continue;
      const f = document.createElementNS(qe, "polyline");
      f.setAttribute("points", ft(m.slice(0, d.count), c)), f.setAttribute("class", "lion-payline"), r.appendChild(f);
    }
  }
  function b() {
    v = [];
    for (const i of l)
      for (const p of i.cells) p.el.classList.remove("is-win", "is-lock", "is-dim");
    r.replaceChildren();
  }
  function P(i) {
    for (const p of l)
      for (const c of p.cells) c.el.classList.remove("is-lock");
    i.forEach((p, c) => {
      const d = l[c] ? q(l[c]) : [];
      p.forEach((m, f) => {
        m !== "blank" && d[f]?.classList.add("is-lock");
      });
    });
  }
  function G() {
    if (o >= a.length - 1) return !1;
    o += 1;
    const i = a[o];
    return i ? (Ie(t), t.quick = !0, ce(t, i), P(i), !0) : !1;
  }
  A();
  const C = new ResizeObserver(() => {
    A(), k(), N();
  });
  return C.observe(e), k(), {
    show(i) {
      a = [], o = 0, Ce(t, i), b(), k();
    },
    spin() {
      Ie(t), b(), k();
    },
    turbo() {
      gt(t);
    },
    slam() {
      const i = a.length > 1 ? a[a.length - 1] : null;
      if (i) {
        o = a.length - 1, t.slam = !0, ce(t, i);
        return;
      }
      _e(t);
    },
    deliver(i, p) {
      a = p?.steps.map((c) => c.grid) ?? [i], a[0] || (a = [i]), o = t.slam ? a.length - 1 : 0, ce(t, a[o] ?? i);
    },
    update(i, p) {
      const c = mt(t, i);
      if (p && !n) {
        c.ticks.length && p.playTone({ frequency: 620, duration: 0.02, type: "square", gain: 0.01 });
        for (const m of c.landed)
          p.playTone({
            frequency: 220 + m * 70,
            duration: 0.05,
            type: "triangle",
            gain: 0.03
          });
      }
      if (!c.moving && a.length > 1) {
        const m = a[o];
        m && P(m);
      }
      const d = c.moving || G();
      return k(), d;
    },
    celebrate(i) {
      v = i;
      const p = /* @__PURE__ */ new Set();
      for (const c of l)
        for (const d of c.cells) d.el.classList.remove("is-win", "is-dim");
      for (const c of i) {
        const d = ee[c.line];
        if (d)
          for (let m = 0; m < c.count; m += 1)
            p.add(`${m}:${d[m] ?? 1}`);
      }
      l.forEach((c, d) => {
        q(c).forEach((m, f) => {
          i.length !== 0 && (p.has(`${d}:${f}`) ? m.classList.add("is-win") : m.classList.add("is-dim"));
        });
      }), N();
    },
    resize() {
      A(), k(), N();
    },
    abort() {
      a = [], o = 0, Ce(
        t,
        t.reels.map((i) => i.target)
      ), b(), k();
    },
    destroy() {
      C.disconnect(), e.replaceChildren();
    }
  };
}
function Ne(e, n) {
  const t = yt[n];
  e.textContent = t.text, e.dataset.symbol = n, e.className = `lion-glyph is-${t.tier}${St.has(n) ? " is-big" : ""}`;
}
function Et() {
  let e = !1, n = 0;
  return {
    tryAcquire() {
      return e ? !1 : (e = !0, n += 1, !0);
    },
    release() {
      e = !1;
    },
    get requests() {
      return n;
    },
    get locked() {
      return e;
    }
  };
}
const xt = {}, At = {
  lion: "W",
  ingot: "A",
  lantern: "K",
  fan: "Q",
  coin: "J",
  knot: "10",
  spark: "9",
  blank: ""
}, Pe = [
  ["spark", "ingot", "coin"],
  ["knot", "lantern", "spark"],
  ["coin", "fan", "knot"]
], de = "wgf:slots-wallet", We = "wgf:slots-token", Tt = "wgf:session";
function Ot() {
  ct();
  let e = null;
  const n = [];
  let t = null, s = J(), l = 20, r = !1, a = !1, o = 0, g = null, v = !1, A = 0, T = 0, W = !1, k = "pending", q = !1, B = null, N = 0, b = "", P = "", G = 0, C = 0, i = "ready", p = 0, c = 0, d = !1, m = 0, f = 0;
  const y = Et();
  let I = null, E = null;
  function S(u, w) {
    return Ke(e?.store.getState().ui.locale ?? "zh", u, w);
  }
  function se(u, w) {
    w === "spin" && u.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), w === "stop" && u.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), w === "win" && u.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), w === "big" && u.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), w === "scatter" && u.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function R() {
    e && ie(e.store, {
      id: Y.id,
      status: i,
      score: A,
      highScore: Math.max(T, A),
      message: b,
      detail: Re(k, S),
      combo: s.freeSpins,
      credits: s.credits
    });
  }
  function x() {
    if (!t) return;
    const u = t.querySelector("[data-credits]"), w = t.querySelector("[data-message]"), L = t.querySelector("[data-amount]"), z = t.querySelector("[data-clock]"), U = t.querySelector("[data-bet-dec]"), M = t.querySelector("[data-bet-inc]"), h = t.querySelector("[data-spin-no]"), V = t.querySelector("[data-mult]"), K = t.querySelector("[data-demo]"), F = t.querySelector("[data-feature]"), _ = t.querySelector("[data-feature-glyph]"), ye = t.querySelector("[data-source]");
    if (u && (u.textContent = String(s.credits)), L && (L.textContent = String(l)), z) {
      const O = /* @__PURE__ */ new Date();
      z.textContent = `${O.getHours()}:${String(O.getMinutes()).padStart(2, "0")}`;
    }
    if (h && (h.textContent = p > 0 ? String(p) : "—"), V && (V.textContent = `${c}×`), K && (K.hidden = k !== "local"), F && (F.hidden = !I), _ && I && (_.textContent = At[I], _.className = `is-${I}`), ye && (ye.textContent = Re(k, S)), w) {
      const O = b === S("slots.place") || b === S("slots.ready"), ae = b.length > 0 && !O;
      w.hidden = !ae, w.textContent = ae ? b : "", w.classList.toggle("is-win", ae && /赢得|Won/.test(b));
    }
    t.dataset.spins = String(y.requests), t.dataset.round = r || f > 0 ? "busy" : "open";
    const Se = $.indexOf(l);
    U && (U.disabled = r || Se <= 0), M && (M.disabled = r || Se >= $.length - 1), t.querySelectorAll("[data-bet]").forEach((O) => {
      O.classList.toggle("is-bet", Number(O.dataset.bet) === l), O.disabled = r;
    });
    const oe = t.querySelector("[data-spin]"), ve = t.querySelector("[data-note]");
    ve && (ve.textContent = S("slots.note"));
    const re = t.querySelector("[data-auto]");
    t.classList.toggle("is-spinning", r || f > 0), r || (t.dataset.reels = "settled"), oe && (oe.disabled = !q || i !== "running", oe.setAttribute("aria-label", S(r ? "slots.stop" : "slots.spin")));
    const we = t.querySelector("[data-turbo]");
    we && we.classList.toggle("is-on", d), re && (re.setAttribute("aria-pressed", a ? "true" : "false"), re.disabled = i !== "running" || r);
    const ke = t.querySelector("[data-big]"), Ee = t.querySelector("[data-big-value]");
    ke && (ke.hidden = !P), Ee && C <= 0 && (Ee.textContent = P);
  }
  function j() {
    k === "local" && localStorage.setItem(de, JSON.stringify(s));
  }
  function he(u) {
    s = {
      credits: u.credits,
      freeSpins: u.freeSpinsLeft,
      freeBet: u.freeSpinsLeft > 0 ? u.bet : s.freeBet
    }, j(), g = u, v = !1, o = 0, P = "", C = 0, b = S("slots.place"), I = u.feature?.symbol ?? null, A += u.win, p += 1, c = u.bet > 0 ? Math.round(u.win / u.bet * 10) / 10 : 0, E?.deliver(u.grid, u.feature), R(), x();
  }
  async function Q() {
    if (!y.tryAcquire()) return;
    if (!e || i !== "running" || !q || k === "pending" || f > 0) {
      y.release();
      return;
    }
    if (s.freeSpins <= 0 && s.credits < l) {
      b = S("slots.broke"), a = !1, y.release(), R(), x();
      return;
    }
    r = !0, m = 0, f = 0, b = "", I = null, P = "", C = 0, v = !1, E?.spin(), d && E?.turbo(), e && se(e.audio, "spin");
    const u = N, w = B ?? Mt();
    if (B = w, x(), k === "local") {
      const L = ot(s, l, Math.random);
      if (u !== N || !e) return;
      if (B = null, "error" in L) {
        r = !1, E?.abort(), b = L.error === "insufficient" ? S("slots.broke") : S("slots.badBet"), a = !1, y.release(), R(), x();
        return;
      }
      he(L);
      return;
    }
    try {
      const L = await qt(l, w);
      if (u !== N || !e) return;
      B = null, he(L);
    } catch {
      if (u !== N || !e) return;
      r = !1, E?.abort(), a = !1, b = S("slots.retry"), y.release(), R(), x();
    }
  }
  function Fe() {
    if (!g || !e) return;
    r = !1, E?.celebrate(g.wins), g.win > 0 ? (b = S("slots.won", { n: g.win }), se(e.audio, g.bigWin ? "big" : "win")) : b = S("slots.place"), g.feature && (b = S("slots.feature", {
      message: b,
      symbol: S(`slots.symbol.${g.feature.symbol}`)
    }), se(e.audio, "scatter")), g.bigWin && (P = "0", G = 0, C = g.win, a = !1), A > T && Je(Y.id, A), s.credits < $[0] && s.freeSpins === 0 && (a = !1, i = "over", b = S("slots.empty"), W || (W = !0, e.events.emit("game:over", {
      gameId: Y.id,
      score: A,
      best: Math.max(T, A),
      isRecord: A > T
    }))), g = null, o = a ? 0.7 : 0, f = Ye(b) ? 1 : 0, f <= 0 && y.release(), R(), x();
  }
  function Ye(u) {
    return /赢得|Won|奇缘|fortune/i.test(u);
  }
  async function De() {
    if (!await Pt()) {
      k = "local", q = !0, s = $e(), j(), b = S("slots.place"), R(), x();
      return;
    }
    try {
      const w = await It();
      k = "server", q = !0, s = Ge(w), b = S("slots.place"), R(), x();
    } catch {
      k = "local", q = !0, s = $e(), j(), b = S("slots.place"), R(), x();
    }
  }
  function be(u) {
    l = 20, r = !1, a = !1, g = null, v = !1, o = 0, f = 0, y.release(), A = 0, W = !1, P = "", C = 0, E?.abort(), E?.show(Pe), b = S("slots.place"), i = u ? "running" : "ready", R(), x();
  }
  async function ze() {
    if (N += 1, B = null, T = xe(Y.id), k === "server")
      try {
        s = await Nt();
      } catch {
        b = S("slots.resetFail"), R(), x();
        return;
      }
    else k === "local" && (localStorage.removeItem(de), s = J(), j());
    be(!0);
  }
  return Ve(Y, {
    async onPreload(u, w) {
      await u.preload([], w);
    },
    async onMount(u) {
      e = u, u.container.setAttribute("data-wgf-game", "wgf-game:slots"), t = document.createElement("div"), t.className = "slots", t.innerHTML = Lt();
      const w = t.querySelector("[data-reels]");
      w instanceof HTMLElement && (E = await kt(w), E.show(Pe)), u.container.appendChild(t), T = xe(Y.id);
      const L = t;
      L.addEventListener("click", (M) => {
        const h = M.target;
        if (!(h instanceof Element)) return;
        if (h.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        if (r && (h.closest("[data-spin]") || h.closest("[data-reels]"))) {
          E?.slam();
          return;
        }
        if (f > 0 && h.closest("[data-spin]")) {
          f = 0, y.release(), x();
          return;
        }
        const V = h.closest("[data-bet]"), K = V instanceof HTMLElement ? Number(V.dataset.bet) : Number.NaN;
        if ($.includes(K) && !r) {
          l = K, L.classList.remove("is-bets"), x();
          return;
        }
        if (h.closest("[data-bet-dec]")) {
          const F = $.indexOf(l), _ = $[F - 1];
          !r && _ !== void 0 && (l = _), L.classList.remove("is-bets"), x();
          return;
        }
        if (h.closest("[data-bet-inc]")) {
          const F = $.indexOf(l), _ = $[F + 1];
          !r && _ !== void 0 && (l = _), L.classList.remove("is-bets"), x();
          return;
        }
        if (h.closest("[data-peek]")) {
          L.classList.toggle("is-panels");
          return;
        }
        if (h.closest("[data-amount-bar]")) {
          r || L.classList.toggle("is-bets");
          return;
        }
        if (L.classList.contains("is-bets") && !h.closest("[data-bet-ui]") && L.classList.remove("is-bets"), h.closest("[data-turbo]")) {
          r || (d = !d, x());
          return;
        }
        h.closest("[data-spin]") && Q(), h.closest("[data-auto]") && (a = !a, a && !r && f <= 0 && Q(), x());
      }), be(!1), De();
      const z = () => E?.resize(), U = (M) => {
        if (M.key !== " " && M.key !== "Enter") return;
        const h = M.target;
        if (!(h instanceof HTMLElement && h.closest("input, textarea, select")) && !document.querySelector("[data-menu-sheet]")) {
          if (M.preventDefault(), r) {
            E?.slam();
            return;
          }
          f > 0 || i !== "running" || Q();
        }
      };
      window.addEventListener("resize", z), window.addEventListener("keydown", U), n.push(() => window.removeEventListener("resize", z)), n.push(() => window.removeEventListener("keydown", U)), n.push(
        u.loop.onUpdate((M) => {
          if (r && E) {
            const h = E.update(M, u.audio);
            t && (t.dataset.reels = h ? "spinning" : "settled"), g && !h && !v ? (m += M, m >= 0.22 && (v = !0, Fe())) : h && (m = 0);
          }
          if (C > 0 && t) {
            G = Math.min(C, G + C * M * 0.95);
            const h = t.querySelector("[data-big-value]");
            h && (h.textContent = String(Math.round(G))), G >= C - 0.4 && (P = String(Math.round(C)), C = 0, h && (h.textContent = P));
          }
          f > 0 && (f = Math.max(0, f - M), f === 0 && (y.release(), x())), !r && f <= 0 && a && i === "running" && o > 0 && (o -= M, o <= 0 && Q());
        }),
        u.store.subscribe((M, h) => {
          M.ui.locale !== h.ui.locale && x();
        }),
        u.events.on("game:start", () => {
          i === "ready" && (i = "running", b = S("slots.ready"), R(), x());
        }),
        u.events.on("game:restart", () => {
          ze();
        })
      );
    },
    onPause(u) {
      u.store.getState().game.status === "running" && ie(u.store, { status: "paused" });
    },
    onResume(u) {
      u.store.getState().game.status === "paused" && ie(u.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const u of n) u();
      n.length = 0, E?.destroy(), E = null, t?.remove(), t = null, e = null;
    }
  });
}
function Lt() {
  const e = $.map(
    (t) => `<button type="button" data-bet="${t}">${t}</button>`
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
  ].map(([t, s, l]) => `<li><b class="is-${l}">${t}</b><span>${s}</span></li>`).join("")}</ul>
      </aside>
    </div>
    <div class="slots-dock">
      <div class="slots-betui" data-bet-ui>
        <div class="slots-betpill">
          <button type="button" data-bet-dec aria-label="减少注额">−</button>
          <button type="button" class="slots-bet-value" data-amount-bar>
            <span>AMOUNT</span>
            <strong data-amount>20</strong>
          </button>
          <button type="button" data-bet-inc aria-label="增加注额">+</button>
        </div>
        <div class="slots-betlist" data-bet-sheet>${e}</div>
      </div>
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
function Re(e, n) {
  return n(e === "server" ? "slots.server" : e === "local" ? "slots.local" : "slots.pending");
}
function Mt() {
  return `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function $e() {
  try {
    const e = localStorage.getItem(de);
    if (!e) return J();
    const n = JSON.parse(e);
    return !n || typeof n.credits != "number" ? J() : {
      credits: Math.max(0, Math.floor(n.credits)),
      freeSpins: Math.max(0, Math.floor(n.freeSpins ?? 0)),
      freeBet: typeof n.freeBet == "number" ? n.freeBet : 20
    };
  } catch {
    return J();
  }
}
function Ge(e) {
  return {
    credits: e.credits,
    freeSpins: e.freeSpins,
    freeBet: e.freeBet
  };
}
function me() {
  const e = new je(), n = Ct(), t = $t();
  if (n) e.set({ accessToken: n });
  else if (t?.accessToken && !t.accessToken.startsWith("local."))
    e.set({ accessToken: t.accessToken, refreshToken: t.refreshToken });
  else {
    const s = Rt();
    s && e.set({ accessToken: s });
  }
  return new Qe({ baseUrl: He(), tokens: e, timeoutMs: 2500 });
}
function Ct() {
  try {
    const e = sessionStorage.getItem("wgf:launch-token");
    return e && e.length >= 8 ? e : null;
  } catch {
    return null;
  }
}
async function It() {
  const e = await me().post("/api/slots/session", {});
  return e.walletToken && localStorage.setItem(We, e.walletToken), e;
}
async function qt(e, n) {
  return me().post("/api/slots/spin", { bet: e, spinId: n });
}
async function Nt() {
  const e = await me().post("/api/slots/reset", {});
  return Ge(e);
}
async function Pt() {
  try {
    return (await fetch(`${He()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
function He() {
  return xt?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function Rt() {
  const e = localStorage.getItem(We);
  return e && e.startsWith("v1w.") ? e : null;
}
function $t() {
  try {
    const e = localStorage.getItem(Tt);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
export {
  Ot as createGame,
  Y as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
