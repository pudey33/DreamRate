<script>
    import { createEventDispatcher } from 'svelte';
    
    export let show = false;
    
    const dispatch = createEventDispatcher();
    
    let phoneNumber = '';
    let verificationCode = '';
    let showVerificationStep = false;
    
    $: isPhoneValid = phoneNumber.replace(/\D/g, '').length === 10;
    $: isCodeValid = verificationCode.trim().length > 0;
    
    function closeModal() {
        phoneNumber = '';
        verificationCode = '';
        showVerificationStep = false;
        dispatch('close');
    }
    
    function handleSubmit() {
        if (!showVerificationStep) {
            // First step: phone number
            if (phoneNumber.trim()) {
                console.log('Phone number submitted:', phoneNumber);
                showVerificationStep = true;
            }
        } else {
            // Second step: verification code
            if (verificationCode.trim()) {
                console.log('Verification code submitted:', verificationCode);
                dispatch('submit', { phoneNumber, verificationCode });
                closeModal();
            }
        }
    }
    
    function handleResendCode() {
        console.log('Resend code clicked');
        // Placeholder function for resending verification code
    }
    
    function handleModalClick(event) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }
</script>

{#if show}
    <div class="modal-overlay" on:click={handleModalClick}>
        <div class="modal-content">
            <button class="close-btn" on:click={closeModal}>×</button>
            
            <div class="modal-body">
                <h1 class="modal-title">Sign in or sign up</h1>
                
                <form on:submit|preventDefault={handleSubmit}>
                    <div class="form-group">
                        <input 
                            id="phone" 
                            type="tel" 
                            bind:value={phoneNumber} 
                            placeholder="Phone number"
                            class="phone-input"
                            required
                            disabled={showVerificationStep}
                        />
                    </div>
                    
                    {#if showVerificationStep}
                        <div class="form-group">
                            <label for="verification" class="field-label">Verification Code</label>
                            <input 
                                id="verification" 
                                type="text" 
                                bind:value={verificationCode} 
                                placeholder="000000"
                                class="phone-input"
                                required
                            />
                        </div>
                        
                        <p class="resend-text">
                            Didn't receive your code? 
                            <button type="button" class="resend-link" on:click={handleResendCode}>
                                Resend it
                            </button>
                        </p>
                    {:else}
                        <p class="verification-text">We'll send a verification code to this number</p>
                    {/if}
                    
                    <button 
                        type="submit" 
                        class="login-btn"
                        disabled={showVerificationStep ? !isCodeValid : !isPhoneValid}
                    >
                        {showVerificationStep ? 'Submit' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal-content {
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        display: flex;
        flex-direction: column;
        position: relative;
    }
    
    .close-btn {
        position: absolute;
        top: calc(var(--spacing) * 2);
        right: calc(var(--spacing) * 2);
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: calc(var(--x-larger) * 1.2);
        cursor: pointer;
        padding: 8px;
        border-radius: var(--rad);
        transition: all 0.2s ease;
        line-height: 1;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }
    
    .close-btn:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }
    
    .modal-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: calc(var(--spacing) * 4);
        max-width: 400px;
        margin: 0 auto;
        width: 100%;
    }
    
    .modal-title {
        font-size: var(--xx-larger);
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 calc(var(--spacing) * 4) 0;
        text-align: center;
    }
    
    .form-group {
        width: 100%;
        margin-bottom: calc(var(--spacing) * 2);
    }
    
    .phone-input {
        width: 100%;
        padding: 16px 20px;
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: var(--rad);
        color: var(--text-primary);
        font-size: var(--larger);
        outline: none;
        transition: border-color 0.2s ease;
    }
    
    .phone-input::placeholder {
        color: var(--text-muted);
    }
    
    .phone-input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .phone-input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .field-label {
        display: block;
        color: var(--text-primary);
        font-size: var(--normal);
        font-weight: 500;
        margin-bottom: var(--item-spacing);
    }
    
    .verification-text {
        color: var(--text-muted);
        font-size: var(--smaller);
        text-align: center;
        margin: calc(var(--spacing) * 2) 0 calc(var(--spacing) * 4) 0;
        line-height: 1.5;
        opacity: 0.7;
    }
    
    .resend-text {
        color: var(--text-muted);
        font-size: var(--smaller);
        text-align: center;
        margin: calc(var(--spacing) * 2) 0 calc(var(--spacing) * 4) 0;
        line-height: 1.5;
        opacity: 0.7;
    }
    
    .resend-link {
        background: none;
        border: none;
        color: #667eea;
        font-size: var(--normal);
        cursor: pointer;
        text-decoration: underline;
        padding: 0;
        font-family: inherit;
        transition: color 0.2s ease;
    }
    
    .resend-link:hover {
        color: #5a67d8;
    }
    
    .login-btn {
        width: 100%;
        padding: 16px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: var(--rad);
        font-size: var(--larger);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    }
    
    .login-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    }
    
    .login-btn:active {
        transform: translateY(0);
    }
    
    .login-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    }
</style>
