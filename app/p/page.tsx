"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "pomodoro" | "short" | "long";

const MODES: Record<
  Mode,
  { label: string; seconds: number; bg: string; card: string; accent: string; subtitle: string }
> = {
  pomodoro: {
    label: "Pomodoro",
    seconds: 25 * 60,
    bg: "bg-orange-700",
    card: "bg-red-800/35",
    accent: "text-red-100",
    subtitle: "Time to focus!",
  },
  short: {
    label: "Short Break",
    seconds: 5 * 60,
    bg: "bg-teal-700",
    card: "bg-teal-800/35",
    accent: "text-teal-100",
    subtitle: "Time for a break!",
  },
  long: {
    label: "Long Break",
    seconds: 15 * 60,
    bg: "bg-yellow-700",
    card: "bg-yellow-800/35",
    accent: "text-blue-100",
    subtitle: "Time for a longer break!",
  },
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

export default function PomodoroPage() {
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(MODES.pomodoro.seconds);
  const [running, setRunning] = useState(false);

  // session counter increments when a Pomodoro completes
  const [session, setSession] = useState(1);

  // notes (persisted)
  const [notes, setNotes] = useState("");
  const tickRef = useRef<number | null>(null);

  const theme = useMemo(() => MODES[mode], [mode]);

  // load notes
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pomodoro_notes_v1");
      if (saved) setNotes(saved);
    } catch {}
  }, []);

  // save notes
  useEffect(() => {
    try {
      localStorage.setItem("pomodoro_notes_v1", notes);
    } catch {}
  }, [notes]);

  // when mode changes, reset timer (Pomofocus behavior)
  useEffect(() => {
    setRunning(false);
    setSecondsLeft(theme.seconds);
    // stop any running interval
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, [mode, theme.seconds]);

  // ticking
  useEffect(() => {
    if (!running) return;

    if (tickRef.current) window.clearInterval(tickRef.current);

    tickRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [running]);

  // when reaches 0, stop and advance session if pomodoro finished
  useEffect(() => {
    if (secondsLeft !== 0) return;

    if (running) setRunning(false);

    // clear interval
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }

    // if a pomodoro finished, bump session
    if (mode === "pomodoro") {
      setSession((s) => s + 1);
    }
  }, [secondsLeft, running, mode]);

  // update tab title like "25:00 - Time to focus!"
  useEffect(() => {
    document.title = `${formatMMSS(secondsLeft)} - ${theme.subtitle}`;
  }, [secondsLeft, theme.subtitle]);

  function toggleStart() {
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(theme.seconds);
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }

  return (
    <div className={`min-h-screen ${theme.bg} text-white`}>
      {/* top bar (simple) */}
      <div className="mx-auto flex w-[min(780px,92vw)] items-center justify-between py-5">
        <div className="flex items-center gap-2 font-extrabold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
            ✓
          </span>
          <span className="tracking-tight">Pomofocus</span>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {["Report", "Setting", "Sign In"].map((x) => (
            <button
              key={x}
              type="button"
              className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/15"
            >
              {x}
            </button>
          ))}
          <button
            type="button"
            className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/15"
            aria-label="More"
            title="More"
          >
            ⋮
          </button>
        </div>
      </div>

      {/* main */}
      <div className="mx-auto w-[min(780px,92vw)] pb-16">
        {/* timer card */}
        <div className={`rounded-2xl ${theme.card} px-5 py-6 shadow-[0_20px_60px_rgba(0,0,0,.15)]`}>
          {/* tabs */}
          <div className="mx-auto flex w-full max-w-md items-center justify-center gap-2">
            {(["pomodoro", "short", "long"] as Mode[]).map((m) => {
              const active = m === mode;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={[
                    "rounded-lg px-4 py-2 text-sm font-extrabold transition",
                    active ? "bg-black/25" : "bg-white/0 hover:bg-black/15",
                  ].join(" ")}
                >
                  {MODES[m].label}
                </button>
              );
            })}
          </div>

          {/* big time */}
          <div className="mt-6 text-center">
            <div className="select-none text-[88px] font-black leading-none tracking-tight sm:text-[104px]">
              {formatMMSS(secondsLeft)}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={toggleStart}
                className={[
                  "h-14 w-56 rounded-xl bg-white text-lg font-black tracking-wide shadow-sm transition",
                  "hover:opacity-95 active:translate-y-px",
                  theme.accent,
                ].join(" ")}
              >
                {running ? "PAUSE" : "START"}
              </button>

              <button
                type="button"
                onClick={reset}
                className="h-14 rounded-xl bg-white/10 px-4 text-sm font-extrabold hover:bg-white/15"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* session + subtitle */}
        <div className="mt-6 text-center">
          <div className="text-sm font-black opacity-90">#{session}</div>
          <div className="mt-1 text-lg font-extrabold">{theme.subtitle}</div>
        </div>

        {/* notes */}
        <div className="mt-10">
          <div className="mx-auto w-full max-w-2xl">
            <div className="flex items-center justify-between">
              <div className="text-base font-extrabold">Notes</div>
              <button
                type="button"
                className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/15"
                onClick={() => setNotes("")}
              >
                Clear
              </button>
            </div>

            <div className="mt-3 rounded-2xl border border-white/15 bg-white/10 p-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write what you're focusing on… (saved automatically)"
                className="min-h-[120px] w-full resize-none bg-transparent p-2 text-sm font-semibold outline-none placeholder:text-white/60"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
