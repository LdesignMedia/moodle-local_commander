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
 * Output the possible menu options
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   local_commander
 * @copyright 2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

use local_commander\navigation;

define('AJAX_SCRIPT', true);
require_once(__DIR__ . '/../../config.php');

$courseid = optional_param('courseid', 0, PARAM_INT);

// This should be accessed by only valid logged in user.
require_login(null, false);

$context = empty($COURSE->id) ? context_system::instance() : context_course::instance($courseid);
if (!has_capability('local/commander:display', $context)) {
    return;
}

$PAGE->set_context(context_system::instance());
$PAGE->set_url('/local/commander/ajax.php');

if ($courseid > 0) {
    $course = $DB->get_record('course', ['id' => $courseid], '*', MUST_EXIST);
    $PAGE->set_course($course);
    $PAGE->set_context(context_course::instance($courseid));
}

// TODO Move to an external service.
$navigation = new navigation($PAGE, $courseid);
echo $navigation->get_menu_for_js();
