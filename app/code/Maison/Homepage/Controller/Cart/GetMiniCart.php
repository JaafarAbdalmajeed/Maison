<?php
/**
 * Maison de Pierre - Mini Cart Content Controller
 */
namespace Maison\Homepage\Controller\Cart;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\View\Result\PageFactory;
use Magento\Checkout\Model\Cart;

class GetMiniCart extends Action
{
    /**
     * @var JsonFactory
     */
    protected $resultJsonFactory;
    
    /**
     * @var PageFactory
     */
    protected $resultPageFactory;
    
    /**
     * @var Cart
     */
    protected $cart;
    
    /**
     * @param Context $context
     * @param JsonFactory $resultJsonFactory
     * @param PageFactory $resultPageFactory
     * @param Cart $cart
     */
    public function __construct(
        Context $context,
        JsonFactory $resultJsonFactory,
        PageFactory $resultPageFactory,
        Cart $cart
    ) {
        parent::__construct($context);
        $this->resultJsonFactory = $resultJsonFactory;
        $this->resultPageFactory = $resultPageFactory;
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
            $quote->collectTotals();
            
            $items = $quote->getAllVisibleItems();
            $itemsData = [];
            
            foreach ($items as $item) {
                $product = $item->getProduct();
                $imageHelper = $this->_objectManager->get('\Magento\Catalog\Helper\Image');
                $imageUrl = $imageHelper->init($product, 'product_thumbnail_image')
                    ->setImageFile($product->getSmallImage())
                    ->resize(200, 200)
                    ->getUrl();
                
                $itemsData[] = [
                    'id' => $item->getId(),
                    'name' => $item->getName(),
                    'qty' => (int)$item->getQty(),
                    'price' => $item->getPrice(),
                    'image' => $imageUrl ?: '',
                    'url' => $product->getProductUrl()
                ];
            }
            
            return $result->setData([
                'success' => true,
                'items' => $itemsData,
                'items_count' => count($items),
                'subtotal' => $quote->getSubtotal()
            ]);
        } catch (\Exception $e) {
            return $result->setData([
                'success' => false,
                'items' => [],
                'items_count' => 0,
                'subtotal' => 0,
                'error' => $e->getMessage()
            ]);
        }
    }
}

