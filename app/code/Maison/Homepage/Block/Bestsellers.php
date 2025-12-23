<?php
/**
 * Maison de Pierre - Best Sellers Block
 * Dynamic product collection for homepage
 */
namespace Maison\Homepage\Block;

use Magento\Framework\View\Element\Template;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\Catalog\Model\Product\Visibility;
use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class Bestsellers extends Template
{
    /**
     * @var CollectionFactory
     */
    protected $productCollectionFactory;

    /**
     * @var ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * @param Template\Context $context
     * @param CollectionFactory $productCollectionFactory
     * @param ScopeConfigInterface $scopeConfig
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        CollectionFactory $productCollectionFactory,
        ScopeConfigInterface $scopeConfig,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->productCollectionFactory = $productCollectionFactory;
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Get best seller products
     *
     * @return \Magento\Catalog\Model\ResourceModel\Product\Collection
     */
    public function getBestsellerProducts()
    {
        $limit = (int)$this->scopeConfig->getValue(
            'maison_homepage/bestsellers/limit',
            ScopeInterface::SCOPE_STORE
        ) ?: 6;

        // First, try to prioritize products with bestseller or featured attributes if they exist
        try {
            $eavConfig = \Magento\Framework\App\ObjectManager::getInstance()
                ->get(\Magento\Eav\Model\Config::class);
            
            $bestsellerAttr = $eavConfig->getAttribute(\Magento\Catalog\Model\Product::ENTITY, 'bestseller');
            $featuredAttr = $eavConfig->getAttribute(\Magento\Catalog\Model\Product::ENTITY, 'featured');
            
            if (($bestsellerAttr && $bestsellerAttr->getId()) || ($featuredAttr && $featuredAttr->getId())) {
                // Create a new collection with bestseller/featured filter
                $featuredCollection = $this->productCollectionFactory->create();
                $featuredCollection->addAttributeToSelect('*')
                    ->addAttributeToSelect('brand')
                    ->addAttributeToFilter('status', Status::STATUS_ENABLED)
                    ->addAttributeToFilter('visibility', [
                        Visibility::VISIBILITY_BOTH,
                        Visibility::VISIBILITY_IN_CATALOG
                    ])
                    ->addAttributeToFilter([
                        ['attribute' => 'bestseller', 'eq' => 1],
                        ['attribute' => 'featured', 'eq' => 1],
                    ], null, 'left')
                    ->setOrder('type_id', 'DESC') // Configurable first
                    ->setOrder('created_at', 'DESC')
                    ->setPageSize($limit)
                    ->setCurPage(1);
                
                // If we have featured/bestseller products, use them
                if ($featuredCollection->getSize() > 0) {
                    return $featuredCollection;
                }
            }
        } catch (\Exception $e) {
            // If attributes don't exist or error occurs, continue with default collection
        }

        // Default: Get all visible products
        // The template will handle getting brands from parent configurable products if needed
        $collection = $this->productCollectionFactory->create();
        $collection->addAttributeToSelect('*')
            ->addAttributeToSelect('brand')
            ->addAttributeToFilter('status', Status::STATUS_ENABLED)
            ->addAttributeToFilter('visibility', [
                Visibility::VISIBILITY_BOTH,
                Visibility::VISIBILITY_IN_CATALOG
            ])
            ->setOrder('created_at', 'DESC')
            ->setPageSize($limit)
            ->setCurPage(1);
        
        return $collection;
    }

    /**
     * Get product price formatted
     *
     * @param \Magento\Catalog\Model\Product $product
     * @return string
     */
    public function getFormattedPrice($product)
    {
        return $this->getLayout()
            ->getBlock('product.price.render.default')
            ->render('final_price', $product, [
                'include_container' => false,
                'zone' => \Magento\Framework\Pricing\Render::ZONE_ITEM_LIST
            ]);
    }

    /**
     * Get product image URL
     *
     * @param \Magento\Catalog\Model\Product $product
     * @return string
     */
    public function getProductImageUrl($product)
    {
        $image = $product->getImage();
        if ($image && $image != 'no_selection') {
            return $this->_storeManager->getStore()->getBaseUrl(
                \Magento\Framework\UrlInterface::URL_TYPE_MEDIA
            ) . 'catalog/product' . $image;
        }
        // Fallback to placeholder
        return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop&q=80';
    }
}

