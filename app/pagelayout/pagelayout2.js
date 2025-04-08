class PageLayout2 extends HTMLElement {
    constructor() {
        super();
        let tmpl = document.createElement('template');
        tmpl.innerHTML = `
            <style>/* .t-pagelayout {
                width: 96.9vw;
            } */
            .t-pagelayout-1,
            .t-pagelayout-2,
            .t-pagelayout-3,
            .t-pagelayout-4,
            .t-pagelayout-5,
            .t-pagelayout-6,
            .t-pagelayout-7,
            .t-pagelayout-8,
            .t-pagelayout-9,
            .t-pagelayout-10 {
                width        : 100%;
                display      : -webkit-box;
                display      : -ms-flexbox;
                display      : flex;
                -ms-flex-wrap: wrap;
                flex-wrap    : wrap;
                height       : 100%;
                overflow-y   : auto;
                margin-bottom: 20px;
            }
            
            .t-layout-100 {
                width: 100%;
            }
            
            .t-layout-70 {
                width: 70%;
            }
            
            .t-layout-75 {
                width: 75%;
            }
            
            .t-layout-50 {
                width: 50%;
            }
            
            .t-layout-60 {
                width: 60%;
            }
            
            .t-layout-40 {
                width: 40%;
            }
            
            .t-layout-35 {
                width: 35%;
            }
            
            .t-layout-30 {
                width: 30%;
            }
            
            .t-layout-35 {
                width: 35%;
            }
            
            .t-layout-25 {
                width: 25%;
            }
            
            .t-layout-20 {
                width: 20%;
            }
            
            .flex {
                display: flex;
            }
            
            .t-layout-100h {
                height: 100%;
            }
            
            .t-layout-70h {
                height: 70%;
            }
            
            .t-layout-75h {
                height: 75%;
            }
            
            .t-layout-60h {
                height: 60%;
            }
            
            .t-layout-50h {
                height: 50%;
            }
            
            .t-layout-40h {
                height: 40%;
            }
            
            .t-layout-30h {
                height: 30%;
            }
            
            .t-layout-33h {
                height: 33.33%;
            }
            
            .t-layout-25h {
                height: 25%;
            }
            
            .t-layout-20h {
                height: 20%;
            }
            
            .t-layout-80h {
                height: 80%;
            }
            
            .box-sizing {
                box-sizing: border-box;
            }</style>
            <div class='t-pagelayout-2'>
                <div class='t-layout-50 box-sizing'>
                    <slot name='slot1'></slot>
                </div>
                <div class='t-layout-50 box-sizing'>
                    <slot name='slot2'></slot>
                </div>
            </div>
        `;

        // Attach a shadow root to the element.
        let shadowRoot = this.attachShadow({ mode: 'open' });
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

    connectedCallback() {

    }
}
export default PageLayout2;
// window.customElements.define('t-pagelayout-2', PageLayout2);