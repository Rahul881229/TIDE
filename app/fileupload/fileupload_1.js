import styles from "./fileUpload.scss";

class fileUpload extends HTMLElement {
  constructor() {
    super();
    setTimeout(() => {
      let theme = this.hasAttribute("theme")
        ? this.getAttribute("theme")
        : "dark";

        this.isImagesAdded = false; // Flag to track if images are added

      var fontsize = "sm";
      if (this.hasAttribute("small") || this.hasAttribute("sm")) {
        fontsize = "sm";
      } else if (this.hasAttribute("lg") || this.hasAttribute("large")) {
        fontsize = "lg";
      }

        this.accept = this.getAttribute("accept") || "";
        this.buttonText = this.getAttribute("buttonText") || "Upload Files";
        this.title = this.getAttribute("title") || "File Upload";
      let lang = this.hasAttribute("lang")
        ? this.getAttribute("lang") == "ar"
          ? 'dir=rtl lang="ar"'
          : ""
        : "en";

      let isDisable = this.hasAttribute("disabled")
        ? this.getAttribute("disabled") == "true" ||
          this.getAttribute("disabled") == true
          ? "disabled"
          : ""
        : "";

      const template = document.createElement("template");
      template.innerHTML = `
      <style> ${styles.toString()} </style>
      <article ${lang}>
        <label class="file-upload-content ${theme} ${fontsize} ${isDisable}" for="fileUpload" >${this.buttonText}</label>
        <div id="addButtonContainer"></div> 
      </article>
      <input hidden id="fileUpload" accept="${this.accept}" type="file" multiple ${isDisable}/>
      <p>${this.title}</p>
      <div class="image-handler">
        <div id="selectedImages" style="width: 15vh;height: 15vh" class="selected-images" ${lang}><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMTAiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCAxMTAgODUiPgogIDxwYXRoIGlkPSJQYXRoXzgwNzgiIGRhdGEtbmFtZT0iUGF0aCA4MDc4IiBkPSJNMCw2MXY4NUgxMTBWNjFaTTI3LjkzLDcxLjlBMTMuMDc4LDEzLjA3OCwwLDEsMSwxNS4wMzksODQuOTc0LDEzLDEzLDAsMCwxLDI3LjkzLDcxLjlabTc1LjYyNSw2Ny41NjRINi40NDV2LTQuNjIzTDMzLjMsMTA3LjU5NWwxMy4xMDUsMTMuMjk1TDg1LjA3OCw4MS42NTksMTAzLjU1NSwxMDAuNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTYxKSIgZmlsbD0iI2JmYmZiZiIvPgo8L3N2Zz4K" alt="SVG Image" /></div>
        </div>
      `;


      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.select("label").addEventListener("click", () => this.toggleImages());

      // Add event listeners
      this.select("input").onchange = (e) => this.handleChange(e);
    }, 0);
  }

  


  toggleImages() {
    const selectedImagesContainer = this.select("#selectedImages");
  
    // Check if the container only contains the placeholder image
    if (selectedImagesContainer.children.length === 1 && selectedImagesContainer.querySelector('img[alt="SVG Image"]')) {
      // Remove images when they are already added
    
      this.isImagesAdded = true; // Reset flag
      this.addInitialPlaceholder();


    } else {
      // Add new images if none are added
      selectedImagesContainer.innerHTML = ''; // Remove all images from the container
      this.isImagesAdded = false; // Set flag 
      this.addInitialPlaceholder();

      
    }
  }
  
  // Ensure this function is correctly adding the placeholder
  addInitialPlaceholder() {
    const selectedImagesContainer = this.select("#selectedImages");
  
    // Check if the placeholder already exists, if not, create it
    if (!selectedImagesContainer.querySelector('img[alt="SVG Image"]')) {
      const placeholder = document.createElement("img");
      placeholder.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMTAiIGhlaWdodD0iODUiIHZpZXdCb3g9IjAgMCAxMTAgODUiPgogIDxwYXRoIGlkPSJQYXRoXzgwNzgiIGRhdGEtbmFtZT0iUGF0aCA4MDc4IiBkPSJNMCw2MXY4NUgxMTBWNjFaTTI3LjkzLDcxLjlBMTMuMDc4LDEzLjA3OCwwLDEsMSwxNS4wMzksODQuOTc0LDEzLDEzLDAsMCwxLDI3LjkzLDcxLjlabTc1LjYyNSw2Ny41NjRINi40NDV2LTQuNjIzTDMzLjMsMTA3LjU5NWwxMy4xMDUsMTMuMjk1TDg1LjA3OCw4MS42NTksMTAzLjU1NSwxMDAuNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTYxKSIgZmlsbD0iI2JmYmZiZiIvPgo8L3N2Zz4K";
      placeholder.alt = "SVG Image";
      selectedImagesContainer.appendChild(placeholder);
    }
  }
  
  


  //multiple image uploader
  handleChange(e) {
    const files = e.target.files;
    const selectedImagesContainer = this.select("#selectedImages");
    const addButtonContainer = this.select("#addButtonContainer");
    
    if (selectedImagesContainer.querySelector('img[alt="SVG Image"]')) {
      selectedImagesContainer.innerHTML = ''; // Remove the initial SVG image if it's the only image
  }
  
      // Display the selected images
    if (files.length > 0) {
      // selectedImagesContainer.innerHTML = ""; // Clear existing images
  
      for (const file of files) {
          // Validate file type
       
          if (!file.type.match(this.accept)) {
            alert(`Only ${this.accept} files are allowed.`);
            if( selectedImagesContainer.children.length === 0)
            this.addInitialPlaceholder();
          
            return;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
          // Create a container for each image and its close button
          const imageWrapper = document.createElement("div");
          imageWrapper.style.position = "relative";
          imageWrapper.style.display = "inline-block";
          imageWrapper.style.marginRight = "10px";
  
          // Create the image element
          const imageElement = document.createElement("img");
          imageElement.src = reader.result;
          imageElement.style.width = "15vh";
          imageElement.style.height = "15vh";
          imageElement.style.border = "0.5px solid #ccc";
          imageElement.style.display = "block";
  
          // Create the close button
          const closeButton = document.createElement("span");
          const closeImg = document.createElement("img");
          closeImg.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE1IDE1Ij4KICA8ZyBpZD0iR3JvdXBfMjYyIiBkYXRhLW5hbWU9Ikdyb3VwIDI2MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuMzY3KSI+CiAgICA8ZyBpZD0iR3JvdXBfMTk3MDMyIiBkYXRhLW5hbWU9Ikdyb3VwIDE5NzAzMiI+CiAgICAgIDxnIGlkPSJHcm91cF8zNyIgZGF0YS1uYW1lPSJHcm91cCAzNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC41KSI+CiAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZV8yMyIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgMjMiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuMTMzKSIgZmlsbD0icmdiYSgyMDAsMCwwLDAuNikiLz4KICAgICAgPC9nPgogICAgICA8ZyBpZD0iR3JvdXBfMTk3MDMxIiBkYXRhLW5hbWU9Ikdyb3VwIDE5NzAzMSI+CiAgICAgICAgPHBhdGggaWQ9IlBhdGhfMjk3IiBkYXRhLW5hbWU9IlBhdGggMjk3IiBkPSJNMCwwVjUuODU5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5LjkyMyA1LjQyMSkgcm90YXRlKDQ1KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMSIvPgogICAgICAgIDxwYXRoIGlkPSJQYXRoXzI5OCIgZGF0YS1uYW1lPSJQYXRoIDI5OCIgZD0iTTAsMFY1Ljg4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1Ljc5NSA1LjQyMSkgcm90YXRlKC00NSkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg=="; // Add appropriate SVG data or image URL
          closeImg.alt = "Close Icon";
        
          closeButton.style.position = "absolute";
          closeButton.style.top = "1px";
          closeButton.style.right="1px";
          closeButton.style.cursor = "pointer";
          closeButton.appendChild(closeImg);
  
          // Add click handler to remove the image
          closeButton.addEventListener("click", () => {
            selectedImagesContainer.removeChild(imageWrapper);
            const removeEvent = new CustomEvent("fileRemoved", {
              detail: { removedFile: file },
            });
            this.dispatchEvent(removeEvent);
            selectedImagesContainer.dispatchEvent(removeEvent);
            if (selectedImagesContainer.children.length === 0) {
            this.addInitialPlaceholder();
            this.isImagesAdded = false;
            }
          });
  
          // Append the image and close button to the wrapper
          imageWrapper.appendChild(imageElement);
          imageWrapper.appendChild(closeButton);
  
          // Append the wrapper to the container
          selectedImagesContainer.appendChild(imageWrapper);
        };
        reader.readAsDataURL(file);
      }
  
      // If the "Add Image" button is not already present, create and append it
      if (!addButtonContainer.querySelector("#addImageButton")) {
        const addImageButton = document.createElement("button");
        addImageButton.id = "addImageButton";
        addImageButton.classList.add("add-image-button");
    
        // Create an image element
        const image = document.createElement("img");
        image.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KICA8ZyBpZD0iR3JvdXBfMTk3MTI5IiBkYXRhLW5hbWU9Ikdyb3VwIDE5NzEyOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyNTggMzEwKSI+CiAgICA8ZyBpZD0iUGF0aF8xNDkiIGRhdGEtbmFtZT0iUGF0aCAxNDkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyNTggLTMxMCkiIGZpbGw9IiMyNjI2MjYiIHN0cm9rZS1kYXNoYXJyYXk9IjIiPgogICAgICA8cGF0aCBkPSJNMCwwSDQwVjQwSDBaIiBzdHJva2U9Im5vbmUiLz4KICAgICAgPHBhdGggZD0iTSAwIDAgTCAyIDAgTCAyIDEgTCAwIDEgTCAwIDAgWiBNIDQgMCBMIDYgMCBMIDYgMSBMIDQgMSBMIDQgMCBaIE0gOCAwIEwgMTAgMCBMIDEwIDEgTCA4IDEgTCA4IDAgWiBNIDEyIDAgTCAxNCAwIEwgMTQgMSBMIDEyIDEgTCAxMiAwIFogTSAxNiAwIEwgMTggMCBMIDE4IDEgTCAxNiAxIEwgMTYgMCBaIE0gMjAgMCBMIDIyIDAgTCAyMiAxIEwgMjAgMSBMIDIwIDAgWiBNIDI0IDAgTCAyNiAwIEwgMjYgMSBMIDI0IDEgTCAyNCAwIFogTSAyOCAwIEwgMzAgMCBMIDMwIDEgTCAyOCAxIEwgMjggMCBaIE0gMzIgMCBMIDM0IDAgTCAzNCAxIEwgMzIgMSBMIDMyIDAgWiBNIDM2IDAgTCAzOCAwIEwgMzggMSBMIDM2IDEgTCAzNiAwIFogTSAzOSAwIEwgNDAgMCBDIDQwIDAgNDAgMiA0MCAyIEwgMzkgMiBMIDM5IDAgWiBNIDM5IDQgTCA0MCA0IEMgNDAgNCA0MCA2IDQwIDYgTCAzOSA2IEwgMzkgNCBaIE0gMzkgOCBMIDQwIDggQyA0MCA4IDQwIDEwIDQwIDEwIEwgMzkgMTAgTCAzOSA4IFogTSAzOSAxMiBMIDQwIDEyIEMgNDAgMTIgNDAgMTQgNDAgMTQgTCAzOSAxNCBMIDM5IDEyIFogTSAzOSAxNiBMIDQwIDE2IEMgNDAgMTYgNDAgMTggNDAgMTggTCAzOSAxOCBMIDM5IDE2IFogTSAzOSAyMCBMIDQwIDIwIEMgNDAgMjAgNDAgMjIgNDAgMjIgTCAzOSAyMiBMIDM5IDIwIFogTSAzOSAyNCBMIDQwIDI0IEMgNDAgMjQgNDAgMjYgNDAgMjYgTCAzOSAyNiBMIDM5IDI0IFogTSAzOSAyOCBMIDQwIDI4IEMgNDAgMjggNDAgMzAgNDAgMzAgTCAzOSAzMCBMIDM5IDI4IFogTSAzOSAzMiBMIDQwIDMyIEMgNDAgMzIgNDAgMzQgNDAgMzQgTCAzOSAzNCBMIDM5IDMyIFogTSAzOSAzNiBMIDQwIDM2IEMgNDAgMzYgNDAgMzggNDAgMzggTCAzOSAzOCBMIDM5IDM2IFogTSAzOCAzOSBMIDQwIDM5IEwgNDAgNDAgQyA0MCA0MCAzOCA0MCAzOCA0MCBMIDM4IDM5IFogTSAzNCAzOSBMIDM2IDM5IEwgMzYgNDAgQyAzNiA0MCAzNCA0MCAzNCA0MCBMIDM0IDM5IFogTSAzMCAzOSBMIDMyIDM5IEwgMzIgNDAgQyAzMiA0MCAzMCA0MCAzMCA0MCBMIDMwIDM5IFogTSAyNiAzOSBMIDI4IDM5IEwgMjggNDAgQyAyOCA0MCAyNiA0MCAyNiA0MCBMIDI2IDM5IFogTSAyMiAzOSBMIDI0IDM5IEwgMjQgNDAgQyAyNCA0MCAyMiA0MCAyMiA0MCBMIDIyIDM5IFogTSAxOCAzOSBMIDIwIDM5IEwgMjAgNDAgQyAyMCA0MCAxOCA0MCAxOCA0MCBMIDE4IDM5IFogTSAxNCAzOSBMIDE2IDM5IEwgMTYgNDAgQyAxNiA0MCAxNCA0MCAxNCA0MCBMIDE0IDM5IFogTSAxMCAzOSBMIDEyIDM5IEwgMTIgNDAgQyAxMiA0MCAxMCA0MCAxMCA0MCBMIDEwIDM5IFogTSA2IDM5IEwgOCAzOSBMIDggNDAgQyA4IDQwIDYgNDAgNiA0MCBMIDYgMzkgWiBNIDIgMzkgTCA0IDM5IEwgNCA0MCBDIDQgNDAgMiA0MCAyIDQwIEwgMiAzOSBaIE0gMCAzOCBMIDEgMzggTCAxIDQwIEwgMCA0MCBMIDAgMzggWiBNIDAgMzQgTCAxIDM0IEwgMSAzNiBMIDAgMzYgTCAwIDM0IFogTSAwIDMwIEwgMSAzMCBMIDEgMzIgTCAwIDMyIEwgMCAzMCBaIE0gMCAyNiBMIDEgMjYgTCAxIDI4IEwgMCAyOCBMIDAgMjYgWiBNIDAgMjIgTCAxIDIyIEwgMSAyNCBMIDAgMjQgTCAwIDIyIFogTSAwIDE4IEwgMSAxOCBMIDEgMjAgTCAwIDIwIEwgMCAxOCBaIE0gMCAxNCBMIDEgMTQgTCAxIDE2IEwgMCAxNiBMIDAgMTQgWiBNIDAgMTAgTCAxIDEwIEwgMSAxMiBMIDAgMTIgTCAwIDEwIFogTSAwIDYgTCAxIDYgTCAxIDggTCAwIDggTCAwIDYgWiBNIDAgMiBMIDEgMiBMIDEgNCBMIDAgNCBMIDAgMiBaIiBzdHJva2U9Im5vbmUiIGZpbGw9IiM3MDcwNzAiLz4KICAgIDwvZz4KICAgIDxnIGlkPSJHcm91cF82MDU3IiBkYXRhLW5hbWU9Ikdyb3VwIDYwNTciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUgLTAuNSkiPgogICAgICA8cGF0aCBpZD0iUGF0aF8xNTAiIGRhdGEtbmFtZT0iUGF0aCAxNTAiIGQ9Ik03ODMuNi0xMTMuNnYxNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDk0LjkgLTE4My45KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIvPgogICAgICA8cGF0aCBpZD0iUGF0aF8xNTEiIGRhdGEtbmFtZT0iUGF0aCAxNTEiIGQ9Ik0wLDBWMTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyODYuNSAtMjg5LjUpIHJvdGF0ZSg5MCkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo="; // Replace with your image path
        image.alt = "Add Files"; // Alt text for accessibility
        image.width = 28; // Set the image width (optional)
        image.height = 28; // Set the image height (optional)
    
        // Append the image to the button
        addImageButton.appendChild(image);
    
        // Add click event to trigger file input
        addImageButton.addEventListener("click", () => {
            this.select('input[type="file"]').click();
        });
    
        addButtonContainer.appendChild(addImageButton);
    }
    
    }
    
    this.dispatch("change", files); // Dispatch array of selected files
  }
  
  
  dispatch(event, arg) {
    this.dispatchEvent(new CustomEvent("timage", {
      bubbles: true,
      detail: {
        version: '2.2.22',
        method: this.getAttribute("callback"),
        detail: arg
      }
    }));
  }

  get select() {
    return this.shadowRoot.querySelector.bind(this.shadowRoot);
  }

  // Define the observed attributes
  static get observedAttributes() {
    return ["theme", "lang", "buttonText", "disabled"];
  }

  // Handle changes to observed attributes
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      if (name && newValue) {
        console.log(
          "Inside attributeChangedCallback file upload :",
          name,
          newValue,
          oldValue
        );
        switch (name) {
          case "theme":
            let labelTag = this.shadowRoot.querySelectorAll(
              ".file-upload-content"
            )[0];
            if (oldValue) {
              labelTag.classList.remove(oldValue);
            }
            labelTag.classList.add(newValue);
            break;
          case "lang":
            let articleTag = this.shadowRoot.querySelector("article");
            let selectedImages = this.shadowRoot.querySelectorAll(".selected-images")[0];
            articleTag.setAttribute("dir", newValue === "ar" ? "rtl" : "ltr");
            selectedImages.setAttribute("dir", newValue === "ar" ? "rtl" : "ltr");
            articleTag.setAttribute("lang", newValue === "en" ? "en" : "ar");
            break;
          case "buttonText":
            let buttonTextTag = this.shadowRoot.querySelectorAll(
              ".file-upload-content")[0];
            buttonTextTag.textContent = newValue;
            break;
          case "disabled":
            let inputTag = this.shadowRoot.querySelector("input");
            let disableLabelTag = this.shadowRoot.querySelectorAll(".file-upload-content")[0];
            if (newValue !== null && newValue == "true") {
              inputTag.setAttribute("disabled", "");
              disableLabelTag.classList.add("disabled");
            } else {
              inputTag.removeAttribute("disabled");
              disableLabelTag.classList.remove("disabled");
            }
            break;
          default:
            break;
        }
      }
    }
  }
}

export default fileUpload;
