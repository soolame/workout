import { useEffect, useRef, useState } from 'react';
import { Clock } from './Icons';

export default function RestTimer({ rest, onAdjust, onClose }) {
  const [now, setNow] = useState(Date.now);
  const left = Math.max(0, Math.ceil((rest.end - now) / 1000));
  const over = left === 0;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!over) return;
    navigator.vibrate?.([200, 100, 200]);
    const id = setTimeout(() => closeRef.current(), 4000);
    return () => clearTimeout(id);
  }, [over]);

  const pct = rest.total ? 1 - left / rest.total : 1;

  return (
    <div className={`rest ${over ? 'rest-over' : ''}`} role="status">
      <div className="rest-bar" style={{ transform: `scaleX(${pct})` }} />
      <Clock />
      <span className="rest-time">
        {over ? 'Go! Next set' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`}
      </span>
      {!over && (
        <button onClick={() => onAdjust(15)} aria-label="Add 15 seconds">
          +15s
        </button>
      )}
      <button onClick={onClose}>{over ? 'Close' : 'Skip'}</button>
    </div>
  );
}
