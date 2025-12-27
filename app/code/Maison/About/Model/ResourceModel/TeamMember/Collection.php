<?php
/**
 * Maison de Pierre - Team Member Collection
 */
namespace Maison\About\Model\ResourceModel\TeamMember;

use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;
use Maison\About\Model\TeamMember as TeamMemberModel;
use Maison\About\Model\ResourceModel\TeamMember as TeamMemberResource;

class Collection extends AbstractCollection
{
    /**
     * {@inheritdoc}
     */
    protected function _construct()
    {
        $this->_init(TeamMemberModel::class, TeamMemberResource::class);
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

