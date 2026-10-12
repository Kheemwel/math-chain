<script lang="ts">
	import Board from '#lib/components/Board.svelte';
	import Controls from '#lib/components/Controls.svelte';
	import EnemyPanel from '#lib/components/EnemyPanel.svelte';
	import GameOver from '#lib/components/GameOver.svelte';
	import PlayerBar from '#lib/components/PlayerBar.svelte';
	import Readout from '#lib/components/Readout.svelte';
	import Tray from '#lib/components/Tray.svelte';
	import WeakSpot from '#lib/components/WeakSpot.svelte';
	import { START_HP, WEAK_MULT } from '#lib/game/constants.js';
	import { Game } from '#lib/game/game.svelte.js';

	const game = new Game();
</script>

<main>
	<header>
		<span>Round {game.round}</span>
		<span>Best {game.best}</span>
	</header>

	<EnemyPanel
		face={game.face}
		traitName={game.trait.name}
		traitText={game.trait.text}
		hp={game.enemyHp}
		maxHp={game.enemyMax}
		turnsLeft={game.turnsLeft}
	/>
	<PlayerBar hp={game.playerHp} maxHp={START_HP} />

	{#if game.target !== null}
		<WeakSpot target={game.target} multiplier={WEAK_MULT} />
	{/if}

	<p class="message">{game.message}</p>

	<Tray tray={game.tray} onreturn={(i) => game.unpick(i)} />
	<Readout formula={game.formulaText} status={game.status} hit={game.preview?.exact ?? false} />
	<Controls
		canAttack={game.canAttack}
		canClear={game.canClear}
		onattack={() => game.attack()}
		onclear={() => game.clear()}
	/>
	<Board
		board={game.board}
		canPick={(cell) => game.canPick(cell)}
		onpick={(cell) => game.pick(cell)}
	/>

	<p class="hint">
		Tap a tray tile to return it and everything after it. The weak spot can always be reached using
		− or ÷.
	</p>
</main>

{#if game.gameOver}
	<GameOver round={game.round} onrestart={() => game.restart()} />
{/if}

<style>
	main {
		max-width: 420px;
		margin: 0 auto;
		padding: calc(12px + env(safe-area-inset-top, 0px)) 12px
			calc(12px + env(safe-area-inset-bottom, 0px));
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	header {
		display: flex;
		justify-content: space-between;
		font-weight: 600;
	}
	.message {
		margin: 0;
		min-height: 2.4em;
		font-size: 0.9rem;
		color: #cfd4f5;
	}
	.hint {
		margin: 0;
		font-size: 0.75rem;
		text-align: center;
		color: var(--faint);
	}
</style>
