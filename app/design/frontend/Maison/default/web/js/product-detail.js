/**
 * Product Detail Page JavaScript
 * Custom interactions for product detail page
 */
require(['jquery', 'domReady!'], function($) {
    'use strict';
    
    // Initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Image Zoom Modal
    var zoomModal = $('#zoomModal');
    var zoomImage = $('#zoomImage');
    var zoomClose = $('#zoomClose');
    
    // Open zoom modal
    $('#zoomBtn, .main-product-image').on('click', function() {
        var imageSrc = $('#mainImage').attr('src');
        zoomImage.attr('src', imageSrc);
        zoomModal.addClass('active');
        $('body').css('overflow', 'hidden');
    });
    
    // Close zoom modal
    zoomClose.on('click', function() {
        zoomModal.removeClass('active');
        $('body').css('overflow', '');
    });
    
    // Close on background click
    zoomModal.on('click', function(e) {
        if ($(e.target).is(zoomModal)) {
            zoomModal.removeClass('active');
            $('body').css('overflow', '');
        }
    });
    
    // Close on ESC key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && zoomModal.hasClass('active')) {
            zoomModal.removeClass('active');
            $('body').css('overflow', '');
        }
    });
    
    // Thumbnail scrolling
    window.scrollThumbnails = function(direction) {
        var container = $('#thumbnailsContainer');
        var scrollAmount = 200;
        container.animate({
            scrollLeft: container.scrollLeft() + (direction * scrollAmount)
        }, 300);
    };
    
    // Change main image
    window.changeMainImage = function(imageUrl, thumbnail) {
        $('#mainImage').attr('src', imageUrl);
        $('.thumbnail').removeClass('active');
        $(thumbnail).addClass('active');
        
        // Reinitialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    };
    
    // Quantity controls
    $('#qtyPlus').on('click', function() {
        var qtyInput = $('#qtyInput');
        var currentVal = parseInt(qtyInput.val()) || 1;
        var maxVal = parseInt(qtyInput.attr('max')) || 99;
        if (currentVal < maxVal) {
            qtyInput.val(currentVal + 1);
        }
    });
    
    $('#qtyMinus').on('click', function() {
        var qtyInput = $('#qtyInput');
        var currentVal = parseInt(qtyInput.val()) || 1;
        var minVal = parseInt(qtyInput.attr('min')) || 1;
        if (currentVal > minVal) {
            qtyInput.val(currentVal - 1);
        }
    });
    
    // Tab switching
    $('.tab-btn-vertical').on('click', function() {
        var tabId = $(this).data('tab');
        
        // Update buttons
        $('.tab-btn-vertical').removeClass('active');
        $(this).addClass('active');
        
        // Update panes
        $('.tab-pane').removeClass('active');
        $('#' + tabId).addClass('active');
        
        // Reinitialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });
    
    // Color swatch selection
    $('.color-swatch-btn').on('click', function() {
        $('.color-swatch-btn').removeClass('active');
        $(this).addClass('active');
        var color = $(this).data('color');
        $('#selectedColor').text(color);
    });
    
    // Size selection
    $('.size-btn').on('click', function() {
        $('.size-btn').removeClass('active');
        $(this).addClass('active');
        var size = $(this).data('size');
        $('#selectedSize').text(size);
    });
    
    // Wishlist button
    $('.btn-wishlist-detail').on('click', function(e) {
        e.preventDefault();
        var $button = $(this);
        var postData = $button.data('post');
        
        if (postData) {
            $.ajax({
                url: postData.action,
                type: 'POST',
                data: postData.data,
                success: function(response) {
                    if (response.success) {
                        $button.addClass('active');
                        // Show success message
                        if (typeof require !== 'undefined') {
                            require(['Magento_Ui/js/modal/modal'], function(modal) {
                                // Handle success
                            });
                        }
                    }
                }
            });
        }
    });
    
    // Reinitialize feather icons after AJAX updates
    $(document).on('ajaxComplete', function() {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });
});

