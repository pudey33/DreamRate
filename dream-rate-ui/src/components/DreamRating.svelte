<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { slide } from 'svelte/transition';
    
    export let dreamId: number;
    export let isExpanded: boolean = false;
    
    const dispatch = createEventDispatcher();
    
    // Rating state
    let overallRating: number = 0;
    let ethicsRating: number | null = null;
    let creativityRating: number | null = null;
    let writingRating: number | null = null;
    let reviewText: string = '';
    
    // Validation
    $: isValid = overallRating > 0 && reviewText.trim().length >= 65;
    $: charCount = reviewText.trim().length;
    $: charsNeeded = Math.max(0, 65 - charCount);
    
    // Star rating helper
    function setRating(type: 'overall' | 'ethics' | 'creativity' | 'writing', value: number) {
        switch (type) {
            case 'overall':
                overallRating = value;
                break;
            case 'ethics':
                ethicsRating = value;
                break;
            case 'creativity':
                creativityRating = value;
                break;
            case 'writing':
                writingRating = value;
                break;
        }
    }
    
    function handleSubmit() {
        if (!isValid) return;
        
        dispatch('submit', {
            dream_id: dreamId,
            overall_rating: overallRating,
            ethics_rating: ethicsRating,
            creativity_rating: creativityRating,
            writing_rating: writingRating,
            content: reviewText.trim() || ''
        });
        
        // Reset form
        resetForm();
    }
    
    function handleCancel() {
        resetForm();
        dispatch('cancel');
    }
    
    function resetForm() {
        overallRating = 0;
        ethicsRating = null;
        creativityRating = null;
        writingRating = null;
        reviewText = '';
    }
</script>

{#if isExpanded}
    <div class="rating-container" transition:slide>
        <div class="rating-header">
            <h3>Rate this Dream</h3>
            <p class="rating-hint">Only overall rating is required</p>
        </div>
        
        <div class="rating-categories">
            <!-- Overall Rating (Required) -->
            <div class="rating-category">
                <label class="rating-label">
                    Overall Rating <span class="required">*</span>
                </label>
                <div class="star-row">
                    {#each [1, 2, 3, 4, 5] as star}
                        <button
                            class="star-btn"
                            class:active={star <= overallRating}
                            on:click={() => setRating('overall', star)}
                            type="button"
                        >
                            {star <= overallRating ? '★' : '☆'}
                        </button>
                    {/each}
                    {#if overallRating > 0}
                        <span class="rating-value">{overallRating}/5</span>
                    {/if}
                </div>
            </div>
            
            <!-- Ethics Rating (Optional) -->
            <div class="rating-category">
                <label class="rating-label">
                    Ethics Rating
                    <span class="optional-hint">(optional)</span>
                </label>
                <div class="star-row">
                    {#each [1, 2, 3, 4, 5] as star}
                        <button
                            class="star-btn"
                            class:active={ethicsRating !== null && star <= ethicsRating}
                            on:click={() => setRating('ethics', star)}
                            type="button"
                        >
                            {ethicsRating !== null && star <= ethicsRating ? '★' : '☆'}
                        </button>
                    {/each}
                    {#if ethicsRating !== null && ethicsRating > 0}
                        <span class="rating-value">{ethicsRating}/5</span>
                    {/if}
                </div>
            </div>
            
            <!-- Creativity Rating (Optional) -->
            <div class="rating-category">
                <label class="rating-label">
                    Creativity Rating
                    <span class="optional-hint">(optional)</span>
                </label>
                <div class="star-row">
                    {#each [1, 2, 3, 4, 5] as star}
                        <button
                            class="star-btn"
                            class:active={creativityRating !== null && star <= creativityRating}
                            on:click={() => setRating('creativity', star)}
                            type="button"
                        >
                            {creativityRating !== null && star <= creativityRating ? '★' : '☆'}
                        </button>
                    {/each}
                    {#if creativityRating !== null && creativityRating > 0}
                        <span class="rating-value">{creativityRating}/5</span>
                    {/if}
                </div>
            </div>
            
            <!-- Writing Rating (Optional) -->
            <div class="rating-category">
                <label class="rating-label">
                    Writing Rating
                    <span class="optional-hint">(optional)</span>
                </label>
                <div class="star-row">
                    {#each [1, 2, 3, 4, 5] as star}
                        <button
                            class="star-btn"
                            class:active={writingRating !== null && star <= writingRating}
                            on:click={() => setRating('writing', star)}
                            type="button"
                        >
                            {writingRating !== null && star <= writingRating ? '★' : '☆'}
                        </button>
                    {/each}
                    {#if writingRating !== null && writingRating > 0}
                        <span class="rating-value">{writingRating}/5</span>
                    {/if}
                </div>
            </div>
        </div>
        
        <!-- Written Review -->
        <div class="review-section">
            <div class="review-header">
                <label class="rating-label" for="review-text">
                    Written Review <span class="required">*</span>
                </label>
                <div class="char-counter" class:valid={charCount >= 65} class:invalid={charCount > 0 && charCount < 65}>
                    {charCount}/65 characters
                </div>
            </div>
            <textarea
                id="review-text"
                bind:value={reviewText}
                placeholder="Share your thoughts about this dream... (minimum 65 characters required)"
                rows="4"
                class:error={charCount > 0 && charCount < 65}
            ></textarea>
            {#if charsNeeded > 0 && charCount > 0}
                <div class="validation-message">
                    Need {charsNeeded} more character{charsNeeded !== 1 ? 's' : ''}
                </div>
            {/if}
        </div>
        
        <!-- Action Buttons -->
        <div class="rating-actions">
            <button 
                class="rating-submit" 
                on:click={handleSubmit}
                disabled={!isValid}
                type="button"
            >
                Submit Rating
            </button>
            <button 
                class="rating-cancel" 
                on:click={handleCancel}
                type="button"
            >
                Cancel
            </button>
        </div>
    </div>
{/if}

<style>
    .rating-container {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: var(--rad);
        padding: calc(var(--spacing) * 2);
        margin-top: calc(var(--spacing) * 2);
        animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .rating-header {
        margin-bottom: calc(var(--spacing) * 2);
        padding-bottom: var(--spacing);
        border-bottom: 2px solid var(--border-color);
    }
    
    .rating-header h3 {
        margin: 0 0 calc(var(--spacing) / 2) 0;
        font-size: var(--x-larger);
        color: var(--text-primary);
        font-weight: 600;
    }
    
    .rating-hint {
        margin: 0;
        font-size: var(--small);
        color: var(--text-muted);
        font-style: italic;
    }
    
    .rating-categories {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 1.5);
        margin-bottom: calc(var(--spacing) * 2);
    }
    
    .rating-category {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) / 2);
    }
    
    .rating-label {
        font-size: var(--normal);
        color: var(--text-primary);
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) / 2);
    }
    
    .required {
        color: #dc3545;
        font-weight: bold;
    }
    
    .optional-hint {
        font-size: var(--smaller);
        color: var(--text-muted);
        font-weight: normal;
        font-style: italic;
    }
    
    .star-row {
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) / 4);
    }
    
    .star-btn {
        background: none;
        border: none;
        font-size: var(--x-larger);
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.2s ease;
        padding: calc(var(--spacing) / 4);
        border-radius: var(--rad);
        line-height: 1;
    }
    
    .star-btn:hover {
        color: #ffd700;
        transform: scale(1.15);
    }
    
    .star-btn.active {
        color: #ffd700;
    }
    
    .rating-value {
        margin-left: calc(var(--spacing) / 2);
        font-size: var(--normal);
        color: var(--text-secondary);
        font-weight: 500;
    }
    
    .review-section {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) / 2);
        margin-bottom: calc(var(--spacing) * 2);
    }
    
    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing);
    }
    
    .char-counter {
        font-size: var(--smaller);
        color: var(--text-muted);
        font-weight: 500;
        padding: calc(var(--spacing) / 4) calc(var(--spacing) / 2);
        border-radius: var(--rad);
        transition: all 0.2s ease;
    }
    
    .char-counter.valid {
        color: #28a745;
        background: rgba(40, 167, 69, 0.1);
    }
    
    .char-counter.invalid {
        color: #dc3545;
        background: rgba(220, 53, 69, 0.1);
    }
    
    .validation-message {
        font-size: var(--smaller);
        color: #dc3545;
        font-style: italic;
        margin-top: calc(var(--spacing) / 4);
    }
    
    textarea {
        width: 100%;
        padding: var(--spacing);
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--rad);
        font-size: var(--normal);
        color: var(--text-primary);
        font-family: inherit;
        resize: vertical;
        min-height: 100px;
        transition: border-color 0.2s ease;
    }
    
    textarea:focus {
        outline: none;
        border-color: #667eea;
    }
    
    textarea::placeholder {
        color: var(--text-muted);
    }
    
    .rating-actions {
        display: flex;
        gap: var(--spacing);
        padding-top: var(--spacing);
        border-top: 1px solid var(--border-color);
    }
    
    .rating-submit,
    .rating-cancel {
        padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2);
        border: none;
        border-radius: var(--rad);
        font-size: var(--normal);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        flex: 1;
    }
    
    .rating-submit {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
    }
    
    .rating-submit:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }
    
    .rating-submit:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .rating-cancel {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }
    
    .rating-cancel:hover {
        background: var(--bg-primary);
        transform: translateY(-2px);
    }
    
    .rating-submit:active:not(:disabled),
    .rating-cancel:active {
        transform: translateY(0);
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .rating-container {
            padding: var(--spacing);
        }
        
        .rating-actions {
            flex-direction: column;
        }
        
        .star-btn {
            font-size: var(--larger);
        }
    }
</style>
