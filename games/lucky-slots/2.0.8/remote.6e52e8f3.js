import { registerStrings as re, defineGame as ae, patchGame as mt, readHighScore as Rt, afterLayout as ie, bindVisualViewport as le, t as ce, writeHighScore as ue } from "@wgf/core";
import { TokenStore as de, HttpClient as fe } from "@wgf/net";
const pe = {
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
  art: pe,
  renderer: "dom",
  controls: "pointer",
  tags: ["拉霸", "联网"],
  theme: { accent: "#ffb703", accentInk: "#2a1408", glow: "#ff5a1f", radius: 18, font: "serif" }
}, O = [10, 20, 50, 100], ge = 1e3, at = 3, Kt = 3, Jt = 1 / 130, bt = [
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
], it = [
  [1, 1, 1],
  [0, 0, 0],
  [2, 2, 2],
  [0, 1, 2],
  [2, 1, 0]
], he = {
  lion: 50,
  ingot: 20,
  lantern: 5,
  fan: 2,
  coin: 1.6,
  knot: 1,
  spark: 0.6
}, $t = ["ingot", "lantern", "fan", "coin", "knot", "spark"];
function me(t) {
  return O.includes(t);
}
function et() {
  return { credits: ge, freeSpins: 0, freeBet: 20 };
}
function Bt(t) {
  return Array.from({ length: at }, () => {
    const n = Math.floor(t() * bt.length);
    return [0, 1, 2].map((e) => bt[(n + e) % bt.length] ?? "spark");
  });
}
function be(t, n) {
  const e = [];
  it.forEach((l, r) => {
    const c = l.map((p, w) => t[w]?.[p] ?? "blank"), s = ve(c, n);
    s && e.push({ line: r, symbol: s.symbol, count: 3, payout: s.payout });
  });
  let o = e.reduce((l, r) => l + r.payout, 0);
  return Se(e) && o > 0 && (o *= 10), {
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
function ye(t, n, e) {
  if (!me(n)) return { error: "bad_bet" };
  if (t.credits < n) return { error: "insufficient" };
  t.credits -= n;
  const o = e() < Jt ? we(e) : null, l = o ? o.steps.at(-1)?.grid ?? Bt(e) : Bt(e), r = be(l, n);
  return r.feature = o, t.credits += r.win, { ...r, credits: t.credits, freeSpinsLeft: 0, bet: n };
}
function Se(t) {
  const n = /* @__PURE__ */ new Set();
  for (const e of t)
    it[e.line]?.forEach((l, r) => n.add(`${r}:${l}`));
  return n.size === at * Kt;
}
function ve(t, n) {
  if (t.some((r) => r === "blank")) return null;
  const o = t.find((r) => r !== "lion") ?? "lion";
  if (t.some((r) => r !== o && r !== "lion")) return null;
  const l = he[o];
  return l ? { symbol: o, payout: Math.round(l * n) } : null;
}
function we(t) {
  const n = $t[Math.floor(t() * $t.length)] ?? "ingot", e = 3 + Math.floor(t() * 7), o = [];
  for (let c = 0; c < at; c += 1)
    for (let s = 0; s < Kt; s += 1) o.push([c, s]);
  for (let c = o.length - 1; c > 0; c -= 1) {
    const s = Math.floor(t() * (c + 1)), p = o[c];
    o[c] = o[s] ?? p, o[s] = p;
  }
  const l = Array.from({ length: at }, () => ["blank", "blank", "blank"]), r = [];
  for (const [c, s] of o.slice(0, e)) {
    const p = l[c];
    p && (p[s] = t() < 0.1 ? "lion" : n, r.push({ grid: ke(l) }));
  }
  return { symbol: n, steps: r };
}
function ke(t) {
  return t.map((n) => [...n]);
}
function Ae() {
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
function Ee(t, n) {
  return {
    x: t.x - n.x + t.width / 2,
    y: t.y - n.y + t.height / 2
  };
}
function xe(t, n) {
  return t.map((e, o) => {
    const l = n[o]?.[e];
    return l ? `${l.x},${l.y}` : "";
  }).filter((e) => e.length > 0).join(" ");
}
const Q = 24, J = 3, lt = 3, _t = ["lion", "ingot", "lantern", "fan", "coin", "knot", "spark"], Ot = {
  startStagger: 0.11,
  stopStagger: 0.17,
  accel: 0.17,
  cruise: 26,
  minSpin: 2,
  postCruise: 0.25,
  settle: 0.3
}, St = {
  startStagger: 0,
  stopStagger: 0,
  accel: 0.1,
  cruise: 44,
  minSpin: 0.93,
  postCruise: 0.15,
  settle: 0.15
};
function Te(t = !1) {
  return {
    reels: Array.from({ length: J }, (n, e) => ({
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
        (o, l) => _t[(e * 3 + l) % _t.length] ?? "spark"
      )
    })),
    spinAge: 0,
    schedule: Array.from({ length: J }, () => Number.POSITIVE_INFINITY),
    result: null,
    quick: !1,
    tease: !1,
    reduced: t,
    slam: !1
  };
}
function rt(t, n) {
  let e = Qt(t + n);
  return e > lt + 1 && (e -= Q), e;
}
function Ce(t, n) {
  return Qt(n - Math.round(t));
}
function Wt(t, n) {
  t.result = null, t.quick = !1, t.tease = !1, t.spinAge = 0, t.schedule = t.schedule.map(() => Number.POSITIVE_INFINITY), t.reels.forEach((e, o) => {
    const l = At(n[o]);
    e.target = l, e.phase = "idle", e.speed = 0, e.landed = !0, e.offset = 0, kt(e, 0, l);
  });
}
function Ft(t) {
  t.result = null, t.quick = !1, t.tease = !1, t.slam = !1, t.spinAge = 0, t.schedule = t.schedule.map(() => Number.POSITIVE_INFINITY);
  const n = ct(t).startStagger;
  t.reels.forEach((e, o) => {
    e.phase = "wait", e.startAt = o * n, e.speed = 0, e.accelElapsed = 0, e.stopStartedAt = -1, e.landed = !1, e.elapsed = 0;
  });
}
function Le(t) {
  if (t.reduced || (t.quick = !0, t.tease = !1, !t.result)) return;
  const n = St.settle;
  t.reels.forEach((e, o) => {
    e.phase === "stop" ? e.duration = Math.min(e.duration, n) : e.landed || (t.schedule[o] = t.spinAge + o * St.stopStagger);
  });
}
function jt(t) {
  if (t.slam = !0, t.quick = !0, !!t.result)
    for (let n = 0; n < J; n += 1) {
      const e = t.reels[n];
      !e || e.landed || (e.phase === "wait" && (e.phase = "spin"), e.phase === "stop" ? e.duration - e.elapsed > vt && (e.from = e.offset, e.elapsed = 0, e.duration = vt) : t.schedule[n] = t.spinAge);
    }
}
function yt(t, n) {
  if (t.result = n, t.slam) {
    for (let r = 0; r < J; r += 1) {
      const c = t.reels[r];
      if (!c || c.phase !== "stop") continue;
      const s = At(n[r]);
      kt(c, c.stopAt, s), c.target = s;
    }
    jt(t);
    return;
  }
  const e = ct(t), o = (J - 1) * e.stopStagger + e.settle, l = Math.max(e.minSpin - o, t.spinAge + e.postCruise);
  for (let r = 0; r < J; r += 1)
    t.schedule[r] = l + r * e.stopStagger;
}
function Me(t, n) {
  const e = Math.min(0.1, Math.max(0, n));
  t.spinAge += e;
  const o = ct(t), l = { moving: !1, ticks: [], landed: [], scatters: [] };
  let r = 0;
  for (let c = 0; c < J; c += 1) {
    const s = t.reels[c];
    if (s) {
      if (s.phase === "wait" && t.spinAge >= s.startAt && (s.phase = "spin", s.accelElapsed = 0), s.phase === "wait")
        l.moving = !0;
      else if (s.phase === "spin") {
        l.moving = !0;
        const p = t.reduced ? 10 : o.cruise, w = t.reduced ? 0.12 : o.accel;
        s.accelElapsed += e;
        const T = Math.sin(Math.min(1, s.accelElapsed / w) * (Math.PI / 2));
        let A = p * T;
        t.tease && t.result && !t.quick && !t.reduced && (A = Math.min(A, 9));
        const D = Math.floor(s.offset);
        s.offset += A * e, s.speed = A;
        const q = Math.floor(s.offset);
        s.tickAt += e;
        const I = s.speed > 16 ? 0.08 : 0.045;
        !t.reduced && q !== D && s.tickAt > I && (s.tickAt = 0, l.ticks.push(c));
        const W = t.schedule[c] ?? Number.POSITIVE_INFINITY, R = Ie(t, c, o.stopStagger);
        t.result && t.spinAge >= W && (R || t.quick) && qe(t, c);
      } else if (s.phase === "stop") {
        l.moving = !0, s.elapsed += e;
        const w = 2 * (s.stopAt - s.from) / s.duration, T = w / s.duration, A = Math.min(s.duration, s.elapsed);
        s.offset = s.from + w * A - 0.5 * T * A * A, s.speed = Math.max(0, w - T * A), s.offset > s.stopAt && (s.offset = s.stopAt), s.elapsed >= s.duration && (s.offset = s.stopAt, s.phase = "idle", s.speed = 0, s.landed = !0, l.landed.push(c), s.target.includes("lion") && l.scatters.push(c));
      }
      if (s.landed)
        for (const p of s.target) p === "lion" && (r += 1);
    }
  }
  if (!t.tease && r >= 2 && t.reels.some((c) => !c.landed)) {
    t.tease = !0;
    const c = t.reduced || t.quick ? 0.05 : 0.62;
    t.reels.forEach((s, p) => {
      if (s.landed || s.phase === "stop") return;
      const w = t.schedule[p] ?? 0;
      t.schedule[p] = Math.max(w, t.spinAge + c * (p + 1));
    });
  }
  return l;
}
function qe(t, n) {
  const e = t.reels[n];
  if (!e || e.phase !== "spin") return;
  const o = At(t.result?.[n]);
  e.target = o;
  const l = ct(t), r = t.reduced ? 0.2 : t.tease && !t.quick ? 0.7 : l.settle, c = t.reduced ? 10 : l.cruise, s = Math.max(lt + 1.25, 0.5 * c * r), p = Math.ceil(e.offset + s);
  kt(e, p, o), e.stopAt = p, e.from = e.offset, e.elapsed = 0;
  const w = Math.max(1e-3, p - e.offset);
  e.duration = t.slam ? Math.min(vt, 2 * w / Math.max(c, 1)) : 2 * w / c, e.stopStartedAt = t.spinAge, e.phase = "stop";
}
function Ie(t, n, e) {
  if (n === 0) return !0;
  const o = t.reels[n - 1];
  return !o || o.stopStartedAt < 0 ? !1 : t.spinAge >= o.stopStartedAt + e;
}
function ct(t) {
  return t.reduced ? { ...Ot, startStagger: 0.02, stopStagger: 0.04, minSpin: 0.4 } : t.quick ? St : Ot;
}
function kt(t, n, e) {
  for (let o = 0; o < lt; o += 1) {
    const l = e[o] ?? "spark", r = Ce(n, o);
    t.symbols[r] = l;
  }
}
function At(t) {
  return [t?.[0] ?? "spark", t?.[1] ?? "knot", t?.[2] ?? "coin"];
}
const vt = 0.12;
function Qt(t) {
  return (t % Q + Q) % Q;
}
const tt = "http://www.w3.org/2000/svg", Ne = {
  lion: { text: "W", tier: "wild" },
  ingot: { text: "A", tier: "a" },
  lantern: { text: "K", tier: "k" },
  fan: { text: "Q", tier: "q" },
  coin: { text: "J", tier: "low" },
  knot: { text: "10", tier: "low" },
  spark: { text: "9", tier: "low" },
  blank: { text: "", tier: "blank" }
}, Pe = /* @__PURE__ */ new Set(["lion", "ingot", "lantern", "fan"]), Re = 8, $e = [22, 23, 0, 1, 2, 3, 4, 5], Gt = 7;
function Be(t) {
  const n = window.matchMedia("(prefers-reduced-motion: reduce)").matches, e = Te(n);
  t.replaceChildren(), t.classList.add("lion-board");
  const o = document.createElement("div");
  o.className = "lion-window", t.appendChild(o);
  const l = document.createElementNS(tt, "svg");
  l.setAttribute("class", "lion-blur-defs"), l.setAttribute("aria-hidden", "true"), t.appendChild(l);
  const r = e.reels.map((i, u) => {
    const a = document.createElement("div");
    a.className = "lion-col", a.dataset.reel = String(u);
    const d = document.createElementNS(tt, "filter"), g = `lion-blur-${u}`;
    d.setAttribute("id", g), d.setAttribute("x", "-20%"), d.setAttribute("y", "-60%"), d.setAttribute("width", "140%"), d.setAttribute("height", "220%");
    const h = document.createElementNS(tt, "feGaussianBlur");
    h.setAttribute("stdDeviation", "0 0"), h.setAttribute("edgeMode", "duplicate"), d.appendChild(h), l.appendChild(d);
    const S = document.createElement("div");
    S.className = "lion-strip";
    const E = [];
    for (let b = 0; b < Re; b += 1) {
      const V = $e[b] ?? b, M = document.createElement("div");
      M.className = "lion-strip-cell";
      const v = document.createElement("span"), U = i.symbols[V] ?? "spark";
      Ht(v, U), M.appendChild(v), S.appendChild(M), E.push({ el: M, glyph: v, index: V, symbol: U, prevPos: rt(V, 0) });
    }
    return a.appendChild(S), o.appendChild(a), { column: a, strip: S, cells: E, blur: h, filterId: g, blurAmount: 0 };
  }), c = document.createElementNS(tt, "svg");
  c.setAttribute("class", "lion-lines"), o.appendChild(c);
  let s = [], p = 0, w = 0, T = [];
  const A = () => {
    const i = r[0];
    if (!i) return;
    const u = i.column.clientHeight;
    if (u < 24) return;
    const a = Math.max(2, u * 0.012), d = (u - 2 * a) / 3;
    t.style.setProperty("--cell", `${d}px`), t.style.setProperty("--reel-gap", `${a}px`), t.style.setProperty("--glyph", `${Math.round(d * 0.58)}px`), t.style.setProperty("--glyph-wide", `${Math.round(d * 0.46)}px`), w = d + a;
  };
  function D(i, u, a, d) {
    const g = a < -0.35 || a > lt - 0.05;
    i.symbol === u || !d && !g || (i.symbol = u, Ht(i.glyph, u));
  }
  function q(i, u, a) {
    let d = -1, g = 99;
    for (let h = 0; h < Q; h += 1) {
      if (a.has(h)) continue;
      const S = rt(h, u);
      S < -0.55 && S > -2.6 && S < g && (d = h, g = S);
    }
    d < 0 || (a.delete(i.index), i.index = d, a.add(d), i.prevPos = g);
  }
  function I() {
    w < 8 && A(), e.reels.forEach((i, u) => {
      const a = r[u];
      if (!a || w < 8) return;
      const d = new Set(a.cells.map((h) => h.index)), g = i.landed && i.phase === "idle";
      for (const h of a.cells) {
        let S = rt(h.index, i.offset);
        (S < h.prevPos - 6 || S < -3) && (q(h, i.offset, d), S = rt(h.index, i.offset)), h.prevPos = S, h.el.style.transform = `translate3d(0, ${S * w}px, 0)`, D(h, i.symbols[h.index] ?? "spark", S, g);
      }
      W(a, i.speed, g || n);
    });
  }
  function W(i, u, a) {
    const d = a || u < 0.5 ? 0 : Math.min(Gt, u / 26 * Gt), g = Math.round(d * 2) / 2;
    if (g !== i.blurAmount) {
      if (i.blurAmount = g, g <= 0) {
        i.column.style.filter = "", i.blur.setAttribute("stdDeviation", "0 0");
        return;
      }
      i.blur.setAttribute("stdDeviation", `0 ${g}`), i.column.style.filter = `url(#${i.filterId})`;
    }
  }
  function R(i) {
    const u = i.column.getBoundingClientRect();
    return i.cells.map((a) => ({ el: a.el, box: a.el.getBoundingClientRect() })).filter(({ box: a }) => {
      const d = a.top + a.height / 2;
      return d >= u.top - 1 && d <= u.bottom + 1;
    }).sort((a, d) => a.box.top - d.box.top).slice(0, 3).map((a) => a.el);
  }
  function y() {
    const i = o.getBoundingClientRect();
    return r.map(
      (u) => R(u).map((a) => Ee(a.getBoundingClientRect(), i))
    );
  }
  function N() {
    const i = o.clientWidth, u = o.clientHeight;
    if (c.setAttribute("viewBox", `0 0 ${i} ${u}`), c.replaceChildren(), i < 8 || u < 8) return;
    const a = y();
    for (const d of T) {
      const g = it[d.line];
      if (!g) continue;
      const h = document.createElementNS(tt, "polyline");
      h.setAttribute("points", xe(g.slice(0, d.count), a)), h.setAttribute("class", "lion-payline"), c.appendChild(h);
    }
  }
  function B() {
    T = [];
    for (const i of r)
      for (const u of i.cells) u.el.classList.remove("is-win", "is-lock", "is-dim");
    c.replaceChildren();
  }
  function L(i) {
    for (const u of r)
      for (const a of u.cells) a.el.classList.remove("is-lock");
    i.forEach((u, a) => {
      const d = r[a] ? R(r[a]) : [];
      u.forEach((g, h) => {
        g !== "blank" && d[h]?.classList.add("is-lock");
      });
    });
  }
  function P() {
    if (p >= s.length - 1) return !1;
    p += 1;
    const i = s[p];
    return i ? (Ft(e), e.quick = !0, yt(e, i), L(i), !0) : !1;
  }
  A();
  let F = 0;
  const nt = () => {
    cancelAnimationFrame(F), F = requestAnimationFrame(() => {
      F = requestAnimationFrame(() => {
        A(), I(), N();
      });
    });
  }, Y = new ResizeObserver(nt);
  return Y.observe(t), I(), {
    show(i) {
      s = [], p = 0, Wt(e, i), B(), I();
    },
    spin() {
      Ft(e), B(), I();
    },
    turbo() {
      Le(e);
    },
    slam() {
      const i = s.length > 1 ? s[s.length - 1] : null;
      if (i) {
        p = s.length - 1, e.slam = !0, yt(e, i);
        return;
      }
      jt(e);
    },
    deliver(i, u) {
      s = u?.steps.map((a) => a.grid) ?? [i], s[0] || (s = [i]), p = e.slam ? s.length - 1 : 0, yt(e, s[p] ?? i);
    },
    update(i, u) {
      const a = Me(e, i);
      if (u && !n) {
        a.ticks.length && u.playTone({ frequency: 620, duration: 0.02, type: "square", gain: 0.01 });
        for (const g of a.landed)
          u.playTone({
            frequency: 220 + g * 70,
            duration: 0.05,
            type: "triangle",
            gain: 0.03
          });
      }
      if (!a.moving && s.length > 1) {
        const g = s[p];
        g && L(g);
      }
      const d = a.moving || P();
      return I(), d;
    },
    celebrate(i) {
      T = i;
      const u = /* @__PURE__ */ new Set();
      for (const a of r)
        for (const d of a.cells) d.el.classList.remove("is-win", "is-dim");
      for (const a of i) {
        const d = it[a.line];
        if (d)
          for (let g = 0; g < a.count; g += 1)
            u.add(`${g}:${d[g] ?? 1}`);
      }
      r.forEach((a, d) => {
        R(a).forEach((g, h) => {
          i.length !== 0 && (u.has(`${d}:${h}`) ? g.classList.add("is-win") : g.classList.add("is-dim"));
        });
      }), N();
    },
    resize() {
      A(), I(), N();
    },
    abort() {
      s = [], p = 0, Wt(
        e,
        e.reels.map((i) => i.target)
      ), B(), I();
    },
    destroy() {
      cancelAnimationFrame(F), Y.disconnect(), t.replaceChildren();
    }
  };
}
function Ht(t, n) {
  const e = Ne[n];
  t.textContent = e.text, t.dataset.symbol = n, t.className = `lion-glyph is-${e.tier}${Pe.has(n) ? " is-big" : ""}`;
}
function _e() {
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
const Oe = {}, Dt = {
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
], We = Math.round(1 / Jt), Vt = 4, wt = "wgf:slots-wallet", Xt = "wgf:slots-token", Fe = "wgf:session";
function Xe() {
  Ae();
  let t = null;
  const n = [];
  let e = null, o = et(), l = 20, r = !1, c = !1, s = 0, p = null, w = !1, T = 0, A = 0, D = !1, q = "pending", I = !1, W = null, R = 0, y = "", N = "", B = 0, L = 0, P = "ready", F = 0, nt = 0, Y = !1, i = 0, u = 0;
  const a = _e();
  let d = null, g = 0, h = 0;
  const S = [];
  let E = null;
  function b(f, k) {
    return ce(t?.store.getState().ui.locale ?? "zh", f, k);
  }
  function V(f, k) {
    k === "spin" && f.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), k === "stop" && f.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), k === "win" && f.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), k === "big" && f.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), k === "scatter" && f.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function M() {
    t && mt(t.store, {
      id: j.id,
      status: P,
      score: T,
      highScore: Math.max(A, T),
      message: y,
      detail: Ut(q, b),
      combo: o.freeSpins,
      credits: o.credits
    });
  }
  function v() {
    if (!e) return;
    const f = e.querySelector("[data-credits]"), k = e.querySelector("[data-message]"), x = e.querySelector("[data-amount]"), X = e.querySelector("[data-clock]"), ot = e.querySelector("[data-bet-dec]"), Z = e.querySelector("[data-bet-inc]"), C = e.querySelector("[data-spin-no]"), m = e.querySelector("[data-mult]"), G = e.querySelector("[data-demo]"), _ = e.querySelector("[data-feature]"), z = e.querySelector("[data-feature-glyph]"), H = e.querySelector("[data-source]");
    if (f && (f.textContent = String(o.credits)), x && (x.textContent = String(l)), X) {
      const $ = /* @__PURE__ */ new Date();
      X.textContent = `${$.getHours()}:${String($.getMinutes()).padStart(2, "0")}`;
    }
    if (C && (C.textContent = F > 0 ? String(F) : "—"), m && (m.textContent = `${nt}×`), G && (G.hidden = q !== "local"), _ && (_.hidden = !d), z && d && (z.textContent = Dt[d], z.className = `is-${d}`), H && (H.textContent = Ut(q, b)), k) {
      const $ = y === b("slots.place") || y === b("slots.ready"), K = y.length > 0 && !$;
      k.hidden = !K, k.textContent = K ? y : "", k.classList.toggle("is-win", K && /赢得|Won/.test(y));
    }
    e.dataset.spins = String(a.requests), e.dataset.round = r || u > 0 ? "busy" : "open";
    const Ct = O.indexOf(l);
    ot && (ot.disabled = r || Ct <= 0), Z && (Z.disabled = r || Ct >= O.length - 1), e.querySelectorAll("[data-bet]").forEach(($) => {
      $.classList.toggle("is-bet", Number($.dataset.bet) === l), $.disabled = r;
    });
    const ut = e.querySelector("[data-spin]"), Lt = e.querySelector("[data-note]");
    Lt && (Lt.textContent = b("slots.note"));
    const dt = e.querySelector("[data-auto]");
    e.classList.toggle("is-spinning", r || u > 0), r || (e.dataset.reels = "settled"), ut && (ut.disabled = !I || P !== "running", ut.setAttribute("aria-label", b(r ? "slots.stop" : "slots.spin")));
    const Mt = e.querySelector("[data-turbo]");
    Mt && Mt.classList.toggle("is-on", Y), dt && (dt.setAttribute("aria-pressed", c ? "true" : "false"), dt.disabled = P !== "running" || r);
    const qt = e.querySelector("[data-big]"), It = e.querySelector("[data-big-value]");
    qt && (qt.hidden = !N), It && L <= 0 && (It.textContent = N);
    const ft = e.querySelector("[data-land-win]");
    ft && (ft.textContent = L > 0 ? String(Math.round(B)) : String(g), ft.classList.toggle("is-zero", L <= 0 && g <= 0));
    const pt = e.querySelector("[data-history]"), gt = e.querySelector("[data-fortune]"), Nt = d ? Dt[d] : "", ht = S[0]?.feature === !0 && Nt.length > 0;
    pt && (pt.replaceChildren(
      ...S.map(($) => {
        const K = document.createElement("span");
        return K.textContent = String($.win), $.feature && K.classList.add("is-feature"), K;
      })
    ), pt.hidden = S.length === 0 || ht), gt && (gt.hidden = S.length > 0 && !ht, gt.textContent = ht ? `${b("slots.fortuneNow")} ${Nt}` : b("slots.fortune", { n: h, total: We }));
    const Pt = e.querySelector("[data-paytable]");
    Pt && (Pt.textContent = b("slots.paytable"));
  }
  function U() {
    q === "local" && localStorage.setItem(wt, JSON.stringify(o));
  }
  function xt(f) {
    o = {
      credits: f.credits,
      freeSpins: f.freeSpinsLeft,
      freeBet: f.freeSpinsLeft > 0 ? f.bet : o.freeBet
    }, U(), p = f, w = !1, s = 0, N = "", L = 0, y = b("slots.place"), d = f.feature?.symbol ?? null, T += f.win, F += 1, nt = f.bet > 0 ? Math.round(f.win / f.bet * 10) / 10 : 0, E?.deliver(f.grid, f.feature), M(), v();
  }
  async function st() {
    if (!a.tryAcquire()) return;
    if (!t || P !== "running" || !I || q === "pending" || u > 0) {
      a.release();
      return;
    }
    if (o.freeSpins <= 0 && o.credits < l) {
      y = b("slots.broke"), c = !1, a.release(), M(), v();
      return;
    }
    r = !0, i = 0, u = 0, y = "", d = null, N = "", L = 0, w = !1, E?.spin(), Y && E?.turbo(), t && V(t.audio, "spin");
    const f = R, k = W ?? He();
    if (W = k, v(), q === "local") {
      const x = ye(o, l, Math.random);
      if (f !== R || !t) return;
      if (W = null, "error" in x) {
        r = !1, E?.abort(), y = x.error === "insufficient" ? b("slots.broke") : b("slots.badBet"), c = !1, a.release(), M(), v();
        return;
      }
      xt(x);
      return;
    }
    try {
      const x = await Ve(l, k);
      if (f !== R || !t) return;
      W = null, xt(x);
    } catch {
      if (f !== R || !t) return;
      r = !1, E?.abort(), c = !1, y = b("slots.retry"), a.release(), M(), v();
    }
  }
  function ee() {
    if (!p || !t) return;
    r = !1, E?.celebrate(p.wins), p.win > 0 ? (y = b("slots.won", { n: p.win }), V(t.audio, p.bigWin ? "big" : "win")) : y = b("slots.place"), p.feature && (y = b("slots.feature", {
      message: y,
      symbol: b(`slots.symbol.${p.feature.symbol}`)
    }), V(t.audio, "scatter")), g = p.win, S.unshift({ win: p.win, feature: p.feature !== null }), S.length > Vt && (S.length = Vt), h = p.feature ? 0 : h + 1, p.bigWin && (N = "0", B = 0, L = p.win, c = !1), T > A && ue(j.id, T), o.credits < O[0] && o.freeSpins === 0 && (c = !1, P = "over", y = b("slots.empty"), D || (D = !0, t.events.emit("game:over", {
      gameId: j.id,
      score: T,
      best: Math.max(A, T),
      isRecord: T > A
    }))), p = null, s = c ? 0.7 : 0, u = ne(y) ? 1 : 0, u <= 0 && a.release(), M(), v();
  }
  function ne(f) {
    return /赢得|Won|奇缘|fortune/i.test(f);
  }
  async function se() {
    if (!await ze()) {
      q = "local", I = !0, o = zt(), U(), y = b("slots.place"), M(), v();
      return;
    }
    try {
      const k = await Ye();
      q = "server", I = !0, o = Zt(k), y = b("slots.place"), M(), v();
    } catch {
      q = "local", I = !0, o = zt(), U(), y = b("slots.place"), M(), v();
    }
  }
  function Tt(f) {
    l = 20, r = !1, c = !1, p = null, w = !1, s = 0, u = 0, a.release(), T = 0, D = !1, N = "", L = 0, g = 0, h = 0, S.length = 0, d = null, E?.abort(), E?.show(Yt), y = b("slots.place"), P = f ? "running" : "ready", M(), v();
  }
  async function oe() {
    if (R += 1, W = null, A = Rt(j.id), q === "server")
      try {
        o = await Ue();
      } catch {
        y = b("slots.resetFail"), M(), v();
        return;
      }
    else q === "local" && (localStorage.removeItem(wt), o = et(), U());
    Tt(!0);
  }
  return ae(j, {
    async onPreload(f, k) {
      await f.preload([], k);
    },
    async onMount(f) {
      t = f, f.container.setAttribute("data-wgf-game", "wgf-game:slots"), e = document.createElement("div"), e.className = "slots", e.innerHTML = Ge();
      const k = e.querySelector("[data-reels]");
      k instanceof HTMLElement && (E = await Be(k), E.show(Yt)), f.container.appendChild(e), A = Rt(j.id);
      const x = e;
      x.addEventListener("click", (C) => {
        const m = C.target;
        if (!(m instanceof Element)) return;
        if (m.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        if (r && (m.closest("[data-spin]") || m.closest("[data-reels]"))) {
          E?.slam();
          return;
        }
        if (u > 0 && m.closest("[data-spin]")) {
          u = 0, a.release(), v();
          return;
        }
        const G = m.closest("[data-bet]"), _ = G instanceof HTMLElement ? Number(G.dataset.bet) : Number.NaN;
        if (O.includes(_) && !r) {
          l = _, x.classList.remove("is-bets"), v();
          return;
        }
        if (m.closest("[data-bet-dec]")) {
          const z = O.indexOf(l), H = O[z - 1];
          !r && H !== void 0 && (l = H), x.classList.remove("is-bets"), v();
          return;
        }
        if (m.closest("[data-bet-inc]")) {
          const z = O.indexOf(l), H = O[z + 1];
          !r && H !== void 0 && (l = H), x.classList.remove("is-bets"), v();
          return;
        }
        if (m.closest("[data-peek]")) {
          x.classList.toggle("is-panels");
          return;
        }
        if (m.closest("[data-paytable]")) {
          x.classList.remove("is-bets"), x.classList.toggle("is-paytable");
          return;
        }
        if (x.classList.contains("is-paytable") && !m.closest(".slots-panel-right") && x.classList.remove("is-paytable"), m.closest("[data-amount-bar]")) {
          r || x.classList.toggle("is-bets");
          return;
        }
        if (x.classList.contains("is-bets") && !m.closest("[data-bet-ui]") && x.classList.remove("is-bets"), m.closest("[data-turbo]")) {
          r || (Y = !Y, v());
          return;
        }
        m.closest("[data-spin]") && st(), m.closest("[data-auto]") && (c = !c, c && !r && u <= 0 && st(), v());
      }), Tt(!1), se();
      const X = ie(() => E?.resize()), ot = le(() => X.schedule()), Z = (C) => {
        if (C.key !== " " && C.key !== "Enter") return;
        const m = C.target;
        if (!(m instanceof HTMLElement && m.closest("input, textarea, select")) && !document.querySelector("[data-menu-sheet]")) {
          if (C.preventDefault(), r) {
            E?.slam();
            return;
          }
          u > 0 || P !== "running" || st();
        }
      };
      window.addEventListener("keydown", Z), n.push(ot, () => X.cancel()), n.push(() => window.removeEventListener("keydown", Z)), n.push(
        f.loop.onUpdate((C) => {
          if (r && E) {
            const m = E.update(C, f.audio);
            e && (e.dataset.reels = m ? "spinning" : "settled"), p && !m && !w ? (i += C, i >= 0.22 && (w = !0, ee())) : m && (i = 0);
          }
          if (L > 0 && e) {
            B = Math.min(L, B + L * C * 0.95);
            const m = e.querySelector("[data-big-value]"), G = String(Math.round(B));
            m && (m.textContent = G);
            const _ = e.querySelector("[data-land-win]");
            _ && (_.textContent = G), B >= L - 0.4 && (N = String(Math.round(L)), L = 0, m && (m.textContent = N), _ && (_.textContent = N));
          }
          u > 0 && (u = Math.max(0, u - C), u === 0 && (a.release(), v())), !r && u <= 0 && c && P === "running" && s > 0 && (s -= C, s <= 0 && st());
        }),
        f.store.subscribe((C, m) => {
          C.ui.locale !== m.ui.locale && v();
        }),
        f.events.on("game:start", () => {
          P === "ready" && (P = "running", y = b("slots.ready"), M(), v());
        }),
        f.events.on("game:restart", () => {
          oe();
        })
      );
    },
    onPause(f) {
      f.store.getState().game.status === "running" && mt(f.store, { status: "paused" });
    },
    onResume(f) {
      f.store.getState().game.status === "paused" && mt(f.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const f of n) f();
      n.length = 0, E?.destroy(), E = null, e?.remove(), e = null, t = null;
    }
  });
}
function Ge() {
  const t = O.map(
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
  ].map(([e, o, l]) => `<li><b class="is-${l}">${e}</b><span>${o}</span></li>`).join("")}</ul>
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
function He() {
  return `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function zt() {
  try {
    const t = localStorage.getItem(wt);
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
function Et() {
  const t = new de(), n = De(), e = Je();
  if (n) t.set({ accessToken: n });
  else if (e?.accessToken && !e.accessToken.startsWith("local."))
    t.set({ accessToken: e.accessToken, refreshToken: e.refreshToken });
  else {
    const o = Ke();
    o && t.set({ accessToken: o });
  }
  return new fe({ baseUrl: te(), tokens: t, timeoutMs: 2500 });
}
function De() {
  try {
    const t = sessionStorage.getItem("wgf:launch-token");
    return t && t.length >= 8 ? t : null;
  } catch {
    return null;
  }
}
async function Ye() {
  const t = await Et().post("/api/slots/session", {});
  return t.walletToken && localStorage.setItem(Xt, t.walletToken), t;
}
async function Ve(t, n) {
  return Et().post("/api/slots/spin", { bet: t, spinId: n });
}
async function Ue() {
  const t = await Et().post("/api/slots/reset", {});
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
  return Oe?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function Ke() {
  const t = localStorage.getItem(Xt);
  return t && t.startsWith("v1w.") ? t : null;
}
function Je() {
  try {
    const t = localStorage.getItem(Fe);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
export {
  Xe as createGame,
  j as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
