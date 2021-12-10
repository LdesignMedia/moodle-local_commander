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
      | Course1  | C1        | topics | 1                |
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
    And I navigate to "Plugins > Local plugins > Commander / Quick navigation" in site administration
    And I set the field "s_local_commander_keys" to "13"
    And I press "Save changes"
    Then the field "s_local_commander_keys" matches value "13"

    Then I navigate to "Plugins" in site administration

    And I press the enter key
    And I set the field "local_commander_command" to "commander"
    And I wait "2" seconds
    And I press the enter key
    Then I should see "Commander / Quick navigation" in the "body" "css_element"

    When I log in as "teacher1"
    And I am on homepage
    And I follow "Course1"
    And I press the enter key
    And I wait "2" seconds

    Then I should see "Speed up your Moodling" in the "body" "css_element"
