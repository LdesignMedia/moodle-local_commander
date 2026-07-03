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
# Regression test for issue #19: the trigger key must not open Commander while
# the user is typing in an editable field (e.g. the TinyMCE View -> Source code
# overlay). This exercises the shared editable-context guard.
#
# @package   local_commander
# @copyright 2026 LdesignMedia.nl
# @author    Luuk Verhoeven
# @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later

@local @local_commander @_only_local @javascript
Feature: Commander does not steal the trigger key inside editable fields
  In order to type freely in text fields and rich text editors
  As any user
  Commander must not open when the trigger key is pressed while a field is focused

  @javascript
  Scenario: Trigger key inside a focused text field does not open Commander
    Given I log in as "admin"
    And I navigate to "Plugins > Local plugins > Commander / Quick navigation" in site administration
    When I set the field "s_local_commander_keys" to "75"
    And I click on "Save changes" "button"
    Then the field "s_local_commander_keys" matches value "75"
    # Focus an editable text field, then press the trigger key inside it.
    And I click on "s_local_commander_keys" "field"
    And I press the k key
    And I wait "1" seconds
    # Commander must stay closed because focus is in an editable field.
    And I should not see "Local Commander" in the "body" "css_element"

  @javascript
  Scenario: Trigger key on the page still opens Commander
    Given I log in as "admin"
    And I navigate to "Plugins > Local plugins > Commander / Quick navigation" in site administration
    When I set the field "s_local_commander_keys" to "75"
    And I click on "Save changes" "button"
    Then the field "s_local_commander_keys" matches value "75"
    And I am on homepage
    And I wait "2" seconds
    # No field focused: pressing the trigger key opens Commander as usual.
    And I press the k key
    And I wait "1" seconds
    And I should see "Local Commander" in the "body" "css_element"
