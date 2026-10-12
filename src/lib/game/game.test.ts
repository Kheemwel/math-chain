import { describe, expect, it } from 'vitest';
import { ENEMY_EVERY, HEAL_ON_WIN, START_HP, TRAY_MAX, WEAK_MULT } from './constants';
import { enemyDamage, enemyMaxHp } from './enemy';
import { Game } from './game.svelte';
import { seededRng } from './random';
import type { Cell, TileType } from './types';

const newGame = (seed = 1) => new Game(seededRng(seed));
const firstCell = (game: Game, type: TileType, value?: number | string): Cell => {
	const cell = game.board.find((c) => c.tile?.type === type && (value === undefined || c.tile.value === value));
	if (!cell) throw new Error(`no ${type} tile ${value ?? ''} on the board`);
	return cell;
};

/** Builds `number op number` in the tray. */
function buildSimple(game: Game, op: string) {
	game.pick(firstCell(game, 'num'));
	game.pick(firstCell(game, 'op', op));
	game.pick(firstCell(game, 'num'));
}

describe('Game setup', () => {
	it('starts with a full board, empty tray and round 1', () => {
		const game = newGame();
		expect(game.board.every((c) => c.tile !== null)).toBe(true);
		expect(game.tray).toHaveLength(0);
		expect(game.round).toBe(1);
		expect(game.playerHp).toBe(START_HP);
		expect(game.enemyHp).toBe(enemyMaxHp(1));
		expect(game.canAttack).toBe(false);
	});
});

describe('tray rules', () => {
	it('only accepts alternating number, operator, number', () => {
		const game = newGame();
		expect(game.canPick(firstCell(game, 'op'))).toBe(false);
		game.pick(firstCell(game, 'num'));
		expect(game.nextType).toBe('op');
		expect(game.canPick(firstCell(game, 'num'))).toBe(false);
		game.pick(firstCell(game, 'op'));
		expect(game.nextType).toBe('num');
		expect(game.tray).toHaveLength(2);
	});

	it('stops at the tray limit', () => {
		const game = newGame();
		for (let i = 0; i < TRAY_MAX + 3; i++) {
			game.pick(firstCell(game, game.nextType));
		}
		expect(game.tray).toHaveLength(TRAY_MAX);
	});

	it('removes picked tiles from the board and restores them on unpick', () => {
		const game = newGame();
		const cell = firstCell(game, 'num');
		const tile = cell.tile;
		game.pick(cell);
		expect(cell.tile).toBeNull();
		game.unpick(0);
		expect(cell.tile).toEqual(tile);
		expect(game.tray).toHaveLength(0);
	});

	it('returns the tapped tile and everything after it', () => {
		const game = newGame();
		buildSimple(game, '+');
		game.unpick(1);
		expect(game.tray).toHaveLength(1);
		expect(game.board.filter((c) => c.tile === null)).toHaveLength(1);
	});

	it('is not an attack until it is a complete valid formula', () => {
		const game = newGame();
		game.pick(firstCell(game, 'num'));
		expect(game.canAttack).toBe(false);
		game.pick(firstCell(game, 'op'));
		expect(game.canAttack).toBe(false);
		game.pick(firstCell(game, 'num'));
		expect(game.canAttack).toBe(true);
	});

	it('blocks division by zero', () => {
		const game = newGame();
		const zero = firstCell(game, 'num', 0);
		game.pick(firstCell(game, 'num'));
		game.pick(firstCell(game, 'op', '÷'));
		game.pick(zero);
		expect(game.result?.ok).toBe(false);
		expect(game.canAttack).toBe(false);
		expect(game.status).toBe('Cannot divide by zero.');
	});
});

describe('attack', () => {
	it('deals the formula result as damage and refills the board', () => {
		const game = newGame();
		game.target = null; // avoid the weak spot multiplier
		buildSimple(game, '+');
		const expected = game.preview!.dmg;
		game.attack();
		expect(game.enemyHp).toBe(enemyMaxHp(1) - expected);
		expect(game.tray).toHaveLength(0);
		expect(game.board.every((c) => c.tile !== null)).toBe(true);
	});

	it('multiplies damage on an exact weak spot hit', () => {
		const game = newGame();
		buildSimple(game, '+');
		const raw = game.preview!.raw;
		game.target = raw;
		expect(game.preview!.exact).toBe(true);
		expect(game.preview!.dmg).toBe(raw * WEAK_MULT);
	});

	it('does not give negative damage', () => {
		const game = newGame();
		game.target = null;
		const nums = game.board
			.filter((c) => c.tile?.type === 'num')
			.sort((a, b) => Number(a.tile!.value) - Number(b.tile!.value));
		const small = nums[0];
		const large = nums[nums.length - 1];
		expect(Number(small.tile!.value)).toBeLessThan(Number(large.tile!.value));
		game.pick(small);
		game.pick(firstCell(game, 'op', '−'));
		game.pick(large); // small − large is negative
		expect(game.result?.ok && game.result.value).toBeLessThan(0);
		expect(game.preview!.dmg).toBe(0);
	});

	it('advances to the next round when the enemy dies', () => {
		const game = newGame();
		game.target = null;
		game.playerHp = 50;
		game.enemyHp = 1;
		buildSimple(game, '×');
		// make sure the damage is positive
		if (game.preview!.dmg === 0) {
			game.unpick(0);
			game.pick(game.board.find((c) => c.tile?.type === 'num' && Number(c.tile.value) > 0)!);
			game.pick(firstCell(game, 'op', '+'));
			game.pick(game.board.find((c) => c.tile?.type === 'num' && Number(c.tile.value) > 0)!);
		}
		game.attack();
		expect(game.round).toBe(2);
		expect(game.best).toBe(2);
		expect(game.enemyHp).toBe(enemyMaxHp(2));
		expect(game.playerHp).toBe(50 + HEAL_ON_WIN);
		expect(game.turnsLeft).toBe(ENEMY_EVERY);
	});

	it('the enemy hits back every N turns', () => {
		const game = newGame();
		game.enemyHp = 1_000_000;
		for (let turn = 1; turn <= ENEMY_EVERY; turn++) {
			game.target = null;
			buildSimple(game, '+');
			game.attack();
		}
		expect(game.playerHp).toBe(START_HP - enemyDamage(1));
		expect(game.turnsLeft).toBe(ENEMY_EVERY);
	});

	it('ends the game at 0 HP, ignores further input, and restarts cleanly', () => {
		const game = newGame();
		game.enemyHp = 1_000_000;
		game.playerHp = 1;
		game.turnsLeft = 1;
		game.target = null;
		buildSimple(game, '+');
		game.attack();
		expect(game.gameOver).toBe(true);
		expect(game.canPick(firstCell(game, 'num'))).toBe(false);

		game.restart();
		expect(game.gameOver).toBe(false);
		expect(game.round).toBe(1);
		expect(game.playerHp).toBe(START_HP);
		expect(game.enemyHp).toBe(enemyMaxHp(1));
		expect(game.tray).toHaveLength(0);
		expect(game.board.every((c) => c.tile !== null)).toBe(true);
	});
});
