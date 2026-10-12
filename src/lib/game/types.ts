import type { OPERATORS } from './constants';

export type Operator = (typeof OPERATORS)[number];

/** One element of a formula: a number or an operator. */
export type Token = number | Operator;

export type Tile =
	| { id: number; type: 'num'; value: number }
	| { id: number; type: 'op'; value: Operator };

export type TileType = Tile['type'];

/** A fixed position on the board. `tile` is null while empty or while the tile is in the tray. */
export interface Cell {
	id: number;
	tile: Tile | null;
}

/** A tile in the formula tray, remembering which cell it came from. */
export interface TrayItem {
	tile: Tile;
	cellId: number;
}

/** Returns a number in [0, 1). Inject a seeded one in tests. */
export type Rng = () => number;
