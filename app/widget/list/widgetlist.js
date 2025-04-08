import styles from './widgetlist.scss';
let _this;
class WidgetList extends HTMLElement {

  constructor() {
    super();
    setTimeout(() => {
      var lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
      let mode = (this.getAttribute("mode") == 'full' ? "list-widget-fullscreen" : "list-widget-minimize");
      let theme = (this.getAttribute("theme") == 'light' ? "light-theme" : "dark-theme");
      let template = document.createElement('template');
      let thetable = this.getElementsByTagName('table')[0];
      thetable.className = "ttable";
      template.innerHTML = `
        <style>${styles.toString()}</style>
        <div class="list-widget ${mode} ${theme}" ${lang}>
         <div class="list-widget__header-wrap">
          <div class="list-widget__header-heading"> list widget </div>
          <div class="list-widget__header-dropdown-icon-wrap">

            <div class="list-widget__dropdown-toggle sort">
              <img src="./assets/icons/Sorting@2x.png" alt="icon" />
            </div>
    
            <div class="list-widget__dropdown-toggle filter">
              <img src="./assets/icons/filter@2x.png" alt="icon" />
            </div>
    
            <div class="list-widget__dropdown-toggle arr">
               <img src="./assets/icons/WidgetArrow_Defautl@2x.png">
            </div>
          </div>
    
          <div class="list-widget__dropdown--sort-filter">
            <h3 class="list-widget__dropdown--sort-filter-heading"></h3>
            <h3 class="list-widget__dropdown--sort-filter-list-heading">By Status</h3>
            <ul class="list-widget__dropdown--sort-filter-list">
              <li class="list-widget__dropdown--sort-filter-list-item active">
               <span class="active-items"></span> Active </li>
              <li class="list-widget__dropdown--sort-filter-list-item inactive">
               <span class="inactive-items"></span> Inactive </li>
               <span class="list-bottom-border"></span>
              <li class="list-widget__dropdown--sort-filter-list-item all">No Filter</li>
            </ul>
          </div>
    
          <div class="list-widget__dropdown">
            <h3 class="list-widget__dropdown-heading"> Widget Menu </h3>
            <ul class="list-widget__dropdown-list">
              <li class="list-widget__dropdown-list-item">
                <span class="list-widget__dropdown-list-item-icon">
                   <img src="./assets/icons/expand@2x.png" alt="icon">
                </span>
                <span class="list-widget__dropdown-list-item-text">
                  new window
                </span>
              </li>
    
              <li class="list-widget__dropdown-list-item">
                <span class="list-widget__dropdown-list-item-icon">
                   <img src="./assets/icons/Fullscreen@2x.png" alt="icon">
                </span>
                <span class="list-widget__dropdown-list-item-text">
                  full screen
                </span>
              </li>
    
              <li class="list-widget__dropdown-list-item">
                <span class="list-widget__dropdown-list-item-icon">
                  <img src="./assets/icons/Minimise@2x.png" alt="icon">
                </span>
                <span class="list-widget__dropdown-list-item-text">
                  minimize
                </span>
              </li>
    
              <li class="list-widget__dropdown-list-item">
                <span class="list-widget__dropdown-list-item-icon">
                   <img src="./assets/icons/download@2x.png" alt="icon">
                </span>
                <span class="list-widget__dropdown-list-item-icon">
                  download
                </span>
              </li>

              <li class="list-widget__dropdown-list-item">
                <span class="list-widget__dropdown-list-item-icon">
                    <img src="./assets/icons/share@2x.png" alt="icon">
                </span>
                <span class="list-widget__dropdown-list-item-text"> share </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="list-widget__table-data"> </div> 
 
    </div>`;
      const shadowRoot = this.attachShadow({
        mode: 'open'
      });

      shadowRoot.appendChild(template.content.cloneNode(true));
      _this = this;

      // the javascript logics..
      let tableWrap = this.shadowRoot.querySelector(".list-widget__table-data");
      tableWrap.appendChild(thetable);



      let listWidget = this.shadowRoot.querySelector('.list-widget');
      let listToggleBtn = this.shadowRoot.querySelectorAll('.list-widget__dropdown-toggle');
      let listDropdown = this.shadowRoot.querySelector('.list-widget__dropdown');
      let listDropdownfilterList = this.shadowRoot.querySelectorAll('.list-widget__dropdown--sort-filter-list-item');
      let listDropdownfilter = this.shadowRoot.querySelector('.list-widget__dropdown--sort-filter');
      let newWindow = this.shadowRoot.querySelector('.list-widget__dropdown-list-item:nth-child(1)');
      let fullScreen = this.shadowRoot.querySelector('.list-widget__dropdown-list-item:nth-child(2)');
      let minimize = this.shadowRoot.querySelector('.list-widget__dropdown-list-item:nth-child(3)');
      let sortfilterHeading = this.shadowRoot.querySelector(".list-widget__dropdown--sort-filter-heading");
      let activeRow = this.shadowRoot.querySelectorAll(".active-row");
      let inactiveRow = this.shadowRoot.querySelectorAll(".inactive-row");

      console.log(activeRow);

      newWindow.addEventListener("click", () => {
        console.log("Go to new window");
      });

      // Event listeners..
      for (let i = 0; i < listToggleBtn.length; i++) {
        listToggleBtn[0].addEventListener("click", () => {
          listDropdownfilter.classList.toggle("dropdown-active");
          listDropdownfilter.style.right = "70px";
          sortfilterHeading.textContent = "Sort";
        });

        // Filter..
        listToggleBtn[1].addEventListener("click", () => {
          listDropdownfilter.classList.toggle("dropdown-active");
          listDropdownfilter.style.right = "46px";
          sortfilterHeading.textContent = "Filter";
        });

        // Arrow button..
        listToggleBtn[2].addEventListener("click", () => {
          listDropdown.classList.toggle("dropdown-active");
        });
      }

      for (var i = 0; i < listDropdownfilterList.length; i++) {
        listDropdownfilterList[i].addEventListener('click', activateClass);
      }

      function activateClass(ele) {
        for (var i = 0; i < listDropdownfilterList.length; i++) {
          listDropdownfilterList[i].classList.remove('active-border');
        }
        ele.target.classList.add('active-border');
      }

      // minimize..
      minimize.addEventListener("click", () => {
        listWidget.classList.add("list-widget-minimize");
        listWidget.classList.remove("list-widget-fullscreen");
        listDropdown.classList.toggle("dropdown-active");
      })

      // Full screen.
      fullScreen.addEventListener("click", () => {
        listWidget.classList.add("list-widget-fullscreen");
        listWidget.classList.remove("list-widget-minimize");
        listDropdown.classList.toggle("dropdown-active");
      })

      // pagination functionalities.
      let itemsPerPage = (this.getAttribute("itemsPerPage") ? this.getAttribute("itemsPerPage") : "13")
      // number of rows per page..
      var $n = (itemsPerPage ? parseInt(itemsPerPage) : 4);
      console.log("the n value", $n);
      var $table = this.shadowRoot.querySelector(".ttable"),
        // number of rows of the table
        $rowCount = $table.rows.length,

        // get the first cell's tag name (in the first row)
        $firstRow = $table.rows[0].firstElementChild.tagName,

        // boolean var to check if table has a head row
        $hasHead = ($firstRow === "TH"),
        // an array to hold each row
        $tr = [],

        // loop counters, to start count from rows[1] (2nd row) if the first row has a head tag.

        $i, $ii, $j = ($hasHead) ? 1 : 0,

        // holds the first row if it has a (<TH>) & nothing if (<TD>)

        $th = ($hasHead ? $table.rows[(0)].outerHTML : "");

      // console.log("the row count=>", $rowCount);

      // count the number of pages...
      var $pageCount = Math.ceil($rowCount / $n);

      console.log("pageCount =>", $pageCount);

      // if we had one page only, then we have nothing to do..

      if ($pageCount > 1) {

        // assign each row outHTML (tag name & innerHTML) to the array
        for ($i = $j, $ii = 0; $i < $rowCount; $i++, $ii++)
          $tr[$ii] = $table.rows[$i].outerHTML;

        // create a div block to hold the buttons..

        $table.insertAdjacentHTML("afterend", "<div id='buttons'></div");
        // the first sort, default page is the first one..
        sort(1);
      }

      //  var $prevDis = ($cur == 1) ? "disabled" : "",
      //   $nextDis = ($cur == $pCount) ? "disabled" : "",

      // ($p) is the selected page number. it will be generated when a user clicks a button
      function sort($p) {
        console.log("the p", $p);
        /* create ($rows) a variable to hold the group of rows...
         ** to be displayed on the selected page,
         ** ($s) the start point .. the first row in each page, Do The Math
         */
        var $rows = $th,
          $s = (($n * $p) - $n);
        for ($i = $s; $i < ($s + $n) && $i < $tr.length; $i++)
          $rows += $tr[$i];

        // now the table has a processed group of rows.
        $table.innerHTML = $rows;

        // create the pagination buttons.
        // _this.shadowRoot.getElementById("buttons").innerHTML = pageButtons($pageCount, $p);
        pageButtons($pageCount, $p);

        // css Stuff.
        // to add active class.
        _this.shadowRoot.getElementById("id" + $p).setAttribute("class", "active-page");
      }

      function pageButtons($pCount, $cur) {
        console.log("pafnknfkd", $pCount);
        let prevDis = ($cur == 1) ? "disabled" : "";
        let nextDis = ($cur == $pCount) ? "disabled" : "";
        let buttonsString = "<input type='button' value='Prev' class='prev-btn' data-newattrprev= '" + ($cur - 1) + "' " + prevDis + ">";
        for ($i = 1; $i <= $pageCount; $i++) {
          buttonsString += "<input type='button' class='pagenoBtn' id='id" + $i + "'value='" + $i + " '>";
        }
        buttonsString += "<input type='button' class='next-btn' value='Next' data-newattrnext= '" + ($cur + 1) + "'" + nextDis + ">";
        _this.shadowRoot.getElementById("buttons").innerHTML = buttonsString;

        let prevBtn = _this.shadowRoot.querySelector(".prev-btn");
        let pagenoBtn = _this.shadowRoot.querySelectorAll(".pagenoBtn");
        let nextBtn = _this.shadowRoot.querySelector(".next-btn");

        pagenoBtn.forEach(element => {
          element.addEventListener("click",
            sort.bind(null, parseInt(element.getAttribute("value"))));
        });

        prevBtn.addEventListener("click",
          sort.bind(null, parseInt(prevBtn.getAttribute("data-newattrprev"))));

        nextBtn.addEventListener("click",
          sort.bind(null, parseInt(nextBtn.getAttribute("data-newattrnext"))));
      }

      // sort filter action..
      // let totalAvailRow = $table.children[0].children;
      listDropdownfilterList.forEach(ele => {
        ele.addEventListener("click", (elm) => {
          if (elm.target.className == 'list-widget__dropdown--sort-filter-list-item active active-border') {
            console.log("nbjfdf", totalAvailRow);
            let totalAvailRow = $table.children[0].children;
            for (let i = 0; i < totalAvailRow.length; i++) {
              if (totalAvailRow[i].classList.contains("active-row")) {
                totalAvailRow[i].style.display = ""
              };
              if (totalAvailRow[i].classList.contains("inactive-row")) {
                totalAvailRow[i].style.display = "none"
              };
            }
            inactiveRow.forEach(ele => {
              ele.style.display = "none";
            })
            activeRow.forEach(ele => {
              ele.style.display = "";
            })
          }

          if (elm.target.className == 'list-widget__dropdown--sort-filter-list-item inactive active-border') {
            let totalAvailRow = $table.children[0].children;
            for (let i = 0; i < totalAvailRow.length; i++) {
              if (totalAvailRow[i].classList.contains("active-row")) {
                totalAvailRow[i].style.display = "none"
              };
              if (totalAvailRow[i].classList.contains("inactive-row")) {
                totalAvailRow[i].style.display = ""
              };
            }

            inactiveRow.forEach(ele => {
              ele.style.display = "";
            })
            activeRow.forEach(ele => {
              ele.style.display = "none";
            })
          }

          if (elm.target.className === 'list-widget__dropdown--sort-filter-list-item all active-border') {
            let totalAvailRow = $table.children[0].children;
            for (let i = 0; i < totalAvailRow.length; i++) {

              if (totalAvailRow[i].classList.contains("active-row")) {
                totalAvailRow[i].style.display = ""
              };

              if (totalAvailRow[i].classList.contains("inactive-row")) {
                totalAvailRow[i].style.display = ""
              };

            }

            inactiveRow.forEach(ele => {
              ele.style.display = "";
            })

            activeRow.forEach(ele => {
              ele.style.display = "";
            })
          }
        })
      })
    }, 0);
  }

  static get observedAttributes() {
    return ['theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'theme' && newValue) {
      if (this.shadowRoot) {
        let tag = this.shadowRoot.querySelectorAll('.list-widget')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      }
    }
  }

}
export default WidgetList;