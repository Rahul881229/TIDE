import styles from "./button.scss";
class Button extends HTMLElement {
  constructor() {
    super();
    // this.sendListner = this.sendListner.bind(this);
    setTimeout(() => {
      var text = this.innerHTML.trim() ? this.innerHTML.trim() : "";
      // var styleClass = (this.getAttribute("class") ? `${this.getAttribute("class")}` : '');
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
      var count = this.hasAttribute("count") ? this.getAttribute("count") : "";
      var lang = this.getAttribute("lang") == "ar" ? 'dir="rtl" lang="ar"' : "";
      var width = this.hasAttribute("width")
        ? `style=width:${this.getAttribute("width")}`
        : "";

      var disabled = this.hasAttribute("disabled")
        ? this.getAttribute("disabled") == "true"
          ? true
          : false
        : false;

      // console.log("disabled--->", disabled);
      var btnSize = "";
      if (this.hasAttribute("small") || this.hasAttribute("sm")) {
        btnSize = "sm";
      } else if (this.hasAttribute("medium") || this.hasAttribute("md")) {
        btnSize = "md";
      } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
        btnSize = "lg";
      }
      // console.log("btn size--->", btnSize);

      var btnColor = "";
      if (this.hasAttribute("primary")) {
        btnColor = "t-btn-primary";
      } else if (this.hasAttribute("warning")) {
        btnColor = "t-btn-warning";
      } else if (this.hasAttribute("danger")) {
        btnColor = "t-btn-danger";
      } else if (this.hasAttribute("light")) {
        btnColor = "t-btn-light";
      }

      //   var transparent = "";
      //   if (this.hasAttribute("transparent")) {
      //     transparent = "transparent";
      //   }

      var buttonBgOpacity = this.getAttribute("buttontype");
      if (this.hasAttribute("transparent-primary")) {
        buttonBgOpacity = "transparent-primary";
      } else if (this.hasAttribute("transparent-warning")) {
        buttonBgOpacity = "transparent-warning";
      } else if (this.hasAttribute("transparent-danger")) {
        buttonBgOpacity = "transparent-danger";
      } else if (this.hasAttribute("transparent-medium")) {
        buttonBgOpacity = "transparent-medium";
      }

      var transparentBtn = "";
      if (this.hasAttribute("btn-transparent")) {
        transparentBtn = "btn-transparent";
      }

      var dotted = "";
      if (this.hasAttribute("dotted")) {
        dotted = "dotted";
      }

      const template = document.createElement("template");
      var buttonString = "";
      if (this.getAttribute("icon") && !text) {
        // console.log('button string---->', "sm inside");
        let countText = "";
        if (count != "0") {
          if (parseInt(count) > 9) {
            countText = `<span class="noti">${9}+</span>`;
          } else {
            countText = `<span class="noti">${count}</span>`;
          }
        }
        buttonString = `<span>${countText}
                    <button ${width} class="t-buttonIcon ${btnSize} ${btnColor} ${transparentBtn} ${theme} ${buttonBgOpacity} ${dotted}" ${disabled ? "disabled" : ""}> <img src=${this.getAttribute(
          "icon"
        )} alt=""/></button>
                </span>`;
      } else {
        // var icon = (this.getAttribute("icon") ? `<img class="pr" src=${this.getAttribute("icon")} alt="" />` : '');
        var icon = this.getAttribute("icon")
          ? `<img src=${this.getAttribute("icon")} alt="" />`
          : "";
        // buttonString = `<button ${lang} class="t-button ${styleClass}" ${btnDisabled} > ${icon} <label> ${text} </label></button>`;
        buttonString = `<button ${lang} ${width} class="t-button ${btnSize} ${transparentBtn} ${theme} ${dotted} ${buttonBgOpacity} ${btnColor}" ${disabled ? "disabled" : ""
          } > ${icon} <label> ${text} </label></button>`;
      }

      // console.log('button string---->', buttonString);
      template.innerHTML = `
            <style>${styles.toString()}</style>
              ${buttonString}
            `;

      // Add a shadow DOM
      this.attachShadow({ mode: "open" });

      // render
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }, 0);
  }

  static get observedAttributes() {
    return ["disabled", "count", "lang", "theme","buttontype"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //console.log("name--", name + "\tnewvalue---", newValue);
    if (this.shadowRoot) {
      if (name == "disabled" && newValue) {
        var btn = this.shadowRoot.querySelector(".t-button");
        var btnIcon = this.shadowRoot.querySelector(".t-buttonIcon");

        if (btn) {
          if (newValue == "true") {
            // console.log("disabled", newValue);
            btn.setAttribute("disabled", true);
          } else {
            // console.log("disabled remove", newValue);
            btn.removeAttribute("disabled");
          }
        }
        if (btnIcon) {
          if (newValue == "true") {
            // console.log("disabled", newValue);
            btnIcon.setAttribute("disabled", true);
          } else {
            // console.log("disabled remove", newValue);
            btnIcon.removeAttribute("disabled");
          }
        }
      }
      if (name == "count" && newValue) {
        var btn = this.shadowRoot.querySelectorAll(".noti")[0];
        if (newValue == "0") {
          btn.style.display = "none";
        } else {
          btn.style.display = "block";
          if (parseInt(newValue) > 9) {
            btn.textContent = "9+";
          } else {
            btn.textContent = newValue;
          }
        }
      }
      if (name == "theme" && newValue) {
        let button = this.shadowRoot.querySelectorAll(".t-button")[0];
        if (oldValue) {
          button.classList.remove(oldValue);
        }
        button.classList.add(newValue);
      }

      if (name == "buttontype" && newValue) {
        let button = this.shadowRoot.querySelectorAll(".t-button")[0];
        if (oldValue) {
          button.classList.remove(oldValue);
        }
        button.classList.add(newValue);
      }
    }
  }

  disconnectedCallback() {
    setTimeout(() => {
      if (this.shadowRoot) {
        this.shadowRoot
          .querySelector("button")
          .removeEventListener("click", this.sendListner);
      }
    }, 0);
  }

  connectedCallback() {
    setTimeout(() => {
      if (this.shadowRoot) {
        if (this.hasAttribute("click")) {
          this.shadowRoot
            .querySelector("button")
            .addEventListener("click", (event) => {
              this.sendListner(event, this);
            });
        }
      }
    }, 0);
  }

  sendListner(item, _this) {
    this.dispatchEvent(
      new CustomEvent("tbutton", {
        bubbles: true,
        detail: {
          method: _this.getAttribute("click"),
          params: "",
          version: "2.2.21",
          data: item,
        },
      })
    );
  }
}
export default Button;
// window.customElements.define('t-button', Button);
