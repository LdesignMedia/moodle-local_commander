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
 * Prepare keycode setting value
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   local_commander
 * @copyright 13/10/2019 Mfreak.nl | LdesignMedia.nl - Luuk Verhoeven
 * @author    Luuk Verhoeven
 **/

namespace local_commander;

/**
 * Class admin_setting_keycode
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   local_commander
 * @copyright 13/10/2019 Mfreak.nl | LdesignMedia.nl - Luuk Verhoeven
 * @author    Luuk Verhoeven
 */
class admin_setting_keycode extends \admin_setting_configtext {

    /**
     * @var array
     */
    protected $allowed = [];

    /**
     * Validate data before storage
     *
     * @param string $data
     *
     * @return mixed true if ok string if error found
     */
    public function validate($data) {
        $status = parent::validate($data);

        $keycodes = explode(',', $data);
        foreach ($keycodes as $keycode) {

            if (is_numeric($keycode)) {
                continue;
            }

            // Wrong format used.
            $status = false;
        }

        return $status;
    }

    /**
     * Write_setting
     *
     * @param string $data
     *
     * @return mixed|string
     * @throws \coding_exception
     */
    public function write_setting($data) {
        if ($this->paramtype === PARAM_INT and $data === '') {
            $data = 0;
        }

        $validated = $this->validate($data);
        if ($validated !== true) {
            return $validated;
        }

        // Cleanup.
        $data = $this->clean($data);

        return ($this->config_write($this->name, $data) ? '' : get_string('errorsetting', 'admin'));
    }

    /**
     * clean
     *
     * @param string $data
     *
     * @return string
     */
    private function clean(string $data) {
        return trim(str_replace(' ', '', strtolower($data)));
    }
}
