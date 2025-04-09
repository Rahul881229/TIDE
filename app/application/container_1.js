import styles from './container.scss';

class TrinityContainer extends HTMLElement {
    constructor() {
        super();
        setTimeout(() => {
            let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
            let lang = this.hasAttribute("lang") ? (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '') : '';
            // console.log("this---", this);
            // console.log("this.querySelector('t-sidebar')---", this.querySelector('t-sidebar'));
            let slotted = this.querySelector('t-sidebar') ? '' : 'sidebarHide';

            const template = document.createElement('template');
            template.innerHTML = `
            <style>${styles.toString()}</style>
            <div class='t-container ${theme}' ${lang}>
                <div id="mySidebar" class='sidebar ${slotted}'>
                    <slot name='sidebar'></slot>
                </div>
                <div id="main" class='layout ${slotted}'>
                    <slot name='layout'></slot>
                </div>
            </div>
            `;


            const shadowDOM = this.attachShadow({ mode: 'open' });
            shadowDOM.appendChild(template.content.cloneNode(true));

        }, 0);

    }

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return ['theme', 'lang'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            if (name == 'theme' && newValue) {
                let tag = this.shadowRoot.querySelectorAll('.t-container')[0];
                if (oldValue) {
                    tag.classList.remove(oldValue);
                }
                tag.classList.add(newValue);
            }
            if (name == 'lang' && newValue) {
                let tag = this.shadowRoot.querySelectorAll('.t-container')[0];
                tag.setAttribute('lang', newValue);
                if (newValue == 'ar') {
                    tag.setAttribute('dir', 'rtl');
                } else {
                    tag.setAttribute('dir', 'ltr');
                }
            }
        }
    }

    adoptedCallback() {
        // console.log("adoptedCallback:::Html Element", this.getAttribute('datetime'));
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    connectedCallback() {

    }
}
export default TrinityContainer;
// window.customElements.define('t-container', TrinityContainer);
