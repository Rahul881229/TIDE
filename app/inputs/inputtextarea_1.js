import styles from './inputtextArea.scss';
class InputTextArea extends HTMLElement {

    #internals = this.attachInternals();
    #textarea = HTMLTextAreaElement;

    static formAssociated = true;

    static observedAttributes = ['lang', 'disabled', 'placeholder', 'theme', 'rows', 'cols', 'maxlength'];

    get form() { return this.#internals.form; }
    get name() { return this.getAttribute('name') };
    get type() { return this.localName; }
    get validity() { return this.#internals.validity; }
    get validationMessage() { return this.#internals.validationMessage; }
    get willValidate() { return this.#internals.willValidate; }

    constructor() {
        super();
        setTimeout(() => {
            let rows = this.hasAttribute("rows") ? `rows=${this.getAttribute("rows")}` : '';
            let cols = this.hasAttribute("cols") ? `cols=${this.getAttribute("cols")}` : '';
            let maxlength = this.hasAttribute("maxlength") ? `maxlength=${this.getAttribute("maxlength")}` : '';
            let placeholder = this.hasAttribute("placeholder") ? `placeholder=${JSON.stringify(this.getAttribute("placeholder"))}` : '';
            let disabled = this.hasAttribute("disabled") ? this.getAttribute("disabled") == 'true' ? 'disabled' : '' : '';
            let value = this.hasAttribute("value") ? this.getAttribute("value") : '';
            let lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
            let style = this.hasAttribute("style") ? `${this.getAttribute("style")}` : '';
            let msg = this.hasAttribute("maxlength") ? this.maxlengthCheck(this.getAttribute("maxlength"), value) : ''; //this.maxlengthCheck(maxlength, value);
            const template = document.createElement('template');
            template.innerHTML = `
            <style> ${styles.toString()} </style>
            <textarea ${lang} style='${style}' class="t-inputtextarea" ${placeholder} ${rows} ${cols} ${maxlength} ${disabled}>${value}</textarea>
            <span class="validation" id="error">${msg}</span>
            `;

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            let input = this.shadowRoot.querySelector('.t-inputtextarea');
            let spanelement = this.shadowRoot.querySelector('#error');
            input.addEventListener("keyup", (event) => {
                if (event.keyCode === 13) {
                    event.preventDefault();
                }
                if (input.value.length >= input.maxLength && input.maxLength > -1) {
                    spanelement.innerHTML = "Maximum of " + input.maxLength + " characters allowed";
                } else {
                    spanelement.innerHTML = "";
                }
                this.sendToApp(input.value);
            });

            this.#textarea = this.shadowRoot.querySelector('textarea');

            this.#textarea.addEventListener('input', () => this.#internals.setFormValue(this.value));
        }, 0);

    }

    maxlengthCheck(maxlength, textval) {
        if (maxlength > -1) {
            if (textval.length >= maxlength) {
                return "Maximum of " + maxlength + " characters allowed";
            } else {
                return "";
            }
        }
        return "";
    }

    get value() {
        return this.shadowRoot.querySelector('textarea').value;
    }

    set value(value) {
        setTimeout(() => {
            if (value) {
                this.shadowRoot.querySelector('textarea').value = value;
            } else {
                this.shadowRoot.querySelector('textarea').value = "";
            }
        }, 0);
    }

    sendToApp(value) {
        this.dispatchEvent(new CustomEvent("ttextarea", {
            bubbles: true,
            detail: {
                version: '2.2.21',
                method: this.getAttribute("callback"),
                data: value
            }
        }));
    }

    checkValidity() { return this.#internals.checkValidity(); }

    reportValidity() { return this.#internals.reportValidity(); }



    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.shadowRoot) {
            // Shadow DOM is not ready yet
            return;
        }

        if (name === 'theme') {
            const wrap = this.shadowRoot.querySelector('textarea');
            if (wrap) {
                if (oldValue) wrap.classList.remove(oldValue);
                wrap.classList.add(newValue);
            }
        } else if (name === 'disabled') {
            this.#textarea.disabled = newValue === 'true';
        } else if (name === 'rows') {
            this.#textarea.rows = newValue;
            this.value = this.#textarea.value;
        } else if (name === 'cols') {
            this.#textarea.cols = newValue;
            this.value = this.#textarea.value;
        } else if (name === 'maxlength') {
            this.#textarea.maxLength = newValue;
            this.value = this.#textarea.value;
        } else if (name === 'placeholder') {
            this.#textarea.placeholder = newValue;
        }
    }



}
export default InputTextArea;
