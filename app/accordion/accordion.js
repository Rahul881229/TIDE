import styles from "./accordion.scss";
class Accordion extends HTMLElement {
  constructor() {
    super();
    setTimeout(() => {
      let multi = this.hasAttribute("multi")
        ? this.getAttribute("multi") == true ||
          this.getAttribute("multi") == "true"
          ? true
          : false
        : false;
      let panels = this.children;
      let btnSize = "";
      if (this.hasAttribute("small") || this.hasAttribute("sm")) {
        btnSize = "sm";
      } else if (this.hasAttribute("medium") || this.hasAttribute("md")) {
        btnSize = "md";
      } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
        btnSize = "lg";
      }

      let theme = this.hasAttribute("theme")
        ? this.getAttribute("theme")
        : "dark";
      let lang = this.hasAttribute("lang")
        ? this.getAttribute("lang") == "ar"
          ? 'dir="rtl" lang="ar"'
          : ""
        : "";
      let rotate = this.hasAttribute("lang")
        ? this.getAttribute("lang") == "ar"
          ? "rotatecontent"
          : ""
        : "";

      const template = document.createElement("template");
      template.innerHTML = `<style>${styles.toString()}</style>
            <div class="accordion-wrapper ${theme} ${rotate}" ${lang}>
            </div>
            `;
      this.appendChild(template.content.cloneNode(true));

      let type = multi ? "checkbox" : "radio";
      let uniqueId = this.generateUniqueId();
      for (let value of panels) {
        if (value.nodeName == "T-ACCORDION-PANEL") {
          let divElement = document.createElement("div");
          divElement.className = "accordion";
          let inputElement = document.createElement("input");
          inputElement.setAttribute("type", type);
          inputElement.className = "checkinput";
          if (value.hasAttribute("open")) {
            if (value.getAttribute("open") == "true") {
              inputElement.checked = true;
            }
          }
          if (value.hasAttribute("value")) {
            inputElement.setAttribute(
              "accordionValue",
              value.getAttribute("value")
            );
          }
          inputElement.setAttribute("name", "accordionName-" + uniqueId);
          let id = this.generateUniqueId();
          inputElement.setAttribute("id", "accordion-" + id);
          inputElement.setAttribute(
            "accordianValue",
            value.getAttribute("value")
          );
          let labelElement = document.createElement("label");
          labelElement.className =
            "accordion-label " + this.checkbtnSize(btnSize, "-accordion-label");
          labelElement.setAttribute("for", "accordion-" + id);
          labelElement.appendChild(
            value.getElementsByTagName("t-accordion-title")[0]
          );
          labelElement.querySelectorAll("t-accordion-title")[0].className =
            this.checkbtnSize(btnSize, "-t-accordion-title");

          if (value.hasAttribute("backgroundColor")) {
            let color = value.getAttribute("backgroundColor");
            labelElement.style.backgroundColor = color;
          }

          divElement.appendChild(inputElement);
          divElement.appendChild(labelElement);

          let divContentElement = document.createElement("div");
          divContentElement.className = "accordion-content";
          divContentElement.appendChild(
            value.getElementsByTagName("t-accordion-content")[0]
          );

          divElement.appendChild(divContentElement);
          this.querySelectorAll(".accordion-wrapper")[0].appendChild(
            divElement
          );
        }
      }
    }, 0);
  }

  checkbtnSize(data, tag) {
    if (data === "lg" || data === "large") {
      return data + tag;
    } else if (data === "sm" || data === "small") {
      return data + tag;
    }
    return "";
  }

  generateUniqueId() {
    return (Math.floor(Math.random() * (10000000 - 1)) + 1).toString();
  }

  disconnectedCallback() {
    let label = this.querySelectorAll("input");
    for (let i = 0; i < label.length; i++) {
      label[i].removeEventListener("click", this.connectedCallback);
    }
  }

  static get observedAttributes() {
    return ["theme", "lang", "openedpanel", "multi"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    setTimeout(() => {
      if (newValue) {
        switch (name) {
          case "theme":
            if (this) {
              let tag = this.querySelectorAll(".accordion-wrapper")[0];
              if (tag) {
                if (oldValue) {
                  tag.classList.remove(oldValue);
                }
                tag.classList.add(newValue);
              }
            }

            break;
          case "lang":
            if (this) {
              let tag = this.querySelectorAll(".accordion-wrapper")[0];
              let label = this.querySelectorAll(".accordion-label");
              if (tag) {
                if (oldValue) {
                  tag.removeAttribute(oldValue);
                }
                if (newValue == "ar") {
                  tag.classList.add("rotate");
                  tag.setAttribute("dir", "rtl");
                  if (label) {
                    label.forEach((ele) => {
                      ele.style.textAlign = "right";
                    });
                  }
                } else {
                  tag.classList.remove("rotate");
                  tag.removeAttribute("dir");
                  if (label) {
                    label.forEach((ele) => {
                      ele.style.textAlign = "left";
                    });
                  }
                }
              }
            }
            break;

          case "openedpanel":
            if (this) {
              for (let value of this.querySelectorAll("input")) {
                if (value.getAttribute("accordianValue") == newValue) {
                  value.checked = true;
                  // this._sentToApp({
                  //     value: value.checked,
                  //     index: true,
                  //     open: value.checked
                  // });
                }
              }
            }
            break;
          case "multi":
            const isMulti = newValue === "true" || newValue === true; // Ensure `isMulti` is defined
            const type = isMulti ? "checkbox" : "radio";
            const inputs = this.querySelectorAll("input.checkinput");
            inputs.forEach((input) => {
              input.setAttribute("type", type);
            });
            break; // Add break here to stop further execution
          default:
            break;
        }
      }
    }, 0);
  }

  _sentToApp(value) {
    this.dispatchEvent(
      new CustomEvent("taccordion", {
        bubbles: true,
        detail: {
          version: "2.2.21",
          method: this.getAttribute("callback"),
          params: "",
          data: value,
        },
      })
    );
  }

  connectedCallback() {
    setTimeout(() => {
      if (this) {
        let count = "-1";
        let input = this.querySelectorAll("input");
        input.forEach((element, index) => {
          element.addEventListener("click", (event) => {
            if (event.target && event.target.matches("input[type='radio']")) {
              if (count == event.target.id) {
                count = "-1";
                event.target.checked = false;
              } else {
                count = event.target.id;
                event.target.checked = true;
              }
              this._sentToApp({
                value: event.target.hasAttribute("accordionValue")
                  ? event.target.getAttribute("accordionValue")
                  : null,
                index: index,
                open: event.target.checked,
              });
            }
            if (
              event.target &&
              event.target.matches("input[type='checkbox']")
            ) {
              if (count == event.target.id) {
                count = "-1";
                event.target.checked = false;
              } else {
                count = event.target.id;
                event.target.checked = true;
              }
              this._sentToApp({
                value: event.target.hasAttribute("accordionValue")
                  ? event.target.getAttribute("accordionValue")
                  : null,
                index: index,
                open: event.target.checked,
              });
            }
          });
        });
      }
    }, 0);
  }
}
export default Accordion;
