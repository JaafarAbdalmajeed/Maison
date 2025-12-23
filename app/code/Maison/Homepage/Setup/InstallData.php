<?php
/**
 * Maison de Pierre - Sample Data Installer
 * Safely adds sample products, categories, and brands
 */
namespace Maison\Homepage\Setup;

use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Catalog\Model\ProductFactory;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\CategoryFactory;
use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\App\State;
use Psr\Log\LoggerInterface;

class InstallData implements InstallDataInterface
{
    /**
     * @var ProductFactory
     */
    protected $productFactory;

    /**
     * @var ProductRepositoryInterface
     */
    protected $productRepository;

    /**
     * @var CategoryFactory
     */
    protected $categoryFactory;

    /**
     * @var CategoryRepositoryInterface
     */
    protected $categoryRepository;

    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;

    /**
     * @var EavSetupFactory
     */
    protected $eavSetupFactory;

    /**
     * @var State
     */
    protected $appState;

    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * @param ProductFactory $productFactory
     * @param ProductRepositoryInterface $productRepository
     * @param CategoryFactory $categoryFactory
     * @param CategoryRepositoryInterface $categoryRepository
     * @param StoreManagerInterface $storeManager
     * @param EavSetupFactory $eavSetupFactory
     * @param State $appState
     * @param LoggerInterface $logger
     */
    public function __construct(
        ProductFactory $productFactory,
        ProductRepositoryInterface $productRepository,
        CategoryFactory $categoryFactory,
        CategoryRepositoryInterface $categoryRepository,
        StoreManagerInterface $storeManager,
        EavSetupFactory $eavSetupFactory,
        State $appState,
        LoggerInterface $logger
    ) {
        $this->productFactory = $productFactory;
        $this->productRepository = $productRepository;
        $this->categoryFactory = $categoryFactory;
        $this->categoryRepository = $categoryRepository;
        $this->storeManager = $storeManager;
        $this->eavSetupFactory = $eavSetupFactory;
        $this->appState = $appState;
        $this->logger = $logger;
    }

    /**
     * {@inheritdoc}
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        try {
            // Set area code to avoid errors
            if (!$this->appState->getAreaCode()) {
                $this->appState->setAreaCode(\Magento\Framework\App\Area::AREA_FRONTEND);
            }

            // Create categories first
            $this->createCategories();

            // Create brand attribute if it doesn't exist
            $this->createBrandAttribute($setup);

            // Create products
            $this->createProducts();

            $this->logger->info('Maison Homepage: Sample data installed successfully');

        } catch (\Exception $e) {
            $this->logger->error('Maison Homepage: Error installing sample data - ' . $e->getMessage());
            // Don't throw - just log the error so installation doesn't fail
        }

        $setup->endSetup();
    }

    /**
     * Create sample categories
     */
    protected function createCategories()
    {
        $store = $this->storeManager->getStore();
        $rootCategoryId = $store->getRootCategoryId();

        $categories = [
            [
                'name' => 'Seating',
                'url_key' => 'seating',
                'image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=700&fit=crop&q=80',
                'position' => 10
            ],
            [
                'name' => 'Tables',
                'url_key' => 'tables',
                'image' => 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=700&fit=crop&q=80',
                'position' => 20
            ],
            [
                'name' => 'Lighting',
                'url_key' => 'lighting',
                'image' => 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=700&fit=crop&q=80',
                'position' => 30
            ],
            [
                'name' => 'Décor',
                'url_key' => 'decor',
                'image' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=700&fit=crop&q=80',
                'position' => 40
            ]
        ];

        foreach ($categories as $categoryData) {
            try {
                // Check if category already exists
                $existingCategory = $this->categoryFactory->create()
                    ->getCollection()
                    ->addAttributeToFilter('url_key', $categoryData['url_key'])
                    ->addAttributeToFilter('level', 2)
                    ->getFirstItem();

                if ($existingCategory->getId()) {
                    $this->logger->info("Category '{$categoryData['name']}' already exists, skipping.");
                    continue;
                }

                $category = $this->categoryFactory->create();
                $category->setName($categoryData['name'])
                    ->setUrlKey($categoryData['url_key'])
                    ->setIsActive(true)
                    ->setIncludeInMenu(true)
                    ->setPosition($categoryData['position'])
                    ->setParentId($rootCategoryId)
                    ->setStoreId($store->getId())
                    ->setPath("1/{$rootCategoryId}");

                $this->categoryRepository->save($category);
                $this->logger->info("Category '{$categoryData['name']}' created successfully.");

            } catch (\Exception $e) {
                $this->logger->error("Error creating category '{$categoryData['name']}': " . $e->getMessage());
            }
        }
    }

    /**
     * Create brand attribute
     */
    protected function createBrandAttribute($setup)
    {
        $eavSetup = $this->eavSetupFactory->create(['setup' => $setup]);

        // Check if attribute already exists
        if ($eavSetup->getAttributeId(Product::ENTITY, 'brand')) {
            return;
        }

        $eavSetup->addAttribute(
            Product::ENTITY,
            'brand',
            [
                'type' => 'varchar',
                'label' => 'Brand',
                'input' => 'select',
                'source' => '',
                'required' => false,
                'sort_order' => 100,
                'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                'used_in_product_listing' => true,
                'visible_on_front' => true,
                'user_defined' => true,
                'searchable' => true,
                'filterable' => true,
                'comparable' => true,
                'visible_in_advanced_search' => true,
                'is_html_allowed_on_front' => false,
                'used_for_promo_rules' => true,
            ]
        );

        // Add brand options
        $attributeId = $eavSetup->getAttributeId(Product::ENTITY, 'brand');
        $option = [
            'attribute_id' => $attributeId,
            'values' => [
                ['D&G', 'Dolce & Gabbana'],
                ['VIDO', 'Vido'],
                ['BITOSSI', 'Bitossi'],
                ['BACI', 'Baci Milano'],
                ['VOLUSPA', 'Voluspa'],
                ['TASCHEN', 'Taschen']
            ]
        ];
        $eavSetup->addAttributeOption($option);
    }

    /**
     * Create sample products
     */
    protected function createProducts()
    {
        $store = $this->storeManager->getStore();
        $storeId = $store->getId();

        $products = [
            [
                'sku' => 'LUXOR-ARMCHAIR-001',
                'name' => 'Luxor Velvet Armchair',
                'price' => 3450.00,
                'brand' => 'D&G',
                'description' => 'Elegant velvet armchair with luxurious comfort. Handcrafted with premium materials and timeless design. Perfect for modern living spaces.',
                'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop&q=80',
                'bestseller' => true
            ],
            [
                'sku' => 'MARBLE-CONSOLE-001',
                'name' => 'Marble Console Table',
                'price' => 5200.00,
                'brand' => 'VIDO',
                'description' => 'Stunning marble console table with elegant design. Perfect centerpiece for any luxury home.',
                'image' => 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=1000&fit=crop&q=80',
                'bestseller' => true
            ],
            [
                'sku' => 'CRYSTAL-CHANDELIER-001',
                'name' => 'Crystal Chandelier',
                'price' => 8900.00,
                'brand' => 'BITOSSI',
                'description' => 'Exquisite crystal chandelier that adds elegance and sophistication to any room.',
                'image' => 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=1000&fit=crop&q=80',
                'bestseller' => true
            ],
            [
                'sku' => 'VELVET-SOFA-001',
                'name' => 'Velvet Sofa Set',
                'price' => 12500.00,
                'brand' => 'BACI',
                'description' => 'Luxurious velvet sofa set with premium comfort and timeless elegance.',
                'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop&q=80',
                'bestseller' => true
            ],
            [
                'sku' => 'DESIGNER-LAMP-001',
                'name' => 'Designer Floor Lamp',
                'price' => 1800.00,
                'brand' => 'VOLUSPA',
                'description' => 'Modern designer floor lamp that combines functionality with artistic design.',
                'image' => 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=1000&fit=crop&q=80',
                'bestseller' => true
            ],
            [
                'sku' => 'LUXURY-BOOKCASE-001',
                'name' => 'Luxury Bookcase',
                'price' => 4200.00,
                'brand' => 'TASCHEN',
                'description' => 'Elegant bookcase designed for the modern bibliophile. Perfect for displaying your collection.',
                'image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&q=80',
                'bestseller' => true
            ]
        ];

        foreach ($products as $productData) {
            try {
                // Check if product already exists
                try {
                    $existingProduct = $this->productRepository->get($productData['sku']);
                    $this->logger->info("Product '{$productData['sku']}' already exists, skipping.");
                    continue;
                } catch (\Magento\Framework\Exception\NoSuchEntityException $e) {
                    // Product doesn't exist, create it
                }

                $product = $this->productFactory->create();
                $product->setSku($productData['sku'])
                    ->setName($productData['name'])
                    ->setAttributeSetId(4) // Default attribute set
                    ->setStatus(\Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED)
                    ->setVisibility(\Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
                    ->setTypeId('simple')
                    ->setPrice($productData['price'])
                    ->setStockData([
                        'use_config_manage_stock' => 0,
                        'manage_stock' => 1,
                        'is_in_stock' => 1,
                        'qty' => 100
                    ])
                    ->setDescription($productData['description'])
                    ->setShortDescription($productData['description'])
                    ->setStoreId($storeId)
                    ->setWebsiteIds([$this->storeManager->getWebsite()->getId()]);

                // Set brand if attribute exists
                try {
                    if ($product->getResource()->getAttribute('brand')) {
                        $product->setData('brand', $productData['brand']);
                    }
                } catch (\Exception $e) {
                    // Brand attribute might not exist yet, skip
                }

                // Set bestseller attribute if it exists
                try {
                    if ($product->getResource()->getAttribute('bestseller')) {
                        $product->setData('bestseller', $productData['bestseller'] ? 1 : 0);
                    }
                } catch (\Exception $e) {
                    // Bestseller attribute might not exist, skip
                }

                $this->productRepository->save($product);
                $this->logger->info("Product '{$productData['sku']}' created successfully.");

            } catch (\Exception $e) {
                $this->logger->error("Error creating product '{$productData['sku']}': " . $e->getMessage());
            }
        }
    }
}

