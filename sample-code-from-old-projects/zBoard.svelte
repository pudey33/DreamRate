<script>
    import BoardSvg from "$components/BoardSVG.svelte";

    export let display = false;
</script>

<div class="hex-board-container">
    <BoardSvg/>
</div>

<style>
.hex-board-container{
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>