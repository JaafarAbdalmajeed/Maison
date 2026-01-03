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
        var cartCount = 0;
        
        // Try customerData first (Magento's standard way)
        if (typeof window.customerData !== 'undefined') {
            try {
                var cartData = window.customerData.get('cart');
                if (cartData) {
                    // cartData might be an observable, so try to get value
                    var value = cartData;
                    if (typeof cartData === 'function') {
                        value = cartData();
                    }
                    if (value && typeof value === 'object') {
                        if (value.summary_count !== undefined && value.summary_count !== null) {
                            cartCount = parseInt(value.summary_count) || 0;
                        } else if (value.items_qty !== undefined && value.items_qty !== null) {
                            cartCount = parseInt(value.items_qty) || 0;
                        }
                    }
                }
            } catch (e) {
                console.warn('Error getting cart data from customerData:', e);
            }
        }
        
        // Update all cart count elements
        $('.cart-count').each(function() {
            $(this).text(cartCount > 0 ? cartCount : '0').show();
        });
        
        console.log('Cart count updated:', cartCount);
    };
    
    // Initialize cart counter
    var initCartCounter = function() {
        // Wait for customerData to be available
        var waitForCustomerData = function(callback, maxAttempts) {
            maxAttempts = maxAttempts || 50;
            var attempts = 0;
            
            var checkCustomerData = function() {
                attempts++;
                if (typeof window.customerData !== 'undefined') {
                    callback();
                } else if (attempts < maxAttempts) {
                    setTimeout(checkCustomerData, 100);
                }
            };
            
            checkCustomerData();
        };
        
        waitForCustomerData(function() {
            // Initial update
            setTimeout(updateCartCount, 500);
            
            // Listen for customerData cart updates (KnockoutJS observable)
            try {
                var cartDataObservable = window.customerData.get('cart');
                if (cartDataObservable) {
                    // Try to subscribe if it's a Knockout observable
                    if (typeof cartDataObservable.subscribe === 'function') {
                        cartDataObservable.subscribe(function(cartData) {
                            updateCartCount();
                        });
                    }
                    
                    // Also try to watch for changes if it has valueHasMutated
                    if (typeof cartDataObservable.valueHasMutated === 'function') {
                        var originalValueHasMutated = cartDataObservable.valueHasMutated;
                        cartDataObservable.valueHasMutated = function() {
                            originalValueHasMutated.apply(this, arguments);
                            updateCartCount();
                        };
                    }
                }
            } catch (e) {
                console.warn('Error subscribing to cart data:', e);
            }
        });
        
        // Also listen for custom events
        $(document).on('ajax:addToCart', function() {
            setTimeout(updateCartCount, 500);
        });
        
        $(document).on('updateMiniCart', function() {
            setTimeout(updateCartCount, 500);
        });
        
        $(document).on('contentUpdated', function() {
            setTimeout(updateCartCount, 300);
        });
        
        // Periodic update check (fallback)
        setInterval(function() {
            updateCartCount();
        }, 3000);
    };
    
    return {
        init: initCartCounter,
        update: updateCartCount
    };
});

