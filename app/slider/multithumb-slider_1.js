import styles from './multithumb-slider.scss';

class Multislider extends HTMLElement {
  constructor() {
    super();

    // Delay initialization to ensure everything is ready
    setTimeout(() => {
      const template = document.createElement('template');
      template.innerHTML = `
        <style>${styles.toString()}</style>
        <div class="middle">
          <div class="multi-range-slider">
            <div class="slider-val-wrap">
              <span class="min-val"></span>
              <span class="max-val"></span>
            </div>
            <input id="input-left" type="range" />
            <input id="input-right" type="range" />
            <div class="multislider">
              <div class="track"></div>
              <div class="range"></div>
              <div class="thumb left"></div>
              <div class="thumb right"></div>
            </div>
          </div>
        </div>`;

      const shadowDOM = this.attachShadow({ mode: 'open' });
      shadowDOM.appendChild(template.content.cloneNode(true));

      const inputLeft = this.shadowRoot.getElementById("input-left");
      const inputRight = this.shadowRoot.getElementById("input-right");
      const thumbLeft = this.shadowRoot.querySelector(".multislider > .thumb.left");
      const thumbRight = this.shadowRoot.querySelector(".multislider > .thumb.right");
      const range = this.shadowRoot.querySelector(".multislider > .range");
      const minValText = this.shadowRoot.querySelector('.min-val');
      const maxValText = this.shadowRoot.querySelector('.max-val');
      const callbackFn = this.getAttribute("callback");

      // Initialize range slider values
      const minValue = parseInt(this.getAttribute('min')) || 0;
      const maxValue = parseInt(this.getAttribute('max')) || 1000;
      const initialLeftValue = parseInt(this.getAttribute('InitialThumbValue')) || minValue;
      const initialRightValue = parseInt(this.getAttribute('finalThumbValue')) || maxValue;

      // Set input range min and max values
      inputLeft.min = minValue;
      inputLeft.max = maxValue;
      inputRight.min = minValue;
      inputRight.max = maxValue;

      // Set initial values for the thumbs
      inputLeft.value = initialLeftValue;
      inputRight.value = initialRightValue;

      const setLeftValue = () => {
        const min = parseInt(inputLeft.min);
        const max = parseInt(inputLeft.max);

        // Ensure left thumb does not overlap the right thumb
        inputLeft.value = Math.min(parseInt(inputLeft.value), parseInt(inputRight.value) - 1);
        const percentLeft = ((inputLeft.value - min) / (max - min)) * 100;

        thumbLeft.style.left = percentLeft + "%";
        range.style.left = percentLeft + "%";
        minValText.innerText = inputLeft.value;
      };

      const setRightValue = () => {
        const min = parseInt(inputRight.min);
        const max = parseInt(inputRight.max);

        // Ensure right thumb does not overlap the left thumb
        inputRight.value = Math.max(parseInt(inputRight.value), parseInt(inputLeft.value) + 1);
        const percentRight = ((inputRight.value - min) / (max - min)) * 100;

        thumbRight.style.right = (100 - percentRight) + "%";
        range.style.right = (100 - percentRight) + "%";
        maxValText.innerText = inputRight.value;
      };

      // Initial value settings for both thumbs
      setLeftValue();
      setRightValue();

      // Function to dispatch custom event
      const dispatchSliderEvent = (valueType, value) => {
        this.dispatchEvent(new CustomEvent("tmultislider", {
          bubbles: true,
          detail: {
            version: '2.2.21',
            method: callbackFn,
            params: '',
            data: {
              [valueType]: value
            }
          }
        }));
      };

      // Add input event listeners to both sliders
      inputLeft.addEventListener('input', () => {
        setLeftValue();
        dispatchSliderEvent('minrangevalue', inputLeft.value);
      });

      inputRight.addEventListener('input', () => {
        setRightValue();
        dispatchSliderEvent('maxrangevalue', inputRight.value);
      });

      // Handle z-index when hovering over thumbs
      inputLeft.addEventListener("mouseenter", function () {
        inputRight.style.zIndex = 3;
        inputLeft.style.zIndex = 4;
      });

      inputLeft.addEventListener("mouseleave", function () {
        // Reset z-index when the mouse leaves
        inputRight.style.zIndex = 4;
        inputLeft.style.zIndex = 3;
      });

      inputRight.addEventListener("mouseenter", function () {
        inputLeft.style.zIndex = 3;
        inputRight.style.zIndex = 4;
      });

      inputRight.addEventListener("mouseleave", function () {
        // Reset z-index when the mouse leaves
        inputLeft.style.zIndex = 4;
        inputRight.style.zIndex = 3;
      });

    }, 0);
  }

  connectedCallback() { }
}

export default Multislider;
