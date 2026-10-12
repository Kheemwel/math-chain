<script lang="ts">
	import { TRAY_MAX } from '#lib/game/constants.js';
	import type { TrayItem } from '#lib/game/types.js';

	interface Props {
		tray: TrayItem[];
		/** Called with the slot index. That tile and everything after it return to the board. */
		onreturn: (index: number) => void;
	}

	let { tray, onreturn }: Props = $props();

	const slots = Array.from({ length: TRAY_MAX }, (_, i) => i);
</script>

<section class="tray">
	{#each slots as j (j)}
		{@const item = tray[j]}
		<button class={['slot', item?.tile.type]} disabled={!item} onclick={() => onreturn(j)}>
			{item ? item.tile.value : ''}
		</button>
	{/each}
</section>

<style>
	.tray {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 6px;
	}
	.slot {
		aspect-ratio: 1;
		border-radius: 10px;
		font-size: 1.25rem;
		font-weight: 700;
		color: #fff;
		background: var(--slot);
		border: 2px dashed var(--slot-border);
		cursor: pointer;
	}
	.slot:disabled {
		cursor: default;
	}
	.slot.num {
		background: var(--num);
		border-style: solid;
		border-color: transparent;
	}
	.slot.op {
		background: var(--op);
		border-style: solid;
		border-color: transparent;
	}
</style>
