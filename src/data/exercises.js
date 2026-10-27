// Exercise library. Weights are in kg.
// main: sets, reps [min, max], start weight, inc (weight jump when you hit the top of the rep range), rest seconds.
// fig: stick-figure poses (see Figure.jsx).

// Base poses
const S = { head: [50, 22], neck: [50, 31], hip: [50, 57], elbow: [50, 44], hand: [50, 57], knee: [50, 73], foot: [50, 90] };
const F = {
  head: [50, 22], neck: [50, 31], hip: [50, 57],
  elbow: [42, 44], hand: [40, 57], elbow2: [58, 44], hand2: [60, 57],
  knee: [46, 73], foot: [44, 90], knee2: [54, 73], foot2: [56, 90],
};
const SF = {
  head: [50, 26], neck: [50, 35], hip: [50, 61],
  elbow: [42, 48], hand: [40, 60], elbow2: [58, 48], hand2: [60, 60],
  knee: [42, 68], foot: [42, 88], knee2: [58, 68], foot2: [58, 88],
};
const SEAT = { t: 'rect', x: 34, y: 61, w: 32, h: 4 };
const BENT = { hip: [60, 54], neck: [38, 42], head: [31, 37], knee: [62, 72], foot: [58, 90] };
const DB = { t: 'db', at: 'hand' };
const DB2 = { t: 'db', at: 'hand2' };

const main = (sets, reps, start, inc, rest, extra = {}) => ({ sets, reps, start, inc, rest, ...extra });

export const EXERCISES = [
  // ───────── PUSH ─────────
  {
    id: 'bench-press', kind: 'main', name: 'Bench Press', muscles: 'Chest · Front delts · Triceps',
    main: main(4, [8, 12], 7.5, 2.5, 120),
    cues: ['Squeeze shoulder blades together and down', 'Lower slowly (3 sec) to mid-chest', 'Drive up, keep feet planted'],
    fig: {
      a: { head: [22, 61], neck: [30, 64], hip: [56, 64], knee: [70, 70], foot: [72, 88], elbow: [26, 74], hand: [30, 60] },
      b: { elbow: [31, 50], hand: [32, 36] },
      props: [{ t: 'rect', x: 16, y: 67, w: 52, h: 4 }, { t: 'line', x1: 22, y1: 71, x2: 22, y2: 90 }, { t: 'line', x1: 62, y1: 71, x2: 62, y2: 90 }, DB],
    },
  },
  {
    id: 'incline-press', kind: 'main', name: 'Incline Dumbbell Press', muscles: 'Upper chest · Front delts',
    main: main(3, [8, 12], 7.5, 2.5, 90),
    cues: ['Bench at 30–45°', 'Elbows ~45° from torso, not flared', 'Press up and slightly in'],
    fig: {
      a: { head: [36, 34], neck: [40, 42], hip: [56, 66], knee: [70, 68], foot: [72, 88], elbow: [30, 52], hand: [34, 38] },
      b: { elbow: [42, 28], hand: [44, 14] },
      props: [{ t: 'line', x1: 60, y1: 72, x2: 36, y2: 40, w: 4 }, { t: 'line', x1: 58, y1: 72, x2: 58, y2: 90 }, DB],
    },
  },
  {
    id: 'pec-fly', kind: 'main', name: 'Pec Fly (Machine)', muscles: 'Chest',
    main: main(3, [10, 15], 30, 5, 75),
    cues: ['Soft, fixed bend in the elbows', 'Squeeze 1 sec when handles meet', 'Control the stretch on the way back'],
    fig: {
      front: true,
      a: { ...SF, elbow: [34, 38], hand: [20, 40], elbow2: [66, 38], hand2: [80, 40] },
      b: { elbow: [38, 40], hand: [47, 34], elbow2: [62, 40], hand2: [53, 34] },
      props: [SEAT, { t: 'line', x1: 12, y1: 12, x2: 12, y2: 90 }, { t: 'line', x1: 88, y1: 12, x2: 88, y2: 90 }, { t: 'handle', at: 'hand' }, { t: 'handle', at: 'hand2' }],
    },
  },
  {
    id: 'shoulder-press', kind: 'main', name: 'Seated Dumbbell Shoulder Press', muscles: 'Shoulders · Triceps',
    main: main(3, [8, 12], 7.5, 2.5, 90),
    cues: ['Brace core, back flat against the pad', 'Start at ear level', 'Press up without clanking the dumbbells'],
    fig: {
      front: true,
      a: { ...SF, elbow: [36, 44], hand: [34, 30], elbow2: [64, 44], hand2: [66, 30] },
      b: { elbow: [40, 24], hand: [43, 10], elbow2: [60, 24], hand2: [57, 10] },
      props: [{ t: 'rect', x: 42, y: 30, w: 16, h: 34, r: 3 }, SEAT, DB, DB2],
    },
  },
  {
    id: 'lateral-raise', kind: 'main', name: 'Lateral Raise', muscles: 'Side delts',
    main: main(3, [12, 15], 5, 2.5, 60),
    cues: ['Lead with the elbows', 'Stop at shoulder height', 'Slow 2–3 sec on the way down'],
    fig: {
      front: true,
      a: { ...F, elbow: [45, 45], hand: [44, 58], elbow2: [55, 45], hand2: [56, 58] },
      b: { elbow: [37, 33], hand: [24, 32], elbow2: [63, 33], hand2: [76, 32] },
      props: [DB, DB2],
    },
  },
  {
    id: 'overhead-triceps', kind: 'main', name: 'Overhead Triceps Extension', muscles: 'Triceps',
    main: main(3, [10, 12], 7.5, 2.5, 60),
    cues: ['Hold one dumbbell with both hands', 'Elbows point up and stay close to head', 'Full stretch behind the head'],
    fig: {
      a: { ...S, elbow: [53, 17], hand: [43, 27] },
      b: { hand: [55, 3] },
      props: [DB],
    },
  },

  // ───────── PULL ─────────
  {
    id: 'lat-pulldown', kind: 'main', name: 'Lat Pulldown', muscles: 'Lats · Biceps',
    main: main(4, [8, 12], 25, 5, 120),
    cues: ['Chest up, slight lean back', 'Pull the bar to upper chest', 'Think "elbows down to pockets"'],
    fig: {
      front: true,
      a: { ...SF, elbow: [39, 22], hand: [33, 9], elbow2: [61, 22], hand2: [67, 9] },
      b: { elbow: [34, 46], hand: [36, 32], elbow2: [66, 46], hand2: [64, 32] },
      props: [SEAT, { t: 'cable', from: [50, 2], to: 'hands' }, { t: 'bar', j: ['hand', 'hand2'] }],
    },
  },
  {
    id: 'seated-row', kind: 'main', name: 'Seated Cable Row', muscles: 'Mid back · Lats · Rear delts',
    main: main(3, [8, 12], 35, 5, 90),
    cues: ['Sit tall, don\'t swing', 'Pull handle to belly button', 'Squeeze shoulder blades for 1 sec'],
    fig: {
      a: { head: [49, 33], neck: [46, 41], hip: [40, 66], knee: [56, 58], foot: [72, 68], elbow: [56, 47], hand: [68, 53] },
      b: { head: [40, 31], neck: [40, 40], elbow: [28, 50], hand: [40, 52] },
      props: [{ t: 'rect', x: 28, y: 68, w: 22, h: 4 }, { t: 'line', x1: 76, y1: 56, x2: 76, y2: 76, w: 4 }, { t: 'cable', from: [90, 62], to: 'hand' }, { t: 'handle', at: 'hand' }],
    },
  },
  {
    id: 'db-row', kind: 'main', name: 'Bent-Over Dumbbell Row', muscles: 'Lats · Rhomboids',
    main: main(3, [8, 12], 7.5, 2.5, 90),
    cues: ['Hinge until torso is ~45°', 'Flat back, neck neutral', 'Row toward your hips, not chest'],
    fig: {
      a: { ...BENT, elbow: [38, 56], hand: [38, 70] },
      b: { elbow: [52, 40], hand: [46, 53] },
      props: [DB],
    },
  },
  {
    id: 'rear-delt-fly', kind: 'main', name: 'Rear Delt Fly', muscles: 'Rear delts · Upper back',
    main: main(3, [12, 15], 5, 2.5, 60),
    cues: ['Bend forward, flat back', 'Arms out wide like wings', 'Pause at the top, no swinging'],
    fig: {
      front: true,
      a: { ...F, head: [50, 40], neck: [50, 47], hip: [50, 58], knee: [45, 74], knee2: [55, 74], elbow: [44, 59], hand: [43, 71], elbow2: [56, 59], hand2: [57, 71] },
      b: { elbow: [37, 48], hand: [24, 47], elbow2: [63, 48], hand2: [76, 47] },
      props: [DB, DB2],
    },
  },
  {
    id: 'db-curl', kind: 'main', name: 'Dumbbell Curl', muscles: 'Biceps',
    main: main(3, [8, 12], 7.5, 2.5, 60),
    cues: ['Elbows pinned to your sides', 'Squeeze at the top', 'Lower all the way down'],
    fig: { a: { ...S, elbow: [51, 45], hand: [52, 59] }, b: { hand: [60, 34] }, props: [DB] },
  },
  {
    id: 'hammer-curl', kind: 'main', name: 'Hammer Curl', muscles: 'Brachialis · Forearms',
    main: main(3, [10, 12], 7.5, 2.5, 60),
    cues: ['Palms face each other', 'No swinging the torso', 'Controlled negative'],
    fig: { a: { ...S, elbow: [51, 45], hand: [52, 59] }, b: { hand: [60, 34] }, props: [{ ...DB, v: true }] },
  },

  // ───────── LEGS ─────────
  {
    id: 'goblet-squat', kind: 'main', name: 'Goblet Squat', muscles: 'Quads · Glutes',
    main: main(4, [10, 15], 7.5, 2.5, 90),
    cues: ['Hold dumbbell at chest', 'Sit between your heels, chest up', 'Knees track over toes'],
    fig: {
      a: { ...S, knee: [52, 73], elbow: [52, 44], hand: [57, 36] },
      b: { head: [51, 37], neck: [48, 46], hip: [38, 70], knee: [56, 72], elbow: [52, 58], hand: [56, 50] },
      props: [{ ...DB, v: true }],
    },
  },
  {
    id: 'db-rdl', kind: 'main', name: 'Dumbbell Romanian Deadlift', muscles: 'Hamstrings · Glutes',
    main: main(3, [10, 12], 7.5, 2.5, 90),
    cues: ['Soft knees, push hips back', 'Dumbbells slide down the legs', 'Feel the hamstring stretch, then squeeze glutes'],
    fig: {
      a: { ...S, knee: [51, 73], elbow: [51, 44], hand: [52, 57] },
      b: { head: [71, 45], neck: [64, 48], hip: [42, 58], knee: [48, 74], elbow: [64, 61], hand: [64, 74] },
      props: [DB],
    },
  },
  {
    id: 'lunge', kind: 'main', name: 'Dumbbell Walking Lunge', muscles: 'Quads · Glutes',
    main: main(3, [10, 12], 5, 2.5, 90),
    cues: ['Reps are per leg', 'Long step, torso upright', 'Back knee just above the floor'],
    fig: {
      a: { ...S, knee: [53, 73], foot: [54, 90], knee2: [47, 73], foot2: [46, 90] },
      b: { head: [50, 34], neck: [50, 43], hip: [50, 68], elbow: [50, 56], hand: [50, 68], knee: [64, 72], foot: [66, 90], knee2: [42, 86], foot2: [26, 88] },
      props: [DB],
    },
  },
  {
    id: 'glute-bridge-db', kind: 'main', name: 'Dumbbell Glute Bridge', muscles: 'Glutes · Hamstrings',
    main: main(3, [12, 15], 7.5, 2.5, 60),
    cues: ['Dumbbell resting on hips', 'Drive through heels', 'Squeeze glutes 2 sec at top'],
    fig: {
      a: { head: [16, 82], neck: [24, 85], hip: [48, 86], knee: [62, 70], foot: [72, 88], elbow: [32, 88], hand: [40, 88] },
      b: { hip: [46, 70], knee: [62, 68] },
      props: [{ t: 'db', at: 'hip' }],
    },
  },
  {
    id: 'calf-raise', kind: 'main', name: 'Standing Calf Raise', muscles: 'Calves',
    main: main(3, [12, 20], 7.5, 2.5, 45),
    cues: ['Rise as high as you can', 'Pause 1 sec at the top', 'Slow stretch at the bottom'],
    fig: {
      a: { ...S, toe: [57, 90] },
      b: { head: [50, 17], neck: [50, 26], hip: [50, 52], elbow: [50, 39], hand: [50, 52], knee: [50, 68], foot: [51, 85], toe: [57, 90] },
      dur: 1.6,
      props: [DB],
    },
  },
  {
    id: 'plank', kind: 'main', name: 'Plank', muscles: 'Core',
    main: main(3, [30, 60], 0, 0, 45, { bw: true, unit: 'sec', step: 5 }),
    cues: ['Elbows under shoulders', 'Squeeze glutes, ribs down', 'Straight line head to heels'],
    fig: {
      a: { head: [20, 68], neck: [28, 71], hip: [56, 74], knee: [71, 79], foot: [86, 88], elbow: [28, 86], hand: [42, 88] },
      b: { hip: [56, 72] },
      dur: 3,
    },
  },

  // ───────── WARM-UPS ─────────
  {
    id: 'jumping-jacks', kind: 'warmup', name: 'Jumping Jacks', muscles: 'Full body · Heart rate', dose: '60 sec',
    fig: {
      front: true, dur: 0.9, a: F,
      b: { elbow: [38, 20], hand: [32, 8], elbow2: [62, 20], hand2: [68, 8], knee: [40, 73], foot: [34, 90], knee2: [60, 73], foot2: [66, 90] },
    },
  },
  {
    id: 'arm-circles', kind: 'warmup', name: 'Arm Circles', muscles: 'Shoulders', dose: '20 forward + 20 back',
    fig: {
      front: true, dur: 0.9,
      a: { ...F, elbow: [38, 33], hand: [26, 34], elbow2: [62, 33], hand2: [74, 34] },
      b: { elbow: [38, 28], hand: [26, 25], elbow2: [62, 28], hand2: [74, 25] },
    },
  },
  {
    id: 'band-pull-apart', kind: 'warmup', name: 'Band Pull-Apart', muscles: 'Rear delts · Upper back', dose: '15 reps',
    note: 'No band? Do the same motion with empty hands.',
    fig: {
      front: true,
      a: { ...F, elbow: [43, 33], hand: [45, 32], elbow2: [57, 33], hand2: [55, 32] },
      b: { elbow: [37, 32], hand: [24, 32], elbow2: [63, 32], hand2: [76, 32] },
      props: [{ t: 'bar', j: ['hand', 'hand2'], band: true }],
    },
  },
  {
    id: 'push-ups-warmup', kind: 'warmup', name: 'Push-ups', muscles: 'Chest · Triceps', dose: '10 easy reps',
    fig: {
      a: { head: [18, 58], neck: [26, 62], hip: [54, 72], knee: [68, 80], foot: [84, 88], elbow: [26, 75], hand: [26, 88] },
      b: { head: [18, 74], neck: [26, 78], hip: [54, 82], knee: [68, 85], elbow: [36, 80] },
      dur: 1.8,
    },
  },
  {
    id: 'cat-cow', kind: 'warmup', name: 'Cat-Cow', muscles: 'Spine mobility', dose: '10 slow reps',
    fig: {
      a: { head: [23, 56], neck: [32, 62], mid: [47, 68], hip: [62, 62], elbow: [32, 75], hand: [32, 88], knee: [62, 88], foot: [80, 88] },
      b: { head: [26, 71], mid: [47, 54] },
      dur: 3.5,
    },
  },
  {
    id: 'bw-squat', kind: 'warmup', name: 'Bodyweight Squat', muscles: 'Quads · Glutes', dose: '15 reps',
    fig: {
      a: { ...S, knee: [52, 73], elbow: [60, 33], hand: [70, 33] },
      b: { head: [51, 37], neck: [48, 46], hip: [38, 70], knee: [56, 72], elbow: [58, 47], hand: [68, 47] },
    },
  },
  {
    id: 'leg-swings', kind: 'warmup', name: 'Leg Swings', muscles: 'Hips · Hamstrings', dose: '10 per leg',
    fig: {
      a: { ...S, elbow: [57, 40], hand: [65, 37], knee: [60, 70], foot: [70, 84], knee2: [50, 73], foot2: [50, 90] },
      b: { knee: [44, 72], foot: [36, 87] },
      dur: 1.4,
    },
  },
  {
    id: 'glute-bridge', kind: 'warmup', name: 'Glute Bridge', muscles: 'Glutes', dose: '15 reps',
    fig: {
      a: { head: [16, 82], neck: [24, 85], hip: [48, 86], knee: [62, 70], foot: [72, 88], elbow: [32, 88], hand: [40, 88] },
      b: { hip: [46, 70], knee: [62, 68] },
    },
  },

  // ───────── STRETCHES ─────────
  {
    id: 'doorway-chest', kind: 'stretch', name: 'Doorway Chest Stretch', muscles: 'Chest · Biceps', dose: '30 sec / side',
    fig: {
      a: { ...S, elbow: [37, 30], hand: [36, 18], elbow2: [50, 44], hand2: [51, 57] },
      b: { head: [53, 22], neck: [52, 31] },
      dur: 4,
      props: [{ t: 'line', x1: 33, y1: 6, x2: 33, y2: 90, w: 4 }],
    },
  },
  {
    id: 'triceps-stretch', kind: 'stretch', name: 'Overhead Triceps Stretch', muscles: 'Triceps · Lats', dose: '30 sec / side',
    fig: {
      front: true, dur: 4,
      a: { ...F, elbow: [57, 15], hand: [49, 26], elbow2: [40, 22], hand2: [54, 16] },
      b: { elbow: [56, 14], hand2: [53, 15], head: [49, 22] },
    },
  },
  {
    id: 'cross-body', kind: 'stretch', name: 'Cross-Body Shoulder Stretch', muscles: 'Rear delts', dose: '30 sec / side',
    fig: {
      front: true, dur: 4,
      a: { ...F, elbow: [40, 34], hand: [28, 35], elbow2: [58, 44], hand2: [44, 36] },
      b: { hand: [26, 33], hand2: [42, 35] },
    },
  },
  {
    id: 'cobra', kind: 'stretch', name: 'Cobra Stretch', muscles: 'Abs · Hip flexors', dose: '30 sec',
    fig: {
      a: { head: [26, 58], neck: [30, 66], mid: [42, 80], hip: [54, 86], knee: [70, 88], foot: [86, 88], elbow: [32, 78], hand: [32, 88] },
      b: { head: [27, 54], neck: [30, 62], mid: [42, 78], elbow: [31, 75] },
      dur: 4,
    },
  },
  {
    id: 'side-bend', kind: 'stretch', name: 'Standing Side Bend', muscles: 'Lats · Obliques', dose: '30 sec / side',
    fig: {
      front: true, dur: 4,
      a: { ...F, mid: [50, 44], elbow: [46, 18], hand: [48, 6], elbow2: [54, 18], hand2: [52, 6] },
      b: { head: [40, 24], neck: [43, 33], mid: [48, 45], elbow: [37, 22], hand: [33, 10], elbow2: [45, 19], hand2: [37, 9] },
    },
  },
  {
    id: 'childs-pose', kind: 'stretch', name: "Child's Pose", muscles: 'Lats · Lower back', dose: '45 sec',
    fig: {
      a: { head: [32, 82], neck: [40, 80], mid: [54, 78], hip: [70, 80], knee: [58, 88], foot: [80, 88], elbow: [26, 86], hand: [14, 88] },
      b: { neck: [39, 81], mid: [54, 76] },
      dur: 4,
    },
  },
  {
    id: 'quad-stretch', kind: 'stretch', name: 'Standing Quad Stretch', muscles: 'Quads · Hip flexors', dose: '30 sec / side',
    fig: {
      a: { ...S, knee: [48, 74], foot: [40, 62], knee2: [50, 73], foot2: [50, 90], elbow: [44, 48], hand: [41, 61], elbow2: [58, 40], hand2: [66, 36] },
      b: { foot: [39, 60], hand: [40, 59] },
      dur: 4,
    },
  },
  {
    id: 'hamstring', kind: 'stretch', name: 'Seated Hamstring Stretch', muscles: 'Hamstrings · Lower back', dose: '45 sec',
    fig: {
      a: { head: [57, 64], neck: [50, 66], mid: [40, 72], hip: [30, 84], knee: [50, 86], foot: [70, 86], elbow: [60, 74], hand: [68, 80] },
      b: { head: [59, 69], neck: [52, 70], mid: [41, 74], elbow: [62, 78], hand: [70, 83] },
      dur: 4,
    },
  },
  {
    id: 'hip-flexor', kind: 'stretch', name: 'Kneeling Hip Flexor Stretch', muscles: 'Hip flexors · Quads', dose: '30 sec / side',
    fig: {
      a: { head: [48, 34], neck: [48, 43], hip: [48, 68], knee: [62, 72], foot: [64, 90], knee2: [40, 86], foot2: [24, 88], elbow: [56, 54], hand: [62, 68] },
      b: { hip: [51, 69], neck: [50, 43], head: [50, 34] },
      dur: 4,
    },
  },
  {
    id: 'calf-wall', kind: 'stretch', name: 'Wall Calf Stretch', muscles: 'Calves', dose: '30 sec / side',
    fig: {
      a: { head: [60, 25], neck: [56, 33], hip: [48, 57], knee: [60, 72], foot: [62, 90], knee2: [40, 74], foot2: [32, 90], elbow: [66, 38], hand: [77, 38] },
      b: { head: [62, 26], neck: [58, 34], hip: [50, 58], elbow: [67, 40] },
      dur: 4,
      props: [{ t: 'line', x1: 80, y1: 6, x2: 80, y2: 90, w: 4 }],
    },
  },
];

export const EX = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));

export const PLANS = {
  push: {
    label: 'Push', focus: 'Chest · Shoulders · Triceps', days: 'Mon · Thu', hero: 'bench-press',
    warmup: ['jumping-jacks', 'arm-circles', 'band-pull-apart', 'push-ups-warmup'],
    main: ['bench-press', 'incline-press', 'pec-fly', 'shoulder-press', 'lateral-raise', 'overhead-triceps'],
    stretch: ['doorway-chest', 'cross-body', 'triceps-stretch', 'cobra'],
  },
  pull: {
    label: 'Pull', focus: 'Back · Rear delts · Biceps', days: 'Tue · Fri', hero: 'lat-pulldown',
    warmup: ['jumping-jacks', 'arm-circles', 'cat-cow', 'band-pull-apart'],
    main: ['lat-pulldown', 'seated-row', 'db-row', 'rear-delt-fly', 'db-curl', 'hammer-curl'],
    stretch: ['side-bend', 'childs-pose', 'cross-body', 'doorway-chest'],
  },
  legs: {
    label: 'Legs', focus: 'Quads · Hamstrings · Glutes · Core', days: 'Wed · Sat', hero: 'goblet-squat',
    warmup: ['jumping-jacks', 'leg-swings', 'bw-squat', 'glute-bridge'],
    main: ['goblet-squat', 'db-rdl', 'lunge', 'glute-bridge-db', 'calf-raise', 'plank'],
    stretch: ['quad-stretch', 'hamstring', 'hip-flexor', 'calf-wall', 'childs-pose'],
  },
};

// getDay(): 0 = Sunday … 6 = Saturday
export const SCHEDULE = { 0: null, 1: 'push', 2: 'pull', 3: 'legs', 4: 'push', 5: 'pull', 6: 'legs' };
