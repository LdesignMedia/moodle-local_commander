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
 * JS to show the popup and interact with it.
 *
 * Tested in Moodle 3.4
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package local_commander
 * @copyright 2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/
/* eslint no-console: ["error", { allow: ["warn", "error" , "log"] }] */
define(['jquery', 'core/notification'], function ($, notification) {
    'use strict';

    // Fix scrolling.
    $.fn.scrollTo = function (elem, speed) {
        $(this).stop().animate({
            scrollTop: $(this).scrollTop() - $(this).offset().top + $(elem).offset().top - 10
        }, speed == undefined ? 1000 : speed);
        return this;
    };

    /**
     * Options we can set from amd.
     * @type {{selector: string, blockid: number}}
     */
    var commanderAppOptions = {
        courseid: '',
        key1    : 192,
    };

    /**
     * Set options base on listed options
     * @param {object} options
     */
    var setOptions = function (options) {
        "use strict";
        var key, vartype;
        for (key in commanderAppOptions) {
            if (commanderAppOptions.hasOwnProperty(key) && options.hasOwnProperty(key)) {

                // Casting to prevent errors.
                vartype = typeof commanderAppOptions[key];
                if (vartype === "boolean") {
                    commanderAppOptions[key] = Boolean(options[key]);
                } else if (vartype === 'number') {
                    commanderAppOptions[key] = Number(options[key]);
                } else if (vartype === 'string') {
                    commanderAppOptions[key] = String(options[key]);
                }
                // Skip all other types.
            }
        }
    };

    /**
     * Commander plugin.
     * @type {{}}
     */
    var commanderApp = {

        /**
         * Modal jQuery element instance.
         */
        $mainModal: false,

        /**
         * Modal BG jQuery element instance.
         */
        $mainModalBackLayer: false,

        /**
         * Input field
         */
        $mainModalCommand: false,

        /**
         * Stores all li elements
         */
        $liSet: false,

        /**
         * Flag to check if modal is open.
         */
        isShow: false,

        /**
         * Save response
         */
        json: '',

        /**
         * Internal logging
         * @param {*} val
         */
        log: function () {
            "use strict";

            // Check if we can show the log.
            try {
                // TODO Only show if debugging enabled in cfg.
                console.log.apply(console, arguments);
            } catch (exc) {
                throw exc;
            }
        },

        /**
         * Render UI.
         */
        render: function () {
            "use strict";
            var timer = 0;
            commanderApp.log('render UI');

            // @TODO we should use mustache.
            $('body').append('<div id="local_commander_modal" class="local_commander">' +
                '<div class="local_commander-header"><h2>' + M.util.get_string('js:header', 'local_commander') + '</h2></div>' +
                '<div class="local_commander-body">' +
                '</div>' +
                '<input type="text" name="local_commander_command" id="local_commander_command" placeholder="' +
                M.util.get_string('js:command_placeholder', 'local_commander') + '">' +
                '</div><div id="local_commander_back_layer"></div>');

            // Set references.
            commanderApp.$mainModal = $('#local_commander_modal');
            commanderApp.$mainModalBackLayer = $('#local_commander_back_layer');
            commanderApp.$mainModalCommand = $('#local_commander_command');

            commanderApp.setHeight();

            commanderApp.$mainModalBackLayer.on('click', function () {
                commanderApp.hide();
            });

            // Search set some timeout optimize speed.
            commanderApp.$mainModalCommand.on('keydown', function (e) {

                if (e.keyCode == 13 || e.keyCode == 38 || e.keyCode == 40 || commanderAppOptions.key1 == e.keyCode) {
                    // Skip this keys here.
                    e.preventDefault();
                    return;
                }
                // Esc key pressed.
                if (e.keyCode === 27) {
                    commanderApp.hide();
                    return;
                }

                clearTimeout(timer);
                timer = setTimeout(function () {
                    commanderApp.search(commanderApp.$mainModalCommand.val());
                }, 100);
            });

            // Prevent adding the shortcut key.
            commanderApp.$mainModalCommand.on('keypress', (function (evt) {
                // Block ` for the input field.
                var keycode = evt.charCode || evt.keyCode;
                if (commanderAppOptions.key1 == keycode) {
                    return false;
                }
                return true;
            }));

            // Loading the menu content once.
            if (commanderApp.json === '') {
                commanderApp.loadMenu();
            }
        },

        /**
         * Start the commander.
         */
        start: function () {
            // Set holders.
            commanderApp.$mainModal = $('#local_commander_modal');

            $(document).on('keydown', function (e) {

                // Check for arrow keys.
                if (commanderApp.isShow) {
                    if (e.keyCode == 13) {
                        e.preventDefault();
                        commanderApp.goToCommand();
                    } else if (e.keyCode == 38) {
                        e.preventDefault();
                        commanderApp.arrowUp();
                    } else if (e.keyCode == 40) {
                        e.preventDefault();
                        commanderApp.arrowDown();
                    }
                }

                if (e.keyCode == commanderAppOptions.key1) {
                    e.preventDefault();

                    // Only render if needed.
                    if (commanderApp.$mainModal.length == 0) {
                        commanderApp.render();
                    }

                    commanderApp.log('Open commander.');

                    if (commanderApp.isShow) {
                        commanderApp.hide();
                    } else {
                        commanderApp.show();
                    }
                }
            });
        },

        /**
         * highlightWord
         *
         * @param node
         * @param word
         */
        highlightWord: function (node, word) {
            if (node.nodeType == 3) {
                var pos = node.data.toUpperCase().indexOf(word);
                if (pos >= 0) {
                    var spannode = document.createElement('span');
                    spannode.className = 'highlight';
                    spannode.style.backgroundColor = '#f4bd21';
                    var middlebit = node.splitText(pos);
                    var endbit = middlebit.splitText(word.length);
                    var middleclone = middlebit.cloneNode(true);
                    spannode.appendChild(middleclone);
                    middlebit.parentNode.replaceChild(spannode, middlebit);
                }

            } else if (node.nodeType == 1 && node.childNodes) {
                for (var i = 0; i < node.childNodes.length; ++i) {
                    i += commanderApp.highlightWord(node.childNodes[i], word);
                }
            }
        },

        /**
         * Action on keyboard arrow key UP.
         */
        arrowUp: function () {
            commanderApp.log('arrowUp');
            $('#local_commander_modal ul li.active').removeClass('active').addClass('active');

            //
            commanderApp.scrollTo();
        },

        /**
         * Action on keyboard arrow key DOWN.
         */
        arrowDown: function () {
            commanderApp.log('arrowDown');
            $('#local_commander_modal ul li.active').removeClass('active').next().addClass('active');

            //
            commanderApp.scrollTo();
        },

        scrollTo: function () {
            $('#local_commander_modal .local_commander-body div').scrollTo('#local_commander_modal ul li.active', 200);
        },

        /**
         * The command that we need to execute.
         */
        goToCommand: function () {
            commanderApp.log('goToCommand');
            // Check if there is a element selected.
            // Check if the element has link.
            // TODO maybe add way to execute other type of commands.
            var $el = $('#local_commander_modal ul li.active a');
            if ($el) {
                var link = $el.attr('href');
                if (link != '#') {
                    window.location = link;
                }
            }
        },

        /**
         *
         */
        loadMenu: function () {
            "use strict";

            $.ajax({
                url     : M.cfg.wwwroot + '/local/commander/ajax.php',
                method  : "GET",
                data    : {
                    'courseid': commanderAppOptions.courseid
                },
                dataType: "json",
            }).done(function (response) {
                commanderApp.log(response);
                commanderApp.json = response;

                commanderApp.setMenu();

            }).fail(function () {
                notification.alert('js:error_parsing', 'local_commander');
            });
        },

        /**
         * Search in the commands.
         * @param {string} word
         */
        search: function (word) {
            "use strict";

            // Remove active.
            $('.local_commander-body ul li').show();
            commanderApp.$liSet.find('li.active').removeClass('active');

            commanderApp.$liSet.find("span.highlight").each(function () {
                var thisParent = this.parentNode;
                thisParent.replaceChild(this.firstChild, this);
                commanderApp.removeHighlight(thisParent);
            }).end();

            if (word != '') {

                commanderApp.$liSet.children().each(function () {
                    commanderApp.highlightWord(this, word.toUpperCase());
                });

                // Set active li item.
                $('span.highlight').first().parent().parent().addClass('active');

                // Hide others.
                $('.local_commander-body ul li:not(:has(span))').hide();
            }
        },

        /**
         * Build the ul command list.
         */
        setMenu: function () {
            "use strict";
            commanderApp.log('setMenu() ');

            var html = '<div><ul>';

            // Only do things when needed.
            if (commanderAppOptions.courseid > 0) {
                commanderApp.log('Has course param.');
                html += commanderApp.renderMenuItems(commanderApp.json.courseadmin, 1);
            }

            // Always try adding admin menu.
            html += commanderApp.renderMenuItems(commanderApp.json.admin, 1);

            html += '</ul></div>';
            commanderApp.$mainModal.find('.local_commander-body').append(html);

            commanderApp.$liSet = $('.local_commander-body ul');
        },

        /**
         * Render items and add the correct attr.
         *
         * @param {object} child
         * @param {int} depth
         * @param {string} parentName
         * @returns {string}
         */
        renderMenuItems: function (child, depth, parentName) {
            "use strict";
            var html = '';

            // Check child.
            if (!child.name) {
                return html;
            }

            // Set parentName.
            if (!parentName) {
                parentName = '';
            } else {
                parentName += ' &rarr; ';
            }

            html += '<li>';

            if (child.name) {
                // Add the same to buffer.
                //
                html += '<a href="' + child.link + '">' + parentName + child.name + '</a>';
            }

            if (child.haschildren) {
                $.each(child.children, function (i, el) {
                    html += commanderApp.renderMenuItems(el, depth + 1, parentName + child.name);
                });
            }

            html += '</li>';
            return html;
        },

        /**
         * Show the modal
         */
        show: function () {
            "use strict";
            commanderApp.$mainModal.show();
            commanderApp.$mainModalBackLayer.show();

            commanderApp.isShow = true;

            commanderApp.setHeight();

            // Focus on search field.
            commanderApp.$mainModalCommand.focus();
        },

        /**
         * Hide the modal
         */
        hide     : function () {
            commanderApp.$mainModal.hide();
            commanderApp.$mainModalBackLayer.hide();

            commanderApp.isShow = false;
        },
        /**
         * Set 50% of viewport height
         */
        setHeight: function () {

            commanderApp.$mainModal.css({
                'height': $(window).height() / 2
            });
        },

        /**
         *
         * @param node
         */
        removeHighlight: function (node) {
            $(node).html($(node).text());
        }
    };

    return {

        /**
         * Called from Moodle.
         * @param {array} params
         */
        init: function (params) {

            /**
             * Set the options.
             */
            setOptions(params);

            /**
             * Wait for jQuery
             */
            $(document).ready(function () {
                commanderApp.log('ready() - local commander v1.25', commanderAppOptions);
                commanderApp.start();
            });
        }
    };
});