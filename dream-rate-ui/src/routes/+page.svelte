<script lang="ts">
    import Tag from '../components/Tag.svelte';
    import DreamCard from '../components/DreamCard.svelte';
    import DreamView from '../components/DreamView.svelte';
    import LoginModal from '../components/LoginModal.svelte';
    import DreamEntryModal from '../components/DreamEntryModal.svelte';
    import { user, session, auth } from '../lib/auth';
    
    let showProfilePopup = false;
    let showLoginModal = false;
    let showDreamEntryModal = false;
    let selectedDream: any = null;
    let currentDreamIndex = -1; // Track which dream is currently selected
    
    // Sample dreams data
    const dreams = [
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
        selectedDream = event.detail;
        // Find the index of the selected dream
        currentDreamIndex = dreams.findIndex(dream => 
            dream.title === event.detail.title && dream.date === event.detail.date
        );
    }
    
    function goToNextDream() {
        if (currentDreamIndex < dreams.length - 1) {
            currentDreamIndex++;
            selectedDream = dreams[currentDreamIndex];
        }
    }
    
    function goToPreviousDream() {
        if (currentDreamIndex > 0) {
            currentDreamIndex--;
            selectedDream = dreams[currentDreamIndex];
        }
    }
    
    function updateDreamRating(newRating: number) {
        if (currentDreamIndex >= 0 && currentDreamIndex < dreams.length) {
            dreams[currentDreamIndex].rating = newRating;
            selectedDream = { ...dreams[currentDreamIndex] }; // Trigger reactivity
        }
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
                {#each dreams as dream}
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
            <div class="sb-profile-container" on:click={toggleProfilePopup}>
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
            {:else}
                <div class="user-info">
                    Welcome back, {$user.user_metadata?.display_name || 'User'}!
                </div>
            {/if}
        </div>
        <div class="content-main">
            <DreamView 
                dream={selectedDream} 
                canGoNext={currentDreamIndex < dreams.length - 1}
                canGoPrevious={currentDreamIndex > 0}
                currentIndex={currentDreamIndex + 1}
                totalCount={dreams.length}
                on:next={goToNextDream}
                on:previous={goToPreviousDream}
                on:rateChange={(event) => updateDreamRating(event.detail)}
            />
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
        width: 100%;
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
    }
    
    .share-dream-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .btn-icon {
        font-size: var(--larger);
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
