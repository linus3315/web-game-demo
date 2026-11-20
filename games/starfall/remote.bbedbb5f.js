import { defineGame as F, patchGame as v, readHighScore as I, writeHighScore as U } from "@wgf/core";
import { createPixiContext as X } from "@wgf/render-pixi";
import { Graphics as k } from "pixi.js";
const j = {
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
  art: j,
  renderer: "pixi",
  controls: "pointer",
  tags: ["反应", "2D"]
};
function x() {
  let n = null, a = null;
  const d = [], i = [];
  let r = null, l = 0, b = 0.4, y = 0, m = 3, M = 0, u = 0, p = "ready", S = !1, w = 0, T = "", P = "星星掉光了";
  function D() {
    for (const t of i) t.view.destroy();
    i.length = 0, b = 0.6, y = 0, m = 3, M = 0, u = 0, p = "ready", S = !1, P = "星星掉光了", T = "", l = (n?.app.screen?.width ?? 320) / 2, r && (r.position.x = l);
  }
  function A(e) {
    p === "ready" && (p = "running", K(e.audio, "start"), R(e, !0));
  }
  function R(e, t) {
    const o = Math.floor(M), s = `生命 ${m}${u > 1 ? ` · 连击 ×${u}` : ""}`, h = `${p}:${o}:${s}`;
    !t && h === T || (T = h, v(e.store, {
      id: c.id,
      status: p,
      score: o,
      highScore: Math.max(w, o),
      message: p === "ready" ? c.howToPlay : "",
      detail: s,
      combo: u
    }));
  }
  function z(e) {
    if (S) return;
    S = !0, p = "over";
    const t = Math.floor(M), o = U(c.id, t), s = t > w && t > 0;
    v(e.store, {
      id: c.id,
      status: "over",
      score: t,
      highScore: o,
      message: P,
      detail: "生命 0",
      combo: u
    }), e.events.emit("game:over", { gameId: c.id, score: t, best: o, isRecord: s }), K(e.audio, "crash");
  }
  function H(e) {
    const t = n?.app;
    if (!t) return;
    const o = O(e), s = Math.max(40, t.screen.width);
    o.position.set(24 + Math.random() * (s - 48), -20), t.stage.addChild(o);
    const h = (e ? 210 : 170) + y * 8 + Math.random() * 40;
    i.push({ view: o, vy: h, bad: e });
  }
  function L(e, t) {
    const o = n?.app;
    if (!o || !r || p !== "running") return;
    const s = o.screen.width, h = o.screen.height;
    if (s < 2 || h < 2) return;
    y += t;
    const q = e.input.getPointer(), B = e.input.isKeyDown("ArrowLeft") || e.input.isKeyDown("KeyA"), C = e.input.isKeyDown("ArrowRight") || e.input.isKeyDown("KeyD");
    B && (l -= 520 * t), C && (l += 520 * t), !B && !C && q.inside && (l = Q(l, q.x, 18, t));
    const G = s < 520 ? 28 : 36, E = s < 520 ? 84 : 48;
    if (l = V(l, G, s - G), r.position.set(l, h - E), b -= t, b <= 0) {
      const g = y > 8 && Math.random() < 0.22;
      H(g), b = Math.max(0.32, 0.78 - y * 0.01);
    }
    for (let g = i.length - 1; g >= 0; g -= 1) {
      const f = i[g];
      if (!f) continue;
      if (f.view.y += f.vy * t, f.view.rotation += t * (f.bad ? 2.4 : 1.2), Math.abs(f.view.x - l) < 58 && Math.abs(f.view.y - r.position.y) < 28) {
        $(g), f.bad ? (u = 0, m -= 1, P = "被流星砸中了", K(e.audio, "crash")) : (u += 1, M += 10 * (1 + Math.min(u, 8) * 0.25), K(e.audio, "coin"));
        continue;
      }
      f.view.y > h + 30 && ($(g), f.bad || (u = 0, m -= 1, P = "星星掉光了"));
    }
    m <= 0 ? z(e) : R(e, !1);
  }
  function $(e) {
    const t = i[e];
    t && (t.view.destroy(), i.splice(e, 1));
  }
  return F(c, {
    async onMount(e) {
      a = e, e.container.setAttribute("data-wgf-game", "wgf-game:starfall");
      const t = await X(e.container, { background: 1316908 });
      if (e.signal.aborted) {
        t.dispose();
        return;
      }
      n = t, e.track(() => t.dispose()), J(t), r = N(), t.app.stage.addChild(r), w = I(c.id), D(), v(e.store, {
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
          const o = e.input;
          (o.wasPointerPressed() || o.wasTap() || o.wasKeyPressed("Enter") || o.wasKeyPressed("Space") || o.wasKeyPressed("ArrowLeft") || o.wasKeyPressed("ArrowRight")) && A(e);
        }),
        e.loop.onUpdate((o) => {
          a && L(a, o);
        }),
        e.loop.onFrame(() => n?.render()),
        e.events.on("game:start", () => A(e)),
        e.events.on("game:restart", () => {
          w = I(c.id), D(), A(e);
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
      for (const e of i) e.view.destroy();
      i.length = 0, n?.dispose(), n = null, r = null, a = null;
    }
  });
}
function J(n) {
  const a = new k();
  for (let d = 0; d < 28; d += 1) {
    const i = Math.random() * 1200, r = Math.random() * 800;
    a.circle(i, r, Math.random() * 1.6 + 0.4).fill({ color: 16183783, alpha: 0.35 + Math.random() * 0.5 });
  }
  n.app.stage.addChild(a);
}
function N() {
  return new k().roundRect(-46, -8, 92, 22, 8).fill(16734751).roundRect(-34, -16, 68, 12, 6).fill(15778122);
}
function O(n) {
  return n ? new k().circle(0, 0, 14).fill(16730942).circle(0, 0, 5).fill(16765128) : new k().star(0, 0, 5, 16, 7).fill(16766314);
}
function K(n, a) {
  a === "coin" && n.playTone({ frequency: 920, duration: 0.06, type: "triangle", gain: 0.04 }), a === "crash" && n.playTone({ frequency: 180, duration: 0.16, type: "sawtooth", gain: 0.04, slideTo: 70 }), a === "start" && n.playTone({ frequency: 520, duration: 0.08, type: "square", gain: 0.03, slideTo: 880 });
}
function Q(n, a, d, i) {
  return n + (a - n) * (1 - Math.exp(-18 * i));
}
function V(n, a, d) {
  return Math.min(d, Math.max(a, n));
}
export {
  x as createGame,
  c as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/render-pixi":"0.1.0","pixi.js":"8.23.0"}};
