import styles from './mobilelayout.scss';
class MobileLayout12 extends HTMLElement {
  constructor() {
    super();
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
            <style>${styles.toString()}</style>
            <div class="t-mobilelayout-12">
                 <div class="t-layout-100 box-sizing" style="border:1px solid grey">

                    <div class="t-layout-80 t-layout-25h flex center box-sizing" style="margin:40px auto 0 auto; ">
                       <div class="t-layout-70 t-layout-100h box-sizing" style="border:1px solid grey">
                         <slot name='slot1-1'></slot>
                       </div>
                       <div class="t-layout-30 t-layout-100h box-sizing" style="border:1px solid grey">
                         <slot name='slot1-2'></slot>
                      </div>
                    </div>

                    <div class="t-layout-80 t-layout-25h flex center box-sizing" style="margin:20px auto; ">
                       <div class="t-layout-70 t-layout-100h box-sizing" style="border:1px solid grey">
                         <slot name='slot2-1'></slot>
                       </div>
                       <div class="t-layout-30 t-layout-100h box-sizing" style="border:1px solid grey">
                         <slot name='slot2-2'></slot>
                      </div>
                    </div>

                    <div class="t-layout-80 t-layout-25h flex center box-sizing" style="margin:0 auto;">
                       <div class="t-layout-70 t-layout-100h box-sizing" style="border:1px solid grey">
                         <slot name='slot3-1'></slot>
                       </div>
                       <div class="t-layout-30 t-layout-100h box-sizing" style="border:1px solid grey">
                         <slot name='slot3-2'></slot>
                      </div>
                    </div>
                  </div> 
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
    return [ /* array of attribute names to monitor for changes */ ];
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

export default MobileLayout12;