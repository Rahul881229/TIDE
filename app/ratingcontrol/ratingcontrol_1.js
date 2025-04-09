import styles from './ratingcontrol.scss';
class Ratingcontrol extends HTMLElement {
  constructor() {
    super()
    setTimeout(() => {
      var lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
      const template = document.createElement('template');
      template.innerHTML = `
     <style>${styles.toString()}</style>
     <div class="rating-control ${theme}" ${lang}>
       <span class="rating-label"></span>
         <div class="rating-group">
           <input checked class="rating__input rating__input--none" name="rating" id="rating-none" value="0" type="radio">
         </div>
      </div>`;

      this.attachShadow({
        mode: 'open'
      });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }, 0);
  }

  static get observedAttributes() {
    return ['theme', 'lang', 'rating-size', 'rating-label'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("name---",name);
    // console.log("newValue---",newValue);
    if (name == 'theme' && newValue) {
      if (this.shadowRoot) {
        let tag = this.shadowRoot.querySelectorAll('.rating-control')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      }
    }

    if (name === 'rating-label') {
      // Check if the shadowRoot exists
      if (this.shadowRoot) {
        const ratingLabel = this.shadowRoot.querySelector('.rating-label');
        if (ratingLabel) {
          ratingLabel.textContent = this.getAttribute('rating-label') || '';
        }
      }
    }
    if (name == 'lang' && newValue) {
      let language = this.shadowRoot;
      if (language) {
        if (newValue == 'ar') {
          language.querySelectorAll('.rating-control')[0].setAttribute('dir', 'rtl')
          language.querySelectorAll('.rating-control')[0].setAttribute('lang', 'ar')
        } else {
          language.querySelectorAll('.rating-control')[0].removeAttribute('dir', 'rtl')
          language.querySelectorAll('.rating-control')[0].removeAttribute('lang', 'ar')
        }
      }
    }

    if (name == 'rating-size' && newValue) {
      if (this.shadowRoot) {
        var callbackFn = this.getAttribute("callback");
        var disabled = this.hasAttribute("disabled");
        const rating = this.shadowRoot.querySelector('.rating-group');
        if (rating) {
          rating.innerHTML = '<input checked class="rating__input rating__input--none" name="rating" id="rating-none" value="0" type="radio">';
          const ratingLabel = this.shadowRoot.querySelector('.rating-label');
          ratingLabel.textContent = this.getAttribute('rating-label');

          let ratingNum = (this.getAttribute('rating-size') ? this.getAttribute('rating-size') : newValue);
          for (let i = 1; i <= ratingNum; i++) {
            const label = document.createElement('label');
            label.setAttribute('aria-label', `${i} star`);
            label.setAttribute('class', 'rating__label');
            label.setAttribute('for', `rating-${i}`);
            let spanwrap = document.createElement('span');
            spanwrap.className = "star-rating-wrap";
            let span = document.createElement('span');
            span.setAttribute('class', 'rating__icon rating__icon--star star');
            spanwrap.appendChild(span);
            label.appendChild(spanwrap);
            const input = document.createElement('input');
            Object.assign(input, {
              className: 'rating__input',
              name: 'rating',
              id: `rating-${i}`,
              value: i,
              type: 'radio',
              disabled: disabled
            });
            rating.append(label, input);
          }
          // console.log("after rating---",rating);

          let label = this.shadowRoot.querySelectorAll('label');
          label.forEach(ele => {
            ele.addEventListener('click', () => {
              this.dispatchEvent(new CustomEvent("tratingcontrol", {
                bubbles: true,
                detail: {
                  version: "2.2.21",
                  method: callbackFn,
                  params: '',
                  data: {
                    value: {
                      ratings: parseInt(ele.attributes[0].value)
                    }
                  }
                }
              }));


            })
          })
        }
      }
    }
  }

  disconnectedCallback() {
    setTimeout(() => {
      if (this.shadowRoot) {
        this.shadowRoot.removeEventListener('click', this.connectedCallback)
      }
    }, 0);
  }

  connectedCallback() {
    setTimeout(() => {
      if (this.shadowRoot) {
        var callbackFn = this.getAttribute("callback");
        var disabled = this.hasAttribute("disabled");
        const rating = this.shadowRoot.querySelector('.rating-group');
        const ratingLabel = this.shadowRoot.querySelector('.rating-label');
        ratingLabel.textContent = this.getAttribute('rating-label');

        let ratingNum = (this.getAttribute('rating-size') ? this.getAttribute('rating-size') : 5);
        for (let i = 1; i <= ratingNum; i++) {
          const label = document.createElement('label');
          label.setAttribute('aria-label', `${i} star`);
          label.setAttribute('class', 'rating__label');
          label.setAttribute('for', `rating-${i}`);
          let spanwrap = document.createElement('span');
          spanwrap.className = "star-rating-wrap";
          let span = document.createElement('span');
          span.setAttribute('class', 'rating__icon rating__icon--star star');
          spanwrap.appendChild(span);
          label.appendChild(spanwrap);
          const input = document.createElement('input');
          Object.assign(input, {
            className: 'rating__input',
            name: 'rating',
            id: `rating-${i}`,
            value: i,
            type: 'radio',
            disabled: disabled
          });
          rating.append(label, input);
        }

        let label = this.shadowRoot.querySelectorAll('label');
        label.forEach(ele => {
          ele.addEventListener('click', () => {

            this.dispatchEvent(new CustomEvent("tratingcontrol", {
              bubbles: true,
              detail: {
                version: "2.2.21",
                method: callbackFn,
                params: '',
                data: {
                  value: {
                    ratings: parseInt(ele.attributes[0].value)
                  }
                }
              }
            }));


          })
        })
      }
    }, 0);
  }
}
export default Ratingcontrol;