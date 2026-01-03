<?php
/**
 * Maison de Pierre - Cart Count Controller
 */
namespace Maison\Homepage\Controller\Cart;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Checkout\Model\Cart;

class GetCount extends Action
{
    /**
     * @var JsonFactory
     */
    protected $resultJsonFactory;
    
    /**
     * @var Cart
     */
    protected $cart;
    
    /**
     * @param Context $context
     * @param JsonFactory $resultJsonFactory
     * @param Cart $cart
     */
    public function __construct(
        Context $context,
        JsonFactory $resultJsonFactory,
        Cart $cart
    ) {
        parent::__construct($context);
        $this->resultJsonFactory = $resultJsonFactory;
        $this->cart = $cart;
    }
    
    /**
     * Execute action
     *
     * @return \Magento\Framework\Controller\Result\Json
     */
    public function execute()
    {
        $result = $this->resultJsonFactory->create();
        
        try {
            $quote = $this->cart->getQuote();
            $itemsCount = (int) $quote->getItemsCount();
            
            return $result->setData([
                'success' => true,
                'items_count' => $itemsCount,
                'count' => $itemsCount
            ]);
        } catch (\Exception $e) {
            return $result->setData([
                'success' => false,
                'items_count' => 0,
                'count' => 0,
                'error' => $e->getMessage()
            ]);
        }
    }
}

