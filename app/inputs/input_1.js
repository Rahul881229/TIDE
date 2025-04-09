import styles from "./input.scss";
//import styles from "../../assets/tglobal.scss";

class InputText extends HTMLElement {
  #internals = this.attachInternals();
  #input = HTMLInputElement;

  static formAssociated = true;

  static observedAttributes = [
    "disabled",
    "placeholder",
    "type",
    "theme",
    "min",
    "max",
    "maxlength",
    "readonly",
    "size",
    "src",
    "name",
    "id",
    "autofocus",
    "icon",
  ];

  get form() {
    return this.#internals.form;
  }
  get name() {
    return this.getAttribute("name");
  }
  get type() {
    return this.localName;
  }
  get value() {
    return this.#input.value;
  }
  /* This is a setter method for the `value` property of the `InputText` class. It sets the value of
  the internal `#input` element to the passed value `v`, and then dispatches a custom event named
  "tinputtext" with the detail object containing the version, method, and data attributes. This
  event can be used to notify other parts of the application that the value of the input has
  changed. The `get value()` method is used to retrieve the current value of the input. */

  set value(v) {
    this.#input.value = v;
    this.dispatchEvent(
      new CustomEvent("tinputtext", {
        bubbles: true,
        detail: {
          version: "2.2.21",
          method: this.getAttribute("callback"),
          data: v,
        },
      })
    );
  }
  get validity() {
    return this.#internals.validity;
  }
  get validationMessage() {
    return this.#internals.validationMessage;
  }
  get willValidate() {
    return this.#internals.willValidate;
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open", delegatesFocus: true });
    let template = "";
    let iconrotaion = this.hasAttribute("lang")
      ? this.getAttribute("lang") == "ar"
        ? 'style="direction: rtl;"'
        : ""
      : "";
    let inputWidth = "";
    if (this.hasAttribute("sm") || this.hasAttribute("small")) {
      inputWidth = "sm";
    } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
      inputWidth = "lg";
    }
    template = `<style>${styles.toString()}</style>`;
    template =
      template +
      `
          <div class="t-inputtext-container ${inputWidth}" ${iconrotaion}>
              <img class="t-inputtext-img">
              <input  type="text" class="t-inputtext ticon"/>
          </div>      
          `;
    this.shadowRoot.innerHTML = template;
    this.#input = this.shadowRoot.querySelector("input");
    this.#input.addEventListener("input", () =>
      this.#internals.setFormValue(this.value)
    );
  }

  checkValidity() {
    return this.#internals.checkValidity();
  }

  reportValidity() {
    return this.#internals.reportValidity();
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    switch (name) {
      case "theme":
        this.#input.setAttribute(name, newValue);
        var wrap = this.shadowRoot.querySelector("input");
        if (wrap) {
          if (_oldValue) wrap.classList.remove(_oldValue);
          wrap.classList.add(newValue);
        }
        break;
      case "disabled":
        // this.shadowRoot.querySelector('input').disabled = false;
        this.#input.disabled = newValue === "true";
        break;
      default:
        this.#input.setAttribute(name, newValue);
        break;
    }
    if (name == "theme") {
      var wrap = this.shadowRoot.querySelector("input");
      if (wrap) {
        if (_oldValue) wrap.classList.remove(_oldValue);
        wrap.classList.add(newValue);
      }
    }
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector("input")
      .setAttribute("type", this.getAttribute("type"));
    setTimeout(() => {
      if (this.hasAttribute("icon")) {
        this.shadowRoot.querySelector(".t-inputtext-img").style.display =
          "block";
        this.shadowRoot
          .querySelector(".t-inputtext-img")
          .setAttribute("src", this.getAttribute("icon"));
      } else {
        this.shadowRoot.querySelector("input").style.padding = "5px 10px";
        this.shadowRoot.querySelector(".t-inputtext-img").style.display =
          "None";
      }
      let inputWidth = "";
      if (this.hasAttribute("sm") || this.hasAttribute("small")) {
        inputWidth = "sm";
      } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
        inputWidth = "lg";
      }
      if (inputWidth != "")
        this.shadowRoot
          .querySelector(".t-inputtext-container")
          .classList.add(inputWidth);
    }, 0);

    // Create the suggestion box
    if (this.hasAttribute("suggestions")) {
      const suggestionBox = document.createElement("ul");
      suggestionBox.className = "suggestion-box";
      this.shadowRoot.querySelector(".t-inputtext-container").appendChild(suggestionBox);
    
      // Debounce function to limit frequent executions
      let debounceTimer;
      
      // Function to handle input and filter suggestions
      const filterSuggestions = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const query = this.#input.value.toLowerCase().trim();
          suggestionBox.innerHTML = ""; // Clear previous suggestions
    
          if (query) {
            const suggestions = this.getAttribute("suggestions")?.split(",") || [];
            const filtered = suggestions.filter(s => s.toLowerCase().includes(query));
    
            if (filtered.length > 0) {
              filtered.forEach(suggestion => {
                const item = document.createElement("li");
                const regex = new RegExp(`(${query})`, "gi");
                const highlighted = suggestion.replace(regex, `<strong>$1</strong>`);
                item.innerHTML = highlighted;
                item.addEventListener("click", () => {
                  this.#input.value = suggestion;
                  suggestionBox.style.display = "none";
                });
                suggestionBox.appendChild(item);
              });
              suggestionBox.style.display = "block";
            } else {
              // const noResultsItem = document.createElement("li");
              // noResultsItem.textContent = "No suggestions found";
              // noResultsItem.style.padding = "8px 12px";
              // noResultsItem.style.color = "#888";
              // suggestionBox.appendChild(noResultsItem);
              // suggestionBox.style.display = "block";
            }
          } else {
            suggestionBox.style.display = "none";
          }
        }, 300); // 300ms debounce delay
      };
    
      this.#input.addEventListener("input", filterSuggestions);
    
      // Close suggestion box on click outside
      this.shadowRoot.addEventListener("click", (event) => {
        if (!this.shadowRoot.querySelector(".suggestion-box").contains(event.target) && event.target !== this.#input) {
          suggestionBox.style.display = "none";
        }
      });
    
      // Keyboard navigation for suggestions
      let currentIndex = -1;
      const handleKeyboardNavigation = (e) => {
        const items = suggestionBox.querySelectorAll("li");
    
        if (e.key === "ArrowDown") {
          if (currentIndex < items.length - 1) {
            currentIndex++;
            items[currentIndex].classList.add("highlight");
            if (currentIndex > 0) items[currentIndex - 1].classList.remove("highlight");
          }
        } else if (e.key === "ArrowUp") {
          if (currentIndex > 0) {
            currentIndex--;
            items[currentIndex].classList.add("highlight");
            items[currentIndex + 1].classList.remove("highlight");
          }
        } else if (e.key === "Enter") {
          if (currentIndex >= 0) {
            this.#input.value = items[currentIndex].textContent;
            suggestionBox.style.display = "none";
          }
        }
      };
    
      this.#input.addEventListener("keydown", handleKeyboardNavigation);
    
      // Hide suggestions on blur and show suggestions on focus
      this.#input.addEventListener("blur", () => {
        setTimeout(() => (suggestionBox.style.display = "none"), 200);
      });
    
      this.#input.addEventListener("focus", () => {
        const query = this.#input.value.toLowerCase().trim();
        const suggestions = this.getAttribute("suggestions")?.split(",") || [];
        const filtered = suggestions.filter(s => s.toLowerCase().includes(query));
        suggestionBox.style.display = filtered.length > 0 ? "block" : "none";
      });
    }
  }    
}
export default InputText;
// window.customElements.define('t-input', InputText);
