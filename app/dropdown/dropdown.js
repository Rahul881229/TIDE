import styles from './dropdown.scss';
class DropDown extends HTMLElement {
  selectText = 'Select';
  placeholderInput = 'Search';
  dropheight = '15vh';
  noData = "No Data";
  optionData = [];
  // Add this property to your class
  focusedOptionIndex = 0;
  objectkey = "";
  #internals = this.attachInternals();
  static formAssociated = true;

  static observedAttributes = ['placeholder', 'position', 'option-data', 'search', 'theme', 'lang', 'selected', 'disabled', 'dropheight', 'value'];

  get form() { return this.#internals.form; }
  get name() { return this.getAttribute('name') };
  get type() { return this.localName; }

  get validity() { return this.#internals.validity; }
  get validationMessage() { return this.#internals.validationMessage; }
  get willValidate() { return this.#internals.willValidate; }

  constructor() {
    super();

    let lang = '';
    let ar = '';
    if (this.hasAttribute("lang")) {
      lang = this.getAttribute("lang") == 'ar' ? (ar = 'lang', 'dir="rtl" lang="ar"') : '';
    }

    if (this.hasAttribute("dropheight")) {
      this.dropheight = this.getAttribute("dropheight");
    }

    let inputWidth = '';
    if (this.hasAttribute("sm") || this.hasAttribute("small")) {
      inputWidth = 'sm';
    } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
      inputWidth = 'lg';
    }

    const template = document.createElement('template');
    template.innerHTML = `
    <style>${styles.toString()}</style>
<div class="dropdown lg" style="width:${this.hasAttribute('customwidth') ? this.getAttribute('customwidth') : ''} !important; min-width:${this.getAttribute("customwidth")}" ${lang}>
      <div class="select">
        <span class="selected">${this.selectText}</span>
        <div class="caret"></div>
      </div>
      <div class="menu">
      <img class="search-icon-bottom" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAF3SURBVHjapNS/S5VxFMfx17UbSiGVgkguLaKN5VAKoVNOrYIYDf0FouLQL3CozTs09Qc0yB1b2nIQESxChwIHBaGW5FKCDv7ox3IuPNj9PvdRP8s5nO+X9/N5znPOU6rVajLqwSQeojtqe6jiNdY1USkDnMDbzNkqfuM2WqP2FK/ygC0RxzKwx7iIOxhCGx7gB15irpnDDtRt9mMjcfdynPXgFtZSDp9F/igHBvsYjfxNnsN9lDN9aqavuImr2G3k8BI+K673EXvzPsrBKYCHES+kgH9iNIpqJOJWCriAdgwXgHXiLjaxkwI+j7wa/czTOxxhPG+wt/AEXTE2Qw3u9WE5zn7hY5HVm8OLyL9gCccYwGDUf+Ja7PRE7Pl2Cgj3YtDvn3jwJ8zGeC3GpsBfzKCSAtZ1BTeiJd9jj+u6jm8oZWrTdWg50YrdnF/V0QkYzEestDi9dsKRBtCp1CsX0VTG2X+rdxZVGjj9UHY+VTJ/8hWM/RsAM4VbrfI/eqUAAAAASUVORK5CYII=">
        <input class="search-input-box" type="text" placeholder="${this.placeholderInput}" />
        <ul style="max-height:${this.dropheight}"> 
        </ul>
      </div>
    </div>
    `;


    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));



    const dropdown = this.shadowRoot.querySelector('.dropdown');
    const menu = dropdown.querySelector('.menu');
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');

    dropdown.tabindex = 0;
    // menu.classList.add('custom-tooltip-style'); // Add this line

    select.addEventListener('click', () => {
      let checkDisabled = (/true/).test(this.getAttribute('disabled'));
      if (!checkDisabled) {
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
      }
    });

    document.addEventListener('click', (event) => {
      event.stopPropagation();
      if (event.target !== this) {
        select.classList.remove('select-clicked');
        caret.classList.remove('caret-rotate');
        menu.classList.remove('menu-open');
      }
    });


    const searchBox = dropdown.querySelector(".search-input-box");
    searchBox.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          this.navigateOptions("next");
          break;
        case "ArrowUp":
          event.preventDefault();
          this.navigateOptions("prev");
          break;
        case "Enter":
          event.preventDefault();
          this.selectOption();
          break;
        default:
          break;
      }
    });


  }

  get value() {
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    const options = dropdown.querySelectorAll('.menu li');
    let keyObject = JSON.parse(this.getAttribute('option-keys'));
    let returnValue = "";
    for (const element of options) {
      if (element.classList.contains('active')) {
        for (const data of this.optionData) {
          if (element.getAttribute('value') == data[keyObject.value]) {
            returnValue = data;
            break;
          }
        }
        break;
      }
    }
    return returnValue;
  }

  set value(newValue) {
    this.applySelectedValue(newValue);
  }

  navigateOptions(direction) {
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    const options = dropdown.querySelectorAll('.menu li');
    const visibleOptions = Array.from(options).filter(option => option.style.display !== 'none');

    if (visibleOptions.length === 0) return;

    if (direction === 'next') {
      this.focusedOptionIndex = (this.focusedOptionIndex + 1) % visibleOptions.length;
    } else if (direction === 'prev') {
      this.focusedOptionIndex = (this.focusedOptionIndex - 1 + visibleOptions.length) % visibleOptions.length;
    }

    // Remove focus from all options
    options.forEach((option) => option.classList.remove('focused'));
    // Add focus to the currently focused option
    visibleOptions[this.focusedOptionIndex].classList.add('focused');
  }

  selectOption() {
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    const options = dropdown.querySelectorAll('.menu li');
    const visibleOptions = Array.from(options).filter(option => option.style.display !== 'none');

    if (visibleOptions.length === 0 || this.focusedOptionIndex < 0 || this.focusedOptionIndex >= visibleOptions.length) return;

    const selectedOption = visibleOptions[this.focusedOptionIndex];
    selectedOption.click(); // Trigger a click event to select the option
  }


  applySelectedValue(newValue) {
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');
    selected.innerText = this.selectText;
    if (newValue) {
      for (const element of options) {
        element.classList.remove('active');
        if (newValue == element.getAttribute('value')) {
          element.classList.add('active');
          selected.innerText = element.innerText;
          break;
        }
      }
    } else {
      selected.innerText = this.selectText;
    }
  }

  disabledElement(newValue) {
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    const select = dropdown.querySelector('.select');
    newValue = (/true/).test(newValue);
    if (newValue) {
      select.classList.add('disabled');
    } else {
      select.classList.remove('disabled');
    }

  }

  addingOption(optionData) {
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    const menuUl = dropdown.querySelector('.menu ul');
    const selected = dropdown.querySelector('.selected');

    menuUl.innerHTML = null;
    let keyObject = JSON.parse(this.getAttribute('option-keys'));
    this.objectkey = keyObject['value']
    if (optionData.length > 0) {
      optionData.forEach(element => {
        let elementli = document.createElement("li");
        elementli.setAttribute('value', element[keyObject.value]);
        elementli.innerText = element[keyObject.label];
        elementli.setAttribute('title', element[keyObject.label]);
        if (element[keyObject.value] == this.getAttribute('selected')) {
          elementli.setAttribute('class', 'active');
          selected.innerText = element[keyObject.label];
        }
        menuUl.appendChild(elementli);
      });
    } else {
      let elementDiv = document.createElement("div");
      elementDiv.className = 'noData';
      elementDiv.innerHTML = this.noData;
      menuUl.appendChild(elementDiv);
    }


    const menu = dropdown.querySelector('.menu');

    if (this.hasAttribute("accordion")) {
      // menu.classList.add('accordion');
      // Unset position style
      menu.style.position = 'unset !important';
    }
    
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const options = dropdown.querySelectorAll('.menu li');
    const searchBox = dropdown.querySelector(".search-input-box");

    if (options.length > 0) {
      options.forEach(option => {
        option.addEventListener('click', () => {
          let status = true;
          if (option.classList.contains('active')) {
            if (this.hasAttribute('deselect')) {
              if (this.getAttribute('deselect') === 'false') {
                selected.innerText = option.innerText; // Fixed here
                status = false;
                select.classList.remove('select-clicked');
                option.classList.add('active');
                caret.classList.remove('caret-rotate');
                menu.classList.remove('menu-open');
                console.log('You cannot deselect this option' + `${this.getAttribute('deselect')}`); // Fixed here
                
                // alert('You cannot deselect this option'+`${this.getAttribute('deselect')}`); 
                return;
              }
            }
    
            selected.innerText = this.selectText; // Ensure this is defined elsewhere
            status = false;
          } else {
            selected.innerText = option.innerText;
            options.forEach(option1 => {
              option1.classList.remove('active');
            });
          }
          select.classList.remove('select-clicked');
          caret.classList.remove('caret-rotate');
          menu.classList.remove('menu-open');
          option.classList.toggle('active');
    
          let value = option.getAttribute('value');
          for (const element of optionData) {
            if (value == element[keyObject.value]) { // Ensure keyObject is valid
              this.sendDataCallback(element, status, "tdropdown");
              break;
            }
          }
        });
      });
    }
    

    // searchBox.addEventListener("keyup", () => {
    //   let searchvalue = searchBox.value;
    //   if (options.length > 0) {
    //     options.forEach(option => {
    //       option.style.display = 'none';
    //       if (((option.innerText).toUpperCase()).includes(searchvalue.toUpperCase())) {
    //         option.style.display = 'block';
    //       }
    //     })
    //     this.sendDataCallback(searchvalue, true, 'search')
    //   }
    // });

    // Inside the connectedCallback method or constructor, after adding the event listener for input:

    searchBox.addEventListener("input", () => {
      let searchvalue = searchBox.value;
      const searchIcon = dropdown.querySelector(".search-icon");

      if (options.length > 0) {
        options.forEach(option => {
          option.style.display = 'none';
          if (((option.innerText).toUpperCase()).includes(searchvalue.toUpperCase())) {
            option.style.display = 'block';
          }
        });

        this.sendDataCallback(searchvalue, true, 'search');

        // Check if the search box is not empty, then hide the search icon
        if (searchvalue.trim() !== '') {
          searchIcon.style.display = 'none';
        } else {
          searchIcon.style.display = 'block';
        }
      }
    });
  }

  sendDataCallback(data, select, eventType) {
    switch (eventType) {
      case "tdropdown":
        this.dispatchEvent(new CustomEvent("tdropdown", {
          bubbles: true,
          detail: {
            version: "2.2.21",
            params: '',
            data: data,
            select: select,
            key: this.objectkey
          }
        }));
        this.dispatchEvent(new CustomEvent("change", {
          bubbles: true,
          detail: {
            version: "2.2.21",
            params: '',
            data: data,
            select: select,
            key: this.objectkey
          }
        }))
        break;
      case "search":
        this.dispatchEvent(new CustomEvent("search", {
          bubbles: true,
          detail: {
            version: "2.2.21",
            params: '',
            data: data,
            select: select,
            key: this.objectkey
          }
        }))
        break;
      default:
        break;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      switch (name) {
        case 'position':
          const menu = this.shadowRoot.querySelector('.menu');
          const searchBox = menu.querySelector('.search-input-box');
          
          if (!newValue || (newValue !== 'top' && newValue !== 'bottom')) {
            newValue = 'bottom'; // Set a default position here
          }
          menu.classList.toggle('menu-top', newValue === 'top');
          menu.classList.toggle('menu-bottom', newValue === 'bottom');

          // searchIcon.classList.toggle('search-icon-top', newValue === 'top');
          // searchIcon.classList.toggle('search-icon-bottom', newValue === 'bottom');

          menu.classList.toggle('menu-top', newValue === 'top');
          menu.classList.toggle('menu-bottom', newValue === 'bottom');

          if (searchBox) {
            if (newValue === 'top') {
              menu.removeChild(searchBox);
              menu.appendChild(searchBox);

            } else if (newValue === 'bottom') {

              menu.removeChild(searchBox);
              menu.insertBefore(searchBox, menu.firstChild);
            }
          }
          break;
        case 'option-data':
          if (newValue) {
            this.optionData = ((newValue == '' || newValue == null) ? [] : JSON.parse(newValue));
            if (this.hasAttribute('option-keys')) {
              this.addingOption(this.optionData);
            }
          }
          break;
        case 'dropheight':
          let list = this.shadowRoot.querySelector('.dropdown .menu ul');
          list.style.maxHeight = newValue;
          break;
        case 'value':
          if (newValue) {
            this.applySelectedValue(newValue);
          }
          break;
        case 'selected':
          if (newValue) {
            this.applySelectedValue(newValue);
          }
          break;
        case 'disabled':
          this.disabledElement(newValue);
          break;
        case 'theme':
          if (newValue) {
            var wrap = this.shadowRoot.querySelector('.dropdown');
            if (wrap) {
              if (oldValue) wrap.classList.remove(oldValue);
              wrap.classList.add(newValue);
            }
          }
          break;
        case 'search':
          if (name === 'search') {
            const searchBox = this.shadowRoot.querySelector(".search-input-box");
            if (newValue === 'true') {
              searchBox.style.display = 'block';
            } else {
              searchBox.style.display = 'none';
            }
            const searchIcon = this.shadowRoot.querySelector(".search-icon");
            if(searchIcon!=null){
              if (newValue === 'true') {
                searchIcon.style.display = 'block'; // Show the search icon
              } else {
                searchIcon.style.display = 'none'; // Hide the search icon
              }
            }

            break;
          }
          break;
        case 'placeholder':
          if (newValue) {
            this.selectText = newValue;
            this.shadowRoot.querySelector('.selected').innerText = this.selectText;
          }
          break;
        case 'lang':
          if (newValue) {
            const dropdown = this.shadowRoot.querySelector('.dropdown');
            const selected = dropdown.querySelector('.selected');
            const searchBox = dropdown.querySelector(".search-input-box");
            const noData = dropdown.querySelector('.noData');
            if (newValue == 'ar') {
              dropdown.setAttribute('dir', 'rtl');
              dropdown.setAttribute('lang', newValue);
              this.selectText = '?????';
              this.placeholderInput = '????';
              if ((selected.innerText).includes('Select')) {
                selected.innerText = this.selectText;
              }
              this.noData = "?????? ??????";
            } else {
              dropdown.removeAttribute('dir');
              dropdown.setAttribute('lang', newValue);
              this.selectText = 'Select';
              this.placeholderInput = 'Search';
              if ((selected.innerText).includes('?????')) {
                selected.innerText = this.selectText;
              }
              this.noData = 'No Data';
            }
            searchBox.setAttribute('placeholder', this.placeholderInput);
            if (noData) {
              noData.innerText = this.noData;
            }
          }
          break;
        default:
          break;
      }
    }
  }

  // connectedCallback() {
  //   let searchEnable = (this.getAttribute("search") == 'true') ? true : false;
  //   const searchBox = this.shadowRoot.querySelector("#searchInput");
  //   // searchBox.style.display = (searchEnable ? 'block' : 'none');

  // }
  connectedCallback() {
    const searchEnable = this.hasAttribute("search") && this.getAttribute("search") === 'true';
    const searchBox = this.shadowRoot.querySelector(".search-input-box");
    const searchicon=this.shadowRoot.querySelector(".search-icon-bottom")

    if (!searchEnable) {
      searchicon.style.display='none';
      searchBox.style.display = 'none'; // Hide the search box
      searchBox.style.paddingLeft = '0px !important'; // No padding-left when the icon is hidden
      searchBox.style.padding = '0.4em 0.5em'; // Ensure pad
    } else {
      searchBox.style.display = 'block'; // Show the search box
      searchBox.style.paddingLeft = '24px'; 
    }

  

      searchBox.addEventListener('input', () => {
        if (searchBox.value.trim() === '') {
            // Show icon and adjust padding if input is empty
            searchicon.style.display = 'block';
            searchBox.style.paddingLeft = '24px'; // Padding for when the icon is visible
        } else {
          searchicon.style.display = 'none';
            searchBox.style.paddingLeft = '0px !important'; // No padding-left when the icon is hidden
            searchBox.style.padding = '0.4em 0.5em'; // Ensure padding-right
        }
    });
    

    let positionAttr = this.getAttribute('position');

    if (!positionAttr || (positionAttr !== 'top' && positionAttr !== 'bottom')) {
      positionAttr = 'bottom'; // Set a default position here
    }

    if (searchicon) {
      searchicon.classList.toggle('search-icon-top', positionAttr === 'top');
      searchicon.classList.toggle('search-icon-bottom', positionAttr === 'bottom');
    }
  }


}
// customElements.get('t-dropdown') || customElements.define('t-dropdown', DropDown);
export default DropDown;