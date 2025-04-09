import styles from './dropdown.scss';
class DropDown extends HTMLElement {

  constructor() {
    super();
    setTimeout(() => {
      let lang = '';
      let ar = '';
      if (this.hasAttribute("lang")) {
        lang = this.getAttribute("lang") == 'ar' ? (ar = 'lang', 'dir="rtl" lang="ar"') : '';
      }
      // let lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") == '' ? 'dark' : this.getAttribute("theme") : "dark";
      let style = (this.hasAttribute("style") ? `style="${this.getAttribute("style")}"` : '');
      let defaultText = (this.hasAttribute("defaultText") ? this.getAttribute("defaultText") : 'Select');

      var inputWidth = '';
      if (this.hasAttribute("sm") || this.hasAttribute("small")) {
        inputWidth = 'sm';
      } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
        inputWidth = 'lg';
      }
      var transparent = '';
      if (this.hasAttribute('transparent')) {
        transparent = 'transparent';
      }

      const template = document.createElement('template');
      template.innerHTML = `
            <style>${styles.toString()}</style>
              <div class="select-box ${theme} ${transparent}" ${lang} ${style}>
                  <div class="showSelected ${inputWidth} ${ar}">${defaultText}</div>
                  <div class="selectListDiv">
                      <input type="text" placeholder="Search here" class="search-input-box"/>
                    <div class="options-container"></div>
                  </div>
            </div>`;

      this.attachShadow({
        mode: 'open'
      });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      let showSelected = this.shadowRoot.querySelector('.showSelected');
      showSelected.addEventListener("click", (event) => {
        let selectListDiv = this.shadowRoot.querySelector(".selectListDiv");
        if (selectListDiv.classList.contains("active")) {
          selectListDiv.classList.remove("active");
        } else {
          selectListDiv.classList.add("active");
        }
      });

      // let optionData = JSON.parse(this.getAttribute("option-data"));
      // if (this.hasAttribute('option-keys')) {
      //   this.addingOption(optionData);
      // }

      // let _this = this;
      // let uniqueId = this.generateUniqueId();
      // this.setAttribute('dropdown-unique-id', uniqueId);
      // window.addEventListener('click', function (e) {
      //   // console.log(e.target);
      //   if (e.target.getAttribute('dropdown-unique-id') != uniqueId) {
      //     // console.log('You clicked outside');
      //     _this.shadowRoot.querySelector(".selectListDiv").classList.remove('active');
      //   }
      // });

      document.addEventListener('click', (event) => {
        event.stopPropagation();
        if (event.target !== this) {
          // console.log("outside");
          this.shadowRoot.querySelector(".selectListDiv").classList.remove('active');
        }
      });

    }, 0);
  }

  generateUniqueId() {
    return (Math.floor(Math.random() * (10000000 - 1)) + 1).toString();
  }

  get value() {
    let optionContain = this.shadowRoot.querySelector(".options-container");
    let options = optionContain.querySelectorAll('.option');
    let returnValue = "";
    for (let i = 0; i < options.length; i++) {
      const element = options[i];
      if (element.classList.length == 2) {
        let optionData = JSON.parse(this.getAttribute("option-data"));
        let keyObject = JSON.parse(this.getAttribute('option-keys'));
        for (let j = 0; j < optionData.length; j++) {
          const ele = optionData[j];
          if (ele[keyObject.value] == element.querySelector('input').value) {
            returnValue = ele;
            break;
          }
        }
      }
    }
    return returnValue;
  }

  set value(newValue) {
    let options = this.shadowRoot.querySelector('.options-container').querySelectorAll('.option');
    this.shadowRoot.querySelector('.showSelected').innerHTML = "Select";
    options.forEach(element => {
      element.classList.remove('selected');
      if (newValue == element.querySelector('input').value) {
        element.classList.add('selected');
        this.shadowRoot.querySelector('.showSelected').innerHTML = element.querySelector("label").innerHTML;
      }
    });
  }

  disconnectedCallback() { }

  addingOption(optionData) {
    let optionsContainer = this.shadowRoot.querySelector(".options-container");
    optionsContainer.innerHTML = null;
    let keyObject = JSON.parse(this.getAttribute('option-keys'));
    for (let od of optionData) {
      let div = document.createElement("div");
      div.classList.add("option");
      let input = document.createElement("input");
      Object.assign(input, {
        type: "radio",
        className: "radio",
        name: "category",
        value: `${od[keyObject.value]}`,
        id: `${od[keyObject.value]}`
      })

      let label = document.createElement("label");
      label.setAttribute("for", `${od[keyObject.value]}`);
      label.textContent = `${od[keyObject.label]}`
      div.append(input, label);
      optionsContainer.appendChild(div);
    }

    if (this.hasAttribute('selected')) {
      let options = this.shadowRoot.querySelector('.options-container').querySelectorAll('.option')
      this.shadowRoot.querySelector('.showSelected').innerHTML = "Select";
      options.forEach(element => {
        element.classList.remove('selected');
        if (this.getAttribute('selected') == element.querySelector('input').value) {
          element.classList.add('selected');
          this.shadowRoot.querySelector('.showSelected').innerHTML = element.querySelector("label").innerHTML;
        }
      });
    }


    let optionsList = this.shadowRoot.querySelectorAll(".option");
    optionsList.forEach((ele, index) => {
      ele.addEventListener("click", (event) => {

        this.shadowRoot.querySelector('.showSelected').innerHTML = ele.querySelector("label").innerHTML;

        let selectListDiv = this.shadowRoot.querySelector(".selectListDiv");
        selectListDiv.classList.remove("active");

        let optionContain = this.shadowRoot.querySelector(".options-container");
        // optionContain.classList.remove("active");

        let option = optionContain.querySelectorAll('.option');
        option.forEach(element => {
          element.classList.remove("selected");
        });
        option[index].classList.add("selected");

        let callbackFn = this.getAttribute("callback");
        if (callbackFn) {
          var checkEvent = new CustomEvent("tdropdown", {
            bubbles: true,
            detail: {
              version: "1.0",
              method: callbackFn, //getCallback(2)    
              params: '', //getCallback()   getCallback(123456)
              data: optionData[index]
            }
          });

          if (this.dispatchEvent(checkEvent)) {
            // Do default operation here.
            // console.log('Performing default operation');
          }
        }

      });
    });

  }

  static get observedAttributes() {
    return ['theme', 'option-data', 'selected'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("dropdown attributeChangedCallback -> ", name, oldValue, newValue);
    if (this.shadowRoot) {
      if (name && newValue) {
        switch (name) {
          case 'option-data':
            let optionData = newValue == '' ? [] : JSON.parse(newValue);
            if (this.hasAttribute('option-keys')) {
              this.addingOption(optionData);
            }
            break;
          case "selected":
            let options = this.shadowRoot.querySelector('.options-container').querySelectorAll('.option')
            this.shadowRoot.querySelector('.showSelected').innerHTML = "Select";
            options.forEach(element => {
              element.classList.remove('selected');
              if (newValue == element.querySelector('input').value) {
                element.classList.add('selected');
                this.shadowRoot.querySelector('.showSelected').innerHTML = element.querySelector("label").innerHTML;
              }
            });
            break;
          case 'theme':
            if (this.shadowRoot) {
              var wrap = this.shadowRoot.querySelector('.select-box');
              if (wrap) {
                if (oldValue) {
                  wrap.classList.remove(oldValue);
                }
                // console.log("newValue -> ", newValue);
                wrap.classList.add(newValue);
              }
            }
            break;
          default:
            break;
        }
      }
    }
  }

  adoptedCallback() {
  }

  connectedCallback() {
    setTimeout(() => {
      // console.log("this dropdown -> ", this);
      // if (this.hasAttribute('selected')) {
      //   let options = this.shadowRoot.querySelector('.options-container').querySelectorAll('.option')
      //   this.shadowRoot.querySelector('.showSelected').innerHTML = "Select";
      //   options.forEach(element => {
      //     element.classList.remove('selected');
      //     if (this.getAttribute('selected') == element.querySelector('input').value) {
      //       element.classList.add('selected');
      //       this.shadowRoot.querySelector('.showSelected').innerHTML = element.querySelector("label").innerHTML;
      //     }
      //   });
      // }


      let optionData = this.hasAttribute("option-data") ? this.getAttribute("option-data") == '' ? [] : JSON.parse(this.getAttribute("option-data")) : [];
      if (this.hasAttribute('option-keys')) {
        this.addingOption(optionData);
      }

      // console.log("connectedCallback->", this);
      let searchEnable = this.hasAttribute("search") ? (this.getAttribute("search") == 'true') ? true : false : false;
      this.searchinput = this.shadowRoot.querySelector('.search-input-box');
      if (searchEnable) {
        this.searchinput.classList.remove('hide');
      } else {
        if (!this.searchinput.classList.contains('hide')) {
          this.searchinput.classList.add('hide');
        }
      }

      let searchBox = this.shadowRoot.querySelector(".search-input-box");

      // this.showSelected = this.shadowRoot.querySelector('.showSelected');
      // this.showSelected.addEventListener("click", (event) => {

      //   this.selectListDiv = this.shadowRoot.querySelector(".selectListDiv");
      //   console.log("showSelected -> ", this.showSelected, this.selectListDiv);
      //   // selectListDiv.classList.toggle("active");
      //   this.searchBox.value = "";
      //   if ( this.selectListDiv.classList.contains("active")) {
      //     this.selectListDiv.classList.remove("active");
      //     this.searchBox.focus();
      //   } else {
      //     this.selectListDiv.classList.add("active");
      //   }
      // });

      searchBox.addEventListener("keyup", function (e) {
        let searchTerm = searchBox.value;
        let optionDiv = this.parentElement.parentElement.querySelectorAll(".option");
        optionDiv.forEach(option => {
          let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
          if (label.indexOf(searchTerm) != -1) {
            option.style.display = "block";
          } else {
            option.style.display = "none";
          }
        });
      });
    }, 0);

  }

}
export default DropDown;