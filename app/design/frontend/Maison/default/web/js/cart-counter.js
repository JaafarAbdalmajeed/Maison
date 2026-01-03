/**
 * Cart Counter Update - Updates cart count in header across all pages
 */
define([
    'jquery',
    'domReady!'
], function($) {
    'use strict';
    
    // Function to update cart count from customerData
    var updateCartCount = function() {
        if (typeof window.customerData !== 'undefined') {
            var cartData = window.customerData.get('cart');
            var cartCount = 0;
            
            if (cartData) {
                if (cartData.summary_count !== undefined && cartData.summary_count !== null) {
                    cartCount = parseInt(cartData.summary_count) || 0;
                }
            }
            
            // Update all cart count elements
            $('.cart-count').each(function() {
                $(this).text(cartCount > 0 ? cartCount : '0').show();
            });
            
            console.log('Cart count updated:', cartCount);
        }
    };
    
    // Initialize cart counter
    var initCartCounter = function() {
        // Listen for customerData cart updates
        if (typeof window.customerData !== 'undefined') {
            var cartDataObservable = window.customerData.get('cart');
            
            // Subscribe to cart data changes
            if (cartDataObservable && typeof cartDataObservable.subscribe === 'function') {
                cartDataObservable.subscribe(function(cartData) {
                    updateCartCount();
                });
            }
            
            // Initial update
            updateCartCount();
        }
        
        // Also listen for custom events
        $(document).on('ajax:addToCart', function() {
            setTimeout(updateCartCount, 300);
        });
        
        $(document).on('updateMiniCart', function() {
            setTimeout(updateCartCount, 300);
        });
        
        // Update when customerData is reloaded
        if (typeof window.customerData !== 'undefined' && window.customerData.reload) {
            var originalReload = window.customerData.reload;
            window.customerData.reload = function(sections, isGlobal) {
                var result = originalReload.apply(this, arguments);
                if (result && result.done) {
                    result.done(function() {
                        setTimeout(updateCartCount, 500);
                    });
                }
                return result;
            };
        }
    };
    
    return {
        init: initCartCounter,
        update: updateCartCount
    };
});

