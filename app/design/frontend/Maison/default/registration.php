<?php
/**
 * Maison de Pierre - Theme Registration (Magento Best Practice)
 */
use Magento\Framework\Component\ComponentRegistrar;

ComponentRegistrar::register(
    ComponentRegistrar::THEME,
    'frontend/Maison/default',
    __DIR__
);
