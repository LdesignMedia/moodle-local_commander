<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Navigation class
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   local_commander
 * @copyright 2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

namespace local_commander;

use action_link;
use moodle_url;
use navigation_cache;
use navigation_node;
use navigation_node_collection;
use settings_navigation_ajax;

defined('MOODLE_INTERNAL') || die();

/**
 * Class navigation
 *
 * @package   local_commander
 * @copyright 2018 MFreak.nl
 * @author    Luuk Verhoeven
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class navigation extends settings_navigation_ajax {

    /**
     * @var int
     */
    protected $courseid;

    /**
     * Constructs the navigation for use in an AJAX request
     *
     * @param \moodle_page $page
     * @param int          $courseid
     */
    public function __construct(\moodle_page &$page, $courseid = 0) {
        $this->page = $page;
        $this->courseid = $courseid;
        $this->cache = new navigation_cache('navigation_commander');
        $this->children = new navigation_node_collection();
        $this->initialise();
    }

    /**
     * Initialise the site admin navigation.
     *
     * @return bool An array of the expandable nodes
     */
    public function initialise() {
        if ($this->initialised || during_initial_install()) {
            return false;
        }
        $this->context = $this->page->context;
        $this->load_administration_settings();

        // Also load course.
        if ($this->courseid > 0) {
            $this->load_course_settings(true);
        }

        // Check if local plugins is adding node to site admin.
        $this->load_local_plugin_settings();

        $this->initialised = true;
    }

    /**
     * Get the menu for javascript.
     *
     * @return string
     */
    public function get_menu_for_js() {

        // TODO Add custom commands actions enrolling, creating course and more.
        // Convert and output the branch as JSON.
        return json_encode([
            'admin' => $this->convert($this->get('root')),
            'courseadmin' => $this->convert($this->get('courseadmin')),
        ]);
    }

    /**
     * Recursively converts a child node and its children to XML for output.
     *
     * @param navigation_node $child The child to convert
     * @param int             $depth Pointlessly used to track the depth of the XML structure
     *
     * @return array
     */
    protected function convert($child, int $depth = 1) : array {

        $attributes = [];

        // Make sure correct child type is used.
        if (!$child instanceof navigation_node) {
            return $attributes;
        }

        if (!$child->display) {
            return $attributes;
        }

        $attributes['id'] = $child->id;
        $attributes['name'] = (string)$child->text; // This can be lang_string object so typecast it.
        $attributes['link'] = '#';

        if (is_string($child->action)) {
            $attributes['link'] = $child->action;
        } else if ($child->action instanceof moodle_url) {
            $attributes['link'] = $child->action->out();
        } else if ($child->action instanceof action_link) {
            $attributes['link'] = $child->action->url->out();
        }

        $attributes['hidden'] = ($child->hidden);
        $attributes['haschildren'] = ($child->children->count() > 0 || $child->type == navigation_node::TYPE_CATEGORY);
        $attributes['haschildren'] = $attributes['haschildren'] || $child->type == navigation_node::TYPE_MY_CATEGORY;

        if ($child->children->count() > 0) {
            $attributes['children'] = [];
            foreach ($child->children as $subchild) {
                $subchild = $this->convert($subchild, $depth + 1);
                if (!empty($subchild)) {
                    $attributes['children'][] = $subchild;
                }
            }
        }

        return $attributes;
    }
}
