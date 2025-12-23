<?php
/**
 * Custom Brand Filter Block
 * Returns brands with product counts from current category
 */
namespace Maison\Catalog\Block\Category\Filter;

use Magento\Framework\View\Element\Template;
use Magento\Catalog\Model\Layer\Resolver;
use Magento\Eav\Model\Config;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\Catalog\Model\Layer\Filter\AttributeFactory;
use Magento\Framework\App\RequestInterface;

class Brands extends Template
{
    protected $_template = 'Maison_Catalog::category/filter/brands.phtml';
    
    protected $layerResolver;
    protected $eavConfig;
    protected $productCollectionFactory;
    protected $attributeFilterFactory;
    protected $request;
    
    public function __construct(
        Template\Context $context,
        Resolver $layerResolver,
        Config $eavConfig,
        CollectionFactory $productCollectionFactory,
        AttributeFactory $attributeFilterFactory,
        RequestInterface $request,
        array $data = []
    ) {
        $this->layerResolver = $layerResolver;
        $this->eavConfig = $eavConfig;
        $this->productCollectionFactory = $productCollectionFactory;
        $this->attributeFilterFactory = $attributeFilterFactory;
        $this->request = $request;
        parent::__construct($context, $data);
    }
    
    /**
     * Get brands with product counts using proper Magento approach
     */
    public function getBrands()
    {
        try {
            $attribute = $this->eavConfig->getAttribute('catalog_product', 'brand');
            if (!$attribute || !$attribute->getId() || !$attribute->getIsFilterable()) {
                return [];
            }
            
            $layer = $this->layerResolver->get();
            $filter = $this->attributeFilterFactory->create(['layer' => $layer]);
            $filter->setAttributeModel($attribute);
            
            // Get items data which includes counts
            $itemsData = $filter->getItemsData();
            
            $brands = [];
            foreach ($itemsData as $itemData) {
                if ($itemData['count'] > 0) {
                    $brands[] = [
                        'value' => $itemData['value'],
                        'label' => $itemData['label'],
                        'count' => $itemData['count']
                    ];
                }
            }
            
            // Sort by label
            usort($brands, function($a, $b) {
                return strcmp($a['label'], $b['label']);
            });
            
            return $brands;
        } catch (\Exception $e) {
            return [];
        }
    }
    
    /**
     * Get filter URL for brand
     */
    public function getBrandUrl($brandValue)
    {
        $attribute = $this->eavConfig->getAttribute('catalog_product', 'brand');
        if (!$attribute) {
            return '#';
        }
        
        $query = [$attribute->getAttributeCode() => $brandValue];
        return $this->getUrl('*/*/*', ['_current' => true, '_use_rewrite' => true, '_query' => $query]);
    }
    
    /**
     * Check if a brand is currently selected
     */
    public function isBrandSelected($brandValue)
    {
        $attribute = $this->eavConfig->getAttribute('catalog_product', 'brand');
        if (!$attribute) {
            return false;
        }
        return $this->request->getParam($attribute->getAttributeCode()) == $brandValue;
    }
}

