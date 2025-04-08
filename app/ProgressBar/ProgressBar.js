class TProgressBar extends HTMLElement {
  static get observedAttributes() {
    return ['percent'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        .progress-container {
          width: 100%;
          background-color: #eee;
          border-radius: 12px;
          overflow: hidden;
          height: 30px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
          position: relative;
        }

        .progress-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(to right, #00c6ff, #0072ff);
          transition: width 0.5s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-family: sans-serif;
          font-size: 14px;
        }
      </style>
      <div class="progress-container">
        <div class="progress-fill">0%</div>
      </div>
    `;
  }

  connectedCallback() {
    this.updateBar();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'percent') {
      this.updateBar();
    }
  }

  updateBar() {
    const percent = Math.min(100, Math.max(0, parseInt(this.getAttribute('percent')) || 0));
    const fill = this.shadowRoot.querySelector('.progress-fill');
    fill.style.width = percent + '%';
    fill.textContent = percent + '%';
  }
}

customElements.define('t-progress-bar', TProgressBar);
