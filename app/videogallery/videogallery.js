import styles from "./videogallery.scss";

class VideoGallery extends HTMLElement {
  videos = [];
  currentVideoIndex = 0;

  // Properties to store skip time values
  backwardSkipTime = 5; // Default value: 5 seconds
  forwardSkipTime = 5; // Default value: 5 seconds
  

  constructor() {
    super();
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Initialize audioContext

    setTimeout(() => {
      this.attachShadow({ mode: "open" });
      this.close = this.close.bind(this);
    }, 0);
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    setTimeout(() => {
      let theme = this.hasAttribute("theme") ? this.getAttribute("theme") : "dark";

      this.videos = this.hasAttribute("videos") ? this.getAttribute("videos") : [];

      this.backwardSkipTime = this.hasAttribute("backward")
        ? this.getAttribute("backward")
        : this.backwardSkipTime;

      this.forwardSkipTime = this.hasAttribute("forward")
        ? this.getAttribute("forward")
        : this.forwardSkipTime;

        
      this.startIndex = parseInt(this.getAttribute('startindex'), 10) || 0;
      this.currentVideoIndex = (this.startIndex >= 0 && this.startIndex < this.videos.split(',').length) ? this.startIndex : 0;


      this.width= this.getAttribute('width') ? this.getAttribute('width') : '30vw';

      this.height= this.getAttribute('height') ? this.getAttribute('height') : '30vh';

      const { shadowRoot } = this;
      shadowRoot.innerHTML = `
        <style> ${styles.toString()} </style>
        <div class="wrapper">
          <div class="overlay"></div>
          <div class="video-dialog ${theme}" role="video-dialog" style="padding: 20px;" aria-labelledby="title" aria-describedby="content">
            <div class="header">
              <div class="title">Video Gallery</div>
              <div class="current-video-name"></div>
              <div class="closed">
                <img class="close-btn" src="data:image/png;base64,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" title="close" alt="close"/>
              </div>
            </div>
            <hr>
            <div class="content">
              <div class="video-container"></div>
            </div>
            <hr>
            <div class="controls">
                <div class="replay">
                    <img class="replay-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDAiIGhlaWdodD0iMzguNDYyIiB2aWV3Qm94PSIwIDAgNDAgMzguNDYyIj4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcC1wYXRoIj4KICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZV80MiIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgNDIiIHdpZHRoPSIxMi4xNjkiIGhlaWdodD0iMTUuNDE0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC4wNzcgLTEuNTM4KSIgZmlsbD0iI2ZmZiIvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+CiAgPGcgaWQ9Ikdyb3VwXzM0MTQyIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTQyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjg5OCAtMTI0NCkiPgogICAgPGcgaWQ9InJlZnJlc2hfM18iIGRhdGEtbmFtZT0icmVmcmVzaCAoMykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI4OTggMTI0NCkiPgogICAgICA8cGF0aCBpZD0iUGF0aF8zMTMiIGRhdGEtbmFtZT0iUGF0aCAzMTMiIGQ9Ik01LDI0LjAxOEExOS4yMTgsMTkuMjE4LDAsMCwxLDM3LjY2LDEwLjQ4M0wzOS44NDEsOC4zYS43NjkuNzY5LDAsMCwxLDEuMjgzLjMzMkw0NC4yLDE5LjRhLjc0Ljc0LDAsMCwxLC4wMy4yMTIuNzcxLjc3MSwwLDAsMS0uOTgxLjc0TDMyLjQ4MSwxNy4yNzhhLjc2OS43NjksMCwwLDEtLjMzMi0xLjI4NGwyLjIzNy0yLjIzN0ExNC41ODcsMTQuNTg3LDAsMCwwLDkuNjE2LDI0LjIzMXEwLC41NzIuMDQ0LDEuMTMzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuMjMxIC01KSIgZmlsbD0iI2ZmZiIvPgogICAgICA8cGF0aCBpZD0iUGF0aF8zMTQiIGRhdGEtbmFtZT0iUGF0aCAzMTQiIGQ9Ik00My4yMjksMjkuODczQTE5LjIxOCwxOS4yMTgsMCwwLDEsMTAuNTcxLDQzLjQwOEw4LjM5LDQ1LjU4OWEuNzY5Ljc2OSwwLDAsMS0xLjI4My0uMzMyTDQuMDMsMzQuNDg3QS43NC43NCwwLDAsMSw0LDM0LjI3NWEuNzcxLjc3MSwwLDAsMSwuOTgxLS43NEwxNS43NSwzNi42MTJhLjc2OS43NjksMCwwLDEsLjMzMiwxLjI4NGwtMi4yMzcsMi4yMzdBMTQuNTg3LDE0LjU4NywwLDAsMCwzOC42MTUsMjkuNjZxMC0uNTcyLS4wNDQtMS4xMzNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNCAtMTAuNDI5KSIgZmlsbD0iI2ZmZiIvPgogICAgPC9nPgogICAgPGcgaWQ9Ik1hc2tfR3JvdXBfOSIgZGF0YS1uYW1lPSJNYXNrIEdyb3VwIDkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI5MTEuOTkzIDEyNTcuMDYyKSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgICA8ZyBpZD0icGxheV80XyIgZGF0YS1uYW1lPSJwbGF5ICg0KSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS41NjIgLTAuMjkpIj4KICAgICAgICA8ZyBpZD0iR3JvdXBfMzQxNDEiIGRhdGEtbmFtZT0iR3JvdXAgMzQxNDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDApIj4KICAgICAgICAgIDxwYXRoIGlkPSJQYXRoXzMxNSIgZGF0YS1uYW1lPSJQYXRoIDMxNSIgZD0iTTEzLjE2OCw1LjE1Niw2LjEzMy4zNEExLjcxNywxLjcxNywwLDAsMCw1LjIwOSwwYy0uNTI2LDAtLjg1MS40MjItLjg1MSwxLjEyOVYxMS41MzhjMCwuNzA2LjMyNSwxLjEyNy44NSwxLjEyN2ExLjcsMS43LDAsMCwwLC45Mi0uMzQxbDcuMDM4LTQuODE2YTEuNDQ0LDEuNDQ0LDAsMCwwLC43LTEuMTc2QTEuNDM5LDEuNDM5LDAsMCwwLDEzLjE2OCw1LjE1NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00LjM1NykiIGZpbGw9IiNmZmYiLz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=" title="replay" alt="replay"/>
                </div>    
                <div class="previous">
                    <img class="prev-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzE0IiBkYXRhLW5hbWU9Ik1hc2sgR3JvdXAgMTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMCAtMjAuMDc1KSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgPGcgaWQ9InByZXZpb3VzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMC4wNzUpIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTUyIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTUyIj4KICAgICAgICA8ZyBpZD0iR3JvdXBfMzQxNTEiIGRhdGEtbmFtZT0iR3JvdXAgMzQxNTEiPgogICAgICAgICAgPHBhdGggaWQ9IlBhdGhfMzIxIiBkYXRhLW5hbWU9IlBhdGggMzIxIiBkPSJNMzEuNzEuMDE3QTQuMTEsNC4xMSwwLDAsMCwyOS40My44Nkw5Ljk5MSwxNC4yNTFhNCw0LDAsMCwwLTEuOTMzLDMuMjY3QTQuMDE2LDQuMDE2LDAsMCwwLDEwLDIwLjc4NkwyOS40NTksMzQuMTY4QTQuMTg3LDQuMTg3LDAsMCwwLDMxLjc3MSwzNWgwYTIuMTA5LDIuMTA5LDAsMCwwLDEuNzkzLS45Miw0LjE0NCw0LjE0NCwwLDAsMCwuNjE2LTIuNDgzVjMuNDRDMzQuMTgxLDEuMzI5LDMzLjI3NC4wMTcsMzEuNzEuMDE3WiIgZmlsbD0iI2ZmZiIvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxNTQiIGRhdGEtbmFtZT0iR3JvdXAgMzQxNTQiPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDE1MyIgZGF0YS1uYW1lPSJHcm91cCAzNDE1MyI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMjIiIGRhdGEtbmFtZT0iUGF0aCAzMjIiIGQ9Ik0zLjc2NiwwLDIuODI5LDBBMiwyLDAsMCwwLC44MTksMS45MTVWMzMuMDc4QTEuOTgsMS45OCwwLDAsMCwyLjgsMzVoLjAzMmwuOTE4LS4wMDVhMS45ODgsMS45ODgsMCwwLDAsMS45OTItMS45MThWMS45MTdBMS45NywxLjk3LDAsMCwwLDMuNzY2LDBaIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" title="previous" alt="previous"/>
                </div>
                <div class="backward">
                    <img class="backward-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzEiIGRhdGEtbmFtZT0iTWFzayBHcm91cCAxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJyZXdpbmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxMjUiIGRhdGEtbmFtZT0iR3JvdXAgMzQxMjUiPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDEyNCIgZGF0YS1uYW1lPSJHcm91cCAzNDEyNCI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDAiIGRhdGEtbmFtZT0iUGF0aCAzMDAiIGQ9Ik0zMy4zNjIsNi41NDRhMi41OTQsMi41OTQsMCwwLDAtMS40NTMuNTRsLTEyLjAzNCw4LjNBMi41ODksMi41ODksMCwwLDAsMTguNjMsMTcuNWEyLjU5MSwyLjU5MSwwLDAsMCwxLjI0NiwyLjExMmwxMi4wMzQsOC4zYTIuNiwyLjYsMCwwLDAsMS40NTQuNTRjMS4wMTUsMCwxLjYzNy0uODc0LDEuNjM3LTIuMjI2VjguNzdDMzUsNy40MTgsMzQuMzc5LDYuNTQ0LDMzLjM2Miw2LjU0NFoiIGZpbGw9IiNmZmYiLz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTI3IiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTI3Ij4KICAgICAgICA8ZyBpZD0iR3JvdXBfMzQxMjYiIGRhdGEtbmFtZT0iR3JvdXAgMzQxMjYiPgogICAgICAgICAgPHBhdGggaWQ9IlBhdGhfMzAxIiBkYXRhLW5hbWU9IlBhdGggMzAxIiBkPSJNMTQuNzM1LDYuNTQ0YTIuNiwyLjYsMCwwLDAtMS40NTQuNTRsLTEyLjAzNCw4LjNBMi41ODksMi41ODksMCwwLDAsMCwxNy41YTIuNTkxLDIuNTkxLDAsMCwwLDEuMjQ3LDIuMTEybDEyLjAzNCw4LjNhMi42LDIuNiwwLDAsMCwxLjQ1NS41NGMxLjAxNiwwLDEuNjM4LS44NzQsMS42MzgtMi4yMjZWOC43NzFDMTYuMzc0LDcuNDE5LDE1Ljc1Miw2LjU0NCwxNC43MzUsNi41NDRaIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" title="backward" alt="backward"/>
                </div>
               <!-- <div class="play-pause">
                    <img class="play-pause-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzMiIGRhdGEtbmFtZT0iTWFzayBHcm91cCAzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJwbGF5XzRfIiBkYXRhLW5hbWU9InBsYXkgKDQpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMC4wNzUpIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTMyIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTMyIj4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDQiIGRhdGEtbmFtZT0iUGF0aCAzMDQiIGQ9Ik0yOC43MDYsMTQuMjUsOS4yNjUuOTQxQTQuNzQ2LDQuNzQ2LDAsMCwwLDYuNzEsMEM1LjI1NywwLDQuMzU3LDEuMTY3LDQuMzU3LDMuMTJWMzEuODg1YzAsMS45NTEuOSwzLjExNSwyLjM0OCwzLjExNWE0LjcwNiw0LjcwNiwwLDAsMCwyLjU0My0uOTQzTDI4LjcsMjAuNzQ4YTMuOTkxLDMuOTkxLDAsMCwwLDEuOTQ0LTMuMjVBMy45NzcsMy45NzcsMCwwLDAsMjguNzA2LDE0LjI1WiIgZmlsbD0iI2ZmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" title="play" alt="play"/>
                </div> -->
                <div class="forward">
                    <img class="forward-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzIiIGRhdGEtbmFtZT0iTWFzayBHcm91cCAyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJmYXN0LWZvcndhcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxMjkiIGRhdGEtbmFtZT0iR3JvdXAgMzQxMjkiPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDEyOCIgZGF0YS1uYW1lPSJHcm91cCAzNDEyOCI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDIiIGRhdGEtbmFtZT0iUGF0aCAzMDIiIGQ9Ik0xNS4yLDE1LjQsMy4yLDcuMTIzYTIuNzI2LDIuNzI2LDAsMCwwLTEuNS0uNTM4Qy42ODUsNi41ODUsMCw3LjQ1NSwwLDguOFYyNi4yYzAsMS4zNDcuNjg1LDIuMjE5LDEuNywyLjIxOWEyLjczMSwyLjczMSwwLDAsMCwxLjUtLjUzOGwxMi04LjI3MmEyLjU4MSwyLjU4MSwwLDAsMCwxLjIzOS0yLjFBMi41ODgsMi41ODgsMCwwLDAsMTUuMiwxNS40WiIgZmlsbD0iI2ZmZiIvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxMzEiIGRhdGEtbmFtZT0iR3JvdXAgMzQxMzEiPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDEzMCIgZGF0YS1uYW1lPSJHcm91cCAzNDEzMCI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDMiIGRhdGEtbmFtZT0iUGF0aCAzMDMiIGQ9Ik0zMy43NTcsMTUuNGwtMTItOC4yNzJhMi43MjgsMi43MjgsMCwwLDAtMS41LS41MzhjLTEuMDEyLDAtMS43Ljg3LTEuNywyLjIxOFYyNi4yYzAsMS4zNDcuNjg3LDIuMjE5LDEuNywyLjIxOWEyLjczNiwyLjczNiwwLDAsMCwxLjUtLjUzOGwxMi04LjI3M0EyLjU3OCwyLjU3OCwwLDAsMCwzNSwxNy41LDIuNTg5LDIuNTg5LDAsMCwwLDMzLjc1NywxNS40WiIgZmlsbD0iI2ZmZiIvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==" title="forward" alt="forward"/>
                </div>
                <div class="next">
                    <img class="next-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzEzIiBkYXRhLW5hbWU9Ik1hc2sgR3JvdXAgMTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMCAtMjAuMDc1KSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgPGcgaWQ9Im5leHRfM18iIGRhdGEtbmFtZT0ibmV4dCAoMykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxNDciIGRhdGEtbmFtZT0iR3JvdXAgMzQxNDciPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDE0NiIgZGF0YS1uYW1lPSJHcm91cCAzNDE0NiI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMTgiIGRhdGEtbmFtZT0iUGF0aCAzMTgiIGQ9Ik0yNS4yMjksMTQuMjQ0LDUuNzcxLjg2QTQuMjksNC4yOSwwLDAsMCwzLjQyOC4wMThjLTEuNTYzLDAtMi42LDEuMzExLTIuNiwzLjQyMVYzMS41OGE0LjE3OSw0LjE3OSwwLDAsMCwuNzQ0LDIuNDkxQTIuMzQ4LDIuMzQ4LDAsMCwwLDMuNDkxLDM1YTQuMiw0LjIsMCwwLDAsMi4zMS0uODQyTDI1LjI0MSwyMC43NzRhNCw0LDAsMCwwLDEuOTM1LTMuMjY2QTQuMDE0LDQuMDE0LDAsMCwwLDI1LjIyOSwxNC4yNDRaIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICAgIDxnIGlkPSJHcm91cF8zNDE1MCIgZGF0YS1uYW1lPSJHcm91cCAzNDE1MCI+CiAgICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTQ5IiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTQ5Ij4KICAgICAgICAgIDxnIGlkPSJHcm91cF8zNDE0OCIgZGF0YS1uYW1lPSJHcm91cCAzNDE0OCI+CiAgICAgICAgICAgIDxwYXRoIGlkPSJQYXRoXzMxOSIgZGF0YS1uYW1lPSJQYXRoIDMxOSIgZD0iTTMyLjM1MywzNC45OTFoMFoiIGZpbGw9IiNmZmYiLz4KICAgICAgICAgICAgPHBhdGggaWQ9IlBhdGhfMzIwIiBkYXRhLW5hbWU9IlBhdGggMzIwIiBkPSJNMzIuMywwbC0uOCwwYTEuOTYyLDEuOTYyLDAsMCwwLTEuOTY1LDEuOTEzVjMzLjA1OGExLjk1NiwxLjk1NiwwLDAsMCwxLjk1MSwxLjkyM2wuODU0LjAxMWExLjg3OSwxLjg3OSwwLDAsMCwxLjg0LTEuOTMyVjEuOTEzQTEuODg1LDEuODg1LDAsMCwwLDMyLjMsMFoiIGZpbGw9IiNmZmYiLz4KICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=" title="next" alt="next"/>
                </div>
                <div class="stop">
                    <img class="stop-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzQiIGRhdGEtbmFtZT0iTWFzayBHcm91cCA0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJzdG9wIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMC4wNzUpIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTMzIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTMzIj4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDUiIGRhdGEtbmFtZT0iUGF0aCAzMDUiIGQ9Ik0zMS4wNzgsMEg0LjE4MkE0LjE5Myw0LjE5MywwLDAsMCwwLDQuMDc2VjMwLjk3QTQuMTU0LDQuMTU0LDAsMCwwLDQuMTgyLDM1aDI2LjlBMy45MzEsMy45MzEsMCwwLDAsMzUsMzAuOTdWNC4wNzZBMy45NywzLjk3LDAsMCwwLDMxLjA3OCwwWiIgZmlsbD0iI2ZmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" title="stop" alt="stop"/>
                </div>
            </div>
          </div>
        </div>`;

      this.videos = this.videos.split(",");
      const videoContainer = this.shadowRoot.querySelector(".video-container");
      videoContainer.innerHTML = ""; // Clear existing video

      const videoElement = document.createElement("video");
      videoElement.controls = true;
      // videoElement.controlsList ="nofullscreen nodownload noremoteplayback noplaybackrate disablepictureinpicture foobar";
      videoElement.style.width = this.width;
      videoElement.style.height = this.height;
      videoElement.classList = "center";
      const sourceElement = document.createElement("source");
      sourceElement.src = this.videos[this.currentVideoIndex];
      // sourceElement.type = "video/mp4";
      videoElement.appendChild(sourceElement); // Append the source element to the video element
      videoElement.innerHTML += "Your browser does not support the video tag."; // Add a fallback text if the browser doesn't support the video tag
      videoContainer.appendChild(videoElement); // Append the video element to the video container

      this.shadowRoot.querySelector(".current-video-name").textContent = this.videos[this.currentVideoIndex].split("/").pop();
      this.prevButton = this.shadowRoot.querySelector(".previous");
      this.nextButton = this.shadowRoot.querySelector(".next");
      this.closeButton = this.shadowRoot.querySelector(".closed");
      this.replayButton = this.shadowRoot.querySelector(".replay");
      this.forwardButton = this.shadowRoot.querySelector(".forward");
      this.backwardButton = this.shadowRoot.querySelector(".backward");
      this.stopButton = this.shadowRoot.querySelector(".stop");

      this.prevButton.addEventListener("click", () => this.showPreviousVideo());
      this.nextButton.addEventListener("click", () => this.showNextVideo());
      this.closeButton.addEventListener("click", () => this.close());
      this.replayButton.addEventListener("click", () => this.replay());
      this.forwardButton.addEventListener("click", () => this.skipForward());
      this.backwardButton.addEventListener("click", () => this.skipBackward());
      this.stopButton.addEventListener("click", () => this.stopVideo());

      if (shadowRoot.querySelector("button")) { 
        shadowRoot.querySelector("button").addEventListener("click", this.close());
      }
      if (shadowRoot.querySelector(".overlay")) {
        shadowRoot.querySelector(".overlay").addEventListener("click", this.close());
      }

    }, 0);
  }

  showVideo() {
    this.stopVideo();
    
    this.shadowRoot.querySelector(".current-video-name").textContent =this.videos[this.currentVideoIndex].split("/").pop();
    const videoContainer = this.shadowRoot.querySelector(".video-container");
    videoContainer.innerHTML = ""; // Clear existing video
    const videoElement = document.createElement("video");
    videoElement.controls = true;
    if(this.hasAttribute("autoplay"))
      {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().then(() => {
          console.log('AudioContext resumed');
        });
      }
          videoElement.autoplay = true; // Enable autoplay
    }
    videoElement.currentTime =0;
    videoElement.style.width = this.width;
    videoElement.style.height = this.height;
    videoElement.classList = "center";
    const sourceElement = document.createElement("source");
    sourceElement.src = this.videos[this.currentVideoIndex];
    // sourceElement.type = "video/mp4";
    videoElement.appendChild(sourceElement);
    videoElement.innerHTML += "Your browser does not support the video tag.";
    videoContainer.appendChild(videoElement);
    this.dispatch("change",this.videos[this.currentVideoIndex]); // Dispatch array of selected files
  }

  playPauseVideo() {
    const videoElement = this.shadowRoot.querySelector("video");
    if (videoElement.paused) {
      videoElement.play(); // Play the video if it's paused
    } else {
      videoElement.pause(); // Pause the video if it's playing
    }
  }

  showPreviousVideo() {
    this.currentVideoIndex =
      (this.currentVideoIndex - 1 + this.videos.length) % this.videos.length;
    this.shadowRoot.querySelector("video").currentTime =0;
    this.showVideo();
  }

  showNextVideo() {
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
    this.shadowRoot.querySelector("video").currentTime =0;
    this.showVideo();
  }

  skipBackward() {
    const videoElement = this.shadowRoot.querySelector("video");
    videoElement.currentTime -= parseFloat(this.backwardSkipTime);
  }

  skipForward() {
    const videoElement = this.shadowRoot.querySelector("video");
    videoElement.currentTime += parseFloat(this.forwardSkipTime);
  }

  replay() {
    const videoElement = this.shadowRoot.querySelector("video");
    videoElement.currentTime = 0; // Replay the video from the beginning
    videoElement.play();
  }

  stopVideo() {
    const videoElement = this.shadowRoot.querySelector("video");
    videoElement.currentTime = 0;
    videoElement.pause(); // Pause the video playback
  }

  dispatch(event,arg) {
    this.dispatchEvent(
      new CustomEvent("tVideoGallery", {
        bubbles: true,
        detail: {
          version: "2.3.0",
          method: this.getAttribute("callback"),
          selectedVideo: arg,
          videos: this.videos,
        },
      })
    );
  }

  get open() {
    return this.hasAttribute("open");
  }

  set open(isOpen) {
    const { shadowRoot } = this;
    shadowRoot.querySelector(".wrapper").classList.toggle("open", isOpen);
    shadowRoot.querySelector(".wrapper").setAttribute("aria-hidden", !isOpen);
    if (isOpen) {
      this._wasFocused = document.activeElement;
      this.setAttribute("open", "");
      this.showVideo();
    } else {
      this.removeAttribute("open");
      this.stopVideo();
    }
  }

  close() {
    this.stopVideo();
    const videoElement = this.shadowRoot.querySelector("video");
    videoElement.currentTime = 0; // Replay the video from the beginning
    const { shadowRoot } = this;
    let wrapperBtn = shadowRoot.querySelector(".wrapper");
    wrapperBtn.classList.remove("open");
    wrapperBtn.setAttribute("aria-hidden", true);
  }

  disconnectedCallback() {
    this.stopVideo();
  }

  // Define the observed attributes
  static get observedAttributes() {
    return ["theme", "backward", "forward","width","height","videos","startindex"];
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
          case "backward":
            this.backwardSkipTime = parseFloat(newValue);
            const videoElementBackward = this.shadowRoot.querySelector("video");
            videoElementBackward.currentTime -= parseFloat(newValue);
            break;
          case "forward":
            this.forwardSkipTime = parseFloat(newValue);
            const videoElementForward = this.shadowRoot.querySelector("video");
            videoElementForward.currentTime += parseFloat(newValue);
            break;
          case "width":
              this.width=newValue;
              this.shadowRoot.querySelector(".center").style.width = this.width;
              break;
          case "height":
              this.height=newValue;
              this.shadowRoot.querySelector(".center").style.height = this.height;
              break;
          case "videos":
            this.videos=newValue.split(",");
            this.shadowRoot.querySelector(".center").src = this.videos[this.currentVideoIndex];
            break;
            case "startindex":
              this._render();
          default:
            break;
        }
      }
    }
  }

}

export default VideoGallery;
