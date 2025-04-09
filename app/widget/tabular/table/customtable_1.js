
import styles from './customtable.scss';
class CellView {
  constructor(view) {
    this.view = view;
  }
  render() { }
}

//String View
class CellStringView extends CellView {
  render() {
    console.info('special rendering', this.view);
    this.view.innerHTML = '<style>' + styles.toString() + '</style>' + this.view.textContent;
    // this.view.innerHTML = `<style>${styles.toString()}</style>
    //   <div class="tableTopWrap">abc</div>
    //   <div class="tableWrap">
    //     ${this.view.textContent}
    //   </div>`;
  }
}

//Element (MVC controller)
class CellElement extends HTMLElement {
  constructor() {
    super()
    //create cell
    console.log("this.getAttribute('type') -> ", this.getAttribute('type'));
    switch (this.getAttribute('type')) {
      case 'string':
        this.view = new CellStringView(this)
        break
      default:
        this.view = new CellView(this)
    }
  }
  connectedCallback() {
    //render cell
    this.view.render()
  }
}

export default CellElement;
// customElements.define('data-cell', CellElement)