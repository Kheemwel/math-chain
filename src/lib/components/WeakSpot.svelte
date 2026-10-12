<script lang="ts">
	interface Props {
		target: number;
		multiplier: number;
	}

	let { target, multiplier }: Props = $props();
</script>

<div class="weak">
	🎯 Weak spot: <strong>{target}</strong>
	<small>hit it exactly for ×{multiplier} damage</small>
</div>

<style>
	.weak {
		background: var(--weak-bg);
		border: 1px solid var(--weak-border);
		border-radius: 12px;
		padding: 8px 12px;
		text-align: center;
	}
	strong {
		font-size: 1.3rem;
		color: var(--accent);
	}
</style>
