import styles from './slider.scss';

class Slider extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    let lang = (this.getAttribute("lang") === 'ar' ? 'dir="rtl" lang="ar"' : '');

    // Retrieve min, max, value, prefix, and displayvalue attributes
    let min = this.hasAttribute("min") ? parseInt(this.getAttribute("min")) : 1;
    let max = this.hasAttribute("max") ? parseInt(this.getAttribute("max")) : 10;
    let value = this.hasAttribute("value") ? parseInt(this.getAttribute("value")) : 1;
    let prefix = this.getAttribute("prefix") || "";
    let displayvalue = this.hasAttribute("displayvalue") ? 
        (this.getAttribute("displayvalue").toLowerCase() === 'true') : true;

    // Updated showValueBox logic
    let showValueBox = this.hasAttribute("showValueBox") 
        ? (this.getAttribute("showValueBox").toLowerCase() === 'true') 
        : true; // Default to true if the attribute is not present

    // If explicitly set to 'false', set showValueBox to false
    if (this.getAttribute("showValueBox") && this.getAttribute("showValueBox").toLowerCase() === 'false') {
        showValueBox = false;
    }

    // Setup the slider value display with the provided logic
    let sliderValue = '';
    if (displayvalue) {
      if (showValueBox) {
        sliderValue = `
          <div class="value-box">
            <span class="sliderValue" class="value-inner">${value} ${prefix}</span>
          </div>`;
      } else {
        sliderValue = `<span class="sliderValue" style="width:20%;">${value} ${prefix}</span>`;
      }
    }

    // Construct the template
    template.innerHTML = `
      <style>${styles.toString()}</style>
      <div class="slidecontainer" ${lang}>
        <div class="${displayvalue ? 'sliderWithValueDiv' : 'sliderDiv'}">
          <input type="range" id="myinput" class="range" min="${min}" max="${max}" value="${value}" />
        </div>
        ${sliderValue}
      </div>`;
    
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Set the initial background color of the slider
    this.applySliderColor(min, max, value);
  }

  get value() {
    return this.shadowRoot.querySelector('.range').value;
  }

  set value(value) {
    if (!value) value = 1;
    this.shadowRoot.querySelector('.range').value = value;
    let min = this.hasAttribute("min") ? parseInt(this.getAttribute("min")) : 1;
    let max = this.hasAttribute("max") ? parseInt(this.getAttribute("max")) : 10;
    this.applySliderColor(min, max, value);
  }

  disconnectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.querySelector("#myinput").removeEventListener('input', this.handleInput);
    }
  }

  static get observedAttributes() {
    return ['min', 'max', 'value', 'displayvalue', 'showValueBox'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      const range = this.shadowRoot.querySelector('.range');

      // Handle min attribute
      if (name === 'min' && newValue) {
        range.setAttribute('min', newValue);
        let max = this.hasAttribute("max") ? parseInt(this.getAttribute("max")) : 10;
        let value = this.value;
        this.applySliderColor(newValue, max, value);
      }

      // Handle max attribute
      if (name === 'max' && newValue) {
        range.setAttribute('max', newValue);
        let min = this.hasAttribute("min") ? parseInt(this.getAttribute("min")) : 1;
        let value = this.value;
        this.applySliderColor(min, newValue, value);
      }

      // Handle value attribute
      if (name === 'value' && newValue) {
        range.setAttribute('value', newValue);
        let min = this.hasAttribute("min") ? parseInt(this.getAttribute("min")) : 1;
        let max = this.hasAttribute("max") ? parseInt(this.getAttribute("max")) : 10;
        this.applySliderColor(min, max, newValue);
      }

      // Handle displayvalue attribute
      if (name === 'displayvalue') {
        let displayvalue = newValue === 'true';
        this.toggleDisplayValue(displayvalue);
      }

      // Handle showValueBox attribute
      if (name === 'showValueBox') {
        let showValueBox = newValue === 'true';
        this.toggleValueBox(showValueBox);
      }
    }
  }

  connectedCallback() {
    setTimeout(() => {
      if (this.shadowRoot) {
        let displayvalue = this.hasAttribute("displayvalue") ? 
          (this.getAttribute("displayvalue").toLowerCase() === 'true') : true;

        this.toggleDisplayValue(displayvalue);

        let min = this.hasAttribute("min") ? parseInt(this.getAttribute("min")) : 1;
        let max = this.hasAttribute("max") ? parseInt(this.getAttribute("max")) : 10;

        this.shadowRoot.querySelector("#myinput").addEventListener("input", (event) => {
          this.applySliderColor(min, max, event.target.value);
          this.sendToApp(event.target.value);
        });
      }
    }, 0);
  }

  toggleDisplayValue(display) {
    if (this.shadowRoot) {
      const sliderValueElem = this.shadowRoot.querySelector('.sliderValue');
      sliderValueElem.style.display = display ? 'block' : 'none';
      if (display) {
        sliderValueElem.textContent = `${this.value} ${this.getAttribute("prefix") || ""}`;
      }
    }
  }

  toggleValueBox(show) {
    const valueBoxElem = this.shadowRoot.querySelector('.value-box');
    if (valueBoxElem) {
      valueBoxElem.style.display = show ? 'block' : 'none';
    }
  }

  sendToApp(value) {
    this.dispatchEvent(new CustomEvent("tslider", {
      bubbles: true,
      detail: {
        version: '2.2.21',
        method: this.getAttribute("callback"),
        params: '',
        data: parseInt(value)
      }
    }));
  }

  applySliderColor(min, max, value) {
    let valuepercentage = (value - min) / (max - min) * 100;
    let way = (this.getAttribute("lang") === 'ar') ? 'left' : 'right';
    
    // Update the slider background color
    this.shadowRoot.querySelector("#myinput").style.background = 
      `linear-gradient(to ${way}, #009688 0%, #009688 ${valuepercentage}%, #fff ${valuepercentage}%, white 100%)`;
    
    // Update display value if applicable
    this.toggleDisplayValue(this.hasAttribute("displayvalue") ? 
      (this.getAttribute("displayvalue").toLowerCase() === 'true') : true);
  }
}

export default Slider;
