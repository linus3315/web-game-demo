var G = Object.defineProperty;
var A = (i, e, s) => e in i ? G(i, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[e] = s;
var r = (i, e, s) => A(i, typeof e != "symbol" ? e + "" : e, s);
import { defineGame as B, patchGame as w, SceneManager as I, readHighScore as x, writeHighScore as L } from "@wgf/core";
import { createThreeContext as C } from "@wgf/render-three";
import * as n from "three";
const D = {
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
  howToPlay: "← → 或 A / D 变道，↑、W 或空格跳跃。手机可滑动，也可以用屏幕按钮。",
  cover: "neon-rush",
  art: D,
  renderer: "three",
  controls: "lanes",
  tags: ["反应", "无尽"]
}, g = [-2.3, 0, 2.3];
class K {
  constructor(e) {
    r(this, "three");
    r(this, "status", "ready");
    r(this, "lane", 1);
    r(this, "x", 0);
    r(this, "y", 0);
    r(this, "vy", 0);
    r(this, "speed", 18);
    r(this, "score", 0);
    r(this, "combo", 0);
    r(this, "elapsed", 0);
    r(this, "onLane", null);
    r(this, "onJump", null);
    r(this, "onCoin", null);
    r(this, "spawnIn", 1.7);
    r(this, "comboTimer", 0);
    r(this, "time", 0);
    r(this, "shake", 0);
    r(this, "player", new n.Group());
    r(this, "blob");
    r(this, "blocks");
    r(this, "barriers");
    r(this, "coins");
    r(this, "dashes");
    r(this, "arches");
    r(this, "dust");
    r(this, "flash");
    this.three = C(e, {
      clearColor: 1052182,
      fov: 58,
      cameraPosition: [0, 4.5, 8.1]
    });
    const { scene: s } = this.three;
    s.fog = new n.Fog(1052182, 14, 78), s.add(new n.HemisphereLight(10205183, 1707272, 0.7));
    const o = new n.DirectionalLight(16773596, 1.15);
    o.position.set(6, 10, 4), s.add(o);
    const a = new n.Mesh(
      new n.PlaneGeometry(16, 180),
      new n.MeshStandardMaterial({ color: 1446684, roughness: 1, metalness: 0 })
    );
    a.rotation.x = -Math.PI / 2, a.position.set(0, 0, -70), s.add(a);
    const l = new n.MeshStandardMaterial({
      color: 402988,
      emissive: 1759487,
      emissiveIntensity: 0.85,
      roughness: 0.4
    });
    for (const t of [-3.55, 3.55]) {
      const h = new n.Mesh(new n.BoxGeometry(0.08, 0.18, 160), l);
      h.position.set(t, 0.1, -60), s.add(h);
    }
    this.dashes = [];
    const c = new n.MeshBasicMaterial({ color: 3814736 });
    for (let t = 0; t < 18; t += 1) {
      const h = new n.Mesh(new n.BoxGeometry(0.08, 0.02, 1.4), c);
      h.position.set(0, 0.03, 4 - t * 4), s.add(h), this.dashes.push(h);
      for (const d of [-1.15, 1.15]) {
        const u = new n.Mesh(new n.BoxGeometry(0.9, 0.015, 0.08), c);
        u.position.set(d, 0.025, 4 - t * 4), s.add(u), this.dashes.push(u);
      }
    }
    const f = new n.MeshBasicMaterial({ color: 3659519 });
    this.arches = [];
    for (let t = 0; t < 6; t += 1) {
      const h = new n.Mesh(new n.TorusGeometry(3.3, 0.035, 8, 24), f);
      h.position.set(0, 2.2, -8 - t * 16), s.add(h), this.arches.push(h);
    }
    const m = new Float32Array(240);
    for (let t = 0; t < 80; t += 1)
      m[t * 3] = (Math.random() - 0.5) * 12, m[t * 3 + 1] = Math.random() * 3.2, m[t * 3 + 2] = -Math.random() * 80;
    const M = new n.BufferGeometry();
    M.setAttribute("position", new n.BufferAttribute(m, 3)), this.dust = new n.Points(
      M,
      new n.PointsMaterial({ color: 12053759, size: 0.055, transparent: !0, opacity: 0.75 })
    ), s.add(this.dust), this.player.add(this.buildShip());
    const b = new n.PointLight(4846335, 6, 9, 2);
    b.position.set(0, 0.4, 0.2), this.player.add(b), s.add(this.player), this.blob = new n.Mesh(
      new n.CircleGeometry(0.48, 18),
      new n.MeshBasicMaterial({ color: 0, transparent: !0, opacity: 0.35 })
    ), this.blob.rotation.x = -Math.PI / 2, this.blob.position.y = 0.02, s.add(this.blob);
    const y = [
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
    this.blocks = Array.from({ length: 12 }, (t, h) => {
      const d = y[h % y.length] ?? y[0];
      if (!d) throw new Error("missing block material");
      const u = new n.Mesh(new n.BoxGeometry(1.35, 1.55, 1.15), d);
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
    const S = new n.MeshStandardMaterial({
      color: 16770979,
      emissive: 16761162,
      emissiveIntensity: 0.7,
      metalness: 0.4,
      roughness: 0.25
    });
    this.coins = Array.from({ length: 14 }, () => {
      const t = new n.Mesh(new n.OctahedronGeometry(0.32, 0), S);
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
      const a = q(this.lane + Math.sign(e.laneDelta), 0, 2);
      a !== this.lane && (this.lane = a, this.onLane?.());
    }
    const o = g[this.lane] ?? 0;
    this.x = z(this.x, o, 14, s), e.jump && this.y <= 1e-3 && (this.vy = 7.2, this.onJump?.()), this.vy -= 24 * s, this.y += this.vy * s, this.y < 0 && (this.y = 0, this.vy = 0), this.score += this.speed * s * 2.2, this.combo > 0 && (this.comboTimer -= s, this.comboTimer <= 0 && (this.combo = 0)), this.scrollDressing(s), this.spawnIn -= s, this.spawnIn <= 0 && (this.spawnPattern(), this.spawnIn = Math.max(0.5, 1.15 - this.elapsed * 7e-3));
    for (const a of this.blocks) this.advanceBlock(a, s);
    for (const a of this.barriers) this.advanceBarrier(a, s);
    for (const a of this.coins) this.advanceCoin(a, s);
    return this.shake = Math.max(0, this.shake - s * 2), this.status === "running" && this.syncPlayer(s), this.status !== "running";
  }
  tickCrashed(e) {
    this.time += e, this.shake = Math.max(0, this.shake - e), this.player.rotation.z += e * 2.4, this.player.rotation.x += e * 1.5, this.player.position.y = Math.max(0.2, this.player.position.y - e * 0.4);
  }
  render() {
    const e = this.three.camera, s = (Math.random() - 0.5) * this.shake * 0.35, o = (Math.random() - 0.5) * this.shake * 0.2;
    e.position.x = this.x * 0.38 + Math.sin(this.time * 1.6) * 0.06 + s, e.position.y = 4.45 + this.y * 0.18 + Math.sin(this.time * 2.1) * 0.04 + o, e.lookAt(this.x * 0.15, 0.75, -10), this.three.render();
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
    const o = g[e.lane] ?? 0, a = Math.abs(o - this.x) < 0.95, l = Math.abs(e.z - 0.15) < 1.05, c = Math.abs(e.y - Math.max(0.7, this.y + 0.4)) < 1.15;
    a && l && c && this.collect(e);
  }
  slide(e, s) {
    e.z += this.speed * s, e.mesh.position.z = e.z, e.mesh.position.x = g[e.lane] ?? 0, e.z > 6 && this.deactivate(e);
  }
  overlaps(e, s, o) {
    const a = g[e.lane] ?? 0;
    return Math.abs(a - this.x) < s && Math.abs(e.z - 0.15) < o;
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
      for (const o of [0, 1, 2])
        o !== s && this.spawn(this.blocks, o, -58, 0.78);
      this.spawn(this.coins, s, -58, 1);
    } else if (e < 0.86) {
      const o = s;
      this.spawn(this.barriers, o, -58, 0.21), this.spawn(this.coins, o, -64, 1.45);
    } else
      this.spawn(this.coins, 0, -58, 0.95), this.spawn(this.coins, 1, -62, 0.95), this.spawn(this.coins, 2, -66, 0.95);
  }
  spawn(e, s, o, a) {
    const l = e.find((c) => !c.active);
    l && (l.active = !0, l.lane = s, l.z = o, l.y = a, l.mesh.visible = !0, l.mesh.position.set(g[s] ?? 0, a, o));
  }
  deactivate(e) {
    e.active = !1, e.mesh.visible = !1, e.z = 30;
  }
  scrollDressing(e) {
    const s = this.speed * e;
    for (const a of this.dashes)
      a.position.z += s, a.position.z > 8 && (a.position.z -= 72);
    for (const a of this.arches)
      a.position.z += s, a.position.z > 8 && (a.position.z -= 96);
    const o = this.dust.geometry.getAttribute("position");
    if (o instanceof n.BufferAttribute) {
      for (let a = 0; a < o.count; a += 1) {
        let l = (o.getZ(a) ?? 0) + s;
        l > 6 && (l -= 80), o.setZ(a, l);
      }
      o.needsUpdate = !0;
    }
  }
  syncPlayer(e) {
    this.player.position.set(this.x, 0.55 + this.y, 0);
    const s = ((g[this.lane] ?? 0) - this.x) * -0.45;
    this.player.rotation.z = z(this.player.rotation.z, s, 10, Math.max(e, 1 / 60)), this.player.rotation.x = this.y > 0.04 ? -0.35 : 0, this.blob.position.x = this.x;
    const o = 1 / (1 + this.y * 0.85);
    this.blob.scale.setScalar(o);
    const a = this.blob.material;
    a instanceof n.MeshBasicMaterial && (a.opacity = 0.35 * o);
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
    const o = new n.Mesh(
      new n.ConeGeometry(0.28, 0.55, 12),
      new n.MeshStandardMaterial({
        color: 15268863,
        emissive: 16777215,
        emissiveIntensity: 0.25,
        roughness: 0.2
      })
    );
    o.rotation.x = -Math.PI / 2, o.position.set(0, 0.02, -0.9), e.add(o);
    const a = new n.MeshBasicMaterial({ color: 16742972 });
    for (const l of [-0.24, 0.24]) {
      const c = new n.Mesh(new n.SphereGeometry(0.12, 12, 12), a);
      c.position.set(l, -0.02, 0.62), e.add(c);
    }
    return e;
  }
}
function z(i, e, s, o) {
  return i + (e - i) * (1 - Math.exp(-s * o));
}
function q(i, e, s) {
  return Math.min(s, Math.max(e, i));
}
function X() {
  let i = null, e = null, s = null;
  const o = [];
  let a = 0, l = !1, c = "";
  const f = { laneDelta: 0, jump: !1 }, m = {
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
      !t || !i || ($(t, f), i.status === "ready" && j(t, f) && b(t));
    },
    fixedUpdate(t) {
      const h = s;
      if (!h || !i || i.status !== "running") return;
      const d = i.simulate(f, t);
      f.laneDelta = 0, f.jump = !1, y(h, !1), d && (k(h), e?.set(m));
    }
  };
  function b(t) {
    !i || i.status !== "ready" || (i.begin(), v(t.audio, "start"), y(t, !0));
  }
  function y(t, h) {
    if (!i) return;
    const d = Math.floor(i.score), u = i.combo > 1 ? `连击 ×${i.combo}` : `速度 ${Math.round(i.speed)}`, P = `${i.status}:${d}:${u}`;
    if (!h && P === c) return;
    c = P;
    const T = Math.max(a, d);
    w(t.store, {
      id: p.id,
      status: i.status === "over" ? "over" : "running",
      score: d,
      highScore: T,
      message: "",
      detail: u,
      combo: i.combo
    });
  }
  function k(t) {
    if (l || !i) return;
    l = !0;
    const h = Math.floor(i.score), d = L(p.id, h), u = h > a && h > 0;
    w(t.store, {
      id: p.id,
      status: "over",
      score: h,
      highScore: d,
      message: "撞上了。再来一局？",
      detail: i.combo > 1 ? `连击 ×${i.combo}` : `速度 ${Math.round(i.speed)}`,
      combo: i.combo
    }), t.events.emit("game:over", { gameId: p.id, score: h, best: d, isRecord: u }), v(t.audio, "crash");
  }
  async function S(t) {
    l = !1, a = x(p.id), c = "", i?.reset(), e?.getCurrent()?.id !== "run" && await e?.set(M), i?.begin(), i && w(t.store, {
      id: p.id,
      status: "running",
      score: 0,
      highScore: a,
      message: "",
      detail: `速度 ${Math.round(i.speed)}`,
      combo: 0
    });
  }
  return B(p, {
    async onMount(t) {
      t.signal.aborted || (s = t, t.container.setAttribute("data-wgf-game", "wgf-game:neon"), i = new K(t.container), t.track(() => i?.dispose()), !t.signal.aborted && (i.onLane = () => v(t.audio, "lane"), i.onJump = () => v(t.audio, "jump"), i.onCoin = () => v(t.audio, "coin"), e = new I(t.loop), e.attach(), a = x(p.id), w(t.store, {
        id: p.id,
        status: "ready",
        score: 0,
        highScore: a,
        message: p.howToPlay,
        detail: "",
        combo: 0
      }), o.push(
        t.loop.onFrame(() => i?.render()),
        t.events.on("game:start", () => b(t)),
        t.events.on("game:restart", () => {
          S(t);
        })
      ), await e.set(M), t.signal.aborted));
    },
    onPause(t) {
      t.store.getState().game.status === "running" && w(t.store, { status: "paused" });
    },
    onResume(t) {
      t.store.getState().game.status === "paused" && w(t.store, { status: "running", message: "" });
    },
    onDestroy() {
      for (const t of o) t();
      o.length = 0, e?.dispose(), e = null, i?.dispose(), i = null, s = null;
    }
  });
}
function $(i, e) {
  const s = i.input, o = s.getSwipe();
  (s.wasKeyPressed("ArrowLeft") || s.wasKeyPressed("KeyA") || o === "left") && (e.laneDelta -= 1), (s.wasKeyPressed("ArrowRight") || s.wasKeyPressed("KeyD") || o === "right") && (e.laneDelta += 1), (s.wasKeyPressed("Space") || s.wasKeyPressed("ArrowUp") || s.wasKeyPressed("KeyW") || o === "up") && (e.jump = !0);
}
function j(i, e) {
  return e.laneDelta !== 0 || e.jump || i.input.wasTap() || i.input.wasPointerPressed() || i.input.wasKeyPressed("Enter");
}
function v(i, e) {
  e === "lane" && i.playTone({ frequency: 540, duration: 0.05, type: "square", gain: 0.03 }), e === "jump" && i.playTone({ frequency: 320, duration: 0.12, type: "sine", gain: 0.04, slideTo: 720 }), e === "coin" && (i.playTone({ frequency: 880, duration: 0.06, type: "triangle", gain: 0.045 }), i.playTone({ frequency: 1320, duration: 0.08, type: "sine", gain: 0.03 })), e === "crash" && i.playTone({ frequency: 196, duration: 0.32, type: "sawtooth", gain: 0.05, slideTo: 48 }), e === "start" && i.playTone({ frequency: 420, duration: 0.1, type: "square", gain: 0.035, slideTo: 840 });
}
export {
  X as createGame,
  p as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/render-three":"0.1.0","three":"0.170.0"}};
