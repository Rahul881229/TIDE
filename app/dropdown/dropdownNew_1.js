import styles from './dropdownNew.scss';
class DropDownNew extends HTMLElement {

  selectText = 'Select';
  placeholderInput = 'Search';

  constructor() {
    super();

    let lang = '';
    let ar = '';
    if (this.hasAttribute("lang")) {
      lang = this.getAttribute("lang") == 'ar' ? (ar = 'lang', 'dir="rtl" lang="ar"') : '';
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
      <div class="dropdown ${inputWidth}" ${lang}>
        <div class="select">
          <span class="selected">${this.selectText}</span>
          <div class="caret"></div>
        </div>
        <div class="menu">
          <input class="search-input-box" type="text" placeholder="${this.placeholderInput}"/>
          <ul> 
          </ul>
        </div>
      </div>
      `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    document.addEventListener('click', (event) => {
      event.stopPropagation();
      if (event.target !== this) {
        const dropdown = this.shadowRoot.querySelector('.dropdown');
        const menu = dropdown.querySelector('.menu');
        const select = dropdown.querySelector('.select');
        const caret = dropdown.querySelector('.caret');
        select.classList.remove('select-clicked');
        caret.classList.remove('caret-rotate');
        menu.classList.remove('menu-open');
      } else {
      }
    });

  }

  addingOption(optionData) {
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    const menuUl = dropdown.querySelector('.menu ul');
    const selected = dropdown.querySelector('.selected');

    menuUl.innerHTML = null;
    let keyObject = JSON.parse(this.getAttribute('option-keys'));
    optionData.forEach(element => {
      let elementli = document.createElement("li");
      elementli.setAttribute('value', element[keyObject.value]);
      elementli.innerText = element[keyObject.label];
      if (element[keyObject.value] == this.getAttribute('selected')) {
        elementli.setAttribute('class', 'active');
        selected.innerText = element[keyObject.label];
      }
      menuUl.appendChild(elementli);
    });

    const menu = dropdown.querySelector('.menu');
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const options = dropdown.querySelectorAll('.menu li');

    const searchBox = dropdown.querySelector(".search-input-box");

    select.addEventListener('click', () => {
      select.classList.toggle('select-clicked');
      caret.classList.toggle('caret-rotate');
      menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
      option.addEventListener('click', () => {
        let status = true;
        if (option.classList.contains('active')) {
          selected.innerText = this.selectText;
          status = false;
        } else {
          selected.innerText = option.innerText;
          options.forEach(option1 => {
            option1.classList.remove('active');
          })
        }
        select.classList.remove('select-clicked');
        caret.classList.remove('caret-rotate');
        menu.classList.remove('menu-open');
        option.classList.toggle('active');

        let value = option.getAttribute('value');
        for (const element of optionData) {
          if (value == element[keyObject.value]) {
            this.sendDataCallback(element, status);
            break;
          }
        }

      })
    })

    searchBox.addEventListener("keyup", () => {
      let searchvalue = searchBox.value;
      options.forEach(option => {
        option.style.display = 'none';
        if (((option.innerText).toUpperCase()).includes(searchvalue.toUpperCase())) {
          option.style.display = 'block';
        }
      })
    });

  }

  sendDataCallback(data, select) {
    if (this.hasAttribute("callback")) {
      let checkEvent = new CustomEvent("tdropdown", {
        bubbles: true,
        detail: {
          version: "1.0",
          method: this.getAttribute("callback"),
          params: '',
          data: data,
          select: select
        }
      });
      if (this.dispatchEvent(checkEvent)) {
      }
    }
  }

  static get observedAttributes() {
    return ['placeholder', 'option-data', 'theme', 'lang'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      if (newValue) {
        switch (name) {
          case 'option-data':
            let optionData = (newValue == '' ? [] : JSON.parse(newValue));
            if (this.hasAttribute('option-keys')) {
              this.addingOption(optionData);
            }
            break;
          case 'selected':

            break;
          case 'theme':
            var wrap = this.shadowRoot.querySelector('.dropdown');
            if (wrap) {
              if (oldValue) {
                wrap.classList.remove(oldValue);
              }
              wrap.classList.add(newValue);
            }
            break;
          case 'placeholder':
            this.placeholder = newValue;
            this.shadowRoot.querySelector('.selected').innerText = this.placeholder;
            break;
          case 'lang':
            const dropdown = this.shadowRoot.querySelector('.dropdown');
            const selected = dropdown.querySelector('.selected');
            const searchBox = dropdown.querySelector(".search-input-box");
            if (newValue == 'ar') {
              dropdown.setAttribute('dir', 'rtl');
              dropdown.setAttribute('lang', newValue);
              this.selectText = 'يختار';
              this.placeholderInput = 'يبحث';
              if (selected.innerText == 'Select') {
                selected.innerText = this.selectText;
              }
            } else {
              dropdown.removeAttribute('dir');
              dropdown.setAttribute('lang', newValue);
              this.selectText = 'Select';
              this.placeholderInput = 'Search';
              selected.innerText = this.selectText;
            }
            searchBox.setAttribute('placeholder', this.placeholderInput);
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
    let searchEnable = (this.getAttribute("search") == 'true') ? true : false;
    const searchBox = this.shadowRoot.querySelector(".menu .search-input-box");
    searchBox.style.display = (searchEnable ? 'block' : 'none');
  }

}
export default DropDownNew;