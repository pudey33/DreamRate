<script lang="ts">
    import { goto } from '$app/navigation';
    import Tag from './Tag.svelte';
    import ReviewCard from './ReviewCard.svelte';
    import type { Dream } from '../lib/supabase/types';
    
    export let dream: Dream;
    export let reviews: any[] = [];
    export let reviewCount: number = 0;
    export let averageRating: number = 0;
    
    // Function to format date
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Function to generate star rating display
    function getStarRating(rating: number): string {
        const stars: string[] = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push('★');
        }
        
        if (hasHalfStar) {
            stars.push('½');
        }
        
        while (stars.length < 5) {
            stars.push('☆');
        }
        
        return stars.join('');
    }
    
    // Parse tags
    $: tags = dream.tags && Array.isArray(dream.tags) 
        ? dream.tags.map((tag: string, index: number) => ({
            color: ['#ff6b6b', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][index % 5],
            text: tag
        }))
        : [];
    
    // Show first 2 reviews
    $: previewReviews = reviews.slice(0, 2);
    
    function viewDream() {
        goto(`/dream/${dream.id}`);
    }
</script>

<div class="dream-feed-card">
    <div class="card-header">
        <h2 class="dream-title">{dream.title}</h2>
        <div class="dream-meta">
            <span class="dream-date">{formatDate(dream.created_at)}</span>
            {#if reviewCount > 0}
                <div class="aggregate-rating">
                    <span class="stars">{getStarRating(averageRating)}</span>
                    <span class="rating-text">{averageRating.toFixed(1)}</span>
                    <span class="review-count">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
                </div>
            {:else}
                <span class="no-reviews">No reviews yet</span>
            {/if}
        </div>
    </div>
    
    {#if tags.length > 0}
        <div class="dream-tags">
            {#each tags as tag}
                <Tag color={tag.color} text={tag.text} />
            {/each}
        </div>
    {/if}
    
    <div class="dream-content-preview">
        <p class="dream-text">{dream.content}</p>
    </div>
    
    {#if previewReviews.length > 0}
        <div class="reviews-preview">
            <h4>Recent Reviews:</h4>
            <div class="preview-reviews-list">
                {#each previewReviews as review}
                    <ReviewCard {review} compact={true} />
                {/each}
            </div>
            {#if reviewCount > 2}
                <p class="more-reviews">+{reviewCount - 2} more review{reviewCount - 2 !== 1 ? 's' : ''}</p>
            {/if}
        </div>
    {/if}
    
    <div class="card-footer">
        <button class="view-dream-btn" on:click={viewDream}>
            View Dream & All Reviews
        </button>
    </div>
</div>

<style>
    .dream-feed-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--rad);
        padding: calc(var(--spacing) * 2);
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        gap: var(--spacing);
    }
    
    .dream-feed-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        border-color: var(--text-secondary);
    }
    
    .card-header {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) / 2);
    }
    
    .dream-title {
        font-size: var(--x-larger);
        font-weight: bold;
        color: var(--text-primary);
        margin: 0;
        line-height: 1.2;
    }
    
    .dream-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--spacing);
    }
    
    .dream-date {
        font-size: var(--normal);
        color: var(--text-secondary);
    }
    
    .aggregate-rating {
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) / 2);
    }
    
    .stars {
        font-size: var(--larger);
        color: #ffd700;
        letter-spacing: 1px;
    }
    
    .rating-text {
        font-size: var(--normal);
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .review-count {
        font-size: var(--smaller);
        color: var(--text-muted);
    }
    
    .no-reviews {
        font-size: var(--smaller);
        color: var(--text-muted);
        font-style: italic;
    }
    
    .dream-tags {
        display: flex;
        flex-wrap: wrap;
        gap: calc(var(--spacing) / 2);
    }
    
    .dream-content-preview {
        max-height: 120px;
        overflow: hidden;
        position: relative;
    }
    
    .dream-text {
        font-size: var(--normal);
        line-height: 1.6;
        color: var(--text-secondary);
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .reviews-preview {
        display: flex;
        flex-direction: column;
        gap: var(--spacing);
        padding-top: var(--spacing);
        border-top: 1px solid var(--border-color);
    }
    
    .reviews-preview h4 {
        margin: 0;
        font-size: var(--normal);
        color: var(--text-primary);
        font-weight: 600;
    }
    
    .preview-reviews-list {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) / 2);
    }
    
    .more-reviews {
        margin: 0;
        font-size: var(--smaller);
        color: var(--text-muted);
        font-style: italic;
        text-align: center;
    }
    
    .card-footer {
        display: flex;
        justify-content: center;
        padding-top: var(--spacing);
        border-top: 1px solid var(--border-color);
    }
    
    .view-dream-btn {
        width: 100%;
        padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: var(--rad);
        font-size: var(--normal);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
    }
    
    .view-dream-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .view-dream-btn:active {
        transform: translateY(0);
    }
    
    @media (max-width: 768px) {
        .dream-feed-card {
            padding: var(--spacing);
        }
        
        .dream-meta {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
