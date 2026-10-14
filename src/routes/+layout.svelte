<script lang="ts">
	import favicon from '#lib/assets/favicon.ico';
	import type { LayoutProps } from './$types';
	import '#lib/styles/global.css';
	import { Capacitor } from '@capacitor/core';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { onMount } from 'svelte';

	let { children }: LayoutProps = $props();

	onMount(async () => {
		if (Capacitor.isNativePlatform()) {
			// Disable overlay so the status bar gets a solid colored background
			await StatusBar.setOverlaysWebView({ overlay: false });
			// Style.Dark sets light/white text & icons
			await StatusBar.setStyle({ style: Style.Dark });
			await StatusBar.setBackgroundColor({ color: '#14161f' });
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#14161f" />
	<meta name="color-scheme" content="dark" />
</svelte:head>

{@render children()}
