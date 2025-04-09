import styles from './multi-dropdown.scss'

class MultiDropdown extends HTMLElement {

    selectText = 'Select';
    itemsselected = 'items selected';
    placeholderInput = 'Search';
    selectAll = 'Select All';
    multiLang = "en";
    theme = 'dark';
    noData = "No Data";

    constructor() {
        super();
        // setTimeout(() => {
        this.theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
        this.selectText = this.hasAttribute("placeHolder") ? this.getAttribute("placeHolder") : "Select";
        let lang = 'lang=en';
        this.multiLang = 'en';
        if (this.hasAttribute('lang')) {
            if (this.getAttribute('lang') == 'ar') {
                lang = 'style="direction:rtl" lang=ar';
                this.multiLang = 'ar';
            } else {
                lang = 'lang=en';
            }
        }
        // let lang = this.hasAttribute('lang') ? (this.getAttribute('lang') == 'ar' ? 'style="direction:rtl" lang=ar' : 'lang=en') : "lang=en";

        let searchEnable = this.hasAttribute('search') ? (this.getAttribute('search') == 'true' ? '' : 'hide') : 'hide';
        // let rotateSpan = this.hasAttribute('lang') ? (this.getAttribute('lang') == 'ar' ? 'rotateSpanRight' : 'rotateSpanLeft') : "rotateSpanLeft";

        let inputWidth = '';
        // if (this.hasAttribute("sm") || this.hasAttribute("small")) {
        //     inputWidth = 'sm';
        // } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
        //     inputWidth = 'lg';
        // }
        // if (inputWidth) checkList.classList.add(inputWidth);

        const template = document.createElement('template');
        template.innerHTML = `
                <style>
                    ::-webkit-scrollbar {
                        width: 0px;
                    }
                    input[type="search"]::-webkit-search-decoration,
                    input[type="search"]::-webkit-search-cancel-button,
                    input[type="search"]::-webkit-search-results-button,
                    input[type="search"]::-webkit-search-results-decoration {
                        display: none;
                    }
                    ${styles.toString()}
                </style>
            <div class="dropdown-check-list ${this.theme} ${inputWidth}" ${lang} >
                <div class="anchor">
                    <div>${this.selectText}</div>
                </div>
                <div id="listPanel">
                    <span id="searchId" class="${searchEnable}">
                        <input type="search" class="tinput-serach" placeholder="${this.placeholderInput}" />
                    </span> 
                    <ul class="itemsAll hide">
                        <li>
                            <label class="container"><div class="selectAll">${this.selectAll}</div>
                                <input type="checkbox" id="selectAll" value="all">
                                <span class="checkmark"></span>
                            </label>
                        </li>
                    </ul>
                    <ul class="items">
                        <li class="noData">${this.noData}</li>
                    </ul>
                </div>
            </div>
            `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // let Id = this.shadowRoot.querySelector('.dropdown-check-list').getAttribute('id');
        let checkList = this.shadowRoot.querySelector('.dropdown-check-list');
        checkList.querySelector('.anchor').addEventListener('click', e => {
            if (checkList.classList.contains('visible')) {
                checkList.classList.remove('visible');
            } else {
                checkList.classList.add('visible');
            }
        });

        document.addEventListener('click', (event) => {
            event.stopPropagation();
            if (event.target !== this) {
                this.shadowRoot.querySelector('.dropdown-check-list').classList.remove('visible');
            }
        });
        // }, 0);
    }

    applySelectText(values) {
        let checklistDiv = this.shadowRoot.querySelector('.dropdown-check-list');
        let textELement = checklistDiv.querySelector(".anchor").getElementsByTagName("div")[0];
        // this.selectText = this.hasAttribute("placeHolder") ? this.getAttribute("placeHolder") : this.selectText;
        if (this.multiLang == 'ar') {
            textELement.innerText = (values.length ? (this.EntoAr(values.length) + " " + this.itemsselected) : this.selectText);
        } else {
            textELement.innerText = (values.length ? (this.ArtoEn(values.length) + " " + this.itemsselected) : this.selectText);
        }
    }

    connectedCallback() {
        // setTimeout(() => {
        if (this.shadowRoot) {

            let inputWidth = '';
            if (this.hasAttribute("sm") || this.hasAttribute("small")) {
                inputWidth = 'sm';
            } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
                inputWidth = 'lg';
            }

            let checkList = this.shadowRoot.querySelector('.dropdown-check-list');
            if (inputWidth) {
                checkList.classList.add(inputWidth);
            }
            let Input = checkList.querySelector('#searchId').querySelector('input');
            Input.addEventListener('keyup', () => {
                let filter = Input.value.toUpperCase();
                let list = this.shadowRoot.querySelector(".items").querySelectorAll('li');
                for (const li of list) {
                    let value = li.querySelector('input').value;
                    if (value.toUpperCase().indexOf(filter) == 0)
                        li.style.display = 'block';
                    else
                        li.style.display = 'none';
                }
            });

            //create custom event
            let listData = checkList.querySelector('.items').querySelectorAll('li');
            for (const data of listData) {
                data.addEventListener('change', () => {
                    let returnArray = [];
                    listData.forEach(element => {
                        if (element.getElementsByTagName('input')[0].checked) {
                            returnArray.push(element.getElementsByTagName('input')[0].getAttribute('id'));
                        }
                    });
                    this.applySelectText(returnArray);
                    // this.sendToApp(returnArray);
                });
            }

            let selectAll = checkList.querySelector('#selectAll');

            selectAll.addEventListener('change', (event) => {
                let rarray = [];
                let ld = this.shadowRoot.querySelector('.items').querySelectorAll('li');
                ld.forEach(element => {
                    if (event.currentTarget.checked) {
                        element.querySelector('input').checked = true;
                        rarray.push(parseInt(element.querySelector('input').getAttribute('id')));
                    } else {
                        element.querySelector('input').checked = false;
                    }
                });
                this.applySelectText(rarray);
                this.sendToApp(rarray);
            });
        }
        // }, 0);
    }

    get value() {
        let itemsDiv = this.shadowRoot.querySelectorAll('.items')[0];
        let listData = itemsDiv.querySelectorAll('li');
        let arrayData = [];
        listData.forEach(element => {
            if (element.getElementsByTagName('input').length) {
                if (element.getElementsByTagName('input')[0].checked) {
                    arrayData.push(parseInt(element.getElementsByTagName('input')[0].getAttribute('id')));
                }
            }
        });
        return arrayData;
    }

    set value(valueArray) {
        if (valueArray.length) {
            this.applySelectedData(valueArray);
            let itemsDiv = this.shadowRoot.querySelectorAll('.items')[0];
            let listData = itemsDiv.querySelectorAll('li');
            let rarray = [];
            let checkAllSelected = true;
            listData.forEach(element => {
                if (element.querySelector('input')) {
                    if (element.querySelector('input').checked) {
                        rarray.push(element.querySelector('input').getAttribute('id'));
                    } else {
                        checkAllSelected = false;
                    }
                }
            });
            if (checkAllSelected) {
                this.shadowRoot.querySelector('#selectAll').checked = true;
            } else {
                this.shadowRoot.querySelector('#selectAll').checked = false;
            }
            this.applySelectText(rarray);
        }
    }

    static get observedAttributes() {
        return ['theme', 'lang', 'data', 'selected'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            if (newValue) {
                switch (name) {
                    case "data":
                        this.DataModification(newValue);
                        break;
                    case "selected":
                        let selectedData = newValue == '' ? [] : JSON.parse(newValue);
                        if (selectedData.length) {
                            this.applySelectedData(selectedData);
                            let itemsDiv = this.shadowRoot.querySelectorAll('.items')[0];
                            let listData = itemsDiv.querySelectorAll('li');
                            let rarray = [];
                            let checkAllSelected = true;
                            listData.forEach(element => {
                                if (element.querySelector('input')) {
                                    if (element.querySelector('input').checked) {
                                        rarray.push(element.querySelector('input').getAttribute('id'));
                                    } else {
                                        checkAllSelected = false;
                                    }
                                }
                            });
                            if (checkAllSelected) {
                                this.shadowRoot.querySelector('#selectAll').checked = true;
                            } else {
                                this.shadowRoot.querySelector('#selectAll').checked = false;
                            }
                            this.applySelectText(rarray);
                        }
                        break;
                    case "lang":
                        const dropdowncheck = this.shadowRoot.querySelector('.dropdown-check-list');
                        const containDiv = dropdowncheck.querySelector('.anchor').querySelector('div');
                        const inputSearch = dropdowncheck.querySelector('.tinput-serach');
                        const selectAll = dropdowncheck.querySelector('.selectAll');
                        const noData = dropdowncheck.querySelector('.noData');
                        if (newValue == 'ar') {
                            this.multiLang = 'ar';
                            dropdowncheck.style.direction = "rtl";
                            dropdowncheck.setAttribute("lang", this.multiLang);
                            this.placeholderInput = 'يبحث';
                            this.itemsselected = 'العناصر المحددة';
                            this.selectText = 'يختار';
                            this.selectAll = 'اختر الكل';
                            if ((containDiv.innerText).includes('Select')) {
                                let textreplace = (containDiv.innerText).replace('Select', this.selectText);
                                containDiv.innerText = textreplace;
                            } else if ((containDiv.innerText).includes('items selected')) {
                                let splitText = (containDiv.innerText).split(" ");
                                let textreplace = (splitText[1] + " " + splitText[2]).replace('items selected', this.itemsselected);
                                containDiv.innerText = this.EntoAr(splitText[0]) + " " + textreplace;
                            }
                            this.noData = "لايوجد بيانات";
                        } else {
                            this.multiLang = 'en';
                            dropdowncheck.style.direction = "ltr";
                            dropdowncheck.setAttribute("lang", this.multiLang);
                            this.placeholderInput = 'Search';
                            this.itemsselected = 'items selected';
                            this.selectText = 'Select';
                            this.selectAll = 'Select All';
                            if ((containDiv.innerText).includes('يختار')) {
                                let textreplace = (containDiv.innerText).replace('يختار', this.selectText);
                                containDiv.innerText = textreplace;
                            } else if ((containDiv.innerText).includes('العناصر المحددة')) {
                                let splitText = (containDiv.innerText).split(" ");
                                let textreplace = (splitText[1] + " " + splitText[2]).replace('العناصر المحددة', this.itemsselected);
                                containDiv.innerText = this.ArtoEn(splitText[0]) + " " + textreplace;
                            }
                            this.noData = "No Data";
                        }
                        inputSearch.setAttribute('placeholder', this.placeholderInput);
                        selectAll.innerText = this.selectAll;
                        if (noData) {
                            noData.innerText = this.noData;
                        }
                        break;
                    case "theme":
                        const wrap = this.shadowRoot.querySelector('.dropdown-check-list');
                        this.theme = newValue;
                        if (wrap) {
                            if (oldValue) {
                                wrap.classList.remove(oldValue);
                            }
                            this.theme = newValue;
                            wrap.classList.add(newValue);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    EntoAr(data) {
        let s = data.toString();
        return s.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])
    }

    ArtoEn(data) {
        let s = data.toString();
        return s.replace(/[\u0660-\u0669]/g, d => d.charCodeAt() - 1632)
    }

    // langaugeBasedRotation(newValue) {
    //     let div = this.shadowRoot.querySelector('.dropdown-check-list');
    //     if (newValue == 'ar') {
    //         div.style.direction = "rtl";
    //         div.setAttribute("lang", "ar");
    //         div.querySelector('ul').setAttribute("part", "items")
    //         div.querySelector('div').setAttribute("part", "anchor rotateSpanRight")
    //     } else {
    //         div.style.direction = "ltr";
    //         div.setAttribute("lang", "en");
    //         div.querySelector('ul').setAttribute("part", "items")
    //         div.querySelector('div').setAttribute("part", "anchor rotateSpanLeft")
    //     }
    // }

    applySelectedData(selectedData) {
        if (selectedData) {
            let itemsDiv = this.shadowRoot.querySelectorAll('.items')[0];
            let list = itemsDiv.querySelectorAll('li');
            for (const li of list) {
                if (li.querySelector('input')) {
                    li.querySelector('input').checked = false;
                }
            }
            selectedData.forEach(selectedDataelement => {
                list.forEach(listelement => {
                    if (listelement.querySelector('input')) {
                        if (listelement.querySelector('input').id == selectedDataelement) {
                            listelement.querySelector('input').checked = true;
                        }
                    }
                });
            });
        }
    }

    DataModification(newValue) {
        let listOfData = '';
        let data = newValue == '' ? [] : JSON.parse(newValue);
        if (data.length > 0) {
            this.shadowRoot.querySelector('.itemsAll').classList.remove('hide');
            for (const res of data) {
                listOfData += `<li>
                        <label class="container"> ${res.label}
                            <input type="checkbox" id=${res.id} value=${res.label}>
                            <span class="checkmark"></span>
                        </label>
                    </li>`
            }
        } else {
            this.shadowRoot.querySelector('.itemsAll').classList.add('hide');
            listOfData = `<li class="noData">No Data</li>`;
        }
        let itemsDiv = this.shadowRoot.querySelectorAll('.items')[0];
        itemsDiv.innerHTML = null;
        itemsDiv.innerHTML = listOfData;

        let selectedData = this.getAttribute('selected') == '' ? [] : JSON.parse(this.getAttribute('selected'));
        this.applySelectedData(selectedData);

        //custom event for the attribute change call back
        let listData = itemsDiv.querySelectorAll('li');
        let rarray = [];
        listData.forEach(element => {
            if (element.getElementsByTagName('input')[0].checked) {
                rarray.push(element.getElementsByTagName('input')[0].getAttribute('id'));
            }
        });
        this.applySelectText(rarray);

        //keyUp function for search
        let Input = this.shadowRoot.querySelector('input');
        Input.addEventListener('keyup', () => {
            let filter = Input.value.toUpperCase();
            let list = this.shadowRoot.querySelectorAll('li');
            for (const li of list) {
                let value = li.querySelector('input').value;
                if (value.toUpperCase().indexOf(filter) == 0)
                    li.style.display = 'block';
                else
                    li.style.display = 'none';
            }
        });
        for (const lid of listData) {
            lid.addEventListener('change', () => {
                let returnArray = [];
                listData.forEach(element => {
                    if (element.getElementsByTagName('input')[0].checked) {
                        returnArray.push(parseInt(element.getElementsByTagName('input')[0].getAttribute('id')));
                    }
                });
                this.applySelectText(returnArray);
                this.sendToApp(returnArray);
            });
        }
    }

    sendToApp(returnArray) {
        if (this.hasAttribute("callback")) {
            let checkEvent = new CustomEvent('tmultidropdown', {
                bubbles: true,
                detail: {
                    version: '1.0',
                    method: this.getAttribute("callback"),
                    params: "",
                    data: returnArray
                }
            });
            if (this.dispatchEvent(checkEvent)) {
                // Do default operation here
            } else {
            }
        }
    }


}
export default MultiDropdown;
