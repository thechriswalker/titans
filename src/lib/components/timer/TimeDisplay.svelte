<script lang="ts" module>
	function pad(n: number, p: number) {
		return pad3(n).slice(0, p);
	}

	function pad2(num: number): string {
		return (num > 9 ? '' : '0') + num;
	}
	function pad3(num: number): string {
		return (num > 99 ? '' : num > 9 ? '0' : '00') + num;
	}

	function formatSeconds(s: number): string {
		const ss = pad2(s % 60);
		const mm = pad2(Math.floor((s / 60) % 60));

		return `${mm}:${ss}`;
	}
</script>

<script lang="ts">
	interface Props {
		secs?: number;
		millis?: number;
		class?: string;
		precision?: number;
	}
	let { secs = 0, millis = -1, class: classes = '', precision = 1 }: Props = $props();
	let s = $derived(formatSeconds(millis >= 0 ? secs + Math.floor(millis / 1e3) : secs));
	let m = $derived(millis >= 0 ? millis % 1e3 : -1);
	let mt = $derived(m >= 0 ? '.' + pad(m, precision) : '');
</script>

<time class="tabular-nums {classes}">{s}<span class="text-[0.7em]">{mt}</span></time>
