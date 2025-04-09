import styles from './pagination.scss';

class Pagination extends HTMLElement {

    paginationLang = 'en';
    numberOfItems = 0;
    limitPerPage = 1;

    constructor() {
        super();

        // this.paginationType = this.getAttribute("pages") || 'false';
        // console.log(this.paginationType);
        let btnSize = '';
        if (this.hasAttribute("small") || this.hasAttribute("sm")) {
            btnSize = 'sm';
        } else if (this.hasAttribute("large") || this.hasAttribute("lg")) {
            btnSize = 'lg';
        }

        const template = document.createElement('template');
        template.innerHTML = `
                <style>${styles.toString()}</style> 
                <div class='pagination ${btnSize}'>
                </div>
                `;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    EntoAr(data) {
        let s = data.toString();
        return s.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])
    }

    ArtoEn(data) {
        let s = data.toString();
        return s.replace(/[\u0660-\u0669]/g, d => d.charCodeAt() - 1632)
    }

    getTranslate(tnum) {
        let pagelinks = this.shadowRoot.querySelectorAll('.page-link');
        // console.log("translate pagelinks-> ", pagelinks);
        if (tnum == 'ar') {
            pagelinks.forEach(element => {
                // console.log("translate pagelinks element -> ", element);
                if (element.querySelector('label')) {
                    element.querySelector('label').textContent = this.EntoAr(element.querySelector('label').textContent);
                } else if (!element.querySelector('img')) {
                    element.textContent = this.EntoAr(element.textContent);
                    // console.log("element.textContent -> ", element.textContent);
                    if ((element.textContent).includes('of')) {
                        element.textContent = (element.textContent).replace('of', 'ل');
                    }
                }
            });
        } else {
            pagelinks.forEach(element => {
                // console.log("translate pagelinks element -> ", element);
                if (element.querySelector('label')) {
                    element.querySelector('label').textContent = this.ArtoEn(element.querySelector('label').textContent);
                } else if (!element.querySelector('img')) {
                    element.textContent = this.ArtoEn(element.textContent);
                    // console.log("element.textContent -> ", element.textContent);
                    if ((element.textContent).includes('ل')) {
                        element.textContent = (element.textContent).replace('ل', 'of');
                    }
                }
            });
        }

    }

    getPageList(totalPages, page, maxLength) {
        // console.log("getPageList  === ", totalPages, page, maxLength);
        if (maxLength < 5) throw "maxLength must be at least 5";

        // function range(start, end) {
        //     return Array.from(Array(end - start + 1), (_, i) => i + start);
        // }

        function range(start, end) {
            try {
                return Array.from(Array(end - start + 1), (_, i) => i + start);
            } catch (error) {
                // console.error('Error in range function:', error);

                return [];
            }
        }

        var sideWidth = maxLength < 9 ? 1 : 2;
        var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
        var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
        if (totalPages <= maxLength) {
            // no breaks in list
            return range(1, totalPages);
        }
        if (page <= maxLength - sideWidth - 1 - rightWidth) {
            // no break on left of page
            return range(1, maxLength - sideWidth - 1)
                .concat([0])
                .concat(range(totalPages - sideWidth + 1, totalPages));
        }
        if (page >= totalPages - sideWidth - 1 - rightWidth) {
            // no break on right of page
            return range(1, sideWidth)
                .concat([0])
                .concat(
                    range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages)
                );
        }
        // Breaks on both sides
        return range(1, sideWidth)
            .concat([0])
            .concat(range(page - leftWidth, page + rightWidth))
            .concat([0])
            .concat(range(totalPages - sideWidth + 1, totalPages));
    }

    showPage(whichPage) {
        // console.log("showPage -> ", whichPage);
        // if (whichPage < 1 || whichPage > this.totalPages) return false;
        if (whichPage < 1 || whichPage > this.totalPages) whichPage=1;
        this.currentPage = whichPage;
        this.shadowRoot.querySelectorAll('#page-item').forEach(e => {
            e.remove()
        });
        this.paginationType = this.getAttribute("pages") || 'true';
        if (this.paginationType === 'true') {
            this.getPageList(this.totalPages, this.currentPage, this.paginationSize).forEach(item => {


                let pageLi = document.createElement("li");
                pageLi.classList.add("page-item")
                pageLi.id = ("page-item")
                if (item) pageLi.classList.add("current-page")
                if (item === this.currentPage) pageLi.classList.add("active")
                let pageLink = document.createElement("button");
                pageLink.classList.add("page-link");
                pageLink.setAttribute('page', (item || "..."));
                pageLink.setAttribute('onclick', "javascript:void(0)")
                let pageLinkBtnLabel = document.createElement("label");
                pageLinkBtnLabel.textContent = (item || "...")
                pageLink.append(pageLinkBtnLabel);
                pageLi.append(pageLink);
                this.shadowRoot.querySelector('.pagination').insertBefore(pageLi, this.shadowRoot.querySelector('#next-page'));
            });
            let notActivePageItem = this.shadowRoot.querySelectorAll('.pagination li.current-page:not(.active)');
            notActivePageItem.forEach(element => {
                element.addEventListener('click', (e) => {
                    // let pageNo = parseInt(element.querySelector('button').textContent);
                    let pageNo = parseInt(element.querySelector('button').getAttribute('page'));
                    this.showPage(pageNo);
                    this.callbackMethod(pageNo);
                })
            });
        } else {
            let pageLi = document.createElement("li");
            pageLi.classList.add("page-item")
            pageLi.id = ("page-item")
            pageLi.classList.add("current-page")
            let pageLink = document.createElement("button");
            pageLink.classList.add("page-link");
            let pageLinkBtnLabel = document.createElement("label");
            pageLinkBtnLabel.textContent = this.currentPage
            pageLink.append(pageLinkBtnLabel);
            pageLi.append(pageLink);
            this.shadowRoot.querySelector('.pagination').insertBefore(pageLi, this.shadowRoot.querySelector('#next-page'));

            let pageLi2 = document.createElement("li");
            pageLi2.classList.add("page-item")
            pageLi2.id = ("page-item")
            let pageLink2 = document.createElement("button");
            pageLink2.classList.add("page-link");
            pageLink2.classList.add("page-link-text");
            pageLink2.textContent = " " + (this.paginationLang == 'ar' ? "ل" : "of") + " " + this.totalPages;
            pageLi2.append(pageLink2);
            this.shadowRoot.querySelector('.pagination').insertBefore(pageLi2, this.shadowRoot.querySelector('#next-page'));
        }
        // console.log("paginationLang -> ", this.paginationLang);
        this.getTranslate(this.paginationLang);
        return true;
    }

    get currentpage() {
        return this.currentPage;
    }

    set currentpage(value) {
        this.numberOfItems = parseInt(this.getAttribute("numberofitems")) | 0;
        this.limitPerPage = parseInt(this.getAttribute("limitperpage")) | 1;
        this.totalPages = Math.ceil(this.numberOfItems / this.limitPerPage);
        this.currentPage = parseInt(value);
        this.showPage(this.currentPage);
    }


    callbackMethod(data) {
        // console.log("callbackMethod pagination -> ", data);
        this.dispatchEvent(new CustomEvent("tpagination", {
            bubbles: true,
            detail: {
                version: "2.2.21",
                method: this.getAttribute("callback"),
                params: '',
                data: {
                    page: parseInt(data)
                }
            }
        }));


    }

    static get observedAttributes() {
        return ['lang', 'numberofitems', 'theme', 'pages', 'limitperpage', 'currentpage'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // console.log("attributeChangedCallback -> ", name, oldValue, newValue);
        if (this.shadowRoot) {
            if (name === 'pages') {
                this.shadowRoot.querySelectorAll('#page-item').forEach(e => {
                    e.remove();
                });
                this.paginationType = newValue || 'false';

                if (this.paginationType === 'true') {
                    this.getPageList(this.totalPages, this.currentPage, this.paginationSize).forEach(item => {
                        let pageLi = document.createElement("li");
                        pageLi.classList.add("page-item");
                        pageLi.id = ("page-item");
                        if (item) pageLi.classList.add("current-page");
                        if (item === this.currentPage) pageLi.classList.add("active");
                        let pageLink = document.createElement("button");
                        pageLink.classList.add("page-link");
                        pageLink.setAttribute('page', (item || "..."));
                        pageLink.setAttribute('onclick', "javascript:void(0)");
                        let pageLinkBtnLabel = document.createElement("label");
                        pageLinkBtnLabel.textContent = (item || "...");
                        pageLink.append(pageLinkBtnLabel);
                        pageLi.append(pageLink);
                        this.shadowRoot.querySelector('.pagination').insertBefore(pageLi, this.shadowRoot.querySelector('#next-page'));
                    });
                    let notActivePageItem = this.shadowRoot.querySelectorAll('.pagination li.current-page:not(.active)');
                    notActivePageItem.forEach(element => {
                        element.addEventListener('click', (e) => {
                            let pageNo = parseInt(element.querySelector('button').getAttribute('page'));
                            this.showPage(pageNo);
                            this.callbackMethod(pageNo);
                        });
                    });
                } else {
                    let pageLi = document.createElement("li");
                    pageLi.classList.add("page-item");
                    pageLi.id = ("page-item");
                    pageLi.classList.add("current-page");
                    let pageLink = document.createElement("button");
                    pageLink.classList.add("page-link");
                    let pageLinkBtnLabel = document.createElement("label");
                    pageLinkBtnLabel.textContent = this.currentPage;
                    pageLink.append(pageLinkBtnLabel);
                    pageLi.append(pageLink);
                    this.shadowRoot.querySelector('.pagination').insertBefore(pageLi, this.shadowRoot.querySelector('#next-page'));

                    let pageLi2 = document.createElement("li");
                    pageLi2.classList.add("page-item");
                    pageLi2.id = ("page-item");
                    let pageLink2 = document.createElement("button");
                    pageLink2.classList.add("page-link");
                    pageLink2.classList.add("page-link-text");
                    pageLink2.textContent = " " + (this.paginationLang == 'ar' ? "ل" : "of") + " " + this.totalPages;
                    pageLi2.append(pageLink2);
                    this.shadowRoot.querySelector('.pagination').insertBefore(pageLi2, this.shadowRoot.querySelector('#next-page'));
                }

                this.getTranslate(this.paginationLang);
            }
            if (name == 'numberofitems' && newValue) {
                this.numberOfItems = newValue;
                this.limitPerPage = parseInt(this.getAttribute("limitperpage"));
                this.totalPages = Math.ceil(this.numberOfItems / this.limitPerPage);
                this.showPage(1);
            } else if (name == 'limitperpage' && newValue) {
                this.numberOfItems = parseInt(this.getAttribute("numberofitems"));
                this.limitPerPage = newValue;
                this.totalPages = Math.ceil(this.numberOfItems / this.limitPerPage);
                this.showPage(1);
            } else if (name == 'currentpage' && newValue) {
                this.numberOfItems = parseInt(this.getAttribute("numberofitems"));
                this.limitPerPage = parseInt(this.getAttribute("limitperpage"));
                this.totalPages = Math.ceil(this.numberOfItems / this.limitPerPage);
                this.currentPage = parseInt(this.getAttribute("currentpage"));
                this.showPage(this.currentPage);
            } else if (name == 'lang' && newValue) {
                let div = this.shadowRoot.querySelector('.pagination');
                if (newValue == 'ar') {
                    div.setAttribute('dir', 'rtl')
                    div.setAttribute('lang', newValue);
                    this.paginationLang = newValue;
                } else {
                    div.removeAttribute('dir')
                    div.setAttribute('lang', newValue);
                    this.paginationLang = 'en';
                }
                // console.log("this.paginationLang -> ", this.paginationLang);
                this.getTranslate(this.paginationLang);
            } else if (name == 'theme') {
                let wrap = this.shadowRoot.querySelector('.pagination');
                if (wrap) {
                    if (oldValue) wrap.classList.remove(oldValue);
                    if (newValue) wrap.classList.add(newValue);
                }
            }
        }
    }

    connectedCallback() {
        console.log("pagination shadowRoot - >", this.shadowRoot);
        this.numberOfItems = parseInt(this.getAttribute("numberofitems")) | 0;
        this.limitPerPage = parseInt(this.getAttribute("limitperpage")) | 1;
        this.totalPages = Math.ceil(this.numberOfItems / this.limitPerPage);
        this.paginationSize = 5;

        if (!this.shadowRoot.querySelector('.pagination #first-page')) {
            let firstPageLi = document.createElement("li");
            firstPageLi.classList.add("page-item");
            firstPageLi.id = "first-page";
            let firstPageLiButton = document.createElement("button");
            firstPageLiButton.classList.add("page-link");
            let firstPageLiImg = document.createElement("img");
            firstPageLiImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAQAAADlauupAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF7GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTEyLTIyVDEyOjMzOjI1KzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0xMi0yMlQxMjozMzo1OCswNTozMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0xMi0yMlQxMjozMzo1OCswNTozMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJEb3QgR2FpbiAyMCUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTNjMWMzOWItMDVkNS1jYTRiLTgyODQtYzk3MjQzZjllODJlIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YWQ5YWViNjQtZGM2OS02YjQ3LTlhYWMtZGVjNjFjZTVhNzRhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTllYzRhYzEtNTU0Mi0yYzRhLWIyNGYtMjUzZDc3MDY3MGU3Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1OWVjNGFjMS01NTQyLTJjNGEtYjI0Zi0yNTNkNzcwNjcwZTciIHN0RXZ0OndoZW49IjIwMjItMTItMjJUMTI6MzM6MjUrMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4wIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTNjMWMzOWItMDVkNS1jYTRiLTgyODQtYzk3MjQzZjllODJlIiBzdEV2dDp3aGVuPSIyMDIyLTEyLTIyVDEyOjMzOjU4KzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+22A1hAAAAUxJREFUOI1j/P+fgSLAcuCfjg4DQ0w0hLtkqSPzlSuENO3/a2LCIBUV+a+jt5eFgSEkmOFAeRkDAwMDg8OPHwwMuA04LsnJ8SOvqZGBobCIYRkzE6PJm7csxDp1H6+T00+92TMZzJSUGA5AxBh52FgJGrDtJh8f14Tuzv8iqWn/HRgx5PEasF/X348xZ9rU/xVSUrjUYDVgx0MhIY6m/t7/UXFxhCIJqwHsMqtW/o9ydiKgl4GBgYGBCZsgYximX0ky4EdfaDjjskWLyDbAQ/7dO4e58YkMBQGBjB3PnpFsAAw4Xt646dsUTW3GNbNmMRzAHpx4DWBgYGDwUv/0yWF6eub/CS6ujF337pFsAAw4fd63j/2Sji7DqZ4eBoe//xgYGBj+f/n1m3H/Xx0dhjJvLwYGBgamb9u22U+/TFxm6ouOZCjq7WekNDsDACTfa86cnqelAAAAAElFTkSuQmCC";
            firstPageLiButton.append(firstPageLiImg);
            firstPageLi.append(firstPageLiButton);
            this.shadowRoot.querySelector('.pagination').append(firstPageLi);

            this.shadowRoot.querySelector('#first-page').addEventListener('click', (e) => {
                if (this.currentPage == 1) return false;
                this.callbackMethod(1);
                return this.showPage(1);
            })
        }

        if (!this.shadowRoot.querySelector('.pagination #previous-page')) {
            let previousPageLi = document.createElement("li");
            previousPageLi.classList.add("page-item");
            previousPageLi.id = "previous-page";
            let previousPageLiButton = document.createElement("button");
            previousPageLiButton.classList.add("page-link");
            let previousPageLiImg = document.createElement("img");
            previousPageLiImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAQAAADlauupAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF7GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTEyLTIyVDExOjE5OjU3KzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0xMi0yMlQxMToyOTozMiswNTozMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0xMi0yMlQxMToyOTozMiswNTozMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJEb3QgR2FpbiAyMCUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZjIwNTJkNmUtY2EzZS00NDQ2LTk5OGMtNzZmNmFjZjM4ODBjIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZTk5MDMzY2ItODZiNC1hMTQ0LWFiYzktYzA1NzMzMjEwOTQ4IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NzIxMjI5YzItYjE5OS1hMTQ5LTk1NTAtMmVlNDIxNjE4ZTRjIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MjEyMjljMi1iMTk5LWExNDktOTU1MC0yZWU0MjE2MThlNGMiIHN0RXZ0OndoZW49IjIwMjItMTItMjJUMTE6MTk6NTcrMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4wIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZjIwNTJkNmUtY2EzZS00NDQ2LTk5OGMtNzZmNmFjZjM4ODBjIiBzdEV2dDp3aGVuPSIyMDIyLTEyLTIyVDExOjI5OjMyKzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+OShDvwAAAURJREFUOI2dk7FLw0Achd8l1alDUSihg4NOYgO6OGoCHRxaHap2Sa3t5j/gKJndRDS0gw4GHFrI0HQrJuLsVFdFaYYgKB06ick5hBSqNk3ypuPuvu9+NzxQClCKUDFvq4dGp/9mOHob8LhEGNBwOA5bjTpNF/IAgI1MhjoEAAXxXydkEixJ6J6fIZFKjU0jsjMycd2JE3Sv5+fYK0WBubcbNOe/R2avkKdWow6Z4wJ+9ldgOMkk1i8v6HtZwuw09Jfg/ojPutA0nC4thkO9MP6CvraaMKPB44IFwgRdnCpgmGIRwvNLbMGm0nsCVtdwfKPGEgCAyA6H4uNBhaS3d/Bl25EFfgS+rTt2lofcbMUSAECu+vEpPuyXIJQr+B4MIgv8iKyqIre8AkvXR5snritT6gLwKhm2zndarWY4Vt8sdUZ1/gEbCXDyt1WQ8QAAAABJRU5ErkJggg==";
            previousPageLiButton.append(previousPageLiImg);
            previousPageLi.append(previousPageLiButton);
            this.shadowRoot.querySelector('.pagination').append(previousPageLi);

            this.shadowRoot.querySelector('#previous-page').addEventListener('click', (e) => {
                if (this.currentPage == 1) return false;
                this.callbackMethod(this.currentPage - 1);
                return this.showPage(this.currentPage - 1);
            })
        }

        if (!this.shadowRoot.querySelector('.pagination #next-page')) {
            let nextPageLi = document.createElement("li");
            nextPageLi.classList.add("page-item");
            nextPageLi.id = "next-page";
            let nextPageLiButton = document.createElement("button");
            nextPageLiButton.classList.add("page-link");
            let nextPageLiImg = document.createElement("img");
            nextPageLiImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAQAAADlauupAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAAAqo0jMgAAAAlwSFlzAAAAYAAAAGAA8GtCzwAAAAd0SU1FB+YMFgUxOFTfyroAAAEYSURBVDjLnZMhTAJRGMf/79RZCGyUFyyOemwEo9MzOBMNgoEAgeKIZmYm2x13wcHY3D2Yxfk9yQY2rlKAcJuF6tzzM8jpnCJ394vvv//vfeH7gBX6fDgkXiwe7+p1JIVZCDo0hoiZiJlcpYiljNMVANBiy3K0MT+St+USp83mifC8/wTW2mQnm4V2XTrqdh9ucrnkgoirSmVLBoEOSqV0AgDYlZJffJ8OOh3iTCa5IKJdrQLj8dNFoZBOAAA6n383/X56AQAxY04vcKZTsV8upxNcui5QLB5fTybR03as4msYir1Gw3lW6nP1vtk8QavXM6FtO7ZSf8XrJ4hWeeR5GG345Ncxnfl+3GP6gngwoPv5XN/Wakl6Hy5DdIez8aG5AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTEyLTIyVDA1OjQ5OjU2KzAwOjAwGlD3ZAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0xMi0yMlQwNTo0OTo1NiswMDowMGsNT9gAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjItMTItMjJUMDU6NDk6NTYrMDA6MDA8GG4HAAAAAElFTkSuQmCC";
            nextPageLiButton.append(nextPageLiImg);
            nextPageLi.append(nextPageLiButton);
            this.shadowRoot.querySelector('.pagination').append(nextPageLi);

            this.shadowRoot.querySelector('#next-page').addEventListener('click', (e) => {
                if (this.currentPage >= this.totalPages) return false;
                this.callbackMethod(this.currentPage + 1);
                return this.showPage(this.currentPage + 1);
            })
        }

        if (!this.shadowRoot.querySelector('.pagination #last-page')) {

            let lastPageLi = document.createElement("li");
            lastPageLi.classList.add("page-item");
            lastPageLi.id = "last-page";
            let lastPageLiButton = document.createElement("button");
            lastPageLiButton.classList.add("page-link");
            let lastPageLiImg = document.createElement("img");
            lastPageLiImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAQAAADlauupAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAAAqo0jMgAAAAlwSFlzAAAAYAAAAGAA8GtCzwAAAAd0SU1FB+YMFgcDGfZCWvsAAAFOSURBVDjLY2CgEDDu/y8jw9BbXMxQvHSpI+OZM4Q0HMzW1f3H5eXFwMDAwNC1dSvDvk9VVfv3//+///+fP/s7u7uPS3Ny4jNg//+Ghv37//+H6GloYGLkZWNjYGBgYDjAzMxgVlLyU+/KlX18Tk7EeoEJXeB/mZISY8GePQeyZs7cdouPj2QDGBgYGBgcGRn/h6alceVcv75f39+fdANgrqmUkmKYsGHDgdSFC3c8EhIi2QC4QVFxcRzFq1eTbQADAwPD/1X//5NtAOOyRYt+Pg4LwybHgldj+7Nn/19mZTlc3LiRYTZ2NdgN2P//P+Ob2bO/TSkt9VL79AmfJRgGMHbdu/fvaGqq46d9+ximEfYe0//Pv34xMDAwMDj8/ctwqqeH/ZKOjtOnffuIDVyW/+sWLmSsEBFheL5smWM54czEwLBmDYMDBwecTSkAAGtGfkSSrkYmAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTEyLTIyVDA3OjAzOjI1KzAwOjAw5tqy4AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0xMi0yMlQwNzowMzoyNSswMDowMJeHClwAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjItMTItMjJUMDc6MDM6MjUrMDA6MDDAkiuDAAAAAElFTkSuQmCC";
            lastPageLiButton.append(lastPageLiImg);
            lastPageLi.append(lastPageLiButton);
            this.shadowRoot.querySelector('.pagination').append(lastPageLi);


            this.shadowRoot.querySelector('#last-page').addEventListener('click', (e) => {
                if (this.currentPage == this.totalPages) return false;
                this.callbackMethod(this.totalPages);
                return this.showPage(this.totalPages);
            })
        }

        this.showPage(this.currentPage);
    }

    // disconnectedCallback() {

    // }


}

export default Pagination;