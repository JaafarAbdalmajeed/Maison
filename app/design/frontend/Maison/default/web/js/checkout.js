// ==================== CHECKOUT WIZARD ====================

// Initialize Feather Icons
document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
});

// Current step tracking
let currentStep = 1;

// Get all step elements
const progressSteps = document.querySelectorAll('.progress-step');
const progressLines = document.querySelectorAll('.progress-line');
const stepContents = document.querySelectorAll('.checkout-step-content');

// Next Step Buttons
const nextButtons = document.querySelectorAll('.btn-next-step');
nextButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const nextStep = parseInt(this.dataset.next);
        goToStep(nextStep);
    });
});

// Previous Step Buttons
const prevButtons = document.querySelectorAll('.btn-prev-step');
prevButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const prevStep = parseInt(this.dataset.prev);
        goToStep(prevStep);
    });
});

// Edit Buttons in Review Step
const editButtons = document.querySelectorAll('.review-edit-btn');
editButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const editStep = parseInt(this.dataset.edit);
        goToStep(editStep);
    });
});

// Go to specific step
function goToStep(stepNumber) {
    // Validate current step before moving forward
    if (stepNumber > currentStep && !validateCurrentStep()) {
        return;
    }

    // Hide all step contents
    stepContents.forEach(content => content.classList.remove('active'));
    
    // Show target step content
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Update progress indicator
    updateProgressIndicator(stepNumber);
    
    // Update current step
    currentStep = stepNumber;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Re-initialize icons
    feather.replace();
}

// Update progress indicator
function updateProgressIndicator(targetStep) {
    progressSteps.forEach((step, index) => {
        const stepNum = index + 1;
        
        if (stepNum < targetStep) {
            // Completed steps
            step.classList.add('completed');
            step.classList.remove('active');
            if (progressLines[index]) {
                progressLines[index].classList.add('completed');
            }
        } else if (stepNum === targetStep) {
            // Active step
            step.classList.add('active');
            step.classList.remove('completed');
            if (progressLines[index - 1]) {
                progressLines[index - 1].classList.add('completed');
            }
        } else {
            // Future steps
            step.classList.remove('active', 'completed');
            if (progressLines[index - 1]) {
                progressLines[index - 1].classList.remove('completed');
            }
        }
    });
    
    // Re-initialize icons
    feather.replace();
}

// Validate current step
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            // Cart step - check if cart has items
            return true;
        case 2:
            // Shipping step - validate form
            return validateShippingForm();
        case 3:
            // Payment step - validate payment method
            return validatePaymentForm();
        default:
            return true;
    }
}

// Validate shipping form
function validateShippingForm() {
    const form = document.querySelector('#step2 .checkout-form');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields.');
    }
    
    return isValid;
}

// Validate payment form
function validatePaymentForm() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    
    if (!selectedPayment) {
        alert('Please select a payment method.');
        return false;
    }
    
    // If card is selected, validate card form
    if (selectedPayment.value === 'card') {
        const cardForm = document.getElementById('cardForm');
        const inputs = cardForm.querySelectorAll('input');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '#ddd';
            }
        });
        
        if (!isValid) {
            alert('Please fill in all card details.');
        }
        
        return isValid;
    }
    
    return true;
}

// ==================== CART QUANTITY CONTROLS ====================

const qtyButtons = document.querySelectorAll('.qty-btn-mini');
qtyButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const action = this.dataset.action;
        const qtyInput = this.parentElement.querySelector('.qty-input-mini');
        let currentQty = parseInt(qtyInput.value);
        
        if (action === 'increase') {
            currentQty++;
        } else if (action === 'decrease' && currentQty > 1) {
            currentQty--;
        }
        
        qtyInput.value = currentQty;
        updateCartTotals();
    });
});

// Update cart totals (placeholder - will be integrated with backend)
function updateCartTotals() {
    console.log('Cart totals updated');
    // In Magento, this will trigger an AJAX call to recalculate totals
}

// ==================== REMOVE CART ITEM ====================

const removeButtons = document.querySelectorAll('.cart-item-remove-btn');
removeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        if (confirm('Remove this item from your cart?')) {
            const cartItem = this.closest('.cart-item-card');
            cartItem.style.opacity = '0';
            cartItem.style.transform = 'translateX(20px)';
            setTimeout(() => {
                cartItem.remove();
                updateCartTotals();
            }, 300);
        }
    });
});

// ==================== PAYMENT METHOD SELECTION ====================

const paymentOptions = document.querySelectorAll('.payment-option input[type="radio"]');
paymentOptions.forEach(radio => {
    radio.addEventListener('change', function() {
        // Remove active class from all options
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to selected option
        this.closest('.payment-option').classList.add('active');
        
        // Show/hide card form
        const cardForm = document.getElementById('cardForm');
        if (this.value === 'card') {
            cardForm.classList.add('active');
        } else {
            cardForm.classList.remove('active');
        }
    });
});

// ==================== PROMO CODE TOGGLE ====================

const promoToggle = document.getElementById('promoToggle');
const promoFormWrapper = document.getElementById('promoFormWrapper');

if (promoToggle && promoFormWrapper) {
    promoToggle.addEventListener('click', function() {
        promoFormWrapper.classList.toggle('active');
        feather.replace();
    });
}

// Promo form submission
const promoForm = document.querySelector('.promo-form-checkout');
if (promoForm) {
    promoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const promoInput = this.querySelector('.promo-input-checkout');
        const code = promoInput.value.trim();
        
        if (code) {
            // In Magento, this will validate and apply the promo code via AJAX
            console.log('Applying promo code:', code);
            alert('Promo code applied successfully!');
            // Update totals
            updateCartTotals();
        }
    });
}

// ==================== PLACE ORDER ====================

const placeOrderBtnFinal = document.getElementById('placeOrderBtn');
if (placeOrderBtnFinal) {
    placeOrderBtnFinal.addEventListener('click', function() {
        const termsCheckbox = document.getElementById('termsPayment');
        
        if (!termsCheckbox || !termsCheckbox.checked) {
            alert('Please accept the Terms & Conditions to continue.');
            return;
        }
        
        // Validate payment method
        if (!validatePaymentForm()) {
            return;
        }
        
        // Show loading state
        this.innerHTML = '<i data-feather="loader"></i> Processing...';
        this.disabled = true;
        feather.replace();
        
        // Simulate order placement (in Magento, this will be an AJAX call)
        setTimeout(() => {
            // Redirect to success page
            window.location.href = 'success.html';
        }, 2000);
    });
}

// ==================== SUCCESS MODAL ====================

function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    feather.replace();
}

// Close success modal when clicking outside
const successModal = document.getElementById('successModal');
if (successModal) {
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==================== FORM AUTO-FILL FOR DEMO ====================

// Auto-fill shipping form for demo purposes
const autoFillBtn = document.createElement('button');
autoFillBtn.textContent = 'Auto-Fill (Demo)';
autoFillBtn.className = 'btn-auto-fill';
autoFillBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; background: #3498db; color: white; border: none; cursor: pointer; z-index: 9999; font-size: 12px; display: none;';

document.body.appendChild(autoFillBtn);

// Show auto-fill button only on step 2
function toggleAutoFillButton() {
    if (currentStep === 2) {
        autoFillBtn.style.display = 'block';
    } else {
        autoFillBtn.style.display = 'none';
    }
}

// Auto-fill demo data
autoFillBtn.addEventListener('click', function() {
    const form = document.querySelector('#step2 .checkout-form');
    const inputs = form.querySelectorAll('input, select');
    
    const demoData = {
        'First Name': 'John',
        'Last Name': 'Doe',
        'Email Address': 'john.doe@example.com',
        'Phone Number': '+1 (555) 123-4567',
        'Street Address': '123 Luxury Avenue',
        'City': 'New York',
        'State / Province': 'NY',
        'ZIP / Postal Code': '10001'
    };
    
    inputs.forEach(input => {
        const label = input.previousElementSibling?.textContent.replace(' *', '');
        if (demoData[label]) {
            input.value = demoData[label];
        }
        if (input.tagName === 'SELECT' && label === 'Country') {
            input.value = 'US';
        }
    });
});

// Update auto-fill button visibility
setInterval(toggleAutoFillButton, 500);

console.log('Checkout wizard initialized - Ready for luxury shopping experience!');

