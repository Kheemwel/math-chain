<script lang="ts">
	interface Props {
		canAttack: boolean;
		canClear: boolean;
		onattack: () => void;
		onclear: () => void;
	}

	let { canAttack, canClear, onattack, onclear }: Props = $props();
</script>

<section class="actions">
	<button class="attack" disabled={!canAttack} onclick={onattack}>Attack</button>
	<button class="clear" disabled={!canClear} onclick={onclear}>Clear</button>
</section>

<style>
	.actions {
		display: flex;
		gap: 8px;
	}
	button {
		flex: 1;
		min-height: 48px;
		border: 0;
		border-radius: 10px;
		font-weight: 700;
		color: #fff;
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.attack {
		background: var(--danger);
	}
	.clear {
		background: var(--slot-border);
	}
</style>
