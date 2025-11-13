<script lang="ts">
    import DreamEditor from './DreamEditor.svelte';
    import { createEventDispatcher } from 'svelte';
    import { submitDream } from '../lib/supabase/mutations';
    import { user } from '../lib/auth';
    
    const dispatch = createEventDispatcher();
    
    export let show = false;
    
    let isSubmitting = false;
    let error: string | null = null;
    
    async function handleSubmit(event: CustomEvent) {
        const { title, content, tags } = event.detail;
        
        if (!$user) {
            error = 'You must be logged in to create a dream';
            return;
        }
        
        isSubmitting = true;
        error = null;
        
        try {
            await submitDream(title, content, $user.id, tags);
            dispatch('dreamCreated');
            show = false;
            resetForm();
        } catch (err) {
            console.error('Error creating dream:', err);
            error = 'Failed to create dream. Please try again.';
        } finally {
            isSubmitting = false;
        }
    }
    
    function handleCancel() {
        if (!isSubmitting) {
            resetForm();
            dispatch('close');
        }
    }
    
    function resetForm() {
        error = null;
        isSubmitting = false;
    }
    
    function handleModalClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            handleCancel();
        }
    }
    
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && !isSubmitting) {
            handleCancel();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
    <!-- Modal backdrop -->
    <div 
        class="modal-backdrop" 
        on:click={handleModalClick}
        on:keydown={handleKeydown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
    >
        <div class="modal-container">
            <div class="modal-header">
                <h2 id="modal-title" class="modal-title">Share Your Dream</h2>
                <button 
                    class="modal-close"
                    on:click={handleCancel}
                    disabled={isSubmitting}
                    aria-label="Close modal"
                >
                    ×
                </button>
            </div>
            
            <div class="modal-body">
                {#if error}
                    <div class="error-message">
                        <div class="error-icon">⚠️</div>
                        <span>{error}</span>
                    </div>
                {/if}
                
                <DreamEditor
                    mode="add"
                    {isSubmitting}
                    on:submit={handleSubmit}
                    on:cancel={handleCancel}
                />
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        padding: var(--spacing);
        backdrop-filter: blur(2px);
        overflow-y: auto;
    }
    
    .modal-container {
        background: var(--bg-primary);
        border-radius: var(--rad);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--border-color);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: calc(var(--spacing) * 1.5);
        border-bottom: 1px solid var(--border-color);
        background: var(--bg-secondary);
    }
    
    .modal-title {
        font-size: var(--x-larger);
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: var(--xx-larger);
        color: var(--text-secondary);
        cursor: pointer;
        padding: calc(var(--spacing) / 4);
        border-radius: var(--rad);
        transition: all 0.2s ease;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-close:hover:not(:disabled) {
        background: var(--bg-tertiary);
        color: var(--text-primary);
        transform: scale(1.1);
    }
    
    .modal-close:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
    
    .modal-body {
        padding: calc(var(--spacing) * 2);
        overflow-y: auto;
        flex: 1;
    }
    
    .error-message {
        display: flex;
        align-items: center;
        gap: var(--spacing);
        background: #f8d7da;
        color: #721c24;
        padding: var(--spacing);
        border-radius: var(--rad);
        border: 1px solid #f5c6cb;
        margin-bottom: calc(var(--spacing) * 2);
    }
    
    .error-icon {
        font-size: var(--larger);
        flex-shrink: 0;
    }
    
    @media (max-width: 768px) {
        .modal-backdrop {
            padding: calc(var(--spacing) / 2);
        }
        
        .modal-container {
            max-height: 95vh;
        }
        
        .modal-header {
            padding: var(--spacing);
        }
        
        .modal-body {
            padding: var(--spacing);
        }
        
        .modal-title {
            font-size: var(--larger);
        }
    }
</style>
