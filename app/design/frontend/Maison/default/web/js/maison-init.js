/**
 * Maison de Pierre - Theme Initialization Module (Professional RequireJS Way)
 */
define([
    'jquery',
    'domReady!',
    'cartCounter'
], function($, domReady, cartCounter) {
    'use strict';
    
    return function() {
        console.log('✅ Maison Theme: Initializing (Professional RequireJS module)...');
        
        // Initialize cart counter
        if (cartCounter && typeof cartCounter.init === 'function') {
            cartCounter.init();
        }
        
        // Initialize Feather Icons
        if (typeof feather !== 'undefined') {
            feather.replace();
            console.log('✅ Feather icons initialized');
        }
        
        // Hide loading screen
        setTimeout(function() {
            $('#loadingScreen').fadeOut(500);
        }, 1500);
        
        // Mobile menu toggle
        $('#burgerMenu').on('click', function() {
            $('#mobileNav').addClass('active');
        });
        
        $('#mobileNavClose, #mobileNavOverlay').on('click', function() {
            $('#mobileNav').removeClass('active');
        });
        
        // Mini cart toggle
        $(document).on('click', '#cartBtn, #cartBtnScrolled', function(e) {
            // Check if we're on cart page
            if ($('body').hasClass('checkout-cart-index')) {
                // On cart page, minicart is removed, so just allow normal link behavior
                // (user is already on cart page, so nothing happens)
                return true;
            }
            
            // On other pages, open minicart
            e.preventDefault();
            e.stopPropagation();
            
            var miniCart = $('#miniCart');
            if (miniCart.length && miniCart.is(':visible')) {
                miniCart.addClass('active');
                console.log('Mini cart opened');
            } else if (miniCart.length) {
                // Minicart exists but might be hidden, try to show it
                miniCart.addClass('active');
                console.log('Mini cart opened (was hidden)');
            } else {
                console.warn('Mini cart element not found, navigating to cart page');
                // Fallback: navigate to cart page
                window.location.href = $(this).attr('href') || '/checkout/cart/';
            }
            
            return false;
        });
        
        $('#miniCartClose, #miniCartOverlay').on('click', function() {
            $('#miniCart').removeClass('active');
        });
        
        // Search overlay toggle
        $('#searchBtn, #searchBtnScrolled').on('click', function(e) {
            e.preventDefault();
            $('#searchOverlay').addClass('active');
            $('#searchInput').focus();
            // Re-initialize Feather icons for search overlay
            if (typeof feather !== 'undefined') {
                setTimeout(function() {
                    feather.replace();
                }, 100);
            }
        });
        
        $('#searchClose').on('click', function() {
            $('#searchOverlay').removeClass('active');
        });
        
        // Close search overlay when clicking outside
        $('#searchOverlay').on('click', function(e) {
            if ($(e.target).is('#searchOverlay')) {
                $(this).removeClass('active');
            }
        });
        
        // Close search overlay on Escape key
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                if ($('#searchOverlay').hasClass('active')) {
                    $('#searchOverlay').removeClass('active');
                }
            }
        });
        
        // Search form functionality
        var $searchInput = $('#searchInput');
        var $searchForm = $('#searchForm');
        var $searchClear = $('#searchClear');
        
        // Show/hide clear button based on input value
        function toggleClearButton() {
            if ($searchInput.val().length > 0) {
                $searchClear.addClass('active');
            } else {
                $searchClear.removeClass('active');
            }
        }
        
        // Handle input changes
        $searchInput.on('input keyup', function() {
            toggleClearButton();
        });
        
        // Clear search input
        $searchClear.on('click', function(e) {
            e.preventDefault();
            $searchInput.val('').focus();
            toggleClearButton();
        });
        
        // Handle form submission (Enter key or form submit)
        $searchForm.on('submit', function(e) {
            var searchQuery = $searchInput.val().trim();
            if (searchQuery.length === 0) {
                e.preventDefault();
                return false;
            }
            // Form will submit normally to catalogsearch/result
            return true;
        });
        
        // Handle Enter key in search input
        $searchInput.on('keydown', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                var searchQuery = $(this).val().trim();
                if (searchQuery.length > 0) {
                    $searchForm.submit();
                }
            }
        });
        
        // Initialize clear button visibility
        toggleClearButton();
        
        // Header scroll effect (from design)
        let lastScrollY = 0;
        $(window).on('scroll', function() {
            const header = document.getElementById('mainHeader');
            const body = document.body;
            
            if (header) {
                const scrollY = window.scrollY || window.pageYOffset;
                
                if (scrollY > 50) {
                    header.classList.add('scrolled');
                    body.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                    body.classList.remove('scrolled');
                }
                
                lastScrollY = scrollY;
            }
        });
        
        // Products carousel
        window.scrollCarousel = function(direction) {
            $('#productsCarousel').animate({
                scrollLeft: $('#productsCarousel').scrollLeft() + (direction * 320)
            }, 300);
        };
        
        // Brands carousel
        window.scrollBrandsCarousel = function(direction) {
            $('#brandsCarousel').animate({
                scrollLeft: $('#brandsCarousel').scrollLeft() + (direction * 250)
            }, 300);
        };
        
        // Wishlist handler (basic AJAX)
        $(document).on('click', '.product-wishlist-btn', function(e) {
            var $btn = $(this);
            var url = $btn.attr('href');
            
            if (!url) {
                return;
            }
            
            // Prevent default navigation
            e.preventDefault();
            
            // Show loading state
            $btn.addClass('loading');
            
            // Make AJAX request
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                cache: false,
                success: function(response) {
                    // Toggle button state
                    if (response && response.success !== false) {
                        if ($btn.hasClass('in-wishlist')) {
                            $btn.removeClass('in-wishlist');
                            $btn.attr('title', 'Add to Wishlist');
                            $btn.find('svg').attr('fill', 'none');
                        } else {
                            $btn.addClass('in-wishlist');
                            $btn.attr('title', 'Remove from Wishlist');
                            $btn.find('svg').attr('fill', 'currentColor');
                        }
                    }
                    
                    // Reload wishlist counter if available
                    if (typeof customerData !== 'undefined') {
                        customerData.reload(['wishlist'], false);
                    }
                },
                error: function() {
                    // On error, redirect to wishlist page
                    window.location.href = url;
                },
                complete: function() {
                    $btn.removeClass('loading');
                }
            });
        });
        
        console.log('✅ Maison Theme: All interactions initialized');
        console.log('✅ Maison Theme: Ready!');
    };
});
