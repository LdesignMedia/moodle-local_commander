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
 * @copyright 2018 MFreak.nl | LdesignMedia.nl
 * @author    Luuk Verhoeven
 **/

namespace local_commander;

use action_link;
use moodle_url;
use navigation_node;

/**
 * Class navigation
 *
 * Provides navigation data for the commander search dialog.
 * Compatible with Moodle 4.0 through 5.1+.
 *
 * @package   local_commander
 * @copyright 2018 MFreak.nl | LdesignMedia.nl
 * @author    Luuk Verhoeven
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class navigation {
    /** @var \moodle_page */
    private \moodle_page $page;

    /** @var int */
    private int $courseid;

    /**
     * Constructor.
     *
     * @param \moodle_page $page
     * @param int $courseid
     */
    public function __construct(\moodle_page $page, int $courseid = 0) {
        $this->page = $page;
        $this->courseid = $courseid;
    }

    /**
     * Get the menu for javascript.
     *
     * @return string JSON encoded menu data.
     */
    public function get_menu(): string {
        return json_encode([
            'admin' => $this->get_admin_nodes(),
            'courseadmin' => $this->get_courseadmin_nodes(),
        ], JSON_THROW_ON_ERROR);
    }

    /**
     * Get admin navigation nodes using admin_get_root().
     *
     * @return array
     */
    private function get_admin_nodes(): array {
        global $CFG;
        require_once($CFG->libdir . '/adminlib.php');
        $root = \admin_get_root();
        if (empty($root)) {
            return [];
        }

        return $this->convert_admin_tree($root);
    }

    /**
     * Convert an admin tree node and its children to the commander format.
     *
     * @param \part_of_admin_tree $node
     * @return array
     */
    private function convert_admin_tree(\part_of_admin_tree $node): array {
        $attributes = [];
        $attributes['id'] = $node->name ?? 'root';
        $attributes['name'] = (string)($node->visiblename ?? '');
        $attributes['link'] = '#';
        $attributes['hidden'] = false;
        $attributes['haschildren'] = false;

        if ($node instanceof \admin_settingpage) {
            $attributes['link'] = (new moodle_url('/admin/settings.php', ['section' => $node->name]))->out(false);
        } else if ($node instanceof \admin_externalpage) {
            $attributes['link'] = $node->url ?? '#';
        }

        if ($node instanceof \admin_category && !empty($node->children)) {
            $children = [];
            foreach ($node->children as $child) {
                if (!$child->check_access()) {
                    continue;
                }
                $childdata = $this->convert_admin_tree($child);
                if (!empty($childdata)) {
                    $children[] = $childdata;
                }
            }
            if (!empty($children)) {
                $attributes['haschildren'] = true;
                $attributes['children'] = $children;
            }
        }

        return $attributes;
    }

    /**
     * Get course admin nodes from the page's settings navigation.
     *
     * @return array
     */
    private function get_courseadmin_nodes(): array {
        if ($this->courseid <= 0) {
            return [];
        }

        $settingsnav = $this->page->settingsnav;
        if (empty($settingsnav)) {
            return [];
        }

        $courseadminnode = $settingsnav->get('courseadmin');
        if (!$courseadminnode) {
            return [];
        }

        $nodes = $this->convert_navigation_node($courseadminnode);

        // Enrich the groups node with additional sub-links.
        if (!empty($nodes['children'])) {
            foreach ($nodes['children'] as $key => $value) {
                if ($value['name'] === get_string('users')) {
                    if (!empty($value['children'])) {
                        foreach ($value['children'] as $i => $child) {
                            if ($child['name'] === get_string('groups', 'group')) {
                                $child['children'] = [];
                                $child['haschildren'] = true;
                                $child['children'][] = $this->get_child_node(
                                    1,
                                    get_string('overview', 'group'),
                                    (new moodle_url('/group/overview.php', [
                                        'id' => $this->courseid,
                                    ]))->out(false),
                                );
                                $child['children'][] = $this->get_child_node(
                                    2,
                                    get_string('groupings', 'group'),
                                    (new moodle_url('/group/groupings.php', [
                                        'id' => $this->courseid,
                                    ]))->out(false),
                                );
                                $nodes['children'][$key]['children'][$i] = $child;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }

        return $nodes;
    }

    /**
     * Recursively converts a navigation_node and its children.
     *
     * @param navigation_node $child The child to convert
     * @param int $depth Depth tracking
     *
     * @return array
     */
    private function convert_navigation_node(navigation_node $child, int $depth = 1): array {
        if (!$child->display) {
            return [];
        }

        $attributes = [];
        $attributes['id'] = $child->id;
        $attributes['name'] = (string)$child->text;
        $attributes['link'] = '#';

        if (is_string($child->action)) {
            $attributes['link'] = $child->action;
        } else if ($child->action instanceof moodle_url) {
            $attributes['link'] = $child->action->out();
        } else if ($child->action instanceof action_link) {
            $attributes['link'] = $child->action->url->out();
        }

        $attributes['hidden'] = ($child->hidden);
        $attributes['haschildren'] = ($child->children->count() > 0
            || (int)$child->type === navigation_node::TYPE_CATEGORY);
        $attributes['haschildren'] = $attributes['haschildren']
            || (int)$child->type === navigation_node::TYPE_MY_CATEGORY;

        if ($child->children->count() > 0) {
            $attributes['children'] = [];
            foreach ($child->children as $subchild) {
                $subchild = $this->convert_navigation_node($subchild, $depth + 1);
                if (!empty($subchild)) {
                    $attributes['children'][] = $subchild;
                }
            }
        }

        return $attributes;
    }

    /**
     * Get child node.
     *
     * @param int $id
     * @param string $name
     * @param string $link
     *
     * @return array
     */
    private function get_child_node(int $id, string $name, string $link): array {
        return [
            'id' => $id,
            'name' => $name,
            'link' => $link,
            'haschildren' => false,
            'children' => [],
        ];
    }
}
