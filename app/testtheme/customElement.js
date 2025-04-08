import styles from './customElement.scss';

class MyCustomElement extends HTMLElement {

    constructor() {
        super();
        const theme = this.getAttribute('theme');

        const template = document.createElement('template');
        template.innerHTML = `
              <style>${styles.toString()}</style>
              <p class='dark'>testing</p>
            `;

        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));

        let paragraph = this.shadowRoot.querySelector('p');

    }
    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return ['theme'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`${name}'s value has been changed from ${oldValue} to ${newValue}`);
        if (name == 'theme' && newValue) {
            let ptest = this.shadowRoot.querySelectorAll('p')[0];
            if (oldValue) {
                ptest.classList.remove(oldValue);
            }

            ptest.classList.add(newValue);
            /* if (newValue == 'light') {
                // console.log("attributeChangedCallback ->", this.shadowRoot.querySelectorAll('p')[0]);
                ptest.classList.add('light');
            } else if (newValue == 'dark') {
                ptest.classList.add('light');
            } else if (newValue == 'primary') {
                ptest.classList.add('light');
            } */
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
export default MyCustomElement;