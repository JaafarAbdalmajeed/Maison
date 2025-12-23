/**
 * Filter Sidebar Toggle
 * Handles opening and closing the filter sidebar overlay
 */
define([
    'jquery',
    'domReady!'
], function ($) {
    'use strict';

    return function (config, element) {
        var filterToggleBtn = $('#filterToggleBtn');
        var filterSidebarOverlay = $(element);
        var filterSidebarClose = $('#filterSidebarClose');

        // Open sidebar
        filterToggleBtn.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            filterSidebarOverlay.addClass('active');
            $('body').addClass('filter-sidebar-open');
        });

        // Close sidebar
        filterSidebarClose.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            filterSidebarOverlay.removeClass('active');
            $('body').removeClass('filter-sidebar-open');
        });

        // Close sidebar when clicking on backdrop
        filterSidebarOverlay.on('click', function (e) {
            // Check if the click target is the backdrop itself, not the panel
            if ($(e.target).hasClass('filter-sidebar-backdrop') || $(e.target).hasClass('filter-sidebar-overlay')) {
                filterSidebarOverlay.removeClass('active');
                $('body').removeClass('filter-sidebar-open');
            }
        });

        // Close sidebar on ESC key
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && filterSidebarOverlay.hasClass('active')) {
                filterSidebarOverlay.removeClass('active');
                $('body').removeClass('filter-sidebar-open');
            }
        });
    };
});

