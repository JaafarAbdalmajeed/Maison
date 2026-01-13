/**
 * Maison de Pierre - Theme Initialization Module
 * Unified theme functionality
 */
define([
    'jquery',
    'domReady!',
    'cartCounter'
], function($, domReady, cartCounter) {
    'use strict';
    
    return function() {
        console.log('✅ Maison Theme: Initializing...');
        
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
        
        // Mini cart toggle - Unified handler
        $(document).on('click', '#cartBtn, #cartBtnScrolled', function(e) {
            // Check if we're on cart page
            if ($('body').hasClass('checkout-cart-index')) {
                return true;
            }
            
            // On other pages, open minicart
            e.preventDefault();
            e.stopPropagation();
            
            var miniCart = $('#miniCart');
            if (miniCart.length) {
                // Minicart exists, open it
                miniCart.addClass('active');
                $('body').addClass('minicart-open');
                
                // Update minicart content to ensure fresh data
                if (cartCounter && typeof cartCounter.updateMiniCart === 'function') {
                    cartCounter.updateMiniCart();
                } else {
                    // Fallback: reload customerData
                    if (typeof window.customerData !== 'undefined') {
                        window.customerData.reload(['cart'], false);
                    }
                }
            } else {
                console.warn('Mini cart element not found, navigating to cart page');
                window.location.href = '/checkout/cart/';
            }
            
            return false;
        });
        
        // Close mini cart
        $(document).on('click', '#miniCartClose, #miniCartOverlay', function() {
            $('#miniCart').removeClass('active');
            $('body').removeClass('minicart-open');
        });
        
        // Search overlay toggle
        $('#searchBtn, #searchBtnScrolled').on('click', function(e) {
            e.preventDefault();
            $('#searchOverlay').addClass('active');
            $('#searchInput').focus();
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
                if ($('#miniCart').hasClass('active')) {
                    $('#miniCart').removeClass('active');
                    $('body').removeClass('minicart-open');
                }
            }
        });
        
        // Search form functionality
        var $searchInput = $('#searchInput');
        var $searchForm = $('#searchForm');
        var $searchClear = $('#searchClear');
        
        function toggleClearButton() {
            if ($searchInput.val().length > 0) {
                $searchClear.addClass('active');
            } else {
                $searchClear.removeClass('active');
            }
        }
        
        $searchInput.on('input keyup', function() {
            toggleClearButton();
        });
        
        $searchClear.on('click', function(e) {
            e.preventDefault();
            $searchInput.val('').focus();
            toggleClearButton();
        });
        
        $searchForm.on('submit', function(e) {
            var searchQuery = $searchInput.val().trim();
            if (searchQuery.length === 0) {
                e.preventDefault();
                return false;
            }
            return true;
        });
        
        $searchInput.on('keydown', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                var searchQuery = $(this).val().trim();
                if (searchQuery.length > 0) {
                    $searchForm.submit();
                }
            }
        });
        
        toggleClearButton();
        
        // Header scroll effect
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
        
        // Wishlist handler
        $(document).on('click', '.product-wishlist-btn', function(e) {
            var $btn = $(this);
            var url = $btn.attr('href');
            
            if (!url) {
                return;
            }
            
            e.preventDefault();
            $btn.addClass('loading');
            
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                cache: false,
                success: function(response) {
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
                    
                    if (typeof customerData !== 'undefined') {
                        customerData.reload(['wishlist'], false);
                    }
                },
                error: function() {
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
