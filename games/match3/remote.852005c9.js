import { defineGame as se, patchGame as D, readHighScore as Q, writeHighScore as ce } from "@wgf/core";
import { createPixiContext as ae } from "@wgf/render-pixi";
import { Graphics as W } from "pixi.js";
const fe = {
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
}, b = {
  id: "match3",
  name: "消消乐",
  description: "8×8 棋盘。交换相邻方块，三连消除，连击会把分数抬上去。",
  howToPlay: "拖动或点选相邻两格交换。四个一排变成整行或整列消除，五个或 L/T 形变成炸弹。在步数用完前达到目标分。",
  cover: "match3",
  art: fe,
  renderer: "pixi",
  controls: "board",
  tags: ["消除", "触屏"]
}, p = 8, P = 6, _ = 22, F = 2500;
let ee = 1;
function ne(l, n = "none") {
  return ee += 1, { id: ee, kind: l, special: n };
}
function H(l = Math.random) {
  const n = Array.from({ length: p }, () => Array.from({ length: p }, () => null));
  for (let o = 0; o < p; o += 1)
    for (let t = 0; t < p; t += 1) {
      let d = Math.floor(l() * P) % P, c = 0;
      for (; ue(n, o, t, d) && c < P; )
        d = (d + 1) % P, c += 1;
      n[o][t] = ne(d);
    }
  return n;
}
function ue(l, n, o, t) {
  const d = o >= 2 && l[n][o - 1]?.kind === t && l[n][o - 2]?.kind === t, c = n >= 2 && l[n - 1][o]?.kind === t && l[n - 2][o]?.kind === t;
  return d || c;
}
function de(l, n) {
  return Math.abs(l.r - n.r) + Math.abs(l.c - n.c) === 1;
}
function z(l, n, o) {
  const t = l[n.r], d = l[o.r];
  if (!t || !d) return;
  const c = t[n.c];
  t[n.c] = d[o.c] ?? null, d[o.c] = c ?? null;
}
function N(l) {
  const n = [];
  for (let o = 0; o < p; o += 1) {
    let t = 0;
    for (; t < p; ) {
      const d = l[o]?.[t];
      if (!d) {
        t += 1;
        continue;
      }
      let c = t + 1;
      for (; c < p && l[o]?.[c]?.kind === d.kind; ) c += 1;
      if (c - t >= 3) {
        const u = [];
        for (let h = t; h < c; h += 1) u.push({ r: o, c: h });
        n.push({ cells: u, dir: "h" });
      }
      t = c;
    }
  }
  for (let o = 0; o < p; o += 1) {
    let t = 0;
    for (; t < p; ) {
      const d = l[t]?.[o];
      if (!d) {
        t += 1;
        continue;
      }
      let c = t + 1;
      for (; c < p && l[c]?.[o]?.kind === d.kind; ) c += 1;
      if (c - t >= 3) {
        const u = [];
        for (let h = t; h < c; h += 1) u.push({ r: h, c: o });
        n.push({ cells: u, dir: "v" });
      }
      t = c;
    }
  }
  return n;
}
function E(l) {
  return `${l.r},${l.c}`;
}
function L(l) {
  const [n, o] = l.split(",").map((t) => Number(t));
  return { r: n ?? 0, c: o ?? 0 };
}
function pe(l, n) {
  const o = N(l);
  if (o.length === 0) return { cleared: [], spawned: [], score: 0 };
  const t = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set();
  for (const s of o) {
    const k = s.dir === "h" ? t : d;
    for (const g of s.cells) k.add(E(g));
  }
  const c = /* @__PURE__ */ new Set();
  for (const s of t)
    d.has(s) && c.add(s);
  for (const s of o)
    if (s.cells.length >= 5) {
      const k = s.cells[Math.floor(s.cells.length / 2)];
      k && c.add(E(k));
    }
  const u = /* @__PURE__ */ new Map();
  for (const s of o) {
    if (s.cells.length !== 4) continue;
    const g = (n && s.cells.find((w) => w.r === n.r && w.c === n.c)) ?? s.cells[1];
    !g || c.has(E(g)) || u.set(E(g), s.dir === "h" ? "row" : "col");
  }
  const h = /* @__PURE__ */ new Set(), y = [];
  for (const s of o) y.push(...s.cells);
  for (; y.length > 0; ) {
    const s = y.pop();
    if (!s) break;
    const k = E(s);
    if (h.has(k) || s.r < 0 || s.c < 0 || s.r >= p || s.c >= p) continue;
    h.add(k);
    const g = l[s.r]?.[s.c];
    if (g) {
      if (g.special === "row")
        for (let w = 0; w < p; w += 1) y.push({ r: s.r, c: w });
      else if (g.special === "col")
        for (let w = 0; w < p; w += 1) y.push({ r: w, c: s.c });
      else if (g.special === "bomb")
        for (let w = -2; w <= 2; w += 1)
          for (let R = -2; R <= 2; R += 1) y.push({ r: s.r + w, c: s.c + R });
    }
  }
  const v = [], x = /* @__PURE__ */ new Set();
  for (const s of c)
    x.add(s), v.push({ pos: L(s), special: "bomb" });
  for (const [s, k] of u)
    x.has(s) || (x.add(s), v.push({ pos: L(s), special: k }));
  const T = [];
  for (const s of h)
    x.has(s) || T.push(L(s));
  return { cleared: T, spawned: v, score: T.length * 10 + v.length * 40 };
}
function he(l, n) {
  for (const o of n.cleared) {
    const t = l[o.r];
    t && (t[o.c] = null);
  }
  for (const o of n.spawned) {
    const t = l[o.pos.r]?.[o.pos.c];
    t && (t.special = o.special);
  }
}
function ge(l, n = Math.random) {
  const o = [];
  for (let t = 0; t < p; t += 1) {
    let d = p - 1;
    for (let u = p - 1; u >= 0; u -= 1) {
      const h = l[u]?.[t];
      if (h) {
        if (u !== d) {
          o.push({ id: h.id, to: { r: d, c: t }, fromRow: u });
          const y = l[d], v = l[u];
          y && v && (y[t] = h, v[t] = null);
        }
        d -= 1;
      }
    }
    let c = -1;
    for (let u = d; u >= 0; u -= 1) {
      const h = ne(Math.floor(n() * P) % P), y = l[u];
      y && (y[t] = h), o.push({ id: h.id, to: { r: u, c: t }, fromRow: c }), c -= 1;
    }
  }
  return o;
}
function we(l) {
  for (let n = 0; n < p; n += 1)
    for (let o = 0; o < p; o += 1)
      if (o + 1 < p && te(l, { r: n, c: o }, { r: n, c: o + 1 }) || n + 1 < p && te(l, { r: n, c: o }, { r: n + 1, c: o })) return !0;
  return !1;
}
function te(l, n, o) {
  z(l, n, o);
  const t = N(l).length > 0;
  return z(l, n, o), t;
}
function O(l, n) {
  return l[n.r]?.[n.c] ?? null;
}
const me = [16731501, 16758531, 5032432, 8449433, 11766015, 16747586];
function ke() {
  let l = null, n = null;
  const o = [], t = /* @__PURE__ */ new Map();
  let d = null, c = H(), u = "idle", h = 0, y = !1, v = null, x = null, T = null, s = "ready", k = _, g = 0, w = 1, R = !1, q = 0, I = null;
  function A(e, i) {
    i === "swap" && e.playTone({ frequency: 520, duration: 0.05, type: "triangle", gain: 0.035 }), i === "match" && e.playTone({
      frequency: 740,
      duration: 0.07,
      type: "triangle",
      gain: 0.04,
      slideTo: 980
    }), i === "bomb" && e.playTone({
      frequency: 220,
      duration: 0.16,
      type: "sawtooth",
      gain: 0.045,
      slideTo: 80
    }), i === "bad" && e.playTone({ frequency: 180, duration: 0.08, type: "square", gain: 0.03 }), i === "win" && e.playTone({ frequency: 660, duration: 0.12, type: "square", gain: 0.04, slideTo: 990 });
  }
  function $() {
    const e = l?.app.screen.width ?? 480, i = l?.app.screen.height ?? 640, f = 16, r = Math.min(e - f * 2, i - f * 2, 480);
    return {
      cell: r / p,
      x0: (e - r) / 2,
      y0: Math.max(f, (i - r) / 2)
    };
  }
  function B(e, i) {
    return {
      x: i.x0 + (e.c + 0.5) * i.cell,
      y: i.y0 + (e.r + 0.5) * i.cell
    };
  }
  function V(e, i, f, r) {
    e.clear();
    const a = i * 0.78;
    e.roundRect(-a / 2, -a / 2, a, a, a * 0.22).fill(me[f] ?? 16777215), r === "row" && e.rect(-a / 2, -a * 0.08, a, a * 0.16).fill({ color: 16777215, alpha: 0.9 }), r === "col" && e.rect(-a * 0.08, -a / 2, a * 0.16, a).fill({ color: 16777215, alpha: 0.9 }), r === "bomb" && e.circle(0, 0, a * 0.2).fill({ color: 16777215, alpha: 0.95 });
  }
  function j(e) {
    d && (d.clear(), d.roundRect(e.x0 - 8, e.y0 - 8, e.cell * p + 16, e.cell * p + 16, 18).fill({ color: 1314328, alpha: 0.9 }));
  }
  function oe(e) {
    for (let i = 0; i < p; i += 1)
      for (let f = 0; f < p; f += 1)
        if (c[i]?.[f]?.id === e) return { r: i, c: f };
    return null;
  }
  function re(e, i, f) {
    let r = t.get(e.id);
    if (!r) {
      const a = new W();
      l?.app.stage.addChild(a);
      const M = B(f, i);
      r = {
        id: e.id,
        view: a,
        kind: e.kind,
        special: e.special,
        x: M.x,
        y: M.y,
        tx: M.x,
        ty: M.y,
        scale: 1
      }, t.set(e.id, r), V(a, i.cell, e.kind, e.special);
    }
    return (r.kind !== e.kind || r.special !== e.special) && (r.kind = e.kind, r.special = e.special, V(r.view, i.cell, e.kind, e.special)), r;
  }
  function G(e) {
    const i = $();
    j(i);
    const f = /* @__PURE__ */ new Set();
    for (let r = 0; r < p; r += 1)
      for (let a = 0; a < p; a += 1) {
        const M = c[r]?.[a];
        if (!M) continue;
        f.add(M.id);
        const m = re(M, i, { r, c: a }), S = B({ r, c: a }, i);
        m.tx = S.x, m.ty = S.y, e && (m.x = S.x, m.y = S.y, m.scale = 1);
      }
    for (const [r, a] of t)
      f.has(r) || (a.view.destroy(), t.delete(r));
  }
  function K(e, i) {
    const f = $(), r = Math.floor((e - f.x0) / f.cell), a = Math.floor((i - f.y0) / f.cell);
    return a < 0 || r < 0 || a >= p || r >= p ? null : { r: a, c: r };
  }
  function C(e = "", i = `步数 ${k} · 目标 ${F}`) {
    n && D(n.store, {
      id: b.id,
      status: s,
      score: g,
      highScore: Math.max(q, g),
      message: e,
      detail: i,
      combo: w
    });
  }
  function U(e) {
    if (s = "over", u = "idle", C(e), !n || R) return;
    R = !0;
    const i = Math.max(q, g);
    g > q && ce(b.id, g), n.events.emit("game:over", {
      gameId: b.id,
      score: g,
      best: i,
      isRecord: g > q && g > 0
    }), g >= F && A(n.audio, "win");
  }
  function X() {
    if (w = 1, g >= F) {
      U("达到目标分");
      return;
    }
    if (k <= 0) {
      U("步数用完了");
      return;
    }
    we(c) || (c = H(), G(!0), n && A(n.audio, "swap")), u = "idle", C("");
  }
  function Y() {
    if (w > 24) {
      X();
      return;
    }
    if (x = pe(c, I), I = null, x.cleared.length === 0) {
      X();
      return;
    }
    g += x.score * w, w += 1, u = "clear", h = 0, n && A(n.audio, x.spawned.some((e) => e.special === "bomb") ? "bomb" : "match"), C("");
  }
  function le(e, i) {
    if (!n || s !== "running" || u !== "idle") return;
    if (!de(e, i) || !O(c, e) || !O(c, i)) {
      A(n.audio, "bad");
      return;
    }
    z(c, e, i);
    const f = N(c).length > 0;
    v = [e, i], y = !f, u = "swap", h = 0, I = i, G(!1), A(n.audio, f ? "swap" : "bad"), f && (k -= 1, C(""));
  }
  function Z(e) {
    c = H(), u = "idle", y = !1, v = null, x = null, T = null, k = _, g = 0, w = 1, R = !1, I = null, s = e ? "running" : "ready";
    for (const i of t.values()) i.view.destroy();
    t.clear(), G(!0), C(e ? "" : b.howToPlay);
  }
  function ie(e) {
    const i = $();
    if (j(i), h += e, u === "swap" && h >= 0.16 && v && (y ? (z(c, v[0], v[1]), y = !1, v = null, u = "idle", G(!1)) : (v = null, Y())), u === "clear" && x && h >= 0.16) {
      const r = new Set(
        x.cleared.map((m) => O(c, m)?.id).filter((m) => m !== void 0)
      );
      he(c, x);
      for (const m of r)
        t.get(m)?.view.destroy(), t.delete(m);
      const a = ge(c);
      x = null, u = "fall", h = 0, G(!1);
      const M = $();
      for (const m of a) {
        const S = t.get(m.id);
        if (!S || m.fromRow >= m.to.r) continue;
        const J = B({ r: m.fromRow, c: m.to.c }, M);
        S.x = J.x, S.y = J.y;
      }
    }
    u === "fall" && h >= 0.22 && Y();
    const f = /* @__PURE__ */ new Set();
    if (u === "clear" && x)
      for (const r of x.cleared) {
        const a = O(c, r)?.id;
        a !== void 0 && f.add(a);
      }
    for (const r of t.values()) {
      const a = oe(r.id);
      if (a && u !== "clear") {
        const S = B(a, i);
        r.tx = S.x, r.ty = S.y;
      }
      const M = 1 - Math.exp(-14 * e);
      r.x += (r.tx - r.x) * M, r.y += (r.ty - r.y) * M;
      const m = f.has(r.id) ? 0.05 : 1;
      r.scale += (m - r.scale) * M, r.view.position.set(r.x, r.y), r.view.scale.set(r.scale);
    }
  }
  return se(b, {
    async onMount(e) {
      n = e, e.container.setAttribute("data-wgf-game", "wgf-game:match3");
      const i = await ae(e.container, { background: 1708576 });
      if (e.signal.aborted) {
        i.dispose();
        return;
      }
      l = i, e.track(() => i.dispose()), d = new W(), i.app.stage.addChild(d), q = Q(b.id), Z(!1), o.push(
        e.loop.onInput(() => {
          if (s !== "running" || u !== "idle") return;
          const f = e.input.getPointer();
          if (e.input.wasPointerPressed() && (T = K(f.downX ?? f.x, f.downY ?? f.y)), !f.down && T) {
            const r = K(f.x, f.y), a = T;
            T = null, r && (r.r !== a.r || r.c !== a.c) && le(a, r);
          }
        }),
        e.loop.onUpdate((f) => ie(f)),
        e.loop.onFrame(() => l?.render()),
        e.events.on("game:start", () => {
          s === "ready" && (s = "running", C(""));
        }),
        e.events.on("game:restart", () => {
          q = Q(b.id), Z(!0);
        })
      );
    },
    onPause(e) {
      e.store.getState().game.status === "running" && D(e.store, { status: "paused" });
    },
    onResume(e) {
      e.store.getState().game.status === "paused" && D(e.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const e of o) e();
      o.length = 0;
      for (const e of t.values()) e.view.destroy();
      t.clear(), d?.destroy(), d = null, l?.dispose(), l = null, n = null;
    }
  });
}
export {
  ke as createGame,
  b as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/render-pixi":"0.1.0","pixi.js":"8.23.0"}};
