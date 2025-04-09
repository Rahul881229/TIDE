import styles from './listbox.scss';

class Listbox extends HTMLElement {
  constructor() {
    super();
    setTimeout(() => {
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : 'dark';
      let btnname = this.getAttribute("btn-text") ? this.getAttribute("btn-text") : "List Box"
      const template = document.createElement('template');
      var btnSize = '';
      if (this.hasAttribute("small") || this.hasAttribute("sm")) {
        btnSize = 'sm';
      } else if (this.hasAttribute("medium") || this.hasAttribute("md")) {
        btnSize = 'md';
      } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
        btnSize = 'lg';
      }

      template.innerHTML = `
           <style>${styles.toString()}</style>
           <div class="listbox-wrap ${theme}">
              <button class="listbox-btn ${btnSize}">${btnname}</button>
               <div class="listbox-item-wrap">
             </div>
           </div>`;
      this.attachShadow({
        mode: 'open'
      });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }, 0);
  }

  connectedCallback() {
    setTimeout(() => {
      if (this.shadowRoot) {
        var callbackFn = this.getAttribute("callback");
        let listBtn = this.shadowRoot.querySelector(".listbox-btn");
        let listBox = this.shadowRoot.querySelector('.listbox-item-wrap');
        const ul = document.createElement('ul');
        ul.setAttribute('class', 'listbox-list');
        let data = this.hasAttribute('data') ? this.getAttribute('data') : '[]';
        let listboxData = JSON.parse(data);

        listboxData.forEach(e => {
          let span = document.createElement('span');
          let img = document.createElement('img');
          Object.assign(img, {
            src: `${e.icon}`,
            height: '12',
            width: '12',
          })
          span.appendChild(img);
          let li = document.createElement('li');
          li.setAttribute('class', 'listbox-list-item');
          let text = document.createTextNode(e.name);
          li.append(span, text);
          ul.appendChild(li);
          listBox.appendChild(ul);
        })

        listBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          listBox.classList.toggle('listbox-item-wrap-show');
        });

        listBox.addEventListener('click', (e) => {
          e.stopPropagation();
        });

        document.body.addEventListener('click', () => {
          listBox.classList.remove("listbox-item-wrap-show");
        });

        let listBoxItem = this.shadowRoot.querySelectorAll(".listbox-list-item");
        let listBoxItemArr = [...listBoxItem];
        listBoxItemArr.forEach((ele, idx) => {
          ele.addEventListener('click', () => {
              const checkEvent = new CustomEvent("tlistbox", {
                  bubbles: true,
                  detail: {
                      version: "1.0",
                      method: callbackFn,  // if defined
                      params: '',
                      data: listboxData[idx]  // selected list item data
                  }
              });
              this.dispatchEvent(checkEvent);
              listBox.classList.remove('listbox-item-wrap-show');
          });
      });      
      }
    }, 0);
  }

  static get observedAttributes() {
    return ['theme', 'data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("name--", name + "\tnewvalue---", newValue);
    if (name == 'theme' && newValue) {
      if (this.shadowRoot) {
        let tag = this.shadowRoot.querySelectorAll('.listbox-wrap')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      }
    }
    if (name == 'data' && newValue) {
      if (this.shadowRoot) {
        var callbackFn = this.getAttribute("callback");
        let listBtn = this.shadowRoot.querySelector(".listbox-btn");
        let listBox = this.shadowRoot.querySelector('.listbox-item-wrap');
        var index = this.shadowRoot.querySelectorAll(".listbox-list-item").length - 1;
        const ul = this.shadowRoot.querySelector('.listbox-list');
        let data = newValue;
        let listboxData = JSON.parse(data);

        listboxData.forEach(e => {
          let span = document.createElement('span');
          let img = document.createElement('img');
          Object.assign(img, {
            src: `${e.icon}`,
            height: '12',
            width: '12',
          })
          span.appendChild(img);
          let li = document.createElement('li');
          li.setAttribute('class', 'listbox-list-item');
          let text = document.createTextNode(e.name);
          li.append(span, text);
          ul.appendChild(li);
        })

        listBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          listBox.classList.toggle('listbox-item-wrap-show');
          listBox.classList.toggle('listbox-item-wrap-show');
        });

        listBox.addEventListener('click', (e) => {
          e.stopPropagation();
        });

        document.body.addEventListener('click', () => {
          listBox.classList.remove("listbox-item-wrap-show");
        });

        let listBoxItem = this.shadowRoot.querySelectorAll(".listbox-list-item");
        let listBoxItemArr = [...listBoxItem];
        listBoxItemArr.forEach((ele, idx) => {
          ele.addEventListener('click', () => {
              const checkEvent = new CustomEvent("tlistbox", {
                  bubbles: true,
                  detail: {
                      version: "1.0",
                      method: callbackFn,  // if defined
                      params: '',
                      data: listboxData[idx]  // selected list item data
                  }
              });
              this.dispatchEvent(checkEvent);
              listBox.classList.remove('listbox-item-wrap-show');
          });
      });
      }
    }
  }
}
export default Listbox;