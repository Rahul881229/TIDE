import styles from './carousel.scss';

class Carousel extends HTMLElement {
    constructor() {
        super();
        this.autoSlideInterval = null; // Store interval ID
        this.slidePos = 0; // Initialize slide position
        this.totalSlides = 0; // Initialize total slides
    }

    connectedCallback() {
        setTimeout(() => {
            let imagesString = '';
            const sliderTime = this.hasAttribute("sliderTime") ? parseInt(this.getAttribute("sliderTime")) : 0;
            const carouselimg = this.getElementsByTagName("t-carousel-img");

            for (let i = 0; i < carouselimg.length; i++) {
                const divElement = document.createElement("div");
                divElement.className = i === 0 ? 'carousel-item carousel-item-visible' : 'carousel-item';
                const imgElement = document.createElement("img");
                imgElement.setAttribute('src', carouselimg[i].getElementsByTagName('img')[0].getAttribute('src'));
                imgElement.setAttribute('alt', carouselimg[i].getElementsByTagName('img')[0].getAttribute('alt'));
                divElement.appendChild(imgElement);
                imagesString += divElement.outerHTML;
            }

            const template = document.createElement('template');
            template.innerHTML = `
                <style>${styles.toString()}</style>
                <div class="carousel">
                    ${imagesString}
                    <div class="carousel-actions ${carouselimg.length === 1 ? 'carousel-actions-hide' : ''}">
                        <button id="carousel-button-prev" aria-label="Previous slide">
                            <i class="arrow left"></i>
                        </button>
                        <div id="carousel-slide-nav"></div>
                        <button id="carousel-button-next" aria-label="Next slide">
                            <i class="arrow right"></i>
                        </button>
                    </div>
                </div>`;

            const shadowDOM = this.attachShadow({ mode: 'open' });
            shadowDOM.appendChild(template.content.cloneNode(true));

            const prevButton = this.shadowRoot.querySelector("#carousel-button-prev");
            const nextButton = this.shadowRoot.querySelector("#carousel-button-next");
            const slideNav = this.shadowRoot.querySelector("#carousel-slide-nav");
            const slides = this.shadowRoot.querySelectorAll(".carousel-item");

            this.slides = slides;
            this.slideNav = slideNav;
            this.totalSlides = slides.length;

            prevButton.addEventListener("click", () => this.prevSlide());
            nextButton.addEventListener("click", () => this.nextSlide());

            this.updateNavigation();

            if (sliderTime > 0) {
                this.setAutoSlide(sliderTime);
            }
        }, 0);
    }

    static get observedAttributes() {
        return ['slidertime']; // Monitor changes to the 'sliderTime' attribute
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'slidertime' && oldValue !== newValue) {
            const sliderTime = parseInt(newValue) || 0;
            this.setAutoSlide(sliderTime);
        }
    }

    setAutoSlide(sliderTime) {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
        if (sliderTime > 0) {
            this.autoSlideInterval = setInterval(() => this.nextSlide(), sliderTime * 1000);
        }
    }

    updateNavigation() {
        this.slideNav.innerHTML = ''; // Clear existing navigation
        for (let slide = 0; slide < this.totalSlides; slide++) {
            const span = document.createElement("span");
            if (slide === this.slidePos) {
                span.classList.add("nav-current");
            }
            this.slideNav.append(span);
            span.addEventListener("click", () => {
                this.slidePos = slide;
                this.displaySlide();
            });
        }
    }

    nextSlide() {
        this.slidePos = (this.slidePos + 1) % this.totalSlides;
        this.displaySlide();
    }

    prevSlide() {
        this.slidePos = (this.slidePos - 1 + this.totalSlides) % this.totalSlides;
        this.displaySlide();
    }

    displaySlide() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle("carousel-item-visible", index === this.slidePos);
        });
        const navItems = this.slideNav.querySelectorAll("span");
        navItems.forEach((nav, index) => {
            nav.classList.toggle("nav-current", index === this.slidePos);
        });
    }

    disconnectedCallback() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
    }
}

export default Carousel;
