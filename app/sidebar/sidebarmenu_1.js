import styles from './sidebarmenu.scss';

class SideBarMenu extends HTMLElement {

    constructor() {
        super();
        setTimeout(() => {
            var sidebarData = this.getAttribute("data");
            var callbackFn = this.getAttribute("callback");
            let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
            var data = "";
            var JSONPARSE = JSON.parse(sidebarData);
            if (JSONPARSE) {
                data = `<div class="sideButton" value='${sidebarData}' title=${JSONPARSE.name}><img src=${JSONPARSE.icon} alt=""/> <label>${JSONPARSE.name}</label></div>`;
            }
            const template = document.createElement('template');
            template.innerHTML = `
            <style>${styles.toString()}</style>
            <div class="t-sidebarList ${theme}">
                <div class="t-sidebarPanel">
                    ${data}
                </div>
            </div>`;

            // Add a shadow DOM
            const shadowDOM = this.attachShadow({
                mode: 'open'
            });
            // render
            shadowDOM.appendChild(template.content.cloneNode(true));
            //console.log(shadowDOM);
            var elems = shadowDOM.querySelectorAll('.t-sidebarList .sideButton');
            // console.log("SideBar -> ", elems);

            // var tsidebar = shadowDOM.querySelectorAll('.t-sidebar');
            // console.log("tsidebar -> ", tsidebar);

            var tsidebarPanel = shadowDOM.querySelectorAll('.t-sidebarList .t-sidebarPanel');
            var sidebarLabel = shadowDOM.querySelectorAll('.t-sidebarList .sideButton label');

            function mouseHoverEvent(params) {
                // console.log("over", sidebarLabel);
                tsidebarPanel[0].style.minWidth = "100px";
                sidebarLabel.forEach(element => {
                    element.style.display = "block";
                });
            }
            tsidebarPanel[0].addEventListener("mouseover", mouseHoverEvent);

            function mouseOutEvent(params) {
                tsidebarPanel[0].style.minWidth = "auto";
                sidebarLabel.forEach(element => {
                    element.style.display = "none";
                });
            }
            tsidebarPanel[0].addEventListener("mouseout", mouseOutEvent);

            /*/
            function onClickEvent() {
                // console.log(this.getAttribute("value"));
                var value = this.getAttribute("value");
                // alert(value);
                if (window[`${callbackName}`]) {
                    window[`${callbackName}`](value);
                }
            }
            */
            elems.forEach(element => {
                element.addEventListener('click', () => {
                    if (callbackFn) {
                        var checkEvent = new CustomEvent("tsidebarmenu", {
                            bubbles: true,
                            detail: {
                                version: '2.2.21',
                                method: callbackFn,
                                params: "",
                                data: JSON.parse(element.getAttribute("value"))
                            }
                        });
                        if (this.dispatchEvent(checkEvent)) {
                            // Do default operation here
                            console.log('Performing default operation');
                        } else {
                            console.log("No callback Abvailable");
                        }
                    }
                })
            });
        }, 0);

    }

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return ['theme'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if (name == 'theme' && newValue) {
            if (this.shadowRoot) {
                let tag = this.shadowRoot.querySelectorAll('.t-sidebarList')[0];
                if (oldValue) {
                    tag.classList.remove(oldValue);
                }
                tag.classList.add(newValue);
            }
        }


    }

    adoptedCallback() {
        // console.log("adoptedCallback:::Html Element", this.getAttribute('datetime'));
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    connectedCallback() {

    }
}
export default SideBarMenu;