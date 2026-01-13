// ==================== ACCOUNT DASHBOARD SCRIPTS ====================

// Initialize Feather Icons
document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
});

// Account Navigation
const navItems = document.querySelectorAll('.account-nav-item');
const contentSections = document.querySelectorAll('.account-content');

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        if (this.classList.contains('logout')) {
            return; // Let logout link work normally
        }
        
        e.preventDefault();
        const sectionId = this.dataset.section;
        
        // Remove active from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active to clicked item
        this.classList.add('active');
        
        // Hide all content sections
        contentSections.forEach(section => section.classList.remove('active'));
        
        // Show target section
        document.getElementById(sectionId).classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Re-initialize icons
        feather.replace();
    });
});

// View All Links (quick navigation)
const viewAllLinks = document.querySelectorAll('.view-all-link');
viewAllLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.dataset.section;
        
        // Trigger navigation
        const navItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (navItem) {
            navItem.click();
        }
    });
});

// Profile Form Submission
const profileForm = document.querySelector('.profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const saveBtn = this.querySelector('.btn-save-profile');
        const originalText = saveBtn.textContent;
        
        saveBtn.innerHTML = '<i data-feather="loader"></i> SAVING...';
        saveBtn.disabled = true;
        feather.replace();
        
        // Simulate save (in Magento, this will be an AJAX call)
        setTimeout(() => {
            alert('Profile updated successfully!');
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }, 1500);
    });
}

// Gift Card Purchase Form
const giftcardForm = document.querySelector('.giftcard-purchase-form');
if (giftcardForm) {
    giftcardForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const selectedAmount = this.querySelector('input[name="amount"]:checked').value;
        const purchaseBtn = this.querySelector('.btn-purchase-giftcard');
        
        purchaseBtn.innerHTML = '<i data-feather="loader"></i> PROCESSING...';
        purchaseBtn.disabled = true;
        feather.replace();
        
        // Simulate purchase (in Magento, this will be an AJAX call)
        setTimeout(() => {
            alert(`Gift card for $${selectedAmount} purchased successfully!`);
            purchaseBtn.innerHTML = '<i data-feather="shopping-bag"></i> PURCHASE GIFT CARD';
            purchaseBtn.disabled = false;
            feather.replace();
        }, 1500);
    });
}

// Address Actions
const addressBtns = document.querySelectorAll('.btn-address-action, .btn-add-address');
addressBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.classList.contains('btn-add-address')) {
            alert('Add new address modal will open here (Magento integration)');
        } else {
            const action = this.textContent.trim().toLowerCase();
            alert(`${action.charAt(0).toUpperCase() + action.slice(1)} address modal will open here`);
        }
    });
});

// Payment Methods Actions
const paymentBtns = document.querySelectorAll('.btn-payment-action, .btn-add-payment');
paymentBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.classList.contains('btn-add-payment')) {
            alert('Add new payment method modal will open here (Magento integration)');
        } else {
            const action = this.textContent.trim().toLowerCase();
            alert(`${action.charAt(0).toUpperCase() + action.slice(1)} payment method modal will open here`);
        }
    });
});

// Gift Card Actions
const giftcardActionBtns = document.querySelectorAll('.btn-giftcard-action');
giftcardActionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const action = this.textContent.trim();
        alert(`${action} functionality will be integrated with Magento`);
    });
});

// Wishlist Remove
const wishlistRemoveBtns = document.querySelectorAll('.wishlist-remove');
wishlistRemoveBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (confirm('Remove this item from your wishlist?')) {
            const item = this.closest('.wishlist-item');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => item.remove(), 300);
        }
    });
});

// Add to Cart from Wishlist
const addFromWishlistBtns = document.querySelectorAll('.btn-add-from-wishlist');
addFromWishlistBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        this.innerHTML = '<i data-feather="loader"></i> ADDING...';
        this.disabled = true;
        feather.replace();
        
        setTimeout(() => {
            alert('Item added to cart!');
            this.innerHTML = '<i data-feather="check"></i> ADDED';
            feather.replace();
            
            setTimeout(() => {
                this.innerHTML = '<i data-feather="shopping-bag"></i> ADD TO CART';
                this.disabled = false;
                feather.replace();
            }, 1500);
        }, 800);
    });
});

console.log('Account dashboard loaded - All features ready!');

