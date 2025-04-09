
class TableData extends HTMLTableElement {
    constructor() {
        super();
        setTimeout(() => {
            alert();
            console.log('data-table created');
        }, 0);
    }

    connectedCallback() {

    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log("name--", name + "\tnewvalue---", newValue);
    }
}
export default TableData;