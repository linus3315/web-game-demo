var I = Object.defineProperty;
var x = (i, e, s) => e in i ? I(i, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[e] = s;
var h = (i, e, s) => x(i, typeof e != "symbol" ? e + "" : e, s);
import { registerStrings as C, defineGame as D, patchGame as g, SceneManager as L, readHighScore as A, t as w, writeHighScore as K } from "@wgf/core";
import { createThreeContext as j } from "@wgf/render-three";
import * as n from "three";
const q = {
  background: "#100e16",
  shapes: [
    {
      tag: "path",
      attrs: {
        d: "M40 150 L160 70 L280 150",
        fill: "none",
        stroke: "#1ad8ff",
        strokeWidth: 2,
        opacity: 0.7
      }
    },
    {
      tag: "path",
      attrs: {
        d: "M80 150 L160 96 L240 150",
        fill: "none",
        stroke: "#ff3d8a",
        strokeWidth: 2,
        opacity: 0.8
      }
    },
    {
      tag: "path",
      attrs: { d: "M120 150 L160 118 L200 150", fill: "none", stroke: "#f0b429", strokeWidth: 2 }
    },
    { tag: "polygon", attrs: { points: "160,78 174,108 160,100 146,108", fill: "#e8fbff" } },
    { tag: "circle", attrs: { cx: 160, cy: 112, r: 4, fill: "#ff7a3c" } }
  ]
}, p = {
  id: "neon-rush",
  name: "霓虹疾走",
  description: "三条赛道，越开越快。变道躲开方块，跳过矮栏，把金币吃干净。",
  tip: "变道躲开方块，跳过矮栏。",
  howToPlay: "← → 或 A / D 变道，↑、W 或空格跳跃。手机可滑动，也可以用屏幕按钮。",
  copy: {
    en: {
      name: "Neon Rush",
      description: "Three lanes, and it only gets faster. Dodge blocks, hop barriers, collect coins.",
      howToPlay: "Arrow keys or A / D change lanes. Up, W, or Space jumps. On a phone, swipe or use the buttons.",
      tip: "Change lanes to dodge, and jump the low barriers."
    }
  },
  cover: "neon-rush",
  art: q,
  renderer: "three",
  controls: "lanes",
  tags: ["反应", "无尽"],
  theme: { accent: "#1ad8ff", accentInk: "#041018", glow: "#ff3d8a", radius: 10, font: "sans" }
};
function R() {
  C("neon", {
    zh: {
      speed: "速度 {n}",
      combo: "连击 ×{n}",
      crash: "撞上了。再来一局？"
    },
    en: {
      speed: "Speed {n}",
      combo: "Combo ×{n}",
      crash: "Crashed. Play again?"
    }
  });
}
const b = [-2.3, 0, 2.3];
class W {
  constructor(e) {
    h(this, "three");
    h(this, "status", "ready");
    h(this, "lane", 1);
    h(this, "x", 0);
    h(this, "y", 0);
    h(this, "vy", 0);
    h(this, "speed", 18);
    h(this, "score", 0);
    h(this, "combo", 0);
    h(this, "elapsed", 0);
    h(this, "onLane", null);
    h(this, "onJump", null);
    h(this, "onCoin", null);
    h(this, "spawnIn", 1.7);
    h(this, "comboTimer", 0);
    h(this, "time", 0);
    h(this, "shake", 0);
    h(this, "player", new n.Group());
    h(this, "blob");
    h(this, "blocks");
    h(this, "barriers");
    h(this, "coins");
    h(this, "dashes");
    h(this, "arches");
    h(this, "dust");
    h(this, "flash");
    this.three = j(e, {
      clearColor: 1052182,
      fov: 58,
      cameraPosition: [0, 4.5, 8.1]
    });
    const { scene: s } = this.three;
    s.fog = new n.Fog(1052182, 14, 78), s.add(new n.HemisphereLight(10205183, 1707272, 0.7));
    const a = new n.DirectionalLight(16773596, 1.15);
    a.position.set(6, 10, 4), s.add(a);
    const o = new n.Mesh(
      new n.PlaneGeometry(16, 180),
      new n.MeshStandardMaterial({ color: 1446684, roughness: 1, metalness: 0 })
    );
    o.rotation.x = -Math.PI / 2, o.position.set(0, 0, -70), s.add(o);
    const l = new n.MeshStandardMaterial({
      color: 402988,
      emissive: 1759487,
      emissiveIntensity: 0.85,
      roughness: 0.4
    });
    for (const t of [-3.55, 3.55]) {
      const r = new n.Mesh(new n.BoxGeometry(0.08, 0.18, 160), l);
      r.position.set(t, 0.1, -60), s.add(r);
    }
    this.dashes = [];
    const d = new n.MeshBasicMaterial({ color: 3814736 });
    for (let t = 0; t < 18; t += 1) {
      const r = new n.Mesh(new n.BoxGeometry(0.08, 0.02, 1.4), d);
      r.position.set(0, 0.03, 4 - t * 4), s.add(r), this.dashes.push(r);
      for (const c of [-1.15, 1.15]) {
        const u = new n.Mesh(new n.BoxGeometry(0.9, 0.015, 0.08), d);
        u.position.set(c, 0.025, 4 - t * 4), s.add(u), this.dashes.push(u);
      }
    }
    const f = new n.MeshBasicMaterial({ color: 3659519 });
    this.arches = [];
    for (let t = 0; t < 6; t += 1) {
      const r = new n.Mesh(new n.TorusGeometry(3.3, 0.035, 8, 24), f);
      r.position.set(0, 2.2, -8 - t * 16), s.add(r), this.arches.push(r);
    }
    const y = new Float32Array(240);
    for (let t = 0; t < 80; t += 1)
      y[t * 3] = (Math.random() - 0.5) * 12, y[t * 3 + 1] = Math.random() * 3.2, y[t * 3 + 2] = -Math.random() * 80;
    const M = new n.BufferGeometry();
    M.setAttribute("position", new n.BufferAttribute(y, 3)), this.dust = new n.Points(
      M,
      new n.PointsMaterial({ color: 12053759, size: 0.055, transparent: !0, opacity: 0.75 })
    ), s.add(this.dust), this.player.add(this.buildShip());
    const v = new n.PointLight(4846335, 6, 9, 2);
    v.position.set(0, 0.4, 0.2), this.player.add(v), s.add(this.player), this.blob = new n.Mesh(
      new n.CircleGeometry(0.48, 18),
      new n.MeshBasicMaterial({ color: 0, transparent: !0, opacity: 0.35 })
    ), this.blob.rotation.x = -Math.PI / 2, this.blob.position.y = 0.02, s.add(this.blob);
    const m = [
      new n.MeshStandardMaterial({
        color: 2756640,
        emissive: 16727434,
        emissiveIntensity: 0.8,
        roughness: 0.35
      }),
      new n.MeshStandardMaterial({
        color: 1709107,
        emissive: 9071615,
        emissiveIntensity: 0.75,
        roughness: 0.35
      }),
      new n.MeshStandardMaterial({
        color: 1058346,
        emissive: 4063218,
        emissiveIntensity: 0.7,
        roughness: 0.35
      })
    ];
    this.blocks = Array.from({ length: 12 }, (t, r) => {
      const c = m[r % m.length] ?? m[0];
      if (!c) throw new Error("missing block material");
      const u = new n.Mesh(new n.BoxGeometry(1.35, 1.55, 1.15), c);
      return u.position.y = 0.78, u.visible = !1, s.add(u), { mesh: u, lane: 1, z: 20, y: 0.78, active: !1 };
    });
    const k = new n.MeshStandardMaterial({
      color: 3810568,
      emissive: 16756768,
      emissiveIntensity: 0.9,
      roughness: 0.4
    });
    this.barriers = Array.from({ length: 8 }, () => {
      const t = new n.Mesh(new n.BoxGeometry(1.4, 0.42, 0.8), k);
      return t.position.y = 0.21, t.visible = !1, s.add(t), { mesh: t, lane: 1, z: 20, y: 0.21, active: !1 };
    });
    const P = new n.MeshStandardMaterial({
      color: 16770979,
      emissive: 16761162,
      emissiveIntensity: 0.7,
      metalness: 0.4,
      roughness: 0.25
    });
    this.coins = Array.from({ length: 14 }, () => {
      const t = new n.Mesh(new n.OctahedronGeometry(0.32, 0), P);
      return t.visible = !1, s.add(t), { mesh: t, lane: 1, z: 20, y: 0.9, active: !1 };
    }), this.flash = document.createElement("div"), this.flash.style.cssText = "position:absolute;inset:0;background:#ff2d2d;opacity:0;pointer-events:none;transition:opacity 160ms linear;z-index:1", e.appendChild(this.flash), this.syncPlayer(0), this.three.camera.lookAt(0, 0.8, -10);
  }
  begin() {
    this.status !== "over" && (this.status = "running");
  }
  reset() {
    this.status = "ready", this.lane = 1, this.x = 0, this.y = 0, this.vy = 0, this.speed = 18, this.score = 0, this.combo = 0, this.comboTimer = 0, this.elapsed = 0, this.spawnIn = 1.7, this.shake = 0, this.time = 0, this.player.rotation.set(0, 0, 0);
    for (const e of [...this.blocks, ...this.barriers, ...this.coins]) this.deactivate(e);
    this.syncPlayer(0);
  }
  /** Fixed step while the run is live. Returns true when this step ended the run. */
  simulate(e, s) {
    if (this.status !== "running") return !1;
    if (this.time += s, this.elapsed += s, this.speed = Math.min(42, 18 + this.elapsed * 0.42), e.laneDelta !== 0) {
      const o = E(this.lane + Math.sign(e.laneDelta), 0, 2);
      o !== this.lane && (this.lane = o, this.onLane?.());
    }
    const a = b[this.lane] ?? 0;
    this.x = G(this.x, a, 14, s), e.jump && this.y <= 1e-3 && (this.vy = 7.2, this.onJump?.()), this.vy -= 24 * s, this.y += this.vy * s, this.y < 0 && (this.y = 0, this.vy = 0), this.score += this.speed * s * 2.2, this.combo > 0 && (this.comboTimer -= s, this.comboTimer <= 0 && (this.combo = 0)), this.scrollDressing(s), this.spawnIn -= s, this.spawnIn <= 0 && (this.spawnPattern(), this.spawnIn = Math.max(0.5, 1.15 - this.elapsed * 7e-3));
    for (const o of this.blocks) this.advanceBlock(o, s);
    for (const o of this.barriers) this.advanceBarrier(o, s);
    for (const o of this.coins) this.advanceCoin(o, s);
    return this.shake = Math.max(0, this.shake - s * 2), this.status === "running" && this.syncPlayer(s), this.status !== "running";
  }
  tickCrashed(e) {
    this.time += e, this.shake = Math.max(0, this.shake - e), this.player.rotation.z += e * 2.4, this.player.rotation.x += e * 1.5, this.player.position.y = Math.max(0.2, this.player.position.y - e * 0.4);
  }
  render() {
    const e = this.three.camera, s = (Math.random() - 0.5) * this.shake * 0.35, a = (Math.random() - 0.5) * this.shake * 0.2;
    e.position.x = this.x * 0.38 + Math.sin(this.time * 1.6) * 0.06 + s, e.position.y = 4.45 + this.y * 0.18 + Math.sin(this.time * 2.1) * 0.04 + a, e.lookAt(this.x * 0.15, 0.75, -10), this.three.render();
  }
  dispose() {
    this.flash.remove(), this.three.dispose();
  }
  advanceBlock(e, s) {
    e.active && (this.slide(e, s), !(!e.active || this.status !== "running") && this.overlaps(e, 1, 0.8) && this.y < 1.15 && this.crash());
  }
  advanceBarrier(e, s) {
    e.active && (this.slide(e, s), !(!e.active || this.status !== "running") && this.overlaps(e, 0.98, 0.7) && this.y < 0.72 && this.crash());
  }
  advanceCoin(e, s) {
    if (!e.active || (this.slide(e, s), !e.active) || (e.mesh.rotation.y += s * 4, e.mesh.position.y = e.y + Math.sin(this.time * 5 + e.z) * 0.1, this.status !== "running")) return;
    const a = b[e.lane] ?? 0, o = Math.abs(a - this.x) < 0.95, l = Math.abs(e.z - 0.15) < 1.05, d = Math.abs(e.y - Math.max(0.7, this.y + 0.4)) < 1.15;
    o && l && d && this.collect(e);
  }
  slide(e, s) {
    e.z += this.speed * s, e.mesh.position.z = e.z, e.mesh.position.x = b[e.lane] ?? 0, e.z > 6 && this.deactivate(e);
  }
  overlaps(e, s, a) {
    const o = b[e.lane] ?? 0;
    return Math.abs(o - this.x) < s && Math.abs(e.z - 0.15) < a;
  }
  collect(e) {
    this.deactivate(e), this.combo += 1, this.comboTimer = 2.4;
    const s = 1 + Math.min(this.combo, 10) * 0.25;
    this.score += 40 * s, this.onCoin?.();
  }
  crash() {
    this.status === "running" && (this.status = "over", this.shake = 1, this.flash.style.opacity = "0.5", window.setTimeout(() => {
      this.flash.style.opacity = "0";
    }, 140));
  }
  spawnPattern() {
    const e = Math.random(), s = Math.floor(Math.random() * 3);
    if (e < 0.38)
      this.spawn(this.blocks, (s + 1) % 3, -58, 0.78), Math.random() < 0.55 && this.spawn(this.coins, s, -64, 0.95);
    else if (e < 0.66) {
      for (const a of [0, 1, 2])
        a !== s && this.spawn(this.blocks, a, -58, 0.78);
      this.spawn(this.coins, s, -58, 1);
    } else if (e < 0.86) {
      const a = s;
      this.spawn(this.barriers, a, -58, 0.21), this.spawn(this.coins, a, -64, 1.45);
    } else
      this.spawn(this.coins, 0, -58, 0.95), this.spawn(this.coins, 1, -62, 0.95), this.spawn(this.coins, 2, -66, 0.95);
  }
  spawn(e, s, a, o) {
    const l = e.find((d) => !d.active);
    l && (l.active = !0, l.lane = s, l.z = a, l.y = o, l.mesh.visible = !0, l.mesh.position.set(b[s] ?? 0, o, a));
  }
  deactivate(e) {
    e.active = !1, e.mesh.visible = !1, e.z = 30;
  }
  scrollDressing(e) {
    const s = this.speed * e;
    for (const o of this.dashes)
      o.position.z += s, o.position.z > 8 && (o.position.z -= 72);
    for (const o of this.arches)
      o.position.z += s, o.position.z > 8 && (o.position.z -= 96);
    const a = this.dust.geometry.getAttribute("position");
    if (a instanceof n.BufferAttribute) {
      for (let o = 0; o < a.count; o += 1) {
        let l = (a.getZ(o) ?? 0) + s;
        l > 6 && (l -= 80), a.setZ(o, l);
      }
      a.needsUpdate = !0;
    }
  }
  syncPlayer(e) {
    this.player.position.set(this.x, 0.55 + this.y, 0);
    const s = ((b[this.lane] ?? 0) - this.x) * -0.45;
    this.player.rotation.z = G(this.player.rotation.z, s, 10, Math.max(e, 1 / 60)), this.player.rotation.x = this.y > 0.04 ? -0.35 : 0, this.blob.position.x = this.x;
    const a = 1 / (1 + this.y * 0.85);
    this.blob.scale.setScalar(a);
    const o = this.blob.material;
    o instanceof n.MeshBasicMaterial && (o.opacity = 0.35 * a);
  }
  buildShip() {
    const e = new n.Group(), s = new n.Mesh(
      new n.BoxGeometry(0.86, 0.28, 1.35),
      new n.MeshStandardMaterial({
        color: 1193020,
        emissive: 3794943,
        emissiveIntensity: 0.55,
        roughness: 0.32,
        metalness: 0.25
      })
    );
    e.add(s);
    const a = new n.Mesh(
      new n.ConeGeometry(0.28, 0.55, 12),
      new n.MeshStandardMaterial({
        color: 15268863,
        emissive: 16777215,
        emissiveIntensity: 0.25,
        roughness: 0.2
      })
    );
    a.rotation.x = -Math.PI / 2, a.position.set(0, 0.02, -0.9), e.add(a);
    const o = new n.MeshBasicMaterial({ color: 16742972 });
    for (const l of [-0.24, 0.24]) {
      const d = new n.Mesh(new n.SphereGeometry(0.12, 12, 12), o);
      d.position.set(l, -0.02, 0.62), e.add(d);
    }
    return e;
  }
}
function G(i, e, s, a) {
  return i + (e - i) * (1 - Math.exp(-s * a));
}
function E(i, e, s) {
  return Math.min(s, Math.max(e, i));
}
function N() {
  R();
  let i = null, e = null, s = null;
  const a = [];
  let o = 0, l = !1, d = "";
  const f = { laneDelta: 0, jump: !1 }, y = {
    id: "over",
    enter() {
    },
    fixedUpdate(t) {
      i?.tickCrashed(t);
    }
  }, M = {
    id: "run",
    enter() {
      i?.reset();
    },
    input() {
      const t = s;
      !t || !i || (U(t, f), i.status === "ready" && X(t, f) && v(t));
    },
    fixedUpdate(t) {
      const r = s;
      if (!r || !i || i.status !== "running") return;
      const c = i.simulate(f, t);
      f.laneDelta = 0, f.jump = !1, m(r, !1), c && (k(r), e?.set(y));
    }
  };
  function v(t) {
    !i || i.status !== "ready" || (i.begin(), S(t.audio, "start"), m(t, !0));
  }
  function m(t, r) {
    if (!i) return;
    const c = Math.floor(i.score), u = t.store.getState().ui.locale, z = i.combo > 1 ? w(u, "neon.combo", { n: i.combo }) : w(u, "neon.speed", { n: Math.round(i.speed) }), T = `${i.status}:${c}:${z}`;
    if (!r && T === d) return;
    d = T;
    const B = Math.max(o, c);
    g(t.store, {
      id: p.id,
      status: i.status === "over" ? "over" : "running",
      score: c,
      highScore: B,
      message: "",
      detail: z,
      combo: i.combo
    });
  }
  function k(t) {
    if (l || !i) return;
    l = !0;
    const r = Math.floor(i.score), c = K(p.id, r), u = r > o && r > 0;
    g(t.store, {
      id: p.id,
      status: "over",
      score: r,
      highScore: c,
      message: w(t.store.getState().ui.locale, "neon.crash"),
      detail: i.combo > 1 ? w(t.store.getState().ui.locale, "neon.combo", { n: i.combo }) : w(t.store.getState().ui.locale, "neon.speed", { n: Math.round(i.speed) }),
      combo: i.combo
    }), t.events.emit("game:over", { gameId: p.id, score: r, best: c, isRecord: u }), S(t.audio, "crash");
  }
  async function P(t) {
    l = !1, o = A(p.id), d = "", i?.reset(), e?.getCurrent()?.id !== "run" && await e?.set(M), i?.begin(), i && g(t.store, {
      id: p.id,
      status: "running",
      score: 0,
      highScore: o,
      message: "",
      detail: w(t.store.getState().ui.locale, "neon.speed", { n: Math.round(i.speed) }),
      combo: 0
    });
  }
  return D(p, {
    async onPreload(t, r) {
      await t.preload([], r);
    },
    async onMount(t) {
      t.signal.aborted || (s = t, t.container.setAttribute("data-wgf-game", "wgf-game:neon"), i = new W(t.container), t.track(() => i?.dispose()), !t.signal.aborted && (i.onLane = () => S(t.audio, "lane"), i.onJump = () => S(t.audio, "jump"), i.onCoin = () => S(t.audio, "coin"), e = new L(t.loop), e.attach(), o = A(p.id), g(t.store, {
        id: p.id,
        status: "ready",
        score: 0,
        highScore: o,
        message: p.howToPlay,
        detail: "",
        combo: 0
      }), a.push(
        t.loop.onFrame(() => i?.render()),
        t.store.subscribe((r, c) => {
          r.ui.locale !== c.ui.locale && m(t, !0);
        }),
        t.events.on("game:start", () => v(t)),
        t.events.on("game:restart", () => {
          P(t);
        })
      ), await e.set(M), t.signal.aborted));
    },
    onPause(t) {
      t.store.getState().game.status === "running" && g(t.store, { status: "paused" });
    },
    onResume(t) {
      t.store.getState().game.status === "paused" && g(t.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const t of a) t();
      a.length = 0, e?.dispose(), e = null, i?.dispose(), i = null, s = null;
    }
  });
}
function U(i, e) {
  const s = i.input, a = s.getSwipe();
  (s.wasKeyPressed("ArrowLeft") || s.wasKeyPressed("KeyA") || a === "left") && (e.laneDelta -= 1), (s.wasKeyPressed("ArrowRight") || s.wasKeyPressed("KeyD") || a === "right") && (e.laneDelta += 1), (s.wasKeyPressed("Space") || s.wasKeyPressed("ArrowUp") || s.wasKeyPressed("KeyW") || a === "up") && (e.jump = !0);
}
function X(i, e) {
  return e.laneDelta !== 0 || e.jump || i.input.wasTap() || i.input.wasPointerPressed() || i.input.wasKeyPressed("Enter");
}
function S(i, e) {
  e === "lane" && i.playTone({ frequency: 540, duration: 0.05, type: "square", gain: 0.03 }), e === "jump" && i.playTone({ frequency: 320, duration: 0.12, type: "sine", gain: 0.04, slideTo: 720 }), e === "coin" && (i.playTone({ frequency: 880, duration: 0.06, type: "triangle", gain: 0.045 }), i.playTone({ frequency: 1320, duration: 0.08, type: "sine", gain: 0.03 })), e === "crash" && i.playTone({ frequency: 196, duration: 0.32, type: "sawtooth", gain: 0.05, slideTo: 48 }), e === "start" && i.playTone({ frequency: 420, duration: 0.1, type: "square", gain: 0.035, slideTo: 840 });
}
export {
  N as createGame,
  p as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/render-three":"0.1.0","three":"0.170.0"}};
