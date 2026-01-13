// ==================== PRODUCT DETAIL PAGE SCRIPTS ====================

// ==================== IMAGE GALLERY ====================

// Thumbnail Click - Change Main Image
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('mainImage');

thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
        // Remove active class from all thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Change main image
        const newImage = this.dataset.image;
        mainImage.src = newImage;
        
        // Add fade animation
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 100);
    });
});

// Thumbnail Navigation
function scrollThumbnails(direction) {
    const container = document.getElementById('thumbnailsContainer');
    const scrollAmount = 110; // thumbnail width + gap
    
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// ==================== IMAGE ZOOM ====================

const zoomBtn = document.getElementById('zoomBtn');
const zoomModal = document.getElementById('zoomModal');
const zoomImage = document.getElementById('zoomImage');
const zoomClose = document.getElementById('zoomClose');

if (zoomBtn) {
    zoomBtn.addEventListener('click', function() {
        zoomImage.src = mainImage.src;
        zoomModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Re-initialize icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });
}

if (zoomClose) {
    zoomClose.addEventListener('click', function() {
        zoomModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close on ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && zoomModal && zoomModal.classList.contains('active')) {
        zoomModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close on click outside
if (zoomModal) {
    zoomModal.addEventListener('click', function(e) {
        if (e.target === zoomModal) {
            zoomModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==================== COLOR SELECTION ====================

const colorSwatches = document.querySelectorAll('.color-swatch-btn');
const selectedColorDisplay = document.getElementById('selectedColor');

colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', function() {
        // Remove active from all
        colorSwatches.forEach(s => s.classList.remove('active'));
        
        // Add active to clicked
        this.classList.add('active');
        
        // Update display
        const colorName = this.dataset.color;
        if (selectedColorDisplay) {
            selectedColorDisplay.textContent = colorName;
        }
        
        console.log('Color selected:', colorName);
    });
});

// ==================== SIZE SELECTION ====================

const sizeBtns = document.querySelectorAll('.size-btn');
const selectedSizeDisplay = document.getElementById('selectedSize');

sizeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active from all
        sizeBtns.forEach(b => b.classList.remove('active'));
        
        // Add active to clicked
        this.classList.add('active');
        
        // Update display
        const sizeName = this.dataset.size;
        if (selectedSizeDisplay) {
            selectedSizeDisplay.textContent = sizeName;
        }
        
        console.log('Size selected:', sizeName);
    });
});

// ==================== QUANTITY SELECTOR ====================

const qtyInput = document.getElementById('qtyInput');
const qtyPlus = document.getElementById('qtyPlus');
const qtyMinus = document.getElementById('qtyMinus');

if (qtyPlus) {
    qtyPlus.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        const maxValue = parseInt(qtyInput.max);
        
        if (currentValue < maxValue) {
            qtyInput.value = currentValue + 1;
        }
    });
}

if (qtyMinus) {
    qtyMinus.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        const minValue = parseInt(qtyInput.min);
        
        if (currentValue > minValue) {
            qtyInput.value = currentValue - 1;
        }
    });
}

// ==================== ADD TO CART ====================

const addToCartBtn = document.getElementById('addToCartDetail');

if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
        const selectedColor = document.querySelector('.color-swatch-btn.active')?.dataset.color || 'N/A';
        const selectedSize = document.querySelector('.size-btn.active')?.dataset.size || 'N/A';
        const quantity = qtyInput.value;
        
        console.log('Adding to cart:', {
            product: 'Luxor Velvet Armchair',
            color: selectedColor,
            size: selectedSize,
            quantity: quantity
        });
        
        // Visual feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<i data-feather="check"></i> ADDED TO CART';
        this.style.background = '#27ae60';
        
        // Re-initialize icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = '';
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }, 2000);
        
        // In Magento, this will trigger AJAX cart add
        // addToMagentoCart(productId, selectedColor, selectedSize, quantity);
    });
}

// ==================== WISHLIST ====================

const wishlistBtn = document.getElementById('addToWishlist');

if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            this.style.background = 'var(--primary-gold)';
            this.style.borderColor = 'var(--primary-gold)';
            console.log('Added to wishlist');
        } else {
            this.style.background = '';
            this.style.borderColor = '';
            console.log('Removed from wishlist');
        }
        
        // In Magento: addToWishlist(productId);
    });
}

// ==================== PRODUCT TABS ====================

// Support both horizontal and vertical tabs
const tabBtns = document.querySelectorAll('.tab-btn, .tab-btn-vertical');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        
        // Remove active from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Add active to clicked tab
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        
        // Re-initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });
});

// ==================== RELATED PRODUCTS CAROUSEL ====================

function scrollRelatedProducts(direction) {
    const carousel = document.getElementById('relatedProductsCarousel');
    if (!carousel) return;
    
    const productCard = carousel.querySelector('.product-card');
    if (!productCard) return;
    
    const cardWidth = productCard.offsetWidth;
    const gap = 30;
    const scrollAmount = cardWidth + gap;
    
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// ==================== STICKY ADD TO CART (Mobile) ====================

// On mobile, when user scrolls past the add to cart button, show sticky bar
window.addEventListener('scroll', function() {
    const addToCartSection = document.querySelector('.product-actions-detail');
    
    if (!addToCartSection) return;
    
    const rect = addToCartSection.getBoundingClientRect();
    const isOutOfView = rect.bottom < 0;
    
    // You can add a sticky cart bar here for mobile if needed
    // For now, we'll keep it simple
});

console.log('Product detail page loaded - All interactive features ready!');

