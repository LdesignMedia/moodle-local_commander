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
 * The local lib needed to hook with the core Quick Navigation
 *
 * https://docs.moodle.org/dev/Local_plugins
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   local_commander
 * @copyright 2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

/**
 * local_commander_get_trigger_keys
 *
 * @return array
 * @throws dml_exception
 */
function local_commander_get_trigger_keys(): array {
    $keys = get_config('local_commander', 'keys');

    return explode(',', $keys);
}

/**
 * Tweak to allow JS injection from a local plugin https://docs.moodle.org/dev/Local_plugins.
 */
function local_commander_before_http_headers(): void {

    // If class exists, no more need to run from here, as hook has been implemented.
    if (class_exists(\core\hook\output\before_http_headers::class)) {
        return;
    }

    // Otherwise we call the callback from here.
    \local_commander\hook\before_http_headers::callback();

}
