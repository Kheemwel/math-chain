import { describe, expect, it } from 'vitest';
import { createBoard, refillBoard } from './board';
import { TARGET_MAX_HP_SHARE, TARGET_MAX_MIN, TARGET_MIN } from './constants';
import { enemyMaxHp } from './enemy';
import { evaluate } from './evaluator';
import { seededRng } from './random';
import { pickTarget } from './target';
import type { Cell, Token } from './types';

/** Is there a 2 or 3 number formula on the board using − or ÷ that makes `target`? */
function hasMinusDivideSolution(board: Cell[], target: number): boolean {
	const nums = board.flatMap((c) => (c.tile?.type === 'num' ? [c.tile.value] : []));
	const ops = board.flatMap((c) => (c.tile?.type === 'op' ? [c.tile.value] : []));
	const minusDiv = ['−', '÷'];
	for (let a = 0; a < nums.length; a++)
		for (let b = 0; b < nums.length; b++) {
			if (a === b) continue;
			for (let x = 0; x < ops.length; x++) {
				const r = evaluate([nums[a], ops[x], nums[b]] as Token[]);
				if (r.ok && r.value === target && minusDiv.includes(ops[x])) return true;
				for (let c = 0; c < nums.length; c++) {
					if (c === a || c === b) continue;
					for (let y = 0; y < ops.length; y++) {
						if (y === x) continue;
						if (!minusDiv.includes(ops[x]) && !minusDiv.includes(ops[y])) continue;
						const r3 = evaluate([nums[a], ops[x], nums[b], ops[y], nums[c]] as Token[]);
						if (r3.ok && r3.value === target) return true;
					}
				}
			}
		}
	return false;
}

describe('pickTarget', () => {
	it('returns a number in range that − or ÷ can make, and + × cannot make with two numbers', () => {
		const rng = seededRng(11);
		let found = 0;
		for (let i = 0; i < 25; i++) {
			const round = [1, 5, 10][i % 3];
			const board = createBoard();
			refillBoard(board, round, rng);
			const target = pickTarget(board, round, rng);
			if (target === null) continue;
			found++;

			const max = Math.max(TARGET_MAX_MIN, Math.round(enemyMaxHp(round) * TARGET_MAX_HP_SHARE));
			expect(target).toBeGreaterThanOrEqual(TARGET_MIN);
			expect(target).toBeLessThanOrEqual(max);
			expect(hasMinusDivideSolution(board, target)).toBe(true);

			const nums = board.flatMap((c) => (c.tile?.type === 'num' ? [c.tile.value] : []));
			for (const a of nums) for (const b of nums) {
				expect(a + b).not.toBe(target);
				expect(a * b).not.toBe(target);
			}
		}
		expect(found).toBeGreaterThan(15); // most boards should produce a target
	});

	it('returns null for a board with no numbers', () => {
		expect(pickTarget(createBoard(), 1, seededRng(1))).toBeNull();
	});
});
