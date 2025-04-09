import styles from "./imageviewer.scss";

class ImageViewer extends HTMLElement {
  images = [];
  currentImageIndex = 0;
  currentRotationAngle = 0;
  currentImagezoomInOutScale = 1;
  maxZoomScale = 3;
  minZoomScale = 0.1;
  zoomScale = 1;

  constructor() {
    super();
    setTimeout(() => {
      this.attachShadow({
        mode: "open",
      });
      this.close = this.close.bind(this);
    }, 0);
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    setTimeout(() => {
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";

      this.images = this.hasAttribute("images") ? this.getAttribute("images") : [];

      this.width= this.getAttribute('width') ? this.getAttribute('width') : '30vw';

      this.height= this.getAttribute('height') ? this.getAttribute('height') : '30vh';

   

      this.startIndex = parseInt(this.getAttribute('startindex'), 10) || 0;
      this.currentImageIndex = (this.startIndex >= 0 && this.startIndex < this.images.split(',').length) ? this.startIndex : 0;

      const { shadowRoot } = this;
            shadowRoot.innerHTML = `
            <style> ${styles.toString()} </style>
            <div class="wrapper">
              <div class="overlay"></div>
              <div class="image-dialog ${theme}" role="image-dialog" style="padding: 20px;" aria-labelledby="title" aria-describedby="content">
                <div class="header">
                  <div class="title">Image Gallery</div>
                  <div class="current-img-name"></div>
                  <div class="closed">
                    <img class="close-btn" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABHNCSVQICAgIfAhkiAAAAJtJREFUKFNj/P///wYGBgZ7IC5kZGRcAKTxAqD6BKCCfiA+wAjkfAAy+KE6EvEZANU4H6r2I0gzyCSYAEgcqwFY1YFUEzIAlzwjzIO4FOAzGK4ZhwvmAsWTkUIQxUsomnEYANOLERYYmqEGzEGzcS4wFlLQ45B6NmMJHOL8THZokx3PhDTiTQcUpO0PoLQNylUOQFxAQq6aAMpVAGmZfPzpEgjWAAAAAElFTkSuQmCC" title="close" alt="close"/>
                  </div>
                </div>
                <hr>
                <div class="content">
                  <div class="image-container"></div>
                </div>
                <hr>
                <div class="controls">
                    <div class="previous">
                        <img class="prev-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzE0IiBkYXRhLW5hbWU9Ik1hc2sgR3JvdXAgMTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMCAtMjAuMDc1KSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgPGcgaWQ9InByZXZpb3VzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMC4wNzUpIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTUyIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTUyIj4KICAgICAgICA8ZyBpZD0iR3JvdXBfMzQxNTEiIGRhdGEtbmFtZT0iR3JvdXAgMzQxNTEiPgogICAgICAgICAgPHBhdGggaWQ9IlBhdGhfMzIxIiBkYXRhLW5hbWU9IlBhdGggMzIxIiBkPSJNMzEuNzEuMDE3QTQuMTEsNC4xMSwwLDAsMCwyOS40My44Nkw5Ljk5MSwxNC4yNTFhNCw0LDAsMCwwLTEuOTMzLDMuMjY3QTQuMDE2LDQuMDE2LDAsMCwwLDEwLDIwLjc4NkwyOS40NTksMzQuMTY4QTQuMTg3LDQuMTg3LDAsMCwwLDMxLjc3MSwzNWgwYTIuMTA5LDIuMTA5LDAsMCwwLDEuNzkzLS45Miw0LjE0NCw0LjE0NCwwLDAsMCwuNjE2LTIuNDgzVjMuNDRDMzQuMTgxLDEuMzI5LDMzLjI3NC4wMTcsMzEuNzEuMDE3WiIgZmlsbD0iI2ZmZiIvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxNTQiIGRhdGEtbmFtZT0iR3JvdXAgMzQxNTQiPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDE1MyIgZGF0YS1uYW1lPSJHcm91cCAzNDE1MyI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMjIiIGRhdGEtbmFtZT0iUGF0aCAzMjIiIGQ9Ik0zLjc2NiwwLDIuODI5LDBBMiwyLDAsMCwwLC44MTksMS45MTVWMzMuMDc4QTEuOTgsMS45OCwwLDAsMCwyLjgsMzVoLjAzMmwuOTE4LS4wMDVhMS45ODgsMS45ODgsMCwwLDAsMS45OTItMS45MThWMS45MTdBMS45NywxLjk3LDAsMCwwLDMuNzY2LDBaIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" title="previous" alt="previous"/>
                    </div>
                    <div class="anti-clock-rotation">
                      <img class="anti-clock-rotation-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNy43MjciIGhlaWdodD0iMzcuNzM2IiB2aWV3Qm94PSIwIDAgMzcuNzI3IDM3LjczNiI+CiAgPGcgaWQ9ImNvdW50ZXJjbG9ja3dpc2UtY2lyY3VsYXItYXJyb3ciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjA2NyAzNy43MzYpIHJvdGF0ZSgtOTApIj4KICAgIDxnIGlkPSJfeDMyX18yN18iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMC4wNjcpIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTU2IiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTU2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDApIj4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMjQiIGRhdGEtbmFtZT0iUGF0aCAzMjQiIGQ9Ik0zNi4zNzksMy4wOTFjLjYzNS0uNjM1LDEuMzU3LTEuMTk0LDEuMzU3LTEuODQ1QTEuMTc5LDEuMTc5LDAsMCwwLDM2LjU1Ny4wNjdIMjQuNzY4YTEuMDk0LDEuMDk0LDAsMCwwLTEuMTc5LDEuMTc5VjEzLjAzNWExLjE3OSwxLjE3OSwwLDAsMCwxLjE3OSwxLjE3OWMuNjUxLDAsMS4xMDYtLjYxNywxLjYwOC0xLjEybDMuMjc2LTMuMjc2QTE0LjEzNSwxNC4xMzUsMCwxLDEsMTYuNSw1Vi4yMzJBMTguODczLDE4Ljg3MywwLDEsMCwzMyw2LjQ2OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTAuMDY3KSIgZmlsbD0iI2ZmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"  title="anti-clock-rotation" alt="anti-clock-rotation"/>
                    </div>
                    <div class="clock-rotation">
                        <img class="clock-rotate-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNy43MjgiIGhlaWdodD0iMzcuNzM2IiB2aWV3Qm94PSIwIDAgMzcuNzI4IDM3LjczNiI+CiAgPGcgaWQ9ImNvdW50ZXJjbG9ja3dpc2UtY2lyY3VsYXItYXJyb3ciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMzcuNzM2KSByb3RhdGUoLTkwKSI+CiAgICA8ZyBpZD0iX3gzMl9fMjdfIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTU2IiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTU2Ij4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMjQiIGRhdGEtbmFtZT0iUGF0aCAzMjQiIGQ9Ik0zNi4zNzksMzQuN2MuNjM1LjYzNSwxLjM1NywxLjE5NCwxLjM1NywxLjg0NWExLjE3OSwxLjE3OSwwLDAsMS0xLjE3OSwxLjE3OUgyNC43NjhhMS4wOTQsMS4wOTQsMCwwLDEtMS4xNzktMS4xNzlWMjQuNzU5YTEuMTc5LDEuMTc5LDAsMCwxLDEuMTc5LTEuMTc5Yy42NTEsMCwxLjEwNi42MTcsMS42MDgsMS4xMmwzLjI3NiwzLjI3NkExNC4xMzUsMTQuMTM1LDAsMSwwLDE2LjUsMzIuOHY0Ljc2NUExOC44NzMsMTguODczLDAsMSwxLDMzLDMxLjMyNloiIGZpbGw9IiNmZmYiLz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg=="  title="clock-rotation" alt="clock-rotation"/>
                    </div>
                    <div class="image-zoom-in">
                        <img class="img-zoom-in" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfNDQiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDQ0IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzEyIiBkYXRhLW5hbWU9Ik1hc2sgR3JvdXAgMTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMCAtMjAuMDc1KSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgPGcgaWQ9Inpvb20taW4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0LjE2NyAxNC4yNDIpIj4KICAgICAgPHBhdGggaWQ9IlhNTElEXzIyN18iIGQ9Ik0zOS45NzksMzUuODU1bC03LjQtNy40YTE0LjYxMSwxNC42MTEsMCwxLDAtNC4xMjQsNC4xMjRsNy40LDcuNGEyLjkxNiwyLjkxNiwwLDAsMCw0LjEyNC00LjEyNFpNMTAuMjA4LDIwLjQxN0ExMC4yMDgsMTAuMjA4LDAsMSwxLDIwLjQxNywzMC42MjUsMTAuMjIsMTAuMjIsMCwwLDEsMTAuMjA4LDIwLjQxN1oiIGZpbGw9IiNmZmYiLz4KICAgICAgPHBhdGggaWQ9IlhNTElEXzIzMF8iIGQ9Ik0yNy43MDksMjAuNDE3YTEuNDU5LDEuNDU5LDAsMCwxLTEuNDU4LDEuNDU4SDIxLjg3NVYyNi4yNWExLjQ1OCwxLjQ1OCwwLDEsMS0yLjkxNywwVjIxLjg3NUgxNC41ODNhMS40NTgsMS40NTgsMCwxLDEsMC0yLjkxN2g0LjM3NVYxNC41ODNhMS40NTgsMS40NTgsMCwxLDEsMi45MTcsMHY0LjM3NUgyNi4yNUExLjQ1OSwxLjQ1OSwwLDAsMSwyNy43MDksMjAuNDE3WiIgZmlsbD0iI2ZmZiIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==" title="zoom-in" alt="zoom-in"/>
                    </div>
                    <div class="image-zoom-out">
                        <img class="img-zoom-out" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzExIiBkYXRhLW5hbWU9Ik1hc2sgR3JvdXAgMTEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMCAtMjAuMDc1KSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgPGcgaWQ9Inpvb20tb3V0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNC4xNjcgMTQuMjQyKSI+CiAgICAgIDxwYXRoIGlkPSJYTUxJRF8yMzJfIiBkPSJNMzkuOTc5LDM1Ljg1NWwtNy40LTcuNGExNC42MTEsMTQuNjExLDAsMSwwLTQuMTI0LDQuMTI0bDcuNCw3LjRhMi45MTYsMi45MTYsMCwwLDAsNC4xMjQtNC4xMjRaTTEwLjIwOCwyMC40MTdBMTAuMjA4LDEwLjIwOCwwLDEsMSwyMC40MTcsMzAuNjI1LDEwLjIyLDEwLjIyLDAsMCwxLDEwLjIwOCwyMC40MTdaIiBmaWxsPSIjZmZmIi8+CiAgICAgIDxwYXRoIGlkPSJYTUxJRF8yMzVfIiBkPSJNMjcuNzA5LDIwLjQxN2ExLjQ1OSwxLjQ1OSwwLDAsMS0xLjQ1OCwxLjQ1OEgxNC41ODNhMS40NTgsMS40NTgsMCwxLDEsMC0yLjkxN0gyNi4yNUExLjQ1OSwxLjQ1OSwwLDAsMSwyNy43MDksMjAuNDE3WiIgZmlsbD0iI2ZmZiIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==" title="zoom-out" alt="zoom-out"/>
                    </div>
                    <div class="next">
                        <img class="next-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzEzIiBkYXRhLW5hbWU9Ik1hc2sgR3JvdXAgMTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMCAtMjAuMDc1KSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgPGcgaWQ9Im5leHRfM18iIGRhdGEtbmFtZT0ibmV4dCAoMykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxNDciIGRhdGEtbmFtZT0iR3JvdXAgMzQxNDciPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDE0NiIgZGF0YS1uYW1lPSJHcm91cCAzNDE0NiI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMTgiIGRhdGEtbmFtZT0iUGF0aCAzMTgiIGQ9Ik0yNS4yMjksMTQuMjQ0LDUuNzcxLjg2QTQuMjksNC4yOSwwLDAsMCwzLjQyOC4wMThjLTEuNTYzLDAtMi42LDEuMzExLTIuNiwzLjQyMVYzMS41OGE0LjE3OSw0LjE3OSwwLDAsMCwuNzQ0LDIuNDkxQTIuMzQ4LDIuMzQ4LDAsMCwwLDMuNDkxLDM1YTQuMiw0LjIsMCwwLDAsMi4zMS0uODQyTDI1LjI0MSwyMC43NzRhNCw0LDAsMCwwLDEuOTM1LTMuMjY2QTQuMDE0LDQuMDE0LDAsMCwwLDI1LjIyOSwxNC4yNDRaIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICAgIDxnIGlkPSJHcm91cF8zNDE1MCIgZGF0YS1uYW1lPSJHcm91cCAzNDE1MCI+CiAgICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTQ5IiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTQ5Ij4KICAgICAgICAgIDxnIGlkPSJHcm91cF8zNDE0OCIgZGF0YS1uYW1lPSJHcm91cCAzNDE0OCI+CiAgICAgICAgICAgIDxwYXRoIGlkPSJQYXRoXzMxOSIgZGF0YS1uYW1lPSJQYXRoIDMxOSIgZD0iTTMyLjM1MywzNC45OTFoMFoiIGZpbGw9IiNmZmYiLz4KICAgICAgICAgICAgPHBhdGggaWQ9IlBhdGhfMzIwIiBkYXRhLW5hbWU9IlBhdGggMzIwIiBkPSJNMzIuMywwbC0uOCwwYTEuOTYyLDEuOTYyLDAsMCwwLTEuOTY1LDEuOTEzVjMzLjA1OGExLjk1NiwxLjk1NiwwLDAsMCwxLjk1MSwxLjkyM2wuODU0LjAxMWExLjg3OSwxLjg3OSwwLDAsMCwxLjg0LTEuOTMyVjEuOTEzQTEuODg1LDEuODg1LDAsMCwwLDMyLjMsMFoiIGZpbGw9IiNmZmYiLz4KICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=" title="next" alt="next"/>
                    </div>
                </div>
              </div>
            </div>`;

      this.images = this.images.split(",");
      const imageContainer = this.shadowRoot.querySelector(".image-container");
      imageContainer.innerHTML = ""; // Clear existing images
      const imageElement = document.createElement("img");
      imageElement.src = this.images[this.currentImageIndex];
      imageElement.style.width = this.width;
      imageElement.style.height = this.height;
      imageElement.classList = "center";
      imageContainer.appendChild(imageElement);

      this.shadowRoot.querySelector(".current-img-name").textContent=this.images[this.currentImageIndex].split("/").pop();
      this.prevButton = this.shadowRoot.querySelector(".prev-btn");
      this.nextButton = this.shadowRoot.querySelector(".next-btn");
      this.closeButton = this.shadowRoot.querySelector(".closed");
      this.clockRotationButton = this.shadowRoot.querySelector(".clock-rotation");
      this.anticlockRotationButton = this.shadowRoot.querySelector(".anti-clock-rotation");
      this.zoomInButton = this.shadowRoot.querySelector(".image-zoom-in");
      this.zoomOutButton = this.shadowRoot.querySelector(".image-zoom-out");

      this.prevButton.addEventListener("click", () => this.showPreviousImage());
      this.nextButton.addEventListener("click", () => this.showNextImage());
      this.closeButton.addEventListener("click", () => this.close());
      this.clockRotationButton.addEventListener("click", () => this.clockWiseImageRotation());
      this.anticlockRotationButton.addEventListener("click", () => this.antiClockWiseImageRotation());
      this.zoomInButton.addEventListener("click", (event) => this.zoomInImage(event));
      this.zoomOutButton.addEventListener("click", () => this.zoomOutImage());

      if (shadowRoot.querySelector("button")) {
        shadowRoot.querySelector("button").addEventListener("click", this.close());
      }
      if (shadowRoot.querySelector(".overlay")) {
        shadowRoot.querySelector(".overlay").addEventListener("click", this.close());
      }
    }, 0);
  }

  zoomInImage($event) {      
    if (parseFloat(this.currentImagezoomInOutScale.toFixed(2)) < this.maxZoomScale) {
      this.currentImagezoomInOutScale += 0.1; // Incrementing the Zoom scale 0.1
      const imageElement = this.shadowRoot.querySelector(".image-container img");
      if (imageElement) {
        imageElement.style.transform = `scale(${this.currentImagezoomInOutScale}) rotate(${this.currentRotationAngle}deg)`;
        imageElement.style.cursor=`zoom-in`;
      }
    }
    $event.stopPropagation();
  }

  zoomOutImage() {
    if (parseFloat(this.currentImagezoomInOutScale.toFixed(2)) > this.minZoomScale ) {
      this.currentImagezoomInOutScale -= 0.1;  // Decrement the Zoom scale 0.1
      const imageElement = this.shadowRoot.querySelector(".image-container img");
      if (imageElement) {
        imageElement.style.transform = `scale(${this.currentImagezoomInOutScale}) rotate(${this.currentRotationAngle}deg)`;
        imageElement.style.cursor=`zoom-out`;
      }
    }
  }

  // Method to rotate the image
  clockWiseImageRotation() {
    if (this.currentRotationAngle == 360) this.currentRotationAngle = 0;
    this.currentRotationAngle += 90; // Increment the rotation angle by 15 degrees
    const imageElement = this.shadowRoot.querySelector(".image-container img");
    if (imageElement) {
      imageElement.style.transform =`scale(${this.currentImagezoomInOutScale}) rotate(${this.currentRotationAngle}deg)`;
    }
  }

  antiClockWiseImageRotation() {
    if (this.currentRotationAngle == -360) this.currentRotationAngle = 0;
    this.currentRotationAngle -= 90;
    const imageElement = this.shadowRoot.querySelector(".image-container img");
    if (imageElement) {
      imageElement.style.transform =`scale(${this.currentImagezoomInOutScale}) rotate(${this.currentRotationAngle}deg)`;
    }
  }

  showImage() {
    this.shadowRoot.querySelector(".current-img-name").textContent=this.images[this.currentImageIndex].split("/").pop();
    const imageContainer = this.shadowRoot.querySelector(".image-container");
    this.currentRotationAngle = 0;
    imageContainer.innerHTML = ""; // Clear existing images
    const imageElement = document.createElement("img");
    imageElement.src = this.images[this.currentImageIndex];
    imageElement.style.width = this.width;
    imageElement.style.height = this.height;
    imageElement.classList = "center";
    imageContainer.appendChild(imageElement);
    this.dispatch("change", this.images[this.currentImageIndex]); // Dispatch array of selected files
  }

  dispatch(event, arg) {
    this.dispatchEvent(
      new CustomEvent("timageviewer", {
        bubbles: true,
        detail: {
          version: "2.3.0",
          method: this.getAttribute("callback"),
          selectedimg: arg,
          images: this.images,
        },
      })
    );
  }

  showPreviousImage() {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.showImage();
  }

  showNextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.showImage();
  }

  get open() {
    return this.hasAttribute("open");
  }

  set open(isOpen) {
    const { shadowRoot } = this;
    this.currentRotationAngle=0;
    this.currentImagezoomInOutScale = 1;
    const imageElement = this.shadowRoot.querySelector(".image-container img");
    if (imageElement) {
      imageElement.style.transform =`scale(${this.currentImagezoomInOutScale}) rotate(${this.currentRotationAngle}deg)`;
    }
    shadowRoot.querySelector(".wrapper").classList.toggle("open", isOpen);
    shadowRoot.querySelector(".wrapper").setAttribute("aria-hidden", !isOpen);
    if (isOpen) {
      this._wasFocused = document.activeElement;
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  }

  close() {
    const { shadowRoot } = this;
    let wrapperBtn = shadowRoot.querySelector(".wrapper");
    wrapperBtn.classList.remove("open");
    wrapperBtn.setAttribute("aria-hidden", true);
    this.currentImageIndex=parseInt(this.getAttribute('startindex'), 10) || 0;
    this.showImage();
  }

  // Define the observed attributes
  static get observedAttributes() {
    return ["theme","width","height","images","startindex"];
  }

  // Handle changes to observed attributes
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      if (name && newValue) {
        switch (name) {
          case "theme":
            let labelTag = this.shadowRoot.querySelectorAll(".dialog")[0];
            if (oldValue) {
              labelTag.classList.remove(oldValue);
            }
            labelTag.classList.add(newValue);
            break;
          case "width":
            this.width=newValue;
            this.shadowRoot.querySelector(".center").style.width = this.width;
            break;
          case "height":
            this.height=newValue;
            this.shadowRoot.querySelector(".center").style.height = this.height;
            break;
          case "images":
            this.images = newValue.split(",");
            this.shadowRoot.querySelector(".center").src = this.images[this.currentImageIndex];
            break;
            case "startindex":
              this.currentImageIndex=parseInt(this.getAttribute('startindex'), 10) || 0;
              this.showImage();
            break;
          default:
            break;
        }
      }
    }
  }
}

export default ImageViewer;