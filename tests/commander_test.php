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
 * Commander test class
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   local_commander
 * @copyright 12/09/2023 Mfreak.nl | LdesignMedia.nl - Luuk Verhoeven
 * @author    Luuk Verhoeven
 **/

namespace local_commander;

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/auth/manual/auth.php');

/**
 * Class commander_test
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   local_commander
 * @copyright 12/09/2023 Mfreak.nl | LdesignMedia.nl - Luuk Verhoeven
 * @author    Luuk Verhoeven
 **/
class commander_test extends \advanced_testcase {

    /**
     * Setup test data.
     */
    protected function setUp() : void {
        $this->resetAfterTest(true);
        $this->setAdminUser();
    }

    /**
     * Test navigation site admin
     */
    public function test_navigation_site() {
        global $PAGE, $SITE;

        $PAGE->set_url('/');
        $PAGE->set_course($SITE);

        $navigation = new navigation($PAGE, $SITE->id);
        $menu = $navigation->get_menu_for_js();
        $this->assertStringContainsString('Incoming mail configuration', $menu);
        $this->assertStringContainsString('XMLDB editor', $menu);
        $this->assertStringContainsString('Course administration', $menu);

        $decoded = json_decode($menu);
        $this->assertNotEmpty($decoded);
    }

    /**
     * Test navigation course admin
     */
    public function test_navigation_course() {
        global $PAGE;

        $course = $this->getDataGenerator()->create_course();

        $PAGE->set_url('/course/view.php?id=' . $course->id);
        $PAGE->set_course($course);

        $navigation = new navigation($PAGE, $course->id);
        $menu = $navigation->get_menu_for_js();
        $this->assertStringContainsString('copy.php?id=' . $course->id, $menu);

        $decoded = json_decode($menu);
        $this->assertNotEmpty($decoded);
    }

}
