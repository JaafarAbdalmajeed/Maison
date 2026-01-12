/**
 * Maison de Pierre - Main JavaScript
 * Handles all interactive elements and animations
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {

        // Initialize Feather Icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // ==================== LOADING SCREEN ====================
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    loadingScreen.style.opacity = '0';
                    setTimeout(function() {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 800);
            });
        }

        // ==================== HEADER SCROLL ====================
        const header = document.getElementById('mainHeader');
        let lastScrollTop = 0;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 50) {
                header.classList.add('scrolled');
                document.body.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
                document.body.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;

            // Re-initialize feather icons after scroll changes
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });

        // ==================== MOBILE NAVIGATION ====================
        const burgerMenu = document.getElementById('burgerMenu');
        const mobileNav = document.getElementById('mobileNav');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        const mobileNavClose = document.getElementById('mobileNavClose');

        function openMobileNav() {
            if (mobileNav) {
                mobileNav.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            }
        }

        function closeMobileNav() {
            if (mobileNav) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        if (burgerMenu) {
            burgerMenu.addEventListener('click', function() {
                burgerMenu.classList.toggle('active');
                if (mobileNav.classList.contains('active')) {
                    closeMobileNav();
                } else {
                    openMobileNav();
                }
            });
        }

        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMobileNav);
        }

        if (mobileNavOverlay) {
            mobileNavOverlay.addEventListener('click', closeMobileNav);
        }

        // ==================== SEARCH OVERLAY ====================
        const searchBtn = document.getElementById('searchBtn');
        const searchBtnScrolled = document.getElementById('searchBtnScrolled');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');

        function openSearch() {
            if (searchOverlay) {
                searchOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                setTimeout(function() {
                    if (searchInput) {
                        searchInput.focus();
                    }
                }, 300);
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            }
        }

        function closeSearch() {
            if (searchOverlay) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
                if (searchInput) {
                    searchInput.value = '';
                }
            }
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openSearch();
            });
        }

        if (searchBtnScrolled) {
            searchBtnScrolled.addEventListener('click', function(e) {
                e.preventDefault();
                openSearch();
            });
        }

        if (searchClose) {
            searchClose.addEventListener('click', closeSearch);
        }

        if (searchOverlay) {
            searchOverlay.addEventListener('click', function(e) {
                if (e.target === searchOverlay) {
                    closeSearch();
                }
            });
        }

        if (searchClear) {
            searchClear.addEventListener('click', function() {
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
            });
        }

        // Close search on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (searchOverlay && searchOverlay.classList.contains('active')) {
                    closeSearch();
                }
                if (mobileNav && mobileNav.classList.contains('active')) {
                    closeMobileNav();
                }
            }
        });

        // ==================== LANGUAGE SWITCHER ====================
        const langSwitcher = document.getElementById('langSwitcher');
        const langSwitcherScrolled = document.getElementById('langSwitcherScrolled');
        const mobileLangSwitch = document.getElementById('mobileLangSwitch');

        function toggleLanguage() {
            const currentLang = document.querySelectorAll('.current-lang');
            const mobileLang = document.querySelector('.mobile-current-lang');

            currentLang.forEach(function(el) {
                if (el.textContent === 'EN') {
                    el.textContent = 'AR';
                    document.documentElement.setAttribute('dir', 'rtl');
                    document.documentElement.setAttribute('lang', 'ar');
                } else {
                    el.textContent = 'EN';
                    document.documentElement.setAttribute('dir', 'ltr');
                    document.documentElement.setAttribute('lang', 'en');
                }
            });

            if (mobileLang) {
                if (mobileLang.textContent === 'EN') {
                    mobileLang.textContent = 'AR';
                } else {
                    mobileLang.textContent = 'EN';
                }
            }
        }

        if (langSwitcher) {
            langSwitcher.addEventListener('click', function(e) {
                e.preventDefault();
                toggleLanguage();
            });
        }

        if (langSwitcherScrolled) {
            langSwitcherScrolled.addEventListener('click', function(e) {
                e.preventDefault();
                toggleLanguage();
            });
        }

        if (mobileLangSwitch) {
            mobileLangSwitch.addEventListener('click', function(e) {
                e.preventDefault();
                toggleLanguage();
            });
        }

        // ==================== SMOOTH SCROLL ====================
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    const offsetTop = target.offsetTop - 150;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // ==================== PRODUCT CAROUSEL ====================
        window.scrollCarousel = function(direction, carouselId) {
            const carousel = document.getElementById(carouselId || 'productsCarousel');
            if (carousel) {
                const scrollAmount = 450;
                carousel.scrollBy({
                    left: direction * scrollAmount,
                    behavior: 'smooth'
                });
            }
        };

        // Related Products Carousel
        window.scrollRelatedProducts = function(direction) {
            const carousel = document.getElementById('relatedProductsCarousel');
            if (carousel) {
                const scrollAmount = 400;
                carousel.scrollBy({
                    left: direction * scrollAmount,
                    behavior: 'smooth'
                });
            }
        };

        // ==================== THUMBNAIL IMAGE SWITCHING ====================
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(function(thumbnail) {
            thumbnail.addEventListener('click', function() {
                const imageUrl = this.getAttribute('data-image');
                const mainImage = document.getElementById('mainImage');

                if (mainImage && imageUrl) {
                    mainImage.src = imageUrl;

                    // Update active state
                    thumbnails.forEach(function(t) {
                        t.classList.remove('active');
                    });
                    this.classList.add('active');
                }

                // Re-initialize feather icons
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            });
        });

        // ==================== QUICK VIEW MODAL ====================
        const quickViewBtns = document.querySelectorAll('.product-quick-view');
        quickViewBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                if (productCard) {
                    const productData = {
                        brand: productCard.getAttribute('data-brand'),
                        name: productCard.getAttribute('data-name'),
                        price: productCard.getAttribute('data-price'),
                        image: productCard.getAttribute('data-image'),
                        badge: productCard.getAttribute('data-badge'),
                        description: productCard.getAttribute('data-description')
                    };

                    // Open quick view modal with product data
                    openQuickView(productData);
                }
            });
        });

        function openQuickView(data) {
            // Implementation for quick view modal
            console.log('Quick view:', data);
            // This would open a modal with product details
        }

        // ==================== WISHLIST FUNCTIONALITY ====================
        const wishlistBtns = document.querySelectorAll('.btn-wishlist, .btn-wishlist-detail');
        wishlistBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.toggle('active');

                // Add to wishlist animation
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.3)';
                    setTimeout(function() {
                        icon.style.transform = 'scale(1)';
                    }, 200);
                }
            });
        });

        // ==================== RE-INITIALIZE FEATHER ICONS ====================
        // Re-initialize feather icons periodically for dynamic content
        setInterval(function() {
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }, 1000);

    }); // End DOMContentLoaded

})();
