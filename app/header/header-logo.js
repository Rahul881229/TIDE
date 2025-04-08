import styles from '../css/header.scss';

class HeaderLogo extends HTMLElement {
  constructor() {
    super();
    console.log("HeaderLogo Loaded");
    // Add a shadow DOM.
    const shadowDOM = this.attachShadow({ mode: 'open' });
    
    const template = document.createElement('template');
    console.log("src -> ", this.getAttribute("src"));
    var src = this.getAttribute("src");
    // var src = 'https://www.trinitymobility.com/assets/images/03-512x128-59.png';
    console.log("src -> ", src);

    template.innerHTML = `
      <style>${styles.toString()}</style>
      <img src=${src} alt="LOGO"/>
    `;
    // render
    shadowDOM.appendChild(template.content.cloneNode(true));
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  static get observedAttributes() {
    return [ /* array of attribute names to monitor for changes */];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
  }

  adoptedCallback() {
    // console.log("adoptedCallback:::Html Element", this.getAttribute('datetime'));
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  connectedCallback() {
  }

}
export default HeaderLogo;