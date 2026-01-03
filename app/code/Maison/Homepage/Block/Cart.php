<?php
/**
 * Maison de Pierre - Cart Block
 * Unified cart data provider
 */
namespace Maison\Homepage\Block;

use Magento\Framework\View\Element\Template;
use Magento\Checkout\Model\Cart;
use Magento\Checkout\Model\Session;

class CartBlock extends Template
{
    /**
     * @var Cart
     */
    protected $cart;
    
    /**
     * @var Session
     */
    protected $checkoutSession;
    
    /**
     * @param Template\Context $context
     * @param Cart $cart
     * @param Session $checkoutSession
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        Cart $cart,
        Session $checkoutSession,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->cart = $cart;
        $this->checkoutSession = $checkoutSession;
    }
    
    /**
     * Get cart items count
     *
     * @return int
     */
    public function getItemsCount()
    {
        try {
            $quote = $this->checkoutSession->getQuote();
            if (!$quote->getId()) {
                $quote = $this->cart->getQuote();
            }
            
            if ($quote->getId()) {
                $quote->collectTotals();
                return (int) $quote->getItemsCount();
            }
        } catch (\Exception $e) {
            // Log error if needed
        }
        
        return 0;
    }
    
    /**
     * Get cart items
     *
     * @return array
     */
    public function getCartItems()
    {
        try {
            $quote = $this->checkoutSession->getQuote();
            if (!$quote->getId()) {
                $quote = $this->cart->getQuote();
            }
            
            if ($quote->getId()) {
                $quote->load($quote->getId());
                $quote->collectTotals();
                return $quote->getAllVisibleItems();
            }
        } catch (\Exception $e) {
            // Log error if needed
        }
        
        return [];
    }
    
    /**
     * Get cart subtotal
     *
     * @return float
     */
    public function getSubtotal()
    {
        try {
            $quote = $this->checkoutSession->getQuote();
            if (!$quote->getId()) {
                $quote = $this->cart->getQuote();
            }
            
            if ($quote->getId()) {
                $quote->collectTotals();
                return (float) ($quote->getSubtotal() ?: $quote->getGrandTotal() ?: 0);
            }
        } catch (\Exception $e) {
            // Log error if needed
        }
        
        return 0.0;
    }
}

