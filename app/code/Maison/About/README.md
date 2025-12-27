# Maison About Page Module

## Overview
Dynamic About page module with backend integration for Maison de Pierre.

## Installation

1. Enable the module:
```bash
php bin/magento module:enable Maison_About
php bin/magento setup:upgrade
php bin/magento setup:di:compile
php bin/magento cache:flush
```

2. Create a CMS page with identifier "about":
   - Go to Admin Panel → Content → Pages
   - Create a new page
   - Set URL Key to "about"
   - Set Page Title to "About Us" (or any title)
   - Save the page

## Database Tables

The module creates three tables:
- `maison_about_sections` - Stores page sections (hero, mission, story, etc.)
- `maison_about_team` - Stores team members
- `maison_about_values` - Stores company values

## Default Data

The module includes default data that will be installed automatically:
- Hero section
- Mission section
- Story section
- 4 default values (Quality, Elegance, Excellence, Innovation)
- 3 default team members

## Managing Content

You can manage the content through the database or by creating an admin interface. For now, you can:
1. Access the database directly
2. Use Magento's database tools
3. Create admin forms (future enhancement)

## Files Structure

```
app/code/Maison/About/
├── Block/
│   └── About.php
├── Model/
│   ├── Section.php
│   ├── TeamMember.php
│   ├── Value.php
│   └── ResourceModel/
│       ├── Section/
│       │   ├── Section.php
│       │   └── Collection.php
│       ├── TeamMember/
│       │   ├── TeamMember.php
│       │   └── Collection.php
│       └── Value/
│           ├── Value.php
│           └── Collection.php
├── Setup/
│   └── InstallData.php
├── etc/
│   ├── module.xml
│   └── db_schema.xml
└── registration.php
```

## Template Location

The template is located at:
`app/design/frontend/Maison/default/Magento_Cms/templates/about/about.phtml`

## CSS Location

The styles are located at:
`app/design/frontend/Maison/default/web/css/pages/about.css`

## Layout

The layout file is:
`app/design/frontend/Maison/default/Magento_Cms/layout/cms_page_view_id_about.xml`

This layout will be applied automatically when viewing the CMS page with identifier "about".

