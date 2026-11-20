import { jsx as u, jsxs as h } from "react/jsx-runtime";
import { registerStrings as V, defineGame as Y, patchGame as b, readHighScore as Z, t as d, writeHighScore as x } from "@wgf/core";
import { useState as m, useEffect as p, useMemo as ee, useRef as g } from "react";
import { createRoot as te } from "react-dom/client";
function re() {
  const t = [];
  for (let e = 0; e < 8; e += 1) {
    const s = e % 4, c = Math.floor(e / 4), i = 48 + s * 58, l = 28 + c * 68, v = e === 2 || e === 6;
    t.push({
      tag: "rect",
      attrs: {
        x: i,
        y: l,
        width: 46,
        height: 58,
        rx: 8,
        fill: v ? "#f6f1e7" : "#2a241c",
        stroke: "#f0b429",
        strokeOpacity: 0.4
      }
    }), v && t.push({
      tag: "circle",
      attrs: { cx: i + 23, cy: l + 29, r: 8, fill: e === 2 ? "#ff4d1c" : "#5b6cff" }
    });
  }
  return { background: "#1c1814", shapes: t };
}
const y = {
  id: "memory",
  name: "翻牌记忆",
  description: "十六张牌，八对图案。步数和时间都会吃掉分数，少错才能上榜。",
  tip: "相同的两张会留下。",
  howToPlay: "点开两张牌。图案相同就留下，不同就盖回去。清空棋盘即过关。",
  copy: {
    en: {
      name: "Memory",
      description: "Sixteen cards, eight pairs. Moves and time both spend the score.",
      howToPlay: "Flip two cards. A match stays up. A miss turns back over. Clear the board to finish.",
      tip: "Matching cards stay face up."
    }
  },
  cover: "memory",
  art: re(),
  renderer: "dom",
  controls: "board",
  tags: ["记忆"],
  theme: { accent: "#f0b429", accentInk: "#2a1c06", glow: "#ff4d1c", radius: 16, font: "serif" }
};
function oe() {
  V("memory", {
    zh: {
      moves: "步数 {n}",
      detail: "步数 {moves} · {seconds}s",
      done: "全部配对",
      movesLabel: "步数",
      timeLabel: "时间",
      scoreLabel: "分数",
      covered: "盖着的牌"
    },
    en: {
      moves: "Moves {n}",
      detail: "Moves {moves} · {seconds}s",
      done: "All pairs found",
      movesLabel: "Moves",
      timeLabel: "Time",
      scoreLabel: "Score",
      covered: "Face-down card"
    }
  });
}
const B = ["moon", "star", "bolt", "drop", "leaf", "gem", "bell", "heart"];
function he() {
  oe();
  let t = null;
  return Y(y, {
    async onPreload(e, s) {
      await e.preload([], s);
    },
    onMount(e) {
      e.container.setAttribute("data-wgf-game", "wgf-game:memory"), t = te(e.container), t.render(/* @__PURE__ */ u(se, { ctx: e }));
    },
    onPause(e) {
      e.store.getState().game.status === "running" && b(e.store, { status: "paused" });
    },
    onResume(e) {
      e.store.getState().game.status === "paused" && b(e.store, { status: "running", message: "" });
    },
    onDestroy() {
      const e = t;
      t = null, e && queueMicrotask(() => {
        e.unmount();
      });
    }
  });
}
function se({ ctx: t }) {
  const [e, s] = m(0);
  return p(() => t.events.on("game:restart", () => s((c) => c + 1)), [t]), /* @__PURE__ */ u(ne, { ctx: t }, e);
}
function ne({ ctx: t }) {
  const e = ee(() => ce(ae()), []), [s, c] = m([]), [i, l] = m(() => /* @__PURE__ */ new Set()), [v, F] = m(0), [E, _] = m(0), [q, T] = m(!1), w = g(!1), k = g(!1), L = g(Z(y.id)), A = g(0), O = g(0), I = g(0), [K, W] = m(0), N = g(0), [P, H] = m(!1), [C, X] = m(t.store.getState().ui.locale);
  p(
    () => t.store.subscribe((r, a) => {
      r.ui.locale !== a.ui.locale && X(r.ui.locale);
    }),
    [t]
  ), p(() => (b(t.store, {
    id: y.id,
    status: "ready",
    score: 0,
    highScore: L.current,
    message: y.howToPlay,
    detail: d(t.store.getState().ui.locale, "memory.moves", { n: 0 }),
    combo: 0
  }), t.events.on("game:start", () => {
    k.current || w.current || (w.current = !0, b(t.store, { status: "running", message: "" }));
  })), [t]), p(() => {
    let r = 0, a = 0;
    return t.loop.onUpdate((o) => {
      if (!w.current || k.current || t.store.getState().game.status !== "running") return;
      r += o;
      const n = Math.floor(r);
      n !== a && (a = n, A.current = n, _(n), G(t, O.current, n, L.current));
    });
  }, [t]), p(() => () => window.clearTimeout(I.current), []), p(() => {
    if (P)
      return t.store.subscribe((r) => {
        r.game.status !== "paused" && (c([]), T(!1), H(!1));
      });
  }, [P, t]), p(() => {
    const r = (o) => {
      const n = o.target;
      if (n instanceof HTMLElement && (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.tagName === "SELECT"))
        return;
      const f = e.length;
      o.key === "ArrowRight" ? a(1, f) : o.key === "ArrowLeft" ? a(-1, f) : o.key === "ArrowDown" ? a(4, f) : o.key === "ArrowUp" ? a(-4, f) : (o.key === "Enter" || o.key === " ") && (o.preventDefault(), D(N.current));
    }, a = (o, n) => {
      N.current = (N.current + o + n) % n, W(N.current);
    };
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  });
  const J = z(v, E);
  function D(r) {
    if (k.current || q) return;
    const a = t.store.getState().game.status;
    if (a === "paused" || a === "over") return;
    const o = e[r];
    if (!o || i.has(o.icon) || s.includes(r)) return;
    w.current || (w.current = !0, b(t.store, { status: "running", message: "" }));
    const n = [...s, r];
    if (c(n), n.length < 2) return;
    const f = e[n[0] ?? -1], $ = e[n[1] ?? -1], M = v + 1;
    if (O.current = M, F(M), G(t, M, A.current, L.current), f && $ && f.icon === $.icon) {
      const R = new Set(i);
      if (R.add(f.icon), l(R), c([]), R.size === B.length) {
        k.current = !0, w.current = !1;
        const S = z(M, A.current), j = x(y.id, S), Q = S > L.current && S > 0;
        b(t.store, {
          id: y.id,
          status: "over",
          score: S,
          highScore: j,
          message: d(t.store.getState().ui.locale, "memory.done"),
          detail: d(t.store.getState().ui.locale, "memory.detail", {
            moves: M,
            seconds: A.current
          }),
          combo: 0
        }), t.events.emit("game:over", { gameId: y.id, score: S, best: j, isRecord: Q });
      }
      return;
    }
    T(!0), I.current = window.setTimeout(() => {
      if (t.store.getState().game.status === "paused") {
        H(!0);
        return;
      }
      c([]), T(!1);
    }, 680);
  }
  return /* @__PURE__ */ h("div", { className: "memory", children: [
    /* @__PURE__ */ h("div", { className: "memory-head", children: [
      /* @__PURE__ */ h("span", { children: [
        d(C, "memory.movesLabel"),
        " ",
        /* @__PURE__ */ u("strong", { children: v })
      ] }),
      /* @__PURE__ */ h("span", { children: [
        d(C, "memory.timeLabel"),
        " ",
        /* @__PURE__ */ h("strong", { children: [
          E,
          "s"
        ] })
      ] }),
      /* @__PURE__ */ h("span", { children: [
        d(C, "memory.scoreLabel"),
        " ",
        /* @__PURE__ */ u("strong", { children: J })
      ] })
    ] }),
    /* @__PURE__ */ u("div", { className: "memory-grid", children: e.map((r, a) => {
      const o = s.includes(a) || i.has(r.icon);
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: `memory-card${o ? " is-up" : ""}${a === K ? " is-focus" : ""}`,
          "aria-label": o ? r.icon : d(C, "memory.covered"),
          "aria-pressed": o,
          disabled: i.has(r.icon),
          onClick: () => D(a),
          children: /* @__PURE__ */ h("span", { className: "memory-card-inner", children: [
            /* @__PURE__ */ u("span", { className: "memory-face memory-back" }),
            /* @__PURE__ */ u("span", { className: "memory-face memory-front", children: ie(r.icon) })
          ] })
        },
        r.key
      );
    }) })
  ] });
}
function G(t, e, s, c, i) {
  const l = z(e, s);
  b(t.store, {
    score: l,
    detail: d(t.store.getState().ui.locale, "memory.detail", { moves: e, seconds: s }),
    highScore: Math.max(c, c)
  });
}
function z(t, e) {
  return t === 0 && e === 0 ? 0 : Math.max(0, 8e3 - t * 110 - e * 20);
}
function ae() {
  const t = [];
  for (const e of B)
    t.push({ key: `${e}-a`, icon: e }, { key: `${e}-b`, icon: e });
  return t;
}
function ce(t) {
  const e = [...t];
  for (let s = e.length - 1; s > 0; s -= 1) {
    const c = Math.floor(Math.random() * (s + 1)), i = e[s], l = e[c];
    !i || !l || (e[s] = l, e[c] = i);
  }
  return e;
}
function ie(t) {
  const e = ue[t] ?? "#ff4d1c";
  return /* @__PURE__ */ u("svg", { viewBox: "0 0 48 48", "aria-hidden": !0, children: /* @__PURE__ */ u("path", { d: U[t] ?? U.star, fill: e }) });
}
const ue = {
  moon: "#5b6cff",
  star: "#f0b429",
  bolt: "#ff4d1c",
  drop: "#3aa0ff",
  leaf: "#2f9e6b",
  gem: "#9b6bff",
  bell: "#e07a3d",
  heart: "#e23d5b"
}, U = {
  moon: "M28 6a16 16 0 1 0 12 26A14 14 0 0 1 28 6z",
  star: "M24 4l5.2 11.2L41 17.2 31.8 26l2.4 13L24 32.8 13.8 39l2.4-13L7 17.2l11.8-2z",
  bolt: "M28 4L10 26h12l-2 18 18-24H26z",
  drop: "M24 4S10 20 10 30a14 14 0 0 0 28 0C38 20 24 4 24 4z",
  leaf: "M8 40C8 18 22 8 42 8 40 32 26 42 8 40z",
  gem: "M24 44L4 18 12 6h24l8 12z",
  bell: "M24 4a12 12 0 0 0-12 12v8l-4 6h32l-4-6v-8A12 12 0 0 0 24 4zm-4 36a4 4 0 0 0 8 0z",
  heart: "M24 42S6 30 6 18a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 12-18 24-18 24z"
};
export {
  he as createGame,
  y as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","react":"18.3.1"}};
