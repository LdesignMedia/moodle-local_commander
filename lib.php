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
 * The local lib needed to hook with the core.
 * Quick Navigation
 *
 * https://docs.moodle.org/dev/Local_plugins
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   local_commander
 * @copyright 2018 MoodleFreak.com
 * @author    Luuk Verhoeven
 **/

defined('MOODLE_INTERNAL') || die;

/**
 * Tweak to allow JS injection from a local plugin.
 * https://docs.moodle.org/dev/Local_plugins
 *
 * @param global_navigation $navigation
 *
 * @throws coding_exception
 */
function local_commander_extend_navigation(global_navigation  $navigation) {
    global $COURSE, $PAGE;

    // TODO Only add this if you have enough permissions.
    $PAGE->requires->jquery();
    $PAGE->requires->css('/local/commander/styles.css');
    $arguments = [
        'courseid' => $COURSE->id,
    ];

    $PAGE->requires->js_call_amd('local_commander/commander', 'init', [$arguments]);

    // @TODO using mustache template instead.
    $PAGE->requires->strings_for_js(['js:header' , 'js:error_parsing','js:command_placeholder'], 'local_commander');

}