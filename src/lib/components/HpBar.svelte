<script lang="ts">
	interface Props {
		/** Fill amount, 0 to 100. */
		pct: number;
		kind: 'enemy' | 'player';
	}

	let { pct, kind }: Props = $props();
</script>

<div class="bar">
	<div class={['fill', kind]} style:width="{Math.min(100, Math.max(0, pct))}%"></div>
</div>

<style>
	.bar {
		height: 10px;
		background: var(--panel-border);
		border-radius: 6px;
		overflow: hidden;
	}
	.fill {
		height: 100%;
		transition: width 0.25s;
	}
	.enemy {
		background: var(--enemy);
	}
	.player {
		background: var(--player);
	}
</style>
