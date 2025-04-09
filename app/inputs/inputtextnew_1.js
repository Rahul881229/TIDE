import styles from './inputtext.scss';

class inputtextnew extends HTMLElement {

    constructor() {
        super();
        setTimeout(() => {
            var name = (this.getAttribute("tname") ? `name=${JSON.stringify(this.getAttribute("tname"))}` : '');
            var id = (this.getAttribute("tid") ? `id=${JSON.stringify(this.getAttribute("tid"))}` : '');
            var tclass = (this.getAttribute("tclass") ? this.getAttribute("tclass") : '');
            var maxlength = (this.getAttribute("maxlength") ? `maxlength=${JSON.stringify(this.getAttribute("maxlength"))}` : 'maxlength');
            var size = (this.getAttribute("size") ? `size=${JSON.stringify(this.getAttribute("size"))}` : 'size');
            var placeholder = (this.getAttribute("placeholder") ? `placeholder=${JSON.stringify(this.getAttribute("placeholder"))}` : 'placeholder');
            var value = (this.getAttribute("value") ? `value=${JSON.stringify(this.getAttribute("value"))}` : 'value');
            var callbackName = this.getAttribute("callback");
            var disabled = this.getAttribute("disabled") == 'true' ? 'disabled' : '';
            var lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');

            const template = document.createElement('template');
            template.innerHTML = `
            <style>${styles.toString()}</style>
            <input type="text" ${lang} class="t-inputtext ${tclass}" ${id} ${name} ${placeholder} ${value} ${maxlength} ${size} ${disabled}/>
            `;
            
            var rootEl = this.attachShadow({ mode: 'open' });
            rootEl.innerHTML = template;
            //console.log('rootEl -> ', rootEl);
            rootEl.children[1].addEventListener('keyup', () => {
                var checkEvent = new CustomEvent("check", { bubbles: true, cancelable: true });
                if (this.dispatchEvent(checkEvent)) {
                    // Do default operation here
                    //console.log('Performing default operation');
                }
            });
            this._onCheckFn = null;
            //var input = shadowDOM.querySelectorAll('.t-inputtext')[0];
            /* input.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    if (window[`${callbackName}`]) {
                        window[`${callbackName}`](input.value);
                    }
                }
            }); */
            /* const eventAwesome = new CustomEvent('awesome', {
                bubbles: true,
                detail: { value: () => input.value }
            });

            shadowDOM.querySelectorAll('.t-inputtext')[0].addEventListener('awesome', e => console.log(e.detail.value));
            input.addEventListener('keyup', e => e.target.dispatchEvent(eventAwesome)); */

        }, 0);

    }

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return ['oncheck'/* array of attribute names to monitor for changes */];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // called when one of attributes listed above is modified
        if (name === 'oncheck' && oldValue !== newValue) {
            if (newValue === null) {
                this.oncheck = null;
            } else {
                this.oncheck = Function(`return function oncheck(event) {\n\t${newValue};\n};`)();
            }
        }
    }

    get oncheck() {
        return this._onCheckFn;
    }

    set oncheck(handler) {
        if (this._onCheckFn) {
            this.removeEventListener('check', this._onCheckFn);
            this._onCheckFn = null;
        }

        if (typeof handler === 'function') {
            this._onCheckFn = handler;
            this.addEventListener('check', this._onCheckFn);
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
export default inputtextnew;