<?php
/**
 * Maison de Pierre - About Value Collection
 */
namespace Maison\About\Model\ResourceModel\Value;

use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;
use Maison\About\Model\Value as ValueModel;
use Maison\About\Model\ResourceModel\Value as ValueResource;

class Collection extends AbstractCollection
{
    /**
     * {@inheritdoc}
     */
    protected function _construct()
    {
        $this->_init(ValueModel::class, ValueResource::class);
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

