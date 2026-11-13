<script>
    import SidebarItem from "$components/SidebarItem.svelte";
    import icoCollapse from "$lib/assets/HC-Collapse.svg";
</script>

<div class="sb-sidebar">
	<div class="sb-logo">
		<slot name="sb-logo" />
	</div>
	<div class="sb-top">
		<slot name="sb-top" />
	</div>
	<div class="sb-spacer"></div>
	<div class="sb-bottom">
		<SidebarItem text="Collapse" func="collapse" size="small" img={icoCollapse}/>
		<slot name="sb-bottom" />
	</div>
</div>
<div class="sb-header">
	<div class="sb-header-l">

	</div>
	<div class="sb-spacer"></div>
	<div class="sb-header-r">

	</div>
</div>

<style>
	.sb-sidebar {
		background: var(--gray-2);
		padding-top: 5px;
		padding-bottom: 25px;

		display: flex;
		flex-direction: column;
	}
	.sb-logo,
	.sb-top,
	.sb-bottom,
	.sb-header-l,
	.sb-header-r {
		flex-shrink: 0;
	}
	.sb-spacer {
		flex-grow: 1;
	}

	
	@media (min-width: 950px) {/* Wide Screen */
		.sb-sidebar{
			width: 150px;
			display: flex;
		}
	}
	@media (min-width: 600px) and (max-width: 950px) {/* Medium Screen */
		.sb-sidebar{
			width: 50px;
			display: flex;
		}
	}
	@media (max-width: 600px) {/* Small Screen */
		.sb-sidebar{
			display: none;
		}
	}
</style>

<!-- <NavbarSection title="Admin">
		<NavbarItem
			link="managers"
			name="Managers"
			classStyle="fa-sharp fa-solid fa-users sidebarIcon lightBlue"
			isActive="false"
		/>
	</NavbarSection> -->