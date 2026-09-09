export const MIN_SET_SCORE = 21
export const MIN_WIN_MARGIN = 2
export const BO5_WIN_SETS = 3
export const MAX_SETS = 5
export const MIN_SETS = 3
export const BUBBLE_THRESHOLD = 10
export const DEUCE_TOTAL_THRESHOLD = 40
export const DEFAULT_VISIBLE_SETS = 3
/** Worst realistic choke (BO5 / 21) before pity scale — see calculateDistance scenarios */
export const PITY_REFERENCE_KM = 108.4
/** Cap applied when pity mode is on: reference choke maps to this distance */
export const PITY_CAP_KM = 50
export const PITY_SCALE = PITY_CAP_KM / PITY_REFERENCE_KM
