// ==================== CATEGORY PAGE SCRIPTS ====================

// Mobile submenu toggle for navigation drawer
document.querySelectorAll('.submenu-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const parent = this.closest('li');
        parent.classList.toggle('active');
        
        // Re-initialize icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });
});

// Mobile Filter Toggle
const filterToggle = document.getElementById('filterToggle');
const filtersContainer = document.getElementById('filtersContainer');
const filtersClose = document.getElementById('filtersClose');
const filtersSidebar = document.querySelector('.filters-sidebar');

console.log('Filter elements:', {
    toggle: filterToggle,
    container: filtersContainer,
    sidebar: filtersSidebar
});

if (filterToggle) {
    filterToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Filter toggle clicked!');
        console.log('Container before:', filtersContainer);
        
        if (filtersContainer) {
            filtersContainer.classList.add('active');
            filtersContainer.style.left = '0';
            console.log('Filters container opened, classes:', filtersContainer.classList);
            console.log('Container style.left:', filtersContainer.style.left);
        } else {
            console.error('filtersContainer is null!');
        }
        
        if (filtersSidebar) {
            filtersSidebar.classList.add('active');
            console.log('Sidebar active class added');
        }
        
        document.body.style.overflow = 'hidden';
        
        // Re-initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });
} else {
    console.error('Filter toggle button not found!');
}

if (filtersClose) {
    filtersClose.addEventListener('click', function() {
        filtersContainer.classList.remove('active');
        filtersSidebar.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close filters on overlay click
if (filtersSidebar) {
    filtersSidebar.addEventListener('click', function(e) {
        if (e.target === filtersSidebar) {
            filtersContainer.classList.remove('active');
            filtersSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==================== FILTER FUNCTIONALITY ====================

// Handle filter checkbox changes
document.querySelectorAll('.filter-checkbox input, .color-option input').forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        applyFilters();
    });
});

function applyFilters() {
    // Get all selected filters
    const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
    const selectedPrices = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(cb => cb.value);
    const selectedColors = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(cb => cb.value);
    const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(cb => cb.value);
    const selectedMaterials = Array.from(document.querySelectorAll('input[name="material"]:checked')).map(cb => cb.value);
    
    console.log('Filters Applied:', {
        brands: selectedBrands,
        prices: selectedPrices,
        colors: selectedColors,
        sizes: selectedSizes,
        materials: selectedMaterials
    });
    
    // In Magento, this will trigger AJAX to reload products with filters
    // For now, we'll just log the filters
    // filterProducts(selectedBrands, selectedPrices, selectedColors, selectedSizes, selectedMaterials);
}

// Clear all filters
const clearFiltersBtn = document.getElementById('clearFilters');
if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', function() {
        // Uncheck all checkboxes
        document.querySelectorAll('.filter-checkbox input, .color-option input').forEach(function(checkbox) {
            checkbox.checked = false;
        });
        
        // Reset product grid
        console.log('All filters cleared');
        applyFilters();
    });
}

// ==================== SORTING ====================

const sortSelect = document.getElementById('sortSelect');
if (sortSelect) {
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        console.log('Sort by:', sortValue);
        
        // In Magento, this will trigger AJAX to reload products with sorting
        // sortProducts(sortValue);
    });
}

// ==================== VIEW MODE (Grid/List) ====================

const viewBtns = document.querySelectorAll('.view-btn');
const productsGrid = document.getElementById('productsGrid');

viewBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        const viewMode = this.dataset.view;
        
        // Update active state
        viewBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Update grid class
        if (viewMode === 'list') {
            productsGrid.classList.add('list-view');
        } else {
            productsGrid.classList.remove('list-view');
        }
        
        // Re-initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });
});

// ==================== PRODUCT COUNT UPDATE ====================

function updateProductCount(count) {
    const countElements = document.querySelectorAll('.count-number');
    countElements.forEach(function(element) {
        element.textContent = count;
    });
}

// ==================== AJAX FILTER/SORT (Magento Integration) ====================

// This function will be connected to Magento's layered navigation AJAX
function filterProducts(brands, prices, colors, sizes, materials) {
    // Show loading state
    // productsGrid.classList.add('loading');
    
    // AJAX call to Magento
    // $.ajax({
    //     url: BASE_URL + 'catalogsearch/ajax/filter',
    //     method: 'POST',
    //     data: {
    //         brands: brands,
    //         prices: prices,
    //         colors: colors,
    //         sizes: sizes,
    //         materials: materials
    //     },
    //     success: function(response) {
    //         productsGrid.innerHTML = response.html;
    //         updateProductCount(response.count);
    //         feather.replace();
    //     }
    // });
}

// This function will be connected to Magento's sorting AJAX
function sortProducts(sortBy) {
    // AJAX call to Magento
    // Similar to filterProducts
}

// ==================== SMOOTH SCROLL FOR FILTERS ====================

// When filter is applied, scroll to products
function scrollToProducts() {
    const productsSection = document.querySelector('.products-grid');
    if (productsSection && window.innerWidth < 992) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

console.log('Category page loaded - Filters, sorting, and view modes ready!');

