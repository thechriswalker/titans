<script lang="ts">
	import type { Snippet } from 'svelte';
	import TimeDisplay from './TimeDisplay.svelte';
	import { ProgressRing } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		start: number;
		end: number;
		dt: number;
		active?: boolean;
		variant?: 'rest' | 'work' | 'emom-a' | 'emom-b';
		sizeClasses?: string;
		childClasses?: string;
		classes?: string;
		children?: Snippet;
	}

	const variants = {
		work: {
			meterStroke: 'stroke-secondary-500',
			trackStroke: 'stroke-primary-600',
			childText: 'text-secondary-500'
		},
		rest: {
			meterStroke: 'stroke-tertiary-700',
			trackStroke: 'stroke-primary-600',
			childText: 'text-tertiary-600'
		},
		'emom-a': {
			meterStroke: 'stroke-primary-500',
			trackStroke: 'stroke-secondary-500',
			childText: 'text-secondary-500'
		},
		'emom-b': {
			meterStroke: 'stroke-secondary-500',
			trackStroke: 'stroke-primary-500',
			childText: 'text-secondary-500'
		}
	} as const;

	// the values should be seconds, not milliseconds
	let {
		start: startms,
		end: endms,
		dt: dtms,
		variant = 'work',
		active = false,
		sizeClasses = 'h-64 w-64',
		childClasses = 'text-5xl',
		classes = '',
		children
	}: Props = $props();

	let start = $derived(Math.floor(startms / 1000));
	let end = $derived(Math.floor(endms / 1000));
	let dt = $derived(Math.floor(dtms / 1000));

	let total = $derived(endms - startms);
	let early = $derived(dt < start);
	let late = $derived(dt > end);
	let pos = $derived(early ? 0 : late ? total : dtms - startms);
	let rem = $derived(Math.ceil((total - pos) / 1000));

	let meterStroke = $derived(variants[variant].meterStroke);
	let trackStroke = $derived(variants[variant].trackStroke);
	let childText = $derived(variants[variant].childText);

	// if we just mounted this, start at 0
</script>

<div class="mx-auto my-2 aspect-square {sizeClasses} {classes}">
	<ProgressRing
		value={active ? pos : 0}
		max={total}
		childrenClasses="{sizeClasses} {childText} {childClasses}"
		strokeLinecap={'butt'}
		{meterStroke}
		{trackStroke}
		meterTransition={'transition-[--percent] duration-0'}
		classes="aspect-square absolute"
	>
		<div class="flex h-full flex-col items-center justify-center gap-2">
			{@render children?.()}
			<TimeDisplay secs={rem} />
		</div>
	</ProgressRing>
</div>

<style>
	:global {
		@property --percent {
			syntax: '<number>'; /* <- defined as type number for the transition to work */
			initial-value: 0;
			inherits: false;
		}
	}
</style>
