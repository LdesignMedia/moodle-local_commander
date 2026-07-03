# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

# Plugin version.php information
```php
// Plugin release number corresponds to the lasest tested Moodle version in which the plugin has been tested.
$plugin->release = '3.5.7'; // [3.5.7]

// Plugin version number corresponds to the latest plugin version.
$plugin->version = 2019010100; // 2019-01-01
```

# How do I make a good changelog?
Guiding Principles
* Changelogs are for humans, not machines.
* There should be an entry for every single version.
* The same types of changes should be grouped.
* The latest version comes first.
* The release date of each version is displayed.

Types of changes
* **Added** for new features.
* **Changed** for changes in existing functionality.
* **Deprecated** for soon-to-be removed features.
* **Removed** for now removed features.
* **Fixed** for any bug fixes.
* **Security** in case of vulnerabilities.

## Version (5.1.2) - 2026-07-03
### Changed
- Use `->out(false)` for `moodle_url`/`action_link` course-admin navigation nodes, matching the rest of the file and avoiding `&amp;`-escaped URLs in the JSON.
- Add explicit `riskbitmask => 0` to the `local/commander:display` capability so its read-only, low-risk intent is visible in the roles UI.
- Remove dead code and stale comments flagged by the security audit: unused `$allowed` property, production TODO comments, duplicate license block (commander.js), and stale "Tested in Moodle 3.8" docblock (settings.js). Add missing `@return void` on `before_http_headers::callback()`.

## Version (5.1.1) - 2026-07-03
### Security
- Escape navigation names and links (`escapeHtml`) before they are written to `innerHTML` in the commander overlay, and HTML-encode search highlight segments via an escaping `uFuzzy.highlight()` mark callback. Defence in depth against XSS if a raw string ever reaches the client sinks.
### Fixed
- Fix admin navigation links that pointed to `[object Object]`: `admin_externalpage->url` can be a `moodle_url`/`core\url` object, which was serialised into JSON as an empty object and became `[object Object]` client-side. Normalise it to a string URL via `->out(false)`. Affected 60+ admin items (Registration, Data requests, Add a new course, Manage badges, and any third-party tool such as `tool_supporter`).
- Correct `ajax.php` context resolution: test the `courseid` request parameter instead of the global `$COURSE->id`, which always resolved to the site course and threw `dml_missing_record_exception` (HTTP 500) for the default `courseid=0`.

## Version (5.0.1) - 2025-09-27
### Fixed
- Fixed Behat test reliability by replacing back layer click with ESC key press
- Increased z-index values to prevent element overlap issues
- Fixed multiple trigger keys functionality to work correctly

## Version (5.0.0) - 2025-09-26
### Update
- Updated for Moodle 5.0 compatibility
- Fixed capability check before plugin installation (issue #13)
- Version number aligned with Moodle 5.0

## Version (4.5) - 2024-10-10
### Update
- Remove jQuery from code base https://github.com/LdesignMedia/moodle-local_commander/issues/22
- Add Fuzzy search https://github.com/LdesignMedia/moodle-local_commander/issues/16
- Add OS darkmode support
- Update styling
- Tested for Moodle 4.5

## Version (3.11) - 2022-03-28
### Fix
- `@thibault.herault` Thanks for solving issue with loading navigation.

## Version (3.11) - 2021-09-27
### Update
- Moved to GitHub workflows.

## Version (3.8.1) - 2019-11-11
### Fixed
- Issue with e.code not supported in all browsers.

## Version (3.8.0) - 2019-10-13
### Added
- Add new KeyboardEvent support (e.keyCode is deprecated)
- Allows multiple trigger keys
- Update version number, no issues founded in Moodle 3.8
- Prevent display commander when we are in an editable area.
- Changelog moved to a separate file

## Version (1.2.7) - 2019-05-20
### Added
- Release of the first official version.
- Travis tests

## Fixed 
- Within a course system context isn't working like expected.
