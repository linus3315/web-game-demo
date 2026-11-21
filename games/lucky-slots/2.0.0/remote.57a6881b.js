import { registerStrings as Ie, defineGame as Me, patchGame as H, readHighScore as oe, t as Ce, writeHighScore as qe } from "@wgf/core";
import { TokenStore as Re, HttpClient as xe } from "@wgf/net";
import { Container as se, Graphics as U } from "pixi.js";
import { createPixiContext as Ne } from "@wgf/render-pixi";
const Le = {
  background: "#2a140c",
  shapes: [
    { tag: "rect", attrs: { x: 48, y: 56, width: 224, height: 120, rx: 16, fill: "#1a0d08" } },
    { tag: "circle", attrs: { cx: 92, cy: 116, r: 22, fill: "#ff4d6d" } },
    { tag: "circle", attrs: { cx: 148, cy: 116, r: 22, fill: "#ffb703" } },
    { tag: "circle", attrs: { cx: 204, cy: 116, r: 22, fill: "#f6f1e7" } },
    { tag: "rect", attrs: { x: 118, y: 188, width: 84, height: 28, rx: 14, fill: "#ff5a1f" } }
  ]
}, N = {
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
  art: Le,
  renderer: "pixi",
  controls: "pointer",
  tags: ["拉霸", "联网"],
  theme: { accent: "#ffb703", accentInk: "#2a1408", glow: "#ff5a1f", radius: 18, font: "serif" }
}, W = [10, 20, 50, 100], _e = 1e3, _ = 3, K = 3, Pe = 1 / 130, V = [
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
], X = [
  [1, 1, 1],
  [0, 0, 0],
  [2, 2, 2],
  [0, 1, 2],
  [2, 1, 0]
], Be = {
  lion: 50,
  ingot: 20,
  lantern: 5,
  fan: 2,
  coin: 1.6,
  knot: 1,
  spark: 0.6
}, re = ["ingot", "lantern", "fan", "coin", "knot", "spark", "lion"];
function Oe(e) {
  return W.includes(e);
}
function P() {
  return { credits: _e, freeSpins: 0, freeBet: 20 };
}
function ae(e) {
  return Array.from({ length: _ }, () => {
    const n = Math.floor(e() * V.length);
    return [0, 1, 2].map((t) => V[(n + t) % V.length] ?? "spark");
  });
}
function We(e, n) {
  const t = [];
  X.forEach((s, a) => {
    const i = s.map((c, y) => e[y]?.[c] ?? "blank"), r = Ye(i, n);
    r && t.push({ line: a, symbol: r.symbol, count: 3, payout: r.payout });
  });
  let o = t.reduce((s, a) => s + a.payout, 0);
  return Ge(t) && o > 0 && (o *= 10), {
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
function Fe(e, n, t) {
  if (!Oe(n)) return { error: "bad_bet" };
  if (e.credits < n) return { error: "insufficient" };
  e.credits -= n;
  const o = t() < Pe ? $e(t) : null, s = o ? o.steps.at(-1)?.grid ?? ae(t) : ae(t), a = We(s, n);
  return a.feature = o, e.credits += a.win, { ...a, credits: e.credits, freeSpinsLeft: 0, bet: n };
}
function Ge(e) {
  const n = /* @__PURE__ */ new Set();
  for (const t of e)
    X[t.line]?.forEach((s, a) => n.add(`${a}:${s}`));
  return n.size === _ * K;
}
function Ye(e, n) {
  if (e.some((a) => a === "blank")) return null;
  const o = e.find((a) => a !== "lion") ?? "lion";
  if (e.some((a) => a !== o && a !== "lion")) return null;
  const s = Be[o];
  return s ? { symbol: o, payout: Math.round(s * n) } : null;
}
function $e(e) {
  const n = re[Math.floor(e() * re.length)] ?? "ingot", t = Array.from({ length: _ }, () => ["blank", "blank", "blank"]), o = [];
  for (let s = 0; s < 8 && De(t); s += 1) {
    for (let a = 0; a < _; a += 1)
      for (let i = 0; i < K; i += 1) {
        if (t[a]?.[i] !== "blank") continue;
        const r = e(), c = t[a];
        c && (r < 0.55 ? c[i] = n : r < 0.63 && (c[i] = "lion"));
      }
    o.push({ grid: ie(t) });
  }
  for (let s = 0; s < _; s += 1)
    for (let a = 0; a < K; a += 1) {
      const i = t[s];
      i && i[a] === "blank" && (i[a] = n);
    }
  return o.push({ grid: ie(t) }), { symbol: n, steps: o };
}
function De(e) {
  return e.some((n) => n.some((t) => t === "blank"));
}
function ie(e) {
  return e.map((n) => [...n]);
}
function He() {
  Ie("slots", {
    zh: {
      credits: "积分 {n}",
      free: "免费 {n}",
      spin: "旋转",
      stop: "快停",
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
      ready: "选择注额，旋转。",
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
      spin: "Spin",
      stop: "Stop",
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
      ready: "Pick a bet, then spin.",
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
const L = 24, B = 3, Q = 3, le = ["lion", "ingot", "lantern", "fan", "coin", "knot", "spark"], ce = {
  startStagger: 0.11,
  stopStagger: 0.17,
  accel: 0.17,
  cruise: 26,
  minSpin: 2.03,
  postCruise: 0.15,
  settle: 0.3
}, J = {
  startStagger: 0,
  stopStagger: 0,
  accel: 0.1,
  cruise: 44,
  minSpin: 0.93,
  postCruise: 0.15,
  settle: 0.15
};
function Ue(e = !1) {
  return {
    reels: Array.from({ length: B }, (n, t) => ({
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
        { length: L },
        (o, s) => le[(t * 3 + s) % le.length] ?? "spark"
      )
    })),
    spinAge: 0,
    schedule: Array.from({ length: B }, () => Number.POSITIVE_INFINITY),
    result: null,
    quick: !1,
    tease: !1,
    reduced: e
  };
}
function Ve(e, n) {
  let t = Se(e + n);
  return t > Q + 1 && (t -= L), t;
}
function me(e, n) {
  return Se(n - Math.round(e));
}
function fe(e, n) {
  e.result = null, e.quick = !1, e.tease = !1, e.spinAge = 0, e.schedule = e.schedule.map(() => Number.POSITIVE_INFINITY), e.reels.forEach((t, o) => {
    const s = be(n[o]);
    t.target = s, t.phase = "idle", t.speed = 0, t.landed = !0, t.offset = 0, ye(t, 0, s);
  });
}
function ue(e) {
  e.result = null, e.quick = !1, e.tease = !1, e.spinAge = 0, e.schedule = e.schedule.map(() => Number.POSITIVE_INFINITY);
  const n = F(e).startStagger;
  e.reels.forEach((t, o) => {
    t.phase = "wait", t.startAt = o * n, t.speed = 0, t.accelElapsed = 0, t.stopStartedAt = -1, t.landed = !1, t.elapsed = 0;
  });
}
function Ke(e) {
  if (e.reduced || (e.quick = !0, e.tease = !1, !e.result)) return;
  const n = J.settle;
  e.reels.forEach((t, o) => {
    t.phase === "stop" ? t.duration = Math.min(t.duration, n) : t.landed || (e.schedule[o] = e.spinAge + o * J.stopStagger);
  });
}
function de(e, n) {
  e.result = n;
  const t = F(e), o = (B - 1) * t.stopStagger + t.settle, s = Math.max(t.minSpin - o, e.spinAge + t.postCruise);
  for (let a = 0; a < B; a += 1)
    e.schedule[a] = s + a * t.stopStagger;
}
function Je(e, n) {
  const t = Math.min(0.1, Math.max(0, n));
  e.spinAge += t;
  const o = F(e), s = { moving: !1, ticks: [], landed: [], scatters: [] };
  let a = 0;
  for (let i = 0; i < B; i += 1) {
    const r = e.reels[i];
    if (r) {
      if (r.phase === "wait" && e.spinAge >= r.startAt && (r.phase = "spin", r.accelElapsed = 0), r.phase === "wait")
        s.moving = !0;
      else if (r.phase === "spin") {
        s.moving = !0;
        const c = e.reduced ? 10 : o.cruise, y = e.reduced ? 0.12 : o.accel;
        r.accelElapsed += t;
        const S = Math.sin(Math.min(1, r.accelElapsed / y) * (Math.PI / 2));
        let h = c * S;
        e.tease && e.result && !e.quick && !e.reduced && (h = Math.min(h, 9));
        const I = Math.floor(r.offset);
        r.offset += h * t, r.speed = h;
        const E = Math.floor(r.offset);
        r.tickAt += t;
        const T = r.speed > 16 ? 0.08 : 0.045;
        !e.reduced && E !== I && r.tickAt > T && (r.tickAt = 0, s.ticks.push(i));
        const R = e.schedule[i] ?? Number.POSITIVE_INFINITY, u = Xe(e, i, o.stopStagger);
        e.result && e.spinAge >= R && (u || e.quick) && je(e, i);
      } else if (r.phase === "stop") {
        s.moving = !0, r.elapsed += t;
        const y = 2 * (r.stopAt - r.from) / r.duration, S = y / r.duration, h = Math.min(r.duration, r.elapsed);
        r.offset = r.from + y * h - 0.5 * S * h * h, r.speed = Math.max(0, y - S * h), r.offset > r.stopAt && (r.offset = r.stopAt), r.elapsed >= r.duration && (r.offset = r.stopAt, r.phase = "idle", r.speed = 0, r.landed = !0, s.landed.push(i), r.target.includes("lion") && s.scatters.push(i));
      }
      if (r.landed)
        for (const c of r.target) c === "lion" && (a += 1);
    }
  }
  if (!e.tease && a >= 2 && e.reels.some((i) => !i.landed)) {
    e.tease = !0;
    const i = e.reduced || e.quick ? 0.05 : 0.62;
    e.reels.forEach((r, c) => {
      if (r.landed || r.phase === "stop") return;
      const y = e.schedule[c] ?? 0;
      e.schedule[c] = Math.max(y, e.spinAge + i * (c + 1));
    });
  }
  return s;
}
function je(e, n) {
  const t = e.reels[n];
  if (!t || t.phase !== "spin") return;
  const o = be(e.result?.[n]);
  t.target = o;
  const s = F(e), a = e.reduced ? 0.2 : e.tease && !e.quick ? 0.7 : s.settle, i = e.reduced ? 10 : s.cruise, r = Math.max(Q + 1.25, 0.5 * i * a), c = Math.ceil(t.offset + r);
  ye(t, c, o), t.stopAt = c, t.from = t.offset, t.elapsed = 0, t.duration = 2 * (c - t.offset) / i, t.stopStartedAt = e.spinAge, t.phase = "stop";
}
function Xe(e, n, t) {
  if (n === 0) return !0;
  const o = e.reels[n - 1];
  return !o || o.stopStartedAt < 0 ? !1 : e.spinAge >= o.stopStartedAt + t;
}
function F(e) {
  return e.reduced ? { ...ce, startStagger: 0.02, stopStagger: 0.04, minSpin: 0.4 } : e.quick ? J : ce;
}
function ye(e, n, t) {
  for (let o = 0; o < Q; o += 1) {
    const s = t[o] ?? "spark", a = me(n, o);
    e.symbols[a] = s;
  }
}
function be(e) {
  return [e?.[0] ?? "spark", e?.[1] ?? "knot", e?.[2] ?? "coin"];
}
function Se(e) {
  return (e % L + L) % L;
}
const Qe = {
  lion: 16761165,
  ingot: 15778125,
  lantern: 15228236,
  fan: 15913654,
  coin: 16766314,
  knot: 12876618,
  spark: 16773577,
  blank: 0
};
async function Ze(e) {
  const n = window.matchMedia("(prefers-reduced-motion: reduce)").matches, t = await Ne(e, { background: 1707272, maxResolution: 2 }), o = Ue(n), s = new se(), a = new U();
  t.app.stage.addChild(s, a);
  const i = new U();
  t.app.stage.addChild(i);
  const r = o.reels.map(
    (u) => u.symbols.map((f) => {
      const d = new se(), b = new U();
      return pe(b, f, 48), d.addChild(b), s.addChild(d), { root: d, icon: b, symbol: f };
    })
  );
  let c = 64, y = 0, S = 0, h = [], I = 0;
  function E() {
    const u = t.app.screen.width, f = t.app.screen.height;
    c = Math.max(36, Math.min(u / 3.4, f / 3.4));
    const d = c * 1.05 * 3;
    y = (u - d) / 2, S = Math.max(8, (f - c * 3) / 2), i.clear(), i.rect(y, S, d, c * 3).fill(16777215), s.mask = i;
  }
  function T() {
    o.reels.forEach((u, f) => {
      const d = r[f];
      if (d)
        for (let b = 0; b < L; b += 1) {
          const p = d[b], v = u.symbols[b] ?? "spark";
          if (!p) continue;
          p.symbol !== v && (p.symbol = v, pe(p.icon, v, c * 0.78));
          const m = Ve(b, u.offset);
          p.root.position.set(
            y + f * c * 1.05 + c * 0.12,
            S + m * c
          ), p.root.visible = m > -1.2 && m < 3.2;
        }
    });
  }
  function R() {
    if (I >= h.length - 1) return !1;
    I += 1;
    const u = h[I];
    return u ? (ue(o), o.quick = !0, de(o, u), !0) : !1;
  }
  return E(), T(), {
    show(u) {
      h = [], I = 0, fe(o, u), a.clear(), T(), t.render();
    },
    spin() {
      ue(o), a.clear(), T();
    },
    turbo() {
      Ke(o);
    },
    deliver(u, f) {
      h = f?.steps.map((d) => d.grid) ?? [u], h[0] || (h = [u]), I = 0, de(o, h[0] ?? u);
    },
    update(u, f) {
      const d = Je(o, u);
      if (f && !n) {
        d.ticks.length && f.playTone({ frequency: 620, duration: 0.02, type: "square", gain: 0.01 });
        for (const p of d.landed)
          f.playTone({
            frequency: 220 + p * 70,
            duration: 0.05,
            type: "triangle",
            gain: 0.03
          });
      }
      const b = d.moving || R();
      return T(), t.render(), b;
    },
    celebrate(u) {
      a.clear();
      const f = c * 1.05;
      for (const d of u) {
        const b = X[d.line];
        if (b) {
          a.moveTo(y + f * 0.5, S + ((b[0] ?? 1) + 0.5) * c);
          for (let p = 1; p < d.count; p += 1) {
            const v = b[p] ?? 1;
            a.lineTo(y + f * (p + 0.5), S + (v + 0.5) * c);
            const m = o.reels[p], g = m ? r[p]?.[me(m.offset, v)] : void 0;
            g && (g.icon.tint = 16774872);
          }
        }
      }
      a.stroke({ width: 4, color: 16766314, cap: "round", join: "round" }), t.render();
    },
    resize() {
      E(), T(), t.render();
    },
    abort() {
      h = [], I = 0, fe(
        o,
        o.reels.map((u) => u.target)
      ), a.clear(), T(), t.render();
    },
    destroy() {
      t.dispose();
    }
  };
}
function pe(e, n, t) {
  if (e.clear(), e.tint = 16777215, n === "blank") return;
  const o = Qe[n], s = t / 2;
  if (n === "lion") {
    e.circle(s, s, s * 0.46).fill(o), e.poly([s, s * 0.15, s * 0.2, s * 0.55, s * 0.45, s * 0.55]).fill(16773577), e.poly([s, s * 0.15, s * 1.8, s * 0.55, s * 1.55, s * 0.55]).fill(16773577);
    return;
  }
  if (n === "ingot") {
    e.roundRect(t * 0.12, t * 0.28, t * 0.76, t * 0.4, 8).fill(o), e.moveTo(t * 0.2, t * 0.28).lineTo(s, t * 0.08).lineTo(t * 0.8, t * 0.28).fill(16770979);
    return;
  }
  if (n === "lantern") {
    e.roundRect(t * 0.28, t * 0.22, t * 0.44, t * 0.56, 16).fill(o), e.rect(t * 0.38, t * 0.12, t * 0.24, t * 0.12).fill(15778125);
    return;
  }
  if (n === "fan") {
    e.arc(s, t * 0.72, s * 0.7, Math.PI, 0).fill(o), e.rect(s - 3, t * 0.7, 6, t * 0.18).fill(12876618);
    return;
  }
  if (n === "coin") {
    e.circle(s, s, s * 0.42).fill(o), e.circle(s, s, s * 0.18).fill(1707272);
    return;
  }
  if (n === "knot") {
    e.roundRect(t * 0.22, t * 0.22, t * 0.56, t * 0.56, 6).fill(o);
    return;
  }
  e.star(s, s, 5, s * 0.42, s * 0.18).fill(o);
}
const ze = {}, ge = [
  ["lantern", "lion", "fan"],
  ["coin", "ingot", "knot"],
  ["spark", "fan", "coin"]
], j = "wgf:slots-wallet", ke = "wgf:slots-token", et = "wgf:session";
function gt() {
  He();
  let e = null;
  const n = [];
  let t = null, o = P(), s = 20, a = !1, i = !1, r = 0, c = null, y = !1, S = 0, h = 0, I = !1, E = "pending", T = !1, R = null, u = 0, f = "", d = "", b = 0, p = 0, v = "ready", m = null;
  function g(l, k) {
    return Ce(e?.store.getState().ui.locale ?? "zh", l, k);
  }
  function G(l, k) {
    k === "spin" && l.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), k === "stop" && l.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), k === "win" && l.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), k === "big" && l.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), k === "scatter" && l.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function M() {
    e && H(e.store, {
      id: N.id,
      status: v,
      score: S,
      highScore: Math.max(h, S),
      message: f,
      detail: he(E, g),
      combo: o.freeSpins,
      credits: o.credits
    });
  }
  function A() {
    if (!t) return;
    const l = t.querySelector("[data-credits]"), k = t.querySelector("[data-free]"), C = t.querySelector("[data-source]"), q = t.querySelector("[data-message]");
    l && (l.textContent = g("slots.credits", { n: o.credits })), k && (k.textContent = g("slots.free", { n: o.freeSpins })), C && (C.textContent = he(E, g)), q && (q.textContent = f), t.querySelectorAll("[data-bet]").forEach((D) => {
      D.classList.toggle("is-bet", Number(D.dataset.bet) === s), D.disabled = a;
    });
    const w = t.querySelector("[data-spin]"), O = t.querySelector("[data-note]");
    O && (O.textContent = g("slots.note"));
    const x = t.querySelector("[data-auto]");
    x && (x.textContent = g("slots.auto")), w && (w.disabled = !T || v !== "running", w.textContent = g(a ? "slots.stop" : "slots.spin")), x && (x.setAttribute("aria-pressed", i ? "true" : "false"), x.disabled = v !== "running" || a);
    const te = t.querySelector("[data-big]"), ne = t.querySelector("[data-big-value]");
    te && (te.hidden = !d), ne && p <= 0 && (ne.textContent = d);
  }
  function Y() {
    E === "local" && localStorage.setItem(j, JSON.stringify(o));
  }
  function z(l) {
    o = {
      credits: l.credits,
      freeSpins: l.freeSpinsLeft,
      freeBet: l.freeSpinsLeft > 0 ? l.bet : o.freeBet
    }, Y(), c = l, y = !1, r = 0, d = "", p = 0, f = g("slots.spinning"), S += l.win, m?.deliver(l.grid, l.feature), M(), A();
  }
  async function $() {
    if (!e || a || v !== "running" || !T || E === "pending")
      return;
    if (o.freeSpins <= 0 && o.credits < s) {
      f = g("slots.broke"), i = !1, M(), A();
      return;
    }
    a = !0, d = "", p = 0, y = !1, m?.spin(), e && G(e.audio, "spin");
    const l = u, k = R ?? nt();
    if (R = k, A(), E === "local") {
      const C = Fe(o, s, Math.random);
      if (l !== u || !e) return;
      if (R = null, "error" in C) {
        a = !1, m?.abort(), f = C.error === "insufficient" ? g("slots.broke") : g("slots.badBet"), i = !1, M(), A();
        return;
      }
      z(C);
      return;
    }
    try {
      const C = await rt(s, k);
      if (l !== u || !e) return;
      R = null, z(C);
    } catch {
      if (l !== u || !e) return;
      a = !1, m?.abort(), i = !1, f = g("slots.retry"), M(), A();
    }
  }
  function Te() {
    if (!c || !e) return;
    a = !1, m?.celebrate(c.wins), c.win > 0 ? (f = g("slots.won", { n: c.win }), G(e.audio, c.bigWin ? "big" : "win")) : f = g("slots.lost"), c.feature && (f = g("slots.feature", {
      message: f,
      symbol: g(`slots.symbol.${c.feature.symbol}`)
    }), G(e.audio, "scatter")), c.bigWin && (d = "0", b = 0, p = c.win, i = !1), S > h && qe(N.id, S), o.credits < W[0] && o.freeSpins === 0 && (i = !1, v = "over", f = g("slots.empty"), I || (I = !0, e.events.emit("game:over", {
      gameId: N.id,
      score: S,
      best: Math.max(h, S),
      isRecord: S > h
    }))), c = null, r = i ? 0.7 : 0, M(), A();
  }
  async function Ae() {
    if (!await it()) {
      E = "local", T = !0, o = ot(), Y(), f = g("slots.offline"), M(), A();
      return;
    }
    try {
      const k = await st();
      E = "server", T = !0, o = we(k), f = g("slots.synced"), M(), A();
    } catch {
      T = !1, f = g("slots.serverDown"), M(), A();
    }
  }
  function ee(l) {
    s = 20, a = !1, i = !1, c = null, y = !1, r = 0, S = 0, I = !1, d = "", p = 0, m?.abort(), m?.show(ge), f = T ? N.howToPlay : g("slots.connecting"), v = l ? "running" : "ready", M(), A();
  }
  async function Ee() {
    if (u += 1, R = null, h = oe(N.id), E === "server")
      try {
        o = await at();
      } catch {
        f = g("slots.resetFail"), M(), A();
        return;
      }
    else E === "local" && (localStorage.removeItem(j), o = P(), Y());
    ee(!0);
  }
  return Me(N, {
    async onPreload(l, k) {
      await l.preload([], k);
    },
    async onMount(l) {
      e = l, l.container.setAttribute("data-wgf-game", "wgf-game:slots"), t = document.createElement("div"), t.className = "slots", t.innerHTML = tt();
      const k = t.querySelector("[data-reels]");
      k instanceof HTMLElement && (m = await Ze(k), m.show(ge)), l.container.appendChild(t), h = oe(N.id), t.addEventListener("click", (q) => {
        const w = q.target;
        if (!(w instanceof HTMLElement)) return;
        if (a && (w.closest("[data-spin]") || w.closest("[data-reels]"))) {
          m?.turbo();
          return;
        }
        const O = w.closest("[data-bet]"), x = Number(O?.dataset.bet);
        if (W.includes(x) && !a) {
          s = x, A();
          return;
        }
        if (w.closest("[data-turbo]")) {
          m?.turbo();
          return;
        }
        w.closest("[data-spin]") && $(), w.closest("[data-auto]") && (i = !i, i && !a && $(), A());
      }), ee(!1), Ae();
      const C = () => m?.resize();
      window.addEventListener("resize", C), n.push(() => window.removeEventListener("resize", C)), n.push(
        l.loop.onUpdate((q) => {
          if (a && m) {
            const w = m.update(q, l.audio);
            c && !w && !y && (y = !0, Te());
          }
          if (p > 0 && t) {
            b = Math.min(p, b + p * q * 0.95);
            const w = t.querySelector("[data-big-value]");
            w && (w.textContent = String(Math.round(b))), b >= p - 0.4 && (d = String(Math.round(p)), p = 0, w && (w.textContent = d));
          }
          !a && i && v === "running" && r > 0 && (r -= q, r <= 0 && $());
        }),
        l.store.subscribe((q, w) => {
          q.ui.locale !== w.ui.locale && A();
        }),
        l.events.on("game:start", () => {
          v === "ready" && (v = "running", f = g("slots.ready"), M(), A());
        }),
        l.events.on("game:restart", () => {
          Ee();
        })
      );
    },
    onPause(l) {
      l.store.getState().game.status === "running" && H(l.store, { status: "paused" });
    },
    onResume(l) {
      l.store.getState().game.status === "paused" && H(l.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const l of n) l();
      n.length = 0, m?.destroy(), m = null, t?.remove(), t = null, e = null;
    }
  });
}
function tt() {
  return `
    <p class="slots-note" data-note>娱乐积分，不能兑换，也不能充值。</p>
    <div class="slots-hud">
      <span data-credits>积分 1000</span>
      <span data-free>免费 0</span>
      <span class="slots-source" data-source>连接中…</span>
    </div>
    <div class="slots-reels" data-reels></div>
    <div class="slots-big" data-big hidden><strong>BIG WIN</strong><span data-big-value>0</span></div>
    <p class="slots-message" data-message></p>
    <div class="slots-bets">${W.map(
    (n) => `<button type="button" data-bet="${n}">${n}</button>`
  ).join("")}</div>
    <div class="slots-actions">
      <button type="button" class="slots-spin" data-spin disabled>旋转</button>
      <button type="button" data-turbo>加速</button>
      <button type="button" data-auto>自动</button>
    </div>
  `;
}
function he(e, n) {
  return n(e === "server" ? "slots.server" : e === "local" ? "slots.local" : "slots.pending");
}
function nt() {
  return `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function ot() {
  try {
    const e = localStorage.getItem(j);
    if (!e) return P();
    const n = JSON.parse(e);
    return !n || typeof n.credits != "number" ? P() : {
      credits: Math.max(0, Math.floor(n.credits)),
      freeSpins: Math.max(0, Math.floor(n.freeSpins ?? 0)),
      freeBet: typeof n.freeBet == "number" ? n.freeBet : 20
    };
  } catch {
    return P();
  }
}
function we(e) {
  return {
    credits: e.credits,
    freeSpins: e.freeSpins,
    freeBet: e.freeBet
  };
}
function Z() {
  const e = new Re(), n = ct();
  if (n?.accessToken && !n.accessToken.startsWith("local."))
    e.set({ accessToken: n.accessToken, refreshToken: n.refreshToken });
  else {
    const t = lt();
    t && e.set({ accessToken: t });
  }
  return new xe({ baseUrl: ve(), tokens: e, timeoutMs: 2500 });
}
async function st() {
  const e = await Z().post("/api/slots/session", {});
  return e.walletToken && localStorage.setItem(ke, e.walletToken), e;
}
async function rt(e, n) {
  return Z().post("/api/slots/spin", { bet: e, spinId: n });
}
async function at() {
  const e = await Z().post("/api/slots/reset", {});
  return we(e);
}
async function it() {
  try {
    return (await fetch(`${ve()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
function ve() {
  return ze?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function lt() {
  const e = localStorage.getItem(ke);
  return e && e.startsWith("v1w.") ? e : null;
}
function ct() {
  try {
    const e = localStorage.getItem(et);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
export {
  gt as createGame,
  N as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0","pixi.js":"8.23.0","@wgf/render-pixi":"0.1.0"}};
