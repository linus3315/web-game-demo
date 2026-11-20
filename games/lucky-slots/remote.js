import { defineGame as Z, patchGame as C, readHighScore as j, writeHighScore as Q } from "@wgf/core";
import { TokenStore as X, HttpClient as ee } from "@wgf/net";
const te = {
  background: "#2a140c",
  shapes: [
    { tag: "rect", attrs: { x: 48, y: 56, width: 224, height: 120, rx: 16, fill: "#1a0d08" } },
    { tag: "circle", attrs: { cx: 92, cy: 116, r: 22, fill: "#ff4d6d" } },
    { tag: "circle", attrs: { cx: 148, cy: 116, r: 22, fill: "#ffb703" } },
    { tag: "circle", attrs: { cx: 204, cy: 116, r: 22, fill: "#f6f1e7" } },
    { tag: "rect", attrs: { x: 118, y: 188, width: 84, height: 28, rx: 14, fill: "#ff5a1f" } }
  ]
}, E = {
  id: "lucky-slots",
  name: "幸运拉霸",
  description: "五轴三行、二十条线。娱乐积分，不能兑换，也不能充值。",
  howToPlay: "选择注额后旋转。百搭可替代普通图案，三个及以上夺宝送免费旋转。服务器在线时由服务器开奖，否则在这台设备上本地开奖。",
  cover: "slots",
  art: te,
  renderer: "dom",
  controls: "pointer",
  tags: ["拉霸", "联网"]
}, _ = [10, 20, 50, 100], ne = 1e3, re = 5, R = [
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
], W = [
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
], se = {
  cherry: [5, 15, 40],
  lemon: [5, 15, 40],
  plum: [8, 20, 50],
  bell: [12, 30, 80],
  bar: [20, 50, 120],
  seven: [30, 80, 200],
  diamond: [50, 150, 400]
};
function oe(e) {
  return _.includes(e);
}
function L() {
  return { credits: ne, freeSpins: 0, freeBet: 20 };
}
function ae(e) {
  return Array.from({ length: re }, () => {
    const s = Math.floor(e() * R.length);
    return [0, 1, 2].map((n) => R[(s + n) % R.length] ?? "cherry");
  });
}
function ie(e, s, n) {
  const a = s / W.length, l = [];
  W.forEach((u, p) => {
    const $ = u.map((g, A) => e[A]?.[g] ?? "cherry"), w = $.find((g) => g !== "wild" && g !== "scatter");
    if (!w) return;
    let c = 0;
    for (const g of $)
      if (g === w || g === "wild") c += 1;
      else break;
    if (c < 3) return;
    const T = se[w], m = Math.round((T?.[c - 3] ?? 0) * a * (n ? 2 : 1));
    m > 0 && l.push({ line: p, symbol: w, count: c, payout: m });
  });
  let o = 0;
  for (const u of e)
    for (const p of u) p === "scatter" && (o += 1);
  const d = [0, 0, 0, 2, 10, 50], f = o >= 3 ? Math.round(s * (d[o] ?? 50) * (n ? 2 : 1)) : 0, i = o >= 5 ? 20 : o === 4 ? 12 : o >= 3 ? 8 : 0, h = l.reduce((u, p) => u + p.payout, 0) + f;
  return {
    grid: e,
    wins: l,
    scatterCount: o,
    scatterPayout: f,
    freeSpinsAwarded: i,
    win: h,
    bigWin: h > 0 && h >= s * 10
  };
}
function ce(e, s, n) {
  if (!oe(s)) return { error: "bad_bet" };
  const a = e.freeSpins > 0, l = a ? e.freeBet : s;
  if (a)
    e.freeSpins -= 1;
  else {
    if (e.credits < s) return { error: "insufficient" };
    e.credits -= s;
  }
  const o = ie(ae(n), l, a);
  return e.credits += o.win, o.freeSpinsAwarded > 0 && (e.freeSpins += o.freeSpinsAwarded, e.freeBet = l), {
    ...o,
    credits: e.credits,
    freeSpinsLeft: e.freeSpins,
    bet: l
  };
}
const le = {}, D = {
  cherry: "🍒",
  lemon: "🍋",
  plum: "🍇",
  bell: "🔔",
  bar: "BAR",
  seven: "7",
  diamond: "💎",
  wild: "W",
  scatter: "★"
}, P = "wgf:slots-wallet", J = "wgf:slots-player", fe = "wgf:session";
function Se() {
  let e = null;
  const s = [];
  let n = null, a = L(), l = 20, o = !1, d = !1, f = 0, i = null, h = 0, u = 0, p = 0, $ = !1, w = "local", c = "", T = "", m = "ready";
  const g = Array.from(
    { length: 5 },
    () => ["cherry", "lemon", "plum"]
  ), A = /* @__PURE__ */ new Set();
  function B(t, r) {
    r === "spin" && t.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), r === "stop" && t.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), r === "win" && t.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), r === "big" && t.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), r === "scatter" && t.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function I() {
    e && C(e.store, {
      id: E.id,
      status: m,
      score: u,
      highScore: Math.max(p, u),
      message: c,
      detail: w === "server" ? "服务器开奖" : "本地开奖",
      combo: a.freeSpins
    });
  }
  function y() {
    if (!n) return;
    n.querySelectorAll("[data-cell]").forEach((v) => {
      const N = Number(v.dataset.reel), Y = Number(v.dataset.row), V = g[N]?.[Y] ?? "cherry";
      v.textContent = D[V], v.classList.toggle("is-spin", o && N >= h), v.classList.toggle("is-win", A.has(`${N},${Y}`));
    });
    const r = n.querySelector("[data-credits]"), b = n.querySelector("[data-free]"), S = n.querySelector("[data-source]"), q = n.querySelector("[data-message]");
    r && (r.textContent = `积分 ${a.credits}`), b && (b.textContent = `免费 ${a.freeSpins}`), S && (S.textContent = w === "server" ? "服务器开奖" : "本地开奖"), q && (q.textContent = c), n.querySelectorAll("[data-bet]").forEach((v) => {
      v.classList.toggle("is-bet", Number(v.dataset.bet) === l), v.disabled = o;
    });
    const O = n.querySelector("[data-spin]"), x = n.querySelector("[data-auto]");
    O && (O.disabled = o || m !== "running"), x && (x.setAttribute("aria-pressed", d ? "true" : "false"), x.disabled = m !== "running");
    let M = n.querySelector(".slots-big");
    T ? (M || (M = document.createElement("div"), M.className = "slots-big", n.appendChild(M)), M.innerHTML = `<strong>BIG WIN</strong><span>${T}</span>`) : M?.remove();
  }
  function K() {
    localStorage.setItem(P, JSON.stringify(a));
  }
  function G(t, r) {
    w = r, a = {
      credits: t.credits,
      freeSpins: t.freeSpinsLeft,
      freeBet: t.freeSpinsLeft > 0 ? t.bet : a.freeBet
    }, K(), i = t, h = 0, f = 0.7, A.clear(), T = "", c = "旋转中…", u += t.win, e && B(e.audio, "spin"), I(), y();
  }
  async function k() {
    if (!e || o || m !== "running") return;
    if (a.freeSpins <= 0 && a.credits < l) {
      c = "积分不够了", d = !1, I(), y();
      return;
    }
    o = !0, T = "", y();
    const t = await pe(l);
    if (!e) return;
    if (t) {
      G(t, "server");
      return;
    }
    const r = ce(a, l, Math.random);
    if ("error" in r) {
      o = !1, c = r.error === "insufficient" ? "积分不够了" : "注额不合法", d = !1, I(), y();
      return;
    }
    G(r, "local");
  }
  function U() {
    const t = Object.keys(D);
    for (let r = 0; r < g.length; r += 1)
      g[r] = [0, 1, 2].map(
        () => t[Math.floor(Math.random() * t.length)] ?? "cherry"
      );
  }
  function z() {
    if (!i || !e) return;
    const t = h, r = i.grid[t];
    if (r && (g[t] = [r[0] ?? "cherry", r[1] ?? "lemon", r[2] ?? "plum"]), h += 1, B(e.audio, "stop"), h < 5) {
      f = 0.28, y();
      return;
    }
    o = !1, F(i), i.win > 0 ? (c = `赢得 ${i.win}`, B(e.audio, i.bigWin ? "big" : "win")) : c = "没有中奖", i.freeSpinsAwarded > 0 && (c = `${c}，免费旋转 +${i.freeSpinsAwarded}`, B(e.audio, "scatter")), i.bigWin && (T = String(i.win), d = !1), u > p && Q(E.id, u), a.credits < _[0] && a.freeSpins === 0 && (d = !1, m = "over", c = "积分用完了", $ || ($ = !0, e.events.emit("game:over", {
      gameId: E.id,
      score: u,
      best: Math.max(p, u),
      isRecord: u > p
    }))), i = null, f = d ? 0.7 : 0, I(), y();
  }
  function F(t) {
    A.clear();
    for (const r of t.wins) {
      const b = W[r.line];
      for (let S = 0; S < r.count; S += 1)
        A.add(`${S},${b?.[S] ?? 1}`);
    }
  }
  function H(t) {
    a = de(), l = 20, o = !1, d = !1, i = null, h = 0, f = 0, u = 0, $ = !1, T = "", A.clear(), c = E.howToPlay, m = t ? "running" : "ready", I(), y();
  }
  return Z(E, {
    onMount(t) {
      e = t, t.container.setAttribute("data-wgf-game", "wgf-game:slots"), n = document.createElement("div"), n.className = "slots", n.innerHTML = ue(), t.container.appendChild(n), p = j(E.id), n.addEventListener("click", (r) => {
        const b = r.target;
        if (!(b instanceof HTMLElement)) return;
        const S = b.closest("[data-bet]"), q = Number(S?.dataset.bet);
        if (_.includes(q) && !o) {
          l = q, y();
          return;
        }
        b.closest("[data-spin]") && k(), b.closest("[data-auto]") && (d = !d, d && !o && k(), y());
      }), H(!1), s.push(
        t.loop.onUpdate((r) => {
          if (!o || !i) {
            o && !i ? (f -= r, f <= 0 && (f = 0.08, U(), y())) : d && !o && m === "running" && f > 0 && (f -= r, f <= 0 && k());
            return;
          }
          f -= r, f <= 0 && z();
        }),
        t.events.on("game:start", () => {
          m === "ready" && (m = "running", c = "选择注额，旋转。", I(), y());
        }),
        t.events.on("game:restart", () => {
          p = j(E.id), localStorage.removeItem(P), H(!0);
        })
      );
    },
    onPause(t) {
      t.store.getState().game.status === "running" && C(t.store, { status: "paused" });
    },
    onResume(t) {
      t.store.getState().game.status === "paused" && C(t.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const t of s) t();
      s.length = 0, n?.remove(), n = null, e = null;
    }
  });
}
function ue() {
  const e = [0, 1, 2, 3, 4].map((n) => `<div class="slots-reel">${[0, 1, 2].map(
    (l) => `<div class="slots-cell" data-cell data-reel="${n}" data-row="${l}">🍒</div>`
  ).join("")}</div>`).join(""), s = _.map(
    (n) => `<button type="button" data-bet="${n}">${n}</button>`
  ).join("");
  return `
    <p class="slots-note">娱乐积分，不能兑换，也不能充值。</p>
    <div class="slots-hud">
      <span data-credits>积分 1000</span>
      <span data-free>免费 0</span>
      <span class="slots-source" data-source>本地开奖</span>
    </div>
    <div class="slots-reels">${e}</div>
    <p class="slots-message" data-message></p>
    <div class="slots-bets">${s}</div>
    <div class="slots-actions">
      <button type="button" class="slots-spin" data-spin>旋转</button>
      <button type="button" data-auto>自动</button>
    </div>
  `;
}
function de() {
  try {
    const e = localStorage.getItem(P);
    if (!e) return L();
    const s = JSON.parse(e);
    return !s || typeof s.credits != "number" ? L() : {
      credits: Math.max(0, Math.floor(s.credits)),
      freeSpins: Math.max(0, Math.floor(s.freeSpins ?? 0)),
      freeBet: typeof s.freeBet == "number" ? s.freeBet : 20
    };
  } catch {
    return L();
  }
}
async function pe(e) {
  const s = new X(), n = ye();
  n?.accessToken && !n.accessToken.startsWith("local.") && s.set({ accessToken: n.accessToken, refreshToken: n.refreshToken });
  const a = new ee({
    baseUrl: me(),
    tokens: s,
    timeoutMs: 2500
  });
  try {
    return await a.post("/api/slots/spin", {
      bet: e,
      playerId: ge()
    });
  } catch {
    return null;
  }
}
function me() {
  return le?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function ge() {
  const e = localStorage.getItem(J);
  if (e && /^[a-zA-Z0-9_-]{8,40}$/.test(e)) return e;
  const s = `p_${Math.random().toString(36).slice(2, 12)}${Date.now().toString(36)}`.slice(
    0,
    40
  );
  return localStorage.setItem(J, s), s;
}
function ye() {
  try {
    const e = localStorage.getItem(fe);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
export {
  Se as createGame,
  E as manifest
};
