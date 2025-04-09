import styles from './widgetdashboard.scss';

class WidgetDashboard extends HTMLElement {
  constructor() {
    super();
    setTimeout(() => {
      let liveStreamUrl = (this.getAttribute("url") ? this.getAttribute("url") : " ");
      var callbackFn = this.getAttribute("callback");
      let mode = (this.getAttribute("mode") == 'full' ? "dashboard-widget-fullscreen" : "dashboard-widget-minimize");
      let template = document.createElement('template');
      template.innerHTML = `
        <style>${styles.toString()}</style>
          <div class="dashboard-widget ${mode}">
           <div class="dashboard-widget__header-wrap">
            <div class="dashboard-widget__header-heading"> dashboard widget </div>
             <div class="dashboard-widget__header-dropdown-icon-wrap">
               <div class="dashboard-widget__dropdown-toggle">
                <img src="./assets/icons/WidgetArrow_Defautl@2x.png">
               </div>
               <div class="dashboard-widget__dropdown">
                 <h3 class="dashboard-widget__dropdown-heading"> Widget Menu </h3>
                 <ul class="dashboard-widget__dropdown-list">
                  <li class="dashboard-widget__dropdown-list-item">
                     <span class="dashboard-widget__dropdown-list-item-icon">
                      <img src="./assets/icons/expand@2x.png" alt="icon">
                    </span>
                     <span class="dashboard-widget__dropdown-list-item-text">
                     new window
                    </span>   
                  </li>
                  <li class="dashboard-widget__dropdown-list-item">
                    <span class="dashboard-widget__dropdown-list-item-icon">
                    <img src="./assets/icons/Fullscreen@2x.png" alt="icon">
                    </span>
                    <span class="dashboard-widget__dropdown-list-item-text">
                     full screen
                    </span>
                  </li>
                  <li class="dashboard-widget__dropdown-list-item">
                    <span class="dashboard-widget__dropdown-list-item-icon">
                      <img src="./assets/icons/Minimise@2x.png" alt="icon">
                    </span>
                    <span class="dashboard-widget__dropdown-list-item-text">
                         minimize
                    </span>
                  </li>
                  <li class="dashboard-widget__dropdown-list-item">
                    <span class="dashboard-widget__dropdown-list-item-icon">
                      <img src="./assets/icons/download@2x.png" alt="icon">
                    </span>
                    <span class="dashboard-widget__dropdown-list-item-icon">
                        download
                    </span>
                  </li>
                  <li class="dashboard-widget__dropdown-list-item">
                    <span class="dashboard-widget__dropdown-list-item-icon">
                       <img src="./assets/icons/share@2x.png" alt="icon">
                    </span>
                    <span class="dashboard-widget__dropdown-list-item-text"> share </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="dashboard-widget__section">
            <div class= "dashboard-widget__section-frame">
               <iframe src="${liveStreamUrl}" height="100%" width="100%" style="object-fit: cover; border: none;" title="Live streaming" ></iframe>
            </div>
          </div>  
      </div>`;

      const shadowRoot = this.attachShadow({
        mode: 'open'
      });
      shadowRoot.appendChild(template.content.cloneNode(true));
      //<iframe src="./assets/images/dashboard.PNG" height="100%" width="100%" style="object-fit: cover;" title="Live streaming"></iframe>

      // the javascript logics..
      let dashWidget = this.shadowRoot.querySelector('.dashboard-widget');
      // let camSecFrame = this.shadowRoot.querySelector('.dashboard-widget__section-frame');
      let dashToggleBtn = this.shadowRoot.querySelector('.dashboard-widget__dropdown-toggle');
      let dashDropdown = this.shadowRoot.querySelector('.dashboard-widget__dropdown');
      let dashDropdownList = this.shadowRoot.querySelectorAll('.dashboard-widget__dropdown-list-item');
      let newWindow = this.shadowRoot.querySelector('.dashboard-widget__dropdown-list-item:nth-child(1)');
      let fullScreen = this.shadowRoot.querySelector('.dashboard-widget__dropdown-list-item:nth-child(2)');
      let minimize = this.shadowRoot.querySelector('.dashboard-widget__dropdown-list-item:nth-child(3)');
      let download = this.shadowRoot.querySelector('.dashboard-widget__dropdown-list-item:nth-child(4)');
      let share = this.shadowRoot.querySelector('.dashboard-widget__dropdown-list-item:nth-child(5)');

      // Dropdown list callback.
      dashDropdownList.forEach(ele => {
        ele.addEventListener('click', () => {
          var checkEvent = new CustomEvent("tdashboard", {
            bubbles: true,
            detail: {
              version: '1.0',
              method: callbackFn,
              params: '',
              data: ele.textContent.trim()
            }
          });
          if (this.dispatchEvent(checkEvent)) {
            // Do default operation here
            console.log('Performing default operation');
          } else {
            console.log("No callback Available");
          }
        })
      })

      newWindow.addEventListener("click", () => {
        console.log("Go to new window");
      });

      // Event listeners..
      dashToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dashDropdown.classList.toggle('dropdown-active');
      });


        // comment these next event listener if on each item
      // click the popup dropdown has to be remooved.
      /*
       dashDropdown.addEventListener('click', (e) => {
         e.stopPropagation();
       }) 
       
      */

      document.addEventListener('click', () => {
        dashDropdown.classList.remove("dropdown-active");
      });

      // minimize
      minimize.addEventListener("click", () => {
        dashWidget.classList.add("dashboard-widget-minimize");
        dashWidget.classList.remove("dashboard-widget-fullscreen");
        dashDropdown.classList.toggle('dropdown-active');
      })

      fullScreen.addEventListener("click", () => {
        dashWidget.classList.add("dashboard-widget-fullscreen");
        dashWidget.classList.remove("dashboard-widget-minimize");
        dashDropdown.classList.toggle('dropdown-active');
      })

    }, 0);
  }
}

export default WidgetDashboard;