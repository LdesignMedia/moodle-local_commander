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
 *  Settings
 *
 * Todo add this helper and add dropdown for the specialkeys shift / alt / ctrl
 * https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package local_commander
 * @copyright 2018 MoodleFreak.com
 * @author    Luuk Verhoeven
 **/

defined('MOODLE_INTERNAL') || die;
if ($hassiteconfig) {
    $settings = new admin_settingpage('local_commander',
        new lang_string('pluginname', 'local_commander'));

    // ` Just press ` (above the tab key) to bring up the interface, and then start typing part of the name of any screen,
    // post, page, etc. As you type, you’ll be shown a list of matching links.
    // Use the Up and Down keys to move between them, and press Enter to open one.
    $settings->add(new admin_setting_configtext('local_commander/key1',
        new lang_string('setting:key1', 'local_commander'),  new lang_string('setting:key1_desc', 'local_commander'),
        '`', PARAM_RAW));

    $ADMIN->add('localplugins', $settings);
}