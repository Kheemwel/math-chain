import { describe, expect, it } from 'vitest';
import { createBoard, isTwoDigit, refillBoard } from './board';
import { CELLS, MAX_TWO_DIGIT, MIN_DIGITS, MIN_EACH_OP, OPERATORS, TWO_DIGIT_FROM_ROUND } from './constants';
import { seededRng } from './random';
import type { Cell } from './types';

function checkInvariants(board: Cell[], round: number) {
	const tiles = board.map((c) => c.tile);
	expect(tiles.every((t) => t !== null)).toBe(true);
	const present = tiles.flatMap((t) => (t ? [t] : []));
	expect(present.filter((t) => t.type === 'num').length).toBeGreaterThanOrEqual(MIN_DIGITS);
	for (const op of OPERATORS) {
		expect(present.filter((t) => t.value === op).length).toBeGreaterThanOrEqual(MIN_EACH_OP);
	}
	const twoDigit = present.filter(isTwoDigit).length;
	expect(twoDigit).toBeLessThanOrEqual(MAX_TWO_DIGIT);
	if (round < TWO_DIGIT_FROM_ROUND) expect(twoDigit).toBe(0);
}

describe('refillBoard', () => {
	it('fills an empty board and meets the guarantees', () => {
		const board = createBoard();
		refillBoard(board, 1, seededRng(1));
		expect(board).toHaveLength(CELLS);
		checkInvariants(board, 1);
	});

	it('keeps the guarantees after removing tiles, even adversarially', () => {
		const rng = seededRng(42);
		const board = createBoard();
		refillBoard(board, 6, rng);
		for (let turn = 0; turn < 2000; turn++) {
			// Remove up to 4 numbers and 3 operators, like a full tray.
			const nums = board.filter((c) => c.tile?.type === 'num').slice(0, 4);
			const ops = board.filter((c) => c.tile?.type === 'op').slice(turn % 3, (turn % 3) + 3);
			for (const c of [...nums, ...ops]) c.tile = null;
			refillBoard(board, 6, rng);
			checkInvariants(board, 6);
		}
	});

	it('never creates two-digit tiles before the unlock round', () => {
		const rng = seededRng(7);
		for (let i = 0; i < 200; i++) {
			const board = createBoard();
			refillBoard(board, TWO_DIGIT_FROM_ROUND - 1, rng);
			checkInvariants(board, TWO_DIGIT_FROM_ROUND - 1);
		}
	});

	it('leaves existing tiles untouched', () => {
		const rng = seededRng(3);
		const board = createBoard();
		refillBoard(board, 1, rng);
		const before = board.map((c) => c.tile);
		board[0].tile = null;
		refillBoard(board, 1, rng);
		expect(board.slice(1).map((c) => c.tile)).toEqual(before.slice(1));
	});
});
