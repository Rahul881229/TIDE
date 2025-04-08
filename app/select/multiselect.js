import styles from './multiselect.scss';

let callbackFn = "";
var dropdownSelect;
var selectedItemList = [];
var selectedItemListIds = [];
var selectedOption;
let selectedFinalData = [];
var appendText = document.createElement('span');

class MultiSelect extends HTMLElement {
  constructor() {
    super();
    setTimeout(() => {
      this.callbackFn = this.getAttribute("callback");
      let data = this.hasAttribute("data") ? this.getAttribute("data") : '[]';
      let selecteddatafromUI = this.hasAttribute("selected") ? this.getAttribute("selected") : "";
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
      var search = this.hasAttribute("searchable") ? this.getAttribute("searchable") : "false";
      const style = (this.hasAttribute("style") ? `style="${this.getAttribute("style")}"` : '');
      let placeholder = (this.hasAttribute("placeholder") ? this.getAttribute("placeholder") : 'Please Select');
      let lang = this.hasAttribute("lang") ? (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '') : '';
      var JSONPARSE = JSON.parse(data);
      var optionString = "";
      if (JSONPARSE.length > 0) {
        JSONPARSE.forEach(element => {
          optionString += `<div id="${element.value}" class="select-pure__option select-pure__optionList" data-value=${element.value} > 
                          <input type="checkbox" id=${element.id} value=${element.value} /> 
                          <label for="${element.value}"> &nbsp; ${element.name}</label>
                      </div>`;
        });
      }

      const template = document.createElement('template');
      template.innerHTML = `
              <style>${styles.toString()}</style>
              <div class="multiselect-wrapper " ${style} ${lang}>
                  <span class="autocomplete-select ${theme}" >
                      <div class="select-pure__select select-pure__select--multiple">
                          <div class="displayMask">Test</div>
                          <span class="select-pure__label"></span>
                          <div class="select-pure__options" style="top: 52px;">
                          <div class="search-box" style="${search == 'true' ? 'display:block;' : 'display:none;'}">
                              <input class="select-pure__autocomplete" type="text" placeholder="Search here">
                              </div>
                              ${optionString}
                          </div>
                          <span class="select-pure__placeholder"> ${placeholder} </span>
                      </div>
                  </span>
              </div>`;

      this.appendChild(template.content.cloneNode(true));


      if (selecteddatafromUI) {
        var selecteddata = JSON.parse(selecteddatafromUI);
        for (let index = 0; index < selecteddata.length; index++) {
          const selectedelement = selecteddata[index];
          var s = document.createElement('span');
          s.innerText = selectedelement.name;
          s.setAttribute('class', 'select-pure__selected-label');
          var i = document.createElement('i');
          i.setAttribute('id', selectedelement.value);
          i.innerHTML = '&#10006';
          s.appendChild(i);
          this.querySelectorAll('.select-pure__placeholder')[0].classList.add("select-pure__placeholder--hidden");
          this.querySelectorAll('.select-pure__label')[0].appendChild(s);
          this.querySelectorAll('#' + selectedelement.value)[1].checked = true;
        }
      }
      dropdownSelect = document.querySelectorAll('.select-pure__select')[0];
    }, 0);


  }

  disconnectedCallback() {

  }

  static get observedAttributes() {
    return ['theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
  }

  adoptedCallback() {
  }

  connectedCallback() {
    setTimeout(() => {
      let selected = document.querySelector(".select-pure__select");
      let optionsList = document.querySelectorAll(".select-pure__option");
      let optionsContainer = document.querySelectorAll(".select-pure__options");
      let searchBox = document.querySelector('.search-box input');
      var options = this.querySelectorAll('.select-pure__optionList');
      options.forEach(element => {
        element.addEventListener('click', this.addOption);
      });
      searchBox.addEventListener("keyup", function (e) {
        filterList(e.target.value);
      });

      const filterList = searchTerm => {
        searchTerm = searchTerm.toLowerCase();
        optionsList.forEach(option => {
          let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
          if (label.indexOf(searchTerm) != -1) {
            option.style.display = "block";
          } else {
            option.style.display = "none";
          }
        });
      };

      selected.addEventListener("click", (event) => {
        if (event.target.className == "select-pure__select select-pure__select--multiple") {
          optionsContainer[0].classList.toggle("active");
        }

        searchBox.value = "";
        filterList("");
      });
    }, 0);
  }

  addOption(event) {
    setTimeout(() => {
      let SelecteddataValue = this.getAttribute("data-value");
      let selectedItemIds = this.getAttribute("id");
      let idAddSelectValue = false;
      selectedOption = this.querySelectorAll('.select-pure__optionList');

      if (!selectedItemList.includes(SelecteddataValue)) {
        selectedItemList.push(SelecteddataValue);
      }

      selectedItemListIds.push(selectedItemIds);
      if (selectedOption.length > 0) {
        selectedOption.forEach(element => {
          let dataValue = element.getAttribute("data-value");
          idAddSelectValue = true;
          selectedFinalData.push(dataValue);
        });


      } else {
        idAddSelectValue = true;
      }

      if (idAddSelectValue) {
        var checked = document.querySelectorAll('#' + selectedItemIds)[0].getElementsByTagName('input')[0].checked;
        if (checked) {
          removeOption(event);
          document.querySelectorAll('#' + selectedItemIds)[0].getElementsByTagName('input')[0].checked = false;
        }
        else {
          document.querySelectorAll('#' + selectedItemIds)[0].getElementsByTagName('input')[0].checked = true;
        }

        function removeOption(event) {
          var children = document.querySelectorAll('.select-pure__options')[0].children;
          for (let index = 1; index < children.length; index++) {
            const element = children[index];
            if (event.path[1].getAttribute("data-value") == element.getAttribute("data-value")) {
              const index = selectedItemList.indexOf(event.path[1].getAttribute("data-value"));
              if (index > -1) {
                selectedItemList.splice(index, 1);
              }
            }
          }
          var optionList = document.querySelectorAll('.select-pure__optionList');
          for (let index = 0; index < optionList.length; index++) {
            const element1 = optionList[index];
            let dataValue = element1.getAttribute("data-value");
            if (event.path[0].getAttribute("data-value") == dataValue) {
              element1.classList.remove("select-pure__option--selected");
              this.querySelectorAll('#' + dataValue)[0].checked = false;
            }
          }

          selectedFinalData = selectedFinalData.filter(function (value1, index, arr) {
            return value1 != event.path[0].getAttribute("data-value");
          });

          if (callbackFn) {
            var checkEvent = new CustomEvent("tmultiselect", {
              bubbles: true,
              detail: {
                version: "1.0",
                method: callbackFn,
                params: '',
                data: {
                  value: selectedFinalData[1]
                }
              }
            });

            if (this.dispatchEvent(checkEvent)) {
              // Do default operation here.
            } else {
            }
          }

          if (selectedFinalData.length == 0) {
            var placeholder1 = document.querySelectorAll('.select-pure__placeholder')[0];
            placeholder1.classList.remove("select-pure__placeholder--hidden");
          }

        }

        appendText.innerText = selectedItemList.length + " item selected";
        appendText.setAttribute('class', 'select-pure__selected-label');
        var ie = document.createElement('i');
        // i.setAttribute('class', 'fa fa-times');
        //  ie.setAttribute('id', SelecteddataValue);
        ie.setAttribute('data-value', SelecteddataValue);
        ie.innerHTML = '&#10006';

        appendText.appendChild(ie);
        var placeholder1 = document.querySelectorAll('.select-pure__placeholder')[0];
        placeholder1.classList.add("select-pure__placeholder--hidden");
        document.querySelectorAll('.select-pure__label')[0].appendChild(appendText);
        document.querySelectorAll('.select-pure__selected-label');

        var option = document.querySelectorAll('.select-pure__optionList');
        option.forEach(element => {
          let dataValue = element.getAttribute("data-value");
        });

        if (callbackFn) {
          var checkEvent = new CustomEvent("tmultiselect", {
            bubbles: true,
            detail: {
              version: "1.0",
              method: callbackFn,
              params: '',
              data: {
                value: selectedFinalData
              }
            }
          });

          if (this.dispatchEvent(checkEvent)) {
            // Do default operation here.
          } else {
          }
        }
      }
    }, 0);
  }
}
// window.customElements.define("t-multiselect", MultiSelect);
export default MultiSelect;