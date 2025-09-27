<script lang="ts">
    import Tag from '../components/Tag.svelte';
    import { createEventDispatcher } from 'svelte';

    export let title: string;
    export let rating: number;
    export let tags: Array<{ color: string; text: string }>;
    export let text: string;
    export let date: string;
    
    const dispatch = createEventDispatcher();
    
    function handleClick() {
        dispatch('select', {
            title,
            rating,
            tags,
            text,
            date
        });
    }
</script>

<div class="dream-card" on:click={handleClick}>
    <div class="dc-header">
        <div class="dc-title">
            {title}
        </div>
        <div class="dc-rating">
            {rating}/5
        </div>
    </div>
    <div class="dc-tags">
        {#each tags as tag}
        <Tag color={tag.color} text={tag.text} />
        {/each}
    </div>
    <div class="dc-text">
        {text}
    </div>
</div>

<style>
    .dream-card {
        max-width: 400px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--rad);
        padding: var(--item-spacing);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        font-size: var(--normal);
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .dream-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        border-color: var(--text-secondary);
    }

    .dc-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--item-spacing);
        padding-bottom: var(--item-spacing);
        border-bottom: 1px solid var(--border-color);
        font-weight: bold;
    }

    .dc-title {
        color: var(--text-primary);
    }

    .dc-rating {
        color: var(--text-primary);
    }

    .dc-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 6px;
    }

    .dc-text {
        color: var(--text-secondary);
        line-height: 1;
        font-size: var(--normal);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
