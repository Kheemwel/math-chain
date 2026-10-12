<script lang="ts">
	import HpBar from './HpBar.svelte';

	interface Props {
		face: string;
		traitName: string;
		traitText: string;
		hp: number;
		maxHp: number;
		turnsLeft: number;
	}

	let { face, traitName, traitText, hp, maxHp, turnsLeft }: Props = $props();
</script>

<section class="enemy">
	<div class="face">{face}</div>
	<div class="info">
		<div><strong>{traitName}</strong> <small>{traitText}</small></div>
		<HpBar pct={(hp / maxHp) * 100} kind="enemy" />
		<small>
			{hp} / {maxHp} HP · attacks in {turnsLeft}
			{turnsLeft === 1 ? 'turn' : 'turns'}
		</small>
	</div>
</section>

<style>
	.enemy {
		display: flex;
		gap: 12px;
		align-items: center;
		background: var(--panel);
		border-radius: 12px;
		padding: 10px;
	}
	.face {
		font-size: 2.6rem;
	}
	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
</style>
