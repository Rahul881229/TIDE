import styles from './timepicker.scss';
let _this;
class Timepicker extends HTMLElement {
  constructor() {
    super();
    setTimeout(() => {
      const template = document.createElement('template');
      template.innerHTML = `
        <style>${styles.toString()}</style>
        <div class="timepicker-wrap">
          <div class= "timepicker-element-wrap">
            <div class="timepicker-element"></div>
            <span class="timepicker-icon"></span>
          </div>
          <div class="time-picker" data-time="00:00">
            <div class="hour">
              <div class="hr-up"></div>
              <input type="number" class="hr" value="00" min="1" max="23"  maxlength = "2"/>
              <div class="hr-down"></div>
            </div>
            <div class="separator">:</div>
            <div class="minute">  
              <div class="min-up"></div>
              <input type="number" class="min" value="00" min="1" max="59"  maxlength = "2">
              <div class="min-down"></div>
            </div>
            <div class="separator">:</div>
            <div class="second">
              <div class="sec-up"></div>
              <input type="number" class="sec" value="00" min="1" max="59"  maxlength = "2">
              <div class="sec-down"></div>
            </div>
          </div>
        </div>`;

      // Mode Open
      const shadowDOM = this.attachShadow({
        mode: 'open'
      });
      shadowDOM.appendChild(template.content.cloneNode(true));
      _this = this;
      // Logics..
      const time_picker_element = this.shadowRoot.querySelector('.time-picker');
      const hr_element = this.shadowRoot.querySelector('.time-picker .hour .hr');
      const min_element = this.shadowRoot.querySelector('.time-picker .minute .min');
      const sec_element = this.shadowRoot.querySelector('.time-picker .second .sec');

      const hr_up = this.shadowRoot.querySelector('.time-picker .hour .hr-up');
      const hr_down = this.shadowRoot.querySelector('.time-picker .hour .hr-down');

      const min_up = this.shadowRoot.querySelector('.time-picker .minute .min-up');
      const min_down = this.shadowRoot.querySelector('.time-picker .minute .min-down');

      const sec_up = this.shadowRoot.querySelector('.time-picker .second .sec-up');
      const sec_down = this.shadowRoot.querySelector('.time-picker .second .sec-down');

      let timePickerEle = this.shadowRoot.querySelector(".timepicker-element");
      let timePickerIcon = this.shadowRoot.querySelector(".timepicker-icon");
      var callbackFn = this.getAttribute("callback");
      timePickerEle.textContent = "choose time.."

      // icon are getting show conditionally.
      let icon = (this.getAttribute("icon") ? this.getAttribute("icon") : " ");
      if (icon) {
        let img = document.createElement("img");
        img.src = icon;
        timePickerIcon.appendChild(img);
      }

      timePickerEle.addEventListener("click", () => {
        time_picker_element.classList.toggle("active");
        let selectedTime = formatTime(hour) + ':' + formatTime(minute) + ':' + formatTime(second);
        timePickerEle.textContent = selectedTime;
        // timepicker callback..
        if (callbackFn) {
          var checkEvent = new CustomEvent("ttimepicker", {
            bubbles: true,
            detail: {
              version: "1.0",
              method: callbackFn,
              params: '',
              data: selectedTime
            }
          });
          if (this.dispatchEvent(checkEvent)) {
            // Do default operation here.
            console.log('Performing default operation');
          } else {
            console.log("Callback Not Available");
          }
        }
      });

      let d = new Date();
      let hour = d.getHours();
      let minute = d.getMinutes();
      let second = d.getSeconds();
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

      // EVENT LISTENERS...
      hr_up.addEventListener('click', hour_up);
      hr_down.addEventListener('click', hour_down);

      min_up.addEventListener('click', minute_up);
      min_down.addEventListener('click', minute_down);

      sec_up.addEventListener('click', second_up);
      sec_down.addEventListener('click', second_down);

      hr_element.addEventListener('change', hour_change);
      min_element.addEventListener('change', minute_change);
      sec_element.addEventListener('change', second_change);

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
        time_picker_element.dataset.time = formatTime(hour) + ':' + formatTime(minute) + ':' + formatTime(second);
      }

      function formatTime(time) {
        if (time < 10) {
          time = '0' + time;
        }
        return time;
      }
    }, 0);
  }
}

export default Timepicker;