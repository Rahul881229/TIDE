import styles from './timeseries.scss'


class TimeSeries extends HTMLElement {

    constructor() {
        super();
        setTimeout(() => {
            let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
            let btnSize = 'md';
            if (this.hasAttribute("small") || this.hasAttribute("sm")) {
                btnSize = 'sm';
            } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
                btnSize = 'lg';
            }
            let lang = this.hasAttribute("lang") ? (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '') : '';
            let selected = this.hasAttribute("selected") ? this.getAttribute("selected") : '';
            let disabled = this.hasAttribute("disabled") ? this.getAttribute("disabled") : '';

            let buttons = this.children;

            const template = document.createElement('template');
            template.innerHTML = `<style>${styles.toString()}</style>
      <div class="stepper-wrapper ${theme} ${btnSize}" ${lang} >
        
      </div>
    `;
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            // this.appendChild(template.content.cloneNode(true));



            for (let btns of buttons) {
                if (btns.nodeName == 'BUTTON') {
                    let stepperbtnDivElement = document.createElement("div");
                    stepperbtnDivElement.className = 'stepper-btnDiv';

                    let iconElement = document.createElement("button");
                    iconElement.className = 'icon';

                    if (btns.hasAttribute('value')) {
                        const btnValue = btns.getAttribute('value');

                        iconElement.setAttribute('value', btnValue);
                        if (selected == btns.getAttribute('value') && disabled != '') {
                            iconElement.classList.add('selected');

                        }

                        // Add disabled attribute based on the 'disabled' attribute passed for each button
                        if (disabled.split(',').includes(btnValue)) {
                            iconElement.classList.add('disabled');
                            iconElement.disabled = true;
                            iconElement.style.cursor = 'not-allowed'
                        }
                    }




                    let imgElement = document.createElement("img");
                    imgElement.src = '';
                    if (btns.getElementsByTagName('img').length > 0) {
                        imgElement.src = btns.getElementsByTagName('img')[0].getAttribute('src');
                    }
                    iconElement.appendChild(imgElement);




                    let labelElement = document.createElement("label");
                    labelElement.textContent = '';
                    if (btns.getElementsByTagName('label').length > 0) {
                        labelElement.textContent = btns.getElementsByTagName('label')[0].innerText;
                    }


                    const dataLabel = btns.getAttribute('label');

                    if (dataLabel) {
                        labelElement.textContent = dataLabel;
                    }


                    if (btns.hasAttribute('label-left')) {
                        labelElement.classList.add('label-left');
                    } else if (btns.hasAttribute('label-right')) {
                        labelElement.classList.add('label-right');
                    } else {
                        // Default to 'label-right' if neither 'label-left' nor 'label-right' is present
                        labelElement.classList.add('label-right');
                    }

                    stepperbtnDivElement.appendChild(iconElement);
                    stepperbtnDivElement.appendChild(labelElement);

                    // ... existing code ...
                    // ... existing code ...
                    /* if (btns.hasAttribute('selected')) {
                      labelElement.classList.add('selected');
                    } */
                    if (selected == btns.getAttribute('value') && disabled != '') {
                        labelElement.classList.add('selected');
                    }

                    stepperbtnDivElement.appendChild(iconElement);
                    stepperbtnDivElement.appendChild(labelElement);
                    this.shadowRoot.querySelectorAll(".stepper-wrapper")[0].appendChild(stepperbtnDivElement);
                }

            }
        }, 0);
    }

    static get observedAttributes() {
        return ['theme', 'selected', 'disabled', 'lang'];
    }



    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            if (name === 'selected') {
                const stepperWrap = this.shadowRoot.querySelector('.stepper-wrapper');
                const icons = stepperWrap.querySelectorAll('.icon');

                icons.forEach(element => {
                    if (element.getAttribute('value') === newValue) {
                        element.classList.add('selected');
                        if (element.nextElementSibling) {
                            element.nextElementSibling.classList.add('selected');
                        }
                        element.classList.remove('disabled');
                    } else {
                        element.classList.remove('selected');
                        if (element.nextElementSibling) {
                            element.nextElementSibling.classList.remove('selected');
                        }
                        element.classList.add('disabled');
                    }
                });
            }
            if (name === 'lang') {
                // Handle 'lang' attribute changes
                const stepperWrapper = this.shadowRoot.querySelector('.stepper-wrapper');
                stepperWrapper.setAttribute('dir', newValue === 'ar' ? 'rtl' : '');
                stepperWrapper.setAttribute('lang', newValue === 'ar' ? 'ar' : '');
            }
            if (name === 'disabled') {
                const isGlobalDisabled = newValue === 'true';
                const iconBtns = this.shadowRoot.querySelectorAll('.stepper-btnDiv .icon');

                iconBtns.forEach(element => {
                    const btnValue = element.value;
                    const isBtnSelected = element.classList.contains('selected');
                    const isBtnDisabled = newValue.split(',').includes(btnValue);

                    element.style.cursor = isGlobalDisabled || isBtnDisabled ? 'not-allowed' : 'pointer';
                    element.removeEventListener('click', () => { });

                    if (isGlobalDisabled || isBtnDisabled) {
                        element.classList.remove('selected');
                        if (element.nextElementSibling) {
                            element.nextElementSibling.classList.remove('selected');
                        }
                    } else if (!isBtnDisabled) {
                        element.addEventListener('click', () => {
                            if (!isGlobalDisabled) {
                                this.setAttribute('selected', btnValue);
                                this._sentToApp(btnValue);
                                this.removeSelected();
                                element.classList.add('selected');
                                if (element.nextElementSibling) {
                                    element.nextElementSibling.classList.add('selected');
                                }
                            }
                        });
                    }

                    element.classList.toggle('disabled', isGlobalDisabled || isBtnDisabled);
                    element.disabled = isGlobalDisabled || isBtnDisabled;
                });
            }



        }

    }

    _sentToApp(value) {
        // let callbackFn = this.hasAttribute("callback") ? true : false;
        this.dispatchEvent(new CustomEvent("tstepper", {
            bubbles: true,
            detail: {
                version: "2.2.21",
                method: this.getAttribute("callback"),
                params: '',
                data: value
            }
        }));

    }

    removeDisabled() {
        if (this.shadowRoot) {
            let iconBtns = this.shadowRoot.querySelectorAll('.stepper-btnDiv .icon');
            iconBtns.forEach(element => {
                element.classList.remove('disabled');
            });
        }
    }

    removeSelected() {
        if (this.shadowRoot) {
            let iconBtns = this.shadowRoot.querySelectorAll('.stepper-btnDiv .icon');
            iconBtns.forEach(element => {
                element.classList.remove('selected');
                if (element.nextElementSibling) {
                    element.nextElementSibling.classList.remove('selected');
                }
            });
        }
    }

    enableEventLisner() {
        let iconBtns = this.shadowRoot.querySelectorAll('.stepper-btnDiv .icon');
        iconBtns.forEach(element => {
            if (!element.classList.contains('disabled')) {
                element.addEventListener('click', (e) => {
                    if (element.hasAttribute('value')) {
                        this._sentToApp(element.getAttribute('value'));
                    }
                    this.removeSelected();
                    element.classList.add('selected');
                    if (element.nextElementSibling) {
                        element.nextElementSibling.classList.add('selected');
                    }
                });
            }
        });
    }

    connectedCallback() {
        setTimeout(() => {
            const iconBtns = this.shadowRoot.querySelectorAll('.stepper-btnDiv .icon');
            const isDisabled = this.getAttribute('disabled') === 'true';
            let selectedIcon;

            iconBtns.forEach(element => {
                if (element.classList.contains('selected')) {
                    selectedIcon = element;
                }

                if (!isDisabled || element.classList.contains('selected')) {
                    element.addEventListener('click', () => {
                        const selectedValue = element.getAttribute('value');

                        if (!isDisabled) {
                            this.setAttribute('selected', selectedValue); // Update the selected attribute
                            this._sentToApp(selectedValue); // Sending the updated selected value to the callback

                            this.removeSelected();
                            element.classList.add('selected');
                            if (element.nextElementSibling) {
                                element.nextElementSibling.classList.add('selected');
                            }
                        }
                    });
                } else {
                    element.style.cursor = 'not-allowed';
                }
            });

            if (selectedIcon && isDisabled) {
                selectedIcon.style.cursor = 'not-allowed';
            }
        }, 0);
    }


    disconnectedCallback() {

    }

}

export default TimeSeries;