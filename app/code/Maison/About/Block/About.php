<?php
/**
 * Maison de Pierre - About Page Block
 */
namespace Maison\About\Block;

use Magento\Framework\View\Element\Template;
use Maison\About\Model\ResourceModel\Section\CollectionFactory as SectionCollectionFactory;
use Maison\About\Model\ResourceModel\TeamMember\CollectionFactory as TeamCollectionFactory;
use Maison\About\Model\ResourceModel\Value\CollectionFactory as ValueCollectionFactory;

class About extends Template
{
    /**
     * @var SectionCollectionFactory
     */
    protected $sectionCollectionFactory;

    /**
     * @var TeamCollectionFactory
     */
    protected $teamCollectionFactory;

    /**
     * @var ValueCollectionFactory
     */
    protected $valueCollectionFactory;

    /**
     * @param Template\Context $context
     * @param SectionCollectionFactory $sectionCollectionFactory
     * @param TeamCollectionFactory $teamCollectionFactory
     * @param ValueCollectionFactory $valueCollectionFactory
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        SectionCollectionFactory $sectionCollectionFactory,
        TeamCollectionFactory $teamCollectionFactory,
        ValueCollectionFactory $valueCollectionFactory,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->sectionCollectionFactory = $sectionCollectionFactory;
        $this->teamCollectionFactory = $teamCollectionFactory;
        $this->valueCollectionFactory = $valueCollectionFactory;
    }

    /**
     * Get sections by type
     *
     * @param string $type
     * @return \Maison\About\Model\ResourceModel\Section\Collection
     */
    public function getSectionsByType($type)
    {
        $collection = $this->sectionCollectionFactory->create();
        $collection->addActiveFilter()
            ->addTypeFilter($type)
            ->setOrderBySortOrder();
        
        return $collection;
    }

    /**
     * Get hero section
     *
     * @return \Maison\About\Model\Section|null
     */
    public function getHeroSection()
    {
        $collection = $this->getSectionsByType('hero');
        return $collection->getFirstItem();
    }

    /**
     * Get mission section
     *
     * @return \Maison\About\Model\Section|null
     */
    public function getMissionSection()
    {
        $collection = $this->getSectionsByType('mission');
        return $collection->getFirstItem();
    }

    /**
     * Get story section
     *
     * @return \Maison\About\Model\Section|null
     */
    public function getStorySection()
    {
        $collection = $this->getSectionsByType('story');
        return $collection->getFirstItem();
    }

    /**
     * Get all team members
     *
     * @return \Maison\About\Model\ResourceModel\TeamMember\Collection
     */
    public function getTeamMembers()
    {
        $collection = $this->teamCollectionFactory->create();
        $collection->addActiveFilter()
            ->setOrderBySortOrder();
        
        return $collection;
    }

    /**
     * Get all values
     *
     * @return \Maison\About\Model\ResourceModel\Value\Collection
     */
    public function getValues()
    {
        $collection = $this->valueCollectionFactory->create();
        $collection->addActiveFilter()
            ->setOrderBySortOrder();
        
        return $collection;
    }

    /**
     * Get section content by type
     *
     * @param string $type
     * @return string
     */
    public function getSectionContent($type)
    {
        $section = $this->getSectionsByType($type)->getFirstItem();
        return $section->getContent() ?: '';
    }
}

