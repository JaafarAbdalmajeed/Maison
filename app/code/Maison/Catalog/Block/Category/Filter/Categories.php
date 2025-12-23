<?php
/**
 * Custom Category Filter Block
 * Returns subcategories with product counts
 */
namespace Maison\Catalog\Block\Category\Filter;

use Magento\Framework\View\Element\Template;
use Magento\Catalog\Model\CategoryFactory;
use Magento\Catalog\Model\ResourceModel\Category\CollectionFactory;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\Registry;
use Magento\Catalog\Model\ResourceModel\Category;

class Categories extends Template
{
    protected $_template = 'Maison_Catalog::category/filter/categories.phtml';
    
    protected $categoryFactory;
    protected $categoryCollectionFactory;
    protected $storeManager;
    protected $registry;
    protected $categoryResource;
    
    public function __construct(
        Template\Context $context,
        CategoryFactory $categoryFactory,
        CollectionFactory $categoryCollectionFactory,
        StoreManagerInterface $storeManager,
        Registry $registry,
        Category $categoryResource,
        array $data = []
    ) {
        $this->categoryFactory = $categoryFactory;
        $this->categoryCollectionFactory = $categoryCollectionFactory;
        $this->storeManager = $storeManager;
        $this->registry = $registry;
        $this->categoryResource = $categoryResource;
        parent::__construct($context, $data);
    }
    
    /**
     * Get subcategories of current category with product counts
     */
    public function getSubcategories()
    {
        $currentCategory = $this->getCurrentCategory();
        if (!$currentCategory) {
            return [];
        }
        
        $storeId = $this->storeManager->getStore()->getId();
        $collection = $this->categoryCollectionFactory->create();
        $collection->addAttributeToSelect(['name', 'url_key', 'is_active'])
            ->addAttributeToFilter('parent_id', $currentCategory->getId())
            ->addAttributeToFilter('is_active', 1)
            ->setStoreId($storeId)
            ->addIsActiveFilter()
            ->addAttributeToSort('position');
        
        $categories = [];
        foreach ($collection as $category) {
            // Get product count using resource model
            $count = $this->categoryResource->getProductCount($category);
            
            if ($count > 0) {
                $categories[] = [
                    'id' => $category->getId(),
                    'name' => $category->getName(),
                    'url' => $category->getUrl(),
                    'count' => $count
                ];
            }
        }
        
        return $categories;
    }
    
    /**
     * Get current category
     */
    protected function getCurrentCategory()
    {
        $category = $this->getData('current_category');
        if (!$category) {
            $category = $this->registry->registry('current_category');
        }
        return $category;
    }
}

