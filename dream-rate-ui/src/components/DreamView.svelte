<script lang="ts">
    import Tag from './Tag.svelte';
    
    interface DreamData {
        title: string;
        date: string;
        rating: number;
        tags: Array<{ color: string; text: string }>;
        text: string;
    }
    
    export let dream: DreamData | null = null;
    
    // Function to format date nicely
    function formatDate(dateString: string): string {
        if (!dateString) return '';
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
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push('★');
        }
        
        if (hasHalfStar) {
            stars.push('☆');
        }
        
        while (stars.length < 5) {
            stars.push('☆');
        }
        
        return stars.join('');
    }
</script>

{#if dream}
    <div class="dream-view">
        <div class="dream-header">
            <h1 class="dream-title">{dream.title}</h1>
            <div class="dream-meta">
                <div class="dream-date">
                    {formatDate(dream.date)}
                </div>
                <div class="dream-rating">
                    <span class="stars">{getStarRating(dream.rating)}</span>
                    <span class="rating-text">{dream.rating}/5</span>
                </div>
            </div>
        </div>
        
        <div class="dream-tags">
            {#each dream.tags as tag}
                <Tag color={tag.color} text={tag.text} />
            {/each}
        </div>
        
        <div class="dream-content">
            <h3>Dream Description</h3>
            <p class="dream-text">{dream.text}</p>
        </div>
        
        <div class="dream-actions">
            <button class="action-btn primary">Edit Dream</button>
            <button class="action-btn secondary">Share</button>
            <button class="action-btn danger">Delete</button>
        </div>
    </div>
{:else}
    <div class="no-dream-selected">
        <div class="placeholder-content">
            <div class="placeholder-icon">💭</div>
            <h2>Select a Dream</h2>
            <p>Click on a dream card from the sidebar to view its full details here.</p>
        </div>
    </div>
{/if}

<style>
    .dream-view {
        padding: calc(var(--spacing) * 3);
        max-width: 800px;
        margin: 0 auto;
        height: 100%;
        overflow-y: auto;
    }
    
    .dream-header {
        margin-bottom: calc(var(--spacing) * 2);
        border-bottom: 2px solid var(--border-color);
        padding-bottom: var(--spacing);
    }
    
    .dream-title {
        font-size: var(--xx-larger);
        font-weight: bold;
        color: var(--text-primary);
        margin: 0 0 var(--spacing) 0;
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
        font-size: var(--larger);
        color: var(--text-secondary);
        font-weight: 500;
    }
    
    .dream-rating {
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) / 2);
    }
    
    .stars {
        font-size: var(--x-larger);
        color: #ffd700;
        letter-spacing: 2px;
    }
    
    .rating-text {
        font-size: var(--larger);
        font-weight: bold;
        color: var(--text-primary);
    }
    
    .dream-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing);
        margin-bottom: calc(var(--spacing) * 2);
    }
    
    .dream-content {
        margin-bottom: calc(var(--spacing) * 3);
    }
    
    .dream-content h3 {
        font-size: var(--x-larger);
        color: var(--text-primary);
        margin: 0 0 var(--spacing) 0;
        font-weight: 600;
    }
    
    .dream-text {
        font-size: var(--larger);
        line-height: 1.6;
        color: var(--text-secondary);
        margin: 0;
        white-space: pre-wrap;
    }
    
    .dream-actions {
        display: flex;
        gap: var(--spacing);
        flex-wrap: wrap;
        padding-top: calc(var(--spacing) * 2);
        border-top: 1px solid var(--border-color);
    }
    
    .action-btn {
        padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2);
        border: none;
        border-radius: var(--rad);
        font-size: var(--normal);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 100px;
    }
    
    .action-btn.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
    }
    
    .action-btn.primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .action-btn.secondary {
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }
    
    .action-btn.secondary:hover {
        background: var(--bg-secondary);
        transform: translateY(-1px);
    }
    
    .action-btn.danger {
        background: #dc3545;
        color: white;
    }
    
    .action-btn.danger:hover {
        background: #c82333;
        transform: translateY(-1px);
    }
    
    .action-btn:active {
        transform: translateY(0);
    }
    
    .no-dream-selected {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: calc(var(--spacing) * 3);
    }
    
    .placeholder-content {
        text-align: center;
        max-width: 400px;
    }
    
    .placeholder-icon {
        font-size: 4rem;
        margin-bottom: var(--spacing);
        opacity: 0.6;
    }
    
    .placeholder-content h2 {
        font-size: var(--x-larger);
        color: var(--text-primary);
        margin: 0 0 var(--spacing) 0;
    }
    
    .placeholder-content p {
        font-size: var(--larger);
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.5;
    }
    
    @media (max-width: 768px) {
        .dream-view {
            padding: var(--spacing);
        }
        
        .dream-meta {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .dream-actions {
            flex-direction: column;
        }
        
        .action-btn {
            width: 100%;
        }
    }
</style>
