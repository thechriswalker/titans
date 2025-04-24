<script lang="ts">
	import HomeLinkLogo from '$lib/components/logo/HomeLinkLogo.svelte';
	import Timer from '$lib/components/timer/Timer.svelte';

	let running = $state(false);
	let startTime = $state(0);
	let dt = $state(0);
	let total = 60_000;

	let style = $state(true);

	function tick() {
		const next = (Date.now() - startTime) % total;
		if (next < dt) {
			style = !style;
			flash();
		}
		dt = next;
		if (running) {
			requestAnimationFrame(tick);
		}
	}

	function start() {
		running = true;
		startTime = Date.now();
		tick();
	}

	function flash() {
		const body = document.body;
		body.classList.add('flash-on');
		setTimeout(() => {
			body.classList.remove('flash-on');
			body.classList.add('flash-off');
			setTimeout(() => {
				body.classList.remove('flash-off');
			}, 100);
		}, 100);
	}
</script>

<section class="m-4 mx-auto flex max-w-320 flex-col p-4">
	<header class="p-4">
		<h1 class="h3 sm:h2 md:h1 flex flex-row items-center justify-center text-start">
			<HomeLinkLogo /> Titans EMOM Timer
		</h1>
	</header>
	<div class="flex flex-col items-center justify-center p-4">
		<Timer
			start={0}
			end={total}
			{dt}
			active={true}
			sizeClasses="w-full h-full lg:h-192 lg:w-192"
			variant={style ? 'emom-b' : 'emom-a'}
		>
			{#snippet children()}
				<div class="relative z-100 mb-12 text-4xl">
					{#if running}
						<button class="btn preset-filled-secondary-500 btn-lg" onclick={() => (running = false)}
							>Stop</button
						>
					{:else}
						<button class="btn preset-filled-secondary-500 btn-lg" onclick={start}>Start</button>
					{/if}
				</div>
			{/snippet}
		</Timer>
	</div>
</section>

<style>
	:global {
		body.flash-on {
			transition: background-color 0.1s ease-in-out;
			background-color: var(--skeleton-surface-50-950);
		}
		body.flash-off {
			transition: background-color 0.1s ease-in-out;
		}
	}
</style>
