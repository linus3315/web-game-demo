import { registerStrings as U, defineGame as X, patchGame as b, readHighScore as z, t as M, writeHighScore as j } from "@wgf/core";
import { createPixiContext as J, stagePointFromContainer as N } from "@wgf/render-pixi";
import { Graphics as k } from "pixi.js";
const O = {
  background: "#14182c",
  shapes: [
    { tag: "circle", attrs: { cx: 48, cy: 36, r: 1.5, fill: "#f6f1e7" } },
    { tag: "circle", attrs: { cx: 90, cy: 70, r: 1.2, fill: "#f6f1e7" } },
    { tag: "circle", attrs: { cx: 250, cy: 40, r: 1.4, fill: "#f6f1e7" } },
    { tag: "circle", attrs: { cx: 280, cy: 90, r: 1, fill: "#f6f1e7" } },
    {
      tag: "polygon",
      attrs: {
        points: "120,48 126,64 144,64 130,74 135,90 120,80 105,90 110,74 96,64 114,64",
        fill: "#ffd56a"
      }
    },
    { tag: "circle", attrs: { cx: 210, cy: 78, r: 10, fill: "#ff4b3e" } },
    {
      tag: "path",
      attrs: {
        d: "M118 142 h84 a10 10 0 0 0 10 -10 v-6 h-104 v6 a10 10 0 0 0 10 10z",
        fill: "#ff5a1f"
      }
    },
    { tag: "path", attrs: { d: "M140 126 h40 v8 h-40z", fill: "#f0c14a" } }
  ]
}, f = {
  id: "starfall",
  name: "摘星",
  description: "接住落下的金星，躲开红色流星。漏掉三颗金星就结束。",
  tip: "接住金星，躲开红色的。",
  howToPlay: "移动鼠标或手指，也可以用 ← → 控制篮子。金色加分，红色扣一条命。",
  copy: {
    en: {
      name: "Starfall",
      description: "Catch falling gold stars and dodge the red ones. Three missed stars ends the run.",
      howToPlay: "Move with the pointer or the arrow keys. Gold scores, red costs a life.",
      tip: "Catch the gold stars. Dodge the red ones."
    }
  },
  cover: "starfall",
  art: O,
  renderer: "pixi",
  controls: "pointer",
  tags: ["反应", "2D"],
  theme: { accent: "#ffd56a", accentInk: "#2a1c06", glow: "#ff5a1f", radius: 20, font: "serif" }
};
function Q() {
  U("starfall", {
    zh: {
      lives: "生命 {n}",
      combo: "生命 {n} · 连击 ×{combo}",
      crash: "被流星砸中了",
      missed: "星星掉光了"
    },
    en: {
      lives: "Lives {n}",
      combo: "Lives {n} · combo ×{combo}",
      crash: "Hit by a meteor",
      missed: "Too many stars fell"
    }
  });
}
function oe() {
  Q();
  let o = null, s = null;
  const d = [], r = [];
  let i = null, l = 0, S = 0.4, w = 0, m = 3, P = 0, u = 0, h = "ready", D = !1, v = 0, A = "", K = "starfall.missed";
  function G() {
    for (const t of r) t.view.destroy();
    r.length = 0, S = 0.6, w = 0, m = 3, P = 0, u = 0, h = "ready", D = !1, K = "starfall.missed", A = "", l = (o?.app.screen?.width ?? 320) / 2, i && (i.position.x = l);
  }
  function C(e) {
    h === "ready" && (h = "running", T(e.audio, "start"), R(e, !0));
  }
  function R(e, t) {
    const a = Math.floor(P), n = e.store.getState().ui.locale, p = u > 1 ? M(n, "starfall.combo", { n: m, combo: u }) : M(n, "starfall.lives", { n: m }), y = `${h}:${a}:${p}`;
    !t && y === A || (A = y, b(e.store, {
      id: f.id,
      status: h,
      score: a,
      highScore: Math.max(v, a),
      message: h === "ready" ? f.howToPlay : "",
      detail: p,
      combo: u
    }));
  }
  function H(e) {
    if (D) return;
    D = !0, h = "over";
    const t = Math.floor(P), a = j(f.id, t), n = t > v && t > 0;
    b(e.store, {
      id: f.id,
      status: "over",
      score: t,
      highScore: a,
      message: M(e.store.getState().ui.locale, K),
      detail: M(e.store.getState().ui.locale, "starfall.lives", { n: 0 }),
      combo: u
    }), e.events.emit("game:over", { gameId: f.id, score: t, best: a, isRecord: n }), T(e.audio, "crash");
  }
  function $(e) {
    const t = o?.app;
    if (!t) return;
    const a = Y(e), n = Math.max(40, t.screen.width);
    a.position.set(24 + Math.random() * (n - 48), -20), t.stage.addChild(a);
    const p = (e ? 210 : 170) + w * 8 + Math.random() * 40;
    r.push({ view: a, vy: p, bad: e });
  }
  function F(e, t) {
    const a = o?.app;
    if (!a || !i || h !== "running") return;
    const n = a.screen.width, p = a.screen.height;
    if (n < 2 || p < 2) return;
    w += t;
    const y = e.input.getPointer(), B = e.input.isKeyDown("ArrowLeft") || e.input.isKeyDown("KeyA"), I = e.input.isKeyDown("ArrowRight") || e.input.isKeyDown("KeyD");
    if (B && (l -= 520 * t), I && (l += 520 * t), !B && !I && y.inside) {
      const g = N(
        e.container,
        a.canvas,
        n,
        p,
        y.x,
        y.y
      );
      l = Z(l, g.x, 18, t);
    }
    const L = n < 520 ? 28 : 36, E = n < 520 ? 84 : 48;
    if (l = _(l, L, n - L), i.position.set(l, p - E), S -= t, S <= 0) {
      const g = w > 8 && Math.random() < 0.22;
      $(g), S = Math.max(0.32, 0.78 - w * 0.01);
    }
    for (let g = r.length - 1; g >= 0; g -= 1) {
      const c = r[g];
      if (!c) continue;
      if (c.view.y += c.vy * t, c.view.rotation += t * (c.bad ? 2.4 : 1.2), Math.abs(c.view.x - l) < 58 && Math.abs(c.view.y - i.position.y) < 28) {
        q(g), c.bad ? (u = 0, m -= 1, K = "starfall.crash", T(e.audio, "crash")) : (u += 1, P += 10 * (1 + Math.min(u, 8) * 0.25), T(e.audio, "coin"));
        continue;
      }
      c.view.y > p + 30 && (q(g), c.bad || (u = 0, m -= 1, K = "starfall.missed"));
    }
    m <= 0 ? H(e) : R(e, !1);
  }
  function q(e) {
    const t = r[e];
    t && (t.view.destroy(), r.splice(e, 1));
  }
  return X(f, {
    async onPreload(e, t) {
      await e.preload([], t);
    },
    async onMount(e) {
      s = e, e.container.setAttribute("data-wgf-game", "wgf-game:starfall");
      const t = await J(e.container, { background: 1316908 });
      if (e.signal.aborted) {
        t.dispose();
        return;
      }
      o = t, e.track(() => t.dispose()), V(t), i = W(), t.app.stage.addChild(i), v = z(f.id), G(), b(e.store, {
        id: f.id,
        status: "ready",
        score: 0,
        highScore: v,
        message: f.howToPlay,
        detail: M(e.store.getState().ui.locale, "starfall.lives", { n: 3 }),
        combo: 0
      }), d.push(
        e.loop.onInput(() => {
          if (h !== "ready" || !s) return;
          const a = e.input;
          (a.wasPointerPressed() || a.wasTap() || a.wasKeyPressed("Enter") || a.wasKeyPressed("Space") || a.wasKeyPressed("ArrowLeft") || a.wasKeyPressed("ArrowRight")) && C(e);
        }),
        e.loop.onUpdate((a) => {
          s && F(s, a);
        }),
        e.loop.onFrame(() => o?.render()),
        e.store.subscribe((a, n) => {
          a.ui.locale !== n.ui.locale && s && R(s, !0);
        }),
        e.events.on("game:start", () => C(e)),
        e.events.on("game:restart", () => {
          v = z(f.id), G(), C(e);
        })
      );
    },
    onPause(e) {
      e.store.getState().game.status === "running" && b(e.store, { status: "paused" });
    },
    onResume(e) {
      e.store.getState().game.status === "paused" && b(e.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const e of d) e();
      d.length = 0;
      for (const e of r) e.view.destroy();
      r.length = 0, o?.dispose(), o = null, i = null, s = null;
    }
  });
}
function V(o) {
  const s = new k();
  for (let d = 0; d < 28; d += 1) {
    const r = Math.random() * 1200, i = Math.random() * 800;
    s.circle(r, i, Math.random() * 1.6 + 0.4).fill({ color: 16183783, alpha: 0.35 + Math.random() * 0.5 });
  }
  o.app.stage.addChild(s);
}
function W() {
  return new k().roundRect(-46, -8, 92, 22, 8).fill(16734751).roundRect(-34, -16, 68, 12, 6).fill(15778122);
}
function Y(o) {
  return o ? new k().circle(0, 0, 14).fill(16730942).circle(0, 0, 5).fill(16765128) : new k().star(0, 0, 5, 16, 7).fill(16766314);
}
function T(o, s) {
  s === "coin" && o.playTone({ frequency: 920, duration: 0.06, type: "triangle", gain: 0.04 }), s === "crash" && o.playTone({ frequency: 180, duration: 0.16, type: "sawtooth", gain: 0.04, slideTo: 70 }), s === "start" && o.playTone({ frequency: 520, duration: 0.08, type: "square", gain: 0.03, slideTo: 880 });
}
function Z(o, s, d, r) {
  return o + (s - o) * (1 - Math.exp(-18 * r));
}
function _(o, s, d) {
  return Math.min(d, Math.max(s, o));
}
export {
  oe as createGame,
  f as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/render-pixi":"0.1.0","pixi.js":"8.23.0"}};
