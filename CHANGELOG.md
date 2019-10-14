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


## [3.8.0] - 2019-10-13
### Added
- Add keycode helper to the setting menu
- Allows multiple trigger keys
- Update version number, no issues founded in Moodle 3.8
- Prevent display commander when we are in an editable area.
- Changelog moved to a separate file

## [1.2.7] - 2019-05-20
### Added
- Release of the first official version.
- Travis tests

## Fixed 
- Within a course system context isn't working like expected.