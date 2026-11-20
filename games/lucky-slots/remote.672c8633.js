import { defineGame as ae, patchGame as G, readHighScore as U, writeHighScore as ie } from "@wgf/core";
import { TokenStore as ce, HttpClient as le } from "@wgf/net";
const fe = {
  background: "#2a140c",
  shapes: [
    { tag: "rect", attrs: { x: 48, y: 56, width: 224, height: 120, rx: 16, fill: "#1a0d08" } },
    { tag: "circle", attrs: { cx: 92, cy: 116, r: 22, fill: "#ff4d6d" } },
    { tag: "circle", attrs: { cx: 148, cy: 116, r: 22, fill: "#ffb703" } },
    { tag: "circle", attrs: { cx: 204, cy: 116, r: 22, fill: "#f6f1e7" } },
    { tag: "rect", attrs: { x: 118, y: 188, width: 84, height: 28, rx: 14, fill: "#ff5a1f" } }
  ]
}, k = {
  id: "lucky-slots",
  name: "幸运拉霸",
  description: "五轴三行、二十条线。娱乐积分，不能兑换，也不能充值。",
  howToPlay: "选择注额后旋转。百搭可替代普通图案，三个及以上夺宝送免费旋转。服务器在线时由服务器开奖，否则在这台设备上本地开奖。",
  cover: "slots",
  art: fe,
  renderer: "dom",
  controls: "pointer",
  tags: ["拉霸", "联网"]
}, R = [10, 20, 50, 100], ue = 1e3, de = 5, H = [
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
], O = [
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
], pe = {
  cherry: [5, 15, 40],
  lemon: [5, 15, 40],
  plum: [8, 20, 50],
  bell: [12, 30, 80],
  bar: [20, 50, 120],
  seven: [30, 80, 200],
  diamond: [50, 150, 400]
};
function me(e) {
  return R.includes(e);
}
function L() {
  return { credits: ue, freeSpins: 0, freeBet: 20 };
}
function ge(e) {
  return Array.from({ length: de }, () => {
    const s = Math.floor(e() * H.length);
    return [0, 1, 2].map((r) => H[(s + r) % H.length] ?? "cherry");
  });
}
function ye(e, s, r) {
  const i = s / O.length, f = [];
  O.forEach((p, y) => {
    const B = p.map((a, A) => e[A]?.[a] ?? "cherry"), g = B.find((a) => a !== "wild" && a !== "scatter");
    if (!g) return;
    let h = 0;
    for (const a of B)
      if (a === g || a === "wild") h += 1;
      else break;
    if (h < 3) return;
    const $ = pe[g], E = Math.round(($?.[h - 3] ?? 0) * i * (r ? 2 : 1));
    E > 0 && f.push({ line: y, symbol: g, count: h, payout: E });
  });
  let o = 0;
  for (const p of e)
    for (const y of p) y === "scatter" && (o += 1);
  const m = [0, 0, 0, 2, 10, 50], d = o >= 3 ? Math.round(s * (m[o] ?? 50) * (r ? 2 : 1)) : 0, l = o >= 5 ? 20 : o === 4 ? 12 : o >= 3 ? 8 : 0, b = f.reduce((p, y) => p + y.payout, 0) + d;
  return {
    grid: e,
    wins: f,
    scatterCount: o,
    scatterPayout: d,
    freeSpinsAwarded: l,
    win: b,
    bigWin: b > 0 && b >= s * 10
  };
}
function he(e, s, r) {
  if (!me(s)) return { error: "bad_bet" };
  const i = e.freeSpins > 0, f = i ? e.freeBet : s;
  if (i)
    e.freeSpins -= 1;
  else {
    if (e.credits < s) return { error: "insufficient" };
    e.credits -= s;
  }
  const o = ye(ge(r), f, i);
  return e.credits += o.win, o.freeSpinsAwarded > 0 && (e.freeSpins += o.freeSpinsAwarded, e.freeBet = f), {
    ...o,
    credits: e.credits,
    freeSpinsLeft: e.freeSpins,
    bet: f
  };
}
const Se = {}, V = {
  cherry: "🍒",
  lemon: "🍋",
  plum: "🍇",
  bell: "🔔",
  bar: "BAR",
  seven: "7",
  diamond: "💎",
  wild: "W",
  scatter: "★"
}, Y = "wgf:slots-wallet", Q = "wgf:slots-token", be = "wgf:session";
function Le() {
  let e = null;
  const s = [];
  let r = null, i = L(), f = 20, o = !1, m = !1, d = 0, l = null, b = 0, p = 0, y = 0, B = !1, g = "pending", h = !1, $ = null, E = 0, a = "", A = "", w = "ready";
  const _ = Array.from(
    { length: 5 },
    () => ["cherry", "lemon", "plum"]
  ), M = /* @__PURE__ */ new Set();
  function N(t, n) {
    n === "spin" && t.playTone({ frequency: 320, duration: 0.05, type: "square", gain: 0.03 }), n === "stop" && t.playTone({ frequency: 480, duration: 0.04, type: "triangle", gain: 0.03 }), n === "win" && t.playTone({
      frequency: 880,
      duration: 0.08,
      type: "triangle",
      gain: 0.04,
      slideTo: 1200
    }), n === "big" && t.playTone({ frequency: 440, duration: 0.2, type: "sawtooth", gain: 0.05, slideTo: 880 }), n === "scatter" && t.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function S() {
    e && G(e.store, {
      id: k.id,
      status: w,
      score: p,
      highScore: Math.max(y, p),
      message: a,
      detail: z(g),
      combo: i.freeSpins
    });
  }
  function u() {
    if (!r) return;
    r.querySelectorAll("[data-cell]").forEach((T) => {
      const P = Number(T.dataset.reel), F = Number(T.dataset.row), oe = _[P]?.[F] ?? "cherry";
      T.textContent = V[oe], T.classList.toggle("is-spin", o && P >= b), T.classList.toggle("is-win", M.has(`${P},${F}`));
    });
    const n = r.querySelector("[data-credits]"), c = r.querySelector("[data-free]"), v = r.querySelector("[data-source]"), q = r.querySelector("[data-message]");
    n && (n.textContent = `积分 ${i.credits}`), c && (c.textContent = `免费 ${i.freeSpins}`), v && (v.textContent = z(g)), q && (q.textContent = a), r.querySelectorAll("[data-bet]").forEach((T) => {
      T.classList.toggle("is-bet", Number(T.dataset.bet) === f), T.disabled = o;
    });
    const J = r.querySelector("[data-spin]"), C = r.querySelector("[data-auto]");
    J && (J.disabled = !h || o || w !== "running"), C && (C.setAttribute("aria-pressed", m ? "true" : "false"), C.disabled = w !== "running");
    let I = r.querySelector(".slots-big");
    A ? (I || (I = document.createElement("div"), I.className = "slots-big", r.appendChild(I)), I.innerHTML = `<strong>BIG WIN</strong><span>${A}</span>`) : I?.remove();
  }
  function W() {
    g === "local" && localStorage.setItem(Y, JSON.stringify(i));
  }
  function K(t) {
    i = {
      credits: t.credits,
      freeSpins: t.freeSpinsLeft,
      freeBet: t.freeSpinsLeft > 0 ? t.bet : i.freeBet
    }, W(), l = t, b = 0, d = 0.7, M.clear(), A = "", a = "旋转中…", p += t.win, e && N(e.audio, "spin"), S(), u();
  }
  async function x() {
    if (!e || o || w !== "running" || !h || g === "pending")
      return;
    if (i.freeSpins <= 0 && i.credits < f) {
      a = "积分不够了", m = !1, S(), u();
      return;
    }
    o = !0, A = "";
    const t = E, n = $ ?? ve();
    if ($ = n, u(), g === "local") {
      const c = he(i, f, Math.random);
      if (t !== E || !e) return;
      if ($ = null, "error" in c) {
        o = !1, a = c.error === "insufficient" ? "积分不够了" : "注额不合法", m = !1, S(), u();
        return;
      }
      K(c);
      return;
    }
    try {
      const c = await Ae(f, n);
      if (t !== E || !e) return;
      $ = null, K(c);
    } catch (c) {
      if (t !== E || !e) return;
      o = !1, m = !1, a = c instanceof Error ? `服务器没有确认这次旋转（${c.message}）。再点一次会用同一个编号重试，不会扣两次。` : "服务器没有确认这次旋转。再点一次会用同一个编号重试，不会扣两次。", S(), u();
    }
  }
  function ee() {
    const t = Object.keys(V);
    for (let n = 0; n < _.length; n += 1)
      _[n] = [0, 1, 2].map(
        () => t[Math.floor(Math.random() * t.length)] ?? "cherry"
      );
  }
  function te() {
    if (!l || !e) return;
    const t = b, n = l.grid[t];
    if (n && (_[t] = [n[0] ?? "cherry", n[1] ?? "lemon", n[2] ?? "plum"]), b += 1, N(e.audio, "stop"), b < 5) {
      d = 0.28, u();
      return;
    }
    o = !1, ne(l), l.win > 0 ? (a = `赢得 ${l.win}`, N(e.audio, l.bigWin ? "big" : "win")) : a = "没有中奖", l.freeSpinsAwarded > 0 && (a = `${a}，免费旋转 +${l.freeSpinsAwarded}`, N(e.audio, "scatter")), l.bigWin && (A = String(l.win), m = !1), p > y && ie(k.id, p), i.credits < R[0] && i.freeSpins === 0 && (m = !1, w = "over", a = "积分用完了", B || (B = !0, e.events.emit("game:over", {
      gameId: k.id,
      score: p,
      best: Math.max(y, p),
      isRecord: p > y
    }))), l = null, d = m ? 0.7 : 0, S(), u();
  }
  function ne(t) {
    M.clear();
    for (const n of t.wins) {
      const c = O[n.line];
      for (let v = 0; v < n.count; v += 1)
        M.add(`${v},${c?.[v] ?? 1}`);
    }
  }
  async function re() {
    if (!await ke()) {
      g = "local", h = !0, i = Te(), W(), a = "服务器不可用，这局只用这台设备上的积分。", S(), u();
      return;
    }
    try {
      const n = await Ee();
      g = "server", h = !0, i = X(n), a = "积分在服务器上，旋转前已经同步。", S(), u();
    } catch (n) {
      h = !1, a = n instanceof Error ? n.message : "开奖服务器没有就绪", S(), u();
    }
  }
  function D(t) {
    f = 20, o = !1, m = !1, l = null, b = 0, d = 0, p = 0, B = !1, A = "", M.clear(), a = h ? k.howToPlay : "正在连接开奖服务器…", w = t ? "running" : "ready", S(), u();
  }
  async function se() {
    if (E += 1, $ = null, y = U(k.id), g === "server")
      try {
        i = await $e();
      } catch (t) {
        a = t instanceof Error ? t.message : "没能重置服务器上的积分", S(), u();
        return;
      }
    else g === "local" && (localStorage.removeItem(Y), i = L(), W());
    D(!0);
  }
  return ae(k, {
    onMount(t) {
      e = t, t.container.setAttribute("data-wgf-game", "wgf-game:slots"), r = document.createElement("div"), r.className = "slots", r.innerHTML = we(), t.container.appendChild(r), y = U(k.id), r.addEventListener("click", (n) => {
        const c = n.target;
        if (!(c instanceof HTMLElement)) return;
        const v = c.closest("[data-bet]"), q = Number(v?.dataset.bet);
        if (R.includes(q) && !o) {
          f = q, u();
          return;
        }
        c.closest("[data-spin]") && x(), c.closest("[data-auto]") && (m = !m, m && !o && x(), u());
      }), D(!1), re(), s.push(
        t.loop.onUpdate((n) => {
          if (!o || !l) {
            o && !l ? (d -= n, d <= 0 && (d = 0.08, ee(), u())) : m && !o && w === "running" && d > 0 && (d -= n, d <= 0 && x());
            return;
          }
          d -= n, d <= 0 && te();
        }),
        t.events.on("game:start", () => {
          w === "ready" && (w = "running", a = "选择注额，旋转。", S(), u());
        }),
        t.events.on("game:restart", () => {
          se();
        })
      );
    },
    onPause(t) {
      t.store.getState().game.status === "running" && G(t.store, { status: "paused" });
    },
    onResume(t) {
      t.store.getState().game.status === "paused" && G(t.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const t of s) t();
      s.length = 0, r?.remove(), r = null, e = null;
    }
  });
}
function we() {
  const e = [0, 1, 2, 3, 4].map((r) => `<div class="slots-reel">${[0, 1, 2].map(
    (f) => `<div class="slots-cell" data-cell data-reel="${r}" data-row="${f}">🍒</div>`
  ).join("")}</div>`).join(""), s = R.map(
    (r) => `<button type="button" data-bet="${r}">${r}</button>`
  ).join("");
  return `
    <p class="slots-note">娱乐积分，不能兑换，也不能充值。</p>
    <div class="slots-hud">
      <span data-credits>积分 1000</span>
      <span data-free>免费 0</span>
      <span class="slots-source" data-source>连接中…</span>
    </div>
    <div class="slots-reels">${e}</div>
    <p class="slots-message" data-message></p>
    <div class="slots-bets">${s}</div>
    <div class="slots-actions">
      <button type="button" class="slots-spin" data-spin disabled>旋转</button>
      <button type="button" data-auto>自动</button>
    </div>
  `;
}
function z(e) {
  return e === "server" ? "服务器开奖" : e === "local" ? "本地开奖（这局连不上服务器）" : "连接中…";
}
function ve() {
  return `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
function Te() {
  try {
    const e = localStorage.getItem(Y);
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
function X(e) {
  return {
    credits: e.credits,
    freeSpins: e.freeSpins,
    freeBet: e.freeBet
  };
}
function j() {
  const e = new ce(), s = Ie();
  if (s?.accessToken && !s.accessToken.startsWith("local."))
    e.set({ accessToken: s.accessToken, refreshToken: s.refreshToken });
  else {
    const r = Be();
    r && e.set({ accessToken: r });
  }
  return new le({ baseUrl: Z(), tokens: e, timeoutMs: 2500 });
}
async function Ee() {
  const e = await j().post("/api/slots/session", {});
  return e.walletToken && localStorage.setItem(Q, e.walletToken), e;
}
async function Ae(e, s) {
  return j().post("/api/slots/spin", { bet: e, spinId: s });
}
async function $e() {
  const e = await j().post("/api/slots/reset", {});
  return X(e);
}
async function ke() {
  try {
    return (await fetch(`${Z()}/api/health`, { signal: AbortSignal.timeout(800) })).ok;
  } catch {
    return !1;
  }
}
function Z() {
  return Se?.VITE_API_BASE || "http://127.0.0.1:8787";
}
function Be() {
  const e = localStorage.getItem(Q);
  return e && e.startsWith("v1w.") ? e : null;
}
function Ie() {
  try {
    const e = localStorage.getItem(be);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
export {
  Le as createGame,
  k as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0"}};
