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
# Setting config
#
# @package   local_commander
# @copyright 2019 MFreak.nl
# @author    Luuk Verhoeven
# @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later

#@local @local_commander @_only_local
#Feature: Manager can use local commander search tool
#  In order to use the local commander in Moodle
#  As an admin
#  I have to be able save settings
#
#  @javascript
#  Scenario: Open local_commander
#    Given I log in as "admin"
#    And I navigate to "Plugins > Local plugins > Commander / Quick navigation" in site administration
#    And I set the field "s_local_commander_keys" to "13"
#    And I press "Save changes"
#    Then the field "s_local_commander_keys" matches value "13"
