<script module lang="ts">
	import HomeLinkLogo from '$lib/components/logo/HomeLinkLogo.svelte';
	import TimeDisplay from '$lib/components/timer/TimeDisplay.svelte';
	import { fitnessTest } from '$lib/fitness-test';
	import {
		BicepsFlexed,
		Biohazard,
		Dribbble,
		Heart,
		ListChecks,
		Minus,
		PartyPopper,
		Plus,
		Star
	} from '@lucide/svelte';
	const data = [
		{
			title: 'The Importance of Fitness',
			icon: BicepsFlexed,
			content: [
				'As a basketball team, maintaining high levels of fitness is crucial. It impacts our performance on the court, helps prevent injuries, and allows us to execute our plays with maximum efficiency.',
				"Today's fitness test will help us set a baseline so we can track our progress over time.",
				'TO PASS THE TEST YOU MUST COMPLETE EACH PART OF THE TEST TO THE MINIMUM REQUIREMENT.'
			]
		},
		{
			title: 'Safety and Warm-Up',
			icon: Biohazard,
			content: [
				'Safety is a top priority; inform us immediately if you have any pre-existing injuries or conditions that might affect your output.',
				'We will start with a dynamic warm-up to ensure our muscles are properly activated and reduce the risk of injury.'
			]
		},
		{
			title: 'Procedure and Expectations',
			icon: ListChecks,
			content: [
				'Each test will be explained in detail before we begin. Listen carefully to the instructions and ask questions if you have any.',
				"Give your best effort in each assessment, but also listen to your body. It's important to push yourself, but not at the expense of your health.",
				'Coaches will be monitoring and recording your performance throughout the tests.'
			]
		},
		{
			title: 'Motivation and Team Spirit',
			icon: Heart,
			content: [
				"Remember, this is not just about individual performance; it's about our team as a whole. Let's support and encourage each other throughout.",
				'This is an opportunity to demonstrate our commitment to the team and to our personal growth as athletes.'
			]
		},
		{
			title: 'Closing',
			icon: Dribbble,
			content: [
				"Once all the tests are completed, we'll gather for a cool-down session and a brief discussion on the results and next steps.",
				"Thank you for your dedication and hard work. Let's make this a successful and productive fitness test."
			]
		}
	];
</script>

<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	let value = $state(data.map((_, i) => `${i}`));
</script>

<section class="m-4 mx-auto flex max-w-320 flex-col p-4">
	<header class="p-4">
		<h1 class="h2 sm:h1 flex flex-row items-center"><HomeLinkLogo /> Titans Fitness Test</h1>
		<p class="text-surface-50-950 my-4 text-lg">
			The purpose of this fitness test is to evaluate our current fitness levels, identify areas for
			improvement, and ensure that we are all in peak condition for the upcoming season.
		</p>
		<p>
			<a href="/fitness" class="btn preset-filled-secondary-500 btn-lg">Go to the test timer</a>
		</p>
	</header>

	<h2 class="h2 my-4 p-4">Why</h2>
	<div class="card preset-outlined-secondary-500 p-4">
		<Accordion multiple defaultValue={value}>
			{#snippet iconOpen()}<Minus size={24} class="text-secondary-500" />{/snippet}
			{#snippet iconClosed()}<Plus size={24} class="text-secondary-500" />{/snippet}
			{#each data as item, i}
				{@const Icon = item.icon}
				{#if i > 0}
					<hr class="hr preset-outlined-secondary-500" />
				{/if}
				<Accordion.Item value={`${i}`} contentClasses="grow text-start">
					{#snippet lead()}<Icon
							size={32}
							strokeWidth={2}
							class="text-primary-300 me-4"
						/>{/snippet}
					{#snippet control()}<h3 class="h3">{item.title}</h3>{/snippet}
					{#snippet panel()}
						<ul class="text-surface-50-950 list-inside list-disc space-y-2 text-lg">
							{#each item.content as text}
								<li>{text}</li>
							{/each}
						</ul>
					{/snippet}
				</Accordion.Item>
			{/each}
		</Accordion>
	</div>

	<h2 class="h2 my-4 p-4">What</h2>
	<div class="card preset-outlined-secondary-500 p-4">
		<Accordion multiple defaultValue={['0']}>
			{#snippet iconOpen()}<Minus size={24} class="text-secondary-500" />{/snippet}
			{#snippet iconClosed()}<Plus size={24} class="text-secondary-500" />{/snippet}
			{#each fitnessTest as item, i}
				{#if i > 0}
					<hr class="hr preset-outlined-secondary-500" />
				{/if}
				<Accordion.Item
					value={`${i}`}
					contentClasses="grow text-start"
					panelClasses="text-surface-50-950 text-lg"
				>
					{#snippet lead()}<p
							class="text-primary-300 me-4 h-[32px] w-[32px] text-center text-[42px] leading-[32px] font-bold"
						>
							{i + 1}
						</p>{/snippet}

					{#snippet control()}
						<div class="flex w-full flex-row items-center justify-between gap-4">
							<div>
								<h3 class="h3">{item.title}</h3>
								<h5 class="h5 text-surface-50-950">{item.subtitle}</h5>
							</div>
							<div class="pe-8 text-end">
								<h3 class="h5 text-warning-500">
									Work: <TimeDisplay secs={item.duration} />
								</h3>
								<h5 class="h5 text-tertiary-400">Rest: <TimeDisplay secs={item.rest} /></h5>
							</div>
						</div>
					{/snippet}
					{#snippet panel()}
						<p class="my-2 text-lg">{item.goal}</p>
						<div>
							<blockquote class="blockquote border-secondary-500 my-2">
								{item.scoring}
							</blockquote>
							<ul class="list-inside list-disc space-y-2">
								{#each item.standards as s}
									<li>{s}</li>
								{/each}
							</ul>
						</div>
					{/snippet}
				</Accordion.Item>
			{/each}
		</Accordion>
	</div>
</section>
