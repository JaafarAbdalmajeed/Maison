<?php
/**
 * Maison de Pierre - About Value Resource Model
 */
namespace Maison\About\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;

class Value extends AbstractDb
{
    /**
     * {@inheritdoc}
     */
    protected function _construct()
    {
        $this->_init('maison_about_values', 'value_id');
    }
}

