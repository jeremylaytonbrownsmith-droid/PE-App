import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import type { Lesson } from '../types/lesson';
import type { WarmUp } from '../types/warmup';
import { getLesson } from '../lib/lessonStore';
import { getWarmUp } from '../lib/warmupStore';
import { buildTimeCheckTable, type TimeCheckRow } from '../lib/timeCheck';

function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Web Audio unavailable - silently skip the beep, the visual countdown still works.
  }
}

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ClassTimerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [rows, setRows] = useState<TimeCheckRow[]>([]);
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!id) return;
    getLesson(id).then(async (found) => {
      if (!found) return;
      setLesson(found);
      let warmUp: WarmUp | undefined;
      if (found.warmUpId) warmUp = await getWarmUp(found.warmUpId);
      const builtRows = buildTimeCheckTable(found, warmUp?.name);
      setRows(builtRows);
      setSecondsLeft((builtRows[0]?.minutes ?? 0) * 60);
    });
  }, [id]);

  const goToSegment = useCallback(
    (nextIndex: number) => {
      setIndex(nextIndex);
      setSecondsLeft((rows[nextIndex]?.minutes ?? 0) * 60);
    },
    [rows],
  );

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playBeep();
          if (index < rows.length - 1) {
            setIndex((i) => i + 1);
            const next = rows[index + 1];
            return (next?.minutes ?? 0) * 60;
          }
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, index, rows]);

  if (!lesson || rows.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading timer…</p>
      </div>
    );
  }

  const current = rows[index];
  const isUntimed = current.minutes === null;

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col">
      <div className="flex items-center justify-between p-4">
        <button onClick={() => navigate(`/library/${lesson.id}`)} className="text-gray-400 hover:text-white p-2" aria-label="Exit timer">
          <X size={28} />
        </button>
        <p className="text-sm text-gray-400">
          Segment {index + 1} of {rows.length}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
        <p className="text-2xl sm:text-3xl font-semibold text-brand-300">{current.label}</p>
        {isUntimed ? (
          <p className="text-5xl sm:text-7xl font-bold">If time allows</p>
        ) : (
          <p className="text-7xl sm:text-9xl font-bold tabular-nums">{formatClock(secondsLeft)}</p>
        )}
      </div>

      <div className="w-full h-1.5 bg-gray-800">
        <div
          className="h-full bg-brand-500 transition-all"
          style={{ width: `${((index + 1) / rows.length) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-6 p-6">
        <button
          onClick={() => goToSegment(Math.max(0, index - 1))}
          disabled={index === 0}
          className="p-4 rounded-full bg-gray-800 disabled:opacity-30"
          aria-label="Previous segment"
        >
          <SkipBack size={24} />
        </button>
        <button
          onClick={() => setRunning((r) => !r)}
          className="p-6 rounded-full bg-brand-600 hover:bg-brand-700"
          aria-label={running ? 'Pause' : 'Play'}
        >
          {running ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button
          onClick={() => goToSegment(Math.min(rows.length - 1, index + 1))}
          disabled={index === rows.length - 1}
          className="p-4 rounded-full bg-gray-800 disabled:opacity-30"
          aria-label="Next segment"
        >
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
}
