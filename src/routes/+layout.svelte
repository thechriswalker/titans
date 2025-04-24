<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Tiverton Titans Basketball Club</title>
</svelte:head>

<div class="flex h-screen flex-col justify-start">
	<main class="max-w-full space-y-4">
		{@render children()}
	</main>
</div>
