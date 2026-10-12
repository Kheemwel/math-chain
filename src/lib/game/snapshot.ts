import { CELLS, ENEMY_EVERY, OPERATORS, START_HP } from './constants';
import { enemyMaxHp } from './enemy';
import type { Operator } from './types';

export const SNAPSHOT_VERSION = 1;

export type SavedTile = { type: 'num'; value: number } | { type: 'op'; value: Operator };

/** Everything needed to resume a run. Saved between turns, so the tray is empty. */
export interface RunSnapshot {
	version: typeof SNAPSHOT_VERSION;
	round: number;
	playerHp: number;
	enemyHp: number;
	turnsLeft: number;
	bestHit: number;
	bestFormula: string;
	target: number | null;
	board: SavedTile[];
}

export const isInt = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n);

function parseTile(raw: unknown): SavedTile | null {
	if (typeof raw !== 'object' || raw === null) return null;
	const { type, value } = raw as Record<string, unknown>;
	if (type === 'num' && isInt(value) && value >= 0 && value <= 99) return { type, value };
	if (
		type === 'op' &&
		typeof value === 'string' &&
		(OPERATORS as readonly string[]).includes(value)
	) {
		return { type, value: value as Operator };
	}
	return null;
}

/** Validates loaded data. Returns null for anything malformed, never throws. */
export function parseSnapshot(raw: unknown): RunSnapshot | null {
	if (typeof raw !== 'object' || raw === null) return null;
	const r = raw as Record<string, unknown>;
	if (r.version !== SNAPSHOT_VERSION) return null;

	const { round, playerHp, enemyHp, turnsLeft, bestHit, bestFormula, target, board } = r;
	if (!isInt(round) || round < 1) return null;
	if (!isInt(playerHp) || playerHp < 1 || playerHp > START_HP) return null;
	if (!isInt(enemyHp) || enemyHp < 1 || enemyHp > enemyMaxHp(round)) return null;
	if (!isInt(turnsLeft) || turnsLeft < 1 || turnsLeft > ENEMY_EVERY) return null;
	if (!isInt(bestHit) || bestHit < 0) return null;
	if (typeof bestFormula !== 'string' || bestFormula.length > 80) return null;
	if (target !== null && (!isInt(target) || target < 0)) return null;
	if (!Array.isArray(board) || board.length !== CELLS) return null;

	const tiles: SavedTile[] = [];
	for (const item of board) {
		const tile = parseTile(item);
		if (!tile) return null;
		tiles.push(tile);
	}

	return {
		version: SNAPSHOT_VERSION,
		round,
		playerHp,
		enemyHp,
		turnsLeft,
		bestHit,
		bestFormula,
		target: target as number | null,
		board: tiles
	};
}
