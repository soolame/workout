import { useEffect, useState } from 'react';
import { EX, PLANS, SCHEDULE } from '../data/exercises';
import { keyToDate, prettyDate } from '../lib/core';
import Figure from './Figure';
import { Arrow, Check } from './Icons';

export default function TypePicker({ today, onStart, onPreview }) {
  const scheduled = SCHEDULE[keyToDate(today).getDay()];
  const [type, setType] = useState(scheduled ?? 'push');

  useEffect(() => onPreview(type), [type, onPreview]);

  return (
    <section className="picker">
      <p className="eyebrow">{prettyDate(today)}</p>
      <h1 className="title">What are we training today?</h1>
      {scheduled ? (
        <p className="muted">
          Your schedule says <strong className="accent-text">{PLANS[scheduled].label} day</strong>.
        </p>
      ) : (
        <p className="muted">Sunday is your rest day — pick a session if you're training anyway.</p>
      )}

      <div className="type-list">
        {Object.entries(PLANS).map(([key, plan]) => (
          <button
            key={key}
            data-type={key}
            className={`type-card ${type === key ? 'selected' : ''}`}
            onClick={() => setType(key)}
            aria-pressed={type === key}
          >
            <div className="type-fig">
              <Figure fig={EX[plan.hero].fig} still={type !== key} />
            </div>
            <div className="type-body">
              <div className="type-row">
                <span className="type-name">{plan.label}</span>
                {scheduled === key && <span className="badge">Scheduled</span>}
              </div>
              <span className="type-focus">{plan.focus}</span>
              <span className="type-days">
                {plan.days} · {plan.main.length} exercises
              </span>
            </div>
            <span className="type-check">{type === key && <Check />}</span>
          </button>
        ))}
      </div>

      <button className="btn-primary big" onClick={() => onStart(type)}>
        Start {PLANS[type].label} Day <Arrow />
      </button>
    </section>
  );
}
