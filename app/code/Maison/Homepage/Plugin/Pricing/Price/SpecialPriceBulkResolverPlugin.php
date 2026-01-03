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
use Magento\Framework\Data\Collection\AbstractDb;

class SpecialPriceBulkResolverPlugin
{
    /**
     * Plugin to handle empty product IDs array around generateSpecialPriceMap
     * 
     * Fixes SQL syntax error when empty array is passed: WHERE (e.entity_id IN ())
     * 
     * Note: Method can be called with different parameter types (array or Collection)
     *
     * @param SpecialPriceBulkResolver $subject
     * @param callable $proceed
     * @return array
     */
    public function aroundGenerateSpecialPriceMap(
        SpecialPriceBulkResolver $subject,
        callable $proceed
    ) {
        // Get all arguments passed to the method (excluding $subject and $proceed)
        $args = func_get_args();
        $methodArgs = array_slice($args, 2);
        
        // Check if we have an array argument that is empty
        foreach ($methodArgs as $arg) {
            if (is_array($arg) && empty($arg)) {
                // Return empty array to prevent SQL error when empty array is passed
                return [];
            }
        }
        
        // For Collections or non-empty arrays, let the original method handle them
        // Proceed with normal execution, passing all original arguments
        return call_user_func_array($proceed, $methodArgs);
    }
}

