<script lang="ts">
<script lang="ts">
    import Tag from '../components/Tag.svelte';
    import DreamCard from '../components/DreamCard.svelte';
    import DreamView from '../components/DreamView.svelte';
    import LoginModal from '../components/LoginModal.svelte';
    import { user, session, auth } from '../lib/auth';
    
    let showProfilePopup = false;
    let showLoginModal = false;
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
        <div class="sb-header">
            <div class="sb-searchbar ">
                <input id="query" type="text" placeholder="" class="text" size="1" />
            </div>
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
