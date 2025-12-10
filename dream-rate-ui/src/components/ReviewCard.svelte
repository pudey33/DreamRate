<script lang="ts">
    import type { Review } from '../lib/supabase/types';
    
    export let review: Review;
    export let compact: boolean = false;
    
    // Function to generate star rating display
    function getStarRating(rating: number): string {
        const stars: string[] = [];
        const fullStars = Math.floor(rating);
        
        for (let i = 0; i < fullStars; i++) {
            stars.push('★');
        }
        
        while (stars.length < 5) {
            stars.push('☆');
        }
        
        return stars.join('');
    }
    
    // Format date
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
</script>

<div class="review-card" class:compact>
    <div class="review-header">
        <div class="ratings">
            <div class="overall-rating">
                <span class="stars">{getStarRating(review.overall_rating)}</span>
                <span class="rating-value">{review.overall_rating}/5</span>
            </div>
            <div class="additional-ratings">
                {#if review.ethics_rating}
                    <span class="sub-rating">Ethics: {review.ethics_rating}/5</span>
                {/if}
                {#if review.creativity_rating}
                    <span class="sub-rating">Creativity: {review.creativity_rating}/5</span>
                {/if}
                {#if review.writing_rating}
                    <span class="sub-rating">Writing: {review.writing_rating}/5</span>
                {/if}
            </div>
        </div>
        <div class="review-date">
            {formatDate(review.created_at)}
        </div>
    </div>
    
    <div class="review-content" class:truncated={compact}>
        <p>{review.content}</p>
    </div>
</div>

<style>
    .review-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--rad);
        padding: var(--spacing);
        transition: all 0.2s ease;
    }
    
    .review-card:hover {
        border-color: var(--text-secondary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .review-card.compact {
        padding: calc(var(--spacing) * 0.75);
    }
    
    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing);
        gap: var(--spacing);
    }
    
    .ratings {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) / 2);
    }
    
    .overall-rating {
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) / 2);
    }
    
    .stars {
        font-size: var(--larger);
        color: #ffd700;
        letter-spacing: 1px;
    }
    
    .rating-value {
        font-size: var(--normal);
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .additional-ratings {
        display: flex;
        gap: var(--spacing);
        flex-wrap: wrap;
    }
    
    .sub-rating {
        font-size: var(--smaller);
        color: var(--text-secondary);
        background: var(--bg-tertiary);
        padding: calc(var(--spacing) / 4) calc(var(--spacing) / 2);
        border-radius: var(--rad);
    }
    
    .review-date {
        font-size: var(--smaller);
        color: var(--text-muted);
        white-space: nowrap;
    }
    
    .review-content {
        color: var(--text-secondary);
        line-height: 1.6;
    }
    
    .review-content p {
        margin: 0;
    }
    
    .review-content.truncated p {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    @media (max-width: 768px) {
        .review-header {
            flex-direction: column;
        }
        
        .additional-ratings {
            flex-direction: column;
            gap: calc(var(--spacing) / 2);
        }
    }
</style>
