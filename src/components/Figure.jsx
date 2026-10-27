import { memo } from 'react';

// Renders an exercise as an SVG stick figure that loops between pose `a` and pose `b`.
// Poses are maps of joint -> [x, y] in a 100x100 box. Pose `b` inherits any joint it omits from `a`.

const SPLINE = '0.45 0 0.55 1;0.45 0 0.55 1';
const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const avg = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

function complete(raw, hasMid, hasToe) {
  const p = { ...raw };
  p.elbow2 ??= p.elbow;
  p.hand2 ??= p.hand;
  p.knee2 ??= p.knee;
  p.foot2 ??= p.foot;
  if (hasMid) p.mid ??= avg(p.neck, p.hip);
  if (hasToe) {
    p.toe ??= [p.foot[0] + 7, p.foot[1]];
    p.toe2 ??= [p.foot2[0] + p.toe[0] - p.foot[0], p.foot2[1] + p.toe[1] - p.foot[1]];
  }
  p.hands = avg(p.hand, p.hand2);
  return p;
}

function resolve(fig) {
  const rawB = { ...fig.a, ...(fig.b || {}) };
  const hasMid = 'mid' in rawB;
  const hasToe = 'toe' in rawB;
  return { a: complete(fig.a, hasMid, hasToe), b: complete(rawB, hasMid, hasToe) };
}

function Dumbbell({ vertical }) {
  return (
    <g transform={vertical ? 'rotate(90)' : undefined}>
      <line className="fig-db-bar" x1="-5" y1="0" x2="5" y2="0" />
      <rect className="fig-acc" x="-7.5" y="-4" width="3.5" height="8" rx="1.2" />
      <rect className="fig-acc" x="4" y="-4" width="3.5" height="8" rx="1.2" />
    </g>
  );
}

function Figure({ fig, still = false, className = '' }) {
  const { a, b } = resolve(fig);
  const live = !still && !reducedMotion && !!fig.b;
  const dur = `${fig.dur ?? 2.4}s`;
  const timing = { dur, repeatCount: 'indefinite', calcMode: 'spline', keyTimes: '0;0.5;1', keySplines: SPLINE };

  const anim = (attr, va, vb) =>
    live && va !== vb ? <animate attributeName={attr} values={`${va};${vb};${va}`} {...timing} /> : null;

  const seg = (j1, j2, cls) => (
    <line key={`${j1}-${j2}`} className={cls} x1={a[j1][0]} y1={a[j1][1]} x2={a[j2][0]} y2={a[j2][1]}>
      {anim('x1', a[j1][0], b[j1][0])}
      {anim('y1', a[j1][1], b[j1][1])}
      {anim('x2', a[j2][0], b[j2][0])}
      {anim('y2', a[j2][1], b[j2][1])}
    </line>
  );

  const at = (j, key, children) => {
    const [ax, ay] = a[j];
    const [bx, by] = b[j];
    return (
      <g key={key} transform={`translate(${ax} ${ay})`}>
        {live && (ax !== bx || ay !== by) && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`${ax} ${ay};${bx} ${by};${ax} ${ay}`}
            {...timing}
          />
        )}
        {children}
      </g>
    );
  };

  const props = fig.props || [];
  const backProps = [];
  const frontProps = [];
  props.forEach((pr, i) => {
    const key = `p${i}`;
    switch (pr.t) {
      case 'line':
        backProps.push(
          <line key={key} className="fig-eq" x1={pr.x1} y1={pr.y1} x2={pr.x2} y2={pr.y2} strokeWidth={pr.w ?? 3} />
        );
        break;
      case 'rect':
        backProps.push(<rect key={key} className="fig-eq-fill" x={pr.x} y={pr.y} width={pr.w} height={pr.h} rx={pr.r ?? 1.5} />);
        break;
      case 'cable':
        frontProps.push(
          <g key={key}>
            <line className="fig-cable" x1={pr.from[0]} y1={pr.from[1]} x2={a[pr.to][0]} y2={a[pr.to][1]}>
              {anim('x2', a[pr.to][0], b[pr.to][0])}
              {anim('y2', a[pr.to][1], b[pr.to][1])}
            </line>
            <circle className="fig-eq-fill" cx={pr.from[0]} cy={pr.from[1]} r="3" />
          </g>
        );
        break;
      case 'bar':
        frontProps.push(seg(pr.j[0], pr.j[1], pr.band ? 'fig-band' : 'fig-bar'));
        break;
      case 'db':
        frontProps.push(at(pr.at, key, <Dumbbell vertical={pr.v} />));
        break;
      case 'handle':
        frontProps.push(at(pr.at, key, <circle className="fig-acc" r="2.8" />));
        break;
      default:
    }
  });

  const far = fig.front ? 'fig-limb' : 'fig-limb fig-far';
  const torso = a.mid ? [seg('neck', 'mid', 'fig-limb'), seg('mid', 'hip', 'fig-limb')] : [seg('neck', 'hip', 'fig-limb')];

  return (
    <svg className={`figure ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      {!fig.noFloor && <line className="fig-floor" x1="6" y1="91.5" x2="94" y2="91.5" />}
      {backProps}
      {seg('hip', 'knee2', far)}
      {seg('knee2', 'foot2', far)}
      {a.toe && seg('foot2', 'toe2', far)}
      {seg('neck', 'elbow2', far)}
      {seg('elbow2', 'hand2', far)}
      {torso}
      {seg('hip', 'knee', 'fig-limb')}
      {seg('knee', 'foot', 'fig-limb')}
      {a.toe && seg('foot', 'toe', 'fig-limb')}
      {at('head', 'head', <circle className="fig-head" r="6.5" />)}
      {seg('neck', 'elbow', 'fig-limb')}
      {seg('elbow', 'hand', 'fig-limb')}
      {frontProps}
    </svg>
  );
}

export default memo(Figure);
