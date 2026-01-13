// ==================== AUTH PAGE SCRIPTS ====================

// Initialize Feather Icons
document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
});

// Password Visibility Toggle
const passwordToggles = document.querySelectorAll('.password-toggle');
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const targetId = this.dataset.target;
        const passwordInput = document.getElementById(targetId);
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.setAttribute('data-feather', 'eye-off');
        } else {
            passwordInput.type = 'password';
            icon.setAttribute('data-feather', 'eye');
        }
        
        feather.replace();
    });
});

// Password Strength Checker
const registerPassword = document.getElementById('registerPassword');
if (registerPassword) {
    registerPassword.addEventListener('input', function() {
        const password = this.value;
        const strengthBar = document.querySelector('.strength-bar-fill');
        const strengthText = document.querySelector('.strength-text span');
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        // Update UI
        strengthBar.className = 'strength-bar-fill';
        
        if (strength <= 2) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#e74c3c';
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#f39c12';
        } else {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#2ecc71';
        }
    });
}

// Login Form Submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        // Show loading state
        const submitBtn = this.querySelector('.btn-auth-submit');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i data-feather="loader"></i> SIGNING IN...';
        submitBtn.disabled = true;
        feather.replace();
        
        // Simulate login (in Magento, this will be an AJAX call)
        setTimeout(() => {
            console.log('Login:', { email, password });
            // Redirect to account page
            window.location.href = 'account.html';
        }, 1500);
    });
}

// Register Form Submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate password match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Validate password strength
        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('.btn-auth-submit');
        submitBtn.innerHTML = '<i data-feather="loader"></i> CREATING ACCOUNT...';
        submitBtn.disabled = true;
        feather.replace();
        
        // Simulate registration (in Magento, this will be an AJAX call)
        setTimeout(() => {
            console.log('Registration successful');
            // Redirect to account page
            window.location.href = 'account.html';
        }, 1500);
    });
}

// Social Login Buttons (Demo)
const socialButtons = document.querySelectorAll('.social-btn');
socialButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const platform = this.classList.contains('social-btn-google') ? 'Google' : 
                        this.classList.contains('social-btn-facebook') ? 'Facebook' : 'Apple';
        
        console.log(`Social login with ${platform}`);
        
        // In Magento, this will redirect to OAuth provider
        // For now, just show a message
        this.innerHTML = '<i data-feather="loader"></i> Connecting...';
        this.disabled = true;
        feather.replace();
        
        setTimeout(() => {
            alert(`${platform} login will be integrated with OAuth in Magento`);
            window.location.reload();
        }, 1500);
    });
});

console.log('Auth page loaded - Login and registration ready!');

