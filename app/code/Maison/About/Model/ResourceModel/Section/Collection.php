<?php
/**
 * Maison de Pierre - About Section Collection
 */
namespace Maison\About\Model\ResourceModel\Section;

use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;
use Maison\About\Model\Section as SectionModel;
use Maison\About\Model\ResourceModel\Section as SectionResource;

class Collection extends AbstractCollection
{
    /**
     * {@inheritdoc}
     */
    protected function _construct()
    {
        $this->_init(SectionModel::class, SectionResource::class);
    }

    /**
     * Filter by section type
     *
     * @param string $type
     * @return $this
     */
    public function addTypeFilter($type)
    {
        return $this->addFieldToFilter('section_type', $type);
    }

    /**
     * Filter by active status
     *
     * @return $this
     */
    public function addActiveFilter()
    {
        return $this->addFieldToFilter('is_active', 1);
    }

    /**
     * Sort by order
     *
     * @return $this
     */
    public function setOrderBySortOrder()
    {
        return $this->setOrder('sort_order', self::SORT_ORDER_ASC);
    }
}

