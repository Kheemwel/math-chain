<script lang="ts">
	import { onMount } from 'svelte';
	import GameScreen from '#lib/components/GameScreen.svelte';
	import { Game } from '#lib/game/game.svelte.js';
	import { addRun, clearRun, loadLeaderboard, loadRun, saveRun } from '#lib/game/storage.js';

	let game = $state<Game | null>(null);

	onMount(async () => {
		const [snapshot, runs] = await Promise.all([loadRun(), loadLeaderboard()]);
		game = new Game(undefined, {
			snapshot: snapshot ?? undefined,
			bestEver: runs[0]?.round ?? 1,
			onSave: (s) => void saveRun(s),
			onGameOver: async (result) => {
				await addRun({
					id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
					endedAt: Date.now(),
					...result
				});
				await clearRun();
			}
		});
	});
</script>

{#if game}
	<GameScreen {game} />
{:else}
	<p class="loading">Loading…</p>
{/if}

<style>
	.loading {
		text-align: center;
		padding: 48px 12px;
		color: var(--muted);
	}
</style>
