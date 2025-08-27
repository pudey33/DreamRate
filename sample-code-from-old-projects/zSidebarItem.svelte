<script>
	import { goto } from '$app/navigation';

	export let text;
    export let size;
	export let func = '';
	export let link = '';
	export let img = '';

	function clickFunc(){
		switch(func){
			case 'collapse':
				console.log('collapse');
				break;
			case 'lang':
				console.log('lang');
				break;
			case 'lightUI':
				console.log('lightUI');
				break;
			case 'logout':
				console.log('logout');
				break;
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if func==='link'}
<div on:click={() => { goto(link) }} class="sb-item {size}">
	<img class="sb-item-icon" src={img} alt={text}/>
	<span class="sb-item-text">{text}</span>
</div>
{:else}
<div on:click={() => { clickFunc(func) }} class="sb-item {size}">
	<img class="sb-item-icon" src={img} alt={text}/>
	<span class="sb-item-text">{text}</span>
</div>
{/if}

<style>
	.sb-item {
		flex-shrink: 0;
		padding: 10px;
        user-select: none;
        color: var(--light-2);

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		gap: 10px;
	}
    .sb-item:hover {
        background: var(--gray-3);
        color: var(--light-1);
    }
	.sb-item-icon {
        flex-shrink: 0;
		margin-left: 10px;
	}
    .sb-item-text {
        flex-grow: 1;
	}
    .sb-item.big{
		font-size: 18px;
    }
	.sb-item.big > .sb-item-icon{
		width: 30px;
	}
    .sb-item.small{
		font-size: 14px;
    }
	.sb-item.small > .sb-item-icon{
		width: 20px;
	}

	/* Medium Screen */
	@media (min-width: 600px) and (max-width: 950px) {
		.sb-item-text{
			display: none;
		}
	}
</style>