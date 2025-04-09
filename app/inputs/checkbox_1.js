import styles from './checkbox.scss';
let checkBoxVariable = {
    ar: '',
    labelRotate: ''
}
class Checkbox extends HTMLElement {
    constructor() {
        super();
        let horizonatal = this.hasAttribute('horizontal') ? 'horizontal' : '';
        let lang = this.hasAttribute("lang") ? this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '' : '';
        checkBoxVariable.ar = (this.getAttribute("lang") == 'ar' ? 'ar' : '');
        checkBoxVariable.labelRotate = (this.getAttribute("lang") == 'ar' ? 'ar-container' : '');

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
            <div class="t-checkbox ${fontsize} ${horizonatal}" ${lang}>
            </div>
            `;

        const shadowDOM = this.attachShadow({ mode: 'open' });
        shadowDOM.appendChild(template.content.cloneNode(true));
    }

    disconnectedCallback() {
        console.log("disconnectedCallback");
        if (this.shadowRoot) {
            var elems = this.shadowRoot.querySelectorAll('.t-checkbox input');
            elems.forEach((ele, idx) => {
                ele.removeEventListener('click', this.connectedCallback);
            });
        }
    }

    get value() {
        let cc = this.shadowRoot.querySelectorAll('.checkbox-container');
        let returnArray = [];
        cc.forEach(element => {
            if (element.querySelector('input').checked) {
                returnArray.push(element.querySelector('input').value);
            }
        });
        console.log("these are the returned arrays" + returnArray);
        return returnArray;
    }

    set value(arrayValue) {
        let cc = this.shadowRoot.querySelectorAll('.checkbox-container');
        cc.forEach(element => {
            element.querySelector('input').checked = false;
        });
        if (arrayValue.length > 0) {
            arrayValue.forEach(element => {
                cc.forEach(element1 => {
                    if (element == element1.querySelector('input').value) {
                        element1.querySelector('input').checked = true;
                        console.log(element);
                    }
                });
            });
        }
    }

    get reset() {
        let cc = this.shadowRoot.querySelectorAll('.checkbox-container');
        cc.forEach(element => {
            element.querySelector('input').checked = false;
        });
    }

    addClickEventListener() {
        var elems = this.shadowRoot.querySelectorAll('.t-checkbox input');
        elems.forEach((ele) => {

            ele.addEventListener('contextmenu', function (e) {
                alert("You've tried to open context menu");
                e.preventDefault();
            }, false);
            console.log("connect Call back");
            ele.addEventListener('click', () => {
                let cc = this.shadowRoot.querySelectorAll('.checkbox-container');
                let returnArray = [];
                cc.forEach(element => {
                    if (element.querySelector('input').checked) {
                        returnArray.push(element.querySelector('input').value);
                    }
                });
                this.dispatchEvent(new CustomEvent("tcheckbox", {
                    bubbles: true,
                    detail: {
                        version: '2.2.21',
                        method: this.getAttribute("callback"),
                        params: "",
                        data: returnArray
                    }
                }))
                // }
            })
        });
    }


    _addData(JSONPARSE) {
        let checkbox = this.shadowRoot.querySelector(".t-checkbox");
        checkbox.innerHTML = null;
        let checkboxDataString = '';
        checkBoxVariable.ar = (this.getAttribute("lang") == 'ar' ? 'ar' : '');
        checkBoxVariable.labelRotate = (this.getAttribute("lang") == 'ar' ? 'ar-container' : '');
        if (JSONPARSE.length > 0) {
            for (let i = 0; i < JSONPARSE.length; i++) {
                const element = JSONPARSE[i];
                checkboxDataString += `<label class="checkbox-container ${checkBoxVariable.labelRotate} ${element.disabled == 'true' ? 'disabled' : ''}">
                        <input type="checkbox" id=${element.id} name=${element.value} value=${element.value} ${element.disabled == "true" ? 'disabled' : ''} >
                        ${element.name}
                        <span class="checkmark ${checkBoxVariable.ar}"></span>
                    </label>`;
            }
            checkbox.innerHTML = checkboxDataString;
            let selectedValue = this.hasAttribute('selected') ? this.getAttribute("selected") == '' ? [] : JSON.parse(this.getAttribute("selected")) : [];
            this.setSelectedValue(selectedValue);

            if (this.shadowRoot) {
                this.addClickEventListener();
            }

        }
    }

    static get observedAttributes() {
        return ['data', 'theme', 'position', 'lang', 'selected', 'value'];
    }





    attributeChangedCallback(name, oldValue, newValue) {
        console.log("connect Call back", name, oldValue, newValue);
        setTimeout(() => {
            if (this.shadowRoot) {
                if (name && newValue) {
                    switch (name) {
                        case 'data':
                            let data = newValue == '' ? [] : JSON.parse(newValue);
                            this._addData(data);
                            break;
                        case 'position':
                            let position = this.shadowRoot.querySelectorAll('.t-checkbox')[0];
                            if (oldValue) {
                                position.classList.remove(oldValue);
                            }
                            position.classList.add(newValue);
                            break;
                        case 'theme':
                            let tag = this.shadowRoot.querySelectorAll('.t-checkbox')[0];
                            if (oldValue) {
                                tag.classList.remove(oldValue);
                            }
                            tag.classList.add(newValue);
                            break;
                        case 'lang':
                            if (newValue == 'ar') {
                                this.shadowRoot.querySelectorAll('.t-checkbox')[0].setAttribute('dir', 'rtl');
                                let label = this.shadowRoot.querySelectorAll('.checkbox-container ');
                                let span = this.shadowRoot.querySelectorAll('.checkmark ');
                                for (let i = 0; i < label.length; i++) {
                                    label[i].classList.add('ar-container');
                                    span[i].classList.add('ar');
                                }
                            } else {
                                this.shadowRoot.querySelectorAll('.t-checkbox')[0].removeAttribute('dir');
                                let list = this.shadowRoot.querySelectorAll('.checkbox-container');
                                for (const label of list) {
                                    label.classList.remove('ar-container');
                                }
                            }
                            break;
                        case 'selected':
                            let arrayValue = newValue == '' ? [] : JSON.parse(newValue);
                            this.setSelectedValue(arrayValue);
                            break;
                        case 'value':
                            let Value = newValue == '' ? [] : JSON.parse(newValue);
                            console.log("printing the value" + value);
                            this.setSelectedValue(Value);
                            break;
                        default:
                            break;
                    }
                }
            }
        }, 0);
    }

    setSelectedValue(data) {
        let cc = this.shadowRoot.querySelectorAll('.checkbox-container');
        cc.forEach(element => {
            element.querySelector('input').checked = false;
        });
        if (data.length > 0) {
            data.forEach(element => {
                cc.forEach(element1 => {
                    if (element == element1.querySelector('input').value) {
                        element1.querySelector('input').checked = true;
                    }
                });
            });
        }
    }

    connectedCallback() {

    }
}
export default Checkbox;
// window.customElements.define('t-checkbox', Checkbox);