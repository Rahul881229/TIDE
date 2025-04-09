// import styles from "./imageupload.scss";

// class ImageUpload extends HTMLElement {
//   constructor() {
//     super();
//     setTimeout(() => {
//       let theme = this.hasAttribute("theme")
//         ? this.getAttribute("theme")
//         : "dark";

//       var fontsize = "sm";
//       if (this.hasAttribute("small") || this.hasAttribute("sm")) {
//         fontsize = "sm";
//       } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
//         fontsize = "lg";
//       }

//       let buttontext = this.hasAttribute("buttontext")
//         ? this.getAttribute("buttontext")
//         : " ";

//       let lang = this.hasAttribute("lang")
//         ? this.getAttribute("lang") == "ar"
//           ? 'dir=rtl lang="ar"'
//           : ""
//         : "en";

//       let isDisable = this.hasAttribute("disabled")
//         ? this.getAttribute("disabled") == "true" ||
//           this.getAttribute("disabled") == true
//           ? "disabled"
//           : ""
//         : "";

//       const template = document.createElement("template");
//       template.innerHTML = `
//       <style> ${styles.toString()} </style>
//       <article ${lang}>
//         <label class="file-upload-content ${theme} ${fontsize} ${isDisable}" for="fileUpload" >${buttontext}</label>
//       </article>
//       <input hidden id="fileUpload" accept=".jpeg, .jpg, .png, .svg" type="file" multiple ${isDisable}/>
//       <div class="image-handler">
//         <div id="selectedImages" class="selected-images" ${lang}></div>
//       </div>
//       `;

//       this.attachShadow({ mode: "open" });
//       this.shadowRoot.appendChild(template.content.cloneNode(true));

//       // Add event listeners
//       this.select("input").onchange = (e) => this.handleChange(e);
//     }, 0);
//   }

//   //multiple image uploader
//   handleChange(e) {
//     const files = e.target.files;
//     const selectedImagesContainer = this.select("#selectedImages");

//     // Display the selected images
//     if (files.length > 0) {
//       selectedImagesContainer.innerHTML = ""; // Clear existing images

//       for (const file of files) {
//         const reader = new FileReader();
//         reader.onload = () => {
//           // Create an image element for each selected file
//           const imageElement = document.createElement("img");
//           imageElement.src = reader.result;
//           imageElement.style.width = "15vh";
//           imageElement.style.height = "15vh";
//           imageElement.style.padding = "1vh";

//           // Append the image to the selected images container
//           selectedImagesContainer.appendChild(imageElement);
//         };
//         reader.readAsDataURL(file);
//       }
//     }
//     this.dispatch("change", files); // Dispatch array of selected files
//   }

//   dispatch(event, arg) {
//     this.dispatchEvent(new CustomEvent("timage", {
//       bubbles: true,
//       detail: {
//         version: '2.2.22',
//         method: this.getAttribute("callback"),
//         detail: arg
//       }
//     }));
//   }

//   get select() {
//     return this.shadowRoot.querySelector.bind(this.shadowRoot);
//   }

//   // Define the observed attributes
//   static get observedAttributes() {
//     return ["theme", "lang", "buttontext", "disabled"];
//   }

//   // Handle changes to observed attributes
//   attributeChangedCallback(name, oldValue, newValue) {
//     if (this.shadowRoot) {
//       if (name && newValue) {
//         console.log(
//           "Inside attributeChangedCallback file upload :",
//           name,
//           newValue,
//           oldValue
//         );
//         switch (name) {
//           case "theme":
//             let labelTag = this.shadowRoot.querySelectorAll(
//               ".file-upload-content"
//             )[0];
//             if (oldValue) {
//               labelTag.classList.remove(oldValue);
//             }
//             labelTag.classList.add(newValue);
//             break;
//           case "lang":
//             let articleTag = this.shadowRoot.querySelector("article");
//             let selectedImages = this.shadowRoot.querySelectorAll(".selected-images")[0];
//             articleTag.setAttribute("dir", newValue === "ar" ? "rtl" : "ltr");
//             selectedImages.setAttribute("dir", newValue === "ar" ? "rtl" : "ltr");
//             articleTag.setAttribute("lang", newValue === "en" ? "en" : "ar");
//             break;
//           case "buttontext":
//             let buttonTextTag = this.shadowRoot.querySelectorAll(
//               ".file-upload-content")[0];
//             buttonTextTag.textContent = newValue;
//             break;
//           case "disabled":
//             let inputTag = this.shadowRoot.querySelector("input");
//             let disableLabelTag = this.shadowRoot.querySelectorAll(".file-upload-content")[0];
//             if (newValue !== null && newValue == "true") {
//               inputTag.setAttribute("disabled", "");
//               disableLabelTag.classList.add("disabled");
//             } else {
//               inputTag.removeAttribute("disabled");
//               disableLabelTag.classList.remove("disabled");
//             }
//             break;
//           default:
//             break;
//         }
//       }
//     }
//   }
// }

// export default ImageUpload;
