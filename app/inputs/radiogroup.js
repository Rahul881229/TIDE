import styles from './radiogroup.scss';

class RadioGroup extends HTMLElement {

    constructor() {
        super();
        let horizontal = this.hasAttribute('horizontal') ? 'horizontal' : '';
        let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
        let lang = this.hasAttribute('lang') ? (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '') : '';
        var fontsize = '';
        if (this.hasAttribute("small") || this.hasAttribute("sm")) {
            fontsize = 'sm';
        } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
            fontsize = 'lg';
        }
        const template = document.createElement('template');
        template.innerHTML = `
            <style>${styles.toString()}</style>
            <div class="t-radiogroup ${fontsize} ${horizontal} ${theme}" ${lang}>
            </div>
            `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

    }

    disconnectedCallback() {
        if (this.shadowRoot) {
            this.shadowRoot.removeEventListener('change', this.connectedCallback);
        }
    }

    get value() {
        let cc = this.shadowRoot.querySelectorAll('.radio-container');
        let returnvalue = '';
        for (let i = 0; i < cc.length; i++) {
            const element = cc[i];
            if (element.querySelector('input').checked) {
                returnvalue = element.querySelector('input').value;
                break;
            }
        }
        return returnvalue;
    }

    set value(data) {
        let cc = this.shadowRoot.querySelectorAll('.radio-container');
        cc.forEach(element => {
            element.querySelector('input').checked = false;
        });
        if (data) {
            for (let i = 0; i < cc.length; i++) {
                const element = cc[i];
                if (data == element.querySelector('input').value) {
                    element.querySelector('input').checked = true;
                    break;
                }
            }
        }
    }

    get reset() {
        let cc = this.shadowRoot.querySelectorAll('.radio-container');
        cc.forEach(element => {
            element.querySelector('input').checked = false;
        });
    }

    setSelectedValue(data) {
        let cc = this.shadowRoot.querySelectorAll('.radio-container');
        cc.forEach(element => {
            element.querySelector('input').checked = false;
        });
        if (data) {
            cc.forEach(element => {
                if (data == element.querySelector('input').value) {
                    element.querySelector('input').checked = true;
                }
            });
        }
    }

    _addData(JSONPARSE) {
        // console.log(JSONPARSE);
        let radiobox = this.shadowRoot.querySelector(".t-radiogroup");
        radiobox.innerHTML = null;
        var radio_right = this.hasAttribute('lang') ? (this.getAttribute("lang") == 'ar' ? 'style="right: 0;"' : '') : '';
        var label_right = this.hasAttribute('lang') ? (this.getAttribute("lang") == 'ar' ? 'style="padding-right: 1.2rem;"' : '') : '';
        let disabled = this.hasAttribute("disabled") ? this.getAttribute("disabled") : "";
        var dataString = "";
        if (JSONPARSE.length > 0) {
            for (let i = 0; i < JSONPARSE.length; i++) {
                const element = JSONPARSE[i];
                dataString += `<label class="radio-container ${element.disabled == 'true' ? 'disabled' : '' || disabled == 'true' ? 'disabled' : ''}" ${label_right}>
                        <input type="radio" name=${element.name} value=${element.value} ${element.disabled == "true" ? 'disabled' : '' || disabled == 'true' ? 'disabled' : ''} >
                        ${element.text}
                        <span class="checkmark"  ${radio_right}></span>
                    </label>`;
            }
            radiobox.innerHTML = dataString;
            if (this.hasAttribute("selected")) {
                this.setSelectedValue(this.getAttribute("selected"));
            }
        }
    }

    static get observedAttributes() {
        return ['data', 'theme', 'position', 'disabled', 'selected', 'lang'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            if (name && newValue) {
                switch (name) {
                    case 'data':
                        let data = newValue == '' ? [] : JSON.parse(newValue);
                        this._addData(data);
                        break;
                    case 'position':
                        let position = this.shadowRoot.querySelectorAll('.t-radiogroup')[0];
                        if (oldValue) {
                            position.classList.remove(oldValue);
                        }
                        position.classList.add(newValue);
                        break;
                    case 'theme':
                        let tag = this.shadowRoot.querySelectorAll('.t-radiogroup')[0];
                        if (oldValue) {
                            tag.classList.remove(oldValue);
                        }
                        tag.classList.add(newValue);
                        break;
                    case 'selected':
                        this.setSelectedValue(newValue);
                        break;
                    case 'disabled':
                        let listOfRadio = this.shadowRoot.querySelectorAll('.t-radiogroup')[0].querySelectorAll('.radio-container');
                        for (const res of listOfRadio) {
                            if (newValue == 'true') {
                                res.classList.add('disabled');
                                res.querySelectorAll('input')[0].setAttribute('disabled', true);
                            } else {
                                res.classList.remove('disabled');
                                res.querySelectorAll('input')[0].removeAttribute('disabled');
                            }
                        }
                        break;
                    case 'lang':
                        if (newValue == 'ar') {
                            let div = this.shadowRoot.querySelector('.t-radiogroup');
                            let label = this.shadowRoot.querySelectorAll('.radio-container')
                            let span = this.shadowRoot.querySelectorAll('.checkmark');
                            for (let i = 0; i < label.length; i++) {
                                label[i].style.paddingRight = '1.2rem';
                                span[i].style.right = '0';
                            }
                            div.setAttribute('dir', 'rtl');
                        } else {
                            let div = this.shadowRoot.querySelector('.t-radiogroup');
                            div.removeAttribute('dir');
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    connectedCallback() {
        setTimeout(() => {
            if (this.shadowRoot) {

                var elems = this.shadowRoot.querySelectorAll('.t-radiogroup input');
                elems.forEach((ele, idx) => {

                    ele.addEventListener('change', () => {
                        this.dispatchEvent(new CustomEvent("tradiogroup", {
                            bubbles: true,
                            detail: {
                                version: '2.2.21',
                                method: this.getAttribute("callback"),
                                params: "",
                                data: elems[idx].value
                            }
                        }));
                    })
                });
            }
        }, 0);
    }
}
export default RadioGroup;
// window.customElements.define('t-radiogroup', RadioGroup);
