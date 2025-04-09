import styles from './select.scss';

class Select extends HTMLElement {
    constructor() {
        super();
        setTimeout(() => {
            var selectData = this.hasAttribute("data") ? this.getAttribute("data") : '[]';
            var lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
            let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
            var callbackFn = this.getAttribute("callback");
            var selected = this.getAttribute("selected");
            var selectDataString = "";
            var JSONPARSE = JSON.parse(selectData);
            if (JSONPARSE.length > 0) {
                for (let i = 0; i < JSONPARSE.length; i++) {
                    const element = JSONPARSE[i];
                    if (selected) {
                        var selectValue = "";
                        if (element.value == selected) {
                            selectValue = "selected";
                        }
                        selectDataString += `<option value=${element.value} ${selectValue}> ${element.name} </option>`;
                    } else {
                        selectDataString += `<option value=${element.value}>  ${element.name} </option>`;
                    }

                }
            }
            const template = document.createElement('template');
            template.innerHTML = `
            <style>${styles.toString()}</style>
            <div class="custom-select ${theme}" ${lang}>
                <select class="t-select">
                    <option value='none' disabled selected>Select</option>
                    ${selectDataString}
                </select>
            </div>
            `;

            // Add a shadow DOM
            const shadowDOM = this.attachShadow({ mode: 'open' });
            // render
            shadowDOM.appendChild(template.content.cloneNode(true));


            var x, i, j, l, ll, selElmnt, a, b, c;
            /*look for any elements with the class "custom-select":*/

            x = shadowDOM.querySelectorAll(".custom-select");
            l = x.length;
            for (i = 0; i < l; i++) {
                selElmnt = x[i].getElementsByTagName("select")[0];
                ll = selElmnt.length;
                /*for each element, create a new DIV that will act as the selected item:*/
                a = document.createElement("DIV");
                a.setAttribute("class", "select-selected");
                // a.setAttribute("value", selElmnt.options[selElmnt.selectedIndex]);
                a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
                x[i].appendChild(a);
                /*for each element, create a new DIV that will contain the option list:*/
                b = document.createElement("DIV");
                b.setAttribute("class", "select-items select-hide");
                for (j = 1; j < ll; j++) {
                    /*for each option in the original select element,
                    create a new DIV that will act as an option item:*/
                    c = document.createElement("DIV");
                    c.innerHTML = selElmnt.options[j].innerHTML;
                    c.setAttribute("value", selElmnt.options[j].getAttribute('value'));
                    c.addEventListener("click", function (e) {
                        /*when an item is clicked, update the original select box,
                        and the selected item:*/
                        var y, i, k, s, h, sl, yl;
                        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                        sl = s.length;
                        h = this.parentNode.previousSibling;
                        for (i = 0; i < sl; i++) {
                            if (s.options[i].innerHTML == this.innerHTML) {
                                s.selectedIndex = i;
                                h.innerHTML = this.innerHTML;
                                y = this.parentNode.getElementsByClassName("same-as-selected");
                                yl = y.length;
                                for (k = 0; k < yl; k++) {
                                    y[k].removeAttribute("class");
                                }
                                this.setAttribute("class", "same-as-selected");

                                // console.log(this.innerHTML);
                                var clickevent = new CustomEvent("tselect", {
                                    bubbles: true,
                                    detail: {
                                        version: '1.0',
                                        method: callbackFn,
                                        params: "",
                                        data: this.innerHTML
                                    }
                                });

                                if (this.dispatchEvent(clickevent)) {
                                    // Do default operation here...
                                    console.log('Performing default operation');
                                } else {
                                    console.log("Callback Not Available");
                                }

                                break;
                            }
                        }
                        h.click();
                    });
                    b.appendChild(c);
                }
                x[i].appendChild(b);
                a.addEventListener("click", function (e) {
                    /*when the select box is clicked, close any other select boxes,
                    and open/close the current select box:*/
                    e.stopPropagation();
                    closeAllSelect(this);
                    this.nextSibling.classList.toggle("select-hide");
                    this.classList.toggle("select-arrow-active");
                });
            }
            function closeAllSelect(elmnt) {
                /*a function that will close all select boxes in the document,
                except the current select box:*/
                var x, y, i, xl, yl, arrNo = [];
                x = document.getElementsByClassName("select-items");
                y = document.getElementsByClassName("select-selected");
                xl = x.length;
                yl = y.length;
                for (i = 0; i < yl; i++) {
                    if (elmnt == y[i]) {
                        arrNo.push(i)
                    } else {
                        y[i].classList.remove("select-arrow-active");
                    }
                }
                for (i = 0; i < xl; i++) {
                    if (arrNo.indexOf(i)) {
                        x[i].classList.add("select-hide");
                    }
                }
            }
            /*if the user clicks anywhere outside the select box,
            then close all select boxes:*/
            document.addEventListener("click", closeAllSelect);


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
                let tag = this.shadowRoot.querySelectorAll('.custom-select')[0];
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
export default Select;