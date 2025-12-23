<?php
/**
 * Maison de Pierre - Categories Block
 * Dynamic category collection for homepage
 */
namespace Maison\Homepage\Block;

use Magento\Framework\View\Element\Template;
use Magento\Catalog\Model\ResourceModel\Category\CollectionFactory;
use Magento\Catalog\Model\Category;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class Categories extends Template
{
    /**
     * @var CollectionFactory
     */
    protected $categoryCollectionFactory;

    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;

    /**
     * @var ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * @param Template\Context $context
     * @param CollectionFactory $categoryCollectionFactory
     * @param StoreManagerInterface $storeManager
     * @param ScopeConfigInterface $scopeConfig
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        CollectionFactory $categoryCollectionFactory,
        StoreManagerInterface $storeManager,
        ScopeConfigInterface $scopeConfig,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->categoryCollectionFactory = $categoryCollectionFactory;
        $this->storeManager = $storeManager;
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Get homepage categories
     *
     * @return \Magento\Catalog\Model\ResourceModel\Category\Collection
     */
    public function getHomepageCategories()
    {
        $limit = (int)$this->scopeConfig->getValue(
            'maison_homepage/categories/limit',
            ScopeInterface::SCOPE_STORE
        ) ?: 4;

        $rootCategoryId = $this->storeManager->getStore()->getRootCategoryId();
        
        $collection = $this->categoryCollectionFactory->create();
        $collection->addAttributeToSelect(['name', 'image', 'url_key', 'is_active', 'path'])
            ->addAttributeToFilter('is_active', 1)
            ->addAttributeToFilter('level', 2) // Direct children of root
            ->addAttributeToFilter('path', ['like' => "1/{$rootCategoryId}/%"])
            ->addAttributeToFilter('entity_id', ['neq' => $rootCategoryId]) // Exclude root category itself
            ->setPageSize($limit)
            ->setCurPage(1)
            ->setOrder('position', 'ASC');

        // If no categories found with the path filter, try a simpler approach
        if ($collection->getSize() == 0) {
            $collection = $this->categoryCollectionFactory->create();
            $collection->addAttributeToSelect(['name', 'image', 'url_key', 'is_active', 'path'])
                ->addAttributeToFilter('is_active', 1)
                ->addAttributeToFilter('level', 2)
                ->addAttributeToFilter('entity_id', ['neq' => $rootCategoryId])
                ->setPageSize($limit)
                ->setCurPage(1)
                ->setOrder('position', 'ASC');
        }

        return $collection;
    }

    /**
     * Get category image URL
     *
     * @param Category $category
     * @return string
     */
    public function getCategoryImageUrl($category)
    {
        $image = $category->getImageUrl();
        if ($image && $image != 'no_selection') {
            return $image;
        }
        // Fallback placeholder
        return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=700&fit=crop&q=80';
    }

    /**
     * Get category URL
     *
     * @param Category $category
     * @return string
     */
    public function getCategoryUrl($category)
    {
        try {
            $url = $category->getUrl();
            // Ensure URL is valid
            if (empty($url) || $url == '#') {
                // Fallback: generate URL manually
                $urlKey = $category->getUrlKey();
                if ($urlKey) {
                    $url = $this->getUrl($urlKey);
                } else {
                    $url = $this->getUrl('catalog/category/view', ['id' => $category->getId()]);
                }
            }
            return $url;
        } catch (\Exception $e) {
            // Fallback to catalog view URL
            return $this->getUrl('catalog/category/view', ['id' => $category->getId()]);
        }
    }
}


