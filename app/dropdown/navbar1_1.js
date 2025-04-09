import styles from "./navbar1.scss";

class NavBar1 extends HTMLElement {

  navbardata = [];
  
  constructor() {
    super();
    let icon = this.hasAttribute("icon") ? this.getAttribute("icon") : false;
    let iconDiv = "";
    if (icon) {
      iconDiv = `<img src="${this.getAttribute("icon")}" />`;
    }
    let text = this.hasAttribute("text") ? this.getAttribute("text") : "";
    const template = document.createElement("template");
    template.innerHTML = `
        <style>${styles.toString()}</style>
        <div class="dropdown">
          <div class="nav-content"> 
            <div class="nav-image">${iconDiv}</div>
            <div class="nav-text">${text}</div>
            <div class="arrow"></div>
          </div>
          <div class="dropdown-content">
          </div>
        </div>
        `;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    let showPanel = this.shadowRoot.querySelector(".nav-content");
    this.dropdownContentDiv =
      this.shadowRoot.querySelector(".dropdown-content");

    showPanel.addEventListener("click", (event) => {
      this.dropdownContentDiv.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
      event.stopPropagation();
      if (event.target !== this) {
        this.shadowRoot
          .querySelector(".dropdown-content")
          .classList.remove("active");
      }
    });
  }

  _findArrayData(value) {
    let returnValue = {};
    returnValue = this.navbardata.find((element) => element.value == value);
    if (!returnValue) {
      for (let i = 0; i < this.navbardata.length; i++) {
        if (
          this.navbardata[i].submenu &&
          this.navbardata[i].submenu.length > 0
        ) {
          returnValue = this._findSubArrayData(
            this.navbardata[i].submenu,
            returnValue,
            value
          );
        }
      }
    }
    return returnValue;
  }

  _findSubArrayData(submenu, returnValue, value) {
    returnValue = submenu.find((element) => element.value == value);
    if (!returnValue) {
      for (let i = 0; i < submenu.length; i++) {
        if (submenu[i].submenu && submenu[i].submenu.length > 0) {
          returnValue = this._findSubArrayData(
            submenu[i].submenu,
            returnValue,
            value
          );
        }
      }
    }
    return returnValue;
  }

  _addListData(data) {
    let listContainer = this.shadowRoot.querySelector(".dropdown-content");
    listContainer.innerHTML = null;
    if (data.length > 0) {
      let htmlContent;
      htmlContent = `<ul class="dropdown-menu">`;
      data.forEach((element) => {
        if (element.submenu && element.submenu.length > 0) {
          htmlContent = this._getSubMenuContent(
            element,
            element.submenu,
            htmlContent
          );
        } else {
          htmlContent += `
            <li>
              <a value=${element.value}>
                ${element.icon ? "<img src=" + element.icon + ">" : ""}
                ${element.label} 
              </a >
            </li>`;
        }
      });
      htmlContent += `</ul> `;
      listContainer.innerHTML = htmlContent;

      let dropdownMenus = this.shadowRoot.querySelectorAll(".dropdown-menu li");
      dropdownMenus.forEach((element) => {
        element.addEventListener("click", (e) => {
          let value = this._findArrayData(
            element.getElementsByTagName("a")[0].getAttribute("value")
          );
          if (value) {
            this._sentToApp(value);
          }
        });
      });
    }
  }

  _getSubMenuContent(menu, submenu, htmlContent) {
    htmlContent += `<li class='dropdown-submenu'>
      <a value=${menu.value}>
        ${menu.icon ? "<img src=" + menu.icon + ">" : ""}
        ${menu.label}
      </a>
      <ul class="dropdown-menu">`;
    submenu.forEach((ele) => {
      if (ele.submenu && ele.submenu.length > 0) {
        htmlContent = this._getSubMenuContent(ele, ele.submenu, htmlContent);
      } else {
        htmlContent += `
          <li>
            <a value=${ele.value}> 
              ${ele.icon ? "<img src=" + ele.icon + ">" : ""}
              ${ele.label}
            </a>
          </li>`;
      }
    });
    htmlContent += `</ul></li>`;
    return htmlContent;
  }

  _sentToApp(value) {
    this.dispatchEvent(
      new CustomEvent("tnavbar", {
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

  static get observedAttributes() {
    return ["position", "data", "theme", "lang", "text", "icon"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      if (name && newValue) {
        switch (name) {
          case "data":
            this.navbardata = newValue == "" ? [] : JSON.parse(newValue);
            this._addListData(this.navbardata);
            break;
          case "position":
            let dropdownContentDiv =
              this.shadowRoot.querySelector(".dropdown-content");
            if (oldValue) {
              dropdownContentDiv.classList.remove(
                "dropdown-content-" + oldValue
              );
            }
            dropdownContentDiv.classList.add("dropdown-content-" + newValue);
            break;
          case "theme":
            let dropdown = this.shadowRoot.querySelector(".dropdown");
            if (oldValue) {
              dropdown.classList.remove(oldValue);
            }
            dropdown.classList.add(newValue);
            break;
          case "lang":
            let dropdownDiv = this.shadowRoot.querySelector(".dropdown");
            if (newValue == "ar") {
              dropdownDiv.setAttribute("dir", "rtl");
              dropdownDiv.setAttribute("lang", "ar");
            } else {
              dropdownDiv.setAttribute("dir", "ltr");
              dropdownDiv.setAttribute("lang", newValue);
            }
            break;
          case "text":
            let navtextDiv = this.shadowRoot.querySelector(".nav-text");
            if (navtextDiv) navtextDiv.innerHTML = newValue;
            break;
          case "icon":
            let navImageDiv = this.shadowRoot.querySelector(".nav-image");
            if (navImageDiv) {
              navImageDiv.innerHTML = null;
              navImageDiv.innerHTML = `<img src="${newValue}" />`;
            }
            break;
          default:
            break;
        }
      }
    }
  }

  connectedCallback() {}

}

export default NavBar1;
