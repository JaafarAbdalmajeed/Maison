<?php
/**
 * Maison de Pierre - About Value Model
 */
namespace Maison\About\Model;

use Magento\Framework\Model\AbstractModel;
use Maison\About\Model\ResourceModel\Value as ValueResource;

class Value extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected function _construct()
    {
        $this->_init(ValueResource::class);
    }
}

