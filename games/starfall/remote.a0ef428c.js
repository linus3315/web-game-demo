import { defineGame as E, patchGame as v, readHighScore as I, writeHighScore as U } from "@wgf/core";
import { createPixiContext as X, stagePointFromContainer as j } from "@wgf/render-pixi";
import { Graphics as k } from "pixi.js";
const J = {
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
}, c = {
  id: "starfall",
  name: "摘星",
  description: "接住落下的金星，躲开红色流星。漏掉三颗金星就结束。",
  howToPlay: "移动鼠标或手指，也可以用 ← → 控制篮子。金色加分，红色扣一条命。",
  cover: "starfall",
  art: J,
  renderer: "pixi",
  controls: "pointer",
  tags: ["反应", "2D"],
  theme: { accent: "#ffd56a", accentInk: "#2a1c06", glow: "#ff5a1f", radius: 20, font: "serif" }
};
function ee() {
  let o = null, a = null;
  const d = [], s = [];
  let r = null, l = 0, b = 0.4, y = 0, m = 3, M = 0, u = 0, p = "ready", S = !1, w = 0, T = "", P = "星星掉光了";
  function R() {
    for (const t of s) t.view.destroy();
    s.length = 0, b = 0.6, y = 0, m = 3, M = 0, u = 0, p = "ready", S = !1, P = "星星掉光了", T = "", l = (o?.app.screen?.width ?? 320) / 2, r && (r.position.x = l);
  }
  function A(e) {
    p === "ready" && (p = "running", K(e.audio, "start"), $(e, !0));
  }
  function $(e, t) {
    const n = Math.floor(M), i = `生命 ${m}${u > 1 ? ` · 连击 ×${u}` : ""}`, h = `${p}:${n}:${i}`;
    !t && h === T || (T = h, v(e.store, {
      id: c.id,
      status: p,
      score: n,
      highScore: Math.max(w, n),
      message: p === "ready" ? c.howToPlay : "",
      detail: i,
      combo: u
    }));
  }
  function z(e) {
    if (S) return;
    S = !0, p = "over";
    const t = Math.floor(M), n = U(c.id, t), i = t > w && t > 0;
    v(e.store, {
      id: c.id,
      status: "over",
      score: t,
      highScore: n,
      message: P,
      detail: "生命 0",
      combo: u
    }), e.events.emit("game:over", { gameId: c.id, score: t, best: n, isRecord: i }), K(e.audio, "crash");
  }
  function F(e) {
    const t = o?.app;
    if (!t) return;
    const n = Q(e), i = Math.max(40, t.screen.width);
    n.position.set(24 + Math.random() * (i - 48), -20), t.stage.addChild(n);
    const h = (e ? 210 : 170) + y * 8 + Math.random() * 40;
    s.push({ view: n, vy: h, bad: e });
  }
  function H(e, t) {
    const n = o?.app;
    if (!n || !r || p !== "running") return;
    const i = n.screen.width, h = n.screen.height;
    if (i < 2 || h < 2) return;
    y += t;
    const D = e.input.getPointer(), q = e.input.isKeyDown("ArrowLeft") || e.input.isKeyDown("KeyA"), B = e.input.isKeyDown("ArrowRight") || e.input.isKeyDown("KeyD");
    if (q && (l -= 520 * t), B && (l += 520 * t), !q && !B && D.inside) {
      const g = j(
        e.container,
        n.canvas,
        i,
        h,
        D.x,
        D.y
      );
      l = V(l, g.x, 18, t);
    }
    const G = i < 520 ? 28 : 36, L = i < 520 ? 84 : 48;
    if (l = W(l, G, i - G), r.position.set(l, h - L), b -= t, b <= 0) {
      const g = y > 8 && Math.random() < 0.22;
      F(g), b = Math.max(0.32, 0.78 - y * 0.01);
    }
    for (let g = s.length - 1; g >= 0; g -= 1) {
      const f = s[g];
      if (!f) continue;
      if (f.view.y += f.vy * t, f.view.rotation += t * (f.bad ? 2.4 : 1.2), Math.abs(f.view.x - l) < 58 && Math.abs(f.view.y - r.position.y) < 28) {
        C(g), f.bad ? (u = 0, m -= 1, P = "被流星砸中了", K(e.audio, "crash")) : (u += 1, M += 10 * (1 + Math.min(u, 8) * 0.25), K(e.audio, "coin"));
        continue;
      }
      f.view.y > h + 30 && (C(g), f.bad || (u = 0, m -= 1, P = "星星掉光了"));
    }
    m <= 0 ? z(e) : $(e, !1);
  }
  function C(e) {
    const t = s[e];
    t && (t.view.destroy(), s.splice(e, 1));
  }
  return E(c, {
    async onMount(e) {
      a = e, e.container.setAttribute("data-wgf-game", "wgf-game:starfall");
      const t = await X(e.container, { background: 1316908 });
      if (e.signal.aborted) {
        t.dispose();
        return;
      }
      o = t, e.track(() => t.dispose()), N(t), r = O(), t.app.stage.addChild(r), w = I(c.id), R(), v(e.store, {
        id: c.id,
        status: "ready",
        score: 0,
        highScore: w,
        message: c.howToPlay,
        detail: "生命 3",
        combo: 0
      }), d.push(
        e.loop.onInput(() => {
          if (p !== "ready" || !a) return;
          const n = e.input;
          (n.wasPointerPressed() || n.wasTap() || n.wasKeyPressed("Enter") || n.wasKeyPressed("Space") || n.wasKeyPressed("ArrowLeft") || n.wasKeyPressed("ArrowRight")) && A(e);
        }),
        e.loop.onUpdate((n) => {
          a && H(a, n);
        }),
        e.loop.onFrame(() => o?.render()),
        e.events.on("game:start", () => A(e)),
        e.events.on("game:restart", () => {
          w = I(c.id), R(), A(e);
        })
      );
    },
    onPause(e) {
      e.store.getState().game.status === "running" && v(e.store, { status: "paused" });
    },
    onResume(e) {
      e.store.getState().game.status === "paused" && v(e.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const e of d) e();
      d.length = 0;
      for (const e of s) e.view.destroy();
      s.length = 0, o?.dispose(), o = null, r = null, a = null;
    }
  });
}
function N(o) {
  const a = new k();
  for (let d = 0; d < 28; d += 1) {
    const s = Math.random() * 1200, r = Math.random() * 800;
    a.circle(s, r, Math.random() * 1.6 + 0.4).fill({ color: 16183783, alpha: 0.35 + Math.random() * 0.5 });
  }
  o.app.stage.addChild(a);
}
function O() {
  return new k().roundRect(-46, -8, 92, 22, 8).fill(16734751).roundRect(-34, -16, 68, 12, 6).fill(15778122);
}
function Q(o) {
  return o ? new k().circle(0, 0, 14).fill(16730942).circle(0, 0, 5).fill(16765128) : new k().star(0, 0, 5, 16, 7).fill(16766314);
}
function K(o, a) {
  a === "coin" && o.playTone({ frequency: 920, duration: 0.06, type: "triangle", gain: 0.04 }), a === "crash" && o.playTone({ frequency: 180, duration: 0.16, type: "sawtooth", gain: 0.04, slideTo: 70 }), a === "start" && o.playTone({ frequency: 520, duration: 0.08, type: "square", gain: 0.03, slideTo: 880 });
}
function V(o, a, d, s) {
  return o + (a - o) * (1 - Math.exp(-18 * s));
}
function W(o, a, d) {
  return Math.min(d, Math.max(a, o));
}
export {
  ee as createGame,
  c as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/render-pixi":"0.1.0","pixi.js":"8.23.0"}};
