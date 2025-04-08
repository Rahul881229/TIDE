import styles from './widgetcamera.scss';

class WidgetCamera extends HTMLElement {
  constructor() {
    super();
    setTimeout(() => {
      var lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : 'dark';
      let liveStreamUrl = (this.getAttribute("url") ? this.getAttribute("url") : " ");
      let callbackFn = this.getAttribute("callback");
      let mode = (this.getAttribute("mode") == 'full' ? "camera-widget-fullscreen" : "camera-widget-minimize");
      let template = document.createElement('template');
      template.innerHTML = `
        <style>${styles.toString()}</style>
          <div class="camera-widget ${mode} ${theme}" ${lang}>
           <div class="camera-widget__header-wrap">
            <div class="camera-widget__header-heading"> camera widget </div>
             <div class="camera-widget__header-dropdown-icon-wrap">
               <div class="camera-widget__dropdown-toggle">
                <img src="./assets/icons/WidgetArrow_Defautl@2x.png">
               </div>
               <div class="camera-widget__dropdown">
                 <h3 class="camera-widget__dropdown-heading"> Widget Menu </h3>
                 <ul class="camera-widget__dropdown-list">
                  <li class="camera-widget__dropdown-list-item">
                     <span class="camera-widget__dropdown-list-item-icon">
                     <img src="./assets/icons/expand@2x.png" alt="icon">
                    </span>
                     <span class="camera-widget__dropdown-list-item-text">
                     new window
                    </span>   
                  </li>
                  <li class="camera-widget__dropdown-list-item">
                    <span class="camera-widget__dropdown-list-item-icon">
                      <img src="./assets/icons/Fullscreen@2x.png" alt="icon">
                    </span>
                    <span class="camera-widget__dropdown-list-item-text">
                     full screen
                    </span>
                  </li>
                  <li class="camera-widget__dropdown-list-item">
                    <span class="camera-widget__dropdown-list-item-icon">
                    <img src="./assets/icons/Minimise@2x.png" alt="icon">
                    </span>
                    <span class="camera-widget__dropdown-list-item-text">
                         minimize
                    </span>
                  </li>
                  <li class="camera-widget__dropdown-list-item">
                    <span class="camera-widget__dropdown-list-item-icon">
                      <img src="./assets/icons/download@2x.png" alt="icon">
                    </span>
                    <span class="camera-widget__dropdown-list-item-icon">
                        download
                    </span>
                  </li>
                  <li class="camera-widget__dropdown-list-item">
                    <span class="camera-widget__dropdown-list-item-icon">
                      <img src="./assets/icons/share@2x.png" alt="icon">
                    </span>
                    <span class="camera-widget__dropdown-list-item-text"> share </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr class="camera-widget__hr">
          <div class="camera-widget__section">
            <div class= "camera-widget__section-frame">
               <iframe src="${liveStreamUrl}" height="100%" width="100%" style="object-fit: cover; border: none;" title="Live streaming" ></iframe>
            </div>
          </div>  
      </div>`;

      const shadowRoot = this.attachShadow({
        mode: 'open'
      });
      shadowRoot.appendChild(template.content.cloneNode(true));

      //<iframe src="./assets/images/camera.PNG" height="100%" width="100%" style="object-fit: cover;" title="Live streaming"></iframe>


      // the javascript logics..
      let camWidget = this.shadowRoot.querySelector('.camera-widget')
      let camSecFrame = this.shadowRoot.querySelector('.camera-widget__section-frame');
      let camToggleBtn = this.shadowRoot.querySelector('.camera-widget__dropdown-toggle');
      let camDropdown = this.shadowRoot.querySelector('.camera-widget__dropdown');
      let camDropdownList = this.shadowRoot.querySelectorAll('.camera-widget__dropdown-list-item');
      let newWindow = this.shadowRoot.querySelector('.camera-widget__dropdown-list-item:nth-child(1)');
      let fullScreen = this.shadowRoot.querySelector('.camera-widget__dropdown-list-item:nth-child(2)');
      let minimize = this.shadowRoot.querySelector('.camera-widget__dropdown-list-item:nth-child(3)');
      let download = this.shadowRoot.querySelector('.camera-widget__dropdown-list-item:nth-child(4)');
      let share = this.shadowRoot.querySelector('.camera-widget__dropdown-list-item:nth-child(5)');

      //  dropdown callback
      camDropdownList.forEach(elem => {
        if (callbackFn) {
          elem.addEventListener('click', () => {
            var checkEvent = new CustomEvent("tcamera", {
              bubbles: true,
              detail: {
                version: '1.0',
                method: callbackFn,
                params: '',
                data: elem.textContent.trim()
              }
            });
            if (this.dispatchEvent(checkEvent)) {
              // Do default operation here
              console.log('Performing default operation');
            } else {
              console.log("No callback Available");
            }
          })
        }
      })

      newWindow.addEventListener("click", () => {
        console.log("Go to new window");
      });

      // Event listeners..
      camToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        camDropdown.classList.toggle('dropdown-active');
      });

      // comment these next event listener if on each item
      // click the popup dropdown has to be remooved.
      camDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      })

      document.addEventListener('click', () => {
        camDropdown.classList.remove("dropdown-active");
      });

      // minimize
      minimize.addEventListener("click", () => {
        camWidget.classList.add("camera-widget-minimize");
        camWidget.classList.remove("camera-widget-fullscreen");
        camDropdown.classList.toggle('dropdown-active');
      })

      fullScreen.addEventListener("click", () => {
        camWidget.classList.add("camera-widget-fullscreen");
        camWidget.classList.remove("camera-widget-minimize");
        camDropdown.classList.toggle('dropdown-active');
      })

    }, 0);
  }

  static get observedAttributes() {
    return ['theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'theme' && newValue) {
      if (this.shadowRoot) {
        let tag = this.shadowRoot.querySelectorAll('.camera-widget')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      }
    }
  }

}

export default WidgetCamera;