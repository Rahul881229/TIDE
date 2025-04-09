import styles from './tpill.scss'
 class TPILL extends HTMLElement{
 constructor(){
     super()
     this.attachShadow({mode: 'open'});

      const template = document.createElement('template');
      template.innerHTML=`<style>
       :host{
        display:inline-block;
        font-family:sans-serif;
        }
          .pill {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          background-color: var(--pill-bg, #999);
        }
           .pill.green { --pill-bg: #22c55e; }
        .pill.red { --pill-bg: #ef4444; }
        .pill.blue { --pill-bg: #3b82f6; }
        .pill.gray { --pill-bg: #6b7280; }

         .close-btn {
          margin-left: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
        }
           </style>
      <span class="pill">
        <slot></slot>
        <span class="close-btn" part="close" hidden>&times;</span>
      </span>
        `;
        
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._closeBtn = this.shadowRoot.querySelector('.close-btn');
    this._pill = this.shadowRoot.querySelector('.pill');

    this._closeBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('tpillclose', { bubbles: true }));
      this.remove();
    });
  }
  static get observedAttributes() {
    return ['color', 'closable'];
  }
  
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'color') {
      this._pill.className = `pill ${newVal}`;
    }
    if (name === 'closable') {
      this._closeBtn.hidden = newVal === null;
    }
  }
  connectedCallback() {
    if (this.hasAttribute('color')) {
      this._pill.classList.add(this.getAttribute('color'));
    }
    if (this.hasAttribute('closable')) {
      this._closeBtn.hidden = false;
    }
  }
}

// customElements.define('t-pill', TPill);
export default TPILL;