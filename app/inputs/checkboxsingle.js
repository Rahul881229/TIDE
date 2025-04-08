import styles from './checkboxsingle.scss';

class CheckboxSingle extends HTMLElement {
    constructor() {
        super();
        let lang = this.hasAttribute("lang") ? this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '' : '';
        let title = this.getAttribute("title");
        var fontsize = '';
        if (this.hasAttribute("small") || this.hasAttribute("sm")) {
            fontsize = 'sm';
        } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
            fontsize = 'lg';
        }

        const template = document.createElement('template');
        template.innerHTML = `
    <style>
        ${styles.toString()}
    </style>
    <div class="t-checkbox ${fontsize} " ${lang} ${title}>
        <label class="checkbox-container ${this.getAttribute("lang") == 'ar' ? 'ar-container' : ''}">
            <input type="checkbox" value="${this.getAttribute('value')}">
            <span class="label-content">${title || 'Default Label'}</span>
            <span class="checkmark ${this.getAttribute("lang") == 'ar' ? 'ar' : ''}"></span>
        </label>
    </div>
`;

        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));
        // Uncomment the line below if you intend to use the addClickEventListener method
        this.addClickEventListener();
    }

    disconnectedCallback() {
        console.log("disconnectedCallback");
        if (this.shadowRoot) {
            const checkboxInput = this.shadowRoot.querySelector('.checkbox-container input');
            checkboxInput.removeEventListener('click', this.addClickEventListener);
        }
    }

    static get observedAttributes() {
        return ['title', 'theme', 'lang', 'value', 'selected', 'disabled'];
    }

    get value() {
        const checkedCheckbox = this.shadowRoot.querySelector('.checkbox-container input:checked');
        return checkedCheckbox ? checkedCheckbox.value : '';
    }
    set value(value) {
        const checkboxContainer = this.shadowRoot.querySelector('.checkbox-container');
        if (checkboxContainer) {
            const input = checkboxContainer.querySelector('input');
            input.checked = (value === true || value === 'true');
        }
    }


    addClickEventListener() {
        const checkboxInput = this.shadowRoot.querySelector('.checkbox-container input');
        const callbackMethod = this.getAttribute("callback");
        console.log('Callback method:', callbackMethod);

        checkboxInput.addEventListener('click', () => {
            const value = checkboxInput.value;
            console.log('Value:', value);

            this.dispatchEvent(new CustomEvent("tcheckboxnew", {
                bubbles: true,
                detail: {
                    version: '2.2.22',
                    method: callbackMethod,
                    params: "",
                    data: value
                }
            }));
        });
    }


    attributeChangedCallback(name, oldValue, newValue) {
        console.log("connect Call back", name, oldValue, newValue);
        setTimeout(() => {
            if (this.shadowRoot) {
                if (name && newValue) {
                    switch (name) {
                        case 'title':
                            let labelContent = this.shadowRoot.querySelector('.label-content');
                            labelContent.textContent = newValue || 'Default Label';
                            break;
                        case 'theme':
                            let tag = this.shadowRoot.querySelector('.t-checkbox');
                            if (oldValue) {
                                tag.classList.remove(oldValue);
                            }
                            tag.classList.add(newValue);
                            break;
                        case 'disabled':
                            const checkboxContainer = this.shadowRoot.querySelector('.checkbox-container');
                            const checkboxInput = this.shadowRoot.querySelector('.checkbox-container input');
                            checkboxInput.disabled = newValue == 'true';

                            if (newValue === 'true') {
                                checkboxContainer.style.opacity = '0.5';
                            } else {
                                checkboxContainer.style.opacity = '1';
                            }
                            break;
                        case 'selected':
                            const checkbox = this.shadowRoot.querySelector('.checkbox-container input');
                            console.log("selected attribute new value:", newValue);
                            checkbox.checked = newValue === 'true';
                            console.log("checkbox.checked:", checkbox.checked);
                            break;

                        case 'lang':
                            if (newValue == 'ar') {
                                this.shadowRoot.querySelector('.t-checkbox').setAttribute('dir', 'rtl');
                                let label = this.shadowRoot.querySelector('.checkbox-container');
                                let span = this.shadowRoot.querySelector('.checkmark');
                                label.classList.add('ar-container');
                                span.classList.add('ar');
                            } else {
                                this.shadowRoot.querySelector('.t-checkbox').removeAttribute('dir');
                                let label = this.shadowRoot.querySelector('.checkbox-container');
                                let span = this.shadowRoot.querySelector('.checkmark');
                                label.classList.remove('ar-container');
                                span.classList.remove('ar');
                            }
                            break;
                        case 'value':
                            const checkboxi = this.shadowRoot.querySelector('.checkbox-container input');
                            checkboxi.value = newValue || ''; // Set the value attribute on the input element
                            console.log("printing the updated value", newValue);
                            break;
                        default:
                            break;
                    }
                }
            }
        }, 0);
    }


    connectedCallback() {
        console.log("inside the connected callback");

        // Use setTimeout to ensure that Angular has updated the value before setting the checked state
        setTimeout(() => {
            // Set the initial checked state based on the 'value' attribute
            const checkboxInput = this.shadowRoot.querySelector('.checkbox-container input');
            checkboxInput.checked = this.getAttribute('value') === 'true';
            // checkboxInput.checked = this.hasAttribute('selected');
            // Add the click event listener
            // this.addClickEventListener();
        });
    }
}

export default CheckboxSingle;
