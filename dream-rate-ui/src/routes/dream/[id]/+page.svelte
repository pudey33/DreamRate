<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { user } from '../../../lib/auth';
    import { getDreamById } from '../../../lib/supabase/queries';
    import { submitReview } from '../../../lib/supabase/mutations';
    import ReviewCard from '../../../components/ReviewCard.svelte';
    import DreamRating from '../../../components/DreamRating.svelte';
    import Toast from '../../../components/Toast.svelte';
    
    let dreamData: any = null;
    let reviews: any[] = [];
    let loading = true;
    let error: string | null = null;
    let isRatingExpanded = false;
    let isSubmitting = false;
    
    // Toast state
    let showToast = false;
    let toastMessage = '';
    let toastType: 'success' | 'error' | 'info' = 'success';
    
    $: dreamId = parseInt($page.params.id || '0');
    $: isOwner = $user && dreamData && $user.id === dreamData.created_by;
    $: canRate = $user && !isOwner;
    $: userHasReviewed = $user && reviews.some(r => r.created_by === $user.id);
    
    onMount(async () => {
        await loadDream();
    });
    
    async function loadDream() {
        if (isNaN(dreamId)) {
            error = 'Invalid dream ID';
            loading = false;
            return;
        }
        
        try {
            loading = true;
            error = null;
            const data = await getDreamById(dreamId);
            
            if (data) {
                dreamData = data;
                reviews = data.reviews || [];
                reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            }
        } catch (err) {
            console.error('Error loading dream:', err);
            error = 'Failed to load dream. Please try again.';
        } finally {
            loading = false;
        }
    }
    
    function toggleRating() {
        if (!canRate || userHasReviewed) return;
        isRatingExpanded = !isRatingExpanded;
    }
    
    async function handleRatingSubmit(event: CustomEvent) {
        if (!$user || !dreamData) return;
        
        isSubmitting = true;
        
        try {
            const reviewData = {
                ...event.detail,
                created_by: $user.id
            };
            
            await submitReview(reviewData);
            
            // Show success message
            showSuccessToast('Review submitted successfully! 🌟');
            
            // Reload the dream to get the new review
            await loadDream();
            
            // Close the rating panel
            isRatingExpanded = false;
        } catch (err) {
            console.error('Error submitting review:', err);
            showErrorToast('Failed to submit review. Please try again.');
        } finally {
            isSubmitting = false;
        }
    }
    
    function handleRatingCancel() {
        isRatingExpanded = false;
    }
    
    function goBack() {
        goto('/');
    }
    
    // Toast helper functions
    function showSuccessToast(message: string) {
        toastMessage = message;
        toastType = 'success';
        showToast = true;
    }
    
    function showErrorToast(message: string) {
        toastMessage = message;
        toastType = 'error';
        showToast = true;
    }
    
    function handleToastDismiss() {
        showToast = false;
    }
    
    // Calculate average rating
    $: averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length
        : 0;
</script>

<div class="detail-page">
    <div class="detail-header">
        <button class="back-btn" on:click={goBack}>
            ← Back to Feed
        </button>
    </div>
    
    <div class="detail-content">
        {#if loading}
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading dream...</p>
            </div>
        {:else if error}
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button class="retry-btn" on:click={loadDream}>
                    Try Again
                </button>
            </div>
        {:else if dreamData}
            <div class="dream-detail">
                <!-- Dream Content -->
                <div class="dream-full">
                    <h1 class="dream-title">{dreamData.title}</h1>
                    <div class="dream-meta">
                        <span class="dream-date">
                            {new Date(dreamData.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </span>
                        {#if reviews.length > 0}
                            <div class="aggregate-rating">
                                <span class="rating-text">{averageRating.toFixed(1)} / 5</span>
                                <span class="review-count">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                            </div>
                        {/if}
                    </div>
                    <div class="dream-content">
                        <p>{dreamData.content}</p>
                    </div>
                </div>
                
                <!-- Rating Section -->
                {#if canRate && !userHasReviewed}
                    <div class="rating-section">
                        <button 
                            class="rate-dream-btn" 
                            on:click={toggleRating}
                            disabled={isSubmitting}
                        >
                            {isRatingExpanded ? '▼' : '▶'} {isRatingExpanded ? 'Hide Rating' : 'Rate This Dream'}
                        </button>
                        
                        <DreamRating 
                            dreamId={dreamId}
                            isExpanded={isRatingExpanded}
                            on:submit={handleRatingSubmit}
                            on:cancel={handleRatingCancel}
                        />
                    </div>
                {:else if userHasReviewed}
                    <div class="already-reviewed">
                        <p>✓ You've already reviewed this dream</p>
                    </div>
                {/if}
                
                <!-- Reviews Section -->
                <div class="reviews-section">
                    <h2>Reviews ({reviews.length})</h2>
                    
                    {#if reviews.length > 0}
                        <div class="reviews-list">
                            {#each reviews as review}
                                <ReviewCard {review} compact={false} />
                            {/each}
                        </div>
                    {:else}
                        <div class="no-reviews">
                            <p>No reviews yet. Be the first to review this dream!</p>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>

<Toast 
    bind:show={showToast}
    message={toastMessage}
    type={toastType}
    on:dismiss={handleToastDismiss}
/>

<style>
    .detail-page {
        min-height: 100vh;
        background: var(--bg-primary);
        display: flex;
        flex-direction: column;
    }
    
    .detail-header {
        padding: var(--spacing);
        border-bottom: 1px solid var(--border-color);
        background: var(--bg-secondary);
    }
    
    .back-btn {
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2);
        border-radius: var(--rad);
        font-size: var(--normal);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .back-btn:hover {
        background: var(--bg-primary);
        transform: translateY(-1px);
    }
    
    .detail-content {
        flex: 1;
        max-width: 900px;
        width: 100%;
        margin: 0 auto;
        padding: calc(var(--spacing) * 3);
    }
    
    .loading-state,
    .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        text-align: center;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--border-color);
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: var(--spacing);
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .error-icon {
        font-size: 3rem;
        margin-bottom: var(--spacing);
    }
    
    .retry-btn {
        background: #dc3545;
        color: white;
        border: none;
        padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2);
        border-radius: var(--rad);
        font-size: var(--normal);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-top: var(--spacing);
    }
    
    .retry-btn:hover {
        background: #c82333;
    }
    
    .dream-detail {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 3);
    }
    
    .dream-full {
        background: var(--bg-secondary);
        padding: calc(var(--spacing) * 3);
        border-radius: var(--rad);
        border: 1px solid var(--border-color);
    }
    
    .dream-title {
        font-size: var(--xx-larger);
        font-weight: bold;
        color: var(--text-primary);
        margin: 0 0 var(--spacing) 0;
    }
    
    .dream-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: calc(var(--spacing) * 2);
        padding-bottom: var(--spacing);
        border-bottom: 2px solid var(--border-color);
    }
    
    .dream-date {
        color: var(--text-secondary);
        font-size: var(--larger);
    }
    
    .aggregate-rating {
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) / 2);
    }
    
    .rating-text {
        font-size: var(--larger);
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .review-count {
        font-size: var(--normal);
        color: var(--text-muted);
    }
    
    .dream-content p {
        font-size: var(--larger);
        line-height: 1.8;
        color: var(--text-secondary);
        margin: 0;
        white-space: pre-wrap;
    }
    
    .rating-section {
        background: var(--bg-secondary);
        padding: calc(var(--spacing) * 2);
        border-radius: var(--rad);
        border: 1px solid var(--border-color);
    }
    
    .rate-dream-btn {
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
    
    .rate-dream-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .rate-dream-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .already-reviewed {
        background: rgba(40, 167, 69, 0.1);
        border: 1px solid rgba(40, 167, 69, 0.3);
        padding: var(--spacing);
        border-radius: var(--rad);
        text-align: center;
    }
    
    .already-reviewed p {
        margin: 0;
        color: #28a745;
        font-weight: 500;
    }
    
    .reviews-section {
        background: var(--bg-secondary);
        padding: calc(var(--spacing) * 3);
        border-radius: var(--rad);
        border: 1px solid var(--border-color);
    }
    
    .reviews-section h2 {
        font-size: var(--x-larger);
        color: var(--text-primary);
        margin: 0 0 calc(var(--spacing) * 2) 0;
        padding-bottom: var(--spacing);
        border-bottom: 2px solid var(--border-color);
    }
    
    .reviews-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing);
    }
    
    .no-reviews {
        text-align: center;
        padding: calc(var(--spacing) * 3);
        color: var(--text-muted);
        font-style: italic;
    }
    
    @media (max-width: 768px) {
        .detail-content {
            padding: var(--spacing);
        }
        
        .dream-full,
        .reviews-section {
            padding: var(--spacing);
        }
        
        .dream-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: calc(var(--spacing) / 2);
        }
    }
</style>
