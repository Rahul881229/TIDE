import styles from './treeroot.scss';

class TreeRoot extends HTMLElement {
  constructor() {
    super()
    let treesize = '';
    if (this.hasAttribute("sm") || this.hasAttribute("small")) {
      treesize = 'sm';
    } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
      treesize = 'lg';
    }
    const template = document.createElement('template');
    template.innerHTML = `<style>${styles.toString()}</style>
      <div>
        <ul class="ttreeroot ${treesize}">
        </ul>
      </div>
    `;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  getCheckedData(checkedStatus, value, childList) {
    // console.log("getCheckedData -> ", checkedStatus, value, childList);
    let array = [];
    let checkboxes = this.shadowRoot.querySelectorAll('input[type=checkbox]:checked');
    checkboxes.forEach(element => {
      if (element.value) {
        array.push(element.value);
      }
    });
    // return array;
    let callbackFn = this.getAttribute("callback");
    this.dispatchEvent(new CustomEvent("ttreeroot", {
      bubbles: true,
      detail: {
        version: "2.2.21",
        method: callbackFn,
        data: {
          clicked: value,
          status: checkedStatus,
        },
        childList: childList,
        allCheckedList: array
      }
    }));



  }

  // nestedLoop
  showNested(children) {
    // console.log("children -> ", children);
    let ulElement = document.createElement("ul");
    ulElement.classList.add("nested");
    children.forEach(e => {
      let inputElement = document.createElement("input");
      inputElement.classList.add("checkboxData");
      inputElement.id = "checkbox_" + e.id;
      inputElement.setAttribute("type", "checkbox");
      inputElement.setAttribute("value", e.id);
      if (e.checked) {
        inputElement.setAttribute("checked", true);
      }
      if (e.disabled) {
        inputElement.setAttribute("disabled", true);
      }

      let labelElement = document.createElement("label");
      labelElement.classList.add("form-control");
      labelElement.setAttribute("for", "checkbox_" + e.id);

      labelElement.appendChild(inputElement);
      labelElement.innerHTML += e.label;

      let liElement = document.createElement("li");
      if (e.children && e.children.length > 0) {
        let spanElement = document.createElement("span");
        spanElement.classList.add("caret");
        liElement.appendChild(spanElement);
      } else {
        labelElement.classList.add("noChildren");
      }
      liElement.appendChild(labelElement);

      if (e.children && e.children.length > 0) {
        liElement.appendChild(this.showNested(e.children));
      }

      ulElement.appendChild(liElement);
    });
    // console.log("nested ulElement -> ", ulElement);
    return ulElement;
  }

  // firstLoop
  bindData(data) {
    let ttreeroot = this.shadowRoot.querySelector('.ttreeroot');
    ttreeroot.innerHTML = null;
    data.forEach(e => {
      let inputElement = document.createElement("input");
      inputElement.classList.add("checkboxData");
      inputElement.id = "checkbox_" + e.id;
      inputElement.setAttribute("type", "checkbox");
      inputElement.setAttribute("value", e.id);
      if (e.checked) {
        inputElement.setAttribute("checked", true);
      }
      if (e.disabled) {
        inputElement.setAttribute("disabled", true);
      }

      let labelElement = document.createElement("label");
      labelElement.classList.add("form-control");
      labelElement.setAttribute("for", "checkbox_" + e.id);

      labelElement.appendChild(inputElement);
      labelElement.innerHTML += e.label;

      let liElement = document.createElement("li");
      if (e.children && e.children.length > 0) {
        let spanElement = document.createElement("span");
        spanElement.classList.add("caret");
        liElement.appendChild(spanElement);
      } else {
        labelElement.classList.add("noChildren");
      }
      liElement.appendChild(labelElement);

      if (e.children && e.children.length > 0) {
        liElement.appendChild(this.showNested(e.children));
      }
      ttreeroot.append(liElement);
    });

    this.caretOnClick();
    this.checkboxOnChange();

  }

  static get observedAttributes() {
    return ['theme', 'lang', 'data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("attributeChangedCallback -> ", name, newValue);
    if (this.shadowRoot) {
      if (name && newValue) {
        switch (name) {
          case 'theme':
            let ttreeroot = this.shadowRoot.querySelector('.ttreeroot');
            if (ttreeroot) {
              if (oldValue) {
                ttreeroot.classList.remove(oldValue);
              }
              ttreeroot.classList.add(newValue);
            }
            break;
          case 'lang':
            let ttreeroot1 = this.shadowRoot.querySelector('.ttreeroot');
            if (ttreeroot1) {
              if (newValue == 'ar') {
                ttreeroot1.setAttribute('dir', 'rtl');
              } else {
                ttreeroot1.setAttribute('dir', 'ltr');
              }
              ttreeroot1.setAttribute('lang', newValue);
            }
            break;
          case 'data':
            let ttreeroot2 = this.shadowRoot.querySelector('.ttreeroot');
            if (ttreeroot2) {
              let dataObj = JSON.parse(newValue);
              // console.log("newValue -> ", dataObj);
              if (dataObj && dataObj.length > 0) {
                this.bindData(dataObj);
              } else {
                alert()
              }
            }
            break;
          default:
            break;
        }
      }
    }
  }

  caretOnClick() {
    let toggler = this.shadowRoot.querySelectorAll('.caret');
    toggler.forEach(element => {
      element.addEventListener("click", () => {
        element.parentElement.querySelector(".nested").classList.toggle("active");
        element.classList.toggle("caret-down");
      });
    });
  }

  checkboxOnChange() {
    let checkboxData = this.shadowRoot.querySelectorAll('.form-control');
    checkboxData.forEach(element => {
      element.addEventListener("change", (e) => {
        if (element.parentElement.querySelector(".nested")) {
          element.parentElement.querySelectorAll(".nested").forEach(elementnested => {
            elementnested.classList.toggle("active");
          });

          element.parentElement.querySelectorAll(".caret").forEach(elementcaret => {
            elementcaret.classList.toggle("caret-down");
          });

          element.parentElement.querySelector(".nested").querySelectorAll('input.checkboxData').forEach(inputelement => {
            if (!inputelement.disabled) {
              inputelement.checked = element.querySelector("input.checkboxData").checked;
            }
          });
          let array = [];
          //childCheckbox
          // let checkboxes = element.parentElement.querySelector(".nested").querySelectorAll('input.childCheckbox:checked');
          // childCheckbox with parent
          let checkboxes = element.parentElement.querySelectorAll("input.checkboxData");
          checkboxes.forEach(checkboxesElement => {
            if (!checkboxesElement.disabled && checkboxesElement.value) {
              array.push(checkboxesElement.value);
            }
          });
          this.getCheckedData(element.querySelector("input.checkboxData").checked, element.querySelector("input.checkboxData").value, array);
        } else {
          this.getCheckedData(element.querySelector("input.checkboxData").checked, element.querySelector("input.checkboxData").value, []);
        }

      });
    });
  }

  connectedCallback() {
  }

}

export default TreeRoot;