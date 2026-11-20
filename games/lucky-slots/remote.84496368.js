import { defineGame as ie, patchGame as G, readHighScore as z, writeHighScore as ce } from "@wgf/core";
import { TokenStore as le, HttpClient as fe } from "@wgf/net";
const ue = {
  background: "#2a140c",
  shapes: [
    { tag: "rect", attrs: { x: 48, y: 56, width: 224, height: 120, rx: 16, fill: "#1a0d08" } },
    { tag: "circle", attrs: { cx: 92, cy: 116, r: 22, fill: "#ff4d6d" } },
    { tag: "circle", attrs: { cx: 148, cy: 116, r: 22, fill: "#ffb703" } },
    { tag: "circle", attrs: { cx: 204, cy: 116, r: 22, fill: "#f6f1e7" } },
    { tag: "rect", attrs: { x: 118, y: 188, width: 84, height: 28, rx: 14, fill: "#ff5a1f" } }
  ]
}, x = {
  id: "lucky-slots",
  name: "幸运拉霸",
  description: "五轴三行、二十条线。娱乐积分，不能兑换，也不能充值。",
  howToPlay: "选择注额后旋转。百搭可替代普通图案，三个及以上夺宝送免费旋转。服务器在线时由服务器开奖，否则在这台设备上本地开奖。",
  cover: "slots",
  art: ue,
  renderer: "dom",
  controls: "pointer",
  tags: ["拉霸", "联网"],
  theme: { accent: "#ffb703", accentInk: "#2a1408", glow: "#ff5a1f", radius: 18, font: "serif" }
}, W = [10, 20, 50, 100], de = 1e3, pe = 5, D = [
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
], F = [
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
], me = {
  cherry: [5, 15, 40],
  lemon: [5, 15, 40],
  plum: [8, 20, 50],
  bell: [12, 30, 80],
  bar: [20, 50, 120],
  seven: [30, 80, 200],
  diamond: [50, 150, 400]
};
function ge(e) {
  return W.includes(e);
}
function $() {
  return { credits: de, freeSpins: 0, freeBet: 20 };
}
function he(e) {
  return Array.from({ length: pe }, () => {
    const o = Math.floor(e() * D.length);
    return [0, 1, 2].map((i) => D[(o + i) % D.length] ?? "cherry");
  });
}
function ye(e, o, i) {
  const u = o / F.length, y = [];
  F.forEach((b, M) => {
    const q = b.map((n, l) => e[l]?.[n] ?? "cherry"), v = q.find((n) => n !== "wild" && n !== "scatter");
    if (!v) return;
    let k = 0;
    for (const n of q)
      if (n === v || n === "wild") k += 1;
      else break;
    if (k < 3) return;
    const t = me[v], r = Math.round((t?.[k - 3] ?? 0) * u * (i ? 2 : 1));
    r > 0 && y.push({ line: M, symbol: v, count: k, payout: r });
  });
  let f = 0;
  for (const b of e)
    for (const M of b) M === "scatter" && (f += 1);
  const h = [0, 0, 0, 2, 10, 50], m = f >= 3 ? Math.round(o * (h[f] ?? 50) * (i ? 2 : 1)) : 0, p = f >= 5 ? 20 : f === 4 ? 12 : f >= 3 ? 8 : 0, T = y.reduce((b, M) => b + M.payout, 0) + m;
  return {
    grid: e,
    wins: y,
    scatterCount: f,
    scatterPayout: m,
    freeSpinsAwarded: p,
    win: T,
    bigWin: T > 0 && T >= o * 10
  };
}
function be(e, o, i) {
  if (!ge(o)) return { error: "bad_bet" };
  const u = e.freeSpins > 0, y = u ? e.freeBet : o;
  if (u)
    e.freeSpins -= 1;
  else {
    if (e.credits < o) return { error: "insufficient" };
    e.credits -= o;
  }
  const f = ye(he(i), y, u);
  return e.credits += f.win, f.freeSpinsAwarded > 0 && (e.freeSpins += f.freeSpinsAwarded, e.freeBet = y), {
    ...f,
    credits: e.credits,
    freeSpinsLeft: e.freeSpins,
    bet: y
  };
}
const Q = {
  cherry: "🍒",
  lemon: "🍋",
  plum: "🍇",
  bell: "🔔",
  bar: "BAR",
  seven: "7",
  diamond: "💎",
  wild: "W",
  scatter: "★"
}, X = [
  "cherry",
  "lemon",
  "plum",
  "bell",
  "bar",
  "seven",
  "diamond",
  "wild",
  "scatter"
], B = 24, O = 5, Y = 3;
function Se(e) {
  const o = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  e.classList.toggle("is-reduce", o), e.replaceChildren();
  const i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  i.setAttribute("class", "slots-paylines"), i.setAttribute("viewBox", "0 0 100 100"), i.setAttribute("preserveAspectRatio", "none"), e.appendChild(i);
  const u = [];
  for (let t = 0; t < O; t += 1) {
    const r = document.createElement("div");
    r.className = "slots-reel";
    const n = document.createElement("div");
    n.className = "slots-strip";
    const l = [], g = [];
    for (let s = 0; s < B; s += 1) {
      const d = X[(t * 3 + s) % X.length] ?? "cherry";
      l.push(d);
      const I = document.createElement("div");
      I.className = "slots-symbol", I.textContent = Q[d], n.appendChild(I), g.push(I);
    }
    const c = document.createElement("div");
    c.className = "slots-streak", r.append(n, c), e.appendChild(r), u.push({
      symbols: l,
      nodes: g,
      strip: n,
      streak: c,
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
  let y = 0, f = null, h = 0, m = !1, p = !1;
  const T = [0, 0, 0, 0, 0], b = () => {
    const t = e.clientHeight / Y;
    t < 8 || Math.abs(t - y) < 0.5 || (y = t, e.style.setProperty("--cell", `${y}px`));
  };
  b();
  const M = new ResizeObserver(() => b());
  M.observe(e);
  function q(t) {
    if (y < 8) return;
    const r = -(t.offset % B + B) % B;
    t.strip.style.transform = `translate3d(0, ${r * y}px, 0)`;
    const n = o ? 0 : Math.min(0.8, Math.max(0, (t.speed - 6) / 22));
    t.streak.style.opacity = n.toFixed(3);
  }
  function v(t, r, n) {
    for (let l = 0; l < Y; l += 1) {
      const g = n[l] ?? "cherry", c = (r + l) % B, s = t.nodes[c];
      !s || t.symbols[c] === g || (t.symbols[c] = g, s.textContent = Q[g]);
    }
  }
  function k(t, r) {
    const n = f?.[r] ?? t.target;
    t.target = [n[0] ?? "cherry", n[1] ?? "lemon", n[2] ?? "plum"];
    const l = m ? 3.2 : o ? 2.4 : p ? 12 + r : 5 + r * 1.4, g = Math.ceil(t.offset + l);
    v(t, g, t.target), t.stopAt = g, t.from = t.offset, t.elapsed = 0, t.duration = m ? 0.18 : o ? 0.2 : p ? 0.92 : 0.48, t.phase = "stop", t.root.classList.toggle("is-tease", p && !m && !o);
  }
  return {
    show(t) {
      f = null, m = !1, p = !1, i.replaceChildren(), u.forEach((r, n) => {
        const l = t[n] ?? [];
        r.target = [l[0] ?? "cherry", l[1] ?? "lemon", l[2] ?? "plum"], r.phase = "idle", r.speed = 0, r.landed = !0, r.offset = 0, v(r, 0, r.target), r.root.classList.remove("is-tease");
        for (const g of r.nodes) g.classList.remove("is-win");
        q(r);
      });
    },
    spin() {
      b(), f = null, m = !1, p = !1, h = 0, i.replaceChildren();
      for (const t of u) {
        t.phase = "spin", t.speed = o ? 8 : 2, t.landed = !1, t.root.classList.remove("is-tease");
        for (const r of t.nodes) r.classList.remove("is-win");
      }
    },
    turbo() {
      o || (m = !0, p = !1, u.forEach((t, r) => {
        t.root.classList.remove("is-tease"), t.phase === "spin" ? T[r] = Math.min(T[r] ?? h, h + r * 0.05) : t.phase === "stop" && (t.duration = Math.min(t.duration, 0.16));
      }));
    },
    deliver(t) {
      f = t;
      const r = o ? 0.05 : m ? 0.08 : 0.42, n = o ? 0.04 : m ? 0.07 : 0.26;
      for (let l = 0; l < O; l += 1)
        T[l] = h + r + l * n;
    },
    abort() {
      f = null, this.show(u.map((t) => t.target));
    },
    update(t, r) {
      y < 8 && b();
      const n = Math.min(0.05, Math.max(0, t));
      h += n;
      let l = !1, g = 0;
      for (let c = 0; c < O; c += 1) {
        const s = u[c];
        if (s) {
          if (s.phase === "spin") {
            l = !0;
            const d = o ? 10 : m ? 28 : 22;
            s.speed = Math.min(d, s.speed + (m ? 80 : 46) * n), p && f && !m && !o && (s.speed = Math.max(7, s.speed - 18 * n));
            const I = Math.floor(s.offset);
            s.offset += s.speed * n;
            const L = Math.floor(s.offset);
            s.tickAt += n;
            const E = s.speed > 16 ? 0.08 : 0.045;
            r && !o && L !== I && s.tickAt > E && (s.tickAt = 0, r.playTone({ frequency: 740, duration: 0.02, type: "square", gain: 0.012 }));
            const R = T[c] ?? Number.POSITIVE_INFINITY, _ = c === 0 ? !0 : u[c - 1]?.landed ?? !1;
            f && h >= R && (_ || m) && k(s, c);
          } else if (s.phase === "stop") {
            l = !0, s.elapsed += n;
            const d = Math.min(1, s.elapsed / s.duration), I = o || m ? ve(d) : we(d);
            s.offset = s.from + (s.stopAt - s.from) * I, d >= 1 && (s.offset = s.stopAt, s.phase = "idle", s.speed = 0, s.landed = !0, s.root.classList.remove("is-tease"), r?.playTone({
              frequency: 180 + c * 30,
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
            for (const d of s.target) d === "scatter" && (g += 1);
          q(s);
        }
      }
      if (!p && g >= 2 && u.some((c) => !c.landed)) {
        p = !0;
        const c = o || m ? 0.05 : 0.62;
        u.forEach((s, d) => {
          s.landed || s.phase === "stop" || (T[d] = Math.max(T[d] ?? 0, h + c * (d + 1)), s.root.classList.add("is-tease"));
        });
      }
      return l;
    },
    celebrate(t) {
      i.replaceChildren();
      for (const r of t) {
        const n = F[r.line], l = [];
        for (let c = 0; c < r.count; c += 1) {
          const s = n?.[c] ?? 1;
          l.push(`${(c + 0.5) / O * 100},${(s + 0.5) / Y * 100}`);
          const d = u[c];
          if (!d) continue;
          d.nodes[(Math.round(d.offset) + s) % B]?.classList.add("is-win");
        }
        const g = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        g.setAttribute("points", l.join(" ")), g.setAttribute("class", "slots-payline"), i.appendChild(g);
      }
    },
    destroy() {
      M.disconnect(), e.replaceChildren();
    }
  };
}
function ve(e) {
  return 1 - (1 - e) * (1 - e) * (1 - e);
}
function we(e) {
  return 1 + 2.15 * (e - 1) ** 3 + 1.15 * (e - 1) ** 2;
}
const Te = {}, Z = [
  ["cherry", "lemon", "plum"],
  ["bell", "bar", "seven"],
  ["diamond", "wild", "scatter"],
  ["lemon", "plum", "bell"],
  ["bar", "seven", "cherry"]
], K = "wgf:slots-wallet", te = "wgf:slots-token", Ee = "wgf:session";
function $e() {
  let e = null;
  const o = [];
  let i = null, u = $(), y = 20, f = !1, h = !1, m = 0, p = null, T = !1, b = 0, M = 0, q = !1, v = "pending", k = !1, t = null, r = 0, n = "", l = "", g = 0, c = 0, s = "ready", d = null;
  function I(a, S) {
    S === "spin" && a.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), S === "stop" && a.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), S === "win" && a.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), S === "big" && a.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), S === "scatter" && a.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function L() {
    e && G(e.store, {
      id: x.id,
      status: s,
      score: b,
      highScore: Math.max(M, b),
      message: n,
      detail: ee(v),
      combo: u.freeSpins,
      credits: u.credits
    });
  }
  function E() {
    if (!i) return;
    const a = i.querySelector("[data-credits]"), S = i.querySelector("[data-free]"), w = i.querySelector("[data-source]"), A = i.querySelector("[data-message]");
    a && (a.textContent = `积分 ${u.credits}`), S && (S.textContent = `免费 ${u.freeSpins}`), w && (w.textContent = ee(v)), A && (A.textContent = n), i.querySelectorAll("[data-bet]").forEach((H) => {
      H.classList.toggle("is-bet", Number(H.dataset.bet) === y), H.disabled = f;
    });
    const N = i.querySelector("[data-spin]"), C = i.querySelector("[data-auto]");
    N && (N.disabled = !k || s !== "running", N.textContent = f ? "快停" : "旋转"), C && (C.setAttribute("aria-pressed", h ? "true" : "false"), C.disabled = s !== "running" || f);
    const j = i.querySelector("[data-big]"), U = i.querySelector("[data-big-value]");
    j && (j.hidden = !l), U && c <= 0 && (U.textContent = l);
  }
  function R() {
    v === "local" && localStorage.setItem(K, JSON.stringify(u));
  }
  function _(a) {
    u = {
      credits: a.credits,
      freeSpins: a.freeSpinsLeft,
      freeBet: a.freeSpinsLeft > 0 ? a.bet : u.freeBet
    }, R(), p = a, T = !1, m = 0, l = "", c = 0, n = "旋转中…", b += a.win, d?.deliver(a.grid), L(), E();
  }
  async function P() {
    if (!e || f || s !== "running" || !k || v === "pending")
      return;
    if (u.freeSpins <= 0 && u.credits < y) {
      n = "积分不够了", h = !1, L(), E();
      return;
    }
    f = !0, l = "", c = 0, T = !1, d?.spin(), e && I(e.audio, "spin");
    const a = r, S = t ?? Me();
    if (t = S, E(), v === "local") {
      const w = be(u, y, Math.random);
      if (a !== r || !e) return;
      if (t = null, "error" in w) {
        f = !1, d?.abort(), n = w.error === "insufficient" ? "积分不够了" : "注额不合法", h = !1, L(), E();
        return;
      }
      _(w);
      return;
    }
    try {
      const w = await Le(y, S);
      if (a !== r || !e) return;
      t = null, _(w);
    } catch (w) {
      if (a !== r || !e) return;
      f = !1, d?.abort(), h = !1, n = w instanceof Error ? `服务器没有确认这次旋转（${w.message}）。再点一次会用同一个编号重试，不会扣两次。` : "服务器没有确认这次旋转。再点一次会用同一个编号重试，不会扣两次。", L(), E();
    }
  }
  function re() {
    if (!p || !e) return;
    f = !1, d?.celebrate(p.wins), p.win > 0 ? (n = `赢得 ${p.win}`, I(e.audio, p.bigWin ? "big" : "win")) : n = "没有中奖", p.freeSpinsAwarded > 0 && (n = `${n}，免费旋转 +${p.freeSpinsAwarded}`, I(e.audio, "scatter")), p.bigWin && (l = "0", g = 0, c = p.win, h = !1), b > M && ce(x.id, b), u.credits < W[0] && u.freeSpins === 0 && (h = !1, s = "over", n = "积分用完了", q || (q = !0, e.events.emit("game:over", {
      gameId: x.id,
      score: b,
      best: Math.max(M, b),
      isRecord: b > M
    }))), p = null, m = h ? 0.7 : 0, L(), E();
  }
  async function oe() {
    if (!await xe()) {
      v = "local", k = !0, u = ke(), R(), n = "服务器不可用，这局只用这台设备上的积分。", L(), E();
      return;
    }
    try {
      const S = await Ie();
      v = "server", k = !0, u = se(S), n = "积分在服务器上，旋转前已经同步。", L(), E();
    } catch (S) {
      k = !1, n = S instanceof Error ? S.message : "开奖服务器没有就绪", L(), E();
    }
  }
  function V(a) {
    y = 20, f = !1, h = !1, p = null, T = !1, m = 0, b = 0, q = !1, l = "", c = 0, d?.abort(), d?.show(Z), n = k ? x.howToPlay : "正在连接开奖服务器…", s = a ? "running" : "ready", L(), E();
  }
  async function ae() {
    if (r += 1, t = null, M = z(x.id), v === "server")
      try {
        u = await qe();
      } catch (a) {
        n = a instanceof Error ? a.message : "没能重置服务器上的积分", L(), E();
        return;
      }
    else v === "local" && (localStorage.removeItem(K), u = $(), R());
    V(!0);
  }
  return ie(x, {
    onMount(a) {
      e = a, a.container.setAttribute("data-wgf-game", "wgf-game:slots"), i = document.createElement("div"), i.className = "slots", i.innerHTML = Ae();
      const S = i.querySelector("[data-reels]");
      S instanceof HTMLElement && (d = Se(S), d.show(Z)), a.container.appendChild(i), M = z(x.id), i.addEventListener("click", (w) => {
        const A = w.target;
        if (!(A instanceof HTMLElement)) return;
        if (f && (A.closest("[data-spin]") || A.closest("[data-reels]"))) {
          d?.turbo();
          return;
        }
        const N = A.closest("[data-bet]"), C = Number(N?.dataset.bet);
        if (W.includes(C) && !f) {
          y = C, E();
          return;
        }
        A.closest("[data-spin]") && P(), A.closest("[data-auto]") && (h = !h, h && !f && P(), E());
      }), V(!1), oe(), o.push(
        a.loop.onUpdate((w) => {
          if (f && d) {
            const A = d.update(w, a.audio);
            p && !A && !T && (T = !0, re());
          }
          if (c > 0 && i) {
            g = Math.min(c, g + c * w * 0.95);
            const A = i.querySelector("[data-big-value]");
            A && (A.textContent = String(Math.round(g))), g >= c - 0.4 && (l = String(Math.round(c)), c = 0, A && (A.textContent = l));
          }
          !f && h && s === "running" && m > 0 && (m -= w, m <= 0 && P());
        }),
        a.events.on("game:start", () => {
          s === "ready" && (s = "running", n = "选择注额，旋转。", L(), E());
        }),
        a.events.on("game:restart", () => {
          ae();
        })
      );
    },
    onPause(a) {
      a.store.getState().game.status === "running" && G(a.store, { status: "paused" });
    },
    onResume(a) {
      a.store.getState().game.status === "paused" && G(a.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const a of o) a();
      o.length = 0, d?.destroy(), d = null, i?.remove(), i = null, e = null;
    }
  });
}
function Ae() {
  return `
    <p class="slots-note">娱乐积分，不能兑换，也不能充值。</p>
    <div class="slots-hud">
      <span data-credits>积分 1000</span>
      <span data-free>免费 0</span>
      <span class="slots-source" data-source>连接中…</span>
    </div>
    <div class="slots-reels" data-reels></div>
    <div class="slots-big" data-big hidden><strong>BIG WIN</strong><span data-big-value>0</span></div>
    <p class="slots-message" data-message></p>
    <div class="slots-bets">${W.map(
    (o) => `<button type="button" data-bet="${o}">${o}</button>`
  ).join("")}</div>
    <div class="slots-actions">
      <button type="button" class="slots-spin" data-spin disabled>旋转</button>
      <button type="button" data-auto>自动</button>
    </div>
  `;
}
function ee(e) {
  return e === "server" ? "服务器开奖" : e === "local" ? "本地开奖（这局连不上服务器）" : "连接中…";
}
function Me() {
  return `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function ke() {
  try {
    const e = localStorage.getItem(K);
    if (!e) return $();
    const o = JSON.parse(e);
    return !o || typeof o.credits != "number" ? $() : {
      credits: Math.max(0, Math.floor(o.credits)),
      freeSpins: Math.max(0, Math.floor(o.freeSpins ?? 0)),
      freeBet: typeof o.freeBet == "number" ? o.freeBet : 20
    };
  } catch {
    return $();
  }
}
function se(e) {
  return {
    credits: e.credits,
    freeSpins: e.freeSpins,
    freeBet: e.freeBet
  };
}
function J() {
  const e = new le(), o = Be();
  if (o?.accessToken && !o.accessToken.startsWith("local."))
    e.set({ accessToken: o.accessToken, refreshToken: o.refreshToken });
  else {
    const i = Ce();
    i && e.set({ accessToken: i });
  }
  return new fe({ baseUrl: ne(), tokens: e, timeoutMs: 2500 });
}
async function Ie() {
  const e = await J().post("/api/slots/session", {});
  return e.walletToken && localStorage.setItem(te, e.walletToken), e;
}
async function Le(e, o) {
  return J().post("/api/slots/spin", { bet: e, spinId: o });
}
async function qe() {
  const e = await J().post("/api/slots/reset", {});
  return se(e);
}
async function xe() {
  try {
    return (await fetch(`${ne()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
function ne() {
  return Te?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function Ce() {
  const e = localStorage.getItem(te);
  return e && e.startsWith("v1w.") ? e : null;
}
function Be() {
  try {
    const e = localStorage.getItem(Ee);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
export {
  $e as createGame,
  x as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
