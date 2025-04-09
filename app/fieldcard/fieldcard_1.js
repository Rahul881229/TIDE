class FieldCard extends HTMLElement {
    static css = `
        .header {
            /* text-align: center; */
            padding-left: 41px;
            color: white;
            padding-top: 8px;
            font-weight: bold;
            font-size: 18px;
            width: 100%;
        }
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
            position: absolute;
            left: 38px;
            bottom: 287px;
        }
            .fieldcard {
                width: 200px;
                height: 100px;
                border-radius: 5%;
                border: 2px solid blue;
                box-shadow: 0px 0px 16px 0px #3e7189 inset
            }

           .value {
                padding-left: 41px;
                padding-top: 18px;
                width: max-content;
                font-size: 25px;
                font-weight: bold;
                color: white;
                /* transform: translate(-50%, -50%); */
            }
    `;
    static get observedAttributes() {
        return ["header", "color", "icon", "inner-color","value"];	
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        const fill = document.createElement("div");
        const span1 = document.createElement("div");
        const span2 = document.createElement("div");
        span2.innerHTML = `<img src=${this.icon} alt="" />`;
        const span3 = document.createElement("div");
        span3.innerHTML = `${this.value}%`;
        fill.appendChild(span1);
        fill.appendChild(span2);
        fill.appendChild(span3);
        // var icon = ${this.icon}? `<img src=${this.icon} alt="" />` : '';
        span1.innerHTML = `${this.header}%`;
        // span2.innerText = `${this.percent}%`;
        style.innerHTML = FieldCard.css;
        fill.classList.add("fieldcard");
        span1.classList.add("header");
        span2.classList.add("image");
        span3.classList.add("value");
        this.shadowRoot.append(style, fill);
    }

    get header() {
       return this.getAttribute("header");
    }

    set header(value) {
        this.setAttribute("header", value);
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

    get value() {
        return this.getAttribute("value");
    }

    set value(value) {
        this.setAttribute("value", value);
    }

    attributeChangedCallback(name) {
        if (name === "header") {
            this.shadowRoot.querySelector(".header").innerText = `${this.header}`;
        } else if (name === "icon") {
            this.shadowRoot.querySelector(".fieldcard img").src = this.icon;
        } else if (name === "color") {
            this.shadowRoot.querySelector(".fieldcard").style.border = `2px solid ${this.color}`;
            this.shadowRoot.querySelector(".fieldcard").style.boxShadow = `0px 0px 16px 0px ${this.innerColor} inset`;
        } else if (name === "value") {
            this.shadowRoot.querySelector(".value").innerText = `${this.value}`;
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
customElements.define("t-field-card", FieldCard);

export default FieldCard;