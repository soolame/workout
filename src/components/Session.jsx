import { useMemo, useState } from 'react';
import { EX, PLANS } from '../data/exercises';
import { formatDuration, prettyDate, sessionStats, suggest } from '../lib/core';
import ExerciseCard from './ExerciseCard';
import SimpleCard from './SimpleCard';
import RestTimer from './RestTimer';
import { Check, Swap } from './Icons';

const SECTIONS = [
  { key: 'warmup', title: 'Warm-up', hint: '~5 min · get the blood flowing' },
  { key: 'main', title: 'Workout', hint: 'Progressive overload · 8–15 reps' },
  { key: 'stretch', title: 'Stretch', hint: '~5 min · cool down' },
];

function ProgressRing({ pct }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring">
      <svg viewBox="0 0 64 64">
        <circle className="ring-track" cx="32" cy="32" r={r} />
        <circle className="ring-fill" cx="32" cy="32" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <span>{Math.round(pct * 100)}%</span>
    </div>
  );
}

export default function Session({ session, sessions, today, update, onReset }) {
  const plan = PLANS[session.type];
  const stats = sessionStats(session);
  const [rest, setRest] = useState(null); // { end, total }

  // Suggestions are based only on previous days, so they stay stable while you log today.
  const suggestions = useMemo(
    () => Object.fromEntries(plan.main.map((id) => [id, suggest(EX[id], sessions, today)])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session.type, today]
  );

  const nextId = useMemo(() => {
    for (const s of SECTIONS) {
      const id = session.order[s.key].find((x) => !session.log[x]?.done);
      if (id) return id;
    }
    return null;
  }, [session]);

  const setEntry = (id, fn) => update((s) => ({ ...s, log: { ...s.log, [id]: fn(s.log[id]) } }));

  const move = (section, index, dir) =>
    update((s) => {
      const list = [...s.order[section]];
      const j = index + dir;
      if (j < 0 || j >= list.length) return s;
      [list[index], list[j]] = [list[j], list[index]];
      return { ...s, order: { ...s.order, [section]: list } };
    });

  const finish = () => update((s) => ({ ...s, finishedAt: s.finishedAt ? null : Date.now() }));

  const switchWorkout = () => {
    const msg = stats.itemsDone
      ? "Switch workout? Today's logged progress will be cleared."
      : 'Pick a different workout for today?';
    if (window.confirm(msg)) onReset();
  };

  const levelUps = plan.main.filter((id) => {
    const ex = EX[id];
    const sets = session.log[id]?.sets?.filter((x) => x.done) ?? [];
    return sets.length >= ex.main.sets && sets.every((x) => x.r >= ex.main.reps[1]);
  });

  return (
    <section className="session">
      <header className="hero">
        <div>
          <p className="eyebrow">{prettyDate(today)}</p>
          <h1 className="title">
            {plan.label} <span className="accent-text">Day</span>
          </h1>
          <p className="muted">{plan.focus}</p>
          <div className="hero-meta">
            <span className="chip">
              {stats.sets}/{stats.total} sets
            </span>
            <span className="chip">{stats.volume.toLocaleString()} kg volume</span>
            <button className="chip chip-btn" onClick={switchWorkout}>
              <Swap width={14} height={14} /> Switch
            </button>
          </div>
        </div>
        <ProgressRing pct={stats.pct} />
      </header>

      {session.finishedAt && (
        <div className="summary">
          <div className="summary-head">
            <Check width={22} height={22} />
            <div>
              <strong>Workout complete</strong>
              <span>{formatDuration(session.finishedAt - session.startedAt)} · {stats.sets} sets · {stats.volume.toLocaleString()} kg</span>
            </div>
          </div>
          {levelUps.length > 0 && (
            <p className="summary-up">
              ▲ Next time go heavier on: {levelUps.map((id) => EX[id].name).join(', ')}
            </p>
          )}
        </div>
      )}

      {SECTIONS.map((sec) => {
        const ids = session.order[sec.key];
        const done = ids.filter((id) => session.log[id]?.done).length;
        return (
          <div key={sec.key} className="section">
            <div className="section-head">
              <div>
                <h2>{sec.title}</h2>
                <span className="muted small">{sec.hint}</span>
              </div>
              <span className={`count ${done === ids.length ? 'complete' : ''}`}>
                {done}/{ids.length}
              </span>
            </div>
            <div className="cards">
              {ids.map((id, i) => {
                const common = {
                  ex: EX[id],
                  entry: session.log[id],
                  index: i,
                  count: ids.length,
                  isNext: id === nextId,
                  onChange: (fn) => setEntry(id, fn),
                  onMove: (dir) => move(sec.key, i, dir),
                };
                return sec.key === 'main' ? (
                  <ExerciseCard
                    key={id}
                    {...common}
                    suggestion={suggestions[id]}
                    onSetDone={(secs) => setRest({ end: Date.now() + secs * 1000, total: secs })}
                  />
                ) : (
                  <SimpleCard key={id} {...common} />
                );
              })}
            </div>
          </div>
        );
      })}

      <button className={`btn-primary big ${session.finishedAt ? 'ghost' : ''}`} onClick={finish}>
        {session.finishedAt ? 'Reopen workout' : 'Finish workout'}
      </button>

      {rest && <RestTimer rest={rest} onAdjust={(secs) => setRest((r) => ({ ...r, end: r.end + secs * 1000, total: r.total + secs }))} onClose={() => setRest(null)} />}
    </section>
  );
}
