/**
 * Maison de Pierre - RequireJS Configuration (Professional Way)
 */
var config = {
    map: {
        '*': {
            'maisonInit': 'js/maison-init',
            'filterSidebar': 'js/filter-sidebar',
            'ajaxFilters': 'js/ajax-filters'
        }
    },
    deps: [
        'jquery',
        'mage/common',
        'mage/dataPost',
        'mage/bootstrap'
    ]
};
