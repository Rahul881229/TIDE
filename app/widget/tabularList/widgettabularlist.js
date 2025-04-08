import styles from './widgettabularlist.scss';
let _this;

class WidgetTabularList extends HTMLElement {
  constructor() {
    super();
    setTimeout(() => {
      var enablePagination = (this.getAttribute("pagination") == "true" ? this.getAttribute("pagination") : "");
      var lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
      let mode = (this.getAttribute("mode") == 'full' ? "tabular-widget-fullscreen" : "tabular-widget-minimize");
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
      let tableData = (this.getElementsByTagName('table')[0]);
      let listData = (this.getElementsByTagName('ul')[0]);
      let callbackFn = this.getAttribute("callback");
      let itemsPerPage = (this.getAttribute("itemsPerPage") ? this.getAttribute("itemsPerPage") : "12");
      var limitPerPage = itemsPerPage;
      let template = document.createElement('template');
      template.innerHTML = `
        <style>${styles.toString()}</style>
        <div class="tabularlist-widget ${mode} ${theme}" ${lang}>
         <div class="tabularlist-widget__header-wrap">
          <div class="tabularlist-widget__header-heading"> </div>
          <div class="tabularlist-widget__header-dropdown-icon-wrap">

            <div class="tabularlist-widget__dropdown-toggle sort">
              <img src="./assets/icons/Sorting@2x.png" alt="icon" />
            </div>
    
            <div class="tabularlist-widget__dropdown-toggle filter">
              <img src="./assets/icons/filter@2x.png" alt="icon" />
            </div>
    
            <div class="tabularlist-widget__dropdown-toggle arr">
              <img src="./assets/icons/WidgetArrow_Defautl@2x.png">
            </div>
          </div>
    
          <div class="tabularlist-widget__dropdown--sort-filter">
            <h3 class="tabularlist-widget__dropdown--sort-filter-heading"></h3>
            <h3 class="tabularlist-widget__dropdown--sort-filter-list-heading">By Status</h3>
            <ul class="tabularlist-widget__dropdown--sort-filter-list">
              <li class="tabularlist-widget__dropdown--sort-filter-list-item active">  
                 <span class="active-items"></span> 
                  
               </li>
              <li class="tabularlist-widget__dropdown--sort-filter-list-item inactive">
                <span class="inactive-items"></span> 
                
               </li>
              <span class="list-bottom-border"></span>
              <li class="tabularlist-widget__dropdown--sort-filter-list-item all">No Filter </li> 
            </ul>
          </div>
    
          <div class="tabularlist-widget__dropdown">
            <h3 class="tabularlist-widget__dropdown-heading"> Widget Menu </h3>
            <ul class="tabularlist-widget__dropdown-list">
              <li class="tabularlist-widget__dropdown-list-item">
                <span class="tabularlist-widget__dropdown-list-item-icon">
                  <img src="./assets/icons/expand@2x.png" alt="icon">
                </span>
                <span class="tabularlist-widget__dropdown-list-item-text">
                  new window
                </span>
              </li>
    
              <li class="tabularlist-widget__dropdown-list-item">
                <span class="tabularlist-widget__dropdown-list-item-icon">
                  <img src="./assets/icons/Fullscreen@2x.png" alt="icon">
                </span>
                <span class="tabularlist-widget__dropdown-list-item-text">
                  full screen
                </span>
              </li>
    
              <li class="tabularlist-widget__dropdown-list-item">
                <span class="tabularlist-widget__dropdown-list-item-icon">
                 <img src="./assets/icons/Minimise@2x.png" alt="icon">
                </span>
                <span class="tabularlist-widget__dropdown-list-item-text">
                  minimize
                </span>
              </li>
    
              <li class="tabularlist-widget__dropdown-list-item">
                <span class="tabularlist-widget__dropdown-list-item-icon">
                  <img src="./assets/icons/download@2x.png" alt="icon">
                </span>
                <span class="tabularlist-widget__dropdown-list-item-icon">
                  download
                </span>
              </li>
    
              <li class="tabularlist-widget__dropdown-list-item">
                <span class="tabularlist-widget__dropdown-list-item-icon">
                  <img src="./assets/icons/share@2x.png" alt="icon">
                </span>
                <span class="tabularlist-widget__dropdown-list-item-text"> share </span>
              </li>
            </ul>
          </div>
        </div>
        <hr class="tabularlist-widget__hr">
        <div class="tabularlist-widget__record-data">
          <div class="pagination"></div>
        </div>
      </div>`;
      const shadowDOM = this.attachShadow({
        mode: 'open'
      });
      shadowDOM.appendChild(template.content.cloneNode(true));
      _this = this;
      // the javascript logics.
      let tabularWidget = this.shadowRoot.querySelector('.tabularlist-widget');
      let tabularToggleBtn = this.shadowRoot.querySelectorAll('.tabularlist-widget__dropdown-toggle');
      let tabularToggleBtnSort = this.shadowRoot.querySelectorAll('.tabularlist-widget__dropdown-toggle sort');
      let tabularToggleBtnFilter = this.shadowRoot.querySelectorAll('.tabularlist-widget__dropdown-toggle filter');
      let tabularDropdown = this.shadowRoot.querySelector('.tabularlist-widget__dropdown');
      let tabularDropdownfilterList = this.shadowRoot.querySelectorAll('.tabularlist-widget__dropdown--sort-filter-list-item');
      let tabularDropdownfilter = this.shadowRoot.querySelector('.tabularlist-widget__dropdown--sort-filter');
      let newWindow = this.shadowRoot.querySelector('.tabularlist-widget__dropdown-list-item:nth-child(1)');
      let fullScreen = this.shadowRoot.querySelector('.tabularlist-widget__dropdown-list-item:nth-child(2)');
      let minimize = this.shadowRoot.querySelector('.tabularlist-widget__dropdown-list-item:nth-child(3)');
      // let download = this.shadowRoot.querySelector('.tabularlist-widget__dropdown-list-item:nth-child(4)');
      // let share = this.shadowRoot.querySelector('.tabularlist-widget__dropdown-list-item:nth-child(5)');
      let sortfilterHeading = this.shadowRoot.querySelector(".tabularlist-widget__dropdown--sort-filter-heading");
      let activeRow = this.shadowRoot.querySelectorAll(".active-row");
      let inactiveRow = this.shadowRoot.querySelectorAll(".inactive-row");
      let widgetHeadingTitle = this.shadowRoot.querySelector(".tabularlist-widget__header-heading");
      let tabularMinimise = this.shadowRoot.querySelector(".tabular-widget-minimize");
      let tabularMaximise = this.shadowRoot.querySelector(".tabular-widget-fullscreen");

      // inserting table and lists dynamically.
      let tabularListData = this.shadowRoot.querySelector(".tabularlist-widget__record-data");
      if (tableData) {
        tabularListData.insertBefore(tableData, tabularListData.children[0]);
        tableData.setAttribute('class', 'ttable');
        widgetHeadingTitle.textContent = "tabular widget";
      }

      if (listData) {
        tabularListData.insertBefore(listData, tabularListData.children[0]);
        listData.setAttribute('class', 'list-data');
        widgetHeadingTitle.textContent = "list widget";
      }

      // adding class to table row as per the status. and the sort filter text as per record data(tabular Data)
      if (tableData) {
        let tablecells = Array.from(_this.shadowRoot.querySelectorAll(".ttable tr td"));
        // for active cells..
        let getActivecells = tablecells.filter(ele => (ele.getAttribute("data-status-type") === "active"));
        tabularDropdownfilterList[0].insertAdjacentHTML("beforeend", getActivecells[0].innerHTML);
        getActivecells.forEach(data => {
          data.parentElement.className = "active-row";
          data.insertAdjacentHTML("afterbegin", "<span class='active-items'></span>");
        })
        // For Inactive cells..
        let getInactivecells = tablecells.filter(ele => (ele.getAttribute("data-status-type") === "inactive"));
        tabularDropdownfilterList[1].insertAdjacentHTML("beforeend", getInactivecells[0].innerHTML);
        getInactivecells.forEach(data => {
          data.parentElement.className = "inactive-row";
          data.insertAdjacentHTML("afterbegin", "<span class='inactive-items'></span>");
        })
      }

      // adding class to table row as per the status. and the sort filter text as per record data(list Data)
      if (listData) {
        let listItems = Array.from(_this.shadowRoot.querySelectorAll(".list-data li>span"));
        let filteredActiveList = listItems.filter(data => data.getAttribute("data-status-type") === "active");
        filteredActiveList.forEach((data, idx) => {
          let listItemRow = data.parentElement;
          listItemRow.className = "active-row";
          data.insertAdjacentHTML("afterbegin", "<span class='active-items'></span>");

          // code for the new 
          let text = data.innerText;
          if (text.includes(":")) {
            let newText = text.split(/\s/).join('');
            let seperatorIndex = newText.indexOf(":");
            let textArr = [];
            let status = newText.slice(0, (seperatorIndex + 1));
            let statusVal = newText.slice((seperatorIndex + 1), newText.length);
            textArr.push(status, statusVal);
            if (idx === 0) {
              tabularDropdownfilterList[0].insertAdjacentHTML("beforeEnd", textArr[1]);
            }
            textArr[textArr.length - 1] = " <span class='active-items'></span>" + textArr[textArr.length - 1];
            textArr = textArr.join('');
            data.innerHTML = textArr;
          } else {
            if (idx === 0) {
              tabularDropdownfilterList[0].insertAdjacentHTML("beforeEnd", filteredActiveList[0].innerText);
            }
          }
        })

        let filteredInactiveList = listItems.filter(data => data.getAttribute("data-status-type") === "inactive");
        filteredInactiveList.forEach((data, idx) => {
          let listItemRow = data.parentElement;
          listItemRow.className = "inactive-row";
          data.insertAdjacentHTML("afterbegin", "<span class='inactive-items'></span>");
          // code for the new 
          let text = data.innerText;
          if (text.includes(":")) {
            let newText = text.split(/\s/).join('');
            let seperatorIndex = newText.indexOf(":");
            let textArr = [];
            let status = newText.slice(0, (seperatorIndex + 1));
            let statusVal = newText.slice((seperatorIndex + 1), newText.length);
            textArr.push(status, statusVal);
            if (idx === 0) {
              tabularDropdownfilterList[1].insertAdjacentHTML("beforeEnd", textArr[1]);
            }
            textArr[textArr.length - 1] = " <span class='inactive-items'></span>" + textArr[textArr.length - 1];
            textArr = textArr.join('');
            data.innerHTML = textArr;
          } else {
            if (idx === 0) {
              tabularDropdownfilterList[1].insertAdjacentHTML("beforeEnd", filteredInactiveList[0].innerText);
            }
          }
        })
      }

      let drpdownListItem = this.shadowRoot.querySelectorAll(".tabularlist-widget__dropdown-list-item");
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
      tabularToggleBtn.forEach((data, idx) => {
        if (idx === 0) {
          data.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            tabularDropdownfilter.classList.toggle("dropdown-active");
            tabularDropdownfilter.style.right = "70px";
            sortfilterHeading.textContent = "Sort";
          });
        }
        if (idx === 1) {
          data.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            tabularDropdownfilter.classList.toggle("dropdown-active");
            tabularDropdownfilter.style.right = "46px";
            sortfilterHeading.textContent = "Filter";
            tabularDropdown.classList.remove("dropdown-active");
          })
        }
        if (idx == 2) {
          data.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            tabularDropdown.classList.toggle("dropdown-active");
            tabularDropdownfilter.classList.remove("dropdown-active");
          })
        }
      })

      // stopping propagation from event bubbling..
      tabularDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      })
      tabularDropdownfilter.addEventListener('click', (e) => {
        e.stopPropagation();
      })
      // Removing the dropdowns on body click..
      document.addEventListener('click', () => {
        tabularDropdown.classList.remove("dropdown-active");
        tabularDropdownfilter.classList.remove("dropdown-active");
      });

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

      // add class to list data on minimise click. and globally.
      let tabularListul = this.shadowRoot.querySelector(".list-data");

      if (tabularMinimise) {
        tabularListul.classList.add("list-data-minimise");
      }
      // minimize..
      minimize.addEventListener("click", () => {
        tabularWidget.classList.add("tabular-widget-minimize");
        tabularWidget.classList.remove("tabular-widget-fullscreen");
        tabularDropdown.classList.toggle("dropdown-active");
        if (listData) {
          tabularListul.classList.add("list-data-minimise");
        }
      })

      // Full screen.
      fullScreen.addEventListener("click", () => {
        tabularWidget.classList.add("tabular-widget-fullscreen");
        tabularWidget.classList.remove("tabular-widget-minimize");
        tabularDropdown.classList.toggle("dropdown-active");
        if (listData) {
          tabularListul.classList.remove("list-data-minimise");
        }
      })

      function runPagination() {
        if (enablePagination) {
          // onclick to change the numver of records.
          minimize.addEventListener('click', function () {
            if (listData) {
              limitPerPage = 2;
              if (limitPerPage >= 2) {
                let paginationEle = _this.shadowRoot.querySelector(".pagination");
                console.log(paginationEle.style.display = "flex");
              }
              showPage(1);
            }
            if (tableData) {
              limitPerPage = 3;
              showPage(1);
              if (limitPerPage >= 3) {
                let paginationEle = _this.shadowRoot.querySelector(".pagination");
                console.log(paginationEle.style.display = "flex");
              }
            }
          });

          fullScreen.addEventListener('click', function () {
            limitPerPage = itemsPerPage;
            let totalRecords = Array.from(_this.shadowRoot.querySelectorAll(".list-data>li"));
            if (tableData) {
              totalRecords = Array.from(_this.shadowRoot.querySelectorAll(".ttable tr:not(:first-child)"));
            }

            let totalRecordLength = totalRecords.length;
            if (totalRecordLength < limitPerPage) {
              let paginationEle = _this.shadowRoot.querySelector(".pagination");
              console.log(paginationEle.style.display = "none");
            }
            showPage(1);
          })

          // new Pagination with n buttons and pages..
          // Returns an array of maxLength (or less) page numbers
          // where a 0 in the returned array denotes a gap in the series.
          // Parameters:
          //   totalPages:     total number of pages
          //   page:           current page
          //   maxLength:      maximum size of returned array.
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
          // Total pages rounded upwards
          // Number of buttons at the top, not counting prev/next,
          // but including the dotted buttons.
          // Must be at least 5:
          tabularListData.style.display = "none";
          var currentPage;
          let tableRow = Array.from(_this.shadowRoot.querySelectorAll(".ttable tr:not(:first-child)"));
          let totalListItems = Array.from(_this.shadowRoot.querySelectorAll(".list-data li"));

          function showPage(whichPage) {
            var paginationSize = 6;
            limitPerPage;

            var numberOfItems = tableRow.length || totalListItems.length;
            var totalPages = Math.ceil(numberOfItems / limitPerPage);

            if (whichPage < 1 || whichPage > totalPages) return false;
            currentPage = whichPage;
            var tableData = Array.from(_this.shadowRoot.querySelectorAll(".ttable tr:not(:first-child)"));
            var listData = Array.from(_this.shadowRoot.querySelectorAll(".list-data>li"));
            let contentHide = tableData;
            if (listData.length > 0) {
              contentHide = listData;
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
                  if (drpItemChild.target.className == 'tabularlist-widget__dropdown--sort-filter-list-item active active-border') {
                    if (element.classList.contains("active-row") && element.hasAttribute('data-new')) {
                      element.style.display = "";
                    }
                    if (element.classList.contains("inactive-row") && element.hasAttribute('data-new')) {
                      element.style.display = "none";
                    };
                  }
                  if (drpItemChild.target.className == 'tabularlist-widget__dropdown--sort-filter-list-item inactive active-border') {
                    if (element.classList.contains("inactive-row") && element.hasAttribute('data-new')) {
                      element.style.display = "";
                    };
                    if (element.classList.contains("active-row") && element.hasAttribute('data-new')) {
                      element.style.display = "none";
                    };
                  }

                  if (drpItemChild.target.className == 'tabularlist-widget__dropdown--sort-filter-list-item all active-border') {
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

          // Include the prev/next buttons: create list and a elememt li prev
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

          // oneach button click.
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
          // next button click..
          nextPage.addEventListener("click", () => {
            return showPage(currentPage + 1);
          });
          // previous button click...
          previousPage.addEventListener("click", () => {
            return showPage(currentPage - 1);
          });

          // call showpage with respect to minimise when loading for the first time. 
          if (tabularMinimise) {
            if (listData) {
              limitPerPage = 2;
              showPage(1);
              tabularListul.classList.add("list-data-minimise");
            }

            if (tableData) {
              limitPerPage = 3;
              showPage(1);
            }
          }
        } else {
          let totalRecords = Array.from(_this.shadowRoot.querySelectorAll(".list-data>li"));
          if (tableData) {
            totalRecords = Array.from(_this.shadowRoot.querySelectorAll(".ttable tr:not(:first-child)"));
          }
          tabularDropdownfilterList.forEach(ele => {
            ele.addEventListener('click', function (elem) {
              if (elem.target.className == 'tabularlist-widget__dropdown--sort-filter-list-item active active-border') {
                for (let i = 0; i < totalRecords.length; i++) {
                  if (totalRecords[i].classList.contains("active-row")) {
                    totalRecords[i].style.display = ""
                  }
                  if (totalRecords[i].classList.contains("inactive-row")) {
                    totalRecords[i].style.display = "none"
                  };
                }
              }
              if (elem.target.className == 'tabularlist-widget__dropdown--sort-filter-list-item inactive active-border') {
                for (let i = 0; i < totalRecords.length; i++) {
                  if (totalRecords[i].classList.contains("active-row")) {
                    totalRecords[i].style.display = "none"
                  }
                  if (totalRecords[i].classList.contains("inactive-row")) {
                    totalRecords[i].style.display = ""
                  };
                }
              }
              if (elem.target.className == 'tabularlist-widget__dropdown--sort-filter-list-item all active-border') {
                for (let i = 0; i < totalRecords.length; i++) {
                  if (totalRecords[i].classList.contains("active-row")) {
                    totalRecords[i].style.display = ""
                  }
                  if (totalRecords[i].classList.contains("inactive-row")) {
                    totalRecords[i].style.display = ""
                  };
                }
              }
            })
          })
        }
      }
      runPagination();
      // show pagination buttons if number of records is more than fitting in a screen.
      if (tabularMaximise) {
        let totalRecords = Array.from(_this.shadowRoot.querySelectorAll(".list-data>li"));
        if (tableData) {
          totalRecords = Array.from(_this.shadowRoot.querySelectorAll(".ttable tr:not(:first-child)"));
        }
        let totalRecordLength = totalRecords.length;
        let limit = parseInt(limitPerPage)
        if (totalRecordLength <= limit) {
          let paginationEle = _this.shadowRoot.querySelector('.pagination');
          paginationEle.style.display = "none";
        }
      }
    }, 0);
  }

  static get observedAttributes() {
    return ['theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'theme' && newValue) {
      if (this.shadowRoot) {
        let tag = this.shadowRoot.querySelectorAll('.tabularlist-widget')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      }
    }
  }

}
export default WidgetTabularList;