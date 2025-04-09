import styles from './stepper.scss';
let selected_ = null;
class Stepper extends HTMLElement {
  constructor() {
    super();

    // setTimeout(() => {


    let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : 'dark';

    let shadowRoot = this.attachShadow({
      mode: 'open'
    });
    shadowRoot.innerHTML = `
                <style>${styles.toString()}</style>
                <div>
                  <div class="tstepper ${theme}" id="tabs">
                    <span class= "prevTabBtn">
                      <img name="previous" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQflAgUJHjOjA+aFAAACVklEQVRo3u2Xv2sUQRTHv29WJRAhdmqdv0DQQkREtLKwUcLsnhIhkUMvV9gIqQQrC5sENIqRXGLYnFpY2IaAP/BHoSiopBEEBQtTKSremXk24UxyM3t3Gedt4b1uYZfPZ787O+8N0K3/vajzR6a29RzGdnzomz/yKweBdJDG0AcA+MgnkwfCAmmZxlY98513J4t+AsoDD/TivG8CHQikxXV4AGqXmEBaponmD8Y9QgK2twcAeiwiYH97AIYnBQSalt7fOhc/9xXY1BJfdOFpVI/74lvuA2nRET5oVF/yx7cQCI/PFJDAZwjI4J0CUniHgBzeKiCJtwjI4psEpPHrBOTxawTywK/qBc6WU0dJ3wiFbyTgxL+kkn4WDr8i4MQv8n0ygcjv+V6yBBBQHeHxjZwPfIu/qSF9l24fNPOdzcb/sOrYHx2bRH9OeCDCToW9ueEB0D6FUIusrTKRgvdg7ZXAQ8UXUc+N/8NcUMlTPp3TZ/iCgcILAoC5U7hp/RXf4Ekg+DK9+z1z4mtjK3YqPKKyfh0yhsYO6FSoYTi+FU6ggYwrVMCy5Y4tmJ4rCSQAAFXNs4gsdzHK8RUBgSwFHkmuCgjIK1jasKyCdQ6QVHAMIm4FKukJAQE5hYxRLOOnPBtfExCQUWgxjGYsxzPJdQGB8AptjOPONmV4MJkVEMhQqNMe32bd1onA2Sk3c9E3gTaPJLqKYdvgxgeEBFwpqJqYgD0F81ZQAIgrGFqjUOPLogJAXMFxLK1cfDZHC698BTZwLL+z1RwyO+hTtDDw0xffrW4BfwBNa+cpX8PhHQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wMi0wNVQwOTozMDo1MSswMDowMOW5sOwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDItMDVUMDk6MzA6NTErMDA6MDCU5AhQAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg=="/>
                    </span>
                    <slot id="tabsSlot" name="title"></slot>
                    <span class= "nextTabBtn">
                        <img name="next" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQflAgUJHwl8FA52AAACKklEQVRo3u2ZvWtTURiHf++5ulm3irZgO5Qm6lBwEFod7FYIrmlK/Nr8E3R07n9RqDfXC47SUiFpaTsKN4Mu7RChXVzEDxCs554OLWI1tzkf77lnyTslOXCfh995OTlvAgxrWIGLeB6Tjv5+TNfRjVbrvwIIxPfoDa4AALpRrX5YssDru3KNRv687WF+qVeiQHJbbeHSmY/2o/v6KQhXAbXyDx6YkpvpeEkJvJoQvb4L2hvhmICSBQuT6LQmSxB4eEBZocI7nY1w7gE8xbeCFa1ecBZodNXCOQo7gzaC5yCapXVcLlgc0I5MR7G9ApOAvQKbANCaw5q5AqMA0JpT6399K2gpsArYKDALmCuwC5gqeBD474ZwroIXARMFTwL6Ct4EdBUISBrqBW7hgj+VvnV6caN4ieKS0WdSoFaGmUACwH5+R+BmMDwwFS0LXAwoAPXA/UrmVlLgZ1CBtwJZQPxe/lzQS6hQ+Gi++UU0NqimPiIPga8fej2Kk2nVRtFccIr3KJBMqw7GBuG9CejiOUazPpVWdPFeEkgrsq2L9yBghmcXSCuyg2v6eCDixMdVZYhnTSCuUtsUzzmcWuH5xvMqdXDVHM/1A4U1nqUJkxuwxjMkkFbkNkZt8QxHsVxxwTsnkI7LAxe8cwJHRfOUJt5ZoPkJH1zwDD2QP8EPezyDQPO9WFDfbfEsF5LFXarh88lryszwjH9a5Y/UBGVfV58d8TxxWMMqrY4B/yHr+GmndssAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDItMDVUMDk6MzE6MDkrMDA6MDBxdJvRAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTAyLTA1VDA5OjMxOjA5KzAwOjAwACkjbQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII="/>
                    </span>
                  </div>
                  <div class="${theme}" id="panels">
                    <slot id="panelsSlot"></slot>
                  </div>
                </div>
                `;
    // }, 0);
  }

  static get observedAttributes() {
    return ['theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'theme' && newValue) {
      if (this.shadowRoot) {
        let tag = this.shadowRoot.querySelectorAll('.tstepper')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      }
    }
  }

  adoptedCallback() {
    // console.log("adoptedCallback:::Html Element", this.getAttribute('datetime'));
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  connectedCallback() {
    this.setAttribute('role', 'tablist');
    const prevTabBtn = this.shadowRoot.querySelector('.prevTabBtn>img');
    const tabsSlot = this.shadowRoot.querySelector('#tabsSlot');
    const panelsSlot = this.shadowRoot.querySelector('#panelsSlot');
    const nextTabBtn = this.shadowRoot.querySelector('.nextTabBtn>img');

    this.tabs = tabsSlot.assignedNodes({
      flatten: true
    });
    this.panels = panelsSlot.assignedNodes({
      flatten: true
    }).filter(el => {
      return el.nodeType === Node.ELEMENT_NODE;
    });

    // Add aria role="tabpanel" to each content panel.
    for (let [i, panel] of this.panels.entries()) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('tabindex', 0);
    }

    // Save refer to we can remove listeners later.
    this._boundOnTitleClick = this._onTitleClick.bind(this);
    /*  tabsSlot.addEventListener('click', this._boundOnTitleClick); */
    this.selected = this._findFirstSelectedTab() || 0;
    nextTabBtn.addEventListener('click', this._boundOnTitleClick);
    prevTabBtn.addEventListener('click', this._boundOnTitleClick);

  }

  disconnectedCallback() {
    // let prevTabBtn = this.shadowRoot.querySelector('.prevTabBtn');
    const tabsSlot = this.shadowRoot.querySelector('#tabsSlot');
    tabsSlot.removeEventListener('click', this._boundOnTitleClick);
    tabsSlot.removeEventListener('keydown', this._boundOnKeyDown);

    const prevTabBtn = this.shadowRoot.querySelector('.prevTabBtn>img');
    prevTabBtn.removeEventListener('click', this._boundOnTitleClick);
    const nextTabBtn = this.shadowRoot.querySelector('.nextTabBtn>img');
    nextTabBtn.removeEventListener('click', this._boundOnTitleClick);
  }

  get selected() {
    return selected_;
  }

  set selected(idx) {
    selected_ = idx;
    this._selectTab(idx);
    // console.log(this._selectTab);
    // Updated the element's selected attribute value when
    // backing property changes.
    this.setAttribute('selected', idx);
  }

  _onTitleClick(e) {
    // console.log("_onTitleClick -> ", e, this.tabs.length, this.tabs);
    if (e.target.slot === 'title') {
      this.selected = this.tabs.indexOf(e.target);
      e.target.focus();
      this._callbackFn(this, this.selected);
    } else if (e.path[0].getAttribute("name") === 'next') {
      if (this.selected < this.tabs.length - 1) {
        this.selected = this.selected + 1;
        this._callbackFn(this, this.selected);
      }
    } else if (e.path[0].getAttribute("name") === 'previous') {
      if (this.selected > 0) {
        this.selected = this.selected - 1;
        this._callbackFn(this, this.selected);
      }
    }
  }

  _callbackFn(_this, selected) {
    const callbackFn = _this.getAttribute("callback");
    if (callbackFn) {
      var checkEvent = new CustomEvent("tstepper", {
        bubbles: true,
        detail: {
          version: "1.0",
          method: callbackFn,
          params: '',
          data: {
            value: selected
          }
        }
      });

      if (this.dispatchEvent(checkEvent)) {
        // Do default operation here.
        console.log('Performing default operation');
      } else {
        console.log("Callback Not Available");
      }
    }
  }

  _findFirstSelectedTab() {
    let selectedIdx;
    for (let [i, tab] of this.tabs.entries()) {
      tab.setAttribute('role', 'tab');
      // Allow users to declaratively select a tab
      // Highlight last tab which has the selected attribute.
      if (tab.hasAttribute('selected')) {
        selectedIdx = i;
      }
    }
    return selectedIdx;
  }

  _selectTab(idx = null) {
    for (let i = 0, tab; tab = this.tabs[i]; ++i) {
      let select = i === idx;
      tab.setAttribute('tabindex', select ? 0 : -1);
      tab.setAttribute('aria-selected', select);
      this.panels[i].setAttribute('aria-hidden', !select);
    }
  }
}

export default Stepper;