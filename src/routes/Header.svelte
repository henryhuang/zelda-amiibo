<script lang="ts">
	import { Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';
	import { onDestroy } from "svelte";
	import { collectedInfo } from '../store';
	import { downloadBackup } from '$lib/utils/commonUtil';

	interface Props {
		title?: string;
	}

	let { title }: Props = $props();
	let myCollectedInfo: CollectedInfo;
	const unsubscribe = collectedInfo.subscribe((value: CollectedInfo) => {
		myCollectedInfo = value;
	})

	onDestroy(unsubscribe);

</script>

<Navbar>
	<NavBrand href="/">
		<img src="/images/logo_200.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
			{ title ? ` ${title}` : "CNHALO.com"}
		</span>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi class="cursor-pointer" onclick={() => {
			if (myCollectedInfo) {
				downloadBackup(myCollectedInfo)
			}
		}}>
			备份
		</NavLi>
	</NavUl>
</Navbar>