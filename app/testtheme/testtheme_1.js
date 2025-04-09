import styles from './testtheme.scss';

class TestTheme extends HTMLElement {

    constructor() {
        super();
        setTimeout(() => {
            var text = ((this.innerHTML).trim() ? this.innerHTML.trim() : '');

            const template = document.createElement('template');

            template.innerHTML = `
              <style>${styles.toString()}</style>
              <div class="dark">${text}</div>
            `;

            const shadowDOM = this.attachShadow({ mode: 'open' });
            shadowDOM.appendChild(template.content.cloneNode(true));

        }, 0);
    }
    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return ['theme'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log("attr changed");
    }

    adoptedCallback() {
        // console.log("adoptedCallback:::Html Element", this.getAttribute('datetime'));
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    connectedCallback() {
        this._updateSticky();
    }

    _updateSticky() {
        // console.log("this -> ", this.shadowDOM);
        this.setAttribute('class', 'light');
    }
}
export default TestTheme;