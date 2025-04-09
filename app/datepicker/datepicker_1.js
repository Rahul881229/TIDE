import styles from "./datepicker.scss";

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
  constructor(date = null, lang = "default") {
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
      .replace(/\bM\b/, this.monthNumber);
  }
}

class Month {
  constructor(date = null, lang = "default") {
    const day = new Day(date, lang);
    const monthsSize = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.lang = lang;

    this.name = day.month;
    this.number = day.monthNumber;
    this.year = day.year;
    this.numberOfDays = monthsSize[this.number - 1];

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
    return new Day(new Date(this.year, this.number - 1, date), this.lang);
  }
}

class Calendar {
  weekDays = Array.from({ length: 7 });

  constructor(year = null, monthNumber = null, lang = "default") {
    this.today = new Day(null, lang);
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

class DatePicker extends HTMLElement {
  format = "MM-DD-YYYY";
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
  language = "en";

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

  constructor() {
    super();
    setTimeout(() => {
      const lang = window.navigator.language;
      const date = new Date(
        this.date ?? (this.getAttribute("date") || Date.now())
      );

      // this.shadow = this.attachShadow({ mode: "open" });
      this.date = new Day(date, lang);
      this.calendar = new Calendar(this.date.year, this.date.monthNumber, lang);
      this.format = this.getAttribute("format") || this.format;
      this.position = DatePicker.position.includes(
        this.getAttribute("position")
      )
        ? this.getAttribute("position")
        : this.position;
      this.visible =
        this.getAttribute("visible") === "" ||
        this.getAttribute("visible") === "true" ||
        this.visible;

      let placeholder = this.hasAttribute("placeholder")
        ? this.getAttribute("placeholder")
        : "";

      this.theme = this.hasAttribute("theme")
        ? this.getAttribute("theme")
        : "dark";

      this.fontsize = "sm";
      if (this.hasAttribute("small") || this.hasAttribute("sm")) {
        this.fontsize = "sm";
      } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
        this.fontsize = "lg";
      }

      this.language = this.hasAttribute("lang")
        ? this.getAttribute("lang") == "ar"
          ? 'dir="rtl" lang="ar"'
          : ""
        : "";

      this.minDate = this.hasAttribute("min") ? this.getAttribute("min") : "";
      // if (this.minDate) {
      //   const minDateString = new Date(this.minDate);
      //   this.minDay = minDateString.getDate();
      //   this.minMonth = minDateString.getMonth() + 1;
      //   this.minYear = minDateString.getFullYear();
      // }

      this.maxDate = this.hasAttribute("max") ? this.getAttribute("max") : "";
      // if (this.maxDate) {
      //   const maxDateString = new Date(this.maxDate);
      //   this.maxDay = maxDateString.getDate();
      //   this.maxMonth = maxDateString.getMonth() + 1;
      //   this.maxYear = maxDateString.getFullYear();
      // }

    if (this.minDate) {
        const minDateArray = this.minDate.split('-'); // Assuming the date string is in "DD-MM-YYYY" format
        this.minDay = parseInt(minDateArray[0]);
        this.minMonth = parseInt(minDateArray[1]);
        this.minYear = parseInt(minDateArray[2]);
    }

    if (this.maxDate) {
        const maxDateArray = this.maxDate.split('-'); // Assuming the date string is in "DD-MM-YYYY" format
        this.maxDay = parseInt(maxDateArray[0]);
        this.maxMonth = parseInt(maxDateArray[1]);
        this.maxYear = parseInt(maxDateArray[2]);
    }

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
          <img class="date-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAfdJREFUWEftlj9oFEEUh7+ZBBK0sBAsFAUjQRA7wSKmEYxooXhtbEKsdg6vUncPU1yhZq6NZE8bUwQMhCQWCmkUoiZaiylEjGm0EiFpDMFzn8Q/4J63d5fZHCFw02yxM+/3zfu9NzzFNi+1zfq0AHZQBkJ7FZG96GgK7+ZiYu2M2l6QM2i9hOeP16uxxjMQ2vdANyL9ZPMTiYFLNkAYBp5igj53gPt2D2UZRakMsKteoBr/VxEZ58fua+Ry65X7kjNQsmMIAymE40eV3MbLDzUOENp3wNEtA4A5THB6MwAfgcNbBiDqNVm/pwWwEzOgFpFo2rkWlB4EOYhzDSg1gef3OwOEdgHocQFYArqAh5jg8i+AQqGdfR0Z0AcoM0XO/1QXLCzOg5wCXmGCjW9sJT9EoY0DjIx00P7tBXDyT4R10H2YGy9rQqQA+P0O/LWgNJxB1EyF2GNMcLE2gLsFcYCweAnkUVxMnmDyF5oFELdgrNDJWufzfyxYQzhLNphvlgX/F+HkZBtfljNo9sP3abyhz80swrgFdZUSNqRowxbAB+AIimcgt1wdQPRdkOOgFjB+7yYeouIsyDln4cqDwgOywZXGAe7dOUakZ4FDqSEUb6F8vlrX1J6KN9ru6/IJiNyH0qhtBXP9DUpJtYs0PpanTkP1AC2An6iZ5yGg2uFCAAAAAElFTkSuQmCC"/>
        </div>
        <div class="tdatePanel">     
        <button type="button" class="date-toggle ${this.theme} ${this.fontsize}"> ${placeholder} </button>
        </div>    
      </div>
      <div class="calendar-dropdown ${this.theme} ${this.visible ? "visible" : ""
        } ${this.position} ${this.fontsize}">
        <div class="calendar-dropdown-panel">
          <div class="yearHeader ${this.fontsize}">
              <button type="button" class="prev-year" aria-label="previous year"></button>
              <h4 tabindex="0" aria-label="current year ${selectedYear}"> ${selectedYear} </h4>
              <button type="button" class="next-year" aria-label="next year"></button>
          </div>
          <div class="header ${this.fontsize}">
              <button type="button" class="prev-month" aria-label="previous month"></button>
              <h4 tabindex="0" aria-label="current month ${monthYear}"> ${monthYear} </h4>
              <button type="button" class="prev-month" aria-label="next month"></button>
          </div>
          <div class="week-days ${this.fontsize}">${this.getWeekDaysElementStrings()}</div>
          <div class="month-days"></div>
        <div>
      </div>
    `;

      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.mounted = true;
      this.dateToggle = this.shadowRoot.querySelector(".date-toggle");
      this.toggleButton = this.shadowRoot.querySelector(".tdate");
      this.calendarDropDown =
        this.shadowRoot.querySelector(".calendar-dropdown");
      const [prevBtn, calendarDateElement, nextButton] =
        this.calendarDropDown.querySelector(".header").children;
      const [prevYearBtn, calenderYearElement, nextYearButton] =
        this.calendarDropDown.querySelector(".yearHeader").children;
      this.calendarDateElement = calendarDateElement;
      this.calenderYearElement = calenderYearElement;
      this.calendarDaysContainer =
        this.calendarDropDown.querySelector(".month-days");

      // if(this.date){
      //   this.dateToggle.textContent = this.date.format(this.format);
      // }
      this.toggleButton.addEventListener("click", () => this.toggleCalendar());
      prevBtn.addEventListener("click", () => this.prevMonth());
      nextButton.addEventListener("click", () => this.nextMonth());
      prevYearBtn.addEventListener("click", () => this.prevYear());
      nextYearButton.addEventListener("click", () => this.nextYear());
      document.addEventListener("click", (e) => this.handleClickOut(e));

      this.renderCalendarDays();
    }, 0);
  }

  connectedCallback() { }

  // Define the observed attributes
  static get observedAttributes() {
    return ["theme", "lang", "min", "max", "position", "placeholder",'format'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      if (name && newValue) {
        // console.log(
        //   "Inside attributeChangedCallback of datepicker 1:",
        //   name,
        //   oldValue,
        //   newValue
        // );
        switch (name) {
          // case "date":
          //   this.date = new Day(new Date(newValue));
          //   this.calendar.goToDate(this.date.monthNumber, this.date.year);
          //   this.renderCalendarDays();
          //   this.updateToggleText();
          //   break;
          case "format":
            this.format = newValue;
            this.updateToggleText();
            break;
          // case "visible":
          //   this.visible = ["", "true", "false"].includes(newValue)
          //     ? newValue === "" || newValue === "true"
          //     : this.visible;
          //   this.toggleCalendar(this.visible);
          //   break;
          // case "position":
          //   this.position = DatePicker.position.includes(newValue)
          //     ? newValue
          //     : this.position;
          //   this.calendarDropDown.className = `calendar-dropdown ${
          //     this.visible ? "visible" : ""
          //   } ${this.position}`;
          //   break;
          case "theme":
            let divTag = this.shadowRoot.querySelectorAll(".tdate")[0];
            let buttonTag = this.shadowRoot.querySelectorAll(".date-toggle")[0];
            let mainDatePickerDiv = this.shadowRoot.querySelectorAll(
              ".calendar-dropdown "
            )[0];
            let monthday = this.shadowRoot.querySelectorAll(".month-day");
            if (oldValue) {
              divTag.classList.remove(oldValue);
              buttonTag.classList.remove(oldValue);
              mainDatePickerDiv.classList.remove(oldValue);
              for (let i = 0; i < monthday.length; i++) {
                monthday[i].classList.remove(oldValue);
              }
            }
            divTag.classList.add(newValue);
            buttonTag.classList.add(newValue);
            mainDatePickerDiv.classList.add(newValue);
            for (let i = 0; i < monthday.length; i++) {
              monthday[i].classList.add(newValue);
            }
            if (newValue == "dark") {
              document.documentElement.style.setProperty(
                "--border-color",
                "#fff"
              );
            } else {
              document.documentElement.style.setProperty(
                "--border-color",
                "#131313"
              );
            }
            break;
          case "lang":
            let div = this.shadowRoot.querySelector(".tdate");
            if (newValue == "ar") {
              div.setAttribute("dir", "rtl");
            } else {
              div.removeAttribute("dir");
            }
            break;
          case "min":
            this.minDate = newValue;
            this.updateMinValues();
            this.renderCalendarDays();
            break;
          case "max":
            this.maxDate = newValue;
            this.updateMaxValues();
            this.renderCalendarDays();
            break;
          case "position":
            this.position = DatePicker.position.includes(newValue)
              ? newValue
              : this.position;
            this.calendarDropDown.className = `calendar-dropdown dark ${this.visible ? "visible" : ""
              } ${this.position}`;
            break;
          case "placeholder":
            this.shadowRoot.querySelector(".date-toggle").textContent = newValue;
            break;


        }
      }
    }
  }




  updateMinValues() {
    if (this.minDate) {
      const minDateObj = new Date(this.minDate);
      this.minDay = minDateObj.getDate();
      this.minMonth = minDateObj.getMonth() + 1;
      this.minYear = minDateObj.getFullYear();
    }
  }

  updateMaxValues() {
    if (this.maxDate) {
      const maxDateObj = new Date(this.maxDate);
      this.maxDay = maxDateObj.getDate();
      this.maxMonth = maxDateObj.getMonth() + 1;
      this.maxYear = maxDateObj.getFullYear();
    }
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
  }

  prevMonth() {
    if (
      this.calendar.year > this.minYear &&
      this.calendar.month.number <= 12 &&
      (this.calendar.month.number - 1 <= this.minMonth ||
        this.calendar.month.number - 1 >= this.minMonth)
    ) {
      this.calendar.goToPreviousMonth();
      this.renderCalendarDays();
    } else if (
      this.calendar.year === this.minYear &&
      this.calendar.month.number <= 12 &&
      this.calendar.month.number - 1 >= this.minMonth
    ) {
      this.calendar.goToPreviousMonth();
      this.renderCalendarDays();
    } else if (this.minDate === "" && this.maxDate === "") {
      this.calendar.goToPreviousMonth();
      this.renderCalendarDays();
    }
  }

  nextMonth() {
    // maxyear = 2024 , current year= 2023, maxmonth=3
    // (2023<2024 && 11<=12 && 12 >=3 )
    // (2023<2024 && 1<=12 && 1 >=3 )
    if (
      this.calendar.year < this.maxYear &&
      this.calendar.month.number <= 12 &&
      (this.calendar.month.number + 1 >= this.maxMonth ||
        this.calendar.month.number + 1 <= this.maxMonth)
    ) {
      this.calendar.goToNextMonth();
      this.renderCalendarDays();
    } else if (
      this.calendar.year === this.maxYear &&
      this.calendar.month.number <= 12 &&
      this.calendar.month.number + 1 <= this.maxMonth
    ) {
      // (2023 == 2024 && 1<=12 && 2<=3)
      this.calendar.goToNextMonth();
      this.renderCalendarDays();
    } else if (this.minDate === "" && this.maxDate === "") {
      this.calendar.goToNextMonth();
      this.renderCalendarDays();
    } else if (this.maxDate === "") {
      this.calendar.goToNextMonth();
      this.renderCalendarDays();
    }
  }

  prevYear() {
    if (this.calendar.year - 1 >= this.minYear) {
      this.calendar.goToPreviousYear();
      this.renderCalendarDays();
    } else if (this.minDate === "" && this.maxDate === "") {
      this.calendar.goToPreviousYear();
      this.renderCalendarDays();
    }
  }

  nextYear() {
    if (this.maxYear >= this.calendar.year + 1) {
      this.calendar.goToNextYear();
      this.renderCalendarDays();
    } else if (this.minDate === "" && this.maxDate === "") {
      this.calendar.goToNextYear();
      this.renderCalendarDays();
    } else if (this.maxDate === "") {
      this.calendar.goToNextYear();
      this.renderCalendarDays();
    }
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

    // Create a custom event when a date is selected
    const dateSelectedEvent = new CustomEvent("dateSelected", {
      bubbles: true,
      detail: {
        date: this.date.format(this.format),
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

      if (this.minDate === "" && this.maxDate === "") {
        if (day.monthNumber === this.calendar.month.number) {
          el.classList.add("current");
        }

        if (this.isSelectedDate(day)) {
          el.classList.add("selected");
          this.selectedDayElement = el;
        }
      } else if (this.maxDate === "") {
        this.daySelectionOnMinMaxDate(day, el);
      } else {
        const currentDateString = new Date(day.Date);
        let currentDay = currentDateString.getDate();
        let currentMonth = currentDateString.getMonth() + 1;
        let currentYear = currentDateString.getFullYear();
        // if (
        //   currentDay < this.minDay &&
        //   currentMonth <= this.minMonth &&
        //   currentYear <= this.minYear
        // ) {
        //   el.classList.add("disabled");
        //   el.setAttribute("disabled", true);
        // } else {
        //   if (day.monthNumber === this.calendar.month.number) {
        //     el.classList.add("current");
        //   } else {
        //     if (currentMonth < this.minMonth && currentYear <= this.minYear) {
        //       el.classList.add("disabled");
        //       el.setAttribute("disabled", true);
        //     }
        //   }

        //   if (this.isSelectedDate(day)) {
        //     el.classList.add("selected");
        //     this.selectedDayElement = el;
        //   }
        // }

        this.daySelectionOnMinMaxDate(day, el);

        if (currentDay > this.maxDay && currentMonth >= this.maxMonth &&
          currentYear >= this.maxYear) {
          el.classList.add("disabled");
          el.setAttribute("disabled", true);
        }
      }
      this.calendarDaysContainer.appendChild(el);
    });
  }

  daySelectionOnMinMaxDate(day, el) {
    const currentDateString = new Date(day.Date);
    let currentDay = currentDateString.getDate();
    let currentMonth = currentDateString.getMonth() + 1;
    let currentYear = currentDateString.getFullYear();
    if (
      currentDay < this.minDay &&
      currentMonth <= this.minMonth &&
      currentYear <= this.minYear
    ) {
      el.classList.add("disabled");
      el.setAttribute("disabled", true);
    } else {
      if (day.monthNumber === this.calendar.month.number) {
        el.classList.add("current");
      } else {
        if (currentMonth < this.minMonth && currentYear <= this.minYear) {
          el.classList.add("disabled");
          el.setAttribute("disabled", true);
        }
      }
    }

    if (this.isSelectedDate(day)) {
      el.classList.add("selected");
      this.selectedDayElement = el;
    }
  }

  renderCalendarDays() {
    this.updateHeaderText();
    this.updateMonthDays();
    this.calendarDateElement.focus();
    this.calenderYearElement.focus();
  }

  static get position() {
    return ["top", "left", "bottom", "right"];
  }
}

export default DatePicker;
