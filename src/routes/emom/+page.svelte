<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import HomeLinkLogo from '$lib/components/logo/HomeLinkLogo.svelte';
	import Timer from '$lib/components/timer/Timer.svelte';
	import { beep, initAudioContext, isMuted } from '$lib/util/beeper.svelte';
	import type { Deferral } from '$lib/util/deferred';
	import { acquireWakeLock, releaseWakeLock } from '$lib/util/wakelock';
	import { onDestroy } from 'svelte';

	let running = $state(false);
	let startTime = $state(0);
	let dt = $state(0);

	let debug = browser && page.url.searchParams.get('debug') !== null;

	let total = debug ? 10_000 : 60_000;

	let style = $state(true);

	let muted = isMuted();

	let unmounted = false;
	onDestroy(() => {
		unmounted = true;
	});

	async function tick() {
		const next = (Date.now() - startTime) % total;
		if (next < dt) {
			style = !style;
			beep();
			flash();
		}
		dt = next;
		if (running && !unmounted) {
			requestAnimationFrame(tick);
		} else {
			await releaseWakeLock();
			style = true;
			dt = 0;
		}
	}

	async function start() {
		await initAudioContext();
		await acquireWakeLock();
		running = true;
		startTime = Date.now();
		dt = 0;
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

<div class="h-screen">
	<div class="m-auto aspect-square max-h-screen max-w-screen">
		<section class="m-4 mx-auto flex h-full flex-col justify-center p-4">
			<header
				class="p-4 landscape:absolute landscape:top-0 landscape:right-0 landscape:left-0 landscape:p-0"
			>
				<h1
					class="h3 sm:h2 md:h1 landscape:h3 flex flex-row items-center justify-center text-start landscape:justify-start"
				>
					<HomeLinkLogo /> Titans EMOM Timer
				</h1>
			</header>
			<div class="flex h-full flex-col items-center justify-center">
				{#if debug}
					<div class="text-secondary-500 text-sm">
						{#if running}
							<p>Running</p>
						{:else}
							<p>Stopped</p>
						{/if}
						<p>Time: {dt / 1000}s</p>
						<p>Total: {total / 1000}s</p>
					</div>
				{/if}
				<Timer
					start={0}
					end={total}
					{dt}
					active={true}
					sizeClasses="w-8/10 h-8/10"
					variant={style ? 'emom-b' : 'emom-a'}
				>
					{#snippet children()}
						<div class="mb-2">
							{#if running}
								<button
									class="btn preset-filled-secondary-500 btn-lg text-[0.5em]"
									onclick={() => (running = false)}>Stop</button
								>
							{:else}
								<button class="btn preset-filled-secondary-500 btn-lg text-[0.5em]" onclick={start}
									>Start</button
								>
							{/if}
						</div>
					{/snippet}
				</Timer>
			</div>
		</section>
	</div>
</div>

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
