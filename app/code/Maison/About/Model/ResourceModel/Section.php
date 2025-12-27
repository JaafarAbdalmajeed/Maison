<?php
/**
 * Maison de Pierre - About Section Resource Model
 */
namespace Maison\About\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;

class Section extends AbstractDb
{
    /**
     * {@inheritdoc}
     */
    protected function _construct()
    {
        $this->_init('maison_about_sections', 'section_id');
    }
}

