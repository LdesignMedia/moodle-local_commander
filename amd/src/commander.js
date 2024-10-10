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
// This file is part of Moodle - http://moodle.org/
// Moodle is free software: you can redistribute it and/or modify it under the terms of the GNU GPL v3 or later.

// Initialize the module with imports.
import notification from 'core/notification';
import Log from 'core/log';

/**
 * Keyboard key codes mapped to their respective event.key values.
 */
const KEYS = {
    ESCAPE: 'Escape',
    ENTER: 'Enter',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
};

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
            commanderAppOptions[key] = options[key];
        }
    });
}

/**
 * The maifn commander application.
 */
const commanderApp = {
    /**
     * Modal DOM element instance.
     */
    mainModal: false,

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
    json: null,

    /**
     * Render the UI.
     */
    render() {
        Log.debug('Rendering UI');

        // Create the modal HTML using a template literal.
        const modalHtml = `
            <div id="local_commander_modal" class="local_commander" role="dialog"
             aria-modal="true" aria-labelledby="local_commander_header">
                <div class="local_commander-header">
                    <h2 id="local_commander_header">${M.util.get_string('js:header', 'local_commander')}</h2>
                </div>
                <div class="local_commander-body">
                    <div><ul></ul></div>
                </div>
                <input type="text" name="local_commander_command" id="local_commander_command"
                 placeholder="${M.util.get_string('js:command_placeholder', 'local_commander')}"
                  aria-label="${M.util.get_string('js:command_placeholder', 'local_commander')}">
            </div>
            <div id="local_commander_back_layer" class="local_commander-backdrop"></div>
        `;

        // Append the modal to the body.
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Set references to the modal elements.
        this.mainModal = document.getElementById('local_commander_modal');
        this.mainModalBackLayer = document.getElementById('local_commander_back_layer');
        this.mainModalCommand = document.getElementById('local_commander_command');

        // Set the modal height.
        this.setHeight();

        // Add event listeners.
        this.addEventListeners();

        // Load the menu content once.
        if (!this.json) {
            this.loadMenu();
        }
    },

    /**
     * Start the commander.
     */
    start() {
        window.addEventListener('keydown', (e) => {
            Log.debug(`Key pressed: ${e.key}`);

            Log.debug(`Commander is visible: ${this.isShow}`);

            // Check for arrow keys when the modal is open.
            if (this.isShow) {
                switch (e.key) {
                    case KEYS.ESCAPE:
                        this.hide();
                        break;
                    case KEYS.ENTER:
                        e.preventDefault();
                        this.goToCommand();
                        break;
                    case KEYS.ARROW_UP:
                        e.preventDefault();
                        this.navigateMenu('up');
                        break;
                    case KEYS.ARROW_DOWN:
                        e.preventDefault();
                        this.navigateMenu('down');
                        break;
                    default:
                        break;
                }
                return;
            }

            // Check if the pressed key is one of the trigger keys.
            if (commanderAppOptions.keys.includes(e.key)) {
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
     * Add event listeners to modal elements.
     */
    addEventListeners() {
        // Close the modal when clicking the backdrop.
        this.mainModalBackLayer.addEventListener('click', () => {
            this.hide();
        });

        // Optimize search with a debounced input event.
        const debouncedSearch = this.debounce(() => {
            this.search(this.mainModalCommand.value);
        }, 200);

        this.mainModalCommand.addEventListener('input', debouncedSearch);
    },

    /**
     * Debounce function to limit the rate of function execution.
     * @param {function} func
     * @param {number} wait
     * @returns {function}
     */
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    /**
     * Navigate through the menu items.
     * @param {string} direction - 'up' or 'down'
     */
    navigateMenu(direction) {
        Log.debug(`Navigating ${direction}`);
        const activeItem = this.mainModal.querySelector('ul li.active');
        let newItem = null;

        if (activeItem) {
            activeItem.classList.remove('active');
            newItem = direction === 'up' ? activeItem.previousElementSibling : activeItem.nextElementSibling;

            while (newItem && newItem.style.display === 'none') {
                newItem = direction === 'up' ? newItem.previousElementSibling : newItem.nextElementSibling;
            }
        }

        if (newItem) {
            newItem.classList.add('active');
        } else if (activeItem) {
            activeItem.classList.add('active');
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
    async loadMenu() {
        try {
            const response = await fetch(`${M.cfg.wwwroot}/local/commander/ajax.php?courseid=${commanderAppOptions.courseid}`, {
                method: 'GET',
                credentials: 'same-origin',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            this.json = await response.json();
            Log.debug(this.json);
            this.setMenu();
            this.setHeight();
        } catch (error) {
            Log.error(error);
            notification.alert(M.util.get_string('js:error_parsing', 'local_commander'));
        }
    },

    /**
     * Search the menu for the input word.
     * @param {string} query
     */
    search(query) {
        // Normalize the query.
        const searchTerm = query.trim().toUpperCase();

        // Get all list items.
        const listItems = Array.from(this.liSet);

        // Remove previous highlights and hide non-matching items.
        listItems.forEach((li) => {
            this.removeHighlight(li);
            li.style.display = '';
            li.classList.remove('active');
        });

        if (searchTerm === '') {
            return;
        }

        let firstMatch = null;

        listItems.forEach((li) => {
            const textContent = li.textContent.toUpperCase();
            if (textContent.includes(searchTerm)) {
                this.highlightWord(li, searchTerm);
                if (!firstMatch) {
                    firstMatch = li;
                }
            } else {
                li.style.display = 'none';
            }
        });

        if (firstMatch) {
            firstMatch.classList.add('active');
            this.scrollToActiveItem();
        }
    },

    /**
     * Highlight words in the menu items.
     * @param {HTMLElement} element
     * @param {string} word
     */
    highlightWord(element, word) {
        const regex = new RegExp(`(${word})`, 'gi');
        element.innerHTML = element.innerHTML.replace(regex, '<span class="highlight">$1</span>');
    },

    /**
     * Remove highlights from an element.
     * @param {HTMLElement} element
     */
    removeHighlight(element) {
        element.innerHTML = element.textContent;
    },

    /**
     * Build the command menu.
     */
    setMenu() {
        Log.debug('Setting up menu');

        let html = '';

        if (commanderAppOptions.courseid > 0 && this.json.courseadmin) {
            Log.debug('Including course administration menu');
            html += this.renderMenuItems(this.json.courseadmin, '');
        }

        if (this.json.admin) {
            html += this.renderMenuItems(this.json.admin, '');
        }

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

        if (item.haschildren && item.children) {
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

        // Clear the search input.
        this.mainModalCommand.value = '';

        // Reset the menu.
        this.search('');
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
};

/**
 * Initialize the module.
 * @param {object} params
 */
function init(params) {
    // Set the options.
    setOptions(params);

    // Wait for the DOM to be fully loaded.
    Log.debug('DOM fully loaded - initializing commanderApp');
    Log.debug(commanderAppOptions);
    commanderApp.start();
}

export default {
    init,
};
