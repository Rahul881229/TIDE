import styles from './multi-dropdown.scss'

class MultiDropdown extends HTMLElement {

    selectText = 'Select';
    placeholderInput = 'Search';
    dropheight = '15vh';
    selectAllText = 'Select All';
    selectedText = 'Selected';
    multiLang = "en";
    optionData = [];


    #internals = this.attachInternals();

    static formAssociated = true;

    static observedAttributes = ['placeholder', 'selected', 'search', 'data', 'theme', 'lang', 'disabled', 'dropheight'];

    get form() { return this.#internals.form; }
    get name() { return this.getAttribute('name') };
    get type() { return this.localName; }

    get validity() { return this.#internals.validity; }
    get validationMessage() { return this.#internals.validationMessage; }
    get willValidate() { return this.#internals.willValidate; }



    constructor() {
        super();
        this.selectText = this.hasAttribute("placeholder") ? this.getAttribute("placeholder") : "Select";
        let lang = 'lang=en';
        this.multiLang = 'en';
        if (this.hasAttribute('lang')) {
            if (this.getAttribute('lang') == 'ar') {
                lang = 'style="direction:rtl" lang=ar';
                this.multiLang = 'ar';
                this.selectText = 'يختار';
            } else {
                this.selectText = 'Select';
            }
        }
        let inputWidth = '';
        if (this.hasAttribute("sm") || this.hasAttribute("small")) {
            inputWidth = 'sm';
        } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
            inputWidth = 'lg';
        }
        const template = document.createElement('template');
        template.innerHTML = `
        <style>${styles.toString()}</style>
            <div class="multidropdown ${inputWidth}" ${lang}>
                <div class="select-btn">
                    <span class="btn-text">${this.selectText}</span>
                    <div class="arrow-dwn"></div>
                </div>
                <div class="list-items">
                <img class="search-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAF3SURBVHjapNS/S5VxFMfx17UbSiGVgkguLaKN5VAKoVNOrYIYDf0FouLQL3CozTs09Qc0yB1b2nIQESxChwIHBaGW5FKCDv7ox3IuPNj9PvdRP8s5nO+X9/N5znPOU6rVajLqwSQeojtqe6jiNdY1USkDnMDbzNkqfuM2WqP2FK/ygC0RxzKwx7iIOxhCGx7gB15irpnDDtRt9mMjcfdynPXgFtZSDp9F/igHBvsYjfxNnsN9lDN9aqavuImr2G3k8BI+K673EXvzPsrBKYCHES+kgH9iNIpqJOJWCriAdgwXgHXiLjaxkwI+j7wa/czTOxxhPG+wt/AEXTE2Qw3u9WE5zn7hY5HVm8OLyL9gCccYwGDUf+Ja7PRE7Pl2Cgj3YtDvn3jwJ8zGeC3GpsBfzKCSAtZ1BTeiJd9jj+u6jm8oZWrTdWg50YrdnF/V0QkYzEestDi9dsKRBtCp1CsX0VTG2X+rdxZVGjj9UHY+VTJ/8hWM/RsAM4VbrfI/eqUAAAAASUVORK5CYII=">
                    <input class="search-input-box" type="text" placeholder="${this.placeholderInput}"/>
                    <ul class="items-selectall">
                        <li class="item">
                            <div class="checkbox">
                                <div class="check-icon"></div>
                            </div>
                            <span class="item-text">${this.selectAllText}</span>
                        </li>
                    </ul>
                    <ul class="items" style="max-height:${this.dropheight}">
                    </ul>
                </div>
            </div>
            `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const multidropdown = this.shadowRoot.querySelector('.multidropdown');
        const selectBtn = multidropdown.querySelector('.select-btn');
        selectBtn.addEventListener('click', () => {
            let checkDisabled = (/true/).test(this.getAttribute('disabled'));
            if (!checkDisabled) {
                selectBtn.classList.toggle("open");
            }
        });
        document.addEventListener('click', (event) => {
            event.stopPropagation();
            if (event.target !== this) {
                selectBtn.classList.remove('open');
            }
        });
    }

    // connectedCallback() {
    //     const searchBox = this.shadowRoot.querySelector(".search-input-box");
    //     let searchEnable = (this.getAttribute("search") == 'true') ? true : false;
    //     searchBox.style.display = (searchEnable ? 'block' : 'none');
    //     const searchicon=this.shadowRoot.querySelector(".search-icon")
        
    //     if (!searchEnable) {
    //         searchicon.style.display='none';
    //       } 
    //     if (searchicon) {
    //         searchBox.addEventListener('input', () => {
    //           if (searchBox.value.trim() === '') {
    //             // Show icon if input is empty
    //             if (searchicon) searchicon.style.display = 'block';
    //           } else {
    //             // Hide icon if there is input
    //             if (searchicon) searchicon.style.display = 'none';
    //           }
    //         });
    //       }

    // }


    connectedCallback() {
        const searchBox = this.shadowRoot.querySelector(".search-input-box");
        const searchIcon = this.shadowRoot.querySelector(".search-icon");
    
        let searchEnable = (this.getAttribute("search") === 'true');
    
        // Show or hide the search box based on the 'search' attribute
        searchBox.style.display = searchEnable ? 'block' : 'none';
    
        if (searchEnable) {
            // Initial state when search is enabled
            searchIcon.style.display = 'block';
            searchBox.style.paddingLeft = '24px'; // Padding for when the icon is visible
        } else {
            // Initial state when search is not enabled
            searchIcon.style.display = 'none';
            searchBox.style.padding = '0.4em 0.5em'; // Default padding
        }
    
        searchBox.addEventListener('input', () => {
            if (searchBox.value.trim() === '') {
                // Show icon and adjust padding if input is empty
                searchIcon.style.display = 'block';
                searchBox.style.paddingLeft = '24px'; // Padding for when the icon is visible
            } else {
                searchIcon.style.display = 'none';
                searchBox.style.paddingLeft = '0px !important'; // No padding-left when the icon is hidden
                searchBox.style.padding = '0.4em 0.5em'; // Ensure padding-right
            }
        });
    }
    

    get value() {
        const multidropdown = this.shadowRoot.querySelector('.multidropdown');
        const items = multidropdown.querySelectorAll('.list-items .items li');
        let arrayData = [];
        items.forEach(element => {
            if (element.classList.contains('checked')) {
                arrayData.push((element.getAttribute('value')));
            }
        });
        return arrayData;
    }

    set value(newValue) {
        let selectedData = ((newValue == '' || !newValue) ? [] : newValue);
        this.applySelectedValue(selectedData);
    }

    addingOption(optionData) {
        const multidropdown = this.shadowRoot.querySelector('.multidropdown');
        // const selectBtn = multidropdown.querySelector('.select-btn');
        const itemsselectall = multidropdown.querySelector('.list-items .items-selectall li');
        const itemsUl = multidropdown.querySelector('.list-items .items');
        const btnText = multidropdown.querySelector(".btn-text");
        const searchBox = multidropdown.querySelector(".search-input-box");
        itemsUl.innerHTML = null;
        if (optionData.length > 0) {
            itemsselectall.style.display = 'flex';
            let checkedCount = 0;
            optionData.forEach(element => {
                let elementLi = document.createElement("li");
                elementLi.classList.add('item');
                if (element['checked']) {
                    elementLi.classList.add('checked');
                    checkedCount++;
                }
                elementLi.setAttribute('value', element['id']);
                let elementCheckboxDiv = document.createElement("div");
                elementCheckboxDiv.className = 'checkbox';
                let elementCheckIconDiv = document.createElement("div");
                elementCheckIconDiv.className = 'check-icon';
                elementCheckboxDiv.appendChild(elementCheckIconDiv);
                let elementSpan = document.createElement("span");
                elementSpan.className = 'item-text';
                elementSpan.innerText = element['label'];
                elementLi.appendChild(elementCheckboxDiv);
                elementLi.appendChild(elementSpan);
                itemsUl.appendChild(elementLi);
            });

            if (checkedCount && checkedCount > 0) {
                btnText.innerText = `${(this.multiLang == 'ar' ? this.EntoAr(checkedCount) : this.ArtoEn(checkedCount))} ` + this.selectedText;
                if (checkedCount == optionData.length) {
                    itemsselectall.classList.add('checked');
                }
            } else {
                btnText.innerText = this.selectText;
            }

            const items = multidropdown.querySelectorAll('.list-items .items li');

            searchBox.addEventListener("keyup", () => {
                let searchvalue = searchBox.value;
                if (items.length > 0) {
                    items.forEach(item => {
                        item.classList.add('displayNone');
                        if (((item.innerText).toUpperCase()).includes(searchvalue.toUpperCase())) {
                            item.classList.remove('displayNone');
                        }
                    })
                    this.customEventCallBack(searchvalue, 'search')
                }
            });

            if (items.length > 0) {
                items.forEach(item => {
                    item.addEventListener("click", () => {
                        item.classList.toggle("checked");
                        let checked = itemsUl.querySelectorAll(".checked");
                        let returnArray = [];
                        let unselectedArray = [];
                        if (checked && checked.length > 0) {
                            btnText.innerText = `${(this.multiLang == 'ar' ? this.EntoAr(checked.length) : this.ArtoEn(checked.length))} ` + this.selectedText;
                            checked.forEach(ch => {
                                returnArray.push((ch.getAttribute('value')));
                            });
                        } else {
                            btnText.innerText = this.selectText;
                        }
                        items.forEach(item => {
                            if (!item.classList.contains("checked")) {
                                unselectedArray.push(item.getAttribute('value'));
                            }
                        });
                        if (checked.length == optionData.length) {
                            itemsselectall.classList.add('checked');
                        } else {
                            itemsselectall.classList.remove('checked');
                        }
                        this.customEventCallBack(returnArray, 'tmultidropdown');
                        this.customEventCallBack(unselectedArray, 'unselectedItems'); // Call with unselected items

                    });
                })
            }

            itemsselectall.addEventListener("click", (elem) => {
                itemsselectall.classList.toggle("checked");
                let checked = multidropdown.querySelector('.list-items .items-selectall').querySelectorAll(".checked");
                let returnArray = [];
                let unselectedArray = []; // Array to hold unselected items

                if (checked && checked.length > 0) {
                    let count = 0;
                    items.forEach(item => {
                        if (!item.classList.contains('displayNone')) {
                            item.classList.add("checked");
                            count++;
                            returnArray.push((item.getAttribute('value')));
                        }
                    });
                    btnText.innerText = `${(this.multiLang == 'ar' ? this.EntoAr(count) : this.ArtoEn(count))} ` + this.selectedText;
                } else {
                    items.forEach(item => {
                        item.classList.remove("checked");
                    });
                    btnText.innerText = this.selectText;
                }

                items.forEach(item => {
                    if (!item.classList.contains("checked")) {
                        unselectedArray.push(item.getAttribute('value'));
                    }
                });

                this.customEventCallBack(returnArray, 'tmultidropdown');
                this.customEventCallBack(unselectedArray, 'unselectedItems'); // Call with unselected items

            });
        } else {
            itemsselectall.style.display = 'none';
            let elementDiv = document.createElement("div");
            elementDiv.className = 'noData';
            elementDiv.innerText = this.noData;
            itemsUl.appendChild(elementDiv);
        }
    }

    applySelectedValue(arrayData) {
        console.log("applySelectedValue");
        const multidropdown = this.shadowRoot.querySelector('.multidropdown'),
            itemsselectall = multidropdown.querySelector('.list-items .items-selectall li'),
            items = multidropdown.querySelectorAll('.list-items .items li'),
            btnText = multidropdown.querySelector(".btn-text");

        items.forEach(item => {
            item.classList.remove('checked');
        });
        itemsselectall.classList.remove('checked');
        btnText.innerText = this.selectText;
        if (arrayData && arrayData.length > 0) {
            let checkedCount = 0;
            arrayData.forEach(selectedValue => {
                items.forEach(item => {
                    if (selectedValue == item.getAttribute('value')) {
                        item.classList.add('checked');
                        checkedCount++;
                    }
                });
            });
            if (checkedCount && checkedCount > 0) {
                btnText.innerText = `${(this.multiLang == 'ar' ? this.EntoAr(checkedCount) : this.ArtoEn(checkedCount))} ` + this.selectedText;
                if (checkedCount == items.length) {
                    itemsselectall.classList.add('checked');
                }
            }
        }
    }

    disabledElement(newValue) {
        const multidropdown = this.shadowRoot.querySelector('.multidropdown');
        const selectBtn = multidropdown.querySelector('.select-btn');
        newValue = (/true/).test(newValue);
        if (newValue) {
            selectBtn.classList.add('disabled');
        } else {
            selectBtn.classList.remove('disabled');
        }

    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            switch (name) {
                case 'search':
                    // Handle changes to the 'search' attribute
                    if (newValue === 'true') {
                        // Show the search input box or perform other actions when 'search' is set to 'true'
                        const searchBox = this.shadowRoot.querySelector(".search-input-box");
                        searchBox.style.display = 'block';
                    } else {
                        // Hide the search input box or perform other actions when 'search' is set to 'false' or other values
                        const searchBox = this.shadowRoot.querySelector(".search-input-box");
                        searchBox.style.display = 'none';
                    }

                case 'dropheight':
                    let list = this.shadowRoot.querySelector('.multidropdown .list-items .items');
                    list.style.maxHeight = newValue;
                    break;
                case 'data':
                    this.optionData = ((newValue == '' || !newValue) ? [] : JSON.parse(newValue));
                    this.addingOption(this.optionData);
                    break;
                case 'data':
                    this.optionData = (newValue === '' || !newValue) ? [] : JSON.parse(newValue);
                    this.addingOption(this.optionData);



                    break;

                case 'selected':
                    let selectedData = ((newValue == '' || !newValue) ? [] : JSON.parse(newValue));
                    this.applySelectedValue(selectedData);
                    break;
                case 'disabled':
                    this.disabledElement(newValue);
                    break;
                case 'theme':
                    let wrap = this.shadowRoot.querySelector('.multidropdown');
                    if (wrap) {
                        if (oldValue) wrap.classList.remove(oldValue);
                        if (newValue) wrap.classList.add(newValue);
                    }
                    break;
                case 'placeholder':
                    if (newValue) {
                        this.selectText = newValue;
                        this.shadowRoot.querySelector('.btn-text').innerText = this.selectText;
                    }
                    break;
                case 'lang':
                    const multidropdown = this.shadowRoot.querySelector('.multidropdown');
                    const btnText = multidropdown.querySelector(".btn-text");
                    const selectAllItemText = multidropdown.querySelector('.items-selectall .item-text');
                    const searchBox = multidropdown.querySelector(".search-input-box")
                    const noData = multidropdown.querySelector('.noData');
                    if (newValue == 'ar') {
                        this.multiLang = newValue;
                        multidropdown.setAttribute('dir', 'rtl');
                        multidropdown.setAttribute('lang', this.multiLang);
                        this.selectText = 'يختار';
                        this.placeholderInput = 'يبحث';
                        this.noData = "لايوجد بيانات";
                        this.selectAllText = 'اختر الكل';
                        this.selectedText = 'المحدد';
                        if ((btnText.innerText).includes('Selected')) {
                            let splitText = (btnText.innerText).split(" ");
                            let textreplace = (splitText[1]).replace('Selected', this.selectedText);
                            btnText.innerText = this.EntoAr(splitText[0]) + " " + textreplace;
                        } else if ((btnText.innerText).includes('Select')) {
                            btnText.innerText = this.selectText;
                        }
                    } else {
                        this.multiLang = 'en';
                        multidropdown.removeAttribute('dir');
                        multidropdown.setAttribute('lang', this.multiLang);
                        this.selectText = 'Select';
                        this.placeholderInput = 'Search';
                        this.noData = 'No Data';
                        this.selectAllText = 'Select All';
                        this.selectedText = 'Selected';
                        if ((btnText.innerText).includes('المحدد')) {
                            let splitText = (btnText.innerText).split(" ");
                            let textreplace = (splitText[1]).replace('المحدد', this.selectedText);
                            btnText.innerText = this.ArtoEn(splitText[0]) + " " + textreplace;
                        } else if ((btnText.innerText).includes('يختار')) {
                            btnText.innerText = this.selectText;
                        }
                    }
                    selectAllItemText.innerText = this.selectAllText;
                    searchBox.setAttribute('placeholder', this.placeholderInput);
                    if (noData) {
                        noData.innerText = this.noData;
                    }
                    break;
                default: break;
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

    customEventCallBack(returnArray, type) {

        switch (type) {
            case 'tmultidropdown':
                this.dispatchEvent(new CustomEvent('tmultidropdown', {
                    bubbles: true,
                    detail: {
                        version: '2.2.21',
                        method: this.getAttribute("callback"),
                        params: "",
                        data: returnArray
                    }
                }))
                break;
            case 'search':
                this.dispatchEvent(new CustomEvent('search', {
                    bubbles: true,
                    detail: {
                        version: '2.2.21',
                        method: this.getAttribute("callback"),
                        params: "",
                        data: returnArray
                    }
                }))
                break;

                case 'unselectedItems':
                this.dispatchEvent(new CustomEvent('unselectedItems', {
                    bubbles: true,
                    detail: {
                        version: '2.2.21',
                        method: this.getAttribute("callback"),
                        params: "",
                        data: returnArray
                    }
                }))
                break;
            default:
                break;
        }
    }
}
export default MultiDropdown;
