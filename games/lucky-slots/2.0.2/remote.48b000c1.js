import { registerStrings as Bt, defineGame as Pt, patchGame as et, readHighScore as pt, t as _t, writeHighScore as Ot } from "@wgf/core";
import { TokenStore as Wt, HttpClient as Gt } from "@wgf/net";
const Yt = {
  background: "#2a140c",
  shapes: [
    { tag: "rect", attrs: { x: 48, y: 56, width: 224, height: 120, rx: 16, fill: "#1a0d08" } },
    { tag: "circle", attrs: { cx: 92, cy: 116, r: 22, fill: "#ff4d6d" } },
    { tag: "circle", attrs: { cx: 148, cy: 116, r: 22, fill: "#ffb703" } },
    { tag: "circle", attrs: { cx: 204, cy: 116, r: 22, fill: "#f6f1e7" } },
    { tag: "rect", attrs: { x: 118, y: 188, width: 84, height: 28, rx: 14, fill: "#ff5a1f" } }
  ]
}, G = {
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
  art: Yt,
  renderer: "dom",
  controls: "pointer",
  tags: ["拉霸", "联网"],
  theme: { accent: "#ffb703", accentInk: "#2a1408", glow: "#ff5a1f", radius: 18, font: "serif" }
}, K = [10, 20, 50, 100], Ft = 1e3, V = 3, Tt = 3, Ht = 1 / 130, nt = [
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
], Ut = {
  lion: 50,
  ingot: 20,
  lantern: 5,
  fan: 2,
  coin: 1.6,
  knot: 1,
  spark: 0.6
}, gt = ["ingot", "lantern", "fan", "coin", "knot", "spark"];
function zt(t) {
  return K.includes(t);
}
function U() {
  return { credits: Ft, freeSpins: 0, freeBet: 20 };
}
function mt(t) {
  return Array.from({ length: V }, () => {
    const s = Math.floor(t() * nt.length);
    return [0, 1, 2].map((e) => nt[(s + e) % nt.length] ?? "spark");
  });
}
function Dt(t, s) {
  const e = [];
  J.forEach((a, r) => {
    const l = a.map((d, A) => t[A]?.[d] ?? "blank"), o = Jt(l, s);
    o && e.push({ line: r, symbol: o.symbol, count: 3, payout: o.payout });
  });
  let n = e.reduce((a, r) => a + r.payout, 0);
  return Vt(e) && n > 0 && (n *= 10), {
    grid: t,
    wins: e,
    scatterCount: 0,
    scatterPayout: 0,
    freeSpinsAwarded: 0,
    win: n,
    bigWin: n >= s * 10,
    megaWin: n >= s * 25,
    feature: null
  };
}
function Kt(t, s, e) {
  if (!zt(s)) return { error: "bad_bet" };
  if (t.credits < s) return { error: "insufficient" };
  t.credits -= s;
  const n = e() < Ht ? jt(e) : null, a = n ? n.steps.at(-1)?.grid ?? mt(e) : mt(e), r = Dt(a, s);
  return r.feature = n, t.credits += r.win, { ...r, credits: t.credits, freeSpinsLeft: 0, bet: s };
}
function Vt(t) {
  const s = /* @__PURE__ */ new Set();
  for (const e of t)
    J[e.line]?.forEach((a, r) => s.add(`${r}:${a}`));
  return s.size === V * Tt;
}
function Jt(t, s) {
  if (t.some((r) => r === "blank")) return null;
  const n = t.find((r) => r !== "lion") ?? "lion";
  if (t.some((r) => r !== n && r !== "lion")) return null;
  const a = Ut[n];
  return a ? { symbol: n, payout: Math.round(a * s) } : null;
}
function jt(t) {
  const s = gt[Math.floor(t() * gt.length)] ?? "ingot", e = 3 + Math.floor(t() * 7), n = [];
  for (let l = 0; l < V; l += 1)
    for (let o = 0; o < Tt; o += 1) n.push([l, o]);
  for (let l = n.length - 1; l > 0; l -= 1) {
    const o = Math.floor(t() * (l + 1)), d = n[l];
    n[l] = n[o] ?? d, n[o] = d;
  }
  const a = Array.from({ length: V }, () => ["blank", "blank", "blank"]), r = [];
  for (const [l, o] of n.slice(0, e)) {
    const d = a[l];
    d && (d[o] = t() < 0.1 ? "lion" : s, r.push({ grid: Qt(a) }));
  }
  return { symbol: s, steps: r };
}
function Qt(t) {
  return t.map((s) => [...s]);
}
function Xt() {
  Bt("slots", {
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
function Zt(t, s, e) {
  return e === 0 || s <= 0 ? 0 : (t % s + s) % s * e;
}
function te(t, s) {
  return {
    x: t.x - s.x + t.width / 2,
    y: t.y - s.y + t.height / 2
  };
}
function ee(t, s) {
  return t.map((e, n) => {
    const a = s[n]?.[e];
    return a ? `${a.x},${a.y}` : "";
  }).filter((e) => e.length > 0).join(" ");
}
const O = 24, z = 3, xt = 3, ht = ["lion", "ingot", "lantern", "fan", "coin", "knot", "spark"], yt = {
  startStagger: 0.11,
  stopStagger: 0.17,
  accel: 0.17,
  cruise: 26,
  minSpin: 2,
  postCruise: 0.25,
  settle: 0.3
}, st = {
  startStagger: 0,
  stopStagger: 0,
  accel: 0.1,
  cruise: 44,
  minSpin: 0.93,
  postCruise: 0.15,
  settle: 0.15
};
function ne(t = !1) {
  return {
    reels: Array.from({ length: z }, (s, e) => ({
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
        (n, a) => ht[(e * 3 + a) % ht.length] ?? "spark"
      )
    })),
    spinAge: 0,
    schedule: Array.from({ length: z }, () => Number.POSITIVE_INFINITY),
    result: null,
    quick: !1,
    tease: !1,
    reduced: t
  };
}
function se(t, s) {
  return le(s - Math.round(t));
}
function bt(t, s) {
  t.result = null, t.quick = !1, t.tease = !1, t.spinAge = 0, t.schedule = t.schedule.map(() => Number.POSITIVE_INFINITY), t.reels.forEach((e, n) => {
    const a = It(s[n]);
    e.target = a, e.phase = "idle", e.speed = 0, e.landed = !0, e.offset = 0, Ct(e, 0, a);
  });
}
function St(t) {
  t.result = null, t.quick = !1, t.tease = !1, t.spinAge = 0, t.schedule = t.schedule.map(() => Number.POSITIVE_INFINITY);
  const s = j(t).startStagger;
  t.reels.forEach((e, n) => {
    e.phase = "wait", e.startAt = n * s, e.speed = 0, e.accelElapsed = 0, e.stopStartedAt = -1, e.landed = !1, e.elapsed = 0;
  });
}
function oe(t) {
  if (t.reduced || (t.quick = !0, t.tease = !1, !t.result)) return;
  const s = st.settle;
  t.reels.forEach((e, n) => {
    e.phase === "stop" ? e.duration = Math.min(e.duration, s) : e.landed || (t.schedule[n] = t.spinAge + n * st.stopStagger);
  });
}
function wt(t, s) {
  t.result = s;
  const e = j(t), n = (z - 1) * e.stopStagger + e.settle, a = Math.max(e.minSpin - n, t.spinAge + e.postCruise);
  for (let r = 0; r < z; r += 1)
    t.schedule[r] = a + r * e.stopStagger;
}
function re(t, s) {
  const e = Math.min(0.1, Math.max(0, s));
  t.spinAge += e;
  const n = j(t), a = { moving: !1, ticks: [], landed: [], scatters: [] };
  let r = 0;
  for (let l = 0; l < z; l += 1) {
    const o = t.reels[l];
    if (o) {
      if (o.phase === "wait" && t.spinAge >= o.startAt && (o.phase = "spin", o.accelElapsed = 0), o.phase === "wait")
        a.moving = !0;
      else if (o.phase === "spin") {
        a.moving = !0;
        const d = t.reduced ? 10 : n.cruise, A = t.reduced ? 0.12 : n.accel;
        o.accelElapsed += e;
        const E = Math.sin(Math.min(1, o.accelElapsed / A) * (Math.PI / 2));
        let h = d * E;
        t.tease && t.result && !t.quick && !t.reduced && (h = Math.min(h, 9));
        const P = Math.floor(o.offset);
        o.offset += h * e, o.speed = h;
        const x = Math.floor(o.offset);
        o.tickAt += e;
        const $ = o.speed > 16 ? 0.08 : 0.045;
        !t.reduced && x !== P && o.tickAt > $ && (o.tickAt = 0, a.ticks.push(l));
        const L = t.schedule[l] ?? Number.POSITIVE_INFINITY, M = ie(t, l, n.stopStagger);
        t.result && t.spinAge >= L && (M || t.quick) && ae(t, l);
      } else if (o.phase === "stop") {
        a.moving = !0, o.elapsed += e;
        const A = 2 * (o.stopAt - o.from) / o.duration, E = A / o.duration, h = Math.min(o.duration, o.elapsed);
        o.offset = o.from + A * h - 0.5 * E * h * h, o.speed = Math.max(0, A - E * h), o.offset > o.stopAt && (o.offset = o.stopAt), o.elapsed >= o.duration && (o.offset = o.stopAt, o.phase = "idle", o.speed = 0, o.landed = !0, a.landed.push(l), o.target.includes("lion") && a.scatters.push(l));
      }
      if (o.landed)
        for (const d of o.target) d === "lion" && (r += 1);
    }
  }
  if (!t.tease && r >= 2 && t.reels.some((l) => !l.landed)) {
    t.tease = !0;
    const l = t.reduced || t.quick ? 0.05 : 0.62;
    t.reels.forEach((o, d) => {
      if (o.landed || o.phase === "stop") return;
      const A = t.schedule[d] ?? 0;
      t.schedule[d] = Math.max(A, t.spinAge + l * (d + 1));
    });
  }
  return a;
}
function ae(t, s) {
  const e = t.reels[s];
  if (!e || e.phase !== "spin") return;
  const n = It(t.result?.[s]);
  e.target = n;
  const a = j(t), r = t.reduced ? 0.2 : t.tease && !t.quick ? 0.7 : a.settle, l = t.reduced ? 10 : a.cruise, o = Math.max(xt + 1.25, 0.5 * l * r), d = Math.ceil(e.offset + o);
  Ct(e, d, n), e.stopAt = d, e.from = e.offset, e.elapsed = 0, e.duration = 2 * (d - e.offset) / l, e.stopStartedAt = t.spinAge, e.phase = "stop";
}
function ie(t, s, e) {
  if (s === 0) return !0;
  const n = t.reels[s - 1];
  return !n || n.stopStartedAt < 0 ? !1 : t.spinAge >= n.stopStartedAt + e;
}
function j(t) {
  return t.reduced ? { ...yt, startStagger: 0.02, stopStagger: 0.04, minSpin: 0.4 } : t.quick ? st : yt;
}
function Ct(t, s, e) {
  for (let n = 0; n < xt; n += 1) {
    const a = e[n] ?? "spark", r = se(s, n);
    t.symbols[r] = a;
  }
}
function It(t) {
  return [t?.[0] ?? "spark", t?.[1] ?? "knot", t?.[2] ?? "coin"];
}
function le(t) {
  return (t % O + O) % O;
}
const H = "http://www.w3.org/2000/svg", ce = {
  lion: { text: "W", tier: "wild" },
  ingot: { text: "A", tier: "a" },
  lantern: { text: "K", tier: "k" },
  fan: { text: "Q", tier: "q" },
  coin: { text: "J", tier: "low" },
  knot: { text: "10", tier: "low" },
  spark: { text: "9", tier: "low" },
  blank: { text: "", tier: "blank" }
}, ue = /* @__PURE__ */ new Set(["lion", "ingot", "lantern", "fan"]);
function fe(t) {
  const s = window.matchMedia("(prefers-reduced-motion: reduce)").matches, e = ne(s);
  t.replaceChildren(), t.classList.add("lion-board");
  const n = e.reels.map((i, g) => {
    const u = document.createElement("div");
    u.className = "lion-col";
    const f = document.createElement("div");
    f.className = "lion-clip";
    const p = document.createElement("div");
    p.className = "lion-strip", p.dataset.reel = String(g);
    const S = [], C = i.symbols;
    for (const B of [0, 1])
      for (let T = 0; T < O; T += 1) {
        const k = document.createElement("div"), _ = C[T] ?? "spark";
        kt(k, _), p.appendChild(k), S.push({ el: k, index: T, copy: B, symbol: _ });
      }
    f.appendChild(p);
    const R = `lion-reel-mask-${g}-${Math.random().toString(36).slice(2, 8)}`, N = document.createElementNS(H, "svg");
    N.setAttribute("class", "lion-mask-svg"), N.setAttribute("aria-hidden", "true");
    const y = document.createElementNS(H, "mask");
    y.id = R, y.setAttribute("maskUnits", "userSpaceOnUse"), N.appendChild(y), f.style.mask = `url(#${R})`, f.style.setProperty("-webkit-mask", `url(#${R})`);
    const m = [];
    for (let B = 0; B < 3; B += 1) {
      const T = document.createElement("div");
      T.className = "lion-window", m.push(T);
    }
    return u.append(f, N, ...m), t.appendChild(u), { column: u, clip: f, strip: p, mask: y, windows: m, glyphs: S };
  }), a = document.createElementNS(H, "svg");
  a.setAttribute("class", "lion-lines"), t.appendChild(a);
  let r = [], l = 0, o = 0, d = 0, A = [];
  const E = () => {
    n.forEach((i) => {
      const g = i.windows[0]?.getBoundingClientRect(), u = i.windows[1]?.getBoundingClientRect(), f = i.column.getBoundingClientRect();
      if (!(!g || g.height < 8 || !u)) {
        o = g.height, d = u.top - g.top, t.style.setProperty("--glyph", `${Math.round(o * 0.58)}px`), t.style.setProperty("--glyph-wide", `${Math.round(o * 0.46)}px`), i.mask.replaceChildren(), i.mask.setAttribute("x", "0"), i.mask.setAttribute("y", "0"), i.mask.setAttribute("width", String(f.width)), i.mask.setAttribute("height", String(f.height));
        for (const p of i.windows) {
          const S = p.getBoundingClientRect(), C = document.createElementNS(H, "rect");
          C.setAttribute("x", String(S.left - f.left)), C.setAttribute("y", String(S.top - f.top)), C.setAttribute("width", String(S.width)), C.setAttribute("height", String(S.height)), C.setAttribute("rx", "12"), C.setAttribute("fill", "#fff"), i.mask.appendChild(C);
        }
        for (const p of i.glyphs) {
          const S = p.copy === 0 ? p.index - O : p.index;
          p.el.style.top = `${S * d}px`, p.el.style.height = `${o}px`;
        }
      }
    });
  };
  function h() {
    d < 8 && E(), e.reels.forEach((i, g) => {
      const u = n[g];
      if (!(!u || d < 8)) {
        u.strip.style.transform = `translateY(${Zt(i.offset, O, d)}px)`;
        for (const f of u.glyphs) {
          const p = i.symbols[f.index] ?? "spark";
          f.symbol !== p && (f.symbol = p, kt(f.el, p));
        }
      }
    });
  }
  function P() {
    const i = t.getBoundingClientRect();
    return n.map(
      (g) => g.windows.map((u) => te(u.getBoundingClientRect(), i))
    );
  }
  function x() {
    const i = t.clientWidth, g = t.clientHeight;
    if (a.setAttribute("viewBox", `0 0 ${i} ${g}`), a.replaceChildren(), i < 8 || g < 8) return;
    const u = P();
    for (const f of A) {
      const p = J[f.line];
      if (!p) continue;
      const S = document.createElementNS(H, "polyline");
      S.setAttribute("points", ee(p.slice(0, f.count), u)), S.setAttribute("class", "lion-payline"), a.appendChild(S);
    }
  }
  function $() {
    if (l >= r.length - 1) return !1;
    l += 1;
    const i = r[l];
    return i ? (St(e), e.quick = !0, wt(e, i), L(i), !0) : !1;
  }
  function L(i) {
    for (const g of n)
      for (const u of g.windows) u.classList.remove("is-lock");
    i.forEach((g, u) => {
      g.forEach((f, p) => {
        f !== "blank" && n[u]?.windows[p]?.classList.add("is-lock");
      });
    });
  }
  function M() {
    A = [];
    for (const i of n)
      for (const g of i.windows)
        g.classList.remove("is-win", "is-lock", "is-dim");
    a.replaceChildren();
  }
  E();
  const w = new ResizeObserver(() => {
    E(), h(), x();
  });
  return w.observe(t), h(), {
    show(i) {
      r = [], l = 0, bt(e, i), M(), h();
    },
    spin() {
      St(e), M(), h();
    },
    turbo() {
      oe(e);
    },
    deliver(i, g) {
      r = g?.steps.map((u) => u.grid) ?? [i], r[0] || (r = [i]), l = 0, wt(e, r[0] ?? i);
    },
    update(i, g) {
      const u = re(e, i);
      if (g && !s) {
        u.ticks.length && g.playTone({ frequency: 620, duration: 0.02, type: "square", gain: 0.01 });
        for (const p of u.landed)
          g.playTone({
            frequency: 220 + p * 70,
            duration: 0.05,
            type: "triangle",
            gain: 0.03
          });
      }
      if (!u.moving && r.length > 1) {
        const p = r[l];
        p && L(p);
      }
      const f = u.moving || $();
      return h(), f;
    },
    celebrate(i) {
      A = i;
      const g = /* @__PURE__ */ new Set();
      for (const u of n)
        for (const f of u.windows) f.classList.remove("is-win", "is-dim");
      for (const u of i) {
        const f = J[u.line];
        if (f)
          for (let p = 0; p < u.count; p += 1) {
            const S = f[p] ?? 1;
            g.add(`${p}:${S}`), n[p]?.windows[S]?.classList.add("is-win");
          }
      }
      i.length > 0 && n.forEach((u, f) => {
        u.windows.forEach((p, S) => {
          g.has(`${f}:${S}`) || p.classList.add("is-dim");
        });
      }), x();
    },
    resize() {
      E(), h(), x();
    },
    abort() {
      r = [], l = 0, bt(
        e,
        e.reels.map((i) => i.target)
      ), M(), h();
    },
    destroy() {
      w.disconnect(), t.replaceChildren();
    }
  };
}
function kt(t, s) {
  const e = ce[s];
  t.textContent = e.text, t.dataset.symbol = s, t.className = `lion-glyph is-${e.tier}${ue.has(s) ? " is-big" : ""}`;
}
const de = {}, pe = {
  lion: "W",
  ingot: "A",
  lantern: "K",
  fan: "Q",
  coin: "J",
  knot: "10",
  spark: "9",
  blank: ""
}, vt = [
  ["spark", "ingot", "coin"],
  ["knot", "lantern", "spark"],
  ["coin", "fan", "knot"]
], ot = "wgf:slots-wallet", Mt = "wgf:slots-token", ge = "wgf:session";
function xe() {
  Xt();
  let t = null;
  const s = [];
  let e = null, n = U(), a = 20, r = !1, l = !1, o = 0, d = null, A = !1, E = 0, h = 0, P = !1, x = "pending", $ = !1, L = null, M = 0, w = "", i = "", g = 0, u = 0, f = "ready", p = 0, S = 0, C = !1, R = 0, N = null, y = null;
  function m(c, v) {
    return _t(t?.store.getState().ui.locale ?? "zh", c, v);
  }
  function B(c, v) {
    v === "spin" && c.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), v === "stop" && c.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), v === "win" && c.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), v === "big" && c.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), v === "scatter" && c.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function T() {
    t && et(t.store, {
      id: G.id,
      status: f,
      score: E,
      highScore: Math.max(h, E),
      message: w,
      detail: At(x, m),
      combo: n.freeSpins,
      credits: n.credits
    });
  }
  function k() {
    if (!e) return;
    const c = e.querySelector("[data-credits]"), v = e.querySelector("[data-message]"), I = e.querySelector("[data-amount]"), Y = e.querySelector("[data-clock]"), q = e.querySelector("[data-spin-no]"), b = e.querySelector("[data-mult]"), D = e.querySelector("[data-demo]"), F = e.querySelector("[data-feature]"), X = e.querySelector("[data-feature-glyph]"), lt = e.querySelector("[data-source]");
    if (c && (c.textContent = String(n.credits)), I && (I.textContent = String(a)), Y) {
      const W = /* @__PURE__ */ new Date();
      Y.textContent = `${W.getHours()}:${String(W.getMinutes()).padStart(2, "0")}`;
    }
    q && (q.textContent = p > 0 ? String(p) : "—"), b && (b.textContent = `${S}×`), D && (D.hidden = x !== "local"), F && (F.hidden = !N), X && N && (X.textContent = pe[N], X.className = `is-${N}`), lt && (lt.textContent = At(x, m)), v && (v.textContent = w || (f === "running" && !r ? m("slots.place") : "")), e.querySelectorAll("[data-bet]").forEach((W) => {
      W.classList.toggle("is-bet", Number(W.dataset.bet) === a), W.disabled = r;
    });
    const Z = e.querySelector("[data-spin]"), ct = e.querySelector("[data-note]");
    ct && (ct.textContent = m("slots.note"));
    const tt = e.querySelector("[data-auto]");
    Z && (Z.disabled = !$ || f !== "running", Z.textContent = m(r ? "slots.stop" : "slots.spin"));
    const ut = e.querySelector("[data-turbo]");
    ut && ut.classList.toggle("is-on", C), tt && (tt.setAttribute("aria-pressed", l ? "true" : "false"), tt.disabled = f !== "running" || r);
    const ft = e.querySelector("[data-big]"), dt = e.querySelector("[data-big-value]");
    ft && (ft.hidden = !i), dt && u <= 0 && (dt.textContent = i);
  }
  function _() {
    x === "local" && localStorage.setItem(ot, JSON.stringify(n));
  }
  function at(c) {
    n = {
      credits: c.credits,
      freeSpins: c.freeSpinsLeft,
      freeBet: c.freeSpinsLeft > 0 ? c.bet : n.freeBet
    }, _(), d = c, A = !1, o = 0, i = "", u = 0, w = m("slots.place"), N = c.feature?.symbol ?? null, E += c.win, p += 1, S = c.bet > 0 ? Math.round(c.win / c.bet * 10) / 10 : 0, y?.deliver(c.grid, c.feature), T(), k();
  }
  async function Q() {
    if (!t || r || f !== "running" || !$ || x === "pending")
      return;
    if (n.freeSpins <= 0 && n.credits < a) {
      w = m("slots.broke"), l = !1, T(), k();
      return;
    }
    r = !0, R = 0, N = null, i = "", u = 0, A = !1, y?.spin(), C && y?.turbo(), t && B(t.audio, "spin");
    const c = M, v = L ?? he();
    if (L = v, k(), x === "local") {
      const I = Kt(n, a, Math.random);
      if (c !== M || !t) return;
      if (L = null, "error" in I) {
        r = !1, y?.abort(), w = I.error === "insufficient" ? m("slots.broke") : m("slots.badBet"), l = !1, T(), k();
        return;
      }
      at(I);
      return;
    }
    try {
      const I = await Se(a, v);
      if (c !== M || !t) return;
      L = null, at(I);
    } catch {
      if (c !== M || !t) return;
      r = !1, y?.abort(), l = !1, w = m("slots.retry"), T(), k();
    }
  }
  function Lt() {
    if (!d || !t) return;
    r = !1, y?.celebrate(d.wins), d.win > 0 ? (w = m("slots.won", { n: d.win }), B(t.audio, d.bigWin ? "big" : "win")) : w = m("slots.place"), d.feature && (w = m("slots.feature", {
      message: w,
      symbol: m(`slots.symbol.${d.feature.symbol}`)
    }), B(t.audio, "scatter")), d.bigWin && (i = "0", g = 0, u = d.win, l = !1), E > h && Ot(G.id, E), n.credits < K[0] && n.freeSpins === 0 && (l = !1, f = "over", w = m("slots.empty"), P || (P = !0, t.events.emit("game:over", {
      gameId: G.id,
      score: E,
      best: Math.max(h, E),
      isRecord: E > h
    }))), d = null, o = l ? 0.7 : 0, T(), k();
  }
  async function $t() {
    if (!await ke()) {
      x = "local", $ = !0, n = Et(), _(), w = m("slots.place"), T(), k();
      return;
    }
    try {
      const v = await be();
      x = "server", $ = !0, n = Nt(v), w = m("slots.place"), T(), k();
    } catch {
      x = "local", $ = !0, n = Et(), _(), w = m("slots.place"), T(), k();
    }
  }
  function it(c) {
    a = 20, r = !1, l = !1, d = null, A = !1, o = 0, E = 0, P = !1, i = "", u = 0, y?.abort(), y?.show(vt), w = m("slots.place"), f = c ? "running" : "ready", T(), k();
  }
  async function Rt() {
    if (M += 1, L = null, h = pt(G.id), x === "server")
      try {
        n = await we();
      } catch {
        w = m("slots.resetFail"), T(), k();
        return;
      }
    else x === "local" && (localStorage.removeItem(ot), n = U(), _());
    it(!0);
  }
  return Pt(G, {
    async onPreload(c, v) {
      await c.preload([], v);
    },
    async onMount(c) {
      t = c, c.container.setAttribute("data-wgf-game", "wgf-game:slots"), e = document.createElement("div"), e.className = "slots", e.innerHTML = me();
      const v = e.querySelector("[data-reels]");
      v instanceof HTMLElement && (y = await fe(v), y.show(vt)), c.container.appendChild(e), h = pt(G.id);
      const I = e;
      I.addEventListener("click", (q) => {
        const b = q.target;
        if (!(b instanceof HTMLElement)) return;
        if (r && (b.closest("[data-spin]") || b.closest("[data-reels]"))) {
          y?.turbo();
          return;
        }
        const D = b.closest("[data-bet]"), F = Number(D?.dataset.bet);
        if (K.includes(F) && !r) {
          a = F, I.classList.remove("is-bets"), k();
          return;
        }
        if (b.closest("[data-peek]")) {
          I.classList.toggle("is-panels");
          return;
        }
        if (b.closest("[data-amount-bar]")) {
          I.classList.toggle("is-bets");
          return;
        }
        if (b.closest("[data-turbo]")) {
          r ? y?.turbo() : (C = !C, k());
          return;
        }
        b.closest("[data-spin]") && Q(), b.closest("[data-auto]") && (l = !l, l && !r && Q(), k());
      }), it(!1), $t();
      const Y = () => y?.resize();
      window.addEventListener("resize", Y), s.push(() => window.removeEventListener("resize", Y)), s.push(
        c.loop.onUpdate((q) => {
          if (r && y) {
            const b = y.update(q, c.audio);
            d && !b && !A ? (R += q, R >= 0.22 && (A = !0, Lt())) : b && (R = 0);
          }
          if (u > 0 && e) {
            g = Math.min(u, g + u * q * 0.95);
            const b = e.querySelector("[data-big-value]");
            b && (b.textContent = String(Math.round(g))), g >= u - 0.4 && (i = String(Math.round(u)), u = 0, b && (b.textContent = i));
          }
          !r && l && f === "running" && o > 0 && (o -= q, o <= 0 && Q());
        }),
        c.store.subscribe((q, b) => {
          q.ui.locale !== b.ui.locale && k();
        }),
        c.events.on("game:start", () => {
          f === "ready" && (f = "running", w = m("slots.ready"), T(), k());
        }),
        c.events.on("game:restart", () => {
          Rt();
        })
      );
    },
    onPause(c) {
      c.store.getState().game.status === "running" && et(c.store, { status: "paused" });
    },
    onResume(c) {
      c.store.getState().game.status === "paused" && et(c.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const c of s) c();
      s.length = 0, y?.destroy(), y = null, e?.remove(), e = null, t = null;
    }
  });
}
function me() {
  const t = K.map(
    (e) => `<button type="button" data-bet="${e}">${e}</button>`
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
  ].map(([e, n, a]) => `<li><b class="is-${a}">${e}</b><span>${n}</span></li>`).join("")}</ul>
      </aside>
    </div>
    <div class="slots-dock">
      <button type="button" class="slots-amount" data-amount-bar>
        <span>AMOUNT</span>
        <strong data-amount>20</strong>
      </button>
      <div class="slots-betlist">${t}</div>
      <div class="slots-controls">
        <button type="button" class="slots-icon" data-turbo aria-label="加速"></button>
        <button type="button" class="slots-spin" data-spin disabled>SPIN</button>
        <button type="button" class="slots-icon" data-auto aria-label="自动"></button>
      </div>
    </div>
  `;
}
function At(t, s) {
  return s(t === "server" ? "slots.server" : t === "local" ? "slots.local" : "slots.pending");
}
function he() {
  return `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function Et() {
  try {
    const t = localStorage.getItem(ot);
    if (!t) return U();
    const s = JSON.parse(t);
    return !s || typeof s.credits != "number" ? U() : {
      credits: Math.max(0, Math.floor(s.credits)),
      freeSpins: Math.max(0, Math.floor(s.freeSpins ?? 0)),
      freeBet: typeof s.freeBet == "number" ? s.freeBet : 20
    };
  } catch {
    return U();
  }
}
function Nt(t) {
  return {
    credits: t.credits,
    freeSpins: t.freeSpins,
    freeBet: t.freeBet
  };
}
function rt() {
  const t = new Wt(), s = ye(), e = Ae();
  if (s) t.set({ accessToken: s });
  else if (e?.accessToken && !e.accessToken.startsWith("local."))
    t.set({ accessToken: e.accessToken, refreshToken: e.refreshToken });
  else {
    const n = ve();
    n && t.set({ accessToken: n });
  }
  return new Gt({ baseUrl: qt(), tokens: t, timeoutMs: 2500 });
}
function ye() {
  try {
    const t = sessionStorage.getItem("wgf:launch-token");
    return t && t.length >= 8 ? t : null;
  } catch {
    return null;
  }
}
async function be() {
  const t = await rt().post("/api/slots/session", {});
  return t.walletToken && localStorage.setItem(Mt, t.walletToken), t;
}
async function Se(t, s) {
  return rt().post("/api/slots/spin", { bet: t, spinId: s });
}
async function we() {
  const t = await rt().post("/api/slots/reset", {});
  return Nt(t);
}
async function ke() {
  try {
    return (await fetch(`${qt()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
function qt() {
  return de?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function ve() {
  const t = localStorage.getItem(Mt);
  return t && t.startsWith("v1w.") ? t : null;
}
function Ae() {
  try {
    const t = localStorage.getItem(ge);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
export {
  xe as createGame,
  G as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
