import { registerStrings as fe, defineGame as ue, patchGame as O, readHighScore as _, t as de, writeHighScore as pe } from "@wgf/core";
import { createPixiContext as he, stagePointFromContainer as ge } from "@wgf/render-pixi";
import { Graphics as ee } from "pixi.js";
const me = {
  background: "#241628",
  shapes: [
    { tag: "rect", attrs: { x: 70, y: 48, width: 52, height: 52, rx: 12, fill: "#ff4d6d" } },
    { tag: "rect", attrs: { x: 132, y: 48, width: 52, height: 52, rx: 12, fill: "#ffb703" } },
    { tag: "rect", attrs: { x: 194, y: 48, width: 52, height: 52, rx: 12, fill: "#4cc9f0" } },
    { tag: "rect", attrs: { x: 70, y: 110, width: 52, height: 52, rx: 12, fill: "#80ed99" } },
    { tag: "rect", attrs: { x: 132, y: 110, width: 52, height: 52, rx: 12, fill: "#b388ff" } },
    { tag: "rect", attrs: { x: 194, y: 110, width: 52, height: 52, rx: 12, fill: "#ff8c42" } },
    { tag: "circle", attrs: { cx: 158, cy: 136, r: 8, fill: "#fff" } }
  ]
}, P = {
  id: "match3",
  name: "消消乐",
  description: "8×8 棋盘。交换相邻方块，三连消除，连击会把分数抬上去。",
  tip: "交换相邻的两格。",
  howToPlay: "拖动或点选相邻两格交换。四个一排变成整行或整列消除，五个或 L/T 形变成炸弹。在步数用完前达到目标分。",
  copy: {
    en: {
      name: "Match 3",
      description: "An 8×8 board. Swap neighbors, match three, and climb the score.",
      howToPlay: "Drag or tap two neighboring tiles to swap. Four in a row clears a line. Five, or an L or T, makes a bomb. Reach the target before you run out of moves.",
      tip: "Swap two neighboring tiles."
    }
  },
  cover: "match3",
  art: me,
  renderer: "pixi",
  controls: "board",
  tags: ["消除", "触屏"],
  theme: { accent: "#ff4d6d", accentInk: "#2a0610", glow: "#b388ff", radius: 18, font: "sans" }
}, p = 8, C = 6, te = 22, D = 2500;
let ne = 1;
function re(i, t = "none") {
  return ne += 1, { id: ne, kind: i, special: t };
}
function H(i = Math.random) {
  const t = Array.from({ length: p }, () => Array.from({ length: p }, () => null));
  for (let o = 0; o < p; o += 1)
    for (let n = 0; n < p; n += 1) {
      let u = Math.floor(i() * C) % C, l = 0;
      for (; we(t, o, n, u) && l < C; )
        u = (u + 1) % C, l += 1;
      t[o][n] = re(u);
    }
  return t;
}
function we(i, t, o, n) {
  const u = o >= 2 && i[t][o - 1]?.kind === n && i[t][o - 2]?.kind === n, l = t >= 2 && i[t - 1][o]?.kind === n && i[t - 2][o]?.kind === n;
  return u || l;
}
function ye(i, t) {
  return Math.abs(i.r - t.r) + Math.abs(i.c - t.c) === 1;
}
function E(i, t, o) {
  const n = i[t.r], u = i[o.r];
  if (!n || !u) return;
  const l = n[t.c];
  n[t.c] = u[o.c] ?? null, u[o.c] = l ?? null;
}
function V(i) {
  const t = [];
  for (let o = 0; o < p; o += 1) {
    let n = 0;
    for (; n < p; ) {
      const u = i[o]?.[n];
      if (!u) {
        n += 1;
        continue;
      }
      let l = n + 1;
      for (; l < p && i[o]?.[l]?.kind === u.kind; ) l += 1;
      if (l - n >= 3) {
        const d = [];
        for (let h = n; h < l; h += 1) d.push({ r: o, c: h });
        t.push({ cells: d, dir: "h" });
      }
      n = l;
    }
  }
  for (let o = 0; o < p; o += 1) {
    let n = 0;
    for (; n < p; ) {
      const u = i[n]?.[o];
      if (!u) {
        n += 1;
        continue;
      }
      let l = n + 1;
      for (; l < p && i[l]?.[o]?.kind === u.kind; ) l += 1;
      if (l - n >= 3) {
        const d = [];
        for (let h = n; h < l; h += 1) d.push({ r: h, c: o });
        t.push({ cells: d, dir: "v" });
      }
      n = l;
    }
  }
  return t;
}
function G(i) {
  return `${i.r},${i.c}`;
}
function N(i) {
  const [t, o] = i.split(",").map((n) => Number(n));
  return { r: t ?? 0, c: o ?? 0 };
}
function ve(i, t) {
  const o = V(i);
  if (o.length === 0) return { cleared: [], spawned: [], score: 0 };
  const n = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set();
  for (const c of o) {
    const M = c.dir === "h" ? n : u;
    for (const g of c.cells) M.add(G(g));
  }
  const l = /* @__PURE__ */ new Set();
  for (const c of n)
    u.has(c) && l.add(c);
  for (const c of o)
    if (c.cells.length >= 5) {
      const M = c.cells[Math.floor(c.cells.length / 2)];
      M && l.add(G(M));
    }
  const d = /* @__PURE__ */ new Map();
  for (const c of o) {
    if (c.cells.length !== 4) continue;
    const g = (t && c.cells.find((m) => m.r === t.r && m.c === t.c)) ?? c.cells[1];
    !g || l.has(G(g)) || d.set(G(g), c.dir === "h" ? "row" : "col");
  }
  const h = /* @__PURE__ */ new Set(), y = [];
  for (const c of o) y.push(...c.cells);
  for (; y.length > 0; ) {
    const c = y.pop();
    if (!c) break;
    const M = G(c);
    if (h.has(M) || c.r < 0 || c.c < 0 || c.r >= p || c.c >= p) continue;
    h.add(M);
    const g = i[c.r]?.[c.c];
    if (g) {
      if (g.special === "row")
        for (let m = 0; m < p; m += 1) y.push({ r: c.r, c: m });
      else if (g.special === "col")
        for (let m = 0; m < p; m += 1) y.push({ r: m, c: c.c });
      else if (g.special === "bomb")
        for (let m = -2; m <= 2; m += 1)
          for (let T = -2; T <= 2; T += 1) y.push({ r: c.r + m, c: c.c + T });
    }
  }
  const S = [], v = /* @__PURE__ */ new Set();
  for (const c of l)
    v.add(c), S.push({ pos: N(c), special: "bomb" });
  for (const [c, M] of d)
    v.has(c) || (v.add(c), S.push({ pos: N(c), special: M }));
  const x = [];
  for (const c of h)
    v.has(c) || x.push(N(c));
  return { cleared: x, spawned: S, score: x.length * 10 + S.length * 40 };
}
function Se(i, t) {
  for (const o of t.cleared) {
    const n = i[o.r];
    n && (n[o.c] = null);
  }
  for (const o of t.spawned) {
    const n = i[o.pos.r]?.[o.pos.c];
    n && (n.special = o.special);
  }
}
function Me(i, t = Math.random) {
  const o = [];
  for (let n = 0; n < p; n += 1) {
    let u = p - 1;
    for (let d = p - 1; d >= 0; d -= 1) {
      const h = i[d]?.[n];
      if (h) {
        if (d !== u) {
          o.push({ id: h.id, to: { r: u, c: n }, fromRow: d });
          const y = i[u], S = i[d];
          y && S && (y[n] = h, S[n] = null);
        }
        u -= 1;
      }
    }
    let l = -1;
    for (let d = u; d >= 0; d -= 1) {
      const h = re(Math.floor(t() * C) % C), y = i[d];
      y && (y[n] = h), o.push({ id: h.id, to: { r: d, c: n }, fromRow: l }), l -= 1;
    }
  }
  return o;
}
function ke(i) {
  for (let t = 0; t < p; t += 1)
    for (let o = 0; o < p; o += 1)
      if (o + 1 < p && oe(i, { r: t, c: o }, { r: t, c: o + 1 }) || t + 1 < p && oe(i, { r: t, c: o }, { r: t + 1, c: o })) return !0;
  return !1;
}
function oe(i, t, o) {
  E(i, t, o);
  const n = V(i).length > 0;
  return E(i, t, o), n;
}
function B(i, t) {
  return i[t.r]?.[t.c] ?? null;
}
function xe(i, t, o, n = 0) {
  const l = Math.min(Math.max(i, 0) - 32, Math.max(t - n, 0) - 32, 480);
  return {
    cell: l / o,
    x0: (i - l) / 2,
    y0: Math.max(16 + n, (t - l) / 2)
  };
}
function be(i, t, o, n) {
  if (o.cell <= 0) return null;
  const u = Math.floor((i - o.x0) / o.cell), l = Math.floor((t - o.y0) / o.cell);
  return l < 0 || u < 0 || l >= n || u >= n ? null : { r: l, c: u };
}
function Te() {
  fe("match3", {
    zh: {
      detail: "步数 {moves} · 目标 {target}",
      goal: "达到目标分",
      out: "步数用完了"
    },
    en: {
      detail: "Moves {moves} · goal {target}",
      goal: "Target reached",
      out: "Out of moves"
    }
  });
}
const Re = [16731501, 16758531, 5032432, 8449433, 11766015, 16747586];
function qe() {
  Te();
  let i = null, t = null;
  const o = [], n = /* @__PURE__ */ new Map();
  let u = null, l = H(), d = "idle", h = 0, y = !1, S = null, v = null, x = null, c = "ready", M = te, g = 0, m = 1, T = !1, A = 0, z = null;
  function q(e, r) {
    r === "swap" && e.playTone({ frequency: 520, duration: 0.05, type: "triangle", gain: 0.035 }), r === "match" && e.playTone({
      frequency: 740,
      duration: 0.07,
      type: "triangle",
      gain: 0.04,
      slideTo: 980
    }), r === "bomb" && e.playTone({
      frequency: 220,
      duration: 0.16,
      type: "sawtooth",
      gain: 0.045,
      slideTo: 80
    }), r === "bad" && e.playTone({ frequency: 180, duration: 0.08, type: "square", gain: 0.03 }), r === "win" && e.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function F() {
    const e = i?.app.screen.width ?? 480, r = i?.app.screen.height ?? 640;
    return xe(e, r, p, 68);
  }
  function I(e, r) {
    return {
      x: r.x0 + (e.c + 0.5) * r.cell,
      y: r.y0 + (e.r + 0.5) * r.cell
    };
  }
  function X(e, r, f, s) {
    e.clear();
    const a = r * 0.78;
    e.roundRect(-a / 2, -a / 2, a, a, a * 0.22).fill(Re[f] ?? 16777215), s === "row" && e.rect(-a / 2, -a * 0.08, a, a * 0.16).fill({ color: 16777215, alpha: 0.9 }), s === "col" && e.rect(-a * 0.08, -a / 2, a * 0.16, a).fill({ color: 16777215, alpha: 0.9 }), s === "bomb" && e.circle(0, 0, a * 0.2).fill({ color: 16777215, alpha: 0.95 });
  }
  function Y(e) {
    u && (u.clear(), u.roundRect(e.x0 - 8, e.y0 - 8, e.cell * p + 16, e.cell * p + 16, 18).fill({ color: 1314328, alpha: 0.9 }));
  }
  function ie(e) {
    for (let r = 0; r < p; r += 1)
      for (let f = 0; f < p; f += 1)
        if (l[r]?.[f]?.id === e) return { r, c: f };
    return null;
  }
  function se(e, r, f) {
    let s = n.get(e.id);
    if (!s) {
      const a = new ee();
      i?.app.stage.addChild(a);
      const k = I(f, r);
      s = {
        id: e.id,
        view: a,
        kind: e.kind,
        special: e.special,
        x: k.x,
        y: k.y,
        tx: k.x,
        ty: k.y,
        scale: 1
      }, n.set(e.id, s), X(a, r.cell, e.kind, e.special);
    }
    return (s.kind !== e.kind || s.special !== e.special) && (s.kind = e.kind, s.special = e.special, X(s.view, r.cell, e.kind, e.special)), s;
  }
  function $(e) {
    const r = F();
    Y(r);
    const f = /* @__PURE__ */ new Set();
    for (let s = 0; s < p; s += 1)
      for (let a = 0; a < p; a += 1) {
        const k = l[s]?.[a];
        if (!k) continue;
        f.add(k.id);
        const w = se(k, r, { r: s, c: a }), b = I({ r: s, c: a }, r);
        w.tx = b.x, w.ty = b.y, e && (w.x = b.x, w.y = b.y, w.scale = 1);
      }
    for (const [s, a] of n)
      f.has(s) || (a.view.destroy(), n.delete(s));
  }
  function le(e, r) {
    const f = i?.app.canvas, s = t?.container, a = i?.app.screen;
    return !f || !s || !a ? { x: e, y: r } : ge(s, f, a.width, a.height, e, r);
  }
  function j(e) {
    const r = t?.container, f = i?.app.screen;
    !r || !f || (r.dataset.boardX = String(e.x0), r.dataset.boardY = String(e.y0), r.dataset.cellSize = String(e.cell), r.dataset.screenW = String(f.width), r.dataset.screenH = String(f.height));
  }
  function K(e, r) {
    const f = le(e, r), s = F();
    j(s);
    const a = be(f.x, f.y, s, p);
    return t && (t.container.dataset.hit = a ? `${a.r},${a.c}` : ""), a;
  }
  function L(e, r) {
    const f = t?.store.getState().ui.locale ?? "zh";
    return de(f, e, r);
  }
  function R(e = "", r = L("match3.detail", { moves: M, target: D })) {
    t && O(t.store, {
      id: P.id,
      status: c,
      score: g,
      highScore: Math.max(A, g),
      message: e,
      detail: r,
      combo: m
    });
  }
  function U(e) {
    if (c = "over", d = "idle", R(e), !t || T) return;
    T = !0;
    const r = Math.max(A, g);
    g > A && pe(P.id, g), t.events.emit("game:over", {
      gameId: P.id,
      score: g,
      best: r,
      isRecord: g > A && g > 0
    }), g >= D && q(t.audio, "win");
  }
  function W() {
    if (m = 1, g >= D) {
      U(L("match3.goal"));
      return;
    }
    if (M <= 0) {
      U(L("match3.out"));
      return;
    }
    ke(l) || (l = H(), $(!0), t && q(t.audio, "swap")), d = "idle", R("");
  }
  function Z() {
    if (m > 24) {
      W();
      return;
    }
    if (v = ve(l, z), z = null, v.cleared.length === 0) {
      W();
      return;
    }
    g += v.score * m, m += 1, d = "clear", h = 0, t && q(t.audio, v.spawned.some((e) => e.special === "bomb") ? "bomb" : "match"), R("");
  }
  function ce(e, r) {
    if (!t || c !== "running" || d !== "idle") return;
    if (!ye(e, r) || !B(l, e) || !B(l, r)) {
      q(t.audio, "bad");
      return;
    }
    E(l, e, r);
    const f = V(l).length > 0;
    S = [e, r], y = !f, d = "swap", h = 0, z = r, $(!1), q(t.audio, f ? "swap" : "bad"), f && (M -= 1, R(""));
  }
  function J(e) {
    l = H(), d = "idle", y = !1, S = null, v = null, x = null, M = te, g = 0, m = 1, T = !1, z = null, c = e ? "running" : "ready";
    for (const r of n.values()) r.view.destroy();
    n.clear(), $(!0), R(e ? "" : P.howToPlay);
  }
  function ae(e) {
    const r = F();
    if (j(r), Y(r), h += e, d === "swap" && h >= 0.16 && S && (y ? (E(l, S[0], S[1]), y = !1, S = null, d = "idle", $(!1)) : (S = null, Z())), d === "clear" && v && h >= 0.16) {
      const s = new Set(
        v.cleared.map((w) => B(l, w)?.id).filter((w) => w !== void 0)
      );
      Se(l, v);
      for (const w of s)
        n.get(w)?.view.destroy(), n.delete(w);
      const a = Me(l);
      v = null, d = "fall", h = 0, $(!1);
      const k = F();
      for (const w of a) {
        const b = n.get(w.id);
        if (!b || w.fromRow >= w.to.r) continue;
        const Q = I({ r: w.fromRow, c: w.to.c }, k);
        b.x = Q.x, b.y = Q.y;
      }
    }
    d === "fall" && h >= 0.22 && Z();
    const f = /* @__PURE__ */ new Set();
    if (d === "clear" && v)
      for (const s of v.cleared) {
        const a = B(l, s)?.id;
        a !== void 0 && f.add(a);
      }
    for (const s of n.values()) {
      const a = ie(s.id);
      if (a && d !== "clear") {
        const b = I(a, r);
        s.tx = b.x, s.ty = b.y;
      }
      const k = 1 - Math.exp(-14 * e);
      s.x += (s.tx - s.x) * k, s.y += (s.ty - s.y) * k;
      const w = f.has(s.id) ? 0.05 : 1;
      s.scale += (w - s.scale) * k, s.view.position.set(s.x, s.y), s.view.scale.set(s.scale);
    }
  }
  return ue(P, {
    async onPreload(e, r) {
      await e.preload([], r);
    },
    async onMount(e) {
      t = e, e.container.setAttribute("data-wgf-game", "wgf-game:match3"), e.container.style.touchAction = "none";
      const r = await he(e.container, { background: 1708576 });
      if (e.signal.aborted) {
        r.dispose();
        return;
      }
      i = r, e.track(() => r.dispose()), u = new ee(), r.app.stage.addChild(u), A = _(P.id), J(!1), o.push(
        e.loop.onInput(() => {
          if (c !== "running" || d !== "idle") return;
          const f = e.input.getPointer();
          if (e.input.wasPointerPressed() && (x = K(f.downX ?? f.x, f.downY ?? f.y), e.container.dataset.down = x ? `${x.r},${x.c}` : ""), !f.down && x) {
            const s = K(f.x, f.y), a = x;
            x = null, e.container.dataset.up = s ? `${s.r},${s.c}` : "", s && (s.r !== a.r || s.c !== a.c) && ce(a, s);
          }
        }),
        e.loop.onUpdate((f) => ae(f)),
        e.loop.onFrame(() => i?.render()),
        e.events.on("game:start", () => {
          c === "ready" && (c = "running", R(""));
        }),
        e.store.subscribe((f, s) => {
          f.ui.locale !== s.ui.locale && R();
        }),
        e.events.on("game:restart", () => {
          A = _(P.id), J(!0);
        })
      );
    },
    onPause(e) {
      e.store.getState().game.status === "running" && O(e.store, { status: "paused" });
    },
    onResume(e) {
      e.store.getState().game.status === "paused" && O(e.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const e of o) e();
      o.length = 0;
      for (const e of n.values()) e.view.destroy();
      n.clear(), u?.destroy(), u = null, i?.dispose(), i = null, t = null;
    }
  });
}
export {
  qe as createGame,
  P as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/render-pixi":"0.1.0","pixi.js":"8.23.0"}};
