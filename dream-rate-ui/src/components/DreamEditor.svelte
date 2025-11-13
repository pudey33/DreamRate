<script lang="ts">
    import Tag from './Tag.svelte';
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    // Props
    export let mode: 'add' | 'edit' = 'add';
    export let initialTitle = '';
    export let initialContent = '';
    export let initialTags: string[] = [];
    export let isSubmitting = false;
    
    // Form state
    let title = initialTitle;
    let content = initialContent;
    let tags = [...initialTags];
    let newTag = '';
    
    // Tag colors for display
    const tagColors = ['#ff6b6b', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a8e6cf', '#dda0dd', '#98d8c8'];
    
    // Validation
    $: isValid = title.trim().length > 0 && content.trim().length > 0;
    
    function addTag() {
        const trimmedTag = newTag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            tags = [...tags, trimmedTag];
            newTag = '';
        }
    }
    
    function removeTag(tagToRemove: string) {
        tags = tags.filter(tag => tag !== tagToRemove);
    }
    
    function handleTagKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTag();
        }
    }
    
    function handleSubmit() {
        if (!isValid || isSubmitting) return;
        
        const dreamData = {
            title: title.trim(),
            content: content.trim(),
            tags: tags.length > 0 ? tags : undefined
        };
        
        dispatch('submit', dreamData);
    }
    
    function handleCancel() {
        dispatch('cancel');
    }
    
    // Reset form when initialValues change (for edit mode)
    $: {
        title = initialTitle;
        content = initialContent;
        tags = [...initialTags];
    }
</script>

<form class="dream-editor" on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
        <label for="dream-title" class="form-label">Dream Title</label>
        <input
            id="dream-title"
            type="text"
            bind:value={title}
            placeholder="Enter a memorable title for your dream..."
            class="form-input"
            disabled={isSubmitting}
        />
    </div>
    
    <div class="form-group">
        <label for="dream-content" class="form-label">Dream Description</label>
        <textarea
            id="dream-content"
            bind:value={content}
            placeholder="Describe your dream in detail..."
            class="form-textarea"
            rows="6"
            disabled={isSubmitting}
        ></textarea>
    </div>
    
    <div class="form-group">
        <label for="dream-tags" class="form-label">Tags (optional)</label>
        <div class="tag-input-container">
            <input
                id="dream-tags"
                type="text"
                bind:value={newTag}
                placeholder="Add tags to categorize your dream..."
                class="form-input"
                disabled={isSubmitting}
                on:keypress={handleTagKeyPress}
            />
            <button
                type="button"
                class="add-tag-btn"
                on:click={addTag}
                disabled={!newTag.trim() || isSubmitting}
            >
                Add Tag
            </button>
        </div>
        
        {#if tags.length > 0}
            <div class="tags-display">
                {#each tags as tag, index}
                    <div class="tag-item">
                        <Tag 
                            color={tagColors[index % tagColors.length]} 
                            text={tag} 
                        />
                        <button
                            type="button"
                            class="remove-tag-btn"
                            on:click={() => removeTag(tag)}
                            disabled={isSubmitting}
                            aria-label="Remove tag"
                        >
                            ×
                        </button>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    
    <div class="form-actions">
        <button
            type="button"
            class="btn btn-secondary"
            on:click={handleCancel}
            disabled={isSubmitting}
        >
            Cancel
        </button>
        <button
            type="submit"
            class="btn btn-primary"
            disabled={!isValid || isSubmitting}
        >
            {#if isSubmitting}
                {mode === 'add' ? 'Creating...' : 'Updating...'}
            {:else}
                {mode === 'add' ? 'Create Dream' : 'Update Dream'}
            {/if}
        </button>
    </div>
</form>

<style>
    .dream-editor {
        max-width: 600px;
        margin: 0 auto;
    }
    
    .form-group {
        margin-bottom: calc(var(--spacing) * 2);
    }
    
    .form-label {
        display: block;
        font-size: var(--larger);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: calc(var(--spacing) / 2);
    }
    
    .form-input,
    .form-textarea {
        width: 100%;
        padding: var(--spacing);
        border: 2px solid var(--border-color);
        border-radius: var(--rad);
        font-size: var(--normal);
        color: var(--text-primary);
        background: var(--bg-secondary);
        transition: border-color 0.2s ease;
    }
    
    .form-input:focus,
    .form-textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .form-input:disabled,
    .form-textarea:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .form-textarea {
        resize: vertical;
        min-height: 120px;
        font-family: inherit;
        line-height: 1.5;
    }
    
    .tag-input-container {
        display: flex;
        gap: var(--spacing);
        margin-bottom: var(--spacing);
    }
    
    .add-tag-btn {
        padding: var(--spacing) calc(var(--spacing) * 1.5);
        background: #28a745;
        color: white;
        border: none;
        border-radius: var(--rad);
        font-size: var(--normal);
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;
    }
    
    .add-tag-btn:hover:not(:disabled) {
        background: #218838;
        transform: translateY(-1px);
    }
    
    .add-tag-btn:disabled {
        background: var(--text-muted);
        cursor: not-allowed;
        transform: none;
    }
    
    .tags-display {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing);
    }
    
    .tag-item {
        position: relative;
        display: inline-flex;
        align-items: center;
    }
    
    .remove-tag-btn {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 20px;
        height: 20px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .remove-tag-btn:hover:not(:disabled) {
        background: #c82333;
        transform: scale(1.1);
    }
    
    .remove-tag-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
    
    .form-actions {
        display: flex;
        gap: var(--spacing);
        justify-content: flex-end;
        padding-top: calc(var(--spacing) * 1.5);
        border-top: 1px solid var(--border-color);
    }
    
    .btn {
        padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2);
        border: none;
        border-radius: var(--rad);
        font-size: var(--normal);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 120px;
    }
    
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .btn-secondary {
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }
    
    .btn-secondary:hover:not(:disabled) {
        background: var(--bg-primary);
        transform: translateY(-1px);
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
    }
    
    .btn-primary:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    @media (max-width: 768px) {
        .tag-input-container {
            flex-direction: column;
        }
        
        .form-actions {
            flex-direction: column-reverse;
        }
        
        .btn {
            width: 100%;
        }
    }
</style>
