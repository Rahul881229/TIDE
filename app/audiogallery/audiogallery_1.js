
import styles from "./audiogallery.scss";

class AudioGallery extends HTMLElement {
  audios = [];
  currentAudioIndex = 0;
  // Properties to store skip time values
  backwardSkipTime = 5; // Default value: 5 seconds
  forwardSkipTime = 5; // Default value: 5 seconds

  playing = false;
  volume = 0.4;
  prevVolume = 0.4;
  initialized = false;
  barWidth = 6;
  barGap = 3;
  bufferPercentage = 75;
  nonAudioAttributes = new Set([
    "title",
    "bar-width",
    "bar-gap",
    "buffer-percentage",
  ]);

  constructor() {
    super();
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
      let theme = this.hasAttribute("theme")
        ? this.getAttribute("theme")
        : "dark";

      this.audios = this.hasAttribute("audios")
        ? this.getAttribute("audios").split(",")
        : [];

      this.backwardSkipTime = this.hasAttribute("backward")
        ? this.getAttribute("backward")
        : this.backwardSkipTime;

      this.forwardSkipTime = this.hasAttribute("forward")
        ? this.getAttribute("forward")
        : this.forwardSkipTime;

      this.width = this.getAttribute("width")
        ? this.getAttribute("width")
        : "";

      this.height = this.getAttribute("height")
        ? this.getAttribute("height")
        : "";



        const startIndex = this.hasAttribute("startindex")
        ? parseInt(this.getAttribute("startindex"), 10)
        : 0; // Default to 0 if not provided
    
      // Ensure the startIndex is within the bounds of the audios array
      if (this.audios.length > 0) {
        // If startIndex is greater than the length of the audios array
        if (startIndex >= this.audios.length) {
          this.currentAudioIndex = this.audios.length - 1; // Set to the last index
        } else if (startIndex < 0) {
          this.currentAudioIndex = 0; // Set to the first index if negative
        } else {
          this.currentAudioIndex = startIndex; // Valid index
        }
      }


      const { shadowRoot } = this;

      shadowRoot.innerHTML = `
        <style> ${styles.toString()} </style>
        <div class="wrapper" style="z-index:1">
          <div class="overlay"></div>
          <div class="audio-dialog ${theme}" role="audio-dialog" style="padding: 20px; width:570px ; height:380px;" aria-labelledby="title" aria-describedby="content">
            <div class="header">
              <div class="title">Audio Gallery</div>
              <div class="current-audio-name"></div>
              <div class="closed">
                <img class="close-btn" src="data:image/png;base64,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" title="close" alt="close"/>
              </div>
            </div>
            <hr>
            <div class="content">
              <audio style="display: none" preload ></audio>
              <div class="visualizer-container" >
                <canvas class="visualizer" style="width: 100%; height: 260px"></canvas>
              </div>
              <div class="progress-container">
                <span class="current-time">0:00</span>
                <input type="range" max="100" value="0" class="progress-bar">
                <span class="duration">0:00</span>
              </div>

            </div>
            <hr>
            <div class="controls">
                <div class="replay">
                  <img class="replay-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDAiIGhlaWdodD0iMzguNDYyIiB2aWV3Qm94PSIwIDAgNDAgMzguNDYyIj4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcC1wYXRoIj4KICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZV80MiIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgNDIiIHdpZHRoPSIxMi4xNjkiIGhlaWdodD0iMTUuNDE0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC4wNzcgLTEuNTM4KSIgZmlsbD0iI2ZmZiIvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+CiAgPGcgaWQ9Ikdyb3VwXzM0MTQyIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTQyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjg5OCAtMTI0NCkiPgogICAgPGcgaWQ9InJlZnJlc2hfM18iIGRhdGEtbmFtZT0icmVmcmVzaCAoMykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI4OTggMTI0NCkiPgogICAgICA8cGF0aCBpZD0iUGF0aF8zMTMiIGRhdGEtbmFtZT0iUGF0aCAzMTMiIGQ9Ik01LDI0LjAxOEExOS4yMTgsMTkuMjE4LDAsMCwxLDM3LjY2LDEwLjQ4M0wzOS44NDEsOC4zYS43NjkuNzY5LDAsMCwxLDEuMjgzLjMzMkw0NC4yLDE5LjRhLjc0Ljc0LDAsMCwxLC4wMy4yMTIuNzcxLjc3MSwwLDAsMS0uOTgxLjc0TDMyLjQ4MSwxNy4yNzhhLjc2OS43NjksMCwwLDEtLjMzMi0xLjI4NGwyLjIzNy0yLjIzN0ExNC41ODcsMTQuNTg3LDAsMCwwLDkuNjE2LDI0LjIzMXEwLC41NzIuMDQ0LDEuMTMzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuMjMxIC01KSIgZmlsbD0iI2ZmZiIvPgogICAgICA8cGF0aCBpZD0iUGF0aF8zMTQiIGRhdGEtbmFtZT0iUGF0aCAzMTQiIGQ9Ik00My4yMjksMjkuODczQTE5LjIxOCwxOS4yMTgsMCwwLDEsMTAuNTcxLDQzLjQwOEw4LjM5LDQ1LjU4OWEuNzY5Ljc2OSwwLDAsMS0xLjI4My0uMzMyTDQuMDMsMzQuNDg3QS43NC43NCwwLDAsMSw0LDM0LjI3NWEuNzcxLjc3MSwwLDAsMSwuOTgxLS43NEwxNS43NSwzNi42MTJhLjc2OS43NjksMCwwLDEsLjMzMiwxLjI4NGwtMi4yMzcsMi4yMzdBMTQuNTg3LDE0LjU4NywwLDAsMCwzOC42MTUsMjkuNjZxMC0uNTcyLS4wNDQtMS4xMzNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNCAtMTAuNDI5KSIgZmlsbD0iI2ZmZiIvPgogICAgPC9nPgogICAgPGcgaWQ9Ik1hc2tfR3JvdXBfOSIgZGF0YS1uYW1lPSJNYXNrIEdyb3VwIDkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI5MTEuOTkzIDEyNTcuMDYyKSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgICA8ZyBpZD0icGxheV80XyIgZGF0YS1uYW1lPSJwbGF5ICg0KSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS41NjIgLTAuMjkpIj4KICAgICAgICA8ZyBpZD0iR3JvdXBfMzQxNDEiIGRhdGEtbmFtZT0iR3JvdXAgMzQxNDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDApIj4KICAgICAgICAgIDxwYXRoIGlkPSJQYXRoXzMxNSIgZGF0YS1uYW1lPSJQYXRoIDMxNSIgZD0iTTEzLjE2OCw1LjE1Niw2LjEzMy4zNEExLjcxNywxLjcxNywwLDAsMCw1LjIwOSwwYy0uNTI2LDAtLjg1MS40MjItLjg1MSwxLjEyOVYxMS41MzhjMCwuNzA2LjMyNSwxLjEyNy44NSwxLjEyN2ExLjcsMS43LDAsMCwwLC45Mi0uMzQxbDcuMDM4LTQuODE2YTEuNDQ0LDEuNDQ0LDAsMCwwLC43LTEuMTc2QTEuNDM5LDEuNDM5LDAsMCwwLDEzLjE2OCw1LjE1NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00LjM1NykiIGZpbGw9IiNmZmYiLz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo="  title="replay" alt="replay"/>
                </div>   
                   <div class="stop">
                    <img class="stop-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzQiIGRhdGEtbmFtZT0iTWFzayBHcm91cCA0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJzdG9wIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMC4wNzUpIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTMzIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTMzIj4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDUiIGRhdGEtbmFtZT0iUGF0aCAzMDUiIGQ9Ik0zMS4wNzgsMEg0LjE4MkE0LjE5Myw0LjE5MywwLDAsMCwwLDQuMDc2VjMwLjk3QTQuMTU0LDQuMTU0LDAsMCwwLDQuMTgyLDM1aDI2LjlBMy45MzEsMy45MzEsMCwwLDAsMzUsMzAuOTdWNC4wNzZBMy45NywzLjk3LDAsMCwwLDMxLjA3OCwwWiIgZmlsbD0iI2ZmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" title="stop" alt="stop"/>
                </div>
                <div class="previous">
                    <img class="prev-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzE0IiBkYXRhLW5hbWU9Ik1hc2sgR3JvdXAgMTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMCAtMjAuMDc1KSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgPGcgaWQ9InByZXZpb3VzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMC4wNzUpIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTUyIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTUyIj4KICAgICAgICA8ZyBpZD0iR3JvdXBfMzQxNTEiIGRhdGEtbmFtZT0iR3JvdXAgMzQxNTEiPgogICAgICAgICAgPHBhdGggaWQ9IlBhdGhfMzIxIiBkYXRhLW5hbWU9IlBhdGggMzIxIiBkPSJNMzEuNzEuMDE3QTQuMTEsNC4xMSwwLDAsMCwyOS40My44Nkw5Ljk5MSwxNC4yNTFhNCw0LDAsMCwwLTEuOTMzLDMuMjY3QTQuMDE2LDQuMDE2LDAsMCwwLDEwLDIwLjc4NkwyOS40NTksMzQuMTY4QTQuMTg3LDQuMTg3LDAsMCwwLDMxLjc3MSwzNWgwYTIuMTA5LDIuMTA5LDAsMCwwLDEuNzkzLS45Miw0LjE0NCw0LjE0NCwwLDAsMCwuNjE2LTIuNDgzVjMuNDRDMzQuMTgxLDEuMzI5LDMzLjI3NC4wMTcsMzEuNzEuMDE3WiIgZmlsbD0iI2ZmZiIvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxNTQiIGRhdGEtbmFtZT0iR3JvdXAgMzQxNTQiPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDE1MyIgZGF0YS1uYW1lPSJHcm91cCAzNDE1MyI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMjIiIGRhdGEtbmFtZT0iUGF0aCAzMjIiIGQ9Ik0zLjc2NiwwLDIuODI5LDBBMiwyLDAsMCwwLC44MTksMS45MTVWMzMuMDc4QTEuOTgsMS45OCwwLDAsMCwyLjgsMzVoLjAzMmwuOTE4LS4wMDVhMS45ODgsMS45ODgsMCwwLDAsMS45OTItMS45MThWMS45MTdBMS45NywxLjk3LDAsMCwwLDMuNzY2LDBaIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" title="previous" alt="previous"/>
                </div>
                <div class="backward">
                    <img class="backward-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzEiIGRhdGEtbmFtZT0iTWFzayBHcm91cCAxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJyZXdpbmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxMjUiIGRhdGEtbmFtZT0iR3JvdXAgMzQxMjUiPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDEyNCIgZGF0YS1uYW1lPSJHcm91cCAzNDEyNCI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDAiIGRhdGEtbmFtZT0iUGF0aCAzMDAiIGQ9Ik0zMy4zNjIsNi41NDRhMi41OTQsMi41OTQsMCwwLDAtMS40NTMuNTRsLTEyLjAzNCw4LjNBMi41ODksMi41ODksMCwwLDAsMTguNjMsMTcuNWEyLjU5MSwyLjU5MSwwLDAsMCwxLjI0NiwyLjExMmwxMi4wMzQsOC4zYTIuNiwyLjYsMCwwLDAsMS40NTQuNTRjMS4wMTUsMCwxLjYzNy0uODc0LDEuNjM3LTIuMjI2VjguNzdDMzUsNy40MTgsMzQuMzc5LDYuNTQ0LDMzLjM2Miw2LjU0NFoiIGZpbGw9IiNmZmYiLz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTI3IiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTI3Ij4KICAgICAgICA8ZyBpZD0iR3JvdXBfMzQxMjYiIGRhdGEtbmFtZT0iR3JvdXAgMzQxMjYiPgogICAgICAgICAgPHBhdGggaWQ9IlBhdGhfMzAxIiBkYXRhLW5hbWU9IlBhdGggMzAxIiBkPSJNMTQuNzM1LDYuNTQ0YTIuNiwyLjYsMCwwLDAtMS40NTQuNTRsLTEyLjAzNCw4LjNBMi41ODksMi41ODksMCwwLDAsMCwxNy41YTIuNTkxLDIuNTkxLDAsMCwwLDEuMjQ3LDIuMTEybDEyLjAzNCw4LjNhMi42LDIuNiwwLDAsMCwxLjQ1NS41NGMxLjAxNiwwLDEuNjM4LS44NzQsMS42MzgtMi4yMjZWOC43NzFDMTYuMzc0LDcuNDE5LDE1Ljc1Miw2LjU0NCwxNC43MzUsNi41NDRaIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" title="backward" alt="backward"/>
                </div>
                <div class="play-pause">
                    <img class="play-pause-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzMiIGRhdGEtbmFtZT0iTWFzayBHcm91cCAzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJwbGF5XzRfIiBkYXRhLW5hbWU9InBsYXkgKDQpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMC4wNzUpIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTMyIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTMyIj4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDQiIGRhdGEtbmFtZT0iUGF0aCAzMDQiIGQ9Ik0yOC43MDYsMTQuMjUsOS4yNjUuOTQxQTQuNzQ2LDQuNzQ2LDAsMCwwLDYuNzEsMEM1LjI1NywwLDQuMzU3LDEuMTY3LDQuMzU3LDMuMTJWMzEuODg1YzAsMS45NTEuOSwzLjExNSwyLjM0OCwzLjExNWE0LjcwNiw0LjcwNiwwLDAsMCwyLjU0My0uOTQzTDI4LjcsMjAuNzQ4YTMuOTkxLDMuOTkxLDAsMCwwLDEuOTQ0LTMuMjVBMy45NzcsMy45NzcsMCwwLDAsMjguNzA2LDE0LjI1WiIgZmlsbD0iI2ZmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" title="play" alt="play"/>
                </div> 
                <div class="forward">
                    <img class="forward-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzIiIGRhdGEtbmFtZT0iTWFzayBHcm91cCAyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJmYXN0LWZvcndhcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxMjkiIGRhdGEtbmFtZT0iR3JvdXAgMzQxMjkiPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDEyOCIgZGF0YS1uYW1lPSJHcm91cCAzNDEyOCI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDIiIGRhdGEtbmFtZT0iUGF0aCAzMDIiIGQ9Ik0xNS4yLDE1LjQsMy4yLDcuMTIzYTIuNzI2LDIuNzI2LDAsMCwwLTEuNS0uNTM4Qy42ODUsNi41ODUsMCw3LjQ1NSwwLDguOFYyNi4yYzAsMS4zNDcuNjg1LDIuMjE5LDEuNywyLjIxOWEyLjczMSwyLjczMSwwLDAsMCwxLjUtLjUzOGwxMi04LjI3MmEyLjU4MSwyLjU4MSwwLDAsMCwxLjIzOS0yLjFBMi41ODgsMi41ODgsMCwwLDAsMTUuMiwxNS40WiIgZmlsbD0iI2ZmZiIvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxMzEiIGRhdGEtbmFtZT0iR3JvdXAgMzQxMzEiPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDEzMCIgZGF0YS1uYW1lPSJHcm91cCAzNDEzMCI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDMiIGRhdGEtbmFtZT0iUGF0aCAzMDMiIGQ9Ik0zMy43NTcsMTUuNGwtMTItOC4yNzJhMi43MjgsMi43MjgsMCwwLDAtMS41LS41MzhjLTEuMDEyLDAtMS43Ljg3LTEuNywyLjIxOFYyNi4yYzAsMS4zNDcuNjg3LDIuMjE5LDEuNywyLjIxOWEyLjczNiwyLjczNiwwLDAsMCwxLjUtLjUzOGwxMi04LjI3M0EyLjU3OCwyLjU3OCwwLDAsMCwzNSwxNy41LDIuNTg5LDIuNTg5LDAsMCwwLDMzLjc1NywxNS40WiIgZmlsbD0iI2ZmZiIvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==" title="forward" alt="forward"/>
                </div>
                <div class="next">
                    <img class="next-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzEzIiBkYXRhLW5hbWU9Ik1hc2sgR3JvdXAgMTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMCAtMjAuMDc1KSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgPGcgaWQ9Im5leHRfM18iIGRhdGEtbmFtZT0ibmV4dCAoMykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxNDciIGRhdGEtbmFtZT0iR3JvdXAgMzQxNDciPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDE0NiIgZGF0YS1uYW1lPSJHcm91cCAzNDE0NiI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMTgiIGRhdGEtbmFtZT0iUGF0aCAzMTgiIGQ9Ik0yNS4yMjksMTQuMjQ0LDUuNzcxLjg2QTQuMjksNC4yOSwwLDAsMCwzLjQyOC4wMThjLTEuNTYzLDAtMi42LDEuMzExLTIuNiwzLjQyMVYzMS41OGE0LjE3OSw0LjE3OSwwLDAsMCwuNzQ0LDIuNDkxQTIuMzQ4LDIuMzQ4LDAsMCwwLDMuNDkxLDM1YTQuMiw0LjIsMCwwLDAsMi4zMS0uODQyTDI1LjI0MSwyMC43NzRhNCw0LDAsMCwwLDEuOTM1LTMuMjY2QTQuMDE0LDQuMDE0LDAsMCwwLDI1LjIyOSwxNC4yNDRaIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICAgIDxnIGlkPSJHcm91cF8zNDE1MCIgZGF0YS1uYW1lPSJHcm91cCAzNDE1MCI+CiAgICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTQ5IiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTQ5Ij4KICAgICAgICAgIDxnIGlkPSJHcm91cF8zNDE0OCIgZGF0YS1uYW1lPSJHcm91cCAzNDE0OCI+CiAgICAgICAgICAgIDxwYXRoIGlkPSJQYXRoXzMxOSIgZGF0YS1uYW1lPSJQYXRoIDMxOSIgZD0iTTMyLjM1MywzNC45OTFoMFoiIGZpbGw9IiNmZmYiLz4KICAgICAgICAgICAgPHBhdGggaWQ9IlBhdGhfMzIwIiBkYXRhLW5hbWU9IlBhdGggMzIwIiBkPSJNMzIuMywwbC0uOCwwYTEuOTYyLDEuOTYyLDAsMCwwLTEuOTY1LDEuOTEzVjMzLjA1OGExLjk1NiwxLjk1NiwwLDAsMCwxLjk1MSwxLjkyM2wuODU0LjAxMWExLjg3OSwxLjg3OSwwLDAsMCwxLjg0LTEuOTMyVjEuOTEzQTEuODg1LDEuODg1LDAsMCwwLDMyLjMsMFoiIGZpbGw9IiNmZmYiLz4KICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=" title="next" alt="next"/>
                </div>
             
                <div class="volume-bar">
                
                 <div class="box" style="display:none">
                  <img class="img-btn" src="data:image/svg+xml;base64,
PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNS4yMzkiIGhlaWdodD0iMTMuNTQiIHZpZXdCb3g9IjAgMCAxNS4yMzkgMTMuNTQiPgogIDxnIGlkPSJ2b2x1bWVfM18iIGRhdGEtbmFtZT0idm9sdW1lICgzKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTggLTEyLjY4MikiPgogICAgPHBhdGggaWQ9IlBhdGhfMzI1IiBkYXRhLW5hbWU9IlBhdGggMzI1IiBkPSJNMjguMzgxLDI3LjYxLDI0LjQ0LDI0LjRWMTguNDE3bDMuOTQxLTMuMjExYS40MDkuNDA5LDAsMCwxLC42NjguMzE3djExLjc3QS40MDkuNDA5LDAsMCwxLDI4LjM4MSwyNy42MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMy40NTggLTEuOTkpIiBmaWxsPSIjZmZmIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8zMjYiIGRhdGEtbmFtZT0iUGF0aCAzMjYiIGQ9Ik02Ny4yMTksMTIuNzU4YS41NDQuNTQ0LDAsMSwwLS41NTUuOTM2LDYuNjg1LDYuNjg1LDAsMCwxLDAsMTEuNTE1LjU0NC41NDQsMCwwLDAsLjU1NS45MzYsNy43NzMsNy43NzMsMCwwLDAsMC0xMy4zODhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDcuODA0IDApIiBmaWxsPSIjZmZmIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8zMjciIGRhdGEtbmFtZT0iUGF0aCAzMjciIGQ9Ik01OC42NjksMzMuM2EuNTQ0LjU0NCwwLDAsMS0uMjUxLTEuMDI3LDQuMTk0LDQuMTk0LDAsMCwwLDAtNy40NTguNTQ0LjU0NCwwLDAsMSwuNS0uOTY2LDUuMjgyLDUuMjgyLDAsMCwxLDAsOS4zODlBLjU0LjU0LDAsMCwxLDU4LjY2OSwzMy4zWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQxLjAzMSAtOS4wODcpIiBmaWxsPSIjZmZmIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8zMjgiIGRhdGEtbmFtZT0iUGF0aCAzMjgiIGQ9Ik0xMC4xNjYsMzVIOS4wODhBMS4wODgsMS4wODgsMCwwLDAsOCwzNi4wODh2My4yNjVhMS4wODgsMS4wODgsMCwwLDAsMS4wODgsMS4wODhoMS4wNzhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0xOC4yNjkpIiBmaWxsPSIjZmZmIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8zMjkiIGRhdGEtbmFtZT0iUGF0aCAzMjkiIGQ9Ik01NC4zNDUsMzYuMTI0djUuMDM1YTIuNjQxLDIuNjQxLDAsMCwwLDAtNS4wMzVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzcuOTM3IC0xOS4xODkpIiBmaWxsPSIjZmZmIi8+CiAgPC9nPgo8L3N2Zz4K
" title="volumeup" alt="volumeup"/>
                                    <img class="img-btn" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNS4yMzkiIGhlaWdodD0iMTMuNTc1IiB2aWV3Qm94PSIwIDAgMTUuMjM5IDEzLjU3NSI+CiAgPGcgaWQ9Ikdyb3VwXzM0MTY0IiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTY0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzE2LjAxIC01NjEuMTk2KSI+CiAgICA8ZyBpZD0idm9sdW1lXzNfIiBkYXRhLW5hbWU9InZvbHVtZSAoMykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcxNi4wMSA1NjEuMTk2KSI+CiAgICAgIDxwYXRoIGlkPSJQYXRoXzMyNSIgZGF0YS1uYW1lPSJQYXRoIDMyNSIgZD0iTTI4LjY4OSwyOC41ODcsMjQuNDQsMjUuMTI1di02LjQ1bDQuMjQ5LTMuNDYyYS40NDEuNDQxLDAsMCwxLC43Mi4zNDJWMjguMjQ1YS40NDEuNDQxLDAsMCwxLS43Mi4zNDJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjEuMjI0IC0xNS4xMTMpIiBmaWxsPSIjZmZmIi8+CiAgICAgIDxwYXRoIGlkPSJQYXRoXzMyOCIgZGF0YS1uYW1lPSJQYXRoIDMyOCIgZD0iTTEwLjMzNSwzNUg5LjE3NEExLjE3NCwxLjE3NCwwLDAsMCw4LDM2LjE3NHYzLjUyMWExLjE3NCwxLjE3NCwwLDAsMCwxLjE3NCwxLjE3NGgxLjE2MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04IC0zMS4xMSkiIGZpbGw9IiNmZmYiLz4KICAgICAgPHBhdGggaWQ9ImNsb3NlXzdfIiBkYXRhLW5hbWU9ImNsb3NlICg3KSIgZD0iTTMuNTQ4LDIuNjY4LDUuMiwxLjAxN2EuNDY3LjQ2NywwLDAsMCwwLS42NmwtLjIyLS4yMmEuNDY3LjQ2NywwLDAsMC0uNjYsMGwtMS42NSwxLjY1TDEuMDE4LjEzN2EuNDY3LjQ2NywwLDAsMC0uNjYsMGwtLjIyLjIyYS40NjcuNDY3LDAsMCwwLDAsLjY2TDEuNzg4LDIuNjY4LjEzOCw0LjMxOGEuNDY3LjQ2NywwLDAsMCwwLC42NmwuMjIuMjJhLjQ2Ny40NjcsMCwwLDAsLjY2LDBMMi42NjgsMy41NDgsNC4zMTksNS4yYS40NjcuNDY3LDAsMCwwLC42NiwwbC4yMi0uMjJhLjQ2Ny40NjcsMCwwLDAsMC0uNjZabTAsMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS45MDMgNC4xMikiIGZpbGw9IiNmZmYiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=
" title="volumedown" alt="volumedown"/>

                </div>
                    <input type="range" min="0" max="2" step="0.01" value="${
                      this.volume
                    }" class="volume-field">
                   
                </div>
            </div>
          </div>
        </div>`;

      this.shadowRoot.querySelector(".current-audio-name").textContent =
        this.audios[this.currentAudioIndex].split("/").pop();
      this.audio = this.shadowRoot.querySelector("audio");
      this.prevButton = this.shadowRoot.querySelector(".previous");
      this.nextButton = this.shadowRoot.querySelector(".next");
      this.closeButton = this.shadowRoot.querySelector(".closed");
      this.playPauseBtn = this.shadowRoot.querySelector(".play-pause");
      this.forwardButton = this.shadowRoot.querySelector(".forward");
      this.backwardButton = this.shadowRoot.querySelector(".backward");
      this.stopButton = this.shadowRoot.querySelector(".stop");
      this.canvas = this.shadowRoot.querySelector("canvas");
      this.volumeBar = this.shadowRoot.querySelector(".volume-field");
      this.replayButton = this.shadowRoot.querySelector(".replay");

      this.progressContainer = this.shadowRoot.querySelector(
        ".progress-container"
      );
      this.currentTimeEl = this.progressContainer.children[0];
      this.progressBar = this.progressContainer.children[1];
      this.durationEl = this.progressContainer.children[2];

      this.prevButton.addEventListener("click", () => this.showPreviousAudio());
      this.nextButton.addEventListener("click", () => this.showNextAudio());
      this.closeButton.addEventListener("click", () => this.close());
      this.forwardButton.addEventListener("click", () => this.skipForward());
      this.backwardButton.addEventListener("click", () => this.skipBackward());
      this.stopButton.addEventListener("click", () => this.stopAudio());
      this.replayButton.addEventListener("click", () => this.replay());
      // this.shadowRoot.querySelector(".visualizer-container").style.width =
      //   this.width;
      // this.shadowRoot.querySelector(".visualizer-container").style.height =
      //   this.height;

      if (shadowRoot.querySelector("button")) {
        shadowRoot
          .querySelector("button")
          .addEventListener("click", this.close());
      }
      if (shadowRoot.querySelector(".overlay")) {
        shadowRoot
          .querySelector(".overlay")
          .addEventListener("click", this.close());
      }

      const volumeBar = this.shadowRoot.querySelector('.volume-bar');
const box = this.shadowRoot.querySelector('.box');

volumeBar.addEventListener('mouseenter', () => {
    box.style.display = 'flex'; // Show the box when hovering
});

volumeBar.addEventListener('mouseleave', () => {
    box.style.display = 'none'; // Hide the box when not hovering
});


      this.canvasCtx = this.canvas.getContext("2d");
      // support retina display on canvas for a more crispy/HD look
      const scale = window.devicePixelRatio;
      this.canvas.width = Math.floor(this.canvas.width * scale);
      this.canvas.height = Math.floor(this.canvas.height * scale);

      this.volumeBar.value = this.volume;

      // if rendering or re-rendering all audio attributes need to be reset
      for (let i = 0; i < this.attributes.length; i++) {
        const attr = this.attributes[i];
        this.updateAudioAttributes(attr.name, attr.value);
      }

      // this.audio.src = this.audios[this.currentAudioIndex];

      this.convertToBlobAndSetSource();

      this.attachEvents();

      this.initializeAudio();

    }, 0);
  }

  convertToBlobAndSetSource() {
    if (this.audios.length > 0) {
      const audioUrl = this.audios[this.currentAudioIndex];
  
      fetch(audioUrl)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          this.audio.src = blobUrl;
        })
        .catch(error => {
          console.error('Error fetching the audio file:', error);
        });
    }
  }

  initializeAudio() {
    if (this.initialized) return;

    this.initialized = true;

    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();
    this.analyserNode = this.audioCtx.createAnalyser();
    this.track = this.audioCtx.createMediaElementSource(this.audio);

    this.analyserNode.fftSize = 2048;
    this.bufferLength = this.analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.analyserNode.getByteFrequencyData(this.dataArray);

    this.track
      .connect(this.gainNode)
      .connect(this.analyserNode)
      .connect(this.audioCtx.destination);

    this.changeVolume();
  }

  updateFrequency() {
    if (!this.playing) return;

    this.analyserNode.getByteFrequencyData(this.dataArray);

    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasCtx.fillStyle = "rgba(0, 0, 0, 0)";
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const barCount =
      this.canvas.width / (this.barWidth + this.barGap) - this.barGap;
    const bufferSize = (this.bufferLength * this.bufferPercentage) / 100;
    let x = 0;

    // this is a loss representation of the frequency
    // some data are loss to fit the size of the canvas
    for (let i = 0; i < barCount; i++) {
      // get percentage of i value
      const iPerc = Math.round((i * 100) / barCount);
      // what the i percentage maps to in the frequency data
      const pos = Math.round((bufferSize * iPerc) / 100);
      const frequency = this.dataArray[pos];
      // frequency value in percentage
      const frequencyPerc = (frequency * 100) / 255;
      // frequency percentage value in pixel in relation to the canvas height
      const barHeight = (frequencyPerc * this.canvas.height) / 100;
      // flip the height so the bar is drawn from the bottom
      const y = this.canvas.height - barHeight;

      this.canvasCtx.fillStyle = `rgba(${frequency},150, 136)`;
      // this.canvasCtx.fillStyle = "#009688";
      this.canvasCtx.fillRect(x, y, this.barWidth, barHeight);

      x += this.barWidth + this.barGap;
    }

    requestAnimationFrame(this.updateFrequency.bind(this));
  }

  togglePlay() {
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }

    if (this.playing) {
      return this.audio.pause();
    }

    return this.audio.play();
  }

  attachEvents() {
    const playPauseButton = this.shadowRoot.querySelector(".play-pause-btn");

    this.volumeBar.parentNode.addEventListener(
      "click", (e) => {
        if (e.target === this.volumeBar.parentNode) {
          this.toggleMute();
        }
      }, false);

    this.playPauseBtn.addEventListener(
      "click", this.togglePlay.bind(this), false);

    this.volumeBar.addEventListener(
      "input", this.changeVolume.bind(this), false);

    this.progressBar.addEventListener(
      "input", (e) => this.seekTo(this.progressBar.value), false);

    this.audio.addEventListener("loadedmetadata", () => {
      this.progressBar.max = this.audio.duration;
      this.durationEl.textContent = this.getTimeString(this.audio.duration);
      this.updateAudioTime();
    });

    this.audio.addEventListener("error", (e) => {
      // this.titleElement.textContent = this.audio.error.message;
      this.playPauseBtn.disabled = true;
    });

    this.audio.addEventListener("timeupdate", () => {
      this.updateAudioTime(this.audio.currentTime);
    });

    this.audio.addEventListener(
      "ended",
      () => {
        this.playing = false;
        playPauseButton.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzMiIGRhdGEtbmFtZT0iTWFzayBHcm91cCAzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJwbGF5XzRfIiBkYXRhLW5hbWU9InBsYXkgKDQpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMC4wNzUpIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTMyIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTMyIj4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDQiIGRhdGEtbmFtZT0iUGF0aCAzMDQiIGQ9Ik0yOC43MDYsMTQuMjUsOS4yNjUuOTQxQTQuNzQ2LDQuNzQ2LDAsMCwwLDYuNzEsMEM1LjI1NywwLDQuMzU3LDEuMTY3LDQuMzU3LDMuMTJWMzEuODg1YzAsMS45NTEuOSwzLjExNSwyLjM0OCwzLjExNWE0LjcwNiw0LjcwNiwwLDAsMCwyLjU0My0uOTQzTDI4LjcsMjAuNzQ4YTMuOTkxLDMuOTkxLDAsMCwwLDEuOTQ0LTMuMjVBMy45NzcsMy45NzcsMCwwLDAsMjguNzA2LDE0LjI1WiIgZmlsbD0iI2ZmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K";
        playPauseButton.alt = "play";
        playPauseButton.title = "play";
        this.playPauseBtn.classList.remove("playing");
      },
      false
    );

    this.audio.addEventListener(
      "pause",
      () => {
        this.playing = false;
        playPauseButton.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzMiIGRhdGEtbmFtZT0iTWFzayBHcm91cCAzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJwbGF5XzRfIiBkYXRhLW5hbWU9InBsYXkgKDQpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMC4wNzUpIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTMyIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTMyIj4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDQiIGRhdGEtbmFtZT0iUGF0aCAzMDQiIGQ9Ik0yOC43MDYsMTQuMjUsOS4yNjUuOTQxQTQuNzQ2LDQuNzQ2LDAsMCwwLDYuNzEsMEM1LjI1NywwLDQuMzU3LDEuMTY3LDQuMzU3LDMuMTJWMzEuODg1YzAsMS45NTEuOSwzLjExNSwyLjM0OCwzLjExNWE0LjcwNiw0LjcwNiwwLDAsMCwyLjU0My0uOTQzTDI4LjcsMjAuNzQ4YTMuOTkxLDMuOTkxLDAsMCwwLDEuOTQ0LTMuMjVBMy45NzcsMy45NzcsMCwwLDAsMjguNzA2LDE0LjI1WiIgZmlsbD0iI2ZmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K";
        playPauseButton.alt = "play";
        playPauseButton.title = "play";
        this.playPauseBtn.classList.remove("playing");
      },
      false
    );

    this.audio.addEventListener(
      "play",
      () => {
        this.playing = true;
        playPauseButton.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzUiIGRhdGEtbmFtZT0iTWFzayBHcm91cCA1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJwYXVzZV8xXyIgZGF0YS1uYW1lPSJwYXVzZSAoMSkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiPgogICAgICA8ZyBpZD0iR3JvdXBfMzQxMzUiIGRhdGEtbmFtZT0iR3JvdXAgMzQxMzUiPgogICAgICAgIDxnIGlkPSJHcm91cF8zNDEzNCIgZGF0YS1uYW1lPSJHcm91cCAzNDEzNCI+CiAgICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDYiIGRhdGEtbmFtZT0iUGF0aCAzMDYiIGQ9Ik0xMi42MjgsMGwtLjg1My4wMThBMS45MzIsMS45MzIsMCwwLDAsOS44NDQsMS45MzJ2MzEuMThhMS45NzUsMS45NzUsMCwwLDAsMiwxLjg4OGguMDA2bC43NzgtLjAwNWExLjg1OSwxLjg1OSwwLDAsMCwxLjg1OS0xLjlWMS45MTVBMS44NzIsMS44NzIsMCwwLDAsMTIuNjI4LDBaIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICAgIDxnIGlkPSJHcm91cF8zNDEzNyIgZGF0YS1uYW1lPSJHcm91cCAzNDEzNyI+CiAgICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTM2IiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTM2Ij4KICAgICAgICAgIDxwYXRoIGlkPSJQYXRoXzMwNyIgZGF0YS1uYW1lPSJQYXRoIDMwNyIgZD0iTTIzLjMsMGwtLjg1OC4wMThhMS45MzUsMS45MzUsMCwwLDAtMS45MzYsMS45MTR2MzEuMThBMiwyLDAsMCwwLDIyLjUzNiwzNWguMDA2bC43NjctLjAwNWExLjg0OSwxLjg0OSwwLDAsMCwxLjg0OC0xLjlWMS45MTVBMS44NjMsMS44NjMsMCwwLDAsMjMuMywwWiIgZmlsbD0iI2ZmZiIvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==";
        playPauseButton.alt = "pause";
        playPauseButton.title = "pause";
        this.playPauseBtn.classList.add("playing");
        this.updateFrequency();
      },
      false
    );
  }

  getTimeString(time) {
    const secs = `${parseInt(`${time % 60}`, 10)}`.padStart(2, "0");
    const min = parseInt(`${(time / 60) % 60}`, 10);
    return `${min}:${secs}`;
  }

  changeVolume() {
    this.volume = Number(this.volumeBar.value);
    if (Number(this.volume) > 1) {
      this.volumeBar.parentNode.className = "volume-bar over";
      const volumeBarOver = this.shadowRoot.querySelector(".volume-bar.over");
      volumeBarOver.style.backgroundColor = "#404040";
      volumeBarOver.style.backgroundImage =
        "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzOC45NzkiIGhlaWdodD0iMzQuNjM0IiB2aWV3Qm94PSIwIDAgMzguOTc5IDM0LjYzNCI+CiAgPGcgaWQ9InZvbHVtZV8zXyIgZGF0YS1uYW1lPSJ2b2x1bWUgKDMpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOCAtMTIuNjgyKSI+CiAgICA8cGF0aCBpZD0iUGF0aF8zMjUiIGRhdGEtbmFtZT0iUGF0aCAzMjUiIGQ9Ik0zNC41MjEsNDcuMDgsMjQuNDQsMzguODY2di0xNS4zTDM0LjUyMSwxNS4zNWExLjA0NywxLjA0NywwLDAsMSwxLjcwOC44MTJWNDYuMjY5YTEuMDQ2LDEuMDQ2LDAsMCwxLTEuNzA3LjgxMVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04LjgxMSAtMS4zMDMpIiBmaWxsPSIjZmZmIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8zMjYiIGRhdGEtbmFtZT0iUGF0aCAzMjYiIGQ9Ik02OC41LDEyLjg3N2ExLjM5MiwxLjM5MiwwLDEsMC0xLjQxOSwyLjQsMTcuMSwxNy4xLDAsMCwxLC4wMDYsMjkuNDU1LDEuMzkyLDEuMzkyLDAsMCwwLDEuNDIxLDIuMzk0QTE5Ljg4NCwxOS44ODQsMCwwLDAsNjguNSwxMi44NzdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzEuMjk5IDApIiBmaWxsPSIjZmZmIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8zMjciIGRhdGEtbmFtZT0iUGF0aCAzMjciIGQ9Ik01OS41MTgsNDguMTE0YTEuMzkyLDEuMzkyLDAsMCwxLS42NDMtMi42MjcsMTAuNzI4LDEwLjcyOCwwLDAsMCwwLTE5LjA3NiwxLjM5MiwxLjM5MiwwLDAsMSwxLjI4My0yLjQ3LDEzLjUxMSwxMy41MTEsMCwwLDEsMCwyNC4wMTYsMS4zODIsMS4zODIsMCwwLDEtLjY0LjE1N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNi44NjQgLTUuOTUpIiBmaWxsPSIjZmZmIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8zMjgiIGRhdGEtbmFtZT0iUGF0aCAzMjgiIGQ9Ik0xMy41NDEsMzVIMTAuNzg0QTIuNzg0LDIuNzg0LDAsMCwwLDgsMzcuNzg0djguMzUzYTIuNzg0LDIuNzg0LDAsMCwwLDIuNzg0LDIuNzg0aDIuNzU2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMTEuOTYyKSIgZmlsbD0iI2ZmZiIvPgogICAgPHBhdGggaWQ9IlBhdGhfMzI5IiBkYXRhLW5hbWU9IlBhdGggMzI5IiBkPSJNNTQuMzQ1LDM2LjEyNFY0OWE2Ljc1Niw2Ljc1NiwwLDAsMCwwLTEyLjg3OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNC44MzkgLTEyLjU2NCkiIGZpbGw9IiNmZmYiLz4KICA8L2c+Cjwvc3ZnPgo=')";
      volumeBarOver.style.backgroundPosition = "50% center";
      volumeBarOver.style.backgroundSize = "500% 50%";
      // volumeBarOver.style.height = "23px";
      volumeBarOver.style.height = "26px";
      volumeBarOver.style.backgroundRepeat = "no-repeat";
    } else if (Number(this.volume) > 0) {
      this.volumeBar.parentNode.className = "volume-bar half";
      const volumeBarHalf = this.shadowRoot.querySelector(".volume-bar.half");
      volumeBarHalf.style.backgroundColor = "#404040";
      volumeBarHalf.style.backgroundImage =
        "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMi42MTEiIGhlaWdodD0iMzIuMjA0IiB2aWV3Qm94PSIwIDAgMzIuNjExIDMyLjIwNCI+CiAgPGcgaWQ9InZvbHVtZV8zXyIgZGF0YS1uYW1lPSJ2b2x1bWUgKDMpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOCAtMTMuODEpIj4KICAgIDxwYXRoIGlkPSJQYXRoXzMyNSIgZGF0YS1uYW1lPSJQYXRoIDMyNSIgZD0iTTM0LjUyMSw0Ny4wOCwyNC40NCwzOC44NjZ2LTE1LjNMMzQuNTIxLDE1LjM1YTEuMDQ3LDEuMDQ3LDAsMCwxLDEuNzA4LjgxMlY0Ni4yNjlhMS4wNDYsMS4wNDYsMCwwLDEtMS43MDcuODExWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTguODExIC0xLjMwMykiIGZpbGw9IiNmZmYiLz4KICAgIDxwYXRoIGlkPSJQYXRoXzMyNyIgZGF0YS1uYW1lPSJQYXRoIDMyNyIgZD0iTTU5LjUxOCw0OC4xMTRhMS4zOTIsMS4zOTIsMCwwLDEtLjY0My0yLjYyNywxMC43MjgsMTAuNzI4LDAsMCwwLDAtMTkuMDc2LDEuMzkyLDEuMzkyLDAsMCwxLDEuMjgzLTIuNDcsMTMuNTExLDEzLjUxMSwwLDAsMSwwLDI0LjAxNiwxLjM4MiwxLjM4MiwwLDAsMS0uNjQuMTU3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2Ljg2NCAtNS45NSkiIGZpbGw9IiNmZmYiLz4KICAgIDxwYXRoIGlkPSJQYXRoXzMyOCIgZGF0YS1uYW1lPSJQYXRoIDMyOCIgZD0iTTEzLjU0MSwzNUgxMC43ODRBMi43ODQsMi43ODQsMCwwLDAsOCwzNy43ODR2OC4zNTNhMi43ODQsMi43ODQsMCwwLDAsMi43ODQsMi43ODRoMi43NTZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0xMS45NjIpIiBmaWxsPSIjZmZmIi8+CiAgICA8cGF0aCBpZD0iUGF0aF8zMjkiIGRhdGEtbmFtZT0iUGF0aCAzMjkiIGQ9Ik01NC4zNDUsMzYuMTI0VjQ5YTYuNzU2LDYuNzU2LDAsMCwwLDAtMTIuODc5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI0LjgzOSAtMTIuNTY0KSIgZmlsbD0iI2ZmZiIvPgogIDwvZz4KPC9zdmc+Cg==')";
      volumeBarHalf.style.backgroundPosition = "50% center";
      volumeBarHalf.style.backgroundSize = "500% 50%";
      // volumeBarHalf.style.height = "23px";
      volumeBarHalf.style.height = "26px";
      volumeBarHalf.style.backgroundRepeat = "no-repeat";
    } else {
      this.volumeBar.parentNode.className = "volume-bar";
      const volumeBar = this.shadowRoot.querySelector(".volume-bar");
      volumeBar.style.backgroundColor = "#404040";
      volumeBar.style.backgroundImage =
        "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNi4xNTIiIGhlaWdodD0iMzIuMjA0IiB2aWV3Qm94PSIwIDAgMzYuMTUyIDMyLjIwNCI+CiAgPGcgaWQ9Ikdyb3VwXzM0MTY0IiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTY0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzE2LjAxIC01NjEuMTk2KSI+CiAgICA8ZyBpZD0idm9sdW1lXzNfIiBkYXRhLW5hbWU9InZvbHVtZSAoMykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcwOC4wMSA1NDcuMzg2KSI+CiAgICAgIDxwYXRoIGlkPSJQYXRoXzMyNSIgZGF0YS1uYW1lPSJQYXRoIDMyNSIgZD0iTTM0LjUyMSw0Ny4wOCwyNC40NCwzOC44NjZ2LTE1LjNMMzQuNTIxLDE1LjM1YTEuMDQ3LDEuMDQ3LDAsMCwxLDEuNzA4LjgxMlY0Ni4yNjlhMS4wNDYsMS4wNDYsMCwwLDEtMS43MDcuODExWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTguODExIC0xLjMwMykiIGZpbGw9IiNmZmYiLz4KICAgICAgPHBhdGggaWQ9IlBhdGhfMzI4IiBkYXRhLW5hbWU9IlBhdGggMzI4IiBkPSJNMTMuNTQxLDM1SDEwLjc4NEEyLjc4NCwyLjc4NCwwLDAsMCw4LDM3Ljc4NHY4LjM1M2EyLjc4NCwyLjc4NCwwLDAsMCwyLjc4NCwyLjc4NGgyLjc1NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTExLjk2MikiIGZpbGw9IiNmZmYiLz4KICAgICAgPHBhdGggaWQ9ImNsb3NlXzdfIiBkYXRhLW5hbWU9ImNsb3NlICg3KSIgZD0iTTguNDE3LDYuMzI5bDMuOTE2LTMuOTE2YTEuMTA3LDEuMTA3LDAsMCwwLDAtMS41NjZMMTEuODExLjMyNWExLjEwNywxLjEwNywwLDAsMC0xLjU2NiwwTDYuMzI5LDQuMjQxLDIuNDE0LjMyNGExLjEwNywxLjEwNywwLDAsMC0xLjU2NiwwTC4zMjUuODQ2YTEuMTA3LDEuMTA3LDAsMCwwLDAsMS41NjZMNC4yNDEsNi4zMjkuMzI2LDEwLjI0NGExLjEwNywxLjEwNywwLDAsMCwwLDEuNTY2bC41MjIuNTIyYTEuMTA3LDEuMTA3LDAsMCwwLDEuNTY2LDBMNi4zMjksOC40MTdsMy45MTYsMy45MTZhMS4xMDcsMS4xMDcsMCwwLDAsMS41NjYsMGwuNTIyLS41MjJhMS4xMDcsMS4xMDcsMCwwLDAsMC0xLjU2NlptMCwwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMS40OTQgMjMuNTg0KSIgZmlsbD0iI2ZmZiIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==')";
      volumeBar.style.backgroundPosition = "50% center";
      volumeBar.style.backgroundSize = "500% 50%";
      // volumeBar.style.height = "23px";
      volumeBar.style.height = "26px";
      volumeBar.style.backgroundRepeat = "no-repeat";
    }

    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  toggleMute(muted = null) {
    this.volumeBar.value = muted || this.volume === 0 ? this.prevVolume : 0;
    this.changeVolume();
  }

  seekTo(value) {
    this.audio.currentTime = value;
  }

  updateAudioTime() {
    this.progressBar.value = this.audio.currentTime;
    this.currentTimeEl.textContent = this.getTimeString(this.audio.currentTime);
  }

  skipBackward() {
    this.seekTo(Math.max(this.audio.currentTime - this.backwardSkipTime, 0));
  }


  
  skipForward() {
    this.seekTo(
      Math.min(
        this.audio.currentTime + parseFloat(this.forwardSkipTime),
        this.audio.duration
      )
    );
  }

  stopAudio() {
    const playPauseButton = this.shadowRoot.querySelector(".play-pause-btn");
    playPauseButton.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzMiIGRhdGEtbmFtZT0iTWFzayBHcm91cCAzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJwbGF5XzRfIiBkYXRhLW5hbWU9InBsYXkgKDQpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMC4wNzUpIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTMyIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTMyIj4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDQiIGRhdGEtbmFtZT0iUGF0aCAzMDQiIGQ9Ik0yOC43MDYsMTQuMjUsOS4yNjUuOTQxQTQuNzQ2LDQuNzQ2LDAsMCwwLDYuNzEsMEM1LjI1NywwLDQuMzU3LDEuMTY3LDQuMzU3LDMuMTJWMzEuODg1YzAsMS45NTEuOSwzLjExNSwyLjM0OCwzLjExNWE0LjcwNiw0LjcwNiwwLDAsMCwyLjU0My0uOTQzTDI4LjcsMjAuNzQ4YTMuOTkxLDMuOTkxLDAsMCwwLDEuOTQ0LTMuMjVBMy45NzcsMy45NzcsMCwwLDAsMjguNzA2LDE0LjI1WiIgZmlsbD0iI2ZmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K";
    playPauseButton.alt = "play";
    playPauseButton.title = "play";
    this.audio.currentTime = 0;
    this.updateAudioSource();
    this.audio.pause();
  }

  showPreviousAudio() {
    this.audio.pause();
    this.currentAudioIndex =
      (this.currentAudioIndex - 1 + this.audios.length) % this.audios.length;
    this.updateAudioSource();
  }

  showNextAudio() {
    this.audio.pause();
    this.currentAudioIndex = (this.currentAudioIndex + 1) % this.audios.length;
    this.updateAudioSource();
  }

  updateAudioSource() {
    const playPauseButton = this.shadowRoot.querySelector(".play-pause-btn");
    playPauseButton.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMzYiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDM2IiB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwIDIwLjA3NSkiIGZpbGw9IiNmZmYiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJNYXNrX0dyb3VwXzMiIGRhdGEtbmFtZT0iTWFzayBHcm91cCAzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgLTIwLjA3NSkiIGNsaXAtcGF0aD0idXJsKCNjbGlwLXBhdGgpIj4KICAgIDxnIGlkPSJwbGF5XzRfIiBkYXRhLW5hbWU9InBsYXkgKDQpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMC4wNzUpIj4KICAgICAgPGcgaWQ9Ikdyb3VwXzM0MTMyIiBkYXRhLW5hbWU9Ikdyb3VwIDM0MTMyIj4KICAgICAgICA8cGF0aCBpZD0iUGF0aF8zMDQiIGRhdGEtbmFtZT0iUGF0aCAzMDQiIGQ9Ik0yOC43MDYsMTQuMjUsOS4yNjUuOTQxQTQuNzQ2LDQuNzQ2LDAsMCwwLDYuNzEsMEM1LjI1NywwLDQuMzU3LDEuMTY3LDQuMzU3LDMuMTJWMzEuODg1YzAsMS45NTEuOSwzLjExNSwyLjM0OCwzLjExNWE0LjcwNiw0LjcwNiwwLDAsMCwyLjU0My0uOTQzTDI4LjcsMjAuNzQ4YTMuOTkxLDMuOTkxLDAsMCwwLDEuOTQ0LTMuMjVBMy45NzcsMy45NzcsMCwwLDAsMjguNzA2LDE0LjI1WiIgZmlsbD0iI2ZmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K";
    playPauseButton.alt = "play";
    playPauseButton.title = "play";
    if (this.audios.length > 0) {
      this.shadowRoot.querySelector(".current-audio-name").textContent =
        this.audios[this.currentAudioIndex].split("/").pop();
      this.playing = false;
      // this.audio.src = this.audios[this.currentAudioIndex];
      this.convertToBlobAndSetSource();
      this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.audio.load();
    }
  }

  replay() {
    this.audio.play();
    this.audio.currentTime = 0;
  }

  dispatch(event, arg) {
    this.dispatchEvent(
      new CustomEvent("tAudioGallery", {
        bubbles: true,
        detail: {
          version: "2.3.0",
          method: this.getAttribute("callback"),
          selectedAudio: arg,
          audios: this.audios,
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
      if (this.hasAttribute("playauto") && this.audio) {
        console.log("inside the set autoplay");
        this.audioCtx.resume().then(() => {
          this.audio.play();
        });
     }
     
    } else {
      this.removeAttribute("open");
    }
  }

  close() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.playing = false;
    const { shadowRoot } = this;
    let wrapperBtn = shadowRoot.querySelector(".wrapper");
    wrapperBtn.classList.remove("open");
    wrapperBtn.setAttribute("aria-hidden", true);
  }

  // Define the observed attributes
  static get observedAttributes() {
    return [
      "theme",
      "backward",
      "forward",
      "width",
      "height",
      "audios",
      "muted",
      "crossorigin",
      "loop",
      "preload",
      "autoplay",
      "title",
      "bar-width",
      "bar-gap",
      "buffer-percentage",
      "startindex"
    ];
  }

  // Handle changes to observed attributes
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      if (name && newValue) {
        switch (name) {
          case "theme":
            let labelTag = this.shadowRoot.querySelectorAll(".audio-dialog")[0];
            if (oldValue) {
              labelTag.classList.remove(oldValue);
            }
            labelTag.classList.add(newValue);
            break;
          case "backward":
            this.backwardSkipTime = parseFloat(newValue);
            this.seekTo(
              Math.max(this.audio.currentTime - this.backwardSkipTime, 0)
            );
            break;
          case "forward":
            this.forwardSkipTime = parseFloat(newValue);
            this.seekTo(
              Math.min(
                this.audio.currentTime + this.forwardSkipTime,
                this.audio.duration
              )
            );
            break;
          // case "width":
          //   this.width = newValue;
          //   this.shadowRoot.querySelector(".visualizer-container").style.width =
          //     this.width;
          //   break;
          case "height":
            this.height = newValue;
            this.shadowRoot.querySelector(
              ".visualizer-container"
            ).style.height = this.height;
            break;
          case "audios":
            this.audios = newValue.split(",");
            this.updateAudioSource();
          
            break;
          case "muted":
            this.toggleMute(Boolean(this.audio?.getAttribute("muted")));
            break;
          case "bar-width":
            this.barWidth = Number(newValue) || 3;
            break;
          case "bar-gap":
            this.barGap = Number(newValue) || 1;
            break;
          case "buffer-percentage":
            this.bufferPercentage = Number(newValue) || 75;
            break;
            case "startindex":
              this._render();
              break;
          default:
            break;
        }
        this.updateAudioAttributes(name, newValue);
      }
    }
  }

  updateAudioAttributes(name, value) {
    if (!this.audio || this.nonAudioAttributes.has(name)) return;
    // if the attribute was explicitly set on the audio-player tag
    // set it otherwise remove it
    if (this.attributes.getNamedItem(name)) {
      this.audio.setAttribute(name, value ?? "");
    } else {
      this.audio.removeAttribute(name);
    }
  }

  disconnectedCallback() {}
}

export default AudioGallery;
