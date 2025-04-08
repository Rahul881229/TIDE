
// import styles from './footer.scss';
// let _this;
// class Footer extends HTMLElement {

//     constructor() {
//         super();
//         setTimeout(() => {
//             let lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
//             let logo = (this.getAttribute('logo') ? this.getAttribute('logo') : '');
//             let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
//             const version = this.hasAttribute("version") ? this.getAttribute("version") : '';
//             const copyright = this.getAttribute('copyright') ? this.getAttribute('copyright') : '&copy; 2020 - Trinity Mobility Pvt. Ltd.';
//             let callbackFn = this.getAttribute('callback');
//             const marqueeContent = this.getAttribute("marquee-content");
//             const color = this.getAttribute("color") || 'white'; // Default background color
//             const fontSize = this.getAttribute('font-size') || '16px'; // Default font size
//             const fontColor = this.getAttribute('font-color') || 'white'; // Default font color
//             const marqueeSpeed = this.getAttribute('marquee-speed'); // Default speed for marquee
//             const fontweight = this.getAttribute('font-weight'); // Default speed for marquee
//             const direction=this.getAttribute('direction');
//             const behavior=this.getAttribute('behavior');


//             const template = document.createElement('template');
//             let marqueeHtml = marqueeContent ? `
//             <marquee style="background-color: ${color}; color:${fontColor};  font-size:${fontSize}; font-weight:${fontweight}; height: 3.5vh; display: flex; align-items: center; justify-content: center;" 
//                      class="marquee" scrollamount="${marqueeSpeed}" behavior="${behavior}" direction="${direction}">
//                      ${marqueeContent}
//             </marquee>
//         ` : '';

//             let divWidth = marqueeContent ? '8%' : '50%';

//             template.innerHTML = `
//                 <style> ${styles.toString()} </style>
//               <footer class="${theme}"  ${lang} style="color: ${fontColor}; font-size: ${fontSize};">
//                 <div class="leftDiv" style="width: ${divWidth}">` + version + `</div >
//                                     ${marqueeHtml}
//                 <div class="rightDiv" style="width: ${divWidth}">
//     <img class="applogo" src="${logo}"/></div>
//               </footer >
//                 `;
//             // Add a shadow DOM
//             const shadowDOM = this.attachShadow({
//                 mode: 'open'
//             });
//             // render
//             shadowDOM.appendChild(template.content.cloneNode(true));
//             _this = this;
//             let footerEle = this.shadowRoot.querySelector("footer");
//             let footerChildArr = [...footerEle.children];
//             footerChildArr.forEach(ele => {
//                 ele.addEventListener('click', () => {
//                     this.dispatchEvent(new CustomEvent("tfooter", {
//                         bubbles: true,
//                         detail: {
//                             version: "2.2.21",
//                             method: callbackFn,
//                             params: '',
//                             data: {
//                                 value: ele.children[0].innerHTML
//                             }
//                         }
//                     }));
//                 })
//             })
//         }, 0);
//     }


//     setMarqueeContent(content) {
//         if (this.shadowRoot) {
//             const marquee = this.shadowRoot.querySelector('.marquee');
//             marquee.innerHTML = content;
//         }
//     }


//     disconnectedCallback() {
//         // browser calls this method when the element is removed from the document
//         // (can be called many times if an element is repeatedly added/removed)
//     }

//     static get observedAttributes() {
//         return ['theme', 'lang', 'marquee-content', 'font-size', 'font-color', 'marquee-speed','color'];
//     }

//     attributeChangedCallback(name, oldValue, newValue) {
//         if (name == 'theme' && newValue) {
//             if (this.shadowRoot) {
//                 let tag = this.shadowRoot.querySelectorAll('footer')[0];
//                 if (oldValue) {
//                     tag.classList.remove(oldValue);
//                 }
//                 tag.classList.add(newValue);
//             }
//         } else if (name == 'lang' && newValue) {
//             if (this.shadowRoot) {
//                 const footer = this.shadowRoot.querySelector('footer');
//                 if (newValue == 'ar') {
//                     footer.setAttribute('dir', 'rtl');
//                     footer.setAttribute('lang', newValue);
//                 } else {
//                     footer.removeAttribute('dir');
//                     footer.setAttribute('lang', newValue);
//                 }
//             }
//         } else if (name == 'marquee-content' && newValue) {
//             this.setMarqueeContent(newValue);
//         } else if ((name == 'font-size' || name == 'font-color') && newValue) {
//             if (this.shadowRoot) {
//                 const footer = this.shadowRoot.querySelector('footer');
//                 footer.style[name.replace('-', '')] = newValue;
//             }
//         } else if (name == 'marquee-speed' && newValue) {
//             if (this.shadowRoot) {
//                 const marquee = this.shadowRoot.querySelector('.marquee');
//                 marquee.setAttribute('scrollamount', newValue);
//             }
//         }
//         else if (name == 'direction' && newValue) {
//             if (this.shadowRoot) {
//                 const marquee = this.shadowRoot.querySelector('.marquee');
//                 marquee.setAttribute('direction', newValue);
//             }
//         } else if (name == 'behavior' && newValue) {
//             if (this.shadowRoot) {
//                 const marquee = this.shadowRoot.querySelector('.marquee');
//                 marquee.setAttribute('behavior', newValue);
//             }
//         }
//         else if(name=='version' && newValue){
//                     const versionDiv = this.shadowRoot.querySelector('.leftDiv');
//                     if (versionDiv) {
//                         versionDiv.innerHTML = newValue || '';
//                     }
//         }
//         else if(name=='copyright' && newValue)
//        {
//                     const copyrightDiv = this.shadowRoot.querySelector('.copyrightDiv');
//                     if (copyrightDiv) {
//                         copyrightDiv.innerHTML = newValue || '&copy; 2020 - Trinity Mobility Pvt. Ltd.';
//                     }
//         }
//         else if (name == 'color' && newValue) {  // Update background color dynamically
//             if (this.shadowRoot) {
//                 const marquee = this.shadowRoot.querySelector('.marquee');
//                 marquee.style.backgroundColor = newValue;
//             }
//         } 
//     }

//     adoptedCallback() {
//         // called when the element is moved to a new document
//         // (happens in document.adoptNode, very rarely used)
//     }

//     connectedCallback() {
//         const marqueeContent = this.getAttribute('marquee-content');
//         this.setMarqueeContent(marqueeContent);
//     }
// }
// export default Footer;
// // window.customElements.define('t-footer', Footer);



import styles from './footer.scss';
class Footer extends HTMLElement {
    constructor() {
        super();
        this._updateTimeout = null;
    }

    connectedCallback() {
        this._render();
    }

    disconnectedCallback() {
        // Clean up (if any)
    }

    static get observedAttributes() {
        return [
            'theme', 'lang', 'marquee-content', 'font-size', 'font-color', 
            'marquee-speed', 'color', 'font-weight', 'version', 'copyright', 
            'direction', 'behavior', 'logo'
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
        }

        this._updateTimeout = setTimeout(() => {
            this._render();
        }, 0);
    }

    _render() {
        const lang = this.getAttribute('lang') === 'ar' ? 'dir="rtl" lang="ar"' : '';
        const logo = this.getAttribute('logo') || '';  // Check if logo is provided
        const theme = this.getAttribute('theme') || 'dark';
        const version = this.getAttribute('version') || '';
        const copyright = this.getAttribute('copyright') || '&copy; 2020 - Trinity Mobility Pvt. Ltd.';
        const callbackFn = this.getAttribute('callback');
        const marqueeContent = this.getAttribute('marquee-content');
        const color = this.getAttribute('color') || 'white';
        const fontSize = this.getAttribute('font-size') || '16px';
        const fontColor = this.getAttribute('font-color') || 'white';
        const marqueeSpeed = this.getAttribute('marquee-speed') || '5';
        const fontWeight = this.getAttribute('font-weight') || 'normal';
        const direction = this.getAttribute('direction') || 'left';
        const behavior = this.getAttribute('behavior') || 'scroll';

        const template = document.createElement('template');

        const marqueeHtml = marqueeContent ? `
            <marquee style="background-color: ${color}; color:${fontColor}; font-size:${fontSize}; font-weight:${fontWeight}; height: 3.5vh; display: flex; align-items: center; justify-content: center;" 
                     class="marquee" scrollamount="${marqueeSpeed}" behavior="${behavior}" direction="${direction}">
                     ${marqueeContent}
            </marquee>
        ` : '';

        const divWidth = marqueeContent ? '8%' : '50%';

        // Fallback for logo if not provided or invalid
        const logoImg = logo ? `<img class="applogo" src="${logo}" alt="Logo" />` : '<div class="applogo">No Logo</div>';

        template.innerHTML = `
            <style>${styles.toString()}</style>
            <footer class="${theme}" ${lang} style="color: ${fontColor}; font-size: ${fontSize};">
                <div class="leftDiv" style="width: ${divWidth}">${version}</div>
                ${marqueeHtml}
                <div class="rightDiv" style="width: ${divWidth}">
                    ${logoImg}  <!-- This is where the logo is dynamically inserted -->
                </div>
            </footer>
        `;

        // Attach the shadow DOM
        const shadowDOM = this.shadowRoot || this.attachShadow({ mode: 'open' });
        shadowDOM.innerHTML = '';
        shadowDOM.appendChild(template.content.cloneNode(true));

        this._addEventListeners();
    }

    _addEventListeners() {
        const footerEle = this.shadowRoot.querySelector('footer');
        if (footerEle) {
            const footerChildArr = [...footerEle.children];
            footerChildArr.forEach((ele) => {
                ele.addEventListener('click', () => {
                    this.dispatchEvent(new CustomEvent('tfooter', {
                        bubbles: true,
                        detail: {
                            version: '2.2.21',
                            method: this.getAttribute('callback'),
                            params: '',
                            data: {
                                value: ele.children[0].innerHTML,
                            },
                        },
                    }));
                });
            });
        }
    }

    setMarqueeContent(content) {
        if (this.shadowRoot) {
            const marquee = this.shadowRoot.querySelector('.marquee');
            if (marquee) marquee.innerHTML = content;
        }
    }
}

customElements.define('t-footer', Footer);
