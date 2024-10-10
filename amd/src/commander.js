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

// Initialize the module with imports.
import notification from 'core/notification';
import Log from 'core/log';

/**
 * Keyboard key codes.
 */
const ESCAPE = 27;
const ENTER = 13;
const ARROWUP = 38;
const ARROWDOWN = 40;

/**
 * Options we can set from AMD.
 */
const commanderAppOptions = {
    courseid: '',
    keys: [],
};

/**
 * Set options based on provided parameters.
 * @param {object} options
 */
function setOptions(options) {
    Object.keys(commanderAppOptions).forEach((key) => {
        if (options.hasOwnProperty(key)) {
            const vartype = typeof commanderAppOptions[key];
            if (vartype === 'boolean') {
                commanderAppOptions[key] = Boolean(options[key]);
            } else if (vartype === 'number') {
                commanderAppOptions[key] = Number(options[key]);
            } else if (vartype === 'string') {
                commanderAppOptions[key] = String(options[key]);
            } else {
                commanderAppOptions[key] = options[key];
            }
        }
    });
}

/**
 * The main commander application.
 */
const commanderApp = {
    /**
     * Modal DOM element instance.
     */
    mainModal: null,

    /**
     * Modal background layer DOM element.
     */
    mainModalBackLayer: null,

    /**
     * Input field element.
     */
    mainModalCommand: null,

    /**
     * Stores all list item elements.
     */
    liSet: null,

    /**
     * Flag to check if the modal is open.
     */
    isShow: false,

    /**
     * Stores the response JSON.
     */
    json: '',

    /**
     * Render the UI.
     */
    render() {
        let timer = 0;
        Log.debug('Rendering UI');

        // Create the modal HTML.
        const modalHtml = `
            <div id="local_commander_modal" class="local_commander">
                <div class="local_commander-header">
                    <h2>${M.util.get_string('js:header', 'local_commander')}</h2>
                </div>
                <div class="local_commander-body">
                    <div><ul></ul></div>
                </div>
                <input type="text" name="local_commander_command" id="local_commander_command"
                 placeholder="${M.util.get_string('js:command_placeholder', 'local_commander')}">
            </div>
            <div id="local_commander_back_layer"></div>
        `;

        // Append the modal to the body.
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Set references to the modal elements.
        this.mainModal = document.getElementById('local_commander_modal');
        this.mainModalBackLayer = document.getElementById('local_commander_back_layer');
        this.mainModalCommand = document.getElementById('local_commander_command');

        // Set the modal height.
        this.setHeight();

        // Add event listener to the background layer to hide the modal.
        this.mainModalBackLayer.addEventListener('click', () => {
            this.hide();
        });

        // Optimize search with a timeout.
        this.mainModalCommand.addEventListener('keydown', (e) => {
            const keyboardCode = e.keyCode || e.which;
            Log.debug(`Code pressed: ${keyboardCode}`);

            if ([ESCAPE, ENTER, ARROWUP, ARROWDOWN].includes(keyboardCode)) {
                return;
            }

            Log.debug('Searching');

            clearTimeout(timer);
            timer = setTimeout(() => {
                this.search(this.mainModalCommand.value);
            }, 100);
        });

        // Load the menu content once.
        if (this.json === '') {
            this.loadMenu();
        }
    },

    /**
     * Start the commander.
     */
    start() {
        window.addEventListener('keydown', (e) => {
            const keyboardCode = e.keyCode || e.which;
            Log.debug(`Code pressed: ${keyboardCode}`);
            Log.debug(`Trigger keys: ${commanderAppOptions.keys}`);
            Log.debug(`Commander is visible: ${this.isShow}`);

            // Check for arrow keys when the modal is open.
            if (this.isShow) {
                switch (keyboardCode) {
                    case ESCAPE:
                        this.hide();
                        break;
                    case ENTER:
                        e.preventDefault();
                        this.goToCommand();
                        break;
                    case ARROWUP:
                        e.preventDefault();
                        this.arrowUp();
                        break;
                    case ARROWDOWN:
                        e.preventDefault();
                        this.arrowDown();
                        break;
                }
                return;
            }

            // Check if the pressed key is one of the trigger keys.
            if (commanderAppOptions.keys.includes(keyboardCode.toString())) {
                Log.debug('Commander keyboard key triggered');

                // Validate that we're not in an editable area.
                const target = e.target;
                const tagName = target.tagName.toUpperCase();
                if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tagName) || target.isContentEditable) {
                    Log.debug('Ignoring keypress in editable element');
                    return;
                }

                e.preventDefault();

                // Render the modal if it hasn't been created yet.
                if (!this.mainModal) {
                    this.render();
                }

                Log.debug('Opening commander');

                if (this.isShow) {
                    this.hide();
                } else {
                    this.show();
                }
            }
        });
    },

    /**
     * Highlight words in the menu items.
     * @param {Node} node
     * @param {string} word
     */
    highlightWord(node, word) {
        if (node.nodeType === Node.TEXT_NODE) {
            const pos = node.data.toUpperCase().indexOf(word);
            if (pos >= 0) {
                const spannode = document.createElement('span');
                spannode.className = 'highlight';
                const middlebit = node.splitText(pos);
                middlebit.splitText(word.length);
                const middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes && !['SCRIPT', 'STYLE'].includes(node.tagName)) {
            node.childNodes.forEach((child) => {
                this.highlightWord(child, word);
            });
        }
    },

    /**
     * Navigate up in the menu.
     */
    arrowUp() {
        Log.debug('Navigating up');
        const activeItem = this.mainModal.querySelector('ul li.active');
        let prevItem = null;

        if (activeItem) {
            activeItem.classList.remove('active');
            prevItem = activeItem.previousElementSibling;
            while (prevItem && prevItem.style.display === 'none') {
                prevItem = prevItem.previousElementSibling;
            }
        }

        if (prevItem) {
            prevItem.classList.add('active');
        } else if (activeItem) {
            activeItem.classList.add('active');
        }

        this.scrollToActiveItem();
    },

    /**
     * Navigate down in the menu.
     */
    arrowDown() {
        Log.debug('Navigating down');
        const activeItem = this.mainModal.querySelector('ul li.active');
        let nextItem = null;

        if (activeItem) {
            activeItem.classList.remove('active');
            nextItem = activeItem.nextElementSibling;
            while (nextItem && nextItem.style.display === 'none') {
                nextItem = nextItem.nextElementSibling;
            }
        }

        if (nextItem) {
            nextItem.classList.add('active');
        } else {
            const items = Array.from(this.mainModal.querySelectorAll('ul li'));
            const lastVisibleItem = items.reverse().find((item) => item.style.display !== 'none');
            if (lastVisibleItem) {
                lastVisibleItem.classList.add('active');
            }
        }

        this.scrollToActiveItem();
    },

    /**
     * Scroll to the active menu item.
     */
    scrollToActiveItem() {
        const container = this.mainModal.querySelector('.local_commander-body div');
        const activeItem = this.mainModal.querySelector('li.active');

        if (activeItem && container) {
            container.scrollTop = activeItem.offsetTop - container.offsetTop - 10;
        }
    },

    /**
     * Execute the selected command.
     */
    goToCommand() {
        Log.debug('Executing command');
        const activeLink = this.mainModal.querySelector('ul li.active a');
        if (activeLink) {
            const link = activeLink.getAttribute('href');
            if (link !== '#') {
                window.location.href = link;
            }
        }
    },

    /**
     * Load the menu from the server.
     */
    loadMenu() {
        fetch(`${M.cfg.wwwroot}/local/commander/ajax.php?courseid=${commanderAppOptions.courseid}`, {
            method: 'GET',
            credentials: 'same-origin',
        })
            .then((response) => response.json())
            .then((data) => {
                Log.debug(data);
                this.json = data;

                this.setMenu();
                this.setHeight();
            })
            .catch(() => {
                notification.alert('js:error_parsing', 'local_commander');
            });
    },

    /**
     * Search the menu for the input word.
     * @param {string} word
     */
    search(word) {
        // Remove active state and show all items.
        const listItems = this.mainModal.querySelectorAll('.local_commander-body ul li');
        listItems.forEach((li) => {
            li.style.display = '';
            li.classList.remove('active');
        });

        // Remove existing highlights.
        const highlights = this.mainModal.querySelectorAll('.highlight');
        highlights.forEach((span) => {
            this.removeHighlight(span.parentNode);
        });

        if (word !== '') {
            const wordUpper = word.toUpperCase();
            let firstHighlighted = null;

            this.liSet.forEach((li) => {
                this.highlightWord(li, wordUpper);
                if (!firstHighlighted && li.querySelector('.highlight')) {
                    firstHighlighted = li;
                }
            });

            // Set the first matching item as active.
            if (firstHighlighted) {
                firstHighlighted.classList.add('active');
            }

            // Hide items that don't match.
            listItems.forEach((li) => {
                if (!li.querySelector('.highlight')) {
                    li.style.display = 'none';
                }
            });
        }
    },

    /**
     * Build the command menu.
     */
    setMenu() {
        Log.debug('Setting up menu');

        let html = '';

        if (commanderAppOptions.courseid > 0) {
            Log.debug('Including course administration menu');
            html += this.renderMenuItems(this.json.courseadmin, '');
        }

        html += this.renderMenuItems(this.json.admin, '');

        const ulElement = this.mainModal.querySelector('.local_commander-body ul');
        ulElement.innerHTML = html;

        this.liSet = this.mainModal.querySelectorAll('.local_commander-body ul li');
    },

    /**
     * Render menu items recursively.
     * @param {object} item
     * @param {string} parentName
     * @returns {string}
     */
    renderMenuItems(item, parentName) {
        if (!item.name) {
            return '';
        }

        let html = '';

        const fullName = parentName ? `${parentName} → ${item.name}` : item.name;
        html += `<li><a href="${item.link}">${fullName}</a></li>`;

        if (item.haschildren) {
            item.children.forEach((child) => {
                html += this.renderMenuItems(child, fullName);
            });
        }

        return html;
    },

    /**
     * Show the modal.
     */
    show() {
        this.mainModal.style.display = 'block';
        this.mainModalBackLayer.style.display = 'block';
        this.isShow = true;

        // Focus on the search field.
        this.mainModalCommand.focus();
    },

    /**
     * Hide the modal.
     */
    hide() {
        this.mainModal.style.display = 'none';
        this.mainModalBackLayer.style.display = 'none';
        this.isShow = false;
    },

    /**
     * Set the modal height to 50% of the viewport.
     */
    setHeight() {
        const height = Math.round(window.innerHeight / 2);
        this.mainModal.style.height = `${height}px`;
        const bodyDiv = this.mainModal.querySelector('.local_commander-body div');
        if (bodyDiv) {
            bodyDiv.style.height = `${height - 100}px`;
        }
    },

    /**
     * Remove highlights from text nodes.
     * @param {Node} node
     */
    removeHighlight(node) {
        node.innerHTML = node.textContent;
    },
};

/**
 * Initialize the module.
 * @param {object} params
 */
function init(params) {
    // Set the options.
    setOptions(params);

    // Wait for the DOM to be fully loaded.
    document.addEventListener('DOMContentLoaded', () => {
        Log.debug('DOM fully loaded - initializing commanderApp');
        Log.debug(commanderAppOptions);
        commanderApp.start();
    });
}

export default {
    init,
};
