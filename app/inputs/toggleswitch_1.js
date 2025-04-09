import styles from './toggleswitch.scss';
class ToggleSwitch extends HTMLElement {

    #toggleinternals = this.attachInternals();
    #toggle = HTMLInputElement;


    constructor() {
        super();
        let toggleSize = '';
        if (this.hasAttribute("small") || this.hasAttribute("sm")) {
            toggleSize = 'sm';
        } else if (this.hasAttribute("large") || this.hasAttribute("lg")) {
            toggleSize = 'lg';
        }

        const template = document.createElement('template');
        template.innerHTML = `
            <style>${styles.toString()}</style>
            <label class="tswitch ${toggleSize}">
                <input type="checkbox">
                <span class="slider round"></span>
            </label>
            `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        setTimeout(() => {
            this.#toggle = this.shadowRoot.querySelector('input');
        }, 0);
        // Add a shadow DOM
    }

    get value() { return this.#toggle.checked; }
    set value(v) { setTimeout(() => { this.#toggle.checked = v; }, 0); }
    get validity() { return this.#toggleinternals.validity; }
    get validationMessage() { return this.#toggleinternals.validationMessage; }
    get willValidate() { return this.#toggleinternals.willValidate; }

    disconnectedCallback() {
        if (this.shadowRoot) {
            this.shadowRoot.removeEventListener('change', this.connectedCallback);
        }
    }

    static get observedAttributes() {
        return ['theme', 'checked', 'disabled', 'lang', 'tooltip-checked', 'tooltip-unchecked', 'value','deselect'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        setTimeout(() => {
            console.log(name, oldValue, newValue);

            if (this.shadowRoot) {
                this.#toggle.setAttribute(name, newValue);
                switch (name) {
                    case 'theme':
                        let tag = this.shadowRoot.querySelector('.tswitch');
                        if (oldValue) {
                            tag.classList.remove(oldValue);
                        }
                        tag.classList.add(newValue);
                        break;
                    case 'tooltip-checked':
                        this.setAttribute('title', this.shadowRoot.querySelector('input').checked ? newValue : this.getAttribute('tooltip-unchecked'));
                        break;
                    case 'tooltip-unchecked':
                        this.setAttribute('title', this.shadowRoot.querySelector('input').checked ? this.getAttribute('tooltip-checked') : newValue);
                        break;
                    case 'checked':
                        if (newValue == "true" || newValue == true) {
                            this.#toggle.checked = true;
                        } else {
                            this.#toggle.checked = false;
                        }
                        break;
                    case 'disabled':
                        if (newValue == "true") {
                            this.#toggle.disabled = true;
                        } else {
                            this.#toggle.disabled = false;
                        }
                        break;
                    default:
                        break;
                }
            }
        }, 0);
    }

    adoptedCallback() {
        console.log("adoptedCallback:::Html Element", this.getAttribute('datetime'));
    }

    actionCheck() {

    }



    connectedCallback() {
        console.log("connectedCallback");
        const inputElement = this.shadowRoot.querySelector('input');

        const setTooltip = () => {
            const tooltipChecked = this.getAttribute('tooltip-checked');
            const tooltipUnchecked = this.getAttribute('tooltip-unchecked');

            if (tooltipChecked && tooltipUnchecked) {
                this.title = inputElement.checked ? tooltipChecked : tooltipUnchecked;
            }
        };

        // Set initial tooltip
        setTooltip();

        // Event listener for when the toggle state changes
        inputElement.addEventListener('change', () => {
            setTooltip();
            if (this.getAttribute('deselect') === 'true') {
                // Simply revert back to the previous state (don't update the toggle)
                this.#toggle.checked = !this.#toggle.checked;
            }
            // Dispatch custom event if callback attribute is present
            this.dispatchEvent(new CustomEvent("ttoggleswitch", {
                bubbles: true,
                detail: {
                    version: '2.2.21',
                    method: this.getAttribute("callback"),
                    params: "",
                    data: {
                        toggleswitch: inputElement.checked
                    }
                }
            }))
            this.#toggle.checked = inputElement.checked;
        });

    }
}





export default ToggleSwitch;