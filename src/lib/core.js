import { EX, PLANS } from '../data/exercises';

// ── Storage ─────────────────────────────────────────────
// Everything lives under one key: { sessions: { 'YYYY-MM-DD': session } }.
// Today's session is resumed on reload; a new date starts fresh, and older
// sessions stay as history for progressive overload.
const KEY = 'ppl-tracker:v1';

export function loadDB() {
  try {
    const db = JSON.parse(localStorage.getItem(KEY));
    if (db && typeof db.sessions === 'object') return db;
  } catch {
    /* corrupted or unavailable storage: start clean */
  }
  return { sessions: {} };
}

export function saveDB(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* storage full or blocked */
  }
}

// ── Dates ───────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0');
export const todayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const prettyDate = (key, opts = { weekday: 'long', day: 'numeric', month: 'short' }) =>
  keyToDate(key).toLocaleDateString(undefined, opts);

// ── Progressive overload (double progression) ───────────
// Work inside the rep range at a fixed weight. Once every set hits the top
// of the range, add weight and drop back to the bottom of the range.
const round = (n) => Math.round(n * 100) / 100;

export function lastPerformance(id, sessions, before) {
  const dates = Object.keys(sessions).filter((d) => d < before).sort().reverse();
  for (const date of dates) {
    const sets = sessions[date].log?.[id]?.sets?.filter((s) => s.done && s.r > 0);
    if (sets?.length) return { date, sets };
  }
  return null;
}

export function suggest(ex, sessions, before) {
  const m = ex.main;
  const [lo, hi] = m.reps;
  const step = m.step ?? 1;
  const last = lastPerformance(ex.id, sessions, before);
  if (!last) return { weight: m.bw ? null : m.start, reps: lo, kind: 'start', last: null };

  if (m.bw) {
    const minR = Math.min(...last.sets.map((s) => s.r));
    return { weight: null, reps: minR + step, kind: minR >= hi ? 'up' : 'same', last };
  }

  const top = Math.max(...last.sets.map((s) => s.w ?? 0));
  const atTop = last.sets.filter((s) => (s.w ?? 0) === top);
  const minR = Math.min(...atTop.map((s) => s.r));
  const weight = top || m.start;
  if (atTop.length >= m.sets && minR >= hi) return { weight: round(weight + m.inc), reps: lo, kind: 'up', last };
  return { weight, reps: Math.min(hi, Math.max(lo, minR + step)), kind: 'same', last };
}

export function formatSets(sets, unit = 'reps') {
  const weights = [...new Set(sets.map((s) => s.w ?? 0))];
  const u = unit === 'sec' ? 's' : '';
  if (weights.length === 1) {
    const reps = sets.map((s) => `${s.r}${u}`).join(' · ');
    return weights[0] ? `${weights[0]} kg × ${reps}` : reps;
  }
  return sets.map((s) => `${s.w}×${s.r}`).join(' · ');
}

// ── Sessions ────────────────────────────────────────────
export function createSession(type, date, sessions) {
  const plan = PLANS[type];
  const log = {};
  for (const id of [...plan.warmup, ...plan.stretch]) log[id] = { done: false };
  for (const id of plan.main) {
    const ex = EX[id];
    const s = suggest(ex, sessions, date);
    log[id] = {
      done: false,
      sets: Array.from({ length: ex.main.sets }, () => ({ w: s.weight, r: s.reps, done: false })),
    };
  }
  return {
    date,
    type,
    startedAt: Date.now(),
    finishedAt: null,
    order: { warmup: [...plan.warmup], main: [...plan.main], stretch: [...plan.stretch] },
    log,
  };
}

export function sessionStats(session) {
  let sets = 0;
  let total = 0;
  let volume = 0;
  let items = 0;
  let itemsDone = 0;
  for (const section of ['warmup', 'main', 'stretch']) {
    for (const id of session.order[section]) {
      const entry = session.log[id];
      if (!entry) continue;
      items++;
      if (entry.done) itemsDone++;
      if (entry.sets) {
        total += entry.sets.length;
        for (const s of entry.sets) {
          if (!s.done) continue;
          sets++;
          volume += (s.w ?? 0) * (s.r ?? 0);
        }
      }
    }
  }
  return { sets, total, volume: Math.round(volume), items, itemsDone, pct: items ? itemsDone / items : 0 };
}

export function formatDuration(ms) {
  const mins = Math.max(0, Math.round(ms / 60000));
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins} min`;
}
