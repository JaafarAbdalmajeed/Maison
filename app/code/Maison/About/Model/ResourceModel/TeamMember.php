<?php
/**
 * Maison de Pierre - Team Member Resource Model
 */
namespace Maison\About\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;

class TeamMember extends AbstractDb
{
    /**
     * {@inheritdoc}
     */
    protected function _construct()
    {
        $this->_init('maison_about_team', 'team_id');
    }
}

