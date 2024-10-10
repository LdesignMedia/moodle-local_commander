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

## Version (4.5) - 10.10.2024
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
