import styles from './tree-grid.scss';

class Treegrid extends HTMLElement {
  constructor() {
    super()
    setTimeout(() => {
      var lang = this.hasAttribute("lang") ? (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '') : '';
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
      // let treeRoot = this.querySelector("#tree-root");
      const template = document.createElement('template');
      template.innerHTML = `<style>${styles.toString()}</style>
      <div class="tree-root ${theme}" ${lang}>
        <ul id="parent"></ul>
      </div>`;
      this.attachShadow({
        mode: 'open'
      });

      this.shadowRoot.appendChild(template.content.cloneNode(true));

    }, 0);
  }

  static get observedAttributes() {
    return ['theme', 'lang'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log("attributeChangedCallback -> ", name, newValue);
    if (name == 'theme' && newValue) {
      if (this.shadowRoot) {
        let tag = this.shadowRoot.querySelectorAll('.tree-root')[0];
        if (oldValue) {
          tag.classList.remove(oldValue);
        }
        tag.classList.add(newValue);
      }
    }
    else if (name == 'lang' && newValue) {
      if (this.shadowRoot) {
        let div = this.shadowRoot.querySelectorAll('.tree-root')[0];
        var rotation = div.querySelectorAll('.outer');
        if (div && rotation) {
          if (newValue == 'ar') {
            div.setAttribute('dir', 'rtl');
            rotation.forEach((ele)=>{
              ele.classList.add('rtl');
             });
          } else {
            div.removeAttribute('dir');
            div.removeAttribute('lang');
            rotation.forEach((ele)=>{
             ele.classList.remove('rtl');
            });
          }
        }
      }
    }
  }

  connectedCallback() {
    setTimeout(() => {
      if (this.shadowRoot) {
        var callbackFn = this.getAttribute("callback");
        let treeData = JSON.parse(this.getAttribute("treeData"));
        // let treeGrid = this.shadowRoot.querySelector(".tree-grid");
        var lang = this.hasAttribute("lang") ? (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '') : '';

        // dynaically creating nested ul li as per json data.
        // console.log(treeData);
        let tree = treeData;

        function recursive_tree(data, tag, child_wrapper, level) {
          var html = [];
          //return html array;
          level = level || 0;
          child_wrapper = (child_wrapper != false) ? child_wrapper : 'ul';

          data.forEach((obj) => {
            html.push(`<${tag}><span class="caret">${obj.name}</span>`);
            if (obj.hasOwnProperty('children')) {
              html.push(`<${child_wrapper}>`);
              html = html.concat(recursive_tree(obj.children, tag, child_wrapper))
              html.push(`</${child_wrapper}>`);
            }
            html.push(`</${tag}>`);
          });

          return html;
        }

        var html = recursive_tree(tree, 'li', 'ul');
        let parent = this.shadowRoot.querySelector("#parent");
        parent.innerHTML += html.join("");

        [...parent.children].forEach(data => {
          let ul = this.shadowRoot.querySelectorAll("ul");
          ul.forEach((ulItem, idx) => {
            if (idx === 0) {
              ulItem.classList.add("tree-root");
            } else {
              ulItem.classList.add("nested")
            }
          })
        })

        let carets = this.shadowRoot.querySelectorAll('.caret');
        carets.forEach(ele => {
          if (ele.nextElementSibling !== null) {
            ele.parentElement.style.cursor = "pointer";
            let inner = document.createElement('span');
            inner.className = "inner";
            let outer = document.createElement('span');
            if (lang) {
              outer.className = "outer rtl";
            } else {
              outer.className = "outer";
            }

            outer.appendChild(inner);
            ele.parentElement.insertBefore(outer, ele.parentElement.children[0]);
          }
          else {
            ele.parentElement.style.cursor = "auto";
            // ele.parentElement.style.pointerEvents = "none";
          }
        })

        let outers = this.shadowRoot.querySelectorAll('.outer');
        for (var i = 0; i < outers.length; i++) {
          outers[i].addEventListener('click', function (e) {
            // outer icon click => callback
            if (callbackFn) {
              var checkEvent = new CustomEvent("ttreegrid", {
                bubbles: true,
                detail: {
                  version: "1.0",
                  method: callbackFn,
                  params: '',
                  data: {
                    value: this.nextElementSibling.innerHTML
                  }
                }
              });

              if (this.dispatchEvent(checkEvent)) {
                // Do default operation here.
                console.log('Performing default operation');
              } else {
                console.log("Callback Not Available");
              }
            }
            let children = this.children[0];
            if (children.style.display === "inline-block") {
              children.style.display = "none";
            } else {
              children.style.display = "inline-block";
            }
            parent = this.parentElement;
            parent.querySelector('.nested').classList.toggle('active');
          })
        }

        for (var i = 0; i < carets.length; i++) {
          carets[i].addEventListener('click', function (e) {
            if (this.nextElementSibling !== null) {
              parent = this.parentElement;
              parent.querySelector('.nested').classList.toggle('active');
              let prevEle = this.previousElementSibling;
              let prevEleChild = prevEle.children[0];
              if (prevEleChild.style.display === "inline-block") {
                prevEleChild.style.display = "none";
              } else {
                prevEleChild.style.display = "inline-block";
              }
            }
            if (this.nextElementSibling === null) {
              e.preventDefault();
            }
            if (callbackFn) {
              var checkEvent = new CustomEvent("ttreegrid", {
                bubbles: true,
                detail: {
                  version: "1.0",
                  method: callbackFn,
                  params: '',
                  data: {
                    value: this.innerHTML
                  }
                }
              });
              console.log("checkEvent--->",checkEvent);
              if (this.dispatchEvent(checkEvent)) {
                // Do default operation here.
                console.log('Performing default operation');
              } else {
                console.log("Callback Not Available");
              }
            }
          })
        }
      }
    }, 0);
  }

}
// window.customElements.define('t-treegrid', Treegrid);
export default Treegrid;