import { useCallback, useEffect, useState } from 'react';
import { createSession, loadDB, saveDB, todayKey } from './lib/core';
import TypePicker from './components/TypePicker';
import Session from './components/Session';
import History from './components/History';
import { Bolt, Calendar } from './components/Icons';

export default function App() {
  const [db, setDb] = useState(loadDB);
  const [today, setToday] = useState(todayKey);
  const [view, setView] = useState('today');
  const [preview, setPreview] = useState(null);

  useEffect(() => saveDB(db), [db]);

  // Roll over to a fresh day if the tab stays open past midnight.
  useEffect(() => {
    const tick = () => setToday(todayKey());
    const id = setInterval(tick, 60_000);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);

  const session = db.sessions[today];

  useEffect(() => {
    document.documentElement.dataset.type = session?.type ?? preview ?? 'push';
  }, [session?.type, preview]);

  const start = (type) =>
    setDb((d) => ({ ...d, sessions: { ...d.sessions, [today]: createSession(type, today, d.sessions) } }));

  const update = useCallback(
    (fn) => setDb((d) => (d.sessions[today] ? { ...d, sessions: { ...d.sessions, [today]: fn(d.sessions[today]) } } : d)),
    [today]
  );

  const resetToday = () =>
    setDb((d) => {
      const sessions = { ...d.sessions };
      delete sessions[today];
      return { ...d, sessions };
    });

  return (
    <div className="app">
      <main className="page">
        {view === 'history' ? (
          <History db={db} setDb={setDb} today={today} />
        ) : session ? (
          <Session session={session} sessions={db.sessions} today={today} update={update} onReset={resetToday} />
        ) : (
          <TypePicker today={today} onStart={start} onPreview={setPreview} />
        )}
      </main>

      <nav className="tabbar">
        <button className={view === 'today' ? 'active' : ''} onClick={() => setView('today')}>
          <Bolt /> Today
        </button>
        <button className={view === 'history' ? 'active' : ''} onClick={() => setView('history')}>
          <Calendar /> History
        </button>
      </nav>
    </div>
  );
}
