<script lang="ts">
    import Tag from '../components/Tag.svelte';
    import DreamCard from '../components/DreamCard.svelte';
    import DreamView from '../components/DreamView.svelte';
    import LoginModal from '../components/LoginModal.svelte';
    import DreamEntryModal from '../components/DreamEntryModal.svelte';
    import { user, session, auth } from '../lib/auth';
    import { getRandomDreams } from '../lib/supabase/queries';
    import type { Dream } from '../lib/supabase/types';
    import { onMount } from 'svelte';
    
    let showProfilePopup = false;
    let showLoginModal = false;
    let showDreamEntryModal = false;
    let selectedDream: any = null;
    let currentDreamIndex = -1; // Track which dream is currently selected
    
    // Supabase dreams data
    let supabaseDreams: Dream[] = [];
    let transformedDreams: any[] = [];
    let loading = false;
    let error: string | null = null;
    
    // Sample dreams data for sidebar
    const sidebarDreams = [
        {
            title: "The Haunted Castle",
            date: "Dec 15, 2024",
            rating: 4,
            tags: [
                { color: "#ff6b6b", text: "Scary" },
                { color: "#45b7d1", text: "Adventure" }
            ],
            text: "I was exploring an ancient castle with hidden passages. Every door I opened led to a new mysterious room filled with glowing artifacts. The atmosphere was eerie but exciting as I discovered secret treasures."
        },
        {
            title: "Flying Through Rainbow Bridges",
            date: "Dec 12, 2024",
            rating: 5,
            tags: [
                { color: "#96ceb4", text: "Flying" },
                { color: "#feca57", text: "Lucid" },
                { color: "#ff9ff3", text: "Beautiful" }
            ],
            text: "I realized I was dreaming and took control! I soared above a breathtaking landscape of floating islands connected by rainbow bridges. The feeling of freedom was incredible as I danced through the clouds."
        },
        {
            title: "The Endless Maze",
            date: "Dec 10, 2024",
            rating: 2,
            tags: [
                { color: "#ff6b6b", text: "Nightmare" },
                { color: "#666666", text: "Chase" }
            ],
            text: "I was being chased through endless dark corridors by something I couldn't see. Every time I thought I found an exit, it led to another maze. My heart was pounding even after I woke up."
        }
    ];
    
    function toggleProfilePopup() {
        showProfilePopup = !showProfilePopup;
    }
    
    function handleSettings() {
        console.log('Settings clicked');
        showProfilePopup = false;
    }
    
    async function handleLogout() {
        try {
            await auth.signOut();
            showProfilePopup = false;
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    function handleLoginSuccess(event: any) {
        console.log('Login successful:', event.detail);
        // Modal will close automatically, user state will update via auth store
    }
    
    function handleDreamEntrySuccess() {
        console.log('Dream submitted successfully');
        // Refresh the dreams feed to potentially show the new dream
        fetchRandomDreams();
    }
    
    // Transform Supabase Dream to DreamView format
    function transformDream(dream: Dream): any {
        // Generate default colors for tags
        const tagColors = ['#ff6b6b', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a8e6cf', '#dda0dd', '#98d8c8'];
        
        // Parse tags from JSONB or use empty array
        let tags: Array<{ color: string; text: string }> = [];
        if (dream.tags && Array.isArray(dream.tags)) {
            tags = dream.tags.map((tag: string, index: number) => ({
                color: tagColors[index % tagColors.length],
                text: tag
            }));
        }
        
        // Format date
        const formattedDate = new Date(dream.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return {
            id: dream.id,
            title: dream.title,
            date: formattedDate,
            rating: 0, // Placeholder since dreams are unreviewed
            tags: tags,
            text: dream.content || 'No content available' // Use 'content' field from database
        };
    }
    
    // Fetch random dreams from Supabase
    async function fetchRandomDreams() {
        if (!$user) return;
        
        loading = true;
        error = null;
        
        try {
            const dreams = await getRandomDreams($user.id, 10);
            if (dreams) {
                supabaseDreams = dreams;
                transformedDreams = dreams.map(transformDream);
            }
        } catch (err) {
            console.error('Error fetching dreams:', err);
            error = 'Failed to load dreams. Please try again.';
        } finally {
            loading = false;
        }
    }
    
    // Load dreams when user changes
    $: if ($user) {
        fetchRandomDreams();
    }
    
    // Sidebar dream selection (removed functionality as requested)
    function handleDreamSelect(event: any) {
        // Functionality removed as requested
        console.log('Sidebar dream selection disabled');
    }
    
    function goToNextDream() {
        // This will be handled by individual DreamView components
    }
    
    function goToPreviousDream() {
        // This will be handled by individual DreamView components
    }
    
    function updateDreamRating(newRating: number) {
        // This will be handled by individual DreamView components
    }
</script>

<div class="page-container">
    <div class="sidebar">
        {#if $user}
            <div class="sb-welcome">
                <div class="welcome-message">
                    Welcome back, {$user.user_metadata?.display_name || 'User'}!
                </div>
            </div>
        {/if}
        <div class="sb-header">
            {#if $user}
                <button class="share-dream-btn" on:click={() => showDreamEntryModal = true}>
                    <span class="btn-icon">✨</span>
                    Share Your Dream
                </button>
            {:else}
                <div class="sb-searchbar">
                    <input id="query" type="text" placeholder="Login to share dreams" class="text" size="1" disabled />
                </div>
            {/if}
        </div>
        <div class="sb-list">
            <div class="dream-card">
                {#each sidebarDreams as dream}
                    <DreamCard 
                        title={dream.title} 
                        date={dream.date} 
                        rating={dream.rating} 
                        tags={dream.tags}
                        text={dream.text}
                        on:select={handleDreamSelect}
                    />
                {/each}
            </div>
        </div>
        <div class="sb-footer">
            <div class="sb-profile-container" 
                 on:click={toggleProfilePopup}
                 on:keydown={(e) => e.key === 'Enter' && toggleProfilePopup()}
                 role="button"
                 tabindex="0">
                <div class="sb-profile-icon">
                    <div class="sb-placeholder-circle"></div>
                </div>
                <div class="sb-profile-name">
                    {$user ? ($user.phone || $user.email || 'User') : 'Username'}
                </div>
            </div>
            
            {#if showProfilePopup}
                <div class="profile-popup">
                    <button class="popup-item" on:click={handleSettings}>
                        <span>Settings</span>
                    </button>
                    <button class="popup-item" on:click={handleLogout}>
                        <span>Logout</span>
                    </button>
                </div>
            {/if}
        </div>
    </div>
    <div class="content">
        <div class="content-header">
            {#if !$user}
                <button class="login-btn" on:click={() => showLoginModal = true}>
                    Login
                </button>
            {/if}
        </div>
        <div class="content-main">
            {#if !$user}
                <div class="login-prompt">
                    <div class="prompt-content">
                        <div class="prompt-icon">🌙</div>
                        <h2>Welcome to DreamRate</h2>
                        <p>Login to discover amazing dreams from our community!</p>
                        <button class="prompt-login-btn" on:click={() => showLoginModal = true}>
                            Get Started
                        </button>
                    </div>
                </div>
            {:else if loading}
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading dreams...</p>
                </div>
            {:else if error}
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button class="retry-btn" on:click={fetchRandomDreams}>
                        Try Again
                    </button>
                </div>
            {:else if transformedDreams.length === 0}
                <div class="empty-state">
                    <div class="empty-icon">💭</div>
                    <h3>No dreams found</h3>
                    <p>Be the first to share a dream with the community!</p>
                </div>
            {:else}
                <div class="dreams-feed">
                    <div class="feed-header">
                        <h2>Dream Rater</h2>
                        <p>The dankest dreams. The dankest community.</p>
                    </div>
                    <div class="dreams-list">
                        {#each transformedDreams as dream, index}
                            <div class="dream-item">
                                <DreamView 
                                    dream={dream}
                                />
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<LoginModal 
    show={showLoginModal} 
    on:close={() => showLoginModal = false}
    on:submit={handleLoginSuccess}
/>

<DreamEntryModal 
    show={showDreamEntryModal} 
    on:close={() => showDreamEntryModal = false}
    on:success={handleDreamEntrySuccess}
/>

<style>
    /* Sidebar welcome message styles */
    .sb-welcome {
        padding: calc(var(--spacing) * 1.5);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: var(--rad);
        margin: var(--spacing);
        margin-bottom: calc(var(--spacing) * 1.5);
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
    }
    
    .welcome-message {
        color: white;
        font-size: var(--normal);
        font-weight: 600;
        text-align: center;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    /* Share dream button styles */
    .share-dream-btn {
        width: calc(100% - calc(var(--spacing) * 2));
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: calc(var(--spacing) * 1.5);
        border-radius: var(--rad);
        font-size: var(--normal);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: calc(var(--spacing) * 0.5);
        margin: var(--spacing);
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
        text-align: center;
    }
    
    .share-dream-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .btn-icon {
        font-size: var(--normal);
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
    
    .sb-searchbar input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: var(--bg-secondary);
        color: var(--text-secondary);
    }

    /* Login prompt styles */
    .login-prompt {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: calc(var(--spacing) * 3);
    }
    
    .prompt-content {
        text-align: center;
        max-width: 400px;
        background: var(--bg-secondary);
        padding: calc(var(--spacing) * 3);
        border-radius: var(--rad);
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .prompt-icon {
        font-size: 4rem;
        margin-bottom: var(--spacing);
        opacity: 0.8;
    }
    
    .prompt-content h2 {
        font-size: var(--x-larger);
        color: var(--text-primary);
        margin: 0 0 var(--spacing) 0;
        font-weight: 600;
    }
    
    .prompt-content p {
        font-size: var(--larger);
        color: var(--text-secondary);
        margin: 0 0 calc(var(--spacing) * 2) 0;
        line-height: 1.5;
    }
    
    .prompt-login-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 3);
        border-radius: var(--rad);
        font-size: var(--larger);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
    }
    
    .prompt-login-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    /* Loading state styles */
    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: calc(var(--spacing) * 3);
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
    
    .loading-state p {
        font-size: var(--larger);
        color: var(--text-secondary);
        margin: 0;
    }
    
    /* Error state styles */
    .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: calc(var(--spacing) * 3);
        text-align: center;
    }
    
    .error-icon {
        font-size: 3rem;
        margin-bottom: var(--spacing);
        opacity: 0.8;
    }
    
    .error-state h3 {
        font-size: var(--x-larger);
        color: var(--text-primary);
        margin: 0 0 var(--spacing) 0;
        font-weight: 600;
    }
    
    .error-state p {
        font-size: var(--larger);
        color: var(--text-secondary);
        margin: 0 0 calc(var(--spacing) * 2) 0;
        line-height: 1.5;
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
    }
    
    .retry-btn:hover {
        background: #c82333;
        transform: translateY(-1px);
    }
    
    /* Empty state styles */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: calc(var(--spacing) * 3);
        text-align: center;
    }
    
    .empty-icon {
        font-size: 4rem;
        margin-bottom: var(--spacing);
        opacity: 0.6;
    }
    
    .empty-state h3 {
        font-size: var(--x-larger);
        color: var(--text-primary);
        margin: 0 0 var(--spacing) 0;
        font-weight: 600;
    }
    
    .empty-state p {
        font-size: var(--larger);
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.5;
    }
    
    /* Dreams feed styles */
    .dreams-feed {
        height: 100%;
        overflow-y: auto;
        padding: calc(var(--spacing) * 2);
    }
    
    .feed-header {
        text-align: center;
        margin-bottom: calc(var(--spacing) * 3);
        padding-bottom: calc(var(--spacing) * 2);
        border-bottom: 2px solid var(--border-color);
    }
    
    .feed-header h2 {
        font-size: var(--xx-larger);
        color: var(--text-primary);
        margin: 0 0 var(--spacing) 0;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .feed-header p {
        font-size: var(--larger);
        color: var(--text-secondary);
        margin: 0;
        font-weight: 500;
    }
    
    .dreams-list {
        display: flex;
        flex-direction: column;
        gap: calc(var(--spacing) * 3);
    }
    
    .dream-item {
        background: var(--bg-secondary);
        border-radius: var(--rad);
        border: 1px solid var(--border-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
        overflow: hidden;
    }
    
    .dream-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        border-color: var(--text-secondary);
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .dreams-feed {
            padding: var(--spacing);
        }
        
        .feed-header {
            margin-bottom: calc(var(--spacing) * 2);
        }
        
        .dreams-list {
            gap: calc(var(--spacing) * 2);
        }
        
        .prompt-content {
            padding: calc(var(--spacing) * 2);
        }
    }
</style>
