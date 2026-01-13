// ==================== CONTACT PAGE SCRIPTS ====================

// Initialize Feather Icons
document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.btn-contact-submit');
        const originalHTML = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i data-feather="loader"></i> SENDING...';
        submitBtn.disabled = true;
        feather.replace();
        
        // Get form data
        const formData = new FormData(this);
        
        // Simulate sending (in Magento, this will be an AJAX call)
        setTimeout(() => {
            alert('Thank you for contacting us! We will get back to you within 24 hours.');
            this.reset();
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            feather.replace();
        }, 1500);
    });
}

console.log('Contact page loaded - Form ready!');

