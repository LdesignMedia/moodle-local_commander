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
 * Helper for keycodes
 *
 * Tested in Moodle 3.8
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright 2019 MFreak.nl
 * @author    Luuk Verhoeven
 **/
/* eslint-disable no-invalid-this */
define(['jquery', 'core/str', 'core/notification', 'core/log'],
    function($, str, Notification, Log) {
    'use strict';

    /**
     * commanderSettings
     */
    const commanderSettings = {

        /**
         * Init
         */
        init: function() {
            let $el = $('#id_s_local_commander_keys');

            if ($el.length === 0) {
                return;
            }

            str.get_string('js:keycode_help', 'local_commander').then(function(message) {
                $el.before('<div class="alert alert-info" id="key-monitor"><b>' + message + '</b><div></div></div>');
                return message;
            }).fail(Notification.exception);

            $(document).on('keydown', function(e) {

                if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT'
                    || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                    Log.debug('Hide when we are in an editable element');
                    return;
                }

                let keyboardCode = e.keyCode || e.which;
                $('#key-monitor div').text('key = ' + e.key + ' | code = ' + keyboardCode);
            });
        }
    };

    return {

        /**
         * Called from Moodle.
         */
        init: function() {

            /**
             * Wait for jQuery
             */
            $(document).ready(function() {
                Log.debug('ready() - setting local commander v4.4');
                commanderSettings.init();
            });
        }
    };
});
