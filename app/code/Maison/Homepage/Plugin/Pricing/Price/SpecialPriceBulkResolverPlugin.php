<?php
/**
 * Plugin to fix SQL error when empty product IDs array is passed to SpecialPriceBulkResolver
 *
 * Fixes: SQLSTATE[42000]: Syntax error or access violation: 1064 
 * You have an error in your SQL syntax; check the manual that corresponds 
 * to your MariaDB server version for the right syntax to use near '))' at line 4
 */
namespace Maison\Homepage\Plugin\Pricing\Price;

use Magento\Catalog\Pricing\Price\SpecialPriceBulkResolver;

class SpecialPriceBulkResolverPlugin
{
    /**
     * Plugin to handle empty product IDs array around generateSpecialPriceMap
     * 
     * Fixes SQL syntax error when empty array is passed: WHERE (e.entity_id IN ())
     *
     * @param SpecialPriceBulkResolver $subject
     * @param callable $proceed
     * @param array $productIds
     * @return array
     */
    public function aroundGenerateSpecialPriceMap(
        SpecialPriceBulkResolver $subject,
        callable $proceed,
        array $productIds
    ) {
        // If product IDs array is empty, return empty array to prevent SQL error
        if (empty($productIds)) {
            return [];
        }
        
        // Otherwise, proceed with normal execution
        return $proceed($productIds);
    }
}

