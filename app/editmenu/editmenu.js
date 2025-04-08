import styles from './editmenu.scss';
import service, { editmenuService } from './editmenuservice';
// let editmenuOption = [];
// let checkEvent = null;
class Searchabledropdown extends HTMLElement {
  constructor() {
    super()
    setTimeout(() => {
      let lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
      // let callbackFn = this.getAttribute("callback");
      const template = document.createElement('template');
      template.innerHTML = `
      <style>${styles.toString()}</style>
      <div class= "select-wrap ${theme}"${lang}>
        <div class="select-box">
            <div class="options-container"></div> 
            <div class="selected">Select</div>
            <div class="search-box">
              <input type="text" placeholder="Search here" class="search-input-box"/>
            </div>
        </div>
      </div>`;

      const shadowDOM = this.attachShadow({
        mode: 'open'
      });
      shadowDOM.appendChild(template.content.cloneNode(true));

      // Getting, the Service..
      editmenuService(3, 5);

      //  the functionalities.
      // creating and apending the markup.
      let selected = this.shadowRoot.querySelector('.selected');
      let optionsContainer = this.shadowRoot.querySelector(".options-container");
      let searchBox = this.shadowRoot.querySelector(".search-box input");
      // let selectOptionHover = this.shadowRoot.querySelector(".select-box .option");

      // getting the option data.
      let data = this.hasAttribute("option-data") && this.getAttribute("option-data") ? this.getAttribute("option-data") : '[]';
      let optionData = JSON.parse(data);
      // console.log(optionData);
      this.editmenuOption = optionData;
      for (let i = 0; i < optionData.length; i++) {
        let div = document.createElement("div");
        div.classList.add("option");
        div.setAttribute("value", optionData[i].value);
        div.innerHTML = optionData[i].name;
        div.onclick = this.optionClick.bind(this);
        optionsContainer.appendChild(div);
      }


      // ondemand rendering the search functionalities.
      let searchable = (this.getAttribute("searchable") ? this.getAttribute("searchable") : "false");
      if (searchable === "true") {
        let searchBoxWrap = this.shadowRoot.querySelector('.search-box');
        searchBoxWrap.style.display = "block";
        optionsContainer.style.top = "67px";
      }

      // core functionalities
      selected.addEventListener("click", () => {
        optionsContainer.classList.toggle("active");
        searchBox.value = "";
        filterList("");
        if (optionsContainer.classList.contains("active")) {
          searchBox.focus();
        }
      });

      searchBox.addEventListener("keyup", function (e) {
        // console.log("searchBox.addEventListener -> ", e.target.value);
        filterList(e.target.value);
      });

      const filterList = searchTerm => {
        // console.log("filterList -> ", searchTerm);
        searchTerm = searchTerm.toLowerCase();
        let optionsList1 = this.shadowRoot.querySelectorAll(".option");
        // console.log(optionsList1);
        optionsList1.forEach(option => {
          // let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
          let label = option.innerText.toLowerCase();
          if (label.indexOf(searchTerm) != -1) {
            option.style.display = "block";
          } else {
            option.style.display = "none";
          }
        });
      };

    }, 0)
  }

  optionClick(e) {
    // console.log(e.path[0].getAttribute('value'));
    var checkEvent = new CustomEvent("tsearchdropdown", {
      bubbles: true,
      detail: {
        version: "1.0",
        method: this.getAttribute("callback"),
        params: '',
        data: e.path[0].getAttribute('value')
      }
    });

    this.dispatchEvent(checkEvent);
    this.shadowRoot.querySelector(".options-container").classList.remove("active");
    this.shadowRoot.querySelector('.selected').innerHTML = e.path[0].innerText;
  }

  static get observedAttributes() {
    return ['theme', 'option-data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'theme' && newValue) {
      if (this.shadowRoot) {
        let tag = this.shadowRoot.querySelectorAll('.select-wrap')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      }
    } else if (name == 'option-data' && newValue) {
      // console.log("newValue", newValue);
      let optionData = JSON.parse(newValue);
      this.editmenuOption = optionData;

      if (this.shadowRoot) {
        let optionsContainer = this.shadowRoot.querySelector(".options-container");
        optionsContainer.innerHTML = null;
        for (let i = 0; i < optionData.length; i++) {
          let div = document.createElement("div");
          div.classList.add("option");
          div.setAttribute("value", optionData[i].value);
          div.innerHTML = optionData[i].name;
          div.onclick = this.optionClick.bind(this);
          optionsContainer.appendChild(div);
        }
      }

    }
  }

}

export default Searchabledropdown;