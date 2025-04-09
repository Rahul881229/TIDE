import styles from './datepicker.scss';
let _this;
class Datepicker extends HTMLElement {
  constructor() {
    super()

    setTimeout(() => {
      // The Markup here..
      var lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
      let theme = (this.getAttribute("theme") == 'light' ? "light-theme" : "dark-theme");
      var callbackFn = this.getAttribute("callback");
      const template = document.createElement('template');
      template.innerHTML = `	
      <style>${styles.toString()}</style>
      <div class="date-picker-wrapper" ${lang}>
      <div class="date-picker ${theme}" >
      <div class="selected-date ${theme}"></div>
      <span class= "date-picker-icon"></span>
      <div class="dates ${theme}">
        <div class="month ${theme}">
          <span class="prev-mth ${theme}"></span>
          <div class="mth ${theme}"></div>
          <span class="next-mth ${theme}"></span>
        </div>
        <div class="weekdays ${theme}">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>
        <div class="days ${theme}"></div>
      </div>
      </div>
    </div>`;

      // shadow root..
      const shadowDOM = this.attachShadow({
        mode: 'open'
      });
      shadowDOM.appendChild(template.content.cloneNode(true));
      _this = this;

      // All the logics.
      const date_picker_element = this.shadowRoot.querySelector('.date-picker');
      let selected_date_element = this.shadowRoot.querySelector('.date-picker .selected-date');
      const dates_element = this.shadowRoot.querySelector('.date-picker .dates');
      const mth_element = this.shadowRoot.querySelector('.date-picker .dates .month .mth');
      const next_mth_element = this.shadowRoot.querySelector('.date-picker .dates .month .next-mth');
      const prev_mth_element = this.shadowRoot.querySelector('.date-picker .dates .month .prev-mth');
      const days_element = this.shadowRoot.querySelector('.date-picker .dates .days');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let datepickerIcon = this.shadowRoot.querySelector(".date-picker-icon");
      let dateFormat = (this.getAttribute("date-format") ? this.getAttribute("date-format") : "");
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();
      let selectedDate = date;
      let selectedDay = day;
      let selectedMonth = month;
      let selectedYear = year;
      selected_date_element.textContent = dateFormat;
      populateDates();

      // changing direction of btns ... 
      if (lang) {
        next_mth_element.style.borderRight = "9px solid #000";
        next_mth_element.style.borderLeft = " none";
        prev_mth_element.style.borderLeft = "9px solid #000";
        prev_mth_element.style.borderRight = "none";
      }

      // getting and setting the optional icons..
      let icon = (this.getAttribute("icon") ? this.getAttribute('icon') : "");
      if (icon) {
        let img = document.createElement("img");
        img.src = icon;
        datepickerIcon.appendChild(img);
      }

      // EVENT LISTENERS
      date_picker_element.addEventListener('click', toggleDatePicker);
      next_mth_element.addEventListener('click', goToNextMonth);
      prev_mth_element.addEventListener('click', goToPrevMonth);
      // datepickerIcon.addEventListener('click', toggleDatePicker);

      // functions.
      function toggleDatePicker(e) {
        if (!checkEventPathForClass(e.path, 'dates')) {
          dates_element.classList.toggle('active');
        }
      }

      function goToNextMonth() {
        month++;
        if (month > 11) {
          month = 0;
          year++;
        }
        date.setMonth(date.getMonth() + 1);
        populateDates();
      }

      function goToPrevMonth() {
        month--;
        if (month < 0) {
          month = 11;
          year--;
        }
        date.setMonth(date.getMonth() - 1);
        populateDates();
      }

      function populateDates() {
        date.setDate(1);
        mth_element.innerHTML = months[date.getMonth()] + ' ' + date.getFullYear()
        const lastDay = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).getDate();

        const prevLastDay = new Date(
          date.getFullYear(),
          date.getMonth(),
          0
        ).getDate();

        const firstDayIndex = date.getDay();
        const lastDayIndex = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).getDay();

        const nextDays = 7 - lastDayIndex - 1;
        let days = "";
        for (let x = firstDayIndex; x > 0; x--) {
          days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
        }

        for (let i = 1; i <= lastDay; i++) {
          if (
            i === new Date().getDate() &&
            date.getMonth() === new Date().getMonth()
          ) {
            days += `<div class="day">${i}</div>`;
          } else {
            days += `<div class="day">${i}</div>`;
          }
        }

        for (let j = 1; j <= nextDays; j++) {
          days += `<div class="next-date">${j}</div>`;
          days_element.innerHTML = days;
        }

        function setSelectedDays() {
          let crtDaysEle = _this.shadowRoot.querySelectorAll('.day');
          for (let i = 0; i < crtDaysEle.length; i++) {
            if (selectedDay == (i + 1) && selectedYear == year && selectedMonth == month) {
              crtDaysEle[i].classList.add('selected');
            }
            // console.log(crtDaysEle[i]);
            crtDaysEle[i].addEventListener("click", () => {
              selectedDate = new Date((year) + '-' + (month + 1) + '-' + (i + 1));
              selectedDay = i + 1;
              if (selectedDay < 10) {
                selectedDay = parseInt(`0${i + 1}`);
              }

              // Start of callback for datePicker
              if (callbackFn) {
                var checkEvent = new CustomEvent("tdatepicker", {
                  bubbles: true,
                  detail: {
                    version: "1.0",
                    method: callbackFn,
                    params: '',
                    data: formatDate(selectedDate)
                  }
                });
                if (_this.dispatchEvent(checkEvent)) {
                  // Do default operation here
                  console.log('Performing default operation');
                } else {
                  console.log("Callback Not Available");
                }
              }
              // End of datepicker callback.
              selectedMonth = month;
              selectedYear = year;
              selected_date_element.textContent = formatDate(selectedDate);
              populateDates();

              try {
                dates_element.classList.remove('active');
              } catch (error) {

              }

            });
            // datepicker callback.
          }
        }
        setSelectedDays();
      };

      let alldayEle = this.shadowRoot.querySelectorAll(".days .day")
      let newAlldayEle = [...alldayEle];

      newAlldayEle.forEach(items => {
        items.addEventListener('click', () => {
          console.log("hey there!");
        })
      })

      // HELPER FUNCTIONS.

      function checkEventPathForClass(path, selector) {
        for (let i = 0; i < path.length; i++) {
          if (path[i].classList && path[i].classList.contains(selector)) {
            return true;
          }
        }
        return false;
      }

      function formatDate(d) {
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

        let dateString = "";
        switch (dateFormat) {
          case 'yyyy-mm-dd':
            // return year + '-' + month + '-' + day; break;
            dateString = year + '-' + month + '-' + day; break;
          case 'dd-mm-yyyy':
            // return day + '-' + month + '-' + year
            dateString = day + '-' + month + '-' + year; break;
          case 'dd/mm/yyyy':
            // return day + '/' + month + '/' + year;
            dateString = day + '/' + month + '/' + year; break;
          case 'mm/dd/yyyy':
            // return month + '/' + day + '/' + year;
            dateString = month + '/' + day + '/' + year; break;
          case 'mm dd yyyy':
            // return months[monthStr] + ' ' + day + ' ' + year;
            dateString = months[monthStr] + ' ' + day + ' ' + year; break;
          case 'dd mm yyyy':
            // return day + ' ' + months[monthStr] + ' ' + year;
            dateString = day + ' ' + months[monthStr] + ' ' + year; break;
          default:
            // return year + '-' + month + '-' + day;
            dateString = year + '-' + month + '-' + day; break;
        }
        return dateString;
      }
    }, 0);
  }
}

export default Datepicker;