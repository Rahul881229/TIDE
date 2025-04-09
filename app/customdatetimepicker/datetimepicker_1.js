import styles from "./datetimepicker.scss";

function getWeekNumber(date) {
  const firstDayOfTheYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear =
    (date.getTime() - firstDayOfTheYear.getTime()) / 86400000;

  return Math.ceil((pastDaysOfYear + firstDayOfTheYear.getDay() + 1) / 7);
}

function isLeapYear(year) {
  return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}

class Day {
  d = new Date();

  constructor(
    date = null,
    lang = "default",
    hour = null,
    minute = null,
    second = null
  ) {
    date = date ?? new Date();

    this.Date = date;
    this.date = date.getDate();
    this.day = date.toLocaleString(lang, { weekday: "long" });
    this.dayNumber = date.getDay() + 1;
    this.dayShort = date.toLocaleString(lang, { weekday: "short" });
    this.year = date.getFullYear();
    this.yearShort = date.toLocaleString(lang, { year: "2-digit" });
    this.month = date.toLocaleString(lang, { month: "long" });
    this.monthShort = date.toLocaleString(lang, { month: "short" });
    this.monthNumber = date.getMonth() + 1;
    this.timestamp = date.getTime();
    this.week = getWeekNumber(date);

    // this.hour = this.hour ? this.hour :this.d.getHours();
    // this.minute = this.minute ? this.minute :this.d.getMinutes();
    // this.second = this.second ? this.second :this.d.getSeconds();

    // Set the hour, minute, and second if provided
    this.hour = hour != null ? hour : this.d.getHours();
    this.minute = minute != null ? minute : this.d.getMinutes();
    this.second = second != null ? second : this.d.getSeconds();
  }

  // Add a method to update the time
  updateTime(hour, minute, second) {
    this.hour = hour;
    this.minute = minute;
    this.second = second;
  }

  get isToday() {
    return this.isEqualTo(new Date());
  }

  isEqualTo(date) {
    date = date instanceof Day ? date.Date : date;
    return (
      date.getDate() === this.date &&
      date.getMonth() === this.monthNumber - 1 &&
      date.getFullYear() === this.year
    );
  }

  format(formatStr) {
    return formatStr
      .replace(/\bYYYY\b/, this.year)
      .replace(/\bYYY\b/, this.yearShort)
      .replace(/\bWW\b/, this.week.toString().padStart(2, "0"))
      .replace(/\bW\b/, this.week)
      .replace(/\bDDDD\b/, this.day)
      .replace(/\bDDD\b/, this.dayShort)
      .replace(/\bDD\b/, this.date.toString().padStart(2, "0"))
      .replace(/\bD\b/, this.date)
      .replace(/\bMMMM\b/, this.month)
      .replace(/\bMMM\b/, this.monthShort)
      .replace(/\bMM\b/, this.monthNumber.toString().padStart(2, "0"))
      .replace(/\bM\b/, this.monthNumber)
      .replace(/\bHH/, this.hour?.toString().padStart(2, "0"))
      .replace(/\bmm/, this.minute?.toString().padStart(2, "0"))
      .replace(/\bss/, this.second?.toString().padStart(2, "0"));
  }
}

class Month {
  constructor(date = null, lang = "default") {
    const day = new Day(date, lang, this.hour, this.minute, this.second);
    const monthsSize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.lang = lang;

    this.name = day.month;
    this.number = day.monthNumber;
    this.year = day.year;
    this.numberOfDays = monthsSize[this.number - 1];
    day.hour = this.hour;
    day.minute = this.minute;
    day.second = this.second;

    if (this.number === 2) {
      this.numberOfDays += isLeapYear(day.year) ? 1 : 0;
    }

    this[Symbol.iterator] = function* () {
      let number = 1;
      yield this.getDay(number);
      while (number < this.numberOfDays) {
        ++number;
        yield this.getDay(number);
      }
    };
  }

  getDay(date) {
    return new Day(
      new Date(this.year, this.number - 1, date),
      this.lang,
      this.hour,
      this.minute,
      this.second
    );
  }
}

class Calendar {
  weekDays = Array.from({ length: 7 });

  constructor(year = null, monthNumber = null, lang = "default") {
    this.today = new Day(null, lang, this.hour, this.minute, this.second);
    this.year = year ?? this.today.year;
    this.month = new Month(
      new Date(this.year, (monthNumber || this.today.monthNumber) - 1),
      lang
    );
    this.lang = lang;

    this[Symbol.iterator] = function* () {
      let number = 1;
      yield this.getMonth(number);
      while (number < 12) {
        ++number;
        yield this.getMonth(number);
      }
    };

    this.weekDays.forEach((_, i) => {
      const day = this.month.getDay(i + 1);
      if (!this.weekDays.includes(day.day)) {
        this.weekDays[day.dayNumber - 1] = day.day;
      }
    });
  }

  get isLeapYear() {
    return isLeapYear(this.year);
  }

  getMonth(monthNumber) {
    return new Month(new Date(this.year, monthNumber - 1), this.lang);
  }

  getPreviousMonth() {
    if (this.month.number === 1) {
      return new Month(new Date(this.year - 1, 11), this.lang);
    }
    return new Month(new Date(this.year, this.month.number - 2), this.lang);
  }

  getNextMonth() {
    if (this.month.number === 12) {
      return new Month(new Date(this.year + 1, 0), this.lang);
    }
    return new Month(new Date(this.year, this.month.number + 2), this.lang);
  }

  goToDate(monthNumber, year) {
    this.month = new Month(new Date(year, monthNumber - 1), this.lang);
    this.year = year;
  }

  goToNextYear() {
    this.year += 1;
    this.month = new Month(new Date(this.year, 0), this.lang);
  }

  goToPreviousYear() {
    this.year -= 1;
    this.month = new Month(new Date(this.year, 11), this.lang);
  }

  goToNextMonth() {
    if (this.month.number === 12) {
      return this.goToNextYear();
    }
    this.month = new Month(
      new Date(this.year, this.month.number + 1 - 1),
      this.lang
    );
  }

  goToPreviousMonth() {
    if (this.month.number === 1) {
      return this.goToPreviousYear();
    }
    this.month = new Month(
      new Date(this.year, this.month.number - 1 - 1),
      this.lang
    );
  }
}

class DateTimePicker extends HTMLElement {
  format = "MMM DD, YYYY HH:MM:SS";
  position = "bottom";
  visible = false;
  date = null;
  mounted = false;
  // elements
  toggleButton = null;
  calendarDropDown = null;
  calendarDateElement = null;
  calenderYearElement = null;
  calendarDaysContainer = null;
  selectedDayElement = null;
  placeholder = "";
  theme = "dark";
  fontsize = "";
  lang = "en";

  // New property for minimum date
  minDate = "";
  minDay = null;
  minMonth = null;
  minYear = null;

  // New property for maximum date
  maxDate = "";
  maxDay = null;
  maxMonth = null;
  maxYear = null;

  d = new Date();

  //   hour = this.d.getHours();
  //   minute = this.d.getMinutes();
  //   second = this.d.getSeconds();

  hourName = "Hour";
  minuteName = "Min";
  secondName = "Sec";

  selectedTime = "";

  constructor() {
    super();
    setTimeout(() => {
      const lang = window.navigator.language;
      const date = new Date(
        this.date ?? (this.getAttribute("date") || Date.now())
      );

      // this.shadow = this.attachShadow({ mode: "open" });
      this.date = new Day(date, lang, this.hour, this.minute, this.second);
      this.calendar = new Calendar(this.date.year, this.date.monthNumber, lang);
      this.format = this.getAttribute("format") || this.format;
      this.position = DateTimePicker.position.includes(
        this.getAttribute("position")
      )
        ? this.getAttribute("position")
        : this.position;
      this.visible =
        this.getAttribute("visible") === "" ||
        this.getAttribute("visible") === "true" ||
        this.visible;

      this.placeholder = this.hasAttribute("placeholder")
        ? this.getAttribute("placeholder")
        : "";

      this.theme = this.hasAttribute("theme")
        ? this.getAttribute("theme")
        : "dark";

      this.fontsize = "";
      if (this.hasAttribute("small") || this.hasAttribute("sm")) {
        this.fontsize = "sm";
      } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
        this.fontsize = "lg";
      }

      this.lang = this.hasAttribute("lang") ? this.getAttribute("lang") : "en";
      if (this.lang == "ar") {
        this.hourName = "ساعة";
        this.minuteName = "دقيقة";
        this.secondName = "ثانية";
      }
      this.hour = this.date.hour;
      this.minute = this.date.minute;
      this.second = this.date.second;

      console.log(
        "inside constructor hour, min ,sec :",
        this.date,
        this.hour,
        this.minute,
        this.second
      );

      if (this.theme == "dark") {
        document.documentElement.style.setProperty("--border-color", "#fff");
      } else {
        document.documentElement.style.setProperty("--border-color", "#131313");
      }
      const monthYear = `${this.calendar.month.name}`;
      const selectedYear = `${this.calendar.year}`;
      const template = document.createElement("template");
      template.innerHTML = `
      <style>${styles}</style>
      <div class="tdate ${this.theme}" ${this.language}>
        <div class="tdateIcon">      
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAfdJREFUWEftlj9oFEEUh7+ZBBK0sBAsFAUjQRA7wSKmEYxooXhtbEKsdg6vUncPU1yhZq6NZE8bUwQMhCQWCmkUoiZaiylEjGm0EiFpDMFzn8Q/4J63d5fZHCFw02yxM+/3zfu9NzzFNi+1zfq0AHZQBkJ7FZG96GgK7+ZiYu2M2l6QM2i9hOeP16uxxjMQ2vdANyL9ZPMTiYFLNkAYBp5igj53gPt2D2UZRakMsKteoBr/VxEZ58fua+Ry65X7kjNQsmMIAymE40eV3MbLDzUOENp3wNEtA4A5THB6MwAfgcNbBiDqNVm/pwWwEzOgFpFo2rkWlB4EOYhzDSg1gef3OwOEdgHocQFYArqAh5jg8i+AQqGdfR0Z0AcoM0XO/1QXLCzOg5wCXmGCjW9sJT9EoY0DjIx00P7tBXDyT4R10H2YGy9rQqQA+P0O/LWgNJxB1EyF2GNMcLE2gLsFcYCweAnkUVxMnmDyF5oFELdgrNDJWufzfyxYQzhLNphvlgX/F+HkZBtfljNo9sP3abyhz80swrgFdZUSNqRowxbAB+AIimcgt1wdQPRdkOOgFjB+7yYeouIsyDln4cqDwgOywZXGAe7dOUakZ4FDqSEUb6F8vlrX1J6KN9ru6/IJiNyH0qhtBXP9DUpJtYs0PpanTkP1AC2An6iZ5yGg2uFCAAAAAElFTkSuQmCC"/>
        </div>
        <div class="tdatePanel">     
        <button type="button" class="date-toggle ${this.theme} ${this.fontsize}"> ${this.placeholder} </button>
        </div>    
      </div>
      <div class="calendar-dropdown ${this.theme} ${this.visible ? "visible" : ""} ${this.position} ${this.fontsize}">
        <div class="calendar-dropdown-panel">
          <div class="yearHeader ${this.fontsize} ${this.theme}1">
              <button type="button" class="prev-year" aria-label="previous year"></button>
              <h4 tabindex="0" aria-label="current year ${selectedYear}"> ${selectedYear} </h4>
              <button type="button" class="next-year" aria-label="next year"></button>
          </div>
          <div class="header ${this.fontsize} ${this.theme}1">
              <button type="button" class="prev-month" aria-label="previous month"></button>
              <h4 tabindex="0" aria-label="current month ${monthYear}"> ${monthYear} </h4>
              <button type="button" class="prev-month" aria-label="next month"></button>
          </div>
          <div class="week-days ${this.fontsize}">${this.getWeekDaysElementStrings()}</div>
          <div class="month-days"></div>
        <div>
        <hr>
        <div class="time-picker ${this.theme}" data-time="00:00" ${this.language}>
          <div class="label">${this.hourName} </div>
          <div class="hour">
			      <div class="hr-up"></div>
			        <input type="number" class="hr ${this.theme} ${this.fontsize}" value="${this.hour}" readonly/>
			      <div class="hr-down"></div>
		      </div>
          <div class="label">${this.minuteName}</div>
		      <div class="minute">
			      <div class="min-up"></div>
			        <input type="number" class="min ${this.theme} ${this.fontsize}" value="${this.minute}" readonly>
			      <div class="min-down"></div>
		      </div>
          <div class="label">${this.secondName}</div>
          <div class="second">
			      <div class="sec-up"></div>
			        <input type="number" class="sec ${this.theme} ${this.fontsize}" value="${this.second}" readonly>
			      <div class="sec-down"></div>
		      </div>
        </div>
      </div>
    `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      // Custom event for time change callback
      this.time_picker_element = this.shadowRoot.querySelector(".time-picker");
      this.hr_element = this.shadowRoot.querySelector(".time-picker .hour .hr");
      this.sec_element = this.shadowRoot.querySelector(
        ".time-picker .second .sec"
      );
      this.min_element = this.shadowRoot.querySelector(
        ".time-picker .minute .min"
      );

      this.hr_up = this.shadowRoot.querySelector(".time-picker .hour .hr-up");
      this.hr_down = this.shadowRoot.querySelector(".time-picker .hour .hr-down");

      this.min_up = this.shadowRoot.querySelector(".time-picker .minute .min-up");
      this.min_down = this.shadowRoot.querySelector(
        ".time-picker .minute .min-down"
      );

      this.sec_up = this.shadowRoot.querySelector(".time-picker .second .sec-up");
      this.sec_down = this.shadowRoot.querySelector(
        ".time-picker .second .sec-down"
      );

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

      this.mounted = true;
      this.dateToggle = this.shadowRoot.querySelector(".date-toggle");
      this.toggleButton = this.shadowRoot.querySelector(".tdate");
      this.calendarDropDown = this.shadowRoot.querySelector(".calendar-dropdown");
      const [prevBtn, calendarDateElement, nextButton] =
        this.calendarDropDown.querySelector(".header").children;
      const [prevYearBtn, calenderYearElement, nextYearButton] =
        this.calendarDropDown.querySelector(".yearHeader").children;
      this.calendarDateElement = calendarDateElement;
      this.calenderYearElement = calenderYearElement;
      this.calendarDaysContainer =
        this.calendarDropDown.querySelector(".month-days");

      this.toggleButton.addEventListener("click", () => this.toggleCalendar());
      prevBtn.addEventListener("click", () => this.prevMonth());
      nextButton.addEventListener("click", () => this.nextMonth());
      prevYearBtn.addEventListener("click", () => this.prevYear());
      nextYearButton.addEventListener("click", () => this.nextYear());
      document.addEventListener("click", (e) => this.handleClickOut(e));

      this.renderCalendarDays();
    }, 0);
  }

  connectedCallback() {

  }

  // Define the observed attributes
  static get observedAttributes() {
    return ["theme", "lang", "position", "placeholder"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      if (name && newValue) {
        console.log(
          "Inside attributeChangedCallback of datetimepicker 1:",
          name,
          oldValue,
          newValue
        );
        switch (name) {
          case "theme":
            let divTag = this.shadowRoot.querySelectorAll(".tdate")[0];
            let buttonTag = this.shadowRoot.querySelectorAll(".date-toggle")[0];
            let mainDateTimePickerDiv = this.shadowRoot.querySelectorAll(
              ".calendar-dropdown "
            )[0];
            let timePicker =
              this.shadowRoot.querySelectorAll(".time-picker")[0];
            let hourClass = this.shadowRoot.querySelectorAll(".hr")[0];
            let minuteClass = this.shadowRoot.querySelectorAll(".min")[0];
            let secondClass = this.shadowRoot.querySelectorAll(".sec")[0];
            let monthday = this.shadowRoot.querySelectorAll(".month-day");
            if (oldValue) {
              divTag.classList.remove(oldValue);
              buttonTag.classList.remove(oldValue);
              mainDateTimePickerDiv.classList.remove(oldValue);
              timePicker.classList.remove(oldValue);
              hourClass.classList.remove(oldValue);
              minuteClass.classList.remove(oldValue);
              secondClass.classList.remove(oldValue);
              for (let i = 0; i < monthday.length; i++) {
                monthday[i].classList.remove(oldValue);
              }
            }

            divTag.classList.add(newValue);
            buttonTag.classList.add(newValue);
            mainDateTimePickerDiv.classList.add(newValue);
            timePicker.classList.add(newValue);
            hourClass.classList.add(newValue);
            minuteClass.classList.add(newValue);
            secondClass.classList.add(newValue);
            for (let i = 0; i < monthday.length; i++) {
              monthday[i].classList.add(newValue);
            }
            if (newValue == "dark") {
              document.documentElement.style.setProperty("--border-color", "#fff");
            } else {
              document.documentElement.style.setProperty("--border-color", "#131313");
            }

            break;
          case "lang":
            console.log("inside attribute changed datetimepicker ::", newValue);
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

          case "placeholder":
            console.log(this.placeholder);
            this.placeholder = newValue;
            this.updatePlaceholder();
            break;
          case "position":
            this.position = DateTimePicker.position.includes(newValue)
              ? newValue
              : this.position;
            this.calendarDropDown.className = `calendar-dropdown dark ${this.visible ? "visible" : ""
              } ${this.position}`;
            break;
        }
      }
    }
  }

  updatePlaceholder() {
    const toggleButton = this.shadowRoot.querySelector(".date-toggle");
    if (toggleButton) {
      toggleButton.textContent = this.placeholder;
      toggleButton.setAttribute("aria-label", this.placeholder);
    }
  }

  updateLanguage() {
    const labels = this.shadowRoot.querySelectorAll(".label");
    labels[0].textContent = this.hourName;
    labels[1].textContent = this.minuteName;
    labels[2].textContent = this.secondName;
  }


  toggleCalendar(visible = null) {
    if (visible === null) {
      this.calendarDropDown.classList.toggle("visible");
    } else if (visible) {
      this.calendarDropDown.classList.add("visible");
    } else {
      this.calendarDropDown.classList.remove("visible");
    }

    this.visible = this.calendarDropDown.className.includes("visible");

    if (this.visible) {
      this.calendarDateElement.focus();
      this.calenderYearElement.focus();
    } else {
      this.toggleButton.focus();

      if (!this.isCurrentCalendarMonth()) {
        this.calendar.goToDate(this.date.monthNumber, this.date.year);
        this.renderCalendarDays();
      }
    }

    // Update the time when the calendar is closed
    // this.setTime();
  }

  prevMonth() {
    this.calendar.goToPreviousMonth();
    this.renderCalendarDays();
  }

  nextMonth() {
    this.calendar.goToNextMonth();
    this.renderCalendarDays();
  }

  prevYear() {
    this.calendar.goToPreviousYear();
    this.renderCalendarDays();
  }

  nextYear() {
    this.calendar.goToNextYear();
    this.renderCalendarDays();
  }

  updateHeaderText() {
    this.calendarDateElement.textContent = `${this.calendar.month.name}`;
    const monthYear = `${this.calendar.month.name}`;
    this.calendarDateElement.setAttribute(
      "aria-label",
      `current month ${monthYear}`
    );
    this.calenderYearElement.textContent = `${this.calendar.year}`;
    const selectedYear = `${this.calendar.year}`;
    this.calenderYearElement.setAttribute(
      "aria-label",
      `current year ${selectedYear}`
    );
  }

  isSelectedDate(date) {
    this.date.hour = this.hour;
    this.date.minute = this.minute;
    this.date.second = this.second;
    return (
      date.date === this.date.date &&
      date.monthNumber === this.date.monthNumber &&
      date.year === this.date.year
    );
  }

  isCurrentCalendarMonth() {
    return (
      this.calendar.month.number === this.date.monthNumber &&
      this.calendar.year === this.date.year
    );
  }

  selectDay(el, day) {
    day.updateTime(this.hour, this.minute, this.second);
    if (day.isEqualTo(this.date)) return;
    this.date = day;

    if (day.monthNumber !== this.calendar.month.number) {
      this.prevMonth();
    } else {
      el.classList.add("selected");
      this.selectedDayElement.classList.remove("selected");
      this.selectedDayElement = el;
    }
    this.toggleCalendar();
    this.updateToggleText();

    // this.setTime();
    // Create a custom event when a date is selected
    const dateSelectedEvent = new CustomEvent("selectedDateTime", {
      bubbles: true,
      detail: {
        datetime: this.date.format(this.format),
        version: "2.2.22",
        method: this.getAttribute("callback"),
      },
    });
    this.dispatchEvent(dateSelectedEvent);
  }

  handleClickOut(e) {
    if (this.visible && this !== e.target) {
      this.toggleCalendar(false);
    }
  }

  getWeekDaysElementStrings() {
    return this.calendar.weekDays
      .map((weekDay) => `<span>${weekDay.substring(0, 3)}</span>`)
      .join("");
  }

  getMonthDaysGrid() {
    this.date.hour = this.hour;
    this.date.minute = this.minute;
    this.date.second = this.second;
    const firstDayOfTheMonth = this.calendar.month.getDay(1);
    const prevMonth = this.calendar.getPreviousMonth();
    const totalLastMonthFinalDays = firstDayOfTheMonth.dayNumber - 1;
    const totalDays =
      this.calendar.month.numberOfDays + totalLastMonthFinalDays;
    const monthList = Array.from({ length: totalDays });

    for (let i = totalLastMonthFinalDays; i < totalDays; i++) {
      monthList[i] = this.calendar.month.getDay(
        i + 1 - totalLastMonthFinalDays
      );
    }

    for (let i = 0; i < totalLastMonthFinalDays; i++) {
      const inverted = totalLastMonthFinalDays - (i + 1);
      monthList[i] = prevMonth.getDay(prevMonth.numberOfDays - inverted);
    }

    return monthList;
  }

  updateToggleText() {
    const date = this.date.format(this.format);
    this.dateToggle.textContent = date;
  }

  updateMonthDays() {
    this.calendarDaysContainer.innerHTML = "";

    this.getMonthDaysGrid().forEach((day) => {
      const el = document.createElement("button");
      el.className = "month-day " + this.theme;
      el.textContent = day.date;
      el.addEventListener("click", (e) => this.selectDay(el, day));
      el.setAttribute("aria-label", day.format(this.format));

      if (day.monthNumber === this.calendar.month.number) {
        el.classList.add("current");
      }

      if (this.isSelectedDate(day)) {
        el.classList.add("selected");
        this.selectedDayElement = el;
      }
      this.calendarDaysContainer.appendChild(el);
    });
  }

  renderCalendarDays() {
    this.updateHeaderText();
    this.updateMonthDays();
    this.calendarDateElement.focus();
    this.calenderYearElement.focus();
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
    this.date.hour = this.hour;
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
    this.date.minute = this.minute;
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
    this.date.second = this.second;
  }

  hour_up() {
    this.hour++;
    if (this.hour > 23) {
      this.hour = 0;
    }
    this.setTime();
  }

  hour_down() {
    this.hour--;
    if (this.hour < 0) {
      this.hour = 23;
    }
    this.setTime();
  }

  minute_up() {
    this.minute++;
    if (this.minute > 59) {
      this.minute = 0;
      this.hour++;
    }
    this.setTime();
  }

  minute_down() {
    this.minute--;
    if (this.minute < 0) {
      this.minute = 59;
      this.hour--;
    }
    this.setTime();
  }

  second_up() {
    this.second++;
    if (this.second > 59) {
      this.second = 0;
      this.minute++;
    }
    this.setTime();
  }

  second_down() {
    this.second--;
    if (this.second < 0) {
      this.second = 59;
      this.minute--;
    }
    this.setTime();
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

    this.date.hour = this.hour;
    this.date.minute = this.minute;
    this.date.second = this.second;

    this.updateToggleText();
  }

  formatTime(time) {
    if (time < 10) {
      time = "0" + time;
    }
    return time;
  }

  static get position() {
    return ["top", "left", "bottom", "right"];
  }
}

export default DateTimePicker;
