import { registerStrings as ue, defineGame as de, patchGame as H, readHighScore as ee, t as pe, writeHighScore as he } from "@wgf/core";
import { createPixiContext as ge, stagePointFromContainer as me } from "@wgf/render-pixi";
import { Graphics as te } from "pixi.js";
const we = {
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
  art: we,
  renderer: "pixi",
  controls: "board",
  tags: ["消除", "触屏"],
  theme: { accent: "#ff4d6d", accentInk: "#2a0610", glow: "#b388ff", radius: 18, font: "sans" }
}, p = 8, A = 6, ne = 22, N = 2500;
let oe = 1;
function se(l, t = "none") {
  return oe += 1, { id: oe, kind: l, special: t };
}
function V(l = Math.random) {
  const t = Array.from({ length: p }, () => Array.from({ length: p }, () => null));
  for (let o = 0; o < p; o += 1)
    for (let n = 0; n < p; n += 1) {
      let d = Math.floor(l() * A) % A, c = 0;
      for (; ye(t, o, n, d) && c < A; )
        d = (d + 1) % A, c += 1;
      t[o][n] = se(d);
    }
  return t;
}
function ye(l, t, o, n) {
  const d = o >= 2 && l[t][o - 1]?.kind === n && l[t][o - 2]?.kind === n, c = t >= 2 && l[t - 1][o]?.kind === n && l[t - 2][o]?.kind === n;
  return d || c;
}
function ve(l, t) {
  return Math.abs(l.r - t.r) + Math.abs(l.c - t.c) === 1;
}
function B(l, t, o) {
  const n = l[t.r], d = l[o.r];
  if (!n || !d) return;
  const c = n[t.c];
  n[t.c] = d[o.c] ?? null, d[o.c] = c ?? null;
}
function Y(l) {
  const t = [];
  for (let o = 0; o < p; o += 1) {
    let n = 0;
    for (; n < p; ) {
      const d = l[o]?.[n];
      if (!d) {
        n += 1;
        continue;
      }
      let c = n + 1;
      for (; c < p && l[o]?.[c]?.kind === d.kind; ) c += 1;
      if (c - n >= 3) {
        const u = [];
        for (let h = n; h < c; h += 1) u.push({ r: o, c: h });
        t.push({ cells: u, dir: "h" });
      }
      n = c;
    }
  }
  for (let o = 0; o < p; o += 1) {
    let n = 0;
    for (; n < p; ) {
      const d = l[n]?.[o];
      if (!d) {
        n += 1;
        continue;
      }
      let c = n + 1;
      for (; c < p && l[c]?.[o]?.kind === d.kind; ) c += 1;
      if (c - n >= 3) {
        const u = [];
        for (let h = n; h < c; h += 1) u.push({ r: h, c: o });
        t.push({ cells: u, dir: "v" });
      }
      n = c;
    }
  }
  return t;
}
function z(l) {
  return `${l.r},${l.c}`;
}
function X(l) {
  const [t, o] = l.split(",").map((n) => Number(n));
  return { r: t ?? 0, c: o ?? 0 };
}
function Se(l, t) {
  const o = Y(l);
  if (o.length === 0) return { cleared: [], spawned: [], score: 0 };
  const n = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set();
  for (const i of o) {
    const M = i.dir === "h" ? n : d;
    for (const g of i.cells) M.add(z(g));
  }
  const c = /* @__PURE__ */ new Set();
  for (const i of n)
    d.has(i) && c.add(i);
  for (const i of o)
    if (i.cells.length >= 5) {
      const M = i.cells[Math.floor(i.cells.length / 2)];
      M && c.add(z(M));
    }
  const u = /* @__PURE__ */ new Map();
  for (const i of o) {
    if (i.cells.length !== 4) continue;
    const g = (t && i.cells.find((m) => m.r === t.r && m.c === t.c)) ?? i.cells[1];
    !g || c.has(z(g)) || u.set(z(g), i.dir === "h" ? "row" : "col");
  }
  const h = /* @__PURE__ */ new Set(), v = [];
  for (const i of o) v.push(...i.cells);
  for (; v.length > 0; ) {
    const i = v.pop();
    if (!i) break;
    const M = z(i);
    if (h.has(M) || i.r < 0 || i.c < 0 || i.r >= p || i.c >= p) continue;
    h.add(M);
    const g = l[i.r]?.[i.c];
    if (g) {
      if (g.special === "row")
        for (let m = 0; m < p; m += 1) v.push({ r: i.r, c: m });
      else if (g.special === "col")
        for (let m = 0; m < p; m += 1) v.push({ r: m, c: i.c });
      else if (g.special === "bomb")
        for (let m = -2; m <= 2; m += 1)
          for (let T = -2; T <= 2; T += 1) v.push({ r: i.r + m, c: i.c + T });
    }
  }
  const S = [], y = /* @__PURE__ */ new Set();
  for (const i of c)
    y.add(i), S.push({ pos: X(i), special: "bomb" });
  for (const [i, M] of u)
    y.has(i) || (y.add(i), S.push({ pos: X(i), special: M }));
  const k = [];
  for (const i of h)
    y.has(i) || k.push(X(i));
  return { cleared: k, spawned: S, score: k.length * 10 + S.length * 40 };
}
function Me(l, t) {
  for (const o of t.cleared) {
    const n = l[o.r];
    n && (n[o.c] = null);
  }
  for (const o of t.spawned) {
    const n = l[o.pos.r]?.[o.pos.c];
    n && (n.special = o.special);
  }
}
function xe(l, t = Math.random) {
  const o = [];
  for (let n = 0; n < p; n += 1) {
    let d = p - 1;
    for (let u = p - 1; u >= 0; u -= 1) {
      const h = l[u]?.[n];
      if (h) {
        if (u !== d) {
          o.push({ id: h.id, to: { r: d, c: n }, fromRow: u });
          const v = l[d], S = l[u];
          v && S && (v[n] = h, S[n] = null);
        }
        d -= 1;
      }
    }
    let c = -1;
    for (let u = d; u >= 0; u -= 1) {
      const h = se(Math.floor(t() * A) % A), v = l[u];
      v && (v[n] = h), o.push({ id: h.id, to: { r: u, c: n }, fromRow: c }), c -= 1;
    }
  }
  return o;
}
function ke(l) {
  for (let t = 0; t < p; t += 1)
    for (let o = 0; o < p; o += 1)
      if (o + 1 < p && re(l, { r: t, c: o }, { r: t, c: o + 1 }) || t + 1 < p && re(l, { r: t, c: o }, { r: t + 1, c: o })) return !0;
  return !1;
}
function re(l, t, o) {
  B(l, t, o);
  const n = Y(l).length > 0;
  return B(l, t, o), n;
}
function I(l, t) {
  return l[t.r]?.[t.c] ?? null;
}
function be(l, t, o, n = 0) {
  if (l > t && t <= 520) {
    const y = Math.min(Math.max(l, 0) - 16, Math.max(t - 72 - 8, 0), 480);
    return {
      cell: y / o,
      x0: (l - y) / 2,
      y0: 72
    };
  }
  const c = 16, u = Math.min(Math.max(l, 0) - c * 2, Math.max(t - n, 0) - c * 2, 480);
  return {
    cell: u / o,
    x0: (l - u) / 2,
    y0: Math.max(c + n, (t - u) / 2)
  };
}
function Te(l, t, o, n) {
  if (o.cell <= 0) return null;
  const d = Math.floor((l - o.x0) / o.cell), c = Math.floor((t - o.y0) / o.cell);
  return c < 0 || d < 0 || c >= n || d >= n ? null : { r: c, c: d };
}
function Re() {
  ue("match3", {
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
const Ce = [16731501, 16758531, 5032432, 8449433, 11766015, 16747586];
function $e() {
  Re();
  let l = null, t = null;
  const o = [], n = /* @__PURE__ */ new Map();
  let d = null, c = V(), u = "idle", h = 0, v = !1, S = null, y = null, k = null, i = "ready", M = ne, g = 0, m = 1, T = !1, P = 0, G = null, E = -1;
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
  function L() {
    const e = l?.app.screen.width ?? 480, r = l?.app.screen.height ?? 640;
    return be(e, r, p, 68);
  }
  function F(e, r) {
    return {
      x: r.x0 + (e.c + 0.5) * r.cell,
      y: r.y0 + (e.r + 0.5) * r.cell
    };
  }
  function O(e, r, f, s) {
    e.clear();
    const a = r * 0.78;
    e.roundRect(-a / 2, -a / 2, a, a, a * 0.22).fill(Ce[f] ?? 16777215), s === "row" && e.rect(-a / 2, -a * 0.08, a, a * 0.16).fill({ color: 16777215, alpha: 0.9 }), s === "col" && e.rect(-a * 0.08, -a / 2, a * 0.16, a).fill({ color: 16777215, alpha: 0.9 }), s === "bomb" && e.circle(0, 0, a * 0.2).fill({ color: 16777215, alpha: 0.95 });
  }
  function j(e) {
    d && (d.clear(), d.roundRect(e.x0 - 8, e.y0 - 8, e.cell * p + 16, e.cell * p + 16, 18).fill({ color: 1314328, alpha: 0.9 }));
  }
  function le(e) {
    for (let r = 0; r < p; r += 1)
      for (let f = 0; f < p; f += 1)
        if (c[r]?.[f]?.id === e) return { r, c: f };
    return null;
  }
  function ce(e, r, f) {
    let s = n.get(e.id);
    if (!s) {
      const a = new te();
      l?.app.stage.addChild(a);
      const x = F(f, r);
      s = {
        id: e.id,
        view: a,
        kind: e.kind,
        special: e.special,
        x: x.x,
        y: x.y,
        tx: x.x,
        ty: x.y,
        scale: 1
      }, n.set(e.id, s), O(a, r.cell, e.kind, e.special);
    }
    return (s.kind !== e.kind || s.special !== e.special) && (s.kind = e.kind, s.special = e.special, O(s.view, r.cell, e.kind, e.special)), s;
  }
  function $(e) {
    const r = L();
    E = r.cell, j(r);
    const f = /* @__PURE__ */ new Set();
    for (let s = 0; s < p; s += 1)
      for (let a = 0; a < p; a += 1) {
        const x = c[s]?.[a];
        if (!x) continue;
        f.add(x.id);
        const w = ce(x, r, { r: s, c: a }), b = F({ r: s, c: a }, r);
        w.tx = b.x, w.ty = b.y, e && (w.x = b.x, w.y = b.y, w.scale = 1);
      }
    for (const [s, a] of n)
      f.has(s) || (a.view.destroy(), n.delete(s));
  }
  function ie(e, r) {
    const f = l?.app.canvas, s = t?.container, a = l?.app.screen;
    return !f || !s || !a ? { x: e, y: r } : me(s, f, a.width, a.height, e, r);
  }
  function K(e) {
    const r = t?.container, f = l?.app.screen;
    !r || !f || (r.dataset.boardX = String(e.x0), r.dataset.boardY = String(e.y0), r.dataset.cellSize = String(e.cell), r.dataset.screenW = String(f.width), r.dataset.screenH = String(f.height));
  }
  function U(e, r) {
    const f = ie(e, r), s = L();
    K(s);
    const a = Te(f.x, f.y, s, p);
    return t && (t.container.dataset.hit = a ? `${a.r},${a.c}` : ""), a;
  }
  function D(e, r) {
    const f = t?.store.getState().ui.locale ?? "zh";
    return pe(f, e, r);
  }
  function R(e = "", r = D("match3.detail", { moves: M, target: N })) {
    t && H(t.store, {
      id: C.id,
      status: i,
      score: g,
      highScore: Math.max(P, g),
      message: e,
      detail: r,
      combo: m
    });
  }
  function W(e) {
    if (i = "over", u = "idle", R(e), !t || T) return;
    T = !0;
    const r = Math.max(P, g);
    g > P && he(C.id, g), t.events.emit("game:over", {
      gameId: C.id,
      score: g,
      best: r,
      isRecord: g > P && g > 0
    }), g >= N && q(t.audio, "win");
  }
  function Z() {
    if (m = 1, g >= N) {
      W(D("match3.goal"));
      return;
    }
    if (M <= 0) {
      W(D("match3.out"));
      return;
    }
    ke(c) || (c = V(), $(!0), t && q(t.audio, "swap")), u = "idle", R("");
  }
  function J() {
    if (m > 24) {
      Z();
      return;
    }
    if (y = Se(c, G), G = null, y.cleared.length === 0) {
      Z();
      return;
    }
    g += y.score * m, m += 1, u = "clear", h = 0, t && q(t.audio, y.spawned.some((e) => e.special === "bomb") ? "bomb" : "match"), R("");
  }
  function ae(e, r) {
    if (!t || i !== "running" || u !== "idle") return;
    if (!ve(e, r) || !I(c, e) || !I(c, r)) {
      q(t.audio, "bad");
      return;
    }
    B(c, e, r);
    const f = Y(c).length > 0;
    S = [e, r], v = !f, u = "swap", h = 0, G = r, $(!1), q(t.audio, f ? "swap" : "bad"), f && (M -= 1, R(""));
  }
  function Q(e) {
    c = V(), u = "idle", v = !1, S = null, y = null, k = null, M = ne, g = 0, m = 1, T = !1, G = null, i = e ? "running" : "ready";
    for (const r of n.values()) r.view.destroy();
    n.clear(), $(!0), R(e ? "" : C.howToPlay);
  }
  function fe(e) {
    const r = L();
    if (Math.abs(r.cell - E) > 0.5) {
      E = r.cell;
      for (const s of n.values()) O(s.view, r.cell, s.kind, s.special);
    }
    if (K(r), j(r), h += e, u === "swap" && h >= 0.16 && S && (v ? (B(c, S[0], S[1]), v = !1, S = null, u = "idle", $(!1)) : (S = null, J())), u === "clear" && y && h >= 0.16) {
      const s = new Set(
        y.cleared.map((w) => I(c, w)?.id).filter((w) => w !== void 0)
      );
      Me(c, y);
      for (const w of s)
        n.get(w)?.view.destroy(), n.delete(w);
      const a = xe(c);
      y = null, u = "fall", h = 0, $(!1);
      const x = L();
      for (const w of a) {
        const b = n.get(w.id);
        if (!b || w.fromRow >= w.to.r) continue;
        const _ = F({ r: w.fromRow, c: w.to.c }, x);
        b.x = _.x, b.y = _.y;
      }
    }
    u === "fall" && h >= 0.22 && J();
    const f = /* @__PURE__ */ new Set();
    if (u === "clear" && y)
      for (const s of y.cleared) {
        const a = I(c, s)?.id;
        a !== void 0 && f.add(a);
      }
    for (const s of n.values()) {
      const a = le(s.id);
      if (a && u !== "clear") {
        const b = F(a, r);
        s.tx = b.x, s.ty = b.y;
      }
      const x = 1 - Math.exp(-14 * e);
      s.x += (s.tx - s.x) * x, s.y += (s.ty - s.y) * x;
      const w = f.has(s.id) ? 0.05 : 1;
      s.scale += (w - s.scale) * x, s.view.position.set(s.x, s.y), s.view.scale.set(s.scale);
    }
  }
  return de(C, {
    async onPreload(e, r) {
      await e.preload([], r);
    },
    async onMount(e) {
      t = e, e.container.setAttribute("data-wgf-game", "wgf-game:match3"), e.container.style.touchAction = "none";
      const r = await ge(e.container, { background: 1708576 });
      if (e.signal.aborted) {
        r.dispose();
        return;
      }
      l = r, e.track(() => r.dispose()), d = new te(), r.app.stage.addChild(d), P = ee(C.id), Q(!1), o.push(
        e.loop.onInput(() => {
          if (i !== "running" || u !== "idle") return;
          const f = e.input.getPointer();
          if (e.input.wasPointerPressed() && (k = U(f.downX ?? f.x, f.downY ?? f.y), e.container.dataset.down = k ? `${k.r},${k.c}` : ""), !f.down && k) {
            const s = U(f.x, f.y), a = k;
            k = null, e.container.dataset.up = s ? `${s.r},${s.c}` : "", s && (s.r !== a.r || s.c !== a.c) && ae(a, s);
          }
        }),
        e.loop.onUpdate((f) => fe(f)),
        e.loop.onFrame(() => l?.render()),
        e.events.on("game:start", () => {
          i === "ready" && (i = "running", R(""));
        }),
        e.store.subscribe((f, s) => {
          f.ui.locale !== s.ui.locale && R();
        }),
        e.events.on("game:restart", () => {
          P = ee(C.id), Q(!0);
        })
      );
    },
    onPause(e) {
      e.store.getState().game.status === "running" && H(e.store, { status: "paused" });
    },
    onResume(e) {
      e.store.getState().game.status === "paused" && H(e.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const e of o) e();
      o.length = 0;
      for (const e of n.values()) e.view.destroy();
      n.clear(), d?.destroy(), d = null, l?.dispose(), l = null, t = null;
    }
  });
}
export {
  $e as createGame,
  C as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/render-pixi":"0.1.0","pixi.js":"8.23.0"}};
