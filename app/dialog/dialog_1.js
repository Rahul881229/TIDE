import styles from './dialog.scss';

class Dialog extends HTMLElement {
    constructor() {
        super();
        this.callbackFn = this.getAttribute("callback");
        this.attachShadow({ mode: 'open' });
        this.close = this.close.bind(this);
    }

    disconnectedCallback() {
        let closeBtn = this.querySelector("dialog-close-btn");
        if (closeBtn) {
            closeBtn.removeEventListener('click', this.close);
        }
        let button = this.shadowRoot.querySelector('button');
        if (button) {
            button.removeEventListener('click', this.close);
        }
        let overlay = this.shadowRoot.querySelector('.overlay');
        if (overlay) {
            overlay.removeEventListener('click', this.close);
        }
    }

    connectedCallback() {
        this._render();
    }

    _render() {
        setTimeout(() => {
            let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : 'dark';
            const style = (this.hasAttribute("style") ? `style="${this.getAttribute("style")}"` : '');
            const dismissable = this.hasAttribute("dismissable") ? this.getAttribute("dismissable") === "true" : true;
            const overlayStyle = dismissable ? 'pointer-events: auto;' : 'pointer-events: none;';


            const { shadowRoot } = this;
            shadowRoot.innerHTML = `
                <style>${styles.toString()}</style>
                <div class="wrapper ${theme}">
                    <div class="overlay" style="${overlayStyle}"></div>
                    <div class="dialog" ${style} role="dialog" aria-labelledby="title" aria-describedby="content">
                        <slot name="title"></slot>
                        <slot name="content"></slot>
                        <slot name="footer"></slot>
                    </div>
                </div>`;

            if (shadowRoot.querySelector('button')) {
                shadowRoot.querySelector('button').addEventListener('click', this.close);
            }
            if (shadowRoot.querySelector('.overlay')) {
                shadowRoot.querySelector('.overlay').addEventListener('click', this.close);
            }

            let position = this.getAttribute('position');
            this.updatePosition(position);
        }, 0);
    }

    get open() {
        return this.hasAttribute('open');
    }

    set open(isOpen) {
        const { shadowRoot } = this;
        shadowRoot.querySelector('.wrapper').classList.toggle('open', isOpen);
        shadowRoot.querySelector('.wrapper').setAttribute('aria-hidden', !isOpen);
        if (isOpen) {
            this._wasFocused = document.activeElement;
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }

    close() {
        if (this.open !== false) {
            this.open = false;
            this.dispatchEvent(new CustomEvent("tdialog", {
                bubbles: true,
                detail: {
                    version: '2.2.21',
                    method: this.callbackFn,
                    params: "",
                    data: {
                        mode: 'close'
                    }
                }
            }));
        }
        const closeEvent = new CustomEvent('dialog-closed');
        this.dispatchEvent(closeEvent);
    }

    static get observedAttributes() {
        return ['theme', 'dismissable', 'position','style'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'dismissable' && this.shadowRoot) {
            const overlay = this.shadowRoot.querySelector('.overlay');
            if (overlay) {
                overlay.style.pointerEvents = newValue === 'true' ? 'auto' : 'none';
            }
        }
        if (name === 'theme' && newValue) {
            if (this.shadowRoot) {
                let tag = this.shadowRoot.querySelectorAll('.wrapper')[0];
                if (tag) {
                    if (oldValue) {
                        tag.classList.remove(oldValue);
                    }
                    tag.classList.add(newValue);
                }
            }
        }
        if (name === 'position' && newValue) {
            this.updatePosition(newValue);

        }

        if (name === 'style' && this.shadowRoot) {
            // Update styles in the shadow DOM dynamically when the 'style' attribute changes
            const dialog = this.shadowRoot.querySelector('.dialog');
            if (dialog) {
                dialog.setAttribute('style', newValue); // Apply the new style to the dialog
            }
        }
    }



    updatePosition(newValue) {
        if (this.shadowRoot) {
            let dialog = this.shadowRoot.querySelector('.dialog');
            if (dialog) {
                dialog.style.top = newValue === 'top' ? 0 : 'auto';
                dialog.style.bottom = newValue === 'bottom' ? 0 : 'auto';
                dialog.style.left = newValue === 'center' ? '50%' : 'auto';
                dialog.style.transform = newValue === 'center' ? 'translateX(-50%)' : 'none';
            }
        }
    }
}

export default Dialog;

// window.customElements.define("t-dialog", Modal);