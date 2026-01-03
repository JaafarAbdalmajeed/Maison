/**
 * Cart Counter Update - Updates cart count in header across all pages
 */
define([
    'jquery',
    'domReady!'
], function($) {
    'use strict';
    
    // Function to update cart count from customerData
    var updateCartCount = function(forceUpdate) {
        var cartCount = 0;
        var hasData = false;
        
        // Try customerData first (Magento's standard way)
        if (typeof window.customerData !== 'undefined') {
            try {
                var cartObservable = window.customerData.get('cart');
                if (cartObservable) {
                    // In Magento 2, customerData.get('cart') returns a Knockout observable
                    // We need to call it as a function to get the value
                    var cartData = null;
                    
                    if (typeof cartObservable === 'function') {
                        // It's a Knockout observable, call it to get the value
                        cartData = cartObservable();
                    } else if (cartObservable && typeof cartObservable === 'object') {
                        // It might already be the data object
                        cartData = cartObservable;
                    }
                    
                    if (cartData && typeof cartData === 'object') {
                        hasData = true;
                        // Try summary_count first (most common in Magento 2)
                        if (cartData.summary_count !== undefined && cartData.summary_count !== null) {
                            cartCount = parseInt(cartData.summary_count) || 0;
                        } 
                        // Fallback to items_qty
                        else if (cartData.items_qty !== undefined && cartData.items_qty !== null) {
                            cartCount = parseInt(cartData.items_qty) || 0;
                        }
                        // Fallback to items_count
                        else if (cartData.items_count !== undefined && cartData.items_count !== null) {
                            cartCount = parseInt(cartData.items_count) || 0;
                        }
                    }
                }
            } catch (e) {
                console.warn('Error getting cart data from customerData:', e);
            }
        }
        
        // If customerData is not available or doesn't have data, try to reload it
        if (!hasData && typeof window.customerData !== 'undefined' && !forceUpdate) {
            try {
                window.customerData.reload(['cart'], false).done(function() {
                    // Retry after reload
                    setTimeout(function() {
                        updateCartCount(true);
                    }, 500);
                });
            } catch (e) {
                console.warn('Error reloading cart data:', e);
            }
        }
        
        // Update all cart count elements
        $('.cart-count').each(function() {
            $(this).text(cartCount > 0 ? cartCount : '0').show();
        });
        
        if (cartCount > 0) {
            console.log('Cart count updated:', cartCount);
        }
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
            // Try to reload cart section to ensure we have fresh data
            if (window.customerData && typeof window.customerData.reload === 'function') {
                try {
                    window.customerData.reload(['cart'], false).done(function() {
                        // Update after reload
                        setTimeout(updateCartCount, 300);
                    }).fail(function() {
                        // If reload fails, still try to update
                        setTimeout(updateCartCount, 300);
                    });
                } catch (e) {
                    // If reload throws error, still try to update
                    setTimeout(updateCartCount, 300);
                }
            } else {
                // Initial update - try multiple times to ensure customerData is fully loaded
                setTimeout(updateCartCount, 300);
                setTimeout(updateCartCount, 800);
                setTimeout(updateCartCount, 1500);
            }
            
            // Listen for customerData cart updates (KnockoutJS observable)
            try {
                var cartDataObservable = window.customerData.get('cart');
                if (cartDataObservable) {
                    // Subscribe to changes if it's a Knockout observable
                    if (typeof cartDataObservable.subscribe === 'function') {
                        cartDataObservable.subscribe(function(cartData) {
                            updateCartCount();
                        }, null, 'change');
                    }
                }
            } catch (e) {
                console.warn('Error subscribing to cart data:', e);
            }
            
            // Also listen to customerData section update events
            if (window.customerData && typeof window.customerData.reload === 'function') {
                // Monitor when cart section is reloaded
                $(document).on('ajaxComplete', function() {
                    setTimeout(updateCartCount, 300);
                });
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

