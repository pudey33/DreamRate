<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { submitDream } from '../lib/supabase/mutations';
    import { user } from '../lib/auth';
    
    export let show = false;
    
    const dispatch = createEventDispatcher();
    
    let title = '';
    let content = '';
    let tagInput = '';
    let tags: string[] = [];
    let loading = false;
    let error = '';
    
    function addTag() {
        const trimmedTag = tagInput.trim().toLowerCase();
        if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
            tags = [...tags, trimmedTag];
            tagInput = '';
        }
    }
    
    function removeTag(index: number) {
        tags = tags.filter((_, i) => i !== index);
    }
    
    function handleTagKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTag();
        }
        // Prevent spaces, commas, and periods
        if (event.key === ' ' || event.key === ',' || event.key === '.') {
            event.preventDefault();
        }
    }
    
    function handleTagInput(event: Event) {
        const target = event.target as HTMLInputElement;
        // Remove any spaces, commas, or periods that might have been pasted
        target.value = target.value.replace(/[ ,.]/g, '');
        tagInput = target.value;
    }
    
    async function handleSubmit() {
        if (!title.trim() || !content.trim()) {
            error = 'Please fill in both title and dream content';
            return;
        }
        
        if (!$user) {
            error = 'You must be logged in to share a dream';
            return;
        }
        
        loading = true;
        error = '';
        
        try {
            await submitDream(title.trim(), content.trim(), $user.id, tags.length > 0 ? tags : undefined);
            
            // Reset form
            title = '';
            content = '';
            tags = [];
            tagInput = '';
            
            // Close modal and notify parent
            show = false;
            dispatch('success');
        } catch (err: any) {
            console.error('Error submitting dream:', err);
            
            // Handle specific server validation errors
            if (err?.message) {
                const errorMessage = err.message.toLowerCase();
                
                if (errorMessage.includes('check_story_length') || errorMessage.includes('story_length')) {
                    error = 'Your dream content is too short. Please add more details to share your dream experience (minimum 50 characters required).';
                } else if (errorMessage.includes('too short') || errorMessage.includes('minimum length') || errorMessage.includes('content_length')) {
                    error = 'Your dream content is too short. Please add more details to share your dream experience.';
                } else if (errorMessage.includes('title') && (errorMessage.includes('too short') || errorMessage.includes('required'))) {
                    error = 'Dream title is required and must be at least a few characters long.';
                } else if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
                    error = 'A dream with this title already exists. Please choose a different title.';
                } else if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
                    error = 'You\'re sharing dreams too quickly. Please wait a moment before sharing another dream.';
                } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
                    error = 'You don\'t have permission to share dreams. Please try logging in again.';
                } else if (errorMessage.includes('check constraint') || errorMessage.includes('violates')) {
                    error = 'Your dream doesn\'t meet the required format. Please check that your title and content are properly filled out.';
                } else {
                    // Generic error message for other server errors
                    error = `Failed to submit dream: ${err.message}`;
                }
            } else {
                // Fallback for unknown errors
                error = 'Failed to submit dream. Please check your connection and try again.';
            }
        } finally {
            loading = false;
        }
    }
    
    function handleClose() {
        if (!loading) {
            show = false;
            dispatch('close');
        }
    }
    
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && !loading) {
            handleClose();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
    <div class="modal-overlay" on:click={handleClose} on:keydown={handleKeydown} role="dialog" aria-modal="true" tabindex="-1">
        <div class="modal-content" on:click|stopPropagation role="document">
            <div class="modal-header">
                <h2>Share Your Dream</h2>
                <button class="close-btn" on:click={handleClose} disabled={loading}>×</button>
            </div>
            
            <form on:submit|preventDefault={handleSubmit}>
                <div class="form-group">
                    <label for="dream-title">Dream Title *</label>
                    <input
                        id="dream-title"
                        type="text"
                        bind:value={title}
                        placeholder="Give your dream a memorable title..."
                        maxlength="100"
                        disabled={loading}
                        required
                    />
                </div>
                
                <div class="form-group">
                    <label for="dream-content">Dream Content *</label>
                    <textarea
                        id="dream-content"
                        bind:value={content}
                        placeholder="Describe your dream in detail..."
                        rows="6"
                        maxlength="2000"
                        disabled={loading}
                        required
                    ></textarea>
                    <div class="char-count">{content.length}/2000</div>
                </div>
                
                <div class="form-group">
                    <label for="dream-tags">Tags (optional)</label>
                    <div class="tag-input-container">
                        <input
                            id="dream-tags"
                            type="text"
                            bind:value={tagInput}
                            on:keydown={handleTagKeydown}
                            on:input={handleTagInput}
                            placeholder="Add a tag and press Enter..."
                            maxlength="20"
                            disabled={loading || tags.length >= 5}
                        />
                        <button
                            type="button"
                            class="add-tag-btn"
                            on:click={addTag}
                            disabled={loading || !tagInput.trim() || tags.length >= 5}
                        >
                            Add
                        </button>
                    </div>
                    
                    {#if tags.length > 0}
                        <div class="tags-display">
                            {#each tags as tag, index}
                                <span class="tag">
                                    {tag}
                                    <button
                                        type="button"
                                        class="remove-tag"
                                        on:click={() => removeTag(index)}
                                        disabled={loading}
                                    >×</button>
                                </span>
                            {/each}
                        </div>
                    {/if}
                    
                    <div class="tag-hint">Maximum 5 tags, 20 characters each (no spaces, commas, or periods)</div>
                </div>
                
                {#if error}
                    <div class="error-message">{error}</div>
                {/if}
                
                <div class="modal-actions">
                    <button
                        type="button"
                        class="cancel-btn"
                        on:click={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="submit-btn"
                        disabled={loading || !title.trim() || !content.trim()}
                    >
                        {#if loading}
                            <span class="loading-spinner"></span>
                            Sharing...
                        {:else}
                            Share Dream
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: var(--spacing);
    }
    
    .modal-content {
        background: var(--bg-primary);
        border-radius: var(--rad);
        border: 1px solid var(--border-color);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: calc(var(--spacing) * 2);
        border-bottom: 1px solid var(--border-color);
    }
    
    .modal-header h2 {
        margin: 0;
        font-size: var(--x-larger);
        font-weight: 600;
        color: var(--text-primary);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: var(--x-larger);
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .close-btn:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }
    
    .close-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    form {
        padding: calc(var(--spacing) * 2);
    }
    
    .form-group {
        margin-bottom: calc(var(--spacing) * 2);
    }
    
    label {
        display: block;
        margin-bottom: calc(var(--spacing) * 0.5);
        font-weight: 500;
        color: var(--text-primary);
        font-size: var(--normal);
    }
    
    input, textarea {
        width: 100%;
        padding: calc(var(--spacing) * 1.5);
        border: 1px solid var(--border-color);
        border-radius: var(--rad);
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: var(--normal);
        font-family: inherit;
        transition: border-color 0.2s ease;
        box-sizing: border-box;
    }
    
    input:focus, textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }
    
    input:disabled, textarea:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    textarea {
        resize: vertical;
        min-height: 120px;
    }
    
    .char-count {
        text-align: right;
        font-size: var(--small);
        color: var(--text-secondary);
        margin-top: calc(var(--spacing) * 0.5);
    }
    
    .tag-input-container {
        display: flex;
        gap: calc(var(--spacing) * 0.5);
    }
    
    .tag-input-container input {
        flex: 1;
    }
    
    .add-tag-btn {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        padding: calc(var(--spacing) * 1.5);
        border-radius: var(--rad);
        cursor: pointer;
        font-size: var(--normal);
        transition: all 0.2s ease;
        white-space: nowrap;
    }
    
    .add-tag-btn:hover:not(:disabled) {
        background: var(--text-secondary);
        color: var(--bg-primary);
    }
    
    .add-tag-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .tags-display {
        display: flex;
        flex-wrap: wrap;
        gap: calc(var(--spacing) * 0.5);
        margin-top: var(--spacing);
    }
    
    .tag {
        display: inline-flex;
        align-items: center;
        gap: calc(var(--spacing) * 0.5);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: calc(var(--spacing) * 0.5) calc(var(--spacing) * 1);
        border-radius: calc(var(--rad) * 0.5);
        font-size: var(--small);
        font-weight: 500;
    }
    
    .remove-tag {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: var(--small);
        transition: background 0.2s ease;
    }
    
    .remove-tag:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .remove-tag:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .tag-hint {
        font-size: var(--small);
        color: var(--text-secondary);
        margin-top: calc(var(--spacing) * 0.5);
    }
    
    .error-message {
        background: #fee;
        border: 1px solid #fcc;
        color: #c33;
        padding: calc(var(--spacing) * 1.5);
        border-radius: var(--rad);
        margin-bottom: calc(var(--spacing) * 2);
        font-size: var(--normal);
    }
    
    .modal-actions {
        display: flex;
        gap: var(--spacing);
        justify-content: flex-end;
        margin-top: calc(var(--spacing) * 2);
        padding-top: calc(var(--spacing) * 2);
        border-top: 1px solid var(--border-color);
    }
    
    .cancel-btn {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2);
        border-radius: var(--rad);
        cursor: pointer;
        font-size: var(--normal);
        font-weight: 500;
        transition: all 0.2s ease;
    }
    
    .cancel-btn:hover:not(:disabled) {
        background: var(--text-secondary);
        color: var(--bg-primary);
    }
    
    .cancel-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .submit-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2);
        border-radius: var(--rad);
        cursor: pointer;
        font-size: var(--normal);
        font-weight: 600;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) * 0.5);
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
    }
    
    .submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
    }
    
    .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .modal-overlay {
            padding: calc(var(--spacing) * 0.5);
        }
        
        .modal-content {
            max-height: 95vh;
        }
        
        .modal-header {
            padding: calc(var(--spacing) * 1.5);
        }
        
        form {
            padding: calc(var(--spacing) * 1.5);
        }
        
        .modal-actions {
            flex-direction: column-reverse;
        }
        
        .cancel-btn, .submit-btn {
            width: 100%;
            justify-content: center;
        }
    }
</style>
