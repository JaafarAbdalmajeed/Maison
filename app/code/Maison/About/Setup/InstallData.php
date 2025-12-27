<?php
/**
 * Maison de Pierre - About Page Install Data
 */
namespace Maison\About\Setup;

use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

class InstallData implements InstallDataInterface
{
    /**
     * @var ModuleDataSetupInterface
     */
    protected $setup;

    /**
     * {@inheritdoc}
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        // Insert default about sections
        $sections = [
            [
                'section_type' => 'hero',
                'title' => 'About Maison de Pierre',
                'content' => 'Discover our journey in curating luxury furniture and home décor',
                'image_url' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80',
                'image_alt' => 'Maison de Pierre Showroom',
                'sort_order' => 1,
                'is_active' => 1
            ],
            [
                'section_type' => 'mission',
                'title' => 'Our Mission',
                'content' => 'At Maison de Pierre, we believe that your home is more than just a space—it\'s a reflection of your taste, your journey, and your vision of beauty. We are committed to delivering not just furniture, but experiences that transform houses into homes filled with sophistication and soul.',
                'image_url' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
                'image_alt' => 'Luxury Interior',
                'sort_order' => 2,
                'is_active' => 1
            ],
            [
                'section_type' => 'story',
                'title' => 'Our Story',
                'content' => 'For years, we have dedicated ourselves to sourcing the finest luxury furniture and home décor from the world\'s most prestigious brands. Our carefully curated collection brings together timeless elegance and contemporary design, featuring exclusive pieces from renowned houses like Dolce & Gabbana Casa, Vido, Bitossi, and more.',
                'image_url' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
                'image_alt' => 'Elegant Living Space',
                'sort_order' => 3,
                'is_active' => 1
            ]
        ];

        foreach ($sections as $section) {
            $setup->getConnection()->insert(
                $setup->getTable('maison_about_sections'),
                $section
            );
        }

        // Insert default values
        $values = [
            [
                'title' => 'Quality',
                'description' => 'We select only the finest materials and craftsmanship, ensuring every piece meets our exacting standards of excellence.',
                'icon' => 'quality',
                'sort_order' => 1,
                'is_active' => 1
            ],
            [
                'title' => 'Elegance',
                'description' => 'Our curated collection represents timeless elegance and sophisticated design that transcends trends.',
                'icon' => 'elegance',
                'sort_order' => 2,
                'is_active' => 1
            ],
            [
                'title' => 'Excellence',
                'description' => 'We are dedicated to providing exceptional service and an unmatched shopping experience for our clients.',
                'icon' => 'excellence',
                'sort_order' => 3,
                'is_active' => 1
            ],
            [
                'title' => 'Innovation',
                'description' => 'We continuously seek out innovative designs and emerging talents in the world of luxury furniture.',
                'icon' => 'innovation',
                'sort_order' => 4,
                'is_active' => 1
            ]
        ];

        foreach ($values as $value) {
            $setup->getConnection()->insert(
                $setup->getTable('maison_about_values'),
                $value
            );
        }

        // Insert default team members
        $team = [
            [
                'name' => 'Pierre Dubois',
                'position' => 'Founder & CEO',
                'bio' => 'With over 20 years of experience in luxury retail, Pierre founded Maison de Pierre to bring world-class furniture design to discerning clients.',
                'image_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
                'email' => 'pierre@maisondepierre.com',
                'linkedin' => 'https://linkedin.com/in/pierredubois',
                'sort_order' => 1,
                'is_active' => 1
            ],
            [
                'name' => 'Sophie Laurent',
                'position' => 'Creative Director',
                'bio' => 'Sophie brings a unique vision to our curation process, combining classical elegance with contemporary sophistication.',
                'image_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
                'email' => 'sophie@maisondepierre.com',
                'linkedin' => 'https://linkedin.com/in/sophielaurent',
                'sort_order' => 2,
                'is_active' => 1
            ],
            [
                'name' => 'Jean-Marc Bernard',
                'position' => 'Head of Operations',
                'bio' => 'Jean-Marc ensures that every detail of our operations runs smoothly, from sourcing to delivery.',
                'image_url' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
                'email' => 'jeanmarc@maisondepierre.com',
                'linkedin' => 'https://linkedin.com/in/jeanmarcbernard',
                'sort_order' => 3,
                'is_active' => 1
            ]
        ];

        foreach ($team as $member) {
            $setup->getConnection()->insert(
                $setup->getTable('maison_about_team'),
                $member
            );
        }

        $setup->endSetup();
    }
}

