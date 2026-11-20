import { defineGame as at, patchGame as H, readHighScore as Q, writeHighScore as ft } from "@wgf/core";
import { createPixiContext as ut, stagePointFromContainer as dt } from "@wgf/render-pixi";
import { Graphics as _ } from "pixi.js";
const pt = {
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
}, C = {
  id: "match3",
  name: "消消乐",
  description: "8×8 棋盘。交换相邻方块，三连消除，连击会把分数抬上去。",
  howToPlay: "拖动或点选相邻两格交换。四个一排变成整行或整列消除，五个或 L/T 形变成炸弹。在步数用完前达到目标分。",
  cover: "match3",
  art: pt,
  renderer: "pixi",
  controls: "board",
  tags: ["消除", "触屏"],
  theme: { accent: "#ff4d6d", accentInk: "#2a0610", glow: "#b388ff", radius: 18, font: "sans" }
}, p = 8, q = 6, tt = 22, L = 2500;
let et = 1;
function ot(r, e = "none") {
  return et += 1, { id: et, kind: r, special: e };
}
function O(r = Math.random) {
  const e = Array.from({ length: p }, () => Array.from({ length: p }, () => null));
  for (let o = 0; o < p; o += 1)
    for (let n = 0; n < p; n += 1) {
      let f = Math.floor(r() * q) % q, c = 0;
      for (; ht(e, o, n, f) && c < q; )
        f = (f + 1) % q, c += 1;
      e[o][n] = ot(f);
    }
  return e;
}
function ht(r, e, o, n) {
  const f = o >= 2 && r[e][o - 1]?.kind === n && r[e][o - 2]?.kind === n, c = e >= 2 && r[e - 1][o]?.kind === n && r[e - 2][o]?.kind === n;
  return f || c;
}
function gt(r, e) {
  return Math.abs(r.r - e.r) + Math.abs(r.c - e.c) === 1;
}
function F(r, e, o) {
  const n = r[e.r], f = r[o.r];
  if (!n || !f) return;
  const c = n[e.c];
  n[e.c] = f[o.c] ?? null, f[o.c] = c ?? null;
}
function N(r) {
  const e = [];
  for (let o = 0; o < p; o += 1) {
    let n = 0;
    for (; n < p; ) {
      const f = r[o]?.[n];
      if (!f) {
        n += 1;
        continue;
      }
      let c = n + 1;
      for (; c < p && r[o]?.[c]?.kind === f.kind; ) c += 1;
      if (c - n >= 3) {
        const d = [];
        for (let h = n; h < c; h += 1) d.push({ r: o, c: h });
        e.push({ cells: d, dir: "h" });
      }
      n = c;
    }
  }
  for (let o = 0; o < p; o += 1) {
    let n = 0;
    for (; n < p; ) {
      const f = r[n]?.[o];
      if (!f) {
        n += 1;
        continue;
      }
      let c = n + 1;
      for (; c < p && r[c]?.[o]?.kind === f.kind; ) c += 1;
      if (c - n >= 3) {
        const d = [];
        for (let h = n; h < c; h += 1) d.push({ r: h, c: o });
        e.push({ cells: d, dir: "v" });
      }
      n = c;
    }
  }
  return e;
}
function G(r) {
  return `${r.r},${r.c}`;
}
function D(r) {
  const [e, o] = r.split(",").map((n) => Number(n));
  return { r: e ?? 0, c: o ?? 0 };
}
function wt(r, e) {
  const o = N(r);
  if (o.length === 0) return { cleared: [], spawned: [], score: 0 };
  const n = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set();
  for (const l of o) {
    const x = l.dir === "h" ? n : f;
    for (const g of l.cells) x.add(G(g));
  }
  const c = /* @__PURE__ */ new Set();
  for (const l of n)
    f.has(l) && c.add(l);
  for (const l of o)
    if (l.cells.length >= 5) {
      const x = l.cells[Math.floor(l.cells.length / 2)];
      x && c.add(G(x));
    }
  const d = /* @__PURE__ */ new Map();
  for (const l of o) {
    if (l.cells.length !== 4) continue;
    const g = (e && l.cells.find((w) => w.r === e.r && w.c === e.c)) ?? l.cells[1];
    !g || c.has(G(g)) || d.set(G(g), l.dir === "h" ? "row" : "col");
  }
  const h = /* @__PURE__ */ new Set(), y = [];
  for (const l of o) y.push(...l.cells);
  for (; y.length > 0; ) {
    const l = y.pop();
    if (!l) break;
    const x = G(l);
    if (h.has(x) || l.r < 0 || l.c < 0 || l.r >= p || l.c >= p) continue;
    h.add(x);
    const g = r[l.r]?.[l.c];
    if (g) {
      if (g.special === "row")
        for (let w = 0; w < p; w += 1) y.push({ r: l.r, c: w });
      else if (g.special === "col")
        for (let w = 0; w < p; w += 1) y.push({ r: w, c: l.c });
      else if (g.special === "bomb")
        for (let w = -2; w <= 2; w += 1)
          for (let R = -2; R <= 2; R += 1) y.push({ r: l.r + w, c: l.c + R });
    }
  }
  const S = [], v = /* @__PURE__ */ new Set();
  for (const l of c)
    v.add(l), S.push({ pos: D(l), special: "bomb" });
  for (const [l, x] of d)
    v.has(l) || (v.add(l), S.push({ pos: D(l), special: x }));
  const M = [];
  for (const l of h)
    v.has(l) || M.push(D(l));
  return { cleared: M, spawned: S, score: M.length * 10 + S.length * 40 };
}
function mt(r, e) {
  for (const o of e.cleared) {
    const n = r[o.r];
    n && (n[o.c] = null);
  }
  for (const o of e.spawned) {
    const n = r[o.pos.r]?.[o.pos.c];
    n && (n.special = o.special);
  }
}
function yt(r, e = Math.random) {
  const o = [];
  for (let n = 0; n < p; n += 1) {
    let f = p - 1;
    for (let d = p - 1; d >= 0; d -= 1) {
      const h = r[d]?.[n];
      if (h) {
        if (d !== f) {
          o.push({ id: h.id, to: { r: f, c: n }, fromRow: d });
          const y = r[f], S = r[d];
          y && S && (y[n] = h, S[n] = null);
        }
        f -= 1;
      }
    }
    let c = -1;
    for (let d = f; d >= 0; d -= 1) {
      const h = ot(Math.floor(e() * q) % q), y = r[d];
      y && (y[n] = h), o.push({ id: h.id, to: { r: d, c: n }, fromRow: c }), c -= 1;
    }
  }
  return o;
}
function vt(r) {
  for (let e = 0; e < p; e += 1)
    for (let o = 0; o < p; o += 1)
      if (o + 1 < p && nt(r, { r: e, c: o }, { r: e, c: o + 1 }) || e + 1 < p && nt(r, { r: e, c: o }, { r: e + 1, c: o })) return !0;
  return !1;
}
function nt(r, e, o) {
  F(r, e, o);
  const n = N(r).length > 0;
  return F(r, e, o), n;
}
function z(r, e) {
  return r[e.r]?.[e.c] ?? null;
}
function St(r, e, o, n = 0) {
  const c = Math.min(Math.max(r, 0) - 32, Math.max(e - n, 0) - 32, 480);
  return {
    cell: c / o,
    x0: (r - c) / 2,
    y0: Math.max(16 + n, (e - c) / 2)
  };
}
function xt(r, e, o, n) {
  if (o.cell <= 0) return null;
  const f = Math.floor((r - o.x0) / o.cell), c = Math.floor((e - o.y0) / o.cell);
  return c < 0 || f < 0 || c >= n || f >= n ? null : { r: c, c: f };
}
const kt = [16731501, 16758531, 5032432, 8449433, 11766015, 16747586];
function Ct() {
  let r = null, e = null;
  const o = [], n = /* @__PURE__ */ new Map();
  let f = null, c = O(), d = "idle", h = 0, y = !1, S = null, v = null, M = null, l = "ready", x = tt, g = 0, w = 1, R = !1, $ = 0, I = null;
  function A(t, s) {
    s === "swap" && t.playTone({ frequency: 520, duration: 0.05, type: "triangle", gain: 0.035 }), s === "match" && t.playTone({
      frequency: 740,
      duration: 0.07,
      type: "triangle",
      gain: 0.04,
      slideTo: 980
    }), s === "bomb" && t.playTone({
      frequency: 220,
      duration: 0.16,
      type: "sawtooth",
      gain: 0.045,
      slideTo: 80
    }), s === "bad" && t.playTone({ frequency: 180, duration: 0.08, type: "square", gain: 0.03 }), s === "win" && t.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function B() {
    const t = r?.app.screen.width ?? 480, s = r?.app.screen.height ?? 640;
    return St(t, s, p, 68);
  }
  function E(t, s) {
    return {
      x: s.x0 + (t.c + 0.5) * s.cell,
      y: s.y0 + (t.r + 0.5) * s.cell
    };
  }
  function V(t, s, u, i) {
    t.clear();
    const a = s * 0.78;
    t.roundRect(-a / 2, -a / 2, a, a, a * 0.22).fill(kt[u] ?? 16777215), i === "row" && t.rect(-a / 2, -a * 0.08, a, a * 0.16).fill({ color: 16777215, alpha: 0.9 }), i === "col" && t.rect(-a * 0.08, -a / 2, a * 0.16, a).fill({ color: 16777215, alpha: 0.9 }), i === "bomb" && t.circle(0, 0, a * 0.2).fill({ color: 16777215, alpha: 0.95 });
  }
  function X(t) {
    f && (f.clear(), f.roundRect(t.x0 - 8, t.y0 - 8, t.cell * p + 16, t.cell * p + 16, 18).fill({ color: 1314328, alpha: 0.9 }));
  }
  function rt(t) {
    for (let s = 0; s < p; s += 1)
      for (let u = 0; u < p; u += 1)
        if (c[s]?.[u]?.id === t) return { r: s, c: u };
    return null;
  }
  function st(t, s, u) {
    let i = n.get(t.id);
    if (!i) {
      const a = new _();
      r?.app.stage.addChild(a);
      const k = E(u, s);
      i = {
        id: t.id,
        view: a,
        kind: t.kind,
        special: t.special,
        x: k.x,
        y: k.y,
        tx: k.x,
        ty: k.y,
        scale: 1
      }, n.set(t.id, i), V(a, s.cell, t.kind, t.special);
    }
    return (i.kind !== t.kind || i.special !== t.special) && (i.kind = t.kind, i.special = t.special, V(i.view, s.cell, t.kind, t.special)), i;
  }
  function P(t) {
    const s = B();
    X(s);
    const u = /* @__PURE__ */ new Set();
    for (let i = 0; i < p; i += 1)
      for (let a = 0; a < p; a += 1) {
        const k = c[i]?.[a];
        if (!k) continue;
        u.add(k.id);
        const m = st(k, s, { r: i, c: a }), T = E({ r: i, c: a }, s);
        m.tx = T.x, m.ty = T.y, t && (m.x = T.x, m.y = T.y, m.scale = 1);
      }
    for (const [i, a] of n)
      u.has(i) || (a.view.destroy(), n.delete(i));
  }
  function it(t, s) {
    const u = r?.app.canvas, i = e?.container, a = r?.app.screen;
    return !u || !i || !a ? { x: t, y: s } : dt(i, u, a.width, a.height, t, s);
  }
  function Y(t) {
    const s = e?.container, u = r?.app.screen;
    !s || !u || (s.dataset.boardX = String(t.x0), s.dataset.boardY = String(t.y0), s.dataset.cellSize = String(t.cell), s.dataset.screenW = String(u.width), s.dataset.screenH = String(u.height));
  }
  function j(t, s) {
    const u = it(t, s), i = B();
    Y(i);
    const a = xt(u.x, u.y, i, p);
    return e && (e.container.dataset.hit = a ? `${a.r},${a.c}` : ""), a;
  }
  function b(t = "", s = `步数 ${x} · 目标 ${L}`) {
    e && H(e.store, {
      id: C.id,
      status: l,
      score: g,
      highScore: Math.max($, g),
      message: t,
      detail: s,
      combo: w
    });
  }
  function K(t) {
    if (l = "over", d = "idle", b(t), !e || R) return;
    R = !0;
    const s = Math.max($, g);
    g > $ && ft(C.id, g), e.events.emit("game:over", {
      gameId: C.id,
      score: g,
      best: s,
      isRecord: g > $ && g > 0
    }), g >= L && A(e.audio, "win");
  }
  function U() {
    if (w = 1, g >= L) {
      K("达到目标分");
      return;
    }
    if (x <= 0) {
      K("步数用完了");
      return;
    }
    vt(c) || (c = O(), P(!0), e && A(e.audio, "swap")), d = "idle", b("");
  }
  function W() {
    if (w > 24) {
      U();
      return;
    }
    if (v = wt(c, I), I = null, v.cleared.length === 0) {
      U();
      return;
    }
    g += v.score * w, w += 1, d = "clear", h = 0, e && A(e.audio, v.spawned.some((t) => t.special === "bomb") ? "bomb" : "match"), b("");
  }
  function ct(t, s) {
    if (!e || l !== "running" || d !== "idle") return;
    if (!gt(t, s) || !z(c, t) || !z(c, s)) {
      A(e.audio, "bad");
      return;
    }
    F(c, t, s);
    const u = N(c).length > 0;
    S = [t, s], y = !u, d = "swap", h = 0, I = s, P(!1), A(e.audio, u ? "swap" : "bad"), u && (x -= 1, b(""));
  }
  function Z(t) {
    c = O(), d = "idle", y = !1, S = null, v = null, M = null, x = tt, g = 0, w = 1, R = !1, I = null, l = t ? "running" : "ready";
    for (const s of n.values()) s.view.destroy();
    n.clear(), P(!0), b(t ? "" : C.howToPlay);
  }
  function lt(t) {
    const s = B();
    if (Y(s), X(s), h += t, d === "swap" && h >= 0.16 && S && (y ? (F(c, S[0], S[1]), y = !1, S = null, d = "idle", P(!1)) : (S = null, W())), d === "clear" && v && h >= 0.16) {
      const i = new Set(
        v.cleared.map((m) => z(c, m)?.id).filter((m) => m !== void 0)
      );
      mt(c, v);
      for (const m of i)
        n.get(m)?.view.destroy(), n.delete(m);
      const a = yt(c);
      v = null, d = "fall", h = 0, P(!1);
      const k = B();
      for (const m of a) {
        const T = n.get(m.id);
        if (!T || m.fromRow >= m.to.r) continue;
        const J = E({ r: m.fromRow, c: m.to.c }, k);
        T.x = J.x, T.y = J.y;
      }
    }
    d === "fall" && h >= 0.22 && W();
    const u = /* @__PURE__ */ new Set();
    if (d === "clear" && v)
      for (const i of v.cleared) {
        const a = z(c, i)?.id;
        a !== void 0 && u.add(a);
      }
    for (const i of n.values()) {
      const a = rt(i.id);
      if (a && d !== "clear") {
        const T = E(a, s);
        i.tx = T.x, i.ty = T.y;
      }
      const k = 1 - Math.exp(-14 * t);
      i.x += (i.tx - i.x) * k, i.y += (i.ty - i.y) * k;
      const m = u.has(i.id) ? 0.05 : 1;
      i.scale += (m - i.scale) * k, i.view.position.set(i.x, i.y), i.view.scale.set(i.scale);
    }
  }
  return at(C, {
    async onMount(t) {
      e = t, t.container.setAttribute("data-wgf-game", "wgf-game:match3"), t.container.style.touchAction = "none";
      const s = await ut(t.container, { background: 1708576 });
      if (t.signal.aborted) {
        s.dispose();
        return;
      }
      r = s, t.track(() => s.dispose()), f = new _(), s.app.stage.addChild(f), $ = Q(C.id), Z(!1), o.push(
        t.loop.onInput(() => {
          if (l !== "running" || d !== "idle") return;
          const u = t.input.getPointer();
          if (t.input.wasPointerPressed() && (M = j(u.downX ?? u.x, u.downY ?? u.y), t.container.dataset.down = M ? `${M.r},${M.c}` : ""), !u.down && M) {
            const i = j(u.x, u.y), a = M;
            M = null, t.container.dataset.up = i ? `${i.r},${i.c}` : "", i && (i.r !== a.r || i.c !== a.c) && ct(a, i);
          }
        }),
        t.loop.onUpdate((u) => lt(u)),
        t.loop.onFrame(() => r?.render()),
        t.events.on("game:start", () => {
          l === "ready" && (l = "running", b(""));
        }),
        t.events.on("game:restart", () => {
          $ = Q(C.id), Z(!0);
        })
      );
    },
    onPause(t) {
      t.store.getState().game.status === "running" && H(t.store, { status: "paused" });
    },
    onResume(t) {
      t.store.getState().game.status === "paused" && H(t.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const t of o) t();
      o.length = 0;
      for (const t of n.values()) t.view.destroy();
      n.clear(), f?.destroy(), f = null, r?.dispose(), r = null, e = null;
    }
  });
}
export {
  Ct as createGame,
  C as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/render-pixi":"0.1.0","pixi.js":"8.23.0"}};
