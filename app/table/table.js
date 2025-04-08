// import styles from './table.scss';
// class Table extends HTMLElement {
//     constructor() {
//         super();
//         setTimeout(() => {
//             let lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
//             let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
//             const template = document.createElement('template');
//             template.innerHTML = `
//             <style>${styles.toString()}</style> 
//             <div id="tableId" class='table-wrap ${theme}' ${lang}>
//                 <slot name="table">
//                 </slot>
//             </div>`;
//             this.attachShadow({
//                 mode: 'open'
//             });
//             this.shadowRoot.appendChild(template.content.cloneNode(true));
//         }, 0);
//     }

//     connectedCallback() {
//         setTimeout(() => {
//             // console.log("shadow root--->",this.shadowRoot);
//         }, 0);
//     }

//     static get observedAttributes() {
//         return ['theme', 'lang'];
//     }

//     attributeChangedCallback(name, oldValue, newValue) {
//         setTimeout(() => {
//             if (name == 'theme' && newValue) {
//                 if (this.shadowRoot) {
//                     let tag = this.shadowRoot.querySelectorAll('.table-wrap')[0];
//                     if (tag) {
//                         if (oldValue) {
//                             tag.classList.remove(oldValue);
//                         }
//                         tag.classList.add(newValue);
//                     }
//                 }
//             } if (name == 'lang' && newValue) {
//                 if (this.shadowRoot) {
//                     let id = this.shadowRoot.getElementById('tableId');
//                     if (newValue == 'ar') {
//                         if (id) {
//                             id.setAttribute("dir", 'rtl');
//                         }
//                     } else {
//                         id.removeAttribute("dir");
//                     }
//                 }
//             }
//         }, 0);
//     }
// }
// export default Table;
// // window.customElements.define('t-table', Table);




import styles from './table.scss';
class Table extends HTMLElement {
    constructor() {
        super();
        setTimeout(() => {
            let lang = (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '');
            let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
            const template = document.createElement('template');
            template.innerHTML = `
            <style>${styles.toString()}</style>
            <div id="tableId" class='table-wrap ${theme}' ${lang}>
                <slot name="table">
                </slot>
            </div>`;
            this.attachShadow({
                mode: 'open'
            });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this.addEventListener('dragstart', this.handleDragStart.bind(this));
            this.addEventListener('dragover', this.handleDragOver.bind(this));
            this.addEventListener('drop', this.handleDrop.bind(this));
        }, 0);
    }

    connectedCallback() {
        setTimeout(() => {
            // console.log("shadow root--->",this.shadowRoot);
        }, 0);
    }

    handleDragStart(event) {
        console.log("Drag started");
        this.draggedElement = event.target;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', this.draggedElement.innerHTML);
    }

    handleDragOver(event) {
        console.log("Drag over");
        event.preventDefault();
        const target = event.target.closest('tr');

        if (this.isDraggableElement(target)) {
            event.dataTransfer.dropEffect = 'move';
            target.classList.add('drag-over');
        }
    }

    handleDrop(event) {
        event.preventDefault();
        const target = event.target.closest('tr');

        if (this.isDraggableElement(target)) {
            target.classList.remove('drag-over');

            // Get the HTML content of the dragged element
            const draggedContent = this.draggedElement.innerHTML;

            // Swap the HTML content of the dragged element and the drop target
            this.draggedElement.innerHTML = target.innerHTML;
            target.innerHTML = draggedContent;

            // Clean up the reference to the dragged element
            this.draggedElement = null;
        }
    }


    isDraggableElement(element) {
        return (
            element &&
            element.tagName.toLowerCase() === 'tr' &&
            element.getAttribute('draggable') === 'true'
        );
    }




    static get observedAttributes() {
        return ['theme', 'lang'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        setTimeout(() => {
            if (name == 'theme' && newValue) {
                if (this.shadowRoot) {
                    let tag = this.shadowRoot.querySelectorAll('.table-wrap')[0];
                    if (tag) {
                        if (oldValue) {
                            tag.classList.remove(oldValue);
                        }
                        tag.classList.add(newValue);
                    }
                }
            } if (name == 'lang' && newValue) {
                if (this.shadowRoot) {
                    let id = this.shadowRoot.getElementById('tableId');
                    if (newValue == 'ar') {
                        if (id) {
                            id.setAttribute("dir", 'rtl');
                        }
                    } else {
                        id.removeAttribute("dir");
                    }
                }
            }
        }, 0);
    }
}
export default Table;
// window.customElements.define('t-table', Table);