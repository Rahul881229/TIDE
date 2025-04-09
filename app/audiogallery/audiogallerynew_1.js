import WaveSurfer from "wavesurfer.js";
import styles from "./audiogallerynew.scss";

class AudioGalleryNew extends HTMLElement {
  audios = [];
  currentAudioIndex = 0;
  analyser = null;
  frequencyDisplay = null;
  wavesurfer = null;
  //new Audio wave properties
  audioCtx = null;
  analyser = null;
  source = null;
  dataArray = null;
  bufferLength = null;
  canvas = null;
  canvasCtx = null;

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

      const { shadowRoot } = this;
      shadowRoot.innerHTML = `
        <style> ${styles.toString()} </style>
        <div class="wrapper">
          <div class="overlay"></div>
          <div class="dialog ${theme}" role="dialog" aria-labelledby="title" aria-describedby="content">
            <div class="header">
              <div class="title">Audio Gallery</div>
              <div class="closed">
                <img class="close-btn" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAACqFJREFUeF7tnbmy5EQWhv//BbAIHgE8HFwM2uIJaPYdZmFgdujZZ5qdC83erL3vSxC4eFwDFyycNrBxcAge4J+bN7IqVLdKJSmXk1JVKuJGR3SlTqbO+bJKpU+lJDo2Sf8DcLv/uwXAtwC+B/AFyd2u/evr+TMg6TYATwO4w//9COA7ADdIuvq1bmx7RdJdAP4LwP3bth3t6iD/4W93D5JeAPA8gJtbMuEmqavTysm6EgBJ9wC41jO110ke7tm2NkuYAUmuRq5WfbbDJK8fbLgEwMDiz+JdI3lvn1HUNmkyIOkqgKETbwmCBQACiz87oqsk70tzeDXKugxIugIgdMItQDAHILL4s/FeIXl/LV++DOyd8F0GEDvR5hDsA+BP+L5ONOzLJB9IFKuGaWRA0qW9M/tUE+yQOzGcAeCKv+5sf2ghLpF8cOhOtX17BiRdBJByYu2SPET/Pd993Uu9XST5UOqg2xhP0gUAOSbUUQdAis+UtrpUCCKJlXQeQK6J9KUD4AaAWyPHuW73CyQfzhh/Y0NnLr7L2w8OgJ8B3JQ5i+dJPpK5j40KL+ncXoFyT5xfHABfAbjbIHvnSD5q0M/ku5B0FoDFhNl1AOz4a8kWiTtL8jGLjqbah6QzAKwmyjEHgDNJ36yRCalzeYbk46mDbkI8SacBWE2QnwDcObsO4IzSG4ZJPE3yCcP+Rt+VpFMALCfGEZI7zUvBQ8xSioSeIvlkikBTjyHpJADLCTE3uAdlUIhhisn/SZJPxQSY+r6STgCwnAgL5naVDo4xTSH12FoIJH0OwHICLBnbthtCcl4dXAXJCZLulqat2QoUf6WpXXdLWErz1Kewn5P8VZ+GU28j6TN/D5/VobQa2lYA3MgyGKiuA/6M5K+7Gk35dUmfArAEfa2ZXQuAhyCXiWqr46ckfzPlIreNXdInACwB75RxnQAUguATkr/dJAgkfQzAEuxeEq4XAB6CnFpyVa0/JvnMJkAg6SMAlkD3Kr7LbW8APAQWhqpZ849I/m7KEEg6DsAS5EHmdRAAHgIrUzWr+3GSz04RAkkfArAEeLBxHQyAh8DSWLkuJweBpA8AWIIbZFqDAPAQWJor1+WHJJ+bwjtBgeIHG9ZgADwE1gbrA5K/HzMEkt4HYAlqlFmNAsBDYG2y3if5hzFCIOk9AJaARhvVaAA8BNZG6z2SfxwTBJLeBWAJZhKJlgSAQhC8S/JPY4BA0jsALIFMJs+SAeAhsNab75D8c0kIJL0NwBLEZMUffCGoT6ILmK63Sf6lz9hSt5F0DIAlgMmNadJ3gFmCCxivYyT/mrrA6+JJeguAJXhZTGkWAPzHgbX5MoNA0psALIHLZkizAeAhsDZgb5F0z8vJthUoflYzmhUAD4G1CXuTpLvNPflm/CMaN/7sRjQ7AB4CayO2Q/JISgIkud9NZAGrZZwmJtQEAA+BtRl7g+TfUkAg6XUASYHqGJeZ/DIDoBAEr5P8ewwEkl4DkASknuMwlV6mAHgIrDXpayT/0TP5C80kvQogCqCB/ZoWP8uFoD4HXMCYvUryn33G1riW8QqAIHCG9NNoW8R0mr8DNBJsbc5eIfmvPsWR9DKAQcD0ibumTTHDWQwA/3FgbdA6IZD0EoBeoEQWfbZ7UbNZFAAPgbVJe5nkv1cVr0DxixvN4gB4CKyN2ksk/9OEQNKLAFaCkWimHwxT3GQWOwlsmX3WZu1FkvvPR5R0FMACEJmKPgtbzGAePK5RvAM0TgytDZsrvNtyPCizjSEzadUH4lEB4GejNQR98pSqTXZZNXSgowPAQ2CtW4fmLaT96Io/qnOAgxktYN5Citp3n2yGsu8A2tqN8h2gcU5gbeBi87lq/+RmMuUgRw2A/ziwNnEp85vMSKYcVDPW6AHwEFgbuRT5jjaRKQbRFWMSAHgIrM1cV+7WvR5sIGM6Ddl3MgB4CKwNXUhOB5vHkE5S7TMpADwE1qZuSK47ZdOQYBZtJwfAiCFolUwWhQztY5IAeAiste26HE+y+O6AJguAh8Da4K2CYMkshs7GEvtNGgAPgbXJa9ZpbhRLFC9Fn5MHwEPglki3NHqu241YOb0CED6NKgDhuUu3Z4GbOepHQLryxUUqcBtXPQmMK1m6vQvcwFm/BqYrX1ykAvft9xnwJK8FTO4kcKTFnwFSLwX3mSqhbSRVGRSavJb9JvMOUOCHmjGprjo4JnsH9y3wE+0Uw683hKTIYoGHM6QY9ixGvSUsJpsFHssSM9y2fetNoSFZrbeFh2Rt+D6jPAks8Ci24Zkbvkf9YUifnBV4AmefYaVqMzoIRvUOUKD49cehqdCOjVPgwcv15+FjuSWswCPX6wMi/Iwt/hFQYLGF+oiYxtt1UQAKLLPSKWsKaObtfEhUgQWWOos/mxgFjON2PSauPihy5SnzdjwossCiisFmroCB3OxHxRZYSzfayBUwkaYQmJ0EFih+MhNXwEhu1uPiCyyhntzAFTCTm7FghKS6ZEz4ZdJpLxkjqS4aFV782Z7TXDRKUl02Lr74swjTWjauLhyZrvKNSNNYOLIuHZul+LOg4146VlJdPDpr/feDj3PxaEknADyZ//jnPRRfbKHhDqwXvUgGQZILQQWKX9SgrYK8gNk8SfKp2AkXDYCkkwCeiB3IgP2LmbOuMRYwnKdIRr3rRgEg6RSAx7sSk/D1IsZsyPgLmM7TJIMnYDAAkk4DeGxIciLbmkqSmLEWMJ5nSAZNxCAAJJ0B8GhMkgbuayZHBo6rtXkBCM6SHDwhBwMg6SyAR1IlqkecyRW/8e3AesHscyQHTcxBAEg6B+DhHkVL1cTEiKUabMu3g+MAnsnZx4HY50n2nqC9AZB0HsBDhgeS3YRZHUsBI3qBZK+J2gsASRcAPGiVMABZDZjhccy7KmBGe0HQCUCB4mczXyUK3+yzgCG9SHLtu/ZaACRdBPCAYeKyGC/D8Xd2VcCUXiLZ+u7dCoCkSwDu7zyidA2Sm650Q0sbqYAxvUxy5UReCYCkywDuS3vYa6MlkxuGY47qqoA5vUJyaUIvASDpCoB7o45u2M5JpMawLsfRugAEV0kuTOwFACRdBXDYMD1bW/zGxSJrjX6N5HyCzwGQdA3APYbFjzZZhmPN2lUBo3qd5P5E3wdA0gsA3DKtVluUwbIapGU/BczqEZI73Dvhuw3ANwBuNjrgYHNlNL5i3Rgb1p8A3OkA2AHwvNFRBxkro7GNohtj03rMAfAVgLsNjn6wqTIY0yi7MDSuuw6AnwHclDkTgwxV5rFMIryRef3FAXADwK0Zs9JLSmTsf7KhDQzsDw6AnFf9OmXEZKtjNPDMEHzpAMi15l4tfiJIMhrZo7PrAF8DuCvReF2YtQYqYT9bEyqDmd0leWgGgCu+gyDF1mqeUgTf5hiJDe0hkrvNS8HuMrC7HByzrTROMQHrvosZSHTOdpjkdRf5oAyKgWDJNNXi5clApLGdF38JAPcfkkIgWDBMeQ67Rm1mINDcLhR/JQABEMzNUi2RbQYGGtyl4rcC4CFwJ4ZuSfZ13w42YgVt27Kl7c2bXOdy2mTerl/q3v27tPW5K9hdJ7jd/90C4FsA3wP4wp1Fpj2cGi0kA97oPg3gDv/3I4Dv9u7pvEHS1a91+z9RJ3Nvpr2XggAAAABJRU5ErkJggg==" title="close" alt="close"/>
              </div>
            </div>
            <hr>
            <div class="content">
              <audio id="audio-player" controls></audio>
              <canvas id="waveform-canvas" width="600" height="200"></canvas>
            </div>
            <hr>
            <div class="controls">
                <div class="previous">
                    <img class="prev-btn" src="assets/images/Previous_Button.svg" title="previous" alt="previous"/>
                </div>
                <div class="backward">
                    <img class="backward-btn" src="assets/images/Backward_Button.svg" title="backward" alt="backward"/>
                </div>
                <div class="play-pause">
                    <img class="play-pause-btn" src="assets/images/Play_Button.svg" title="play" alt="play"/>
                </div>
                <div class="forward">
                    <img class="forward-btn" src="assets/images/Forward_Button.svg" title="forward" alt="forward"/>
                </div>
                <div class="stop">
                    <img class="stop-btn" src="assets/images/Stop_Button.svg" title="stop" alt="stop"/>
                </div>
                <div class="next">
                    <img class="next-btn" src="assets/images/Next_Button.svg" title="next" alt="next"/>
                </div>
            </div>
          </div>
        </div>`;

      // this.audios = this.audios.split(",");

      // Initialize WaveSurfer
      // this.wavesurfer = WaveSurfer.create({
      //   container: this.shadowRoot.querySelector(".audiowave"),
      //   waveColor: "#5df9de",
      //   progressColor: "#1e594f",
      //   height: 150,
      //   responsive: true,
      //   hideScrollbar: true,
      //   cursorColor: "#5df9de",
      //   cursorWidth: 2,
      //   barWidth: 1.5,
      //   barGap: 1.5,
      //   skipLength: 5,
      // });

      // Load audio
      // this.wavesurfer.load(this.audios[this.currentAudioIndex]);

      const imageContainer = this.shadowRoot.querySelector(".play-pause");
      imageContainer.innerHTML = ""; // Clear existing images
      const imageElement = document.createElement("img");
      imageElement.src = "assets/images/Play_Button.svg";
      imageElement.alt = "play";
      imageElement.title = "play";
      imageElement.classList = "play-pause-btn";
      imageContainer.appendChild(imageElement);

      // Handle click on WaveSurfer container to play/pause
      // this.shadowRoot.querySelector(".audiowave").addEventListener("click", () => {
      //     this.wavesurfer.playPause();
      //     console.log("inside constructor audio-wave");
      //     const imageContainer = this.shadowRoot.querySelector(".play-pause");
      //     imageContainer.innerHTML = ""; // Clear existing images
      //     const imageElement = document.createElement("img");
      //     if (this.wavesurfer.isPlaying()) {
      //       console.log("inside playing");
      //       imageElement.src = "assets/images/Pause_Button.svg";
      //       imageElement.alt = "pause";
      //       imageElement.title = "pause";
      //       imageElement.classList = "play-pause-btn";
      //     } else {
      //       imageElement.src = "assets/images/Play_Button.svg";
      //       imageElement.alt = "play";
      //       imageElement.title = "play";
      //       imageElement.classList = "play-pause-btn";
      //     }
      //     imageContainer.appendChild(imageElement);
      //   });

      this.prevButton = this.shadowRoot.querySelector(".previous");
      this.nextButton = this.shadowRoot.querySelector(".next");
      this.closeButton = this.shadowRoot.querySelector(".closed");
      this.playPauseButton = this.shadowRoot.querySelector(".play-pause");
      this.forwardButton = this.shadowRoot.querySelector(".forward");
      this.backwardButton = this.shadowRoot.querySelector(".backward");
      this.stopButton = this.shadowRoot.querySelector(".stop");
      const audioPlayer = shadowRoot.querySelector("#audio-player");
      const canvas = shadowRoot.querySelector("#waveform-canvas");

      this.prevButton.addEventListener("click", () => this.showPreviousAudio());
      this.nextButton.addEventListener("click", () => this.showNextAudio());
      this.closeButton.addEventListener("click", () => this.close());
      this.playPauseButton.addEventListener("click", () =>
        this.playPauseAudio()
      );
      this.forwardButton.addEventListener("click", () => this.skipForward());
      this.backwardButton.addEventListener("click", () => this.skipBackward());
      this.stopButton.addEventListener("click", () => this.stopAudio());

      // this.setupWaveSurferEvents();

      if (shadowRoot.querySelector("button")) {
        shadowRoot.querySelector("button").addEventListener("click", this.close());
      }

      if (shadowRoot.querySelector(".overlay")) {
        shadowRoot.querySelector(".overlay").addEventListener("click", this.close());
      }

      this.canvas = canvas;
      this.canvasCtx = canvas.getContext("2d");

      audioPlayer.src = this.audios[0];

      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioCtx.createAnalyser();

      this.setupAudioProcessing(audioPlayer);

    }, 0);
  }

  setupAudioProcessing(audioPlayer) {
    audioPlayer.addEventListener("play", () => {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      this.source = this.audioCtx.createMediaElementSource(audioPlayer);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      this.analyser.fftSize = 2048;
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);

      this.draw();
    });
  }

  draw() {
    requestAnimationFrame(this.draw.bind(this));

    this.analyser.getByteTimeDomainData(this.dataArray);

    this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeStyle = '#009688';

    this.canvasCtx.beginPath();

    var sliceWidth = this.canvas.width * 1.0 / this.bufferLength;
    var x = 0;

    for (var i = 0; i < this.bufferLength; i++) {
      var v = this.dataArray[i] / 128.0;
      var y = v * this.canvas.height / 2;

      if (i === 0) {
        this.canvasCtx.moveTo(x, y);
      } else {
        this.canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
    this.canvasCtx.stroke();
  }

  playPauseAudio() {
    console.log('inside playPauseAudio audio');
    this.wavesurfer.playPause(); // Handle play/pause functionality
    const imageContainer = this.shadowRoot.querySelector(".play-pause");
    imageContainer.innerHTML = ""; // Clear existing images
    const imageElement = document.createElement("img");
    if (this.wavesurfer.isPlaying()) {
      imageElement.src = "assets/images/Pause_Button.svg";
      imageElement.alt = "pause";
      imageElement.title = "pause";
      imageElement.classList = "play-pause-btn";
    } else {
      imageElement.src = "assets/images/Play_Button.svg";
      imageElement.alt = "play";
      imageElement.title = "play";
      imageElement.classList = "play-pause-btn";
    }
    imageContainer.appendChild(imageElement);
  }

  setupWaveSurferEvents() {
    this.wavesurfer.on("ready", () => {
      const duration = this.wavesurfer.getDuration();
      const durationElement = this.shadowRoot.querySelector(
        ".current-progress-time"
      );
      durationElement.textContent = `00:00 / ${this.formatTime(duration)}`;
    });

    this.wavesurfer.on("audioprocess", () => {
      const currentTime = this.wavesurfer.getCurrentTime();
      const duration = this.wavesurfer.getDuration();
      const durationElement = this.shadowRoot.querySelector(
        ".current-progress-time"
      );
      durationElement.textContent = `${this.formatTime(
        currentTime
      )} / ${this.formatTime(duration)}`;
    });
  }

  formatTime(time) {
    // Convert time to minutes and seconds
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    // Format minutes and seconds as MM:SS
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }

  skipBackward() {
    console.log('inside skipBackward audio');
    const skipAmount = 5; // Adjust the skip amount as needed
    const currentTime = this.wavesurfer.getCurrentTime();
    const newTime = Math.max(0, currentTime - skipAmount); // Ensure the new time is not negative
    this.wavesurfer.seekTo(newTime / this.wavesurfer.getDuration());
  }

  skipForward() {
    console.log('inside skipForward audio');
    const skipAmount = 5; // Adjust the skip amount as needed
    const currentTime = this.wavesurfer.getCurrentTime();
    const newTime = Math.min(
      this.wavesurfer.getDuration(),
      currentTime + skipAmount
    ); // Ensure the new time is not greater than the duration
    this.wavesurfer.seekTo(newTime / this.wavesurfer.getDuration());
  }

  stopAudio() {
    console.log('inside stopAudio audio');
    const imageContainer = this.shadowRoot.querySelector(".play-pause");
    imageContainer.innerHTML = ""; // Clear existing images
    const imageElement = document.createElement("img");
    imageElement.src = "assets/images/Play_Button.svg";
    imageElement.alt = "play";
    imageElement.title = "play";
    imageElement.classList = "play-pause-btn";
    imageContainer.appendChild(imageElement);
    this.wavesurfer.stop();
  }

  showPreviousAudio() {
    console.log('inside showPreviousAudio audio');
    this.currentAudioIndex =
      (this.currentAudioIndex - 1 + this.audios.length) % this.audios.length;
    this.wavesurfer.load(this.audios[this.currentAudioIndex]);
    this.showAudio();
  }

  showNextAudio() {
    console.log('inside showNextAudio audio');
    this.currentAudioIndex = (this.currentAudioIndex + 1) % this.audios.length;
    this.wavesurfer.load(this.audios[this.currentAudioIndex]);
    this.showAudio();
  }

  showAudio() {
    console.log('inside showAudio audio');
    this.wavesurfer.load(this.audios[this.currentAudioIndex]);
    this.dispatch("change", this.audios[this.currentAudioIndex]); // Dispatch array of selected files
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
    } else {
      this.removeAttribute("open");
    }
  }

  close() {
    const { shadowRoot } = this;
    let wrapperBtn = shadowRoot.querySelector(".wrapper");
    wrapperBtn.classList.remove("open");
    wrapperBtn.setAttribute("aria-hidden", true);
  }

  // Define the observed attributes
  static get observedAttributes() {
    return ["theme"];
  }

  // Handle changes to observed attributes
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      if (name && newValue) {
        console.log(
          "Inside attributeChangedCallback Audio Gallary  :",
          name,
          newValue,
          oldValue
        );
        switch (name) {
          case "theme":
            let labelTag = this.shadowRoot.querySelectorAll(".dialog")[0];
            let currentProgressTag = this.shadowRoot.querySelectorAll(
              ".current-progress-time"
            )[0];
            if (oldValue) {
              labelTag.classList.remove(oldValue);
              currentProgressTag.classList.remove(oldValue);
            }
            labelTag.classList.add(newValue);
            currentProgressTag.classList.add(newValue);
            break;
          default:
            break;
        }
      }
    }
  }

  disconnectedCallback() {
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }
  }
}

export default AudioGalleryNew;
