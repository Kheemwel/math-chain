import {
	TARGET_MAX_HP_SHARE,
	TARGET_MAX_MIN,
	TARGET_MIN,
	TARGET_TRIES
} from './constants';
import { enemyMaxHp } from './enemy';
import { evaluate } from './evaluator';
import { randInt, shuffle } from './random';
import type { Cell, Rng, Token } from './types';

/**
 * Picks a weak spot number by sampling a formula from the tiles currently on
 * the board. Guarantees:
 * - a formula using − or ÷ that makes the number exists on the board,
 * - the number is within [TARGET_MIN, max],
 * - + and × cannot make it from just two numbers (so − and ÷ are the cheap route).
 * Returns null if no sample qualifies.
 */
export function pickTarget(board: readonly Cell[], round: number, rng: Rng): number | null {
	const nums: number[] = [];
	const ops: string[] = [];
	for (const { tile } of board) {
		if (!tile) continue;
		if (tile.type === 'num') nums.push(tile.value);
		else ops.push(tile.value);
	}

	const maxTarget = Math.max(TARGET_MAX_MIN, Math.round(enemyMaxHp(round) * TARGET_MAX_HP_SHARE));

	const plusTimesTwo = new Set<number>();
	for (const a of nums) {
		for (const b of nums) {
			plusTimesTwo.add(a + b);
			plusTimesTwo.add(a * b);
		}
	}

	for (let tries = 0; tries < TARGET_TRIES; tries++) {
		const numCount = randInt(2, rng) === 0 ? 2 : 3; // 3 or 5 tiles long
		const n = shuffle([...nums], rng).slice(0, numCount);
		const o = shuffle([...ops], rng).slice(0, numCount - 1);
		if (!o.some((op) => op === '−' || op === '÷')) continue;

		const tokens: Token[] = [];
		n.forEach((value, i) => {
			tokens.push(value);
			if (i < o.length) tokens.push(o[i] as Token);
		});

		const r = evaluate(tokens);
		if (r.ok && r.value >= TARGET_MIN && r.value <= maxTarget && !plusTimesTwo.has(r.value)) {
			return r.value;
		}
	}
	return null;
}
