class Header extends HTMLElement {

  constructor() {
    super();
    // console.log("header this -> ", this);
    setTimeout(() => {

      let logo = (this.getAttribute('logo') ? this.getAttribute('logo') : '');
      let clientLogo = this.getAttribute('client-logo') || ''; // New attribute for client logo
      // var logo = 'https://www.trinitymobility.com/assets/images/03-512x128-59.png';
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
      let user = (this.hasAttribute('user') ? `<p>${this.getAttribute('user')}</p>` : '');
      let appname = (this.hasAttribute('title') ? this.getAttribute('title') : '');
      let callbackFn = this.getAttribute('callback');

      /* console.log("header t-dropdown -> ", this.getElementsByTagName('t-dropdown'));
      let tdropdown = this.getElementsByTagName('t-dropdown');
      let dropdowndata = "";
      console.log("tdropdown data -> ", tdropdown);
      if (tdropdown.length > 0) {
        var btnName = tdropdown[0].getAttribute('name');
        var data = JSON.parse(tdropdown[0].getAttribute("data"));
        var icon = tdropdown[0].getAttribute("icon");
        dropdowndata = `<t-dropdown headerDropdown='true' name='${btnName}' icon=${icon}
            data=${JSON.stringify(data)}>
        </t-dropdown>`;
      } */
      // console.log("dropdowndata -> ", dropdowndata);
      /* console.log("header t-link -> ", this.getElementsByTagName('t-link'));
      let tlink = this.getElementsByTagName('t-link');
      let tlinkData = "";
      if (tlink.length > 0) {
        var name = tlink[0].getAttribute("name");
        var url = tlink[0].getAttribute("url");
        tlinkData = `<t-link name='${name}' url='${url}'></t-link>`;
      } */

      // console.log(user, title, logo);
      // <t-header-logo src=${logo}></t-header-logo>
      const template = document.createElement('template');
      template.innerHTML = `
      <style>
      .t-header.dark {
        background-color: #404040 !important;
      }
      .dark {
        .application-holder .application-title,
        .application-action p {
          color:#ffffff !important;
        }
      }
      
      .t-header.light{
        background-color:  #fff !important;
      }
      
      .light {
        .application-holder .application-title,
        .application-action p {
          color:#000000 !important;
        }
      }
      
      .t-header {
        z-index:2;
        width: 100%;
        height: 4.5vh;
        /* background: #404040; */
        background-color:  #404040;
        /*  padding: 0.5vh 0.5vw; */
        display: flex;
        font-family: "trinity", "Open Sans";
        align-items: center;
        white-space: nowrap;
        flex-direction: row;
        border-bottom: 1px solid hsla(0,0%,54.9%,.4);
      }
      .t-header .application-holder {
        width: 50%;
        display: flex;
        padding-left: 10px;
          align-items: center;
      }
      img {
        height: 3.2vh;
        padding-top: 3px;

      }
      
      .t-header .application-holder .application-title {
        font-size: 3.5vh;
        color: white;
        font-weight: bolder;
        padding: 0 0 0 10px;
        cursor: none;
      }
      
      .t-header .application-action {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
      }
      .t-header .application-action p {
        margin: 0;
        padding: 0 5px;
        color: #ffffff;
        font-size: 2vh;
        font-weight: bold;
      }
      </style>
      <div class="t-header ${theme}">
          <div class="application-holder">
            ${clientLogo ? `<img class="clientlogo" src="${clientLogo}" alt="Client Logo" />` : ''}
            <img class="applogo" src="${logo}" alt="LOGO"/>
<div class="application-title">
  ${appname ? `- ${appname}` : ''}
</div>
          </div>
          <div class="application-action">
            <slot name='actions'></slot>
          </div>
      </div>`;

      // Add a shadow DOM
      const shadowDOM = this.attachShadow({
        mode: 'open'
      });
      // render
      shadowDOM.appendChild(template.content.cloneNode(true));

      var headerEle = this.shadowRoot.querySelector('.t-header');

      var headerEleChild = [...headerEle.children];
      if (callbackFn) {
        headerEleChild.forEach(ele => {
          ele.firstElementChild.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent("theader", {
              bubbles: true,
              detail: {
                version: "2.2.21",
                method: callbackFn,
                params: '',
                data: {
                  value: ele.firstElementChild.innerHTML || ele.firstElementChild.src
                }
              }
            }));

          });
        })
      }
    }, 0);

  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  static get observedAttributes() {
    return ['theme', 'logo', 'title','client-logo'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("attributeChangedCallback -> ", name, oldValue, newValue);
    if (this.shadowRoot) {
      if (name == 'theme' && newValue) {
        let tag = this.shadowRoot.querySelectorAll('.t-header')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      } else if (name == 'logo' && newValue) {
        let tag = this.shadowRoot.querySelectorAll('.t-header')[0].querySelector('.applogo');
        // console.log(tag);
        tag.src = newValue;
      } else if (name == 'title' && newValue) {
        let tag = this.shadowRoot.querySelectorAll('.t-header')[0].querySelector('.application-title');
        // console.log(tag);
        tag.textContent = newValue;
      }
      else if (name === 'client-logo' && newValue) { // Handle client logo updates
        let tag = this.shadowRoot.querySelector('.clientlogo');
        if (tag) {
          tag.src = newValue; // Update existing logo
        } else { 
          // If it
        }
      }
    }
  }

  adoptedCallback() {
    // console.log("adoptedCallback:::Html Element", this.getAttribute('datetime'));
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  connectedCallback() {

  }
}
export default Header;
// window.customElements.define('t-header', Header);