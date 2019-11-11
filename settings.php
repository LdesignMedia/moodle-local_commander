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
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package local_commander
 * @copyright 2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

use local_commander\admin_setting_keycode;

defined('MOODLE_INTERNAL') || die;
if ($hassiteconfig) {

    // Load keycode helper.
    $PAGE->requires->js_call_amd('local_commander/settings', 'init');

    $settings = new admin_settingpage('local_commander',
        new lang_string('pluginname', 'local_commander'));

    $settings->add(new admin_setting_keycode('local_commander/keys',
        new lang_string('setting:keys', 'local_commander'),
        new lang_string('setting:keys_desc', 'local_commander'),
        '192', PARAM_TEXT));

    $ADMIN->add('localplugins', $settings);
}