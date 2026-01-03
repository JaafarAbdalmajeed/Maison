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
        
        // Find array or collection argument - check all parameters
        $productIds = null;
        $productIdsIndex = null;
        
        foreach ($methodArgs as $index => $arg) {
            if (is_array($arg)) {
                $productIds = $arg;
                $productIdsIndex = $index;
                break;
            }
            // Collection objects might be passed instead of arrays
            // We'll let it pass through and let the original method handle it
        }
        
        // If we found an array and it's empty, return empty array to prevent SQL error
        if ($productIds !== null && empty($productIds)) {
            return [];
        }
        
        // Proceed with normal execution, passing all original arguments
        return call_user_func_array($proceed, $methodArgs);
    }
}

