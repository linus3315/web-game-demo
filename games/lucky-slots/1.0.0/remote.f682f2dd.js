import { registerStrings as he, defineGame as ye, patchGame as D, readHighScore as ee, t as be, writeHighScore as Se } from "@wgf/core";
import { TokenStore as ve, HttpClient as we } from "@wgf/net";
const Ae = {
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
  name: "幸运拉霸",
  description: "五轴三行、二十条线。娱乐积分，不能兑换，也不能充值。",
  tip: "娱乐积分，不能兑换。",
  howToPlay: "选择注额后旋转。百搭可替代普通图案，三个及以上夺宝送免费旋转。服务器在线时由服务器开奖，否则在这台设备上本地开奖。",
  copy: {
    en: {
      name: "Lucky Slots",
      description: "Five reels, three rows, twenty lines. Play credits only.",
      howToPlay: "Pick a bet and spin. Wilds stand in for regular symbols. Three or more scatters award free spins. When the server is online it draws the result; otherwise this device does.",
      tip: "Play credits only. Nothing to cash out."
    }
  },
  cover: "slots",
  art: Ae,
  renderer: "dom",
  controls: "pointer",
  tags: ["拉霸", "联网"],
  theme: { accent: "#ffb703", accentInk: "#2a1408", glow: "#ff5a1f", radius: 18, font: "serif" }
}, O = [10, 20, 50, 100], Te = 1e3, Ee = 5, Y = [
  "cherry",
  "cherry",
  "cherry",
  "lemon",
  "lemon",
  "lemon",
  "plum",
  "plum",
  "bell",
  "bell",
  "bar",
  "seven",
  "diamond",
  "wild",
  "scatter",
  "cherry",
  "lemon",
  "plum",
  "bell",
  "bar"
], V = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
  [0, 0, 1, 0, 0],
  [2, 2, 1, 2, 2],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [0, 1, 1, 1, 0],
  [2, 1, 1, 1, 2],
  [1, 0, 1, 0, 1],
  [1, 2, 1, 2, 1],
  [0, 1, 0, 1, 0],
  [2, 1, 2, 1, 2],
  [1, 1, 0, 1, 1],
  [1, 1, 2, 1, 1],
  [0, 2, 0, 2, 0],
  [2, 0, 2, 0, 2],
  [0, 2, 1, 0, 2]
], ke = {
  cherry: [5, 15, 40],
  lemon: [5, 15, 40],
  plum: [8, 20, 50],
  bell: [12, 30, 80],
  bar: [20, 50, 120],
  seven: [30, 80, 200],
  diamond: [50, 150, 400]
};
function Ie(e) {
  return O.includes(e);
}
function B() {
  return { credits: Te, freeSpins: 0, freeBet: 20 };
}
function Me(e) {
  return Array.from({ length: Ee }, () => {
    const s = Math.floor(e() * Y.length);
    return [0, 1, 2].map((t) => Y[(s + t) % Y.length] ?? "cherry");
  });
}
function Ce(e, s, t) {
  const r = s / V.length, l = [];
  V.forEach((y, o) => {
    const d = y.map((p, b) => e[b]?.[p] ?? "cherry"), c = d.find((p) => p !== "wild" && p !== "scatter");
    if (!c) return;
    let u = 0;
    for (const p of d)
      if (p === c || p === "wild") u += 1;
      else break;
    if (u < 3) return;
    const v = ke[c], m = Math.round((v?.[u - 3] ?? 0) * r * (t ? 2 : 1));
    m > 0 && l.push({ line: o, symbol: c, count: u, payout: m });
  });
  let a = 0;
  for (const y of e)
    for (const o of y) o === "scatter" && (a += 1);
  const f = [0, 0, 0, 2, 10, 50], n = a >= 3 ? Math.round(s * (f[a] ?? 50) * (t ? 2 : 1)) : 0, g = a >= 5 ? 20 : a === 4 ? 12 : a >= 3 ? 8 : 0, S = l.reduce((y, o) => y + o.payout, 0) + n;
  return {
    grid: e,
    wins: l,
    scatterCount: a,
    scatterPayout: n,
    freeSpinsAwarded: g,
    win: S,
    bigWin: S > 0 && S >= s * 10
  };
}
function qe(e, s, t) {
  if (!Ie(s)) return { error: "bad_bet" };
  const r = e.freeSpins > 0, l = r ? e.freeBet : s;
  if (r)
    e.freeSpins -= 1;
  else {
    if (e.credits < s) return { error: "insufficient" };
    e.credits -= s;
  }
  const a = Ce(Me(t), l, r);
  return e.credits += a.win, a.freeSpinsAwarded > 0 && (e.freeSpins += a.freeSpinsAwarded, e.freeBet = l), {
    ...a,
    credits: e.credits,
    freeSpinsLeft: e.freeSpins,
    bet: l
  };
}
function Ne() {
  he("slots", {
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
      server: "Server draw",
      local: "Local draw (server unreachable)",
      pending: "Connecting…",
      retry: "The server did not confirm this spin. Tap again to retry the same id. It will not charge twice."
    }
  });
}
const x = 24, P = 5, z = 3, te = [
  "cherry",
  "lemon",
  "plum",
  "bell",
  "bar",
  "seven",
  "diamond",
  "wild",
  "scatter"
], se = {
  startStagger: 0.045,
  stopStagger: 0.088,
  accel: 0.17,
  cruise: 26,
  minSpin: 1.2,
  postCruise: 0.15,
  settle: 0.3
}, K = {
  startStagger: 0,
  stopStagger: 0,
  accel: 0.1,
  cruise: 44,
  minSpin: 0.6,
  postCruise: 0.15,
  settle: 0.15
};
function xe(e = !1) {
  return {
    reels: Array.from({ length: P }, (s, t) => ({
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
      target: ["cherry", "lemon", "plum"],
      symbols: Array.from(
        { length: x },
        (r, l) => te[(t * 3 + l) % te.length] ?? "cherry"
      )
    })),
    spinAge: 0,
    schedule: Array.from({ length: P }, () => Number.POSITIVE_INFINITY),
    result: null,
    quick: !1,
    tease: !1,
    reduced: e
  };
}
function Le(e, s) {
  let t = le(e + s);
  return t > z + 1 && (t -= x), t;
}
function ae(e, s) {
  return le(s - Math.round(e));
}
function Re(e, s) {
  e.result = null, e.quick = !1, e.tease = !1, e.spinAge = 0, e.schedule = e.schedule.map(() => Number.POSITIVE_INFINITY), e.reels.forEach((t, r) => {
    const l = ce(s[r]);
    t.target = l, t.phase = "idle", t.speed = 0, t.landed = !0, t.offset = 0, ie(t, 0, l);
  });
}
function _e(e) {
  e.result = null, e.quick = !1, e.tease = !1, e.spinAge = 0, e.schedule = e.schedule.map(() => Number.POSITIVE_INFINITY);
  const s = F(e).startStagger;
  e.reels.forEach((t, r) => {
    t.phase = "wait", t.startAt = r * s, t.speed = 0, t.accelElapsed = 0, t.stopStartedAt = -1, t.landed = !1, t.elapsed = 0;
  });
}
function Be(e) {
  if (e.reduced || (e.quick = !0, e.tease = !1, !e.result)) return;
  const s = K.settle;
  e.reels.forEach((t, r) => {
    t.phase === "stop" ? t.duration = Math.min(t.duration, s) : t.landed || (e.schedule[r] = e.spinAge + r * K.stopStagger);
  });
}
function Pe(e, s) {
  e.result = s;
  const t = F(e), r = (P - 1) * t.stopStagger + t.settle, l = Math.max(t.minSpin - r, e.spinAge + t.postCruise);
  for (let a = 0; a < P; a += 1)
    e.schedule[a] = l + a * t.stopStagger;
}
function Oe(e, s) {
  const t = Math.min(0.1, Math.max(0, s));
  e.spinAge += t;
  const r = F(e), l = { moving: !1, ticks: [], landed: [], scatters: [] };
  let a = 0;
  for (let f = 0; f < P; f += 1) {
    const n = e.reels[f];
    if (n) {
      if (n.phase === "wait" && e.spinAge >= n.startAt && (n.phase = "spin", n.accelElapsed = 0), n.phase === "wait")
        l.moving = !0;
      else if (n.phase === "spin") {
        l.moving = !0;
        const g = e.reduced ? 10 : r.cruise, S = e.reduced ? 0.12 : r.accel;
        n.accelElapsed += t;
        const y = Math.sin(Math.min(1, n.accelElapsed / S) * (Math.PI / 2));
        let o = g * y;
        e.tease && e.result && !e.quick && !e.reduced && (o = Math.min(o, 9));
        const d = Math.floor(n.offset);
        n.offset += o * t, n.speed = o;
        const c = Math.floor(n.offset);
        n.tickAt += t;
        const u = n.speed > 16 ? 0.08 : 0.045;
        !e.reduced && c !== d && n.tickAt > u && (n.tickAt = 0, l.ticks.push(f));
        const v = e.schedule[f] ?? Number.POSITIVE_INFINITY, m = We(e, f, r.stopStagger);
        e.result && e.spinAge >= v && (m || e.quick) && Fe(e, f);
      } else if (n.phase === "stop") {
        l.moving = !0, n.elapsed += t;
        const S = 2 * (n.stopAt - n.from) / n.duration, y = S / n.duration, o = Math.min(n.duration, n.elapsed);
        n.offset = n.from + S * o - 0.5 * y * o * o, n.speed = Math.max(0, S - y * o), n.offset > n.stopAt && (n.offset = n.stopAt), n.elapsed >= n.duration && (n.offset = n.stopAt, n.phase = "idle", n.speed = 0, n.landed = !0, l.landed.push(f), n.target.includes("scatter") && l.scatters.push(f));
      }
      if (n.landed)
        for (const g of n.target) g === "scatter" && (a += 1);
    }
  }
  if (!e.tease && a >= 2 && e.reels.some((f) => !f.landed)) {
    e.tease = !0;
    const f = e.reduced || e.quick ? 0.05 : 0.62;
    e.reels.forEach((n, g) => {
      if (n.landed || n.phase === "stop") return;
      const S = e.schedule[g] ?? 0;
      e.schedule[g] = Math.max(S, e.spinAge + f * (g + 1));
    });
  }
  return l;
}
function Fe(e, s) {
  const t = e.reels[s];
  if (!t || t.phase !== "spin") return;
  const r = ce(e.result?.[s]);
  t.target = r;
  const l = F(e), a = e.reduced ? 0.2 : e.tease && !e.quick ? 0.7 : l.settle, f = e.reduced ? 10 : l.cruise, n = Math.max(z + 1.25, 0.5 * f * a), g = Math.ceil(t.offset + n);
  ie(t, g, r), t.stopAt = g, t.from = t.offset, t.elapsed = 0, t.duration = 2 * (g - t.offset) / f, t.stopStartedAt = e.spinAge, t.phase = "stop";
}
function We(e, s, t) {
  if (s === 0) return !0;
  const r = e.reels[s - 1];
  return !r || r.stopStartedAt < 0 ? !1 : e.spinAge >= r.stopStartedAt + t;
}
function F(e) {
  return e.reduced ? { ...se, startStagger: 0.02, stopStagger: 0.04, minSpin: 0.4 } : e.quick ? K : se;
}
function ie(e, s, t) {
  for (let r = 0; r < z; r += 1) {
    const l = t[r] ?? "cherry", a = ae(s, r);
    e.symbols[a] = l;
  }
}
function ce(e) {
  return [e?.[0] ?? "cherry", e?.[1] ?? "lemon", e?.[2] ?? "plum"];
}
function le(e) {
  return (e % x + x) % x;
}
const ne = {
  cherry: "🍒",
  lemon: "🍋",
  plum: "🍇",
  bell: "🔔",
  bar: "BAR",
  seven: "7",
  diamond: "💎",
  wild: "W",
  scatter: "★"
};
function $e(e) {
  const s = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  e.classList.toggle("is-reduce", s), e.replaceChildren();
  const t = xe(s), r = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  r.setAttribute("class", "slots-paylines"), r.setAttribute("viewBox", "0 0 100 100"), r.setAttribute("preserveAspectRatio", "none"), e.appendChild(r);
  const l = t.reels.map((o) => {
    const d = document.createElement("div");
    d.className = "slots-reel";
    const c = document.createElement("div");
    c.className = "slots-strip";
    const u = [];
    o.symbols.forEach((m, p) => {
      const b = document.createElement("div");
      b.className = "slots-symbol", b.dataset.symbol = m, b.textContent = ne[m], c.appendChild(b), u[p] = b;
    });
    const v = document.createElement("div");
    return v.className = "slots-streak", d.append(c, v), e.appendChild(d), { nodes: u, strip: c, streak: v, root: d };
  });
  let a = 0;
  const f = () => {
    const o = e.clientHeight / 3;
    o < 8 || Math.abs(o - a) < 0.5 || (a = o, e.style.setProperty("--cell", `${a}px`));
  };
  f();
  const n = new ResizeObserver(() => f());
  n.observe(e);
  function g(o, d, c) {
    const u = o.nodes[d];
    !u || u.dataset.symbol === c || (u.dataset.symbol = c, u.textContent = ne[c]);
  }
  function S() {
    a < 8 || t.reels.forEach((o, d) => {
      const c = l[d];
      if (!c) return;
      for (let m = 0; m < x; m += 1) {
        const p = o.symbols[m] ?? "cherry";
        g(c, m, p);
        const b = c.nodes[m];
        if (!b) continue;
        const C = Le(m, o.offset);
        b.style.transform = `translate3d(0, ${C * a}px, 0)`;
      }
      const u = s ? 0 : Math.min(4.5, Math.max(0, (o.speed - 8) * 0.16));
      c.strip.style.filter = u > 0.4 ? `blur(${u.toFixed(2)}px)` : "";
      const v = s ? 0 : Math.min(0.85, Math.max(0, (o.speed - 6) / 18));
      c.streak.style.opacity = v.toFixed(3), c.root.classList.toggle(
        "is-tease",
        t.tease && !o.landed && !t.quick && !s
      );
    });
  }
  function y() {
    t.reels.forEach((o, d) => {
      const c = l[d];
      c && o.symbols.forEach((u, v) => g(c, v, u));
    });
  }
  return {
    show(o) {
      Re(t, o), r.replaceChildren();
      for (const d of l) {
        d.root.classList.remove("is-tease");
        for (const c of d.nodes) c.classList.remove("is-win");
      }
      y(), S();
    },
    spin() {
      f(), _e(t), r.replaceChildren();
      for (const o of l) {
        o.root.classList.remove("is-tease");
        for (const d of o.nodes) d.classList.remove("is-win");
      }
      S();
    },
    turbo() {
      Be(t);
    },
    deliver(o) {
      Pe(t, o);
    },
    abort() {
      this.show(t.reels.map((o) => o.target));
    },
    update(o, d) {
      a < 8 && f();
      const c = Oe(t, o);
      if (d && !s) {
        for (const u of c.ticks)
          d.playTone({ frequency: 740, duration: 0.02, type: "square", gain: 0.012 });
        for (const u of c.landed)
          d.playTone({
            frequency: 180 + u * 30,
            duration: 0.06,
            type: "triangle",
            gain: 0.03
          });
        c.scatters.length > 0 && d.playTone({
          frequency: 660,
          duration: 0.1,
          type: "square",
          gain: 0.035,
          slideTo: 990
        });
      }
      return S(), c.moving;
    },
    celebrate(o) {
      r.replaceChildren();
      for (const d of o) {
        const c = V[d.line], u = [];
        for (let m = 0; m < d.count; m += 1) {
          const p = c?.[m] ?? 1;
          u.push(`${(m + 0.5) / 5 * 100},${(p + 0.5) / 3 * 100}`);
          const b = t.reels[m], C = l[m];
          if (!b || !C) continue;
          C.nodes[ae(b.offset, p)]?.classList.add("is-win");
        }
        const v = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        v.setAttribute("points", u.join(" ")), v.setAttribute("class", "slots-payline"), r.appendChild(v);
      }
    },
    destroy() {
      n.disconnect(), e.replaceChildren();
    }
  };
}
const Ge = {}, re = [
  ["cherry", "lemon", "plum"],
  ["bell", "bar", "seven"],
  ["diamond", "wild", "scatter"],
  ["lemon", "plum", "bell"],
  ["bar", "seven", "cherry"]
], U = "wgf:slots-wallet", fe = "wgf:slots-token", He = "wgf:session";
function et() {
  Ne();
  let e = null;
  const s = [];
  let t = null, r = B(), l = 20, a = !1, f = !1, n = 0, g = null, S = !1, y = 0, o = 0, d = !1, c = "pending", u = !1, v = null, m = 0, p = "", b = "", C = 0, I = 0, q = "ready", k = null;
  function h(i, w) {
    return be(e?.store.getState().ui.locale ?? "zh", i, w);
  }
  function W(i, w) {
    w === "spin" && i.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), w === "stop" && i.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), w === "win" && i.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), w === "big" && i.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), w === "scatter" && i.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function M() {
    e && D(e.store, {
      id: N.id,
      status: q,
      score: y,
      highScore: Math.max(o, y),
      message: p,
      detail: oe(c, h),
      combo: r.freeSpins,
      credits: r.credits
    });
  }
  function E() {
    if (!t) return;
    const i = t.querySelector("[data-credits]"), w = t.querySelector("[data-free]"), T = t.querySelector("[data-source]"), A = t.querySelector("[data-message]");
    i && (i.textContent = h("slots.credits", { n: r.credits })), w && (w.textContent = h("slots.free", { n: r.freeSpins })), T && (T.textContent = oe(c, h)), A && (A.textContent = p), t.querySelectorAll("[data-bet]").forEach((H) => {
      H.classList.toggle("is-bet", Number(H.dataset.bet) === l), H.disabled = a;
    });
    const L = t.querySelector("[data-spin]"), R = t.querySelector("[data-note]");
    R && (R.textContent = h("slots.note"));
    const _ = t.querySelector("[data-auto]");
    _ && (_.textContent = h("slots.auto")), L && (L.disabled = !u || q !== "running", L.textContent = h(a ? "slots.stop" : "slots.spin")), _ && (_.setAttribute("aria-pressed", f ? "true" : "false"), _.disabled = q !== "running" || a);
    const X = t.querySelector("[data-big]"), Z = t.querySelector("[data-big-value]");
    X && (X.hidden = !b), Z && I <= 0 && (Z.textContent = b);
  }
  function $() {
    c === "local" && localStorage.setItem(U, JSON.stringify(r));
  }
  function j(i) {
    r = {
      credits: i.credits,
      freeSpins: i.freeSpinsLeft,
      freeBet: i.freeSpinsLeft > 0 ? i.bet : r.freeBet
    }, $(), g = i, S = !1, n = 0, b = "", I = 0, p = h("slots.spinning"), y += i.win, k?.deliver(i.grid), M(), E();
  }
  async function G() {
    if (!e || a || q !== "running" || !u || c === "pending")
      return;
    if (r.freeSpins <= 0 && r.credits < l) {
      p = h("slots.broke"), f = !1, M(), E();
      return;
    }
    a = !0, b = "", I = 0, S = !1, k?.spin(), e && W(e.audio, "spin");
    const i = m, w = v ?? Ye();
    if (v = w, E(), c === "local") {
      const T = qe(r, l, Math.random);
      if (i !== m || !e) return;
      if (v = null, "error" in T) {
        a = !1, k?.abort(), p = T.error === "insufficient" ? h("slots.broke") : h("slots.badBet"), f = !1, M(), E();
        return;
      }
      j(T);
      return;
    }
    try {
      const T = await Ue(l, w);
      if (i !== m || !e) return;
      v = null, j(T);
    } catch {
      if (i !== m || !e) return;
      a = !1, k?.abort(), f = !1, p = h("slots.retry"), M(), E();
    }
  }
  function pe() {
    if (!g || !e) return;
    a = !1, k?.celebrate(g.wins), g.win > 0 ? (p = h("slots.won", { n: g.win }), W(e.audio, g.bigWin ? "big" : "win")) : p = h("slots.lost"), g.freeSpinsAwarded > 0 && (p = h("slots.freeAward", { message: p, n: g.freeSpinsAwarded }), W(e.audio, "scatter")), g.bigWin && (b = "0", C = 0, I = g.win, f = !1), y > o && Se(N.id, y), r.credits < O[0] && r.freeSpins === 0 && (f = !1, q = "over", p = h("slots.empty"), d || (d = !0, e.events.emit("game:over", {
      gameId: N.id,
      score: y,
      best: Math.max(o, y),
      isRecord: y > o
    }))), g = null, n = f ? 0.7 : 0, M(), E();
  }
  async function ge() {
    if (!await Je()) {
      c = "local", u = !0, r = Ve(), $(), p = h("slots.offline"), M(), E();
      return;
    }
    try {
      const w = await Ke();
      c = "server", u = !0, r = de(w), p = h("slots.synced"), M(), E();
    } catch {
      u = !1, p = h("slots.serverDown"), M(), E();
    }
  }
  function Q(i) {
    l = 20, a = !1, f = !1, g = null, S = !1, n = 0, y = 0, d = !1, b = "", I = 0, k?.abort(), k?.show(re), p = u ? N.howToPlay : h("slots.connecting"), q = i ? "running" : "ready", M(), E();
  }
  async function me() {
    if (m += 1, v = null, o = ee(N.id), c === "server")
      try {
        r = await ze();
      } catch {
        p = h("slots.resetFail"), M(), E();
        return;
      }
    else c === "local" && (localStorage.removeItem(U), r = B(), $());
    Q(!0);
  }
  return ye(N, {
    async onPreload(i, w) {
      await i.preload([], w);
    },
    onMount(i) {
      e = i, i.container.setAttribute("data-wgf-game", "wgf-game:slots"), t = document.createElement("div"), t.className = "slots", t.innerHTML = De();
      const w = t.querySelector("[data-reels]");
      w instanceof HTMLElement && (k = $e(w), k.show(re)), i.container.appendChild(t), o = ee(N.id), t.addEventListener("click", (T) => {
        const A = T.target;
        if (!(A instanceof HTMLElement)) return;
        if (a && (A.closest("[data-spin]") || A.closest("[data-reels]"))) {
          k?.turbo();
          return;
        }
        const L = A.closest("[data-bet]"), R = Number(L?.dataset.bet);
        if (O.includes(R) && !a) {
          l = R, E();
          return;
        }
        A.closest("[data-spin]") && G(), A.closest("[data-auto]") && (f = !f, f && !a && G(), E());
      }), Q(!1), ge(), s.push(
        i.loop.onUpdate((T) => {
          if (a && k) {
            const A = k.update(T, i.audio);
            g && !A && !S && (S = !0, pe());
          }
          if (I > 0 && t) {
            C = Math.min(I, C + I * T * 0.95);
            const A = t.querySelector("[data-big-value]");
            A && (A.textContent = String(Math.round(C))), C >= I - 0.4 && (b = String(Math.round(I)), I = 0, A && (A.textContent = b));
          }
          !a && f && q === "running" && n > 0 && (n -= T, n <= 0 && G());
        }),
        i.store.subscribe((T, A) => {
          T.ui.locale !== A.ui.locale && E();
        }),
        i.events.on("game:start", () => {
          q === "ready" && (q = "running", p = h("slots.ready"), M(), E());
        }),
        i.events.on("game:restart", () => {
          me();
        })
      );
    },
    onPause(i) {
      i.store.getState().game.status === "running" && D(i.store, { status: "paused" });
    },
    onResume(i) {
      i.store.getState().game.status === "paused" && D(i.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const i of s) i();
      s.length = 0, k?.destroy(), k = null, t?.remove(), t = null, e = null;
    }
  });
}
function De() {
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
    <div class="slots-bets">${O.map(
    (s) => `<button type="button" data-bet="${s}">${s}</button>`
  ).join("")}</div>
    <div class="slots-actions">
      <button type="button" class="slots-spin" data-spin disabled>旋转</button>
      <button type="button" data-auto>自动</button>
    </div>
  `;
}
function oe(e, s) {
  return s(e === "server" ? "slots.server" : e === "local" ? "slots.local" : "slots.pending");
}
function Ye() {
  return `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function Ve() {
  try {
    const e = localStorage.getItem(U);
    if (!e) return B();
    const s = JSON.parse(e);
    return !s || typeof s.credits != "number" ? B() : {
      credits: Math.max(0, Math.floor(s.credits)),
      freeSpins: Math.max(0, Math.floor(s.freeSpins ?? 0)),
      freeBet: typeof s.freeBet == "number" ? s.freeBet : 20
    };
  } catch {
    return B();
  }
}
function de(e) {
  return {
    credits: e.credits,
    freeSpins: e.freeSpins,
    freeBet: e.freeBet
  };
}
function J() {
  const e = new ve(), s = Qe();
  if (s?.accessToken && !s.accessToken.startsWith("local."))
    e.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const t = je();
    t && e.set({ accessToken: t });
  }
  return new we({ baseUrl: ue(), tokens: e, timeoutMs: 2500 });
}
async function Ke() {
  const e = await J().post("/api/slots/session", {});
  return e.walletToken && localStorage.setItem(fe, e.walletToken), e;
}
async function Ue(e, s) {
  return J().post("/api/slots/spin", { bet: e, spinId: s });
}
async function ze() {
  const e = await J().post("/api/slots/reset", {});
  return de(e);
}
async function Je() {
  try {
    return (await fetch(`${ue()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
function ue() {
  return Ge?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function je() {
  const e = localStorage.getItem(fe);
  return e && e.startsWith("v1w.") ? e : null;
}
function Qe() {
  try {
    const e = localStorage.getItem(He);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
export {
  et as createGame,
  N as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
