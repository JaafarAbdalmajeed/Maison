<?php
/**
 * Maison de Pierre - Brands Block
 * Dynamic brand collection for homepage and header
 */
namespace Maison\Homepage\Block;

use Magento\Framework\View\Element\Template;
use Magento\Eav\Model\Config;
use Magento\Catalog\Model\ResourceModel\Product\CollectionFactory;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class Brands extends Template
{
    /**
     * @var Config
     */
    protected $eavConfig;

    /**
     * @var CollectionFactory
     */
    protected $productCollectionFactory;

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
     * @param Config $eavConfig
     * @param CollectionFactory $productCollectionFactory
     * @param StoreManagerInterface $storeManager
     * @param ScopeConfigInterface $scopeConfig
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        Config $eavConfig,
        CollectionFactory $productCollectionFactory,
        StoreManagerInterface $storeManager,
        ScopeConfigInterface $scopeConfig,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->eavConfig = $eavConfig;
        $this->productCollectionFactory = $productCollectionFactory;
        $this->storeManager = $storeManager;
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Get all brands with product counts
     *
     * @param int|null $limit Maximum number of brands to return
     * @return array
     */
    public function getBrands($limit = null)
    {
        try {
            $attribute = $this->eavConfig->getAttribute('catalog_product', 'brand');
            if (!$attribute || !$attribute->getId()) {
                return [];
            }

            // Get all brand options
            $options = $attribute->getSource()->getAllOptions(false);
            
            if (empty($options)) {
                return [];
            }

            $storeId = $this->storeManager->getStore()->getId();
            $brands = [];

            foreach ($options as $option) {
                if (empty($option['value']) || empty($option['label'])) {
                    continue;
                }

                // Get product count for this brand
                $productCollection = $this->productCollectionFactory->create();
                $productCollection->addAttributeToSelect('entity_id')
                    ->addAttributeToFilter('brand', $option['value'])
                    ->addAttributeToFilter('status', \Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED)
                    ->addAttributeToFilter('visibility', [
                        \Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH,
                        \Magento\Catalog\Model\Product\Visibility::VISIBILITY_IN_CATALOG
                    ])
                    ->setStoreId($storeId);

                $count = $productCollection->getSize();

                // Only include brands that have products
                if ($count > 0) {
                    $brands[] = [
                        'value' => $option['value'],
                        'label' => $option['label'],
                        'count' => $count,
                        'url' => $this->getBrandUrl($option['value'])
                    ];
                }
            }

            // Sort by label
            usort($brands, function($a, $b) {
                return strcmp($a['label'], $b['label']);
            });

            // Apply limit if specified
            if ($limit !== null && $limit > 0) {
                $brands = array_slice($brands, 0, $limit);
            }

            return $brands;
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Get brand URL for filtering products
     *
     * @param int|string $brandValue
     * @return string
     */
    public function getBrandUrl($brandValue)
    {
        try {
            $attribute = $this->eavConfig->getAttribute('catalog_product', 'brand');
            if (!$attribute) {
                return '#';
            }

            // Get root category to create proper filter URL
            $rootCategoryId = $this->storeManager->getStore()->getRootCategoryId();
            
            // Create URL with brand filter
            $query = [$attribute->getAttributeCode() => $brandValue];
            return $this->getUrl('catalog/category/view', [
                'id' => $rootCategoryId,
                '_query' => $query,
                '_use_rewrite' => true
            ]);
        } catch (\Exception $e) {
            return '#';
        }
    }

    /**
     * Get brand search URL (alternative method)
     *
     * @param string $brandName
     * @return string
     */
    public function getBrandSearchUrl($brandName)
    {
        return $this->getUrl('catalogsearch/result', ['q' => $brandName]);
    }

    /**
     * Get brand logo text (first letters or abbreviation)
     *
     * @param string $brandName
     * @return string
     */
    public function getBrandLogoText($brandName)
    {
        // Extract first letters or use abbreviation
        $words = explode(' ', $brandName);
        if (count($words) > 1) {
            // Multiple words: use first letter of each word
            $logo = '';
            foreach ($words as $word) {
                if (!empty($word)) {
                    $logo .= strtoupper(substr($word, 0, 1));
                }
            }
            return $logo;
        } else {
            // Single word: use first 3-4 letters
            return strtoupper(substr($brandName, 0, min(4, strlen($brandName))));
        }
    }
}

