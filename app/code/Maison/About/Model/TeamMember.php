<?php
/**
 * Maison de Pierre - Team Member Model
 */
namespace Maison\About\Model;

use Magento\Framework\Model\AbstractModel;
use Maison\About\Model\ResourceModel\TeamMember as TeamMemberResource;

class TeamMember extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected function _construct()
    {
        $this->_init(TeamMemberResource::class);
    }
}

