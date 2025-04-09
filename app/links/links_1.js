import styles from './links.scss';

class link extends HTMLElement {

    constructor() {
        super();
        setTimeout(() => {
            // console.log("this", this.textContent);
            const template = document.createElement('template');
            let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
            let href = this.hasAttribute("href") ? this.getAttribute("href") : "";
            let text = this.textContent;
            let target = this.hasAttribute("target") ? this.getAttribute("target") : "";

            template.innerHTML = `
                <style> ${styles.toString()} </style >
                <a class="tlinks ${theme}" href=${href} target=${target}>${text}</a>
            `;

            // Add a shadow DOM
            const shadowDOM = this.attachShadow({ mode: 'open' });
            // render
            shadowDOM.appendChild(template.content.cloneNode(true));

            // this.addEventListener('click', this._onClick);
        }, 0);
    }
    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    /* _onClick(event) {
        console.log("Onlcikijd", event);
    } */

    static get observedAttributes() {
        return ['theme', 'href', 'target'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
        const linkElement = this.shadowRoot.querySelector('.tlinks');
        if (name == 'theme' && newValue) {
            
                let tag = this.shadowRoot.querySelectorAll('.tlinks')[0];
                if (oldValue) {
                    tag.classList.remove(oldValue);
                }
                tag.classList.add(newValue);
           
        }
        if (name === 'href') {
            linkElement.setAttribute('href', newValue);
        }
        if (name === 'target') {
            linkElement.setAttribute('target', newValue);
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
export default link;