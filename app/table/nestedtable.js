import styles from './nestedtable.scss';

class NestedTable extends HTMLElement {
    constructor() {
        super();

        let lang = this.getAttribute("lang") === 'ar' ? 'dir="rtl" lang="ar"' : '';
        let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
        let isOpen = this.hasAttribute("open") ? this.getAttribute("open") === 'true' : false;

        const template = document.createElement('template');
        template.innerHTML = `
            <style>${styles.toString()}</style> 
            <div id="tableId" class='table-wrap ${theme}' ${lang} style="display: ${isOpen ? 'contents' : 'none'};">
                <slot name="table"></slot>
            </div>`;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Add event listener to handle row clicks
        this.shadowRoot.addEventListener('click', this.handleRowClick.bind(this));
    }

    connectedCallback() {
        // Add event listener to handle row clicks
        this.addEventListener('click', this.handleRowClick.bind(this));

        // Check the initial value of the "open" attribute and set visibility
        const isOpen = this.hasAttribute("open") ? this.getAttribute("open") === 'true' : false;
        const tableWrapper = this.shadowRoot.querySelector('.table-wrap');
        if (tableWrapper) {
            tableWrapper.style.display = isOpen ? 'contents' : 'none';

            // If initially closed, hide the entire row
            if (!isOpen) {
                const parentRow = this.closest('tr');
                if (parentRow) {
                    parentRow.style.display = 'none';
                }
            }
        }



        const nestedTables = this.querySelectorAll('t-nested-table');
        nestedTables.forEach(nestedTable => {
            const isNestedTable = nestedTable.parentElement.classList.contains('nested-table-row');
            const nestedTableOpen = nestedTable.hasAttribute("open") ? nestedTable.getAttribute("open") === 'true' : false;

            if (isNestedTable) {
                nestedTable.style.display = nestedTableOpen ? 'contents' : 'none';
                const parentRow = nestedTable.closest('tr');
                if (parentRow) {
                    parentRow.style.display = isOpen ? 'none' : 'table-row';
                }
            } else {
                nestedTable.style.display = '';
            }
        });
    }

    static get observedAttributes() {
        return ['theme', 'lang', 'open'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'theme' && newValue) {
            let tag = this.shadowRoot.querySelector('.table-wrap');
            if (tag) {
                if (oldValue) {
                    tag.classList.remove(oldValue);
                }
                tag.classList.add(newValue);
            }
        }
        if (name === 'lang' && newValue) {
            let id = this.shadowRoot.getElementById('tableId');
            if (newValue === 'ar') {
                if (id) {
                    id.setAttribute("dir", 'rtl');
                }
            } else {
                id.removeAttribute("dir");
            }
        }
        if (name === 'open') {
            // Handle open attribute changes
            const tableWrapper = this.shadowRoot.querySelector('.table-wrap');
            if (tableWrapper) {
                tableWrapper.style.display = newValue === 'true' ? 'contents' : 'none';
            }
        }
    }

    toggleInnerTable(clickedRow) {
        const innerTable = clickedRow.querySelector('.inner-table');

        if (innerTable) {
            this.toggleVisibility(innerTable);
        } else {
            this.createInnerTable(clickedRow);
        }
    }

    createInnerTable(parentRow) {
        const innerTable = document.createElement('table');
        innerTable.classList.add('inner-table');

        // Customize the inner table as needed

        // Append the inner table to the parent row
        parentRow.appendChild(innerTable);

        // Add event listener to handle row clicks in the inner table
        innerTable.addEventListener('click', this.handleRowClick.bind(this));
    }

    handleRowClick(event) {
        const clickedRow = event.target.closest('tr');

        if (!clickedRow) {
            console.log('Clicked outside of row or row not found.');
            return; // Ignore clicks outside of rows
        }

        const nextRow = clickedRow.nextElementSibling;

        if (nextRow) {
            const hasNestedTable = nextRow.classList.contains('nested-table-row');

            if (hasNestedTable) {
                // Toggle the visibility of the nested row
                this.toggleVisibility(nextRow);

                const nestedTable = nextRow.querySelector('t-nested-table');

                if (nestedTable) {
                    // Toggle the 'open' attribute on the t-table of the nested table
                    const isOpen = nestedTable.getAttribute('open') === 'true';
                    nestedTable.setAttribute('open', isOpen ? 'false' : 'true');

                    // Update the display style of td elements based on the 'open' attribute
                    const tdElements = nextRow.querySelectorAll('td');
                    tdElements.forEach(td => {
                        td.style.display = isOpen ? 'none' : 'table-cell'; // Set display to 'none' if open is true
                    });

                    const parentRow = nextRow.closest('tr');
                    if (parentRow) {
                        parentRow.style.display =

                            isOpen ? 'none' : 'table-row';
                    }
                }

                // Stop event propagation if the clicked row is inside a nested table
                if (nestedTable && event.target.tagName.toLowerCase() !== 't-nested-table') {
                    event.stopPropagation();
                }
            } else {
                // If there's no nested table, do nothing
                console.log('No nested table row found.');
            }
        } else {
            console.log('Clicked on the last row. No next row found.');
        }
    }

    toggleVisibility(element) {
        // Toggle the visibility of the element with a smooth transition
        element.classList.toggle('hidden');
    }
}

// Register the custom element
customElements.define('t-nested-table', NestedTable);
export default NestedTable;