<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		round: number;
		bestHit: number;
		bestFormula: string;
		onrestart: () => void;
	}

	let { round, bestHit, bestFormula, onrestart }: Props = $props();
</script>

<div class="overlay">
	<div class="card">
		<h2>Game over</h2>
		<p>You reached round {round}.</p>
		{#if bestHit > 0}
			<small>Best hit: {bestHit} ({bestFormula})</small>
		{/if}
		<button onclick={onrestart}>Play again</button>
		<a href={resolve('/leaderboard')}>Leaderboard</a>
		<a href={resolve('/')}>Menu</a>
	</div>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.card {
		background: var(--panel);
		padding: 24px;
		border-radius: 14px;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-width: 240px;
	}
	h2,
	p {
		margin: 0;
	}
	button {
		min-height: 48px;
		padding: 0 24px;
		border: 0;
		border-radius: 10px;
		font-weight: 700;
		color: #fff;
		background: var(--danger);
		cursor: pointer;
	}
	a {
		color: var(--muted);
		text-decoration: none;
		padding: 6px;
	}
</style>
