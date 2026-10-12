<script lang="ts">
	import { SIZE } from '#lib/game/constants.js';
	import type { Cell } from '#lib/game/types.js';

	interface Props {
		board: Cell[];
		canPick: (cell: Cell) => boolean;
		onpick: (cell: Cell) => void;
	}

	let { board, canPick, onpick }: Props = $props();
</script>

<section class="board" style:--size={SIZE}>
	{#each board as cell (cell.id)}
		<button
			class={['tile', cell.tile ? cell.tile.type : 'empty']}
			disabled={!canPick(cell)}
			onclick={() => onpick(cell)}
		>
			{cell.tile ? cell.tile.value : ''}
		</button>
	{/each}
</section>

<style>
	.board {
		display: grid;
		grid-template-columns: repeat(var(--size), 1fr);
		gap: 6px;
	}
	.tile {
		aspect-ratio: 1;
		border: 0;
		border-radius: 10px;
		font-size: 1.25rem;
		font-weight: 700;
		color: #fff;
		cursor: pointer;
	}
	.tile.num {
		background: var(--num);
	}
	.tile.op {
		background: var(--op);
	}
	.tile.empty {
		background: transparent;
	}
	.tile:disabled:not(.empty) {
		opacity: 0.3;
		cursor: default;
	}
</style>
