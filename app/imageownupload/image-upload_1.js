import styles from "./image-upload_1.scss";

 class TImageUpload extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
      <style>${styles.toString()}</style>
      <div class="upload-wrapper">
      <div style="display:flex; justify-content:center; align-item:center;">
     <div class="upload">
  <span class="label-text" style=" margin-left: 20px" id="customLabel"></span>
  <label class="upload-button" for="imageUpload">Browse</label>
</div>


       <div>
       <button class="clear-button "  id="clearImages" >Clear</button></div>
       </div>
       <input type="file" id="imageUpload" accept="image/*"></div>
       <div class="images-preview" id="previewContainer"></div>
      </div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.mode = this.getAttribute("mode") || "single-no-preview";
    const input = this.shadowRoot.querySelector("#imageUpload");
    const preview = this.shadowRoot.querySelector("#previewContainer");
    const clearBtn = this.shadowRoot.querySelector("#clearImages");
    const label = this.getAttribute("label-text") || "Upload Image:";
this.shadowRoot.querySelector("#customLabel").textContent = label;


    if (["multi-latest-preview", "multi-all-preview"].includes(this.mode)) {
      input.setAttribute("multiple", "");
    }

    input.addEventListener("change", (e) => {
      const files = Array.from(e.target.files).filter(
        (file) => file.size <= 5 * 1024 * 1024
      );

      if (this.mode === "single-no-preview") {
        preview.innerHTML = "single image with no preview";
        // clearBtn.hidden = true;
        return;
      }

      if (this.mode !== "multi-all-preview") {
        preview.innerHTML = "single image with preview";
      }

      if (this.mode === "single-preview" && files[0]) {
        preview.innerHTML = "single image with singel-preview";
        this.addImageToPreview(preview, files[0]);
      }

      if (this.mode === "multi-latest-preview" && files.length) {
        preview.innerHTML = "single image with latest-preview";
        this.addImageToPreview(preview, files.at(-1));
      }

      if (this.mode === "multi-all-preview") {
        files.forEach((file) => this.addImageToPreview(preview, file));
        this.addPlusIcon(preview);
      }

      clearBtn.hidden = false;
    });

    clearBtn.addEventListener("click", () => {
      preview.innerHTML = "";
      input.value = "";
      // clearBtn.hidden = true;

      if (this.mode === "multi-all-preview") {
        this.addPlusIcon(preview);
      }
    });
  }

  addImageToPreview(container, file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement("img");
      img.src = reader.result;
      container.appendChild(img);
    };
    reader.readAsDataURL(file);
  }

  addPlusIcon(container) {
    const existing = container.querySelector(".add-more-icon");
    if (existing) return;

    const plusBtn = document.createElement("div");
    plusBtn.className = "add-more-icon";
    const img = document.createElement("img");
   
    img.src = "app/imageownupload/Group 197129.svg"; // 🔁 Replace with the actual path to your image
    img.alt = "Add more";
    img.style.width = "24px";
    img.style.height = "24px";
    img.style.pointerEvents = "none"; // So only the container is clickable
img.classList.add("plus");
    plusBtn.appendChild(img);

    plusBtn.title = "Add more images";
    plusBtn.addEventListener("click", () => {
      this.shadowRoot.querySelector("#imageUpload").click();
    });
    container.appendChild(plusBtn);
  }
}

// customElements.define("t-image-upload", TImageUpload);
export default TImageUpload;
