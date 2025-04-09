import styles from "./daterangetimepicker.scss";

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

    constructor(date = null, lang = "default",
        hour = null,
        minute = null,
        second = null) {
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
        // this.endDate=this.endDate ? date : this.endDate;

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
        //         .replace(/\bHH/, this.hour?.toString().padStart(2, "0"))
        //         .replace(/\bmm/, this.minute?.toString().padStart(2, "0"))
        //         .replace(/\bss/, this.second?.toString().padStart(2, "0"));
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
        return new Day(new Date(this.year, this.number - 1, date), this.lang, this.hour,
            this.minute,
            this.second);
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
        // console.log("Month number :::", this.month.number);
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

class DateRangeTimePicker extends HTMLElement {
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
    selectedEndDayElement = null;

    placeholder = "";
    theme = "dark";
    fontsize = "";
    language = "en";

    startDate = null;
    endDate = null;
    // selectionMode = "start";
    endDateSelected = false;
    displayRange = false;

    startTime = null;
    endTime = null;
    hourName = "Hour";
    minuteName = "Min";
    secondName = "Sec";

    constructor() {
        super();
        setTimeout(() => {
            const lang = window.navigator.language;
            const date = new Date(
                this.date ?? (this.getAttribute("date") || Date.now())
            );

            // this.shadow = this.attachShadow({ mode: "open" });
            this.date = new Day(date, lang, this.hour, this.minute, this.second);

            this.startDate = new Day(date, lang, this.hour, this.minute, this.second);
            this.endDate = new Day(date, lang, this.hour, this.minute, this.second);

            // console.log(
            //   "inside constructor startdate enddate ->",
            //   this.startDate,
            //   this.endDate
            // );

            this.hour = this.date.hour;
            this.minute = this.date.minute;
            this.second = this.date.second;

            this.calendar = new Calendar(this.date.year, this.date.monthNumber, lang);
            this.format = this.getAttribute("format") || this.format;
            this.position = DateRangeTimePicker.position.includes(
                this.getAttribute("position")) ? this.getAttribute("position") : this.position;

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

            this.language = this.hasAttribute("lang")
                ? this.getAttribute("lang") == "ar"
                    ? 'dir="rtl" lang="ar"'
                    : ""
                : "";

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

            this.toggleButton.addEventListener("click", () => this.toggleCalendar());
            prevBtn.addEventListener("click", () => this.prevMonth());
            nextButton.addEventListener("click", () => this.nextMonth());
            prevYearBtn.addEventListener("click", () => this.prevYear());
            nextYearButton.addEventListener("click", () => this.nextYear());
            document.addEventListener("click", (e) => this.handleClickOut(e));

            this.time_picker_element.dataset.time =
                this.formatTime(this.hour) +
                ":" +
                this.formatTime(this.minute) +
                ":" +
                this.formatTime(this.second);




            this.renderCalendarDays();
        }, 0);
    }

    connectedCallback() { }

    // Define the observed attributes
    static get observedAttributes() {
        return ["theme", "lang"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            if (name && newValue) {
                // console.log(
                //   "Inside attributeChangedCallback of dateRangepicker 1:",
                //   name,
                //   oldValue,
                //   newValue
                // );
                switch (name) {
                    case "theme":
                        let divTag = this.shadowRoot.querySelectorAll(".tdate")[0];
                        let buttonTag = this.shadowRoot.querySelectorAll(".date-toggle")[0];
                        let mainDateRangePickerDiv = this.shadowRoot.querySelectorAll(
                            ".calendar-dropdown "
                        )[0];
                        let monthday = this.shadowRoot.querySelectorAll(".month-day");
                        if (oldValue) {
                            divTag.classList.remove(oldValue);
                            buttonTag.classList.remove(oldValue);
                            mainDateRangePickerDiv.classList.remove(oldValue);
                            for (let i = 0; i < monthday.length; i++) {
                                monthday[i].classList.remove(oldValue);
                            }
                        }
                        divTag.classList.add(newValue);
                        buttonTag.classList.add(newValue);
                        mainDateRangePickerDiv.classList.add(newValue);
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
                }
            }
        }
    }

    toggleCalendar(visible = null) {
        this.startDate = this.startDate;
        this.endDate = this.endDate;
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
            if (this.startDate) {
                this.renderSelectedRange();
            }
        } else {
            this.toggleButton.focus();
            if (!this.isCurrentCalendarMonth()) {
                this.date = this.startDate;
                this.calendar.goToDate(this.startDate.monthNumber, this.startDate.year);
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
        if (this.startDate && this.endDate) {
            this.startDate = null;
            this.endDate = null;
            let monthday = this.shadowRoot.querySelectorAll(".month-day");
            for (let i = 0; i < monthday.length; i++) {
                monthday[i].classList.remove("selected");
                monthday[i].classList.remove("selected-date-in-range");
            }
            this.displayRange = false;
        }

        this.endDate = null;

        if (day.monthNumber !== this.calendar.month.number) {
            this.prevMonth();
        }

        if (this.endDateSelected == false) {
            this.startDate = day;
            this.endDateSelected = true;
            el.classList.add("selected");
            this.startTime = this.time_picker_element.dataset.time;
            // this.selectedDayElement?.classList.remove("selected");
            this.selectedDayElement = el;
            // this.day.date=day;
        } else if (this.startDate && this.endDateSelected) {
            this.endDate = day;
            this.endDateSelected = false;
            el.classList.add("selected");
            this.selectedDayElement = el;
            this.date.endDate = day;
            this.endTime = this.time_picker_element.dataset.time;
        }

        if (this.startDate && this.endDate) {
            if (this.startDate.timestamp > this.endDate.timestamp) {
                let tempStartDate = this.startDate;
                this.startDate = this.endDate;
                this.endDate = tempStartDate;
            }
            this.updateToggleText(this.startDate, this.endDate);
            this.renderSelectedRange(this.startDate, this.endDate);
            this.toggleCalendar();
            // Create a custom event when a date is selected
            const dateSelectedEvent = new CustomEvent("dateRangeSelected", {
                bubbles: true,
                detail: {
                   
                    date: this.startDate.format(this.format) + " " + this.startTime + " - " + this.endDate.format(this.format) + " " + this.endTime,

                    version: "2.2.22",
                    method: this.getAttribute("callback"),
                },
            });
            this.dispatchEvent(dateSelectedEvent);
        }
    }

    renderSelectedRange(startDate, endDate) {
        if (startDate && endDate) {
            this.displayRange = true;
            const startStr = startDate.format(this.format);
            const endStr = endDate.format(this.format);
            // this.dateToggle.textContent = `${startStr} - ${endStr}`;
            console.log('inside renderSelectedRange ->', this.time_picker_element.dataset.time);
            this.dateToggle.textContent = `${startStr} ${this.startTime} - ${endStr} ${this.endTime}`;

            let monthday = this.shadowRoot.querySelectorAll(".month-day");
            // console.log('monthday in render day selection :',monthday);
            for (let i = 0; i < monthday.length; i++) {
                // console.log("renderSelectedRange monthday i contents",monthday[i].textContent,monthday[i].monthContent,monthday[i].yearContent);
                const day = parseInt(monthday[i].textContent);
                const month = parseInt(monthday[i].monthContent);
                const year = parseInt(monthday[i].yearContent);

                // only for same month selection
                if (
                    day > this.startDate.format("DD") &&
                    day < this.endDate.format("DD") &&
                    month == this.startDate.format("MM") &&
                    month == this.endDate.format("MM") &&
                    year == this.startDate.format("YYYY") &&
                    year == this.endDate.format("YYYY")
                ) {
                    monthday[i].classList.add("selected-date-in-range");
                }
            }
        }
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

    // updateToggleText(startDate, endDate) {
    //     const startDateStr = startDate.format(this.format);
    //     const endDateStr = endDate.format(this.format);
    //     console.log('inside updateToggleText ->', this.hour, this.minute, this.second, this.time_picker_element.dataset.time);

    //     this.dateToggle.textContent = startDateStr + " " + this.time_picker_element.dataset.time + " - " + endDateStr + " " + this.time_picker_element.dataset.time;
    // }

    updateToggleText(startDate, endDate) {
        if (startDate && endDate) {
            const startDateStr = startDate.format(this.format);
            const endDateStr = endDate.format(this.format);
            this.dateToggle.textContent = startDateStr + " " + this.time_picker_element.dataset.time + " - " + endDateStr + " " + this.time_picker_element.dataset.time;
        }
    }


    // updateToggleText(startDate, endDate) {
    //     // const date = this.date.format(this.format);
    //     const startDateStr = startDate.format(this.format);
    //     const endDateStr = endDate.format(this.format);
    //     // this.dateToggle.textContent = date + " " + this.time_picker_element.dataset.time;
    //     this.dateToggle.textContent = startDateStr + " " + this.time_picker_element.dataset.time + " - " + endDateStr + " " + this.time_picker_element.dataset.time;
    // }

    updateMonthDays() {
        this.calendarDaysContainer.innerHTML = "";
        this.getMonthDaysGrid().forEach((day) => {
            const el = document.createElement("button");
            el.className = "month-day " + this.theme;
            el.textContent = day.date;
            el.monthContent = day.monthNumber;
            el.yearContent = day.year;
            el.dateContent = day;
            el.addEventListener("click", (e) => this.selectDay(el, day));
            el.setAttribute("aria-label", day.format(this.format));

            if (day.monthNumber === this.calendar.month.number) {
                el.classList.add("current");
            }
            if (this.isSelectedDate(day)) {
                el.classList.add("selected");
                this.selectedDayElement = el;
            }

            if (this.startDate && this.endDate) {
                if (
                    day.year == this.endDate.format("YYYY") &&
                    day.monthNumber == this.endDate.format("MM") &&
                    day.date == this.endDate.format("DD")
                ) {
                    el.classList.add("selected");
                }
            }

            // let monthday = this.shadowRoot.querySelectorAll(".month-day");
            if (this.startDate && this.endDate && this.displayRange) {
                // for (let i = 0; i <= monthday.length; i++) {
                // const day = parseInt(monthday[i]?.textContent);
                // const month = parseInt(monthday[i]?.monthContent);
                // const year = parseInt(monthday[i]?.yearContent);

                // below condition will display start month range for different start / end month
                if (
                    day.year == this.startDate.format("YYYY") &&
                    this.startDate.format("MM") == day.monthNumber &&
                    day.date > this.startDate.format("DD")
                ) {
                    el.classList.add("selected-date-in-range");
                } else if (
                    this.startDate.format("MM") != this.endDate.format("MM") &&
                    day.monthNumber < this.endDate.format("MM") &&
                    day.year == this.endDate.format("YYYY")
                ) {
                    el.classList.add("selected-date-in-range");
                } else if (
                    this.startDate.format("MM") != this.endDate.format("MM") &&
                    day.year == this.endDate.format("YYYY") &&
                    day.monthNumber == this.endDate.format("MM") &&
                    day.date < this.endDate.format("DD")
                ) {
                    el.classList.add("selected-date-in-range");
                } else if (
                    day.year > this.startDate.format("YYYY") &&
                    day.year < this.endDate.format("YYYY")
                ) {
                    el.classList.add("selected-date-in-range");
                } else if (
                    this.startDate.format("YYYY") != this.endDate.format("YYYY") &&
                    this.startDate.format("MM") == this.endDate.format("MM")
                ) {
                    if (
                        day.monthNumber < this.endDate.format("MM") &&
                        day.year == this.endDate.format("YYYY")
                    ) {
                        el.classList.add("selected-date-in-range");
                    } else if (
                        day.monthNumber == this.endDate.format("MM") &&
                        day.year == this.endDate.format("YYYY") &&
                        day.date < this.endDate.format("DD")
                    ) {
                        el.classList.add("selected-date-in-range");
                    }
                }
                // }
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



export default DateRangeTimePicker;