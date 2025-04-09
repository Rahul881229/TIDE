class ProgressBar extends HTMLElement {
    static css = `
          :host {
            --fill-color: #009688;
              display: block;
              width: 100%;
              height: 15px;
              background: #eeeeee;
              border-radius: 4px;
              overflow: hidden;
          }
  
          .fill {
              width: 0%;
              height: 100%;
              background: var(--fill-color, #222222);
              transition: width 0.25s;
          }
      `;

    static get observedAttributes() {
        return ["percent"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        const fill = document.createElement("div");
        style.innerHTML = ProgressBar.css;
        fill.classList.add("fill");
        this.shadowRoot.append(style, fill);
    }

    get percent() {
        const value = this.getAttribute("percent");
        if (isNaN(value)) return 0;
        if (value < 0) return 0;
        if (value > 100) return 100;
        return Number(value);
    }

    set percent(value) {
        this.setAttribute("percent", value);
    }

    attributeChangedCallback(name) {
        if (name === "percent") {
            this.shadowRoot.querySelector(".fill").style.width = `${this.percent}%`;
        }
    }

    // updateProgressBar(increment) {
    //     const currentPercent = this.percent;
    //     const newPercent = currentPercent + increment;

    //     // Update the attribute to trigger the attributeChangedCallback.
    //     this.percent = newPercent;

    //     // Optionally, you can check if the progress has reached 100% and take any action.
    //     if (newPercent >= 100) {
    //         // Progress is complete, you can handle this event here.
    //     }

    //     // Schedule the next update.
    //     if (newPercent < 100) {
    //         setTimeout(() => {
    //             this.updateProgressBar(increment);
    //         }, 1000); // 10 seconds
    //     }
    // }

    // connectedCallback() {
    //     // Start the progress when the element is added to the DOM.
    //     this.updateProgressBar(3);
    // }
}




//   customElements.define("t-progress-bar", ProgressBar);
export default ProgressBar;  