import styles from './widgetcommunication.scss';
let this_ = null;
class WidgetCommunication extends HTMLElement {
  constructor() {
    super();

    setTimeout(() => {
      var callbackFn = this.getAttribute("callback");
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : 'dark';
      let mode = (this.getAttribute("mode") == 'full' ? "communication-widget-fullscreen" : "communication-widget-minimize");
      let template = document.createElement('template');
      let communicationData = JSON.parse(this.getAttribute("data"));
      // let communicationDataArr = [...communicationData.data]; 
      // console.log("The communcation Data =>", communicationData.data);
      let communicationDataArr = communicationData.data;
      let communcationDataType = communicationData.type;
      // console.log(communcationDataType);

      template.innerHTML = `
        <style>${styles.toString()}</style>
        <div class="communication-widget ${theme} ${mode}">
          <div class="communication-widget__header-wrap">
              <div class="communication-widget__header-heading"> Communication Widget </div>
              <div class="communication-widget__header-dropdown-icon-wrap">
                <div class="communication-widget__dropdown-toggle communication-widget__dropdown-toggle-contact">
                    <img src="./assets/icons/phonebook@2x.png">
                </div>
                <div class="communication-widget__dropdown-toggle communication-widget__dropdown-toggle-menu">
                    <img src="./assets/icons/WidgetArrow_Defautl@2x.png">
                </div>
              </div>
              <div class="communication-widget__dropdown">
                <h3 class="communication-widget__dropdown-heading"> Widget Menu </h3>
                <ul class="communication-widget__dropdown-list">
                    <li class="communication-widget__dropdown-list-item">
                      <span class="communication-widget__dropdown-list-item-icon">
                      <img src="./assets/icons/expand@2x.png" alt="icon">
                      </span>
                      <span class="communication-widget__dropdown-list-item-text">
                      new window
                      </span>
                    </li>
                    <li class="communication-widget__dropdown-list-item">
                      <span class="communication-widget__dropdown-list-item-icon">
                      <img src="./assets/icons/Fullscreen@2x.png" alt="icon">
                      </span>
                      <span class="communication-widget__dropdown-list-item-text">
                      full screen
                      </span>
                    </li>
                    <li class="communication-widget__dropdown-list-item">
                      <span class="communication-widget__dropdown-list-item-icon">
                      <img src="./assets/icons/Minimise@2x.png" alt="icon">
                      </span>
                      <span class="communication-widget__dropdown-list-item-text">
                      minimise
                      </span>
                    </li>
                    <li class="communication-widget__dropdown-list-item">
                      <span class="communication-widget__dropdown-list-item-icon">
                      <img src="./assets/icons/download@2x.png" alt="icon">
                      </span>
                      <span class="communication-widget__dropdown-list-item-icon">
                      download
                      </span>
                    </li>
                    <li class="communication-widget__dropdown-list-item">
                      <span class="communication-widget__dropdown-list-item-icon">
                      <img src="./assets/icons/share@2x.png" alt="icon">
                      </span>
                      <span class="communication-widget__dropdown-list-item-text"> share </span>
                    </li>
                </ul>
              </div>
          </div>
          <hr class="communication-widget__hr">
          <div class="communication-widget__content">
              <h2 class="communication-widget__content-date"></h2>
              <ul class="communication-widget__content-message-time-wrap">
              </ul>
          </div>
          <div class="communication-widget__chatbox-wrapper">
              <span class="communication-widget__chatbox-wrapper-item communication-widget__chatbox-wrapper-item-img">
              <img src="./assets/icons/speaker@2x.png" />
              </span>  
              <span class="communication-widget__chatbox-wrapper-item communication-widget__chatbox-wrapper-item-img">
              <img src="./assets/icons/video@2x.png" />
              </span> 
              <span class="communication-widget__chatbox-wrapper-item communication-widget__chatbox-wrapper-item-img">
              <img src="./assets/icons/microphone@2x.png" />
              </span>
              <span class="communication-widget__chatbox-wrapper-item communication-widget__chatbox-wrapper-item-img">
              <img src="./assets/icons/attachment@2x.png" />
              </span>
              <span class="communication-widget__chatbox-wrapper-item communication-widget__chatbox-wrapper-item-input">
              <input type= "text" placeholder= "Type message"  />
              </span>
              <span class="communication-widget__chatbox-wrapper-item communication-widget__chatbox-wrapper-item-img">
              <img src="./assets/icons/send@2x.png" />
              </span>
          </div>
        </div>`;

      console.log("widget communication attribute data -> ", JSON.parse(this.getAttribute("data")));
      this_ = this;
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.type == "attributes") {
            // console.log("attributes changed", mutation);
            console.log("widget attribute data -> ", JSON.parse(mutation.target.getAttribute('data')));
            const dataFromUI = JSON.parse(mutation.target.getAttribute('data'));
            // console.log("dataFromUI.type -> ", dataFromUI.type);
            // console.log("dataFromUI.data -> ", dataFromUI.data);
            // console.log("this -> ", this_);
            if (dataFromUI.type == 'receiver') {
              console.log("receiver data -> ", dataFromUI.data);
              console.log(dataFromUI.data[0].commDataMsg);
            }
          }
        });
      });

      observer.observe(this, {
        attributes: true //configure it to listen to attribute changes
      });

      const shadowRoot = this.attachShadow({
        mode: 'open'
      });
      shadowRoot.appendChild(template.content.cloneNode(true));

      // the javascript logics..
      let communicationWidget = this.shadowRoot.querySelector('.communication-widget');
      let dateElement = this.shadowRoot.querySelector(".communication-widget__content-date");

      let communicationToggleBtnMenu = this.shadowRoot.querySelector('.communication-widget__dropdown-toggle-menu');
      let communicationDropdown = this.shadowRoot.querySelector('.communication-widget__dropdown');
      let newWindow = this.shadowRoot.querySelector('.communication-widget__dropdown-list-item:nth-child(1)');
      let fullScreen = this.shadowRoot.querySelector('.communication-widget__dropdown-list-item:nth-child(2)');
      let minimize = this.shadowRoot.querySelector('.communication-widget__dropdown-list-item:nth-child(3)');
      // let download = this.shadowRoot.querySelector('.communication-widget__dropdown-list-item:nth-child(4)');
      // let share = this.shadowRoot.querySelector('.communication-widget__dropdown-list-item:nth-child(5)');
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

      // timing and text functionalities.
      // msgtimeElement..
      let chatItemIconSend = this.shadowRoot.querySelector(".communication-widget__chatbox-wrapper-item:nth-child(6)");
      let chatItemIconInput = this.shadowRoot.querySelector(".communication-widget__chatbox-wrapper-item>input");
      let chatItemIconImg = this.shadowRoot.querySelectorAll(".communication-widget__chatbox-wrapper-item-img");
      let messageTimeElementWrap = this.shadowRoot.querySelector(".communication-widget__content-message-time-wrap");

      // let messageTimeElementReceiver = this.shadowRoot.querySelector(".communication-widget__content-message-time-receiver");
      let timeElement = this.shadowRoot.querySelector(".communication-widget__content-time");

      // dropdowncallback.
      let communicationDropdownList = this.shadowRoot.querySelectorAll('.communication-widget__dropdown-list-item');
      communicationDropdownList.forEach(elem => {
        if (callbackFn) {
          elem.addEventListener('click', () => {
            var checkEvent = new CustomEvent("tcommunication", {
              bubbles: true,
              detail: {
                version: '1.0',
                method: callbackFn,
                params: '',
                data: elem.textContent.trim()
              }
            });

            if (this.dispatchEvent(checkEvent)) {
              // Do default operation here
              console.log('Performing default operation');
            } else {
              console.log("No callback Available");
            }
          })
        }
      })

      newWindow.addEventListener("click", () => {
        console.log("Go to new window");
      });

      // Event listeners..
      communicationToggleBtnMenu.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        communicationDropdown.classList.toggle("dropdown-active");
      })

      // comment these next event listener if on each item..
      // click the popup dropdown has to be remooved.
      communicationDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      })

      document.addEventListener('click', () => {
        communicationDropdown.classList.remove("dropdown-active");
      });

      // minimize..
      minimize.addEventListener("click", () => {
        communicationWidget.classList.add("communication-widget-minimize");
        communicationWidget.classList.remove("communication-widget-fullscreen");
        communicationDropdown.classList.toggle("dropdown-active");
        chatItemIconInput.classList.add("change-width");
      })

      // Full screen..
      fullScreen.addEventListener("click", () => {
        communicationWidget.classList.add("communication-widget-fullscreen");
        communicationWidget.classList.remove("communication-widget-minimize");
        communicationDropdown.classList.toggle("dropdown-active");
      })
      let seteDate = new Date();

      function formateDate(d) {
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
        return year + '-' + months[monthStr] + '-' + day;
      }

      // adding border to items
      chatItemIconImg.forEach(elem => {
        elem.addEventListener("click", () => {
          elem.classList.toggle("active-img-border");
        })
      })

      // Globally creating the DOM to insert the messages at chatboard..and for callback..
      // let li = document.createElement("li");
      // li.className = "communication-widget__content-time-msg";
      // let spanTime = document.createElement('span');
      // spanTime.className = "communication-widget__content-time";
      // let spanText = document.createElement('span');
      // spanText.className = "communication-widget__content-text";

      communicationDataArr.forEach((data, idx) => {
        dateElement.textContent = formateDate(seteDate);

        if (communcationDataType === "sender") {
          // var timesRun = 0;
          // var interval = setInterval(function () {
          //   timesRun += 1;
          //   if (timesRun === 4) {
          //     clearInterval(interval);
          //   }
          // }, 3000);

          let li = document.createElement("li");
          li.className = "communication-widget__content-time-msg";
          let spanTime = document.createElement('span');
          spanTime.className = "communication-widget__content-time";
          let spanText = document.createElement('span');
          spanText.className = "communication-widget__content-text";
          // console.log("Hello");
          li.style.textAlign = "right";
          li.append(spanText, spanTime);
          let commDataObj = {
            type: "sender",
            commDataMsg: spanText.innerHTML = data.commDataMsg + " | ",
            commDataTime: spanTime.innerHTML = data.commDataTime
          }
          messageTimeElementWrap.appendChild(li);
          communicationDataArr.push(commDataObj);
          // everytime data is getting stored to the data empty array..
          if (callbackFn) {
            var checkEvent = new CustomEvent("tcommunication", {
              bubbles: true,
              detail: {
                version: '1.0',
                method: callbackFn,
                params: '',
                data: {
                  time: spanTime.innerHTML,
                  message: spanText.innerHTML
                }
              }
            });
            if (this.dispatchEvent(checkEvent)) {
              // Do default operation here
              console.log('Performing default operation');
            } else {
              console.log("No callback Available");
            }
          }
        }

        if (communcationDataType === "receiver") {
          // var timesRun = 0;
          // var interval = setInterval(function () {
          //   timesRun += 1;
          //   if (timesRun === 4) {
          //     clearInterval(interval);
          //   }
          //   let li = document.createElement("li");
          //   li.className = "communication-widget__content-time-msg";
          //   let spanTime = document.createElement('span');
          //   spanTime.className = "communication-widget__content-time";
          //   let spanText = document.createElement('span');
          //   spanText.className = "communication-widget__content-text";
          //   let commDataObj = {
          //     type: "receiver",
          //     commDataMsg: spanText.innerHTML = data.commDataMsg,
          //     commDataTime: spanTime.innerHTML = data.commDataTime
          //   }
          //   li.style.textAlign = "left";
          //   li.append(spanTime, spanText)
          //   // everytime data is getting stored to the data empty array..
          //   messageTimeElementWrap.appendChild(li);
          //   communicationData.push(commDataObj);
          // }, 3000);
          let li = document.createElement("li");
          li.className = "communication-widget__content-time-msg";
          let spanTime = document.createElement('span');
          spanTime.className = "communication-widget__content-time";
          let spanText = document.createElement('span');
          spanText.className = "communication-widget__content-text";
          let commDataObj = {
            type: "receiver",
            commDataMsg: spanText.innerHTML = data.commDataMsg,
            commDataTime: spanTime.innerHTML = data.commDataTime + " | "
          }
          li.style.textAlign = "left";
          li.append(spanTime, spanText)
          // everytime data is getting stored to the data empty array..
          messageTimeElementWrap.appendChild(li);
          communicationDataArr.push(commDataObj);

          if (callbackFn) {
            var checkEvent = new CustomEvent("tcommunication", {
              bubbles: true,
              detail: {
                version: '1.0',
                method: callbackFn,
                params: '',
                data: {
                  time: spanTime.innerHTML,
                  message: spanText.innerHTML
                }
              }
            });
            if (this.dispatchEvent(checkEvent)) {
              // Do default operation here
              console.log('Performing default operation');
            } else {
              console.log("No callback Available");
            }
          }
        }
      });

      chatItemIconSend.addEventListener("click", () => {
        // the date of Chat.
        // dateElement.textContent = formateDate(seteDate);
        // create the elements to insert the values.
        let li = document.createElement("li");
        li.className = "communication-widget__content-time-msg";
        let spanTime = document.createElement('span');
        spanTime.className = "communication-widget__content-time";
        let spanText = document.createElement('span');
        spanText.className = "communication-widget__content-text";
        // li.style.textAlign = "right";

        if (!chatItemIconInput.value) {
          alert("Enter your messages!!!")
        }

        if (chatItemIconInput.value) {
          // console.log("0th Index =>", communicationDataArr[0]);
          let li = document.createElement("li");
          li.className = "communication-widget__content-time-msg";
          let spanTime = document.createElement('span');
          spanTime.className = "communication-widget__content-time";
          let spanText = document.createElement('span');
          spanText.className = "communication-widget__content-text";
          li.style.textAlign = "right";
          li.append(spanText, spanTime)

          let commDataObj = {
            type: "sender",
            commDataMsg: spanText.innerHTML = chatItemIconInput.value,
            commDataTime: spanTime.innerHTML = " | " + formatTime()
          }

          communicationDataArr.push(commDataObj);

          if (callbackFn) {
            var checkEvent = new CustomEvent("tcommunication", {
              bubbles: true,
              detail: {
                version: '1.0',
                method: callbackFn,
                params: '',
                data: {
                  time: spanTime.innerHTML,
                  message: spanText.innerHTML
                }
              }
            });
            if (this.dispatchEvent(checkEvent)) {
              // Do default operation here
              console.log('Performing default operation');
            } else {
              console.log("No callback Available");
            }
          }
          // }
          // }
          messageTimeElementWrap.appendChild(li);
          chatItemIconInput.value = "";
        }
      });

      // if (chatItemIconInput.value) {
      // spanText.innerHTML = chatItemIconInput.value,
      // spanTime.innerHTML = formatTime()

      // let commDataObj = {
      //   type: "sender",
      //   commDataMsg: spanText.innerHTML = chatItemIconInput.value,
      //   commDataTime: spanTime.innerHTML = formatTime()
      // }
      // // everytime data is getting stored to the data empty array..
      // messageTimeElementWrap.appendChild(li);
      // communicationData.push(commDataObj);
      // chatItemIconInput.value = "";

      // if (callbackFn) {
      //   var checkEvent = new CustomEvent("tcommunication", {
      //     bubbles: true,
      //     detail: {
      //       version: '1.0',
      //       method: callbackFn,
      //       params: '',
      //       data: {
      //         time: spanTime.innerHTML,
      //         message: spanText.innerHTML
      //       }
      //     }
      //   });
      //   if (this.dispatchEvent(checkEvent)) {
      //     // Do default operation here
      //     console.log('Performing default operation');
      //   } else {
      //     console.log("No callback Available");
      //   }
      // }
      // }


      function checkTime(i) {
        return (i < 10) ? "0" + i : i;
      }

      function formatTime() {
        var time = new Date();
        var h = time.getHours();
        var m = time.getMinutes();
        var s = time.getSeconds();
        // add a zero in front of numbers < 10
        h = checkTime(h)
        m = checkTime(m);
        s = checkTime(s);
        return h + ":" + m + ":" + s;
      }
      // icons callback..
      chatItemIconImg.forEach(element => {
        element.addEventListener('click', (e) => {
          var checkEvent = new CustomEvent("tcommunication", {
            bubbles: true,
            detail: {
              version: '1.0',
              method: callbackFn,
              params: '',
              data: element
            }
          });

          if (this.dispatchEvent(checkEvent)) {
            // Do default operation here
            console.log('Performing default operation');
          } else {
            console.log("No callback Available");
          }
        });
      });
    }, 0);
  }

  static get observedAttributes() {
    return ['theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'theme' && newValue) {
      if (this.shadowRoot) {
        let tag = this.shadowRoot.querySelectorAll('.communication-widget')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      }
    }
  }
}

export default WidgetCommunication;