class Advideo {
  constructor(root, mode) {
    /**
     * @param elems: TYPE Object. The root div of a video, concluding all components for one ad video.
     */
    if(root instanceof HTMLElement) {
      this.root = root;
    } else {
      this.root = document.getElementById(root);
      console.log(this.root);
    }

    if(mode !== "prod") {
      mode = "dev";
    }

    if(this.root.querySelector("#adVideo") instanceof HTMLElement) {
      this.video = this.root.querySelector("#adVideo");
    }

    if(this.root.querySelector("#postPic") instanceof HTMLElement) {
      this.postPic = this.root.querySelector("#postPic");
    }
    if(this.root.querySelector("#pauseBtn") instanceof HTMLElement) {
      this.pause = this.root.querySelector("#pauseBtn");
    }

    if(this.root.querySelector("#playBtn") instanceof HTMLElement) {
      this.play = this.root.querySelector("#playBtn");
    }

    if(this.root.querySelector("#closeBtn") instanceof HTMLElement) {
      this.close = this.root.querySelector("#closeBtn");
    }
    if(this.root.querySelector("#adVideo source") instanceof HTMLElement) {
      this.videoSource = this.root.querySelector("#adVideo source");
    }
    if(this.root.querySelector("#videoA") instanceof HTMLElement) {
      this.videoA = this.root.querySelector("#videoA");
    }

    this.clickToPause();
    this.clickToPlay();

    if(mode === "prod") {
      console.log("prod");
      this.dynamicGetHTMLData();
    }

  } 

  clickToPause() {
    this.pause.addEventListener("click", () => {
      this.video.pause();
      this.pause.style.display = "none";
      this.play.style.display = "block";
    }, false)
  }

  clickToPlay() {
    this.play.addEventListener("click",() => {
      this.video.play();
      this.play.style.display = "none";
      this.pause.style.display = "block";
    }, false);
  }

  dynamicGetHTMLData() {
    const pWin = window.parent;
    if(pWin && pWin.detailPage && pWin.videoPoster && pWin.sourceUrl && pWin.sourceType && pWin.detailPage && this.video && this.videoSource && this.postPic && this.videoA) {
      console.log('aaaaaaa');
      this.video.poster = pWin.videoPoster;
      this.videoSource.src = pWin.sourceUrl;
      this.videoSource.type = pWin.sourceType;
      this.videoA.href = pWin.detailPage;
      this.postPic.src = pWin.videoPoster;
    }
  }
}

export default Advideo;