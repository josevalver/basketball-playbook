// src/components/PlayAnimator.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Court = ({ children }) => (
  <svg viewBox="0 0 100 94" className="w-full rounded-2xl shadow ring-1 ring-white/10 bg-emerald-900/10">
    <rect x="0" y="0" width="100" height="94" rx="2" fill="url(#g)" />
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopOpacity="0.1" />
        <stop offset="100%" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <line x1="0" y1="70" x2="100" y2="70" stroke="currentColor" strokeOpacity="0.2" />
    {children}
  </svg>
);

const Dot = ({ id, role, active }) => (
  <g>
    <circle r={3.6} strokeWidth={0.6} className={`fill-white/90 ${active ? "stroke-emerald-400" : "stroke-white/40"}`} />
    <text y={0.7} fontSize={3.2} textAnchor="middle" className="fill-emerald-900">{id}</text>
    {role && <text y={6.6} fontSize={2.8} textAnchor="middle" className="fill-white/70">{role}</text>}
  </g>
);

const Arrow = ({ from, to }) => {
  if (!from || !to) return null;
  const dx = to.x - from.x, dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <g transform={`translate(${from.x} ${from.y}) rotate(${angle})`}>
      <line x1="0" y1="0" x2={len - 3} y2="0" stroke="currentColor" strokeWidth={0.6} />
      <polygon points={`${len - 3},0 ${len - 5},1.8 ${len - 5},-1.8`} className="fill-current" />
    </g>
  );
};

function useVoiceControls(onCmd) {
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "en-US";
    r.continuous = true;
    r.interimResults = false;
    r.onresult = (e) => {
      const last = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
      if (["next", "go", "play", "siguiente"].includes(last)) onCmd("next");
      if (["back", "previous", "atrás", "atras"].includes(last)) onCmd("prev");
      if (["reset", "inicio"].includes(last)) onCmd("reset");
    };
    r.start();
    return () => { try { r.stop(); } catch {} };
  }, [onCmd]);
}

export default function PlayAnimator({ play }) {
  const steps = Array.isArray(play?.steps) ? play.steps : [];
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);

  const idx = Math.max(0, Math.min(step, Math.max(steps.length - 1, 0)));
  const frame = steps[idx] || { players: [], passes: [], screens: [], durationMs: 1000 };

  const playersById = useMemo(
    () => Object.fromEntries((frame.players || []).map((p) => [p.id, p])),
    [frame]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" || e.key === " ") { e.preventDefault(); setStep((s) => Math.min(s + 1, steps.length - 1)); }
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0));
      if (e.key?.toLowerCase() === "r") { setStep(0); setAuto(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steps.length]);

  useVoiceControls((cmd) => {
    if (cmd === "next") setStep((s) => Math.min(s + 1, steps.length - 1));
    if (cmd === "prev") setStep((s) => Math.max(s - 1, 0));
    if (cmd === "reset") { setStep(0); setAuto(false); }
  });

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setStep((s) => (s < steps.length - 1 ? s + 1 : s)), frame.durationMs || 1000);
    return () => clearTimeout(t);
  }, [auto, step, frame, steps.length]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{play?.title || ""}</h2>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700" onClick={() => { setStep(0); setAuto(false); }}>
            Reset
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700" onClick={() => setStep((s) => Math.max(s - 1, 0))}>
            Prev
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500" onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}>
            Next
          </button>
          <label className="inline-flex items-center gap-2 text-sm ml-2">
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Auto
          </label>
        </div>
      </div>

      <Court>
        {(frame.passes || []).map(([from, to], i) => (
          <Arrow key={`p-${i}`} from={playersById[from]} to={playersById[to]} />
        ))}

        <AnimatePresence initial={false}>
          {(frame.players || []).map((p) => (
            <motion.g
              key={p.id}
              initial={false}
              animate={{ x: p.x, y: p.y }}
              transition={{ duration: (frame.durationMs || 1000) / 1000 }}
            >
              <Dot id={p.id} role={p.role} active />
            </motion.g>
          ))}
        </AnimatePresence>
      </Court>

      {frame.label && <p className="text-sm text-zinc-400">{frame.label}</p>}
      <p className="text-xs text-zinc-500">
        Step {idx + 1} / {steps.length} — Space/→ advance, ← back, R reset. Voice: “next/back/reset”.
      </p>
    </div>
  );
}
