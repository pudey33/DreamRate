<script>
	import { navbarSectionSelected, innerHeight } from '$stores/generalStore.js';

	export let title;
	let show = true;
	const hamburgerClick = (ev) => {
		if ($innerHeight < 570 && $navbarSectionSelected == title) {
			navbarSectionSelected.set(null);
			show = false;
		} else if ($innerHeight >= 570 && show) {
			show = false;
		} else {
			navbarSectionSelected.set(title);
			show = true;
		}
	};
</script>

<div class="tabSection bgColorDark">
	<div class="tabTitleRow">
		<span class="tabTitle">{title}</span>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<i on:click={hamburgerClick} class="fa-solid fa-bars tabTitleHamburger" />
	</div>

	<div
		class={($innerHeight >= 570 && show) ||
		($innerHeight < 570 && $navbarSectionSelected == title)
			? 'tabSectionContent'
			: 'collapsed'}
	>
		<slot />
	</div>
</div>

<style>
	.tabSection {
		display: flex;
		flex-direction: column;
		border-radius: 5px;
		padding: 0.8rem;
		flex-shrink: 0;
	}

	.tabSection > * {
		flex-shrink: 0;
	}

	.tabTitle {
		font-size: 18px;
		letter-spacing: 2px;
		text-transform: uppercase;
		padding-right: 7px;
	}

	.tabTitleRow {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.tabTitleHamburger:hover {
		color: white;
		cursor: pointer;
		transition: all 0.1s linear;
	}

	.tabSectionContent {
		max-width: 100%;
		margin-top: 1rem;
	}

	.collapsed {
		max-height: 0;
		overflow: hidden;
	}
</style>
