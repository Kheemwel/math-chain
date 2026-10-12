<script lang="ts">
	import { onMount } from 'svelte';
	import { loadLeaderboard, type RunRecord } from '#lib/game/storage.js';
	import { resolve } from '$app/paths';

	let runs = $state<RunRecord[]>([]);
	let loaded = $state(false);

	onMount(async () => {
		runs = await loadLeaderboard();
		loaded = true;
	});
</script>

<main>
	<header>
		<a href={resolve('/')}>← Menu</a>
		<h1>Leaderboard</h1>
	</header>

	{#if !loaded}
		<p class="empty">Loading…</p>
	{:else if runs.length === 0}
		<p class="empty">No runs yet. Finish a run to see it here.</p>
	{:else}
		<ol>
			{#each runs as run, i (run.id)}
				<li>
					<span class="rank">{i + 1}</span>
					<div class="details">
						<strong>Round {run.round}</strong>
						<small>
							Best hit {run.bestHit}{#if run.bestFormula}
								· {run.bestFormula}{/if}
						</small>
						<small>{new Date(run.endedAt).toLocaleDateString()}</small>
					</div>
				</li>
			{/each}
		</ol>
	{/if}
</main>

<style>
	main {
		max-width: 420px;
		margin: 0 auto;
		padding: calc(12px + env(safe-area-inset-top, 0px)) 12px
			calc(12px + env(safe-area-inset-bottom, 0px));
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	header {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	h1 {
		margin: 0;
		font-size: 1.6rem;
	}
	a {
		color: var(--muted);
		text-decoration: none;
	}
	.empty {
		text-align: center;
		color: var(--muted);
		padding: 32px 0;
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	li {
		display: flex;
		gap: 12px;
		align-items: center;
		background: var(--panel);
		border-radius: 12px;
		padding: 10px 12px;
	}
	.rank {
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--accent);
		min-width: 1.5em;
		text-align: center;
	}
	.details {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
</style>
