<script>
    export let color = "#000000";
    export let text = "Tag Sample";
</script>

<div class="tag-container">
    <div class="tag-circle" style="background-color: {color};"></div>
    <span class="tag-text">{text}</span>
</div>

<style>
    .tag-container {
        display: inline-flex;
        align-items: center;
        gap: var(--item-spacing);
        background: var(--bg-tertiary);
        border-radius: var(--rad);
        padding: var(--item-spacing);
    }

    .tag-circle {
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
        border-radius: 50%;
    }

    .tag-text {
        color: var(--text-primary);
        font-size: var(--smaller);
    }
</style>
