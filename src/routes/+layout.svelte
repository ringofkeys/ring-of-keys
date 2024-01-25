<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<main class="bg-white dark:bg-black text-black dark:text-white">
	<Nav menu={data.navData.menu} />
	<h1 class="text-3xl font-bold underline">Hello world!</h1>
	<slot />
</main>
