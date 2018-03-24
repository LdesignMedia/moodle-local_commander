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
 * JS to show the popup and interact with it.
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package local_commander
 * @copyright 2018 MoodleFreak.com
 * @author    Luuk Verhoeven
 **/
define(['jquery', 'core/yui'], function ($, Y) {
   'use strict';

    /**
     * Options we can set from amd.
     * @type {{selector: string, blockid: number}}
     */
    var opts = {
        selector       : '',
    };

    /**
     * Internal logging
     * @param {*} val
     */
    var log = function (val) {
        "use strict";

        // Check if we can show the log.
        try {
                console.log(val);
        } catch (exc) {
            throw exc;
        }
    };

    /**
     * Set options base on listed options
     * @param {object} options
     */
    var setOptions = function (options) {
        "use strict";
        var key, vartype;
        for (key in opts) {
            if (opts.hasOwnProperty(key) && options.hasOwnProperty(key)) {

                // Casting to prevent errors.
                vartype = typeof opts[key];
                if (vartype === "boolean") {
                    opts[key] = Boolean(options[key]);
                }
                else if (vartype === 'number') {
                    opts[key] = Number(options[key]);
                }
                else if (vartype === 'string') {
                    opts[key] = String(options[key]);
                }
                // Skip all other types.
            }
        }
    };

    /**
     * Commander plugin.
     * @type {{}}
     */
    var commander = {

        /**
         * Start the commander.
         */
        listenersStart : function () {
            $(document).on('keydown' , function (e) {
               if(e.keyCode == 192){

               }
            });
        },

        show : function () {

        },

        hide : function () {

        },
    };

    return {

        /**
         * Called from Moodle.
         * @param params
         */
        init: function (params) {

            /**
             * Set the options.
             */
            setOptions(params);

            /**
             * Wait for jQuery
             */
            $(document).ready(function () {

                log('ready() - local commander v1.0');
                commander.listenersStart();
            });
        }
    };
});