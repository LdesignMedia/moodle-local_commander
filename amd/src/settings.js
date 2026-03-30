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

import {getString} from 'core/str';
import Notification from 'core/notification';
import Log from 'core/log';

/**
 * Initialize the commander settings.
 */
function init() {
    const el = document.getElementById('id_s_local_commander_keys');

    if (!el) {
        return;
    }

    getString('js:keycode_help', 'local_commander')
        .then((message) => {
            el.insertAdjacentHTML('beforebegin', `
                <div class="alert alert-info" id="key-monitor">
                    <b>${message}</b>
                    <div></div>
                </div>
            `);
        })
        .catch(Notification.exception);

    document.addEventListener('keydown', (e) => {
        const tagName = e.target.tagName.toUpperCase();

        if (
            tagName === 'INPUT' ||
            tagName === 'SELECT' ||
            tagName === 'TEXTAREA' ||
            e.target.isContentEditable
        ) {
            Log.debug('Key event ignored in editable element');
            return;
        }

        const keyboardCode = e.keyCode || e.which;
        const monitorDiv = document.querySelector('#key-monitor div');
        if (monitorDiv) {
            monitorDiv.textContent = `key = ${e.key} | code = ${keyboardCode}`;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    Log.debug('DOM fully loaded - initializing commander settings');
    init();
});

export default {
    init,
};
