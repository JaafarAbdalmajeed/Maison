/**
 * Maison de Pierre - Theme Initialization Module (Professional RequireJS Way)
 */
define([
    'jquery',
    'domReady!'
], function($) {
    'use strict';
    
    return function() {
        console.log('✅ Maison Theme: Initializing (Professional RequireJS module)...');
        
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
        $('#cartBtn, #cartBtnScrolled').on('click', function(e) {
            e.preventDefault();
            $('#miniCart').addClass('active');
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
        
        console.log('✅ Maison Theme: All interactions initialized');
        console.log('✅ Maison Theme: Ready!');
    };
});
