/**
 * Maison de Pierre - RequireJS Configuration (Professional Way)
 */
var config = {
    map: {
        '*': {
            'maisonInit': 'js/maison-init',
            'filterSidebar': 'js/filter-sidebar',
            'ajaxFilters': 'js/ajax-filters',
            'productDetail': 'js/product-detail',
            'cartCounter': 'js/cart-counter',
            'categoryPage': 'js/category',
            'checkoutPage': 'js/checkout',
            'authPage': 'js/auth',
            'contactPage': 'js/contact',
            'accountPage': 'js/account'
        }
    },
    deps: [
        'jquery',
        'mage/common',
        'mage/dataPost',
        'mage/bootstrap'
    ],
    config: {
        mixins: {
            'Magento_Catalog/js/catalog-add-to-cart': {
                'js/product-detail': true
            }
        }
    }
};
