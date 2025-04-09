import styles from "./timepicker.scss";

class Timepicker extends HTMLElement {
  d = new Date();

  hour = this.d.getHours();
  minute = this.d.getMinutes();
  second = this.d.getSeconds();

  hourName = "Hour";
  minuteName = "Min";
  secondName = "Sec";

  minTime = "";
  minimumHour = null;
  minimumMin = null;
  minimumSec = null;

  maxTime = "";
  maximumHour = null;
  maximumMin = null;
  maximumSec = null;
  isTimePickervisible = false;
  selectedTime = "";
  placeholder = "";
  icon = "";

  constructor() {
    super();
    setTimeout(() => {
      let theme = this.hasAttribute("theme")
        ? this.getAttribute("theme")
        : "dark";

      let value = this.hasAttribute("value") ? this.getAttribute("value") : "";

      let lang = this.hasAttribute("lang") ? this.getAttribute("lang") : "en";


      if (lang == "ar") {
        this.hourName = "ساعة";
        this.minuteName = "دقيقة";
        this.secondName = "ثانية";
      }


      let disabled = this.hasAttribute("disabled")
        ? this.getAttribute("disabled") == "true"
          ? "disabled"
          : ""
        : "";

      this.placeholder = this.hasAttribute("placeholder")
        ? this.getAttribute("placeholder")
        : "";

      this.icon = this.hasAttribute("icon")
        ? this.getAttribute("icon")
        : "";

      var fontsize = "sm";
      if (this.hasAttribute("small") || this.hasAttribute("sm")) {
        fontsize = "sm";
      } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
        fontsize = "lg";
      }

      this.minTime = this.hasAttribute("min") ? this.getAttribute("min") : "";
      if (this.minTime != "") {
        this.minTime = this.minTime.split(":");
        // Extract hours, minutes, and seconds from the resulting array
        this.minimumHour = parseInt(this.minTime[0]);
        this.minimumMin = parseInt(this.minTime[1]);
        this.minimumSec = parseInt(this.minTime[2]);
        // console.log(
        //   "Min hour min sec ->",
        //   this.minimumHour,
        //   this.minimumMin,
        //   this.minimumSec
        // );
      }

      this.maxTime = this.hasAttribute("max") ? this.getAttribute("max") : "";
      if (this.maxTime != "") {
        this.maxTime = this.maxTime.split(":");
        // Extract hours, minutes, and seconds from the resulting array
        this.maximumHour = parseInt(this.maxTime[0]);
        this.maximumMin = parseInt(this.maxTime[1]);
        this.maximumSec = parseInt(this.maxTime[2]);
        // console.log(
        //   "Max hour min sec ->",
        //   this.maximumHour,
        //   this.maximumMin,
        //   this.maximumSec
        // );
      }

      // this.hour = 13;
      // this.minute = 45;
      // this.second = 45;

      const template = document.createElement("template");
      template.innerHTML = `
      <style> ${styles.toString()} </style>
      <div class="time-picker-container ${theme}"> 
      <div class="time-picker-icon">      
        ${this.icon ? `<img class="date-image" src="${this.icon}"/>` : ''}
      </div>
      <div class="time-picker-content">    
      <button class="time-picker-button ${theme}" type="button" aria-label="${this.placeholder}">
        ${this.placeholder} </button>
      </div>
      </div>
	    <div class="time-picker ${theme} ${this.isTimePickervisible ? "visible-time-picker" : ""}"
         data-time="00:00">
      <div class="label">${this.hourName}</div>
        <div class="hour">
			    <div class="hr-up ${disabled}"></div>
			      <input type="number" class="hr ${theme} ${fontsize}" value="${this.hour}" readonly/>
			    <div class="hr-down ${disabled}"></div>
		    </div>
        <div class="label">${this.minuteName}</div>
		    <div class="minute">
			    <div class="min-up ${disabled}"></div>
			      <input type="number" class="min ${theme} ${fontsize}" value="${this.minute}" readonly>
			    <div class="min-down ${disabled}"></div>
		    </div>
        <div class="label">${this.secondName}</div>
        <div class="second">
			    <div class="sec-up ${disabled}"></div>
			      <input type="number" class="sec ${theme} ${fontsize}" value="${this.second}" readonly>
			    <div class="sec-down ${disabled}"></div>
		    </div>
      </div>
      `;
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      // Custom event for time change callback
      this.timepicker_container = this.shadowRoot.querySelector(".time-picker-container");
      this.inputElement = this.shadowRoot.querySelector(".time-picker-button");
      this.time_picker_element = this.shadowRoot.querySelector(".time-picker");
      this.hr_element = this.shadowRoot.querySelector(".time-picker .hour .hr");
      this.sec_element = this.shadowRoot.querySelector(".time-picker .second .sec");
      this.min_element = this.shadowRoot.querySelector(".time-picker .minute .min");

      this.hr_up = this.shadowRoot.querySelector(".time-picker .hour .hr-up");
      this.hr_down = this.shadowRoot.querySelector(".time-picker .hour .hr-down");

      this.min_up = this.shadowRoot.querySelector(".time-picker .minute .min-up");
      this.min_down = this.shadowRoot.querySelector(".time-picker .minute .min-down");

      this.sec_up = this.shadowRoot.querySelector(".time-picker .second .sec-up");
      this.sec_down = this.shadowRoot.querySelector(".time-picker .second .sec-down");

      // this.setTime();

      //Time Picker EVENT LISTENERS
      this.hr_up.addEventListener("click", () => this.hour_up());
      this.hr_down.addEventListener("click", () => this.hour_down());

      this.min_up.addEventListener("click", () => this.minute_up());
      this.min_down.addEventListener("click", () => this.minute_down());

      this.sec_up.addEventListener("click", () => this.second_up());
      this.sec_down.addEventListener("click", () => this.second_down());

      this.hr_element.addEventListener("change", () => this.hour_change());
      this.min_element.addEventListener("change", () => this.minute_change());
      this.sec_element.addEventListener("change", () => this.second_change());

      this.timepicker_container.addEventListener("click", () => {
        this.isTimePickervisible = true;
        this.toggleTimePicker();
      });
    }, 0);
  }

  connectedCallback() {
    document.addEventListener("click", (e) => this.handleClickOut(e));
  }

  handleClickOut(e) {
    if (this.isTimePickervisible && this !== e.target) {
      this.isTimePickervisible = false;
      this.time_picker_element.classList.remove("visible-time-picker");
    }
  }

  toggleTimePicker() {
    if (this.isTimePickervisible) {
      this.time_picker_element.classList.add("visible-time-picker");
    } else {
      this.time_picker_element.classList.remove("visible-time-picker");
    }
  }

  hour_change(e) {
    if (e.target.value > 23) {
      e.target.value = 23;
    } else if (e.target.value < 0) {
      e.target.value = "00";
    }

    if (e.target.value == "") {
      e.target.value = this.formatTime(this.hour);
    }
    this.hour = e.target.value;
  }

  minute_change(e) {
    if (e.target.value > 59) {
      e.target.value = 59;
    } else if (e.target.value < 0) {
      e.target.value = "00";
    }

    if (e.target.value == "") {
      e.target.value = this.formatTime(this.minute);
    }
    this.minute = e.target.value;
  }

  second_change() {
    if (e.target.value > 59) {
      e.target.value = 59;
    } else if (e.target.value < 0) {
      e.target.value = "00";
    }

    if (e.target.value == "") {
      e.target.value = this.formatTime(this.second);
    }
    this.second = e.target.value;
  }

  hour_up() {
    if (this.maxTime !== "" && this.hour + 1 <= this.maximumHour) {
      this.hour++;
      if (this.hour > 23) {
        this.hour = 0;
      }
      this.setTime();
    } else if (this.minTime !== "" && this.maxTime === "" &&
      this.hour + 1 >= this.minimumHour && this.hour + 1 !== 24) {
      this.hour++;
      if (this.hour > 23) {
        this.hour = 0;
      }
      this.setTime();
    } else if (this.minTime === "" && this.maxTime === "") {
      this.hour++;
      if (this.hour > 23) {
        this.hour = 0;
      }
      this.setTime();
    }
  }

  hour_down() {
    //13>=12
    if (this.minTime !== "" && this.hour - 1 >= this.minimumHour) {
      this.hour--;
      if (this.hour < 0) {
        this.hour = 23;
      }
      this.setTime();
    } else if (this.minTime === "" && this.maxTime === "") {
      this.hour--;
      if (this.hour < 0) {
        this.hour = 23;
      }
      this.setTime();
    } else if (this.minTime === "" && this.hour - 1 <= this.maximumHour &&
      this.hour - 1 !== 0) {
      this.hour--;
      if (this.hour < 0) {
        this.hour = 23;
      }
      this.setTime();
    }
  }

  minute_up() {
    if (this.minTime !== "" && this.minute + 1 <= this.maximumMin) {
      this.minute++;
      if (this.minute > 59) {
        this.minute = 0;
        this.hour++;
      }
      this.setTime();
    } else if (this.minTime !== "" && this.maxTime === "" &&
      this.minute + 1 >= this.minimumMin && this.minute + 1 !== 60) {
      this.minute++;
      if (this.minute > 59) {
        this.minute = 0;
        this.hour++;
      }
      this.setTime();
    } else if (this.minTime === "" && this.maxTime === "") {
      this.minute++;
      if (this.minute > 59) {
        this.minute = 0;
        this.hour++;
      }
      this.setTime();
    }
  }

  minute_down() {
    if (this.minTime !== "" && this.minute - 1 >= this.minimumMin) {
      this.minute--;
      if (this.minute < 0) {
        this.minute = 59;
        this.hour--;
      }
      this.setTime();
    } else if (this.minTime === "" && this.maxTime === "") {
      this.minute--;
      if (this.minute < 0) {
        this.minute = 59;
        this.hour--;
      }
      this.setTime();
    } else if (this.minTime === "" && this.minute - 1 <= this.maximumMin &&
      this.minute - 1 !== 0) {
      this.minute--;
      if (this.minute < 0) {
        this.minute = 59;
        this.hour--;
      }
      this.setTime();
    }
  }

  second_up() {
    if (this.minTime !== "" && this.second + 1 <= this.maximumSec) {
      this.second++;
      if (this.second > 59) {
        this.second = 0;
        this.minute++;
      }
      this.setTime();
    } else if (this.minTime !== "" && this.maxTime === "" &&
      this.second + 1 >= this.minimumSec && this.second + 1 !== 60) {
      this.second++;
      if (this.second > 59) {
        this.second = 0;
        this.minute++;
      }
      this.setTime();
    } else if (this.minTime === "" && this.maxTime === "") {
      this.second++;
      if (this.second > 59) {
        this.second = 0;
        this.minute++;
      }
      this.setTime();
    }
  }

  second_down() {
    if (this.minTime !== "" && this.second - 1 >= this.minimumSec) {
      this.second--;
      if (this.second < 0) {
        this.second = 59;
        this.minute--;
      }
      this.setTime();
    } else if (this.minTime === "" && this.maxTime === "") {
      this.second--;
      if (this.second < 0) {
        this.second = 59;
        this.minute--;
      }
      this.setTime();
    } else if (
      this.minTime === "" &&
      this.second - 1 <= this.maximumSec &&
      this.second - 1 !== 0
    ) {
      this.second--;
      if (this.second < 0) {
        this.second = 59;
        this.minute--;
      }
      this.setTime();
    }
  }

  setTime() {
    this.hr_element.value = this.formatTime(this.hour);
    this.min_element.value = this.formatTime(this.minute);
    this.sec_element.value = this.formatTime(this.second);
    this.time_picker_element.dataset.time =
      this.formatTime(this.hour) +
      ":" +
      this.formatTime(this.minute) +
      ":" +
      this.formatTime(this.second);

    this.selectedTime = this.time_picker_element.dataset.time;
    this.inputElement.textContent = this.selectedTime;
    const selectedTimeEvent = new CustomEvent("selectedTime", {
      bubbles: true,
      detail: {
        time: this.selectedTime,
        hour: this.formatTime(this.hour),
        minute: this.formatTime(this.minute),
        second: this.formatTime(this.second),
        version: "2.2.22",
        method: this.getAttribute("callback"),
      },
    });
    this.dispatchEvent(selectedTimeEvent);
  }

  formatTime(time) {
    if (time < 10) {
      time = "0" + time;
    }
    return time;
  }

  // Define the observed attributes
  static get observedAttributes() {
    return ["theme", "lang", "disabled", "min", "max", "placeholder"];
  }

  updateLanguage() {
    const labels = this.shadowRoot.querySelectorAll(".label");
    labels[0].textContent = this.hourName;
    labels[1].textContent = this.minuteName;
    labels[2].textContent = this.secondName;
  }

  // Handle changes to observed attributes
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      if (name && newValue) {
        console.log("Inside attributeChangedCallback :", name);
        switch (name) {
          case "theme":
            let divTag = this.shadowRoot.querySelectorAll(".time-picker")[0];
            let hourClass = this.shadowRoot.querySelectorAll(".hr")[0];
            let minuteClass = this.shadowRoot.querySelectorAll(".min")[0];
            let secondClass = this.shadowRoot.querySelectorAll(".sec")[0];
            let timePickerContainer = this.shadowRoot.querySelectorAll(".time-picker-container")[0];
            let timePickerButton = this.shadowRoot.querySelectorAll(".time-picker-button")[0];
            if (oldValue) {
              divTag.classList.remove(oldValue);
              hourClass.classList.remove(oldValue);
              minuteClass.classList.remove(oldValue);
              secondClass.classList.remove(oldValue);
              timePickerContainer.classList.remove(oldValue);
              timePickerButton.classList.remove(oldValue);
            }
            divTag.classList.add(newValue);
            hourClass.classList.add(newValue);
            minuteClass.classList.add(newValue);
            secondClass.classList.add(newValue);
            timePickerContainer.classList.add(newValue);
            timePickerButton.classList.add(newValue);
            break;
          case "lang":
            if (newValue == "ar") {
              this.hourName = "ساعة";
              this.minuteName = "دقيقة";
              this.secondName = "ثانية";

            } else {
              this.hourName = "Hour";
              this.minuteName = "Min";
              this.secondName = "Sec";

            }
            this.updateLanguage();
            break;
          case 'disabled':
            // Check if the 'disabled' attribute is present
            if (this.hasAttribute('disabled') && this.getAttribute('disabled') === 'true') {
              let hourUp = this.shadowRoot.querySelector(".hr-up");
              let hourdown = this.shadowRoot.querySelector(".hr-down");
              let minuteUp = this.shadowRoot.querySelector(".min-up");
              let minuteDown = this.shadowRoot.querySelector(".min-down");
              let secondUp = this.shadowRoot.querySelector(".sec-up");
              let secondDown = this.shadowRoot.querySelector(".sec-down");

              hourUp.classList.add("disabled");
              hourdown.classList.add("disabled");
              minuteUp.classList.add("disabled");
              minuteDown.classList.add("disabled");
              secondUp.classList.add("disabled");
              secondDown.classList.add("disabled");
            } else {
              // If 'disabled' attribute is not present, remove the 'disabled' class
              let hourUp = this.shadowRoot.querySelector(".hr-up");
              let hourdown = this.shadowRoot.querySelector(".hr-down");
              let minuteUp = this.shadowRoot.querySelector(".min-up");
              let minuteDown = this.shadowRoot.querySelector(".min-down");
              let secondUp = this.shadowRoot.querySelector(".sec-up");
              let secondDown = this.shadowRoot.querySelector(".sec-down");

              hourUp.classList.remove("disabled");
              hourdown.classList.remove("disabled");
              minuteUp.classList.remove("disabled");
              minuteDown.classList.remove("disabled");
              secondUp.classList.remove("disabled");
              secondDown.classList.remove("disabled");
            }
            break;
          case 'min':
            this.minTime = newValue;
            if (this.minTime != "") {
              this.minTime = this.minTime.split(":");
              this.minimumHour = parseInt(this.minTime[0]);
              this.minimumMin = parseInt(this.minTime[1]);
              this.minimumSec = parseInt(this.minTime[2]);
            }
            break;

          case 'max':
            this.maxTime = newValue;
            if (this.maxTime != "") {
              this.maxTime = this.maxTime.split(":");
              this.maximumHour = parseInt(this.maxTime[0]);
              this.maximumMin = parseInt(this.maxTime[1]);
              this.maximumSec = parseInt(this.maxTime[2]);
            }
            break;

          case "placeholder":
            this.placeholder = newValue;
            // ... (apply changes to UI)
            this.inputElement.setAttribute("aria-label", this.placeholder);
            this.inputElement.textContent = this.placeholder;
            break;
          default:
            break;
        }
      }
    }
  }
}

export default Timepicker;
