<script lang="ts">
	import FitnessTest from '$lib/components/fitness/FitnessTest.svelte';
	import { fitnessTest } from '$lib/fitness-test';
</script>

<!-- not sure why I broke it out into a separate component... -->
<FitnessTest test={fitnessTest} />
