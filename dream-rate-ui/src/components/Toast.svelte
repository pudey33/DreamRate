<script lang="ts">
    import { fly } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    
    export let show = false;
    export let message = '';
    export let type: 'success' | 'error' | 'info' = 'success';
    export let duration = 4000; // Auto-dismiss after 4 seconds
    
    const dispatch = createEventDispatcher();
    
    let timeoutId: ReturnType<typeof setTimeout>;
    
    // Auto-dismiss functionality
    $: if (show) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            handleDismiss();
        }, duration);
    }
    
    function handleDismiss() {
        show = false;
        dispatch('dismiss');
    }
    
    function handleClick() {
        handleDismiss();
    }
    
    // Clean up timeout on component destroy
    import { onDestroy } from 'svelte';
    onDestroy(() => {
        clearTimeout(timeoutId);
    });
</script>

{#if show}
    <div 
        class="toast toast-{type}" 
        transition:fly="{{ y: 100, duration: 300 }}"
        on:click={handleClick}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
        role="button"
        aria-live="polite"
        aria-label="Dismiss notification: {message}"
        tabindex="0"
    >
        <div class="toast-content">
            <div class="toast-icon">
                {#if type === 'success'}
                    ✅
                {:else if type === 'error'}
                    ❌
                {:else}
                    ℹ️
                {/if}
            </div>
            <div class="toast-message">
                {message}
            </div>
            <div class="toast-close" aria-hidden="true">
                ×
            </div>
        </div>
    </div>
{/if}

<style>
    .toast {
        position: fixed;
        bottom: calc(var(--spacing) * 2);
        left: 50%;
        transform: translateX(-50%);
        z-index: 1100;
        min-width: 300px;
        max-width: 500px;
        border-radius: var(--rad);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
    }
    
    .toast:hover {
        transform: translateX(-50%) translateY(-2px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    }
    
    .toast-success {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        border: 1px solid rgba(40, 167, 69, 0.3);
    }
    
    .toast-error {
        background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
        border: 1px solid rgba(220, 53, 69, 0.3);
    }
    
    .toast-info {
        background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);
        border: 1px solid rgba(23, 162, 184, 0.3);
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) * 1.5);
        padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2);
        color: white;
    }
    
    .toast-icon {
        font-size: var(--larger);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .toast-message {
        flex: 1;
        font-size: var(--normal);
        font-weight: 500;
        line-height: 1.4;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    
    .toast-close {
        background: none;
        border: none;
        color: white;
        font-size: var(--larger);
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
        flex-shrink: 0;
        opacity: 0.8;
    }
    
    .toast-close:hover {
        background: rgba(255, 255, 255, 0.2);
        opacity: 1;
        transform: scale(1.1);
    }
    
    .toast-close:focus {
        outline: 2px solid rgba(255, 255, 255, 0.5);
        outline-offset: 2px;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .toast {
            bottom: var(--spacing);
            left: var(--spacing);
            right: var(--spacing);
            transform: none;
            min-width: auto;
            max-width: none;
        }
        
        .toast:hover {
            transform: translateY(-2px);
        }
        
        .toast-content {
            padding: calc(var(--spacing) * 1.25) calc(var(--spacing) * 1.5);
        }
        
        .toast-message {
            font-size: var(--normal);
        }
    }
    
    /* Animation improvements */
    .toast {
        animation: slideInUp 0.3s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(100px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    /* Focus styles for accessibility */
    .toast:focus {
        outline: 2px solid rgba(255, 255, 255, 0.5);
        outline-offset: 2px;
    }
</style>
