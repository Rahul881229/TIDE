// import styles from './card.scss'

// class Card extends HTMLElement {
//     constructor() {
//         super();
//         setTimeout(() => {
//             let theme = this.hasAttribute('theme') ? this.getAttribute('theme') : 'dark';
//             let lang = this.hasAttribute('lang') ? (this.getAttribute('lang') == 'ar' ? 'dir=rtl' : '') : 'en';
//             let slotted = this.querySelectorAll('t-card div');
//             // console.log("slotted -> ", slotted);
//             const slotCss = {
//                 header: 'hide',
//                 content: 'hide',
//                 footer: 'hide'
//             };
//             for (const slot of slotted) {
//                 // console.log("slot.slot -> ", slot);
//                 // console.log("slot.slot -> ", slot.slot);
//                 if (slot.slot) {
//                     // if (!slot) {
//                     // console.log("slot.slot -> ", slot.slot);
//                     slotCss[slot.slot] = slot.slot;
//                     // }
//                 }
//             }
//             // console.log("slot slotCss -> ", slotCss);
//             var btnSize = '';
//             if (this.hasAttribute("small") || this.hasAttribute("sm")) {
//                 btnSize = 'sm';
//             } else if (this.hasAttribute("medium") || this.hasAttribute("md")) {
//                 btnSize = 'md';
//             } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
//                 btnSize = 'lg';
//             }
//             const template = document.createElement('template');
//             template.innerHTML = `
//             <style>${styles.toString()}</style> 
//             <div class="tcard ${theme} ${btnSize}" ${lang}>
//                 <div class='tcard-header ${slotCss.header}'>
//                     <slot name='header'>
//                     </slot>
//                 </div>
//                 <div class='tcard-body ${slotCss.content}'>
//                     <slot name='content'>
//                     </slot>
//                 </div>
//                 <div class='tcard-footer ${slotCss.footer}'>
//                     <slot name='footer'>
//                     </slot>
//                 </div>
//             </div>
//             `;
//             this.attachShadow({
//                 mode: 'open'
//             });
//             this.shadowRoot.appendChild(template.content.cloneNode(true));
//         }, 0);
//     }

//     //connected callback in the next life cycle
//     connectedCallback() {
//         setTimeout(() => {
//             if (this.shadowRoot) {
//                 // console.log("shadowroot card----", this.shadowRoot);
//             }
//         }, 0);
//     }

//     //to change the dynamic data in attribute change call back it requires observed attributes
//     static get observedAttributes() {
//         return ['theme', 'lang'];
//     }

//     //dynamically change the values while running time
//     attributeChangedCallback(name, oldValue, newValue) {
//         if (this.shadowRoot) {
//             // console.log("name--", name, "newValue---", newValue, "oldvalue---", oldValue);
//             if (name == 'theme' && newValue && oldValue) {
//                 let cardDiv = this.shadowRoot.querySelectorAll('.tcard')[0];
//                 cardDiv.classList.remove(oldValue);
//                 cardDiv.classList.add(newValue);
//             } else if (name == 'lang' && newValue) {
//                 let cardDiv = this.shadowRoot.querySelectorAll('.tcard')[0];
//                 if (newValue == 'ar' && oldValue) {
//                     if (cardDiv.hasAttribute('dir')) {
//                         cardDiv.setAttribute('dir', newValue)
//                     }
//                 } else {
//                     cardDiv.removeAttribute('dir');
//                 }
//             }
//         }
//     }

//     //disconnected callback
//     disconnectedCallback() {

//     }
// }
// export default Card;



import styles from './card.scss'
class Card extends HTMLElement {
    constructor() {
        super();
        setTimeout(() => {
            let theme = this.hasAttribute('theme') ? this.getAttribute('theme') : 'dark';
            let lang = this.hasAttribute('lang') ? (this.getAttribute('lang') == 'ar' ? 'dir=rtl' : '') : 'en';
            let slotted = this.querySelectorAll('t-card div');
            // console.log("slotted -> ", slotted);
            const slotCss = {
                header: 'hide',
                content: 'hide',
                footer: 'hide'
            };
            for (const slot of slotted) {
                // console.log("slot.slot -> ", slot);
                // console.log("slot.slot -> ", slot.slot);
                if (slot.slot) {
                    // if (!slot) {
                    // console.log("slot.slot -> ", slot.slot);
                    slotCss[slot.slot] = slot.slot;
                    // }
                }
            }
            // console.log("slot slotCss -> ", slotCss);
            var btnSize = '';
            if (this.hasAttribute("small") || this.hasAttribute("sm")) {
                btnSize = 'sm';
            } else if (this.hasAttribute("medium") || this.hasAttribute("md")) {
                btnSize = 'md';
            } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
                btnSize = 'lg';
            }
            const template = document.createElement('template');
            template.innerHTML = `
            <style>${styles.toString()}</style>
            <div class="tcard ${theme} ${btnSize}" ${lang}>
                <div class='tcard-header ${slotCss.header}'>
                    <slot name='header'>
                    </slot>
                </div>
                <div class='tcard-body ${slotCss.content}'>
                    <slot name='content'>
                    </slot>
                </div>
                <div class='tcard-footer ${slotCss.footer}'>
                    <slot name='footer'>
                    </slot>
                </div>
            </div>
            `;
            this.attachShadow({
                mode: 'open'
            });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.draggedElement = null;

            this.addEventListener('dragstart', this.handleDragStart.bind(this));
            this.addEventListener('dragover', this.handleDragOver.bind(this));
            this.addEventListener('drop', this.handleDrop.bind(this));
        }, 0);
    }

    //connected callback in the next life cycle
    connectedCallback() {
        setTimeout(() => {
            if (this.shadowRoot) {
                // console.log("shadowroot card----", this.shadowRoot);
            }
        }, 0);
    }

    //to change the dynamic data in attribute change call back it requires observed attributes
    static get observedAttributes() {
        return ['theme', 'lang'];
    }

    //dynamically change the values while running time
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            // console.log("name--", name, "newValue---", newValue, "oldvalue---", oldValue);
            if (name == 'theme' && newValue && oldValue) {
                let cardDiv = this.shadowRoot.querySelectorAll('.tcard')[0];
                cardDiv.classList.remove(oldValue);
                cardDiv.classList.add(newValue);
            } else if (name == 'lang' && newValue) {
                let cardDiv = this.shadowRoot.querySelectorAll('.tcard')[0];
                if (newValue == 'ar' && oldValue) {
                    if (cardDiv.hasAttribute('dir')) {
                        cardDiv.setAttribute('dir', newValue)
                    }
                } else {
                    cardDiv.removeAttribute('dir');
                }
            }
        }
    }

    //disconnected callback
    disconnectedCallback() {

    }
    handleDragStart(event) {
        this.draggedElement = event.target;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', this.draggedElement.innerHTML);

        console.log('Dragging started:', this.draggedElement);

        // Add dragend event listener to handle the case where the dragged element is not dropped
        this.addEventListener('dragend', this.handleDragEnd.bind(this));
    }

    handleDragEnd(event) {
        // Reset dynamically applied styles when drag operation ends (whether dropped or not)
        this.draggedElement.style.opacity = '';
        this.draggedElement.style.backgroundColor = '';

        console.log('Dragging ended:', this.draggedElement);
        this.removeEventListener('dragend', this.handleDragEnd.bind(this)); // Remove the event listener
    }



    handleDragOver(event) {
        event.preventDefault();
        const target = event.target;

        if (this.isDraggableElement(target)) {
            event.dataTransfer.dropEffect = 'move';
            target.classList.add('drag-over');

            // / Dynamically apply styles
            this.draggedElement.style.opacity = '15';
            // this.draggedElement.style.border = '2px dashed #FFA500';
            this.draggedElement.style.backgroundColor = 'gray';
        }
    }

    handleDrop(event) {
        event.preventDefault();
        const target = event.target;

        if (this.isDraggableElement(target)) {
            target.classList.remove('drag-over');
            this.draggedElement.innerHTML = target.innerHTML;
            target.innerHTML = event.dataTransfer.getData('text/html');

            this.draggedElement.style.opacity = '';
            this.draggedElement.style.backgroundColor = '';


        }
    }

    isDraggableElement(element) {
        // Add any additional conditions here to check if the element is draggable
        return element.tagName === 'DIV' && element.hasAttribute('draggable');
    }
}
export default Card;