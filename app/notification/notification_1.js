import styles from './notification.scss';
class Notification extends HTMLElement {

  constructor() {
    super();
    setTimeout(() => {
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
      var view = (this.getAttribute("view") == 'true' ? 'style=display:block' : 'style=display:none');
      const template = document.createElement('template');
      template.innerHTML = `
          <style>${styles.toString()}</style>
           <div class="notification-wrap ${theme}"  ${view}>
           </div>`;
      this.attachShadow({
        mode: 'open'
      });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }, 0);
  }


  connectedCallback() {
    setTimeout(() => {
      if (this.shadowRoot) {
        var callbackFn = this.getAttribute("callback");
        let notification = this.shadowRoot.querySelector('.notification-wrap');
        let ul = document.createElement('ul');
        ul.setAttribute('class', 'notification-list');
        let data = this.getAttribute('notification-data');
        let notificationData = JSON.parse(data);
        notificationData.forEach(e => {
          let span = document.createElement('span');
          if (e.icon) {
            let img = document.createElement('img');
            Object.assign(img, {
              src: `${e.icon}`,
              height: '12',
              width: '12',
            })
            span.appendChild(img);
          }
          let li = document.createElement('li');
          li.setAttribute('class', 'notification-list-item');
          let text = document.createTextNode(e.name);
          li.append(span, text);
          ul.appendChild(li);
          notification.appendChild(ul);
        })

        // callback..
        let notificationItem = this.shadowRoot.querySelectorAll(".notification-list-item");
        let notificationItemArr = [...notificationItem]

        notificationItemArr.forEach((elem, idx) => {
          elem.addEventListener("click", (e) => {
            var checkEvent = new CustomEvent("tnotification", {
              bubbles: true,
              detail: {
                version: '1.0',
                method: callbackFn,
                params: "",
                data: notificationData[idx]
              }
            });

            console.log("checkevent---", checkEvent);
            if (this.dispatchEvent(checkEvent)) {
              // Do default operation here...
              console.log('Performing default operation');
            } else {
              console.log("Callback Not Available");
            }
          });
        });
      }
    }, 0);
  }

  static get observedAttributes() {
    return ['theme', 'notification-data', 'view'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("name--", name + "\tnewvalue---", newValue);
    if (this.shadowRoot) {
      if (name == 'theme' && newValue) {
        let tag = this.shadowRoot.querySelectorAll('.notification-wrap')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      }

      if (name == 'notification-data' && newValue) {
        var callbackFn = this.getAttribute("callback");
        let notification = this.shadowRoot.querySelector('.notification-wrap');
        let ul = this.shadowRoot.querySelector('.notification-list');
        let notificationData = JSON.parse(newValue);
        notificationData.forEach(e => {
          let span = document.createElement('span');
          if (e.icon) {
            let img = document.createElement('img');
            Object.assign(img, {
              src: `${e.icon}`,
              height: '12',
              width: '12',
            })
            span.appendChild(img);
          }
          let li = document.createElement('li');
          li.setAttribute('class', 'notification-list-item');
          let text = document.createTextNode(e.name);
          li.append(span, text);
          ul.insertBefore(li, ul.firstChild);
          // ul.appendChild(li);
          notification.appendChild(ul);
        })

        //LIFO(logic)
        let notificationCopy = notificationData.reverse();

        // callback..
        let notificationItem = this.shadowRoot.querySelectorAll(".notification-list-item");
        let notificationItemArr = [...notificationItem]

        notificationItemArr.forEach((elem, idx) => {
          elem.addEventListener("click", (e) => {
            console.log("ele---", e.target);
            var checkEvent = new CustomEvent("tnotification", {
              bubbles: true,
              detail: {
                version: '1.0',
                method: callbackFn,
                params: "",
                data: notificationCopy[idx]
              }
            });

            if (this.dispatchEvent(checkEvent)) {
              // Do default operation here...
              console.log('Performing default operation');
            } else {
              console.log("Callback Not Available");
            }
          });
        });
      }

      if(name=='view' && newValue){
        var noti=this.shadowRoot.querySelectorAll('.notification-wrap')[0];
        if(newValue=='true'){
          noti.style.display='block';
        }else{
          noti.style.display='none';
        }
      }

    }
  }
}
export default Notification;
// window.customElements.define('t-notification', Notification);
