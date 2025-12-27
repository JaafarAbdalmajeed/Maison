<?php
/**
 * Maison de Pierre - Navigation Block
 * Dynamic navigation menu for header
 */
namespace Maison\Homepage\Block;

use Magento\Framework\View\Element\Template;
use Magento\Catalog\Model\ResourceModel\Category\CollectionFactory;
use Magento\Catalog\Model\ResourceModel\Category\TreeFactory;
use Magento\Catalog\Model\Category;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Catalog\Model\ResourceModel\Category\Collection;

class Navigation extends Template
{
    /**
     * @var CollectionFactory
     */
    protected $categoryCollectionFactory;

    /**
     * @var TreeFactory
     */
    protected $categoryTreeFactory;

    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;

    /**
     * @param Template\Context $context
     * @param CollectionFactory $categoryCollectionFactory
     * @param TreeFactory $categoryTreeFactory
     * @param StoreManagerInterface $storeManager
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        CollectionFactory $categoryCollectionFactory,
        TreeFactory $categoryTreeFactory,
        StoreManagerInterface $storeManager,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->categoryCollectionFactory = $categoryCollectionFactory;
        $this->categoryTreeFactory = $categoryTreeFactory;
        $this->storeManager = $storeManager;
    }

    /**
     * Get categories for navigation menu
     *
     * @param int|null $parentId
     * @param int $level
     * @return array
     */
    public function getNavigationCategories($parentId = null, $level = 2)
    {
        if ($parentId === null) {
            $parentId = $this->storeManager->getStore()->getRootCategoryId();
        }

        $storeId = $this->storeManager->getStore()->getId();
        $collection = $this->categoryCollectionFactory->create();
        $collection->addAttributeToSelect(['name', 'url_key', 'image', 'is_active', 'position'])
            ->addAttributeToFilter('parent_id', $parentId)
            ->addAttributeToFilter('is_active', 1)
            ->setStoreId($storeId)
            ->addIsActiveFilter()
            ->addAttributeToSort('position', 'ASC');

        $categories = [];
        foreach ($collection as $category) {
            $categories[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'url' => $category->getUrl(),
                'url_key' => $category->getUrlKey(),
                'image' => $category->getImageUrl(),
                'has_children' => $category->hasChildren()
            ];
        }

        return $categories;
    }

    /**
     * Get categories grouped by parent
     *
     * @return array
     */
    public function getGroupedCategories()
    {
        $rootCategoryId = $this->storeManager->getStore()->getRootCategoryId();
        $storeId = $this->storeManager->getStore()->getId();

        // Get main categories (level 2)
        $mainCategories = $this->getNavigationCategories($rootCategoryId, 2);

        $grouped = [];
        foreach ($mainCategories as $mainCategory) {
            // Get subcategories
            $subcategories = $this->getNavigationCategories($mainCategory['id'], 3);
            
            $grouped[] = [
                'main' => $mainCategory,
                'subcategories' => $subcategories
            ];
        }

        return $grouped;
    }

    /**
     * Get featured categories for menu
     *
     * @param int $limit
     * @return array
     */
    public function getFeaturedCategories($limit = 6)
    {
        $rootCategoryId = $this->storeManager->getStore()->getRootCategoryId();
        $storeId = $this->storeManager->getStore()->getId();

        $collection = $this->categoryCollectionFactory->create();
        $collection->addAttributeToSelect(['name', 'url_key', 'image', 'is_active', 'position'])
            ->addAttributeToFilter('parent_id', $rootCategoryId)
            ->addAttributeToFilter('is_active', 1)
            ->setStoreId($storeId)
            ->addIsActiveFilter()
            ->addAttributeToSort('position', 'ASC')
            ->setPageSize($limit)
            ->setCurPage(1);

        $categories = [];
        foreach ($collection as $category) {
            $categories[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'url' => $category->getUrl(),
                'image' => $category->getImageUrl() ?: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop'
            ];
        }

        return $categories;
    }

    /**
     * Get category URL
     *
     * @param Category|array $category
     * @return string
     */
    public function getCategoryUrl($category)
    {
        if (is_array($category)) {
            return $category['url'] ?? '#';
        }
        
        try {
            return $category->getUrl();
        } catch (\Exception $e) {
            return '#';
        }
    }

    /**
     * Get category image URL
     *
     * @param Category|array $category
     * @return string
     */
    public function getCategoryImageUrl($category)
    {
        if (is_array($category)) {
            return $category['image'] ?? 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop';
        }
        
        try {
            $image = $category->getImageUrl();
            return $image && $image != 'no_selection' 
                ? $image 
                : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop';
        } catch (\Exception $e) {
            return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop';
        }
    }
}

