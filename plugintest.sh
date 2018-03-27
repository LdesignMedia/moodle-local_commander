#!/bin/bash
# this file should be in placed in the root of moodle
# usage ./plugintest.sh local/commander

# First install in moodle dir
# composer create-project -n --no-dev --prefer-dist moodlerooms/moodle-plugin-ci ci ^2

# npm install

# export PATH="$(cd ci/bin; pwd):$(cd ci/vendor/bin; pwd):$PATH"

moodle-plugin-ci codecheck $1
moodle-plugin-ci grunt $1
moodle-plugin-ci phpmd $1
moodle-plugin-ci savepoints $1
moodle-plugin-ci mustache $1
moodle-plugin-ci phplint $1
moodle-plugin-ci phpcpd $1
moodle-plugin-ci phpunit $1
moodle-plugin-ci behat $1

echo "Build amd"
grunt amd

eslint $1/amd/src/commander.js