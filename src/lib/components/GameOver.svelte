<script lang="ts">
	interface Props {
		round: number;
		onrestart: () => void;
	}

	let { round, onrestart }: Props = $props();
</script>

<div class="overlay">
	<div class="card">
		<h2>Game over</h2>
		<p>You reached round {round}.</p>
		<button onclick={onrestart}>Play again</button>
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
		gap: 8px;
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
</style>
