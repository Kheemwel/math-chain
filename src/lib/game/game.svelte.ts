import { createBoard, refillBoard } from './board';
import { ENEMY_EVERY, HEAL_ON_WIN, START_HP, TRAY_MAX, WEAK_MULT } from './constants';
import {
	enemyDamage,
	enemyFace,
	enemyMaxHp,
	isBossRound,
	traitForRound,
	type Trait
} from './enemy';
import { evaluate, type EvalResult } from './evaluator';
import { pickTarget } from './target';
import type { Cell, Rng, TileType, TrayItem } from './types';

const START_MESSAGE = 'Tap tiles to build a formula, then press Attack.';

export interface Preview {
	raw: number;
	dmg: number;
	exact: boolean;
}

/**
 * The game's state and rules. Components display this and call its methods;
 * they never change the state directly. Rules that do not need reactivity
 * live in the plain modules next to this file.
 */
export class Game {
	#rng: Rng;

	round = $state(1);
	best = $state(1);
	playerHp = $state(START_HP);
	enemyHp = $state(enemyMaxHp(1));
	turnsLeft = $state(ENEMY_EVERY);
	gameOver = $state(false);
	message = $state(START_MESSAGE);
	board = $state<Cell[]>(createBoard());
	tray = $state<TrayItem[]>([]);
	/** This turn's weak spot number, or null if none was found. */
	target = $state<number | null>(null);

	enemyMax = $derived(enemyMaxHp(this.round));
	isBoss = $derived(isBossRound(this.round));
	trait: Trait = $derived(traitForRound(this.round));
	face = $derived(enemyFace(this.round));
	enemyPct = $derived((this.enemyHp / this.enemyMax) * 100);
	playerPct = $derived((this.playerHp / START_HP) * 100);

	/** The tile type the tray accepts next. */
	nextType: TileType = $derived(this.tray.length % 2 === 0 ? 'num' : 'op');

	/** Evaluation of the tray, or null while it is not a complete formula. */
	result: EvalResult | null = $derived.by(() => {
		if (this.tray.length < 3 || this.tray.length % 2 === 0) return null;
		return evaluate(this.tray.map((item) => item.tile.value));
	});

	/** What an attack would do right now, or null if it is not possible. */
	preview: Preview | null = $derived.by(() => {
		if (!this.result || !this.result.ok) return null;
		const raw = this.result.value;
		const exact = this.target !== null && raw === this.target;
		const base = Math.max(0, raw) * (exact ? WEAK_MULT : 1);
		const dmg = Math.max(0, Math.floor(this.trait.apply(base)));
		return { raw, dmg, exact };
	});

	formulaText = $derived(
		this.tray.length ? this.tray.map((item) => item.tile.value).join(' ') : '—'
	);

	status = $derived.by(() => {
		if (this.tray.length === 0) return 'Tap tiles to build a formula.';
		if (this.tray.length < 3) return 'Add an operator and another number.';
		if (this.tray.length % 2 === 0) return 'A formula must end with a number.';
		if (this.result && !this.result.ok) return this.result.error;
		if (this.preview?.exact) {
			return `Weak spot! ${this.preview.raw} ×${WEAK_MULT} → deals ${this.preview.dmg} damage`;
		}
		if (this.preview) return `Result ${this.preview.raw} → deals ${this.preview.dmg} damage`;
		return '';
	});

	canAttack = $derived(!this.gameOver && this.preview !== null);
	canClear = $derived(!this.gameOver && this.tray.length > 0);

	constructor(rng: Rng = Math.random) {
		this.#rng = rng;
		this.#newTurn();
	}

	canPick(cell: Cell): boolean {
		return (
			!this.gameOver &&
			cell.tile !== null &&
			this.tray.length < TRAY_MAX &&
			cell.tile.type === this.nextType
		);
	}

	/** Moves a board tile into the tray if the alternation rule allows it. */
	pick(cell: Cell): void {
		if (!this.canPick(cell) || !cell.tile) return;
		this.tray.push({ tile: cell.tile, cellId: cell.id });
		cell.tile = null;
	}

	/**
	 * Returns the tray tile at `index` and everything after it to the board,
	 * so the number/operator alternation always stays valid.
	 */
	unpick(index: number): void {
		if (this.gameOver || index < 0 || index >= this.tray.length) return;
		for (const item of this.tray.splice(index)) {
			this.board[item.cellId].tile = item.tile;
		}
	}

	clear(): void {
		this.unpick(0);
	}

	attack(): void {
		const preview = this.preview;
		if (this.gameOver || !preview) return;

		this.tray = []; // used tiles are gone; their cells stay empty until the refill
		this.enemyHp = Math.max(0, this.enemyHp - preview.dmg);
		let msg = preview.exact
			? `Weak spot hit! You dealt ${preview.dmg} damage.`
			: `You dealt ${preview.dmg} damage.`;

		if (this.enemyHp === 0) {
			this.round += 1;
			this.best = Math.max(this.best, this.round);
			this.playerHp = Math.min(START_HP, this.playerHp + HEAL_ON_WIN);
			this.enemyHp = enemyMaxHp(this.round);
			this.turnsLeft = ENEMY_EVERY;
			msg += ` Enemy defeated! Round ${this.round} begins.`;
		} else {
			this.turnsLeft -= 1;
			if (this.turnsLeft === 0) {
				const hit = enemyDamage(this.round);
				this.playerHp = Math.max(0, this.playerHp - hit);
				this.turnsLeft = ENEMY_EVERY;
				msg += ` The enemy hits you for ${hit}.`;
				if (this.playerHp === 0) this.gameOver = true;
			}
		}

		this.message = msg;
		this.#newTurn();
	}

	restart(): void {
		this.round = 1;
		this.playerHp = START_HP;
		this.enemyHp = enemyMaxHp(1);
		this.turnsLeft = ENEMY_EVERY;
		this.tray = [];
		for (const cell of this.board) cell.tile = null;
		this.gameOver = false;
		this.message = START_MESSAGE;
		this.#newTurn();
	}

	/** Refills the board and picks a new weak spot. */
	#newTurn(): void {
		refillBoard(this.board, this.round, this.#rng);
		this.target = pickTarget(this.board, this.round, this.#rng);
	}
}
