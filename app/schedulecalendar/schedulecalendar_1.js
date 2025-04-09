import styles from "./ScheduleCalendar.scss";

class ScheduleCalendar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentDate = new Date();
    this.workOrders = {}; // Default work orders
  }

  static get observedAttributes() {
    return ["month", "year", "data"];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "month" || name === "year") {
      this.currentDate.setMonth(
        this.getAttribute("month") - 1 || this.currentDate.getMonth()
      );
      this.currentDate.setFullYear(
        this.getAttribute("year") || this.currentDate.getFullYear()
      );
    }

    if (name === "data") {
      try {
        this.workOrders = JSON.parse(newValue);
      } catch (e) {
        console.error(
          "Invalid data format. Provide data as a valid JSON string."
        );
        this.workOrders = {};
      }
    }

    this.render();
  }

  connectedCallback() {
    this.render();

    this.dispatchEvent(
      new CustomEvent("month-changed", {
        detail: {
          currentMonth: this.currentDate.getMonth() + 1, // Month is 0-indexed, so adding 1
          currentYear: this.currentDate.getFullYear(), // Send the current year
        },
      })
    );
  }

  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  getMonthNameFull(monthIndex) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthIndex];
  }

  getMonthName(monthIndex) {
    const monthNamesShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNamesShort[monthIndex];
  }

  getStartDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay(); // Day of the week (0 = Sunday, 1 = Monday, etc.)
  }

  renderCalendar() {
    const daysInMonth = this.getDaysInMonth(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth()
    );
    const today = new Date();
    const monthKey = `${this.currentDate.getFullYear()}-${String(
      this.currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const grid = [];
    const startDay = this.getStartDayOfMonth(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth()
    );

    // Add previous month's last days
    const prevMonth =
      this.currentDate.getMonth() === 0 ? 11 : this.currentDate.getMonth() - 1;
    const prevYear =
      this.currentDate.getMonth() === 0
        ? this.currentDate.getFullYear() - 1
        : this.currentDate.getFullYear();
    const prevMonthDaysCount = this.getDaysInMonth(prevYear, prevMonth);
    const prevMonthStart = prevMonthDaysCount - startDay + 1;

    // Loop through the previous month days
    for (let i = prevMonthStart; i <= prevMonthDaysCount; i++) {
      const dateKey = `${prevYear}-${String(prevMonth + 1).padStart(
        2,
        "0"
      )}-${String(i).padStart(2, "0")}`;
      const events = this.workOrders[dateKey] || [];
      const eventMarkup = events
        .slice(0, 2)
        .map((event) => `<div class="event">${event}</div>`)
        .join("");
      const showMoreArrow =
        events.length > 2
          ? `<div class="show-more" data-date="${dateKey}"></div>`
          : "";

      const monthNameMarkup =
        i === prevMonthDaysCount
          ? `<div class="month-name">${this.getMonthName(prevMonth)} ${i}</div>`
          : "";
      const dateMarkup =
        i !== prevMonthDaysCount ? `<div class="date">${i}</div>` : "";

      grid.push(`
        <div class="day prev-month" style="background-color: #8C8C8C66;"  data-date="${dateKey}">
          ${monthNameMarkup}
          ${dateMarkup}
          <div class="events ${events.length > 2 ? "more" : ""}">
            ${eventMarkup}
            ${showMoreArrow}
          </div>
        </div>
      `);
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${monthKey}-${String(i).padStart(2, "0")}`;
      const isToday =
        today.getDate() === i &&
        today.getMonth() === this.currentDate.getMonth() &&
        today.getFullYear() === this.currentDate.getFullYear();

      const events = this.workOrders[dateKey] || [];
      const eventMarkup = events
        .slice(0, 2)
        .map((event) => `<div class="event">${event}</div>`)
        .join("");
      const showMoreArrow =
        events.length > 2
          ? `<div class="show-more" data-date="${dateKey}"></div>`
          : "";

      const monthNameMarkup =
        i === 1
          ? `<div class="month-name">${this.getMonthName(
              this.currentDate.getMonth()
            )} ${i}</div>`
          : "";
      const dateMarkup = i !== 1 ? `<div class="date">${i}</div>` : "";

      grid.push(`
        <div class="day ${isToday ? "highlight" : ""}" data-date="${dateKey}"> 
          ${monthNameMarkup}
          ${dateMarkup}
          <div class="events ${events.length > 2 ? "more" : ""}">
            ${eventMarkup}
            ${showMoreArrow}
          </div>
        </div>
      `);
    }

    // Add next month's first days
    const nextMonth =
      this.currentDate.getMonth() === 11 ? 0 : this.currentDate.getMonth() + 1;
    const nextYear =
      this.currentDate.getMonth() === 11
        ? this.currentDate.getFullYear() + 1
        : this.currentDate.getFullYear();
    const nextMonthKey = `${nextYear}-${String(nextMonth + 1).padStart(
      2,
      "0"
    )}`;

    const numNextMonthDays = 7 - (grid.length % 7); // Days needed to fill the grid

    for (let i = 1; i <= numNextMonthDays; i++) {
      const dateKey = `${nextMonthKey}-${String(i).padStart(2, "0")}`;
      const events = this.workOrders[dateKey] || [];
      const eventMarkup = events
        .slice(0, 2)
        .map((event) => `<div class="event">${event}</div>`)
        .join("");
      const showMoreArrow =
        events.length > 2
          ? `<div class="show-more" data-date="${dateKey}"></div>`
          : "";

      const monthNameMarkup =
        i === 1
          ? `<div class="month-name">${this.getMonthName(nextMonth)} ${i}</div>`
          : "";
      const dateMarkup = i !== 1 ? `<div class="date">${i}</div>` : "";

      grid.push(`
        <div class="day next-month" style="background-color: #8C8C8C66;" data-date="${dateKey}">
          ${monthNameMarkup}
          ${dateMarkup}
          <div class="events ${events.length > 2 ? "more" : ""}">
            ${eventMarkup}
            ${showMoreArrow}
          </div>
        </div>
      `);
    }

    return grid.join("");
  }

  render() {
    const header = `
      <div class="header">
      <div class="controls">
          <t-button icon="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMjE2OTEiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDIxNjkxIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwNS4zNjcgMTEuNSkiIGZpbGw9IiNiZmJmYmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzY3NDUiIGRhdGEtbmFtZT0iTWFzayBHcm91cCA2NzQ1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTA1LjM2NyAtMTEuNSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJjYWxlbmRhciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTA1Ljc1NSAxMS41KSI+CiAgICAgIDxwYXRoIGlkPSJQYXRoXzI3Nzc5MyIgZGF0YS1uYW1lPSJQYXRoIDI3Nzc5MyIgZD0iTTE3LjIyNyw2LjY2OFYzLjg5MkExLjk4LDEuOTgsMCwwLDAsMTUuMjUsMS45MTRoLS41MjFWMS42YTEuNjEsMS42MSwwLDAsMC0zLjIyLDB2LjMxMkg1LjY5MlYxLjZhMS42MSwxLjYxLDAsMCwwLTMuMjIsMHYuMzEySDEuOTUxQTEuOTgsMS45OCwwLDAsMC0uMDI3LDMuODkyVjE2LjAyMkExLjk4LDEuOTgsMCwwLDAsMS45NTEsMThoMTMuM2ExLjk4LDEuOTgsMCwwLDAsMS45NzgtMS45NzhWNi45NTRhLjQ0Ni40NDYsMCwwLDAsMC0uMjg1Wk0xMy4xMTkuODkyYS43MS43MSwwLDAsMSwuNzA5LjcxVjIuNTVhLjcxLjcxLDAsMCwxLTEuNDE5LDBWMS42YS43MS43MSwwLDAsMSwuNzEtLjcxWk0zLjM3MiwxLjZhLjcxLjcxLDAsMCwxLDEuNDE5LDBWMi41NWEuNzEuNzEsMCwwLDEtMS40MTksMFpNMS45NTEsMi44MTRoLjU0M2ExLjYxLDEuNjEsMCwwLDAsMy4xNzYsMGg1Ljg2MWExLjYxLDEuNjEsMCwwLDAsMy4xNzYsMGguNTQzYTEuMDc5LDEuMDc5LDAsMCwxLDEuMDc3LDEuMDc3VjYuMzYxSC44NzRWMy44OTJBMS4wNzksMS4wNzksMCwwLDEsMS45NTEsMi44MTRaTTE1LjI1LDE3LjFIMS45NTFBMS4wNzksMS4wNzksMCwwLDEsLjg3NCwxNi4wMjJWNy4yNjFIMTYuMzI3djguNzYxQTEuMDc5LDEuMDc5LDAsMCwxLDE1LjI1LDE3LjFabTAsMCIgZmlsbD0iI2JmYmZiZiIvPgogICAgICA8cGF0aCBpZD0iUGF0aF8yNzc3OTQiIGRhdGEtbmFtZT0iUGF0aCAyNzc3OTQiIGQ9Ik0xMC44NCwxMC4xMTEsNy44ODUsMTNsLTEuNS0xLjQ2NWEuNDUuNDUsMCwwLDAtLjYzNS42MzhsLjAwNi4wMDZMNy41NywxMy45NDhhLjQ1LjQ1LDAsMCwwLC42MjksMGwzLjI3LTMuMTkzYS40NS40NSwwLDAsMC0uNjI3LS42NDdsMCwwWm0wLDAiIGZpbGw9IiNiZmJmYmYiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=" id="currentday">Today</t-button>
          <t-button icon="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNy40MTQiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAxNy40MTQgMjEiPgogIDxnIGlkPSJhcnJvdy11cC0xMF8yNjhiNDQyMS0zMjAwLTQ3YzMtOTYwMi03NmFmZWZmYTJiN2QiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuNzA3IDAuNSkiPgogICAgPHBhdGggaWQ9ImxheWVyMiIgZD0iTTAsMjBWMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOC4wMDEgMCkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2JmYmZiZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDxwYXRoIGlkPSJsYXllcjEiIGQ9Ik0xNiwwLDgsOC4xLDAsMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxMS45KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmZiZmJmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMSIvPgogIDwvZz4KPC9zdmc+Cg==" id="prevMonth"></t-button>
          <t-button icon="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOSIgaGVpZ2h0PSIxOSIgdmlld0JveD0iMCAwIDE5IDE5Ij4KICA8ZyBpZD0ibm90aWZpY2F0aW9uLTE4NF9mZjk0ODMyYy00YzIxLTQ0OGItOWZiMS03OTY2M2Y2MzIwZmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuNSAwLjUpIj4KICAgIDxwYXRoIGlkPSJsYXllcjIiIGQ9Ik0xNi42OTQsMTQuOTM5VjI2LjY5NEgyVjEySDEzLjc1NiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIgLTguNjk0KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmZiZmJmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMSIvPgogICAgPGNpcmNsZSBpZD0ibGF5ZXIxIiBjeD0iMyIgY3k9IjMiIHI9IjMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyKSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmZiZmJmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMSIvPgogIDwvZz4KPC9zdmc+Cg==" id="opendialog">${this.getMonthNameFull(
            this.currentDate.getMonth()
          )}, ${this.currentDate.getFullYear()}</t-button>
          <t-button icon="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNy40MTQiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAxNy40MTQgMjEiPgogIDxnIGlkPSJhcnJvdy11cC0xMF8yNjhiNDQyMS0zMjAwLTQ3YzMtOTYwMi03NmFmZWZmYTJiN2QiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuNzA3IDAuNSkiPgogICAgPHBhdGggaWQ9ImxheWVyMiIgZD0iTTAsMFYyMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOC4wMDEgMCkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2JmYmZiZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDxwYXRoIGlkPSJsYXllcjEiIGQ9Ik0xNiw4LjEsOCwwLDAsOC4xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDApIiBmaWxsPSJub25lIiBzdHJva2U9IiNiZmJmYmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPC9nPgo8L3N2Zz4K" id="nextMonth"></t-button>
        </div>
      </div>
    `;

    const separator = `<hr>`;

    const calendarGrid = `
      <div class="weekdays">
        <div class="weekday">Sunday</div>
        <div class="weekday">Monday</div>
        <div class="weekday">Tuesday</div>
        <div class="weekday">Wednesday</div>
        <div class="weekday">Thursday</div>
        <div class="weekday">Friday</div>
        <div class="weekday">Saturday</div>
      </div>
      <div class="grid">
        ${this.renderCalendar()}
      </div>
  `;

    const yearsList = this.generateYearsList();
    const monthsList = this.generateMonthsList();
 
    const yearDialog = `
  <div>
    <div class="year-dialog" style="display: none;">
      <div class="dialog-content">
                  <t-button id="month" icon="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOSIgaGVpZ2h0PSIxOSIgdmlld0JveD0iMCAwIDE5IDE5Ij4KICA8ZyBpZD0ibm90aWZpY2F0aW9uLTE4NF9mZjk0ODMyYy00YzIxLTQ0OGItOWZiMS03OTY2M2Y2MzIwZmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuNSAwLjUpIj4KICAgIDxwYXRoIGlkPSJsYXllcjIiIGQ9Ik0xNi42OTQsMTQuOTM5VjI2LjY5NEgyVjEySDEzLjc1NiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIgLTguNjk0KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmZiZmJmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMSIvPgogICAgPGNpcmNsZSBpZD0ibGF5ZXIxIiBjeD0iMyIgY3k9IjMiIHI9IjMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyKSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmZiZmJmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMSIvPgogIDwvZz4KPC9zdmc+Cg==" id="monthbutton">${this.getMonthNameFull(
                    this.currentDate.getMonth()
                  )}</t-button>
                                    <t-button id="year" icon="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOSIgaGVpZ2h0PSIxOSIgdmlld0JveD0iMCAwIDE5IDE5Ij4KICA8ZyBpZD0ibm90aWZpY2F0aW9uLTE4NF9mZjk0ODMyYy00YzIxLTQ0OGItOWZiMS03OTY2M2Y2MzIwZmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuNSAwLjUpIj4KICAgIDxwYXRoIGlkPSJsYXllcjIiIGQ9Ik0xNi42OTQsMTQuOTM5VjI2LjY5NEgyVjEySDEzLjc1NiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIgLTguNjk0KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmZiZmJmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMSIvPgogICAgPGNpcmNsZSBpZD0ibGF5ZXIxIiBjeD0iMyIgY3k9IjMiIHI9IjMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyKSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmZiZmJmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMSIvPgogIDwvZz4KPC9zdmc+Cg==" id="yearbutton"> ${this.currentDate.getFullYear()}</t-button>
 <t-button id="previousyear" icon="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNy40MTQiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAxNy40MTQgMjEiPgogIDxnIGlkPSJhcnJvdy11cC0xMF8yNjhiNDQyMS0zMjAwLTQ3YzMtOTYwMi03NmFmZWZmYTJiN2QiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuNzA3IDAuNSkiPgogICAgPHBhdGggaWQ9ImxheWVyMiIgZD0iTTAsMjBWMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOC4wMDEgMCkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2JmYmZiZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDxwYXRoIGlkPSJsYXllcjEiIGQ9Ik0xNiwwLDgsOC4xLDAsMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxMS45KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmZiZmJmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMSIvPgogIDwvZz4KPC9zdmc+Cg==" ></t-button>
          <t-button id="nextyear"  icon="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNy40MTQiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAxNy40MTQgMjEiPgogIDxnIGlkPSJhcnJvdy11cC0xMF8yNjhiNDQyMS0zMjAwLTQ3YzMtOTYwMi03NmFmZWZmYTJiN2QiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuNzA3IDAuNSkiPgogICAgPHBhdGggaWQ9ImxheWVyMiIgZD0iTTAsMFYyMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOC4wMDEgMCkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2JmYmZiZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDxwYXRoIGlkPSJsYXllcjEiIGQ9Ik0xNiw4LjEsOCwwLDAsOC4xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDApIiBmaWxsPSJub25lIiBzdHJva2U9IiNiZmJmYmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgPC9nPgo8L3N2Zz4K" ></t-button>
</div>
          <hr>
      

         
      
<div class="months-list" style="display:grid;">
  ${monthsList}
</div>
<div class="years-list" style="display:none;">
  ${yearsList}
</div>

      </div>
      </div>
    </div>
  `;
    this.shadowRoot.innerHTML =
      `<style>${styles}</style>` +
      header +
      separator +
      `${yearDialog}`
      +calendarGrid ;

    this.shadowRoot
      .querySelector("#prevMonth")
      .addEventListener("click", () => {
        // Go to the previous month
        this.currentDate.setMonth(this.currentDate.getMonth() - 1); // Correctly decrement the month
        this.render();

        // Dispatch the updated month and year after navigating
        this.dispatchEvent(
          new CustomEvent("month-changed", {
            detail: {
              currentMonth: this.currentDate.getMonth() + 1, // Month is 0-indexed, so adding 1
              currentYear: this.currentDate.getFullYear(), // Send the current year
            },
          })
        );
      });

     

    this.shadowRoot
      .querySelector("#nextMonth")
      .addEventListener("click", () => {
        // Go to the next month
        this.currentDate.setMonth(this.currentDate.getMonth() + 1); // Correctly increment the month
        this.render();

        // Dispatch the updated month and year after navigating
        this.dispatchEvent(
          new CustomEvent("month-changed", {
            detail: {
              currentMonth: this.currentDate.getMonth() + 1, // Month is 0-indexed, so adding 1
              currentYear: this.currentDate.getFullYear(), // Send the current year
            },
          })
        );
      });

      this.shadowRoot.querySelectorAll(".show-more").forEach((arrow) => {
        arrow.addEventListener("click", (e) => {
          // Get the date associated with the 'show more' arrow
          const dateKey = e.target.getAttribute("data-date");
          const events = this.workOrders[dateKey] || [];
      
          // Dispatch a custom event to show the events
          this.dispatchEvent(
            new CustomEvent("show-events", {
              detail: { dateKey, events },
            })
          );
        });
      });

    // Selecting the day and dispatching the custom event
    this.shadowRoot.querySelectorAll(".day").forEach((day) => {
    
      day.addEventListener("click", (e) => {
        // Remove the 'selected' class from any previously selected day
        const selectedDay = this.shadowRoot.querySelector(".day.selected");
        if (selectedDay) selectedDay.classList.remove("selected");

        // Force reflow before applying the new class
        e.currentTarget.offsetHeight; // Trigger reflow

        // Add the 'selected' class to the clicked day
        e.currentTarget.classList.add("selected");

        // Store the selected date
        this.selectedDate = e.currentTarget.getAttribute("data-date");

        // Dispatch the 'day-selected' custom event with the selected date
        
        
        // Dispatch the 'day-selected' custom event with the selected date
        this.dispatchEvent(
          new CustomEvent("selectedDate", {
            detail: { 
              selectedDate: this.selectedDate,
              events: this.workOrders[this.selectedDate] || [] // Ensure related events are included
            },
          })
        );
      });

    });

    // Handling the 'show more' arrow click
   


    
      // Assuming you are working inside a custom element with Shadow DOM
this.shadowRoot
.querySelector("#year")
.addEventListener("click", () => {
  // Hide the months-list and show the years-list
  this.shadowRoot.querySelector(".months-list").style.display = 'none';
  this.shadowRoot.querySelector(".years-list").style.display = 'grid';
});

this.shadowRoot
.querySelector("#month")
.addEventListener("click", () => {
  // Hide the years-list and show the months-list
  this.shadowRoot.querySelector(".years-list").style.display = 'none';
  this.shadowRoot.querySelector(".months-list").style.display = 'grid';
  
  // Show the dialog box (assuming you want this to appear when switching to months)
});

    this.addEventListeners();
  }


 
  generateMonthsList() {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    const currentMonth = this.currentDate.getMonth(); // Get the current month (0-indexed)
  
    return months
      .map(
        (month, index) =>
          `<div class="month ${index === currentMonth ? "selected" : ""}" data-month="${index}">${month}</div>`
      )
      .join("");
  }
  
  

  addEventListeners() {
    // this.shadowRoot
    //   .querySelector("#prevMonth")
    //   .addEventListener("click", () => this.changeMonth(-1));
    // this.shadowRoot
    //   .querySelector("#nextMonth")
    //   .addEventListener("click", () => this.changeMonth(1));
    this.shadowRoot
      .querySelector("#opendialog")
      .addEventListener("click", () => this.openYearDialog());
  
      this.shadowRoot
      .querySelectorAll(".year")
      .forEach((el) =>
        el.addEventListener("click", (e) => {
          const selectedYear = parseInt(e.target.dataset.year, 10);
          this.selectYear(selectedYear);
    
          // Dispatch the 'year-changed' event
          this.dispatchEvent(
            new CustomEvent("month-changed", {
              detail: {
                currentYear: selectedYear, // Send the selected year
                currentMonth: this.currentDate.getMonth() + 1, // Send the current month
              },
            })
          );
        })
      );
    

      this.shadowRoot
      .querySelectorAll(".month")
      .forEach((el) =>
        el.addEventListener("click", (e) => {
          const selectedMonth = parseInt(e.target.dataset.month, 10);
          this.selectMonth(selectedMonth);
    
          // Dispatch the 'month-changed' event
          this.dispatchEvent(
            new CustomEvent("month-changed", {
              detail: {
                currentMonth: selectedMonth,
                currentYear: this.currentDate.getFullYear()+1, // Send the current year
              },
            })
          );
        })
      );
    


      this.shadowRoot.querySelector("#previousyear").addEventListener("click", () => {
        const baseYear = parseInt(
          this.shadowRoot.querySelector(".years-list .year:first-child").dataset.year,
          10
        );
        const newYearsList = this.generateYearsList(baseYear-5); // Move back 10 years
        this.shadowRoot.querySelector(".years-list").innerHTML = newYearsList;
      
        this.addYearClickListeners(); // Reattach event listeners to the new year elements
      });
      
      this.shadowRoot.querySelector("#nextyear").addEventListener("click", () => {
        const baseYear = parseInt(
          this.shadowRoot.querySelector(".years-list .year:last-child").dataset.year,
          10
        );
        const newYearsList = this.generateYearsList(baseYear+6 ); // Move forward 10 years
        this.shadowRoot.querySelector(".years-list").innerHTML = newYearsList;
      
        this.addYearClickListeners(); // Reattach event listeners to the new year elements
      });
      


      this.shadowRoot.querySelector("#currentday").addEventListener("click", () => {
        this.currentDate=new Date();
        this.dispatchEvent(
          new CustomEvent("month-changed", {
            detail: {
              currentMonth: this.currentDate.getMonth() + 1, // Month is 0-indexed, so adding 1
              currentYear: this.currentDate.getFullYear(), // Send the current year
            },
          })
        );
      this.render();
      });

 


      const openDialogButton = this.shadowRoot.querySelector("#opendialog");
const yearDialog = this.shadowRoot.querySelector(".year-dialog");

openDialogButton.addEventListener("click", () => {
  const buttonRect = openDialogButton.getBoundingClientRect();

  // Calculate the top value to position the dialog below the button
  const top = buttonRect.bottom + window.scrollY;

  // Calculate the left value to align the right edge of the year-dialog with the right edge of the button
  const left = buttonRect.right + window.scrollX - yearDialog.offsetWidth;

  // Apply the calculated top and left values to the year-dialog
  yearDialog.style.top = `${top}px`;
  yearDialog.style.left = `${left}px`;

});    
         
}

  

  generateYearsList() {
    const startYear = this.currentDate.getFullYear(); // Range of years
    const endYear = this.currentDate.getFullYear();
    const currentYear = this.currentDate.getFullYear(); // Get the current year
  
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    )
      .map(
        (year) =>
          `<div class="year ${year === currentYear ? "selected" : ""}" data-year="${year}">${year}</div>`
      )
      .join("");
  }



  generateYearsList(baseYear = this.currentDate.getFullYear()) {
    const startYear = baseYear -5; // Display 9 years before the base year
    const endYear = baseYear + 6;  // Display 2 years after the base year
    const currentYear = this.currentDate.getFullYear();
  
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    )
      .map(
        (year) =>
          `<div class="year ${year === currentYear ? "selected" : ""}" data-year="${year}">${year}</div>`
      )
      .join("");
  }
  
  
  openYearDialog() {
    const yearDialog = this.shadowRoot.querySelector(".year-dialog");
    if (yearDialog.style.display === "block") {
      yearDialog.style.display = "none";
    } else {
      yearDialog.style.display = "block";
    }
  }

  selectYear(year) {
    this.currentDate.setFullYear(year);
    this.render(); // Re-render the calendar with the selected year
  }


  selectMonth(month) {
    this.currentDate.setMonth(month);
    this.render(); // Re-render the calendar with the selected year
  }


  addYearClickListeners() {
    this.shadowRoot
      .querySelectorAll(".year")
      .forEach((el) =>
        el.addEventListener("click", (e) =>
          this.selectYear(parseInt(e.target.dataset.year, 10))
        )
      );
  }


  selectYear(year) {
    this.currentDate.setFullYear(year);
    this.shadowRoot.querySelector(".months-list").style.display = "grid";
    this.shadowRoot.querySelector(".years-list").style.display = "none";
    this.render();
  }
  
  
}

export default ScheduleCalendar;
