
class CircularProgressBar extends HTMLElement {
    static css = `
        // :host {
        //     --fill-color: #009688;
        //     display: block;
        //     width: 60px; /* Adjust for vertical width */
        //     height: 150px; /* Adjust for vertical height */
        //     background: #404040; /* Transparent background */
        //     border-radius: 20px;
        //     overflow: hidden;
        //     // border : 4px solid #404040;
        //     position: relative; /* Required for the fill to be positioned correctly */
        // }

        // .fill {
        //     // text-align: center;
        //     // color: white;
        //     // font-weight: bold;
        //     width: 100%; /* Fill should take full width in vertical orientation */
        //     height: 0%; /* Start with 0% height */
        //     background: var(--fill-color, #222222);
        //     transition: height 0.25s; /* Transition applied to height for smooth effect */
        //     position: absolute; /* Position to bottom for vertical growth */
        //     bottom: 0; /* Align fill to the bottom */
        // }

        .per {
            text-align: center;
            color: white;
            padding-top : 36px;
            font-weight: bold;
            width: 100%; /* Fill should take full width in vertical orientation */
            // height: 60%; /* Start with 0% height */
            // background: var(--fill-color, #222222);
        }



        .image {
            padding-left    : 11px;
            position: absolute;
            bottom: 70px;
        }
            .progress-bar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: 
    radial-gradient(closest-side, #404040 79%, transparent 80% 100%),
    conic-gradient(hotpink 0%, pink 0);    
}
    `;
    static get observedAttributes() {
        return ["percent", "color", "icon", "inner-color"];	
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        const fill = document.createElement("div");
        const span1 = document.createElement("div");
        fill.appendChild(span1);
        // var icon = ${this.icon}? `<img src=${this.icon} alt="" />` : '';
        span1.innerHTML = `${this.percent}%`;
        // span2.innerText = `${this.percent}%`;
        style.innerHTML = CircularProgressBar.css;
        fill.classList.add("progress-bar");
        span1.classList.add("per");
        // span1.classList.add("image");
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
    get color() {
        return this.getAttribute("color");
    }

    set color(value) {
        this.setAttribute("color", value);
    }
    get icon() {
        return this.getAttribute("icon");
    }

    set icon(value) {
        this.setAttribute("icon", value);
    }
    get innerColor() {
        return this.getAttribute("inner-color");
    }

    set innerColor(value) {
        this.setAttribute("inner-color", value);
    }

    attributeChangedCallback(name) {
        if (name === "percent") {
            this.shadowRoot.querySelector(".progress-bar").style.background = `radial-gradient(closest-side, rgb(32 31 31) 79%, transparent 90% 100%),conic-gradient(hotpink ${this.percent}%, #404040 0)`;
            this.shadowRoot.querySelector(".per").innerHTML = `${this.percent}%`;
        }
        // if (name === "percent") {
        //     this.shadowRoot.querySelector(".progress-bar").style.background = `radial-gradient(closest-side, rgb(32 31 31) 79%, transparent 90% 100%),conic-gradient(hotpink ${this.percent}%, #404040 0)`;
        // } 
        else if (name === "icon") {
            this.shadowRoot.querySelector(".fill img").src = this.icon;
        } else if (name === "color") {
            this.shadowRoot.querySelector(".progress-bar").style.background = `radial-gradient(closest-side, rgb(32 31 31) 79%, transparent 90% 100%),conic-gradient(${this.color} ${this.percent}%, #404040 0)`;
        } else if (name === "inner-color") {
            this.shadowRoot.querySelector(".progress-bar").style.background = `radial-gradient(closest-side, ${this.innerColor} 79%, transparent 90% 100%),conic-gradient(${this.color} ${this.percent}%, #404040 0)`;
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

// Define the custom element
customElements.define("t-cprogress-bar", CircularProgressBar);

export default CircularProgressBar;