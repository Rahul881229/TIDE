import styles from './sidebar.scss';
class SideBar extends HTMLElement {

    constructor() {
        super();
        setTimeout(() => {
            let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";

            // console.log("theme of slidebar---",theme)
            const template = document.createElement('template');
            template.innerHTML = `
            <style>${styles.toString()}</style>
            <div id="sidebarmenu" class="sidebarmenu ${theme}">
                <slot name="menu"></slot>
            </div>
            `;

            // Add a shadow DOM
            const shadowDOM = this.attachShadow({ mode: 'open' });
            // render
            shadowDOM.appendChild(template.content.cloneNode(true));
        }, 0);
    }

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return ['theme'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'theme' && newValue) {
            if (this.shadowRoot) {
                let tag = this.shadowRoot.querySelectorAll('.sidebarmenu')[0];
                if (oldValue) {
                    tag.classList.remove(oldValue);
                }
                tag.classList.add(newValue);
            }
        }
    }

    adoptedCallback() {
        // console.log("adoptedCallback:::Html Element", this.getAttribute('datetime'));
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    connectedCallback() {

        /* const tabsSlot = this.shadowRoot.querySelector('slot');
        console.log(tabsSlot);
        this.tabs = tabsSlot.assignedNodes({
            flatten: false
        });

        this._boundOnTitleClick = this._onTitleClick.bind(this);
        tabsSlot.addEventListener('click', this._boundOnTitleClick); */
    }

    /* get selected() {
        return selected_;
    }

    set selected(idx) {
        selected_ = idx;
        this._selectTab(idx);
        this.setAttribute('selected', idx);
    }

    _selectTab(idx = null) {
        for (let i = 0, tab; tab = this.tabs[i]; ++i) {
            let select = i === idx;
            tab.setAttribute('tabindex', select ? 0 : -1);
            tab.setAttribute('aria-selected', select);
            this.panels[i].setAttribute('aria-hidden', !select);
        }
    } */

    /* _onTitleClick(e) {
        console.log(e);
        // if (e.target.slot === 'label') {
        console.log(e.target);
        // console.log(this.tabs.indexOf(e.target));
        // }
    } */
}
export default SideBar;
// window.customElements.define('t-sidebar', SideBar);