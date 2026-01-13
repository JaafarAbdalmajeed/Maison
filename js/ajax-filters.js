/**
 * AJAX Filter Handler
 * Handles all filter interactions without page reload
 */
define([
    'jquery',
    'domReady!'
], function ($) {
    'use strict';

    var ajaxFiltersInstance = {
        init: function() {
            var self = this;
            
            // Handle all filter link clicks (except price which has its own handler)
            $(document).on('click', '.filter-link:not(.price-filter-link)', function(e) {
                e.preventDefault();
                var filterUrl = $(this).attr('href');
                if (filterUrl) {
                    self.applyFilter(filterUrl);
                }
            });
            
            // Handle browser back/forward buttons
            $(window).on('popstate', function(e) {
                if (e.originalEvent.state && e.originalEvent.state.url) {
                    self.loadPage(e.originalEvent.state.url, false);
                }
            });
            
            // Store initial URL for history
            if (window.history && window.history.replaceState) {
                window.history.replaceState({url: window.location.href}, '', window.location.href);
            }
        },
        
        applyFilter: function(filterUrl) {
            var self = this;
            
            // Show loading state
            self.showLoading();
            
            // Update URL without reload
            if (window.history && window.history.pushState) {
                window.history.pushState({url: filterUrl}, '', filterUrl);
            }
            
            // Load filtered content
            self.loadPage(filterUrl, true);
        },
        
        loadPage: function(url, updateHistory) {
            var self = this;
            
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'html',
                cache: false,
                success: function(response) {
                    // Parse the response
                    var $response = $(response);
                    
                    // Update product list - use specific ID selector to avoid duplication
                    var $existingProductsGrid = $('#productsGrid');
                    if ($existingProductsGrid.length) {
                        var $newProducts = $response.find('#productsGrid');
                        if ($newProducts.length) {
                            // Replace content, not append
                            $existingProductsGrid.empty().html($newProducts.html());
                        } else {
                            // Fallback: find products grid in response
                            var $newGrid = $response.find('.products-grid').first();
                            if ($newGrid.length) {
                                $existingProductsGrid.empty().html($newGrid.html());
                            }
                        }
                    }
                    
                    // Update toolbar (product count, pagination) - be very specific
                    var $existingToolbar = $('.toolbar-products').first();
                    if ($existingToolbar.length) {
                        var $newToolbar = $response.find('.toolbar-products').first();
                        if ($newToolbar.length) {
                            $existingToolbar.replaceWith($newToolbar.clone());
                        }
                    }
                    
                    // Update filter sidebar - replace entire filter block to ensure consistency
                    // But only update the main sidebar, not the overlay
                    var $newFilterBlock = $response.find('.sidebar-main .block.filter').first();
                    if ($newFilterBlock.length) {
                        var $existingFilterBlock = $('.sidebar-main .block.filter').first();
                        if ($existingFilterBlock.length) {
                            // Use replaceWith to ensure proper replacement
                            var $clonedBlock = $newFilterBlock.clone();
                            $existingFilterBlock.replaceWith($clonedBlock);
                        }
                    }
                    
                    // Also update the overlay filter block if it exists
                    var $newOverlayFilterBlock = $response.find('.filter-sidebar-panel .block.filter, .filter-sidebar-content .block.filter').first();
                    if ($newOverlayFilterBlock.length) {
                        var $existingOverlayFilterBlock = $('.filter-sidebar-panel .block.filter, .filter-sidebar-content .block.filter').first();
                        if ($existingOverlayFilterBlock.length) {
                            // Use replaceWith to ensure proper replacement
                            var $clonedOverlayBlock = $newOverlayFilterBlock.clone();
                            $existingOverlayFilterBlock.replaceWith($clonedOverlayBlock);
                        }
                    }
                    
                    // Scroll to top of products
                    var $productsSection = $('#productsGrid');
                    if ($productsSection.length) {
                        $('html, body').animate({
                            scrollTop: $productsSection.offset().top - 100
                        }, 300);
                    }
                    
                    // Hide loading
                    self.hideLoading();
                    
                    // Trigger event for other modules
                    $(document).trigger('filters:applied', [url]);
                },
                error: function(xhr, status, error) {
                    console.error('Filter error:', error);
                    // On error, reload the page normally
                    window.location.href = url;
                }
            });
        },
        
        showLoading: function() {
            if (!$('.filter-loading-overlay').length) {
                $('body').append('<div class="filter-loading-overlay"><div class="filter-loading-spinner"></div></div>');
            }
            $('.filter-loading-overlay').fadeIn(200);
        },
        
        hideLoading: function() {
            $('.filter-loading-overlay').fadeOut(200, function() {
                $(this).remove();
            });
        }
    };
    
    // Initialize on DOM ready
    $(document).ready(function() {
        ajaxFiltersInstance.init();
    });
    
    return ajaxFiltersInstance;
});
