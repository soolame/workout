import { useState } from 'react';
import { formatSets, prettyDate } from '../lib/core';
import Figure from './Figure';
import { Check, Down, Minus, Plus, Up } from './Icons';

function Stepper({ value, step, unit, onChange, label }) {
  const bump = (d) => onChange(Math.max(0, Math.round(((value ?? 0) + d) * 100) / 100));
  return (
    <div className="stepper">
      <button type="button" onClick={() => bump(-step)} aria-label={`Decrease ${label}`}>
        <Minus width={14} height={14} />
      </button>
      <label>
        <input
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          aria-label={label}
        />
        <span>{unit}</span>
      </label>
      <button type="button" onClick={() => bump(step)} aria-label={`Increase ${label}`}>
        <Plus width={14} height={14} />
      </button>
    </div>
  );
}

function SuggestionPill({ s, m }) {
  const unit = m.unit === 'sec' ? 's' : ' reps';
  if (s.kind === 'start') {
    return (
      <div className="pill">
        First session · start at {m.bw ? '' : `${s.weight} kg × `}
        {s.reps}
        {unit}
      </div>
    );
  }
  const last = formatSets(s.last.sets, m.unit);
  const when = prettyDate(s.last.date, { weekday: 'short', day: 'numeric', month: 'short' });
  return (
    <div className={`pill ${s.kind === 'up' ? 'pill-up' : ''}`}>
      {s.kind === 'up' ? <strong>▲ Level up! </strong> : null}
      <span className="pill-last">
        {when}: {last}
      </span>
      <span className="pill-target">
        → {s.kind === 'up' && !m.bw ? `${s.weight} kg` : `aim for ${s.reps}${unit}`}
      </span>
    </div>
  );
}

export default function ExerciseCard({ ex, entry, index, count, isNext, suggestion, onChange, onMove, onSetDone }) {
  const m = ex.main;
  const [open, setOpen] = useState(null); // null = auto (open until done)
  const expanded = open ?? !entry.done;
  const doneSets = entry.sets.filter((s) => s.done).length;
  const wStep = m.inc || 2.5;
  const rStep = m.step ?? 1;

  const withSets = (fn) =>
    onChange((e) => {
      const sets = fn(e.sets);
      return { ...e, sets, done: sets.length > 0 && sets.every((s) => s.done) };
    });

  const setField = (i, field, value) =>
    withSets((sets) => {
      const prev = sets[i][field];
      // Changing a value carries forward to later, not-yet-done sets that had the same value.
      return sets.map((s, j) =>
        j === i || (j > i && !s.done && s[field] === prev) ? { ...s, [field]: value } : s
      );
    });

  const toggleSet = (i) => {
    const finishing = !entry.sets[i].done;
    withSets((sets) => sets.map((s, j) => (j === i ? { ...s, done: !s.done } : s)));
    if (finishing) onSetDone(m.rest);
    setOpen(null);
  };

  const addSet = () => withSets((sets) => [...sets, { ...sets[sets.length - 1], done: false }]);
  const removeSet = () => withSets((sets) => (sets.length > 1 ? sets.slice(0, -1) : sets));
  const toggleDone = () => {
    onChange((e) => ({ ...e, done: !e.done }));
    setOpen(null);
  };

  return (
    <article className={`card ex-card ${entry.done ? 'done' : ''} ${isNext ? 'next' : ''}`}>
      <div className="card-top">
        <button className="fig-tile" onClick={() => setOpen(!expanded)} aria-label={`${expanded ? 'Collapse' : 'Expand'} ${ex.name}`}>
          <Figure fig={ex.fig} still={!expanded} />
          {entry.done && (
            <span className="fig-done">
              <Check />
            </span>
          )}
        </button>
        <div className="card-info" onClick={() => setOpen(!expanded)}>
          {isNext && <span className="badge">Up next</span>}
          <h3>
            <span className="order">{index + 1}</span>
            {ex.name}
          </h3>
          <p className="muted small">{ex.muscles}</p>
          <p className="meta">
            {m.sets} × {m.reps[0]}–{m.reps[1]}
            {m.unit === 'sec' ? ' sec' : ''} · rest {Math.floor(m.rest / 60)}:{String(m.rest % 60).padStart(2, '0')} · {doneSets}/
            {entry.sets.length} done
          </p>
        </div>
        <div className="reorder">
          <button onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move up">
            <Up width={16} height={16} />
          </button>
          <button onClick={() => onMove(1)} disabled={index === count - 1} aria-label="Move down">
            <Down width={16} height={16} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="card-body">
          <SuggestionPill s={suggestion} m={m} />

          <div className="sets">
            <div className="set-row set-head">
              <span>Set</span>
              {!m.bw && <span>Weight</span>}
              <span>{m.unit === 'sec' ? 'Time' : 'Reps'}</span>
              <span />
            </div>
            {entry.sets.map((s, i) => (
              <div key={i} className={`set-row ${s.done ? 'set-done' : ''} ${m.bw ? 'bw' : ''}`}>
                <span className="set-num">{i + 1}</span>
                {!m.bw && (
                  <Stepper value={s.w} step={wStep} unit="kg" label={`Set ${i + 1} weight`} onChange={(v) => setField(i, 'w', v)} />
                )}
                <Stepper
                  value={s.r}
                  step={rStep}
                  unit={m.unit === 'sec' ? 's' : '×'}
                  label={`Set ${i + 1} ${m.unit === 'sec' ? 'seconds' : 'reps'}`}
                  onChange={(v) => setField(i, 'r', v)}
                />
                <button className={`set-check ${s.done ? 'on' : ''}`} onClick={() => toggleSet(i)} aria-label={`Mark set ${i + 1} ${s.done ? 'not done' : 'done'}`}>
                  <Check />
                </button>
              </div>
            ))}
          </div>

          <div className="card-actions">
            <button className="btn-ghost" onClick={addSet}>
              <Plus width={14} height={14} /> Set
            </button>
            <button className="btn-ghost" onClick={removeSet} disabled={entry.sets.length <= 1}>
              <Minus width={14} height={14} /> Set
            </button>
            <button className="btn-ghost push-right" onClick={toggleDone}>
              {entry.done ? 'Mark not done' : 'Mark done'}
            </button>
          </div>

          <details className="cues">
            <summary>Form tips</summary>
            <ul>
              {ex.cues.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </article>
  );
}
