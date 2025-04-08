import styles from './datePicker-new.scss';
function getWeekNumber(date) {
  const firstDayOfTheYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfTheYear) / 86400000;

  return Math.ceil((pastDaysOfYear + firstDayOfTheYear.getDay() + 1) / 7)
}

function isLeapYear(year) {
  return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}

class Day {
  constructor(date = null, lang = 'default') {
    date = date ?? new Date();

    this.Date = date;
    this.date = date.getDate();
    this.day = date.toLocaleString(lang, { weekday: 'long' });
    this.dayNumber = date.getDay() + 1;
    this.dayShort = date.toLocaleString(lang, { weekday: 'short' });
    this.year = date.getFullYear();
    this.yearShort = date.toLocaleString(lang, { year: '2-digit' });
    this.month = date.toLocaleString(lang, { month: 'long' });
    this.monthShort = date.toLocaleString(lang, { month: 'short' });
    this.monthNumber = date.getMonth() + 1;
    this.timestamp = date.getTime();
    this.week = getWeekNumber(date);
  }

  get isToday() {
    return this.isEqualTo(new Date());
  }

  isEqualTo(date) {
    date = date instanceof Day ? date.Date : date;

    return date.getDate() === this.date &&
      date.getMonth() === this.monthNumber - 1 &&
      date.getFullYear() === this.year;
  }

  format(formatStr) {
    return formatStr
      .replace(/\bYYYY\b/, this.year)
      .replace(/\bYYY\b/, this.yearShort)
      .replace(/\bWW\b/, this.week.toString().padStart(2, '0'))
      .replace(/\bW\b/, this.week)
      .replace(/\bDDDD\b/, this.day)
      .replace(/\bDDD\b/, this.dayShort)
      .replace(/\bDD\b/, this.date.toString().padStart(2, '0'))
      .replace(/\bD\b/, this.date)
      .replace(/\bMMMM\b/, this.month)
      .replace(/\bMMM\b/, this.monthShort)
      .replace(/\bMM\b/, this.monthNumber.toString().padStart(2, '0'))
      .replace(/\bM\b/, this.monthNumber)
  }
}

class Month {
  constructor(date = null, lang = 'default') {
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

    this[Symbol.iterator] = 1
  }

  getDay(date) {
    return new Day(new Date(this.year, this.number - 1, date), this.lang);
  }
}

class Calendar {
  weekDays = Array.from({ length: 7 });

  constructor(year = null, monthNumber = null, lang = 'default') {
    this.today = new Day(null, lang);
    this.year = year ?? this.today.year;
    this.month = new Month(new Date(this.year, (monthNumber || this.today.monthNumber) - 1), lang);
    this.lang = lang;

    this[Symbol.iterator] = 1

    this.weekDays.forEach((_, i) => {
      const day = this.month.getDay(i + 1);
      if (!this.weekDays.includes(day.day)) {
        this.weekDays[day.dayNumber - 1] = day.day
      }
    })
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

    this.month = new Month(new Date(this.year, (this.month.number + 1) - 1), this.lang);
  }

  goToPreviousMonth() {
    if (this.month.number === 1) {
      return this.goToPreviousYear();
    }

    this.month = new Month(new Date(this.year, (this.month.number - 1) - 1), this.lang);
  }
}

class DatePicker extends HTMLElement {
  format = 'MMM DD, YYYY';
  position = 'bottom';
  visible = false;
  date = null;
  lang = null;
  mounted = false;
  // elements
  inputDateField = null;
  calendarDropDown = null;
  calendarDateElement = null;
  calendarDaysContainer = null;
  selectedDayElement = null;

  constructor() {
    super();
    const lang = window.navigator.language;
    this.lang = lang;
    const date = new Date(this.date ?? (this.getAttribute("date") || Date.now()));
    this.shadow = this.attachShadow({ mode: "open" });
    this.date = new Day(date, this.lang);
    this.calendar = new Calendar(this.date.year, this.date.monthNumber, lang);

    this.format = this.getAttribute('format') || this.format;
    this.position = DatePicker.position.includes(this.getAttribute('position'))
      ? this.getAttribute('position')
      : this.position;
    this.visible = this.getAttribute('visible') === ''
      || this.getAttribute('visible') === 'true'
      || this.visible;

    this.render();
  }

  connectedCallback() {
    this.mounted = true;

    this.inputDateField = this.shadow.querySelector('.date-toggle');
    this.calendarDropDown = this.shadow.querySelector('.calendar-dropdown');
    const [prevBtn, calendarDateElement, nextButton] = this.calendarDropDown
      .querySelector('.header').children;
    this.calendarDateElement = calendarDateElement;
    this.calendarDaysContainer = this.calendarDropDown.querySelector('.month-days');

    this.inputDateField.addEventListener('click', () => this.toggleCalendar());
    this.inputDateField.addEventListener('keyup', (e) => this.toggleKeyUpCalendar(e));
    prevBtn.addEventListener('click', () => this.prevMonth());
    nextButton.addEventListener('click', () => this.nextMonth());
    document.addEventListener('click', (e) => this.handleClickOut(e));

    this.renderCalendarDays();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.mounted) return;

    switch (name) {
      case "date":
        this.date = new Day(new Date(newValue));
        this.calendar.goToDate(this.date.monthNumber, this.date.year);
        this.renderCalendarDays();
        this.updateToggleText();
        break;
      case "format":
        this.format = newValue;
        this.updateToggleText();
        break;
      case "visible":
        this.visible = ['', 'true', 'false'].includes(newValue)
          ? newValue === '' || newValue === 'true'
          : this.visible;
        this.toggleCalendar(this.visible);
        break;
      case "position":
        this.position = DatePicker.position.includes(newValue)
          ? newValue
          : this.position;
        this.calendarDropDown.className =
          `calendar-dropdown ${this.visible ? 'visible' : ''} ${this.position}`;
        break;
    }
  }

  toggleKeyUpCalendar(event) {
    // this.date = new Day(this.inputDateField.value, this.lang);
  }

  toggleCalendar(visible = null) {
    if (visible === null) {
      this.calendarDropDown.classList.toggle('visible');
    } else if (visible) {
      this.calendarDropDown.classList.add('visible');
    } else {
      this.calendarDropDown.classList.remove('visible');
    }

    this.visible = this.calendarDropDown.className.includes('visible');

    if (this.visible) {
      this.calendarDateElement.focus();
    } else {
      this.inputDateField.focus();

      if (!this.isCurrentCalendarMonth()) {
        this.calendar.goToDate(this.date.monthNumber, this.date.year);
        this.renderCalendarDays();
      }
    }
  }

  prevMonth() {
    this.calendar.goToPreviousMonth();
    this.renderCalendarDays();
  }

  nextMonth() {
    this.calendar.goToNextMonth();
    this.renderCalendarDays();
  }

  updateHeaderText() {
    this.calendarDateElement.textContent =
      `${this.calendar.month.name}, ${this.calendar.year}`;
    const monthYear = `${this.calendar.month.name}, ${this.calendar.year}`
    this.calendarDateElement
      .setAttribute('aria-label', `current month ${monthYear}`);
  }

  isSelectedDate(date) {
    return date.date === this.date.date &&
      date.monthNumber === this.date.monthNumber &&
      date.year === this.date.year;
  }

  isCurrentCalendarMonth() {
    return this.calendar.month.number === this.date.monthNumber &&
      this.calendar.year === this.date.year;
  }

  selectDay(el, day) {
    if (day.isEqualTo(this.date)) return;

    this.date = day;

    if (day.monthNumber !== this.calendar.month.number) {
      this.prevMonth();
    } else {
      el.classList.add('selected');
      this.selectedDayElement.classList.remove('selected');
      this.selectedDayElement = el;
    }

    this.toggleCalendar();
    this.updateToggleText();
  }

  handleClickOut(e) {
    if (this.visible && (this !== e.target)) {
      this.toggleCalendar(false);
    }
  }

  getWeekDaysElementStrings() {
    return this.calendar.weekDays
      .map(weekDay => `<span>${weekDay.substring(0, 3)}</span>`)
      .join('');
  }

  getMonthDaysGrid() {
    const firstDayOfTheMonth = this.calendar.month.getDay(1);
    const prevMonth = this.calendar.getPreviousMonth();
    const totalLastMonthFinalDays = firstDayOfTheMonth.dayNumber - 1;
    const totalDays = this.calendar.month.numberOfDays + totalLastMonthFinalDays;
    const monthList = Array.from({ length: totalDays });

    for (let i = totalLastMonthFinalDays; i < totalDays; i++) {
      monthList[i] = this.calendar.month.getDay(i + 1 - totalLastMonthFinalDays)
    }

    for (let i = 0; i < totalLastMonthFinalDays; i++) {
      const inverted = totalLastMonthFinalDays - (i + 1);
      monthList[i] = prevMonth.getDay(prevMonth.numberOfDays - inverted);
    }

    return monthList;
  }

  updateToggleText() {
    const date = this.date.format(this.format)
    // this.inputDateField.textContent = date;
    this.inputDateField.value = date;
  }

  updateMonthDays() {
    this.calendarDaysContainer.innerHTML = '';

    this.getMonthDaysGrid().forEach(day => {
      const el = document.createElement('button');
      el.className = 'month-day';
      el.textContent = day.date;
      el.addEventListener('click', (e) => this.selectDay(el, day));
      el.setAttribute('aria-label', day.format(this.format));

      if (day.monthNumber === this.calendar.month.number) {
        el.classList.add('current');
      }

      if (this.isSelectedDate(day)) {
        el.classList.add('selected');
        this.selectedDayElement = el;
      }

      this.calendarDaysContainer.appendChild(el);
    })
  }

  renderCalendarDays() {
    this.updateHeaderText();
    this.updateMonthDays();
    this.calendarDateElement.focus();
  }

  static get observedAttributes() {
    return ['date', 'format', 'visible', 'position'];
  }

  static get position() {
    return ['top', 'left', 'bottom', 'right'];
  }


  get style() {
    return `
      ${styles.toString()}
    `;
  }

  render() {
    const monthYear = `${this.calendar.month.name}, ${this.calendar.year}`;
    const date = this.date.format(this.format)
    this.shadow.innerHTML = `
      <style>${this.style}</style>
      <!--<button type="button" class="date-toggle">${date}</button>-->
      <input type="text" class="date-toggle" value=${date} />
      <div class="calendar-dropdown ${this.visible ? 'visible' : ''} ${this.position}">
        <div class="outline">
          <div class="header">
              <button type="button" class="prev-month" aria-label="previous month"></button>
              <div class="monthYear" tabindex="0" aria-label="current month ${monthYear}"> ${monthYear} </div>
              <button type="button" class="prev-month" aria-label="next month"></button>
          </div>
          <div class="week-days">${this.getWeekDaysElementStrings()}</div>
          <div class="month-days"></div>
        </div>
      </div>
    `
  }
}
export default DatePicker;