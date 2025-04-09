import styles from './disclosure.scss';
'use strict';
let callbackFn = "";
// let closeBtn = '';
class Disclosure extends HTMLElement {
    static get observedAttributes() {
        return ['open'];
    }

    constructor() {
        super();
        this.callbackFn = this.getAttribute("callback");
        this.attachShadow({
            mode: 'open'
        });
        this.close = this.close.bind(this);
    }

    disconnectedCallback() {
        let closeBtn = this.querySelector("disclosure-close-btn");
        closeBtn.removeEventListener('click', this.close);
        this.shadowRoot.querySelector('button').removeEventListener('click', this.close);
        this.shadowRoot.querySelector('.overlay').removeEventListener('click', this.close);
    }


    adoptedCallback() {
        // console.log("adoptedCallback:::Html Element", this.getAttribute('datetime'));
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    connectedCallback() {
        let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : 'dark';
        const title = this.getElementsByClassName("t-disclosure-title")[0].innerHTML;
        const style = (this.getAttribute("style") ? `style=${this.getAttribute("style")}` : '');
        const content = this.getElementsByClassName("t-disclosure-content")[0].innerHTML;

        const footer = (this.getElementsByClassName("t-disclosure-footer").length > 0) ? `<div id="footer" class="footer">${this.getElementsByClassName("t-disclosure-footer")[0].innerHTML}</div>` : '';
        const { shadowRoot } = this;
        shadowRoot.innerHTML = `
        <style>${styles.toString()}</style>
        <div class="wrapper ${theme}">
            <div class="overlay"></div>
          <div class="disclosure" ${style} role="disclosure" aria-labelledby="title" aria-describedby="content">
            <div class="disclosure-top">
                <div class="t-disclosure-title">${title}</div>
                <button class="close" aria-label="Close">&times;</button> 
                <!-- <div class="t-disclosure-close">
                    <slot name="close"></slot>
                </div>-->
            </div>
            <div id="content" class="content">
              ${content}
            </div>
            ${footer}
          </div>
        </div>`;

        // console.log(shadowRoot.querySelector('slot[name="close"]').assignedElements()[0]);
        // console.log(shadowRoot.querySelector('slot[name="close"]').assignedElements()[0].shadowRoot.querySelector("button"));
        shadowRoot.querySelector('button').addEventListener('click', this.close);
        shadowRoot.querySelector('.overlay').addEventListener('click', this.close);
        // console.log(this.closeBtn);
        /* closeBtn.addEventListener('click', () => {
            console.log("hey thekrekrk");
        }); */
        this.open = this.open;
    }

    get open() {
        return this.hasAttribute('open');
    }

    set open(isOpen) {
        const {
            shadowRoot
        } = this;
        shadowRoot.querySelector('.wrapper').classList.toggle('open', isOpen);
        shadowRoot.querySelector('.wrapper').setAttribute('aria-hidden', !isOpen);
        if (isOpen) {
            this._wasFocused = document.activeElement;
            this.setAttribute('open', '');
            document.addEventListener('keydown', this._watchEscape);
            this.focus();
            // shadowRoot.querySelector('button').focus();

            var checkEvent = new CustomEvent("tdisclosure", {
                bubbles: true,
                detail: {
                    version: '1.0',
                    method: this.callbackFn,
                    params: "",
                    data: {
                        mode: 'open'
                    }
                }
            });
            if (this.dispatchEvent(checkEvent)) {
                // Do default operation here
                console.log('Performing default operation');
            } else {
                console.log("No callback Abvailable");
            }

        } else {
            this._wasFocused && this._wasFocused.focus && this._wasFocused.focus();
            this.removeAttribute('open');
            document.removeEventListener('keydown', this._watchEscape);
            this.close();
        }
    }
    newMethod() {
        console.log("inside new method =>", this);
        let closeBtn = 3;
    }

    close() {
        if (this.open !== false) {
            this.open = false;
            var checkEvent = new CustomEvent("tdisclosure", {
                bubbles: true,
                detail: {
                    version: '1.0',
                    method: this.callbackFn,
                    params: "",
                    data: {
                        mode: 'close'
                    }
                }
            });
            if (this.dispatchEvent(checkEvent)) {
                // Do default operation here
                console.log('Performing default operation');
            } else {
                console.log("No callback Abvailable");
            }
        }
        const closeEvent = new CustomEvent('disclosure-closed');
        this.dispatchEvent(closeEvent);
    }

    _watchEscape(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }

    static get observedAttributes() {
        return ['theme'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'theme' && newValue) {
            if (this.shadowRoot) {               
                let tag = this.shadowRoot.querySelectorAll('.wrapper')[0];
                if (oldValue) {
                    tag.classList.remove(oldValue);
                }
                tag.classList.add(newValue);
            }
        } else if (oldValue !== newValue) {
            // this[attrName] = this.hasAttribute(attrName);
        }
    }
}
export default Disclosure;