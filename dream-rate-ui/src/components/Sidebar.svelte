<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import DreamCard from './DreamCard.svelte';
    import { getUserDreams } from '../lib/supabase/queries';
    import type { Dream } from '../lib/supabase/types';
    import type { User } from '@supabase/supabase-js';
    
    export let user: User | null = null;
    
    const dispatch = createEventDispatcher();
    
    // State for profile popup
    let showProfilePopup = false;
    
    // User dreams state
    let userDreams: Dream[] = [];
    let transformedUserDreams: any[] = [];
    let loadingUserDreams = false;
    let userDreamsError: string | null = null;
    
    // Transform Supabase Dream to DreamCard format
    function transformDreamForCard(dream: Dream): any {
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
            text: dream.content || 'No content available',
            created_by: dream.created_by
        };
    }
    
    // Fetch user's dreams
    async function fetchUserDreams() {
        if (!user) return;
        
        loadingUserDreams = true;
        userDreamsError = null;
        
        try {
            const dreams = await getUserDreams(user.id);
            userDreams = dreams;
            transformedUserDreams = dreams.map(transformDreamForCard);
        } catch (err) {
            console.error('Error fetching user dreams:', err);
            userDreamsError = 'Failed to load your dreams.';
        } finally {
            loadingUserDreams = false;
        }
    }
    
    // Load user dreams when user changes
    $: if (user) {
        fetchUserDreams();
    }
    
    // Event handlers
    function toggleProfilePopup() {
        showProfilePopup = !showProfilePopup;
    }
    
    function handleSettings() {
        console.log('Settings clicked');
        showProfilePopup = false;
        dispatch('settings');
    }
    
    function handleLogout() {
        showProfilePopup = false;
        dispatch('logout');
    }
    
    function handleShowDreamEntry() {
        dispatch('showDreamEntry');
    }
    
    function handleDreamSelect(event: any) {
        dispatch('dreamSelect', event.detail);
    }
    
    // Public method to refresh user dreams (called after creating new dream)
    export function refreshUserDreams() {
        fetchUserDreams();
    }
</script>

<div class="sidebar">
    {#if user}
        <div class="sb-welcome">
            <div class="welcome-message">
                Welcome back, {user.user_metadata?.display_name || 'User'}!
            </div>
        </div>
    {/if}
    
    <div class="sb-header">
        {#if user}
            <button class="share-dream-btn" on:click={handleShowDreamEntry}>
                <span class="btn-icon">✨</span>
                Write Your Dream
            </button>
        {:else}
            <div class="sb-searchbar">
                <input id="query" type="text" placeholder="Login to share dreams" class="text" size="1" disabled />
            </div>
        {/if}
    </div>
    
    <div class="sb-list">
        {#if user}
            <div class="section-header">
                <h3>Your Dreams</h3>
            </div>
            
            {#if loadingUserDreams}
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading your dreams...</p>
                </div>
            {:else if userDreamsError}
                <div class="error-state">
                    <p>{userDreamsError}</p>
                    <button class="retry-btn" on:click={fetchUserDreams}>
                        Try Again
                    </button>
                </div>
            {:else if transformedUserDreams.length === 0}
                <div class="empty-state">
                    <div class="empty-icon">💭</div>
                    <p>You haven't created any dreams yet.</p>
                    <p class="empty-hint">Click "Share Your Dream" to get started!</p>
                </div>
            {:else}
                <div class="dream-cards">
                    {#each transformedUserDreams as dream}
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
            {/if}
        {:else}
            <div class="login-required">
                <p>Login to see your dreams</p>
            </div>
        {/if}
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
                {user ? (user.phone || user.email || 'User') : 'Username'}
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

<style>
    .sidebar {
        width: 400px;
        background: var(--bg-primary);
        border-right: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
    }
    
    /* Welcome message styles */
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
    
    .sb-searchbar {
        margin: var(--spacing);
    }
    
    .sb-searchbar input {
        width: 100%;
        padding: calc(var(--spacing) * 1.5);
        border: 1px solid var(--border-color);
        border-radius: var(--rad);
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: var(--normal);
        box-sizing: border-box;
    }
    
    .sb-searchbar input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: var(--bg-secondary);
        color: var(--text-secondary);
    }
    
    /* Section header */
    .section-header {
        padding: var(--spacing);
        border-bottom: 1px solid var(--border-color);
        margin-bottom: var(--spacing);
    }
    
    .section-header h3 {
        margin: 0;
        font-size: var(--larger);
        font-weight: 600;
        color: var(--text-primary);
    }
    
    /* List area */
    .sb-list {
        flex: 1;
        overflow-y: auto;
        padding-bottom: var(--spacing);
    }
    
    .dream-cards {
        padding: 0 var(--spacing);
        display: flex;
        flex-direction: column;
        gap: var(--spacing);
    }
    
    /* Loading state */
    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: calc(var(--spacing) * 2);
        text-align: center;
    }
    
    .loading-spinner {
        width: 24px;
        height: 24px;
        border: 2px solid var(--border-color);
        border-top: 2px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: var(--spacing);
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loading-state p {
        font-size: var(--normal);
        color: var(--text-secondary);
        margin: 0;
    }
    
    /* Error state */
    .error-state {
        padding: calc(var(--spacing) * 2);
        text-align: center;
    }
    
    .error-state p {
        font-size: var(--normal);
        color: var(--text-secondary);
        margin: 0 0 var(--spacing) 0;
    }
    
    .retry-btn {
        background: #dc3545;
        color: white;
        border: none;
        padding: calc(var(--spacing) * 0.75) var(--spacing);
        border-radius: var(--rad);
        font-size: var(--small);
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .retry-btn:hover {
        background: #c82333;
    }
    
    /* Empty state */
    .empty-state {
        padding: calc(var(--spacing) * 2);
        text-align: center;
    }
    
    .empty-icon {
        font-size: 2rem;
        margin-bottom: var(--spacing);
        opacity: 0.6;
    }
    
    .empty-state p {
        font-size: var(--normal);
        color: var(--text-secondary);
        margin: 0 0 calc(var(--spacing) * 0.5) 0;
        line-height: 1.4;
    }
    
    .empty-hint {
        font-size: var(--small);
        color: var(--text-muted);
        font-style: italic;
    }
    
    /* Login required */
    .login-required {
        padding: calc(var(--spacing) * 2);
        text-align: center;
    }
    
    .login-required p {
        font-size: var(--normal);
        color: var(--text-secondary);
        margin: 0;
    }
    
    /* Footer */
    .sb-footer {
        border-top: 1px solid var(--border-color);
        padding: var(--spacing);
        position: relative;
    }
    
    .sb-profile-container {
        display: flex;
        align-items: center;
        gap: var(--spacing);
        padding: calc(var(--spacing) * 0.75);
        border-radius: var(--rad);
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .sb-profile-container:hover {
        background: var(--bg-secondary);
    }
    
    .sb-profile-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .sb-placeholder-circle {
        width: 28px;
        height: 28px;
        background: var(--text-secondary);
        border-radius: 50%;
    }
    
    .sb-profile-name {
        flex: 1;
        font-size: var(--normal);
        font-weight: 500;
        color: var(--text-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .profile-popup {
        position: absolute;
        bottom: 100%;
        left: var(--spacing);
        right: var(--spacing);
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--rad);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 100;
        margin-bottom: calc(var(--spacing) * 0.5);
    }
    
    .popup-item {
        width: 100%;
        background: none;
        border: none;
        padding: calc(var(--spacing) * 1.5);
        text-align: left;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-size: var(--normal);
        color: var(--text-primary);
    }
    
    .popup-item:hover {
        background: var(--bg-secondary);
    }
    
    .popup-item:first-child {
        border-radius: var(--rad) var(--rad) 0 0;
    }
    
    .popup-item:last-child {
        border-radius: 0 0 var(--rad) var(--rad);
    }
    
    .popup-item + .popup-item {
        border-top: 1px solid var(--border-color);
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .sidebar {
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1px solid var(--border-color);
        }
        
        .sb-list {
            max-height: 300px;
        }
    }
</style>
