/**
 * Cart Counter & Mini Cart Manager
 * Unified cart functionality across all pages
 */
define([
    'jquery',
    'domReady!',
    'mage/url'
], function($, domReady, urlBuilder) {
    'use strict';
    
    var cartCountCache = null;
    var updateInProgress = false;
    var minicartUpdateInProgress = false;
    
    /**
     * Get cart count from Magento via AJAX
     */
    var getCartCountViaAjax = function(callback) {
        if (updateInProgress) {
            if (typeof callback === 'function') {
                callback(cartCountCache !== null ? cartCountCache : 0);
            }
            return;
        }
        
        updateInProgress = true;
        
        $.ajax({
            url: urlBuilder.build('maison/cart/getCount'),
            type: 'GET',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            success: function(response) {
                updateInProgress = false;
                var count = 0;
                
                if (response && typeof response.items_count !== 'undefined') {
                    count = parseInt(response.items_count) || 0;
                } else if (response && typeof response.count !== 'undefined') {
                    count = parseInt(response.count) || 0;
                } else if (typeof response === 'number') {
                    count = parseInt(response) || 0;
                }
                
                cartCountCache = count;
                if (typeof callback === 'function') {
                    callback(count);
                }
            },
            error: function() {
                updateInProgress = false;
                // Fallback to customerData method
                getCartCountFromCustomerData(callback);
            }
        });
    };
    
    /**
     * Get cart count from customerData (Magento's standard way)
     */
    var getCartCountFromCustomerData = function(callback) {
        var cartCount = 0;
        
        if (typeof window.customerData !== 'undefined') {
            try {
                var cartObservable = window.customerData.get('cart');
                if (cartObservable) {
                    var cartData = null;
                    
                    if (typeof cartObservable === 'function') {
                        cartData = cartObservable();
                    } else if (cartObservable && typeof cartObservable === 'object') {
                        cartData = cartObservable;
                    }
                    
                    if (cartData && typeof cartData === 'object') {
                        if (cartData.summary_count !== undefined && cartData.summary_count !== null) {
                            cartCount = parseInt(cartData.summary_count) || 0;
                        } else if (cartData.items_qty !== undefined && cartData.items_qty !== null) {
                            cartCount = parseInt(cartData.items_qty) || 0;
                        } else if (cartData.items_count !== undefined && cartData.items_count !== null) {
                            cartCount = parseInt(cartData.items_count) || 0;
                        } else if (cartData.count !== undefined && cartData.count !== null) {
                            cartCount = parseInt(cartData.count) || 0;
                        }
                    }
                }
            } catch (e) {
                console.warn('Error getting cart data from customerData:', e);
            }
        }
        
        if (cartCount > 0) {
            cartCountCache = cartCount;
        }
        
        if (typeof callback === 'function') {
            callback(cartCount);
        }
    };
    
    /**
     * Update cart count display
     */
    var updateCartCount = function(count) {
        var displayCount = count !== undefined ? count : cartCountCache;
        
        if (displayCount === null || displayCount === undefined) {
            displayCount = 0;
        }
        
        displayCount = parseInt(displayCount) || 0;
        
        // Update all cart count elements - always show, never hide
        $('.cart-count').each(function() {
            var $element = $(this);
            $element.text(displayCount).css({
                'display': 'flex',
                'visibility': 'visible',
                'opacity': '1'
            });
        });
        
        return displayCount;
    };
    
    /**
     * Update minicart content via AJAX
     */
    var updateMiniCartContent = function() {
        if (minicartUpdateInProgress) {
            return;
        }
        
        minicartUpdateInProgress = true;
        
        // Reload customerData cart section
        if (typeof window.customerData !== 'undefined') {
            window.customerData.reload(['cart'], false).done(function() {
                // Reload page section that contains minicart
                $.ajax({
                    url: window.location.href,
                    type: 'GET',
                    cache: false,
                    success: function(html) {
                        var $newHtml = $(html);
                        var $newMiniCart = $newHtml.find('#miniCart');
                        if ($newMiniCart.length) {
                            $('#miniCart').replaceWith($newMiniCart);
                            // Re-initialize minicart handlers
                            initMiniCartHandlers();
                        }
                        minicartUpdateInProgress = false;
                    },
                    error: function() {
                        minicartUpdateInProgress = false;
                    }
                });
            }).fail(function() {
                minicartUpdateInProgress = false;
            });
        } else {
            minicartUpdateInProgress = false;
        }
    };
    
    /**
     * Initialize minicart event handlers
     */
    var initMiniCartHandlers = function() {
        // Close mini cart
        $(document).off('click', '#miniCartClose, #miniCartOverlay').on('click', '#miniCartClose, #miniCartOverlay', function() {
            $('#miniCart').removeClass('active');
            $('body').removeClass('minicart-open');
        });
    };
    
    /**
     * Main function to fetch and update cart count
     */
    var fetchAndUpdateCartCount = function(useCache) {
        // If we have cached value and useCache is true, use it immediately
        if (useCache && cartCountCache !== null) {
            updateCartCount(cartCountCache);
        }
        
        // Try AJAX first (most reliable)
        getCartCountViaAjax(function(count) {
            updateCartCount(count);
        });
    };
    
    /**
     * Initialize cart counter
     */
    var initCartCounter = function() {
        // Initial update on page load
        setTimeout(function() {
            fetchAndUpdateCartCount(false);
        }, 500);
        
        // Also try after a delay to ensure page is fully loaded
        setTimeout(function() {
            fetchAndUpdateCartCount(false);
        }, 1500);
        
        // Wait for customerData and subscribe to changes
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
            // Reload cart section to ensure fresh data
            if (window.customerData && typeof window.customerData.reload === 'function') {
                try {
                    window.customerData.reload(['cart'], false).done(function() {
                        setTimeout(function() {
                            fetchAndUpdateCartCount(false);
                        }, 300);
                    });
                } catch (e) {
                    // Ignore errors
                }
            }
            
            // Subscribe to cart data changes
            try {
                var cartDataObservable = window.customerData.get('cart');
                if (cartDataObservable && typeof cartDataObservable.subscribe === 'function') {
                    cartDataObservable.subscribe(function(cartData) {
                        setTimeout(function() {
                            fetchAndUpdateCartCount(false);
                            // Also update minicart if it's open
                            if ($('#miniCart').hasClass('active')) {
                                updateMiniCartContent();
                            }
                        }, 300);
                    }, null, 'change');
                }
            } catch (e) {
                // Ignore errors
            }
        });
        
        // Listen for custom events
        $(document).on('ajax:addToCart', function() {
            setTimeout(function() {
                fetchAndUpdateCartCount(false);
                updateMiniCartContent();
            }, 500);
        });
        
        $(document).on('updateMiniCart', function() {
            setTimeout(function() {
                fetchAndUpdateCartCount(false);
                updateMiniCartContent();
            }, 500);
        });
        
        $(document).on('contentUpdated', function() {
            setTimeout(function() {
                fetchAndUpdateCartCount(false);
            }, 300);
        });
        
        $(document).on('checkout:updateCart', function() {
            setTimeout(function() {
                fetchAndUpdateCartCount(false);
                updateMiniCartContent();
            }, 300);
        });
        
        // Periodic update check (every 5 seconds as fallback)
        setInterval(function() {
            fetchAndUpdateCartCount(true);
        }, 5000);
        
        // Update when page becomes visible (user switches tabs)
        $(document).on('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(function() {
                    fetchAndUpdateCartCount(false);
                }, 500);
            }
        });
        
        // Initialize minicart handlers
        initMiniCartHandlers();
    };
    
    return {
        init: initCartCounter,
        update: fetchAndUpdateCartCount,
        updateMiniCart: updateMiniCartContent,
        getCount: function() {
            return cartCountCache !== null ? cartCountCache : 0;
        }
    };
});
