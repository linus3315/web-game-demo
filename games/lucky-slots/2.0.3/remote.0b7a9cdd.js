import { registerStrings as Oe, defineGame as We, patchGame as ne, readHighScore as me, t as Ge, writeHighScore as He } from "@wgf/core";
import { TokenStore as Fe, HttpClient as Ye } from "@wgf/net";
const ze = {
  background: "#2a140c",
  shapes: [
    { tag: "rect", attrs: { x: 48, y: 56, width: 224, height: 120, rx: 16, fill: "#1a0d08" } },
    { tag: "circle", attrs: { cx: 92, cy: 116, r: 22, fill: "#ff4d6d" } },
    { tag: "circle", attrs: { cx: 148, cy: 116, r: 22, fill: "#ffb703" } },
    { tag: "circle", attrs: { cx: 204, cy: 116, r: 22, fill: "#f6f1e7" } },
    { tag: "rect", attrs: { x: 118, y: 188, width: 84, height: 28, rx: 14, fill: "#ff5a1f" } }
  ]
}, H = {
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
  art: ze,
  renderer: "dom",
  controls: "pointer",
  tags: ["拉霸", "联网"],
  theme: { accent: "#ffb703", accentInk: "#2a1408", glow: "#ff5a1f", radius: 18, font: "serif" }
}, N = [10, 20, 50, 100], De = 1e3, K = 3, Ie = 3, Ue = 1 / 130, se = [
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
], J = [
  [1, 1, 1],
  [0, 0, 0],
  [2, 2, 2],
  [0, 1, 2],
  [2, 1, 0]
], Ve = {
  lion: 50,
  ingot: 20,
  lantern: 5,
  fan: 2,
  coin: 1.6,
  knot: 1,
  spark: 0.6
}, be = ["ingot", "lantern", "fan", "coin", "knot", "spark"];
function Ke(e) {
  return N.includes(e);
}
function D() {
  return { credits: De, freeSpins: 0, freeBet: 20 };
}
function he(e) {
  return Array.from({ length: K }, () => {
    const s = Math.floor(e() * se.length);
    return [0, 1, 2].map((t) => se[(s + t) % se.length] ?? "spark");
  });
}
function Je(e, s) {
  const t = [];
  J.forEach((a, r) => {
    const l = a.map((d, y) => e[y]?.[d] ?? "blank"), o = Xe(l, s);
    o && t.push({ line: r, symbol: o.symbol, count: 3, payout: o.payout });
  });
  let n = t.reduce((a, r) => a + r.payout, 0);
  return Qe(t) && n > 0 && (n *= 10), {
    grid: e,
    wins: t,
    scatterCount: 0,
    scatterPayout: 0,
    freeSpinsAwarded: 0,
    win: n,
    bigWin: n >= s * 10,
    megaWin: n >= s * 25,
    feature: null
  };
}
function je(e, s, t) {
  if (!Ke(s)) return { error: "bad_bet" };
  if (e.credits < s) return { error: "insufficient" };
  e.credits -= s;
  const n = t() < Ue ? Ze(t) : null, a = n ? n.steps.at(-1)?.grid ?? he(t) : he(t), r = Je(a, s);
  return r.feature = n, e.credits += r.win, { ...r, credits: e.credits, freeSpinsLeft: 0, bet: s };
}
function Qe(e) {
  const s = /* @__PURE__ */ new Set();
  for (const t of e)
    J[t.line]?.forEach((a, r) => s.add(`${r}:${a}`));
  return s.size === K * Ie;
}
function Xe(e, s) {
  if (e.some((r) => r === "blank")) return null;
  const n = e.find((r) => r !== "lion") ?? "lion";
  if (e.some((r) => r !== n && r !== "lion")) return null;
  const a = Ve[n];
  return a ? { symbol: n, payout: Math.round(a * s) } : null;
}
function Ze(e) {
  const s = be[Math.floor(e() * be.length)] ?? "ingot", t = 3 + Math.floor(e() * 7), n = [];
  for (let l = 0; l < K; l += 1)
    for (let o = 0; o < Ie; o += 1) n.push([l, o]);
  for (let l = n.length - 1; l > 0; l -= 1) {
    const o = Math.floor(e() * (l + 1)), d = n[l];
    n[l] = n[o] ?? d, n[o] = d;
  }
  const a = Array.from({ length: K }, () => ["blank", "blank", "blank"]), r = [];
  for (const [l, o] of n.slice(0, t)) {
    const d = a[l];
    d && (d[o] = e() < 0.1 ? "lion" : s, r.push({ grid: et(a) }));
  }
  return { symbol: s, steps: r };
}
function et(e) {
  return e.map((s) => [...s]);
}
function tt() {
  Oe("slots", {
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
function nt(e, s, t) {
  return t === 0 || s <= 0 ? 0 : (e % s + s) % s * t;
}
function st(e, s) {
  return {
    x: e.x - s.x + e.width / 2,
    y: e.y - s.y + e.height / 2
  };
}
function ot(e, s) {
  return e.map((t, n) => {
    const a = s[n]?.[t];
    return a ? `${a.x},${a.y}` : "";
  }).filter((t) => t.length > 0).join(" ");
}
const O = 24, U = 3, Ce = 3, ye = ["lion", "ingot", "lantern", "fan", "coin", "knot", "spark"], Se = {
  startStagger: 0.11,
  stopStagger: 0.17,
  accel: 0.17,
  cruise: 26,
  minSpin: 2,
  postCruise: 0.25,
  settle: 0.3
}, oe = {
  startStagger: 0,
  stopStagger: 0,
  accel: 0.1,
  cruise: 44,
  minSpin: 0.93,
  postCruise: 0.15,
  settle: 0.15
};
function rt(e = !1) {
  return {
    reels: Array.from({ length: U }, (s, t) => ({
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
        { length: O },
        (n, a) => ye[(t * 3 + a) % ye.length] ?? "spark"
      )
    })),
    spinAge: 0,
    schedule: Array.from({ length: U }, () => Number.POSITIVE_INFINITY),
    result: null,
    quick: !1,
    tease: !1,
    reduced: e
  };
}
function at(e, s) {
  return ft(s - Math.round(e));
}
function ve(e, s) {
  e.result = null, e.quick = !1, e.tease = !1, e.spinAge = 0, e.schedule = e.schedule.map(() => Number.POSITIVE_INFINITY), e.reels.forEach((t, n) => {
    const a = qe(s[n]);
    t.target = a, t.phase = "idle", t.speed = 0, t.landed = !0, t.offset = 0, Le(t, 0, a);
  });
}
function we(e) {
  e.result = null, e.quick = !1, e.tease = !1, e.spinAge = 0, e.schedule = e.schedule.map(() => Number.POSITIVE_INFINITY);
  const s = j(e).startStagger;
  e.reels.forEach((t, n) => {
    t.phase = "wait", t.startAt = n * s, t.speed = 0, t.accelElapsed = 0, t.stopStartedAt = -1, t.landed = !1, t.elapsed = 0;
  });
}
function it(e) {
  if (e.reduced || (e.quick = !0, e.tease = !1, !e.result)) return;
  const s = oe.settle;
  e.reels.forEach((t, n) => {
    t.phase === "stop" ? t.duration = Math.min(t.duration, s) : t.landed || (e.schedule[n] = e.spinAge + n * oe.stopStagger);
  });
}
function ke(e, s) {
  e.result = s;
  const t = j(e), n = (U - 1) * t.stopStagger + t.settle, a = Math.max(t.minSpin - n, e.spinAge + t.postCruise);
  for (let r = 0; r < U; r += 1)
    e.schedule[r] = a + r * t.stopStagger;
}
function lt(e, s) {
  const t = Math.min(0.1, Math.max(0, s));
  e.spinAge += t;
  const n = j(e), a = { moving: !1, ticks: [], landed: [], scatters: [] };
  let r = 0;
  for (let l = 0; l < U; l += 1) {
    const o = e.reels[l];
    if (o) {
      if (o.phase === "wait" && e.spinAge >= o.startAt && (o.phase = "spin", o.accelElapsed = 0), o.phase === "wait")
        a.moving = !0;
      else if (o.phase === "spin") {
        a.moving = !0;
        const d = e.reduced ? 10 : n.cruise, y = e.reduced ? 0.12 : n.accel;
        o.accelElapsed += t;
        const b = Math.sin(Math.min(1, o.accelElapsed / y) * (Math.PI / 2));
        let S = d * b;
        e.tease && e.result && !e.quick && !e.reduced && (S = Math.min(S, 9));
        const _ = Math.floor(o.offset);
        o.offset += S * t, o.speed = S;
        const E = Math.floor(o.offset);
        o.tickAt += t;
        const M = o.speed > 16 ? 0.08 : 0.045;
        !e.reduced && E !== _ && o.tickAt > M && (o.tickAt = 0, a.ticks.push(l));
        const L = e.schedule[l] ?? Number.POSITIVE_INFINITY, R = ut(e, l, n.stopStagger);
        e.result && e.spinAge >= L && (R || e.quick) && ct(e, l);
      } else if (o.phase === "stop") {
        a.moving = !0, o.elapsed += t;
        const y = 2 * (o.stopAt - o.from) / o.duration, b = y / o.duration, S = Math.min(o.duration, o.elapsed);
        o.offset = o.from + y * S - 0.5 * b * S * S, o.speed = Math.max(0, y - b * S), o.offset > o.stopAt && (o.offset = o.stopAt), o.elapsed >= o.duration && (o.offset = o.stopAt, o.phase = "idle", o.speed = 0, o.landed = !0, a.landed.push(l), o.target.includes("lion") && a.scatters.push(l));
      }
      if (o.landed)
        for (const d of o.target) d === "lion" && (r += 1);
    }
  }
  if (!e.tease && r >= 2 && e.reels.some((l) => !l.landed)) {
    e.tease = !0;
    const l = e.reduced || e.quick ? 0.05 : 0.62;
    e.reels.forEach((o, d) => {
      if (o.landed || o.phase === "stop") return;
      const y = e.schedule[d] ?? 0;
      e.schedule[d] = Math.max(y, e.spinAge + l * (d + 1));
    });
  }
  return a;
}
function ct(e, s) {
  const t = e.reels[s];
  if (!t || t.phase !== "spin") return;
  const n = qe(e.result?.[s]);
  t.target = n;
  const a = j(e), r = e.reduced ? 0.2 : e.tease && !e.quick ? 0.7 : a.settle, l = e.reduced ? 10 : a.cruise, o = Math.max(Ce + 1.25, 0.5 * l * r), d = Math.ceil(t.offset + o);
  Le(t, d, n), t.stopAt = d, t.from = t.offset, t.elapsed = 0, t.duration = 2 * (d - t.offset) / l, t.stopStartedAt = e.spinAge, t.phase = "stop";
}
function ut(e, s, t) {
  if (s === 0) return !0;
  const n = e.reels[s - 1];
  return !n || n.stopStartedAt < 0 ? !1 : e.spinAge >= n.stopStartedAt + t;
}
function j(e) {
  return e.reduced ? { ...Se, startStagger: 0.02, stopStagger: 0.04, minSpin: 0.4 } : e.quick ? oe : Se;
}
function Le(e, s, t) {
  for (let n = 0; n < Ce; n += 1) {
    const a = t[n] ?? "spark", r = at(s, n);
    e.symbols[r] = a;
  }
}
function qe(e) {
  return [e?.[0] ?? "spark", e?.[1] ?? "knot", e?.[2] ?? "coin"];
}
function ft(e) {
  return (e % O + O) % O;
}
const Te = "http://www.w3.org/2000/svg", dt = {
  lion: { text: "W", tier: "wild" },
  ingot: { text: "A", tier: "a" },
  lantern: { text: "K", tier: "k" },
  fan: { text: "Q", tier: "q" },
  coin: { text: "J", tier: "low" },
  knot: { text: "10", tier: "low" },
  spark: { text: "9", tier: "low" },
  blank: { text: "", tier: "blank" }
}, pt = /* @__PURE__ */ new Set(["lion", "ingot", "lantern", "fan"]);
function gt(e) {
  const s = window.matchMedia("(prefers-reduced-motion: reduce)").matches, t = rt(s);
  e.replaceChildren(), e.classList.add("lion-board");
  const n = t.reels.map((u, p) => {
    const i = document.createElement("div");
    i.className = "lion-col", i.dataset.reel = String(p);
    const f = document.createElement("div");
    f.className = "lion-strip";
    const g = [];
    for (let w = 0; w < 2; w += 1)
      for (let $ = 0; $ < O; $ += 1) {
        const P = document.createElement("div");
        P.className = "lion-strip-cell";
        const q = document.createElement("span"), k = u.symbols[$] ?? "spark";
        Ae(q, k), P.appendChild(q), f.appendChild(P), g.push({ el: P, glyph: q, index: $, symbol: k });
      }
    return i.appendChild(f), e.appendChild(i), { column: i, strip: f, cells: g };
  }), a = document.createElementNS(Te, "svg");
  a.setAttribute("class", "lion-lines"), e.appendChild(a);
  let r = [], l = 0, o = 0, d = [];
  const y = () => {
    const u = n[0];
    if (!u) return;
    const p = u.column.clientHeight;
    if (p < 24) return;
    const i = Math.max(4, Math.round(p * 0.028)), f = (p - 2 * i) / 3;
    e.style.setProperty("--cell", `${f}px`), e.style.setProperty("--reel-gap", `${i}px`), e.style.setProperty("--glyph", `${Math.round(f * 0.58)}px`), e.style.setProperty("--glyph-wide", `${Math.round(f * 0.46)}px`);
    const g = u.cells[0]?.el.getBoundingClientRect(), w = u.cells[1]?.el.getBoundingClientRect();
    o = g && w ? w.top - g.top : f + i;
  };
  function b() {
    o < 8 && y(), t.reels.forEach((u, p) => {
      const i = n[p];
      if (!i || o < 8) return;
      const f = nt(u.offset, O, o) - O * o;
      i.strip.style.transform = `translate3d(0, ${f}px, 0)`;
      for (const g of i.cells) {
        const w = u.symbols[g.index] ?? "spark";
        g.symbol !== w && (g.symbol = w, Ae(g.glyph, w));
      }
    });
  }
  function S(u) {
    const p = u.column.getBoundingClientRect();
    return u.cells.map((i) => ({ el: i.el, box: i.el.getBoundingClientRect() })).filter(({ box: i }) => {
      const f = i.top + i.height / 2;
      return f >= p.top - 1 && f <= p.bottom + 1;
    }).sort((i, f) => i.box.top - f.box.top).slice(0, 3).map((i) => i.el);
  }
  function _() {
    const u = e.getBoundingClientRect();
    return n.map(
      (p) => S(p).map((i) => st(i.getBoundingClientRect(), u))
    );
  }
  function E() {
    const u = e.clientWidth, p = e.clientHeight;
    if (a.setAttribute("viewBox", `0 0 ${u} ${p}`), a.replaceChildren(), u < 8 || p < 8) return;
    const i = _();
    for (const f of d) {
      const g = J[f.line];
      if (!g) continue;
      const w = document.createElementNS(Te, "polyline");
      w.setAttribute("points", ot(g.slice(0, f.count), i)), w.setAttribute("class", "lion-payline"), a.appendChild(w);
    }
  }
  function M() {
    d = [];
    for (const u of n)
      for (const p of u.cells) p.el.classList.remove("is-win", "is-lock", "is-dim");
    a.replaceChildren();
  }
  function L(u) {
    for (const p of n)
      for (const i of p.cells) i.el.classList.remove("is-lock");
    u.forEach((p, i) => {
      const f = n[i] ? S(n[i]) : [];
      p.forEach((g, w) => {
        g !== "blank" && f[w]?.classList.add("is-lock");
      });
    });
  }
  function R() {
    if (l >= r.length - 1) return !1;
    l += 1;
    const u = r[l];
    return u ? (we(t), t.quick = !0, ke(t, u), L(u), !0) : !1;
  }
  y();
  const v = new ResizeObserver(() => {
    y(), b(), E();
  });
  return v.observe(e), b(), {
    show(u) {
      r = [], l = 0, ve(t, u), M(), b();
    },
    spin() {
      we(t), M(), b();
    },
    turbo() {
      it(t);
    },
    deliver(u, p) {
      r = p?.steps.map((i) => i.grid) ?? [u], r[0] || (r = [u]), l = 0, ke(t, r[0] ?? u);
    },
    update(u, p) {
      const i = lt(t, u);
      if (p && !s) {
        i.ticks.length && p.playTone({ frequency: 620, duration: 0.02, type: "square", gain: 0.01 });
        for (const g of i.landed)
          p.playTone({
            frequency: 220 + g * 70,
            duration: 0.05,
            type: "triangle",
            gain: 0.03
          });
      }
      if (!i.moving && r.length > 1) {
        const g = r[l];
        g && L(g);
      }
      const f = i.moving || R();
      return b(), f;
    },
    celebrate(u) {
      d = u;
      const p = /* @__PURE__ */ new Set();
      for (const i of n)
        for (const f of i.cells) f.el.classList.remove("is-win", "is-dim");
      for (const i of u) {
        const f = J[i.line];
        if (f)
          for (let g = 0; g < i.count; g += 1)
            p.add(`${g}:${f[g] ?? 1}`);
      }
      n.forEach((i, f) => {
        S(i).forEach((g, w) => {
          u.length !== 0 && (p.has(`${f}:${w}`) ? g.classList.add("is-win") : g.classList.add("is-dim"));
        });
      }), E();
    },
    resize() {
      y(), b(), E();
    },
    abort() {
      r = [], l = 0, ve(
        t,
        t.reels.map((u) => u.target)
      ), M(), b();
    },
    destroy() {
      v.disconnect(), e.replaceChildren();
    }
  };
}
function Ae(e, s) {
  const t = dt[s];
  e.textContent = t.text, e.dataset.symbol = s, e.className = `lion-glyph is-${t.tier}${pt.has(s) ? " is-big" : ""}`;
}
const mt = {}, bt = {
  lion: "W",
  ingot: "A",
  lantern: "K",
  fan: "Q",
  coin: "J",
  knot: "10",
  spark: "9",
  blank: ""
}, Ee = [
  ["spark", "ingot", "coin"],
  ["knot", "lantern", "spark"],
  ["coin", "fan", "knot"]
], re = "wgf:slots-wallet", Ne = "wgf:slots-token", ht = "wgf:session";
function Ct() {
  tt();
  let e = null;
  const s = [];
  let t = null, n = D(), a = 20, r = !1, l = !1, o = 0, d = null, y = !1, b = 0, S = 0, _ = !1, E = "pending", M = !1, L = null, R = 0, v = "", u = "", p = 0, i = 0, f = "ready", g = 0, w = 0, $ = !1, P = 0, q = null, k = null;
  function h(c, T) {
    return Ge(e?.store.getState().ui.locale ?? "zh", c, T);
  }
  function Q(c, T) {
    T === "spin" && c.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), T === "stop" && c.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), T === "win" && c.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), T === "big" && c.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), T === "scatter" && c.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function I() {
    e && ne(e.store, {
      id: H.id,
      status: f,
      score: b,
      highScore: Math.max(S, b),
      message: v,
      detail: xe(E, h),
      combo: n.freeSpins,
      credits: n.credits
    });
  }
  function A() {
    if (!t) return;
    const c = t.querySelector("[data-credits]"), T = t.querySelector("[data-message]"), x = t.querySelector("[data-amount]"), F = t.querySelector("[data-clock]"), C = t.querySelector("[data-bet-dec]"), m = t.querySelector("[data-bet-inc]"), Y = t.querySelector("[data-spin-no]"), z = t.querySelector("[data-mult]"), W = t.querySelector("[data-demo]"), B = t.querySelector("[data-feature]"), Z = t.querySelector("[data-feature-glyph]"), ce = t.querySelector("[data-source]");
    if (c && (c.textContent = String(n.credits)), x && (x.textContent = String(a)), F) {
      const G = /* @__PURE__ */ new Date();
      F.textContent = `${G.getHours()}:${String(G.getMinutes()).padStart(2, "0")}`;
    }
    Y && (Y.textContent = g > 0 ? String(g) : "—"), z && (z.textContent = `${w}×`), W && (W.hidden = E !== "local"), B && (B.hidden = !q), Z && q && (Z.textContent = bt[q], Z.className = `is-${q}`), ce && (ce.textContent = xe(E, h)), T && (T.textContent = v || (f === "running" && !r ? h("slots.place") : ""));
    const ue = N.indexOf(a);
    C && (C.disabled = r || ue <= 0), m && (m.disabled = r || ue >= N.length - 1), t.querySelectorAll("[data-bet]").forEach((G) => {
      G.classList.toggle("is-bet", Number(G.dataset.bet) === a), G.disabled = r;
    });
    const ee = t.querySelector("[data-spin]"), fe = t.querySelector("[data-note]");
    fe && (fe.textContent = h("slots.note"));
    const te = t.querySelector("[data-auto]");
    t.classList.toggle("is-spinning", r), ee && (ee.disabled = !M || f !== "running", ee.setAttribute("aria-label", h(r ? "slots.stop" : "slots.spin")));
    const de = t.querySelector("[data-turbo]");
    de && de.classList.toggle("is-on", $), te && (te.setAttribute("aria-pressed", l ? "true" : "false"), te.disabled = f !== "running" || r);
    const pe = t.querySelector("[data-big]"), ge = t.querySelector("[data-big-value]");
    pe && (pe.hidden = !u), ge && i <= 0 && (ge.textContent = u);
  }
  function V() {
    E === "local" && localStorage.setItem(re, JSON.stringify(n));
  }
  function ie(c) {
    n = {
      credits: c.credits,
      freeSpins: c.freeSpinsLeft,
      freeBet: c.freeSpinsLeft > 0 ? c.bet : n.freeBet
    }, V(), d = c, y = !1, o = 0, u = "", i = 0, v = h("slots.place"), q = c.feature?.symbol ?? null, b += c.win, g += 1, w = c.bet > 0 ? Math.round(c.win / c.bet * 10) / 10 : 0, k?.deliver(c.grid, c.feature), I(), A();
  }
  async function X() {
    if (!e || r || f !== "running" || !M || E === "pending")
      return;
    if (n.freeSpins <= 0 && n.credits < a) {
      v = h("slots.broke"), l = !1, I(), A();
      return;
    }
    r = !0, P = 0, q = null, u = "", i = 0, y = !1, k?.spin(), $ && k?.turbo(), e && Q(e.audio, "spin");
    const c = R, T = L ?? St();
    if (L = T, A(), E === "local") {
      const x = je(n, a, Math.random);
      if (c !== R || !e) return;
      if (L = null, "error" in x) {
        r = !1, k?.abort(), v = x.error === "insufficient" ? h("slots.broke") : h("slots.badBet"), l = !1, I(), A();
        return;
      }
      ie(x);
      return;
    }
    try {
      const x = await kt(a, T);
      if (c !== R || !e) return;
      L = null, ie(x);
    } catch {
      if (c !== R || !e) return;
      r = !1, k?.abort(), l = !1, v = h("slots.retry"), I(), A();
    }
  }
  function Pe() {
    if (!d || !e) return;
    r = !1, k?.celebrate(d.wins), d.win > 0 ? (v = h("slots.won", { n: d.win }), Q(e.audio, d.bigWin ? "big" : "win")) : v = h("slots.place"), d.feature && (v = h("slots.feature", {
      message: v,
      symbol: h(`slots.symbol.${d.feature.symbol}`)
    }), Q(e.audio, "scatter")), d.bigWin && (u = "0", p = 0, i = d.win, l = !1), b > S && He(H.id, b), n.credits < N[0] && n.freeSpins === 0 && (l = !1, f = "over", v = h("slots.empty"), _ || (_ = !0, e.events.emit("game:over", {
      gameId: H.id,
      score: b,
      best: Math.max(S, b),
      isRecord: b > S
    }))), d = null, o = l ? 0.7 : 0, I(), A();
  }
  async function Be() {
    if (!await At()) {
      E = "local", M = !0, n = Me(), V(), v = h("slots.place"), I(), A();
      return;
    }
    try {
      const T = await wt();
      E = "server", M = !0, n = Re(T), v = h("slots.place"), I(), A();
    } catch {
      E = "local", M = !0, n = Me(), V(), v = h("slots.place"), I(), A();
    }
  }
  function le(c) {
    a = 20, r = !1, l = !1, d = null, y = !1, o = 0, b = 0, _ = !1, u = "", i = 0, k?.abort(), k?.show(Ee), v = h("slots.place"), f = c ? "running" : "ready", I(), A();
  }
  async function _e() {
    if (R += 1, L = null, S = me(H.id), E === "server")
      try {
        n = await Tt();
      } catch {
        v = h("slots.resetFail"), I(), A();
        return;
      }
    else E === "local" && (localStorage.removeItem(re), n = D(), V());
    le(!0);
  }
  return We(H, {
    async onPreload(c, T) {
      await c.preload([], T);
    },
    async onMount(c) {
      e = c, c.container.setAttribute("data-wgf-game", "wgf-game:slots"), t = document.createElement("div"), t.className = "slots", t.innerHTML = yt();
      const T = t.querySelector("[data-reels]");
      T instanceof HTMLElement && (k = await gt(T), k.show(Ee)), c.container.appendChild(t), S = me(H.id);
      const x = t;
      x.addEventListener("click", (C) => {
        const m = C.target;
        if (!(m instanceof Element)) return;
        if (m.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        if (r && (m.closest("[data-spin]") || m.closest("[data-reels]"))) {
          k?.turbo();
          return;
        }
        const Y = m.closest("[data-bet]"), z = Y instanceof HTMLElement ? Number(Y.dataset.bet) : Number.NaN;
        if (N.includes(z) && !r) {
          a = z, x.classList.remove("is-bets"), A();
          return;
        }
        if (m.closest("[data-bet-dec]")) {
          const W = N.indexOf(a), B = N[W - 1];
          !r && B !== void 0 && (a = B), x.classList.remove("is-bets"), A();
          return;
        }
        if (m.closest("[data-bet-inc]")) {
          const W = N.indexOf(a), B = N[W + 1];
          !r && B !== void 0 && (a = B), x.classList.remove("is-bets"), A();
          return;
        }
        if (m.closest("[data-peek]")) {
          x.classList.toggle("is-panels");
          return;
        }
        if (m.closest("[data-amount-bar]")) {
          r || x.classList.toggle("is-bets");
          return;
        }
        if (x.classList.contains("is-bets") && !m.closest("[data-bet-ui]") && x.classList.remove("is-bets"), m.closest("[data-turbo]")) {
          r ? k?.turbo() : ($ = !$, A());
          return;
        }
        m.closest("[data-spin]") && X(), m.closest("[data-auto]") && (l = !l, l && !r && X(), A());
      }), le(!1), Be();
      const F = () => k?.resize();
      window.addEventListener("resize", F), s.push(() => window.removeEventListener("resize", F)), s.push(
        c.loop.onUpdate((C) => {
          if (r && k) {
            const m = k.update(C, c.audio);
            d && !m && !y ? (P += C, P >= 0.22 && (y = !0, Pe())) : m && (P = 0);
          }
          if (i > 0 && t) {
            p = Math.min(i, p + i * C * 0.95);
            const m = t.querySelector("[data-big-value]");
            m && (m.textContent = String(Math.round(p))), p >= i - 0.4 && (u = String(Math.round(i)), i = 0, m && (m.textContent = u));
          }
          !r && l && f === "running" && o > 0 && (o -= C, o <= 0 && X());
        }),
        c.store.subscribe((C, m) => {
          C.ui.locale !== m.ui.locale && A();
        }),
        c.events.on("game:start", () => {
          f === "ready" && (f = "running", v = h("slots.ready"), I(), A());
        }),
        c.events.on("game:restart", () => {
          _e();
        })
      );
    },
    onPause(c) {
      c.store.getState().game.status === "running" && ne(c.store, { status: "paused" });
    },
    onResume(c) {
      c.store.getState().game.status === "paused" && ne(c.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const c of s) c();
      s.length = 0, k?.destroy(), k = null, t?.remove(), t = null, e = null;
    }
  });
}
function yt() {
  const e = N.map(
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
        <p class="slots-message" data-message></p>
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
  ].map(([t, n, a]) => `<li><b class="is-${a}">${t}</b><span>${n}</span></li>`).join("")}</ul>
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
        <button type="button" class="slots-round" data-turbo aria-label="加速"></button>
        <button type="button" class="slots-spin" data-spin disabled aria-label="SPIN">
          <svg class="slots-spin-arrows" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 5V2L7 6l5 4V7a5 5 0 1 1-4.9 6H5.1A7 7 0 1 0 12 5z"/>
          </svg>
        </button>
        <button type="button" class="slots-round" data-auto aria-label="自动"></button>
      </div>
    </div>
  `;
}
function xe(e, s) {
  return s(e === "server" ? "slots.server" : e === "local" ? "slots.local" : "slots.pending");
}
function St() {
  return `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function Me() {
  try {
    const e = localStorage.getItem(re);
    if (!e) return D();
    const s = JSON.parse(e);
    return !s || typeof s.credits != "number" ? D() : {
      credits: Math.max(0, Math.floor(s.credits)),
      freeSpins: Math.max(0, Math.floor(s.freeSpins ?? 0)),
      freeBet: typeof s.freeBet == "number" ? s.freeBet : 20
    };
  } catch {
    return D();
  }
}
function Re(e) {
  return {
    credits: e.credits,
    freeSpins: e.freeSpins,
    freeBet: e.freeBet
  };
}
function ae() {
  const e = new Fe(), s = vt(), t = xt();
  if (s) e.set({ accessToken: s });
  else if (t?.accessToken && !t.accessToken.startsWith("local."))
    e.set({ accessToken: t.accessToken, refreshToken: t.refreshToken });
  else {
    const n = Et();
    n && e.set({ accessToken: n });
  }
  return new Ye({ baseUrl: $e(), tokens: e, timeoutMs: 2500 });
}
function vt() {
  try {
    const e = sessionStorage.getItem("wgf:launch-token");
    return e && e.length >= 8 ? e : null;
  } catch {
    return null;
  }
}
async function wt() {
  const e = await ae().post("/api/slots/session", {});
  return e.walletToken && localStorage.setItem(Ne, e.walletToken), e;
}
async function kt(e, s) {
  return ae().post("/api/slots/spin", { bet: e, spinId: s });
}
async function Tt() {
  const e = await ae().post("/api/slots/reset", {});
  return Re(e);
}
async function At() {
  try {
    return (await fetch(`${$e()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
function $e() {
  return mt?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function Et() {
  const e = localStorage.getItem(Ne);
  return e && e.startsWith("v1w.") ? e : null;
}
function xt() {
  try {
    const e = localStorage.getItem(ht);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
export {
  Ct as createGame,
  H as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
