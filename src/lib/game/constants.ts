// Tuning values. Change these to rebalance the game.

export const SIZE = 6; // board is SIZE x SIZE
export const CELLS = SIZE * SIZE;
export const TRAY_MAX = 7; // 7 = up to 4 numbers + 3 operators
export const OPERATORS = ['+', '−', '×', '÷'] as const;

// Board generation
export const MIN_DIGITS = 10; // refill guarantee: at least this many number tiles
export const MIN_EACH_OP = 2; // refill guarantee: at least this many of each operator
export const DIGIT_CHANCE = 0.3; // chance a random (non-guaranteed) tile is a number
export const MAX_TWO_DIGIT = 2; // max two-digit tiles on the board
export const TWO_DIGIT_FROM_ROUND = 4;
export const TWO_DIGIT_CHANCE = 0.12;

// Combat
export const START_HP = 100;
export const ENEMY_EVERY = 3; // enemy attacks every N player turns
export const HEAL_ON_WIN = 10; // placeholder for the reward system
export const BOSS_EVERY = 5;

// Weak spot
export const WEAK_MULT = 3; // exact hit multiplies damage by this
export const TARGET_MIN = 10; // smallest weak spot number
export const TARGET_MAX_MIN = 60; // largest weak spot is at least this
export const TARGET_MAX_HP_SHARE = 0.4; // ...or this share of enemy max HP, if larger
export const TARGET_TRIES = 500;
