import {
	CELLS,
	DIGIT_CHANCE,
	MAX_TWO_DIGIT,
	MIN_DIGITS,
	MIN_EACH_OP,
	OPERATORS,
	TWO_DIGIT_CHANCE,
	TWO_DIGIT_FROM_ROUND
} from './constants';
import { randInt, shuffle } from './random';
import type { Cell, Operator, Rng, Tile } from './types';

let nextTileId = 0;
export const makeNumberTile = (value: number): Tile => ({ id: nextTileId++, type: 'num', value });
export const makeOpTile = (value: Operator): Tile => ({ id: nextTileId++, type: 'op', value });

export const isTwoDigit = (tile: Tile): boolean => tile.type === 'num' && tile.value >= 10;

export function createBoard(): Cell[] {
	return Array.from({ length: CELLS }, (_, id) => ({ id, tile: null }));
}

export function randomTile(allowTwoDigit: boolean, rng: Rng): Tile {
	if (rng() < DIGIT_CHANCE) {
		if (allowTwoDigit && rng() < TWO_DIGIT_CHANCE) return makeNumberTile(10 + randInt(90, rng));
		return makeNumberTile(randInt(10, rng));
	}
	return makeOpTile(OPERATORS[randInt(OPERATORS.length, rng)]);
}

/**
 * Fills every empty cell. Guarantees at least MIN_DIGITS number tiles and
 * MIN_EACH_OP of each operator on the board, and at most MAX_TWO_DIGIT
 * two-digit tiles. Mutates the cells in place.
 */
export function refillBoard(board: Cell[], round: number, rng: Rng): void {
	const empty = board.filter((c) => c.tile === null);
	const present = board.flatMap((c) => (c.tile ? [c.tile] : []));

	// Tiles required to satisfy the minimum guarantees.
	const required: Tile[] = [];
	const numberCount = present.filter((t) => t.type === 'num').length;
	for (let k = numberCount; k < MIN_DIGITS; k++) required.push(makeNumberTile(randInt(10, rng)));
	for (const op of OPERATORS) {
		const n = present.filter((t) => t.value === op).length;
		for (let k = n; k < MIN_EACH_OP; k++) required.push(makeOpTile(op));
	}

	let twoDigits = present.filter(isTwoDigit).length;
	shuffle(empty, rng);
	empty.forEach((cell, i) => {
		if (i < required.length) {
			cell.tile = required[i];
			return;
		}
		const allowTwo = round >= TWO_DIGIT_FROM_ROUND && twoDigits < MAX_TWO_DIGIT;
		const tile = randomTile(allowTwo, rng);
		if (isTwoDigit(tile)) twoDigits++;
		cell.tile = tile;
	});
}
