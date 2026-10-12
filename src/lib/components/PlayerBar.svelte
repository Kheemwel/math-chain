<script lang="ts">
	import HpBar from './HpBar.svelte';

	interface Props {
		hp: number;
		maxHp: number;
	}

	let { hp, maxHp }: Props = $props();
</script>

<section class="player">
	<small>You {hp} / {maxHp} HP</small>
	<HpBar pct={(hp / maxHp) * 100} kind="player" />
</section>

<style>
	.player {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
</style>
