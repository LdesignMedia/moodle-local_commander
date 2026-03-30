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
 * Before http headers hook
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   local_commander
 * @copyright 26/04/2024 Mfreak.nl | LdesignMedia.nl - Luuk Verhoeven
 * @author    Luuk Verhoeven
 **/

namespace local_commander\hook;

defined('MOODLE_INTERNAL') || die;

global $CFG;
require_once($CFG->dirroot. '/local/commander/lib.php');

use context_course;
use context_system;
use core_plugin_manager;

/**
 * Class before_http_headers.
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   local_commander
 * @copyright 26/04/2024 Mfreak.nl | LdesignMedia.nl - Luuk Verhoeven
 * @author    Luuk Verhoeven
 **/
class before_http_headers {

    /**
     * Callback to allow modifying headers.
     */
    public static function callback(): void {

        global $COURSE, $PAGE , $CFG;

        if (isloggedin() === false) {
            return;
        }

        $context = empty($COURSE->id) ? context_system::instance() : context_course::instance($COURSE->id);

        // Check if the plugin is installed.
        $plugininfo = core_plugin_manager::instance()->get_plugin_info('local_commander');
        if (empty($plugininfo->versiondb)) {
            return;
        }

        if (!has_capability('local/commander:display', $context)) {
            return;
        }

        $PAGE->requires->css('/local/commander/styles.css');
        $arguments = [
            'courseid' => $COURSE->id,
            'keys' => local_commander_get_trigger_keys(),
        ];

        $PAGE->requires->js_call_amd('local_commander/commander', 'init', [$arguments]);

        // TODO Using mustache template instead.
        $PAGE->requires->strings_for_js([
            'js:header',
            'js:error_parsing',
            'js:command_placeholder',
        ], 'local_commander');
    }

}
