import styles from './spinBtn.scss';

class Tspinbutton extends HTMLElement {
  constructor() {
    super()
    setTimeout(() => {

      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : 'dark';
      var lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');

      let type = this.hasAttribute("type") ? this.getAttribute("type") : 'normal';

      var callbackFn = this.getAttribute("callback");

      let isDisabled = this.hasAttribute("disabled");

      const template = document.createElement('template');

      const disabledStyle = `
      pointer-events: none;
      opacity: 0.5;
    `;

      if (type == 'text') {
        let data = this.hasAttribute("text-data") ? this.getAttribute("text-data") : '[]';
        template.innerHTML = `<style>${styles.toString()}</style>
        <button class="spin-btn ${theme}" ${lang}  ${isDisabled ? `style="${disabledStyle}"` : ''}>
          <span class= "btn-wrap">
            <span class="btn-text"></span>
            <span class="btn-icon-wrap">
              <span class="up"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQflAgsLBw6DMKDRAAAA9klEQVRo3u3UwQ3CQAxE0dmcuUEHUABCQtAGhRIKgALSRDoIQloKGE4gEAGyG6/NwdPA+74Y8Pl8Pp/Plz0ueGBkZM25Bb9ix/s6rrT55RNPkheuLXndhF5eL+Ejr5PwlS+f8JMvmzCIL5cwmC+TkMTLJyTzsglZvFxCNi+TMIofnzCaH5cgwucniPF5CaJ8eoI4n5ZQhB+eUIwfllCU/51QnP+eoMJ/TlDj+xNU+fcEdf41wYR/JAQu0GCa8CYld8YmsMbOiAeAfeAVE8OAWIGGPIAKJ1P/GDhHg5kR32FbhRZb1IjqeMQem9Aane7z+Xw+3x/tBqSpjXnKJzOgAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAyLTExVDExOjA3OjE0KzAwOjAw3G5ZFgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMi0xMVQxMTowNzoxNCswMDowMK0z4aoAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC"/></span>
              <span class="down"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQflAgsLBxaQXDiHAAAA/ElEQVRo3u3POwoCUQyF4XNFsLG2snAZ2gpiKwwIbtHKVhegW9DOwspWEZGB2AyIzOs+E9CcBeT/Auh0Op1O9+8zAA2xxECgfcXaXAxNsENf6P0bZoYOGAvlAWBv6ImeIODRwVEwD5wMTbFFVyifYw6AMnqRxHJaFRARwicvQvjOsxPKeVZCdZ6NUJ9nITTnkxPa80kJdvlkBPt8EoJbPjrBPR+V4JePRvDPRyGE5YMJ4fkgQpy8NyFe3osQN+9MiJ93IqTJWxPS5a0IafOthPT5RgJPvpbAl68k8OZLBP58QbgTEdGdMv8rJogwwgLAxpwF/tfpdDqd7mf2BooJmlhvgzeuAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAyLTExVDExOjA3OjIyKzAwOjAwMTFrzwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMi0xMVQxMTowNzoyMiswMDowMEBs03MAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC"/></span>
            </span>
          </span>  
        </button>`;
        const shadowDOM = this.attachShadow({
          mode: 'open'
        });
        shadowDOM.appendChild(template.content.cloneNode(true));

        // the logics..
        let btnTextElement = this.shadowRoot.querySelector(".btn-text");
        let upArrow = this.shadowRoot.querySelector(".up");
        let downArrow = this.shadowRoot.querySelector(".down");

        let btnTextData = JSON.parse(data);
        let spinBtnName = [];

        for (let i = 0; i < btnTextData.length; i++) {
          spinBtnName.push(btnTextData[i].name);
        }
        btnTextElement.textContent = spinBtnName[0];
        let length = spinBtnName.length;

        const getNextIdx = (idx = 0, length, direction) => {
          switch (direction) {
            case 'next':
              return (idx + 1) % length;
            case 'prev':
              return (idx == 0) && length - 1 || idx - 1;
            default:
              return idx;
          }
        }

        let idx = 0; // Initial index
const updateButtonState = () => {
  if (idx === 0) {
    downArrow.style.cursor = 'not-allowed';
    downArrow.style.opacity = 0.5;
    downArrow.setAttribute('disabled', 'true');
  } else {
    downArrow.style.cursor = 'pointer';
    downArrow.style.opacity = 1;
    downArrow.removeAttribute('disabled');
  }

  if (idx === length - 1) {
    upArrow.style.cursor = 'not-allowed';
    upArrow.style.opacity = 0.5;
    upArrow.setAttribute('disabled', 'true');
  } else {
    upArrow.style.cursor = 'pointer';
    upArrow.style.opacity = 1;
    upArrow.removeAttribute('disabled');
  }
};

const getNewIndexAndRender = (direction) => {
  idx = getNextIdx(idx, length, direction);
  btnTextElement.innerHTML = spinBtnName[idx];

  // Dispatch the custom event with updated details
  this.dispatchEvent(new CustomEvent("tspinbutton", {
    bubbles: true,
    detail: {
      version: '1.0',
      method: callbackFn,
      params: "",
      data: btnTextData[idx]
    }
  }));

  updateButtonState(); // Update button states after the index change
};

// Initialize button state when component is rendered
updateButtonState();

// Event listeners
upArrow.addEventListener("click", () => {
  if (idx < length - 1) {
    getNewIndexAndRender("next");
  }
});

downArrow.addEventListener("click", () => {
  if (idx > 0) {
    getNewIndexAndRender("prev");
  }
});

      } else {

        let max = this.hasAttribute("max") ? `max="${this.getAttribute("max")}"` : '';
        let value = this.hasAttribute("value") ? `value="${this.getAttribute("value")}"` : 'value="0"';

        template.innerHTML = `<style>${styles.toString()}</style>
          <div class="spin ${theme}" ${lang} ${isDisabled ? `style="${disabledStyle}"` : ''}> 
            <span class="prev"></span>
            <input type="number" id="stepper1" min="0" step="1" ${value} ${max}  readonly/>
            <span class="next"></span>
          </div>
        `;

        const shadowDOM = this.attachShadow({
          mode: 'open'
        });
        shadowDOM.appendChild(template.content.cloneNode(true));

        let maxVal = this.hasAttribute("max") ? this.getAttribute("max") : 1000;
        let minVal = 0;
        let input = this.shadowRoot.querySelector('.spin input');

        let prevBtn = this.shadowRoot.querySelector('.prev');
        let nextBtn = this.shadowRoot.querySelector('.next');

        prevBtn.addEventListener('click', () => {
          if (parseInt(input.value) > minVal) {
            input.value = parseInt(input.value) - 1;
          }
        })

        nextBtn.addEventListener('click', () => {
          if (parseInt(input.value) < maxVal) {
            input.value = parseInt(input.value) + 1;
          }
        })

        const getvalue = (e) => {
          // console.log(input.value);
          // if (callbackFn) {
            this.dispatchEvent(new CustomEvent("tspinbutton", {
              bubbles: true,
              detail: {
                version: '1.0',
                method: callbackFn,
                params: "",
                data: input.value
              }
            }));
          //   if (this.dispatchEvent(checkEvent)) {
          //     // Do default operation here
          //     console.log('Performing default operation');
          //   } else {
          //     console.log("No callback Abvailable");
          //   }
          // // }
        }

        let prev = this.shadowRoot.querySelector(".prev");
        let next = this.shadowRoot.querySelector(".next");
        prev.addEventListener("click", getvalue.bind(this));
        next.addEventListener("click", getvalue.bind(this));


        
        const updateCursorStyle = () => {
          // Check if the input value is at the min value
          if (parseInt(input.value) <= minVal) {
            prevBtn.style.cursor = 'not-allowed'; // Set not allowed cursor for prev button
          } else {
            prevBtn.style.cursor = 'pointer'; // Default cursor for prev button
          }
        
          // Check if the input value is at the max value
          if (parseInt(input.value) >= maxVal) {
            nextBtn.style.cursor = 'not-allowed'; // Set not allowed cursor for next button
          } else {
            nextBtn.style.cursor = 'pointer'; // Default cursor for next button
          }
        };
        
        prevBtn.addEventListener('click', () => {
          if (parseInt(input.value) > minVal) {
            input.value = parseInt(input.value) - 1;
          }
          updateCursorStyle(); // Update cursor after clicking prev
        });
        
        nextBtn.addEventListener('click', () => {
          if (parseInt(input.value) < maxVal) {
            input.value = parseInt(input.value) + 1;
          }
          updateCursorStyle(); // Update cursor after clicking next
        });

        updateCursorStyle();
      }

    }, 0);
  }

  disconnectedCallback() {
    const getvalue = (e) => { }
    let prev = this.shadowRoot.querySelector(".prev");
    let next = this.shadowRoot.querySelector(".next");
    prev.removeEventListener("click", getvalue.bind(this));
    next.removeEventListener("click", getvalue.bind(this));
  }

  static get observedAttributes() {
    return ['theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("this -> ", this);
    try {
      if (name == 'theme' && newValue) {
        if (this.shadowRoot) {
          let tag = this.shadowRoot.querySelectorAll('.spin')[0];
          if (oldValue) {
            tag.classList.remove(oldValue);
          }
          tag.classList.add(newValue);
        }
      }
    } catch (error) {

    }

  }

}

export default Tspinbutton;