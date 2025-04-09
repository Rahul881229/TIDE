class VerticalProgressBar extends HTMLElement {
    static css = `
        :host {
            --fill-color: #009688;
            display: block;
            width: 60px; /* Adjust for vertical width */
            height: 150px; /* Adjust for vertical height */
            background: #404040; /* Transparent background */
            border-radius: 20px;
            overflow: hidden;
            // border : 4px solid #404040;
            position: relative; /* Required for the fill to be positioned correctly */
        }

        .fill {
            // text-align: center;
            // color: white;
            // font-weight: bold;
            width: 100%; /* Fill should take full width in vertical orientation */
            height: 0%; /* Start with 0% height */
            background: var(--fill-color, #222222);
            transition: height 0.25s; /* Transition applied to height for smooth effect */
            position: absolute; /* Position to bottom for vertical growth */
            bottom: 0; /* Align fill to the bottom */
        }

        .per {
            text-align: center;
            color: white;
            font-weight: bold;
            width: 100%; /* Fill should take full width in vertical orientation */
            // height: 60%; /* Start with 0% height */
            // background: var(--fill-color, #222222);
            transition: height 0.25s; /* Transition applied to height for smooth effect */
            position: absolute; /* Position to bottom for vertical growth */
            bottom: 25px; /* Align fill to the bottom */
        }

        .image {
            padding-left    : 11px;
            position: absolute;
            bottom: 70px;
        }
    `;
    static get observedAttributes() {
        return ["percent", "color", "icon"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        const fill = document.createElement("div");
        const span1 = document.createElement("div");
        fill.appendChild(span1);
        // var icon = ${this.icon}? `<img src=${this.icon} alt="" />` : '';
        span1.innerHTML = `<img src=${this.icon} alt="" />`;
        const span2 = document.createElement("div");
        fill.appendChild(span2);
        // span2.innerText = `${this.percent}%`;
        style.innerHTML = VerticalProgressBar.css;
        fill.classList.add("fill");
        span2.classList.add("per");
        span1.classList.add("image");
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

    get icon() {
        return this.getAttribute("icon");
    }

    set icon(value) {
        this.setAttribute("icon", value);
    }

    get color() {
        return this.getAttribute("color");
    }

    set color(value) {
        this.setAttribute("color", value);
    }

    attributeChangedCallback(name) {
        if (name === "percent") {
            this.shadowRoot.querySelector(".fill").style.height = `${this.percent}%`;
            this.shadowRoot.querySelector(".per").innerText = `${this.percent}%`;
        } else if (name === "icon") {
            this.shadowRoot.querySelector(".fill img").src = this.icon;
        } else if (name === "color") {
            this.shadowRoot.querySelector(".fill").style.backgroundColor = this.color;
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
customElements.define("t-vprogress-bar", VerticalProgressBar);

export default VerticalProgressBar;