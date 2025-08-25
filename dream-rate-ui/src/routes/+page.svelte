<script>
    import Tag from '../components/Tag.svelte';
    import DreamCard from '../components/DreamCard.svelte';
    import LoginModal from '../components/LoginModal.svelte';
    
    let showProfilePopup = false;
    let showLoginModal = false;
    
    function toggleProfilePopup() {
        showProfilePopup = !showProfilePopup;
    }
    
    function handleSettings() {
        console.log('Settings clicked');
        showProfilePopup = false;
    }
    
    function handleLogout() {
        console.log('Logout clicked');
        showProfilePopup = false;
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
                <DreamCard title="The Haunted Castle" date="Dec 15, 2024" rating="4" tags={[ { color: "#ff6b6b" ,
                    text: "Scary" }, { color: "#45b7d1" , text: "Adventure" } ]}
                    text="I was exploring an ancient castle with hidden passages. Every door I opened led to a new mysterious room filled with glowing artifacts. The atmosphere was eerie but exciting as I discovered secret treasures." />

                <DreamCard title="Flying Through Rainbow Bridges" date="Dec 12, 2024" rating="5" tags={[ {
                    color: "#96ceb4" , text: "Flying" }, { color: "#feca57" , text: "Lucid" }, { color: "#ff9ff3" ,
                    text: "Beautiful" } ]}
                    text="I realized I was dreaming and took control! I soared above a breathtaking landscape of floating islands connected by rainbow bridges. The feeling of freedom was incredible as I danced through the clouds." />

                <DreamCard title="The Endless Maze" date="Dec 10, 2024" rating="2" tags={[ { color: "#ff6b6b" ,
                    text: "Nightmare" }, { color: "#666666" , text: "Chase" } ]}
                    text="I was being chased through endless dark corridors by something I couldn't see. Every time I thought I found an exit, it led to another maze. My heart was pounding even after I woke up." />
            </div>
        </div>
        <div class="sb-footer">
            <div class="sb-profile-container" on:click={toggleProfilePopup}>
                <div class="sb-profile-icon">
                    <div class="sb-placeholder-circle"></div>
                </div>
                <div class="sb-profile-name">
                    Username
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
            <button class="login-btn" on:click={() => showLoginModal = true}>
                Login
            </button>
        </div>
    </div>
</div>

<LoginModal 
    show={showLoginModal} 
    on:close={() => showLoginModal = false}
    on:submit={(event) => console.log('Login submitted:', event.detail.phoneNumber)}
/>
