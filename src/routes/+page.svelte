<script>
	import Logo from '$lib/components/logo/Logo.svelte';
</script>

<div class="flex h-screen w-full flex-col items-center justify-center gap-4">
	<div class="text-secondary-500 aspect-square w-full max-w-128 p-4 sm:w-128">
		<Logo />
	</div>
	<a class="btn preset-filled-secondary-500 btn-lg" href="/fitness/info">Fitness Test</a>

	<a class="btn preset-filled-secondary-500 btn-lg" href="/emom">EMOM Timer</a>
</div>
