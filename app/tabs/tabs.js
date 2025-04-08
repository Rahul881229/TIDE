import styles from './tabs.scss';
class Tabs extends HTMLElement {

	constructor() {
		super();
		setTimeout(() => {

			//create template for the custom element
			const template = document.createElement('template');
			let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";
			let lang = this.hasAttribute("lang") ? (this.getAttribute("lang") == 'ar' ? 'dir="rtl" lang="ar"' : '') : '';
			const panels = this.getElementsByTagName("t-tab-panel");

			let btnSize = '';
			if (this.hasAttribute("small") || this.hasAttribute("sm")) {
				btnSize = 'sm';
			}
			else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
				btnSize = 'lg';
			}

			template.innerHTML = `<style>${styles.toString()}</style>
            <div class="tab-wrapper ${theme}" ${lang}>
            </div>
            `;
			//render the content
			this.appendChild(template.content.cloneNode(true));
			//create button inside the tabs
			let divTab = document.createElement('div');
			divTab.className = `ttabs`;

			let contentData = [];

			for (const tab of panels) {
				let id = this.generateUniqueId();
				let button = document.createElement('button');
				button.className = `tbutton ${btnSize}`;
				button.setAttribute('id', 'ttabs' + id);
				button.value = id;
				button.setAttribute('data-panel', tab.getAttribute('data-panel') || '');


				let tabTitle = tab.getElementsByTagName("t-tab-title")[0];
				button.setAttribute('title', tabTitle.textContent);
				let widthAttribute = tabTitle.getAttribute('width');
				if (widthAttribute) {
					button.style.width = widthAttribute;
					button.style.minWidth = widthAttribute; // Set minimum width
					button.style.maxWidth = widthAttribute; // Set maximum width
				}


				button.appendChild(tabTitle);
				divTab.appendChild(button);


				//create one more div for the content part
				let divContent = document.createElement('div');
				divContent.classList = 'tcontent';
				divContent.classList.add('tcontent' + id);
				//create section to store the user details
				let section = document.createElement('section');
				section.appendChild(tab.getElementsByTagName("t-tab-content")[0]);
				divContent.appendChild(section);
				// divContent.setAttribute(('name', tab.getElementsByTagName("t-tab-content")[0].getAttribute("name")))
				contentData.push(divContent);
			}
			this.querySelectorAll(".tab-wrapper")[0].appendChild(divTab);
			for (const item of contentData) {

				item.style.display = "none"
				this.querySelectorAll(".tab-wrapper")[0].appendChild(item);
			}
		}, 0);
	}

	generateUniqueId() {
		return (Math.floor(Math.random() * (10000000 - 1)) + 1).toString();
	}

	static get observedAttributes() {
		return ['lang', 'theme'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (this) {
			if (name == 'lang' && newValue && oldValue) {
				let tag = this.querySelectorAll('.tab-wrapper')[0];
				if (newValue === 'ar') {
					tag.style.direction = 'rtl';
				} else {
					tag.style.direction = 'ltr';
				}
			}
			else if (name == 'theme' && newValue && oldValue) {
				let tag = this.querySelectorAll('.tab-wrapper')[0];
				if (oldValue) {
					tag.classList.remove(oldValue);
				}
				tag.classList.add(newValue);
			}
		}
	}

	deactiveAll() {
		let buttons = this.querySelectorAll('div.ttabs')[0].querySelectorAll('button');
		buttons.forEach(element => {
			element.classList.remove('active');
		})
		let divContent = this.querySelectorAll('div.tcontent');
		divContent.forEach(element1 => {
			element1.style.display = 'none';
		})
	}

	connectedCallback() {
		setTimeout(() => {
			let buttons = this.querySelectorAll('div.ttabs')[0].querySelectorAll('button');
			console.log("buttons -> ", buttons);
			buttons[0].classList.add('active');
			this.querySelector('.tcontent' + buttons[0].value).style.display = 'block';
			buttons.forEach(element => {
				element.addEventListener('click', (ele) => {
					this.deactiveAll();
					element.classList.add('active');
					this.querySelector('.tcontent' + element.value).style.display = 'block';
					const tabPanelAttribute = element.getAttribute('data-panel');
					this.dispatchEvent(new CustomEvent("ttabs", {
						bubbles: true,
						detail: {
							version: '1.0.0',
							method: this.getAttribute("callback"),
							params: "",
							data: tabPanelAttribute
						}
					}));
					let innerButton = this.querySelector('.tcontent' + element.value).querySelectorAll('button');
					if (innerButton.length > 0) {
						innerButton[0].classList.add('active');
						this.querySelector('.tcontent' + innerButton[0].value).style.display = 'block';
					}
				});
			});
		}, 0);
	}

	disconnectedCallback() {
		setTimeout(() => {
			if (this) {
				let buttons = this.querySelectorAll('div.ttabs')[0].querySelectorAll('button');
				for (const tab of buttons) {
					tab.removeEventListener('click', tab);
				}
			}
		}, 0);
	}
}
export default Tabs;
// window.customElements.define('t-tabs', Tabs);
