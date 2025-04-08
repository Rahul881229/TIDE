import styles from './widgettext.scss';

class WidgetText extends HTMLElement {
  constructor() {
    super();
    setTimeout(() => {
      var callbackFn = this.getAttribute("callback");
      let mode = (this.getAttribute("mode") == 'full' ? "text-widget-fullscreen" : "text-widget-minimize");
      let template = document.createElement('template');
      template.innerHTML = `
      
        <style>${styles.toString()}</style>
        <div class="text-widget" ${mode}>
        <div class="text-widget__header-wrap">
          <div class="text-widget__header-heading"> text widget </div>
          <div class="text-widget__header-dropdown-icon-wrap">
            <div class="text-widget__header-searchbar">
               <span class="text-widget__header-searchbar-icon">
                 <img src="./assets/icons/Search@2x.png" />
               </span>
               <span class="text-widget__header-searchbar-input">
                 <input type="text" placeholder="Search"/>
               </span>

            </div>
            <div class="text-widget__dropdown-toggle text-widget__dropdown-toggle-filter">
                <img src="./assets/icons/filter@2x.png" alt="icon" />
            </div>
  
            <div class="text-widget__dropdown-toggle text-widget__dropdown-toggle-menu">
              <img src="./assets/icons/WidgetArrow_Defautl@2x.png">
            </div>
          </div>
  
        <div class="text-widget__dropdown--sort-filter">
          <h3 class="text-widget__dropdown--sort-filter-heading"></h3>
          <h3 class="text-widget__dropdown--sort-filter-list-heading">By Status</h3>
          <ul class="text-widget__dropdown--sort-filter-list">
            <li class="text-widget__dropdown--sort-filter-list-item active">
             <span class="active-items"></span> Active </li>
            <li class="text-widget__dropdown--sort-filter-list-item inactive">
             <span class="inactive-items"></span> Inactive </li>
             <span class="list-bottom-border"></span>
            <li class="text-widget__dropdown--sort-filter-list-item all"> No Filter</li> 
          </ul>
        </div>
  
        <div class="text-widget__dropdown">
          <h3 class="text-widget__dropdown-heading"> Widget Menu </h3>
          <ul class="text-widget__dropdown-list">
            <li class="text-widget__dropdown-list-item">
              <span class="text-widget__dropdown-list-item-icon">
                 <img src="./assets/icons/expand@2x.png" alt="icon">
              </span>
              <span class="text-widget__dropdown-list-item-text">
                new window
              </span>
            </li>
  
            <li class="text-widget__dropdown-list-item">
              <span class="text-widget__dropdown-list-item-icon">
              <img src="./assets/icons/Fullscreen@2x.png" alt="icon">
              </span>
              <span class="text-widget__dropdown-list-item-text">
                full screen
              </span>
            </li>
  
            <li class="text-widget__dropdown-list-item">
              <span class="text-widget__dropdown-list-item-icon">
               <img src="./assets/icons/Minimise@2x.png" alt="icon">
              </span>
              <span class="text-widget__dropdown-list-item-text">
                minimize
              </span>
            </li>
  
            <li class="text-widget__dropdown-list-item">
              <span class="text-widget__dropdown-list-item-icon">
                 <img src="./assets/icons/download@2x.png" alt="icon">
              </span>
              <span class="text-widget__dropdown-list-item-icon">
                download
              </span>
            </li>
  
            <li class="text-widget__dropdown-list-item">
              <span class="text-widget__dropdown-list-item-icon">
               <img src="./assets/icons/share@2x.png" alt="icon">
              </span>
              <span class="text-widget__dropdown-list-item-text"> share </span>
            </li>
          </ul>
        </div>
       </div>
       <hr class="text-widget__hr">
        <div class="text-widget__content">
          <h2 class="text-widget__content-date"></h2>
          <p class="text-widget__content-text"><span class="text-widget__content-time"></span> 
            |Generic| Events created!
          </p>
          <p class="text-widget__content-text"><span class="text-widget__content-time"></span> 
            |Generic|Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus recusandae 
            repudiandae corporis officia mollitia incidunt.
          </p>
       </div>
        </div>
      </div>`;

      const shadowRoot = this.attachShadow({
        mode: 'open'
      });
      shadowRoot.appendChild(template.content.cloneNode(true));

      // the javascript logics..
      let textWidget = this.shadowRoot.querySelector('.text-widget');
      let dateElement = this.shadowRoot.querySelector(".text-widget__content-date");
      let timeElement = this.shadowRoot.querySelectorAll(".text-widget__content-time");
      let textToggleBtnFilter = this.shadowRoot.querySelector('.text-widget__dropdown-toggle-filter');
      let textToggleBtnArr = this.shadowRoot.querySelector('.text-widget__dropdown-toggle-menu');
      let textDropdown = this.shadowRoot.querySelector('.text-widget__dropdown');
      let textDropdownfilterList = this.shadowRoot.querySelectorAll('.text-widget__dropdown--sort-filter-list-item');
      let textDropdownfilter = this.shadowRoot.querySelector('.text-widget__dropdown--sort-filter');
      let newWindow = this.shadowRoot.querySelector('.text-widget__dropdown-list-item:nth-child(1)');
      let fullScreen = this.shadowRoot.querySelector('.text-widget__dropdown-list-item:nth-child(2)');
      let minimize = this.shadowRoot.querySelector('.text-widget__dropdown-list-item:nth-child(3)');
      // let download = this.shadowRoot.querySelector('.text-widget__dropdown-list-item:nth-child(4)');
      // let share = this.shadowRoot.querySelector('.text-widget__dropdown-list-item:nth-child(5)');
      let sortfilterHeading = this.shadowRoot.querySelector(".text-widget__dropdown--sort-filter-heading");
      let searchInput = this.shadowRoot.querySelector(".text-widget__header-searchbar-input>input");
      let searchIcon = this.shadowRoot.querySelector(".text-widget__header-searchbar-icon");
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // let activeRow = this.shadowRoot.querySelectorAll(".active-row");
      // let inactiveRow = this.shadowRoot.querySelectorAll(".inactive-row");

      let textdrpdownList = this.shadowRoot.querySelectorAll(".text-widget__dropdown-list-item");
      textdrpdownList.forEach(ele => {
        if (callbackFn) {
          ele.addEventListener('click', () => {
            var checkEvent = new CustomEvent("ttext", {
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
        }
      })

      // sort-filter callback...

      textDropdownfilterList.forEach(ele => {
        if (callbackFn) {
          ele.addEventListener('click', () => {
            var checkEvent = new CustomEvent("tcommunication", {
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
        }
      })

      /* searchInput.addEventListener('focus', () => {
        searchIcon.style.display = "none";
      }) */

      newWindow.addEventListener("click", () => {
        console.log("Go to new window");
      });

      // Event listeners..
      textToggleBtnFilter.addEventListener("click", () => {
        textDropdownfilter.classList.toggle('dropdown-active');
        textDropdownfilter.style.right = "45px";
        sortfilterHeading.textContent = "Filter";
      })

      textToggleBtnArr.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        textDropdown.classList.toggle("dropdown-active");
      })



      //  uncomment this code if onclick of items if dropdown it will remain on the page.

      /*
       textDropdown.addEventListener('click', (e) => {
         e.stopPropagation();
       })
       */

      // removing dropdown popups, on click of body
      document.addEventListener('click', () => {
        textDropdown.classList.remove("dropdown-active");
        // textDropdownfilter.classList.remove('dropdown-active');
      })
      // Adding removing the active class..

      for (var i = 0; i < textDropdownfilterList.length; i++) {
        textDropdownfilterList[i].addEventListener('click', activateClass);
      }

      function activateClass(ele) {
        for (var i = 0; i < textDropdownfilterList.length; i++) {
          textDropdownfilterList[i].classList.remove('active-border');
        }
        ele.target.classList.add('active-border');
      }

      // minimize..
      minimize.addEventListener("click", () => {
        textWidget.classList.add("text-widget-minimize");
        textWidget.classList.remove("text-widget-fullscreen");
        textDropdown.classList.toggle("dropdown-active");
      })

      // Full screen..
      fullScreen.addEventListener("click", () => {
        textWidget.classList.add("text-widget-fullscreen");
        textWidget.classList.remove("text-widget-minimize");
        textDropdown.classList.toggle("dropdown-active");
      })

      let seteDate = new Date();
      dateElement.textContent = formateDate(seteDate);

      function formateDate(d) {
        let day = d.getDate();
        if (day < 10) {
          day = '0' + day;
        }

        let month = d.getMonth() + 1;
        if (month < 10) {
          month = '0' + month;
        }

        let year = d.getFullYear();
        let monthStr = d.getMonth();
        return year + '-' + months[monthStr] + '-' + day;
      }

      // setting time.
      function checkTime(i) {
        return (i < 10) ? "0" + i : i;
      }

      function startTime() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();

        // add a zero in front of numbers<10
        m = checkTime(m);
        s = checkTime(s);
        timeElement.forEach(ele => {
          ele.innerHTML = h + ":" + m + ":" + s;
        })
      }

      startTime();
    }, 0);
  }
}

export default WidgetText;