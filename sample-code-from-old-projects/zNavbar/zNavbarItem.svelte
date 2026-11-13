<script>
	import { goto } from '$app/navigation';
	export let name;
	export let isActive;
	export let classStyle;
	export let link = '';

	let element;

	const setActive = () => {
		if (window.active === element) return;
		window.active?.classList.remove('tabItemActive');
		element.classList.add('tabItemActive');
		window.active = element;
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => { goto(`/${link}`); }} class="">
	<i class="{classStyle} sidebarIcon" />
	<span>{name}</span>
</div>

<style>
	.tabItem {
		flex-shrink: 0;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		padding: 10px;
		border-radius: 5px;
		gap: 10px;
	}

	.tabItem:hover {
		background-color: #19191d;
		transition: all 0.1s linear;
		cursor: pointer;
	}

	.tabItemActive {
		background-color: #19191d;
	}

	.sidebarIcon {
		width: 20px;
	}
</style>
