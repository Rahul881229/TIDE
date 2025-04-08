// // class ScreenDetails extends HTMLElement {
// //     constructor() {
// //         super();
// //         this.attachShadow({ mode: 'open' });
// //         this.updateScreenDetails = this.updateScreenDetails.bind(this);
// //         window.addEventListener('resize', this.updateScreenDetails);
// //     }

// //     connectedCallback() {
// //         this.updateScreenDetails();
// //     }

// //     disconnectedCallback() {
// //         window.removeEventListener('resize', this.updateScreenDetails);
// //     }

// //     updateScreenDetails() {
// //         this.shadowRoot.innerHTML = `
// //             <style>
// //                 :host {
// //                     display: block;
// //                     font-family: Arial, sans-serif;
// //                     padding: 15px;
// //                     border: 2px solid #007bff;
// //                     border-radius: 8px;
// //                     background: #f8f9fa;
// //                     max-width: 350px;
// //                     box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
// //                 }
// //                 h3 {
// //                     margin: 0 0 15px 0;
// //                     font-size: 1.3em;
// //                     color: #007bff;
// //                     text-align: center;
// //                 }
// //                 p {
// //                     margin: 8px 0;
// //                     padding: 5px;
// //                     background: #ffffff;
// //                     border-radius: 5px;
// //                     box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
// //                 }
// //                 strong {
// //                     color: #333;
// //                 }
// //             </style>
// //             <h3>Screen Details</h3>
// //             <p><strong>Screen Width:</strong> ${screen.width}px</p>
// //             <p><strong>Screen Height:</strong> ${screen.height}px</p>
// //             <p><strong>Available Width:</strong> ${screen.availWidth}px</p>
// //             <p><strong>Available Height:</strong> ${screen.availHeight}px</p>
// //             <p><strong>Device Pixel Ratio:</strong> ${window.devicePixelRatio}</p>
// //             <p><strong>Color Depth:</strong> ${screen.colorDepth} bits</p>
// //             <p><strong>Pixel Depth:</strong> ${screen.pixelDepth} bits</p>
// //             <p><strong>Window Width:</strong> ${window.innerWidth}px</p>
// //             <p><strong>Window Height:</strong> ${window.innerHeight}px</p>
// //         `;
// //     }
// // }

// // customElements.define('screen-details', ScreenDetails);

// export default ScreenDetails;



// class ScreenDetails extends HTMLElement {
//     constructor() {
//         super();
//         this.attachShadow({ mode: 'open' });
//         this.updateScreenDetails = this.updateScreenDetails.bind(this);
//         window.addEventListener('resize', this.updateScreenDetails);
//     }

//     connectedCallback() {
//         this.updateScreenDetails();
//     }

//     disconnectedCallback() {
//         window.removeEventListener('resize', this.updateScreenDetails);
//     }

//     updateScreenDetails() {
//         this.shadowRoot.innerHTML = `
//             <style>
//                 :host {
//                     display: block;
//                     font-family: Arial, sans-serif;
//                     padding: 15px;
//                     border: 2px solid #404040;
//                     border-radius: 8px;
//                     background: #404040;
//                     color: #FFFFFF;
//                     max-width: 350px;
//                     box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
//                     text-align: center; /* Center the content */
//                     margin: 0 auto; /* Center horizontally */
//                 }
//                 h3 {
//                     margin: 0 0 15px 0;
//                     font-size: 1.3em;
//                     color: #FFFFFF;
//                 }
//                 p {
//                     margin: 8px 0;
//                     padding: 5px;
//                     background: #131313;
//                     border-radius: 5px;
//                     box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
//                     position: relative;
//                     display: inline-block;
//                     width: 100%;
//                     text-align: left;
//                 }
//                 strong {
//                     color: #FFFFFF;
//                 }
//                 /* Tooltip Styles */
//                 p:hover::after {
//                     content: attr(data-tooltip);
//                     position: absolute;
//                     top: -25px;
//                     left: 0;
//                     background-color: #404040;
//                     color: #FFFFFF;
//                     padding: 5px;
//                     border-radius: 5px;
//                     font-size: 12px;
//                     white-space: nowrap;
//                     z-index: 10;
//                 }
//             </style>
//             <h3>Screen Details</h3>
//             <p data-tooltip="The total width of the screen in pixels, including system UI elements like the taskbar."><strong>Screen Width:</strong> ${screen.width}px</p>
//             <p data-tooltip="The total height of the screen in pixels, including system UI elements like the taskbar."><strong>Screen Height:</strong> ${screen.height}px</p>
//             <p data-tooltip="The available width of the screen, excluding areas taken by system UI elements like taskbars."><strong>Available Width:</strong> ${screen.availWidth}px</p>
//             <p data-tooltip="The available height of the screen, excluding areas taken by system UI elements like taskbars."><strong>Available Height:</strong> ${screen.availHeight}px</p>
//             <p data-tooltip="The ratio of physical pixels to logical pixels, useful for handling high DPI screens."><strong>Device Pixel Ratio:</strong> ${window.devicePixelRatio}</p>
//             <p data-tooltip="The number of bits used to represent the color of a single pixel, indicating how many distinct colors the screen can display."><strong>Color Depth:</strong> ${screen.colorDepth} bits</p>
//             <p data-tooltip="The number of bits used to represent a pixel’s color and brightness information."><strong>Pixel Depth:</strong> ${screen.pixelDepth} bits</p>
//             <p data-tooltip="The width of the browser window’s content area, excluding borders, toolbars, etc."><strong>Window Width:</strong> ${window.innerWidth}px</p>
//             <p data-tooltip="The height of the browser window’s content area, excluding borders, toolbars, etc."><strong>Window Height:</strong> ${window.innerHeight}px</p>
//         `;
//     }
// }

// export default ScreenDetails;

class ScreenDetails extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.updateScreenDetails = this.updateScreenDetails.bind(this);
        window.addEventListener('resize', this.updateScreenDetails);
    }

    connectedCallback() {
        this.updateScreenDetails();
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.updateScreenDetails);
    }

    updateScreenDetails() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    padding: 15px;
                    border: 2px solid #404040;
                    border-radius: 8px;
                    background: #404040;
                    color: #FFFFFF;
                    max-width: 350px;
                    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
                    text-align: center; /* Center the content */
                    margin: 0 auto; /* Center horizontally */
                    box-sizing: border-box;
                }

                h3 {
                    margin: 0 0 15px 0;
                    font-size: 4vw; /* Responsive font size */
                    color: #FFFFFF;
                }

                p {
                    margin: 8px 0;
                    padding: 5px;
                    background: #131313;
                    border-radius: 5px;
                    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
                    display: inline-block;
                    width: 100%;
                    text-align: left;
                    font-size: 1.1em; /* Base font size */
                    position: relative; /* Needed for tooltip positioning */
                }

                strong {
                    color: #FFFFFF;
                }

                /* Tooltip Styles */
                span.tooltip {
                    display: none;
                    background-color: #404040;
                    color: #FFFFFF;
                    padding: 5px;
                    border-radius: 5px;
                    font-size: 14px;
                    position: absolute;
                    left: 100%; /* Position it next to the detail text */
                    top: 0;
                    white-space: nowrap;
                    margin-left: 10px; /* Space between the detail and tooltip */
                    z-index: 20;
                }

                p:hover span.tooltip {
                    display: inline-block; /* Show tooltip on hover */
                }

                /* Media Queries for Small Screens */
                @media (max-width: 768px) {
                    h3 {
                        font-size: 5vw; /* Adjust font size for smaller screens */
                    }

                    p {
                        font-size: 1em; /* Adjust the text size for smaller screens */
                    }

                    :host {
                        padding: 10px; /* Adjust padding */
                    }
                }

                /* Media Queries for Extra Small Screens */
                @media (max-width: 480px) {
                    h3 {
                        font-size: 6vw; /* Adjust font size for very small screens */
                    }

                    p {
                        font-size: 0.9em; /* Slightly smaller text on very small screens */
                    }
                }
            </style>
            <h3>Screen Details</h3>
            <p><strong>Screen Width:</strong> ${screen.width}px
                <span class="tooltip">The total width of the screen in pixels, including system UI elements like the taskbar.</span>
            </p>
            <p><strong>Screen Height:</strong> ${screen.height}px
                <span class="tooltip">The total height of the screen in pixels, including system UI elements like the taskbar.</span>
            </p>
            <p><strong>Available Width:</strong> ${screen.availWidth}px
                <span class="tooltip">The available width of the screen, excluding areas taken by system UI elements like taskbars.</span>
            </p>
            <p><strong>Available Height:</strong> ${screen.availHeight}px
                <span class="tooltip">The available height of the screen, excluding areas taken by system UI elements like taskbars.</span>
            </p>
            <p><strong>Device Pixel Ratio:</strong> ${window.devicePixelRatio}
                <span class="tooltip">The ratio of physical pixels to logical pixels, useful for handling high DPI screens.</span>
            </p>
         <!--   <p><strong>Color Depth:</strong> ${screen.colorDepth} bits
                <span class="tooltip">The number of bits used to represent the color of a single pixel, indicating how many distinct colors the screen can display.</span>
            </p>
            <p><strong>Pixel Depth:</strong> ${screen.pixelDepth} bits
                <span class="tooltip">The number of bits used to represent a pixel’s color and brightness information.</span>
            </p>  --->
            <p><strong>Window Width:</strong> ${window.innerWidth}px
                <span class="tooltip">The width of the browser window’s content area, excluding borders, toolbars, etc.</span>
            </p>
            <p><strong>Window Height:</strong> ${window.innerHeight}px
                <span class="tooltip">The height of the browser window’s content area, excluding borders, toolbars, etc.</span>
            </p>
        `;
    }
}

export default ScreenDetails;
