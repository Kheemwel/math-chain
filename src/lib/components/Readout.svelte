<script lang="ts">
	interface Props {
		formula: string;
		status: string;
		/** True when the formula hits the weak spot exactly. */
		hit: boolean;
	}

	let { formula, status, hit }: Props = $props();
</script>

<section class={['readout', hit && 'hit']}>
	<div class="formula">{formula}</div>
	<div class="status">{status}</div>
</section>

<style>
	.readout {
		background: var(--panel);
		border-radius: 12px;
		padding: 8px 12px;
		text-align: center;
	}
	.readout.hit {
		background: var(--hit-bg);
		outline: 2px solid var(--accent);
	}
	.formula {
		font-size: 1.4rem;
		font-weight: 700;
		letter-spacing: 0.05em;
	}
	.status {
		font-size: 0.85rem;
		color: var(--muted);
		min-height: 1.2em;
	}
</style>
