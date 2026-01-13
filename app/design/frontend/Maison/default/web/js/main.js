// ==================== LOADING SCREEN ====================
// Loading Screen Handler - Hides when page fully loads
window.addEventListener('load', function() {
    // Small delay for smooth transition
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
        
        // Remove loading screen from DOM after fade transition
        setTimeout(() => {
            loadingScreen.remove();
        }, 800); // Match the CSS transition duration
    }, 300); // Minimal delay just for smooth appearance
});

// ==================== FEATHER ICONS ====================
// Initialize Feather Icons
feather.replace();

// ==================== HEADER SCROLL ANIMATION ====================
// Smooth Scroll Effect - Single Header System
let lastScrollY = 0;
window.addEventListener('scroll', function() {
    const header = document.getElementById('mainHeader');
    const body = document.body;
    
    if (header) {
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (scrollY > 50) {
            header.classList.add('scrolled');
            body.classList.add('scrolled');
            // Re-initialize feather icons for the scrolled icons row
            setTimeout(() => feather.replace(), 100);
        } else {
            header.classList.remove('scrolled');
            body.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
    }
}, { passive: true });

// ==================== HERO VIDEO HANDLING ====================
// Hero video handling
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
    // Try to play video when it's ready
    heroVideo.addEventListener('loadedmetadata', function() {
        console.log('Hero video metadata loaded');
        heroVideo.play().catch(e => {
            console.log('Video autoplay prevented:', e.message);
            console.log('The poster image will be displayed instead.');
        });
    });
    
    // Attempt immediate play
    heroVideo.play().catch(e => {
        console.log('Add your video file to images/ folder as "hero-video.mp4"');
    });
    
    // Try to play on user interaction
    document.addEventListener('click', function() {
        if (heroVideo.paused) {
            heroVideo.play();
        }
    }, { once: true });
}

// ==================== NEW ARRIVALS CAROUSEL ====================
// New Arrivals carousel scroll function - snap to exact product
function scrollNewArrivalsCarousel(direction) {
    const carousel = document.getElementById('newArrivalsCarousel');
    if (!carousel) return;
    
    const productCard = carousel.querySelector('.product-card');
    if (!productCard) return;
    
    const cardWidth = productCard.offsetWidth;
    const gap = 30; // gap between cards
    const scrollAmount = cardWidth + gap;
    
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Auto-scroll new arrivals carousel every 5 seconds
const newArrivalsCarousel = document.getElementById('newArrivalsCarousel');
if (newArrivalsCarousel) {
    setInterval(() => {
        const carousel = document.getElementById('newArrivalsCarousel');
        if (!carousel) return;
        
        const maxScroll = carousel.scrollWidth - carousel.offsetWidth;
        if (carousel.scrollLeft >= maxScroll - 10) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            scrollNewArrivalsCarousel(1);
        }
    }, 5000);
}

// ==================== BEST SELLERS CAROUSEL ====================
// Best Sellers carousel scroll function - snap to exact product
function scrollCarousel(direction) {
    const carousel = document.getElementById('productsCarousel');
    if (!carousel) return;
    
    const productCard = carousel.querySelector('.product-card');
    if (!productCard) return;
    
    const cardWidth = productCard.offsetWidth;
    const gap = 30; // gap between cards
    const scrollAmount = cardWidth + gap;
    
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Auto-scroll best sellers carousel every 5 seconds
const productsCarousel = document.getElementById('productsCarousel');
if (productsCarousel) {
    setInterval(() => {
        const carousel = document.getElementById('productsCarousel');
        if (!carousel) return;
        
        const maxScroll = carousel.scrollWidth - carousel.offsetWidth;
        if (carousel.scrollLeft >= maxScroll - 10) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            scrollCarousel(1);
        }
    }, 5000);
}

// ==================== BRANDS CAROUSEL ====================
// Brands carousel scroll function - snap to exact brand
function scrollBrandsCarousel(direction) {
    const carousel = document.getElementById('brandsCarousel');
    if (!carousel) return;
    
    const brandCard = carousel.querySelector('.brand-item');
    if (!brandCard) return;
    
    const cardWidth = brandCard.offsetWidth;
    const scrollAmount = cardWidth;
    
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Auto-scroll brands carousel every 4 seconds
const brandsCarousel = document.getElementById('brandsCarousel');
if (brandsCarousel) {
    setInterval(() => {
        const carousel = document.getElementById('brandsCarousel');
        if (!carousel) return;
        
        const maxScroll = carousel.scrollWidth - carousel.offsetWidth;
        if (carousel.scrollLeft >= maxScroll - 10) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            scrollBrandsCarousel(1);
        }
    }, 4000);
}

// ==================== LANGUAGE SWITCHER ====================
// Simple toggle between EN and AR
function toggleLanguage(e) {
    e.preventDefault();
    
    // Get all language displays
    const langDisplays = document.querySelectorAll('.current-lang');
    
    // Get current language
    const currentLang = langDisplays[0].textContent;
    
    // Toggle language
    const newLang = currentLang === 'EN' ? 'AR' : 'EN';
    
    // Update all displays
    langDisplays.forEach(display => {
        display.textContent = newLang;
    });
    
    // Here you can add actual language switching logic for Magento
    // In Magento: window.location.href = BASE_URL + 'stores/store/switch/store/' + storeCode;
    // Example: if (newLang === 'AR') { window.location.href = BASE_URL + 'ar/'; }
    console.log('Language switched to:', newLang);
}

// Add event listeners to language switchers (both top and scrolled)
const langSwitcher = document.getElementById('langSwitcher');
const langSwitcherScrolled = document.getElementById('langSwitcherScrolled');

if (langSwitcher) {
    langSwitcher.addEventListener('click', toggleLanguage);
}
if (langSwitcherScrolled) {
    langSwitcherScrolled.addEventListener('click', toggleLanguage);
}

// ==================== MOBILE NAVIGATION ====================
const mobileNav = document.getElementById('mobileNav') || document.getElementById('mobileNavDrawer');
const burgerMenu = document.getElementById('burgerMenu');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileLangSwitch = document.getElementById('mobileLangSwitch');

// Open mobile nav
function openMobileNav(e) {
    e.preventDefault();
    if (mobileNav) {
        mobileNav.classList.add('active');
    }
    if (burgerMenu) {
        burgerMenu.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
    setTimeout(() => feather.replace(), 100);
}

// Close mobile nav
function closeMobileNav() {
    if (mobileNav) {
        mobileNav.classList.remove('active');
    }
    if (burgerMenu) {
        burgerMenu.classList.remove('active');
    }
    document.body.style.overflow = '';
}

// Toggle mobile submenu
document.querySelectorAll('.mobile-menu-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const parent = this.parentElement;
        parent.classList.toggle('active');
        setTimeout(() => feather.replace(), 100);
    });
});

// Mobile language switch
if (mobileLangSwitch) {
    mobileLangSwitch.addEventListener('click', function(e) {
        e.preventDefault();
        const currentLang = document.querySelector('.mobile-current-lang').textContent;
        const newLang = currentLang === 'EN' ? 'AR' : 'EN';
        
        // Update all language displays (including desktop)
        document.querySelectorAll('.current-lang, .mobile-current-lang').forEach(display => {
            display.textContent = newLang;
        });
        
        console.log('Language switched to:', newLang);
    });
}

// Event listeners
if (burgerMenu) {
    burgerMenu.addEventListener('click', openMobileNav);
}
if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
}
if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileNav);
}

// Close mobile nav on ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
        closeMobileNav();
    }
});

// ==================== MINI CART ====================
const miniCart = document.getElementById('miniCart');
const cartBtn = document.getElementById('cartBtn');
const cartBtnScrolled = document.getElementById('cartBtnScrolled');
const miniCartClose = document.getElementById('miniCartClose');
const miniCartOverlay = document.getElementById('miniCartOverlay');

// Open mini cart
function openMiniCart(e) {
    e.preventDefault();
    if (miniCart) {
        miniCart.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => feather.replace(), 100);
    }
}

// Close mini cart
function closeMiniCart() {
    if (miniCart) {
        miniCart.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Event listeners (both top and scrolled cart buttons)
if (cartBtn) {
    cartBtn.addEventListener('click', openMiniCart);
}
if (cartBtnScrolled) {
    cartBtnScrolled.addEventListener('click', openMiniCart);
}
if (miniCartClose) {
    miniCartClose.addEventListener('click', closeMiniCart);
}
if (miniCartOverlay) {
    miniCartOverlay.addEventListener('click', closeMiniCart);
}

// Close on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && miniCart && miniCart.classList.contains('active')) {
        closeMiniCart();
    }
});

// Quantity buttons (demo functionality)
document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const qtySpan = this.parentElement.querySelector('.qty-value');
        let qty = parseInt(qtySpan.textContent);
        
        if (this.classList.contains('plus')) {
            qty++;
        } else if (this.classList.contains('minus') && qty > 1) {
            qty--;
        }
        
        qtySpan.textContent = qty;
        // Here you would update cart totals in Magento
    });
});

// Remove item buttons (demo functionality)
document.querySelectorAll('.item-remove').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const item = this.closest('.mini-cart-item');
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
        setTimeout(() => {
            item.remove();
            // Here you would update cart in Magento and refresh totals
        }, 300);
    });
});


// ==================== SEARCH OVERLAY ====================
const searchOverlay = document.getElementById('searchOverlay');
const searchBtn = document.getElementById('searchBtn');
const searchBtnScrolled = document.getElementById('searchBtnScrolled');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const searchResults = document.getElementById('searchResults');
const searchSuggestions = document.querySelector('.search-suggestions');

// Open search overlay
function openSearch(e) {
    e.preventDefault();
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        searchInput.focus();
    }, 400);
    feather.replace();
}

// Close search overlay
function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchClear.style.display = 'none';
    searchResults.style.display = 'none';
    searchSuggestions.style.display = 'block';
}

// Event listeners for search (both top and scrolled)
if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
}
if (searchBtnScrolled) {
    searchBtnScrolled.addEventListener('click', openSearch);
}
if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
}

// Close on ESC key
if (searchOverlay) {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });

    // Close when clicking outside
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            closeSearch();
        }
    });
}

// Handle search input
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const value = this.value.trim();
        
        // Show/hide clear button
        if (value.length > 0) {
            if (searchClear) searchClear.style.display = 'block';
        } else {
            if (searchClear) searchClear.style.display = 'none';
            if (searchResults) searchResults.style.display = 'none';
            if (searchSuggestions) searchSuggestions.style.display = 'block';
        }
        
        // Show results when typing (minimum 2 characters)
        if (value.length >= 2) {
            if (searchSuggestions) searchSuggestions.style.display = 'none';
            if (searchResults) searchResults.style.display = 'block';
            
            // Here you would integrate with Magento search API
            // Example: performSearch(value);
            console.log('Searching for:', value);
        }
    });
}

// Clear search
if (searchClear && searchInput) {
    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchClear.style.display = 'none';
        if (searchResults) searchResults.style.display = 'none';
        if (searchSuggestions) searchSuggestions.style.display = 'block';
        searchInput.focus();
    });
}

// Prevent form submission (will be handled by AJAX in Magento)
const searchForm = document.getElementById('searchForm');
if (searchForm && searchInput) {
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            // In Magento, redirect to search results or handle with AJAX
            console.log('Search submitted:', query);
            // window.location.href = BASE_URL + 'catalogsearch/result/?q=' + encodeURIComponent(query);
        }
    });
}


// ==================== QUICK VIEW MODAL ====================
const quickViewOverlay = document.getElementById('quickViewOverlay');
const quickViewClose = document.getElementById('quickViewClose');
const quickViewImage = document.getElementById('quickViewImage');
const quickViewBrand = document.getElementById('quickViewBrand');
const quickViewTitle = document.getElementById('quickViewTitle');
const quickViewPrice = document.getElementById('quickViewPrice');
const quickViewDescription = document.getElementById('quickViewDescription');
const quickViewBadge = document.getElementById('quickViewBadge');

// Function to open quick view
function openQuickView(productCard) {
    const brand = productCard.dataset.brand;
    const name = productCard.dataset.name;
    const price = productCard.dataset.price;
    const image = productCard.dataset.image;
    const badge = productCard.dataset.badge;
    const description = productCard.dataset.description;

    // Populate modal with product data
    quickViewImage.src = image;
    quickViewImage.alt = name;
    quickViewBrand.textContent = brand;
    quickViewTitle.textContent = name;
    quickViewPrice.textContent = price;
    quickViewDescription.textContent = description;
    quickViewBadge.textContent = badge;

    // Show badge only if it exists
    if (badge) {
        quickViewBadge.style.display = 'block';
        // Apply gold background for "NEW" badge
        if (badge === 'NEW') {
            quickViewBadge.style.backgroundColor = 'var(--primary-gold)';
        } else {
            quickViewBadge.style.backgroundColor = 'rgba(40, 40, 40, 0.9)';
        }
    } else {
        quickViewBadge.style.display = 'none';
    }

    // Open modal
    quickViewOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Re-initialize feather icons in the modal
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Function to close quick view
function closeQuickView() {
    quickViewOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close button
quickViewClose.addEventListener('click', closeQuickView);

// Close on overlay click (outside modal)
quickViewOverlay.addEventListener('click', function(e) {
    if (e.target === quickViewOverlay) {
        closeQuickView();
    }
});

// Close on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && quickViewOverlay.classList.contains('active')) {
        closeQuickView();
    }
});

// Add click event to all quick view buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('product-quick-view')) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            openQuickView(productCard);
        }
    }
    
    // Handle product add to cart buttons on product cards
    if (e.target.classList.contains('product-add-to-cart') || e.target.closest('.product-add-to-cart')) {
        const btn = e.target.classList.contains('product-add-to-cart') ? e.target : e.target.closest('.product-add-to-cart');
        const productCard = btn.closest('.product-card');
        if (productCard) {
            const productName = productCard.dataset.name;
            // In Magento, this will add product to cart via AJAX
            alert(`"${productName}" added to cart! (This will be connected to Magento cart API)`);
            
            // Add visual feedback - button pulse
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        }
    }
});

// Add to cart button (placeholder - will be connected to Magento)
document.querySelector('.btn-add-to-cart').addEventListener('click', function() {
    // In Magento, this will add product to cart via AJAX
    alert('Product added to cart! (This will be connected to Magento cart API)');
});

// View full details button (placeholder - will be connected to Magento)
document.querySelector('.btn-view-details').addEventListener('click', function() {
    // In Magento, this will redirect to product page
    alert('Redirecting to product page... (This will be connected to Magento product URL)');
});

// ==================== PRODUCT OPTIONS & QUANTITY ====================

// Handle option button clicks (Color, Size, etc.)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('option-btn')) {
        // Get the option group
        const optionGroup = e.target.closest('.option-group');
        const allButtons = optionGroup.querySelectorAll('.option-btn');
        
        // Remove active class from all buttons in this group
        allButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        // Log selected value (in Magento, this will be used for product configuration)
        const selectedValue = e.target.dataset.value;
        const optionLabel = optionGroup.querySelector('.option-label').textContent;
        console.log(`Selected ${optionLabel}: ${selectedValue}`);
    }
});

// Quantity selector - Plus button
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('qty-plus') || e.target.closest('.qty-plus')) {
        const qtyInput = document.getElementById('quickViewQty');
        const currentValue = parseInt(qtyInput.value);
        const maxValue = parseInt(qtyInput.max);
        
        if (currentValue < maxValue) {
            qtyInput.value = currentValue + 1;
        }
    }
});

// Quantity selector - Minus button
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('qty-minus') || e.target.closest('.qty-minus')) {
        const qtyInput = document.getElementById('quickViewQty');
        const currentValue = parseInt(qtyInput.value);
        const minValue = parseInt(qtyInput.min);
        
        if (currentValue > minValue) {
            qtyInput.value = currentValue - 1;
        }
    }
});

// Validate quantity input
document.addEventListener('input', function(e) {
    if (e.target.id === 'quickViewQty') {
        const input = e.target;
        const value = parseInt(input.value);
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        
        if (value < min) {
            input.value = min;
        } else if (value > max) {
            input.value = max;
        }
    }
});
