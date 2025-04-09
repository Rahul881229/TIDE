class TrinityApp extends HTMLElement {
    constructor() {
        super();
        let tmpl = document.createElement('template');
        tmpl.innerHTML = `

        <style>
        .tide-dark {
            height: 100%;
            /* font-family: "Open Sans", sans-serif; */
            /*    background: white; */
          }
        </style>
        <div class='tide-dark'>
            <slot name='header'></slot>
            <slot name='container'></slot>
            <slot name='footer'></slot>
        </div>`;

        // Attach a shadow root to the element.
        let shadowRoot = this.attachShadow({
            mode: 'open'
        });
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
    }

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return [ /* array of attribute names to monitor for changes */];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // called when one of attributes listed above is modified
    }

    adoptedCallback() {
        // console.log("adoptedCallback:::Html Element", this.getAttribute('datetime'));
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    connectedCallback() { }
}
export default TrinityApp;
// window.customElements.define('t-applayout', TrinityApp);