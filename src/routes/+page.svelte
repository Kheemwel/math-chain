<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { RunSnapshot } from '#lib/game/snapshot.js';
	import { clearRun, loadLeaderboard, loadRun } from '#lib/game/storage.js';
	import { resolve } from '$app/paths';

	let saved = $state<RunSnapshot | null>(null);
	let bestRound = $state<number | null>(null);
	let ready = $state(false);

	onMount(async () => {
		const [run, runs] = await Promise.all([loadRun(), loadLeaderboard()]);
		saved = run;
		bestRound = runs[0]?.round ?? null;
		ready = true;
	});

	async function newRun() {
		if (saved && !confirm('Abandon your saved run and start a new one?')) return;
		await clearRun();
		await goto(resolve('/play'));
	}
</script>

<main>
	<h1>Math Chain</h1>
	<p class="tagline">Build formulas. Beat the enemy.</p>
	{#if bestRound !== null}
		<p class="best">Best Round: {bestRound}</p>
	{/if}

	{#if ready}
		<nav>
			{#if saved}
				<a class="btn primary" href={resolve('/play')}>Continue (Round {saved.round})</a>
			{/if}
			<button class="btn" class:primary={!saved} onclick={newRun}>New Game</button>
			<a class="btn" href={resolve('/leaderboard')}>Leaderboard</a>
		</nav>
	{/if}
</main>

<style>
	main {
		max-width: 420px;
		margin: 0 auto;
		padding: calc(64px + env(safe-area-inset-top, 0px)) 16px 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		text-align: center;
	}
	h1 {
		margin: 0;
		font-size: 2.2rem;
	}
	.tagline,
	.best {
		margin: 0;
		color: var(--muted);
	}
	.best {
		color: var(--accent);
	}
	nav {
		width: 100%;
		margin-top: 32px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.btn {
		display: block;
		width: 100%;
		min-height: 52px;
		line-height: 52px;
		padding: 0;
		border: 0;
		border-radius: 12px;
		background: var(--slot-border);
		color: #fff;
		font-weight: 700;
		font-size: 1rem;
		text-decoration: none;
		cursor: pointer;
	}
	.btn.primary {
		background: var(--danger);
	}
</style>
