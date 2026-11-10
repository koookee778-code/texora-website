export interface LogoTransformState {
  /** Normalized scroll progress inside the scrollytelling track [0..1] */
  progress: number;
  /** Active narrative stage index: 0=Hero, 1..4=Slalom Dodging, 5=Pre-Midpoint Side Entry, 6=White Stage TEXORA Lock */
  stageIndex: number;
  /** 3D World X coordinate of the T emblem (-left, +right) */
  x: number;
  /** 3D World Y coordinate of the T emblem */
  y: number;
  /** 3D World Z coordinate of the T emblem */
  z: number;
  /** Euler rotation X in radians */
  rotX: number;
  /** Euler rotation Y in radians */
  rotY: number;
  /** Euler rotation Z in radians */
  rotZ: number;
  /** Uniform scale multiplier */
  scale: number;
  /** 0 = dark obsidian stage, 1 = crisp white TEXORA reveal stage */
  whiteStageBlend: number;
  /** 0..1 progress of the giant E-X-O-R-A letters appearing beside the T logo */
  letterRevealProgress: number;
  /** True once the T logo has settled and locked into its monumental wordmark anchor */
  isLogoDocked: boolean;
  /** Side that the text card occupies during slalom stages ('center' | 'right' | 'left' | 'white-stage') */
  activeCardSide: 'center' | 'right' | 'left' | 'white-stage';
}

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}

/**
 * Quintic C2-continuous smootherstep (zero velocity and zero acceleration jerk at endpoints)
 * for calm, flexible, liquid-smooth transitions between stages.
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x >= edge1 ? 1 : 0;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Computes a calm, continuous, C2-smooth 3D S-curve choreography of the Texora "T" emblem:
 * - 0.00: Centered in the upper Hero showcase zone (y = +1.32, scale = 0.52) above the Hero H1
 * - 0.18: Glides smoothly to the LEFT (-2.20) opposite Pillar 01 (Right card)
 * - 0.31: Glides smoothly to the RIGHT (+2.20) opposite Pillar 02 (Left card)
 * - 0.44: Glides smoothly to the LEFT (-2.20) opposite Pillar 03 (Right card)
 * - 0.55: Glides smoothly to the RIGHT (+2.20) opposite Pillar 04 (Left card)
 * - 0.65: Sweeps calmly from the side into the left 'T' slot as the White Stage softly fades in
 * - 0.76..1.00: Docks gently as the initial 'T' of TEXORA beside giant "E X O R A"
 */
export function computeLogoChoreography(rawProgress: number): LogoTransformState {
  const p = clamp01(rawProgress);

  // Continuous, unhurried S-curve keyframes without flat freezes:
  // [p, x, y, z, rotX, rotY, rotZ, scale]
  const keyframes: Array<[number, number, number, number, number, number, number, number]> = [
    // 0: Hero Upper-Center Showcase (calmly poised above Hero headline)
    [0.00, 0.0, 1.32, 0.25, 0.02, 0.0, 0.0, 0.52],
    // 1: Smooth S-curve glide to the Left open lane (opposite Pillar 01 Right card)
    [0.17, -2.25, 0.05, 0.20, 0.06, 0.22, 0.04, 0.66],
    // 2: Smooth S-curve glide to the Right open lane (opposite Pillar 02 Left card)
    [0.31, 2.25, 0.0, 0.20, -0.06, -0.22, -0.04, 0.66],
    // 3: Smooth S-curve glide to the Left open lane (opposite Pillar 03 Right card)
    [0.44, -2.25, 0.0, 0.20, 0.06, 0.22, 0.04, 0.66],
    // 4: Smooth S-curve glide to the Right open lane (opposite Pillar 04 Left card)
    [0.55, 2.25, 0.0, 0.22, -0.06, -0.20, -0.04, 0.66],
    // 5: Calm side sweep into the 'T' slot as White Stage emerges
    [0.65, -2.55, 0.0, 0.35, 0.02, 0.10, 0.02, 0.74],
    // 6: Gently docked as the initial 'T' of TEXORA on the Pure White Reveal Stage
    [0.75, -2.35, 0.0, 0.55, 0.0, 0.0, 0.0, 0.82],
    [1.00, -2.35, 0.0, 0.55, 0.0, 0.0, 0.0, 0.82],
  ];

  let segIdx = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (p >= keyframes[i][0] && p <= keyframes[i + 1][0]) {
      segIdx = i;
      break;
    }
  }

  const k0 = keyframes[segIdx];
  const k1 = keyframes[segIdx + 1];
  const localT = smoothstep(k0[0], k1[0], p);

  const x = lerp(k0[1], k1[1], localT);
  const y = lerp(k0[2], k1[2], localT);
  const z = lerp(k0[3], k1[3], localT);
  const rotX = lerp(k0[4], k1[4], localT);
  const rotY = lerp(k0[5], k1[5], localT);
  const rotZ = lerp(k0[6], k1[6], localT);
  const scale = lerp(k0[7], k1[7], localT);

  const whiteStageBlend = smoothstep(0.60, 0.71, p);
  const letterRevealProgress = smoothstep(0.68, 0.81, p);
  const isLogoDocked = p >= 0.74;

  let stageIndex = 0;
  let activeCardSide: LogoTransformState['activeCardSide'] = 'center';

  if (p < 0.11) {
    stageIndex = 0;
    activeCardSide = 'center';
  } else if (p < 0.245) {
    stageIndex = 1;
    activeCardSide = 'right';
  } else if (p < 0.375) {
    stageIndex = 2;
    activeCardSide = 'left';
  } else if (p < 0.495) {
    stageIndex = 3;
    activeCardSide = 'right';
  } else if (p < 0.60) {
    stageIndex = 4;
    activeCardSide = 'left';
  } else if (p < 0.72) {
    stageIndex = 5;
    activeCardSide = 'white-stage';
  } else {
    stageIndex = 6;
    activeCardSide = 'white-stage';
  }

  return {
    progress: p,
    stageIndex,
    x,
    y,
    z,
    rotX,
    rotY,
    rotZ,
    scale,
    whiteStageBlend,
    letterRevealProgress,
    isLogoDocked,
    activeCardSide,
  };
}

export interface LeadSubmissionInput {
  clientName: string;
  whatsappPhone: string;
  companyOrBrand: string;
  systemCategory: 'web-platform' | 'digital-marketing' | 'edtech-lms' | 'pharmacy-retail-erp' | (string & {});
  projectSummary: string;
}

export interface LeadValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof LeadSubmissionInput, string>>;
}

export function validateLeadInput(input: LeadSubmissionInput): LeadValidationResult {
  const errors: Partial<Record<keyof LeadSubmissionInput, string>> = {};

  if (!input.clientName || input.clientName.trim().length < 2) {
    errors.clientName = 'يرجى إدخال الاسم بالكامل (حرفين على الأقل).';
  }

  const cleanedPhone = (input.whatsappPhone || '').replace(/[\s\-()]/g, '');
  if (!/^\+?[0-9]{8,15}$/.test(cleanedPhone)) {
    errors.whatsappPhone = 'يرجى إدخال رقم واتساب صحيح (8 إلى 15 رقماً).';
  }

  if (!input.companyOrBrand || input.companyOrBrand.trim().length < 2) {
    errors.companyOrBrand = 'يرجى تحديد اسم الشركة أو الصيدلية أو المتجر.';
  }

  if (!input.projectSummary || input.projectSummary.trim().length < 10) {
    errors.projectSummary = 'يرجى كتابة نبذة مختصرة عن المشروع (10 أحرف على الأقل).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
