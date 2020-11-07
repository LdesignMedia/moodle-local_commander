# This file is part of Moodle - http://moodle.org/
#
# Moodle is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Moodle is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
#
# Basic searching test for different users
#
# @package   local_commander
# @copyright 2019 MFreak.nl
# @author    Luuk Verhoeven
# @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later

@local @local_commander @_only_local
Feature: Can use local commander search tool
  In order to use the local commander in Moodle
  As an admin or teacher
  I have to be able search in local commander

  Background:
    Given the following "courses" exist:
      | fullname | shortname | format | enablecompletion |
      | Course1 | C1        | topics | 1                |
    And the following "users" exist:
      | username |
      | teacher1 |
      | student1 |
    And the following "course enrolments" exist:
      | user     | course | role           |
      | teacher1 | C1     | editingteacher |
      | student1 | C1     | student        |

  @javascript
  Scenario: Open local_commander as admin
    Given I log in as "admin"
    And I press key "192" in "body" "css_element"
    Then I should see "speed up your Moodling"

  @javascript
  Scenario: Open local_commander as teacher
    When I log in as "teacher1"
    And I am on homepage
    And I follow "Course1"
    And I press key "192" in "body" "css_element"
    Then I should see "speed up your Moodling"
