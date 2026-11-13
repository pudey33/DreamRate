<script lang="ts">
    import { goto } from '$app/navigation';
    import { searchDreams } from '../lib/supabase/queries';
    import { user } from '../lib/auth';
    
    let searchQuery = '';
    let searchResults: any[] = [];
    let isSearching = false;
    let showDropdown = false;
    let searchTimeout: any;
    
    // Perform search with debouncing
    async function performSearch(query: string) {
        if (!$user || query.length < 5) {
            searchResults = [];
            showDropdown = false;
            return;
        }
        
        isSearching = true;
        showDropdown = true;
        
        try {
            const results = await searchDreams($user.id, query);
            
            // Transform results
            searchResults = results.map((item: any) => {
                const averageRating = item.reviews?.length > 0
                    ? item.reviews.reduce((sum: number, r: any) => sum + r.overall_rating, 0) / item.reviews.length
                    : 0;
                
                const snippet = item.content?.substring(0, 100) || '';
                
                return {
                    id: item.id,
                    title: item.title,
                    snippet: snippet,
                    rating: averageRating.toFixed(1),
                    reviewCount: item.reviews?.length || 0,
                    date: new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })
                };
            });
        } catch (error) {
            console.error('Search error:', error);
            searchResults = [];
        } finally {
            isSearching = false;
        }
    }
    
    // Handle input with debouncing
    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        searchQuery = target.value;
        
        // Clear existing timeout
        clearTimeout(searchTimeout);
        
        // Set new timeout for debouncing
        searchTimeout = setTimeout(() => {
            performSearch(searchQuery);
        }, 300);
    }
    
    // Handle result selection
    function selectResult(dreamId: number) {
        goto(`/dream/${dreamId}`);
        searchQuery = '';
        searchResults = [];
        showDropdown = false;
    }
    
    // Clear search
    function clearSearch() {
        searchQuery = '';
        searchResults = [];
        showDropdown = false;
    }
    
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dream-search-container')) {
            showDropdown = false;
        }
    }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="dream-search-container">
    <div class="search-icon">🔍</div>
    <input
        type="text"
        bind:value={searchQuery}
        on:input={handleInput}
        on:focus={() => { if (searchResults.length > 0) showDropdown = true; }}
        placeholder="Search dreams... (type at least 5 characters)"
        class="search-input"
    />
    {#if searchQuery}
        <button class="clear-btn" on:click={clearSearch} aria-label="Clear search">
            ✕
        </button>
    {/if}
    
    {#if showDropdown}
        <div class="search-dropdown">
            {#if isSearching}
                <div class="dropdown-message">
                    <div class="loading-spinner"></div>
                    Searching dreams...
                </div>
            {:else if searchResults.length === 0}
                <div class="dropdown-message">
                    No dreams found matching your search
                </div>
            {:else}
                {#each searchResults as result}
                    <button class="search-result-item" on:click={() => selectResult(result.id)}>
                        <div class="result-header">
                            <div class="result-title">{result.title}</div>
                            <div class="result-meta">
                                {#if result.reviewCount > 0}
                                    <span class="result-rating">⭐ {result.rating}</span>
                                    <span class="result-reviews">({result.reviewCount} reviews)</span>
                                {:else}
                                    <span class="result-no-reviews">No reviews yet</span>
                                {/if}
                            </div>
                        </div>
                        <div class="result-snippet">{result.snippet}{result.snippet.length >= 100 ? '...' : ''}</div>
                        <div class="result-date">{result.date}</div>
                    </button>
                {/each}
            {/if}
        </div>
    {/if}
</div>

<style>
    .dream-search-container {
        position: relative;
        width: 100%;
        max-width: 700px;
        margin: 0 auto calc(var(--spacing) * 2) auto;
    }
    
    .search-icon {
        position: absolute;
        left: calc(var(--spacing) * 1.5);
        top: 50%;
        transform: translateY(-50%);
        font-size: var(--larger);
        opacity: 0.6;
        pointer-events: none;
        z-index: 1;
    }
    
    .search-input {
        width: 100%;
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: var(--rad);
        padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 5) calc(var(--spacing) * 1.5) calc(var(--spacing) * 5);
        font-size: var(--normal);
        color: var(--text-primary);
        font-family: inherit;
        transition: all 0.2s ease;
        min-height: 50px;
    }
    
    .search-input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        outline: none;
    }
    
    .search-input::placeholder {
        color: var(--text-secondary);
        opacity: 0.6;
    }
    
    .clear-btn {
        position: absolute;
        right: calc(var(--spacing) * 1.5);
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        color: var(--text-secondary);
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
        z-index: 2;
    }
    
    .clear-btn:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--text-primary);
    }
    
    .search-dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: var(--bg-secondary);
        border: 2px solid #667eea;
        border-radius: var(--rad);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        max-height: 400px;
        overflow-y: auto;
        z-index: 10;
    }
    
    .dropdown-message {
        padding: calc(var(--spacing) * 2);
        text-align: center;
        color: var(--text-secondary);
        font-style: italic;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing);
    }
    
    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 3px solid var(--border-color);
        border-top: 3px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .search-result-item {
        width: 100%;
        padding: calc(var(--spacing) * 1.5);
        cursor: pointer;
        background: transparent;
        border: none;
        border-bottom: 1px solid var(--border-color);
        text-align: left;
        font-family: inherit;
        transition: background 0.2s ease;
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .search-result-item:hover {
        background: rgba(102, 126, 234, 0.1);
    }
    
    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: calc(var(--spacing) * 0.5);
        gap: var(--spacing);
    }
    
    .result-title {
        font-size: var(--larger);
        font-weight: 600;
        color: var(--text-primary);
        flex: 1;
        text-align: left;
    }
    
    .result-meta {
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) * 0.5);
        font-size: var(--small);
        white-space: nowrap;
    }
    
    .result-rating {
        color: #667eea;
        font-weight: 600;
    }
    
    .result-reviews {
        color: var(--text-secondary);
    }
    
    .result-no-reviews {
        color: var(--text-secondary);
        font-style: italic;
    }
    
    .result-snippet {
        font-size: var(--small);
        color: var(--text-secondary);
        line-height: 1.5;
        margin-bottom: calc(var(--spacing) * 0.5);
        text-align: left;
    }
    
    .result-date {
        font-size: var(--small);
        color: var(--text-secondary);
        opacity: 0.8;
        text-align: left;
    }
    
    @media (max-width: 768px) {
        .dream-search-container {
            max-width: 100%;
        }
        
        .result-header {
            flex-direction: column;
            gap: calc(var(--spacing) * 0.5);
        }
        
        .result-meta {
            font-size: var(--smaller);
        }
    }
</style>
