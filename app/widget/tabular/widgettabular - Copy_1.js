import styles from './widgettabular.scss';
let _this;

class WidgetTabular extends HTMLElement {
  constructor() {


    super();
    setTimeout(() => {
      var lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
      let mode = (this.getAttribute("mode") == 'full' ? "tabular-widget-fullscreen" : "tabular-widget-minimize");
      let theme = (this.getAttribute("theme") == 'light' ? "light" : "dark");
      let itemsPerPage = (this.getAttribute("itemsPerPage") ? this.getAttribute("itemsPerPage") : "13");

      let template = document.createElement('template');
      template.innerHTML = `
        <style>${styles.toString()}</style>
        <div class="tabular-widget ${mode} ${theme}" ${lang}>
         <div class="tabular-widget__header-wrap">
          <div class="tabular-widget__header-heading"> tabular widget </div>
          <div class="tabular-widget__header-dropdown-icon-wrap">

            <div class="tabular-widget__dropdown-toggle sort">
              <img src="./assets/icons/Sorting@2x.png" alt="icon" />
            </div>
    
            <div class="tabular-widget__dropdown-toggle filter">
              <img src="./assets/icons/filter@2x.png" alt="icon" />
            </div>
    
            <div class="tabular-widget__dropdown-toggle arr">
              <img src="./assets/icons/WidgetArrow_Defautl@2x.png">
            </div>
          </div>
    
          <div class="tabular-widget__dropdown--sort-filter">
            <h3 class="tabular-widget__dropdown--sort-filter-heading"></h3>
            <h3 class="tabular-widget__dropdown--sort-filter-list-heading">By Status</h3>
            <ul class="tabular-widget__dropdown--sort-filter-list">
              <li class="tabular-widget__dropdown--sort-filter-list-item active">  
                 <span class="active-items"></span> 
                  Active
               </li>
              <li class="tabular-widget__dropdown--sort-filter-list-item inactive">
                <span class="inactive-items"></span> 
                  Inactive
               </li>
              <span class="list-bottom-border"></span>
              <li class="tabular-widget__dropdown--sort-filter-list-item all">No Filter </li> 
            </ul>
          </div>
    
          <div class="tabular-widget__dropdown">
            <h3 class="tabular-widget__dropdown-heading"> Widget Menu </h3>
            <ul class="tabular-widget__dropdown-list">
              <li class="tabular-widget__dropdown-list-item">
                <span class="tabular-widget__dropdown-list-item-icon">
                  <img src="./assets/icons/expand@2x.png" alt="icon">
                </span>
                <span class="tabular-widget__dropdown-list-item-text">
                  new window
                </span>
              </li>
    
              <li class="tabular-widget__dropdown-list-item">
                <span class="tabular-widget__dropdown-list-item-icon">
                  <img src="./assets/icons/Fullscreen@2x.png" alt="icon">
                </span>
                <span class="tabular-widget__dropdown-list-item-text">
                  full screen
                </span>
              </li>
    
              <li class="tabular-widget__dropdown-list-item">
                <span class="tabular-widget__dropdown-list-item-icon">
                 <img src="./assets/icons/Minimise@2x.png" alt="icon">
                </span>
                <span class="tabular-widget__dropdown-list-item-text">
                  minimize
                </span>
              </li>
    
              <li class="tabular-widget__dropdown-list-item">
                <span class="tabular-widget__dropdown-list-item-icon">
                  <img src="./assets/icons/download@2x.png" alt="icon">
                </span>
                <span class="tabular-widget__dropdown-list-item-icon">
                  download
                </span>
              </li>
    
              <li class="tabular-widget__dropdown-list-item">
                <span class="tabular-widget__dropdown-list-item-icon">
                  <img src="./assets/icons/share@2x.png" alt="icon">
                </span>
                <span class="tabular-widget__dropdown-list-item-text"> share </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="tabular-widget__table-data" style="display:none">
          <table class="ttable">
             <tr class="table-heading">
               <th>Name</th>
               <th>Location </th>
               <th>Status</th>
             </tr>
             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>

             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>

             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="active-items"></span> Active </td>
             </tr>

             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>
            
             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>

             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="active-items"></span> Active </td>
             </tr>

             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>

             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>

             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="active-items"></span> Active </td>
             </tr>

             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>
            
             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>

             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="active-items"></span> Active </td>
             </tr>

             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>

             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>

             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="active-items"></span> Active </td>
             </tr>

             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>
            
             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>
             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>
            
             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>
             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>
            
             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>
             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>
            
             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>
             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>
            
             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>
             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>
            
             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>
             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>
            
             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>
             <tr class="active-row">
                <td> Moneywell camera SKW283 </td>
                <td> #23 Tower Korsan </td>
                <td><span class="active-items"></span> Active </td>
             </tr>
            
             <tr class="inactive-row">
                <td> Moneywell camera JHW287 </td>
                <td> #23 Tower Korsan </td>
                <td> <span class="inactive-items"></span> Inactive </td>
             </tr>
          </table>
          <div class="pagination"></div>
        </div>
      </div>`;
      const shadowRoot = this.attachShadow({
        mode: 'open'
      });
      shadowRoot.appendChild(template.content.cloneNode(true));
      _this = this;
      console.log("value of this", _this);
      // the javascript logics..
      let tabularWidget = this.shadowRoot.querySelector('.tabular-widget');
      let tabularToggleBtn = this.shadowRoot.querySelectorAll('.tabular-widget__dropdown-toggle');
      let tabularDropdown = this.shadowRoot.querySelector('.tabular-widget__dropdown');
      let tabularDropdownfilterList = this.shadowRoot.querySelectorAll('.tabular-widget__dropdown--sort-filter-list-item');
      let tabularDropdownfilter = this.shadowRoot.querySelector('.tabular-widget__dropdown--sort-filter');
      let newWindow = this.shadowRoot.querySelector('.tabular-widget__dropdown-list-item:nth-child(1)');
      let fullScreen = this.shadowRoot.querySelector('.tabular-widget__dropdown-list-item:nth-child(2)');
      let minimize = this.shadowRoot.querySelector('.tabular-widget__dropdown-list-item:nth-child(3)');
      // let download = this.shadowRoot.querySelector('.tabular-widget__dropdown-list-item:nth-child(4)');
      // let share = this.shadowRoot.querySelector('.tabular-widget__dropdown-list-item:nth-child(5)');
      let sortfilterHeading = this.shadowRoot.querySelector(".tabular-widget__dropdown--sort-filter-heading");
      let activeRow = this.shadowRoot.querySelectorAll(".active-row");
      let inactiveRow = this.shadowRoot.querySelectorAll(".inactive-row");

      this.newvar = itemsPerPage;

      // new window function...

      newWindow.addEventListener("click", () => {
        console.log("Go to new window");
      });

      // Event listeners..
      for (let i = 0; i < tabularToggleBtn.length; i++) {
        tabularToggleBtn[0].addEventListener("click", () => {
          tabularDropdownfilter.classList.toggle("dropdown-active");
          tabularDropdownfilter.style.right = "70px";
          sortfilterHeading.textContent = "Sort";
        });
        // Filter..
        tabularToggleBtn[1].addEventListener("click", () => {
          tabularDropdownfilter.classList.toggle("dropdown-active");
          tabularDropdownfilter.style.right = "46px";
          sortfilterHeading.textContent = "Filter";
        });
        // Arrow button..
        tabularToggleBtn[2].addEventListener("click", () => {
          tabularDropdown.classList.toggle("dropdown-active");
        });
      }

      // Adding removing the active class..
      for (var i = 0; i < tabularDropdownfilterList.length; i++) {
        tabularDropdownfilterList[i].addEventListener('click', activateClass);
      }

      function activateClass(ele) {
        for (var i = 0; i < tabularDropdownfilterList.length; i++) {
          tabularDropdownfilterList[i].classList.remove('active-border');
        }
        ele.target.classList.add('active-border');
      }

      // minimize..
      minimize.addEventListener("click", () => {
        tabularWidget.classList.add("tabular-widget-minimize");
        tabularWidget.classList.remove("tabular-widget-fullscreen");
        tabularDropdown.classList.toggle("dropdown-active");
        console.log(this.itemsPerPage);
        // this.itemsPerPage = 4;
      })

      // Full screen..
      fullScreen.addEventListener("click", () => {
        tabularWidget.classList.add("tabular-widget-fullscreen");
        tabularWidget.classList.remove("tabular-widget-minimize");
        tabularDropdown.classList.toggle("dropdown-active");
      })

      minimize.addEventListener('click', () => {
        if (tabularWidget.classList.contains('tabular-widget-minimize')) {
          var totalPages = Math.ceil(numberOfItems / limitPerPage);
          limitPerPage = 3;
          console.log("lidfd", limitPerPage);
          //  var totalPages = Math.ceil(numberOfItems / limitPerPage); 
        }
      })

      // new Pagination with n buttons and pages..
      // Returns an array of maxLength (or less) page numbers
      // where a 0 in the returned array denotes a gap in the series.
      // Parameters:
      //   totalPages:     total number of pages
      //   page:           current page
      //   maxLength:      maximum size of returned array
      function getPageList(totalPages, page, maxLength) {

        if (maxLength < 5) throw "maxLength must be at least 5";

        function range(start, end) {
          return Array.from(Array(end - start + 1), (_, i) => i + start);
        }

        var sideWidth = maxLength < 9 ? 1 : 2;
        var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
        var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
        if (totalPages <= maxLength) {
          // no breaks in list
          return range(1, totalPages);
        }

        if (page <= maxLength - sideWidth - 1 - rightWidth) {
          // no break on left of page
          return range(1, maxLength - sideWidth - 1)
            .concat(0, range(totalPages - sideWidth + 1, totalPages));
        }

        if (page >= totalPages - sideWidth - 1 - rightWidth) {
          // no break on right of page
          return range(1, sideWidth)
            .concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
        }

        // Breaks on both sides
        return range(1, sideWidth)
          .concat(0, range(page - leftWidth, page + rightWidth),
            0, range(totalPages - sideWidth + 1, totalPages));
      }

      ///////   use of above function.  ////////// ...
      // Number of items and limits the number of items per page ...

      let tabularTableData = _this.shadowRoot.querySelector(".tabular-widget__table-data");
      var table = _this.shadowRoot.querySelector(".ttable");
      let tableRow = (_this.shadowRoot.querySelectorAll(".ttable tr:not(:first-child)"));
      var numberOfItems = tableRow.length;
      var limitPerPage = itemsPerPage;

      var totalPages = Math.ceil(numberOfItems / limitPerPage);
      console.log("outside", limitPerPage);

      // var totalPages = Math.ceil(numberOfItems / limitPerPage);

      // Total pages rounded upwards

      // Number of buttons at the top, not counting prev/next,
      // but including the dotted buttons.
      // Must be at least 5:
      var paginationSize = 6;
      var currentPage;

      function showPage(whichPage) {
        if (whichPage < 1 || whichPage > totalPages) return false;
        currentPage = whichPage;
        // $(".content").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();
        let contentHide = Array.from(_this.shadowRoot.querySelectorAll(".ttable tr:not(:first-child)"));
        contentHide.forEach(element => {
          element.style.display = "none";
          element.removeAttribute("data-new", "presentEle");
        });

        let contentShow = contentHide.slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage);
        contentShow.forEach(element => {
          element.style.display = "";
          element.setAttribute("data-new", "presentEle");
          // adding sort and filter action here..
          tabularDropdownfilterList.forEach(drpItem => {
            drpItem.addEventListener("click", (drpItemChild) => {
              if (drpItemChild.target.className == 'tabular-widget__dropdown--sort-filter-list-item active active-border') {
                if (element.classList.contains("active-row") && element.hasAttribute('data-new')) {
                  element.style.display = "";
                }
                if (element.classList.contains("inactive-row") && element.hasAttribute('data-new')) {
                  element.style.display = "none";
                };
              }

              if (drpItemChild.target.className == 'tabular-widget__dropdown--sort-filter-list-item inactive active-border') {
                if (element.classList.contains("inactive-row") && element.hasAttribute('data-new')) {
                  element.style.display = "";
                };
                if (element.classList.contains("active-row") && element.hasAttribute('data-new')) {
                  element.style.display = "none";
                };
              }

              if (drpItemChild.target.className == 'tabular-widget__dropdown--sort-filter-list-item all active-border') {
                if (element.classList.contains("active-row") && element.hasAttribute('data-new')) {
                  element.style.display = "";
                };

                if (element.classList.contains("inactive-row") && element.hasAttribute('data-new')) {
                  element.style.display = "";
                };
              }
            })
          })
        })

        let paginationList = Array.from(_this.shadowRoot.querySelectorAll(".pagination li"));
        paginationList.slice(1, -1).forEach(ele => {
          ele.remove();
        });

        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
          let nextPage = _this.shadowRoot.querySelector("#next-page");
          let theList = document.createElement('li');
          theList.classList.add("page-item", (item ? "current-page" : "disabled"));
          theList.classList.toggle("active", item === currentPage);
          let aEle = document.createElement('a');
          aEle.setAttribute("class", "page-link");
          aEle.setAttribute("href", "javascript:void(0)");
          aEle.textContent = (item || "...");
          theList.appendChild(aEle);
          pagination.insertBefore(theList, nextPage);
        });

        // Disable prev/next when at first/last page:
        let previousPage = _this.shadowRoot.querySelector("#previous-page");
        let nextPage = _this.shadowRoot.querySelector("#next-page");
        previousPage.classList.toggle("disabled", currentPage === 1);
        nextPage.classList.toggle("disabled", currentPage === totalPages);
        return true;
      }

      //     // Include the prev/next buttons:
      //     // create list and a elememt
      //     // li prev
      let pagination = _this.shadowRoot.querySelector(".pagination");
      let aPrev = document.createElement("a");
      aPrev.setAttribute("class", "page-link");
      aPrev.setAttribute("href", "javascript:void(0)");
      aPrev.textContent = "prev";

      let liPrev = document.createElement("li");
      liPrev.setAttribute("class", "page-item");
      liPrev.setAttribute("id", "previous-page");
      liPrev.appendChild(aPrev);
      //  a next..

      let aNext = document.createElement("a");
      aNext.setAttribute("class", "page-link");
      aNext.setAttribute("href", "javascript:void(0)");
      aNext.textContent = "next";

      // li next
      let liNext = document.createElement("li");
      liNext.setAttribute("class", "page-item");
      liNext.setAttribute("id", "next-page");
      liNext.appendChild(aNext)
      pagination.append(liPrev, liNext);
      // Show the page links

      tabularTableData.style.display = "block";
      showPage(1);

      document.onclick = function () {
        let notActiveItem = _this.shadowRoot.querySelectorAll(".pagination li.current-page:not(.active)");
        notActiveItem.forEach(ele => {
          ele.addEventListener('click', () => {
            showPage(+(ele.textContent))
          })
        })
      }

      let previousPage = _this.shadowRoot.querySelector("#previous-page");
      let nextPage = _this.shadowRoot.querySelector("#next-page");

      nextPage.addEventListener("click", () => {
        return showPage(currentPage + 1);
      });

      previousPage.addEventListener("click", () => {
        return showPage(currentPage - 1);
      });
    }, 0);
  }
}

export default WidgetTabular;