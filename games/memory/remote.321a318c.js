import { jsx as u, jsxs as d } from "react/jsx-runtime";
import { defineGame as F, patchGame as p, readHighScore as J, writeHighScore as Q } from "@wgf/core";
import { useState as m, useEffect as w, useMemo as V, useRef as h } from "react";
import { createRoot as Y } from "react-dom/client";
function Z() {
  const t = [];
  for (let e = 0; e < 8; e += 1) {
    const s = e % 4, a = Math.floor(e / 4), i = 48 + s * 58, l = 28 + a * 68, y = e === 2 || e === 6;
    t.push({
      tag: "rect",
      attrs: {
        x: i,
        y: l,
        width: 46,
        height: 58,
        rx: 8,
        fill: y ? "#f6f1e7" : "#2a241c",
        stroke: "#f0b429",
        strokeOpacity: 0.4
      }
    }), y && t.push({
      tag: "circle",
      attrs: { cx: i + 23, cy: l + 29, r: 8, fill: e === 2 ? "#ff4d1c" : "#5b6cff" }
    });
  }
  return { background: "#1c1814", shapes: t };
}
const g = {
  id: "memory",
  name: "翻牌记忆",
  description: "十六张牌，八对图案。步数和时间都会吃掉分数，少错才能上榜。",
  howToPlay: "点开两张牌。图案相同就留下，不同就盖回去。清空棋盘即过关。",
  cover: "memory",
  art: Z(),
  renderer: "dom",
  controls: "board",
  tags: ["记忆"]
}, G = ["moon", "star", "bolt", "drop", "leaf", "gem", "bell", "heart"];
function ue() {
  let t = null;
  return F(g, {
    onMount(e) {
      e.container.setAttribute("data-wgf-game", "wgf-game:memory"), t = Y(e.container), t.render(/* @__PURE__ */ u(x, { ctx: e }));
    },
    onPause(e) {
      e.store.getState().game.status === "running" && p(e.store, { status: "paused" });
    },
    onResume(e) {
      e.store.getState().game.status === "paused" && p(e.store, { status: "running", message: "" });
    },
    onDestroy() {
      const e = t;
      t = null, e && queueMicrotask(() => {
        e.unmount();
      });
    }
  });
}
function x({ ctx: t }) {
  const [e, s] = m(0);
  return w(() => t.events.on("game:restart", () => s((a) => a + 1)), [t]), /* @__PURE__ */ u(ee, { ctx: t }, e);
}
function ee({ ctx: t }) {
  const e = V(() => re(te()), []), [s, a] = m([]), [i, l] = m(() => /* @__PURE__ */ new Set()), [y, U] = m(0), [T, B] = m(0), [_, L] = m(!1), b = h(!1), S = h(!1), v = h(J(g.id)), N = h(0), z = h(0), E = h(0), [q, K] = m(0), C = h(0), [O, $] = m(!1);
  w(() => (p(t.store, {
    id: g.id,
    status: "ready",
    score: 0,
    highScore: v.current,
    message: g.howToPlay,
    detail: "步数 0",
    combo: 0
  }), t.events.on("game:start", () => {
    S.current || b.current || (b.current = !0, p(t.store, { status: "running", message: "" }));
  })), [t]), w(() => {
    let o = 0, c = 0;
    return t.loop.onUpdate((r) => {
      if (!b.current || S.current || t.store.getState().game.status !== "running") return;
      o += r;
      const n = Math.floor(o);
      n !== c && (c = n, N.current = n, B(n), D(t, z.current, n, v.current));
    });
  }, [t]), w(() => () => window.clearTimeout(E.current), []), w(() => {
    if (O)
      return t.store.subscribe((o) => {
        o.game.status !== "paused" && (a([]), L(!1), $(!1));
      });
  }, [O, t]), w(() => {
    const o = (r) => {
      const n = r.target;
      if (n instanceof HTMLElement && (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.tagName === "SELECT"))
        return;
      const f = e.length;
      r.key === "ArrowRight" ? c(1, f) : r.key === "ArrowLeft" ? c(-1, f) : r.key === "ArrowDown" ? c(4, f) : r.key === "ArrowUp" ? c(-4, f) : (r.key === "Enter" || r.key === " ") && (r.preventDefault(), H(C.current));
    }, c = (r, n) => {
      C.current = (C.current + r + n) % n, K(C.current);
    };
    return window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o);
  });
  const W = A(y, T);
  function H(o) {
    if (S.current || _) return;
    const c = t.store.getState().game.status;
    if (c === "paused" || c === "over") return;
    const r = e[o];
    if (!r || i.has(r.icon) || s.includes(o)) return;
    b.current || (b.current = !0, p(t.store, { status: "running", message: "" }));
    const n = [...s, o];
    if (a(n), n.length < 2) return;
    const f = e[n[0] ?? -1], I = e[n[1] ?? -1], M = y + 1;
    if (z.current = M, U(M), D(t, M, N.current, v.current), f && I && f.icon === I.icon) {
      const R = new Set(i);
      if (R.add(f.icon), l(R), a([]), R.size === G.length) {
        S.current = !0, b.current = !1;
        const k = A(M, N.current), P = Q(g.id, k), X = k > v.current && k > 0;
        p(t.store, {
          id: g.id,
          status: "over",
          score: k,
          highScore: P,
          message: "全部配对",
          detail: `步数 ${M} · ${N.current}s`,
          combo: 0
        }), t.events.emit("game:over", { gameId: g.id, score: k, best: P, isRecord: X });
      }
      return;
    }
    L(!0), E.current = window.setTimeout(() => {
      if (t.store.getState().game.status === "paused") {
        $(!0);
        return;
      }
      a([]), L(!1);
    }, 680);
  }
  return /* @__PURE__ */ d("div", { className: "memory", children: [
    /* @__PURE__ */ d("div", { className: "memory-head", children: [
      /* @__PURE__ */ d("span", { children: [
        "步数 ",
        /* @__PURE__ */ u("strong", { children: y })
      ] }),
      /* @__PURE__ */ d("span", { children: [
        "时间 ",
        /* @__PURE__ */ d("strong", { children: [
          T,
          "s"
        ] })
      ] }),
      /* @__PURE__ */ d("span", { children: [
        "分数 ",
        /* @__PURE__ */ u("strong", { children: W })
      ] })
    ] }),
    /* @__PURE__ */ u("div", { className: "memory-grid", children: e.map((o, c) => {
      const r = s.includes(c) || i.has(o.icon);
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: `memory-card${r ? " is-up" : ""}${c === q ? " is-focus" : ""}`,
          "aria-label": r ? o.icon : "盖着的牌",
          "aria-pressed": r,
          disabled: i.has(o.icon),
          onClick: () => H(c),
          children: /* @__PURE__ */ d("span", { className: "memory-card-inner", children: [
            /* @__PURE__ */ u("span", { className: "memory-face memory-back" }),
            /* @__PURE__ */ u("span", { className: "memory-face memory-front", children: ne(o.icon) })
          ] })
        },
        o.key
      );
    }) })
  ] });
}
function D(t, e, s, a, i) {
  const l = A(e, s);
  p(t.store, {
    score: l,
    detail: `步数 ${e} · ${s}s`,
    highScore: Math.max(a, a)
  });
}
function A(t, e) {
  return t === 0 && e === 0 ? 0 : Math.max(0, 8e3 - t * 110 - e * 20);
}
function te() {
  const t = [];
  for (const e of G)
    t.push({ key: `${e}-a`, icon: e }, { key: `${e}-b`, icon: e });
  return t;
}
function re(t) {
  const e = [...t];
  for (let s = e.length - 1; s > 0; s -= 1) {
    const a = Math.floor(Math.random() * (s + 1)), i = e[s], l = e[a];
    !i || !l || (e[s] = l, e[a] = i);
  }
  return e;
}
function ne(t) {
  const e = oe[t] ?? "#ff4d1c";
  return /* @__PURE__ */ u("svg", { viewBox: "0 0 48 48", "aria-hidden": !0, children: /* @__PURE__ */ u("path", { d: j[t] ?? j.star, fill: e }) });
}
const oe = {
  moon: "#5b6cff",
  star: "#f0b429",
  bolt: "#ff4d1c",
  drop: "#3aa0ff",
  leaf: "#2f9e6b",
  gem: "#9b6bff",
  bell: "#e07a3d",
  heart: "#e23d5b"
}, j = {
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
  ue as createGame,
  g as manifest
};

export const remoteCompat={"framework":"0.1.0","peers":{"@wgf/core":"0.1.0","react":"18.3.1"}};
