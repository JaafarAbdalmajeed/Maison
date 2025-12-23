<?php
/**
 * Custom Size Filter Block
 * Returns size options with product counts from current category
 */
namespace Maison\Catalog\Block\Category\Filter;

use Magento\Framework\View\Element\Template;
use Magento\Catalog\Model\Layer\Resolver;
use Magento\Eav\Model\Config;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\Catalog\Model\Layer\Filter\AttributeFactory;
use Magento\Framework\App\RequestInterface;

class Size extends Template
{
    protected $_template = 'Maison_Catalog::category/filter/size.phtml';
    
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
     * Get size options with product counts using proper Magento approach
     */
    public function getSizes()
    {
        try {
            $attribute = $this->eavConfig->getAttribute('catalog_product', 'size');
            if (!$attribute || !$attribute->getId() || !$attribute->getIsFilterable()) {
                return [];
            }
            
            $layer = $this->layerResolver->get();
            $filter = $this->attributeFilterFactory->create(['layer' => $layer]);
            $filter->setAttributeModel($attribute);
            
            // Get items data which includes counts
            $itemsData = $filter->getItemsData();
            
            $sizes = [];
            foreach ($itemsData as $itemData) {
                if ($itemData['count'] > 0) {
                    $sizes[] = [
                        'value' => $itemData['value'],
                        'label' => $itemData['label'],
                        'count' => $itemData['count']
                    ];
                }
            }
            
            // Sort by label
            usort($sizes, function($a, $b) {
                return strcmp($a['label'], $b['label']);
            });
            
            return $sizes;
        } catch (\Exception $e) {
            return [];
        }
    }
    
    /**
     * Get filter URL for size
     */
    public function getSizeUrl($sizeValue)
    {
        $attribute = $this->eavConfig->getAttribute('catalog_product', 'size');
        if (!$attribute) {
            return '#';
        }
        
        $query = [$attribute->getAttributeCode() => $sizeValue];
        return $this->getUrl('*/*/*', ['_current' => true, '_use_rewrite' => true, '_query' => $query]);
    }
    
    /**
     * Check if a size is currently selected
     */
    public function isSizeSelected($sizeValue)
    {
        $attribute = $this->eavConfig->getAttribute('catalog_product', 'size');
        if (!$attribute) {
            return false;
        }
        return $this->request->getParam($attribute->getAttributeCode()) == $sizeValue;
    }
}

