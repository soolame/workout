const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const Check = (p) => <svg {...base} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const Up = (p) => <svg {...base} {...p}><path d="M6 15l6-6 6 6" /></svg>;
export const Down = (p) => <svg {...base} {...p}><path d="M6 9l6 6 6-6" /></svg>;
export const Plus = (p) => <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>;
export const Minus = (p) => <svg {...base} {...p}><path d="M5 12h14" /></svg>;
export const Clock = (p) => <svg {...base} {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
export const Calendar = (p) => <svg {...base} {...p}><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>;
export const Bolt = (p) => <svg {...base} {...p}><path d="M13 3L5 13.5h6L10 21l8-10.5h-6L13 3z" /></svg>;
export const Arrow = (p) => <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const Swap = (p) => <svg {...base} {...p}><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" /></svg>;
