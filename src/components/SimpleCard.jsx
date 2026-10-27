import Figure from './Figure';
import { Check, Down, Up } from './Icons';

// Warm-up / stretch item: a single tap marks it done.
export default function SimpleCard({ ex, entry, index, count, isNext, onChange, onMove }) {
  const toggle = () => onChange((e) => ({ ...e, done: !e.done }));
  return (
    <article className={`card simple-card ${entry.done ? 'done' : ''} ${isNext ? 'next' : ''}`}>
      <div className="fig-tile small">
        <Figure fig={ex.fig} still={entry.done} />
      </div>
      <div className="card-info" onClick={toggle}>
        {isNext && <span className="badge">Up next</span>}
        <h3>{ex.name}</h3>
        <p className="muted small">
          <span className="dose">{ex.dose}</span> · {ex.muscles}
        </p>
        {ex.note && <p className="muted tiny">{ex.note}</p>}
      </div>
      <div className="reorder">
        <button onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move up">
          <Up width={16} height={16} />
        </button>
        <button onClick={() => onMove(1)} disabled={index === count - 1} aria-label="Move down">
          <Down width={16} height={16} />
        </button>
      </div>
      <button className={`set-check ${entry.done ? 'on' : ''}`} onClick={toggle} aria-label={`Mark ${ex.name} ${entry.done ? 'not done' : 'done'}`}>
        <Check />
      </button>
    </article>
  );
}
