/**
 * Wishlist Handler
 * Handles add/remove from wishlist dynamically
 */
define([
    'jquery',
    'Magento_Customer/js/customer-data',
    'mage/translate'
], function ($, customerData, $t) {
    'use strict';

    return {
        init: function() {
            var self = this;
            
            // Handle wishlist button clicks
            $(document).on('click', '.product-wishlist-btn', function(e) {
                e.preventDefault();
                var $btn = $(this);
                var url = $btn.attr('href');
                
                if (!url) {
                    return;
                }
                
                // Show loading state
                $btn.addClass('loading');
                
                // Make AJAX request
                $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    cache: false,
                    success: function(response) {
                        // Update wishlist counter
                        customerData.reload(['wishlist'], false);
                        
                        // Toggle button state
                        if (response.success) {
                            if ($btn.hasClass('in-wishlist')) {
                                $btn.removeClass('in-wishlist');
                                $btn.attr('title', $t('Add to Wishlist'));
                                $btn.find('svg').attr('fill', 'none');
                            } else {
                                $btn.addClass('in-wishlist');
                                $btn.attr('title', $t('Remove from Wishlist'));
                                $btn.find('svg').attr('fill', 'currentColor');
                            }
                        }
                        
                        // Show message if available
                        if (response.message) {
                            // You can add a toast notification here
                            console.log(response.message);
                        }
                    },
                    error: function() {
                        // Handle error
                        console.error('Error updating wishlist');
                    },
                    complete: function() {
                        $btn.removeClass('loading');
                    }
                });
            });
        }
    };
});

