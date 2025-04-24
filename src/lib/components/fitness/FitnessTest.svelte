<script lang="ts">
	import { page } from '$app/state';
	import type { TestSection } from '$lib/fitness-test';
	import { deferred, pause, type Deferral } from '$lib/util/deferred';
	import { Info } from '@lucide/svelte';
	import TimeDisplay from '../timer/TimeDisplay.svelte';
	import Timer from '../timer/Timer.svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import HomeLinkLogo from '../logo/HomeLinkLogo.svelte';
	import { onDestroy } from 'svelte';
	import { acquireWakeLock, releaseWakeLock } from '$lib/util/wakelock';

	const DEBUG = page.url.searchParams.get('debug') !== null;

	/** fitness test component
	 *
	 *  run timings, allow scoring,
	 *  display results
	 *  grab a screen-wake-lock before starting.
	 *  no timeouts, if possible, but instead a start time and diff.
	 *  use request animation frame to update progress bars.
	 *
	 *  We will have a 3 second countdown to the start
	 */

	onDestroy(async () => {
		await releaseWakeLock();
	});

	interface Props {
		test: Array<TestSection>;
	}
	let { test }: Props = $props();

	type TestSectionExpanded = {
		x: TestSection;
		start: number;
		rest: number;
		finish: number;
	};

	function expandSections(test: Array<TestSection>): Array<TestSectionExpanded> {
		let t = 0;
		return test.map((x, i) => {
			let d = x.duration * 1e3;
			let r = x.rest * 1e3;
			if (DEBUG) {
				// if debug change to 10s and 5s
				d = 12e3;
				r = 6e3;
			}
			let start = t;
			let rest = start + d;
			let finish = rest + r;
			t = finish;
			return {
				x,
				start,
				rest,
				finish
			};
		});
	}

	let sections = expandSections(test);

	// state of the test.
	let currentSectionIndex = $state(-1);
	let testStart = $state(0); // ISO milliseconds (0 means not started)
	let currentTime = $state(0); // will be current time.
	let dt = $derived(currentTime - testStart); // time since test started.
	// let scores = $state<Array<number>>(test.map((x) => 0));

	type TestState = 'ready' | 'countdown' | 'running' | 'finished';
	let testState: TestState = $state('ready');

	let countdown = $state(0);

	const countdownDuration = 3; // seconds

	async function runCountdown() {
		countdown = countdownDuration;
		while (countdown > 0) {
			await pause(1000); // 1 second intervals
			countdown--;
		}
	}

	let paused: Deferral<void> | null = null;
	let pausedAt = $state(0);
	function toggle() {
		if (paused) {
			// push the "start time" forward, so DT matches the time we paused at
			testStart = Date.now() - pausedAt;
			paused.resolve();
			paused = null;
		} else {
			pausedAt = dt;
			paused = deferred();
		}
	}

	(window as any).toggle = toggle;

	async function run() {
		// first get the wakelock
		await acquireWakeLock();
		testState = 'countdown';
		await runCountdown();
		testStart = Date.now();
		testState = 'running';

		let complete = deferred<void>();

		function tick() {
			if (paused) {
				paused.promise.then(tick);
				return;
			}
			currentTime = Date.now();
			const dt = currentTime - testStart; // elapsed time in milliseconds
			// find current section
			//console.log({ dt, sections });
			currentSectionIndex = sections.findIndex((x) => dt >= x.start && dt < x.finish);
			if (currentSectionIndex === -1) {
				// we are done.
				testState = 'finished';
				complete.resolve();
				return;
			}
			requestAnimationFrame(tick);
		}

		try {
			// for each section
			// how do we maintain good timing? probably with requestAnimationFrame.
			// or just set a transition duration and a setTimeout and cross our fingers...
			// we will use an interval, faster than 1 second, but not as fast as requestAnimationFrame (60fps).
			// maybe 100ms.
			tick();
			await complete.promise;
		} finally {
			await releaseWakeLock();
		}
	}

	// no typeing...
	let carouselAPI = $state<any>();

	function emblaInit(event: any) {
		carouselAPI = event.detail;
		(window as any).carouselAPI = carouselAPI;
	}

	// $effect(() => {
	// 	setTimeout(() => {
	// 		run();
	// 	}, 500);
	// });

	$effect(() => {
		if (carouselAPI) {
			const currentIndex = carouselAPI.selectedScrollSnap();
			if (currentIndex !== currentSectionIndex) {
				console.log('switching to section', currentSectionIndex);
				carouselAPI.scrollTo(currentSectionIndex);
			}
		}
	});
</script>

{#snippet testSection(s: TestSectionExpanded)}
	{@const workTime = dt < s.rest}
	{@const isActive = dt > s.start}
	<div
		class="card bg-primary-700 text-secondary-500 m-4 flex min-h-96 flex-col justify-between gap-4 p-6 lg:mx-auto lg:max-w-340 lg:flex-row"
	>
		<div>
			<h1 class="h3 sm:h1">{s.x.title}</h1>
			<h2 class="h4 sm:h2">{s.x.subtitle}</h2>
			<p class="my-2 text-lg">{s.x.goal}</p>
			<div class="hidden lg:block">
				<blockquote class="blockquote border-secondary-500 my-2 text-lg">{s.x.scoring}</blockquote>
				<ul class="list-inside list-disc space-y-2">
					{#each s.x.standards as item}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
		</div>
		<div>
			<!-- timers -->
			<div class="flex flex-row items-center justify-between gap-2">
				<div
					class="badge preset-filled-secondary-500 flex h-12 w-1/2 flex-row items-center justify-center gap-2 px-6 transition-opacity {workTime
						? 'text-xl font-bold opacity-100 sm:text-2xl'
						: 'text-lg opacity-50 sm:text-xl'}"
				>
					<span>Send it!</span><TimeDisplay secs={s.x.duration} class="text-xl" />
				</div>
				<div
					class="badge preset-filled-tertiary-500 flex h-12 w-1/2 flex-row items-center justify-center gap-2 px-6 transition-opacity {workTime
						? 'text-lg opacity-50 sm:text-xl'
						: 'text-xl font-bold opacity-100 sm:text-2xl'}"
				>
					<span>Rest</span><TimeDisplay secs={s.x.rest} class="text-xl" />
				</div>
			</div>
			<div class="mt-12">
				{#if workTime}
					<Timer start={s.start} end={s.rest} {dt} active={isActive} />
				{:else}
					<Timer start={s.rest} end={s.finish} {dt} variant="rest" active={!workTime} />
				{/if}
			</div>
		</div>
	</div>
{/snippet}
<section class="relative z-100 m-4 mx-auto flex max-w-320 flex-col">
	<div class="align-center flex flex-col items-center justify-between md:flex-row">
		<h1 class="h3 sm:h2 md:h1 flex flex-row items-center">
			<HomeLinkLogo /> Titans Fitness Test
			<a href="/fitness/info" type="button" class="btn btn-icon btn-lg h-[24px] w-[24px]"
				><Info size={24} /></a
			>
		</h1>
		{#if testState === 'running'}
			<button class="h3 sm:h2 md:h1" onclick={toggle} type="button">
				<TimeDisplay millis={currentTime - testStart} />
			</button>
		{/if}
	</div>
</section>
{#if testState === 'ready'}
	<div class="m-auto mt-8 flex h-full w-full flex-col items-center justify-center p-4">
		<div
			class="card bg-primary-700 text-secondary-500 flex min-h-64 w-full flex-col items-center justify-center gap-2 p-4 lg:mx-auto lg:w-auto lg:max-w-340"
		>
			<p class="my-4 text-center text-xl">
				The purpose of this fitness test is to evaluate our current fitness levels, identify areas
				for improvement, and ensure that we are all in peak condition for the upcoming season.
			</p>
			<button class="btn btn-lg preset-filled-secondary-500 text-3xl" onclick={run}
				>Start Test</button
			>
		</div>
	</div>
{:else if testState === 'countdown'}
	<!-- the countdown will be 3 overlapping 0 opacity divs -->
	<!-- then the "current" one will have full opacity, all transitioned -->
	<div class="m-auto mt-8 flex h-full w-full flex-col items-center justify-center p-4">
		<div
			class="card bg-primary-700 text-secondary-500 flex min-h-64 w-full flex-row items-center justify-center gap-2 p-4 lg:mx-auto lg:max-w-340"
		>
			<h1 class="h1 text-8xl">{countdown}</h1>
		</div>
	</div>
{:else if testState === 'running'}
	<div
		class="embla relative z-10"
		use:emblaCarouselSvelte={{ options: { axis: 'y', align: 'start' } } as any}
		onemblaInit={emblaInit}
	>
		<div class="embla__container m-auto flex h-192 flex-col">
			{#each sections as s, i}
				<div
					class="embla__slide transition-all {i === currentSectionIndex
						? 'scale-100 opacity-100'
						: i > currentSectionIndex
							? 'scale-80 opacity-50'
							: 'scale-10 opacity-0'}"
				>
					{@render testSection(s)}
				</div>
			{/each}
		</div>
	</div>
{:else if testState === 'finished'}
	<div class="m-auto mt-8 flex h-full w-screen flex-col items-center justify-center p-4">
		<div
			class="card bg-primary-700 text-secondary-500 flex min-h-64 w-full flex-col items-center justify-center gap-2 p-4"
		>
			<h1 class="h1">Finished!</h1>
			<button class="btn btn-lg preset-filled-secondary-500" onclick={run}>Go Again?</button>
		</div>
	</div>
{/if}

<style>
	.embla {
		overflow: visible;
		margin: auto;
		width: 100vw;
		/* pointer-events: none; */
	}
</style>
