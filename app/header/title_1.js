class Title extends HTMLElement {

    constructor() {
        super();
        console.log("LOGO Loaded",);
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

    connectedCallback() {
        var property = {};
        property.title = this.getAttribute("text");
        console.log("property", property);
        this.innerHTML = `
        <style>
            t-title {
                padding: 1vh 1vh 0 1vh;
            }
            t-title .application-title {
                font-size: 3vh;
                color: white;
                font-weight: bolder;
            }
        </style>

        <div class="application-title">` + property.title + `</div>

        `;
    }
}
customElements.define('t-title', Title);