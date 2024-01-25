<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<main>
	<h1 class="text-3xl font-bold underline">Hello world!</h1>
	<pre>{JSON.stringify(data, null, 2)}</pre>
	<slot />
</main>
