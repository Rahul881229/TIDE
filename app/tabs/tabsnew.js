import styles from './tabsnew.scss';
let selected_ = null;
class Tabsnew extends HTMLElement {

	constructor() {
		super();
		setTimeout(() => {

			const template = document.createElement('template');
			template.innerHTML = `<style>${styles.toString()}</style>
			<div class="tab">
				<button class="tablinks" >London</button>
				<button class="tablinks" >Paris</button>
				<button class="tablinks" >Tokyo</button>
			</div>
            <div id="London" class="tabcontent">
				<h3>London</h3>
				<p>London is the capital city of England.</p>
			</div>

			<div id="Paris" class="tabcontent">
				<h3>Paris</h3>
				<p>Paris is the capital of France.</p> 
			</div>

			<div id="Tokyo" class="tabcontent">
				<h3>Tokyo</h3>
				<p>Tokyo is the capital of Japan.</p>
			</div>
            `;

			this.appendChild(template.content.cloneNode(true));


			var tabcontent = this.querySelectorAll('.tabcontent');
			console.log("tabcontent ->", tabcontent);
			tabcontent.forEach(element => {
				element.addEventListener('click', (event) => {
					alert();
				})
			});


		}, 0);


	}

	_openCity(evt, cityName) {
		var i, tabcontent, tablinks;
		tabcontent = document.getElementsByClassName("tabcontent");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}
		document.getElementById(cityName).style.display = "block";
		evt.currentTarget.className += " active";
	}

	static get observedAttributes() {
		return [ /* array of attribute names to monitor for changes */];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// called when one of attributes listed above is modified
	}

	adoptedCallback() {
		// console.log("adoptedCallback:::Html Element", this.getAttribute('datetime'));
		// called when the element is moved to a new document
		// (happens in document.adoptNode, very rarely used)
	}

	connectedCallback() {

	}

	disconnectedCallback() {

	}


}
export default Tabsnew;
