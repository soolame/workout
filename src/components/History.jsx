import { useRef, useState } from 'react';
import { EX, EXERCISES, PLANS } from '../data/exercises';
import { formatSets, prettyDate, sessionStats } from '../lib/core';
import Figure from './Figure';

function liftProgress(sessions) {
  const dates = Object.keys(sessions).sort();
  return EXERCISES.filter((ex) => ex.kind === 'main' && !ex.main.bw)
    .map((ex) => {
      const points = dates
        .map((d) => {
          const sets = sessions[d].log?.[ex.id]?.sets?.filter((s) => s.done && s.w) ?? [];
          return sets.length ? { date: d, w: Math.max(...sets.map((s) => s.w)) } : null;
        })
        .filter(Boolean)
        .slice(-8);
      return { ex, points };
    })
    .filter((p) => p.points.length);
}

export default function History({ db, setDb, today }) {
  const [openDate, setOpenDate] = useState(null);
  const fileRef = useRef(null);
  const dates = Object.keys(db.sessions).sort().reverse();
  const lifts = liftProgress(db.sessions);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ppl-tracker-${today}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importData = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data?.sessions) throw new Error('bad file');
      if (window.confirm(`Import ${Object.keys(data.sessions).length} sessions? Existing days with the same date will be replaced.`)) {
        setDb((d) => ({ ...d, sessions: { ...d.sessions, ...data.sessions } }));
      }
    } catch {
      window.alert('That file is not a valid PPL Tracker backup.');
    }
  };

  return (
    <section className="history">
      <p className="eyebrow">Your training log</p>
      <h1 className="title">History</h1>

      {lifts.length > 0 && (
        <div className="section">
          <div className="section-head">
            <h2>Lift progress</h2>
            <span className="muted small">top set, last 8 sessions</span>
          </div>
          <div className="cards">
            {lifts.map(({ ex, points }) => {
              const max = Math.max(...points.map((p) => p.w));
              const min = Math.min(...points.map((p) => p.w));
              const first = points[0].w;
              const last = points[points.length - 1].w;
              return (
                <div key={ex.id} className="card lift">
                  <div className="fig-tile small">
                    <Figure fig={ex.fig} still />
                  </div>
                  <div className="lift-info">
                    <h3>{ex.name}</h3>
                    <p className="muted small">
                      {last} kg {last > first && <span className="gain">+{Math.round((last - first) * 100) / 100} kg</span>}
                    </p>
                  </div>
                  <div className="spark" aria-label={`Top weights: ${points.map((p) => p.w).join(', ')} kg`}>
                    {points.map((p) => (
                      <span key={p.date} style={{ height: `${max === min ? 60 : 25 + ((p.w - min) / (max - min)) * 75}%` }} title={`${prettyDate(p.date)} · ${p.w} kg`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-head">
          <h2>Sessions</h2>
          <span className="count">{dates.length}</span>
        </div>
        {dates.length === 0 && <p className="muted">No workouts yet. Your first session will show up here.</p>}
        <div className="cards">
          {dates.map((d) => {
            const s = db.sessions[d];
            const st = sessionStats(s);
            const open = openDate === d;
            return (
              <div key={d} className="card session-row" data-type={s.type}>
                <button className="session-row-head" onClick={() => setOpenDate(open ? null : d)}>
                  <span className="type-dot" />
                  <div>
                    <strong>
                      {PLANS[s.type]?.label} {d === today && <span className="badge">Today</span>}
                    </strong>
                    <span className="muted small">{prettyDate(d)}</span>
                  </div>
                  <div className="session-row-stats">
                    <span>{st.sets} sets</span>
                    <span className="muted small">{st.volume.toLocaleString()} kg</span>
                  </div>
                </button>
                {open && (
                  <ul className="session-detail">
                    {s.order.main.map((id) => {
                      const sets = s.log[id]?.sets?.filter((x) => x.done) ?? [];
                      return (
                        <li key={id}>
                          <span>{EX[id]?.name ?? id}</span>
                          <span className="muted">{sets.length ? formatSets(sets, EX[id]?.main.unit) : '—'}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="backup">
        <button className="btn-ghost" onClick={exportData}>
          Export backup
        </button>
        <button className="btn-ghost" onClick={() => fileRef.current?.click()}>
          Import backup
        </button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={importData} />
      </div>
      <p className="muted tiny center">Data is stored only in this browser (localStorage). Export a backup now and then.</p>
    </section>
  );
}
