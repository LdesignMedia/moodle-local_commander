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
 *
 * @package local_commander
 * @copyright 2019 MFreak.nl
 * @author    Luuk Verhoeven
 **/
/* eslint no-console: ["error", { allow: ["warn", "error" , "log"] }] */
/* eslint-disable no-invalid-this */
define(['jquery', 'core/str'], function($, str) {
    'use strict';

    /**
     *
     * @type {{}}
     */
    var commanderSettings = {

        /**
         * Internal logging
         * @param {*} val
         */
        log: function() {
            "use strict";

            // Check if we can show the log.
            try {
                // TODO Only show if debugging enabled in cfg.
                console.log.apply(console, arguments);
            } catch (exc) {
                throw exc;
            }
        },

        /**
         * Init
         */
        init: function() {
            var $el = $('#id_s_local_commander_keys');

            if ($el.length === 0) {
                return;
            }

            str.get_string('js:keycode_help', 'local_commander').then(function(message) {
                $el.before('<div class="alert alert-info" id="key-monitor"><b>' + message + '</b><div></div></div>');
            });

            $(document).on('keydown', function(e) {

                if (e.target.tagName == 'INPUT' || e.target.tagName == 'SELECT'
                    || e.target.tagName == 'TEXTAREA' || e.target.isContentEditable) {
                    commanderSettings.log('Hide when we are in an editable element');
                    return;
                }

                var keyboardCode = e.keyCode || e.which;
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
                commanderSettings.log('ready() - setting local commander v3.8.1');
                commanderSettings.init();
            });
        }
    };
});