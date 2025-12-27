<?php
/**
 * Maison de Pierre - About Page Install Data
 */
namespace Maison\About\Setup;

use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Cms\Model\PageFactory;
use Magento\Cms\Model\Page;
use Magento\Store\Model\Store;
use Psr\Log\LoggerInterface;

class InstallData implements InstallDataInterface
{
    /**
     * @var PageFactory
     */
    private $pageFactory;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @param PageFactory $pageFactory
     * @param LoggerInterface $logger
     */
    public function __construct(
        PageFactory $pageFactory,
        LoggerInterface $logger
    ) {
        $this->pageFactory = $pageFactory;
        $this->logger = $logger;
    }

    /**
     * {@inheritdoc}
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        // Create CMS Page for About
        try {
            $page = $this->pageFactory->create();
            
            // Check if page already exists
            $page->load('about', 'identifier');
            
            if (!$page->getId()) {
                $page->setTitle('About Us')
                    ->setIdentifier('about')
                    ->setIsActive(true)
                    ->setPageLayout('1column')
                    ->setStores([Store::DEFAULT_STORE_ID])
                    ->setContent('<p>This is the About page content. The actual content is managed through the About module.</p>')
                    ->setContentHeading('About Us')
                    ->setMetaTitle('About Us - Maison de Pierre')
                    ->setMetaKeywords('about, maison de pierre, luxury furniture')
                    ->setMetaDescription('Learn more about Maison de Pierre and our commitment to luxury furniture and home décor.')
                    ->save();
                
                $this->logger->info('About CMS page created successfully');
            } else {
                $this->logger->info('About CMS page already exists');
            }
        } catch (\Exception $e) {
            $this->logger->error('Error creating About CMS page: ' . $e->getMessage());
        }

        // Insert default about sections
        $connection = $setup->getConnection();
        
        // Hero Section
        $connection->insert(
            $setup->getTable('maison_about_sections'),
            [
                'section_type' => 'hero',
                'title' => 'About Maison de Pierre',
                'content' => 'Discover our story of luxury and elegance',
                'image_url' => '',
                'image_alt' => 'About Maison de Pierre',
                'sort_order' => 1,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        );

        // Mission Section
        $connection->insert(
            $setup->getTable('maison_about_sections'),
            [
                'section_type' => 'mission',
                'title' => 'Our Mission',
                'content' => 'At Maison de Pierre, we are committed to curating the finest luxury furniture and home décor from the world\'s most prestigious brands. Our mission is to bring elegance, sophistication, and timeless beauty to every home.',
                'image_url' => '',
                'image_alt' => 'Our Mission',
                'sort_order' => 2,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        );

        // Story Section
        $connection->insert(
            $setup->getTable('maison_about_sections'),
            [
                'section_type' => 'story',
                'title' => 'Our Story',
                'content' => 'Founded with a passion for luxury and excellence, Maison de Pierre has been a trusted name in high-end furniture and home décor. We work directly with renowned brands to bring you exclusive pieces that transform spaces into luxurious sanctuaries.',
                'image_url' => '',
                'image_alt' => 'Our Story',
                'sort_order' => 3,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        );

        // Insert default values
        $values = [
            ['Quality', 'We never compromise on quality. Every piece is carefully selected and crafted to perfection.'],
            ['Elegance', 'Elegance is at the heart of everything we offer. Timeless designs that never go out of style.'],
            ['Excellence', 'We strive for excellence in every aspect of our business, from product selection to customer service.'],
            ['Innovation', 'Combining traditional craftsmanship with modern innovation to create extraordinary pieces.']
        ];

        foreach ($values as $index => $value) {
            $connection->insert(
                $setup->getTable('maison_about_values'),
                [
                    'title' => $value[0],
                    'description' => $value[1],
                    'icon' => '',
                    'sort_order' => $index + 1,
                    'is_active' => 1,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ]
            );
        }

        // Insert default team members
        $teamMembers = [
            ['John Doe', 'Founder & CEO', 'Visionary leader with over 20 years in luxury retail.'],
            ['Jane Smith', 'Creative Director', 'Brings artistic vision and design expertise to our collections.'],
            ['Michael Johnson', 'Head of Operations', 'Ensures seamless operations and exceptional customer experience.']
        ];

        foreach ($teamMembers as $index => $member) {
            $connection->insert(
                $setup->getTable('maison_about_team'),
                [
                    'name' => $member[0],
                    'position' => $member[1],
                    'bio' => $member[2],
                    'image_url' => '',
                    'image_alt' => $member[0],
                    'sort_order' => $index + 1,
                    'is_active' => 1,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ]
            );
        }

        $setup->endSetup();
    }
}
