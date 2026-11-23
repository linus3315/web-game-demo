var K = Object.defineProperty;
var Y = (s, e, o) => e in s ? K(s, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : s[e] = o;
var y = (s, e, o) => Y(s, typeof e != "symbol" ? e + "" : e, o);
import { defineGame as J, patchGame as G } from "@wgf/core";
import { TokenStore as V, HttpClient as Q } from "@wgf/net";
import { Scene as X, PerspectiveCamera as Z, Group as R, WebGLRenderer as tt, SRGBColorSpace as F, Color as N, AmbientLight as et, DirectionalLight as ot, Mesh as g, BoxGeometry as k, MeshStandardMaterial as x, CylinderGeometry as H, SphereGeometry as nt, PlaneGeometry as st, MeshPhysicalMaterial as rt, CanvasTexture as at } from "three";
const it = {
  background: "#8a552c",
  shapes: [
    { tag: "rect", attrs: { x: 28, y: 36, width: 264, height: 150, rx: 18, fill: "#c4894a" } },
    { tag: "rect", attrs: { x: 48, y: 58, width: 224, height: 12, rx: 6, fill: "#8d4e28" } },
    { tag: "circle", attrs: { cx: 78, cy: 96, r: 12, fill: "#e63946" } },
    { tag: "circle", attrs: { cx: 114, cy: 108, r: 12, fill: "#1d70f5" } },
    { tag: "circle", attrs: { cx: 150, cy: 90, r: 12, fill: "#f4c430" } },
    { tag: "circle", attrs: { cx: 186, cy: 112, r: 12, fill: "#2ec27e" } },
    { tag: "circle", attrs: { cx: 222, cy: 98, r: 12, fill: "#9b5de5" } },
    { tag: "rect", attrs: { x: 70, y: 150, width: 18, height: 28, rx: 3, fill: "#ff7b00" } },
    { tag: "rect", attrs: { x: 96, y: 146, width: 18, height: 32, rx: 3, fill: "#e63946" } },
    { tag: "rect", attrs: { x: 122, y: 154, width: 18, height: 24, rx: 3, fill: "#f4c430" } },
    { tag: "rect", attrs: { x: 200, y: 148, width: 64, height: 14, rx: 4, fill: "#f7f4ea" } }
  ]
}, P = {
  id: "plinko-3d",
  name: "弹珠赛跑",
  description: "六颗玻璃弹珠在木制机关赛道上自动冲线。猜冠军、颜色或前三。娱乐积分，不能兑换。",
  tip: "比赛开始前选定注额和玩法。名次由服务器决定，赛道只负责表演。",
  howToPlay: "默认 6 颗编号弹珠。开赛前可以猜冠军号码、颜色、大小单双，或猜谁能进前三，可以同时下几注。点开始比赛后轨道自动跑完，约二十秒，快进是两倍速。没有操控。试玩地址加 ?debug=1 可以指定冠军。",
  copy: {
    en: {
      name: "Marble Race",
      description: "Six glass marbles race a wooden contraption on their own. Bet the winner, a colour, or the top three. Play credits only.",
      howToPlay: "Pick a stake and one or more bets, then start. The server chooses the finishing order and the track plays it out. Fast-forward is twice speed. Add ?debug=1 to force the winner in a demo.",
      tip: "The race is a spectator event. You cannot steer a marble."
    }
  },
  cover: "plinko-3d",
  art: it,
  renderer: "three",
  controls: "pointer",
  tags: ["弹珠", "联网"],
  theme: { accent: "#f0a04b", accentInk: "#2a160c", glow: "#e63946", radius: 18, font: "sans" }
}, M = [
  { id: 1, name: "红", color: "#e63946", ink: "#ffffff" },
  { id: 2, name: "蓝", color: "#1d70f5", ink: "#ffffff" },
  { id: 3, name: "黄", color: "#f4c430", ink: "#1a120c" },
  { id: 4, name: "绿", color: "#2ec27e", ink: "#10210f" },
  { id: 5, name: "紫", color: "#9b5de5", ink: "#ffffff" },
  { id: 6, name: "橙", color: "#ff7b00", ink: "#1a120c" }
];
function L(s, e = M) {
  return e.find((o) => o.id === s);
}
function _(s = M) {
  return s.map((e) => e.id);
}
const j = [10, 20, 50, 100], $ = {
  winner: 5.5,
  color: 5.5,
  size: 1.92,
  parity: 1.92,
  top3: 1.9
};
function ct(s, e) {
  return s > Math.floor(e / 2) ? "big" : "small";
}
function lt(s) {
  return s % 2 === 0 ? "even" : "odd";
}
function B(s) {
  return s.type === "winner" || s.type === "top3" ? `${s.type}:${s.marble}` : s.type === "color" ? `color:${s.color.toLowerCase()}` : `${s.type}:${s.side}`;
}
function dt(s, e, o = null) {
  const n = s.filter((t) => t !== o);
  for (let t = n.length - 1; t > 0; t -= 1) {
    const r = Math.floor(e() * (t + 1)), a = n[r], l = n[t];
    a === void 0 || l === void 0 || (n[t] = a, n[r] = l);
  }
  return o !== null && s.includes(o) ? [o, ...n] : n;
}
function ut(s, e, o, n = M) {
  const t = s[0], r = t === void 0 ? void 0 : L(t, n), a = new Set(s.slice(0, Math.min(3, s.length))), l = [];
  let m = 0;
  for (const f of e) {
    let w = !1, b = 0;
    f.type === "winner" ? (w = f.marble === t, b = $.winner) : f.type === "color" ? (w = r?.color.toLowerCase() === f.color.toLowerCase(), b = $.color) : f.type === "size" ? (w = t !== void 0 && ct(t, n.length) === f.side, b = $.size) : f.type === "parity" ? (w = t !== void 0 && lt(t) === f.side, b = $.parity) : (w = a.has(f.marble), b = $.top3);
    const v = w ? Math.round(o * b) : 0;
    m += v, l.push({ pick: f, hit: w, payout: v });
  }
  return { payout: m, results: l };
}
const ht = [
  { x: 0, y: 2.35, z: 7.15 },
  { x: 0.05, y: 2.12, z: 6.15 },
  { x: -0.42, y: 1.82, z: 4.85 },
  { x: 0.48, y: 1.52, z: 3.55 },
  { x: -0.28, y: 1.24, z: 2.25 },
  { x: 0.36, y: 1.02, z: 0.95 },
  { x: -0.46, y: 0.8, z: -0.35 },
  { x: 0.4, y: 0.6, z: -1.7 },
  { x: -0.18, y: 0.42, z: -3.05 },
  { x: 0.08, y: 0.28, z: -4.35 },
  { x: 0, y: 0.16, z: -5.55 },
  { x: 0, y: 0.1, z: -6.7 }
], E = {
  chute: [0.14, 0.18, 0.23, 0.28],
  wheel: 0.4,
  seesaw: 0.52,
  dominos: [0.7, 0.725, 0.75, 0.775, 0.8, 0.825]
};
function O(s) {
  return Math.min(1, Math.max(0, s));
}
function q(s, e, o) {
  return s + (e - s) * o;
}
function ft(s, e) {
  if (s.length === 0) return { x: 0, y: 0, z: 0 };
  const o = s.length - 1, n = O(e) * o, t = Math.min(o - 1, Math.floor(n)), r = s[t + 1] ?? s[t], a = s[t];
  if (!a || !r) return { x: 0, y: 0, z: 0 };
  const l = n - t;
  return {
    x: q(a.x, r.x, l),
    y: q(a.y, r.y, l),
    z: q(a.z, r.z, l)
  };
}
function S(s) {
  return ft(ht, s);
}
function A(s, e, o) {
  const n = s.indexOf(e), t = s.length;
  if (n < 0 || t === 0) return 0;
  const r = t === 1 ? 0 : 0.25, a = 1 - n / Math.max(1, t - 1) * r, l = O(o), m = l * l * (3 - 2 * l), f = Math.sin(Math.PI * Math.min(1, l / 0.86)), w = (Math.sin(l * Math.PI * 5.2 + e * 1.37) * 0.05 + Math.sin(l * Math.PI * 2.35 + e * 2.05) * 0.034) * f;
  let b = m * 0.9 + w;
  if (l > 0.86) {
    const v = (l - 0.86) / 0.14;
    b = b * (1 - v) + a * v;
  }
  return O(b);
}
function pt(s, e) {
  return { x: ((e <= 1 ? 0.5 : (s - 1) / (e - 1)) - 0.5) * 2.15, y: 2.38, z: 7.2 };
}
function I(s, e, o) {
  const n = s.length;
  if (o < 0.045) return pt(e, Math.max(n, e));
  const t = A(s, e, o), r = S(t), a = S(Math.min(1, t + 0.02)), l = a.x - r.x, m = a.z - r.z, f = Math.hypot(l, m) || 1, w = -m / f, b = (1 - O((t - 0.78) / 0.16)) * 0.72, v = Math.sin(t * 10.5 + e * 1.4) * b;
  return { x: r.x + w * v, y: r.y, z: r.z };
}
function bt(s, e) {
  return [...s].sort(
    (o, n) => A(s, n, e) - A(s, o, e) || o - n
  );
}
function mt(s, e, o) {
  return s.some((n) => A(s, n, e) >= o);
}
class gt {
  constructor(e) {
    y(this, "renderer");
    y(this, "scene", new X());
    y(this, "camera", new Z(38, 1, 0.08, 80));
    y(this, "root", new R());
    y(this, "marbles", []);
    y(this, "dominos", []);
    y(this, "wheel");
    y(this, "seesaw");
    y(this, "gate");
    y(this, "order", M.map((e) => e.id));
    y(this, "follow", !1);
    y(this, "width", 1);
    y(this, "height", 1);
    y(this, "disposed", !1);
    const o = document.createElement("canvas");
    o.className = "marble-canvas", this.renderer = new tt({
      canvas: o,
      antialias: !0,
      alpha: !1,
      preserveDrawingBuffer: !0
    }), this.renderer.outputColorSpace = F, this.renderer.setClearColor(6963492, 1), o.style.width = "100%", o.style.height = "100%", o.style.display = "block", e.appendChild(o), this.scene.background = new N(9065772), this.scene.add(this.root), this.scene.add(new et(16773596, 0.72));
    const n = new ot(16774884, 1.15);
    n.position.set(4, 10, 6), this.scene.add(n), this.buildTable(), this.buildCourse(), this.wheel = this.buildWheel(), this.seesaw = this.buildSeesaw(), this.gate = this.buildGate(), this.dominos = this.buildDominos(), this.buildFinish(), this.buildMarbles(), this.frame(0);
  }
  setOrder(e) {
    this.order = [...e];
  }
  setFollow(e) {
    this.follow = e;
  }
  resize(e, o) {
    this.width = Math.max(1, e), this.height = Math.max(1, o);
    const n = Math.min(1.75, window.devicePixelRatio || 1);
    this.renderer.setPixelRatio(n), this.renderer.setSize(this.width, this.height, !1), this.camera.aspect = this.width / this.height, this.camera.updateProjectionMatrix();
  }
  /** `t` is 0 at the gate and 1 at the finish. */
  frame(e) {
    if (this.disposed) return;
    const o = this.order;
    for (const n of this.marbles) {
      const t = I(o, n.id, e);
      n.mesh.position.set(t.x, t.y + 0.16, t.z), n.mesh.rotation.x = -t.z * 3.2, n.mesh.rotation.z = t.x * 2.4, n.shadow.position.set(t.x, 0.045, t.z);
    }
    this.gate.position.y = 2.7 + Math.min(1, e / 0.05) * 3.4, this.wheel.rotation.z = e * 14, this.seesaw.rotation.z = Math.sin(e * Math.PI * 3.5) * 0.28;
    for (const n of this.dominos) {
      const t = mt(o, e, n.mark) ? 1 : 0;
      n.mesh.rotation.x = t * 1.25;
    }
    this.placeCamera(e), this.renderer.render(this.scene, this.camera);
  }
  destroy() {
    this.disposed = !0, this.renderer.dispose(), this.renderer.domElement.remove();
  }
  placeCamera(e) {
    if (!this.follow) {
      this.camera.position.set(0.15, 11.2, 13.2), this.camera.lookAt(0, 0.15, -0.6);
      return;
    }
    let o = this.order[0] ?? 1, n = -1;
    for (const m of this.order) {
      const f = I(this.order, m, e).z;
      (n < 0 || f < n) && (n = f, o = m);
    }
    const t = I(this.order, o, e), r = e > 0.9 ? (e - 0.9) / 0.1 : 0, a = 2.55 - r * 0.7, l = 3.1 - r * 1.1;
    this.camera.position.set(t.x * 0.35 + 0.4, t.y + a, t.z + l), this.camera.lookAt(t.x, t.y + 0.2, t.z - 1.4);
  }
  buildTable() {
    const e = new g(
      new k(7.2, 0.28, 16.2),
      new x({ color: 12880202, roughness: 0.72 })
    );
    e.position.set(0, -0.14, 0.2), this.root.add(e);
    const o = new g(
      new k(5.6, 0.04, 14.6),
      new x({ color: 14131548, roughness: 0.84 })
    );
    o.position.set(0, 0.02, 0.2), this.root.add(o);
  }
  buildCourse() {
    const e = new x({ color: 9260584, roughness: 0.6 }), o = [15087942, 1929461, 16041008, 3064446, 10182117, 16743168];
    for (let n = 0; n < 28; n += 1) {
      const t = n / 27, r = S(t), a = S(Math.min(1, t + 0.03)), l = a.x - r.x, m = a.z - r.z, f = Math.hypot(l, m) || 1;
      for (const w of [-1, 1]) {
        const b = new g(new k(0.12, 0.28, 0.36), e);
        b.position.set(r.x + -m / f * w * 1.05, r.y + 0.12, r.z), this.root.add(b);
      }
    }
    E.chute.forEach((n, t) => {
      const r = S(n), a = new g(
        new H(0.11, 0.11, 0.34, 12),
        new x({ color: o[t % o.length], roughness: 0.45 })
      );
      a.position.set(r.x + (t % 2 === 0 ? -0.28 : 0.28), r.y + 0.2, r.z), this.root.add(a);
    });
  }
  buildWheel() {
    const e = new R(), o = S(E.wheel);
    e.position.set(o.x, o.y + 0.28, o.z);
    const n = new g(
      new H(0.18, 0.18, 0.16, 16),
      new x({ color: 16041008, roughness: 0.4 })
    );
    n.rotation.x = Math.PI / 2, e.add(n);
    const t = new x({ color: 14711343, roughness: 0.5 });
    for (let r = 0; r < 4; r += 1) {
      const a = new g(new k(0.9, 0.08, 0.12), t);
      a.rotation.z = r * Math.PI / 2, e.add(a);
    }
    return this.root.add(e), e;
  }
  buildSeesaw() {
    const e = new R(), o = S(E.seesaw);
    e.position.set(o.x, o.y + 0.16, o.z);
    const n = new g(
      new k(1.35, 0.08, 0.28),
      new x({ color: 2792847, roughness: 0.48 })
    );
    e.add(n);
    const t = new g(
      new k(0.16, 0.16, 0.28),
      new x({ color: 7027234, roughness: 0.6 })
    );
    return t.position.y = -0.1, e.add(t), this.root.add(e), e;
  }
  buildGate() {
    const e = new g(
      new k(2.4, 0.12, 0.1),
      new x({ color: 16052454, roughness: 0.4 })
    ), o = S(0.02);
    return e.position.set(o.x, 2.55, o.z), this.root.add(e), e;
  }
  buildDominos() {
    const e = [15087942, 16041008, 1929461, 3064446, 16743168, 10182117];
    return E.dominos.map((o, n) => {
      const t = S(o), r = new g(
        new k(0.16, 0.42, 0.08),
        new x({ color: e[n % e.length], roughness: 0.45 })
      );
      return r.geometry.translate(0, 0.21, 0), r.position.set(t.x, t.y, t.z), this.root.add(r), { mark: o, mesh: r };
    });
  }
  buildFinish() {
    const e = S(0.98), o = new x({ color: 16250090, roughness: 0.35 }), n = new x({ color: 1708556, roughness: 0.4 });
    for (const a of [-0.42, 0.42]) {
      const l = new g(new k(0.1, 0.7, 0.1), o);
      l.position.set(e.x + a, e.y + 0.35, e.z), this.root.add(l);
    }
    const t = new g(new k(0.94, 0.1, 0.1), n);
    t.position.set(e.x, e.y + 0.68, e.z), this.root.add(t);
    const r = new g(
      new k(0.7, 0.05, 1.4),
      new x({ color: 15192993, roughness: 0.55 })
    );
    r.position.set(e.x, e.y + 0.04, e.z + 0.2), this.root.add(r);
    for (let a = 0; a < 3; a += 1) {
      const l = new g(
        new k(0.28, 0.08 + a * 0.05, 0.28),
        new x({ color: a === 0 ? 16041008 : 14131548, roughness: 0.5 })
      );
      l.position.set(e.x + (a - 1) * 0.34, 0.06, e.z - 0.85), this.root.add(l);
    }
  }
  buildMarbles() {
    const e = new nt(0.16, 28, 20), o = new st(0.28, 0.28);
    for (const n of M) {
      const t = new rt({
        color: new N(n.color),
        map: wt(n.color, n.ink, n.id),
        roughness: 0.12,
        metalness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.08
      }), r = new g(e, t), a = new g(
        o,
        new x({ color: 3810324, transparent: !0, opacity: 0.28 })
      );
      a.rotation.x = -Math.PI / 2, this.root.add(r), this.root.add(a), this.marbles.push({ id: n.id, mesh: r, shadow: a });
    }
  }
}
function wt(s, e, o) {
  const n = document.createElement("canvas");
  n.width = 256, n.height = 256;
  const t = n.getContext("2d");
  if (!t) throw new Error("marble label");
  t.fillStyle = s, t.fillRect(0, 0, 256, 256), t.strokeStyle = "rgba(255,255,255,0.9)", t.lineWidth = 14, t.beginPath(), t.arc(128, 128, 92, 0, Math.PI * 2), t.stroke(), t.fillStyle = e, t.font = "800 132px Outfit, sans-serif", t.textAlign = "center", t.textBaseline = "middle", t.fillText(String(o), 128, 136);
  const r = new at(n);
  return r.colorSpace = F, r.needsUpdate = !0, r;
}
const yt = {}, xt = "wgf:plinko-guest", kt = "wgf:session", vt = 21;
function zt() {
  return J(P, {
    async onMount(s) {
      s.container.setAttribute("data-wgf-game", "wgf-game:plinko-3d");
      const e = document.createElement("div");
      e.className = "marble", e.dataset.phase = "bet", e.innerHTML = $t(), s.container.appendChild(e);
      const o = e.querySelector(".marble-stage");
      if (!o) return;
      const n = new gt(o), t = {
        bet: 20,
        credits: 1e3,
        source: "本地开奖（这局连不上服务器）",
        picks: [],
        order: _(),
        racing: !1,
        raceT: 0,
        fast: !1,
        follow: !1,
        winner: null,
        history: [],
        payout: 0,
        debug: new URLSearchParams(location.search).get("debug") === "1",
        tab: "winner"
      }, r = () => {
        n.resize(o.clientWidth, o.clientHeight);
      }, a = new ResizeObserver(() => r());
      a.observe(o), s.track(() => a.disconnect()), s.track(() => n.destroy()), r(), Mt(t).then(() => z());
      const l = s.loop.onUpdate((c) => {
        if (!t.racing) {
          n.frame(0);
          return;
        }
        const i = t.fast ? 2 : 1;
        t.raceT = Math.min(1, t.raceT + c * i / vt), n.setOrder(t.order), n.frame(t.raceT), v(), t.raceT >= 1 && b();
      });
      s.track(l), e.addEventListener("click", (c) => {
        const i = c.target;
        if (!(i instanceof Element)) return;
        if (i.closest("[data-lobby-menu]")) {
          document.querySelector("[data-menu]")?.click();
          return;
        }
        const h = i.closest("button[data-tab]");
        if (h?.dataset.tab) {
          t.tab = h.dataset.tab, z();
          return;
        }
        const d = i.closest("[data-add]");
        if (d?.dataset.add) {
          f(d.dataset.add);
          return;
        }
        if (i.closest("[data-bet-dec]")) {
          m(-1);
          return;
        }
        if (i.closest("[data-bet-inc]")) {
          m(1);
          return;
        }
        if (i.closest("[data-fast]")) {
          t.fast = !t.fast, z();
          return;
        }
        if (i.closest("[data-camera]")) {
          t.follow = !t.follow, n.setFollow(t.follow), z();
          return;
        }
        if (i.closest("[data-again]")) {
          t.racing = !1, t.raceT = 0, t.picks = [], e.dataset.phase = "bet", z();
          return;
        }
        i.closest("[data-race]") && w();
      }), e.addEventListener("change", (c) => {
        const i = c.target;
        !(i instanceof HTMLSelectElement) || !i.matches("[data-debug-winner]") || (t.winner = i.value === "random" ? null : Number(i.value));
      });
      function m(c) {
        const i = j.indexOf(t.bet), h = j[i + c];
        h !== void 0 && (t.bet = h), z();
      }
      function f(c) {
        if (t.racing) return;
        const i = t.picks.findIndex((h) => B(h) === c);
        if (i >= 0)
          t.picks.splice(i, 1);
        else {
          const h = St(c);
          h && t.picks.push(h);
        }
        z();
      }
      async function w() {
        if (t.racing || t.picks.length === 0) return;
        const c = t.bet * t.picks.length;
        if (c > t.credits) return;
        const i = `m_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
        let d = (() => {
          const u = dt(_(), Math.random, t.debug ? t.winner : null), p = ut(u, t.picks, t.bet);
          return t.credits = t.credits - c + p.payout, { order: u, payout: p.payout, credits: t.credits, source: t.source };
        })();
        try {
          const u = W(), p = await Promise.race([
            u.post("/api/marble/race", {
              bet: t.bet,
              spinId: i,
              picks: t.picks,
              winner: t.debug ? t.winner : void 0
            }),
            new Promise((T, C) => {
              window.setTimeout(() => C(new Error("offline")), 700);
            })
          ]);
          Array.isArray(p.order) && p.order.length === M.length && (d = {
            order: p.order.map(Number),
            payout: Number(p.payout) || 0,
            credits: Number(p.credits),
            source: "服务器开奖"
          }, t.credits = d.credits, t.source = d.source);
        } catch {
          t.source = "本地开奖（这局连不上服务器）";
        }
        t.order = d.order, t.payout = d.payout, t.follow = !0, n.setFollow(!0), t.racing = !0, t.raceT = 0, e.dataset.phase = "live", e.dataset.winner = "", n.setOrder(t.order), z();
      }
      function b() {
        if (e.dataset.phase === "done") return;
        t.racing = !1, e.dataset.phase = "done";
        const c = t.order[0];
        c !== void 0 && (e.dataset.winner = String(c), t.history.unshift(c), t.history = t.history.slice(0, 8)), z();
      }
      function v() {
        const c = e.querySelector("[data-hud]");
        if (!c) return;
        const i = bt(t.order, t.raceT);
        c.innerHTML = i.map((h, d) => {
          const u = L(h);
          return `<span class="marble-chip" style="background:${u?.color ?? "#888"};color:${u?.ink ?? "#fff"}">${d + 1}·${h}</span>`;
        }).join("");
      }
      function z() {
        e.dataset.phase = t.racing ? "live" : e.dataset.phase === "done" ? "done" : "bet", e.classList.toggle("is-live", e.dataset.phase === "live"), e.classList.toggle("is-done", e.dataset.phase === "done");
        const c = e.querySelector("[data-balance]");
        c && (c.textContent = String(t.credits));
        const i = e.querySelector("[data-source]");
        i && (i.textContent = t.source);
        const h = e.querySelector("[data-amount]");
        h && (h.textContent = String(t.bet));
        const d = e.querySelector("[data-total]");
        d && (d.textContent = String(t.bet * t.picks.length));
        const u = e.querySelector("[data-race]");
        u && e.dataset.phase !== "done" && (u.disabled = t.picks.length === 0 || t.bet * t.picks.length > t.credits, u.textContent = "开始比赛");
        const p = e.querySelector("[data-fast]");
        p && p.classList.toggle("is-on", t.fast);
        const T = e.querySelector("[data-camera]");
        T && (T.textContent = t.follow ? "跟随" : "全景"), U(), D(), v();
        const C = e.querySelector("[data-debug]");
        C && (C.hidden = !t.debug);
      }
      function U() {
        const c = e.querySelector("[data-board]");
        if (!c) return;
        const i = t.tab, h = new Set(t.picks.map(B));
        if (i === "winner" || i === "top3")
          c.innerHTML = M.map((d) => {
            const u = `${i}:${d.id}`;
            return `<button type="button" class="marble-pick${h.has(u) ? " is-on" : ""}" data-add="${u}" data-pick="${d.id}" style="--swatch:${d.color};color:${d.ink}">${d.id}</button>`;
          }).join("");
        else if (i === "color")
          c.innerHTML = M.map((d) => {
            const u = `color:${d.color.toLowerCase()}`;
            return `<button type="button" class="marble-pick${h.has(u) ? " is-on" : ""}" data-add="${u}" style="--swatch:${d.color};color:${d.ink}">${d.name}</button>`;
          }).join("");
        else {
          const d = [
            ["size:big", "大 4–6"],
            ["size:small", "小 1–3"],
            ["parity:odd", "单"],
            ["parity:even", "双"]
          ];
          c.innerHTML = d.map(
            ([u, p]) => `<button type="button" class="marble-pick marble-wide${h.has(u) ? " is-on" : ""}" data-add="${u}">${p}</button>`
          ).join("");
        }
        e.querySelectorAll("button[data-tab]").forEach((d) => {
          d.classList.toggle("is-on", d.dataset.tab === i);
        });
      }
      function D() {
        const c = e.querySelector("[data-result]");
        if (!c) return;
        if (e.dataset.phase !== "done") {
          c.hidden = !0;
          return;
        }
        c.hidden = !1;
        const i = t.order.slice(0, 3).map((u, p) => {
          const T = L(u);
          return `<b style="background:${T?.color};color:${T?.ink}">${p + 1} ${u}</b>`;
        }).join(""), h = t.payout ?? 0;
        c.innerHTML = `<p>名次 ${i}</p><p>赢得 ${h}</p><button type="button" data-again>再来一局</button>`;
        const d = e.querySelector("[data-history]");
        d && (d.innerHTML = t.history.map((u) => {
          const p = L(u);
          return `<span style="background:${p?.color};color:${p?.ink}">${u}</span>`;
        }).join(""));
      }
      z(), n.frame(0), G(s.store, {
        id: P.id,
        status: "ready",
        score: 0,
        highScore: t.credits,
        message: P.howToPlay,
        detail: t.source,
        credits: t.credits
      }), s.events.on("game:start", () => {
        G(s.store, { id: P.id, status: "running", message: "" });
      });
    },
    onStart() {
    },
    onResize(s) {
      const e = s.container.querySelector(".marble-stage");
      e && e.dispatchEvent(new Event("marble-resize"));
    }
  });
}
function St(s) {
  const [e, o] = s.split(":");
  if (!e || o === void 0) return null;
  if (e === "winner" || e === "top3") {
    const n = Number(o);
    return _().includes(n) ? { type: e, marble: n } : null;
  }
  if (e === "color") {
    const n = M.find((t) => t.color.toLowerCase() === o.toLowerCase());
    return n ? { type: "color", color: n.color } : null;
  }
  return e === "size" && (o === "big" || o === "small") ? { type: "size", side: o } : e === "parity" && (o === "odd" || o === "even") ? { type: "parity", side: o } : null;
}
async function Mt(s) {
  try {
    const o = await W().post("/api/plinko/session", {});
    typeof o.credits == "number" && (s.credits = o.credits, s.source = "服务器开奖");
  } catch {
    s.source = "本地开奖（这局连不上服务器）";
  }
}
function W() {
  const s = new V();
  try {
    const o = sessionStorage.getItem("wgf:launch-token");
    if (o && o.length >= 8) s.set({ accessToken: o });
    else {
      const n = localStorage.getItem(kt), t = n ? JSON.parse(n) : null;
      if (t?.accessToken && !t.accessToken.startsWith("local."))
        s.set({ accessToken: t.accessToken, refreshToken: t.refreshToken });
      else {
        const r = localStorage.getItem(xt);
        r?.startsWith("v1w.") && s.set({ accessToken: r });
      }
    }
  } catch {
  }
  const e = yt;
  return new Q({
    baseUrl: e?.VITE_API_BASE || "http://127.0.0.1:8787",
    tokens: s,
    timeoutMs: 800
  });
}
function $t() {
  const s = [
    ["winner", "猜冠军"],
    ["color", "猜颜色"],
    ["side", "大小"],
    ["top3", "猜前三"]
  ].map(([o, n]) => `<button type="button" data-tab="${o}">${n}</button>`).join(""), e = `冠军 ${$.winner}x · 颜色 ${$.color}x · 大小/单双 ${$.size}x · 前三 ${$.top3}x`;
  return `
    <header class="marble-top">
      <button type="button" class="marble-menu" data-lobby-menu aria-label="菜单"></button>
      <strong>弹珠赛跑</strong>
      <span class="marble-balance"><i></i><b data-balance>1000</b></span>
    </header>
    <section class="marble-stage">
      <div class="marble-hud" data-hud></div>
      <div class="marble-tools">
        <button type="button" data-camera>跟随</button>
        <button type="button" data-fast>快进</button>
      </div>
      <div class="marble-result" data-result hidden></div>
      <div class="marble-history" data-history></div>
    </section>
    <section class="marble-panel">
      <p class="marble-source" data-source></p>
      <div class="marble-tabs">${s}</div>
      <div class="marble-board" data-board></div>
      <p class="marble-odds">${e}</p>
      <div class="marble-stake">
        <button type="button" data-bet-dec>½</button>
        <b data-amount>20</b>
        <button type="button" data-bet-inc>2×</button>
        <span>共 <b data-total>0</b></span>
      </div>
      <label class="marble-debug" data-debug hidden>
        <span>指定冠军</span>
        <select data-debug-winner>
          <option value="random">随机</option>
          ${M.map((o) => `<option value="${o.id}">${o.id} ${o.name}</option>`).join("")}
        </select>
      </label>
      <button type="button" class="marble-go" data-race disabled>开始比赛</button>
    </section>
  `;
}
function Lt() {
  return zt();
}
export {
  Lt as createGame,
  P as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","@wgf/net":"0.1.0","three":"0.170.0"}};
