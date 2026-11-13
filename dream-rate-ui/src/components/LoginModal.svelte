<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { auth, authConfig } from '../lib/auth.js';
    
    export let show = false;
    
    const dispatch = createEventDispatcher();
    
    // Phone auth variables
    let phoneNumber = '';
    let verificationCode = '';
    let showVerificationStep = false;
    let smsConsent = false;
    
    // Email auth variables
    let email = '';
    let password = '';
    let displayName = '';
    let isSignUp = false;
    
    // Common variables
    let loading = false;
    let errorMessage = '';
    
    // Validation
    $: isPhoneValid = phoneNumber.replace(/\D/g, '').length === 10;
    $: isCodeValid = verificationCode.trim().length > 0;
    $: isEmailValid = email.includes('@') && email.includes('.');
    $: isPasswordValid = password.length >= 6 && 
                        /[0-9]/.test(password) && 
                        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    $: isDisplayNameValid = displayName.trim().length >= 2;
    $: canProceedPhone = isPhoneValid && smsConsent;
    $: canProceedEmail = isEmailValid && isPasswordValid && (isSignUp ? isDisplayNameValid : true);
    
    function closeModal() {
        phoneNumber = '';
        verificationCode = '';
        showVerificationStep = false;
        email = '';
        password = '';
        displayName = '';
        isSignUp = false;
        loading = false;
        errorMessage = '';
        smsConsent = false;
        dispatch('close');
    }
    
    async function handleSubmit() {
        if (loading) return;
        
        loading = true;
        errorMessage = '';
        
        try {
            if (authConfig.isPhoneAuth()) {
                if (!showVerificationStep) {
                    // First step: send OTP to phone number
                    if (phoneNumber.trim()) {
                        await auth.signInWithPhone(phoneNumber);
                        showVerificationStep = true;
                    }
                } else {
                    // Second step: verify OTP code
                    if (verificationCode.trim()) {
                        await auth.verifyOtp(phoneNumber, verificationCode);
                        dispatch('submit', { phoneNumber, verificationCode });
                        closeModal();
                    }
                }
            } else {
                // Email authentication
                if (isSignUp) {
                    await auth.signUp(email, password, displayName);
                } else {
                    await auth.signIn(email, password);
                }
                dispatch('submit', { email, password, displayName, isSignUp });
                closeModal();
            }
        } catch (error: any) {
            errorMessage = error.message || 'An error occurred. Please try again.';
        } finally {
            loading = false;
        }
    }
    
    async function handleResendCode() {
        if (loading) return;
        
        loading = true;
        errorMessage = '';
        
        try {
            await auth.signInWithPhone(phoneNumber);
        } catch (error: any) {
            errorMessage = error.message || 'Failed to resend code. Please try again.';
        } finally {
            loading = false;
        }
    }
    
    function handleModalClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }
</script>

{#if show}
    <div class="modal-overlay" 
         on:click={handleModalClick}
         on:keydown={(e) => e.key === 'Escape' && closeModal()}
         role="dialog"
         aria-modal="true"
         tabindex="-1">
        <div class="modal-content">
            <button class="close-btn" on:click={closeModal}>×</button>
            
            <div class="modal-body">
                <h1 class="modal-title">Sign in or sign up</h1>
                
                <!-- Auth method indicator -->
                <div class="auth-indicator">
                    {authConfig.isEmailAuth() ? '📧 Email Authentication' : '📱 Phone Authentication'}
                </div>
                
                <form on:submit|preventDefault={handleSubmit}>
                    {#if authConfig.isPhoneAuth()}
                        <!-- Phone Authentication -->
                        <div class="form-group">
                            <input 
                                id="phone" 
                                type="tel" 
                                bind:value={phoneNumber} 
                                placeholder="Phone number"
                                class="auth-input"
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
                                    class="auth-input"
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
                            
                            <div class="consent-group">
                                <label class="consent-checkbox">
                                    <input 
                                        type="checkbox" 
                                        bind:checked={smsConsent}
                                        class="checkbox-input"
                                    />
                                    <span class="checkbox-custom"></span>
                                    <span class="consent-text">
                                        I consent to receiving SMS messages for verification purposes. 
                                        Standard messaging rates may apply.
                                    </span>
                                </label>
                            </div>
                        {/if}
                        
                        <button 
                            type="submit" 
                            class="login-btn"
                            disabled={loading || (showVerificationStep ? !isCodeValid : !canProceedPhone)}
                        >
                            {#if loading}
                                <span class="loading-spinner"></span>
                                {showVerificationStep ? 'Verifying...' : 'Sending...'}
                            {:else}
                                {showVerificationStep ? 'Submit' : 'Login'}
                            {/if}
                        </button>
                    {:else}
                        <!-- Email Authentication -->
                        <div class="form-group">
                            <input 
                                id="email" 
                                type="email" 
                                bind:value={email} 
                                placeholder="Email address"
                                class="auth-input"
                                required
                            />
                        </div>
                        
                        {#if isSignUp}
                            <div class="form-group">
                                <input 
                                    id="displayName" 
                                    type="text" 
                                    bind:value={displayName} 
                                    placeholder="Display name"
                                    class="auth-input"
                                    required
                                />
                                <div class="input-hint">Minimum 2 characters</div>
                            </div>
                        {/if}
                        
                        <div class="form-group">
                            <input 
                                id="password" 
                                type="password" 
                                bind:value={password} 
                                placeholder="Password"
                                class="auth-input"
                                required
                            />
                            <div class="input-hint">Minimum 6 characters, include a number and special character</div>
                        </div>
                        
                        <div class="auth-toggle">
                            <button 
                                type="button" 
                                class="toggle-link" 
                                on:click={() => isSignUp = !isSignUp}
                            >
                                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                            </button>
                        </div>
                        
                        <button 
                            type="submit" 
                            class="login-btn"
                            disabled={loading || !canProceedEmail}
                        >
                            {#if loading}
                                <span class="loading-spinner"></span>
                                {isSignUp ? 'Creating account...' : 'Signing in...'}
                            {:else}
                                {isSignUp ? 'Sign Up' : 'Sign In'}
                            {/if}
                        </button>
                    {/if}
                    
                    {#if errorMessage}
                        <div class="error-message">
                            {errorMessage}
                        </div>
                    {/if}
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
        margin: 0 0 calc(var(--spacing) * 2) 0;
        text-align: center;
    }
    
    .auth-indicator {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--rad);
        padding: 8px 16px;
        color: var(--text-secondary);
        font-size: var(--smaller);
        margin-bottom: calc(var(--spacing) * 3);
        text-align: center;
        opacity: 0.8;
    }
    
    .form-group {
        width: 100%;
        margin-bottom: calc(var(--spacing) * 2);
    }
    
    .auth-input {
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
    
    .auth-input::placeholder {
        color: var(--text-muted);
    }
    
    .auth-input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .auth-input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .auth-toggle {
        width: 100%;
        margin: calc(var(--spacing) * 2) 0 calc(var(--spacing) * 3) 0;
        text-align: center;
    }
    
    .toggle-link {
        background: none;
        border: none;
        color: #667eea;
        font-size: var(--smaller);
        cursor: pointer;
        text-decoration: underline;
        padding: 0;
        font-family: inherit;
        transition: color 0.2s ease;
    }
    
    .toggle-link:hover {
        color: #5a67d8;
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
    
    .error-message {
        width: 100%;
        padding: 12px 16px;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: var(--rad);
        color: #ef4444;
        font-size: var(--smaller);
        text-align: center;
        margin-bottom: calc(var(--spacing) * 2);
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    .consent-group {
        width: 100%;
        margin: calc(var(--spacing) * 2) 0 calc(var(--spacing) * 3) 0;
    }
    
    .consent-checkbox {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        cursor: pointer;
        line-height: 1.4;
    }
    
    .checkbox-input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
    }
    
    .checkbox-custom {
        width: 20px;
        height: 20px;
        border: 2px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-secondary);
        position: relative;
        flex-shrink: 0;
        transition: all 0.2s ease;
        margin-top: 2px;
    }
    
    .checkbox-input:checked + .checkbox-custom {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
    }
    
    .checkbox-input:checked + .checkbox-custom::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 6px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }
    
    .checkbox-input:focus + .checkbox-custom {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .consent-text {
        color: var(--text-secondary);
        font-size: var(--smaller);
        flex: 1;
    }
    
    .consent-checkbox:hover .checkbox-custom {
        border-color: #667eea;
    }
    
    .input-hint {
        color: var(--text-muted);
        font-size: var(--x-smaller);
        margin-top: var(--item-spacing);
        opacity: 0.8;
        line-height: 1.3;
    }
</style>
