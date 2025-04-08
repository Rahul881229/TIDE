import styles from './datetimepicker.scss';
let _this;
class DateTimePicker extends HTMLElement {
  constructor() {
    super()

    setTimeout(() => {
      // The Markup here..
      var lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : 'dark';
      var callbackFn = this.getAttribute("callback");

      let timeRequired = (this.hasAttribute("time") ? (this.getAttribute("time") == "true" ? true : false) : false);

      const template = document.createElement('template');
      template.innerHTML = `	
      <style>${styles.toString()}</style>
      <div class="date-picker-wrapper ${theme}" ${lang}>
        <div class="date-picker" >
          <div class="selected-date"></div>
          <span class= "date-picker-icon">
            <img src="data:image/png;base64,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">
          </span>
            <div class="dates">
              <div class="dateTimeContent">
                <div class="month">
                  <span class="prev-mth"></span>
                  <div class="mth"></div>
                  <span class="next-mth"></span>
                </div>
                <div class="weekdays">
                  <div>SUN</div>
                  <div>MON</div>
                  <div>TUE</div>
                  <div>WED</div>
                  <div>THU</div>
                  <div>FRI</div>
                  <div>SAT</div>
                </div>
                <div class="days"></div>
                
                <hr class="${timeRequired ? 'timeEnabled' : 'timeDisabled'}">

                <div class="timepicker-wrap ${timeRequired ? 'timeEnabled' : 'timeDisabled'}">
                  <div class="time-picker" data-time="00:00">
                    <div class="hour">
                      <label class="timeIndic">Hour</label>
                      <div class="hr-up"></div>
                      <input type="number" class="hr" value="00" min="1" max="23"  maxlength = "2"/>
                      <div class="hr-down"></div>
                    </div>
                    <div class="separator">:</div>
                    <div class="minute">  
                      <label class="timeIndic">Min</label>
                      <div class="min-up"></div>
                      <input type="number" class="min" value="00" min="1" max="59"  maxlength = "2">
                      <div class="min-down"></div>
                    </div>
                    <div class="separator">:</div>
                    <div class="second">
                      <label class="timeIndic">Sec</label>
                      <div class="sec-up"></div>
                      <input type="number" class="sec" value="00" min="1" max="59"  maxlength = "2">
                      <div class="sec-down"></div>
                    </div>
                  </div>
                </div>



              </div>
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
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      let datepickerIcon = this.shadowRoot.querySelector(".date-picker-icon");
      let dateFormat = (this.hasAttribute("format") ? this.getAttribute("format") : "");
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();
      let selectedDate = date;
      let selectedDay = day;
      let selectedMonth = month;
      let selectedYear = year;
      selected_date_element.textContent = (timeRequired ? lang ? "HH:mm:ss " + dateFormat : dateFormat + " HH:mm:ss" : dateFormat);
      populateDates();


      // TIME ELEMENTS
      const hr_element = this.shadowRoot.querySelector('.time-picker .hour .hr');
      const min_element = this.shadowRoot.querySelector('.time-picker .minute .min');
      const sec_element = this.shadowRoot.querySelector('.time-picker .second .sec');

      const hr_up = this.shadowRoot.querySelector('.time-picker .hour .hr-up');
      const hr_down = this.shadowRoot.querySelector('.time-picker .hour .hr-down');

      const min_up = this.shadowRoot.querySelector('.time-picker .minute .min-up');
      const min_down = this.shadowRoot.querySelector('.time-picker .minute .min-down');

      const sec_up = this.shadowRoot.querySelector('.time-picker .second .sec-up');
      const sec_down = this.shadowRoot.querySelector('.time-picker .second .sec-down');

      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      let timePicker = "";
      setTime();

      hr_element.oninput = function () {
        if (this.value.length > 2) {
          this.value = this.value.slice(0, 2);
        }
      }

      min_element.oninput = function () {
        if (this.value.length > 2) {
          this.value = this.value.slice(0, 2);
        }
      }

      sec_element.oninput = function () {
        if (this.value.length > 2) {
          this.value = this.value.slice(0, 2);
        }
      }

      hr_up.addEventListener('click', hour_up);
      hr_down.addEventListener('click', hour_down);

      min_up.addEventListener('click', minute_up);
      min_down.addEventListener('click', minute_down);

      sec_up.addEventListener('click', second_up);
      sec_down.addEventListener('click', second_down);

      hr_element.addEventListener('change', hour_change);
      min_element.addEventListener('change', minute_change);
      sec_element.addEventListener('change', second_change);

      function hour_up() {
        hour++;
        if (hour > 23) {
          hour = 0;
        }
        setTime();
      }

      function hour_down() {
        hour--;
        if (hour < 0) {
          hour = 23;
        }
        setTime();
      }

      function minute_up() {
        minute++;
        if (minute > 59) {
          minute = 0;
          hour++;
        }
        setTime();
      }

      function minute_down() {
        minute--;
        if (minute < 0) {
          minute = 59;
          hour--;
        }
        setTime();
      }

      function second_up() {
        second++;
        if (second > 59) {
          second = 0;
          minute++;
        }
        setTime();
      }

      function second_down() {
        second--;
        if (second < 0) {
          second = 59;
          minute--;
        }
        setTime();
      }

      function setTime() {
        hr_element.value = formatTime(hour);
        min_element.value = formatTime(minute);
        sec_element.value = formatTime(second);
        // console.log("Time -> ", formatTime(hour) + ':' + formatTime(minute) + ':' + formatTime(second));
        // time_picker_element.dataset.time = formatTime(hour) + ':' + formatTime(minute) + ':' + formatTime(second);
        timePicker = formatTime(hour) + ':' + formatTime(minute) + ':' + formatTime(second);
      }

      function formatTime(time) {
        if (time < 10) {
          time = '0' + time;
        }
        return time;
      }

      function hour_change(e) {
        if (e.target.value > 23) {
          e.target.value = 23;

        } else if (e.target.value < 0) {
          e.target.value = '00';
        }

        if (e.target.value == "") {
          e.target.value = formatTime(hour);
        }
        hour = e.target.value;
      }

      function minute_change(e) {
        if (e.target.value > 59) {
          e.target.value = 59;
        } else if (e.target.value < 0) {
          e.target.value = '00';
        }

        if (e.target.value == "") {
          e.target.value = formatTime(minute);
        }
        minute = e.target.value;
      }

      function second_change(e) {
        if (e.target.value > 59) {
          e.target.value = 59;
        } else if (e.target.value < 0) {
          e.target.value = '00';
        }

        if (e.target.value == "") {
          e.target.value = formatTime(second);
        }
        second = e.target.value;
      }

      // changing direction of btns ... 
      if (lang) {
        next_mth_element.style.borderRight = "9px solid #000";
        next_mth_element.style.borderLeft = " none";
        prev_mth_element.style.borderLeft = "9px solid #000";
        prev_mth_element.style.borderRight = "none";
      }

      // getting and setting the optional icons..
      // let icon = (this.getAttribute("icon") ? this.getAttribute('icon') : "");
      // if (icon) {
      //   let img = document.createElement("img");
      //   img.src = icon;
      //   datepickerIcon.appendChild(img);
      // }

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
          if (i === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
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
              let dateReturn = formatDate(selectedDate);
              if (timeRequired) {
                dateReturn = formatDate(selectedDate) + " " + timePicker;
              }

              if (callbackFn) {
                var checkEvent = new CustomEvent("tdatepicker", {
                  bubbles: true,
                  detail: {
                    version: "1.0",
                    method: callbackFn,
                    params: '',
                    data: dateReturn
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
              selected_date_element.textContent = dateReturn;//formatDate(selectedDate);
              // populateDates();
              // setTime();

              try {
                dates_element.classList.remove('active');
              } catch (error) {

              }

            });
            // datepicker callback.
          }
        }
        setSelectedDays();
      }

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

  static get observedAttributes() {
    return ['theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'theme' && newValue) {
      if (this.shadowRoot) {
        let tag = this.shadowRoot.querySelectorAll('.date-picker-wrapper')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      }
    }
  }
}

export default DateTimePicker;