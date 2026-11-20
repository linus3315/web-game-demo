import { registerStrings as ce, defineGame as fe, patchGame as F, readHighScore as X, t as de, writeHighScore as ue } from "@wgf/core";
import { TokenStore as pe, HttpClient as me } from "@wgf/net";
const he = {
  background: "#2a140c",
  shapes: [
    { tag: "rect", attrs: { x: 48, y: 56, width: 224, height: 120, rx: 16, fill: "#1a0d08" } },
    { tag: "circle", attrs: { cx: 92, cy: 116, r: 22, fill: "#ff4d6d" } },
    { tag: "circle", attrs: { cx: 148, cy: 116, r: 22, fill: "#ffb703" } },
    { tag: "circle", attrs: { cx: 204, cy: 116, r: 22, fill: "#f6f1e7" } },
    { tag: "rect", attrs: { x: 118, y: 188, width: 84, height: 28, rx: 14, fill: "#ff5a1f" } }
  ]
}, q = {
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
  art: he,
  renderer: "dom",
  controls: "pointer",
  tags: ["拉霸", "联网"],
  theme: { accent: "#ffb703", accentInk: "#2a1408", glow: "#ff5a1f", radius: 18, font: "serif" }
}, $ = [10, 20, 50, 100], ge = 1e3, ye = 5, G = [
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
], K = [
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
], be = {
  cherry: [5, 15, 40],
  lemon: [5, 15, 40],
  plum: [8, 20, 50],
  bell: [12, 30, 80],
  bar: [20, 50, 120],
  seven: [30, 80, 200],
  diamond: [50, 150, 400]
};
function Se(e) {
  return $.includes(e);
}
function W() {
  return { credits: ge, freeSpins: 0, freeBet: 20 };
}
function ve(e) {
  return Array.from({ length: ye }, () => {
    const n = Math.floor(e() * G.length);
    return [0, 1, 2].map((i) => G[(n + i) % G.length] ?? "cherry");
  });
}
function we(e, n, i) {
  const d = n / K.length, b = [];
  K.forEach((S, M) => {
    const L = S.map((o, c) => e[c]?.[o] ?? "cherry"), T = L.find((o) => o !== "wild" && o !== "scatter");
    if (!T) return;
    let C = 0;
    for (const o of L)
      if (o === T || o === "wild") C += 1;
      else break;
    if (C < 3) return;
    const t = be[T], r = Math.round((t?.[C - 3] ?? 0) * d * (i ? 2 : 1));
    r > 0 && b.push({ line: M, symbol: T, count: C, payout: r });
  });
  let f = 0;
  for (const S of e)
    for (const M of S) M === "scatter" && (f += 1);
  const y = [0, 0, 0, 2, 10, 50], h = f >= 3 ? Math.round(n * (y[f] ?? 50) * (i ? 2 : 1)) : 0, m = f >= 5 ? 20 : f === 4 ? 12 : f >= 3 ? 8 : 0, k = b.reduce((S, M) => S + M.payout, 0) + h;
  return {
    grid: e,
    wins: b,
    scatterCount: f,
    scatterPayout: h,
    freeSpinsAwarded: m,
    win: k,
    bigWin: k > 0 && k >= n * 10
  };
}
function Te(e, n, i) {
  if (!Se(n)) return { error: "bad_bet" };
  const d = e.freeSpins > 0, b = d ? e.freeBet : n;
  if (d)
    e.freeSpins -= 1;
  else {
    if (e.credits < n) return { error: "insufficient" };
    e.credits -= n;
  }
  const f = we(ve(i), b, d);
  return e.credits += f.win, f.freeSpinsAwarded > 0 && (e.freeSpins += f.freeSpinsAwarded, e.freeBet = b), {
    ...f,
    credits: e.credits,
    freeSpinsLeft: e.freeSpins,
    bet: b
  };
}
function Ae() {
  ce("slots", {
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
const Z = {
  cherry: "🍒",
  lemon: "🍋",
  plum: "🍇",
  bell: "🔔",
  bar: "BAR",
  seven: "7",
  diamond: "💎",
  wild: "W",
  scatter: "★"
}, ee = [
  "cherry",
  "lemon",
  "plum",
  "bell",
  "bar",
  "seven",
  "diamond",
  "wild",
  "scatter"
], x = 24, O = 5, Y = 3;
function ke(e) {
  const n = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  e.classList.toggle("is-reduce", n), e.replaceChildren();
  const i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  i.setAttribute("class", "slots-paylines"), i.setAttribute("viewBox", "0 0 100 100"), i.setAttribute("preserveAspectRatio", "none"), e.appendChild(i);
  const d = [];
  for (let t = 0; t < O; t += 1) {
    const r = document.createElement("div");
    r.className = "slots-reel";
    const o = document.createElement("div");
    o.className = "slots-strip";
    const c = [], g = [];
    for (let s = 0; s < x; s += 1) {
      const u = ee[(t * 3 + s) % ee.length] ?? "cherry";
      c.push(u);
      const p = document.createElement("div");
      p.className = "slots-symbol", p.textContent = Z[u], o.appendChild(p), g.push(p);
    }
    const l = document.createElement("div");
    l.className = "slots-streak", r.append(o, l), e.appendChild(r), d.push({
      symbols: c,
      nodes: g,
      strip: o,
      streak: l,
      root: r,
      offset: 0,
      speed: 0,
      phase: "idle",
      stopAt: 0,
      from: 0,
      elapsed: 0,
      duration: 0.5,
      landed: !0,
      tickAt: 0,
      target: ["cherry", "lemon", "plum"]
    });
  }
  let b = 0, f = null, y = 0, h = !1, m = !1;
  const k = [0, 0, 0, 0, 0], S = () => {
    const t = e.clientHeight / Y;
    t < 8 || Math.abs(t - b) < 0.5 || (b = t, e.style.setProperty("--cell", `${b}px`));
  };
  S();
  const M = new ResizeObserver(() => S());
  M.observe(e);
  function L(t) {
    if (b < 8) return;
    const r = -(t.offset % x + x) % x;
    t.strip.style.transform = `translate3d(0, ${r * b}px, 0)`;
    const o = n ? 0 : Math.min(0.8, Math.max(0, (t.speed - 6) / 22));
    t.streak.style.opacity = o.toFixed(3);
  }
  function T(t, r, o) {
    for (let c = 0; c < Y; c += 1) {
      const g = o[c] ?? "cherry", l = (r + c) % x, s = t.nodes[l];
      !s || t.symbols[l] === g || (t.symbols[l] = g, s.textContent = Z[g]);
    }
  }
  function C(t, r) {
    const o = f?.[r] ?? t.target;
    t.target = [o[0] ?? "cherry", o[1] ?? "lemon", o[2] ?? "plum"];
    const c = h ? 3.2 : n ? 2.4 : m ? 12 + r : 5 + r * 1.4, g = Math.ceil(t.offset + c);
    T(t, g, t.target), t.stopAt = g, t.from = t.offset, t.elapsed = 0, t.duration = h ? 0.18 : n ? 0.2 : m ? 0.92 : 0.48, t.phase = "stop", t.root.classList.toggle("is-tease", m && !h && !n);
  }
  return {
    show(t) {
      f = null, h = !1, m = !1, i.replaceChildren(), d.forEach((r, o) => {
        const c = t[o] ?? [];
        r.target = [c[0] ?? "cherry", c[1] ?? "lemon", c[2] ?? "plum"], r.phase = "idle", r.speed = 0, r.landed = !0, r.offset = 0, T(r, 0, r.target), r.root.classList.remove("is-tease");
        for (const g of r.nodes) g.classList.remove("is-win");
        L(r);
      });
    },
    spin() {
      S(), f = null, h = !1, m = !1, y = 0, i.replaceChildren();
      for (const t of d) {
        t.phase = "spin", t.speed = n ? 8 : 2, t.landed = !1, t.root.classList.remove("is-tease");
        for (const r of t.nodes) r.classList.remove("is-win");
      }
    },
    turbo() {
      n || (h = !0, m = !1, d.forEach((t, r) => {
        t.root.classList.remove("is-tease"), t.phase === "spin" ? k[r] = Math.min(k[r] ?? y, y + r * 0.05) : t.phase === "stop" && (t.duration = Math.min(t.duration, 0.16));
      }));
    },
    deliver(t) {
      f = t;
      const r = n ? 0.05 : h ? 0.08 : 0.42, o = n ? 0.04 : h ? 0.07 : 0.26;
      for (let c = 0; c < O; c += 1)
        k[c] = y + r + c * o;
    },
    abort() {
      f = null, this.show(d.map((t) => t.target));
    },
    update(t, r) {
      b < 8 && S();
      const o = Math.min(0.05, Math.max(0, t));
      y += o;
      let c = !1, g = 0;
      for (let l = 0; l < O; l += 1) {
        const s = d[l];
        if (s) {
          if (s.phase === "spin") {
            c = !0;
            const u = n ? 10 : h ? 28 : 22;
            s.speed = Math.min(u, s.speed + (h ? 80 : 46) * o), m && f && !h && !n && (s.speed = Math.max(7, s.speed - 18 * o));
            const p = Math.floor(s.offset);
            s.offset += s.speed * o;
            const B = Math.floor(s.offset);
            s.tickAt += o;
            const I = s.speed > 16 ? 0.08 : 0.045;
            r && !n && B !== p && s.tickAt > I && (s.tickAt = 0, r.playTone({ frequency: 740, duration: 0.02, type: "square", gain: 0.012 }));
            const A = k[l] ?? Number.POSITIVE_INFINITY, N = l === 0 ? !0 : d[l - 1]?.landed ?? !1;
            f && y >= A && (N || h) && C(s, l);
          } else if (s.phase === "stop") {
            c = !0, s.elapsed += o;
            const u = Math.min(1, s.elapsed / s.duration), p = n || h ? Ee(u) : Me(u);
            s.offset = s.from + (s.stopAt - s.from) * p, u >= 1 && (s.offset = s.stopAt, s.phase = "idle", s.speed = 0, s.landed = !0, s.root.classList.remove("is-tease"), r?.playTone({
              frequency: 180 + l * 30,
              duration: 0.06,
              type: "triangle",
              gain: 0.03
            }), s.target.includes("scatter") && r?.playTone({
              frequency: 660,
              duration: 0.1,
              type: "square",
              gain: 0.035,
              slideTo: 990
            }));
          }
          if (s.landed)
            for (const u of s.target) u === "scatter" && (g += 1);
          L(s);
        }
      }
      if (!m && g >= 2 && d.some((l) => !l.landed)) {
        m = !0;
        const l = n || h ? 0.05 : 0.62;
        d.forEach((s, u) => {
          s.landed || s.phase === "stop" || (k[u] = Math.max(k[u] ?? 0, y + l * (u + 1)), s.root.classList.add("is-tease"));
        });
      }
      return c;
    },
    celebrate(t) {
      i.replaceChildren();
      for (const r of t) {
        const o = K[r.line], c = [];
        for (let l = 0; l < r.count; l += 1) {
          const s = o?.[l] ?? 1;
          c.push(`${(l + 0.5) / O * 100},${(s + 0.5) / Y * 100}`);
          const u = d[l];
          if (!u) continue;
          u.nodes[(Math.round(u.offset) + s) % x]?.classList.add("is-win");
        }
        const g = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        g.setAttribute("points", c.join(" ")), g.setAttribute("class", "slots-payline"), i.appendChild(g);
      }
    },
    destroy() {
      M.disconnect(), e.replaceChildren();
    }
  };
}
function Ee(e) {
  return 1 - (1 - e) * (1 - e) * (1 - e);
}
function Me(e) {
  return 1 + 2.15 * (e - 1) ** 3 + 1.15 * (e - 1) ** 2;
}
const Ce = {}, te = [
  ["cherry", "lemon", "plum"],
  ["bell", "bar", "seven"],
  ["diamond", "wild", "scatter"],
  ["lemon", "plum", "bell"],
  ["bar", "seven", "cherry"]
], z = "wgf:slots-wallet", ne = "wgf:slots-token", Ie = "wgf:session";
function He() {
  Ae();
  let e = null;
  const n = [];
  let i = null, d = W(), b = 20, f = !1, y = !1, h = 0, m = null, k = !1, S = 0, M = 0, L = !1, T = "pending", C = !1, t = null, r = 0, o = "", c = "", g = 0, l = 0, s = "ready", u = null;
  function p(a, v) {
    return de(e?.store.getState().ui.locale ?? "zh", a, v);
  }
  function B(a, v) {
    v === "spin" && a.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), v === "stop" && a.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), v === "win" && a.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), v === "big" && a.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), v === "scatter" && a.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function I() {
    e && F(e.store, {
      id: q.id,
      status: s,
      score: S,
      highScore: Math.max(M, S),
      message: o,
      detail: se(T, p),
      combo: d.freeSpins,
      credits: d.credits
    });
  }
  function A() {
    if (!i) return;
    const a = i.querySelector("[data-credits]"), v = i.querySelector("[data-free]"), E = i.querySelector("[data-source]"), w = i.querySelector("[data-message]");
    a && (a.textContent = p("slots.credits", { n: d.credits })), v && (v.textContent = p("slots.free", { n: d.freeSpins })), E && (E.textContent = se(T, p)), w && (w.textContent = o), i.querySelectorAll("[data-bet]").forEach((D) => {
      D.classList.toggle("is-bet", Number(D.dataset.bet) === b), D.disabled = f;
    });
    const R = i.querySelector("[data-spin]"), P = i.querySelector("[data-note]");
    P && (P.textContent = p("slots.note"));
    const _ = i.querySelector("[data-auto]");
    _ && (_.textContent = p("slots.auto")), R && (R.disabled = !C || s !== "running", R.textContent = p(f ? "slots.stop" : "slots.spin")), _ && (_.setAttribute("aria-pressed", y ? "true" : "false"), _.disabled = s !== "running" || f);
    const U = i.querySelector("[data-big]"), Q = i.querySelector("[data-big-value]");
    U && (U.hidden = !c), Q && l <= 0 && (Q.textContent = c);
  }
  function N() {
    T === "local" && localStorage.setItem(z, JSON.stringify(d));
  }
  function V(a) {
    d = {
      credits: a.credits,
      freeSpins: a.freeSpinsLeft,
      freeBet: a.freeSpinsLeft > 0 ? a.bet : d.freeBet
    }, N(), m = a, k = !1, h = 0, c = "", l = 0, o = p("slots.spinning"), S += a.win, u?.deliver(a.grid), I(), A();
  }
  async function H() {
    if (!e || f || s !== "running" || !C || T === "pending")
      return;
    if (d.freeSpins <= 0 && d.credits < b) {
      o = p("slots.broke"), y = !1, I(), A();
      return;
    }
    f = !0, c = "", l = 0, k = !1, u?.spin(), e && B(e.audio, "spin");
    const a = r, v = t ?? qe();
    if (t = v, A(), T === "local") {
      const E = Te(d, b, Math.random);
      if (a !== r || !e) return;
      if (t = null, "error" in E) {
        f = !1, u?.abort(), o = E.error === "insufficient" ? p("slots.broke") : p("slots.badBet"), y = !1, I(), A();
        return;
      }
      V(E);
      return;
    }
    try {
      const E = await Ne(b, v);
      if (a !== r || !e) return;
      t = null, V(E);
    } catch {
      if (a !== r || !e) return;
      f = !1, u?.abort(), y = !1, o = p("slots.retry"), I(), A();
    }
  }
  function ae() {
    if (!m || !e) return;
    f = !1, u?.celebrate(m.wins), m.win > 0 ? (o = p("slots.won", { n: m.win }), B(e.audio, m.bigWin ? "big" : "win")) : o = p("slots.lost"), m.freeSpinsAwarded > 0 && (o = p("slots.freeAward", { message: o, n: m.freeSpinsAwarded }), B(e.audio, "scatter")), m.bigWin && (c = "0", g = 0, l = m.win, y = !1), S > M && ue(q.id, S), d.credits < $[0] && d.freeSpins === 0 && (y = !1, s = "over", o = p("slots.empty"), L || (L = !0, e.events.emit("game:over", {
      gameId: q.id,
      score: S,
      best: Math.max(M, S),
      isRecord: S > M
    }))), m = null, h = y ? 0.7 : 0, I(), A();
  }
  async function ie() {
    if (!await Pe()) {
      T = "local", C = !0, d = xe(), N(), o = p("slots.offline"), I(), A();
      return;
    }
    try {
      const v = await Be();
      T = "server", C = !0, d = oe(v), o = p("slots.synced"), I(), A();
    } catch {
      C = !1, o = p("slots.serverDown"), I(), A();
    }
  }
  function j(a) {
    b = 20, f = !1, y = !1, m = null, k = !1, h = 0, S = 0, L = !1, c = "", l = 0, u?.abort(), u?.show(te), o = C ? q.howToPlay : p("slots.connecting"), s = a ? "running" : "ready", I(), A();
  }
  async function le() {
    if (r += 1, t = null, M = X(q.id), T === "server")
      try {
        d = await Re();
      } catch {
        o = p("slots.resetFail"), I(), A();
        return;
      }
    else T === "local" && (localStorage.removeItem(z), d = W(), N());
    j(!0);
  }
  return fe(q, {
    async onPreload(a, v) {
      await a.preload([], v);
    },
    onMount(a) {
      e = a, a.container.setAttribute("data-wgf-game", "wgf-game:slots"), i = document.createElement("div"), i.className = "slots", i.innerHTML = Le();
      const v = i.querySelector("[data-reels]");
      v instanceof HTMLElement && (u = ke(v), u.show(te)), a.container.appendChild(i), M = X(q.id), i.addEventListener("click", (E) => {
        const w = E.target;
        if (!(w instanceof HTMLElement)) return;
        if (f && (w.closest("[data-spin]") || w.closest("[data-reels]"))) {
          u?.turbo();
          return;
        }
        const R = w.closest("[data-bet]"), P = Number(R?.dataset.bet);
        if ($.includes(P) && !f) {
          b = P, A();
          return;
        }
        w.closest("[data-spin]") && H(), w.closest("[data-auto]") && (y = !y, y && !f && H(), A());
      }), j(!1), ie(), n.push(
        a.loop.onUpdate((E) => {
          if (f && u) {
            const w = u.update(E, a.audio);
            m && !w && !k && (k = !0, ae());
          }
          if (l > 0 && i) {
            g = Math.min(l, g + l * E * 0.95);
            const w = i.querySelector("[data-big-value]");
            w && (w.textContent = String(Math.round(g))), g >= l - 0.4 && (c = String(Math.round(l)), l = 0, w && (w.textContent = c));
          }
          !f && y && s === "running" && h > 0 && (h -= E, h <= 0 && H());
        }),
        a.store.subscribe((E, w) => {
          E.ui.locale !== w.ui.locale && A();
        }),
        a.events.on("game:start", () => {
          s === "ready" && (s = "running", o = p("slots.ready"), I(), A());
        }),
        a.events.on("game:restart", () => {
          le();
        })
      );
    },
    onPause(a) {
      a.store.getState().game.status === "running" && F(a.store, { status: "paused" });
    },
    onResume(a) {
      a.store.getState().game.status === "paused" && F(a.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const a of n) a();
      n.length = 0, u?.destroy(), u = null, i?.remove(), i = null, e = null;
    }
  });
}
function Le() {
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
    <div class="slots-bets">${$.map(
    (n) => `<button type="button" data-bet="${n}">${n}</button>`
  ).join("")}</div>
    <div class="slots-actions">
      <button type="button" class="slots-spin" data-spin disabled>旋转</button>
      <button type="button" data-auto>自动</button>
    </div>
  `;
}
function se(e, n) {
  return n(e === "server" ? "slots.server" : e === "local" ? "slots.local" : "slots.pending");
}
function qe() {
  return `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function xe() {
  try {
    const e = localStorage.getItem(z);
    if (!e) return W();
    const n = JSON.parse(e);
    return !n || typeof n.credits != "number" ? W() : {
      credits: Math.max(0, Math.floor(n.credits)),
      freeSpins: Math.max(0, Math.floor(n.freeSpins ?? 0)),
      freeBet: typeof n.freeBet == "number" ? n.freeBet : 20
    };
  } catch {
    return W();
  }
}
function oe(e) {
  return {
    credits: e.credits,
    freeSpins: e.freeSpins,
    freeBet: e.freeBet
  };
}
function J() {
  const e = new pe(), n = We();
  if (n?.accessToken && !n.accessToken.startsWith("local."))
    e.set({ accessToken: n.accessToken, refreshToken: n.refreshToken });
  else {
    const i = _e();
    i && e.set({ accessToken: i });
  }
  return new me({ baseUrl: re(), tokens: e, timeoutMs: 2500 });
}
async function Be() {
  const e = await J().post("/api/slots/session", {});
  return e.walletToken && localStorage.setItem(ne, e.walletToken), e;
}
async function Ne(e, n) {
  return J().post("/api/slots/spin", { bet: e, spinId: n });
}
async function Re() {
  const e = await J().post("/api/slots/reset", {});
  return oe(e);
}
async function Pe() {
  try {
    return (await fetch(`${re()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
function re() {
  return Ce?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function _e() {
  const e = localStorage.getItem(ne);
  return e && e.startsWith("v1w.") ? e : null;
}
function We() {
  try {
    const e = localStorage.getItem(Ie);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
export {
  He as createGame,
  q as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
