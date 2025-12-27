<?php
/**
 * Maison de Pierre - Footer Block
 * Dynamic footer content from backend
 */
namespace Maison\Homepage\Block;

use Magento\Framework\View\Element\Template;
use Magento\Catalog\Model\ResourceModel\Category\CollectionFactory;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Cms\Model\BlockFactory;

class Footer extends Template
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
     * @var BlockFactory
     */
    protected $blockFactory;

    /**
     * @param Template\Context $context
     * @param CollectionFactory $categoryCollectionFactory
     * @param StoreManagerInterface $storeManager
     * @param BlockFactory $blockFactory
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        CollectionFactory $categoryCollectionFactory,
        StoreManagerInterface $storeManager,
        BlockFactory $blockFactory,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->categoryCollectionFactory = $categoryCollectionFactory;
        $this->storeManager = $storeManager;
        $this->blockFactory = $blockFactory;
    }

    /**
     * Get shop categories for footer
     *
     * @return array
     */
    public function getShopCategories()
    {
        $rootCategoryId = $this->storeManager->getStore()->getRootCategoryId();
        $storeId = $this->storeManager->getStore()->getId();

        $collection = $this->categoryCollectionFactory->create();
        $collection->addAttributeToSelect(['name', 'url_key', 'is_active'])
            ->addAttributeToFilter('parent_id', $rootCategoryId)
            ->addAttributeToFilter('is_active', 1)
            ->setStoreId($storeId)
            ->addIsActiveFilter()
            ->addAttributeToSort('position', 'ASC')
            ->setPageSize(6)
            ->setCurPage(1);

        $categories = [];
        foreach ($collection as $category) {
            $categories[] = [
                'name' => $category->getName(),
                'url' => $category->getUrl()
            ];
        }

        return $categories;
    }

    /**
     * Get CMS block content
     *
     * @param string $identifier
     * @return string
     */
    public function getCmsBlockContent($identifier)
    {
        try {
            $block = $this->blockFactory->create();
            $block->load($identifier, 'identifier');
            if ($block->getId() && $block->isActive()) {
                return $block->getContent();
            }
        } catch (\Exception $e) {
            // Block doesn't exist or error
        }
        return '';
    }

    /**
     * Get footer description from CMS block or default
     *
     * @return string
     */
    public function getFooterDescription()
    {
        $content = $this->getCmsBlockContent('footer-description');
        if ($content) {
            return $content;
        }
        return __('Curating the finest luxury furniture and home décor from the world\'s most prestigious brands.');
    }

    /**
     * Get social media links from config or default
     *
     * @return array
     */
    public function getSocialLinks()
    {
        // Can be configured from backend later
        return [
            'instagram' => 'https://www.instagram.com/maison.de.pierre/',
            'facebook' => '#',
            'twitter' => '#',
            'linkedin' => '#'
        ];
    }
}

