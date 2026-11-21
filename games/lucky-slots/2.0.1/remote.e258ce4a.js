import { registerStrings as Pe, defineGame as $e, patchGame as Z, readHighScore as pe, t as _e, writeHighScore as Be } from "@wgf/core";
import { TokenStore as Oe, HttpClient as Ge } from "@wgf/net";
const We = {
  background: "#2a140c",
  shapes: [
    { tag: "rect", attrs: { x: 48, y: 56, width: 224, height: 120, rx: 16, fill: "#1a0d08" } },
    { tag: "circle", attrs: { cx: 92, cy: 116, r: 22, fill: "#ff4d6d" } },
    { tag: "circle", attrs: { cx: 148, cy: 116, r: 22, fill: "#ffb703" } },
    { tag: "circle", attrs: { cx: 204, cy: 116, r: 22, fill: "#f6f1e7" } },
    { tag: "rect", attrs: { x: 118, y: 188, width: 84, height: 28, rx: 14, fill: "#ff5a1f" } }
  ]
}, B = {
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
  art: We,
  renderer: "dom",
  controls: "pointer",
  tags: ["拉霸", "联网"],
  theme: { accent: "#ffb703", accentInk: "#2a1408", glow: "#ff5a1f", radius: 18, font: "serif" }
}, D = [10, 20, 50, 100], He = 1e3, z = 3, Ae = 3, Ye = 1 / 130, ee = [
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
], ne = [
  [1, 1, 1],
  [0, 0, 0],
  [2, 2, 2],
  [0, 1, 2],
  [2, 1, 0]
], Fe = {
  lion: 50,
  ingot: 20,
  lantern: 5,
  fan: 2,
  coin: 1.6,
  knot: 1,
  spark: 0.6
}, ge = ["ingot", "lantern", "fan", "coin", "knot", "spark"];
function De(e) {
  return D.includes(e);
}
function W() {
  return { credits: He, freeSpins: 0, freeBet: 20 };
}
function me(e) {
  return Array.from({ length: z }, () => {
    const s = Math.floor(e() * ee.length);
    return [0, 1, 2].map((t) => ee[(s + t) % ee.length] ?? "spark");
  });
}
function ze(e, s) {
  const t = [];
  ne.forEach((l, r) => {
    const a = l.map((c, S) => e[S]?.[c] ?? "blank"), n = Je(a, s);
    n && t.push({ line: r, symbol: n.symbol, count: 3, payout: n.payout });
  });
  let o = t.reduce((l, r) => l + r.payout, 0);
  return Ke(t) && o > 0 && (o *= 10), {
    grid: e,
    wins: t,
    scatterCount: 0,
    scatterPayout: 0,
    freeSpinsAwarded: 0,
    win: o,
    bigWin: o >= s * 10,
    megaWin: o >= s * 25,
    feature: null
  };
}
function Ue(e, s, t) {
  if (!De(s)) return { error: "bad_bet" };
  if (e.credits < s) return { error: "insufficient" };
  e.credits -= s;
  const o = t() < Ye ? Ve(t) : null, l = o ? o.steps.at(-1)?.grid ?? me(t) : me(t), r = ze(l, s);
  return r.feature = o, e.credits += r.win, { ...r, credits: e.credits, freeSpinsLeft: 0, bet: s };
}
function Ke(e) {
  const s = /* @__PURE__ */ new Set();
  for (const t of e)
    ne[t.line]?.forEach((l, r) => s.add(`${r}:${l}`));
  return s.size === z * Ae;
}
function Je(e, s) {
  if (e.some((r) => r === "blank")) return null;
  const o = e.find((r) => r !== "lion") ?? "lion";
  if (e.some((r) => r !== o && r !== "lion")) return null;
  const l = Fe[o];
  return l ? { symbol: o, payout: Math.round(l * s) } : null;
}
function Ve(e) {
  const s = ge[Math.floor(e() * ge.length)] ?? "ingot", t = 3 + Math.floor(e() * 7), o = [];
  for (let a = 0; a < z; a += 1)
    for (let n = 0; n < Ae; n += 1) o.push([a, n]);
  for (let a = o.length - 1; a > 0; a -= 1) {
    const n = Math.floor(e() * (a + 1)), c = o[a];
    o[a] = o[n] ?? c, o[n] = c;
  }
  const l = Array.from({ length: z }, () => ["blank", "blank", "blank"]), r = [];
  for (const [a, n] of o.slice(0, t)) {
    const c = l[a];
    c && (c[n] = e() < 0.1 ? "lion" : s, r.push({ grid: je(l) }));
  }
  return { symbol: s, steps: r };
}
function je(e) {
  return e.map((s) => [...s]);
}
function Qe() {
  Pe("slots", {
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
const P = 24, H = 3, oe = 3, he = ["lion", "ingot", "lantern", "fan", "coin", "knot", "spark"], ye = {
  startStagger: 0.11,
  stopStagger: 0.17,
  accel: 0.17,
  cruise: 26,
  minSpin: 2,
  postCruise: 0.25,
  settle: 0.3
}, te = {
  startStagger: 0,
  stopStagger: 0,
  accel: 0.1,
  cruise: 44,
  minSpin: 0.93,
  postCruise: 0.15,
  settle: 0.15
};
function Xe(e = !1) {
  return {
    reels: Array.from({ length: H }, (s, t) => ({
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
        { length: P },
        (o, l) => he[(t * 3 + l) % he.length] ?? "spark"
      )
    })),
    spinAge: 0,
    schedule: Array.from({ length: H }, () => Number.POSITIVE_INFINITY),
    result: null,
    quick: !1,
    tease: !1,
    reduced: e
  };
}
function Ze(e, s) {
  let t = Me(e + s);
  return t > oe + 1 && (t -= P), t;
}
function et(e, s) {
  return Me(s - Math.round(e));
}
function be(e, s) {
  e.result = null, e.quick = !1, e.tease = !1, e.spinAge = 0, e.schedule = e.schedule.map(() => Number.POSITIVE_INFINITY), e.reels.forEach((t, o) => {
    const l = Ie(s[o]);
    t.target = l, t.phase = "idle", t.speed = 0, t.landed = !0, t.offset = 0, Te(t, 0, l);
  });
}
function Se(e) {
  e.result = null, e.quick = !1, e.tease = !1, e.spinAge = 0, e.schedule = e.schedule.map(() => Number.POSITIVE_INFINITY);
  const s = U(e).startStagger;
  e.reels.forEach((t, o) => {
    t.phase = "wait", t.startAt = o * s, t.speed = 0, t.accelElapsed = 0, t.stopStartedAt = -1, t.landed = !1, t.elapsed = 0;
  });
}
function tt(e) {
  if (e.reduced || (e.quick = !0, e.tease = !1, !e.result)) return;
  const s = te.settle;
  e.reels.forEach((t, o) => {
    t.phase === "stop" ? t.duration = Math.min(t.duration, s) : t.landed || (e.schedule[o] = e.spinAge + o * te.stopStagger);
  });
}
function we(e, s) {
  e.result = s;
  const t = U(e), o = (H - 1) * t.stopStagger + t.settle, l = Math.max(t.minSpin - o, e.spinAge + t.postCruise);
  for (let r = 0; r < H; r += 1)
    e.schedule[r] = l + r * t.stopStagger;
}
function st(e, s) {
  const t = Math.min(0.1, Math.max(0, s));
  e.spinAge += t;
  const o = U(e), l = { moving: !1, ticks: [], landed: [], scatters: [] };
  let r = 0;
  for (let a = 0; a < H; a += 1) {
    const n = e.reels[a];
    if (n) {
      if (n.phase === "wait" && e.spinAge >= n.startAt && (n.phase = "spin", n.accelElapsed = 0), n.phase === "wait")
        l.moving = !0;
      else if (n.phase === "spin") {
        l.moving = !0;
        const c = e.reduced ? 10 : o.cruise, S = e.reduced ? 0.12 : o.accel;
        n.accelElapsed += t;
        const h = Math.sin(Math.min(1, n.accelElapsed / S) * (Math.PI / 2));
        let k = c * h;
        e.tease && e.result && !e.quick && !e.reduced && (k = Math.min(k, 9));
        const L = Math.floor(n.offset);
        n.offset += k * t, n.speed = k;
        const I = Math.floor(n.offset);
        n.tickAt += t;
        const u = n.speed > 16 ? 0.08 : 0.045;
        !e.reduced && I !== L && n.tickAt > u && (n.tickAt = 0, l.ticks.push(a));
        const d = e.schedule[a] ?? Number.POSITIVE_INFINITY, p = ot(e, a, o.stopStagger);
        e.result && e.spinAge >= d && (p || e.quick) && nt(e, a);
      } else if (n.phase === "stop") {
        l.moving = !0, n.elapsed += t;
        const S = 2 * (n.stopAt - n.from) / n.duration, h = S / n.duration, k = Math.min(n.duration, n.elapsed);
        n.offset = n.from + S * k - 0.5 * h * k * k, n.speed = Math.max(0, S - h * k), n.offset > n.stopAt && (n.offset = n.stopAt), n.elapsed >= n.duration && (n.offset = n.stopAt, n.phase = "idle", n.speed = 0, n.landed = !0, l.landed.push(a), n.target.includes("lion") && l.scatters.push(a));
      }
      if (n.landed)
        for (const c of n.target) c === "lion" && (r += 1);
    }
  }
  if (!e.tease && r >= 2 && e.reels.some((a) => !a.landed)) {
    e.tease = !0;
    const a = e.reduced || e.quick ? 0.05 : 0.62;
    e.reels.forEach((n, c) => {
      if (n.landed || n.phase === "stop") return;
      const S = e.schedule[c] ?? 0;
      e.schedule[c] = Math.max(S, e.spinAge + a * (c + 1));
    });
  }
  return l;
}
function nt(e, s) {
  const t = e.reels[s];
  if (!t || t.phase !== "spin") return;
  const o = Ie(e.result?.[s]);
  t.target = o;
  const l = U(e), r = e.reduced ? 0.2 : e.tease && !e.quick ? 0.7 : l.settle, a = e.reduced ? 10 : l.cruise, n = Math.max(oe + 1.25, 0.5 * a * r), c = Math.ceil(t.offset + n);
  Te(t, c, o), t.stopAt = c, t.from = t.offset, t.elapsed = 0, t.duration = 2 * (c - t.offset) / a, t.stopStartedAt = e.spinAge, t.phase = "stop";
}
function ot(e, s, t) {
  if (s === 0) return !0;
  const o = e.reels[s - 1];
  return !o || o.stopStartedAt < 0 ? !1 : e.spinAge >= o.stopStartedAt + t;
}
function U(e) {
  return e.reduced ? { ...ye, startStagger: 0.02, stopStagger: 0.04, minSpin: 0.4 } : e.quick ? te : ye;
}
function Te(e, s, t) {
  for (let o = 0; o < oe; o += 1) {
    const l = t[o] ?? "spark", r = et(s, o);
    e.symbols[r] = l;
  }
}
function Ie(e) {
  return [e?.[0] ?? "spark", e?.[1] ?? "knot", e?.[2] ?? "coin"];
}
function Me(e) {
  return (e % P + P) % P;
}
const rt = {
  lion: { text: "W", tier: "wild" },
  ingot: { text: "A", tier: "a" },
  lantern: { text: "K", tier: "k" },
  fan: { text: "Q", tier: "q" },
  coin: { text: "J", tier: "low" },
  knot: { text: "10", tier: "low" },
  spark: { text: "9", tier: "low" },
  blank: { text: "", tier: "blank" }
}, at = /* @__PURE__ */ new Set(["lion", "ingot", "lantern", "fan"]);
function it(e) {
  const s = window.matchMedia("(prefers-reduced-motion: reduce)").matches, t = Xe(s);
  e.replaceChildren(), e.classList.add("lion-board");
  const o = [], l = [];
  for (let u = 0; u < t.reels.length; u += 1) {
    const d = document.createElement("div");
    d.className = "lion-col";
    const p = [];
    for (let f = 0; f < 3; f += 1) {
      const g = document.createElement("div");
      g.className = "lion-window";
      const E = document.createElement("div");
      E.className = "lion-strip";
      const m = [], v = t.reels[u]?.symbols ?? [];
      for (let M = 0; M < P; M += 1) {
        const N = document.createElement("div");
        N.className = "lion-glyph";
        const R = v[M] ?? "spark";
        ve(N, R), E.appendChild(N), m.push({ el: N, symbol: R });
      }
      g.appendChild(E), d.appendChild(g), p.push(m);
    }
    e.appendChild(d), o.push(d), l.push(p);
  }
  const r = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  r.setAttribute("class", "lion-lines"), r.setAttribute("viewBox", "0 0 100 100"), r.setAttribute("preserveAspectRatio", "none"), e.appendChild(r);
  let a = [], n = 0, c = 80;
  const S = () => {
    const u = o[0]?.querySelector(".lion-window"), d = u instanceof HTMLElement ? u.clientHeight : 0;
    d < 8 || (c = d, e.style.setProperty("--glyph", `${Math.round(d * 0.58)}px`), e.style.setProperty("--glyph-wide", `${Math.round(d * 0.46)}px`));
  };
  function h() {
    c < 8 && S(), t.reels.forEach((u, d) => {
      const p = l[d];
      if (p)
        for (let f = 0; f < P; f += 1) {
          const g = u.symbols[f] ?? "spark", E = Ze(f, u.offset);
          p.forEach((m, v) => {
            const M = m[f];
            M && (M.symbol !== g && (M.symbol = g, ve(M.el, g)), M.el.style.transform = `translateY(${(E - v) * c}px)`);
          });
        }
    });
  }
  function k() {
    if (n >= a.length - 1) return !1;
    n += 1;
    const u = a[n];
    return u ? (Se(t), t.quick = !0, we(t, u), L(u), !0) : !1;
  }
  function L(u) {
    e.querySelectorAll(".lion-window").forEach((d) => d.classList.remove("is-lock")), u.forEach((d, p) => {
      d.forEach((f, g) => {
        f !== "blank" && o[p]?.children[g]?.classList.add("is-lock");
      });
    });
  }
  S();
  const I = new ResizeObserver(() => {
    S(), h();
  });
  return I.observe(e), h(), {
    show(u) {
      a = [], n = 0, be(t, u), r.replaceChildren(), e.querySelectorAll(".is-win, .is-lock, .is-dim").forEach((d) => {
        d.classList.remove("is-win", "is-lock", "is-dim");
      }), h();
    },
    spin() {
      Se(t), r.replaceChildren(), e.querySelectorAll(".is-win, .is-lock, .is-dim").forEach((u) => {
        u.classList.remove("is-win", "is-lock", "is-dim");
      }), h();
    },
    turbo() {
      tt(t);
    },
    deliver(u, d) {
      a = d?.steps.map((p) => p.grid) ?? [u], a[0] || (a = [u]), n = 0, we(t, a[0] ?? u);
    },
    update(u, d) {
      const p = st(t, u);
      if (d && !s) {
        p.ticks.length && d.playTone({ frequency: 620, duration: 0.02, type: "square", gain: 0.01 });
        for (const g of p.landed)
          d.playTone({
            frequency: 220 + g * 70,
            duration: 0.05,
            type: "triangle",
            gain: 0.03
          });
      }
      if (!p.moving && a.length > 1) {
        const g = a[n];
        g && L(g);
      }
      const f = p.moving || k();
      return h(), f;
    },
    celebrate(u) {
      r.replaceChildren();
      const d = /* @__PURE__ */ new Set();
      e.querySelectorAll(".is-win, .is-dim").forEach((p) => {
        p.classList.remove("is-win", "is-dim");
      });
      for (const p of u) {
        const f = ne[p.line];
        if (!f) continue;
        const g = f.slice(0, p.count).map((m, v) => `${(v + 0.5) / 3 * 100},${(m + 0.5) / 3 * 100}`), E = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        E.setAttribute("points", g.join(" ")), E.setAttribute("class", "lion-payline"), r.appendChild(E);
        for (let m = 0; m < p.count; m += 1) {
          const v = f[m] ?? 1;
          d.add(`${m}:${v}`), o[m]?.children[v]?.classList.add("is-win");
        }
      }
      u.length > 0 && o.forEach((p, f) => {
        Array.from(p.children).forEach((g, E) => {
          d.has(`${f}:${E}`) || g.classList.add("is-dim");
        });
      });
    },
    resize() {
      S(), h();
    },
    abort() {
      a = [], n = 0, be(
        t,
        t.reels.map((u) => u.target)
      ), r.replaceChildren(), h();
    },
    destroy() {
      I.disconnect(), e.replaceChildren();
    }
  };
}
function ve(e, s) {
  const t = rt[s];
  e.textContent = t.text, e.dataset.symbol = s, e.className = `lion-glyph is-${t.tier}${at.has(s) ? " is-big" : ""}`;
}
const lt = {}, ct = {
  lion: "W",
  ingot: "A",
  lantern: "K",
  fan: "Q",
  coin: "J",
  knot: "10",
  spark: "9",
  blank: ""
}, ke = [
  ["spark", "ingot", "coin"],
  ["knot", "lantern", "spark"],
  ["coin", "fan", "knot"]
], se = "wgf:slots-wallet", qe = "wgf:slots-token", ut = "wgf:session";
function kt() {
  Qe();
  let e = null;
  const s = [];
  let t = null, o = W(), l = 20, r = !1, a = !1, n = 0, c = null, S = !1, h = 0, k = 0, L = !1, I = "pending", u = !1, d = null, p = 0, f = "", g = "", E = 0, m = 0, v = "ready", M = 0, N = 0, R = !1, Y = 0, $ = null, A = null;
  function y(i, w) {
    return _e(e?.store.getState().ui.locale ?? "zh", i, w);
  }
  function K(i, w) {
    w === "spin" && i.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), w === "stop" && i.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), w === "win" && i.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), w === "big" && i.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), w === "scatter" && i.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function x() {
    e && Z(e.store, {
      id: B.id,
      status: v,
      score: h,
      highScore: Math.max(k, h),
      message: f,
      detail: Ee(I, y),
      combo: o.freeSpins,
      credits: o.credits
    });
  }
  function T() {
    if (!t) return;
    const i = t.querySelector("[data-credits]"), w = t.querySelector("[data-message]"), q = t.querySelector("[data-amount]"), O = t.querySelector("[data-clock]"), C = t.querySelector("[data-spin-no]"), b = t.querySelector("[data-mult]"), F = t.querySelector("[data-demo]"), G = t.querySelector("[data-feature]"), j = t.querySelector("[data-feature-glyph]"), le = t.querySelector("[data-source]");
    if (i && (i.textContent = String(o.credits)), q && (q.textContent = String(l)), O) {
      const _ = /* @__PURE__ */ new Date();
      O.textContent = `${_.getHours()}:${String(_.getMinutes()).padStart(2, "0")}`;
    }
    C && (C.textContent = M > 0 ? String(M) : "—"), b && (b.textContent = `${N}×`), F && (F.hidden = I !== "local"), G && (G.hidden = !$), j && $ && (j.textContent = ct[$], j.className = `is-${$}`), le && (le.textContent = Ee(I, y)), w && (w.textContent = f || (v === "running" && !r ? y("slots.place") : "")), t.querySelectorAll("[data-bet]").forEach((_) => {
      _.classList.toggle("is-bet", Number(_.dataset.bet) === l), _.disabled = r;
    });
    const Q = t.querySelector("[data-spin]"), ce = t.querySelector("[data-note]");
    ce && (ce.textContent = y("slots.note"));
    const X = t.querySelector("[data-auto]");
    Q && (Q.disabled = !u || v !== "running", Q.textContent = y(r ? "slots.stop" : "slots.spin"));
    const ue = t.querySelector("[data-turbo]");
    ue && ue.classList.toggle("is-on", R), X && (X.setAttribute("aria-pressed", a ? "true" : "false"), X.disabled = v !== "running" || r);
    const fe = t.querySelector("[data-big]"), de = t.querySelector("[data-big-value]");
    fe && (fe.hidden = !g), de && m <= 0 && (de.textContent = g);
  }
  function J() {
    I === "local" && localStorage.setItem(se, JSON.stringify(o));
  }
  function ae(i) {
    o = {
      credits: i.credits,
      freeSpins: i.freeSpinsLeft,
      freeBet: i.freeSpinsLeft > 0 ? i.bet : o.freeBet
    }, J(), c = i, S = !1, n = 0, g = "", m = 0, f = y("slots.place"), $ = i.feature?.symbol ?? null, h += i.win, M += 1, N = i.bet > 0 ? Math.round(i.win / i.bet * 10) / 10 : 0, A?.deliver(i.grid, i.feature), x(), T();
  }
  async function V() {
    if (!e || r || v !== "running" || !u || I === "pending")
      return;
    if (o.freeSpins <= 0 && o.credits < l) {
      f = y("slots.broke"), a = !1, x(), T();
      return;
    }
    r = !0, Y = 0, $ = null, g = "", m = 0, S = !1, A?.spin(), R && A?.turbo(), e && K(e.audio, "spin");
    const i = p, w = d ?? dt();
    if (d = w, T(), I === "local") {
      const q = Ue(o, l, Math.random);
      if (i !== p || !e) return;
      if (d = null, "error" in q) {
        r = !1, A?.abort(), f = q.error === "insufficient" ? y("slots.broke") : y("slots.badBet"), a = !1, x(), T();
        return;
      }
      ae(q);
      return;
    }
    try {
      const q = await mt(l, w);
      if (i !== p || !e) return;
      d = null, ae(q);
    } catch {
      if (i !== p || !e) return;
      r = !1, A?.abort(), a = !1, f = y("slots.retry"), x(), T();
    }
  }
  function Le() {
    if (!c || !e) return;
    r = !1, A?.celebrate(c.wins), c.win > 0 ? (f = y("slots.won", { n: c.win }), K(e.audio, c.bigWin ? "big" : "win")) : f = y("slots.place"), c.feature && (f = y("slots.feature", {
      message: f,
      symbol: y(`slots.symbol.${c.feature.symbol}`)
    }), K(e.audio, "scatter")), c.bigWin && (g = "0", E = 0, m = c.win, a = !1), h > k && Be(B.id, h), o.credits < D[0] && o.freeSpins === 0 && (a = !1, v = "over", f = y("slots.empty"), L || (L = !0, e.events.emit("game:over", {
      gameId: B.id,
      score: h,
      best: Math.max(k, h),
      isRecord: h > k
    }))), c = null, n = a ? 0.7 : 0, x(), T();
  }
  async function Ne() {
    if (!await yt()) {
      I = "local", u = !0, o = pt(), J(), f = y("slots.place"), x(), T();
      return;
    }
    try {
      const w = await gt();
      I = "server", u = !0, o = xe(w), f = y("slots.place"), x(), T();
    } catch {
      u = !1, f = y("slots.serverDown"), x(), T();
    }
  }
  function ie(i) {
    l = 20, r = !1, a = !1, c = null, S = !1, n = 0, h = 0, L = !1, g = "", m = 0, A?.abort(), A?.show(ke), f = y("slots.place"), v = i ? "running" : "ready", x(), T();
  }
  async function Re() {
    if (p += 1, d = null, k = pe(B.id), I === "server")
      try {
        o = await ht();
      } catch {
        f = y("slots.resetFail"), x(), T();
        return;
      }
    else I === "local" && (localStorage.removeItem(se), o = W(), J());
    ie(!0);
  }
  return $e(B, {
    async onPreload(i, w) {
      await i.preload([], w);
    },
    async onMount(i) {
      e = i, i.container.setAttribute("data-wgf-game", "wgf-game:slots"), t = document.createElement("div"), t.className = "slots", t.innerHTML = ft();
      const w = t.querySelector("[data-reels]");
      w instanceof HTMLElement && (A = await it(w), A.show(ke)), i.container.appendChild(t), k = pe(B.id);
      const q = t;
      q.addEventListener("click", (C) => {
        const b = C.target;
        if (!(b instanceof HTMLElement)) return;
        if (r && (b.closest("[data-spin]") || b.closest("[data-reels]"))) {
          A?.turbo();
          return;
        }
        const F = b.closest("[data-bet]"), G = Number(F?.dataset.bet);
        if (D.includes(G) && !r) {
          l = G, q.classList.remove("is-bets"), T();
          return;
        }
        if (b.closest("[data-peek]")) {
          q.classList.toggle("is-panels");
          return;
        }
        if (b.closest("[data-amount-bar]")) {
          q.classList.toggle("is-bets");
          return;
        }
        if (b.closest("[data-turbo]")) {
          r ? A?.turbo() : (R = !R, T());
          return;
        }
        b.closest("[data-spin]") && V(), b.closest("[data-auto]") && (a = !a, a && !r && V(), T());
      }), ie(!1), Ne();
      const O = () => A?.resize();
      window.addEventListener("resize", O), s.push(() => window.removeEventListener("resize", O)), s.push(
        i.loop.onUpdate((C) => {
          if (r && A) {
            const b = A.update(C, i.audio);
            c && !b && !S ? (Y += C, Y >= 0.22 && (S = !0, Le())) : b && (Y = 0);
          }
          if (m > 0 && t) {
            E = Math.min(m, E + m * C * 0.95);
            const b = t.querySelector("[data-big-value]");
            b && (b.textContent = String(Math.round(E))), E >= m - 0.4 && (g = String(Math.round(m)), m = 0, b && (b.textContent = g));
          }
          !r && a && v === "running" && n > 0 && (n -= C, n <= 0 && V());
        }),
        i.store.subscribe((C, b) => {
          C.ui.locale !== b.ui.locale && T();
        }),
        i.events.on("game:start", () => {
          v === "ready" && (v = "running", f = y("slots.ready"), x(), T());
        }),
        i.events.on("game:restart", () => {
          Re();
        })
      );
    },
    onPause(i) {
      i.store.getState().game.status === "running" && Z(i.store, { status: "paused" });
    },
    onResume(i) {
      i.store.getState().game.status === "paused" && Z(i.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const i of s) i();
      s.length = 0, A?.destroy(), A = null, t?.remove(), t = null, e = null;
    }
  });
}
function ft() {
  const e = D.map(
    (t) => `<button type="button" data-bet="${t}">${t}</button>`
  ).join("");
  return `
    <header class="slots-top">
      <div class="slots-top-left">
        <div class="slots-tools"><span class="slots-menu-gap"></span><span data-clock>--:--</span></div>
        <strong class="slots-title">金狮奇缘</strong>
      </div>
      <div class="slots-top-right">
        <span class="slots-rtp">RTP 96.99%</span>
        <span class="slots-balance"><span data-credits>1000</span></span>
        <span class="slots-demo" data-demo hidden>试玩</span>
        <span class="slots-source" data-source></span>
      </div>
    </header>
    <div class="slots-stage">
      <button type="button" class="slots-peek" data-peek aria-label="面板">&gt;</button>
      <aside class="slots-panel slots-panel-left">
        <h2>这一局</h2>
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
  ].map(([t, o, l]) => `<li><b class="is-${l}">${t}</b><span>${o}</span></li>`).join("")}</ul>
      </aside>
    </div>
    <div class="slots-dock">
      <button type="button" class="slots-amount" data-amount-bar>
        <span>AMOUNT</span>
        <strong data-amount>20</strong>
      </button>
      <div class="slots-betlist">${e}</div>
      <div class="slots-controls">
        <button type="button" class="slots-icon" data-turbo aria-label="加速"></button>
        <button type="button" class="slots-spin" data-spin disabled>SPIN</button>
        <button type="button" class="slots-icon" data-auto aria-label="自动"></button>
      </div>
    </div>
  `;
}
function Ee(e, s) {
  return s(e === "server" ? "slots.server" : e === "local" ? "slots.local" : "slots.pending");
}
function dt() {
  return `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function pt() {
  try {
    const e = localStorage.getItem(se);
    if (!e) return W();
    const s = JSON.parse(e);
    return !s || typeof s.credits != "number" ? W() : {
      credits: Math.max(0, Math.floor(s.credits)),
      freeSpins: Math.max(0, Math.floor(s.freeSpins ?? 0)),
      freeBet: typeof s.freeBet == "number" ? s.freeBet : 20
    };
  } catch {
    return W();
  }
}
function xe(e) {
  return {
    credits: e.credits,
    freeSpins: e.freeSpins,
    freeBet: e.freeBet
  };
}
function re() {
  const e = new Oe(), s = St();
  if (s?.accessToken && !s.accessToken.startsWith("local."))
    e.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const t = bt();
    t && e.set({ accessToken: t });
  }
  return new Ge({ baseUrl: Ce(), tokens: e, timeoutMs: 2500 });
}
async function gt() {
  const e = await re().post("/api/slots/session", {});
  return e.walletToken && localStorage.setItem(qe, e.walletToken), e;
}
async function mt(e, s) {
  return re().post("/api/slots/spin", { bet: e, spinId: s });
}
async function ht() {
  const e = await re().post("/api/slots/reset", {});
  return xe(e);
}
async function yt() {
  try {
    return (await fetch(`${Ce()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
function Ce() {
  return lt?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function bt() {
  const e = localStorage.getItem(qe);
  return e && e.startsWith("v1w.") ? e : null;
}
function St() {
  try {
    const e = localStorage.getItem(ut);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
export {
  kt as createGame,
  B as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
