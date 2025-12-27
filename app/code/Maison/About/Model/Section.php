<?php
/**
 * Maison de Pierre - About Section Model
 */
namespace Maison\About\Model;

use Magento\Framework\Model\AbstractModel;
use Maison\About\Model\ResourceModel\Section as SectionResource;

class Section extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected function _construct()
    {
        $this->_init(SectionResource::class);
    }
}

