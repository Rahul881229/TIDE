import styles from './ttoggel.scss';

class TToggle extends HTMLElement {
  static formAssociated = true;

  static get observedAttributes() {
    return ["checked", "disabled", "on-label", "off-label", "theme"];
  }

  #internals;// defining the private fietasklds 

  #switch; // defining the private fields 

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.#internals = this.attachInternals();
    this.#render();
  }

  connectedCallback() {
    this.#updateUI();
    this.#addEventListeners();
  }

  attributeChangedCallback() {
    this.#updateUI();
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <label class="t-toggle-wrapper">
        <div class="t-toggle"></div>
        <span class="label-text"></span>
      </label>
    `;
    this.#switch = this.shadowRoot.querySelector(".t-toggle");
  }

  #addEventListeners() {
    this.shadowRoot.querySelector(".t-toggle-wrapper").addEventListener("click", () => {
      if (this.hasAttribute("disabled")) return;
      this.toggle();
    });
  }

  #updateUI() {
    const label = this.shadowRoot.querySelector(".label-text");
    const isChecked = this.hasAttribute("checked");

    this.#switch.classList.toggle("active", isChecked);
    label.textContent = isChecked
      ? this.getAttribute("on-label") || "On"
      : this.getAttribute("off-label") || "Off";

    this.#internals.setFormValue(isChecked ? "on" : "off");
  }

  toggle() {
    if (this.hasAttribute("checked")) {
      this.removeAttribute("checked");
    } else {
      this.setAttribute("checked", "");
    }
  }

  get value() {
    return this.hasAttribute("checked") ? "on" : "off";
  }

  checkValidity() {
    return this.#internals.checkValidity();
  }

  reportValidity() {
    return this.#internals.reportValidity();
  }
}

// customElements.define("t-toggle", TToggle);
export  default TToggle

