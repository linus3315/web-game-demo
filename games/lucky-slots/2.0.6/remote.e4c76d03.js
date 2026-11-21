import { registerStrings as Ve, defineGame as Ke, patchGame as ce, readHighScore as xe, t as Je, writeHighScore as je } from "@wgf/core";
import { TokenStore as Qe, HttpClient as Xe } from "@wgf/net";
const Ze = {
  background: "#2a140c",
  shapes: [
    { tag: "rect", attrs: { x: 48, y: 56, width: 224, height: 120, rx: 16, fill: "#1a0d08" } },
    { tag: "circle", attrs: { cx: 92, cy: 116, r: 22, fill: "#ff4d6d" } },
    { tag: "circle", attrs: { cx: 148, cy: 116, r: 22, fill: "#ffb703" } },
    { tag: "circle", attrs: { cx: 204, cy: 116, r: 22, fill: "#f6f1e7" } },
    { tag: "rect", attrs: { x: 118, y: 188, width: 84, height: 28, rx: 14, fill: "#ff5a1f" } }
  ]
}, z = {
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
  art: Ze,
  renderer: "dom",
  controls: "pointer",
  tags: ["拉霸", "联网"],
  theme: { accent: "#ffb703", accentInk: "#2a1408", glow: "#ff5a1f", radius: 18, font: "serif" }
}, R = [10, 20, 50, 100], et = 1e3, ne = 3, _e = 3, tt = 1 / 130, ue = [
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
], se = [
  [1, 1, 1],
  [0, 0, 0],
  [2, 2, 2],
  [0, 1, 2],
  [2, 1, 0]
], nt = {
  lion: 50,
  ingot: 20,
  lantern: 5,
  fan: 2,
  coin: 1.6,
  knot: 1,
  spark: 0.6
}, Te = ["ingot", "lantern", "fan", "coin", "knot", "spark"];
function st(e) {
  return R.includes(e);
}
function Z() {
  return { credits: et, freeSpins: 0, freeBet: 20 };
}
function Me(e) {
  return Array.from({ length: ne }, () => {
    const n = Math.floor(e() * ue.length);
    return [0, 1, 2].map((t) => ue[(n + t) % ue.length] ?? "spark");
  });
}
function ot(e, n) {
  const t = [];
  se.forEach((c, r) => {
    const u = c.map((g, w) => e[w]?.[g] ?? "blank"), s = it(u, n);
    s && t.push({ line: r, symbol: s.symbol, count: 3, payout: s.payout });
  });
  let o = t.reduce((c, r) => c + r.payout, 0);
  return at(t) && o > 0 && (o *= 10), {
    grid: e,
    wins: t,
    scatterCount: 0,
    scatterPayout: 0,
    freeSpinsAwarded: 0,
    win: o,
    bigWin: o >= n * 10,
    megaWin: o >= n * 25,
    feature: null
  };
}
function rt(e, n, t) {
  if (!st(n)) return { error: "bad_bet" };
  if (e.credits < n) return { error: "insufficient" };
  e.credits -= n;
  const o = t() < tt ? lt(t) : null, c = o ? o.steps.at(-1)?.grid ?? Me(t) : Me(t), r = ot(c, n);
  return r.feature = o, e.credits += r.win, { ...r, credits: e.credits, freeSpinsLeft: 0, bet: n };
}
function at(e) {
  const n = /* @__PURE__ */ new Set();
  for (const t of e)
    se[t.line]?.forEach((c, r) => n.add(`${r}:${c}`));
  return n.size === ne * _e;
}
function it(e, n) {
  if (e.some((r) => r === "blank")) return null;
  const o = e.find((r) => r !== "lion") ?? "lion";
  if (e.some((r) => r !== o && r !== "lion")) return null;
  const c = nt[o];
  return c ? { symbol: o, payout: Math.round(c * n) } : null;
}
function lt(e) {
  const n = Te[Math.floor(e() * Te.length)] ?? "ingot", t = 3 + Math.floor(e() * 7), o = [];
  for (let u = 0; u < ne; u += 1)
    for (let s = 0; s < _e; s += 1) o.push([u, s]);
  for (let u = o.length - 1; u > 0; u -= 1) {
    const s = Math.floor(e() * (u + 1)), g = o[u];
    o[u] = o[s] ?? g, o[s] = g;
  }
  const c = Array.from({ length: ne }, () => ["blank", "blank", "blank"]), r = [];
  for (const [u, s] of o.slice(0, t)) {
    const g = c[u];
    g && (g[s] = e() < 0.1 ? "lion" : n, r.push({ grid: ct(c) }));
  }
  return { symbol: n, steps: r };
}
function ct(e) {
  return e.map((n) => [...n]);
}
function ut() {
  Ve("slots", {
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
function dt(e, n) {
  return {
    x: e.x - n.x + e.width / 2,
    y: e.y - n.y + e.height / 2
  };
}
function ft(e, n) {
  return e.map((t, o) => {
    const c = n[o]?.[t];
    return c ? `${c.x},${c.y}` : "";
  }).filter((t) => t.length > 0).join(" ");
}
const U = 24, D = 3, oe = 3, Le = ["lion", "ingot", "lantern", "fan", "coin", "knot", "spark"], Ce = {
  startStagger: 0.11,
  stopStagger: 0.17,
  accel: 0.17,
  cruise: 26,
  minSpin: 2,
  postCruise: 0.25,
  settle: 0.3
}, fe = {
  startStagger: 0,
  stopStagger: 0,
  accel: 0.1,
  cruise: 44,
  minSpin: 0.93,
  postCruise: 0.15,
  settle: 0.15
};
function pt(e = !1) {
  return {
    reels: Array.from({ length: D }, (n, t) => ({
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
        { length: U },
        (o, c) => Le[(t * 3 + c) % Le.length] ?? "spark"
      )
    })),
    spinAge: 0,
    schedule: Array.from({ length: D }, () => Number.POSITIVE_INFINITY),
    result: null,
    quick: !1,
    tease: !1,
    reduced: e,
    slam: !1
  };
}
function te(e, n) {
  let t = We(e + n);
  return t > oe + 1 && (t -= U), t;
}
function gt(e, n) {
  return We(n - Math.round(e));
}
function Ie(e, n) {
  e.result = null, e.quick = !1, e.tease = !1, e.spinAge = 0, e.schedule = e.schedule.map(() => Number.POSITIVE_INFINITY), e.reels.forEach((t, o) => {
    const c = he(n[o]);
    t.target = c, t.phase = "idle", t.speed = 0, t.landed = !0, t.offset = 0, me(t, 0, c);
  });
}
function qe(e) {
  e.result = null, e.quick = !1, e.tease = !1, e.slam = !1, e.spinAge = 0, e.schedule = e.schedule.map(() => Number.POSITIVE_INFINITY);
  const n = re(e).startStagger;
  e.reels.forEach((t, o) => {
    t.phase = "wait", t.startAt = o * n, t.speed = 0, t.accelElapsed = 0, t.stopStartedAt = -1, t.landed = !1, t.elapsed = 0;
  });
}
function mt(e) {
  if (e.reduced || (e.quick = !0, e.tease = !1, !e.result)) return;
  const n = fe.settle;
  e.reels.forEach((t, o) => {
    t.phase === "stop" ? t.duration = Math.min(t.duration, n) : t.landed || (e.schedule[o] = e.spinAge + o * fe.stopStagger);
  });
}
function Oe(e) {
  if (e.slam = !0, e.quick = !0, !!e.result)
    for (let n = 0; n < D; n += 1) {
      const t = e.reels[n];
      !t || t.landed || (t.phase === "wait" && (t.phase = "spin"), t.phase === "stop" ? t.duration - t.elapsed > pe && (t.from = t.offset, t.elapsed = 0, t.duration = pe) : e.schedule[n] = e.spinAge);
    }
}
function de(e, n) {
  if (e.result = n, e.slam) {
    for (let r = 0; r < D; r += 1) {
      const u = e.reels[r];
      if (!u || u.phase !== "stop") continue;
      const s = he(n[r]);
      me(u, u.stopAt, s), u.target = s;
    }
    Oe(e);
    return;
  }
  const t = re(e), o = (D - 1) * t.stopStagger + t.settle, c = Math.max(t.minSpin - o, e.spinAge + t.postCruise);
  for (let r = 0; r < D; r += 1)
    e.schedule[r] = c + r * t.stopStagger;
}
function ht(e, n) {
  const t = Math.min(0.1, Math.max(0, n));
  e.spinAge += t;
  const o = re(e), c = { moving: !1, ticks: [], landed: [], scatters: [] };
  let r = 0;
  for (let u = 0; u < D; u += 1) {
    const s = e.reels[u];
    if (s) {
      if (s.phase === "wait" && e.spinAge >= s.startAt && (s.phase = "spin", s.accelElapsed = 0), s.phase === "wait")
        c.moving = !0;
      else if (s.phase === "spin") {
        c.moving = !0;
        const g = e.reduced ? 10 : o.cruise, w = e.reduced ? 0.12 : o.accel;
        s.accelElapsed += t;
        const E = Math.sin(Math.min(1, s.accelElapsed / w) * (Math.PI / 2));
        let A = g * E;
        e.tease && e.result && !e.quick && !e.reduced && (A = Math.min(A, 9));
        const H = Math.floor(s.offset);
        s.offset += A * t, s.speed = A;
        const M = Math.floor(s.offset);
        s.tickAt += t;
        const L = s.speed > 16 ? 0.08 : 0.045;
        !e.reduced && M !== H && s.tickAt > L && (s.tickAt = 0, c.ticks.push(u));
        const $ = e.schedule[u] ?? Number.POSITIVE_INFINITY, P = yt(e, u, o.stopStagger);
        e.result && e.spinAge >= $ && (P || e.quick) && bt(e, u);
      } else if (s.phase === "stop") {
        c.moving = !0, s.elapsed += t;
        const w = 2 * (s.stopAt - s.from) / s.duration, E = w / s.duration, A = Math.min(s.duration, s.elapsed);
        s.offset = s.from + w * A - 0.5 * E * A * A, s.speed = Math.max(0, w - E * A), s.offset > s.stopAt && (s.offset = s.stopAt), s.elapsed >= s.duration && (s.offset = s.stopAt, s.phase = "idle", s.speed = 0, s.landed = !0, c.landed.push(u), s.target.includes("lion") && c.scatters.push(u));
      }
      if (s.landed)
        for (const g of s.target) g === "lion" && (r += 1);
    }
  }
  if (!e.tease && r >= 2 && e.reels.some((u) => !u.landed)) {
    e.tease = !0;
    const u = e.reduced || e.quick ? 0.05 : 0.62;
    e.reels.forEach((s, g) => {
      if (s.landed || s.phase === "stop") return;
      const w = e.schedule[g] ?? 0;
      e.schedule[g] = Math.max(w, e.spinAge + u * (g + 1));
    });
  }
  return c;
}
function bt(e, n) {
  const t = e.reels[n];
  if (!t || t.phase !== "spin") return;
  const o = he(e.result?.[n]);
  t.target = o;
  const c = re(e), r = e.reduced ? 0.2 : e.tease && !e.quick ? 0.7 : c.settle, u = e.reduced ? 10 : c.cruise, s = Math.max(oe + 1.25, 0.5 * u * r), g = Math.ceil(t.offset + s);
  me(t, g, o), t.stopAt = g, t.from = t.offset, t.elapsed = 0;
  const w = Math.max(1e-3, g - t.offset);
  t.duration = e.slam ? Math.min(pe, 2 * w / Math.max(u, 1)) : 2 * w / u, t.stopStartedAt = e.spinAge, t.phase = "stop";
}
function yt(e, n, t) {
  if (n === 0) return !0;
  const o = e.reels[n - 1];
  return !o || o.stopStartedAt < 0 ? !1 : e.spinAge >= o.stopStartedAt + t;
}
function re(e) {
  return e.reduced ? { ...Ce, startStagger: 0.02, stopStagger: 0.04, minSpin: 0.4 } : e.quick ? fe : Ce;
}
function me(e, n, t) {
  for (let o = 0; o < oe; o += 1) {
    const c = t[o] ?? "spark", r = gt(n, o);
    e.symbols[r] = c;
  }
}
function he(e) {
  return [e?.[0] ?? "spark", e?.[1] ?? "knot", e?.[2] ?? "coin"];
}
const pe = 0.12;
function We(e) {
  return (e % U + U) % U;
}
const X = "http://www.w3.org/2000/svg", St = {
  lion: { text: "W", tier: "wild" },
  ingot: { text: "A", tier: "a" },
  lantern: { text: "K", tier: "k" },
  fan: { text: "Q", tier: "q" },
  coin: { text: "J", tier: "low" },
  knot: { text: "10", tier: "low" },
  spark: { text: "9", tier: "low" },
  blank: { text: "", tier: "blank" }
}, vt = /* @__PURE__ */ new Set(["lion", "ingot", "lantern", "fan"]), wt = 8, kt = [22, 23, 0, 1, 2, 3, 4, 5], Ne = 7;
function At(e) {
  const n = window.matchMedia("(prefers-reduced-motion: reduce)").matches, t = pt(n);
  e.replaceChildren(), e.classList.add("lion-board");
  const o = document.createElement("div");
  o.className = "lion-window", e.appendChild(o);
  const c = document.createElementNS(X, "svg");
  c.setAttribute("class", "lion-blur-defs"), c.setAttribute("aria-hidden", "true"), e.appendChild(c);
  const r = t.reels.map((a, f) => {
    const i = document.createElement("div");
    i.className = "lion-col", i.dataset.reel = String(f);
    const l = document.createElementNS(X, "filter"), p = `lion-blur-${f}`;
    l.setAttribute("id", p), l.setAttribute("x", "-20%"), l.setAttribute("y", "-60%"), l.setAttribute("width", "140%"), l.setAttribute("height", "220%");
    const m = document.createElementNS(X, "feGaussianBlur");
    m.setAttribute("stdDeviation", "0 0"), m.setAttribute("edgeMode", "duplicate"), l.appendChild(m), c.appendChild(l);
    const h = document.createElement("div");
    h.className = "lion-strip";
    const y = [];
    for (let O = 0; O < wt; O += 1) {
      const C = kt[O] ?? O, v = document.createElement("div");
      v.className = "lion-strip-cell";
      const W = document.createElement("span"), V = a.symbols[C] ?? "spark";
      Pe(W, V), v.appendChild(W), h.appendChild(v), y.push({ el: v, glyph: W, index: C, symbol: V, prevPos: te(C, 0) });
    }
    return i.appendChild(h), o.appendChild(i), { column: i, strip: h, cells: y, blur: m, filterId: p, blurAmount: 0 };
  }), u = document.createElementNS(X, "svg");
  u.setAttribute("class", "lion-lines"), o.appendChild(u);
  let s = [], g = 0, w = 0, E = [];
  const A = () => {
    const a = r[0];
    if (!a) return;
    const f = a.column.clientHeight;
    if (f < 24) return;
    const i = Math.max(2, f * 0.012), l = (f - 2 * i) / 3;
    e.style.setProperty("--cell", `${l}px`), e.style.setProperty("--reel-gap", `${i}px`), e.style.setProperty("--glyph", `${Math.round(l * 0.58)}px`), e.style.setProperty("--glyph-wide", `${Math.round(l * 0.46)}px`), w = l + i;
  };
  function H(a, f, i, l) {
    const p = i < -0.35 || i > oe - 0.05;
    a.symbol === f || !l && !p || (a.symbol = f, Pe(a.glyph, f));
  }
  function M(a, f, i) {
    let l = -1, p = 99;
    for (let m = 0; m < U; m += 1) {
      if (i.has(m)) continue;
      const h = te(m, f);
      h < -0.55 && h > -2.6 && h < p && (l = m, p = h);
    }
    l < 0 || (i.delete(a.index), a.index = l, i.add(l), a.prevPos = p);
  }
  function L() {
    w < 8 && A(), t.reels.forEach((a, f) => {
      const i = r[f];
      if (!i || w < 8) return;
      const l = new Set(i.cells.map((m) => m.index)), p = a.landed && a.phase === "idle";
      for (const m of i.cells) {
        let h = te(m.index, a.offset);
        (h < m.prevPos - 6 || h < -3) && (M(m, a.offset, l), h = te(m.index, a.offset)), m.prevPos = h, m.el.style.transform = `translate3d(0, ${h * w}px, 0)`, H(m, a.symbols[m.index] ?? "spark", h, p);
      }
      $(i, a.speed, p || n);
    });
  }
  function $(a, f, i) {
    const l = i || f < 0.5 ? 0 : Math.min(Ne, f / 26 * Ne), p = Math.round(l * 2) / 2;
    if (p !== a.blurAmount) {
      if (a.blurAmount = p, p <= 0) {
        a.column.style.filter = "", a.blur.setAttribute("stdDeviation", "0 0");
        return;
      }
      a.blur.setAttribute("stdDeviation", `0 ${p}`), a.column.style.filter = `url(#${a.filterId})`;
    }
  }
  function P(a) {
    const f = a.column.getBoundingClientRect();
    return a.cells.map((i) => ({ el: i.el, box: i.el.getBoundingClientRect() })).filter(({ box: i }) => {
      const l = i.top + i.height / 2;
      return l >= f.top - 1 && l <= f.bottom + 1;
    }).sort((i, l) => i.box.top - l.box.top).slice(0, 3).map((i) => i.el);
  }
  function S() {
    const a = o.getBoundingClientRect();
    return r.map(
      (f) => P(f).map((i) => dt(i.getBoundingClientRect(), a))
    );
  }
  function q() {
    const a = o.clientWidth, f = o.clientHeight;
    if (u.setAttribute("viewBox", `0 0 ${a} ${f}`), u.replaceChildren(), a < 8 || f < 8) return;
    const i = S();
    for (const l of E) {
      const p = se[l.line];
      if (!p) continue;
      const m = document.createElementNS(X, "polyline");
      m.setAttribute("points", ft(p.slice(0, l.count), i)), m.setAttribute("class", "lion-payline"), u.appendChild(m);
    }
  }
  function B() {
    E = [];
    for (const a of r)
      for (const f of a.cells) f.el.classList.remove("is-win", "is-lock", "is-dim");
    u.replaceChildren();
  }
  function I(a) {
    for (const f of r)
      for (const i of f.cells) i.el.classList.remove("is-lock");
    a.forEach((f, i) => {
      const l = r[i] ? P(r[i]) : [];
      f.forEach((p, m) => {
        p !== "blank" && l[m]?.classList.add("is-lock");
      });
    });
  }
  function N() {
    if (g >= s.length - 1) return !1;
    g += 1;
    const a = s[g];
    return a ? (qe(t), t.quick = !0, de(t, a), I(a), !0) : !1;
  }
  A();
  const F = new ResizeObserver(() => {
    A(), L(), q();
  });
  return F.observe(e), L(), {
    show(a) {
      s = [], g = 0, Ie(t, a), B(), L();
    },
    spin() {
      qe(t), B(), L();
    },
    turbo() {
      mt(t);
    },
    slam() {
      const a = s.length > 1 ? s[s.length - 1] : null;
      if (a) {
        g = s.length - 1, t.slam = !0, de(t, a);
        return;
      }
      Oe(t);
    },
    deliver(a, f) {
      s = f?.steps.map((i) => i.grid) ?? [a], s[0] || (s = [a]), g = t.slam ? s.length - 1 : 0, de(t, s[g] ?? a);
    },
    update(a, f) {
      const i = ht(t, a);
      if (f && !n) {
        i.ticks.length && f.playTone({ frequency: 620, duration: 0.02, type: "square", gain: 0.01 });
        for (const p of i.landed)
          f.playTone({
            frequency: 220 + p * 70,
            duration: 0.05,
            type: "triangle",
            gain: 0.03
          });
      }
      if (!i.moving && s.length > 1) {
        const p = s[g];
        p && I(p);
      }
      const l = i.moving || N();
      return L(), l;
    },
    celebrate(a) {
      E = a;
      const f = /* @__PURE__ */ new Set();
      for (const i of r)
        for (const l of i.cells) l.el.classList.remove("is-win", "is-dim");
      for (const i of a) {
        const l = se[i.line];
        if (l)
          for (let p = 0; p < i.count; p += 1)
            f.add(`${p}:${l[p] ?? 1}`);
      }
      r.forEach((i, l) => {
        P(i).forEach((p, m) => {
          a.length !== 0 && (f.has(`${l}:${m}`) ? p.classList.add("is-win") : p.classList.add("is-dim"));
        });
      }), q();
    },
    resize() {
      A(), L(), q();
    },
    abort() {
      s = [], g = 0, Ie(
        t,
        t.reels.map((a) => a.target)
      ), B(), L();
    },
    destroy() {
      F.disconnect(), e.replaceChildren();
    }
  };
}
function Pe(e, n) {
  const t = St[n];
  e.textContent = t.text, e.dataset.symbol = n, e.className = `lion-glyph is-${t.tier}${vt.has(n) ? " is-big" : ""}`;
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
const xt = {}, Tt = {
  lion: "W",
  ingot: "A",
  lantern: "K",
  fan: "Q",
  coin: "J",
  knot: "10",
  spark: "9",
  blank: ""
}, Re = [
  ["spark", "ingot", "coin"],
  ["knot", "lantern", "spark"],
  ["coin", "fan", "knot"]
], ge = "wgf:slots-wallet", Ge = "wgf:slots-token", Mt = "wgf:session";
function Wt() {
  ut();
  let e = null;
  const n = [];
  let t = null, o = Z(), c = 20, r = !1, u = !1, s = 0, g = null, w = !1, E = 0, A = 0, H = !1, M = "pending", L = !1, $ = null, P = 0, S = "", q = "", B = 0, I = 0, N = "ready", F = 0, a = 0, f = !1, i = 0, l = 0;
  const p = Et();
  let m = null, h = null;
  function y(d, k) {
    return Je(e?.store.getState().ui.locale ?? "zh", d, k);
  }
  function O(d, k) {
    k === "spin" && d.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), k === "stop" && d.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), k === "win" && d.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), k === "big" && d.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), k === "scatter" && d.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function C() {
    e && ce(e.store, {
      id: z.id,
      status: N,
      score: E,
      highScore: Math.max(A, E),
      message: S,
      detail: $e(M, y),
      combo: o.freeSpins,
      credits: o.credits
    });
  }
  function v() {
    if (!t) return;
    const d = t.querySelector("[data-credits]"), k = t.querySelector("[data-message]"), x = t.querySelector("[data-amount]"), K = t.querySelector("[data-clock]"), J = t.querySelector("[data-bet-dec]"), T = t.querySelector("[data-bet-inc]"), b = t.querySelector("[data-spin-no]"), j = t.querySelector("[data-mult]"), Q = t.querySelector("[data-demo]"), Y = t.querySelector("[data-feature]"), _ = t.querySelector("[data-feature-glyph]"), Se = t.querySelector("[data-source]");
    if (d && (d.textContent = String(o.credits)), x && (x.textContent = String(c)), K) {
      const G = /* @__PURE__ */ new Date();
      K.textContent = `${G.getHours()}:${String(G.getMinutes()).padStart(2, "0")}`;
    }
    if (b && (b.textContent = F > 0 ? String(F) : "—"), j && (j.textContent = `${a}×`), Q && (Q.hidden = M !== "local"), Y && (Y.hidden = !m), _ && m && (_.textContent = Tt[m], _.className = `is-${m}`), Se && (Se.textContent = $e(M, y)), k) {
      const G = S === y("slots.place") || S === y("slots.ready"), le = S.length > 0 && !G;
      k.hidden = !le, k.textContent = le ? S : "", k.classList.toggle("is-win", le && /赢得|Won/.test(S));
    }
    t.dataset.spins = String(p.requests), t.dataset.round = r || l > 0 ? "busy" : "open";
    const ve = R.indexOf(c);
    J && (J.disabled = r || ve <= 0), T && (T.disabled = r || ve >= R.length - 1), t.querySelectorAll("[data-bet]").forEach((G) => {
      G.classList.toggle("is-bet", Number(G.dataset.bet) === c), G.disabled = r;
    });
    const ae = t.querySelector("[data-spin]"), we = t.querySelector("[data-note]");
    we && (we.textContent = y("slots.note"));
    const ie = t.querySelector("[data-auto]");
    t.classList.toggle("is-spinning", r || l > 0), r || (t.dataset.reels = "settled"), ae && (ae.disabled = !L || N !== "running", ae.setAttribute("aria-label", y(r ? "slots.stop" : "slots.spin")));
    const ke = t.querySelector("[data-turbo]");
    ke && ke.classList.toggle("is-on", f), ie && (ie.setAttribute("aria-pressed", u ? "true" : "false"), ie.disabled = N !== "running" || r);
    const Ae = t.querySelector("[data-big]"), Ee = t.querySelector("[data-big-value]");
    Ae && (Ae.hidden = !q), Ee && I <= 0 && (Ee.textContent = q);
  }
  function W() {
    M === "local" && localStorage.setItem(ge, JSON.stringify(o));
  }
  function V(d) {
    o = {
      credits: d.credits,
      freeSpins: d.freeSpinsLeft,
      freeBet: d.freeSpinsLeft > 0 ? d.bet : o.freeBet
    }, W(), g = d, w = !1, s = 0, q = "", I = 0, S = y("slots.place"), m = d.feature?.symbol ?? null, E += d.win, F += 1, a = d.bet > 0 ? Math.round(d.win / d.bet * 10) / 10 : 0, h?.deliver(d.grid, d.feature), C(), v();
  }
  async function ee() {
    if (!p.tryAcquire()) return;
    if (!e || N !== "running" || !L || M === "pending" || l > 0) {
      p.release();
      return;
    }
    if (o.freeSpins <= 0 && o.credits < c) {
      S = y("slots.broke"), u = !1, p.release(), C(), v();
      return;
    }
    r = !0, i = 0, l = 0, S = "", m = null, q = "", I = 0, w = !1, h?.spin(), f && h?.turbo(), e && O(e.audio, "spin");
    const d = P, k = $ ?? Ct();
    if ($ = k, v(), M === "local") {
      const x = rt(o, c, Math.random);
      if (d !== P || !e) return;
      if ($ = null, "error" in x) {
        r = !1, h?.abort(), S = x.error === "insufficient" ? y("slots.broke") : y("slots.badBet"), u = !1, p.release(), C(), v();
        return;
      }
      V(x);
      return;
    }
    try {
      const x = await Nt(c, k);
      if (d !== P || !e) return;
      $ = null, V(x);
    } catch {
      if (d !== P || !e) return;
      r = !1, h?.abort(), u = !1, S = y("slots.retry"), p.release(), C(), v();
    }
  }
  function Fe() {
    if (!g || !e) return;
    r = !1, h?.celebrate(g.wins), g.win > 0 ? (S = y("slots.won", { n: g.win }), O(e.audio, g.bigWin ? "big" : "win")) : S = y("slots.place"), g.feature && (S = y("slots.feature", {
      message: S,
      symbol: y(`slots.symbol.${g.feature.symbol}`)
    }), O(e.audio, "scatter")), g.bigWin && (q = "0", B = 0, I = g.win, u = !1), E > A && je(z.id, E), o.credits < R[0] && o.freeSpins === 0 && (u = !1, N = "over", S = y("slots.empty"), H || (H = !0, e.events.emit("game:over", {
      gameId: z.id,
      score: E,
      best: Math.max(A, E),
      isRecord: E > A
    }))), g = null, s = u ? 0.7 : 0, l = Ye(S) ? 1 : 0, l <= 0 && p.release(), C(), v();
  }
  function Ye(d) {
    return /赢得|Won|奇缘|fortune/i.test(d);
  }
  async function ze() {
    if (!await Rt()) {
      M = "local", L = !0, o = Be(), W(), S = y("slots.place"), C(), v();
      return;
    }
    try {
      const k = await qt();
      M = "server", L = !0, o = He(k), S = y("slots.place"), C(), v();
    } catch {
      M = "local", L = !0, o = Be(), W(), S = y("slots.place"), C(), v();
    }
  }
  function ye(d) {
    c = 20, r = !1, u = !1, g = null, w = !1, s = 0, l = 0, p.release(), E = 0, H = !1, q = "", I = 0, h?.abort(), h?.show(Re), S = y("slots.place"), N = d ? "running" : "ready", C(), v();
  }
  async function Ue() {
    if (P += 1, $ = null, A = xe(z.id), M === "server")
      try {
        o = await Pt();
      } catch {
        S = y("slots.resetFail"), C(), v();
        return;
      }
    else M === "local" && (localStorage.removeItem(ge), o = Z(), W());
    ye(!0);
  }
  return Ke(z, {
    async onPreload(d, k) {
      await d.preload([], k);
    },
    async onMount(d) {
      e = d, d.container.setAttribute("data-wgf-game", "wgf-game:slots"), t = document.createElement("div"), t.className = "slots", t.innerHTML = Lt();
      const k = t.querySelector("[data-reels]");
      k instanceof HTMLElement && (h = await At(k), h.show(Re)), d.container.appendChild(t), A = xe(z.id);
      const x = t;
      x.addEventListener("click", (T) => {
        const b = T.target;
        if (!(b instanceof Element)) return;
        if (b.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        if (r && (b.closest("[data-spin]") || b.closest("[data-reels]"))) {
          h?.slam();
          return;
        }
        if (l > 0 && b.closest("[data-spin]")) {
          l = 0, p.release(), v();
          return;
        }
        const j = b.closest("[data-bet]"), Q = j instanceof HTMLElement ? Number(j.dataset.bet) : Number.NaN;
        if (R.includes(Q) && !r) {
          c = Q, x.classList.remove("is-bets"), v();
          return;
        }
        if (b.closest("[data-bet-dec]")) {
          const Y = R.indexOf(c), _ = R[Y - 1];
          !r && _ !== void 0 && (c = _), x.classList.remove("is-bets"), v();
          return;
        }
        if (b.closest("[data-bet-inc]")) {
          const Y = R.indexOf(c), _ = R[Y + 1];
          !r && _ !== void 0 && (c = _), x.classList.remove("is-bets"), v();
          return;
        }
        if (b.closest("[data-peek]")) {
          x.classList.toggle("is-panels");
          return;
        }
        if (b.closest("[data-amount-bar]")) {
          r || x.classList.toggle("is-bets");
          return;
        }
        if (x.classList.contains("is-bets") && !b.closest("[data-bet-ui]") && x.classList.remove("is-bets"), b.closest("[data-turbo]")) {
          r || (f = !f, v());
          return;
        }
        b.closest("[data-spin]") && ee(), b.closest("[data-auto]") && (u = !u, u && !r && l <= 0 && ee(), v());
      }), ye(!1), ze();
      const K = () => h?.resize(), J = (T) => {
        if (T.key !== " " && T.key !== "Enter") return;
        const b = T.target;
        if (!(b instanceof HTMLElement && b.closest("input, textarea, select")) && !document.querySelector("[data-menu-sheet]")) {
          if (T.preventDefault(), r) {
            h?.slam();
            return;
          }
          l > 0 || N !== "running" || ee();
        }
      };
      window.addEventListener("resize", K), window.addEventListener("keydown", J), n.push(() => window.removeEventListener("resize", K)), n.push(() => window.removeEventListener("keydown", J)), n.push(
        d.loop.onUpdate((T) => {
          if (r && h) {
            const b = h.update(T, d.audio);
            t && (t.dataset.reels = b ? "spinning" : "settled"), g && !b && !w ? (i += T, i >= 0.22 && (w = !0, Fe())) : b && (i = 0);
          }
          if (I > 0 && t) {
            B = Math.min(I, B + I * T * 0.95);
            const b = t.querySelector("[data-big-value]");
            b && (b.textContent = String(Math.round(B))), B >= I - 0.4 && (q = String(Math.round(I)), I = 0, b && (b.textContent = q));
          }
          l > 0 && (l = Math.max(0, l - T), l === 0 && (p.release(), v())), !r && l <= 0 && u && N === "running" && s > 0 && (s -= T, s <= 0 && ee());
        }),
        d.store.subscribe((T, b) => {
          T.ui.locale !== b.ui.locale && v();
        }),
        d.events.on("game:start", () => {
          N === "ready" && (N = "running", S = y("slots.ready"), C(), v());
        }),
        d.events.on("game:restart", () => {
          Ue();
        })
      );
    },
    onPause(d) {
      d.store.getState().game.status === "running" && ce(d.store, { status: "paused" });
    },
    onResume(d) {
      d.store.getState().game.status === "paused" && ce(d.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const d of n) d();
      n.length = 0, h?.destroy(), h = null, t?.remove(), t = null, e = null;
    }
  });
}
function Lt() {
  const e = R.map(
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
  ].map(([t, o, c]) => `<li><b class="is-${c}">${t}</b><span>${o}</span></li>`).join("")}</ul>
      </aside>
    </div>
    <div class="slots-dock">
      <div class="slots-betui" data-bet-ui>
        <div class="slots-betrow">
          <button type="button" class="slots-betstep" data-bet-dec aria-label="减少注额">−</button>
          <button type="button" class="slots-bet-value" data-amount-bar aria-label="选择注额">
            <strong data-amount>20</strong>
          </button>
          <button type="button" class="slots-betstep" data-bet-inc aria-label="增加注额">+</button>
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
function $e(e, n) {
  return n(e === "server" ? "slots.server" : e === "local" ? "slots.local" : "slots.pending");
}
function Ct() {
  return `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function Be() {
  try {
    const e = localStorage.getItem(ge);
    if (!e) return Z();
    const n = JSON.parse(e);
    return !n || typeof n.credits != "number" ? Z() : {
      credits: Math.max(0, Math.floor(n.credits)),
      freeSpins: Math.max(0, Math.floor(n.freeSpins ?? 0)),
      freeBet: typeof n.freeBet == "number" ? n.freeBet : 20
    };
  } catch {
    return Z();
  }
}
function He(e) {
  return {
    credits: e.credits,
    freeSpins: e.freeSpins,
    freeBet: e.freeBet
  };
}
function be() {
  const e = new Qe(), n = It(), t = Bt();
  if (n) e.set({ accessToken: n });
  else if (t?.accessToken && !t.accessToken.startsWith("local."))
    e.set({ accessToken: t.accessToken, refreshToken: t.refreshToken });
  else {
    const o = $t();
    o && e.set({ accessToken: o });
  }
  return new Xe({ baseUrl: De(), tokens: e, timeoutMs: 2500 });
}
function It() {
  try {
    const e = sessionStorage.getItem("wgf:launch-token");
    return e && e.length >= 8 ? e : null;
  } catch {
    return null;
  }
}
async function qt() {
  const e = await be().post("/api/slots/session", {});
  return e.walletToken && localStorage.setItem(Ge, e.walletToken), e;
}
async function Nt(e, n) {
  return be().post("/api/slots/spin", { bet: e, spinId: n });
}
async function Pt() {
  const e = await be().post("/api/slots/reset", {});
  return He(e);
}
async function Rt() {
  try {
    return (await fetch(`${De()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
function De() {
  return xt?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function $t() {
  const e = localStorage.getItem(Ge);
  return e && e.startsWith("v1w.") ? e : null;
}
function Bt() {
  try {
    const e = localStorage.getItem(Mt);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
export {
  Wt as createGame,
  z as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
