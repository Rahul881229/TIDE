import styles from './colorpicker.scss';

class Colorpicker extends HTMLElement {
  constructor() {
    super()
    setTimeout(() => {
      let value = this.getAttribute('value') ? this.getAttribute('value') : '';
      let name = this.getAttribute('name') ? this.getAttribute('name') : 'Color';
      const template = document.createElement('template');
      template.innerHTML = `
     <style>${styles.toString()}</style> 
       <label for='color' class='tcolorpicker'> ${name}<input id='color' type = "color" class="choose-color" value='${value}'/></label>
     `;

      /*<div class="pickr">choose color</div>*/
      this.attachShadow({
        mode: 'open'
      });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

    }, 0)
  }
  static get observedAttributes() {
    return ['value', 'name'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    setTimeout(() => {
      if (this.shadowRoot) {
        if (name == 'value' && newValue) {
          var label = this.shadowRoot.querySelector('label');
          var input = this.shadowRoot.querySelector('input');
          if (newValue.length < 2) {
            label.style.backgroundColor = '#404040'
            label.style.color = '#fff';
          } else {
            if (input) {
              input.value = newValue;
            }
            if (label) {
              if (newValue.startsWith('#f') || newValue.startsWith('#F') || newValue == '') {
                label.style.color = '#000';
              }
              else {
                label.style.color = '#fff';
              }
              label.style.backgroundColor = newValue;
            }
          }
        }
      }
    }, 0);
  }
  connectedCallback() {
    setTimeout(() => {
      if (this.shadowRoot) {
        // console.log("color picker--->",this.shadowRoot);
        // let callbackFn = this.getAttribute("callback");
        let colorInput = this.shadowRoot.querySelector('.choose-color');
        // if (callbackFn) {
          colorInput.addEventListener('input', () => {
            // console.log("colorInput Value => ", colorInput.value);
            var label = this.shadowRoot.querySelector('label');
            var input = this.shadowRoot.querySelector('input');
            if (label) {
              if (colorInput.value.startsWith('#f') || colorInput.value.startsWith('#F') || colorInput.value == '') {
                label.style.color = '#000';
              }
              else {
                label.style.color = '#fff';
              }
              label.style.backgroundColor = colorInput.value;
            }
            var checkEvent = new CustomEvent("tcolorpicker", {
              bubbles: true,
              detail: {
                version: "1.0",
                method: "",
                params: '', //getCallback()   getCallback(123456)
                data: {
                  value: colorInput.value
                }
              }
            });

            if (this.dispatchEvent(checkEvent)) {
              // Do default operation here.
              console.log('Performing default operation');
            } else {
              console.log("Callback Not Available");
            }
          }, false)
        // }
      }
    }, 0);
  }
}
// window.customElements.define('t-colorpicker', Colorpicker)
export default Colorpicker;