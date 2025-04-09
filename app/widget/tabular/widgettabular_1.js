import styles from './widgettabular.scss';
let _this;

class WidgetTabular extends HTMLElement {
  constructor() {
    super();
    setTimeout(() => {
      var pagination = (this.getAttribute("pagination") == "true" ? this.getAttribute("pagination") : "");
      console.log(pagination);
      var lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
      let mode = (this.getAttribute("mode") == 'full' ? "tabular-widget-fullscreen" : "tabular-widget-minimize");
      let theme = (this.getAttribute("theme") == 'light' ? "light" : "dark");

      let tableData = (this.getElementsByTagName('table')[0]);
      let listData = (this.getElementsByTagName('ul')[0]);

      let callbackFn = this.getAttribute("callback");
      console.log(callbackFn);
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
        <div class="tabular-widget__record-data">
         
          <div class="pagination"></div>
        </div>
      </div>`;
      const shadowDOM = this.attachShadow({
        mode: 'open'
      });
      shadowDOM.appendChild(template.content.cloneNode(true));
      _this = this;

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

      // inserting table and lists dynamically.
      let tabularListData = _this.shadowRoot.querySelector(".tabular-widget__record-data");
      if (tableData) {
        tabularListData.insertBefore(tableData, tabularListData.children[0]);
        tableData.setAttribute('class', 'ttable');
      }

      if (listData) {
        tabularListData.insertBefore(listData, tabularListData.children[0]);
        listData.setAttribute('class', 'list-data');
      }

      // adding class to table row as per the status.(tabular Data)
      let tablecells = Array.from(_this.shadowRoot.querySelectorAll(".ttable tr td"));
      let filteredActivecells = tablecells.filter(data => data.innerHTML.trim() === "active");
      filteredActivecells.forEach(data => {
        let tablecellrow = data.parentElement;
        tablecellrow.className = "active-row";
        data.insertAdjacentHTML("afterbegin", "<span class='active-items'></span>");
      })

      let filteredInactivecells = tablecells.filter(data => data.innerHTML.trim() === "inactive");
      filteredInactivecells.forEach(data => {
        let tablecellrow = data.parentElement;
        tablecellrow.className = "inactive-row";
        data.insertAdjacentHTML("afterbegin", "<span class='inactive-items'></span>");
      })

      // adding class to table row as per the status.(List Data).
      let listItems = Array.from(_this.shadowRoot.querySelectorAll(".list-data li>span"));
      let filteredActiveList = listItems.filter(data => data.innerHTML.trim() === "Status: active")
      filteredActiveList.forEach(data => {
        let listItemRow = data.parentElement;
        listItemRow.className = "active-row";
        let text = data.innerHTML;
        text = text.split(" ");
        text[text.length - 1] = " <span class='active-items'></span>" + text[text.length - 1];
        text = text.join('');
        data.innerHTML = text;
      })

      let filteredInactiveList = listItems.filter(data => data.innerHTML.trim() === "Status: inactive")
      filteredInactiveList.forEach(data => {
        let listItemRow = data.parentElement;
        listItemRow.className = "inactive-row";
        let text = data.innerHTML;
        text = text.split(" ");
        text[text.length - 1] = " <span class='inactive-items'></span>" + text[text.length - 1];
        text = text.join('');
        data.innerHTML = text;
      })

      let drpdownListItem = this.shadowRoot.querySelectorAll(".tabular-widget__dropdown-list-item");
      drpdownListItem.forEach(ele => {
        if (callbackFn) {
          ele.addEventListener('click', () => {
            var checkEvent = new CustomEvent("ttabular", {
              bubbles: true,
              detail: {
                version: '1.0',
                method: callbackFn,
                params: '',
                data: ele.children[1].textContent.trim()
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
      });

      tabularDropdownfilterList.forEach(ele => {
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
      // this.newvar = itemsPerPage;

      // new window function.
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
      })

      // Full screen.
      fullScreen.addEventListener("click", () => {
        tabularWidget.classList.add("tabular-widget-fullscreen");
        tabularWidget.classList.remove("tabular-widget-minimize");
        tabularDropdown.classList.toggle("dropdown-active");
      })
      // new Pagination with n buttons and pages..
      // Returns an array of maxLength (or less) page numbers
      // where a 0 in the returned array denotes a gap in the series.
      // Parameters:
      //   totalPages:     total number of pages
      //   page:           current page
      //   maxLength:      maximum size of returned array
      if (pagination) {
        tabularListData.style.display = "none";

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

        // table and list list records for pagination.
        let tableRow = Array.from(_this.shadowRoot.querySelectorAll(".ttable tr:not(:first-child)"));
        let totalListItems = Array.from(_this.shadowRoot.querySelectorAll(".list-data li"));

        var contentHideElement = (Array.from(_this.shadowRoot.querySelectorAll(".ttable tr:not(:first-child)")) ?
          Array.from(_this.shadowRoot.querySelectorAll(".ttable tr:not(:first-child)")) : Array.from(_this.shadowRoot.querySelectorAll(".list-data li")));

        // console.log("contentHideElement", contentHideElement);
        var numberOfItems = tableRow.length || totalListItems.length;
        console.log("no of items", numberOfItems);
        var limitPerPage = itemsPerPage;
        var totalPages = Math.ceil(numberOfItems / limitPerPage);
        // Total pages rounded upwards
        // Number of buttons at the top, not counting prev/next,
        // but including the dotted buttons.
        // Must be at least 5:
        var paginationSize = 6;
        var currentPage;

        var contentHide;
        function passcontentVal() {
          if (tableRow.length > 0) {
            contentHide = tableRow
          } else if (totalListItems.length > 0) {

          }
        }

        function showPage(whichPage) {
          if (whichPage < 1 || whichPage > totalPages) return false;
          currentPage = whichPage;
          // $(".content").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();
          var tableData = Array.from(_this.shadowRoot.querySelectorAll(".ttable tr:not(:first-child)"));
          var listData = Array.from(_this.shadowRoot.querySelectorAll(".list-data>li"));
          let contentHide = tableData;
          if (listData.length > 0) {
            contentHide = listData;
            console.log("content", contentHide);
          }
          contentHide.forEach(element => {
            element.style.display = "none";
            element.removeAttribute("data-new", "presentEle");
          });
          let contentShow = contentHide.slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage);
          contentShow.forEach(element => {
            element.style.display = "";
            element.setAttribute("data-new", "presentEle");
            // adding sort and filter action here.
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

        tabularListData.style.display = "block";
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
      }

    }, 0);
  }

  static get observedAttributes() {
    return ['theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'theme' && newValue) {
      if (this.shadowRoot) {
        let tag = this.shadowRoot.querySelectorAll('.tabular-widget')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      }
    }
  }

}

export default WidgetTabular;